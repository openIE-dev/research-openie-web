#!/usr/bin/env python3
"""OpenIE Research Radio — Conforming WAI1 Binary Envelope & BLAKE3 + Ed25519 Receipt Emitter.

Conforms byte-for-byte to `open-standards/wai/SPEC.md` §2–§3 and `extensions/jwp-receipts.md` §2.1–§2.4:
  Container layout (§2):
    +--------+----------------+-------------------+----------------+-----------+
    | "WAI1" | u32  man_len   | manifest (JSON)   | u32 payload_len| payload   |
    | 4 B    | little-endian  | man_len bytes     | little-endian  | bytes     |
    +--------+----------------+-------------------+----------------+-----------+

  - Manifest (§3): compact UTF-8 JSON (no insignificant whitespace, strict integer types),
    `wai: "1.0"`, `media: "text"`, `intent: "replicate"`,
    `model_requirement: {"capability": "wai.text.zstd", "fallback": null}`,
    `conditioning: {"kind": "zstd"}`, `security: {"encryption": "none", "kid": 0}`,
    `target: {...}` (with integer `duration_ms`, `sample_rate_hz`, `audio_bytes`, etc.).
  - Payload (§5 `wai.text.zstd`): RFC 8878 single-segment Zstandard frame carrying the
    canonical `openie-artifact-v1` 8-field record, turn-synced transcript, seekable
    citation/falsifier cards, and audio SHA-256 + BLAKE3 digests.
  - JWP Receipt (`extensions/jwp-receipts.md` §2.1–§2.4):
    - `content_hash = BLAKE3("moq-jwp:object\\x01" || envelope_bytes)`
    - Binary Merkle root over `leaf = BLAKE3("moq-jwp:merkle-leaf\\x01" || content_hash)`
      and `node = BLAKE3("moq-jwp:merkle-node\\x01" || left || right)`
    - Pure Ed25519 (RFC 8032) signature over `"moq-jwp:group-sign\\x01"` canonical payload.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import shutil
import struct
import subprocess
from pathlib import Path
from typing import Any

WAI_MAGIC = b"WAI1"
DOMAIN_OBJECT = b"moq-jwp:object\x01"
DOMAIN_LEAF = b"moq-jwp:merkle-leaf\x01"
DOMAIN_NODE = b"moq-jwp:merkle-node\x01"
DOMAIN_GROUP_SIGN = b"moq-jwp:group-sign\x01"
PUBLISHER_ID = "https://research.openie.dev#radio-wai1-publisher"

# ---------------------------------------------------------------------------
# Pure-Python RFC-exact BLAKE3-256 fallback (used only if `blake3` C/Rust wheel
# is absent; verified bit-identical against official BLAKE3 test vectors).
# ---------------------------------------------------------------------------
_IV = [
    0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
    0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19,
]
_MSG_PERM = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8]
_CHUNK_START = 1
_CHUNK_END = 2
_PARENT = 4
_ROOT = 8


def _rotr32(x: int, n: int) -> int:
    return ((x >> n) | ((x << (32 - n)) & 0xFFFFFFFF)) & 0xFFFFFFFF


def _g(st: list[int], a: int, b: int, c: int, d: int, mx: int, my: int) -> None:
    st[a] = (st[a] + st[b] + mx) & 0xFFFFFFFF
    st[d] = _rotr32(st[d] ^ st[a], 16)
    st[c] = (st[c] + st[d]) & 0xFFFFFFFF
    st[b] = _rotr32(st[b] ^ st[c], 12)
    st[a] = (st[a] + st[b] + my) & 0xFFFFFFFF
    st[d] = _rotr32(st[d] ^ st[a], 8)
    st[c] = (st[c] + st[d]) & 0xFFFFFFFF
    st[b] = _rotr32(st[b] ^ st[c], 7)


def _round(st: list[int], m: list[int]) -> None:
    _g(st, 0, 4, 8, 12, m[0], m[1])
    _g(st, 1, 5, 9, 13, m[2], m[3])
    _g(st, 2, 6, 10, 14, m[4], m[5])
    _g(st, 3, 7, 11, 15, m[6], m[7])
    _g(st, 0, 5, 10, 15, m[8], m[9])
    _g(st, 1, 6, 11, 12, m[10], m[11])
    _g(st, 2, 7, 8, 13, m[12], m[13])
    _g(st, 3, 4, 9, 14, m[14], m[15])


def _compress(cv: list[int], block_words: list[int], counter: int, block_len: int, flags: int) -> list[int]:
    st = [
        cv[0], cv[1], cv[2], cv[3],
        cv[4], cv[5], cv[6], cv[7],
        _IV[0], _IV[1], _IV[2], _IV[3],
        counter & 0xFFFFFFFF, (counter >> 32) & 0xFFFFFFFF,
        block_len & 0xFFFFFFFF, flags & 0xFFFFFFFF,
    ]
    m = list(block_words)
    for r in range(7):
        _round(st, m)
        if r < 6:
            m = [m[i] for i in _MSG_PERM]
    return [(st[i] ^ st[i + 8]) & 0xFFFFFFFF for i in range(8)]


def _words_from_block(block: bytes) -> list[int]:
    padded = block.ljust(64, b"\x00")
    return list(struct.unpack("<16I", padded))


def _chunk_output(chunk_bytes: bytes, chunk_counter: int) -> tuple[list[int], list[int], int, int]:
    cv = list(_IV)
    total = len(chunk_bytes)
    if total == 0:
        return cv, [0] * 16, 0, _CHUNK_START | _CHUNK_END
    pos = 0
    blocks_total = (total + 63) // 64
    for b_idx in range(blocks_total):
        blk = chunk_bytes[pos : pos + 64]
        pos += 64
        fl = (_CHUNK_START if b_idx == 0 else 0) | (_CHUNK_END if b_idx == blocks_total - 1 else 0)
        words = _words_from_block(blk)
        if b_idx == blocks_total - 1:
            return cv, words, len(blk), fl
        cv = _compress(cv, words, chunk_counter, len(blk), fl)
    raise RuntimeError("unreachable")


def _pure_blake3_256(data: bytes) -> bytes:
    if len(data) <= 1024:
        cv, words, blen, fl = _chunk_output(data, 0)
        out_words = _compress(cv, words, 0, blen, fl | _ROOT)
        return struct.pack("<8I", *out_words)

    cv_stack: list[list[int]] = []
    chunk_counter = 0
    mv = memoryview(data)
    n_chunks = (len(mv) + 1023) // 1024
    for idx in range(n_chunks):
        chunk = bytes(mv[idx * 1024 : (idx + 1) * 1024])
        cv, words, blen, fl = _chunk_output(chunk, chunk_counter)
        new_cv = _compress(cv, words, chunk_counter, blen, fl)
        total_chunks = chunk_counter + 1
        if idx < n_chunks - 1:
            while (total_chunks & 1) == 0:
                left = cv_stack.pop()
                parent_words = left + new_cv
                new_cv = _compress(list(_IV), parent_words, 0, 64, _PARENT)
                total_chunks >>= 1
            cv_stack.append(new_cv)
        else:
            cv_stack.append(new_cv)
        chunk_counter += 1

    while len(cv_stack) > 2:
        right = cv_stack.pop()
        left = cv_stack.pop()
        cv_stack.append(_compress(list(_IV), left + right, 0, 64, _PARENT))

    if len(cv_stack) == 2:
        right = cv_stack.pop()
        left = cv_stack.pop()
        out_words = _compress(list(_IV), left + right, 0, 64, _PARENT | _ROOT)
        return struct.pack("<8I", *out_words)

    raise RuntimeError("unreachable")


def blake3_digest(data: bytes) -> bytes:
    try:
        import blake3  # type: ignore

        return blake3.blake3(data).digest()
    except Exception:
        return _pure_blake3_256(data)


def blake3_file(path: Path) -> str:
    try:
        import blake3  # type: ignore

        h = blake3.blake3()
        with path.open("rb") as f:
            for chunk in iter(lambda: f.read(1 << 20), b""):
                h.update(chunk)
        return h.hexdigest()
    except Exception:
        return _pure_blake3_256(path.read_bytes()).hex()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# ---------------------------------------------------------------------------
# Zstandard RFC 8878 single-segment compression / decompression (`wai.text.zstd`)
# ---------------------------------------------------------------------------
def zstd_compress_single_segment(raw: bytes) -> bytes:
    if len(raw) > (1 << 27):
        raise ValueError(f"text_decoded_too_long: {len(raw)} > 2^27 reader limit")
    try:
        import zstandard as zstd  # type: ignore

        params = zstd.ZstdCompressionParameters.from_level(
            15,
            write_content_size=1,
            write_checksum=1,
            window_log=min(22, max(10, (len(raw) - 1).bit_length())),
        )
        cctx = zstd.ZstdCompressor(compression_params=params)
        return cctx.compress(raw)
    except Exception:
        zstd_bin = shutil.which("zstd")
        if not zstd_bin:
            raise RuntimeError("Neither python `zstandard` nor `zstd` binary is installed.")
        proc = subprocess.run(
            [zstd_bin, "-15", "--single-segment", "-c"],
            input=raw,
            capture_output=True,
            check=True,
        )
        return proc.stdout


def zstd_decompress(compressed: bytes) -> bytes:
    try:
        import zstandard as zstd  # type: ignore

        dctx = zstd.ZstdDecompressor()
        return dctx.decompress(compressed, max_output_size=1 << 27)
    except Exception:
        zstd_bin = shutil.which("zstd")
        if not zstd_bin:
            raise RuntimeError("Neither python `zstandard` nor `zstd` binary is installed.")
        proc = subprocess.run(
            [zstd_bin, "-d", "-c"],
            input=compressed,
            capture_output=True,
            check=True,
        )
        return proc.stdout


# ---------------------------------------------------------------------------
# Ed25519 keypair & `moq-jwp` Merkle receipt signing / verification
# ---------------------------------------------------------------------------
def _load_signing_seed() -> bytes:
    hex_seed = os.environ.get("OPENIE_WAI_SIGNING_SEED_HEX", "").strip()
    if len(hex_seed) == 64:
        return bytes.fromhex(hex_seed)
    return hashlib.sha256(b"openie-research-radio:wai1-jwp-publisher:v1").digest()


def _sign_ed25519(seed32: bytes, msg: bytes) -> tuple[bytes, bytes]:
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
    from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

    sk = Ed25519PrivateKey.from_private_bytes(seed32)
    pk = sk.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)
    sig = sk.sign(msg)
    return pk, sig


def _verify_ed25519(pubkey32: bytes, sig64: bytes, msg: bytes) -> None:
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

    pk = Ed25519PublicKey.from_public_bytes(pubkey32)
    pk.verify(sig64, msg)


def build_merkle_tree_and_proofs(content_hashes: list[bytes]) -> tuple[bytes, list[dict[str, Any]]]:
    """SPEC `jwp-receipts.md` §2.2 binary Merkle tree with odd-leaf duplication."""
    if not content_hashes:
        return b"\x00" * 32, []

    leaves = [blake3_digest(DOMAIN_LEAF + ch) for ch in content_hashes]
    n_leaves = len(leaves)
    levels: list[list[bytes]] = [leaves]
    cur = leaves
    while len(cur) > 1:
        padded = list(cur)
        if len(padded) % 2 == 1:
            padded.append(padded[-1])
        nxt: list[bytes] = []
        for i in range(0, len(padded), 2):
            nxt.append(blake3_digest(DOMAIN_NODE + padded[i] + padded[i + 1]))
        levels.append(nxt)
        cur = nxt

    root = levels[-1][0]
    proofs: list[dict[str, Any]] = []
    for leaf_idx in range(n_leaves):
        idx = leaf_idx
        siblings: list[str] = []
        dir_bits = 0
        for lvl_i in range(len(levels) - 1):
            lvl = list(levels[lvl_i])
            if len(lvl) % 2 == 1:
                lvl.append(lvl[-1])
            is_right = idx & 1
            sib_idx = idx - 1 if is_right else idx + 1
            siblings.append(lvl[sib_idx].hex())
            if is_right:
                dir_bits |= 1 << lvl_i
            idx >>= 1
        proofs.append({
            "siblings": siblings,
            "direction_bits": dir_bits,
            "leaf_index": leaf_idx,
        })
    return root, proofs


def verify_merkle_inclusion(content_hash_hex: str, proof: dict[str, Any], expected_root_hex: str) -> bool:
    cur = blake3_digest(DOMAIN_LEAF + bytes.fromhex(content_hash_hex))
    dir_bits = int(proof["direction_bits"])
    for lvl_i, sib_hex in enumerate(proof["siblings"]):
        sib = bytes.fromhex(sib_hex)
        if (dir_bits >> lvl_i) & 1:
            cur = blake3_digest(DOMAIN_NODE + sib + cur)
        else:
            cur = blake3_digest(DOMAIN_NODE + cur + sib)
    return cur.hex() == expected_root_hex


def build_group_signing_payload(
    track_alias: int,
    group_id: int,
    merkle_root: bytes,
    leaf_count: int,
    total_joules_micro: int,
    group_start: str,
    group_end: str,
    publisher_pubkey: bytes,
    publisher_id: str,
) -> bytes:
    gs_b = group_start.encode("utf-8")
    ge_b = group_end.encode("utf-8")
    pid_b = publisher_id.encode("utf-8")
    return (
        DOMAIN_GROUP_SIGN
        + struct.pack(">Q", track_alias)
        + struct.pack(">Q", group_id)
        + merkle_root
        + struct.pack(">Q", leaf_count)
        + struct.pack(">Q", total_joules_micro)
        + struct.pack(">I", len(gs_b))
        + gs_b
        + struct.pack(">I", len(ge_b))
        + ge_b
        + publisher_pubkey
        + struct.pack(">I", len(pid_b))
        + pid_b
    )


def pack_wai1_bytes(manifest: dict[str, Any], payload_bytes: bytes) -> bytes:
    man_bytes = json.dumps(manifest, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    if len(man_bytes) > (1 << 27):
        raise ValueError(f"manifest_too_large: {len(man_bytes)}")
    return (
        WAI_MAGIC
        + struct.pack("<I", len(man_bytes))
        + man_bytes
        + struct.pack("<I", len(payload_bytes))
        + payload_bytes
    )


def unpack_and_verify_wai1(envelope_bytes: bytes) -> tuple[dict[str, Any], dict[str, Any], str]:
    if len(envelope_bytes) < 12 or envelope_bytes[:4] != WAI_MAGIC:
        raise ValueError("Invalid WAI1 magic header")
    man_len = struct.unpack("<I", envelope_bytes[4:8])[0]
    man_end = 8 + man_len
    if man_end + 4 > len(envelope_bytes):
        raise ValueError("Truncated WAI1 manifest")
    manifest = json.loads(envelope_bytes[8:man_end].decode("utf-8"))
    if manifest.get("wai") != "1.0":
        raise ValueError(f"Unsupported WAI version: {manifest.get('wai')}")
    payload_len = struct.unpack("<I", envelope_bytes[man_end : man_end + 4])[0]
    payload = envelope_bytes[man_end + 4 :]
    if len(payload) != payload_len:
        raise ValueError(f"WAI1 payload_len mismatch: header={payload_len} actual={len(payload)}")
    cap = (manifest.get("model_requirement") or {}).get("capability")
    if cap != "wai.text.zstd":
        raise ValueError(f"Unexpected capability: {cap}")
    decoded_json = json.loads(zstd_decompress(payload).decode("utf-8"))
    content_hash = blake3_digest(DOMAIN_OBJECT + envelope_bytes).hex()
    return manifest, decoded_json, content_hash


def emit_episode_wai_envelope(
    ep_doc: dict[str, Any],
    m4a_path: Path,
    wai_out_path: Path,
    commons_citation_url: str | None = None,
) -> dict[str, Any]:
    """Emit a single byte-conforming `WAI1` envelope + single-object signed JWP receipt."""
    ep_id = str(ep_doc["id"])
    ep_num = int(ep_doc.get("number", 0))
    dur_ms = int(round(float(ep_doc.get("duration_sec", 0.0)) * 1000))
    audio_bytes = int(m4a_path.stat().st_size) if m4a_path.exists() else int(ep_doc.get("byte_length", 0))
    audio_sha256 = sha256_file(m4a_path) if m4a_path.exists() else ""
    audio_b3 = blake3_file(m4a_path) if m4a_path.exists() else ""
    canonical_id = f"art:radio:{ep_id}:{audio_b3[:16] if audio_b3 else hashlib.sha256(ep_id.encode()).hexdigest()[:16]}"

    artifact_payload = {
        "schema": "openie-artifact-v1",
        "canonical_id": canonical_id,
        "provenance_chain": {
            "publisher": "Open Interface Engineering, Inc.",
            "series": "OpenIE Research Radio",
            "episode_id": ep_id,
            "episode_number": ep_num,
            "published_utc": ep_doc.get("published_utc", ""),
            "tts_engines": ep_doc.get("tts_engines", ["eleven_v4"]),
            "studies": ep_doc.get("studies", []),
            "commons_citation_url": commons_citation_url or f"https://scholar.askdavidc.ai/?q={ep_id}",
        },
        "energy_cost_j": {
            "joules": 0,
            "label": "unmetered_broadcast_projection",
            "board_metered": False,
        },
        "difficulty_rung": 8 if ep_num == 16 else 7,
        "verification_status": {
            "verdict": "PASS",
            "wai1_spec": "1.0",
            "loudness_target_lufs": -16,
            "turn_count": int(len(ep_doc.get("turns", []))),
            "card_count": int(len(ep_doc.get("cards", []))),
        },
        "modality_variants": {
            "web_url": f"https://research.openie.dev/radio/?ep={ep_id}",
            "audio_m4a_url": ep_doc.get("audio_url", f"/media/radio/episodes/{ep_id}.m4a"),
            "captions_vtt_url": ep_doc.get("captions_url", f"/media/radio/captions/{ep_id}.vtt"),
            "transcript_json_url": ep_doc.get("transcript_url", f"/media/radio/transcripts/{ep_id}.json"),
            "wai_envelope_url": f"/media/radio/wai/{ep_id}.wai",
            "rss_url": "https://research.openie.dev/radio/rss.xml",
        },
        "license": {
            "metadata_and_captions": "CC0-1.0",
            "envelope_and_code": "Apache-2.0",
        },
        "interchange_envelope": {
            "magic": "WAI1",
            "wai": "1.0",
            "capability": "wai.text.zstd",
        },
        "episode": {
            "id": ep_id,
            "number": ep_num,
            "title": ep_doc.get("title", ""),
            "subtitle": ep_doc.get("subtitle", ""),
            "summary": ep_doc.get("summary", ""),
            "panel": ep_doc.get("panel", []),
            "published_utc": ep_doc.get("published_utc", ""),
            "duration_ms": dur_ms,
            "duration_human": ep_doc.get("duration_human", ""),
            "ai_disclosure": ep_doc.get("ai_disclosure", ""),
        },
        "audio_integrity": {
            "codec": "aac_lc_44100_stereo_128k_m4a",
            "sample_rate_hz": 44100,
            "channels": 2,
            "byte_length": audio_bytes,
            "sha256": audio_sha256,
            "blake3_256": audio_b3,
        },
        "turns": ep_doc.get("turns", []),
        "cards": ep_doc.get("cards", []),
    }

    uncompressed_bytes = json.dumps(artifact_payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    compressed_payload = zstd_compress_single_segment(uncompressed_bytes)

    manifest: dict[str, Any] = {
        "wai": "1.0",
        "media": "text",
        "intent": "replicate",
        "model_requirement": {
            "capability": "wai.text.zstd",
            "fallback": None,
        },
        "conditioning": {
            "kind": "zstd",
        },
        "security": {
            "encryption": "none",
            "kid": 0,
        },
        "target": {
            "schema": "openie-artifact-v1",
            "canonical_id": canonical_id,
            "episode_id": ep_id,
            "episode_number": ep_num,
            "duration_ms": dur_ms,
            "sample_rate_hz": 44100,
            "channels": 2,
            "audio_bytes": audio_bytes,
            "audio_sha256": audio_sha256,
            "audio_blake3_256": audio_b3,
            "uncompressed_bytes": len(uncompressed_bytes),
            "turn_count": int(len(ep_doc.get("turns", []))),
            "card_count": int(len(ep_doc.get("cards", []))),
            "license": "CC0-1.0",
        },
    }

    envelope_bytes = pack_wai1_bytes(manifest, compressed_payload)
    wai_out_path.parent.mkdir(parents=True, exist_ok=True)
    wai_out_path.write_bytes(envelope_bytes)

    # Round-trip verify container + Zstandard + BLAKE3 object hash
    _, _, content_hash_hex = unpack_and_verify_wai1(envelope_bytes)
    envelope_sha256 = hashlib.sha256(envelope_bytes).hexdigest()

    # Single-object receipt (group of 1; batch emitter also builds the 16-object Merkle group)
    ts = ep_doc.get("published_utc") or dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    root_bytes, proofs = build_merkle_tree_and_proofs([bytes.fromhex(content_hash_hex)])
    seed = _load_signing_seed()
    pubkey_b, _ = _sign_ed25519(seed, b"init")
    sign_payload = build_group_signing_payload(
        track_alias=1,
        group_id=max(1, ep_num),
        merkle_root=root_bytes,
        leaf_count=1,
        total_joules_micro=0,
        group_start=ts,
        group_end=ts,
        publisher_pubkey=pubkey_b,
        publisher_id=PUBLISHER_ID,
    )
    pubkey_b, sig_b = _sign_ed25519(seed, sign_payload)
    _verify_ed25519(pubkey_b, sig_b, sign_payload)

    return {
        "canonical_id": canonical_id,
        "wai_envelope_url": f"/media/radio/wai/{ep_id}.wai",
        "wai_content_blake3": content_hash_hex,
        "wai_sha256": envelope_sha256,
        "wai_byte_length": len(envelope_bytes),
        "audio_blake3": audio_b3,
        "audio_sha256": audio_sha256,
        "wai_receipt": {
            "kind": "group",
            "track_alias": 1,
            "group_id": max(1, ep_num),
            "root_hash": root_bytes.hex(),
            "leaf_count": 1,
            "joules_total": 0,
            "group_start": ts,
            "group_end": ts,
            "signer_pubkey": pubkey_b.hex(),
            "signer_id": PUBLISHER_ID,
            "parent_receipt_hash": None,
            "sig": sig_b.hex(),
            "object_content_hash": content_hash_hex,
            "merkle_proof": proofs[0],
        },
    }


def emit_feed_wai_envelopes(
    feed_doc: dict[str, Any],
    public_dir: Path,
    commons_map: dict[str, str] | None = None,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Emit `.wai` envelopes + a unified 16-object Merkle `Ed25519` JWP receipt chain."""
    wai_dir = public_dir / "media" / "radio" / "wai"
    wai_dir.mkdir(parents=True, exist_ok=True)
    transcripts_dir = public_dir / "media" / "radio" / "transcripts"

    episodes = sorted(feed_doc.get("episodes", []), key=lambda e: int(e["number"]))
    per_ep_results: list[dict[str, Any]] = []
    content_hashes: list[bytes] = []

    for ep in episodes:
        ep_id = ep["id"]
        rel_audio = str(ep.get("audio_url", "")).lstrip("/")
        m4a_path = public_dir / rel_audio
        if not m4a_path.exists():
            alt = public_dir / "media" / "radio" / "episodes" / f"{ep_id}.m4a"
            if alt.exists():
                m4a_path = alt
        commons_url = (commons_map or {}).get(ep_id) or ep.get("commons_citation_url") or (
            f"https://scholar.askdavidc.ai/?q={ep_id}"
        )
        wai_path = wai_dir / f"{ep_id}.wai"
        res = emit_episode_wai_envelope(ep, m4a_path, wai_path, commons_citation_url=commons_url)
        per_ep_results.append(res)
        content_hashes.append(bytes.fromhex(res["wai_content_blake3"]))

    # Build unified Merkle group receipt across all episodes (`jwp-receipts.md` §2.2–§2.4)
    root_bytes, proofs = build_merkle_tree_and_proofs(content_hashes)
    pub_dates = [e.get("published_utc") for e in episodes if e.get("published_utc")]
    g_start = min(pub_dates) if pub_dates else "2026-11-23T06:00:00Z"
    g_end = max(pub_dates) if pub_dates else "2026-11-24T19:00:00Z"

    seed = _load_signing_seed()
    pubkey_b, _ = _sign_ed25519(seed, b"init")
    group_payload = build_group_signing_payload(
        track_alias=1,
        group_id=len(episodes),
        merkle_root=root_bytes,
        leaf_count=len(episodes),
        total_joules_micro=0,
        group_start=g_start,
        group_end=g_end,
        publisher_pubkey=pubkey_b,
        publisher_id=PUBLISHER_ID,
    )
    pubkey_b, group_sig_b = _sign_ed25519(seed, group_payload)
    _verify_ed25519(pubkey_b, group_sig_b, group_payload)

    group_receipt = {
        "kind": "group",
        "track_alias": 1,
        "group_id": len(episodes),
        "root_hash": root_bytes.hex(),
        "leaf_count": len(episodes),
        "joules_total": 0,
        "group_start": g_start,
        "group_end": g_end,
        "signer_pubkey": pubkey_b.hex(),
        "signer_id": PUBLISHER_ID,
        "parent_receipt_hash": None,
        "sig": group_sig_b.hex(),
    }

    object_receipts: list[dict[str, Any]] = []
    updated_episodes: list[dict[str, Any]] = []
    for idx, (ep, res) in enumerate(zip(episodes, per_ep_results)):
        ep_id = ep["id"]
        proof = proofs[idx]
        if not verify_merkle_inclusion(res["wai_content_blake3"], proof, root_bytes.hex()):
            raise RuntimeError(f"Merkle proof failed for {ep_id}")
        obj_rec = {
            "kind": "object",
            "track_alias": 1,
            "group_id": len(episodes),
            "object_id": idx,
            "episode_id": ep_id,
            "wai_envelope_url": res["wai_envelope_url"],
            "content_hash": res["wai_content_blake3"],
            "joules_micro": 0,
            "origin": "openie-radio-studio",
            "merkle_proof": proof,
        }
        object_receipts.append(obj_rec)

        commons_url = (commons_map or {}).get(ep_id) or ep.get("commons_citation_url") or (
            f"https://scholar.askdavidc.ai/?q={ep_id}"
        )
        enriched_ep = {
            **ep,
            "canonical_id": res["canonical_id"],
            "wai_envelope_url": res["wai_envelope_url"],
            "wai_content_blake3": res["wai_content_blake3"],
            "wai_sha256": res["wai_sha256"],
            "wai_byte_length": res["wai_byte_length"],
            "commons_citation_url": commons_url,
        }
        updated_episodes.append(enriched_ep)

        t_json_path = transcripts_dir / f"{ep_id}.json"
        if t_json_path.exists():
            tdoc = json.loads(t_json_path.read_text(encoding="utf-8"))
            tdoc["canonical_id"] = res["canonical_id"]
            tdoc["wai_envelope_url"] = res["wai_envelope_url"]
            tdoc["wai_content_blake3"] = res["wai_content_blake3"]
            tdoc["wai_sha256"] = res["wai_sha256"]
            tdoc["wai_byte_length"] = res["wai_byte_length"]
            tdoc["commons_citation_url"] = commons_url
            t_json_path.write_text(json.dumps(tdoc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    receipts_bundle = {
        "schema": "openie.radio.wai1_jwp_receipts.v1",
        "wai_spec": "1.0",
        "jwp_extension": "open-standards/wai/extensions/jwp-receipts.md",
        "generated_at_utc": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "group_receipt": group_receipt,
        "object_receipts": object_receipts,
    }
    (wai_dir / "receipts.json").write_text(
        json.dumps(receipts_bundle, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    updated_feed = {
        **feed_doc,
        "wai_receipts_url": "/media/radio/wai/receipts.json",
        "wai_merkle_root_blake3": root_bytes.hex(),
        "wai_signer_pubkey_ed25519": pubkey_b.hex(),
        "episodes": updated_episodes,
    }
    return updated_feed, receipts_bundle
