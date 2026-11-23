#!/usr/bin/env python3
"""OpenIE Research Radio — Stage 4: 3-Voice Neural Studio Synthesizer & Mastering Engine.

Renders StarTalk-style 3-persona episodes (Elena, Marcus, Devon) via Kokoro-82M ONNX
neural TTS, adds subtle harmonic studio chimes and 180-320 ms conversational pacing,
loudness-normalizes via FFmpeg (-16 LUFS, -1.5 dBTP, AAC 96k +faststart .m4a), and
emits sample-accurate WebVTT (.vtt) captions + JSON transcripts with pop-up citation
and falsifier cards.
"""

from __future__ import annotations

import datetime as dt
import json
import math
import os
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any

import numpy as np
import soundfile as sf

SPOKEN_SUBS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bbioRxiv\b", re.I), "bio-archive"),
    (re.compile(r"\bmedRxiv\b", re.I), "med-archive"),
    (re.compile(r"\barXiv\b", re.I), "archive"),
    (re.compile(r"\bQ32\.32\b"), "Q thirty-two dot thirty-two"),
    (re.compile(r"\bLUT6\b"), "L U T six"),
    (re.compile(r"\bKV260\b"), "K V two sixty"),
    (re.compile(r"\bINA238\b"), "I N A two thirty-eight"),
    (re.compile(r"\bINA260\b"), "I N A two sixty"),
    (re.compile(r"\bINA3221\b"), "I N A thirty-two twenty-one"),
    (re.compile(r"\bEd25519\b"), "E D twenty-five five nineteen"),
    (re.compile(r"\bBLAKE3\b"), "Blake three"),
    (re.compile(r"\bBLAKE2b\b", re.I), "Blake two B"),
    (re.compile(r"\bSHA-256\b"), "SHA two fifty-six"),
    (re.compile(r"\bDES-10\b"), "D E S ten"),
    (re.compile(r"\bJouleOS\b"), "Joule O S"),
    (re.compile(r"\bMEI-JCP\b"), "M E I, J C P"),
    (re.compile(r"\bRCE-JEPA\b"), "R C E Jeppa"),
    (re.compile(r"\bFormJEPA\b"), "Form Jeppa"),
    (re.compile(r"\bFormEBM\b"), "Form E B M"),
    (re.compile(r"\bJEPA\b"), "Jeppa"),
    (re.compile(r"\bRCE-VC\b"), "R C E, V C"),
    (re.compile(r"\bRCE\b"), "R C E"),
    (re.compile(r"\bSATB\b"), "S A T B"),
    (re.compile(r"\bRAPL\b"), "rapple"),
    (re.compile(r"\baDBS\b"), "adaptive D B S"),
    (re.compile(r"\bcDBS\b"), "continuous D B S"),
    (re.compile(r"\bCpJ\b"), "coherence per joule"),
    (re.compile(r"\breported_j\b"), "reported joules"),
    (re.compile(r"\bmeasured_j\b"), "measured joules"),
    (re.compile(r"\bboard_metered\b"), "board metered"),
    (re.compile(r"(\d)\s*J/tok\b"), r"\1 joules per token"),
    (re.compile(r"(\d)\s*pJ\b"), r"\1 picojoules"),
    (re.compile(r"(\d)\s*nJ\b"), r"\1 nanojoules"),
    (re.compile(r"(\d)\s*(?:uJ|μJ)\b"), r"\1 microjoules"),
    (re.compile(r"(\d)\s*mJ\b"), r"\1 millijoules"),
    (re.compile(r"(\d)\s*(?:us|μs)\b"), r"\1 microseconds"),
    (re.compile(r"(\d)\s*ms\b"), r"\1 milliseconds"),
]


def to_spoken_english(text: str) -> str:
    out = text
    for pat, repl in SPOKEN_SUBS:
        out = pat.sub(repl, out)
    return out

PERSONAS: dict[str, dict[str, Any]] = {
    "Elena": {
        "name": "Elena",
        "title": "The Architect — Host",
        "voice": "af_heart",
        "lang": "en-us",
        "speed": 1.01,
        "color": "#00D4AA",
        "bio": "AI-synthesized science communicator connecting biological signaling, thermodynamics, and verified computing.",
    },
    "Marcus": {
        "name": "Marcus",
        "title": "The Skeptic — Critical Foil",
        "voice": "am_michael",
        "lang": "en-us",
        "speed": 1.04,
        "color": "#F59E0B",
        "bio": "AI-synthesized empirical foil auditing lookup baselines, telemetry drift, and unverified hype.",
    },
    "Devon": {
        "name": "Devon",
        "title": "The Bench Engineer — Specialist",
        "voice": "bm_george",
        "lang": "en-gb",
        "speed": 1.00,
        "color": "#818CF8",
        "bio": "AI-synthesized formal verification and hardware systems specialist citing exact Lean 4, RAPL, and shunt receipts.",
    },
}

AI_DISCLOSURE = (
    "AI Persona Disclosure: Elena, Marcus, and Devon are AI-synthesized OpenIE research personas "
    "voiced via open-weight neural speech synthesis and grounded strictly in verified Open Interface Engineering "
    "artifacts, deterministic pilot receipts, and live open-access literature feeds."
)


def ensure_ffmpeg() -> tuple[str, str]:
    try:
        import static_ffmpeg

        static_ffmpeg.add_paths()
    except Exception:
        pass
    ff = shutil.which("ffmpeg")
    fp = shutil.which("ffprobe")
    if not ff or not fp:
        raise RuntimeError("ffmpeg and ffprobe are required for .m4a broadcast mastering.")
    return ff, fp


def synth_chime(sr: int = 24000, duration: float = 1.55, freqs: tuple[float, ...] = (349.23, 440.0, 523.25, 659.25, 783.99)) -> np.ndarray:
    n = int(sr * duration)
    t = np.linspace(0.0, duration, n, endpoint=False)
    sig = np.zeros(n, dtype=np.float32)
    for idx, f in enumerate(freqs):
        onset = idx * 0.075
        mask = (t >= onset).astype(np.float32)
        tau = np.maximum(0.0, t - onset)
        env = mask * (1.0 - np.exp(-tau * 45.0)) * np.exp(-tau * 2.6)
        sig += (0.22 / len(freqs)) * env * np.sin(2.0 * math.pi * f * tau).astype(np.float32)
    return sig


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


def render_episode(
    kokoro: Any,
    ep_spec: dict[str, Any],
    media_root: Path,
    tmp_dir: Path,
) -> dict[str, Any]:
    ffmpeg_bin, ffprobe_bin = ensure_ffmpeg()
    sr = 24000
    ep_id = ep_spec["id"]

    ep_audio_dir = media_root / "episodes"
    ep_vtt_dir = media_root / "captions"
    ep_json_dir = media_root / "transcripts"
    for d in (ep_audio_dir, ep_vtt_dir, ep_json_dir, tmp_dir):
        d.mkdir(parents=True, exist_ok=True)

    segments: list[np.ndarray] = []
    intro = synth_chime(sr=sr, duration=1.55)
    lead_pad = np.zeros(int(sr * 0.28), dtype=np.float32)
    segments.extend([intro, lead_pad])
    cursor_samples = len(intro) + len(lead_pad)

    turns_out: list[dict[str, Any]] = []
    cards_out: list[dict[str, Any]] = []

    raw_turns = ep_spec["turns"]
    for idx, turn in enumerate(raw_turns):
        speaker = turn["speaker"]
        p_cfg = PERSONAS[speaker]
        spoken_text = to_spoken_english(turn.get("tts_text") or turn["text"])
        samples, out_sr = kokoro.create(
            spoken_text,
            voice=p_cfg["voice"],
            speed=float(turn.get("speed") or p_cfg["speed"]),
            lang=p_cfg["lang"],
        )
        if out_sr != sr:
            raise RuntimeError(f"Unexpected sample rate {out_sr} != {sr}")
        audio_arr = np.asarray(samples, dtype=np.float32)
        # Trim excessive leading/trailing dead air while keeping natural breath
        nz = np.flatnonzero(np.abs(audio_arr) > 0.003)
        if len(nz) > 10:
            pad = int(0.04 * sr)
            a0 = max(0, int(nz[0]) - pad)
            a1 = min(len(audio_arr), int(nz[-1]) + pad)
            audio_arr = audio_arr[a0:a1]

        start_sec = round(cursor_samples / sr, 3)
        segments.append(audio_arr)
        cursor_samples += len(audio_arr)
        end_sec = round(cursor_samples / sr, 3)

        # Conversational pacing: quicker interruption for Marcus (0.19s), thoughtful beat for transitions (0.29s)
        next_speaker = raw_turns[idx + 1]["speaker"] if idx + 1 < len(raw_turns) else None
        gap_ms = int(turn.get("pause_ms") or (195 if next_speaker == "Marcus" else 275))
        gap_samples = int(sr * (gap_ms / 1000.0))
        segments.append(np.zeros(gap_samples, dtype=np.float32))
        cursor_samples += gap_samples

        turns_out.append({
            "turn_index": idx,
            "speaker": speaker,
            "role": p_cfg["title"],
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

    outro = synth_chime(sr=sr, duration=1.25, freqs=(523.25, 659.25, 783.99, 1046.50))
    tail_pad = np.zeros(int(sr * 0.35), dtype=np.float32)
    segments.extend([outro, tail_pad])

    full_audio = np.concatenate(segments)
    raw_wav = tmp_dir / f"{ep_id}_raw.wav"
    sf.write(str(raw_wav), full_audio, sr, subtype="PCM_16")

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
            "96k",
            "-ar",
            "24000",
            "-ac",
            "1",
            "-movflags",
            "+faststart",
            str(m4a_path),
        ],
        check=True,
    )
    raw_wav.unlink(missing_ok=True)

    probe = subprocess.run(
        [ffprobe_bin, "-v", "error", "-show_entries", "format=duration,size:stream=codec_name", "-of", "json", str(m4a_path)],
        capture_output=True,
        text=True,
        check=True,
    )
    p_info = json.loads(probe.stdout)
    duration_sec = round(float((p_info.get("format") or {}).get("duration") or (len(full_audio) / sr)), 3)
    byte_length = int((p_info.get("format") or {}).get("size") or m4a_path.stat().st_size)

    # Write WebVTT
    vtt_lines = ["WEBVTT", f"Kind: captions", f"Language: en", ""]
    for t_obj in turns_out:
        vtt_lines.append(f"{t_obj['turn_index'] + 1}")
        vtt_lines.append(f"{fmt_vtt_ts(t_obj['start_sec'])} --> {fmt_vtt_ts(t_obj['end_sec'])}")
        vtt_lines.append(f"<v {t_obj['speaker']}>{t_obj['text']}")
        vtt_lines.append("")
    vtt_path = ep_vtt_dir / f"{ep_id}.vtt"
    vtt_path.write_text("\n".join(vtt_lines), encoding="utf-8")

    # Write full episode JSON transcript + cards
    ep_meta = {
        "id": ep_id,
        "number": ep_spec["number"],
        "title": ep_spec["title"],
        "subtitle": ep_spec["subtitle"],
        "summary": ep_spec["summary"],
        "topic_tags": ep_spec.get("topic_tags", []),
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
    ep_doc = {
        **ep_meta,
        "personas": PERSONAS,
        "turns": turns_out,
        "cards": cards_out,
    }
    (ep_json_dir / f"{ep_id}.json").write_text(json.dumps(ep_doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return ep_meta


def load_kokoro(model_dir: Path) -> Any:
    from kokoro_onnx import Kokoro

    onnx_p = model_dir / "kokoro-v1.0.int8.onnx"
    voices_p = model_dir / "voices-v1.0.bin"
    if not onnx_p.exists() or not voices_p.exists():
        raise FileNotFoundError(f"Missing Kokoro ONNX voice files in {model_dir}")
    return Kokoro(str(onnx_p), str(voices_p))
