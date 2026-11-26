---
title: "Physical-AI fan-out — bottlenecks, expensive planned solutions, and the RCE/Cleanroom answer"
deck: "25 Nov 2026. Global fan-out (US, Europe, China, Japan, Korea, India) on embodied/physical AI where"
id: rce-physical-ai-bottlenecks
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# Physical-AI fan-out — bottlenecks, expensive planned solutions, and the RCE/Cleanroom answer

*25 Nov 2026. Global fan-out (US, Europe, China, Japan, Korea, India) on embodied/physical AI where
coding is key and real-time coding is key — "coding is thinking for robots." Every row carries a
source; unknowns are registered in rce-gap-register.md §"Physical-AI fan-out"; use cases in the
private cleanroom repo USE-CASES.md. Prices are sourced launch/list figures, never measurements.*

## BLUF

The robot world's bottlenecks are **latency, memory, data, and certification** — not model quality.
Control loops run at 50–1000 Hz while VLA planners infer slower than the loop; ROS 2 on Linux is not
real-time; Figure says memory (not chips) is the binding constraint; China ships >97% of humanoids
but whole-body real-time control and data remain the fight; Europe's deadline (EU 2023/1230,
20 Jan 2027) makes certification the gate. The expensive planned solutions price the mind by silicon
(Jetson Thor $3,499/robot) or by rent (1X $499/mo) or by GPU-year ($4,500). RCE's inversion answers
each: competence content-addressed and deadline-gated, placed on any fabric within memory and
worst-case latency budgets, admitted only by replay, priced in joules.

## The six regions

### US
- **Figure Helix 02**: System 2 (slow reasoning) / System 1 (fast action) / System 0 (reflex correction);
  inference on dual RTX GPU modules inside the robot; Brett Adcock: **memory, not chips, is the real
  bottleneck**; world ran out of compute Sept 2026.
- **Physical Intelligence / academia**: inference slower than control frequency → action chunking;
  async chunk execution (real_time_chunking), FASTER flow-VLA reaction latency, F2S-VLA coherent
  chunk transitions, Reactive Diffusion Policy slow-fast, TurboVLA 32 Hz on RTX 4090 <1 GB VRAM.
- **Tesla**: FSD chip / Optimus; older HW3 memory-bound → FSD Lite (exec summary).
- Bottleneck: **the slow-fast split is hand-built per company; no verified, portable, deadline-gated
  substrate**. Delta vs RCE: Helix's System 1/0 is exactly the gear ladder, but unverified and
  chip-locked; RCE gates it by replay and places it by capability lookup.

### Europe
- **Neura Robotics (DE)**: 4NE1 Gen 4 + Neuraverse cognitive platform; **1X (NO)**: NEO home robot
  $20,000 + **$499/month subscription**, US-first; Europe's humanoids "built by their customers".
- **EU Machinery Regulation 2023/1230, 20 Jan 2027**: notified body for evolving ML safety functions,
  5-year safety logs (exec summary). No learned controller certified to date.
- Bottleneck: **certification + mind rent**. Delta: Cleanroom's audit chain is the 5-year log; the
  per-joule line replaces the $499/mo mind rent.

### China
- **>97% of world humanoid shipments H1 2026 (~19,100 units)**; AgiBot 10,000 → 20,000 units rolled
  off; Unitree narrowly ahead overall; UBTECH leads service segment; **Galbot** unified whole-body
  controller with real-time planning against fast-moving targets.
- **Tencent's six bottlenecks**: data, perception-action, simulation-reality, hardware, models,
  (ecosystem/talent).
- Bottleneck: **scale without verified competence reuse; whole-body real-time control hand-tuned per
  body**. Delta: RCE intent-keyed competence + semantic preserve ports one verified controller
  across bodies; closest peer Galbot/Unitree ship faster, RCE verifies cheaper.

### Japan
- **Mujin**: live digital twin of the robot in motion; MujinOS no-code deployment; sales doubled;
  IPO targeted by 2030; Japan proves experimental physical AI ready for the real world.
- Bottleneck: **twin fidelity / sim2real** — the twin is a model, not a replay. Delta: RCE replay is
  byte-identical by construction; physics-twin parity remains an open edge (registered).

### Korea
- **Samsung**: dedicated RX humanoid unit + world-model AI; supplies Toyota 5×; **Rainbow Robotics**
  + SFA MOU for AI autonomous manufacturing; AW 2026 Seoul: cloud trains / edge infers / terminal
  does low-latency motion control; US robot curbs shrugged off.
- Bottleneck: **the cloud/edge/terminal split is an architecture of latency compromises**. Delta:
  RCE placement makes the split a lookup (argmin joules within deadline/memory), not a fixed tier.

### India
- Market **$72.3M (2026) → $1,018.1M (2031)**; Cosine Robots (Bengaluru) ₹22.36 crore for actuators;
  **consortium of physical-AI startups forming open standards for real-world multimodal sensor
  datasets** (Oct 2026); sovereign embodied intelligence; first indigenous humanoid a symbolic entry.
- Bottleneck: **actuators + data standards, not models**. Delta: RCE-SPEC/canonical keys are a
  candidate interop substrate for the consortium's dataset standards (registered unknown).

## Bottleneck matrix → mechanism → parity delta

| Bottleneck | Evidence | RCE/Cleanroom mechanism | Closest peer + delta |
|---|---|---|---|
| Control loop faster than planner | PI chunking; FASTER; TurboVLA 32 Hz | realtime.rs deadline-gated gear select + chunk coherence (seed) | PI/FASTER: async chunks unverified; RCE gates by replay |
| ROS 2 not real-time on Linux | ros2_control #736 catch-up; PREEMPT_RT tuning; CityU thesis | realtime.rs refuse-if-miss (fail-safe), WCET not average | QNX/seL4: certified fixed logic; RCE adds learned-but-gated |
| Memory-bound mind | Adcock (Figure); HW3 FSD Lite; Thor 128 GB | realtime.rs memory-budget admission; fabric capability lookup | NVIDIA Thor: mind priced by silicon; RCE mind portable |
| Data scarcity + provenance disputes | Tencent six; epoch 1M+ vs 350k trajectories; teleop BOM €120–490 | repo.rs sovereign ingestion + content-addressed admission + secure.rs seal | AgiBot World: scale unverified; RCE admits only replayed |
| sim2real / twin fidelity | Mujin live twin; Isaac Lab 3.0 pure-sim $399 duck | replay.rs byte-identical; physics twin OPEN | Mujin: model twin; RCE replay exact but not physics |
| Certification deadline | EU 2023/1230 Jan 20 2027; Halos planned | trust.rs audit chain = 5-year log; gate = evidence | QNX: certificate without mind; Cleanroom both (attestation OPEN) |
| Mind rent / GPU-year cost | 1X $499/mo; AI Enterprise $4,500/GPU/yr | energy/fleet metering + value.rs; per-joule line | Neuralwatt $7–10/kWh vs Joule Cloud $0.25–1 (launch targets) |

## Expensive planned solutions (sourced figures)

| Solution | Price/cost | Source | The inversion |
|---|---|---|---|
| Jetson Thor per robot | $3,499; 128 GB; 2070 TOPS | NVIDIA/youtube launch | mind decoupled from silicon |
| Halos safety stack | planned integration w/ GR00T+Thor; LG humanoid Q1 2027 | NVIDIA Oct 21 2026; LG Aug 2026 | evidence chain built-in, any chip |
| Isaac Sim enterprise | $4,500/GPU/year | RFP.wiki/Oct 2026 | sim-farm FinOps via fleet metering |
| 1X NEO mind rent | $20,000 + $499/month | LinkedIn/1X launch | per-joule, sleep free |
| Teleop data rigs | Grabette €490 / Gripette €120 BOM | LinkedIn pulse | sovereign refinery + dedup |
| Waiting agents | 100 KB on AWS Infinity | exec summary (AWS Oct 2026) | G0 lookup ≈1 µJ, wake by joule |

## Parity closes (2026-11-25, second pass — built, tested, on main)

| Close | Mechanism | Tests |
|---|---|---|
| Memory-bound mind | fabric::place_within + memory_kib (Thor-class vs HW3-class budgets) | 4 |
| Dataset provenance | trajectory::ingest + dispute (content-keyed dedup across sources) | 4 |
| Measured WCET | realtime::measure_lookup (wall clock, worst of N, Measured) | 3 |
| Compile spike off-loop | jit::DeadlineJit (interpret now, compile in maintenance slots) | 3 |
| sim2real gate seed | twin::admit_controller (double-integrator plant spectest) | 4 |
| EU/ISO evidence map | trust::eu_machinery_controls (2 built, 4 open attestation/standards) | 3 |
| Measured latency receipts | fleet latency_us_per_act + aggregate_latency; live /energy + /fleet (38.96 µs/act @ ioreport) | 4 |
| sim2real-gated ingestion | trajectory::ingest_gated (integral + distinct + twin-replay admission) | 4 |
| One sovereign admission path | repo::ingest_episodes (code + episodes, isolated policy, audited) | 3 |
| Collaborative force limits seed | twin::contact_force + force_limit_ok (spring-damper; ISO/TS 15066 partial) | 3 |
| Dataset-standards interop seed | trajectory::manifest (rce-episode-manifest/1, name-free keys) | 1 |
| Trained proposer at receipt scale | train::receipt_corpus + train_on_corpus (2000 receipts, holdout acc 1.0; JEPA at scale open) | 3 |
| Tracing-JIT seed | jit::TracingJit (hot-subtree compile-once, content guards, deopt) | 4 |
| TS 15066 force/pressure pair | twin::contact_pressure + pressure_limit_ok (gates built; certification open) | 3 |
| Hierarchical JEPA seed | train::HierPredictor (intent→summary→Form, two levels) | 2 |
| Fleet-scale chunked ingestion | trajectory::ingest_chunks (one dedup set + receipt across chunks) | 2 |
| RTOS scheduling discipline | rtos::schedulable (Liu–Layland, refuse-above-bound) + cyclic_table | 5 |
| Real-to-sim identification | twin::identify (grid-search dt; None when unexplained) | 2 |
| Notified-body evidence bundle | trust::evidence_package (rce-evidence/1; attestation open) | 2 |
| JEPA on canonicalization | train::canonical_pairs + HierPredictor (800 pairs, predicted beats raw) | 2 |
| Measured grammar coverage | ingest::grammar_coverage + example on real tree-sitter grammars | 2 |
| Identified-plant admission | trajectory::identify_plant (gate against the plant that explains the corpus) | 2 |
| IR-kind expansion (whole-program) | Stmt let/assign/for/import/type/fn executed+lifted+emitted as LUT data; taxonomy 34 | 11 |
| Match/patterns + local fns/calls | Stmt Match/LetFn/Call/LetCall, per-call scope + fuel guard, LUT data; taxonomy 35 | 7 |
| Physics-fidelity sim2real seed | twin::Plant2 (gravity+drag+restitution) + simulate2 + identify2 | 6 |
| Generics + async/await | Stmt GenericFn/GenericType/AsyncFn/Await, monomorphized + cooperative seed, LUT data; taxonomy 38 | 5 |
| Whole-program replay gate | program::replay_admit + program_key (admission law extended to statements) | 4 |
| Attributes/macros | Stmt Attribute/Macro mapped+emitted; macro execution refuses (open) | 4 |
| Deterministic macro expansion | FnTable.macros + expand_macro (substitution+lift); Macro executes registered macros | 3 |
| Whole-program G0 service | /admit_program (replay gate) + /run_program (key lookup, 1 µJ, 0 model calls); live x=10→22 | (live) |
| Cooperative async scheduler | program::Scheduler (round-robin, await yields, fuel/round bounded) | 4 |
| Typed monomorphization | types.rs (I64/I128/Bool + vars), monomorphize per-instantiation checks, exec_typed range checks | 6 |
| Rate-monotonic priority dispatch | rtos::priority_dispatch (deterministic, refuse if unschedulable) | 3 |
| Two-boundary contact physics | twin::Plant3/simulate3 (floor+ceiling, restitution, friction) | 3 |
| Preemptive + IO-async runtime | program::IoRuntime (priority per tick, AwaitEvent completions in tick order) | 4 |
| 2D rigid-body contact | twin::Body2/simulate_body (box, restitution, friction-induced spin) | 3 |
| Emission checked by real toolchains | examples/emit_proof.rs: one Form to C/Rust/Python, clang/rustc/python3 all print 14 | (live) |
| No-pay conformity/port artifacts | trust::module_a_file + slsa_statement; rtos::zephyr_project + sel4_manifest; fabric::local_capabilities | 5 |
| Compute-light cross-fabric learning | hd.rs HD/VSA one-shot (0.992) + ELM closed-form (0.892); CUDA source as data; native AMX parity | 5 |
| Multi-body impulse contact | twin::WorldN/simulate_n (pairwise impulse, restitution, mass-weighted) | 4 |
| Real threads, deterministic commit | program::threaded_run (OS threads, join + sort by id) | 2 |
| Type-feedback optimizing JIT | jit::OptJit (signature specialization + deopt) | 3 |
| Real OS-event-loop IO | program::tokio_io_run (tokio/mio kqueue/epoll, deterministic commit) | 2 |
| Rotation + oriented contact manifolds | twin Ball.theta/omega + Obb/collide_obb (local-frame normal) | 2 |
| Measured reuse-decay + tracing reuse | scale::reuse_curve (hit-rate up, cost/act down); TracingJit compile-once over 500 calls | 2 |
| Convex-polygon contact (SAT) | twin::Poly/circle_poly/sat_overlap/resolve_poly | 3 |
| World-model rollout + round-wise FedAvg | HierPredictor::rollout; scale::federated_hier (0.0170 == centralized) | 2 |
| Concave contact + HIL certification | twin::triangulate/circle_concave; hil::certify (bounds/force/pressure/deadline + trace digest) | 5 |
| Exotic grammar constructs (49) | block/loop/break/continue/try/cast/closure/pattern/ref + node mappings | (matrix) |

The former "external decision" fronts are now OPEN-TRACKS in rce-gap-register.md: no-pay
routes found by search (module-A self-assessment by freezing competence at admission; seL4 /
Zephyr + free SIL3 self-test library instead of a paid RTOS licence; open evidence + SLSA
instead of a paid audit; owned fleet instead of debt; reuse + federated/hybrid training
instead of paid GPU). Scale built on owned hardware: federated averaging over 4 shards at
20k receipts matches centralized (0.9975); a native Accelerate/AMX BLAS trainer matches the
scalar loop (0.9970); mosaic-style hybrid partitioning with admission control.

Measured per-language named-node coverage (tree-sitter upstream, 26 Nov 2026): **100% for
28 surveyed languages** (the 16 prior plus ocaml 276/276, r 40/40, dart 223/223, elixir 45/45,
erlang 164/164, clojure 35/35, scheme 27/27, nim 127/127, crystal 152/152, d 284/284,
fortran 240/240, php 157/157). The 113-construct emission matrix is 100% across 47 languages.
Report: rce-language-coverage-100.md. Only ada and perl lack a public tree-sitter grammar
(emission LUT rows exist, node coverage unmeasured). Mesh contact built (twin::Mesh).

Cross-node latency fleet live: 2 nodes / 400 acts, 64.125 µs/act act-weighted
(node-a 64.2, node-b 64.05; node-a energy delta below IOReport resolution in that
window — a reading, never a fabricated 0).

Suites 384 (workspace) / 381 (monorepo), 0 failed. Mesh (non-polygon) manifolds, RTOS port,
notified-body attestation, full per-language grammars (measured remainder above) and
FormJEPA/FormEBM / tracing-JIT at production scale remain open edges.
Capstone summary: rce-research-completion.md.

## New unknowns (registered in rce-gap-register.md)

Deadline/WCET model (now seed-built); memory-budget placement (seed-built); JIT compile-spike
refusal (seed-built); physics-twin parity; certified RTOS port (QNX/seL4); India/AAIF dataset-standards
interop; trajectory provenance at scale; embodied safety standards mapping (ISO 10218/TS 15066/IEC 61508).

## Sources
- https://www.enchargeai.com/blog/intelligence-untethered-the-hardware-bottleneck-blocking-physical-ai
- https://www.eetimes.com/humanoid-robots-exit-labs-mapping-the-technical-path-to-embodied-ai-at-aw-2026/
- https://www.facebook.com/TencentCloud/posts/embodied-ai-is-no-longer-a-research-topic-its-an-infrastructure-decisionthe-glob/1585222533399493/
- https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Advances-Isaac-Platform-for-General-Purpose-Robotics-With-New-Reference-Humanoid-Frameworks-Simulation-Pipelines-and-Data/default.aspx
- https://www.youtube.com/watch?v=IvzFNfOEbc0
- https://www.humanoidsdaily.com/news/lg-to-unveil-next-gen-humanoid-built-on-nvidia-isaac-gr00t-in-early-2027
- https://www.facebook.com/gsccco/posts/-china-dominates-humanoid-robot-production-but-the-real-battleground-may-be-the-/1730211099112046/
- https://humanoid.guide/agibot-reaches-10000-humanoid-robots-scales-to-10000-units/
- https://www.humanoidsdaily.com/news/galbot-opens-pre-orders-for-et1-bipedal-humanoid-aimed-at-entertainment-and-performance
- https://newmarketpitch.com/blogs/news/humanoid-robotics-who-is-ahead-chinese-companies
- https://lmdconference.com/news/mujin-runs-live-digital-twin-00098-l14
- https://techcrunch.com/2026/04/05/japan-is-proving-experimental-physical-ai-is-ready-for-the-real-world/
- https://www.humanoidsdaily.com/news/samsung-accelerates-in-house-humanoid-development-with-dedicated-rx-unit-and-world-model-ai
- https://rainbow-robotics.com/edaily-from-factory-automation-to-the-home-samsung-unveils-roadmap-for-commercializing-robots/
- https://www.koreaherald.com/article/10877236
- https://www.humanoidsdaily.com/features/the-humanoids-of-europe
- https://www.linkedin.com/posts/seb-johnson_breaking-norwegian-company-1x-to-deliver-activity-7389325304068145152--7hN
- https://neura-robotics.com/products/4ne1/
- https://www.marketsandmarkets.com/Market-Reports/geography/physical-ai-market/India
- https://www.startupwire.in/post/physical-ai-startups-push-for-india-industry-standards
- https://www.reddit.com/r/TechnologyNewsIndia/comments/1y4zwuu/india_wants_to_build_humanoid_robots_a_bengaluru/
- https://arxiv.org/html/2603.19199v1
- https://www.pi.website/download/real_time_chunking.pdf
- https://github.com/guanweifan/awesome-efficient-vla
- https://www.roboticsproceedings.org/rss21/p052.pdf
- https://openreview.net/attachment?id=NTCUG0BWka&name=pdf
- https://www.maximilianigl.com/blog/action-chunking
- https://finance.biggo.com/news/529cef7b6b5c6050
- https://www.forbes.com/sites/jonmarkman/2026/05/19/the-nvidia-arm-chip-stack-winning-the-humanoid-robot-boom/
- https://www.figure.ai/news/helix
- https://www.luigifreda.com/2026/02/02/figure-ai-announces-helix-02-a-general-purpose-humanoid-system/
- https://github.com/ros-controls/ros2_control/issues/736
- https://scholars.cityu.edu.hk/en/studentTheses/advancing-ros-2for-reliable-real-time-systems-from-time-critical-/
- https://ui.adsabs.harvard.edu/abs/2023ChJME..36..144Y/abstract
- https://www.rfp.wiki/artificial-intelligence/robotics-ai-development-platforms/nvidia-isaac/kuka-sim
- https://www.techtimes.com/articles/329379/20261022/sim-real-gap-narrowed-399-duck-robot-isaac-lab-30-proves-pure-simulation-training-works.htm
- https://aws.amazon.com/blogs/physical-ai/sim-to-real-and-real-to-sim-the-engine-behind-capable-physical-ai/
- https://github.com/epoch-research/robotic-manipulation-compute/blob/main/data/Robotics%20Models.csv
- https://www.linkedin.com/pulse/what-robot-data-collection-stopped-needing-tsuhe
- https://www.ay-robots.com/en/marketplace
