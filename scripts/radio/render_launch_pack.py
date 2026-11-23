#!/usr/bin/env python3
"""OpenIE Research Radio — 8-Episode Launch Pack Parallel Renderer & Feed Builder."""

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
from studio_synth import AI_DISCLOSURE, PERSONAS, fmt_human_dur, load_kokoro, render_episode

ALL_EPISODES: list[dict[str, Any]] = [
    EPISODE_01,
    EPISODE_02,
    EPISODE_03,
    EPISODE_04,
    EPISODE_05,
    EPISODE_06,
    EPISODE_07,
    EPISODE_08,
]


def _worker(args: tuple[dict[str, Any], str, str, str]) -> dict[str, Any]:
    ep_spec, model_dir_s, media_root_s, tmp_dir_s = args
    kokoro = load_kokoro(Path(model_dir_s))
    meta = render_episode(kokoro, ep_spec, Path(media_root_s), Path(tmp_dir_s))
    full_doc = json.loads((Path(media_root_s) / "transcripts" / f"{ep_spec['id']}.json").read_text(encoding="utf-8"))
    return {**meta, "turns": full_doc["turns"], "cards": full_doc["cards"]}


def build_launch_pack(model_dir: Path, media_root: Path, feed_json_path: Path, workers: int = 3) -> dict[str, Any]:
    t0 = time.perf_counter()
    tmp_dir = media_root.parent / "tmp_radio_synth"
    tasks = [(ep, str(model_dir), str(media_root), str(tmp_dir)) for ep in ALL_EPISODES]

    rendered: list[dict[str, Any]] = []
    with cf.ProcessPoolExecutor(max_workers=workers) as pool:
        for res in pool.map(_worker, tasks):
            print(f"[synthesized] #{res['number']} {res['id']} -> {res['duration_sec']}s ({res['duration_human']}), {res['byte_length']} B")
            rendered.append(res)

    rendered.sort(key=lambda x: x["number"])
    total_sec = round(sum(x["duration_sec"] for x in rendered), 3)

    feed_doc = {
        "schema": "openie.radio.feed.v1",
        "title": "OpenIE Research Radio",
        "subtitle": "Multi-voice research broadcasts auditing energy-per-completion, formal state machines, biological signaling ratchets, and live open-access science.",
        "site_url": "https://research.openie.dev/radio/",
        "rss_url": "https://research.openie.dev/radio/rss.xml",
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
    build_launch_pack(
        model_dir=base / "models",
        media_root=base / "state" / "media" / "radio",
        feed_json_path=base / "state" / "radio-feed.json",
        workers=3,
    )
