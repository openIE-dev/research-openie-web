#!/usr/bin/env python3
"""OpenIE Research Radio — Launch Episodes 5 & 6 Dialogue & Citation Card Scripts."""

from __future__ import annotations

from typing import Any

EPISODE_05: dict[str, Any] = {
    "id": "ep05-game-engines-everywhere",
    "number": 5,
    "title": "Writing a Game Once — Q32.32 Lockstep, DirectX 12/Metal/Vulkan & Closing GE-H1..H9",
    "subtitle": "Where bit-exact simulation ends, where visual GPU tolerance begins, and why std::sin diverges in 10 ticks across OSes",
    "summary": (
        "Closing all nine falsifiers GE-H1 through GE-H9 across macOS, Linux, and bare-metal Windows 11: "
        "0/25,500 Q32.32 lockstep mismatches, tick-10 floating-point divergence, 28/28 DirectX 12/Metal/Vulkan pairs, and Godot 4.7.2 projection."
    ),
    "topic_tags": ["game-engines", "determinism", "q32-32", "wgpu"],
    "published_utc": "2026-11-23T08:00:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome to Episode Five of OpenIE Research Radio! Elena, Marcus, and Devon here — AI-synthesized OpenIE research personas "
                "grounded strictly in verified Open Interface Engineering artifacts. Today we ask a dream question for systems engineers and game developers: "
                "can you write a game once as a checked state machine and run it everywhere?"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[E]",
                    "title": "Writing a Game Once (All 9 Suites GE-H1..GE-H9 Executed)",
                    "detail": "Separates bit-exact Q32.32 simulation replay from bounded PSNR/SSIM GPU rendering across macOS, Linux, and Windows 11.",
                    "href": "/papers/game-engines/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Hold on — game studios have burned hundreds of millions of dollars trying to keep multiplayer lockstep replays synchronized "
                "between Windows PCs, Macs, and Linux servers! Why does ordinary floating-point physics blow up so fast?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "We measured the exact tick where it breaks in falsifier GE-H2! Standard library sine — Apple libSystem versus Linux glibc versus Windows UCRT — "
                "diverges between tick ten and tick thirty-seven! Even without transcendentals, MSVC slash fp colon precise versus Clang fused multiply-add "
                "diverges at tick one hundred ninety-two."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "GE-H2 & GE-H7",
                    "title": "3-OS std::sin Diverges at Ticks 10–37; FMA at Tick 192",
                    "detail": "840 chaotic trajectories confirm linear Lyapunov divergence time t* vs ln(Delta/delta_0) at R^2 = 0.9940–0.9995.",
                    "href": "/papers/game-engines/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Ten ticks! At sixty frames per second, three operating systems disagree on where a projectile is in one-sixth of a second! "
                "And in GE-H7, across eight hundred forty chaotic trajectories, that divergence follows Lyapunov's logarithmic slope with R-squared above zero point nine nine four."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Okay, so you drew a razor-sharp architectural boundary: simulation state stays strictly bit-exact in Q32.32 fixed-point integer arithmetic, "
                "while GPU rendering lives inside a perceptual tolerance envelope. Did Q32.32 actually survive six real machines?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "In GE-H1, we stepped sixty-four Q32.32 rigid bodies for one hundred thousand ticks across thirty language-target-by-host cells "
                "spanning six machines on macOS, Linux, and bare-metal Windows 11. Out of twenty-five thousand five hundred SHA-256 state checkpoints, "
                "mismatches were zero!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "GE-H1 & GE-H8",
                    "title": "0/25,500 Q32.32 Mismatches & 44.6 KB 1-Hour Replay",
                    "detail": "100,000 ticks across 30 target x host cells = 0 diffs; three 216,000-tick (1-hour) sessions replay from 44.6 KB gzip logs with 0/6,480 diffs.",
                    "href": "/papers/game-engines/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "And look at what that unlocks in GE-H8: three full one-hour gameplay sessions — two hundred sixteen thousand ticks each — "
                "reconstruct bit-for-bit across macOS, Linux, and Windows 11 from forty-four point six kilobytes of gzipped player inputs alone! Zero out of six thousand four hundred eighty checkpoint diffs!"
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Forty-four kilobytes for an entire hour of physics and game state! Wait — what about performance? Fixed-point emulation in scripting languages can crawl."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "In Python, you hit the twenty-millisecond frame ceiling at just three hundred ninety actors. In GE-H5, compiled RCE Form projections "
                "step ten thousand Q32.32 actors in zero point zero five eight to zero point one two five milliseconds — over one hundred sixty times headroom inside a sixty-hertz frame!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Now test the rendering side of the boundary! Different GPU vendors never round pixels identically across DirectX 12, Apple Metal, and Vulkan."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "That's GE-H3. Across eight physical GPU-by-API endpoints spanning DirectX 12, Metal, and Vulkan under headless wgpu, "
                "all twenty-eight hardware pairs passed with peak signal-to-noise ratio at least sixty-four point one six decibels "
                "and structural similarity SSIM at least zero point nine nine nine eight three three!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "GE-H3",
                    "title": "28/28 DirectX 12, Metal & Vulkan GPU Pairs Pass",
                    "detail": "PSNR >= 64.16 dB and SSIM >= 0.999833 across 8 hardware GPU x graphics API endpoints.",
                    "href": "/papers/game-engines/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Okay, toy benchmarks are one thing — what about real game logic across Unity C-sharp, Bevy Rust ECS, and Godot 4 GDScript?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "In GE-H4, seventeen admitted RCE Forms across three classic games — Haunted Jaunt, Survival Shooter, and Tanks — "
                "cut behavior source lines of code by seventy-six point two two percent versus Unity C-sharp, sixty-one point four seven percent versus Bevy Rust, "
                "and fifty-one point nine nine percent versus Godot GDScript, with zero out of six hundred eighty trace mismatches! "
                "And in GE-H9, our Form-to-Godot 4.7.2 headless emitter matched handwritten GDScript on thirty-six out of thirty-six tasks across eighteen thousand ticks!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "GE-H4 & GE-H9",
                    "title": "76.22% SLOC Reduction & 36/36 Godot 4.7.2 Parity",
                    "detail": "0/680 trace diffs across Haunted Jaunt, Survival Shooter, and Tanks; 0/18,000 tick diffs in headless Godot 4.7.2.",
                    "href": "/papers/game-engines/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Notice how GE-H6 ties straight back to OpenIE's Three-Body Problem in Computing and The Price of the Unexamined Interface: "
                "static Form plus manifest checking caught ninety-eight point four six percent of one hundred thirty injected handoff faults at F1 zero point nine nine two two, "
                "compared to zero point one one five nine for syntax parsing alone!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[E]",
                    "title": "The Three-Body Problem & Interface Economics",
                    "detail": "Catastrophic failures cluster at unwritten handoff assumptions between specifiers, builders, and users (Mars Climate Orbiter, Ariane 5).",
                    "href": "/papers/three-body/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "And true to OpenIE telemetry discipline, we explicitly stamp measured_j as unset on the game-engine study because no external DC shunt "
                "was wired to those six workstations!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Exact replay where logic demands it, bounded tolerance where photons hit the screen, and machine-checked interfaces in between. "
                "Coming up in Episode Six: compiling intelligence all the way down to LUT6 truth tables, sovereign hardware tags, and JouleOS!"
            ),
        },
    ],
}

EPISODE_06: dict[str, Any] = {
    "id": "ep06-lut6-metabolic-jouleos",
    "number": 6,
    "title": "Downward LUT6 Compilation, MEI-JCP Sovereign Hardware Tags & JouleOS",
    "subtitle": "Streaming 35B sparse-MoE models in 970 MB RAM, compiling recurring wakes into 81-RAMB36E2 Boolean fabrics, and budgeting agents at the OS spine",
    "summary": (
        "How Mixture of Limits cascades bridge 34.66B sparse-MoE NVMe streaming (970 MB RAM, 6.773 J/tok reported_j) "
        "down to Beneš-routed LUT6 FPGA fabrics, 32x24 mm MEI-JCP sovereign PCB tags, and JouleOS."
    ),
    "topic_tags": ["lut-adapt", "mei", "jouleos", "fpga"],
    "published_utc": "2026-11-23T08:30:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome back to OpenIE Research Radio! Elena, Marcus, and Devon here — AI-synthesized OpenIE research personas "
                "walking through verified Open Interface Engineering hardware and systems studies. Today in Episode Six, we descend the entire compute stack: "
                "Downward LUT6 Compilation, Metabolic Intelligence MEI-JCP tags, and JouleOS."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[M]",
                    "title": "Downward LUT6 Compilation (Mixture of Limits)",
                    "detail": "Places Beneš-routed LUT6 lookup fabrics and conformal wake gates in front of Mamba-3 and 34.66B sparse-MoE NVMe streaming.",
                    "href": "/papers/lut-adapt/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Let's start with the economic absurdity we pointed out in Spell Check is Global and The Promised Trillion Dollar AI-Coding Market: "
                "imagine if every time you typed 'teh' in a document, Microsoft or Google spun up an eighty-gigabyte datacenter GPU cluster to fix your typo!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Spell check used to sell as a standalone multi-hundred-dollar add-on in the early 1980s, and it became universal for seven billion people "
                "precisely because its marginal cost dropped to a tiny local dictionary lookup! Why treat recurring code and agent patterns any differently?"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[E]",
                    "title": "Spell Check is Global & Latency Cadence Model",
                    "detail": "Capabilities reach 7B+ people when marginal runtime energy drops toward zero and tools bundle directly into local workflows.",
                    "href": "/papers/spellcheck/",
                }
            ],
        },
        {
            "speaker": "Devon",
            "text": (
                "In Downward LUT6 Compilation, we build that exact downward escalator. At the top tier, when true novelty strikes, "
                "custom Apple Metal INT4 Mixture-of-Experts and GatedDeltaNet compute shaders stream Qwen 3.6 35B-A3B directly from NVMe using Darwin F_NOCACHE."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Wait — a thirty-five-billion-parameter model normally demands seventy gigabytes of unified memory in FP16! How much RAM did our streaming tier hold?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Nine hundred seventy megabytes — just one point four seven percent of FP16 RAM! It achieved one hundred percent exact token parity, "
                "cut NVMe traffic twelve point three times via expert locality, and ran at six point seven seven three joules per token of dual-channel reported_j."
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "reported_j",
                    "title": "Qwen3.6-35B-A3B in 970.0 MB RAM (1.47% FP16)",
                    "detail": "100.0% exact token parity via custom Metal INT4 MoE + GatedDeltaNet shaders; 12.30x NVMe reduction; 6.773 J/tok reported_j.",
                    "href": "/papers/lut-adapt/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Now comes the magic: once a frontier wake passes deterministic pytest verification, we don't pay six point seven seven joules per token "
                "the second or third time that pattern arrives!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Right! On our forty-eight-task verified coding bakeoff and sixteen-repo SWE-Mini suite, the cascade closed eighty-seven point five percent "
                "with zero broken commits, invoking the thirty-five-B tier on only twenty-two point nine two percent of arrivals. By Wave 3 replay, "
                "certified wakes ran in two point eight nine milliseconds at zero point zero four two four joules reported_j — and compile further downward "
                "into eighty-one RAMB36E2 Beneš-routed six-input LUT fabrics verified in Yosys and Verilator for Xilinx Kria xck26 silicon!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[M]",
                    "title": "87.5% Bakeoff (0% Broken) & 81-RAMB36E2 xck26 RTL",
                    "detail": "Only 22.92% arrivals wake 35B; Wave-3 replay drops to 2.89 ms / 0.0424 J reported_j; Yosys/Verilator synthesizes Beneš LUT6 fabric.",
                    "href": "/papers/lut-adapt/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Zero multiply-accumulates — pure Boolean truth-table routing! Now take us even smaller, down to a coin-cell battery at minus twenty degrees Celsius "
                "in Metabolic Intelligence!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "In the MEI white paper, we released MEI-JCP-Tag-v1: a complete sovereign hardware manufacturing package — KiCad schematics, "
                "RS-274X Gerbers with zero DRC violations, bill of materials, and a thirty-six by twenty-eight by seven-point-five millimeter STEP enclosure. "
                "The two-layer thirty-two by twenty-four millimeter board pairs an STM32WBA52 microcontroller with a physical Texas Instruments INA238 shunt monitor and FRAM."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[M]",
                    "title": "MEI-JCP-Tag-v1 Sovereign Hardware Reference",
                    "detail": "DRC-clean (0 violations) 32x24 mm STM32WBA52 + TI INA238 + FRAM PCB + STEP enclosure; 10,000-wakeup -20 C CR2032 electro-thermal verification.",
                    "href": "/products/mei/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "And quick honesty check for the listeners: have we claimed physical bench-metered joules off a fabbed MEI-JCP tag board yet?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Explicitly no! Board_metered is false and measured_j is unset until fabbed boards come back from assembly and sit on an inline meter. "
                "What IS verified today is our ten-thousand-wakeup CR2032 electro-thermal hold-and-settle simulation preserving one hundred percent of critical alerts "
                "at minus twenty Celsius across two thousand six hundred eighty Ed25519 canonical CBOR JCR-1 receipts."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "And tying the tag, the SATB telemetry engine, and desktop sandboxes together is The Search for JouleOS!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[T]",
                    "title": "The Search for JouleOS (310 Rust Tests)",
                    "detail": "Verified Rust spine (jcp-satb-cad-spine) with 78,400-pair provenance meet-semilattice scheduling, budgeting, and refusing agents under energy grants.",
                    "href": "/products/jouleos/",
                }
            ],
        },
        {
            "speaker": "Devon",
            "text": (
                "Today's operating systems were built in the 1970s to multiplex time and memory — none of them checks an energy grant before an autonomous agent acts! "
                "Our verified Rust reference spine passes three hundred ten workspace tests and checks seventy-eight thousand four hundred provenance pairs "
                "to prove meet-semilattice laws bridging JCR-1 receipts, SATB Falsifier 6 drift gates, and stage accounting."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "An operating system that schedules, budgets, and refuses runaway agents before they torch the battery or the power grid! "
                "Speaking of physics limits, wait until you hear Episode Seven: closed timelike curves and looking up tomorrow!"
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Episode Seven — Time as an Index — starts right after this!"
            ),
        },
    ],
}
