#!/usr/bin/env python3
"""
OpenIE Research TV — Broadcast Neural Voiceover, Sound Design & WebVTT Engine.
Synthesizes studio voiceover cues, calibrates exact tier durations ([5–7s], [27–35s],
[55–66s], [84–98s]), mixes a -30 dB warm harmonic synth pad + transition chimes,
normalizes via EBU R128 (loudnorm=I=-16:TP=-1.5:LRA=11), and writes WebVTT captions.
"""
import math
import os
import re
import subprocess
import wave
import numpy as np

SR = 44100
FPS = 30

TIER_BOUNDS = {
    "5s": (5.15, 6.80, 5.95, 0.22, 0.00, 0.36),
    "30s": (27.60, 34.40, 31.00, 0.30, 0.48, 0.55),
    "60s": (55.60, 65.20, 60.20, 0.35, 0.56, 0.68),
    "90s": (84.80, 97.20, 90.50, 0.40, 0.65, 0.80),
}

PHONETIC_SUBS = [
    (r"\bOpenIE\b", "Open I E"),
    (r"\bRCE-JEPA\b", "R C E JEPA"),
    (r"\bRCE-VC\b", "R C E V C"),
    (r"\bRCE\b", "R C E"),
    (r"\bLUT6\b", "L U T 6"),
    (r"\bLUTs\b", "L U Ts"),
    (r"\bBeneš\b", "Benesh"),
    (r"\bBLAKE3\b", "Blake 3"),
    (r"\bEd25519\b", "E D 255 19"),
    (r"\bKV260\b", "K V 260"),
    (r"\bINA238\b", "I N A 238"),
    (r"\bINA3221\b", "I N A 32 21"),
    (r"\bINA260\b", "I N A 260"),
    (r"\bRAMB36E2s?\b", "RAM B 36 E 2"),
    (r"\bxck26\b", "X C K 26"),
    (r"\bDNULLMM1\b", "D null M M 1"),
    (r"\bSATB-IO\b", "S A T B I O"),
    (r"\bSATB\b", "S A T B"),
    (r"\bJCR-1\b", "J C R 1"),
    (r"\bJCP\b", "J C P"),
    (r"\bJouleOS\b", "Joule O S"),
    (r"\bMEI-JCP-Tag-v1\b", "M E I J C P Tag V 1"),
    (r"\bMEI\b", "M E I"),
    (r"\bDES-10\b", "D E S 10"),
    (r"\beventfd\b", "event F D"),
    (r"\bSepJ\b", "Sep J"),
    (r"\bCpJ\b", "Coherence per Joule"),
    (r"\bmeasured_j\b", "measured joules"),
    (r"\breported_j\b", "reported joules"),
    (r"\best_j\b", "estimated joules"),
    (r"\best_uj\b", "estimated microjoules"),
    (r"\bboard_metered\b", "board metered"),
    (r"\bNVMe\b", "N V M E"),
    (r"\bNVML\b", "N V M L"),
    (r"\bRAPL\b", "R A P L"),
    (r"\bIOReport\b", "I O Report"),
    (r"\bwgpu\b", "W G P U"),
    (r"\bPSPACE\b", "P space"),
    (r"\bQ32\.32\b", "Q 32 dot 32"),
    (r"\bSLOC\b", "source lines"),
    (r"\bAUROC\b", "A U R O C"),
    (r"\bcl100k_base\b", "C L 100 K base"),
    (r"\bcl100k\b", "C L 100 K"),
    (r"\bdet-CBOR\b", "deterministic C BOR"),
    (r"\brustc\b", "rust C"),
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
    return out


def read_wav_mono_float(path: str) -> np.ndarray:
    with wave.open(path, "rb") as w:
        n = w.getnframes()
        raw = w.readframes(n)
        arr = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        if w.getnchannels() > 1:
            arr = arr.reshape(-1, w.getnchannels()).mean(axis=1)
    # Trim trailing digital silence > 80 ms so cues pack tightly and predictably
    nz = np.where(np.abs(arr) > 0.004)[0]
    if len(nz) > 0:
        end = min(len(arr), int(nz[-1]) + int(0.06 * SR))
        start = max(0, int(nz[0]) - int(0.02 * SR))
        arr = arr[start:end]
    return arr


def synth_cue_list(cues, voice: str, rate: int, tmp_dir: str, prefix: str):
    arrays = []
    for idx, text in enumerate(cues):
        wav_p = os.path.join(tmp_dir, f"{prefix}_r{rate}_c{idx}.wav")
        spoken = tts_phoneticize(text)
        subprocess.run(
            ["/usr/bin/say", "-v", voice, "-r", str(rate), "--file-format=WAVE", f"--data-format=LEI16@{SR}", "-o", wav_p, spoken],
            check=True,
        )
        arrays.append(read_wav_mono_float(wav_p))
        try:
            os.remove(wav_p)
        except OSError:
            pass
    return arrays


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


def build_film_audio_and_vtt(study_id: str, tier: str, scenes, voice: str, tmp_dir: str, out_wav: str, out_vtt: str):
    min_d, max_d, mid_d, lead_in, base_gap, tail_out = TIER_BOUNDS[tier]
    cues = [sc[3] for sc in scenes]
    n_sc = len(cues)
    fixed_pad = lead_in + tail_out + max(0, n_sc - 1) * base_gap

    rate = 186 if tier != "5s" else 192
    arrays = synth_cue_list(cues, voice, rate, tmp_dir, f"{study_id}_{tier}")
    speech_s = sum(len(a) / SR for a in arrays)

    if speech_s + fixed_pad > max_d or speech_s + fixed_pad < min_d:
        desired_speech = max(1.5, mid_d - fixed_pad)
        new_rate = int(round(rate * (speech_s / desired_speech)))
        new_rate = max(156, min(255, new_rate))
        if abs(new_rate - rate) >= 5:
            rate = new_rate
            arrays = synth_cue_list(cues, voice, rate, tmp_dir, f"{study_id}_{tier}")
            speech_s = sum(len(a) / SR for a in arrays)

    total_raw = speech_s + fixed_pad
    extra_per_scene = 0.0
    if total_raw < min_d:
        extra_per_scene = (min_d + 0.35 - total_raw) / n_sc
        total_raw = speech_s + fixed_pad + extra_per_scene * n_sc
    elif total_raw > max_d and n_sc > 1:
        shrink = min(base_gap * 0.65, (total_raw - max_d + 0.15) / (n_sc - 1))
        base_gap = max(0.14, base_gap - shrink)
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
            voice_track[s0:s1] += arr[:seg_len] * 0.92
            d0 = max(0, s0 - int(0.08 * SR))
            d1 = min(total_samples, s1 + int(0.12 * SR))
            env_duck[d0:d1] = 0.58
        cue_end = cursor + seg_len / float(SR)
        vtt_entries.extend(split_caption_clauses(cues[idx], cursor, cue_end))
        cursor = cue_end + post_hold + (base_gap if idx < n_sc - 1 else 0.0)
        sc_end = total_dur if idx == n_sc - 1 else cursor - base_gap * 0.5
        scene_windows.append((sc_start, sc_end))

    # Synthesize warm stereo ambient harmonic drone (-30 dB) + subtle transition chimes
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
    drone_amp = 0.028 * env_duck
    fade_in = np.minimum(1.0, t / 0.30)
    fade_out = np.minimum(1.0, (total_dur - t) / 0.42)
    master_env = np.clip(fade_in * fade_out, 0.0, 1.0)
    mix_l = voice_track + pad_l * drone_amp * master_env
    mix_r = voice_track + pad_r * drone_amp * master_env

    chime_n = int(0.36 * SR)
    ct = np.arange(chime_n, dtype=np.float32) / float(SR)
    c_env = np.minimum(1.0, ct / 0.015) * np.exp(-ct * 8.5)
    chime = (0.65 * np.sin(2.0 * np.pi * 587.33 * ct) + 0.35 * np.sin(2.0 * np.pi * 880.0 * ct)) * c_env * 0.042
    for idx, (sc_s, _) in enumerate(scene_windows):
        c0 = int(round(sc_s * SR))
        c1 = min(total_samples, c0 + chime_n)
        if c1 > c0:
            mix_l[c0:c1] += chime[: c1 - c0]
            mix_r[c0:c1] += chime[: c1 - c0] * (0.85 if idx % 2 == 0 else 1.0)

    raw_wav = os.path.join(tmp_dir, f"{study_id}_{tier}_pre.wav")
    stereo = np.stack([mix_l, mix_r], axis=1)
    stereo_i16 = np.clip(stereo * 32767.0, -32768, 32767).astype(np.int16)
    with wave.open(raw_wav, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(stereo_i16.tobytes())

    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-i", raw_wav,
            "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-ar", str(SR), "-ac", "2", out_wav,
        ],
        check=True,
    )
    try:
        os.remove(raw_wav)
    except OSError:
        pass

    vtt_lines = ["WEBVTT", f"NOTE OpenIE Research TV — {study_id} ({tier}) AI-synthesized studio narration", ""]
    for i, (ts0, ts1, txt) in enumerate(vtt_entries, 1):
        vtt_lines.append(str(i))
        vtt_lines.append(f"{format_vtt_ts(ts0)} --> {format_vtt_ts(ts1)}")
        vtt_lines.append(txt)
        vtt_lines.append("")
    with open(out_vtt, "w", encoding="utf-8") as f:
        f.write("\n".join(vtt_lines))

    full_transcript = " ".join(cues)
    return total_frames, total_dur, scene_windows, full_transcript
