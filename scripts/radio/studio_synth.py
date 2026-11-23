#!/usr/bin/env python3
"""OpenIE Research Radio — Stage 4: ElevenLabs eleven_v4 + Edge-TTS Stereo Mastering Engine.

Primary engine: ElevenLabs `eleven_v4` (`mp3_44100_192`, 44.1 kHz studio voices) with
SHA-256 disk caching in `state/eleven_cache/` so re-runs cost zero extra characters.
Free fallback engine: Multicultural Microsoft `edge-tts` neural voices (`en-NG`, `en-IN`,
`en-IE`, `en-AU`, `en-SG`, `en-PH`, `en-GB`, `en-US`) when `ELEVENLABS_API_KEY` is unset.
Masters 44.1 kHz, 128 kbps Stereo AAC `.m4a` (`-af loudnorm=I=-16:TP=-1.5:LRA=11 +faststart`).
"""

from __future__ import annotations

import asyncio
import datetime as dt
import hashlib
import json
import math
import os
import shutil
import subprocess
import time
from pathlib import Path
from typing import Any

import numpy as np
import requests
import soundfile as sf

from personas import AI_DISCLOSURE, PERSONAS, to_spoken_english

SR = 44100
ELEVEN_MODEL = "eleven_v4"
ELEVEN_VOICE_SETTINGS = {
    "stability": 0.45,
    "similarity_boost": 0.78,
    "style": 0.28,
    "use_speaker_boost": True,
}


def load_radio_env() -> None:
    cfg_override = os.environ.get("OPENIE_RADIO_ENV_FILE")
    env_path = Path(cfg_override) if cfg_override else (Path.home() / ".config" / "openie-radio" / "env")
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k, v = k.strip(), v.strip().strip('"').strip("'")
        if k and k not in os.environ:
            os.environ[k] = v


def ensure_ffmpeg() -> tuple[str, str]:
    try:
        import static_ffmpeg

        static_ffmpeg.add_paths()
    except Exception:
        pass
    ff = shutil.which("ffmpeg")
    fp = shutil.which("ffprobe")
    if not ff or not fp:
        raise RuntimeError("ffmpeg and ffprobe are required for 44.1 kHz stereo .m4a mastering.")
    return ff, fp


def synth_stereo_chime(
    sr: int = SR,
    duration: float = 1.55,
    freqs: tuple[float, ...] = (349.23, 440.0, 523.25, 659.25, 783.99),
) -> np.ndarray:
    n = int(sr * duration)
    t = np.linspace(0.0, duration, n, endpoint=False)
    left = np.zeros(n, dtype=np.float32)
    right = np.zeros(n, dtype=np.float32)
    for idx, f in enumerate(freqs):
        onset = idx * 0.075
        mask = (t >= onset).astype(np.float32)
        tau = np.maximum(0.0, t - onset)
        env = mask * (1.0 - np.exp(-tau * 45.0)) * np.exp(-tau * 2.6)
        tone = (0.20 / len(freqs)) * env * np.sin(2.0 * math.pi * f * tau).astype(np.float32)
        pan_l = 0.85 + 0.15 * math.cos(idx * 0.9)
        pan_r = 0.85 + 0.15 * math.sin(idx * 0.9)
        left += pan_l * tone
        right += pan_r * tone
    return np.column_stack([left, right])


def fmt_vtt_ts(sec: float) -> str:
    ms_total = max(0, int(round(sec * 1000)))
    hh = ms_total // 3_600_000
    rem = ms_total % 3_600_000
    mm = rem // 60_000
    rem %= 60_000
    ss = rem // 1000
    ms = rem % 1000
    return f"{hh:02d}:{mm:02d}:{ss:02d}.{ms:03d}"


def fmt_human_dur(sec: float) -> str:
    s = int(round(sec))
    return f"{s // 60}:{s % 60:02d}"


async def _edge_tts_to_mp3(text: str, voice: str, out_mp3: Path) -> None:
    import edge_tts

    comm = edge_tts.Communicate(text, voice)
    await comm.save(str(out_mp3))


def fetch_or_cache_mp3(speaker: str, spoken_text: str, cache_dir: Path) -> tuple[Path, str]:
    load_radio_env()
    p_cfg = PERSONAS[speaker]
    api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    cache_dir.mkdir(parents=True, exist_ok=True)

    if api_key:
        key_hash = hashlib.sha256(f"{ELEVEN_MODEL}|{p_cfg['voice_id']}|{spoken_text}".encode("utf-8")).hexdigest()
        mp3_path = cache_dir / f"el_{speaker.lower()}_{key_hash[:28]}.mp3"
        if mp3_path.exists() and mp3_path.stat().st_size > 1024:
            return mp3_path, "eleven_v4"

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{p_cfg['voice_id']}?output_format=mp3_44100_192"
        headers = {"xi-api-key": api_key, "Content-Type": "application/json", "Accept": "audio/mpeg"}
        body = {"text": spoken_text, "model_id": ELEVEN_MODEL, "voice_settings": ELEVEN_VOICE_SETTINGS}

        last_err = ""
        for attempt in range(4):
            try:
                resp = requests.post(url, headers=headers, json=body, timeout=(8, 45))
                if resp.status_code == 200 and len(resp.content) > 1024:
                    tmp_p = mp3_path.with_suffix(".tmp")
                    tmp_p.write_bytes(resp.content)
                    tmp_p.replace(mp3_path)
                    return mp3_path, "eleven_v4"
                last_err = f"HTTP {resp.status_code}"
                if resp.status_code in (429, 500, 502, 503, 504):
                    time.sleep(1.8 * (attempt + 1))
                    continue
                break
            except Exception as exc:
                last_err = type(exc).__name__
                time.sleep(1.5 * (attempt + 1))
        print(f"[warn] ElevenLabs fallback to edge-tts for {speaker} ({last_err})")

    fb_voice = p_cfg["fallback_voice"]
    fb_hash = hashlib.sha256(f"edge_tts|{fb_voice}|{spoken_text}".encode("utf-8")).hexdigest()
    fb_mp3 = cache_dir / f"edge_{speaker.lower()}_{fb_hash[:28]}.mp3"
    if not fb_mp3.exists() or fb_mp3.stat().st_size <= 512:
        asyncio.run(_edge_tts_to_mp3(spoken_text, fb_voice, fb_mp3))
    return fb_mp3, f"edge-tts:{fb_voice}"


def decode_mp3_stereo(ffmpeg_bin: str, mp3_path: Path, pan: list[float]) -> np.ndarray:
    proc = subprocess.run(
        [
            ffmpeg_bin,
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(mp3_path),
            "-f",
            "f32le",
            "-acodec",
            "pcm_f32le",
            "-ar",
            str(SR),
            "-ac",
            "1",
            "pipe:1",
        ],
        capture_output=True,
        check=True,
    )
    mono = np.frombuffer(proc.stdout, dtype=np.float32).copy()
    nz = np.flatnonzero(np.abs(mono) > 0.0025)
    if len(nz) > 16:
        pad = int(0.035 * SR)
        a0 = max(0, int(nz[0]) - pad)
        a1 = min(len(mono), int(nz[-1]) + pad)
        mono = mono[a0:a1]
    gl, gr = float(pan[0]), float(pan[1])
    return np.column_stack([mono * gl, mono * gr])


def render_episode(
    ep_spec: dict[str, Any],
    media_root: Path,
    tmp_dir: Path,
    cache_dir: Path | None = None,
) -> dict[str, Any]:
    load_radio_env()
    ffmpeg_bin, ffprobe_bin = ensure_ffmpeg()
    ep_id = ep_spec["id"]
    if cache_dir is None:
        cache_dir = media_root.parent.parent / "eleven_cache"

    ep_audio_dir = media_root / "episodes"
    ep_vtt_dir = media_root / "captions"
    ep_json_dir = media_root / "transcripts"
    for d in (ep_audio_dir, ep_vtt_dir, ep_json_dir, tmp_dir, cache_dir):
        d.mkdir(parents=True, exist_ok=True)

    segments: list[np.ndarray] = []
    intro = synth_stereo_chime(sr=SR, duration=1.55)
    lead_pad = np.zeros((int(SR * 0.28), 2), dtype=np.float32)
    segments.extend([intro, lead_pad])
    cursor_samples = intro.shape[0] + lead_pad.shape[0]

    turns_out: list[dict[str, Any]] = []
    cards_out: list[dict[str, Any]] = []
    panel_names: list[str] = []
    engines_used: set[str] = set()

    raw_turns = ep_spec["turns"]
    for idx, turn in enumerate(raw_turns):
        speaker = turn["speaker"]
        if speaker not in panel_names:
            panel_names.append(speaker)
        p_cfg = PERSONAS[speaker]
        spoken_text = to_spoken_english(turn.get("tts_text") or turn["text"])
        mp3_clip, eng = fetch_or_cache_mp3(speaker, spoken_text, cache_dir)
        engines_used.add(eng)
        stereo_arr = decode_mp3_stereo(ffmpeg_bin, mp3_clip, p_cfg.get("pan", [1.0, 1.0]))

        start_sec = round(cursor_samples / SR, 3)
        segments.append(stereo_arr)
        cursor_samples += stereo_arr.shape[0]
        end_sec = round(cursor_samples / SR, 3)

        next_sp = raw_turns[idx + 1]["speaker"] if idx + 1 < len(raw_turns) else None
        next_grp = PERSONAS.get(next_sp or "", {}).get("group", "")
        gap_ms = int(turn.get("pause_ms") or (190 if next_grp == "skeptic" else 270))
        gap_samples = int(SR * (gap_ms / 1000.0))
        segments.append(np.zeros((gap_samples, 2), dtype=np.float32))
        cursor_samples += gap_samples

        turns_out.append({
            "turn_index": idx,
            "speaker": speaker,
            "role": p_cfg["title"],
            "group": p_cfg["group"],
            "color": p_cfg["color"],
            "start_sec": start_sec,
            "end_sec": end_sec,
            "text": turn["text"],
        })

        for c_idx, card in enumerate(turn.get("cards") or []):
            at_sec = round(min(end_sec - 0.2, start_sec + float(card.get("offset_sec", 0.8))), 3)
            cards_out.append({
                "id": f"{ep_id}-card-{idx:02d}-{c_idx}",
                "at_sec": max(start_sec, at_sec),
                "end_sec": end_sec,
                "turn_index": idx,
                "speaker": speaker,
                "kind": card["kind"],
                "badge": card["badge"],
                "title": card["title"],
                "detail": card["detail"],
                "href": card["href"],
            })

    outro = synth_stereo_chime(sr=SR, duration=1.25, freqs=(523.25, 659.25, 783.99, 1046.50))
    tail_pad = np.zeros((int(SR * 0.35), 2), dtype=np.float32)
    segments.extend([outro, tail_pad])

    full_audio = np.vstack(segments)
    raw_wav = tmp_dir / f"{ep_id}_raw_44k.wav"
    sf.write(str(raw_wav), full_audio, SR, subtype="PCM_16")

    m4a_path = ep_audio_dir / f"{ep_id}.m4a"
    subprocess.run(
        [
            ffmpeg_bin,
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(raw_wav),
            "-af",
            "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-ar",
            "44100",
            "-ac",
            "2",
            "-movflags",
            "+faststart",
            str(m4a_path),
        ],
        check=True,
    )
    raw_wav.unlink(missing_ok=True)

    probe = subprocess.run(
        [ffprobe_bin, "-v", "error", "-show_entries", "format=duration,size:stream=codec_name,sample_rate,channels", "-of", "json", str(m4a_path)],
        capture_output=True,
        text=True,
        check=True,
    )
    p_info = json.loads(probe.stdout)
    duration_sec = round(float((p_info.get("format") or {}).get("duration") or (full_audio.shape[0] / SR)), 3)
    byte_length = int((p_info.get("format") or {}).get("size") or m4a_path.stat().st_size)

    vtt_lines = ["WEBVTT", "Kind: captions", "Language: en", ""]
    for t_obj in turns_out:
        vtt_lines.append(f"{t_obj['turn_index'] + 1}")
        vtt_lines.append(f"{fmt_vtt_ts(t_obj['start_sec'])} --> {fmt_vtt_ts(t_obj['end_sec'])}")
        vtt_lines.append(f"<v {t_obj['speaker']}>{t_obj['text']}")
        vtt_lines.append("")
    (ep_vtt_dir / f"{ep_id}.vtt").write_text("\n".join(vtt_lines), encoding="utf-8")

    panel_profiles = [PERSONAS[nm] for nm in panel_names if nm in PERSONAS]
    ep_meta = {
        "id": ep_id,
        "number": ep_spec["number"],
        "title": ep_spec["title"],
        "subtitle": ep_spec["subtitle"],
        "summary": ep_spec["summary"],
        "topic_tags": ep_spec.get("topic_tags", []),
        "panel": panel_names,
        "panel_profiles": panel_profiles,
        "tts_engines": sorted(engines_used),
        "published_utc": ep_spec.get("published_utc") or dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "duration_sec": duration_sec,
        "duration_human": fmt_human_dur(duration_sec),
        "byte_length": byte_length,
        "audio_url": f"/media/radio/episodes/{ep_id}.m4a",
        "captions_url": f"/media/radio/captions/{ep_id}.vtt",
        "transcript_url": f"/media/radio/transcripts/{ep_id}.json",
        "turn_count": len(turns_out),
        "card_count": len(cards_out),
        "ai_disclosure": AI_DISCLOSURE,
    }
    ep_doc = {**ep_meta, "personas": {nm: PERSONAS[nm] for nm in panel_names}, "turns": turns_out, "cards": cards_out}
    (ep_json_dir / f"{ep_id}.json").write_text(json.dumps(ep_doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return ep_meta
