#!/usr/bin/env python3
"""OpenIE Research Radio — Flagship Ep 16 Studio Producer, 16-Episode WAI1 Packager & RSS Emitter.

Designed to run on the remote Linux studio host (`ElevenLabs eleven_v4` + `ffmpeg -16 LUFS` + `zstd`):
  1. Synthesizes `Ep 16` (`ep16-unsiloeing-planetary-wai-commons`: `Cecily`, `Marcus`, `Amara`, `Kwame`)
     strictly via `ElevenLabs eleven_v4` (`mp3_44100_192`) and masters `44.1 kHz` `128 kbps` Stereo AAC `.m4a` (`-16 LUFS`).
  2. Queries live `https://scholar.askdavidc.ai/api/ask` to resolve seekable Commons citation links for all 16 episodes.
  3. Emits byte-conforming `WAI1` (`open-standards/wai/SPEC.md` §2–§3) binary envelopes (`public/media/radio/wai/<ep_id>.wai`)
     and the unified 16-object `moq-jwp` `BLAKE3` Merkle + `Ed25519` receipt bundle (`public/media/radio/wai/receipts.json`).
  4. Updates `src/data/radio-feed.json` (`episode_count: 16`, with `wai_envelope_url` and `commons_citation_url` on every episode)
     and writes Podcast RSS 2.0 (`public/radio/rss.xml`).
"""

from __future__ import annotations

import argparse
import concurrent.futures as cf
import datetime as dt
import email.utils
import html
import json
import os
import shutil
import time
from pathlib import Path
from typing import Any

from commons_prior_art import commons_prior_art_check
from episodes_ep15_ep16 import EPISODE_16_SPEC
from personas import AI_DISCLOSURE, PERSONAS
from studio_synth import fmt_human_dur, load_radio_env, render_episode
from wai_envelope import emit_feed_wai_envelopes

BASE_URL = "https://research.openie.dev"


def _load_env_file(path_str: str) -> None:
    if not path_str:
        return
    p = Path(path_str)
    if not p.exists():
        return
    for ln in p.read_text(encoding="utf-8").splitlines():
        ln = ln.strip()
        if ln and not ln.startswith("#") and "=" in ln:
            k, v = ln.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _iso_to_rfc2822(iso_str: str) -> str:
    try:
        parsed = dt.datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
    except Exception:
        parsed = dt.datetime(2026, 11, 24, 19, 0, 0, tzinfo=dt.timezone.utc)
    return email.utils.format_datetime(parsed, usegmt=True)


def _fmt_itunes_dur(sec: float) -> str:
    s = max(0, int(round(sec)))
    hh = s // 3600
    mm = (s % 3600) // 60
    ss = s % 60
    return f"{hh:02d}:{mm:02d}:{ss:02d}" if hh > 0 else f"{mm:02d}:{ss:02d}"


def generate_rss_xml(feed: dict[str, Any]) -> str:
    episodes = sorted(feed.get("episodes", []), key=lambda e: int(e["number"]), reverse=True)
    channel_desc = html.escape(f"{feed['subtitle']} {feed['ai_disclosure']}")
    build_date = _iso_to_rfc2822(feed.get("generated_at_utc", "2026-11-24T19:00:00Z"))

    lines = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<rss version="2.0"',
        '  xmlns:atom="http://www.w3.org/2005/Atom"',
        '  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"',
        '  xmlns:podcast="https://podcastindex.org/namespace/1.0">',
        "  <channel>",
        f"    <title>{html.escape(feed['title'])}</title>",
        f"    <link>{BASE_URL}/radio/</link>",
        "    <language>en-us</language>",
        "    <copyright>Open Interface Engineering, Inc.</copyright>",
        f"    <lastBuildDate>{build_date}</lastBuildDate>",
        f'    <atom:link href="{BASE_URL}/radio/rss.xml" rel="self" type="application/rss+xml" />',
        f"    <description>{channel_desc}</description>",
        "    <itunes:author>Open Interface Engineering</itunes:author>",
        f"    <itunes:summary>{channel_desc}</itunes:summary>",
        "    <itunes:type>episodic</itunes:type>",
        "    <itunes:explicit>false</itunes:explicit>",
        "    <itunes:owner>",
        "      <itunes:name>Open Interface Engineering</itunes:name>",
        "      <itunes:email>research@openie.dev</itunes:email>",
        "    </itunes:owner>",
        '    <itunes:category text="Science" />',
        '    <itunes:category text="Technology" />',
    ]

    for ep in episodes:
        cast_str = ", ".join(ep.get("panel") or [])
        desc_raw = f"Roundtable Cast: {cast_str}. {ep['summary']} — {ep.get('ai_disclosure', feed['ai_disclosure'])}"
        desc_esc = html.escape(desc_raw, quote=True).replace("&#x27;", "&apos;")
        sub_esc = html.escape(ep.get("subtitle", ""), quote=True).replace("&#x27;", "&apos;")
        title_esc = html.escape(f"Ep. {ep['number']}: {ep['title']}", quote=True).replace("&#x27;", "&apos;")
        audio_abs = f"{BASE_URL}{ep['audio_url']}"
        vtt_abs = f"{BASE_URL}{ep['captions_url']}"
        wai_abs = f"{BASE_URL}{ep['wai_envelope_url']}" if ep.get("wai_envelope_url") else ""

        lines.extend([
            "    <item>",
            f'      <guid isPermaLink="false">openie-radio-{html.escape(ep["id"])}</guid>',
            f"      <title>{title_esc}</title>",
            f"      <link>{BASE_URL}/radio/#{html.escape(ep['id'])}</link>",
            f"      <pubDate>{_iso_to_rfc2822(ep.get('published_utc', ''))}</pubDate>",
            f"      <description>{desc_esc}</description>",
            f"      <itunes:subtitle>{sub_esc}</itunes:subtitle>",
            f"      <itunes:summary>{desc_esc}</itunes:summary>",
            "      <itunes:author>Open Interface Engineering</itunes:author>",
            f"      <itunes:episode>{int(ep['number'])}</itunes:episode>",
            "      <itunes:episodeType>full</itunes:episodeType>",
            "      <itunes:explicit>false</itunes:explicit>",
            f"      <itunes:duration>{_fmt_itunes_dur(float(ep['duration_sec']))}</itunes:duration>",
            f'      <enclosure url="{audio_abs}" length="{int(ep["byte_length"])}" type="audio/x-m4a" />',
            f'      <podcast:transcript url="{vtt_abs}" type="text/vtt" language="en" />',
        ])
        if wai_abs:
            lines.append(
                f'      <podcast:alternateEnclosure type="application/vnd.wai" length="{int(ep.get("wai_byte_length", 0))}" title="WAI1 Attested Transcript &amp; Metadata Envelope">'
                f'<podcast:source uri="{wai_abs}" />'
                f"</podcast:alternateEnclosure>"
            )
        lines.append("    </item>")

    lines.extend(["  </channel>", "</rss>", ""])
    return "\n".join(lines)


def _resolve_episode_commons_links(episodes: list[dict[str, Any]]) -> dict[str, str]:
    def _lookup(ep: dict[str, Any]) -> tuple[str, str]:
        eid = ep["id"]
        res = commons_prior_art_check(f"OpenIE Research Radio {eid} {ep.get('title', '')}", top=5)
        if res.get("hit_count", 0) > 0 and res.get("top_commons_permalink"):
            return eid, str(res["top_commons_permalink"])
        return eid, f"https://scholar.askdavidc.ai/?q={eid}"

    with cf.ThreadPoolExecutor(max_workers=8) as pool:
        return dict(pool.map(_lookup, episodes))


def main() -> None:
    ap = argparse.ArgumentParser(description="Synthesize Ep 16, emit 16 WAI1 envelopes, and update feed + RSS")
    ap.add_argument("--public-dir", type=Path, required=True, help="Path to public/ directory holding media/radio")
    ap.add_argument("--feed-in", type=Path, required=True, help="Existing src/data/radio-feed.json")
    ap.add_argument("--feed-out", type=Path, required=True, help="Output src/data/radio-feed.json")
    ap.add_argument("--rss-out", type=Path, required=True, help="Output public/radio/rss.xml")
    ap.add_argument("--work-dir", type=Path, required=True, help="Scratch directory for TTS cache and PCM mix")
    ap.add_argument("--env-file", default="", help="Optional temporary env file path")
    args = ap.parse_args()

    if args.env_file:
        _load_env_file(args.env_file)
    load_radio_env()

    if not os.environ.get("ELEVENLABS_API_KEY", "").strip():
        raise RuntimeError("ELEVENLABS_API_KEY is required to voice Ep 16 with ElevenLabs eleven_v4.")

    t0 = time.perf_counter()
    media_root = args.public_dir / "media" / "radio"
    tmp_dir = args.work_dir / "tmp_ep16"
    cache_dir = args.work_dir / "eleven_cache"

    meta = render_episode(EPISODE_16_SPEC, media_root, tmp_dir, cache_dir)
    if meta["tts_engines"] != ["eleven_v4"]:
        raise RuntimeError(f"Episode 16 did not render strictly with eleven_v4: {meta['tts_engines']}")

    ep_id = EPISODE_16_SPEC["id"]
    rendered_m4a = media_root / "episodes" / f"{ep_id}.m4a"
    top_m4a = media_root / f"{ep_id}.m4a"
    shutil.copy2(rendered_m4a, top_m4a)
    meta["audio_url"] = f"/media/radio/{ep_id}.m4a"

    transcript_path = media_root / "transcripts" / f"{ep_id}.json"
    full_doc = json.loads(transcript_path.read_text(encoding="utf-8"))
    full_doc["audio_url"] = meta["audio_url"]

    cards = full_doc.get("cards", [])
    citations = [c for c in cards if c.get("kind") != "falsifier"]
    falsifiers = [c for c in cards if c.get("kind") == "falsifier"]
    extra = {
        "desk": EPISODE_16_SPEC["desk"],
        "desk_domain": EPISODE_16_SPEC["desk_domain"],
        "desks": EPISODE_16_SPEC["desks"],
        "studies": EPISODE_16_SPEC["studies"],
        "hosts": meta["panel"],
        "duration_s": meta["duration_sec"],
        "citations": citations,
        "falsifiers": falsifiers,
    }
    enriched_transcript = {
        **meta,
        **extra,
        "personas": full_doc.get("personas", {nm: PERSONAS[nm] for nm in meta["panel"]}),
        "turns": full_doc["turns"],
        "cards": cards,
    }
    transcript_path.write_text(json.dumps(enriched_transcript, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    ep16_feed_entry = {
        **meta,
        **extra,
        "turns": full_doc["turns"],
        "cards": cards,
    }

    existing_feed = json.loads(args.feed_in.read_text(encoding="utf-8"))
    preserved = [ep for ep in existing_feed.get("episodes", []) if ep.get("id") != ep_id]
    merged_eps = sorted([*preserved, ep16_feed_entry], key=lambda x: int(x["number"]))
    if len(merged_eps) != 16:
        raise RuntimeError(f"Expected 16 total episodes, found {len(merged_eps)}")

    total_sec = round(sum(float(x["duration_sec"]) for x in merged_eps), 3)
    gen_utc = "2026-11-24T19:00:00Z"
    draft_feed = {
        **existing_feed,
        "schema": "openie.radio.feed.v2",
        "generated_at_utc": gen_utc,
        "ai_disclosure": AI_DISCLOSURE,
        "personas": PERSONAS,
        "episode_count": len(merged_eps),
        "total_duration_sec": total_sec,
        "total_duration_human": fmt_human_dur(total_sec),
        "episodes": merged_eps,
    }

    commons_links = _resolve_episode_commons_links(merged_eps)
    final_feed, receipts_bundle = emit_feed_wai_envelopes(draft_feed, args.public_dir, commons_map=commons_links)

    args.feed_out.parent.mkdir(parents=True, exist_ok=True)
    args.feed_out.write_text(json.dumps(final_feed, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    rss_xml = generate_rss_xml(final_feed)
    args.rss_out.parent.mkdir(parents=True, exist_ok=True)
    args.rss_out.write_text(rss_xml, encoding="utf-8")

    print(
        f"[OK] Ep 16 synthesized ({meta['duration_sec']}s / {meta['duration_human']}, {meta['byte_length']} B, "
        f"engines={meta['tts_engines']}) + {len(receipts_bundle['object_receipts'])} WAI1 envelopes sealed "
        f"(root={final_feed['wai_merkle_root_blake3'][:16]}…) in {round(time.perf_counter() - t0, 2)}s"
    )


if __name__ == "__main__":
    main()
