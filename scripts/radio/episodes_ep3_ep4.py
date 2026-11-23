#!/usr/bin/env python3
"""OpenIE Research Radio — Launch Episodes 3 & 4 Dialogue & Citation Card Scripts."""

from __future__ import annotations

from typing import Any

EPISODE_03: dict[str, Any] = {
    "id": "ep03-rce-world-coding",
    "number": 3,
    "title": "World Coding — The Reality Code Engine, FormJEPA/FormEBM & 40/40 Verified Repair",
    "subtitle": "Why any learned model may propose a state-machine Form, why only the deterministic checker decides, and why Rung F stayed in observe mode",
    "summary": (
        "Inside RCE, RCE-JEPA, RCE Compile, and RCE-VC: 5,537 Lean 4 theorem constants, 8.42M-parameter FormJEPA-v1, "
        "5.85M-parameter FormEBM-v2, 40/40 H15-Iterative repair, compiler payback horizons N*, and candid falsifiers."
    ),
    "topic_tags": ["rce", "rce-jepa", "world-coding", "rce-compile"],
    "published_utc": "2026-11-23T07:00:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome to Episode Three of OpenIE Research Radio! As always, Elena, Marcus, and Devon are AI-synthesized OpenIE research personas "
                "speaking strictly from verified Open Interface Engineering studies. Today we're tackling World Coding: RCE, RCE-JEPA, RCE Compile, and RCE-VC."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[T]",
                    "title": "The Reality Code Engine (5,537 Lean 4 Constants)",
                    "detail": "Write a program once as a total state machine Form; check deterministically at 49.04 mJ reported_j; emit native targets.",
                    "href": "/papers/rce/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Let's start with the elephant in the server room. People hear JEPA — Joint Embedding Predictive Architecture — and assume "
                "we're trusting a neural latent space to decide whether software is correct. Are we?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Never! That's the entire subtitle of RCE-JEPA: World Coding, with JEPA as premise rather than the whole method. "
                "Any proposer — human, deterministic rule ladder, small latent predictor, or frontier model — may suggest a Form. "
                "Only the deterministic checker decides admission."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[M]",
                    "title": "RCE-JEPA: Proposer Suggests, Checker Decides",
                    "detail": "49.04 mJ per Form check vs 84.25 J local 35B proposal (ratio 0.000582); deterministic ladder closes 111/151 (73.5%) at 0 model calls.",
                    "href": "/papers/rce-jepa/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Look at that energy asymmetry on Apple M5 Max reported joules: checking a Form costs forty-nine point zero four millijoules, "
                "while generating one local thirty-five-billion-parameter Qwen 3.6 proposal costs eighty-four point two five joules — over seventeen hundred times more!"
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "And before calling ANY neural network at all, what happened when you ran the zero-model-call deterministic repair ladder?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "The deterministic ladder closed one hundred and eleven out of one hundred and fifty-one broken Forms — seventy-three point five percent — "
                "with zero neural calls! Then we trained two tiny purpose-built models on one thousand three hundred eighty-seven strictly disjoint Forms: "
                "FormJEPA-v1 at eight point four two million parameters, and FormEBM-v2 at five point eight five million parameters."
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "reported_j",
                    "title": "FormJEPA-v1 (8.42M) & FormEBM-v2 (5.85M)",
                    "detail": "FormJEPA-v1 lifts deterministic ladder to 138/151 (91.4%) at 474.8 mJ RAPL core reported_j; FormEBM-v2 hits AUROC 0.8922 at 47.09 mJ.",
                    "href": "/papers/rce-jepa/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Wait — an eight-point-four-million parameter latent model lifted repair from seventy-three point five percent up to ninety-one point four percent, "
                "and matched a thirty-five-billion-parameter model single-shot on H15 at twenty-seven out of forty?!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Yes, at four hundred seventy-four point eight millijoules of Linux RAPL core reported joules for sixteen candidates! "
                "And FormEBM-v2 scored candidate validity with AUROC zero point eight nine two two, cutting rce check invocations by two point three nine times."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Now give me the headline H15-Iterative stress test — where frontier models get zero access to the original source file, "
                "only public standard-library headers and bounded deterministic checker diagnostics for at most five turns."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Claude Opus 5.5 and Claude Sonnet 5.5 both closed forty out of forty — one hundred percent, zero contradictions! "
                "xAI Grok 4.20 closed thirty-nine out of forty with zero contradictions. And once crystallized into warm Gear-0 case memory, "
                "all forty replay at zero model calls for one point seven seven one microjoules!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[M]",
                    "title": "H15-Iterative: 40/40 Closed + 1.771 μJ Gear-0 Replay",
                    "detail": "Opus 5.5 & Sonnet 5.5 close 40/40 under checker feedback; 3-Gear Zipf(0.85) stream cuts frontier episodes 16.67x.",
                    "href": "/papers/rce-jepa/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Hold everything — you promised no cherry-picking! Tell the listeners what FAILED its promotion threshold in RCE-JEPA!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "On the one-hundred-fifty-one-task rce repair Rung-F audit, our pre-registered error ceiling was two point zero percent. "
                "Rung F came back at three out of one hundred nineteen — two point five percent! So holds returned false, and we kept Rung F locked in observe mode instead of promoting it."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "HOLDS: FALSE",
                    "title": "Rung-F Audit Kept in Observe Mode (2.5% > 2.0%)",
                    "detail": "3/119 (2.5%) exceeded the 2.0% threshold on the 151-task audit; Rung F was refused promotion rather than moving the goalpost.",
                    "href": "/papers/rce-jepa/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "That same willingness to let data falsify a sweeping claim shaped RCE Compile too! We asked whether one candidate statement "
                "of compilation describes all twelve real-world compiler families."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "And it failed as a universal description — because mainstream compilers omit explicit energy gates and linking digests — "
                "while holding cleanly as a seven-part normal form! Even better, across two hundred eighty checksum-verified Zen 5 RAPL cells, "
                "compiling Python to clang dash O3 pays back its compile energy after a median N-star of two thousand four hundred ninety runs, "
                "whereas thirty percent of clang and rustc O2-to-O3 optimizations NEVER pay back their extra compile joules!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "reported_j",
                    "title": "RCE Compile: Payback Horizon N* & De Bruijn Cache",
                    "detail": "Python -> clang -O3 pays back in N*=2,490 runs, while 30% of -O2 -> -O3 tiers never pay back; De Bruijn SHA-256 cuts warm compile joules 448.5x.",
                    "href": "/papers/rce-compile/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Thirty percent of dash O3 builds burn extra compiler electricity for zero runtime savings! Meanwhile, De Bruijn nameless SHA-256 "
                "memoization hit zero out of five hundred false collisions and slashed warm rustc compile energy by four hundred forty-eight point five times!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "And RCE-VC closes the loop at version control: admitting non-overlapping changes against one hundred thousand name-free units "
                "in seventy microseconds at three hundred forty microjoules while keeping Git completely usable. Next up in Episode Four: "
                "Deterministic Null and physical shunt telemetry in SATB!"
            ),
        },
    ],
}

EPISODE_04: dict[str, Any] = {
    "id": "ep04-deterministic-null-satb",
    "number": 4,
    "title": "Deterministic Null & SATB — Pre-Registered Baselines and INA238 Shunt Rails vs. RAPL",
    "subtitle": "Bitcoin-anchored Shape-D controls, 4,030 held-out instances, Jetson AGX Thor physical shunts, and why Kepler power splitting errs by up to 89.88%",
    "summary": (
        "Why every AI benchmark needs a zero-model-call Shape-D control and rootless telemetry attribution: "
        "OpenTimestamps + drand pre-registration, 6 frontier models across 4,030 instances, and 5-host SATB conformance."
    ),
    "topic_tags": ["deterministic-null", "satb-harness", "ina238", "preregistration"],
    "published_utc": "2026-11-23T07:30:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome to Episode Four of OpenIE Research Radio! Elena, Marcus, and Devon here — AI-synthesized OpenIE research personas "
                "unpacking verified Open Interface Engineering studies. Today is Marcus's favorite double feature: Deterministic Null and the Satiation Benchmark Harness, SATB."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[M]",
                    "title": "Deterministic Null (Pre-Registered Shape-D Control)",
                    "detail": "Bit-exact 64-bit integer case loop across Rust, C++20, Go, Julia, and Python anchored to Bitcoin OpenTimestamps and drand rounds 6663734 & 6664089.",
                    "href": "/papers/deterministic-null/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "You better believe this is my favorite episode! In medicine, nobody approves a drug without a placebo control. "
                "Yet in AI, teams publish billion-parameter agent benchmarks every week without checking what a zero-model-call integer case loop scores first!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "So we built Shape D — strict N0 and dev-crystallized N1 — verified bit-exact across five languages: Rust, C++20, Go, Julia, and Python. "
                "Before touching the held-out split, we anchored the hashes to the Bitcoin blockchain via OpenTimestamps and League of Entropy drand randomness rounds "
                "six million six hundred sixty-three thousand seven hundred thirty-four and six million six hundred sixty-four thousand eighty-nine."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Then we measured six models — Claude Opus 5.5, Claude Sonnet 5.5, OpenAI gpt-oss-120b, xAI Grok 4.20, Qwen 3.6 35B-A3B, "
                "and Gemma 4 E4B-it — across four thousand thirty held-out instances plus six real upstream SWE-bench Verified repositories. What happened?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Total bifurcation! On bounded formal and structured Track-A classes, single-turn neural calls failed to beat the deterministic control on nine out of ten cells — "
                "until extended thinking hit forty-nine out of fifty and O-of-m clause feedback hit fifty out of fifty on Unique 3-SAT DRAT proofs!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[M]",
                    "title": "Track-A vs. Open Benchmarks (+45.80 to +95.00 pp)",
                    "detail": "Single-turn neural excluded on 9/10 bounded formal cells, while SWE-bench Verified, BFCL v3, tau-bench, and BigCodeBench show +45.80 to +95.00 pp neural gains.",
                    "href": "/papers/deterministic-null/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Aha! And on genuinely open-ended software benchmarks — BFCL v3, tau-bench Retail, BigCodeBench, and SWE-bench Verified — "
                "where lookup tables hit zero, neural models delivered plus forty-five point eight to plus ninety-five percentage points of real gain! "
                "That proves Shape D isn't anti-neural — it tells you WHERE neural compute actually earns its joules!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "And when recurring Zipfian traffic arrives online, crystallizing verified solutions back into Shape D cuts model calls and reported_j spend by three point five nine times."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Now let's talk about measuring those joules honestly in the Satiation Benchmark Harness, SATB. We audited SATB across five completely different silicon and OS archetypes!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "measured_j",
                    "title": "SATB Harness Across 5 Silicon & OS Archetypes",
                    "detail": "12/12 C1–C12 conformance checks pass across Apple M5 Max, Jetson AGX Thor (physical TI INA238/INA3221 shunts), AMD Strix Halo, Intel Raptor Lake, and Windows 11.",
                    "href": "/papers/satb-harness/",
                }
            ],
        },
        {
            "speaker": "Devon",
            "text": (
                "Right: Apple M5 Max on macOS IOReport, AMD Ryzen AI Max+ 395 Strix Halo with 0440 PLATYPUS-hardened RAPL, Intel Core i9-13900H Raptor Lake Linux, "
                "bare-metal Windows 11 Pro with rootless nvml.dll, and — crucially — NVIDIA Jetson AGX Thor equipped with physical Texas Instruments INA238 whole-board "
                "and three-channel INA3221 rail shunts!"
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Stop and underline that! Jetson AGX Thor with TI INA238 and INA3221 plus the Kria KV260 with INA260 are real inline rail shunts — "
                "so those earn measured_j! What happened when you tested popular cloud power-attribution heuristics like Kepler CPU-proportional splitting against real hardware?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Kepler CPU-proportional splitting erred by thirty-two point five nine percent all the way up to eighty-nine point eight eight percent! "
                "And on bare-metal Windows 11, Win32 GetProcessTimes suffered fifteen-point-six-two-five millisecond tick aliasing — Falsifier 3 — "
                "under-attributing short burst CPU usage by minus eighty-nine point eight eight percent!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "FALSIFIER 3 & 6",
                    "title": "Kepler Splitting Errs 32.59%–89.88%; Tick Aliasing -89.88%",
                    "detail": "Proportional CPU power splitting fails under GPU/idle-floor asymmetry; Falsifier 6 withholds noisy shared-host net attribution automatically.",
                    "href": "/papers/satb-harness/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Wait — eighty-nine point eight eight percent attribution error from standard cloud-native CPU-ratio formulas! "
                "Explain how SATB Falsifier 6 protects researchers from publishing garbage energy numbers on shared machines."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "SATB crosses five telemetry levels L0 through L4 with attribution labels A1 through N. Whenever background host drift or quiescent power variance "
                "violates Falsifier 6 — as happened on one hundred nine of one hundred seventy shared-host windows in AI Reads Human — "
                "the harness refuses to stamp a net attributed joule claim while preserving the raw channel log untouched."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "And across all five operating systems and CPU architectures, Shape D checksum fifteen billion twenty-seven million seven hundred five thousand seven hundred thirty-six "
                "and C9 context truncation replayed with ZERO byte diffs!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "And pair SATB with our economics paper on Task Satiation versus Aggregate Rebound: every individual job has a finish line where extra tokens add zero value, "
                "even as cheaper inference sparks Jevons demand growth across new tasks."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[E]",
                    "title": "Task Satiation vs. Aggregate Rebound",
                    "detail": "Separates single-task completion ceilings from Jevons aggregate demand growth: token prices fall, but electricity is never free.",
                    "href": "/papers/satiation/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Which brings us right to Episode Five: what happens when you demand bit-exact replay across six machines, three operating systems, "
                "and real GPU game engines? Don't touch that dial!"
            ),
        },
    ],
}
