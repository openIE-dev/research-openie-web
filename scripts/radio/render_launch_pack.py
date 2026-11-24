#!/usr/bin/env python3
"""OpenIE Research Radio — 14-Episode Global Ensemble Parallel Renderer & Feed Builder."""

from __future__ import annotations

import concurrent.futures as cf
import datetime as dt
import json
import time
from pathlib import Path
from typing import Any

from episodes_ep1_ep2 import EPISODE_01, EPISODE_02
from episodes_ep3_ep4 import EPISODE_03, EPISODE_04
from episodes_ep5_ep6 import EPISODE_05, EPISODE_06
from episodes_ep7_ep8 import EPISODE_07, EPISODE_08
from episodes_ep9_ep14 import (
    EPISODE_09,
    EPISODE_10,
    EPISODE_11,
    EPISODE_12,
    EPISODE_13,
    EPISODE_14,
)
from personas import AI_DISCLOSURE, PERSONAS
from studio_synth import fmt_human_dur, load_radio_env, render_episode

ALL_EPISODES: list[dict[str, Any]] = [
    EPISODE_01,
    EPISODE_02,
    EPISODE_03,
    EPISODE_04,
    EPISODE_05,
    EPISODE_06,
    EPISODE_07,
    EPISODE_08,
    EPISODE_09,
    EPISODE_10,
    EPISODE_11,
    EPISODE_12,
    EPISODE_13,
    EPISODE_14,
]


def _worker(args: tuple[dict[str, Any], str, str, str]) -> dict[str, Any]:
    ep_spec, media_root_s, tmp_dir_s, cache_dir_s = args
    media_root = Path(media_root_s)
    meta = render_episode(ep_spec, media_root, Path(tmp_dir_s), Path(cache_dir_s))
    transcript_path = media_root / "transcripts" / f"{ep_spec['id']}.json"
    full_doc = json.loads(transcript_path.read_text(encoding="utf-8"))

    cards = full_doc.get("cards", [])
    extra: dict[str, Any] = {}
    if "desk" in ep_spec:
        extra["desk"] = ep_spec["desk"]
    if "desk_domain" in ep_spec:
        extra["desk_domain"] = ep_spec["desk_domain"]
    if "studies" in ep_spec:
        extra["studies"] = ep_spec["studies"]
    if extra:
        extra["hosts"] = meta["panel"]
        extra["duration_s"] = meta["duration_sec"]
        extra["citations"] = [c for c in cards if c.get("kind") != "falsifier"]
        extra["falsifiers"] = [c for c in cards if c.get("kind") == "falsifier"]
        enriched_transcript = {
            **meta,
            **extra,
            "personas": full_doc.get("personas", {nm: PERSONAS[nm] for nm in meta["panel"]}),
            "turns": full_doc["turns"],
            "cards": cards,
        }
        transcript_path.write_text(json.dumps(enriched_transcript, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    return {**meta, **extra, "turns": full_doc["turns"], "cards": cards}


def build_launch_pack(state_dir: Path, workers: int = 3) -> dict[str, Any]:
    load_radio_env()
    t0 = time.perf_counter()
    media_root = state_dir / "media" / "radio"
    tmp_dir = state_dir / "tmp_radio_synth"
    cache_dir = state_dir / "eleven_cache"
    feed_json_path = state_dir / "radio-feed.json"

    tasks = [(ep, str(media_root), str(tmp_dir), str(cache_dir)) for ep in ALL_EPISODES]
    rendered: list[dict[str, Any]] = []
    with cf.ProcessPoolExecutor(max_workers=workers) as pool:
        for res in pool.map(_worker, tasks):
            print(
                f"[synthesized] #{res['number']} {res['id']} ({', '.join(res['panel'])}) -> "
                f"{res['duration_sec']}s ({res['duration_human']}), {res['byte_length']} B, engines={res['tts_engines']}"
            )
            rendered.append(res)

    rendered.sort(key=lambda x: x["number"])
    total_sec = round(sum(x["duration_sec"] for x in rendered), 3)

    feed_doc = {
        "schema": "openie.radio.feed.v2",
        "title": "OpenIE Research Radio",
        "subtitle": "Global multi-voice research broadcasts auditing energy-per-completion, formal state machines, biological signaling ratchets, and live open-access science.",
        "site_url": "https://research.openie.dev/radio/",
        "rss_url": "https://research.openie.dev/radio/rss.xml",
        "audio_spec": "44.1 kHz · 128 kbps Stereo AAC (-16 LUFS) · ElevenLabs eleven_v4 Studio Ensemble",
        "generated_at_utc": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "rotation_epoch_unix": 1763856000,
        "autonomous_cadence": "Every 6 hours (systemd --user openie-research-radio.timer + cron flock)",
        "ai_disclosure": AI_DISCLOSURE,
        "personas": PERSONAS,
        "episode_count": len(rendered),
        "total_duration_sec": total_sec,
        "total_duration_human": fmt_human_dur(total_sec),
        "episodes": rendered,
    }
    feed_json_path.parent.mkdir(parents=True, exist_ok=True)
    feed_json_path.write_text(json.dumps(feed_doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Rendered {len(rendered)} episodes ({total_sec}s total) in {round(time.perf_counter()-t0, 2)}s -> {feed_json_path}")
    return feed_doc


if __name__ == "__main__":
    import sys

    base = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    build_launch_pack(state_dir=base / "state", workers=3)
