# Metabolic Intelligence (MEI) — Global SOTA Brief
**Sweep date:** 2 Oct 2026 (EDT) · Method-first · Equal/global framing  
**Pack in hand:** `/Users/dcharlot/Downloads/openie_metabolic_intelligence/radar/README.md` (Claude radar, 1 Oct 2026)  
**Scope lock:** EBM / latents / post-transformer first; each mapped to (1) existing HW and (2) post–von Neumann HW. Serving-efficiency peers softened unless they illustrate **budget binding**. MEI claim axes included with honest peer overlap.

Evidence classes (from pack): **M** measured independent · **C** customer · **V** vendor · **R** rule · **D** derived · **S** simulation/lab demo · **P** paper/preprint theory

---

## 1. Class definition (paste-ready)

**Metabolic Intelligence (MEI)** is a budget-native / energy-envelope intelligence class: a system that takes an explicit joule (or power) budget and returns the best obtainable answer under that envelope, rather than maximizing quality under uncapped transformer FLOPs. Architecturally it sits with Logical Intelligence–style moves *past* basic transformers—energy-based scoring and constraint commit, latent world models, and non-autoregressive or non-attention primitives—but binds the envelope at **two scales at once** (microwatt tags ↔ megawatt campuses). Unit of computation is the **digital enzyme** (recognition, allosteric context gating, abundance as weight, local learning/decay, costed binding check) and related algorithmic compute, not ever-larger nets. Claimed operating properties—**super / sequential learning with low forgetting, test-time inference under a dialable budget, zero-shot / few-shot transfer into new contexts, no large pretrain as a prerequisite for the enzyme path, and physics-informed features / sensor models**—are presented as *class aspirations* that must be evidenced per claim; several peers share *some* of these properties (cite them), but none presently combine **tag↔campus dual scale + OpenADR/DSX Flex service + J(m|q) obtain-router + enzymes** as a single class definition.

---

## 2. Method taxonomy  
**Columns:** method | vs transformer | existing HW path | post–vN path | example sources | evidence | MEI claim overlap

| Method | What it changes vs transformer | Existing HW (vN / GPU–MCU) | Post–von Neumann path | Example sources (URL · date) | Ev. | Shares with MEI claims |
|---|---|---|---|---|---|---|
| **Certify/commit EBM (Logical Intelligence)** | Next-token → energy landscape + Lean-checkable proofs; constraint commit not likelihood | GPU + Lean kernel today; Aleph/Kona pilots | Native EBM dynamics on analog DenseAM / Hopfield-style CIM (research) | logicalintelligence.com/kona · Kona pilots BusinessWire **20 Jan 2026**; Aleph PutnamBench blog; Morningstar/BW **2 Dec 2025** (76% Aleph) | V/C | Test-time verify; *not* “no pretrain”; energy is *constraint energy*, not campus joules |
| **Latent JEPA / world models** | Pixel/token gen → predict in latent; planning by latent energy | GPU ViT + MPC (V-JEPA 2-AC) | Latent dynamics on analog associative / memristive recall (speculative) | arxiv.org/html/2506.09985 **11 Jun 2025**; Meta V-JEPA 2; World Labs Marble **12 Nov 2025**, RTFM **16 Oct 2025**, Atlas **1 Sep 2026** | M/V | **Zero-shot** robot planning w/o task reward (**V-JEPA 2-AC**); *requires* large video pretrain—**conflicts** with MEI “no pretrain” unless scoped to enzyme path only |
| **DenseAM / Hopfield EBM** | Attention/diffusion cast as energy flow; retrieval = minimize E | Digital solvers on GPU/CPU | **Analog RC + crossbar**: constant-time inference claim; memristor Hopfield | arxiv.org/html/2512.15002; arxiv.org/html/2604.05042; Nature Comm memristor AM **2026**; arxiv 2605.07223 | P/S | **Test-time** energy descent; physics-native dynamics; training still usually needed |
| **Thermodynamic / equilibrium EBM HW** | Sampling Z on digital → native Langevin/Gibbs on physics | Superconducting / stochastic analog research | Hardware-native EBM sampling | arxiv.org/pdf/2607.16183 | P | Physics-informed substrate; early |
| **Digital enzymes (OpenIE)** | Dense MLP → recognition + abundance + budgeted binding | MCU / Cortex-M4 (pack measured instr.) | Natural fit to content-addressable / sparse associative post-vN | Pack `digital_enzyme.py`, `mcu/`, `benchmarks/` · Sep–Oct 2026 | M/S | **Sequential/super learning** (SmellNet 77.7% vs MLP 18.4%); **budget dial**; **no large pretrain** on enzyme path; physics-informed features |
| **Tsetlin / bit-logic** | Real-valued nets → propositional clauses + automata | Digital ASIC 65 nm (8.6 nJ/MNIST frame) | Limited; stays digital-sparse | arxiv.org/html/2501.19347; AdaTM continual learning; HV-TM arxiv 2406.02648 | M/P | Online learning; continual / low-forget peers; nJ edge |
| **HDC + SDM (Kanerva lineage)** | Dense embeddings → hypervectors / sparse distributed memory | SRAM/FPGA HDC accelerators; HDStream **2026** | Associative CAM / memristive bundling | GLSVLSI HDStream 2026; iEEG sparse HDC; arxiv 2604.11665 VaCoAl | P/V | Fast associative recall; energy-efficient edge; not full MEI campus story |
| **SSM / Mamba / RWKV (post-attn)** | Quadratic attn → linear state | GPU kernels; FPGA/ASIC (MARCA, FastMamba) | Still largely digital accelerators, not analog EBM | arxiv 2312.00752 (hist.); FastMamba arxiv 2505.18975; MARCA | M/P | Efficiency / long context—**not** budget-native class; cite only as corridor peer |
| **Photonic / analog CIM / adiabatic** | von Neumann data move → in-memory / charge recovery | Lab photonic 853 fJ/op claims; NeuRRAM RRAM CIM (hist. Nature 2022); Mythic analog (Vanguard **2027** avail. claim) | Core post-vN joule-floor path | Nature Comm photonic EOAM **2026**; arxiv 2506.18041; adiabatic LIF npj; Innatera Pulsar shipping ~0.4–0.6 mW audio/radar (**pack**) | M/V/S | Joule floor; **not** MEI software class by itself |
| **Power-aware serving (soft peer)** | Same transformer, add power caps / speed dial | Dynamo 1.5 GPU power annotations **18 Sep 2026**; DPS | N/A | docs.nvidia.com/dynamo … v1-5-0; InferenceX Rubin **14 Sep 2026** | V/M | Illustrates **budget binding** at campus—not a new intelligence class |
| **Grid-flexible campus (soft peer)** | Flat load → dispatchable envelope | DSX Flex + Emerald Conductor; OpenADR 3.x | N/A | Emerald AI DSX Flex **1 Jun 2026**; AEMA launch **16 Sep 2026**; pack OpenADR service | C/V/R | Envelope as **grid budget**; OpenIE uniquely wires this to obtain-router |

---

## 3. Must-cite SOTA items  
*(May 2026+ preferred; older marked **historical**)*

### A. EBM / certify / latent / post-transformer (priority)
| Item | Date | Why cite | URL | Ev. |
|---|---|---|---|---|
| Logical Intelligence Kona 1.0 pilots + LeCun advisory | 20 Jan 2026 | Peer **class move**: EBM reasoning, certify/commit | businesswire.com/…/20260120751310 | V |
| Aleph PutnamBench 99.4% Lean-certified | ~2026 (LI blog) | Commit-by-proof orchestration | logicalintelligence.com/blog/aleph-solves-putnambench | V |
| Aleph 76% Putnam (earlier milestone) | 2 Dec 2025 | **Historical** within LI arc | Morningstar/BusinessWire | V |
| V-JEPA 2 + V-JEPA 2-AC | 11 Jun 2025 | Latent world model; **zero-shot** MPC planning, no task reward | arxiv.org/abs/2506.09985 | M |
| V-JEPA 2.1 dense features | 16 Mar 2026 | Latent SSL continuation | github.com/facebookresearch/vjepa2 | V |
| World Labs Marble / RTFM / Atlas | Nov 2025 / Oct 2025 / **1 Sep 2026** | Spatial world-model corridor (still mostly transformer/diffusion) | worldlabs.ai/blog/… | V |
| DenseAM analog circuits | Dec 2025 preprint | EBM → **analog** constant-time inference path | arxiv.org/html/2512.15002 | P |
| Energy-based dynamical models tutorial | 2026 | Hopfield → DenseAM → oscillator EDMs | arxiv.org/html/2604.05042 | P |
| DenseAM energy-min training (ambient+latent) | ICLR/NFAM 2026 | Sampling-free EBM train in latent | openreview.net/forum?id=d7PjRsguov | P |
| Thermodynamic continuous-variable EBM blueprint | 2026 | Post-vN stochastic analog EBM | arxiv.org/pdf/2607.16183 | P |
| Memristor Hopfield / adaptive AM | 2026 | CIM associative energy min | Nature Comm s41467-026-69958-0; arxiv 2605.07223 | M/P |
| Tsetlin 65 nm ASIC | Jan 2025 | Logic ML at 8.6 nJ/frame | arxiv.org/html/2501.19347 | M |
| HV-TM / Sparse TM / AdaTM | 2024–2025 | HDC+TM; continual learning peer | arxiv 2406.02648; AdaTM PDF | P |
| FastMamba / MARCA | 2025 | Post-attn silicon accelerators | arxiv 2505.18975; 2409.11440 | P |
| Photonic neuromorphic + analog memory | 2026 | >26× power vs SRAM-DAC (paper claim) | nature.com/articles/s41467-026-69084-x | M |
| Fully analog photonic online training | 2025 | 853 fJ/op / 1.2 TOPS/W (paper) | arxiv.org/html/2506.18041 | S |

### B. Budget-binding / campus (cite as **envelope actuators**, not class peers)
| Item | Date | Why | URL | Ev. |
|---|---|---|---|---|
| NVIDIA Dynamo 1.5 power-aware scaling | 18 Sep 2026 | Per-GPU power caps as deployment budget | docs.nvidia.com/dynamo/…/v1-5-0 | V |
| AEMA (Emerald AI, Google, NVIDIA) | 16 Sep 2026 | Flexibility alliance; **no published spec yet** (radar) | blogs.nvidia.com/blog/ai-energy-management-alliance/ | V |
| Emerald + NVIDIA DSX Flex commercial deploy (SVP) | 1 Jun 2026 | Grid-dispatched AI factory | emeraldai.co/blog/nvidia-dsx-pilot-framework | C/V |
| InferenceX Vera Rubin agentic | 14 Sep 2026 | Measured tok/s/MW vs speed | inferencex.semianalysis.com/blog/vera-rubin-nvl72-agentic-inference | M |
| MLPerf Inference v6.1 | 16 Sep 2026 | Rubin preview throughput; power pages partly unchecked | Nebius/AMD blogs; pack notes mlcommons loop | M |
| PEARL / OmniRouter / Energy-Aware LRM routing | 2025–Jan 2026 | Academic **joule/cost-aware routing** (not dual-scale MEI) | ScienceDirect PEARL; arxiv 2502.20576; arxiv 2601.00823 | P |
| ML.ENERGY v3.0 | Jan 2026 | **Historical-ish** energy leaderboard | ml.energy/blog/… | M |

### C. Edge / TinyML (enzyme habitat)
| Item | Date | Why | URL | Ev. |
|---|---|---|---|---|
| MLPerf Tiny v1.4 | Jul 2026 | MCU energy/inference | mlcommons.org/2026/07/mlperf-tiny-v1-4-results/ | M |
| BME690 / ZMOD4410 / SGP41 + STM32U3 / nRF54L15 | datasheets 2026 | Tag heater vs sleep floor (pack) | Bosch/Renesas/Sensirion/ST/Nordic | V/D |
| Innatera Pulsar | shipping | Neuromorphic MCU; pack: ~0.4–0.6 mW >> duty-cycled MCU tag | innatera.com | V |
| FSMA 204 delay / EU PPWR | Jul 2028 / 12 Aug 2026 | Cold-chain market timing | FDA; EC | R |

### D. Explicit term hunt (“metabolic intelligence”, “energy-native AI”, “joule-aware routing”, “budget-native inference”)
| Term | Finding |
|---|---|
| **Metabolic intelligence** as AI class | **No peer product/paper class** found using this as a named peer to Logical/World Labs; OpenIE pack + Charlot Lab “energy-first / joules not tokens” are the primary anchors (physicalai-bmi.org; synthesis.openie.dev) |
| energy-native / joule-aware / budget-native | Academic routers (PEARL, OmniRouter, PILOT, Energy-Aware LRM) use cost/energy **budgets** but stay multi-LLM routing—no enzyme + dual-scale + OpenADR stack |
| OpenIE Stack / Mixture of Limits | synthesis.openie.dev — Lookup/Formula → deeper zones; Model LAST; four named limits |

---

## 4. MEI claim axes ↔ honest peer overlap

| MEI claim (paper aspiration) | Who else claims *a slice* | Do **not** over-claim |
|---|---|---|
| **Super / sequential learning** (learn B without wiping A) | OpenIE enzymes on SmellNet (pack **M**); AdaTM continual Tsetlin; classical Hopfield/DenseAM pattern add | “Solves catastrophic forgetting” universally—false |
| **Test-time inference** (compute at query by minimizing / binding under budget) | DenseAM energy descent; Hopfield recall; JEPA planning MPC; LI constraint solve | That test-time = free or pretrain-free |
| **Zero-shot** | **V-JEPA 2-AC** zero-shot labs/objects (strong peer); LI proofs transfer by construction | MEI campus OpenADR demos are **protocol-tested**, not “zero-shot AGI” |
| **No pre-training required** | Enzyme / Tsetlin / bit-enzyme **online** paths (pack); classical Hebbian AM | **Do not** attribute this to JEPA/World Labs/LI frontier stacks—they pretrain heavily |
| **Physics-informed** | Pack e-nose kinetics + drift features; PINN/PhysBR lineage; analog EBM = physics substrate | Physics features ≠ thermodynamic optimality proof without meters |

---

## 5. Gaps OpenIE MEI uniquely fills (today)

1. **Tag ↔ campus dual scale** under one “budget in → best answer out” thesis (µW metabolic heating tags + 100 MW grid service)—peers own one end only.  
2. **OpenADR 3.1 + DSX Flex–shaped service** with ordered levers (pause → speed → route → effort → battery → shed), scenario-tested (**pack** `datacenter/service/`)—AEMA has **no spec yet**; Dynamo power caps are deployment annotations, not obtain-routing.  
3. **J(m\|q) obtain-router** (Lookup→Formula→Solver→Model LAST; E_m + λ½S²var)—turns Mixture of Limits + Notational commit into a priced mechanism; PEARL-class routers price **which LLM**, not **which obtain zone**.  
4. **Digital enzymes** as the non-transformer unit with measured MCU instruction counts + sequential-learning evidence—Tsetlin/HDC are cousins; LI/JEPA are different binding (proof / latent video).  
5. **Satiation / stop**: stack rule to stop ascending zones when J is minimized (enough answer for the stake)—distinct from “always call the frontier.”

---

## 6. How corridors relate to OpenIE (Mixture of Limits · Notational commit · Satiation)

| OpenIE law | Relation to SOTA corridor |
|---|---|
| **Mixture of Limits** (Lookup→Formula→Solver→Model LAST) | Same impedance story as synthesis.openie.dev Z₁/Z₂/Z₃; LI commit ≈ Solver/Prove; JEPA/World Labs ≈ latent Model; enzymes ≈ cheap Z₂ recognition |
| **Notational Intelligence commit law** | External essay (thesephist, **2022**, historical) + OpenIE Pattern-Lang / stack: answers must bind to a notation that can be checked; LI Lean proofs are the strongest *peer* commit mechanism |
| **Satiation stop** | Stop when marginal J gain < stake; campus speed-matching + Flash routing are **empirical satiation** of tok/s and model size; edge metabolic schedule satiates heater duty |

---

## 7. What **NOT** to claim without meters

- Any **Wh/answer**, **J/token**, **µW tag lifetime**, or **× work per MW** not tied to pack evidence class **M/C** or a named external meter (InferenceX, MLPerf, MCU emulator, OpenADR test logs).  
- “Routing costs **no** quality” — radar: V4.1 Flash leads AA composite but trails ~1.5 GPQA; say “small quality price.”  
- “Heater is always the tag cost” — false on metabolic schedule; **sleep floor** dominates (radar correction).  
- Rubin “up to 30×” without speed condition — measured gain is **speed-dependent** (2–6× interactive; ~1.1× throughput-bound).  
- AEMA / DSX Flex **latency or ramp numbers** — not specified.  
- Neuromorphic **gas/odour nJ** figures — **not found** shipping.  
- Mythic / photonic **production joule floors** for MEI workloads — vendor/lab, not MEI meters.  
- That Logical Intelligence “energy-based” = **grid joules** — different energy.  
- That MEI needs **no pretrain** *and* matches V-JEPA zero-shot robotics — incompatible scopes; split claims by path (enzyme vs latent).  
- Chicken-spoilage accuracy in public paper — **no license** (pack rule).

---

## 8. One-line positioning vs named peers

| Peer | Their axis | MEI difference |
|---|---|---|
| Logical Intelligence | Constraint energy + formal commit | MEI: **joule envelope** + obtain routing + dual scale |
| World Labs / V-JEPA | Spatial/latent world models | MEI: budget-native enzymes + campus grid service; latent optional |
| DenseAM / analog EBM | Physics dynamics for inference | MEI: software enzyme class *plus* envelope ops; cite as HW future |
| Dynamo / DSX / AEMA | Power & grid actuators | MEI: actuators **inside** Mixture-of-Limits intelligence |
| Tsetlin / HDC / Mythic | Efficient non-transformer silicon | Cousins at edge; lack campus J(m\|q) + OpenADR thesis |

---

*Sources preferred WebSearch/WebFetch 2 Oct 2026; pack radar/START_HERE/HANDOFF/synthesis used as in-hand SOTA. Numbers not invented; where pack quotes measured figures, treat as pack-M pending author re-meter.*
