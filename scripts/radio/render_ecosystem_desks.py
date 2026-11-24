#!/usr/bin/env python3
"""OpenIE Research Radio — Dedicated 6-Desk Roundtable Renderer & Feed Merger (ep09–ep14).

Synthesizes ONLY Episodes 9–14 (`ECOSYSTEM_DESK_EPISODES`) via ElevenLabs `eleven_v4`
and masters 44.1 kHz, 128 kbps Stereo AAC `.m4a` (-16 LUFS) + `.vtt` + `.json` without
re-rendering `ep01`–`ep08`, then merges all 14 episodes cleanly into `radio-feed.json`.
"""

from __future__ import annotations

import argparse
import concurrent.futures as cf
import datetime as dt
import json
import time
from pathlib import Path
from typing import Any

from episodes_ep9_ep14 import ECOSYSTEM_DESK_EPISODES
from personas import AI_DISCLOSURE, PERSONAS
from studio_synth import fmt_human_dur, load_radio_env, render_episode


def _enrich_episode_doc(ep_spec: dict[str, Any], meta: dict[str, Any], full_doc: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    cards = full_doc.get("cards", [])
    citations = [c for c in cards if c.get("kind") != "falsifier"]
    falsifiers = [c for c in cards if c.get("kind") == "falsifier"]

    extra: dict[str, Any] = {}
    if "desk" in ep_spec:
        extra["desk"] = ep_spec["desk"]
    if "desk_domain" in ep_spec:
        extra["desk_domain"] = ep_spec["desk_domain"]
    if "studies" in ep_spec:
        extra["studies"] = ep_spec["studies"]
    extra["hosts"] = meta["panel"]
    extra["duration_s"] = meta["duration_sec"]
    extra["citations"] = citations
    extra["falsifiers"] = falsifiers

    enriched_transcript = {
        **meta,
        **extra,
        "personas": full_doc.get("personas", {nm: PERSONAS[nm] for nm in meta["panel"]}),
        "turns": full_doc["turns"],
        "cards": cards,
    }
    enriched_feed_entry = {
        **meta,
        **extra,
        "turns": full_doc["turns"],
        "cards": cards,
    }
    return enriched_transcript, enriched_feed_entry


def _worker(args: tuple[dict[str, Any], str, str, str]) -> dict[str, Any]:
    ep_spec, media_root_s, tmp_dir_s, cache_dir_s = args
    media_root = Path(media_root_s)
    meta = render_episode(ep_spec, media_root, Path(tmp_dir_s), Path(cache_dir_s))
    transcript_path = media_root / "transcripts" / f"{ep_spec['id']}.json"
    full_doc = json.loads(transcript_path.read_text(encoding="utf-8"))
    enriched_transcript, enriched_feed_entry = _enrich_episode_doc(ep_spec, meta, full_doc)
    transcript_path.write_text(json.dumps(enriched_transcript, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return enriched_feed_entry


def render_and_merge_desks(state_dir: Path, feed_path: Path | None = None, workers: int = 2) -> dict[str, Any]:
    load_radio_env()
    t0 = time.perf_counter()
    media_root = state_dir / "media" / "radio"
    tmp_dir = state_dir / "tmp_radio_synth"
    cache_dir = state_dir / "eleven_cache"
    target_feed_path = feed_path or (state_dir / "radio-feed.json")

    if not target_feed_path.exists():
        raise FileNotFoundError(f"Existing radio-feed.json required to preserve ep01-ep08: {target_feed_path}")

    existing_feed = json.loads(target_feed_path.read_text(encoding="utf-8"))
    existing_eps: list[dict[str, Any]] = existing_feed.get("episodes", [])
    desk_ids = {ep["id"] for ep in ECOSYSTEM_DESK_EPISODES}
    preserved_eps = [ep for ep in existing_eps if ep.get("id") not in desk_ids and int(ep.get("number", 0)) <= 8]

    tasks = [(ep, str(media_root), str(tmp_dir), str(cache_dir)) for ep in ECOSYSTEM_DESK_EPISODES]
    rendered_desks: list[dict[str, Any]] = []
    with cf.ProcessPoolExecutor(max_workers=workers) as pool:
        for res in pool.map(_worker, tasks):
            print(
                f"[synthesized] #{res['number']} {res['id']} [{res.get('desk', '-')}] ({', '.join(res['panel'])}) -> "
                f"{res['duration_sec']}s ({res['duration_human']}), {res['byte_length']} B, "
                f"citations={len(res.get('citations', []))}, falsifiers={len(res.get('falsifiers', []))}, engines={res['tts_engines']}"
            )
            if res["tts_engines"] != ["eleven_v4"]:
                raise RuntimeError(f"Episode {res['id']} fell back from eleven_v4: {res['tts_engines']}")
            rendered_desks.append(res)

    merged_eps = sorted([*preserved_eps, *rendered_desks], key=lambda x: int(x["number"]))
    total_sec = round(sum(float(x["duration_sec"]) for x in merged_eps), 3)

    feed_doc = {
        **existing_feed,
        "schema": "openie.radio.feed.v2",
        "generated_at_utc": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "ai_disclosure": AI_DISCLOSURE,
        "personas": PERSONAS,
        "episode_count": len(merged_eps),
        "total_duration_sec": total_sec,
        "total_duration_human": fmt_human_dur(total_sec),
        "episodes": merged_eps,
    }
    target_feed_path.parent.mkdir(parents=True, exist_ok=True)
    target_feed_path.write_text(json.dumps(feed_doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(
        f"Merged {len(rendered_desks)} desk roundtables with {len(preserved_eps)} launch episodes -> "
        f"{len(merged_eps)} total ({total_sec}s / {fmt_human_dur(total_sec)}) in {round(time.perf_counter()-t0, 2)}s -> {target_feed_path}"
    )
    return feed_doc


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Render ep09-ep14 desk roundtables and merge into radio-feed.json")
    ap.add_argument("--state-dir", type=Path, default=Path("state"), help="State directory holding eleven_cache and media/radio")
    ap.add_argument("--feed-json", type=Path, default=None, help="Explicit radio-feed.json path to merge into")
    ap.add_argument("--workers", type=int, default=2, help="Parallel synthesis workers")
    ns = ap.parse_args()
    render_and_merge_desks(state_dir=ns.state_dir, feed_path=ns.feed_json, workers=ns.workers)
