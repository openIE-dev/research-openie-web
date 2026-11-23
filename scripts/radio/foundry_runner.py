#!/usr/bin/env python3
"""OpenIE Research Radio — Stage 3 Runner: Topic Idea Foundry JSON Builder.

Executes all 6 deterministic <60s pilot experiments from foundry_pilots.py,
attaches live literature links from radio-radar.json, and writes sanitized
src/data/topic-foundry.json.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import platform
import time
from pathlib import Path
from typing import Any

from foundry_pilots import (
    RAPL_PKG,
    pick_urls,
    pilot_1_lut6_prefix_gate,
    pilot_2_quorum_circuit_breaker,
    pilot_3_salted_horizon_tmt,
    pilot_4_debruijn_memoization,
    pilot_5_adbs_microburst_telemetry,
    pilot_6_mlp_vs_shaped_broadphase,
    read_uj,
)


def run_foundry(radar_path: Path, out_path: Path) -> dict[str, Any]:
    radar = json.loads(radar_path.read_text(encoding="utf-8"))
    items = radar.get("items", [])
    t_start = time.perf_counter()
    rapl_available = read_uj(RAPL_PKG) is not None

    specs = [
        {
            "topic_id": "TF-2026-01",
            "title": "Conformal Prefix-LUT6 Early-Exit Gate for Hybrid State-Space Routing",
            "vector_ids": ["fpga-lut-ternary-inmemory", "energy-joules-token"],
            "openie_anchors": ["lut-adapt", "gates", "agency"],
            "hypothesis": "A 64-entry bit-sliced LUT6 prefix table paired with an exact schema parity check intercepts recurring Zipfian tool/AST prefixes before dense matrix layers wake, cutting socket reported_j by >8x with 0/6,000 false commits.",
            "shape_d_null_baseline": "Unconditional 256x256 FP64 dense projection executed on every arrival across 6,000 Zipf(1.38) requests.",
            "kill_criterion": "Kill if false-accept rate > 0.0% OR package reported_j / latency gain is < 3.0x versus unconditional dense evaluation.",
            "target_joule_bound": "<= 0.12x baseline package reported_j per 6,000-arrival batch (board_metered=false).",
            "fn": pilot_1_lut6_prefix_gate,
        },
        {
            "topic_id": "TF-2026-02",
            "title": "SepJ-Inspired Quorum-Hysteresis Circuit Breaker for Byzantine Agent DAGs",
            "vector_ids": ["multiagent-byzantine-flow", "quorum-bio-neural-bci"],
            "openie_anchors": ["communication-avalanche", "three-body", "gates"],
            "hypothesis": "Combining keyed BLAKE2b envelope attestation with a 2-strike SepJ-style node quarantine and >=3-of-5 cooperative quorum threshold isolates 25% Byzantine poisoners with 0 corrupted commits.",
            "shape_d_null_baseline": "Unattested 3-of-5 majority-vote broadcast relay across 2,500 rounds on a 16-node graph with 4 adversarial corruptors.",
            "kill_criterion": "Kill if candidate_false_commits > 0 across 2,500 rounds OR healthy quorum goodput falls below 90.0%.",
            "target_joule_bound": "<= 1.0 mJ per attested 5-edge committee round on Linux RAPL (reported_j).",
            "fn": pilot_2_quorum_circuit_breaker,
        },
        {
            "topic_id": "TF-2026-03",
            "title": "Epoch-Salted Horizon Commitments Against Precomputed Rainbow Chains",
            "vector_ids": ["deterministic-sim-tmt"],
            "openie_anchors": ["time-as-an-index", "deterministic-null", "rce-vc"],
            "hypothesis": "Binding state-transition digests to fresh per-epoch randomness beacons collapses offline Hellman T*M^2=N^2 chain inversions to 0/400 while adding <10 microseconds per transition.",
            "shape_d_null_baseline": "Unsalted 18-bit truncated SHA-256 transition domain probed by a precomputed (M=1,536, t=96) Hellman table across 400 targets.",
            "kill_criterion": "Kill if any precomputed chain inverts an epoch-salted target (salted_horizon_inversions > 0) OR per-step latency > 10 us.",
            "target_joule_bound": "<= 500 uJ per 400 salted transition checks (Linux RAPL reported_j).",
            "fn": pilot_3_salted_horizon_tmt,
        },
        {
            "topic_id": "TF-2026-04",
            "title": "Operator-Aware De Bruijn Memoization for Multi-Target State Lowering",
            "vector_ids": ["formal-lean4-statemachines"],
            "openie_anchors": ["rce-compile", "rce", "rce-jepa"],
            "hypothesis": "Positional De Bruijn indexing (#0, #1) combined with commutative child sorting strictly on associative/commutative ops achieves 100% alpha-equivalent cache hits with 0% non-commutative swap collisions.",
            "shape_d_null_baseline": "Raw source-text SHA-256 compiler cache (0% rename reuse) and naive identifier-stripped structural hash across 2,000 fuzzed AST pairs.",
            "kill_criterion": "Kill if non-commutative false collisions (a - b vs b - a) > 0 OR alpha-equivalent hit rate < 95.0%.",
            "target_joule_bound": "<= 25 mJ per 2,000 AST canonicalization checks (Linux RAPL reported_j).",
            "fn": pilot_4_debruijn_memoization,
        },
        {
            "topic_id": "TF-2026-05",
            "title": "Sub-10ms Adaptive Beta-Burst Stimulation Attribution on Shared Silicon",
            "vector_ids": ["quorum-bio-neural-bci", "energy-joules-token"],
            "openie_anchors": ["satb-harness", "communication-avalanche", "mei"],
            "hypothesis": "Thresholded beta-envelope gating cuts neuro-stimulation pulse count >3x versus continuous 130 Hz pacing, and package-level RAPL counters can attribute 8 ms micro-burst windows within <=15% CV.",
            "shape_d_null_baseline": "Continuous 130 Hz pulse train plus SATB Falsifier 6 window-stability check across 40 consecutive 8 ms Linux RAPL windows.",
            "kill_criterion": "Place on HOLD_NEEDS_HARDWARE if 8 ms shared-host RAPL window CV exceeds SATB Falsifier 6 (15.0% CV), requiring TI INA238 inline DC shunts.",
            "target_joule_bound": "Requires physical inline shunt measured_j (TI INA238 / KV260 INA260); RAPL reported_j withheld on micro-windows.",
            "fn": pilot_5_adbs_microburst_telemetry,
        },
        {
            "topic_id": "TF-2026-06",
            "title": "Dense 3-Layer MLP Bucket Router for Q32.32 Broadphase Collision Pruning",
            "vector_ids": ["deterministic-sim-tmt", "energy-joules-token"],
            "openie_anchors": ["deterministic-null", "game-engines", "agency"],
            "hypothesis": "A learned 3-layer dense neural router (2 -> 64 -> 32 -> 16) predicts collision buckets for 256 Q32.32 fixed-point bodies faster and more accurately per joule than deterministic integer spatial hashing.",
            "shape_d_null_baseline": "Zero-parameter Shape-D bit-shifted integer grid ((x >> 15), (y >> 15)) with 3x3 neighbor stencil, 0 learned weights, bit-exact.",
            "kill_criterion": "KILL (KILLED_BY_NULL) if zero-parameter Shape-D integer grid matches or beats the MLP router on exact pair recall AND uses less time/reported_j.",
            "target_joule_bound": "Must beat Shape-D integer grid reported_j at 100.0% collision pair recall (FAILED -> KILLED_BY_NULL).",
            "fn": pilot_6_mlp_vs_shaped_broadphase,
        },
    ]

    topics_out: list[dict[str, Any]] = []
    status_counts = {"PROMOTED_CANDIDATE": 0, "HOLD_NEEDS_HARDWARE": 0, "KILLED_BY_NULL": 0}
    for sp in specs:
        res = sp["fn"]()
        st = res["status"]
        status_counts[st] = status_counts.get(st, 0) + 1
        receipt_raw = json.dumps({"id": sp["topic_id"], "res": res}, sort_keys=True).encode("utf-8")
        receipt_sha = hashlib.sha256(receipt_raw).hexdigest()[:24]
        topics_out.append({
            "topic_id": sp["topic_id"],
            "title": sp["title"],
            "status": st,
            "openie_anchors": sp["openie_anchors"],
            "inspired_by_urls": pick_urls(items, sp["vector_ids"], k=3),
            "hypothesis": sp["hypothesis"],
            "shape_d_null_baseline": sp["shape_d_null_baseline"],
            "kill_criterion": sp["kill_criterion"],
            "target_joule_bound": sp["target_joule_bound"],
            "pilot_receipt": {
                **res,
                "receipt_sha256": receipt_sha,
                "telemetry_source": "Linux powercap intel-rapl:0 (package-0 reported_j, board_metered=false)" if rapl_available else "Deterministic wall-clock + op-count harness (board_metered=false)",
            },
        })

    total_s = round(time.perf_counter() - t_start, 3)
    payload = {
        "schema": "openie.radio.topic_foundry.v1",
        "executed_at_utc": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "cadence_hours": 6,
        "pilot_budget_limit_sec": 60.0,
        "total_pilot_wall_sec": total_s,
        "execution_substrate": f"Linux {platform.machine()} deterministic Python {platform.python_version()} harness (RAPL reported_j={rapl_available}, board_metered=false, measured_j=null)",
        "counts_by_status": status_counts,
        "topics": topics_out,
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return payload


if __name__ == "__main__":
    import sys

    r_p = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("state/radio-radar.json")
    o_p = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("state/topic-foundry.json")
    out = run_foundry(r_p, o_p)
    print(f"Executed 6 deterministic pilots in {out['total_pilot_wall_sec']}s -> {o_p} | counts={out['counts_by_status']}")
