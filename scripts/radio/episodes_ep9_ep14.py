#!/usr/bin/env python3
"""OpenIE Research Radio — Dedicated Ecosystem Desk Roundtables: Episodes 9–14.

Track 1B: Six flagship three-voice roundtables — one for each *.openie.dev broadcast desk:
  - ep09: avalanche.openie.dev  (Amara, Marcus, Kenji)
  - ep10: stack.openie.dev      (Elena, Liam, Arthur)
  - ep11: compute.openie.dev    (Mei, Nia, Tariq)
  - ep12: synthesis.openie.dev  (Mateo, Marcus, Rohan)
  - ep13: knowledge.openie.dev  (Priya, Sean, Claire)
  - ep14: database.openie.dev   (Cecily, Marcus, Kwame)
"""

from __future__ import annotations

from typing import Any

EPISODE_09: dict[str, Any] = {
    "id": "ep09-avalanche-ratchet-desk",
    "number": 9,
    "desk": "avalanche",
    "desk_domain": "avalanche.openie.dev",
    "title": "OpenIE Avalanche Desk: The Nine Rungs and Crossing the Compilation Threshold",
    "subtitle": "Amara, Marcus, and Kenji trace 3.8 billion years of signaling ratchets, why Rung 5 Tool Use stalls, and how downward compilation unlocks Rungs 6–9",
    "summary": (
        "At the OpenIE Avalanche Desk (avalanche.openie.dev), Amara, Marcus, and Kenji unpack the nine-rung intelligence ratchet across "
        "3.8 billion years of biology and 76 years of AI, diagnose why ephemeral Rung 5 tool loops stall on compounding error and energy, "
        "and show how DES-10 digital enzymes (98/100 pass, 927.30 uJ Thor shunt measured_j) and downward compilation cross into Rungs 6–9."
    ),
    "topic_tags": ["avalanche-desk", "nine-rungs", "compilation-threshold", "des-10"],
    "studies": ["communication-avalanche", "lut-adapt", "deterministic-null", "rce-jepa", "latency"],
    "published_utc": "2026-11-23T10:00:00Z",
    "turns": [
        {
            "speaker": "Amara",
            "text": (
                "Welcome to the OpenIE Avalanche Desk on OpenIE Research Radio! I'm Amara, joined by Marcus and Kenji — "
                "three AI-synthesized OpenIE research personas voiced via ElevenLabs studio neural voices and grounded strictly in verified "
                "Open Interface Engineering studies. Today we're mapping avalanche.openie.dev: the nine rungs and the compilation threshold."
            ),
            "tts_text": (
                "Welcome to the Open I E Avalanche Desk on Open I E Research Radio! I'm Amara, joined by Marcus and Kenji — "
                "three A I synthesized Open I E research personas voiced via ElevenLabs studio neural voices and grounded strictly in verified "
                "Open Interface Engineering studies. Today we're mapping avalanche dot open I E dot dev: the nine rungs and the compilation threshold."
            ),
            "cards": [
                {
                    "kind": "ecosystem",
                    "badge": "DESK 01",
                    "title": "OpenIE Avalanche Desk (avalanche.openie.dev)",
                    "detail": "Maps Rungs 1–5 (Ephemeral) across the Compilation Threshold into Rungs 6–9 (Compiled) with an 18-milestone forecast.",
                    "href": "https://avalanche.openie.dev",
                }
            ],
        },
        {
            "speaker": "Amara",
            "text": (
                "Think about learning to ride a bicycle. On day one, your conscious brain narrates every wobble and burns exhausting focus. "
                "A month later, your cerebellum has compiled balance into a fast reflex, freeing conscious energy for new terrain."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "And right now, almost the whole AI industry is riding that bike in day-one panic mode forever! Every recurring tool call wakes up "
                "a giant cloud model from scratch. Kenji, where does that sit on the nine-rung map?"
            ),
        },
        {
            "speaker": "Kenji",
            "text": (
                "Right at Rung Five — Ephemeral Tool Use, Marcus! Rungs One through Five cover access, generation, reasoning, transport, "
                "and live tool calling, yet every win evaporates the second the context window closes."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[T]",
                    "title": "The Communication Tool Avalanche (45 Lean 4.36.0 Theorems)",
                    "detail": "Six-kernel bubblewrap-verified ratchet across 24 biological rungs (CL01–CL24), 38 AI milestones (1950–2026), and 10 AI camps.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Amara",
            "text": (
                "Zoom out to three point eight billion years of biology across twenty-four evolutionary rungs — single microbes didn't just shout chemical noise into the ocean."
            ),
        },
        {
            "speaker": "Kenji",
            "text": (
                "Across forty-five six-kernel Lean 4.36.0 theorems with zero sorry, nature and seventy-six years of AI share one ratchet: "
                "externalize state, ingest across a threshold gate, and transform without regressing. Bacterial quorum switches save up to ninety-nine point one seven percent "
                "of low-density ATP, and fifty-millisecond calcium plugs save ninety-five percent of punctured cyanobacterial filaments!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[M]",
                    "title": "Biological Gate Controls (CA-M1 & CA-M2)",
                    "detail": "Cooperative quorum switches save 95.49%–99.17% ATP at low density; 50 ms SepJ plugs preserve 19/20 (95.0%) cells vs 0% ungated.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Now show what breaks at Rung Five when chatty multi-agent loops skip that gate — like playing whisper-down-the-lane with long memos!"
            ),
        },
        {
            "speaker": "Kenji",
            "text": (
                "On our sixty-task repair benchmark, an unattested four-agent prose cascade dropped to eighty-six point six seven percent with thirteen point three percent "
                "broken commits! And across five regimes on our hundred-task suite, every solo AI camp C1 through C10 stalled at or below forty-nine percent."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "STALL <= 49%",
                    "title": "Rung-5 Solo Camp Ceiling & Unattested Cascade Drift",
                    "detail": "Every solo AI camp C1–C10 stalls at <=49% across 5 regimes; unattested 4-agent chat suffers 13.3% broken commits.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Amara",
            "text": (
                "So how does ten-camp Digital Enzymatic Synthesis — DES-10 — carry intelligence across the Compilation Threshold?"
            ),
        },
        {
            "speaker": "Kenji",
            "text": (
                "Like a biological enzyme lowering an activation barrier and stepping away unconsumed, DES-10 replaces hundred-joule prose chat with typed "
                "BLAKE3 and Ed25519 envelopes plus deterministic verifiers. On Jetson AGX Thor's physical INA3221 rail shunts, one kilobyte edge verification "
                "costs nine hundred twenty-seven point three microjoules of measured_j — lifting solve rate to ninety-eight out of one hundred!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "measured_j",
                    "title": "DES-10 on Jetson AGX Thor Shunts (98/100 Pass)",
                    "detail": "927.30 uJ physical TI INA3221 VDD_CPU_SOC_MSS measured_j per 1 KiB edge; 9.26x–26.87x higher CpJ and 75,374x lower handoff energy.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Nine point two six to twenty-six point eight seven times higher physical-shunt Coherence per Joule! Walk us up Rungs Six through Nine."
            ),
        },
        {
            "speaker": "Kenji",
            "text": (
                "Rung Six sleeps at zero clocks and pins verified cases into sub-microsecond memory maps. Rung Seven compiles wins into integer Forms "
                "and LUT6 silicon. Rung Eight locks seven-axis provenance across six Lean kernels, and Rung Nine enforces hardware energy budgets in JouleOS!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[M]",
                    "title": "Downward Compilation & Post-Removal Ratchet (CA-M5)",
                    "detail": "Attested artifact libraries retain 100.0% competence at Generation 20 after teachers leave vs 29.27% under unverified imitation.",
                    "href": "/papers/lut-adapt/",
                }
            ],
        },
        {
            "speaker": "Amara",
            "text": (
                "Just like model CA-M5, where an attested external library holds one hundred percent competence ten generations after teachers leave, "
                "while unverified imitation collapses to twenty-nine percent!"
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "And across our eighteen forecast milestones and neuro-vesicle audits, where does the falsifier line sit?"
            ),
        },
        {
            "speaker": "Kenji",
            "text": (
                "Every milestone declares an explicit energy-and-accuracy kill gate, and our eighteen BCI and sixteen extracellular-vesicle audits "
                "strictly quarantine preclinical animal rescue from unverified human clinical efficacy!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "[E] vs [S]",
                    "title": "18-Milestone Forecast Kill Gates & Clinical Quarantine",
                    "detail": "HM01–HD04 milestones declare exact energy/solve kill criteria; animal EV/BCI rescue [E] never extrapolates to human efficacy [S].",
                    "href": "/papers/latency/",
                }
            ],
        },
        {
            "speaker": "Amara",
            "text": (
                "Externalize, gate, and compile downward so intelligence compounds! Explore avalanche.openie.dev, and join Elena, Liam, and Arthur next at the OpenIE Stack Desk!"
            ),
            "tts_text": (
                "Externalize, gate, and compile downward so intelligence compounds! Explore avalanche dot open I E dot dev, and join Elena, Liam, and Arthur next at the Open I E Stack Desk!"
            ),
        },
    ],
}

EPISODE_10: dict[str, Any] = {
    "id": "ep10-stack-three-altitudes-desk",
    "number": 10,
    "desk": "stack",
    "desk_domain": "stack.openie.dev",
    "title": "OpenIE Stack Desk: Shannon, von Neumann, and Hurwicz on One Substrate",
    "subtitle": "Elena, Liam, and Arthur show how information theory, game theory, and mechanism design lock together when computation pays joules",
    "summary": (
        "At the OpenIE Stack Desk (stack.openie.dev), Elena, Liam, and Arthur connect Shannon-Landauer bit thermodynamics, "
        "von Neumann-Nash strategic interaction, and Hurwicz-Maskin-Myerson incentive-compatible commit gates (11,428 pJ on KV260) "
        "across nine Periodic Stacks, handoff verification, and Jevons task satiation."
    ),
    "topic_tags": ["stack-desk", "shannon-landauer", "mechanism-design", "commit-gates"],
    "studies": ["agency", "gates", "three-body", "satiation", "interface-economics"],
    "published_utc": "2026-11-23T10:30:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome to the OpenIE Stack Desk on OpenIE Research Radio! I'm Elena, joined by Liam and senior fellow Arthur — "
                "three AI-synthesized OpenIE research personas voiced with ElevenLabs studio neural speech and grounded strictly in verified "
                "Open Interface Engineering studies. Today we open stack.openie.dev: Shannon, von Neumann, and Hurwicz on one substrate."
            ),
            "tts_text": (
                "Welcome to the Open I E Stack Desk on Open I E Research Radio! I'm Elena, joined by Liam and senior fellow Arthur — "
                "three A I synthesized Open I E research personas voiced with ElevenLabs studio neural speech and grounded strictly in verified "
                "Open Interface Engineering studies. Today we open stack dot open I E dot dev: Shannon, von Neumann, and Hurwicz on one substrate."
            ),
            "cards": [
                {
                    "kind": "ecosystem",
                    "badge": "DESK 02",
                    "title": "OpenIE Stack Desk (stack.openie.dev)",
                    "detail": "Unifies Shannon-Landauer bit physics, von Neumann-Nash games, and Hurwicz mechanism design across 9 Periodic Stacks and Zones Z1–Z3.",
                    "href": "https://stack.openie.dev",
                }
            ],
        },
        {
            "speaker": "Liam",
            "text": (
                "Arthur, in universities, physicists study Shannon and Landauer while economists study von Neumann and Hurwicz across campus! "
                "Give us an everyday picture of why they're actually three altitudes of the same machine."
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Picture a busy city suspension bridge, Liam! Down in the steel cables, engineers calculate load limits and dissipation — "
                "that is Claude Shannon and Rolf Landauer, counting bits and the two point eight seven one times ten to the minus twenty-one joule floor "
                "paid whenever a bit is irreversibly erased at room temperature."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[T]",
                    "title": "Thermodynamic Bounds and an Optimal Tempo",
                    "detail": "Defines an agent as a goal-holding system under an energy budget; ranks valid completions by progress per joule.",
                    "href": "/papers/agency/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Now move up onto the roadway deck, where thousands of rush-hour drivers are choosing lanes!"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "On the deck, goal-holding agents react strategically to each other — that is John von Neumann and John Nash's game theory. "
                "And at the entrance plaza sits the tollbooth and axle scale: Leonid Hurwicz, Eric Maskin, and Roger Myerson's mechanism design, "
                "shaping the admission rules so honesty and safety beat bluffing!"
            ),
        },
        {
            "speaker": "Liam",
            "text": (
                "Wait — that tollbooth explains why unverified chat models hallucinate! If guessing confidently pays the same reward as verifying a patch, bluffing wins!"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Precisely! Metered Commit Gates place a physical Hurwicz mechanism right before state mutation: nothing irreversible commits until a deterministic check passes. "
                "On a Xilinx Kria KV260 module metered via an inline INA260 shunt, one gate cycle costs just eleven thousand four hundred twenty-eight picojoules of board-metered energy!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "measured_j",
                    "title": "Metered Commit Gate as Hurwicz Mechanism (11,428 pJ)",
                    "detail": "KV260 whole-module INA260 board_metered gate cycle refuses unverified commits and shifts ranking to energy-to-correct-completion.",
                    "href": "/papers/gates/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "How does stack.openie.dev map every computing workload across those three altitudes?"
            ),
            "tts_text": (
                "How does stack dot open I E dot dev map every computing workload across those three altitudes?"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Every computational act sums primitive counts times hardware joule weights across nine Periodic Stacks, partitioned into three zones: "
                "Zone One for deterministic lookup and checking, Zone Two for bounded search and routing, and Zone Three for open-world frontier synthesis."
            ),
        },
        {
            "speaker": "Liam",
            "text": (
                "Prove to a skeptic why we need all three zones instead of running pure Zone One lookup or pure Zone Three neural!"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Deterministic Null tested both across four thousand thirty held-out instances! On bounded formal Track-A classes, single-turn neural models "
                "failed to beat Zone One integer lookup on nine of ten cells. On open public benchmarks like SWE-bench Verified where lookup hits zero, "
                "Zone Three added up to ninety-five percentage points — and crystallizing verified outputs back into Zone One cut repeat energy spend three point five nine times!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "Z1 vs Z3",
                    "title": "Zone Boundary Falsifier (9/10 Bounded vs +95 pp Open)",
                    "detail": "Single-turn neural fails to beat Shape-D lookup on 9/10 bounded formal cells, yet adds +45.80 to +95.00 pp on open-world tasks.",
                    "href": "/papers/deterministic-null/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Now connect that to The Three-Body Problem in Computing — why do catastrophic failures cluster at multi-party handoffs?"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Because specifiers, builders, and users rely on unwritten assumptions — like Mars Climate Orbiter's unit mismatch or Ariane 5's float overflow! "
                "Checking static Forms and manifests caught ninety-eight point four six percent of one hundred thirty injected handoff faults versus near-zero for syntax parsing."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[E]",
                    "title": "Handoff Stability & Unexamined Interface Economics",
                    "detail": "98.46% fault catch rate (F1 = 0.9922) when handoff assumptions are machine-checked; failure cost ledgers never mix accounted and survey figures.",
                    "href": "/papers/interface-economics/",
                }
            ],
        },
        {
            "speaker": "Liam",
            "text": (
                "And economically, you refuse to blend survey guesses into audited losses, while warning that cheaper tasks still trigger Jevons rebound!"
            ),
        },
        {
            "speaker": "Arthur",
            "text": (
                "Exactly. Each bounded job hits task satiation the moment its verifier passes, yet cheaper completions unlock new jobs economy-wide. "
                "Token prices fall, while physics guarantees electricity is never free."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "[E]",
                    "title": "Task Satiation vs. Jevons Aggregate Rebound",
                    "detail": "Per-task energy drops when gated at completion, yet aggregate grid demand can still rise as cheaper automation unlocks new workloads.",
                    "href": "/papers/satiation/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Shannon sets the bit floor, von Neumann maps the players, and Hurwicz gates the commit. Explore stack.openie.dev, and join Mei, Nia, and Tariq next at the OpenIE Compute Desk!"
            ),
            "tts_text": (
                "Shannon sets the bit floor, von Neumann maps the players, and Hurwicz gates the commit. Explore stack dot open I E dot dev, and join Mei, Nia, and Tariq next at the Open I E Compute Desk!"
            ),
        },
    ],
}

EPISODE_11: dict[str, Any] = {
    "id": "ep11-compute-joule-substrate-desk",
    "number": 11,
    "desk": "compute",
    "desk_domain": "compute.openie.dev",
    "title": "OpenIE Compute Desk: Physical Shunts, Zero-Clock Wakeups, and Lookup Silicon",
    "subtitle": "Mei, Nia, and Tariq separate measured_j from reported_j and est_j, put polling loops to sleep, and tour 250 MHz Beneš LUT6 pages",
    "summary": (
        "At the OpenIE Compute Desk (compute.openie.dev), Mei, Nia, and Tariq audit 258 hardware primitives across physical TI INA238/INA3221 "
        "rail shunts (measured_j), CPU/GPU counters (reported_j), and RTL power models (est_mW), alongside eventfd zero-clock wakeups, "
        "20.07x pre-compiled Rust preludes, and 250 MHz Beneš-routed LUT6 FPGA fabrics."
    ),
    "topic_tags": ["compute-desk", "measured-j", "eventfd", "lut6-silicon"],
    "studies": ["rce-compile", "satb-harness", "lut-adapt", "mei", "jouleos"],
    "published_utc": "2026-11-23T11:00:00Z",
    "turns": [
        {
            "speaker": "Mei",
            "text": (
                "Welcome to the OpenIE Compute Desk on OpenIE Research Radio! I'm Mei, joined by Nia and Tariq — "
                "three AI-synthesized OpenIE research personas voiced via ElevenLabs studio neural voices and grounded strictly in verified "
                "Open Interface Engineering studies. Today we explore compute.openie.dev: physical shunts, zero-clock wakeups, and lookup silicon."
            ),
            "tts_text": (
                "Welcome to the Open I E Compute Desk on Open I E Research Radio! I'm Mei, joined by Nia and Tariq — "
                "three A I synthesized Open I E research personas voiced via ElevenLabs studio neural voices and grounded strictly in verified "
                "Open Interface Engineering studies. Today we explore compute dot open I E dot dev: physical shunts, zero-clock wakeups, and lookup silicon."
            ),
            "cards": [
                {
                    "kind": "ecosystem",
                    "badge": "DESK 03",
                    "title": "OpenIE Compute Desk (compute.openie.dev)",
                    "detail": "258 compute primitives across 33 families linking physical shunt rails, zero-clock OS sleep, LUT6 silicon, and JouleOS.",
                    "href": "https://compute.openie.dev",
                }
            ],
        },
        {
            "speaker": "Nia",
            "text": (
                "Tariq, benchmarks constantly blur datasheet math, software counters, and physical wattmeters! Give us a household analogy "
                "for OpenIE's three strict columns: est_j, reported_j, and measured_j."
            ),
            "tts_text": (
                "Tariq, benchmarks constantly blur datasheet math, software counters, and physical wattmeters! Give us a household analogy "
                "for Open I E's three strict columns: estimated joules, reported joules, and measured joules."
            ),
        },
        {
            "speaker": "Tariq",
            "text": (
                "Think of tracking your home's hot water, Nia! Multiplying shower minutes by a brochure rate is an analytical estimate — est_j. "
                "Reading what a smart dishwasher's firmware thinks it used is software counter telemetry — reported_j, like RAPL, IOReport, or NVML. "
                "Clamping a calibrated brass meter directly onto the copper pipe is physical inline measurement — measured_j!"
            ),
            "tts_text": (
                "Think of tracking your home's hot water, Nia! Multiplying shower minutes by a brochure rate is an analytical estimate — estimated joules. "
                "Reading what a smart dishwasher's firmware thinks it used is software counter telemetry — reported joules, like rapple, I O Report, or N V M L. "
                "Clamping a calibrated brass meter directly onto the copper pipe is physical inline measurement — measured joules!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "measured_j",
                    "title": "SATB 5-Host Telemetry & Attribution Audit",
                    "detail": "Separates physical TI INA238/INA3221 rail shunts (measured_j) from RAPL/IOReport/NVML counters (reported_j) and datasheet models (est_j).",
                    "href": "/papers/satb-harness/",
                }
            ],
        },
        {
            "speaker": "Mei",
            "text": (
                "Across two hundred fifty-eight primitives in thirty-three families, those three columns never mix. What did our five-host SATB audit uncover?"
            ),
        },
        {
            "speaker": "Tariq",
            "text": (
                "On Jetson AGX Thor, physical Texas Instruments INA238 and INA3221 shunts measure nine hundred twenty-seven point three microjoules of real measured_j "
                "per attested edge. Meanwhile, cloud-standard Kepler CPU-ratio splitting erred by thirty-two point five nine up to eighty-nine point eight eight percent, "
                "and Windows 11 tick aliasing missed eighty-nine point eight eight percent of short bursts!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "89.88% ERR",
                    "title": "Kepler CPU Splitting & Windows Tick Aliasing Falsified",
                    "detail": "CPU-ratio splitting errs 32.59%–89.88%; SATB Falsifier 6 automatically withholds noisy shared-host net attribution.",
                    "href": "/papers/satb-harness/",
                }
            ],
        },
        {
            "speaker": "Nia",
            "text": (
                "Almost ninety percent error! Now explain why idle agent loops waste watts even when zero tasks arrive."
            ),
        },
        {
            "speaker": "Mei",
            "text": (
                "Busy-wait polling is like sprinting to open your front door every second all night instead of waiting for the doorbell to ring!"
            ),
        },
        {
            "speaker": "Tariq",
            "text": (
                "Switching from one-kilohertz polling to zero-clock kernel eventfd and kqueue wakeups eliminated one hundred percent of empty polls across all five hosts — "
                "cutting one-percent-duty energy by up to three point two two times on Linux sockets and six point two two times on Apple Silicon!"
            ),
            "tts_text": (
                "Switching from one-kilohertz polling to zero-clock kernel event F D and K queue wakeups eliminated one hundred percent of empty polls across all five hosts — "
                "cutting one-percent-duty energy by up to three point two two times on Linux sockets and six point two two times on Apple Silicon!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "reported_j",
                    "title": "Zero-Clock Kernel Wakeups (2.21x–6.22x Idle Savings)",
                    "detail": "Linux eventfd & Darwin kqueue eliminate 100% of empty polls across 5 hardware hosts vs 1 kHz polling.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Nia",
            "text": (
                "And in RCE Compile, you caught Rust builds burning fifty-six joules re-compiling the same runtime helpers on every kernel!"
            ),
        },
        {
            "speaker": "Tariq",
            "text": (
                "Pre-compiling that shared runtime prelude once into librce_rt.rlib cut per-kernel rustc dash O3 core reported_j twenty point zero seven times "
                "from fifty-six point two nine joules down to two point eight one joules — dropping payback horizon N-star to one thousand seventy-nine runs!"
            ),
            "tts_text": (
                "Pre-compiling that shared runtime prelude once into lib R C E runtime R lib cut per-kernel rust C dash O three core reported joules twenty point zero seven times "
                "from fifty-six point two nine joules down to two point eight one joules — dropping payback horizon N star to one thousand seventy-nine runs!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "20.07x CUT",
                    "title": "RCE Compile Shared Prelude (56.29 J -> 2.81 J)",
                    "detail": "Pre-compiling librce_rt.rlib cuts rustc -O3 core reported_j 20.07x and lowers payback N* 28.8x to 1,079 runs across 300 verified cells.",
                    "href": "/papers/rce-compile/",
                }
            ],
        },
        {
            "speaker": "Mei",
            "text": (
                "Now take us down to silicon.openie.dev and our two-hundred-fifty-megahertz Beneš-routed LUT6 fabric!"
            ),
            "tts_text": (
                "Now take us down to silicon dot open I E dot dev and our two-hundred-fifty-megahertz Benesh-routed L U T six fabric!"
            ),
        },
        {
            "speaker": "Tariq",
            "text": (
                "Picture a thirteen-level railway switchyard routing six wires at a time into tiny sixty-four-bit truth-table flashcards across eighty-one block RAMs "
                "on a Xilinx Kria KV260 FPGA. Clock-enable gating passed three hundred twenty out of three hundred twenty Verilator checks at two hundred fifty megahertz, "
                "cutting modeled idle power four point one times down to fifteen point five nine estimated milliwatts!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "est_mW",
                    "title": "250 MHz CE-Gated Beneš LUT6 Fabric (15.59 est_mW)",
                    "detail": "4-stage, 13-level 81-RAMB36E2 Kria xck26 RTL achieves 320/320 Verilator parity, cutting idle power 4.10x and stream power 2.69x.",
                    "href": "/papers/lut-adapt/",
                }
            ],
        },
        {
            "speaker": "Nia",
            "text": (
                "Quick audit check: both that LUT6 RTL figure and our thirty-two-by-twenty-four-millimeter MEI-JCP sovereign PCB tag refuse premature measured_j claims, right?"
            ),
        },
        {
            "speaker": "Tariq",
            "text": (
                "Strictly! LUT6 stays labeled est_mW, and MEI-JCP-Tag-v1 keeps board_metered false until fabricated boards sit under probes — "
                "all scheduled under energy grants by our three-hundred-ten-test JouleOS Rust spine."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "measured_j: NULL",
                    "title": "Strict Pre-Bench Quarantine (LUT6 RTL & MEI-JCP-Tag-v1)",
                    "detail": "RTL power stays labeled est_mW and open KiCad/STEP tag hardware keeps board_metered=false until physical boards are shunt-probed.",
                    "href": "/products/mei/",
                }
            ],
        },
        {
            "speaker": "Mei",
            "text": (
                "Meter the rail honestly, sleep at zero clocks, and route settled logic into lookup silicon! Visit compute.openie.dev, and join Mateo, Marcus, and Rohan next at the OpenIE Synthesis Desk!"
            ),
            "tts_text": (
                "Meter the rail honestly, sleep at zero clocks, and route settled logic into lookup silicon! Visit compute dot open I E dot dev, and join Mateo, Marcus, and Rohan next at the Open I E Synthesis Desk!"
            ),
        },
    ],
}

EPISODE_12: dict[str, Any] = {
    "id": "ep12-synthesis-routing-verb-desk",
    "number": 12,
    "desk": "synthesis",
    "desk_domain": "synthesis.openie.dev",
    "title": "OpenIE Synthesis Desk: Why Routing Beats Cold-Start Generation",
    "subtitle": "Mateo, Marcus, and Rohan unpack Mixture of Limits cascades, span-normalized FormEBM-v3 pre-filtering, RCE integer verification, and 0.00% broken commits",
    "summary": (
        "At the OpenIE Synthesis Desk (synthesis.openie.dev), Mateo, Marcus, and Rohan show why energy-ordered Mixture of Limits routing "
        "beats cold-start generation: deterministic repair ladders, 6.05M FormEBM-v3 pre-filtering (0.9437 AUROC), 970 MB NVMe sparse-MoE streaming, "
        "RCE integer state-machine verification, 91.67% / 90.62% verified coding rates, and 0.00% broken commits."
    ),
    "topic_tags": ["synthesis-desk", "mixture-of-limits", "formebm-v3", "zero-broken-commits"],
    "studies": ["lut-adapt", "rce-jepa", "deterministic-null", "spellcheck", "ai-coding-market"],
    "published_utc": "2026-11-23T11:30:00Z",
    "turns": [
        {
            "speaker": "Mateo",
            "text": (
                "Welcome to the OpenIE Synthesis Desk on OpenIE Research Radio! I'm Mateo, joined by Marcus and Rohan — "
                "three AI-synthesized OpenIE research personas voiced via ElevenLabs studio neural speech and grounded strictly in verified "
                "Open Interface Engineering studies. Today we're live on synthesis.openie.dev: why routing beats cold-start generation!"
            ),
            "tts_text": (
                "Welcome to the Open I E Synthesis Desk on Open I E Research Radio! I'm Mateo, joined by Marcus and Rohan — "
                "three A I synthesized Open I E research personas voiced via ElevenLabs studio neural speech and grounded strictly in verified "
                "Open Interface Engineering studies. Today we're live on synthesis dot open I E dot dev: why routing beats cold-start generation!"
            ),
            "cards": [
                {
                    "kind": "ecosystem",
                    "badge": "DESK 04",
                    "title": "OpenIE Synthesis Desk (synthesis.openie.dev)",
                    "detail": "Routing as Verb: energy-ordered Mixture of Limits cascades, FormEBM-v3 pre-filtering, RCE verification, and 0.00% broken commits.",
                    "href": "https://synthesis.openie.dev",
                }
            ],
        },
        {
            "speaker": "Mateo",
            "text": (
                "Imagine walking into a clinic with a thumb splinter and having twelve cardiac surgeons scrub in with an MRI scanner! "
                "Waking a hundred-billion-parameter cloud model to fix a missing import or recurring bug is that exact hospital triage mistake."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "And trillion-dollar AI coding forecasts assume we pay that open-heart-surgery bill on every line of code forever! "
                "Rohan, how does Mixture of Limits flip the primary verb to routing?"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[E]",
                    "title": "Spell Check is Global & Trillion-Dollar Coding Market",
                    "detail": "Forecasts assume perpetual frontier model calls; downward reuse drives marginal cost of recurring code toward local electricity.",
                    "href": "/papers/ai-coding-market/",
                }
            ],
        },
        {
            "speaker": "Rohan",
            "text": (
                "We order tiers strictly by joules, Marcus! Gear Zero checks sub-microsecond lookup pages and deterministic repair rules at zero model calls. "
                "Gear One runs tiny millisecond neural proposers and energy rankers. Only hard misses wake sparse frontier experts — and every commit passes a deterministic gate."
            ),
        },
        {
            "speaker": "Mateo",
            "text": (
                "Show us that asymmetry in RCE-JEPA between proposing code and checking an integer state-machine Form!"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "On Apple M5 Max reported_j, checking an RCE Form costs forty-nine point zero four millijoules, versus eighty-four point two five joules "
                "for one local thirty-five-B proposal — seventeen hundred eighteen times cheaper! Our zero-model-call ladder closes seventy-three point five percent "
                "of broken Forms, and eight-point-four-two-million-parameter FormJEPA-v1 lifts that to ninety-one point four percent!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "1,718x GAP",
                    "title": "RCE Checker (49.04 mJ) vs. 35B Proposal (84.25 J)",
                    "detail": "Deterministic repair ladder closes 111/151 (73.5%) at 0 model calls; 8.42M FormJEPA-v1 lifts closure to 138/151 (91.4%).",
                    "href": "/papers/rce-jepa/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Wait — before FormEBM-v3 pre-filtered candidate beams, didn't Wave Four's unnormalized energy scorer stumble on big multi-line edits?"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "It did! Unnormalized scoring penalized valid large edits, dropping out-of-distribution H15 AUROC to zero point two five eight five. "
                "Our span-normalized two-head FormEBM-v3 — just six point zero five million parameters — separates defect density from edit depth, "
                "hitting zero point nine four three seven unseen-shape AUROC and resolving that edit-size inversion!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "0.2585 -> FIXED",
                    "title": "Wave-4 Unnormalized Edit-Span Inversion Resolved in FormEBM-v3",
                    "detail": "6.05M span-normalized two-head FormEBM-v3 reaches 0.9437 unseen-shape AUROC, 94.0% 5-step monotonicity, and fixes large-edit penalty.",
                    "href": "/papers/rce-jepa/",
                }
            ],
        },
        {
            "speaker": "Mateo",
            "text": (
                "And when a genuinely novel task misses the cheap gears and wakes Qwen 3.6 35B-A3B or Nemotron 120B locally?"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "Custom Apple Metal and Rust Burn CubeCL four-bit shaders stream active experts straight off NVMe in nine hundred seventy megabytes of RAM — "
                "one point four seven percent of FP16 — with one hundred percent exact token parity, lifting 120B verified pass rates from forty-three point seven five "
                "to sixty-two point five percent!"
            ),
            "tts_text": (
                "Custom Apple Metal and Rust Burn Cube C L four-bit shaders stream active experts straight off N V M E in nine hundred seventy megabytes of RAM — "
                "one point four seven percent of F P sixteen — with one hundred percent exact token parity, lifting one-twenty-B verified pass rates from forty-three point seven five "
                "to sixty-two point five percent!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "0.00% BROKEN",
                    "title": "91.67% Suite & 90.62% BigCodeBench v0.1.3 (970 MB RAM)",
                    "detail": "Streams 35B-A3B in 970 MB RAM; beats standalone 35B on BigCodeBench (90.62% vs 78.12%) and SWE-bench (2.50x) with 0.00% broken commits.",
                    "href": "/papers/lut-adapt/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Give us the scoreboard across every coding suite — how many broken commits slipped past the verifier?"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "Zero point zero zero percent broken commits! We hit ninety-one point six seven percent on our forty-eight-task suite, "
                "ninety point six two percent on BigCodeBench v0.1.3, forty out of forty on H15-Iterative with Opus 5.5 and Sonnet 5.5, "
                "and replayed crystallized fixes in zero point three two five microseconds at one point seven seven microjoules!"
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "And keep us honest: which repair rung failed its own promotion ceiling?"
            ),
        },
        {
            "speaker": "Rohan",
            "text": (
                "On our hundred-fifty-one-task rce repair audit, Rung F hit two point five percent above our two point zero percent ceiling — "
                "so holds returned false and Rung F stayed locked in observe mode, just like Foundry pilot TF-2026-06's neural router got crushed sixty-three times by an integer grid!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "HOLDS: FALSE",
                    "title": "Rung-F Locked in Observe (2.5% > 2.0%) & MLP Killed by Null",
                    "detail": "Rung F failed its 2.0% promotion gate on 151 tasks; TF-2026-06 neural router lost >60x to a zero-weight integer grid.",
                    "href": "/radio/#foundry",
                }
            ],
        },
        {
            "speaker": "Mateo",
            "text": (
                "Route cheap, verify with integer totality, and crystallize novelty downward! Explore synthesis.openie.dev, and join Priya, Sean, and Claire next at the OpenIE Knowledge Desk!"
            ),
            "tts_text": (
                "Route cheap, verify with integer totality, and crystallize novelty downward! Explore synthesis dot open I E dot dev, and join Priya, Sean, and Claire next at the Open I E Knowledge Desk!"
            ),
        },
    ],
}

EPISODE_13: dict[str, Any] = {
    "id": "ep13-knowledge-six-kernel-desk",
    "number": 13,
    "desk": "knowledge",
    "desk_domain": "knowledge.openie.dev",
    "title": "OpenIE Knowledge Desk: Seven-Axis Time Claims and the Lean 4.36.0 Six-Kernel Audit",
    "subtitle": "Priya, Sean, and Claire unpack tritemporal anti-laundering claims and why 5,496 theorem constants run through six independent Lean checkers inside bubblewrap",
    "summary": (
        "At the OpenIE Knowledge Desk (knowledge.openie.dev), Priya, Sean, and Claire explain seven-axis tritemporal anti-laundering claims "
        "<Vt, Tt, Rt, G, S, C, P> and detail how 5,496 Lean 4.36.0 theorem constants pass con-leche, con-ron, lean4lean, nanoda, leanchecker, "
        "and Lean 4.36.0 inside an isolated Linux bubblewrap sandbox with zero sorry, zero opaque, and zero ofReduceBool."
    ),
    "topic_tags": ["knowledge-desk", "seven-axis-claims", "six-kernel-audit", "lean-4-36"],
    "studies": ["time-as-an-index", "ai-reads-human", "three-body", "rce", "deterministic-null"],
    "published_utc": "2026-11-23T12:00:00Z",
    "turns": [
        {
            "speaker": "Priya",
            "text": (
                "Welcome to the OpenIE Knowledge Desk on OpenIE Research Radio! I'm Priya, joined by Sean and Claire — "
                "three AI-synthesized OpenIE research personas voiced via ElevenLabs studio neural voices and grounded strictly in verified "
                "Open Interface Engineering studies. Today we open knowledge.openie.dev: seven-axis time claims and the Lean 4.36.0 six-kernel audit."
            ),
            "tts_text": (
                "Welcome to the Open I E Knowledge Desk on Open I E Research Radio! I'm Priya, joined by Sean and Claire — "
                "three A I synthesized Open I E research personas voiced via ElevenLabs studio neural voices and grounded strictly in verified "
                "Open Interface Engineering studies. Today we open knowledge dot open I E dot dev: seven-axis time claims and the Lean four point thirty-six six-kernel audit."
            ),
            "cards": [
                {
                    "kind": "ecosystem",
                    "badge": "DESK 05",
                    "title": "OpenIE Knowledge Desk (knowledge.openie.dev)",
                    "detail": "Seven-axis tritemporal claims <Vt, Tt, Rt, G, S, C, P> anchored by 5,496 six-kernel-verified Lean 4.36.0 theorem constants.",
                    "href": "https://knowledge.openie.dev",
                }
            ],
        },
        {
            "speaker": "Priya",
            "text": (
                "Picture how internet rumor laundering works: one blog invents a number, three sites quote the blog, and a chatbot cites all three as consensus! "
                "Or imagine a medical chart overwriting Tuesday's blood draw on Friday without separating when the lab happened from when the edit happened."
            ),
        },
        {
            "speaker": "Sean",
            "text": (
                "Bare English sentences strip away clocks, scope, and primary sources! Claire, how does knowledge.openie.dev make citation laundering impossible?"
            ),
            "tts_text": (
                "Bare English sentences strip away clocks, scope, and primary sources! Claire, how does knowledge dot open I E dot dev make citation laundering impossible?"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Every claim carries seven explicit coordinates, Sean: Valid Time in reality, Transaction Time in the ledger, Reference Time for the horizon frame, "
                "Granularity, Scope, Certainty — T, E, M, or S — and Anti-Laundering Provenance collapsing circular citations back to primary cryptographic digests."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[E]",
                    "title": "AI Reads Human & Typed Epistemic Provenance",
                    "detail": "Pure-Python YAML costs 2,053.8x more parse energy than fixed binary structs (575,799 vs 280.4 nJ/record); typed claims preserve exact axes.",
                    "href": "/papers/ai-reads-human/",
                }
            ],
        },
        {
            "speaker": "Sean",
            "text": (
                "Now test badge T — kernel-checked proofs! Why didn't we stop at one Lean build instead of locking six rival proof checkers inside Linux bubblewrap?"
            ),
            "tts_text": (
                "Now test badge T — kernel-checked proofs! Why didn't we stop at one Lean build instead of locking six rival proof checkers inside Linux bubble-wrap?"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Imagine certifying a jet wing with six independent inspectors from different countries inside a sealed room with no internet! "
                "In 2026, real Lean 4 soundness bugs — CVE-2026-72844 projection confusion, CVE-2026-72711 in add_opaque, binary cache replay, "
                "and compiler-trust ofReduceBool — proved why no single binary should grade its own homework."
            ),
            "tts_text": (
                "Imagine certifying a jet wing with six independent inspectors from different countries inside a sealed room with no internet! "
                "In twenty twenty-six, real Lean four soundness bugs — C V E twenty twenty-six, seventy-two eight forty-four projection confusion, C V E twenty twenty-six, seventy-two seven eleven in add opaque, binary cache replay, "
                "and compiler-trust of reduce bool — proved why no single binary should grade its own homework."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "CVE HARDENED",
                    "title": "2026 Single-Kernel Soundness Advisories Mitigated",
                    "detail": "Defends against CVE-2026-72844 (.proj confusion), CVE-2026-72711 (add_opaque), #16688 (.olean replay), and #16693 (ofReduceBool).",
                    "href": "/papers/time-as-an-index/",
                }
            ],
        },
        {
            "speaker": "Priya",
            "text": (
                "How many OpenIE theorem constants pass that sealed bubblewrap audit?"
            ),
            "tts_text": (
                "How many Open I E theorem constants pass that sealed bubble-wrap audit?"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Five thousand four hundred ninety-six theorem constants — five thousand three hundred ninety-three in RCE, forty-five in Communication Avalanche, "
                "thirty-one in Time as an Index, and twenty-seven in Downward LUT6 Compilation — with zero sorry, zero custom axioms, zero opaque, and zero ofReduceBool!"
            ),
            "tts_text": (
                "Five thousand four hundred ninety-six theorem constants — five thousand three hundred ninety-three in R C E, forty-five in Communication Avalanche, "
                "thirty-one in Time as an Index, and twenty-seven in Downward L U T six Compilation — with zero sorry, zero custom axioms, zero opaque, and zero of reduce bool!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[T] 6/6",
                    "title": "5,496 Six-Kernel-Verified Theorem Constants",
                    "detail": "5,393 (RCE) + 45 (Avalanche) + 31 (Time) + 27 (LUT6) = 5,496 constants; 0 sorry, 0 opaque, 0 custom axioms, 0 ofReduceBool.",
                    "href": "/papers/rce/",
                }
            ],
        },
        {
            "speaker": "Sean",
            "text": (
                "Name all six independent checkers at the table!"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Joachim Breitner's minimal con-leche proved consistent in ZFC set theory; con-ron, its Aeneas-verified Rust refinement; "
                "Mario Carneiro's Lean-in-Lean checker lean4lean; nanoda in standalone Rust blocking sorryAx; fresh-environment leanchecker dash-dash paranoid; "
                "and the post-CVE Lean 4.36.0 C-plus-plus kernel!"
            ),
            "tts_text": (
                "Joachim Breitner's minimal con leh-cheh proved consistent in Z F C set theory; con ron, its Aeneas-verified Rust refinement; "
                "Mario Carneiro's Lean-in-Lean checker lean for lean; nanoda in standalone Rust blocking sorry A X; fresh-environment lean checker dash-dash paranoid; "
                "and the post-C V E Lean four point thirty-six C plus plus kernel!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "bwrap 6-KERNEL",
                    "title": "con-leche · con-ron · lean4lean · nanoda · leanchecker · Lean 4.36.0",
                    "detail": "68,090–68,092 RCE declarations and 58,796–58,798 Time declarations accepted unanimously inside network-isolated bubblewrap.",
                    "href": "https://proof.openie.dev",
                }
            ],
        },
        {
            "speaker": "Priya",
            "text": (
                "Connect that Reference-Time coordinate to horizon.openie.dev and Time as an Index!"
            ),
            "tts_text": (
                "Connect that Reference-Time coordinate to horizon dot open I E dot dev and Time as an Index!"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Those six-kernel proofs show why only Shannon one-time pads survive a mathematical PSPACE time loop, while in known physics every fast lookup "
                "is Hellman precomputation paid ahead of time — dropping from thirty-four percent reuse to zero percent the instant a fresh query-time salt arrives!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[T]",
                    "title": "Horizon Theorem & 195-Entry Temporal Anomaly Ledger",
                    "detail": "Salted query horizons defeat offline Hellman tables (34.0% -> 0.0%); 65,536 SHA-256 spectral runs show 0 bins below p = 10^-6.",
                    "href": "/papers/time-as-an-index/",
                }
            ],
        },
        {
            "speaker": "Sean",
            "text": (
                "And how did anti-laundering provenance treat unproved RCE draft clauses and famous time-travel stories?"
            ),
        },
        {
            "speaker": "Claire",
            "text": (
                "Twelve unproved Appendix F statements in RCE Draft 0.9 stay strictly segregated from proved theorems, and across eighty-one audited time anomalies, "
                "Rudolph Fentz traced to 1951 fiction and superluminal neutrinos to a seventy-three-nanosecond loose cable — leaving zero unexplained future signals!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "ANTI-LAUNDER",
                    "title": "Unproved Clauses Quarantined & 0 Retrocausal Survivors",
                    "detail": "12 unproved RCE Draft 0.9 Appendix F clauses stay segregated; TA001–TA081 primary-source audit leaves 0 unexplained future signals.",
                    "href": "/papers/rce/",
                }
            ],
        },
        {
            "speaker": "Priya",
            "text": (
                "Stamp every claim with its three clocks and check proofs across six independent kernels! Visit knowledge.openie.dev, and join Cecily, Marcus, and Kwame next at the OpenIE Database and Data Desk!"
            ),
            "tts_text": (
                "Stamp every claim with its three clocks and check proofs across six independent kernels! Visit knowledge dot open I E dot dev, and join Cecily, Marcus, and Kwame next at the Open I E Database and Data Desk!"
            ),
        },
    ],
}

EPISODE_14: dict[str, Any] = {
    "id": "ep14-database-bitemporal-state-desk",
    "number": 14,
    "desk": "database",
    "desk_domain": "database.openie.dev",
    "title": "OpenIE Database & Data Desk: Sub-Microsecond Memory-Mapped Stores and Hash-Chained Logs",
    "subtitle": "Cecily, Marcus, and Kwame examine 1.77 uJ DNULLMM1 POSIX mmap case stores, RCE-VC name-free logs, and bit-exact replay across macOS, Linux, and Windows",
    "summary": (
        "At the OpenIE Database & Data Desk (database.openie.dev / data.openie.dev), Cecily, Marcus, and Kwame tour 35.28M data cells, "
        "0.325 us / 1.77 uJ DNULLMM1 POSIX mmap and Win32 MapViewOfFile case stores, 69.7 us RCE-VC name-free versioned logs, "
        "and zero-diff deterministic replay across macOS, Linux, and bare-metal Windows 11."
    ),
    "topic_tags": ["database-desk", "dnullmm1-mmap", "rce-vc", "deterministic-replay"],
    "studies": ["rce", "rce-vc", "time-as-an-index", "deterministic-null", "ai-reads-human", "game-engines"],
    "published_utc": "2026-11-23T12:30:00Z",
    "turns": [
        {
            "speaker": "Cecily",
            "text": (
                "Welcome to Episode Fourteen — our OpenIE Database and Data Desk roundtable on OpenIE Research Radio! I'm Cecily, joined by Marcus and Kwame — "
                "three AI-synthesized OpenIE research personas voiced via ElevenLabs studio neural speech and grounded strictly in verified "
                "Open Interface Engineering studies. Today we open database.openie.dev and data.openie.dev!"
            ),
            "tts_text": (
                "Welcome to Episode Fourteen — our Open I E Database and Data Desk roundtable on Open I E Research Radio! I'm Cecily, joined by Marcus and Kwame — "
                "three A I synthesized Open I E research personas voiced via ElevenLabs studio neural speech and grounded strictly in verified "
                "Open Interface Engineering studies. Today we open database dot open I E dot dev and data dot open I E dot dev!"
            ),
            "cards": [
                {
                    "kind": "ecosystem",
                    "badge": "DESK 06",
                    "title": "OpenIE Database & Data Desk (database.openie.dev)",
                    "detail": "10 axes & 35.28M data cells unifying DNULLMM1 mmap stores, RCEdb bitemporal logs, RCE-VC, and lockstep state replay.",
                    "href": "https://database.openie.dev",
                }
            ],
        },
        {
            "speaker": "Cecily",
            "text": (
                "Picture two ways to check a subway transfer as train doors close: mail a handwritten YAML letter to a warehouse clerk, "
                "or glance up at a laminated map bolted right onto the station wall!"
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Most agent memory stacks picked the handwritten YAML letter! In AI Reads Human, pure-Python YAML burned two thousand fifty-three times "
                "more energy per record than fixed binary structs. Kwame, how does DNULLMM1 bolt the map straight onto the CPU?"
            ),
            "tts_text": (
                "Most agent memory stacks picked the handwritten YAML letter! In A I Reads Human, pure-Python YAML burned two thousand fifty-three times "
                "more energy per record than fixed binary structs. Kwame, how does D null M M one bolt the map straight onto the C P U?"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "reported_j",
                    "title": "AI Reads Human: 2,053.8x Format Impedance Tax",
                    "detail": "Fixed binary struct costs 280.4 nJ/record vs 2,212.1 nJ JSON (7.89x) and 575,799.3 nJ pure-Python YAML on Apple M5 Max.",
                    "href": "/papers/ai-reads-human/",
                }
            ],
        },
        {
            "speaker": "Kwame",
            "text": (
                "DNULLMM1 packs a sixty-four-byte header plus forty-eight-byte open-addressed binary hash slots and mounts them zero-copy via POSIX mmap "
                "on Linux and macOS or MapViewOfFile on Windows 11. Zero parsing, zero heap allocation: one lookup finishes in zero point three two five microseconds "
                "at one point seven seven microjoules!"
            ),
            "tts_text": (
                "D null M M one packs a sixty-four-byte header plus forty-eight-byte open-addressed binary hash slots and mounts them zero-copy via POSIX memory map "
                "on Linux and mac O S or Map View Of File on Windows eleven. Zero parsing, zero heap allocation: one lookup finishes in zero point three two five microseconds "
                "at one point seven seven microjoules!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "1.77 uJ",
                    "title": "DNULLMM1 Zero-Copy mmap Store (0.325 us / Lookup)",
                    "detail": "64-byte header + 48-byte binary hash slots replay Gear-0 verified cases at 1.771 uJ with 0 model calls.",
                    "href": "/papers/deterministic-null/",
                }
            ],
        },
        {
            "speaker": "Cecily",
            "text": (
                "How do database.openie.dev's thirty-five point two eight million data cells connect to state.openie.dev and memory.openie.dev?"
            ),
            "tts_text": (
                "How do database dot open I E dot dev's thirty-five point two eight million data cells connect to state dot open I E dot dev and memory dot open I E dot dev?"
            ),
        },
        {
            "speaker": "Kwame",
            "text": (
                "Across ten database axes and five hundred thirty-three million memory cells from CPU registers to DNA, every table view is a deterministic fold "
                "over an append-only, hash-chained bitemporal log — separating Valid Time in reality from Transaction Time in the chain so history is never overwritten."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "What happens when ten coding agents commit to one repository at once? Standard Git line-number merges turn into gridlock!"
            ),
        },
        {
            "speaker": "Kwame",
            "text": (
                "RCE-VC keys every definition by its canonical name-free digest! Non-overlapping edits need zero coordination: admitting a submission "
                "against one hundred thousand units takes sixty-nine point seven to seventy-three point six microseconds at three hundred seventeen to three hundred sixty-five "
                "microjoules of Apple M5 Max L3 reported_j, while projecting cleanly back to Git!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "69.7 us",
                    "title": "RCE-VC: Name-Free Versioned Logs (317–365 uJ)",
                    "detail": "49 offline tests passing; admits non-overlapping submissions across 100,000 units in 69.7–73.6 us while preserving Git.",
                    "href": "/papers/rce-vc/",
                }
            ],
        },
        {
            "speaker": "Cecily",
            "text": (
                "Now test cross-platform deterministic replay across macOS, Linux, and bare-metal Windows 11 — where do ordinary systems drift?"
            ),
        },
        {
            "speaker": "Kwame",
            "text": (
                "Windows NTFS carriage-return line-feeds corrupt naive text transcripts, and standard-library floating-point sine diverges across "
                "Apple libSystem, Linux glibc, and Windows UCRT in just ten to thirty-seven ticks!"
            ),
            "tts_text": (
                "Windows N T F S carriage-return line-feeds corrupt naive text transcripts, and standard-library floating-point sine diverges across "
                "Apple lib-System, Linux G lib C, and Windows U C R T in just ten to thirty-seven ticks!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "TICK 10 DRIFT",
                    "title": "Cross-OS Float Divergence & NTFS CRLF Hazards",
                    "detail": "3-OS std::sin diverges in 10–37 ticks (GE-H2); binary DNULLMM1 + Q32.32 integer state eliminates float and CRLF drift.",
                    "href": "/papers/game-engines/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "And when you ran frozen binary DNULLMM1 maps plus Q32.32 fixed-point integer state across all those machines?"
            ),
            "tts_text": (
                "And when you ran frozen binary D null M M one maps plus Q32.32 fixed-point integer state across all those machines?"
            ),
        },
        {
            "speaker": "Kwame",
            "text": (
                "All five SATB hardware and OS hosts hit the exact ten-thousand-probe checksum fifteen billion twenty-seven million seven hundred five thousand "
                "seven hundred thirty-six with zero byte diffs! And in GE-H8, three one-hour sessions of two hundred sixteen thousand ticks replayed bit-for-bit "
                "across macOS, Linux, and Windows 11 from forty-four point six kilobytes of gzipped inputs — zero out of six thousand four hundred eighty mismatches!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "0 BYTE DIFFS",
                    "title": "5-Host DNULLMM1 Invariance & 44.6 KB 1-Hour Replay",
                    "detail": "Exact 15027705736 checksum & 0 CRLF drift across 5 OS/silicon hosts; 0/25,500 (GE-H1) & 0/6,480 (GE-H8) lockstep diffs.",
                    "href": "/papers/satb-harness/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Final audit check: how do we stop test-time mutation or solver smuggling inside DNULLMM1 and RCE-VC?"
            ),
            "tts_text": (
                "Final audit check: how do we stop test-time mutation or solver smuggling inside D null M M one and R C E, V C?"
            ),
        },
        {
            "speaker": "Kwame",
            "text": (
                "Before testing, DNULLMM1 is frozen read-only by SHA-256 under Bitcoin OpenTimestamps and drand beacons — pre-and-post digests must match "
                "with zero test writes, and reducers are capped at four thousand ninety-six gzipped bytes and fifty thousand operations! "
                "Meanwhile, RCE-VC refuses overlapping edits with a recorded reason and keeps measured_j unset alongside reported_j."
            ),
            "tts_text": (
                "Before testing, D null M M one is frozen read-only by SHA two fifty-six under Bitcoin OpenTimestamps and D-rand beacons — pre-and-post digests must match "
                "with zero test writes, and reducers are capped at four thousand ninety-six gzipped bytes and fifty thousand operations! "
                "Meanwhile, R C E, V C refuses overlapping edits with a recorded reason and keeps measured joules unset alongside reported joules."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "FROZEN SHA-256",
                    "title": "Anti-Smuggling Store Seal (<=4,096 B, 0 Test Writes)",
                    "detail": "Pre/post test SHA-256 digests asserted identical; reducers capped at <=4,096 gzipped bytes & <=50,000 ops; overlapping RCE-VC edits refused.",
                    "href": "/papers/deterministic-null/",
                }
            ],
        },
        {
            "speaker": "Cecily",
            "text": (
                "Hash-chain the bitemporal log, memory-map verified state at one point seven seven microjoules, and replay bit-for-bit everywhere! "
                "Explore all six openie.dev desks right below, subscribe via Podcast RSS, and thank you for listening to OpenIE Research Radio!"
            ),
            "tts_text": (
                "Hash-chain the bitemporal log, memory-map verified state at one point seven seven microjoules, and replay bit-for-bit everywhere! "
                "Explore all six open I E dot dev desks right below, subscribe via Podcast R S S, and thank you for listening to Open I E Research Radio!"
            ),
        },
    ],
}

ECOSYSTEM_DESK_EPISODES: list[dict[str, Any]] = [
    EPISODE_09,
    EPISODE_10,
    EPISODE_11,
    EPISODE_12,
    EPISODE_13,
    EPISODE_14,
]
