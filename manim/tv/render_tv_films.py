#!/usr/bin/env python3
"""
OpenIE Research TV — 84-Film Master Render & Verification Orchestrator.
Renders 21 studies × 4 bespoke depth tiers (5s, 30s, 60s, 90s) = 84 MP4 films,
84 WebVTT caption tracks, 21 high-DPI 1280x720 JPG posters, and tv-catalog.json
using the 21-presenter ElevenLabs v4 Global Studio Ensemble (with edge-tts fallback).

Usage:
  python3 manim/tv/render_tv_films.py \
    --work-dir /path/to/scratch_work \
    --cutaway-dir /path/to/cutaways_3d \
    --media-dir /path/to/public/media/tv \
    --catalog-out /path/to/src/data/tv-catalog.json
"""
import argparse
import concurrent.futures as cf
import hashlib
import json
import os
import re
import subprocess
import time
import cairo

from studies_part1 import STUDIES_PART1
from studies_part2 import STUDIES_PART2
from studies_part3 import STUDIES_PART3
from voices_and_labs import TUTORIAL_LAB_MAP, VOICE_ENSEMBLE
from audio_studio import FPS, build_film_audio_and_vtt
from visual_scenes import W, H, draw_chrome, load_cutaway_surfaces, render_poster_jpg, render_scene_body

TIERS = ["5s", "30s", "60s", "90s"]
CATEGORIES = [
    "Foundations & Thermodynamics",
    "Reality Code Engine",
    "Null & Benchmarks",
    "Communication Avalanche & Bio",
    "Hardware, LUT6 & OS",
    "Economics & Cadence",
]


def parse_vtt_cues(vtt_path: str):
    cues = []
    with open(vtt_path, "r", encoding="utf-8") as f:
        blocks = f.read().strip().split("\n\n")
    ts_re = re.compile(r"(\d+):(\d+):(\d+)\.(\d+)\s*-->\s*(\d+):(\d+):(\d+)\.(\d+)")
    for blk in blocks:
        lines = [ln.strip() for ln in blk.splitlines() if ln.strip()]
        for i, ln in enumerate(lines):
            m = ts_re.match(ln)
            if m:
                g = [int(x) for x in m.groups()]
                s0 = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000.0
                s1 = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000.0
                txt = " ".join(lines[i + 1 :])
                cues.append({"start": round(s0, 3), "end": round(s1, 3), "text": txt})
                break
    return cues


def audio_job(task):
    study, tier, voice_tuple, cache_dir, tmp_dir, wav_path, vtt_path = task
    t_spec = study["tiers"][tier]
    total_frames, total_dur, scene_windows, transcript = build_film_audio_and_vtt(
        study["id"], tier, t_spec["scenes"], voice_tuple, cache_dir, tmp_dir, wav_path, vtt_path
    )
    return (study["id"], tier, total_frames, total_dur, scene_windows, transcript)


def study_video_job(task):
    study, active_tiers, audio_meta_for_study, cutaway_dir, wav_dir, films_dir, posters_dir = task
    sid = study["id"]
    cutaways = load_cutaway_surfaces(cutaway_dir, study["cutaway_3d"])
    poster_path = os.path.join(posters_dir, f"{sid}-poster.jpg")
    render_poster_jpg(study, cutaways, poster_path)

    results = {}
    for tier in active_tiers:
        total_frames, total_dur, scene_windows, transcript = audio_meta_for_study[tier]
        scenes = study["tiers"][tier]["scenes"]
        wav_path = os.path.join(wav_dir, f"{sid}-{tier}.wav")
        mp4_path = os.path.join(films_dir, f"{sid}-{tier}.mp4")

        cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "rawvideo", "-pix_fmt", "bgr0", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
            "-i", wav_path,
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "22", "-preset", "fast",
            "-c:a", "aac", "-b:a", "128k", "-ar", "44100",
            "-movflags", "+faststart", "-shortest", mp4_path,
        ]
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        surf = cairo.ImageSurface(cairo.FORMAT_RGB24, W, H)
        ctx = cairo.Context(surf)
        n_sc = len(scenes)

        for f_idx in range(total_frames):
            t_sec = f_idx / float(FPS)
            sc_idx = n_sc - 1
            for k, (s0, s1) in enumerate(scene_windows):
                if t_sec <= s1 or k == n_sc - 1:
                    sc_idx = k
                    break
            s0, s1 = scene_windows[sc_idx]
            u = (t_sec - s0) / max(0.05, s1 - s0)
            kind, heading, submetric, _ = scenes[sc_idx]
            draw_chrome(ctx, study, tier, sc_idx, n_sc, t_sec, total_dur)
            render_scene_body(ctx, study, kind, heading, submetric, u, f_idx, cutaways)
            proc.stdin.write(surf.get_data())

        proc.stdin.close()
        rc = proc.wait()
        if rc != 0:
            raise RuntimeError(f"ffmpeg failed for {sid}-{tier} with exit code {rc}")

        probe = subprocess.check_output(
            [
                "ffprobe", "-v", "error",
                "-show_entries", "stream=codec_type,codec_name,width,height,sample_rate:format=duration,size",
                "-of", "json", mp4_path,
            ],
            text=True,
        )
        pdata = json.loads(probe)
        streams = {s["codec_type"]: s for s in pdata.get("streams", [])}
        if "video" not in streams or "audio" not in streams:
            raise RuntimeError(f"Missing stream in {mp4_path}: {streams}")
        dur_actual = round(float(pdata["format"]["duration"]), 2)
        fbytes = os.path.getsize(mp4_path)
        h = hashlib.sha256()
        with open(mp4_path, "rb") as bf:
            while True:
                chunk = bf.read(1 << 20)
                if not chunk:
                    break
                h.update(chunk)
        results[tier] = {
            "duration_s": dur_actual,
            "bytes": fbytes,
            "sha256": h.hexdigest(),
            "transcript": transcript,
        }
    return sid, results


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--work-dir", required=True)
    ap.add_argument("--cutaway-dir", required=True)
    ap.add_argument("--media-dir", required=True)
    ap.add_argument("--catalog-out", required=True)
    ap.add_argument("--tts-workers", type=int, default=5)
    ap.add_argument("--video-workers", type=int, default=12)
    ap.add_argument("--tiers", default="5s,30s,60s,90s")
    ap.add_argument("--studies", default="", help="Optional comma-separated subset of study IDs to re-render")
    args = ap.parse_args()
    active_tiers = [t.strip() for t in args.tiers.split(",") if t.strip() in TIERS]
    only_studies = {s.strip() for s in args.studies.split(",") if s.strip()}

    studies = []
    for raw_st in STUDIES_PART1 + STUDIES_PART2 + STUDIES_PART3:
        st = dict(raw_st)
        sid = st["id"]
        v_tup = VOICE_ENSEMBLE[sid]
        st["narrator_name"] = v_tup[0]
        st["narrator_profile"] = v_tup[3]
        st["tutorial_lab_id"] = TUTORIAL_LAB_MAP[sid]
        studies.append(st)
    assert len(studies) == 21, f"Expected 21 studies, got {len(studies)}"
    target_studies = [st for st in studies if not only_studies or st["id"] in only_studies]

    existing_by_id = {}
    if os.path.exists(args.catalog_out) and (set(active_tiers) != set(TIERS) or bool(only_studies)):
        with open(args.catalog_out, "r", encoding="utf-8") as ef:
            existing_by_id = {s["id"]: s for s in json.load(ef).get("studies", [])}

    cache_dir = os.path.join(args.work_dir, "eleven_cache")
    tmp_tts = os.path.join(args.work_dir, "tts_tmp")
    wav_dir = os.path.join(args.work_dir, "wavs")
    films_dir = os.path.join(args.media_dir, "films")
    vtt_dir = os.path.join(args.media_dir, "captions")
    posters_dir = os.path.join(args.media_dir, "posters")
    for d in (cache_dir, tmp_tts, wav_dir, films_dir, vtt_dir, posters_dir, os.path.dirname(args.catalog_out)):
        os.makedirs(d, exist_ok=True)

    engine_label = "eleven_v4" if os.environ.get("ELEVENLABS_API_KEY", "").strip() else "edge-tts-neural"
    t0 = time.time()
    print(f"[1/3] Synthesizing {len(target_studies)}-presenter {engine_label} voiceovers & WebVTT ({args.tts_workers} workers)...", flush=True)
    tts_tasks = []
    for st in target_studies:
        sid = st["id"]
        for tier in active_tiers:
            wav_p = os.path.join(wav_dir, f"{sid}-{tier}.wav")
            vtt_p = os.path.join(vtt_dir, f"{sid}-{tier}.vtt")
            tts_tasks.append((st, tier, VOICE_ENSEMBLE[sid], cache_dir, tmp_tts, wav_p, vtt_p))

    audio_meta = {st["id"]: {} for st in target_studies}
    with cf.ProcessPoolExecutor(max_workers=args.tts_workers) as ex:
        for sid, tier, n_frames, dur, wins, tr in ex.map(audio_job, tts_tasks):
            audio_meta[sid][tier] = (n_frames, dur, wins, tr)
    print(f"      Audio + VTT tracks ready in {time.time() - t0:.1f}s", flush=True)

    t1 = time.time()
    print(f"[2/3] Rendering {len(target_studies)} posters + {len(target_studies) * len(active_tiers)} HD 720p30 MP4 films ({args.video_workers} workers)...", flush=True)
    vid_tasks = [
        (st, active_tiers, audio_meta[st["id"]], args.cutaway_dir, wav_dir, films_dir, posters_dir)
        for st in target_studies
    ]
    rendered_info = {}
    with cf.ProcessPoolExecutor(max_workers=args.video_workers) as ex:
        for idx, (sid, res) in enumerate(ex.map(study_video_job, vid_tasks), 1):
            rendered_info[sid] = res
            d_summary = ", ".join(f"{k}={v['duration_s']}s" for k, v in res.items())
            print(f"      [{idx:02d}/{len(target_studies):02d}] {sid} ({VOICE_ENSEMBLE[sid][0]}): {d_summary}", flush=True)
    print(f"      Encoded & ffprobe-verified in {time.time() - t1:.1f}s", flush=True)

    print("[3/3] Emitting structured tv-catalog.json...", flush=True)
    catalog_studies = []
    for st in studies:
        sid = st["id"]
        tiers_obj = {}
        for tier in TIERS:
            if sid in rendered_info and tier in rendered_info[sid]:
                r = rendered_info[sid][tier]
                vtt_p = os.path.join(vtt_dir, f"{sid}-{tier}.vtt")
                tiers_obj[tier] = {
                    "video_url": f"/media/tv/films/{sid}-{tier}.mp4",
                    "vtt_url": f"/media/tv/captions/{sid}-{tier}.vtt",
                    "duration_s": r["duration_s"],
                    "bytes": r["bytes"],
                    "sha256": r["sha256"],
                    "hook": st["tiers"][tier]["hook"],
                    "transcript": r["transcript"],
                    "cues": parse_vtt_cues(vtt_p),
                }
            else:
                tiers_obj[tier] = existing_by_id[sid]["tiers"][tier]
        catalog_studies.append({
            "id": sid,
            "title": st["title"],
            "short_title": st["short_title"],
            "category": st["category"],
            "paper_url": st["paper_url"],
            "pdf_url": st["pdf_url"],
            "figures_url": st["figures_url"],
            "about_url": st["about_url"],
            "tutorial_lab_id": st["tutorial_lab_id"],
            "narrator_name": st["narrator_name"],
            "narrator_profile": st["narrator_profile"],
            "headline_metric": st["headline_metric"],
            "epistemic_tags": st["epistemic_tags"],
            "energy_tier": st["energy_tier"],
            "energy_disclosure": st["energy_disclosure"],
            "cutaway_3d": st["cutaway_3d"],
            "poster_url": f"/media/tv/posters/{sid}-poster.jpg",
            "tiers": tiers_obj,
        })

    catalog = {
        "title": "OpenIE Research TV Catalog",
        "version": "2.0.0",
        "study_count": 21,
        "film_count": 84,
        "tts_model": "ElevenLabs eleven_v4 (21-Presenter Global Studio Ensemble; edge-tts neural fallback)",
        "categories": CATEGORIES,
        "studio_disclosure": "Narration features a 21-presenter global studio voice ensemble synthesized with ElevenLabs eleven_v4 and grounded strictly in verified OpenIE study artifacts. Every claim, equation, and energy figure links directly to its published paper, interactive figure, and artifact ledger.",
        "metering_contract": "Physical hardware rail shunts earn measured_j (AMD Kria KV260 INA260 in gates; NVIDIA Jetson AGX Thor TI INA238/INA3221 in satb-harness and communication-avalanche). Host hardware/OS counters (RAPL, Darwin IOReport, NVML) are labeled reported_j. Analytical or datasheet figures are labeled est_j.",
        "studies": catalog_studies,
    }
    with open(args.catalog_out, "w", encoding="utf-8") as cf_out:
        json.dump(catalog, cf_out, indent=2, ensure_ascii=False)
        cf_out.write("\n")
    print(f"[DONE] Total elapsed: {time.time() - t0:.1f}s -> {args.catalog_out}", flush=True)


if __name__ == "__main__":
    main()
