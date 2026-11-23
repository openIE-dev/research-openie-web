#!/usr/bin/env python3
"""OpenIE Research Radio — Launch Episodes 7 (Priya, Marcus, Arthur) & 8 (Mateo, Sean, Rohan)."""

from __future__ import annotations

from typing import Any

EPISODE_07: dict[str, Any] = {
    "id": "ep07-time-as-an-index",
    "number": 7,
    "title": "Time as an Index — Closed Timelike Curves, Hellman T·M² = N² & Salted Horizons",
    "subtitle": "Priya, Marcus, and Arthur explore PSPACE time loops, 31 Lean 4 theorems, 65,536 SHA-256 spectral runs, and salted horizons",
    "summary": (
        "Priya, Marcus, and Arthur unpack Time as an Index and Thermodynamic Bounds of Agency: Aaronson-Watrous D-CTC = PSPACE, "
        "quantum no-signalling, Hellman T*M^2 = N^2 tables, 31 Lean 4.36.0 theorems, and 195 cataloged temporal anomalies."
    ),
    "topic_tags": ["time-as-an-index", "lean-4", "hellman-tradeoff", "cryptanalysis"],
    "published_utc": "2026-11-23T09:00:00Z",
    "turns": [
        {
            "speaker": "Priya",
            "text": (
                "Welcome to Episode Seven of OpenIE Research Radio! I'm Priya, joined by Marcus and senior cryptography fellow Arthur — "
                "three AI-synthesized OpenIE research personas voiced via ElevenLabs studio neural voices and grounded strictly in verified Open Interface Engineering studies. "
                "Today we open Time as an Index: What It Would Take to Look Up Tomorrow."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[T]",
                    "title": "Time as an Index (31 Lean 4.36.0 Theorems, 0 sorry)",
                    "detail": "Audits CTC complexity (D-CTC = PSPACE), quantum no-signalling, Hellman T*M^2 = N^2 precomputation, and 65,536 SHA-256 spectral digests.",
                    "href": "/papers/time-as-an-index/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Arthur, whenever I see 'Closed Timelike Curves' and 'Looking Up Tomorrow' in a research paper, my sci-fi alarm bells ring off the wall! "
                "Promise me nobody here is claiming a time machine in the basement!"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Quite the opposite, Marcus — and board_metered is explicitly false! Across thirty-one kernel-checked theorems in Lean 4.36.0 — "
                "Horizon.lean and Paradox.lean, zero sorry — Time as an Index establishes WHY nothing in known physics reads tomorrow early, "
                "and why every genuine O-of-one lookup in engineering is precomputation paid ahead of time."
            ),
        },
        {
            "speaker": "Priya",
            "text": (
                "Begin with the complexity-theory premise, Arthur, because it reframes cryptography completely. Why does brute-force search hold up in ordinary spacetime?"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Because future computation states are unindexed: to know the millionth iterate of a sequential hash, you must pay the intermediate steps. "
                "Inside a mathematical Deutsch closed timelike curve, Aaronson and Watrous showed deterministic polynomial time expands to PSPACE! "
                "Every computational cipher — AES, RSA, lattices, hash preimages — collapses inside one self-consistent fixed-point loop."
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[T]",
                    "title": "CTC Complexity Collapse vs. Information-Theoretic Secrecy",
                    "detail": "Mathematical CTCs collapse NP and PSPACE search, yet Shannon one-time pads remain secure because uniform priors carry zero key index.",
                    "href": "/papers/time-as-an-index/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Wait — EVERY computational cipher collapses inside a mathematical time loop, EXCEPT one! Which one survives?"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Claude Shannon's one-time pad! Because every candidate plaintext corresponds to an equally probable key under a uniform prior, "
                "we verified mechanically in Lean 4 that even an unbounded CTC oracle gains zero distinguishing advantage."
            ),
        },
        {
            "speaker": "Priya",
            "text": (
                "Now step out of mathematical CTCs into real laboratory physics. Researchers periodically suggest quantum entanglement, analog relaxation, "
                "or frequency-domain transforms might bypass sequential search. What did our catalog find?"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "We audited one hundred ninety-five temporal anomalies TA001 to TA081, forty frequency edge cases AA01 to AA40, "
                "and seventy-four paradoxes P01 to P74. Quantum no-signalling forbids retrocausal bit transmission; "
                "Gabor uncertainty enforces Delta-t times Delta-f at least one over four pi; and analog soap films or Ising annealers pay thermal energy across barrier heights."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "[E]",
                    "title": "F5 Spectral Falsifier on 65,536 SHA-256 Digests",
                    "detail": "M1–M8 and F5 Fourier/Walsh spectral sweeps across N = 65,536 SHA-256 digests yield 0 frequency bins below Bonferroni-corrected p = 10^-6.",
                    "href": "/papers/time-as-an-index/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "And to test whether SHA-256 leaks hidden spectral structure, you ran falsifier F5 across sixty-five thousand five hundred thirty-six SHA-256 digests! "
                "How many bins cleared the Bonferroni ten-to-the-minus-six floor?"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Not a single bin — zero out of sixty-five thousand five hundred thirty-six."
            ),
        },
        {
            "speaker": "Priya",
            "text": (
                "Which leaves the one physical way engineers trade time for space: Martin Hellman's 1980 time-memory tradeoff, T times M-squared equals N-squared!"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Precisely. Hellman chains amortize search across memory M only if the target function exists before precomputation begins! "
                "Our Horizon theorem proves in Lean 4 that injecting a fresh k-bit salt or block hash born at query time scales offline table work by two to the k, "
                "rendering precomputed rainbow tables useless."
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[T]",
                    "title": "Horizon.lean: Salted Horizons Defeat Offline Tables",
                    "detail": "Precomputation cannot index questions salted with entropy born at query time; dual to caching verified deterministic Forms on stationary traffic.",
                    "href": "/papers/time-as-an-index/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Look at that symmetry! In security, you inject fresh salts so adversaries CANNOT pre-index tomorrow. "
                "In World Coding and LUT6 cascades, you canonicalize recurring inputs with De Bruijn hashes so you CAN pre-index stationary work and save joules!"
            ),
        },
        {
            "speaker": "Priya",
            "text": (
                "And that connects directly to OpenIE's foundational paper, Thermodynamic Bounds and an Optimal Tempo for Goal-Holding Agents — "
                "framing the OpenIE authors' proposed Universal Law of Agency: physics sets an energy floor per decision, correctness is the gate, "
                "and progress per joule orders the systems that finish."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[T]",
                    "title": "Thermodynamic Bounds and an Optimal Tempo",
                    "detail": "Frames the OpenIE authors' proposed Universal Law of Agency: agents hold goals under energy budgets, bounded by Landauer and kinematic tempo limits.",
                    "href": "/papers/agency/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Now get ready for our season finale in Episode Eight: Mateo, Sean, and Rohan enter the Idea Foundry live and watch a three-layer neural router "
                "get obliterated by a Shape-D integer grid!"
            ),
        },
    ],
}

EPISODE_08: dict[str, Any] = {
    "id": "ep08-idea-foundry-redteam",
    "number": 8,
    "title": "The Idea Foundry Live — Pitching, Red-Teaming & Pilot-Testing 6 New Research Topics",
    "subtitle": "Mateo, Sean, and Rohan audit 4 promoted pilots, 1 INA238 hardware hold, and 1 neural router crushed 63.7x by Shape D",
    "summary": (
        "Mateo, Sean, and Rohan host the autonomous 6-hour Topic Idea Foundry & <60s Linux RAPL Pilot Loop: live red-teaming and exact receipts "
        "for TF-2026-01 through TF-2026-06 (4 PROMOTED_CANDIDATE, 1 HOLD_NEEDS_HARDWARE, 1 KILLED_BY_NULL)."
    ),
    "topic_tags": ["topic-foundry", "pilot-loop", "killed-by-null", "red-team"],
    "published_utc": "2026-11-23T09:30:00Z",
    "turns": [
        {
            "speaker": "Mateo",
            "text": (
                "Welcome to Episode Eight — the season-launch finale of OpenIE Research Radio! I'm Mateo, joined in the Foundry booth by Sean and Rohan — "
                "three AI-synthesized OpenIE research personas voiced via ElevenLabs studio neural speech and grounded in live pilot receipts. "
                "Welcome inside the Autonomous Topic Idea Foundry!"
            ),
            "cards": [
                {
                    "kind": "pilot",
                    "badge": "0.977s RUN",
                    "title": "Autonomous 6-Topic Linux RAPL Pilot Suite",
                    "detail": "All 6 deterministic pilots executed in 0.977s (<60s budget) on Linux powercap intel-rapl:0: 4 Promoted, 1 Hold, 1 Killed by Null.",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Sean",
            "text": (
                "Here are the house rules of the Foundry, Mateo! Every six hours, right after scraping global open-access feeds, our Linux daemon pitches "
                "six candidate research topics. Every single topic MUST pre-declare a zero-parameter Shape-D null baseline, a hard kill criterion, "
                "and survive an executable Python pilot under sixty seconds before anyone writes a manuscript!"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "Today's six-pilot suite completed in zero point nine seven seven seconds on our x86-64 Linux harness, reading wrap-safe "
                "intel-rapl colon zero package reported joules with board_metered explicitly false. Let's inspect all six receipts!"
            ),
        },
        {
            "speaker": "Mateo",
            "text": (
                "Up first: TF-2026-01, inspired by TokenPowerBench and our LUT6 cascade — a Conformal Prefix-LUT6 Early-Exit Gate "
                "routing six thousand Zipf-distributed state-space requests."
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "A sixty-four-entry bit-sliced LUT6 signature table paired with exact schema parity intercepted eighty-eight point two two percent "
                "of arrivals with zero out of six thousand false commits, cutting package reported joules from one point five eight joules down to "
                "zero point six four joules — a two point four six times energy gain! Verdict: PROMOTED CANDIDATE."
            ),
            "cards": [
                {
                    "kind": "pilot",
                    "badge": "PROMOTED",
                    "title": "TF-2026-01: Conformal Prefix-LUT6 Early-Exit Gate",
                    "detail": "88.22% Zipf hit rate, 0/6,000 false commits, 1.5806 J -> 0.6436 J Linux RAPL reported_j (2.46x gain).",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Sean",
            "text": (
                "Clean pass! What about Candidate Two, TF-2026-02 — the SepJ-inspired Quorum-Hysteresis Circuit Breaker for Byzantine agent DAGs, "
                "sparked by today's AgentShield and INFRAMIND preprints?"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "Across two thousand five hundred rounds on a sixteen-node graph with four adversarial poisoners, unverified three-of-five majority voting "
                "suffered one hundred thirty-six corrupted commits! Keyed BLAKE2b attestation plus a two-strike SepJ link quarantine isolated all four poisoners "
                "within fourteen rounds, yielding one hundred percent goodput and zero out of two thousand five hundred false commits. Verdict: PROMOTED CANDIDATE!"
            ),
            "cards": [
                {
                    "kind": "pilot",
                    "badge": "PROMOTED",
                    "title": "TF-2026-02: SepJ Quorum Circuit Breaker (4/4 Isolated)",
                    "detail": "0/2,500 corrupted commits (100% goodput) vs 136 poisoned commits in unverified 3-of-5 majority voting.",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Mateo",
            "text": (
                "Give us Candidates Three and Four back-to-back — TF-2026-03 on Epoch-Salted Horizon Commitments, and TF-2026-04 on Operator-Aware De Bruijn Memoization!"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "In TF-2026-03, a precomputed Hellman table of one thousand five hundred thirty-six chains inverted seventy-four out of four hundred unsalted state targets; "
                "binding each transition to a fresh epoch beacon collapsed inversions to zero out of four hundred at zero point five seven four microseconds per step! "
                "And in TF-2026-04, operator-aware De Bruijn indexing hit two thousand out of two thousand alpha-equivalent renames with zero non-commutative "
                "a-minus-b swap collisions! Both are PROMOTED CANDIDATES."
            ),
            "cards": [
                {
                    "kind": "pilot",
                    "badge": "PROMOTED",
                    "title": "TF-2026-03 & TF-2026-04: Salted Horizons + De Bruijn Cache",
                    "detail": "Salted steps cut Hellman inversions 74 -> 0 at 0.574 μs/step; De Bruijn AST canonicalization hits 2,000/2,000 with 0 swap collisions.",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Sean",
            "text": (
                "Four promotions in a row — alright, now show the listeners where our own guardrails slammed on the brakes! What happened to Candidate Five, TF-2026-05, "
                "on sub-ten-millisecond Adaptive Beta-Burst Neuro-Stimulation?"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "In signal processing terms, thresholded beta-envelope gating cut stimulation pulses by three point one eight times — eight hundred seventeen pulses "
                "versus two thousand six hundred in continuous 130-hertz pacing! When we sampled forty consecutive eight-millisecond Linux RAPL windows "
                "to attribute micro-burst silicon energy, however, window coefficient of variation hit forty-four point zero three percent — well above "
                "our fifteen-percent SATB Falsifier 6 limit!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "HOLD_HARDWARE",
                    "title": "TF-2026-05 Held by SATB Falsifier 6 (>=15% RAPL CV)",
                    "detail": "3.18x pulse reduction confirmed, but 8 ms shared-host RAPL jitter requires physical TI INA238 inline DC shunts before claiming measured_j.",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Mateo",
            "text": (
                "So rather than publishing noisy micro-window counter guesses, the Foundry automatically stamped TF-2026-05 as HOLD NEEDS HARDWARE — "
                "waiting for a physical Texas Instruments INA238 inline shunt bench!"
            ),
        },
        {
            "speaker": "Sean",
            "text": (
                "And now for the main event — Candidate Six, TF-2026-06: pitching a learned three-layer dense neural MLP router to predict "
                "broadphase collision buckets for two hundred fifty-six Q32.32 rigid bodies! Rohan, read the obituary!"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "Across thirty thousand seven hundred twenty body-ticks, the three-layer MLP router took twenty-one point nine eight milliseconds, "
                "burned over one joule of socket reported_j, and still missed zero point six percent of true collision pairs at ninety-nine point four percent recall! "
                "Meanwhile, the zero-parameter Shape-D bit-shifted integer grid — x shifted right fifteen bits — achieved ONE HUNDRED POINT ZERO percent exact recall "
                "in zero point three four milliseconds!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "KILLED_BY_NULL",
                    "title": "TF-2026-06: MLP Router Crushed >60x by Shape-D Grid",
                    "detail": "Zero-parameter integer bit-shift achieved 100.0% exact recall in ~0.34 ms vs MLP's 99.4% recall in ~22 ms (~1.0 J reported_j).",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Sean",
            "text": (
                "Over sixty times faster, lower joules, zero learned weights, AND one hundred percent exact recall versus ninety-nine point four percent! "
                "Stamped in bright red: KILLED BY NULL! Think how much datacenter electricity the world would save if every lab ran a thirty-line integer baseline before training!"
            ),
        },
        {
            "speaker": "Mateo",
            "text": (
                "And because our Linux systemd user timer and six-hour cron daemon stay active around the clock, this four-stage loop — "
                "open-access scrape, epistemic audit, sub-sixty-second RAPL pilot, and multi-voice studio synthesis — keeps running autonomously. "
                "Subscribe via Podcast RSS right on this page, click any transcript line to jump straight to the receipt, and thank you for listening to OpenIE Research Radio!"
            ),
        },
    ],
}
