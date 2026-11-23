#!/usr/bin/env python3
"""
OpenIE Research TV — ElevenLabs v4 Global Studio Ensemble & Sound Design Engine.
Synthesizes human-grade voiceover cues via ElevenLabs eleven_v4 (mp3_44100_192)
with SHA-256 disk caching, plus an automatic zero-key edge-tts multicultural
neural fallback (never robotic OS speech). Applies gentle pitch-preserving
ffmpeg atempo when needed to fit exact tier windows, mixes a -30 dB warm
harmonic synth pad + transition chimes, EBU R128 loudnorm, and WebVTT captions.
"""
import hashlib
import json
import math
import os
import re
import subprocess
import time
import urllib.error
import urllib.request
import wave
import numpy as np

SR = 44100
FPS = 30
ELEVEN_MODEL_ID = "eleven_v4"
ELEVEN_OUTPUT_FMT = "mp3_44100_192"
ELEVEN_SETTINGS = {
    "stability": 0.50,
    "similarity_boost": 0.78,
    "style": 0.22,
    "use_speaker_boost": True,
}

TIER_BOUNDS = {
    "5s": (5.05, 6.95, 5.95, 0.18, 0.00, 0.28),
    "30s": (27.40, 34.60, 31.00, 0.26, 0.42, 0.48),
    "60s": (55.40, 65.40, 60.20, 0.32, 0.52, 0.62),
    "90s": (84.60, 97.40, 90.50, 0.38, 0.60, 0.75),
}

# Natural human phrasing substitutions for eleven_v4 and neural TTS (zero letter-by-letter spacing)
PHONETIC_SUBS = [
    (r"\bOpenIE\b", "Open-I-E"),
    (r"\bBeneš\b", "Benesh"),
    (r"\bDNULLMM1\b", "D-null M-M-1"),
    (r"\beventfd\b", "event-FD"),
    (r"\bSepJ\b", "Sep-J"),
    (r"\bCpJ\b", "Coherence per Joule"),
    (r"\bmeasured_j\b", "measured joules"),
    (r"\breported_j\b", "reported joules"),
    (r"\best_j\b", "estimated joules"),
    (r"\best_uj\b", "estimated microjoules"),
    (r"\bboard_metered\b", "board metered"),
    (r"\bQ32\.32\b", "Q32-point-32"),
    (r"\bSLOC\b", "source lines"),
    (r"\bcl100k_base\b", "cl100k-base"),
    (r"\bdet-CBOR\b", "deterministic CBOR"),
    (r"\brustc\b", "rust-c"),
    (r"−20\s*°C|-20\s*°C", "minus 20 degrees Celsius"),
    (r"\b(\d+(?:\.\d+)?)x\b", r"\1 times"),
    (r"×", " times "),
    (r"µs", " microseconds"),
    (r"µJ", " microjoules"),
    (r"\bmJ\b", "millijoules"),
    (r"\bnJ\b", "nanojoules"),
    (r"\bpJ\b", "picojoules"),
]


def tts_phoneticize(text: str) -> str:
    out = text
    for pat, rep in PHONETIC_SUBS:
        out = re.sub(pat, rep, out)
    return re.sub(r"\s+", " ", out).strip()


def fetch_or_cache_cue_mp3(spoken: str, voice_tuple, cache_dir: str) -> str:
    _, voice_id, edge_voice, _ = voice_tuple
    api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    os.makedirs(cache_dir, exist_ok=True)

    if api_key:
        ckey = hashlib.sha256(f"{voice_id}|{ELEVEN_MODEL_ID}|{spoken}".encode("utf-8")).hexdigest()
        mp3_path = os.path.join(cache_dir, f"el_{ckey}.mp3")
        if os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 512:
            return mp3_path

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format={ELEVEN_OUTPUT_FMT}"
        payload = json.dumps(
            {"text": spoken, "model_id": ELEVEN_MODEL_ID, "voice_settings": ELEVEN_SETTINGS}
        ).encode("utf-8")

        last_err = None
        for attempt in range(5):
            try:
                req = urllib.request.Request(
                    url,
                    data=payload,
                    headers={
                        "xi-api-key": api_key,
                        "Content-Type": "application/json",
                        "Accept": "audio/mpeg",
                    },
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=45) as resp:
                    audio_bytes = resp.read()
                if len(audio_bytes) < 512:
                    raise RuntimeError(f"Short MP3 payload ({len(audio_bytes)} B)")
                tmp_p = f"{mp3_path}.tmp.{os.getpid()}"
                with open(tmp_p, "wb") as f:
                    f.write(audio_bytes)
                os.replace(tmp_p, mp3_path)
                return mp3_path
            except urllib.error.HTTPError as he:
                last_err = f"HTTP {he.code}"
                time.sleep(1.6 * (attempt + 1))
            except Exception as ex:
                last_err = type(ex).__name__
                time.sleep(1.4 * (attempt + 1))
        raise RuntimeError(f"ElevenLabs synthesis failed for voice {voice_id} after retries ({last_err})")

    # Zero-key multicultural neural fallback via edge-tts (never robotic OS speech)
    ckey = hashlib.sha256(f"edge|{edge_voice}|{spoken}".encode("utf-8")).hexdigest()
    mp3_path = os.path.join(cache_dir, f"edge_{ckey}.mp3")
    if os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 512:
        return mp3_path
    tmp_p = f"{mp3_path}.tmp.{os.getpid()}"
    subprocess.run(
        ["python3", "-m", "edge_tts", "--voice", edge_voice, "--text", spoken, "--write-media", tmp_p],
        check=True,
    )
    os.replace(tmp_p, mp3_path)
    return mp3_path


def decode_mp3_mono_float(mp3_path: str, atempo: float = 1.0) -> np.ndarray:
    cmd = ["ffmpeg", "-loglevel", "error", "-i", mp3_path]
    if abs(atempo - 1.0) >= 0.015:
        cmd += ["-af", f"atempo={atempo:.4f}"]
    cmd += ["-f", "s16le", "-acodec", "pcm_s16le", "-ac", "1", "-ar", str(SR), "-"]
    pcm = subprocess.check_output(cmd)
    arr = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0
    nz = np.where(np.abs(arr) > 0.0035)[0]
    if len(nz) > 0:
        start = max(0, int(nz[0]) - int(0.022 * SR))
        end = min(len(arr), int(nz[-1]) + int(0.060 * SR))
        arr = arr[start:end]
    return arr


def format_vtt_ts(sec: float) -> str:
    ms_total = max(0, int(round(sec * 1000)))
    hh = ms_total // 3600000
    rem = ms_total % 3600000
    mm = rem // 60000
    rem %= 60000
    ss = rem // 1000
    ms = rem % 1000
    return f"{hh:02d}:{mm:02d}:{ss:02d}.{ms:03d}"


def split_caption_clauses(text: str, start_s: float, end_s: float):
    words = text.split()
    if len(words) <= 15 or (end_s - start_s) < 4.2:
        return [(start_s, end_s, text)]
    mid = len(words) // 2
    best = mid
    for offset in range(0, min(6, mid)):
        for cand in (mid - offset, mid + offset):
            if 3 <= cand < len(words) - 3 and words[cand - 1].endswith((",", ";", ":", "—", ".")):
                best = cand
                break
        else:
            continue
        break
    p1 = " ".join(words[:best])
    p2 = " ".join(words[best:])
    frac = len(p1) / max(1, len(p1) + len(p2))
    t_mid = start_s + (end_s - start_s) * frac
    return [(start_s, t_mid, p1), (t_mid, end_s, p2)]


def build_film_audio_and_vtt(study_id: str, tier: str, scenes, voice_tuple, cache_dir: str, tmp_dir: str, out_wav: str, out_vtt: str):
    min_d, max_d, mid_d, lead_in, base_gap, tail_out = TIER_BOUNDS[tier]
    cues = [sc[3] for sc in scenes]
    n_sc = len(cues)
    fixed_pad = lead_in + tail_out + max(0, n_sc - 1) * base_gap

    mp3_paths = [fetch_or_cache_cue_mp3(tts_phoneticize(c), voice_tuple, cache_dir) for c in cues]
    arrays = [decode_mp3_mono_float(p, 1.0) for p in mp3_paths]
    speech_s = sum(len(a) / SR for a in arrays)

    # Pitch-preserving atempo adjustment on cached audio if outside tier bounds (never re-calls API)
    if speech_s + fixed_pad > max_d or speech_s + fixed_pad < min_d:
        desired_speech = max(1.5, mid_d - fixed_pad)
        atempo = max(0.88, min(1.18, speech_s / desired_speech))
        min_fixed = lead_in + tail_out + max(0, n_sc - 1) * 0.14
        if speech_s / atempo + min_fixed > max_d:
            atempo = min(1.48, speech_s / max(1.2, max_d - min_fixed - 0.12))
        if abs(atempo - 1.0) >= 0.02:
            arrays = [decode_mp3_mono_float(p, atempo) for p in mp3_paths]
            speech_s = sum(len(a) / SR for a in arrays)

    total_raw = speech_s + fixed_pad
    extra_per_scene = 0.0
    if total_raw < min_d:
        extra_per_scene = (min_d + 0.30 - total_raw) / n_sc
        total_raw = speech_s + fixed_pad + extra_per_scene * n_sc
    elif total_raw > max_d and n_sc > 1:
        shrink = min(base_gap - 0.12, (total_raw - max_d + 0.12) / (n_sc - 1))
        base_gap = max(0.12, base_gap - shrink)
        total_raw = speech_s + lead_in + tail_out + (n_sc - 1) * base_gap

    total_frames = max(int(math.ceil(min_d * FPS)), int(round(total_raw * FPS)))
    total_dur = total_frames / float(FPS)
    total_samples = int(round(total_dur * SR))

    voice_track = np.zeros(total_samples, dtype=np.float32)
    env_duck = np.ones(total_samples, dtype=np.float32)
    scene_windows = []
    vtt_entries = []

    cursor = lead_in
    pre_hold = extra_per_scene * 0.35
    post_hold = extra_per_scene * 0.65
    for idx, arr in enumerate(arrays):
        sc_start = 0.0 if idx == 0 else cursor - base_gap * 0.5
        cursor += pre_hold
        s0 = int(round(cursor * SR))
        s1 = min(total_samples, s0 + len(arr))
        seg_len = max(0, s1 - s0)
        if seg_len > 0:
            voice_track[s0:s1] += arr[:seg_len] * 0.94
            d0 = max(0, s0 - int(0.08 * SR))
            d1 = min(total_samples, s1 + int(0.12 * SR))
            env_duck[d0:d1] = 0.56
        cue_end = cursor + seg_len / float(SR)
        vtt_entries.extend(split_caption_clauses(cues[idx], cursor, cue_end))
        cursor = cue_end + post_hold + (base_gap if idx < n_sc - 1 else 0.0)
        sc_end = total_dur if idx == n_sc - 1 else cursor - base_gap * 0.5
        scene_windows.append((sc_start, sc_end))

    t = np.arange(total_samples, dtype=np.float32) / float(SR)
    lfo1 = 0.5 + 0.5 * np.sin(2.0 * np.pi * 0.11 * t)
    lfo2 = 0.5 + 0.5 * np.cos(2.0 * np.pi * 0.17 * t + 0.8)
    pad_l = (
        0.48 * np.sin(2.0 * np.pi * 73.416 * t)
        + 0.30 * np.sin(2.0 * np.pi * 110.00 * t + 0.3) * lfo1
        + 0.16 * np.sin(2.0 * np.pi * 146.83 * t) * lfo2
        + 0.06 * np.sin(2.0 * np.pi * 220.00 * t + 1.1)
    )
    pad_r = (
        0.48 * np.sin(2.0 * np.pi * 73.416 * t)
        + 0.30 * np.sin(2.0 * np.pi * 110.00 * t - 0.3) * lfo2
        + 0.16 * np.sin(2.0 * np.pi * 146.83 * t + 0.5) * lfo1
        + 0.06 * np.sin(2.0 * np.pi * 184.997 * t)
    )
    drone_amp = 0.026 * env_duck
    master_env = np.clip(np.minimum(1.0, t / 0.30) * np.minimum(1.0, (total_dur - t) / 0.42), 0.0, 1.0)
    mix_l = voice_track + pad_l * drone_amp * master_env
    mix_r = voice_track + pad_r * drone_amp * master_env

    chime_n = int(0.36 * SR)
    ct = np.arange(chime_n, dtype=np.float32) / float(SR)
    c_env = np.minimum(1.0, ct / 0.015) * np.exp(-ct * 8.5)
    chime = (0.65 * np.sin(2.0 * np.pi * 587.33 * ct) + 0.35 * np.sin(2.0 * np.pi * 880.0 * ct)) * c_env * 0.038
    for idx, (sc_s, _) in enumerate(scene_windows):
        c0 = int(round(sc_s * SR))
        c1 = min(total_samples, c0 + chime_n)
        if c1 > c0:
            mix_l[c0:c1] += chime[: c1 - c0]
            mix_r[c0:c1] += chime[: c1 - c0] * (0.85 if idx % 2 == 0 else 1.0)

    raw_wav = os.path.join(tmp_dir, f"{study_id}_{tier}_pre.wav")
    stereo_i16 = np.clip(np.stack([mix_l, mix_r], axis=1) * 32767.0, -32768, 32767).astype(np.int16)
    with wave.open(raw_wav, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(stereo_i16.tobytes())

    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", raw_wav, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(SR), "-ac", "2", out_wav],
        check=True,
    )
    try:
        os.remove(raw_wav)
    except OSError:
        pass

    narrator_name = voice_tuple[0]
    vtt_lines = ["WEBVTT", f"NOTE OpenIE Research TV — {study_id} ({tier}) Narrator {narrator_name}", ""]
    for i, (ts0, ts1, txt) in enumerate(vtt_entries, 1):
        vtt_lines.append(str(i))
        vtt_lines.append(f"{format_vtt_ts(ts0)} --> {format_vtt_ts(ts1)}")
        vtt_lines.append(txt)
        vtt_lines.append("")
    with open(out_vtt, "w", encoding="utf-8") as f:
        f.write("\n".join(vtt_lines))

    return total_frames, total_dur, scene_windows, " ".join(cues)
