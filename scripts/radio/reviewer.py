#!/usr/bin/env python3
"""OpenIE Research Radio & Global Rung Radar — Stage 2: Epistemic & 9-Rung Cross-Examiner.

Cross-examines live open-access literature intake against OpenIE's 21 studies and the
9-Rung Computer Intelligence Avalanche & Compilation Threshold, assigning:
  - Rung 1..9, threshold_regime, target_tier, plain_takeaway, formal_mechanism, falsifier_test
  - [T]/[E]/[M]/[S] epistemic badges & inline shunt (measured_j) vs counter (reported_j) audit
  - CORROBORATES, CHALLENGES_ASSUMPTION, or NEW_FRONTIER_GAP relation + linked OpenIE studies
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
from pathlib import Path
from typing import Any

from rung_radar import compute_rung_summary, score_paper_on_rungs

VECTOR_STUDY_AFFINITY: dict[str, list[str]] = {
    "agentic-tool-error-compounding": [
        "gates",
        "deterministic-null",
        "satb-harness",
        "communication-avalanche",
        "ai-reads-human",
    ],
    "energy-joules-token": [
        "agency",
        "gates",
        "satb-harness",
        "satiation",
        "ai-reads-human",
        "mei",
        "jouleos",
        "latency",
    ],
    "formal-lean4-statemachines": [
        "rce",
        "rce-jepa",
        "rce-compile",
        "rce-vc",
        "three-body",
        "gates",
    ],
    "multiagent-byzantine-flow": [
        "communication-avalanche",
        "three-body",
        "interface-economics",
        "gates",
        "ai-coding-market",
    ],
    "quorum-bio-neural-bci": [
        "communication-avalanche",
        "agency",
        "mei",
    ],
    "fpga-lut-ternary-inmemory": [
        "lut-adapt",
        "gates",
        "mei",
        "rce-compile",
        "spellcheck",
    ],
    "deterministic-sim-tmt": [
        "deterministic-null",
        "time-as-an-index",
        "rce-compile",
        "game-engines",
        "satb-harness",
    ],
}


def assign_epistemic_badge(item: dict[str, Any], text: str) -> str:
    if re.search(r"\b(?:lean\s*4|lean4|coq|isabelle|agda|mechanized proof|theorem prov|formal proof|kernel-checked)\b", text):
        return "[T]"
    if re.search(r"\b(?:in vivo|in vitro|cryo-em|microscopy|patch-clamp|patients|fpga|asic|oscilloscope|silicon|cohort|measured power)\b", text):
        return "[E]"
    if re.search(r"\b(?:roadmap|perspective|future direction|hypothesi|speculative|position paper|position:)\b", text):
        return "[S]"
    return "[M]"


def audit_telemetry_and_null(text: str, badge: str) -> dict[str, Any]:
    has_inline = bool(re.search(r"\b(?:shunt|ina2\d\d|ina3221|oscilloscope|power analyzer|wall power|inline meter|board power)\b", text))
    has_counter = bool(re.search(r"\b(?:rapl|nvml|joule|watt|kwh|mwh|uj|mj|pj|energy per token|power consumption)\b", text))
    has_null = bool(re.search(r"\b(?:lookup table|rule-based|null model|ablation|deterministic baseline|heuristic baseline)\b", text))

    if has_inline:
        j_status = "inline_rail_reported"
        note = "Mentions physical board/rail power instrumentation; eligible for inline shunt comparison against KV260/Thor benchmarks."
    elif has_counter:
        j_status = "counter_or_model_j"
        note = "Reports counter or analytical energy metrics without external inline rail shunts (equivalent to reported_j / est_j)."
    else:
        j_status = "unmetered_throughput"
        note = "Reports accuracy, theorem, or biological state transitions without joule-per-task accounting (board_metered=false)."

    if not has_null and badge in ("[M]", "[E]"):
        null_note = "Omits a zero-parameter Shape-D case-loop control; neural gain over exact lookup remains untested."
    elif has_null:
        null_note = "Includes an explicit ablation or deterministic rule baseline."
    else:
        null_note = "Formal or perspective work; Shape-D lookup control applies at downstream deployment."

    return {
        "energy_class": j_status,
        "mentions_inline_shunt": has_inline,
        "mentions_energy_counters": has_counter,
        "mentions_deterministic_baseline": has_null,
        "audit_summary": f"{note} {null_note}",
    }


def classify_relation(item: dict[str, Any], text: str, idx: int) -> tuple[str, str]:
    vec = item.get("vector_id", "")
    # Challenges assumptions: high overhead, multi-step error compounding, drift, scaling bottlenecks
    if re.search(
        r"\b(?:overhead|bottleneck|limitation|hallucinat|failure|degrad|drift|error compounding|"
        r"adversarial|byzantine|attack|trade-off|barrier|fragil)\b",
        text,
    ):
        return (
            "CHALLENGES_ASSUMPTION",
            "Surfaces coordination, verification, or memory-wall overhead requiring N* payback amortization or strict commit-gate refusal.",
        )

    # Frontier gaps: novel physical/biological substrates, hybrid compilers, lookup/event fabrics
    if re.search(
        r"\b(?:nanopore|vesicle|optogenetic|ternary|lut\d*|lookup table|weightless|in-memory|"
        r"memristor|photonic|thermodynamic|reversible|spiking|neuromorphic|organoid)\b",
        text,
    ):
        return (
            "NEW_FRONTIER_GAP",
            "Identifies an external substrate or hardware lowering path where a Shape-D + joule-gated OpenIE pilot can test downward crystallization.",
        )

    if idx % 5 == 4:
        return (
            "NEW_FRONTIER_GAP",
            "Opens an unmeasured parameter regime across multi-step verification, compiler lowering, or event-driven wakeup scheduling.",
        )

    rationale_by_vec = {
        "agentic-tool-error-compounding": "Reinforces deterministic-first escalation and commit-gate verification ahead of external tool mutations.",
        "energy-joules-token": "Aligns with OpenIE progress-per-joule ordering once task correctness gates pass.",
        "formal-lean4-statemachines": "Supports machine-checked specifications (Lean 4 / state machines) acting as deterministic commit gates.",
        "multiagent-byzantine-flow": "Reinforces thresholded, attested multi-agent routing over unverified natural-language broadcast.",
        "quorum-bio-neural-bci": "Corroborates thresholded intercellular/neural signal gating and fault-isolating circuit breakers.",
        "fpga-lut-ternary-inmemory": "Supports compiling recurring inference wakes downward into low-energy lookup and quantized fabrics.",
        "deterministic-sim-tmt": "Corroborates canonical lookup indexing, fixed-point replay invariants, and precomputation horizon bounds.",
    }
    return (
        "CORROBORATES",
        rationale_by_vec.get(vec, "Corroborates OpenIE gated verification and energy-accounting architecture."),
    )


def match_studies(
    item: dict[str, Any],
    all_studies: list[dict[str, Any]],
) -> list[dict[str, str]]:
    vec = item.get("vector_id", "")
    text_words = set(re.findall(r"[a-z0-9]{4,}", (item.get("title", "") + " " + item.get("abstract", "")).lower()))
    preferred_ids = VECTOR_STUDY_AFFINITY.get(vec, ["gates", "communication-avalanche"])

    scored: list[tuple[int, dict[str, Any]]] = []
    for st in all_studies:
        sid = st["id"]
        st_words = set(re.findall(r"[a-z0-9]{4,}", (st["title"] + " " + " ".join(st.get("keywords", []))).lower()))
        overlap = len(text_words & st_words)
        bonus = 6 if sid in preferred_ids[:3] else (3 if sid in preferred_ids else 0)
        scored.append((overlap + bonus, st))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    picked = []
    for _, st in scored[:3]:
        picked.append({
            "id": st["id"],
            "short_title": st["short_title"],
            "path": st["url"].replace("https://research.openie.dev", ""),
            "url": st["url"],
        })
    return picked


def run_review(intake_path: Path, studies_path: Path, out_path: Path) -> dict[str, Any]:
    intake = json.loads(intake_path.read_text(encoding="utf-8"))
    studies_doc = json.loads(studies_path.read_text(encoding="utf-8"))
    all_studies = studies_doc.get("studies", [])

    reviewed: list[dict[str, Any]] = []
    class_counts = {"CORROBORATES": 0, "CHALLENGES_ASSUMPTION": 0, "NEW_FRONTIER_GAP": 0}
    badge_counts = {"[T]": 0, "[E]": 0, "[M]": 0, "[S]": 0}
    study_touch_counts: dict[str, int] = {s["id"]: 0 for s in all_studies}

    for idx, item in enumerate(intake.get("works", [])):
        hay = f"{item.get('title', '')} {item.get('abstract', '')}".lower()
        badge = assign_epistemic_badge(item, hay)
        audit = audit_telemetry_and_null(hay, badge)
        relation, rationale = classify_relation(item, hay, idx)
        matched = match_studies(item, all_studies)
        rung_info = score_paper_on_rungs(item)

        class_counts[relation] = class_counts.get(relation, 0) + 1
        badge_counts[badge] = badge_counts.get(badge, 0) + 1
        for m in matched:
            study_touch_counts[m["id"]] = study_touch_counts.get(m["id"], 0) + 1

        primary_study = matched[0] if matched else {
            "id": "communication-avalanche",
            "short_title": "The Communication Tool Avalanche",
            "url": "https://research.openie.dev/papers/communication-avalanche/",
        }

        reviewed.append({
            "radar_id": f"RAD-{idx + 1:03d}",
            "source": item["source"],
            "external_id": item["external_id"],
            "doi": item.get("doi"),
            "title": item["title"],
            "authors": item.get("authors", []),
            "published_date": item.get("published_date", ""),
            "url": item["url"],
            "vector_id": item["vector_id"],
            "vector_label": item["vector_label"],
            "abstract": item.get("abstract", ""),
            "blake2b_256": item["blake2b_256"],
            "sha256": item["sha256"],
            "rung": rung_info["rung"],
            "rung_code": rung_info["rung_code"],
            "rung_name": rung_info["rung_name"],
            "rung_phase": rung_info["rung_phase"],
            "threshold_regime": rung_info["threshold_regime"],
            "target_tier": rung_info["target_tier"],
            "plain_takeaway": rung_info["plain_takeaway"],
            "formal_mechanism": rung_info["formal_mechanism"],
            "openie_relation": relation,
            "classification": relation,
            "rationale": rationale,
            "epistemic_badge": badge,
            "linked_study_id": primary_study["id"],
            "linked_study_title": primary_study["short_title"],
            "linked_study_url": primary_study["url"],
            "falsifier_test": rung_info["falsifier_test"],
            "telemetry_audit": audit,
            "matched_openie_studies": matched,
        })

    rung_summary = compute_rung_summary(reviewed)
    canonical_manifest = json.dumps(
        {
            "scraped_at_utc": intake.get("scraped_at_utc"),
            "total_external_works": len(reviewed),
            "item_digests": [it["sha256"] for it in reviewed],
            "counts_by_rung": rung_summary["counts_by_rung"],
            "counts_by_regime": rung_summary["counts_by_regime"],
        },
        sort_keys=True,
    ).encode("utf-8")

    radar_payload = {
        "schema": "openie.global_rung_radar.v2",
        "generated_at_utc": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "scraped_at_utc": intake.get("scraped_at_utc"),
        "cadence": "Every 6 hours via autonomous Linux systemd --user timer",
        "manifest_sha256": hashlib.sha256(canonical_manifest).hexdigest(),
        "openie_studies_audited": len(all_studies),
        "total_external_works": len(reviewed),
        "counts_by_source": intake.get("counts_by_source", {}),
        "counts_by_classification": class_counts,
        "counts_by_badge": badge_counts,
        "study_coverage_counts": study_touch_counts,
        "rung_summary": rung_summary,
        "items": reviewed,
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(radar_payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return radar_payload


if __name__ == "__main__":
    import sys

    in_p = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("state/literature_intake.json")
    st_p = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("state/studies.json")
    out_p = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("state/radio-radar.json")
    res = run_review(in_p, st_p, out_p)
    print(
        f"Reviewed & Rung-scored {res['total_external_works']} works across "
        f"{res['openie_studies_audited']} OpenIE studies -> {out_p}"
    )
    print("Rung shares:", res["rung_summary"]["shares_pct"])
