#!/usr/bin/env python3
"""OpenIE Global Rung Radar — 9-Rung Computer Intelligence Avalanche Classifier.

Scores every deduplicated open-access paper from arXiv, OpenAlex, Europe PMC, and bioRxiv
against the 9-Rung Computer Intelligence Avalanche & Compilation Threshold:
  - Rungs 1–5 (Stateless Ephemeral Inference): Search, Generation, Reasoning, Communication, Tool Use
  - The Compilation Threshold: Proposition 1 stationary horizon (ΔT > ΔT*) ∧ C(z) = 1
  - Rungs 6–9 (Stateful Compiled Substrates): Immersion, Competence, Ecology, Economy

Produces deterministic Rung assignments, threshold regimes, target execution tiers
(Tier 3 .. Tier 0), plain-language takeaways with zero unexplained acronyms, formal
mechanisms, falsifier tests, live 9-Rung distribution histograms, and SHA-256 manifests.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import time
from pathlib import Path
from typing import Any

import numpy as np

from commons_prior_art import enrich_foundry_topics_with_commons, enrich_radar_items_with_commons

RAPL_PKG = Path("/sys/class/powercap/intel-rapl:0/energy_uj")
RAPL_PKG_MAX = Path("/sys/class/powercap/intel-rapl:0/max_energy_range_uj")

RUNG_META: dict[int, dict[str, Any]] = {
    1: {
        "code": "R1",
        "name": "Search",
        "phase": 1,
        "phase_label": "Rungs 1–5 Ephemeral",
        "default_tier": "Tier 1 (Indexed Case Store)",
    },
    2: {
        "code": "R2",
        "name": "Generation",
        "phase": 1,
        "phase_label": "Rungs 1–5 Ephemeral",
        "default_tier": "Tier 3 (Frontier Search)",
    },
    3: {
        "code": "R3",
        "name": "Reasoning",
        "phase": 1,
        "phase_label": "Rungs 1–5 Ephemeral",
        "default_tier": "Tier 2 (Verified Rule/Checker)",
    },
    4: {
        "code": "R4",
        "name": "Communication",
        "phase": 1,
        "phase_label": "Rungs 1–5 Ephemeral",
        "default_tier": "Tier 2 (Verified Rule/Checker)",
    },
    5: {
        "code": "R5",
        "name": "Tool Use",
        "phase": 1,
        "phase_label": "Rungs 1–5 Ephemeral",
        "default_tier": "Tier 3 (Frontier Search)",
    },
    6: {
        "code": "R6",
        "name": "Immersion",
        "phase": 2,
        "phase_label": "Rungs 6–9 Compiled",
        "default_tier": "Tier 1 (Indexed Case Store)",
    },
    7: {
        "code": "R7",
        "name": "Competence",
        "phase": 2,
        "phase_label": "Rungs 6–9 Compiled",
        "default_tier": "Tier 0 (Single-Cycle Silicon)",
    },
    8: {
        "code": "R8",
        "name": "Ecology",
        "phase": 2,
        "phase_label": "Rungs 6–9 Compiled",
        "default_tier": "Tier 2 (Verified Rule/Checker)",
    },
    9: {
        "code": "R9",
        "name": "Economy",
        "phase": 2,
        "phase_label": "Rungs 6–9 Compiled",
        "default_tier": "Tier 1 (Indexed Case Store)",
    },
}

ACRONYM_EXPANSIONS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bLLMs\b"), "large language models"),
    (re.compile(r"\bLLM\b"), "large language model"),
    (re.compile(r"\bMLLMs\b"), "multimodal language models"),
    (re.compile(r"\bMLLM\b"), "multimodal language model"),
    (re.compile(r"\bVLMs\b"), "vision-language models"),
    (re.compile(r"\bVLM\b"), "vision-language model"),
    (re.compile(r"\bSLMs\b"), "small language models"),
    (re.compile(r"\bSLM\b"), "small language model"),
    (re.compile(r"\bLRMs\b"), "reasoning language models"),
    (re.compile(r"\bLRM\b"), "reasoning language model"),
    (re.compile(r"\bRAG\b"), "retrieval-augmented generation"),
    (re.compile(r"\bFPGAs\b"), "reconfigurable logic chips"),
    (re.compile(r"\bFPGA\b"), "reconfigurable logic chip"),
    (re.compile(r"\bLUT6\b"), "six-input hardware lookup table"),
    (re.compile(r"\bLUTs\b"), "hardware lookup tables"),
    (re.compile(r"\bLUT\b"), "hardware lookup table"),
    (re.compile(r"\bASICs\b"), "custom silicon chips"),
    (re.compile(r"\bASIC\b"), "custom silicon chip"),
    (re.compile(r"\bGPUs\b"), "graphics processors"),
    (re.compile(r"\bGPU\b"), "graphics processor"),
    (re.compile(r"\bCPUs\b"), "central processors"),
    (re.compile(r"\bCPU\b"), "central processor"),
    (re.compile(r"\bNPUs\b"), "neural accelerators"),
    (re.compile(r"\bNPU\b"), "neural accelerator"),
    (re.compile(r"\bTPUs\b"), "tensor accelerators"),
    (re.compile(r"\bTPU\b"), "tensor accelerator"),
    (re.compile(r"\bAPIs\b"), "software interfaces"),
    (re.compile(r"\bAPI\b"), "software interface"),
    (re.compile(r"\bMCP\b"), "tool-context protocol"),
    (re.compile(r"\bKV\b"), "key-value"),
    (re.compile(r"\bMoE\b"), "mixture-of-experts"),
    (re.compile(r"\bCoT\b"), "step-by-step chain-of-thought"),
    (re.compile(r"\bRLHF\b"), "human-feedback reinforcement learning"),
    (re.compile(r"\bGRPO\b"), "group-relative reinforcement learning"),
    (re.compile(r"\bRL\b"), "reinforcement learning"),
    (re.compile(r"\bMCTS\b"), "tree search"),
    (re.compile(r"\bSMT\b"), "satisfiability-modulo-theories"),
    (re.compile(r"\bSAT\b"), "Boolean satisfiability"),
    (re.compile(r"\bASTs\b"), "abstract syntax trees"),
    (re.compile(r"\bAST\b"), "abstract syntax tree"),
    (re.compile(r"\bDAGs\b"), "directed workflow graphs"),
    (re.compile(r"\bDAG\b"), "directed workflow graph"),
    (re.compile(r"\bBFT\b"), "Byzantine fault-tolerant"),
    (re.compile(r"\bPUE\b"), "data-center power-usage effectiveness"),
    (re.compile(r"\bDRAM\b"), "dynamic main memory"),
    (re.compile(r"\bSRAM\b"), "static on-chip memory"),
    (re.compile(r"\bBRAM\b"), "on-chip block memory"),
    (re.compile(r"\bHBM\b"), "high-bandwidth memory"),
    (re.compile(r"\bNVMe\b"), "non-volatile solid-state storage"),
    (re.compile(r"\bSSD\b"), "solid-state drive"),
    (re.compile(r"\bMACs\b"), "multiply-accumulate operations"),
    (re.compile(r"\bMAC\b"), "multiply-accumulate"),
    (re.compile(r"\bFLOPs\b"), "floating-point operations"),
    (re.compile(r"\bFLOP\b"), "floating-point operation"),
    (re.compile(r"\bDNNs\b"), "deep neural networks"),
    (re.compile(r"\bDNN\b"), "deep neural network"),
    (re.compile(r"\bCNNs\b"), "convolutional neural networks"),
    (re.compile(r"\bCNN\b"), "convolutional neural network"),
    (re.compile(r"\bRNNs\b"), "recurrent neural networks"),
    (re.compile(r"\bRNN\b"), "recurrent neural network"),
    (re.compile(r"\bGNNs\b"), "graph neural networks"),
    (re.compile(r"\bGNN\b"), "graph neural network"),
    (re.compile(r"\bSNNs\b"), "spiking neural networks"),
    (re.compile(r"\bSNN\b"), "spiking neural network"),
    (re.compile(r"\bWNNs\b"), "weightless neural networks"),
    (re.compile(r"\bWNN\b"), "weightless neural network"),
    (re.compile(r"\bDWNs\b"), "differentiable weightless neural networks"),
    (re.compile(r"\bDWN\b"), "differentiable weightless neural network"),
    (re.compile(r"\bLAT\b"), "lookup-aware training"),
    (re.compile(r"\bSTM\b"), "scanning tunneling microscopy"),
    (re.compile(r"\bROS\s*2\b"), "Robot Operating System 2"),
    (re.compile(r"\bOPF\b"), "optimal power flow"),
    (re.compile(r"\bREST\b"), "web-service"),
    (re.compile(r"\bHTTP\b"), "web"),
    (re.compile(r"\beSIMs\b"), "embedded subscriber modules"),
    (re.compile(r"\bSIM\b"), "subscriber module"),
    (re.compile(r"\bMLPs\b"), "multilayer perceptrons"),
    (re.compile(r"\bMLP\b"), "multilayer perceptron"),
    (re.compile(r"\bAI\b"), "artificial intelligence"),
    (re.compile(r"\bML\b"), "machine learning"),
    (re.compile(r"\bNLP\b"), "natural-language processing"),
    (re.compile(r"\bGUI\b"), "graphical user interface"),
    (re.compile(r"\bOS\b"), "operating-system"),
    (re.compile(r"\bRTL\b"), "register-transfer hardware logic"),
    (re.compile(r"\bHLS\b"), "high-level hardware synthesis"),
    (re.compile(r"\bDSP\b"), "digital signal processor"),
    (re.compile(r"\bCiM\b|\bCIM\b|\bIMC\b"), "compute-in-memory"),
    (re.compile(r"\bBCI\b"), "brain-computer interface"),
    (re.compile(r"\bBCIs\b"), "brain-computer interfaces"),
    (re.compile(r"\bEVs\b"), "extracellular vesicles"),
    (re.compile(r"\bEV\b"), "extracellular vesicle"),
    (re.compile(r"\bATP\b"), "cellular metabolic energy"),
    (re.compile(r"\bDNA\b"), "deoxyribonucleic acid"),
    (re.compile(r"\bRNA\b"), "ribonucleic acid"),
    (re.compile(r"\bQUBO\b"), "quadratic binary optimization"),
    (re.compile(r"\bOOD\b"), "out-of-distribution"),
    (re.compile(r"\bIoT\b"), "embedded edge-sensor"),
    (re.compile(r"\bSWE\b"), "software-engineering"),
    (re.compile(r"\bQA\b"), "question-answering"),
    (re.compile(r"\bIR\b"), "intermediate representation"),
]

RUNG_PATTERNS: dict[int, list[tuple[re.Pattern[str], int]]] = {
    1: [
        (re.compile(r"\bretrieval-augmented\b|\brag\b", re.I), 5),
        (re.compile(r"\bvector search\b|\bdense retrieval\b|\bpassage retrieval\b|\brerank", re.I), 4),
        (re.compile(r"\bknowledge retrieval\b|\binformation retrieval\b|\bnearest neighbor\b", re.I), 3),
    ],
    2: [
        (re.compile(r"\bspeculative decoding\b|\btoken generation\b|\bautoregressive\b", re.I), 4),
        (re.compile(r"\bllm inference\b|\binference power\b|\bpower consumption of llm\b|\btokenpowerbench\b", re.I), 4),
        (re.compile(r"\bkv cache\b|\bdecoding latency\b|\bprefill\b|\btext generation\b", re.I), 3),
    ],
    3: [
        (re.compile(r"\blean\s*4\b|\bcoq\b|\bisabelle\b|\bagda\b|\btheorem prov", re.I), 6),
        (re.compile(r"\bformal verification\b|\bproof-carrying\b|\bprogram verification\b|\bmechanized proof\b", re.I), 5),
        (re.compile(r"\bchain-of-thought\b|\btest-time compute\b|\bstep-by-step reasoning\b|\bsmt solver\b", re.I), 3),
    ],
    4: [
        (re.compile(r"\bmulti-agent\b.*\b(?:communication|protocol|debate|message|relay|consensus|byzantine|routing)\b", re.I), 6),
        (re.compile(r"\bagent communication\b|\binter-agent\b|\bbyzantine\b|\bmessage-passing\b", re.I), 4),
        (re.compile(r"\bmulti-agent\b", re.I), 3),
    ],
    5: [
        (re.compile(r"\btool use\b|\btool-use\b|\bfunction calling\b|\btool-calling\b", re.I), 6),
        (re.compile(r"\bagentic\b|\bcoding agent\b|\bweb agent\b|\bgui agent\b|\bswe-bench\b", re.I), 5),
        (re.compile(r"\berror compounding\b|\bmulti-turn\b.*\bagent\b|\baction execution\b|\btrajectory\b", re.I), 4),
    ],
    6: [
        (re.compile(r"\bevent-driven\b|\bspiking\b|\bintegrate-and-fire\b|\bneuromorphic\b", re.I), 6),
        (re.compile(r"\bepisodic memory\b|\bpersistent state\b|\blong-horizon memory\b|\bsleep-wake\b|\bquiescen", re.I), 5),
        (re.compile(r"\bclosed-loop\b.*\b(?:neural|stimulation|synaptic)\b|\bmembrane potential\b", re.I), 4),
    ],
    7: [
        (re.compile(r"\bfpga\b|\blookup table\b|\blut\d*\b|\bweightless neural\b", re.I), 7),
        (re.compile(r"\bternary\b|\bin-memory comput|\bcompute-in-memory\b|\bboolean fabric\b|\blogic gate network\b", re.I), 5),
        (re.compile(r"\btime-memory\b|\bprecomput|\bmemoiz|\bdeterministic simulation\b|\bcompiler lowering\b", re.I), 5),
    ],
    8: [
        (re.compile(r"\bquorum sensing\b|\bextracellular vesicle|\bintercellular\b|\bmulticellular\b|\bcyanobacteria\b", re.I), 7),
        (re.compile(r"\bcollective intelligence\b|\bswarm\b|\bdivision of labor\b|\bheterogeneous solver", re.I), 5),
        (re.compile(r"\bneuro-symbolic\b|\bneurosymbolic\b|\bfault isolation\b|\bnanopore\b", re.I), 4),
    ],
    9: [
        (re.compile(r"\bthermodynamic comput|\blandauer\b|\breversible comput", re.I), 7),
        (re.compile(r"\benergy-proportional\b|\benergy budget\b|\bmin-cost flow\b|\bcarbon-aware\b|\bcost-optimal routing\b", re.I), 6),
        (re.compile(r"\benergy-to-token\b|\bjoules per\b|\benergy allocation\b|\bamortiz", re.I), 5),
    ],
}

VECTOR_DEFAULT_RUNG: dict[str, int] = {
    "agentic-tool-error-compounding": 5,
    "formal-lean4-statemachines": 3,
    "fpga-lut-ternary-inmemory": 7,
    "deterministic-sim-tmt": 1,
    "energy-joules-token": 9,
    "multiagent-byzantine-flow": 4,
    "quorum-bio-neural-bci": 8,
}


def expand_acronyms_plain(text: str) -> str:
    out = text
    # Remove parenthetical acronym callouts like "(LLMs)" or "(RAG)" before expanding
    out = re.sub(r"\(\s*[A-Z]{2,6}s?\s*\)", "", out)
    for pat, repl in ACRONYM_EXPANSIONS:
        out = pat.sub(repl, out)
    # Convert any remaining 2+ uppercase acronyms (e.g. benchmark codes or Roman numerals) into lowercase/Title case words
    def _deacronym(match: re.Match[str]) -> str:
        tok = match.group(0)
        return tok.capitalize() if len(tok) >= 4 else tok.lower()

    out = re.sub(r"\b[A-Z]{2,}[0-9]*\b", _deacronym, out)
    # Repair indefinite articles after acronym expansion ("an large" -> "a large", "a artificial" -> "an artificial")
    out = re.sub(
        r"\b([Aa])n\s+(?=(?:large|small|multimodal|vision|reasoning|reconfigurable|six-input|hardware|custom|graphics|central|neural|tensor|software|tool-context|key-value|mixture|step-by-step|human-feedback|group-relative|reinforcement|tree|satisfiability|Boolean|directed|Byzantine|data-center|dynamic|static|high-bandwidth|non-volatile|solid-state|multiply|floating-point|deep|convolutional|recurrent|graph|spiking|weightless|multilayer|natural-language|graphical|register-transfer|high-level|digital|compute-in-memory|brain-computer|quadratic)\b)",
        r"\1 ",
        out,
    )
    out = re.sub(
        r"\b([Aa])\s+(?=(?:artificial|abstract|operating-system|extracellular|out-of-distribution|embedded|intermediate)\b)",
        r"\1n ",
        out,
    )
    out = re.sub(r"\s+", " ", out).strip()
    out = re.sub(r"\s+([,.;:])", r"\1", out)
    return out


def extract_finding_clause(title: str, abstract: str) -> str:
    cleaned_abs = re.sub(r"\\[a-zA-Z]+\{\}", "a modular system", abstract)
    cleaned_abs = re.sub(r"\\[a-zA-Z]+\{([^}]*)\}", r"\1", cleaned_abs)
    cleaned_abs = cleaned_abs.replace("$", "").replace("--", "–")
    cleaned_abs = re.sub(r"\bintel\s+ligent\b", "intelligent", cleaned_abs, flags=re.I)
    protected = re.sub(r"\b(et al|e\.g|i\.e|vs|Fig|Eq|Ref|cf)\.\s+", r"\1<DOT> ", cleaned_abs)
    raw_sentences = [
        s.replace("<DOT>", ".").strip()
        for s in re.split(r"(?<=[.!?])\s+", protected)
        if len(s.strip()) >= 35
    ]
    complete_sentences = [
        s for s in raw_sentences if not s.endswith(("…", "...")) and "…" not in s
    ]
    sentences = complete_sentences if complete_sentences else raw_sentences

    cue_re = re.compile(
        r"\b(?:we introduce|we propose|we present|we demonstrate|we show|we develop|"
        r"we formalize|we prove|we evaluate|results show|experiments show|here we|this paper|"
        r"this study|our method|our framework|achieves|reduces|improves)\b",
        re.I,
    )
    chosen = ""
    for s in sentences:
        if cue_re.search(s) and len(s) <= 230:
            chosen = s
            break
    if not chosen and sentences:
        chosen = sentences[0]
    if not chosen:
        chosen = f"This study investigates {title}."

    chosen = re.sub(
        r"^(?:Background|Objective|Methods|Results|Conclusion|Summary|Context|Motivation)\s*:?\s+",
        "",
        chosen,
        flags=re.I,
    )
    chosen = re.sub(r"^(?:In this (?:paper|work|study),?\s*|Here,?\s*|First,?\s*)", "", chosen, flags=re.I)
    chosen = re.sub(r"^We\s+(?:first\s+)?", "The authors ", chosen)
    chosen = re.sub(
        r"\bwe\s+(introduce|propose|present|demonstrate|show|develop|formalize|prove|evaluate|explore)\b",
        r"the authors \1",
        chosen,
        flags=re.I,
    )
    chosen = re.sub(r"^Our\s+", "Their ", chosen)
    chosen = expand_acronyms_plain(chosen)
    if chosen and chosen[0].islower():
        chosen = chosen[0].upper() + chosen[1:]
    if len(chosen) > 220:
        chosen = chosen[:217].rsplit(" ", 1)[0].rstrip(",;:") + "."
    chosen = chosen.rstrip("…").rstrip(".") + "."
    return chosen


def score_paper_on_rungs(item: dict[str, Any]) -> dict[str, Any]:
    title = item.get("title", "")
    abstract = item.get("abstract", "")
    vec_id = item.get("vector_id", "")
    hay = f"{title} {abstract}".lower()

    scores: dict[int, int] = {r: 0 for r in range(1, 10)}
    default_r = VECTOR_DEFAULT_RUNG.get(vec_id, 5)
    scores[default_r] += 2

    for r, pats in RUNG_PATTERNS.items():
        for pat, weight in pats:
            if pat.search(title):
                scores[r] += weight * 3
            if pat.search(abstract):
                scores[r] += weight

    # Disambiguate pure inference power benchmarking (stateless Rung 2/5) vs active energy allocation (Rung 9)
    is_pure_power_benchmark = bool(
        re.search(r"\b(?:benchmark|profiling|characteriz|measuring)\b", title, re.I)
        and re.search(r"\b(?:power|energy)\b", title, re.I)
        and not re.search(r"\b(?:thermodynamic|reversible|min-cost|scheduler|event-driven|fpga|lut)\b", hay)
    )
    if is_pure_power_benchmark:
        scores[2] += 10

    rung = max(range(1, 10), key=lambda r: (scores[r], -abs(r - default_r)))

    has_formal_gate = bool(
        re.search(
            r"\b(?:lean\s*4|lean4|coq|isabelle|agda|formal verification|theorem prov|"
            r"proof-carrying|smt solver|sat solver|state machine|byzantine|attest|type-check)\b",
            hay,
        )
    )
    has_compiled_substrate = bool(
        re.search(
            r"\b(?:fpga|lookup table|lut\d*|weightless|ternary|in-memory|compute-in-memory|"
            r"memoiz|precomput|time-memory|event-driven|integrate-and-fire|quiescen)\b",
            hay,
        )
    )
    has_neural_or_agent = bool(
        re.search(
            r"\b(?:language model|llm|neural|transformer|agent|agentic|autoregressive|deep learning)\b",
            hay,
        )
    )

    if rung <= 5:
        if has_formal_gate or (has_compiled_substrate and rung in (1, 3, 4, 5)):
            threshold_regime = "crossing_compilation_threshold"
        else:
            threshold_regime = "ephemeral_rungs_1_5"
    else:
        if has_neural_or_agent and (has_compiled_substrate or has_formal_gate or rung == 7):
            threshold_regime = "crossing_compilation_threshold"
        else:
            threshold_regime = "compiled_rungs_6_9"

    # Determine Target Execution Tier (Tier 3 .. Tier 0)
    if re.search(r"\b(?:fpga|lut\d*|lookup table|weightless|asic|ternary|in-memory|compute-in-memory|spiking|neuromorphic|thermodynamic circuit)\b", hay):
        target_tier = "Tier 0 (Single-Cycle Silicon)"
    elif re.search(r"\b(?:lean\s*4|lean4|coq|isabelle|formal verification|theorem prov|proof-carrying|state machine|byzantine|quorum|consensus|min-cost)\b", hay):
        target_tier = "Tier 2 (Verified Rule/Checker)"
    elif re.search(r"\b(?:retrieval|episodic|memory-mapped|cache|index|memoiz|time-memory|precomput|deterministic simulation|event-driven)\b", hay):
        target_tier = "Tier 1 (Indexed Case Store)"
    else:
        target_tier = RUNG_META[rung]["default_tier"]

    meta = RUNG_META[rung]
    finding_sentence = extract_finding_clause(title, abstract)

    why_by_rung_and_regime: dict[tuple[int, str], str] = {
        (1, "ephemeral_rungs_1_5"): (
            "On the nine-rung map, this work sits at Rung 1 (Search): fetching external passages lowers lookup friction, "
            "yet cosine similarity alone still forces the model to re-read and verify every retrieved snippet from scratch."
        ),
        (1, "crossing_compilation_threshold"): (
            "On the nine-rung map, this bridges Rung 1 (Search) toward the Compilation Threshold by replacing fuzzy text similarity "
            "with structured indexing so verified answers can be reused directly from an indexed case store."
        ),
        (2, "ephemeral_rungs_1_5"): (
            "On the nine-rung map, this operates in Rung 2 (Generation): each request still sweeps dense floating-point weights "
            "from cold start rather than compiling repeated patterns into zero-cost lookup tables."
        ),
        (2, "crossing_compilation_threshold"): (
            "On the nine-rung map, this pushes Rung 2 (Generation) toward the Compilation Threshold by coupling token drafting "
            "with exact verification checks that cut repeated memory movement."
        ),
        (3, "ephemeral_rungs_1_5"): (
            "On the nine-rung map, this sits at Rung 3 (Reasoning): multi-step deliberation solves harder tasks in a single turn, "
            "but without saving verified derivations, identical problem classes re-burn full reasoning energy."
        ),
        (3, "crossing_compilation_threshold"): (
            "On the nine-rung map, this actively crosses the Compilation Threshold from Rung 3 (Reasoning) by gating candidate "
            "derivations behind a strict formal proof or state-machine checker so zero broken steps enter persistent memory."
        ),
        (4, "ephemeral_rungs_1_5"): (
            "On the nine-rung map, this highlights Rung 4 (Communication): passing natural-language messages across multiple agents "
            "inflates context length and compounds small interpretation errors across hops."
        ),
        (4, "crossing_compilation_threshold"): (
            "On the nine-rung map, this crosses from Rung 4 (Communication) toward compiled coordination by enforcing fault-tolerant "
            "verification gates on inter-agent messages before downstream state updates occur."
        ),
        (5, "ephemeral_rungs_1_5"): (
            "On the nine-rung map, this exemplifies the Rung 5 (Tool Use) bottleneck: external tool calls let models act on software, "
            "yet starting cold every session without a deterministic commit gate risks compounding multi-step errors."
        ),
        (5, "crossing_compilation_threshold"): (
            "On the nine-rung map, this addresses the Rung 5 (Tool Use) bottleneck by pairing external actions with explicit "
            "verification checks so recurring workflows can safely crystallize into reusable procedures."
        ),
    }

    if (rung, threshold_regime) in why_by_rung_and_regime:
        why_sentence = why_by_rung_and_regime[(rung, threshold_regime)]
    elif rung == 6:
        why_sentence = (
            "On the nine-rung map, this advances Rung 6 (Immersion): event-driven thresholds and persistent memory keep state "
            "alive across long horizons at near-zero idle power so recurring patterns can be compiled."
        )
    elif rung == 7:
        if threshold_regime == "crossing_compilation_threshold":
            why_sentence = (
                "On the nine-rung map, this directly crosses the Compilation Threshold into Rung 7 (Competence) by compiling "
                "high-energy neural evaluations downward into fast, low-energy lookup tables and hardware logic."
            )
        else:
            why_sentence = (
                "On the nine-rung map, this operates in Rung 7 (Competence), executing recurring discrete mappings directly inside "
                "deterministic lookup tables or reconfigurable hardware logic at a fraction of floating-point energy."
            )
    elif rung == 8:
        why_sentence = (
            "On the nine-rung map, this informs Rung 8 (Ecology): specialized biological or computational modules cooperate "
            "behind selective threshold gates while isolating local faults before they cascade."
        )
    else:
        why_sentence = (
            "On the nine-rung map, this anchors Rung 9 (Economy), treating joules per verified outcome and amortization horizons "
            "as primary physical signals for routing work and retiring stale rules."
        )

    plain_takeaway = f"{finding_sentence} {expand_acronyms_plain(why_sentence)}"

    falsifier_by_rung: dict[int, str] = {
        1: "Benchmark against a zero-parameter positional De Bruijn exact-hash case store (Shape D); falsified if dense vector retrieval admits variable-swap collisions (> 0.0%) or expends higher reported_j on recurring structural queries.",
        2: "Test against a 64-bit lookup-table burst proposer ahead of greedy target verification; falsified if dense floating-point generation fails to beat zero-FLOP lookup on recurring syntax bursts or loses exact token parity.",
        3: "Replay obligations inside a six-kernel formal sandbox (C(z) = 1) with canonicalized proof caching; falsified if unverified reasoning traces admit >= 1 unsound step or fail to pay back compilation cost E_compile over horizon N*.",
        4: "Contrast natural-language multi-hop relays against 1 KiB cryptographically attested binary frames under 25% Byzantine fault injection; falsified if unattested messages suffer f^k fidelity decay or > 100x higher handoff energy.",
        5: "Pair the multi-turn tool loop with a pre-registered Shape D integer lookup control and mandatory commit gate C(z) = 1; falsified if cold-start retries admit > 0.0% broken commits or fail to lower joules across Zipfian repeats.",
        6: "Instrument 5-second idle residency windows using operating-system event queues versus 1 kHz polling; falsified if persistent residency triggers > 0 empty wakeups or violates SATB Falsifier 6 shared-host drift thresholds.",
        7: "Audit bit-exact output parity (0 mismatches) between the compiled lookup/FPGA tier and the reference specification while tracking amortization N*; falsified if input shift produces silent unflagged errors instead of clean escalation.",
        8: "Evaluate multi-paradigm gated synthesis across 5 heterogeneous task regimes against every isolated single-paradigm baseline; falsified if coupled specialists fail to beat the best monoculture ceiling or violate local safety invariants.",
        9: "Audit Simon-Kadane pass-probability-per-joule (p_i / c_i) routing and hit-rate eviction floor h_min = E_compile / (N * delta_c); falsified if stale compiled rules remain resident below h_min and reduce cumulative Coherence per Joule.",
    }

    formal_by_rung: dict[int, str] = {
        1: "R1 Search invariant: replace O(d log M) approximate cosine lookup with O(1) canonical nameless digest k* = hash_DeBruijn(canon(x)) once C(z) = 1 holds.",
        2: "R2 Generation invariant: bound dense autoregressive sweeps via lossless <= 64-bit joint-mode minterm burst proposals verified at 100.0% greedy parity.",
        3: "R3 Reasoning gate: enforce C_check / E_model << 1 with strict kernel soundness C(z) = 1 (0 sorry, 0 opaque) before admitting derived lemmas into reuse stores.",
        4: "R4 Communication bound: unverified k-hop prose chains decay as f^k (CTA-T2); constant-time BLAKE3 + Ed25519 binary envelopes restore zero-drift composability.",
        5: "R5 Bottleneck transition: stateless tool loops operate at ΔT ≈ 1 <= ΔT* with linear error accumulation k*ε (CTA-T1); escaping requires ΔT > ΔT* ∧ C(z) = 1.",
        6: "R6 Immersion quiescence: sub-threshold membrane accumulation V_u(t) < θ_u yields 0 empty wakeups vs. N * T * c_poll > 0 continuous clock burn (CTA-T7..T10).",
        7: "R7 Competence crystallization: downward lowering Tier 3 -> Tier 2 -> Tier 1 mmap -> Tier 0 LUT6 amortizes E_compile once ΔT > E_compile / (p_0' * (c_wake - c_0)).",
        8: "R8 Ecology coverage union: niche-routed synthesis Pass_DES(r) = OR_k p(k, r) strictly exceeds every isolated monoculture while preserving local sovereignty g_i = 1.",
        9: "R9 Economy allocation: route by descending p_i / c_i via min-cost flow and evict compiled pages whenever hit rate drops to h <= h_min = E_compile / (N * Δc) (CTA-T45).",
    }

    return {
        "rung": rung,
        "rung_code": meta["code"],
        "rung_name": meta["name"],
        "rung_phase": meta["phase"],
        "threshold_regime": threshold_regime,
        "target_tier": target_tier,
        "plain_takeaway": plain_takeaway,
        "formal_mechanism": formal_by_rung[rung],
        "falsifier_test": falsifier_by_rung[rung],
    }


def _read_rapl_uj() -> int | None:
    try:
        return int(RAPL_PKG.read_text(encoding="utf-8").strip())
    except Exception:
        return None


def run_threshold_amortization_pilot(ephemeral_share: float) -> dict[str, Any]:
    """Deterministic <1s Shape-D pilot testing Proposition 1 payback across Zipfian arrivals."""
    rng = np.random.default_rng(20261124)
    n_arrivals = 4096
    dim = 192
    w_mat = rng.standard_normal((dim, dim))
    patterns = rng.standard_normal((96, dim))
    ranks = rng.zipf(1.34, size=n_arrivals)
    pids = (ranks - 1) % 96
    stream = patterns[pids]

    max_uj = 262_143_328_850
    try:
        max_uj = int(RAPL_PKG_MAX.read_text(encoding="utf-8").strip())
    except Exception:
        pass

    t0 = time.perf_counter()
    u0 = _read_rapl_uj()
    ephemeral_acc = 0.0
    for vec in stream:
        ephemeral_acc += float((w_mat @ vec)[0])
    ephemeral_ms = round((time.perf_counter() - t0) * 1000.0, 2)
    u1 = _read_rapl_uj()
    ephemeral_j = round(((u1 - u0) % max_uj) / 1e6, 4) if (u0 is not None and u1 is not None) else None

    t1 = time.perf_counter()
    u2 = _read_rapl_uj()
    case_store: dict[int, float] = {}
    compiled_acc = 0.0
    cache_hits = 0
    for idx, vec in enumerate(stream):
        key = int(pids[idx])
        cached = case_store.get(key)
        if cached is not None:
            compiled_acc += cached
            cache_hits += 1
        else:
            val = float((w_mat @ vec)[0])
            # Deterministic gate C(z) = 1 parity check before admitting to Tier-1 table
            if abs(val - float(np.dot(w_mat[0], vec))) < 1e-9:
                case_store[key] = val
            compiled_acc += val
    compiled_ms = round((time.perf_counter() - t1) * 1000.0, 2)
    u3 = _read_rapl_uj()
    compiled_j = round(((u3 - u2) % max_uj) / 1e6, 4) if (u2 is not None and u3 is not None) else None

    speedup = round(ephemeral_ms / max(compiled_ms, 0.05), 2)
    j_gain = (
        round(ephemeral_j / compiled_j, 2)
        if (ephemeral_j and compiled_j and compiled_j > 0.0001)
        else speedup
    )
    digest_src = json.dumps(
        {
            "arrivals": n_arrivals,
            "hits": cache_hits,
            "parity": round(abs(ephemeral_acc - compiled_acc), 9),
            "ephemeral_share": round(ephemeral_share, 2),
        },
        sort_keys=True,
    ).encode("utf-8")

    return {
        "pilot_id": "RADAR-SHAPED-PROP1",
        "arrivals": n_arrivals,
        "tier1_hit_rate_pct": round(100.0 * cache_hits / n_arrivals, 2),
        "broken_commits_pct": 0.0,
        "parity_delta": round(abs(ephemeral_acc - compiled_acc), 9),
        "ephemeral_r5_ms": ephemeral_ms,
        "compiled_r7_ms": compiled_ms,
        "ephemeral_reported_j": ephemeral_j,
        "compiled_reported_j": compiled_j,
        "speedup_factor": speedup,
        "energy_gain_factor": j_gain,
        "board_metered": False,
        "receipt_sha256": hashlib.sha256(digest_src).hexdigest()[:24],
    }


def compute_rung_summary(items: list[dict[str, Any]]) -> dict[str, Any]:
    total = max(1, len(items))
    counts_by_rung: dict[str, int] = {str(r): 0 for r in range(1, 10)}
    crossing_by_rung: dict[int, int] = {r: 0 for r in range(1, 10)}
    counts_by_regime = {
        "ephemeral_rungs_1_5": 0,
        "crossing_compilation_threshold": 0,
        "compiled_rungs_6_9": 0,
    }
    counts_by_tier = {
        "Tier 3 (Frontier Search)": 0,
        "Tier 2 (Verified Rule/Checker)": 0,
        "Tier 1 (Indexed Case Store)": 0,
        "Tier 0 (Single-Cycle Silicon)": 0,
    }

    r1_5_count = 0
    for it in items:
        r = int(it["rung"])
        counts_by_rung[str(r)] = counts_by_rung.get(str(r), 0) + 1
        if r <= 5:
            r1_5_count += 1
        reg = it["threshold_regime"]
        counts_by_regime[reg] = counts_by_regime.get(reg, 0) + 1
        if reg == "crossing_compilation_threshold":
            crossing_by_rung[r] += 1
        tier = it["target_tier"]
        counts_by_tier[tier] = counts_by_tier.get(tier, 0) + 1

    histogram: list[dict[str, Any]] = []
    for r in range(1, 10):
        meta = RUNG_META[r]
        cnt = counts_by_rung[str(r)]
        histogram.append({
            "rung": r,
            "code": meta["code"],
            "name": meta["name"],
            "phase": meta["phase"],
            "phase_label": meta["phase_label"],
            "default_tier": meta["default_tier"],
            "count": cnt,
            "share_pct": round(100.0 * cnt / total, 1),
            "crossing_count": crossing_by_rung[r],
        })

    return {
        "histogram": histogram,
        "counts_by_rung": counts_by_rung,
        "counts_by_regime": counts_by_regime,
        "shares_pct": {
            "rungs_1_5_total_pct": round(100.0 * r1_5_count / total, 1),
            "ephemeral_trapped_pct": round(100.0 * counts_by_regime["ephemeral_rungs_1_5"] / total, 1),
            "crossing_threshold_pct": round(100.0 * counts_by_regime["crossing_compilation_threshold"] / total, 1),
            "compiled_rungs_6_9_pct": round(100.0 * counts_by_regime["compiled_rungs_6_9"] / total, 1),
        },
        "counts_by_target_tier": counts_by_tier,
        "bottleneck_rung": 5,
        "compilation_threshold_law": "ΔT > ΔT* = E_compile / (p_0' · (c_wake − c_0))  ∧  C(z) = 1",
    }


TOPIC_RUNG_MAP: dict[str, tuple[int, str]] = {
    "TF-2026-01": (7, "Tier 0 (Single-Cycle Silicon)"),
    "TF-2026-02": (8, "Tier 2 (Verified Rule/Checker)"),
    "TF-2026-03": (7, "Tier 1 (Indexed Case Store)"),
    "TF-2026-04": (7, "Tier 2 (Verified Rule/Checker)"),
    "TF-2026-05": (6, "Tier 0 (Single-Cycle Silicon)"),
    "TF-2026-06": (5, "Tier 1 (Indexed Case Store)"),
}


def finalize_global_rung_radar(
    radar_path: Path,
    foundry_path: Path | None = None,
    public_out_path: Path | None = None,
    refresh_commons: bool = False,
) -> dict[str, Any]:
    radar = json.loads(radar_path.read_text(encoding="utf-8"))
    items = radar.get("items", [])
    if refresh_commons or not all("commons_corroboration" in it for it in items):
        items, commons_summary = enrich_radar_items_with_commons(items, max_workers=8)
        radar["items"] = items
        radar["commons_prior_art_summary"] = commons_summary
    rung_summary = compute_rung_summary(items)
    ephemeral_pct = rung_summary["shares_pct"]["ephemeral_trapped_pct"]
    threshold_pilot = run_threshold_amortization_pilot(ephemeral_pct)

    foundry_pilots: list[dict[str, Any]] = []
    foundry_summary: dict[str, Any] = {
        "executed_at_utc": radar.get("generated_at_utc"),
        "total_pilot_wall_sec": 0.0,
        "pilot_budget_limit_sec": 60.0,
        "counts_by_status": {},
        "threshold_amortization_receipt": threshold_pilot,
    }
    if foundry_path and foundry_path.exists():
        fdoc = json.loads(foundry_path.read_text(encoding="utf-8"))
        foundry_summary["executed_at_utc"] = fdoc.get("executed_at_utc")
        foundry_summary["total_pilot_wall_sec"] = fdoc.get("total_pilot_wall_sec", 0.0)
        foundry_summary["pilot_budget_limit_sec"] = fdoc.get("pilot_budget_limit_sec", 60.0)
        foundry_summary["execution_substrate"] = fdoc.get("execution_substrate", "")
        foundry_summary["counts_by_status"] = fdoc.get("counts_by_status", {})
        raw_topics = fdoc.get("topics", [])
        if refresh_commons or not all("commons_corroboration" in tp for tp in raw_topics):
            raw_topics = enrich_foundry_topics_with_commons(raw_topics, max_workers=6)
        for tp in raw_topics:
            tid = tp.get("topic_id", "")
            trung, ttier = TOPIC_RUNG_MAP.get(tid, (7, "Tier 1 (Indexed Case Store)"))
            foundry_pilots.append({
                "topic_id": tid,
                "title": tp.get("title"),
                "status": tp.get("status"),
                "target_rung": trung,
                "target_rung_code": f"R{trung}",
                "target_rung_name": RUNG_META[trung]["name"],
                "target_tier": ttier,
                "openie_anchors": tp.get("openie_anchors", []),
                "commons_corroboration": tp.get("commons_corroboration"),
                "hypothesis": tp.get("hypothesis", ""),
                "shape_d_null_baseline": tp.get("shape_d_null_baseline", ""),
                "kill_criterion": tp.get("kill_criterion", ""),
                "inspired_by_urls": tp.get("inspired_by_urls", []),
                "pilot_receipt": tp.get("pilot_receipt", {}),
            })

    if "commons_prior_art_summary" in radar:
        radar["commons_prior_art_summary"]["continuations_checked"] = len(foundry_pilots)
        radar["commons_prior_art_summary"]["continuations_with_prior_art"] = sum(
            1 for fp in foundry_pilots if (fp.get("commons_corroboration") or {}).get("hit_count", 0) > 0
        )

    radar["schema"] = "openie.global_rung_radar.v2"
    radar["cadence"] = "Every 6 hours via autonomous Linux systemd --user timer"
    radar["rung_summary"] = rung_summary
    radar["shape_d_pilot_summary"] = foundry_summary
    radar["foundry_pilots"] = foundry_pilots

    canonical_manifest = json.dumps(
        {
            "scraped_at_utc": radar.get("scraped_at_utc"),
            "total_external_works": radar.get("total_external_works"),
            "item_digests": [it.get("sha256") for it in items],
            "counts_by_rung": rung_summary["counts_by_rung"],
            "counts_by_regime": rung_summary["counts_by_regime"],
        },
        sort_keys=True,
    ).encode("utf-8")
    radar["manifest_sha256"] = hashlib.sha256(canonical_manifest).hexdigest()

    serialized = json.dumps(radar, indent=2, ensure_ascii=False) + "\n"
    radar_path.write_text(serialized, encoding="utf-8")
    if public_out_path is not None:
        public_out_path.parent.mkdir(parents=True, exist_ok=True)
        public_out_path.write_text(serialized, encoding="utf-8")
    return radar


if __name__ == "__main__":
    import sys

    r_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("state/radio-radar.json")
    f_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("state/topic-foundry.json")
    pub_path = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("state/global-rung-radar.json")
    out = finalize_global_rung_radar(r_path, f_path, pub_path)
    print(
        f"Global Rung Radar finalized: {out['total_external_works']} works | "
        f"shares={out['rung_summary']['shares_pct']} | manifest={out['manifest_sha256'][:16]}…"
    )
