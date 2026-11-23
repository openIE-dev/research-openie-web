#!/usr/bin/env python3
"""OpenIE Research Radio — Launch Episodes 7 & 8 Dialogue & Citation Card Scripts."""

from __future__ import annotations

from typing import Any

EPISODE_07: dict[str, Any] = {
    "id": "ep07-time-as-an-index",
    "number": 7,
    "title": "Time as an Index — Closed Timelike Curves, Hellman T·M² = N² & Salted Horizons",
    "subtitle": "Why brute-force search relies on an unindexed future, what breaks inside PSPACE time loops, and how fresh salts defeat precomputation",
    "summary": (
        "Exploring Time as an Index and Thermodynamic Bounds of Agency: Aaronson-Watrous D-CTC = PSPACE, quantum no-signalling, "
        "Hellman T*M^2 = N^2 tables, 31 Lean 4.36.0 theorems, 65,536 SHA-256 spectral runs, and 195 cataloged temporal anomalies."
    ),
    "topic_tags": ["time-as-an-index", "lean-4", "hellman-tradeoff", "cryptanalysis"],
    "published_utc": "2026-11-23T09:00:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome to Episode Seven of OpenIE Research Radio! Elena, Marcus, and Devon here — AI-synthesized OpenIE research personas "
                "grounded strictly in verified Open Interface Engineering studies. Today we get to explore the most mind-bending study in the entire catalog: "
                "Time as an Index: What It Would Take to Look Up Tomorrow."
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
                "Okay, when people see 'Closed Timelike Curves' and 'Looking Up Tomorrow' in a title, their sci-fi detector goes straight to red alert! "
                "Assure me right now that we didn't claim to build a flux capacitor in the garage!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Zero flux capacitors, and board_metered is false! In fact, the whole point of Time as an Index is to prove rigorously — "
                "across thirty-one Lean 4.36.0 kernel-checked theorems in Horizon.lean and Paradox.lean with zero sorry — WHY nothing in known physics "
                "reads tomorrow early, and why every real O-of-one 'instant' lookup is actually precomputation paid ahead of time!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Start with the cryptographic thought experiment, though, because it's stunning. Why is sequential brute-force search hard in our universe?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Because future computation states are unindexed — to know the millionth iterate of a hash chain, you have to step through the intermediate states! "
                "Inside a mathematical Deutsch closed timelike curve, Aaronson and Watrous proved that deterministic polynomial time collapses to PSPACE! "
                "Every computational cipher — AES, RSA, lattice cryptography, hash preimages — breaks in one fixed-point consistency loop."
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
                "Wait — EVERY computational cipher breaks inside a mathematical time loop, EXCEPT one! Which cipher survives even a closed timelike curve?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Shannon's information-theoretic one-time pad! We proved mechanically in Lean 4 that because every plaintext is equally consistent "
                "with a uniform pad key, even an unbounded CTC fixed-point oracle has zero distinguishing advantage!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Now bring us back to real laboratory physics! People periodically propose using quantum entanglement, analog soap films, "
                "optical dispersion, or frequency-domain shortcuts to 'peek' ahead of sequential work. What happens when we test all of them?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "We cataloged one hundred ninety-five temporal anomalies TA001 to TA081, forty frequency edge cases AA01 to AA40, "
                "and seventy-four paradoxes P01 to P74. Quantum no-signalling blocks superluminal or retrocausal bit readout; "
                "Gabor time-frequency uncertainty forces a minimum observation window Delta-t times Delta-f at least one over four pi; "
                "and analog relaxation still pays thermal energy proportional to state-space barrier height!"
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
                "And just in case anyone wondered whether SHA-256 hides secret frequency-domain shortcuts, you actually ran the spectral falsifier F5 "
                "across sixty-five thousand five hundred thirty-six SHA-256 digests! How many frequency bins beat the corrected ten-to-the-minus-six threshold?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Zero bins! Flat white noise across the entire spectrum."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Which leaves the one real way engineers 'look up' answers fast in our universe: Martin Hellman's 1980 time-memory tradeoff, "
                "T times M-squared equals N-squared! Explain how that connects Time as an Index to OpenIE's downward crystallization."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Hellman showed you can trade online search time T against precomputed table memory M along T times M-squared equals N-squared — "
                "provided the function is fixed ahead of time! In defense, our Horizon theorem proves that injecting a fresh k-bit salt or block hash "
                "that didn't exist when precomputation started multiplies table work by two to the k, stopping rainbow tables cold."
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
                "Look at the beautiful duality there! In cryptography, you ADD a fresh salt so attackers CANNOT pre-index tomorrow. "
                "In software engineering and AI coding, you strip irrelevant variable names with De Bruijn hashes so you CAN pre-index recurring work and save joules!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "And that ties straight back to OpenIE's foundational monograph, Thermodynamic Bounds and an Optimal Tempo for Goal-Holding Agents — "
                "framing the OpenIE authors' proposed Universal Law of Agency: physics sets a minimum joule cost per decision, correctness is the gate, "
                "and among systems that finish the job right, progress per joule orders them!"
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
                "Which sets up our grand finale in Episode Eight: putting six brand-new research ideas into our autonomous sub-sixty-second Linux pilot arena — "
                "and watching one get publicly executed by a zero-parameter lookup table!"
            ),
        },
    ],
}

EPISODE_08: dict[str, Any] = {
    "id": "ep08-idea-foundry-redteam",
    "number": 8,
    "title": "The Idea Foundry Live — Pitching, Red-Teaming & Pilot-Testing 6 New Research Topics",
    "subtitle": "Four promoted candidates, one held for TI INA238 shunt rails, and one neural router crushed 63.7x by a Shape-D integer grid",
    "summary": (
        "Inside the autonomous 6-hour Topic Idea Foundry & <60s Linux RAPL Pilot Loop: live red-teaming and exact execution receipts "
        "for TF-2026-01 through TF-2026-06 (4 PROMOTED_CANDIDATE, 1 HOLD_NEEDS_HARDWARE, 1 KILLED_BY_NULL)."
    ),
    "topic_tags": ["topic-foundry", "pilot-loop", "killed-by-null", "red-team"],
    "published_utc": "2026-11-23T09:30:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome to Episode Eight — the season-launch finale of OpenIE Research Radio! Elena, Marcus, and Devon here, "
                "three AI-synthesized OpenIE research personas grounded strictly in verified Open Interface Engineering artifacts and live pilot receipts. "
                "Today we open the doors to the Autonomous Topic Idea Foundry!"
            ),
            "cards": [
                {
                    "kind": "pilot",
                    "badge": "0.983s RUN",
                    "title": "Autonomous 6-Topic Linux RAPL Pilot Suite",
                    "detail": "All 6 deterministic pilots executed in 0.983s (<60s budget) on Linux powercap intel-rapl:0: 4 Promoted, 1 Hold, 1 Killed by Null.",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Here are the rules of the Foundry arena! Every six hours, after scraping global open-access literature, our Linux daemon synthesizes "
                "candidate research topics. Every single topic MUST declare a Shape-D zero-parameter null baseline, a hard kill criterion, "
                "and run an actual deterministic Python pilot under sixty seconds before any human or LLM writes a paper!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Today's full six-topic pilot suite executed in zero point nine eight three seconds on our x86-64 Linux harness, reading wrap-safe "
                "intel-rapl colon zero package reported joules — with board_metered explicitly false. Let's walk through all six verdicts!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Candidate One, TF-2026-01, inspired by TokenPowerBench and our LUT6 cascade: a Conformal Prefix-LUT6 Early-Exit Gate "
                "for hybrid state-space routing across six thousand Zipf-distributed requests."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "A sixty-four-entry bit-sliced LUT6 signature table paired with an exact parity check intercepted eighty-eight point two two percent "
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
            "speaker": "Marcus",
            "text": (
                "Zero false accepts! What about Candidate Two, TF-2026-02 — the SepJ-inspired Quorum-Hysteresis Circuit Breaker for Byzantine multi-agent DAGs, "
                "inspired by today's AgentShield and HALO preprints?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Across two thousand five hundred committee rounds on a sixteen-node graph with four adversarial poisoners, unverified three-of-five majority voting "
                "suffered one hundred thirty-six corrupted commits! Keyed BLAKE2b attestation plus a two-strike SepJ link quarantine isolated all four Byzantine nodes "
                "within fourteen rounds, delivering one hundred percent goodput and zero out of two thousand five hundred false commits. Verdict: PROMOTED CANDIDATE!"
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
            "speaker": "Elena",
            "text": (
                "Now give us Candidates Three and Four — TF-2026-03 on Epoch-Salted Horizon Commitments, and TF-2026-04 on Operator-Aware De Bruijn Memoization!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "In TF-2026-03, a precomputed Hellman table of one thousand five hundred thirty-six chains inverted seventy-four out of four hundred unsalted state targets; "
                "binding each step to a fresh drand-style epoch beacon dropped inversions to zero out of four hundred at zero point five seven four microseconds per step! "
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
            "speaker": "Marcus",
            "text": (
                "Four promotions in a row — okay, now show the listeners where the brakes slammed on! What happened to Candidate Five, TF-2026-05, "
                "on sub-ten-millisecond Adaptive Beta-Burst Neuro-Stimulation?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Algorithmically, thresholded beta-envelope gating cut stimulation pulses by three point one eight times — eight hundred seventeen pulses "
                "versus two thousand six hundred in continuous 130-hertz pacing! But when we sampled forty consecutive eight-millisecond Linux RAPL windows "
                "to attribute micro-burst silicon energy, window coefficient of variation hit forty-four point zero three percent — blowing right past "
                "our fifteen-percent SATB Falsifier 6 stability limit!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "HOLD_HARDWARE",
                    "title": "TF-2026-05 Held by SATB Falsifier 6 (44.03% > 15% CV)",
                    "detail": "3.18x pulse reduction confirmed, but 8 ms shared-host RAPL jitter requires physical TI INA238 inline DC shunts before claiming measured_j.",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "So instead of faking a micro-burst joule claim off noisy OS counters, the daemon stamped TF-2026-05 as HOLD NEEDS HARDWARE — "
                "queued for a physical Texas Instruments INA238 shunt bench!"
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "And now — drumroll please — Candidate Six, TF-2026-06: pitching a learned three-layer dense neural MLP router to predict "
                "broadphase collision buckets for two hundred fifty-six Q32.32 rigid bodies! Tell us how badly Shape D destroyed it!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Total carnage! Across thirty thousand seven hundred twenty body-ticks, the three-layer MLP router took twenty-one point nine eight milliseconds, "
                "burned one point zero one three four joules of socket reported_j, and still missed zero point six percent of true collision pairs at ninety-nine point four percent recall! "
                "Meanwhile, the zero-parameter Shape-D bit-shifted integer grid — literally x shifted right fifteen bits — hit ONE HUNDRED POINT ZERO percent exact recall "
                "in zero point three four milliseconds!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "KILLED_BY_NULL",
                    "title": "TF-2026-06: MLP Router Crushed 63.72x by Shape-D Grid",
                    "detail": "Zero-parameter integer bit-shift achieved 100.0% exact recall in 0.34 ms vs MLP's 99.4% recall in 21.98 ms (1.0134 J reported_j).",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Sixty-three point seven two times faster, lower joules, zero parameters, AND one hundred percent exact recall versus ninety-nine point four percent! "
                "Stamped in bright red: KILLED BY NULL! Imagine how many GPU hours the AI industry would save if every lab ran a thirty-line integer baseline before training!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "And because our Linux systemd user timer and six-hour cron daemon stay live around the clock, this exact four-stage loop — "
                "global open-access scrape, epistemic cross-exam, sub-sixty-second RAPL pilot, and multi-voice broadcast — keeps running autonomously. "
                "Subscribe via Podcast RSS right on this page, click any transcript line to inspect its receipt, and thanks for tuning in to OpenIE Research Radio!"
            ),
        },
    ],
}
