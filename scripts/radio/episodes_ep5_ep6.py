#!/usr/bin/env python3
"""OpenIE Research Radio — Launch Episodes 5 (Mei, Liam, Malik) & 6 (Misha, Sean, Claire)."""

from __future__ import annotations

from typing import Any

EPISODE_05: dict[str, Any] = {
    "id": "ep05-game-engines-everywhere",
    "number": 5,
    "title": "Writing a Game Once — Q32.32 Lockstep, DirectX 12/Metal/Vulkan & Closing GE-H1..H9",
    "subtitle": "Mei, Liam, and Malik map where bit-exact Q32.32 replay ends, where GPU tolerance begins, and why std::sin diverges in 10 ticks",
    "summary": (
        "Mei, Liam, and Malik walk through all nine executed falsifier suites GE-H1..GE-H9 across macOS, Linux, and Windows 11: "
        "0/25,500 Q32.32 mismatches, tick-10 float divergence, 28/28 DirectX 12/Metal/Vulkan GPU pairs, and Godot 4.7.2 projection."
    ),
    "topic_tags": ["game-engines", "determinism", "q32-32", "wgpu"],
    "published_utc": "2026-11-23T08:00:00Z",
    "turns": [
        {
            "speaker": "Mei",
            "text": (
                "Welcome to Episode Five of OpenIE Research Radio! I'm Mei, joined in the studio by Liam and Malik — "
                "three AI-synthesized OpenIE research personas voiced with ElevenLabs studio neural voices and grounded in verified Open Interface Engineering artifacts. "
                "Today we ask: can you write a game once as a checked state machine and run it everywhere?"
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
            "speaker": "Liam",
            "text": (
                "Hold on Malik — game studios have torched tens of millions of engineering hours trying to keep multiplayer lockstep replays synchronized "
                "across Windows PCs, Macs, and Linux servers! How fast does ordinary floating-point physics actually drift?"
            ),
        },
        {
            "speaker": "Malik",
            "text": (
                "Faster than people blink, Liam! In falsifier GE-H2, standard-library sine — Apple libSystem versus Linux glibc versus Windows UCRT — "
                "diverges between tick ten and tick thirty-seven! Even without transcendentals, MSVC slash fp colon precise versus Clang fused multiply-add "
                "splits apart at tick one hundred ninety-two."
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
            "speaker": "Mei",
            "text": (
                "Tick ten! At sixty frames per second, three operating systems disagree on trajectory state inside one-sixth of a second! "
                "And across eight hundred forty chaotic runs in GE-H7, divergence time tracks Lyapunov's logarithmic slope with R-squared above zero point nine nine four."
            ),
        },
        {
            "speaker": "Liam",
            "text": (
                "So you split the architecture right down the fault line: simulation stays strictly bit-exact in Q32.32 fixed-point integer math, "
                "while GPU pixels live inside a perceptual tolerance bound. Did Q32.32 survive six real machines?"
            ),
        },
        {
            "speaker": "Malik",
            "text": (
                "In GE-H1, we stepped sixty-four Q32.32 rigid bodies for one hundred thousand ticks across thirty target-by-host cells "
                "spanning six physical machines on macOS, Linux, and bare-metal Windows 11. Across twenty-five thousand five hundred SHA-256 checkpoints, "
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
            "speaker": "Mei",
            "text": (
                "And look what that buys in GE-H8: three full one-hour sessions — two hundred sixteen thousand ticks each — "
                "replay bit-for-bit across macOS, Linux, and Windows 11 from forty-four point six kilobytes of gzipped player inputs alone! Zero out of six thousand four hundred eighty checkpoint diffs!"
            ),
        },
        {
            "speaker": "Liam",
            "text": (
                "Forty-four kilobytes for a whole hour of simulation! Wait — doesn't fixed-point arithmetic hit a frame-time wall at scale?"
            ),
        },
        {
            "speaker": "Malik",
            "text": (
                "Interpreted Python hits the twenty-millisecond frame ceiling at just three hundred ninety actors. In GE-H5, compiled RCE Form projections "
                "step ten thousand Q32.32 actors in zero point zero five eight to zero point one two five milliseconds — leaving over ninety-nine percent of a sixteen-millisecond frame free!"
            ),
        },
        {
            "speaker": "Mei",
            "text": (
                "Now test the GPU side of the boundary! Shader compilers across DirectX 12, Apple Metal, and Vulkan never round rasterized fragments identically."
            ),
        },
        {
            "speaker": "Malik",
            "text": (
                "That is GE-H3. Across eight hardware GPU-by-API endpoints spanning DirectX 12, Metal, and Vulkan under headless wgpu, "
                "all twenty-eight hardware pairs passed with PSNR at least sixty-four point one six decibels and structural similarity SSIM "
                "at least zero point nine nine nine eight three three!"
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
            "speaker": "Liam",
            "text": (
                "What about actual game codebases across Unity C-sharp, Bevy Rust ECS, and Godot 4 GDScript?"
            ),
        },
        {
            "speaker": "Malik",
            "text": (
                "In GE-H4, seventeen admitted RCE Forms across Haunted Jaunt, Survival Shooter, and Tanks cut behavior source lines of code "
                "by seventy-six point two two percent versus Unity C-sharp, sixty-one point four seven percent versus Bevy Rust, and fifty-one point nine nine percent "
                "versus Godot GDScript with zero out of six hundred eighty trace mismatches! And in GE-H9, our headless Form-to-Godot 4.7.2 emitter "
                "matched native GDScript on thirty-six out of thirty-six tasks across eighteen thousand ticks!"
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
            "speaker": "Mei",
            "text": (
                "Notice how GE-H6 echoes OpenIE's Three-Body Problem in Computing and Interface Economics: static Form plus manifest checking caught "
                "ninety-eight point four six percent of one hundred thirty injected handoff faults at F1 zero point nine nine two two, versus zero point one one five nine for parse-only!"
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
            "speaker": "Liam",
            "text": (
                "And keeping telemetry honest, measured_j stays explicitly unset on the game-engine runs because no inline rail shunt was wired to those six hosts!"
            ),
        },
        {
            "speaker": "Mei",
            "text": (
                "Up next in Episode Six, Misha, Sean, and Claire descend into LUT6 Boolean fabrics, sovereign MEI-JCP hardware tags, and JouleOS!"
            ),
        },
    ],
}

EPISODE_06: dict[str, Any] = {
    "id": "ep06-lut6-metabolic-jouleos",
    "number": 6,
    "title": "Downward LUT6 Compilation, MEI-JCP Sovereign Hardware Tags & JouleOS",
    "subtitle": "Misha, Sean, and Claire examine 970 MB NVMe MoE streaming, 81-RAMB36E2 LUT6 fabrics, 32x24 mm PCB tags, and JouleOS",
    "summary": (
        "Misha, Sean, and Claire trace Mixture of Limits cascades from 34.66B sparse-MoE NVMe streaming (970 MB RAM, 6.773 J/tok reported_j) "
        "down to Beneš-routed LUT6 FPGA fabrics, 32x24 mm MEI-JCP sovereign PCB tags, and JouleOS."
    ),
    "topic_tags": ["lut-adapt", "mei", "jouleos", "fpga"],
    "published_utc": "2026-11-23T08:30:00Z",
    "turns": [
        {
            "speaker": "Misha",
            "text": (
                "Welcome back to Episode Six of OpenIE Research Radio! I'm Misha, joined by Sean and Claire — "
                "AI-synthesized OpenIE research personas voiced via ElevenLabs neural studio voices and grounded in verified Open Interface Engineering studies. "
                "Today we follow intelligence downward into silicon: Downward LUT6 Compilation, Metabolic Intelligence MEI-JCP tags, and JouleOS."
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
            "speaker": "Sean",
            "text": (
                "Let's start with the economic parallel from Spell Check is Global and The Promised Trillion Dollar AI-Coding Market: "
                "imagine if every time someone mistyped 'recieve' in an email, a cloud vendor fired up an eighty-gigabyte GPU node to fix it!"
            ),
        },
        {
            "speaker": "Misha",
            "text": (
                "In the early 1980s, standalone spell checkers cost hundreds of dollars! Spell check reached seven billion people only when its marginal cost "
                "dropped to a local dictionary lookup bundled inside every editor. Why should recurring code repairs burn frontier joules forever?"
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
            "speaker": "Claire",
            "text": (
                "In Downward LUT6 Compilation, we build that exact downward cascade. When genuine novelty arrives at the top tier, "
                "custom Apple Metal INT4 Mixture-of-Experts and GatedDeltaNet compute shaders stream Qwen 3.6 35B-A3B directly off NVMe via Darwin F_NOCACHE."
            ),
        },
        {
            "speaker": "Sean",
            "text": (
                "Hold on Claire — a thirty-five-billion-parameter model normally eats seventy gigabytes of unified RAM in FP16! What was our resident footprint?"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Nine hundred seventy megabytes — just one point four seven percent of FP16 RAM! It hit one hundred percent exact token parity, "
                "cut NVMe reads twelve point three times through expert locality, and ran at six point seven seven three joules per token of dual-channel reported_j."
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
            "speaker": "Misha",
            "text": (
                "And once a frontier wake passes deterministic pytest gates, we compile that certified skill downward so the thirty-five-B model sleeps on repeat arrivals!"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Exactly. Across our forty-eight-task coding bakeoff and sixteen-repo SWE-Mini suite, the cascade closed eighty-seven point five percent "
                "with zero broken commits, waking the thirty-five-B tier on only twenty-two point nine two percent of tasks. By Wave 3 replay, "
                "certified wakes ran in two point eight nine milliseconds at zero point zero four two four joules reported_j — and synthesize downward "
                "via Yosys and Verilator into eighty-one RAMB36E2 Beneš-routed LUT6 blocks targeting Xilinx Kria xck26!"
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
            "speaker": "Sean",
            "text": (
                "Zero multiply-accumulates — pure Boolean truth tables! Now shrink the energy budget all the way down to a CR2032 coin cell at minus twenty Celsius "
                "in Metabolic Intelligence!"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "In the MEI white paper, we shipped MEI-JCP-Tag-v1: a complete open manufacturing package — DRC-clean two-layer thirty-two by twenty-four millimeter "
                "KiCad PCB, RS-274X Gerbers, BOM, and a thirty-six by twenty-eight by seven-point-five millimeter STEP enclosure pairing an STM32WBA52 "
                "with a physical Texas Instruments INA238 shunt monitor and FRAM."
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
            "speaker": "Sean",
            "text": (
                "Quick audit check for the listeners: do we claim physical bench-metered joules off a fabbed MEI-JCP tag board yet?"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Explicitly no — board_metered is false and measured_j is unset until physical boards return from fabrication. "
                "What IS verified is our ten-thousand-wakeup CR2032 electro-thermal simulation preserving one hundred percent of critical alerts "
                "at minus twenty Celsius across two thousand six hundred eighty Ed25519 canonical CBOR JCR-1 receipts."
            ),
        },
        {
            "speaker": "Misha",
            "text": (
                "And binding JCR-1 receipts, SATB drift gates, and agent sandboxes into one operating-system contract is The Search for JouleOS!"
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
            "speaker": "Claire",
            "text": (
                "Legacy OS kernels multiplex time and virtual memory without checking energy before an agent acts. Our Rust reference spine "
                "passes three hundred ten workspace tests and verifies seventy-eight thousand four hundred provenance pairs across a meet-semilattice "
                "that schedules, budgets, and refuses out-of-envelope agent actions."
            ),
        },
        {
            "speaker": "Sean",
            "text": (
                "An OS that refuses runaway joule spend before it happens! Up next in Episode Seven, Amara, Nia, and senior fellow Arthur "
                "ask what it would take to look up tomorrow!"
            ),
        },
        {
            "speaker": "Misha",
            "text": (
                "Stay tuned for Episode Seven — Time as an Index!"
            ),
        },
    ],
}
