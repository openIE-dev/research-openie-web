#!/usr/bin/env python3
"""OpenIE Research Radio — Launch Episodes 1 & 2 Dialogue & Citation Card Scripts."""

from __future__ import annotations

from typing import Any

EPISODE_01: dict[str, Any] = {
    "id": "ep01-global-literature-radar",
    "number": 1,
    "title": "Live Global Radar — Open-Access Preprints vs. OpenIE Commit Gates",
    "subtitle": "Auditing live 2026 arXiv, Europe PMC, OpenAlex, bioRxiv, and ClinicalTrials.gov feeds against joules and null baselines",
    "summary": (
        "Elena, Marcus, and Devon open the autonomous 6-hour literature radar, cross-examining live 2026 works — "
        "including TokenPowerBench, Lean Graph Search, AgentShield, INFRAMIND, and npj Biofilms extracellular-vesicle "
        "quorum studies — against OpenIE's Metered Commit Gates and Shape-D controls."
    ),
    "topic_tags": ["global-radar", "commit-gates", "telemetry", "open-access"],
    "published_utc": "2026-11-23T06:00:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome to the launch broadcast of OpenIE Research Radio! Before we dive in, full transparency up front: "
                "Marcus, Devon, and I — Elena — are AI-synthesized OpenIE research personas, voiced through open-weight neural speech "
                "and grounded strictly in verified Open Interface Engineering artifacts and live open-access literature feeds."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[E]",
                    "title": "Metered Commit Gates (KV260 11,428 pJ/cycle)",
                    "detail": "Try the cheapest tier first, gate irreversible actions behind a deterministic check, and log energy per completed run.",
                    "href": "/papers/gates/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Which means nobody here gets to bluff! Every six hours, our autonomous Linux radar scrapes five sanctioned public "
                "archives — arXiv, Europe PMC, OpenAlex, bioRxiv, and ClinicalTrials.gov — hashes every record with BLAKE2b and SHA-256, "
                "and puts brand-new papers on the bench. Devon, how many survived deduplication today?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Over forty distinct open-access works across all five registries, mapped against all twenty-one OpenIE studies. "
                "Every single entry gets an epistemic badge — T for kernel-checked theorems, E for empirical hardware or wet-lab data, "
                "M for computational models, and S for speculative or uncompleted clinical horizons."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Let's start with energy-aware AI. One of the top OpenAlex and arXiv hits on the radar right now is TokenPowerBench, "
                "published in 2026 to benchmark the power consumption of large language model inference across serving stacks."
            ),
            "cards": [
                {
                    "kind": "external_paper",
                    "badge": "[M]",
                    "title": "TokenPowerBench: Power Consumption of LLM Inference (2026)",
                    "detail": "OpenAlex / arXiv:2512.03024 — corroborates token-level energy profiling while highlighting counter vs wall-rail gaps.",
                    "href": "https://arxiv.org/pdf/2512.03024",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Hold on — let me ask my favorite annoying question right away! When TokenPowerBench or any 2026 inference paper "
                "reports joules per token, are they measuring physical DC shunt rails on the board, or reading software counters like RAPL and NVML?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Almost always software counters on shared GPUs, or analytical estimates — what OpenIE stamps as reported_j, never measured_j. "
                "And second, joules per token is the wrong denominator if the model spends ten thousand tokens hallucinating a broken patch! "
                "In Metered Commit Gates, the denominator is energy to correct completion."
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "reported_j",
                    "title": "Joules per Token vs. Energy to Correct Completion",
                    "detail": "Cheap tokens wasted on unverified retries lose to a deterministic gate; on KV260 INA260 hardware, one gate check costs 11,428 pJ.",
                    "href": "/papers/gates/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "That connects directly to our second radar cluster: formal theorem proving. Today's intake pulled two 2026 preprints — "
                "Compile to Compress, which boosts formal theorem provers using compiler outputs, and Lean Graph Search for Formal Theorem Proving on arXiv."
            ),
            "cards": [
                {
                    "kind": "external_paper",
                    "badge": "[T]",
                    "title": "Lean Graph Search & Compile to Compress (arXiv 2026)",
                    "detail": "arXiv:2610.22339 & arXiv:2604.18587 — external corroboration that compiler invariants and graph search prune Lean 4 proof trees.",
                    "href": "https://arxiv.org/pdf/2610.22339",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Okay, I actually like those two! Because instead of asking a giant language model to vibe-check mathematics, "
                "the Lean 4 kernel acts as an unforgiving binary oracle. Either the proof term type-checks with zero sorry placeholders, or it's rejected."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Exactly. Across OpenIE's Reality Code Engine, Time as an Index, and Communication Tool Avalanche, we rely on over five thousand "
                "five hundred Lean 4 kernel constants plus sixty-two specialized domain theorems with zero sorry. What Lean Graph Search still omits, "
                "though, is reporting how many joules the search burned per closed lemma."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Now look at the multi-agent orchestration cluster from arXiv today: Decoupled Multi-Agent Orchestration, INFRAMIND for "
                "infrastructure-aware orchestration, and the AgentShield Byzantine fault tolerance dataset."
            ),
            "cards": [
                {
                    "kind": "external_paper",
                    "badge": "[M]",
                    "title": "INFRAMIND & AgentShield Multi-Agent BFT (2026)",
                    "detail": "arXiv:2606.11440v2 & doi:10.21227/qyq3-3g19 — examines multi-agent scheduling and Byzantine fault injection.",
                    "href": "http://arxiv.org/abs/2606.11440v2",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Wait — let me guess what happens in ninety percent of multi-agent papers when four chatty agents pass natural-language "
                "paragraphs back and forth without a cryptographic or test gate!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Prompt bloat triples, errors compound exponentially as fidelity to the power k across hops, and false commits spike! "
                "In our sixty-task Communication Avalanche benchmark, an unattested four-agent cascade dropped to eighty-six point six seven percent "
                "accuracy with thirteen point three percent broken commits, burning nearly fifteen times more energy per coherent fix than our BLAKE3 and Ed25519 gated graph."
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[M]",
                    "title": "Attested Orchestrator vs. Unattested 4-Agent Chat",
                    "detail": "59/60 (98.33%) pass with 0/60 false commits at 14.97x higher Coherence per Joule than unattested 4-agent cascade.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "And my favorite catch from Europe PMC today comes straight out of microbiology: a January 2026 paper in npj Biofilms and Microbiomes "
                "showing extracellular vesicles acting as structured vectors of quorum-sensing signals in aquatic microbial communities!"
            ),
            "cards": [
                {
                    "kind": "external_paper",
                    "badge": "[E]",
                    "title": "Extracellular Vesicles as Structured Quorum Vectors (2026)",
                    "detail": "doi:10.1038/s41522-026-00924-w — empirical fusion of Rung CL01 (lipid vesicles) and Rung CL02 (cooperative quorum thresholds).",
                    "href": "https://doi.org/10.1038/s41522-026-00924-w",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Think about how wild that is. Three and a half billion years before packet-switched networks, bacteria wrapped quorum signals "
                "inside lipid envelopes so nucleases and water currents wouldn't corrupt the packet in transit!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Meanwhile, our ClinicalTrials.gov feed keeps us honest on the human neurotechnology side. Today's radar pulled eight trials, "
                "including stroke alpha-coherence neurofeedback NCT02223910 and cognitive memory restoration NCT04253587. We classify recruiting "
                "or unverified human translation strictly as S or Challenges Assumption so preclinical animal rescue is never conflated with human cures."
            ),
            "cards": [
                {
                    "kind": "external_paper",
                    "badge": "[S]",
                    "title": "ClinicalTrials.gov Neuro-Interface Boundary (NCT04253587)",
                    "detail": "Enforces strict epistemic boundary between replicated animal vesicle/BCI rescue [E] and human clinical efficacy [S].",
                    "href": "https://clinicaltrials.gov/study/NCT04253587",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "And remember our rule on AI formats too: Europe PMC also surfaced The Cost of Reproducibility in Artificial Intelligence, "
                "right alongside OpenIE's AI Reads Human study showing pure-Python YAML parsing burns over two thousand times more nanojoules per record than fixed binary structs!"
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Two thousand and fifty-three times more energy just so a machine can read whitespace indentation! Every paper on today's radar "
                "is searchable right below this player — complete with its BLAKE2b digest, epistemic badge, and telemetry audit."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Next up in Episode Two, we zoom across three point eight billion years of biological signaling, seventy-six years of AI winters, "
                "and DES-10 digital enzymatic synthesis. Stay tuned on OpenIE Research Radio!"
            ),
        },
    ],
}

EPISODE_02: dict[str, Any] = {
    "id": "ep02-communication-tool-avalanche",
    "number": 2,
    "title": "The Communication Tool Avalanche — Quorum Ratchets, 1950–2026 AI Winters & DES-10",
    "subtitle": "From Archaean quorum switches and SepJ nanopores to 76 years of AI winters and sub-millijoule digital enzymes",
    "summary": (
        "Why collective intelligence scales by externalizing state behind selective gates: bacterial quorum switches, "
        "cyanobacterial SepJ circuit-breakers, mycorrhizal citation bias, the 1950–2026 AI Winter ratchet, and DES-10 digital enzymes."
    ),
    "topic_tags": ["communication-avalanche", "quorum-sensing", "ai-winters", "des-10"],
    "published_utc": "2026-11-23T06:30:00Z",
    "turns": [
        {
            "speaker": "Elena",
            "text": (
                "Welcome back to OpenIE Research Radio! I'm Elena, joined by Marcus and Devon — three AI-synthesized OpenIE research personas "
                "exploring verified Open Interface Engineering studies. Today we're opening one of our most sweeping monographs: The Communication Tool Avalanche."
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "[T]",
                    "title": "The Communication Tool Avalanche (31 Lean 4 Theorems)",
                    "detail": "24 evolutionary rungs (CL01–CL24), 31 Lean 4.36.0 theorems (zero sorry), and 2.09x–14.97x Coherence-per-Joule orchestration gains.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Okay, pitch me the core thesis without any hand-waving. Why put bacteria, slime molds, starling flocks, printing presses, "
                "and multi-agent language models inside one mathematical equation?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Because single-agent brains hit steep thermodynamic walls long before complex jobs finish! What unlocks superlinear scaling "
                "is a three-step ratchet formalized in Lean 4.36.0 across thirty-one theorems with zero sorry: Externalize structured state into a medium, "
                "Ingest it only across a threshold and validity gate, and Transform recipient state without regressing."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Look at Rung CL02, three point five billion years ago: bacterial quorum sensing in Vibrio fischeri and Pseudomonas aeruginosa. "
                "A single bacterium floating alone in the ocean doesn't waste ATP secreting bioluminescent enzymes or biofilms into empty water."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "In our pre-registered simulation CA-M1 under seed 20261123, a cooperative Hill switch with exponent two to four saves "
                "ninety-five point four nine to ninety-nine point one seven percent of regulon ATP at low cell density, while suppressing "
                "premature noise firing by eleven point six six times!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[M]",
                    "title": "Model CA-M1: Cooperative Quorum ATP Savings",
                    "detail": "Saves 95.49% (n_H=2) to 99.17% (n_H=4) regulon ATP at low density and suppresses false noise firing by 11.66x.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Wait — once cells link up into multicellular filaments like cyanobacteria in Rung CL03 and share cytoplasm through fifteen-nanometer "
                "SepJ nanopores, doesn't a single punctured cell bleed the entire hundred-cell chain to death?"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "It would, if the pore were ungated! In model CA-M2, an ungated twenty-cell filament collapses to zero percent survival after cell-zero lyses. "
                "With calcium-triggered SepJ plug closure in fifty milliseconds, nineteen of twenty cells — ninety-five percent — survive intact."
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[M]",
                    "title": "Model CA-M2: Cyanobacterial SepJ Circuit-Breaker",
                    "detail": "50 ms Ca2+-gated pore closure preserves 19/20 (95.0%) viable cells vs 0/20 (0.0%) in ungated filaments.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "And I appreciate that Section 3 also calls foul on popular biology myths! Everyone loves talking about forest mother trees "
                "sending intentional warning broadcasts through fungal networks, and we actually audited that."
            ),
        },
        {
            "speaker": "Elena",
            "text": (
                "Right! Simard's 1997 carbon-isotope flux across ectomycorrhizal hyphae is established biophysics — tagged E — "
                "but Karst, Jones, and Hoeksema's 2023 audit exposed severe citation bias behind teleological mother-tree signaling claims, "
                "so we flag intentional maternal warnings as unsubstantiated!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "[E]",
                    "title": "Mycorrhizal Carbon Flux vs. 'Mother-Tree' Citation Bias",
                    "detail": "Source-sink isotope transfer is [E]; teleological warning broadcasts fail Karst et al. (2023) confounder controls.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Now jump to computing history from 1950 to 2026! Why did AI suffer AI Winter One in 1974 and AI Winter Two in 1988? "
                "Look at those seven eras through the exact same externalization-and-gate lens."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Every breakthrough paired a compact externalized representation with a sound gate — Lisp recursion in 1956, backprop chain-rule gradients in 1986, "
                "sparse MoE top-k routing in 2022. Every AI Winter struck when signals outran verification: Hearsay-II untyped blackboards locked up quadratically, "
                "and MYCIN ad-hoc certainty factors drifted across multi-hop rules."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Wait a second — today's multi-agent LLM chat frameworks are literally recreating 1975 Hearsay-II blackboards, just at fifteen to a hundred joules per turn! "
                "Agents spewing three-point-seven-x bloated English prose back and forth until hallucinations lock in!"
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "That's why we designed DES-10 — ten-camp Digital Enzymatic Synthesis. In biochemistry, an enzyme slashes the activation energy barrier "
                "Delta E-double-dagger of a reaction by orders of magnitude and exits completely unconsumed. A digital enzyme pairs a canonical typed IR "
                "with BLAKE3 hashing, Ed25519 signatures, and a deterministic verifier."
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "reported_j",
                    "title": "DES-10 Digital Enzyme Gate: 643–926 μJ (26–37 μs)",
                    "detail": "Slashes multi-agent handoff barrier >15,000x from ~110 J prose chat to <1 mJ attested Rust BLAKE3+Ed25519 envelopes.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "Give us the Linux RAPL bench numbers from experiments CTA-E1 through CTA-E3 — keeping clear that board_metered is false and these are socket reported joules."
            ),
        },
        {
            "speaker": "Devon",
            "text": (
                "Rust BLAKE3 plus Ed25519 channel verification takes twenty-five point nine five to thirty-seven point three nine microseconds — "
                "just six hundred forty-three to nine hundred twenty-six microjoules per edge! Zero-clock Linux eventfd waiting cuts one-percent-duty "
                "idle socket energy by two point two one times versus one-kilohertz polling, and min-cost flow reroutes around two hundred out of two hundred "
                "Byzantine faults in two point four microseconds."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "And once a frontier fifteen-joule model solves a novel bug and passes the test gate, downward crystallization locks that fix into "
                "a one-point-seven-seven microjoule lookup case — just like our twenty-generation cultural ratchet model CA-M5, where attested libraries "
                "held one hundred percent retention after machine teachers vanished, while unverified imitation collapsed to twenty-nine percent!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "[M]",
                    "title": "Model CA-M5: Post-Removal Cultural Ratchet Retention",
                    "detail": "Attested externalized artifact library retains 100.0% optimal competence at Gen 20 vs 29.27% under unverified imitation.",
                    "href": "/papers/communication-avalanche/",
                }
            ],
        },
        {
            "speaker": "Elena",
            "text": (
                "From bacterial autoinducers to sub-millijoule digital enzymes, the rule never changes: gate the channel, verify the payload, "
                "and crystallize what works. Up next in Episode Three: World Coding and RCE-JEPA!"
            ),
        },
    ],
}
