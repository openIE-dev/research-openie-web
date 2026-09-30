---
title: "Notational Intelligence as Commit Law"
deck: "A software reference for commit and refuse at irreversible actions, with analytical energy accounting and no board power measurement."
id: ni
status: "Research study"
author: "David Charlot, Open Interface Engineering"
figures: "/living/ni/"
pdf: "/pdfs/ni.pdf"
board_synth_claimed: false
---

# Notational Intelligence as Commit Law

## Abstract

Agents propose actions. Irreversible work begins only when an action is allowed to run. This paper treats that permission step as a formal object. Linus Lee's notational intelligence is the observation that a change in symbols can make some thoughts cheap and others expressible. The claim here is narrower. For machines that can move matter or call an irreversible tool, the useful notation is a runtime law: a proposal may not authorize itself. The software reference, Wise Computer Automation (WCA), records the law as four objects under schema `wca.commit.v1`: a proposal, a certificate, a typed refuse reason, and a commit decision. The certificate used in the reference is conjunctive. A look-up table (LUT) allow bit must hold, and an energy predicate must hold. An optional control barrier function (CBF) may be added. Read-only calls may bypass the gate. Irreversible calls may not.

Energy numbers in this paper are products of operation counts and analytical energy constants (an OpCounter model). They are not board power. Field-programmable gate array (FPGA) behavior in the repository is Icarus Verilog simulation of emitted register-transfer language, not a placed design. We have not synthesized or metered an FPGA board. The intended physical target, once a meter exists, is an Alchitry Pt V2. Stage B is available as a browser instrument at https://research.openie.dev/living/fpga-sim/. It compiles the same Rust gate to WebAssembly (WASM) and shows LUT state and commit traces through the WebGPU API. That instrument is an emulation. It is not a device-under-test (DUT) measurement and it is not Alchitry board power.

The measured software results are bounded. On a 16-step pendulum episode with seed 1, the reference commits 1 step and refuses 15. The analytical episode energy is 8.6795e-10 joule. On the reported Safe fixed-point port-Hamiltonian check, false allows against a continuous energy oracle are 0 on the stated grids. A Model Context Protocol (MCP) demo refuses an irreversible tool call without invoking the executor. A toy comparison with an energy-set barrier and a discrete shield shows disagreement across safety definitions. None of these results is a claim of silicon energy leadership, of industrial control performance, or of a completed board measurement.

## Notation

Terms are defined at first scientific use below and collected here so later sections can use the short form.

| Term | Definition in this paper |
|------|--------------------------|
| Open Interface Engineering (OpenIE) | The organization that maintains the software reference and this study. |
| Notational intelligence | Lee's claim that better notations can raise what a person or system can reliably do, beyond adding tools alone. |
| Commit law | A runtime rule that either applies a proposed action or holds. The proposer does not get a second, informal channel. |
| Wise Computer Automation (WCA) | The software reference that implements commit law at the boundary between a proposal and an irreversible effect. |
| Energy-First Architecture (EFA) | The design choice to put an energy predicate inside the permission record, not only in a later report. |
| Proposal | A candidate action `u`, state, and optional analytical energy hints. It cannot commit. |
| Certificate | The gate record: LUT allow, energy predicate, optional CBF predicate, reasons, and metrics. |
| Refuse reason | A typed code such as `lut_veto`, `energy_veto`, `cbf_veto`, `budget_exceeded`, or `policy`. |
| Commit decision | The envelope that sets plant action to `u` or to zero. |
| Look-up table (LUT) | A discrete map from a compact code to allow or refuse. |
| Ternary look-up matrix multiplier (TLMM) | The reference's cheap ternary table-lookup proposal path. |
| Control barrier function (CBF) | A certificate of set invariance when its inequality holds (Ames et al., 2019). |
| Model Context Protocol (MCP) | A tool-call transport. In this paper it is an adapter under test, not a plant certificate. |
| System One | Typed decision procedures (Laya / Jev class) that choose among known options in software. They are proposers. |
| Port-Hamiltonian | A structured energy model used here for a passivity-style check on toy plants. |
| Runtime verification (RV) | Checking a property on an executing trace. Related, not identical, to the commit record. |
| Device under test (DUT) | Hardware measured under a stated workload with a stated meter. No DUT result is reported. |
| Field-programmable gate array (FPGA) | Reconfigurable logic. This paper reports simulation of Verilog, not a board. |
| WebAssembly (WASM) | A portable compilation target for the browser. The Stage B WASM FPGA emulator is shipped at https://research.openie.dev/living/fpga-sim/. |
| WebGPU | The browser GPU API named as the display and grid-evaluation path for that emulator. |
| Alchitry Pt V2 | The intended later board: vendor documentation identifies a Xilinx Artix-7 XC7A100T. Not synthesized here. |
| DiffLogic | Differentiable logic gate networks trained toward Boolean structure (Petersen et al., 2022). |
| Analytical energy estimate | `J = sum_op count_op * E_op` with named constants. Not board power. |
| Modeled | A quantity obtained from a stated formula or fitted structure. |
| Simulated | A quantity obtained by executing the software or Verilog model. |
| Board-measured | A quantity from a meter on a stated device and workload. None are reported. |

Scope of the argument. Section 2 places the commit record against notation research, information theory, scaling results, LUT networks, and control certificates. Section 3 defines the objects, the plants, the analytical energy model, and the unshipped browser instrument. Section 4 reports only quantities produced by the software reference or by a cited external source. Section 5 answers objections that have published form. Section 6 states what would falsify the claims and what was not measured.

## 1. Introduction

A language model can rank actions. Ranking is not permission. The failure mode that matters for a plant, a shell, a payment, or a destructive laboratory step is a commit: the action runs. Soft scores remain useful upstream. They are the wrong type at the irreversible branch, because a probability does not name which predicate failed, and it does not force the actuator command to zero.

Lee (2022) states a prior claim cleanly. Notation is not decoration. A notation that makes an operation executable changes which errors can be written down and which can be hidden. Iverson (1980) made the same point for array languages: notation is a tool of thought. Engelbart (1962) treated language, artifacts, methods, and training as one system. Kay (1972) and Victor (2013; 2012 talk) argued that representations should keep consequences near the idea being edited. Matuschak and Nielsen asked why tools for thought stall as products. That literature is about cognition and media. It does not, by itself, specify a record that a machine must obey before it moves.

The industrial center of recent artificial intelligence is scale. Kaplan et al. (2020) and Hoffmann et al. (2022) report loss scaling with parameters, data, and compute. Hooker (2021) argues that ideas spread when they fit available hardware and kernels. Epoch AI reports large declines in the price of a fixed inference performance (Epoch AI, 2025; Emberson and Roodman, 2026). Those results are about capability and cost of proposal. They do not define a commit predicate.

This paper's contribution is a software reference for that predicate, plus a report of what the reference actually does on toy plants. The contribution is compositional. Boolean LUT shields, energy certificates, ternary table lookup, and tool transports each exist in prior work. The reference wires them as one auditable decision: proposal, then certificate, then typed refuse or commit. The scan recorded in the project state-of-the-art note did not find a published product that ships that exact composition as one boundary. A scan is not a proof of absence. Private systems can exist. The claim is the existence and behavior of this reference, not a global first.

Three measurement statements constrain every later number. First, joules computed by the OpCounter are analytical estimates. Second, Verilog results are simulation. Third, we have not synthesized or metered the FPGA board. `board_synth_claimed` remains false in the repository metadata until a synthesis log and a meter exist. Those sentences replace any badge-style labeling. A reader should be able to tell modeled, simulated, and board-measured apart from the method clause attached to the number.

## 2. Related work

### 2.1 Notation and tools for thought

Lee (2022) argues that inventing notations can matter more than inventing additional automated tools, because a notation changes the thoughts that are cheap. The interview record with The Gradient is consistent with that essay and is not an independent empirical result. Iverson (1980), Turing Award lecture, is the classical computer-science statement: notation is a tool of thought, and executability is part of the test. Engelbart (1962) locates intelligence in a human plus artifact system, not in a bare brain. Kay (1972) specifies a personal dynamic medium. Victor's "Media for Thinking the Unthinkable" and "Inventing on Principle" argue that creators need representations whose consequences are visible while the idea is still being formed. Matuschak and Nielsen, "How can we develop transformative tools for thought?", document adoption and institutional failure modes of such tools.

This paper uses that lineage for one limited inference. If a notation is executable, some failures become ordinary data rather than unrepresented accidents. A typed refuse reason is an instance. It does not support the strong Sapir-Whorf claim that language determines thought. The strong claim is rejected in Section 5. The weak claim, which is Iverson's, is that an executable notation changes the cost of operations and the representability of errors.

Chollet (2019) defines intelligence as skill-acquisition efficiency and grounds the definition in algorithmic information theory. That definition is about learning new skills, not about commit. It is cited so the paper does not confuse a frozen benchmark score with a theory of intelligence. This paper does not add an energy term to Chollet's definition and then treat the sum as measured.

### 2.2 Information, description length, and physical cost

Shannon (1948) defines entropy and channel capacity. Shannon (1959) defines rate-distortion: how much description is required for a stated fidelity. Kolmogorov (1965) defines description length by program size. Solomonoff (1964) defines inductive inference by a mixture over programs. Chaitin (1977) develops program-size complexity. Cover and Thomas (2006) is the textbook spine. Jaynes (1957) uses maximum entropy as a rule for distributions under constraints. Brillouin (1956) connects information to physical negentropy in the Maxwell-demon line.

Cross-entropy training of a language model is an information-theoretic objective on a data distribution. Sutskever's 2023 Simons Institute talk, which is a talk and not a paper, discusses unsupervised learning as compression. That fact does not yield a Kolmogorov certificate for a particular string, and it does not yield a commit bit. The distinction is the one drawn in the project citation spine: statistical compression of a training measure is not the same object as a runtime allow set under a plant constraint.

Landauer (1961) proves a lower bound: logically irreversible erasure dissipates at least `kT ln 2` per bit in the ideal model. Bennett (1973) shows that logically reversible computation can avoid that erasure cost in the limit. Horowitz (2014) reports practical CMOS energy at picojoule scales for operations and memory movement, far above the Landauer bound, and treats energy rather than transistor count as the constraint. Mead (1990) is the neuromorphic argument for analog efficiency. Sandberg (2016) warns that a brain power near 20 watt does not bound the energy of an engineered system trained from scratch. A cortical partitioning preprint (arXiv:2102.06273) further warns against treating all of that biological power as comparable compute. This paper uses Landauer and Horowitz as bounds and practice tables. It does not claim that any model in the reference operates near `kT ln 2`.

### 2.3 Scale, hardware fit, and price

Hestness et al. (2017), Kaplan et al. (2020), and Hoffmann et al. (2022) document empirical scaling of deep learning loss. Amodei and Hernandez (2018), an OpenAI blog post, describe rapid growth in training compute for landmark results. The page is a vendor essay. This paper does not depend on a specific doubling time from it. Sutton (2019) argues that general methods which use computation have beaten systems that encode the contents of human knowledge as fixed features. The essay is not an argument against every constraint. A commit predicate is a constraint on action, not a hand-built chess feature. Hooker (2021) explains why alternatives lose when the installed base of chips and libraries rewards dense matrix multiplication.

Epoch AI (2025) reports inference price drops on the order of 9 to 900 times per year at fixed benchmark performance, depending on the benchmark. Emberson and Roodman (2026) report about a 47 percent quarterly decline in the cost of a given performance since about 2023, which they summarize as about 13 times per year, with a faster decline near the frontier. Those are Epoch's published summaries. They are evidence about price. They are not evidence that joules or irreversible commits have become free. The companion paper on satiation uses the same price series for a demand argument. This paper uses them only to separate proposal cost from permission.

### 2.4 LUT networks, ternary lookup, and differentiable logic

Umuroglu et al. (2020) map sparse low-bit networks to FPGA truth tables (LogicNets). Petersen et al. (2022) train networks of logic gates with differentiable relaxations (DiffLogic). Bacellar et al. (2024) train weightless networks of LUTs (differentiable weightless neural networks). Ma et al. (2024) study ternary-weight language models (BitNet b1.58). Wei et al. (2024) implement low-bit matrix multiplication by table lookup on CPUs (T-MAC). The TeLLMe line (arXiv:2504.16266) is a ternary LUT matrix-multiplication design aimed at FPGA execution. Those systems show that tables and gates are a real compute substrate. They do not, in the papers cited, attach a port-Hamiltonian energy veto and a typed commit envelope to a tool executor.

The reference uses DiffLogic as a thin allow table on toy features, and TLMM as a proposal path. That is a different job from using a logic network as the whole classifier, which is the usual DiffLogic evaluation (vision benchmarks, large gate counts). Section 6 records the capacity gap.

### 2.5 Certificates, shields, and runtime monitoring

Ames et al. (2019) survey control barrier functions as set-invariance certificates, typically enforced by a filter or a quadratic program. Alshiekh et al. (2018 preprint arXiv:1708.08611) introduce shields that replace unsafe actions with safe ones, minimally when possible. Dawson, Gao, and Fan (2022) survey learned Lyapunov and barrier certificates and the failure modes of treating a neural network as a certificate without a check. Manek and Kolter (2020) learn stable dynamics with a Lyapunov structure. Greydanus, Dzamba, and Yosinski (2019) learn Hamiltonian neural networks. Roth et al. (2025) study stable port-Hamiltonian neural networks. Yu, Zikelic, and Henzinger (2024) repair neural certificates using runtime monitors. Leung and Pare (arXiv:2512.24493) study energy-aware Bayesian barrier filters. Sanchez et al. (2018) survey runtime-verification taxonomies.

The reference does not replace that mathematics. The Safe path is a conservative fixed-point test of a known energy identity on a pendulum, `V = (1/2)(g theta^2 + omega^2)` with `Vdot = omega * u`. The CBF used in the toy bake-off is an energy-set inequality on the same `V`, not a claim to have solved the Ames quadratic program on a manipulator. Learned Lyapunov structure on a cart-pole is a second toy, reported in Section 4, and is not a region-of-attraction theorem for arbitrary plants.

### 2.6 World models, typed decisions, and tool transport

Ha and Schmidhuber (2018) and Hafner et al. (DreamerV3, arXiv:2301.04104) show that learned models can propose actions from imagined trajectories. LeCun's JEPA essays (Meta research blog) argue for predictive world models. LeCun et al. (2006) is the earlier energy-based learning tutorial. Prediction error is not identically zero in these systems. A predictor can sit upstream of a gate. It cannot replace the gate unless its predictions are perfect and the plant model is the plant. This paper does not compete with those systems on prediction benchmarks.

System One, as described by Laya (product page) and in related preprints arXiv:2503.23303 and arXiv:2510.01237, collapses generation cost when the option set is typed and known. Anthropic's Model Context Protocol announcement specifies discovery and transport for tools. Transport delivers a call. It does not evaluate `Vdot`. The reference's MCP adapter is a beachhead: irreversible tools require a certificate before the executor runs. That is an engineering claim about this adapter, tested by the demo in Section 4, not a claim about every MCP server in production.

### 2.7 What the composition adds

Shields refuse unsafe actions but are not, in the cited papers, exported as the reference's four-field commit record with an analytical joule account. DiffLogic and LUT networks compute functions. They are not, in those papers, a veto in front of a separate proposer and a tool executor. Energy-aware barrier filters are continuous. The reference's allow bit is a table. The compositional claim is the wiring: LUT allow and energy predicate and optional barrier, recorded with a typed reason, applied before an irreversible effect, with analytical energy kept distinct from board power. Section 4 states which parts of that wiring were executed.

## 3. Definitions and methods

### 3.1 Objects

Fix a state `x` and a candidate action `u` in a set `U`. A proposal is a tuple

```text
Proposal = (u, x, hints)
```

`hints` may include analytical energy quantities. A proposal has no interpretation as permission.

A certificate is a tuple

```text
Certificate = (lut_allow, energy_ok, cbf_ok, reasons, metrics)
```

`lut_allow` and `energy_ok` are Booleans. `cbf_ok` is a Boolean when the selected compose mode requires it, and is absent otherwise. `reasons` is a list of refuse reasons. `metrics` includes the analytical energy account and the flag that board synthesis is not claimed.

Compose modes in the schema README are:

```text
lut_and_energy        : commit <=> lut_allow AND energy_ok
lut_and_safe          : commit <=> lut_allow AND safe_energy_ok
lut_and_safe_and_cbf  : commit <=> lut_allow AND safe_energy_ok AND cbf_ok
```

Ablations `energy_only` and `lut_only` exist so a comparison can remove one conjunct. They are not the default for irreversible tools.

A commit decision is

```text
if commit then plant_action = u else plant_action = 0
```

with the certificate attached. The executor for an irreversible tool is called only in the first branch.

Worked record. File `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` stores a refuse in which `lut_allow` is true and `energy_ok` is false. The reason code is `energy_veto`. The fixed-point detail string is `Vdot_q=1461 > eps_q=13`. `plant_action` is `[0.0]`. The record sets `board_synth_claimed` to false. One true conjunct does not commit. That is the content of the conjunction, not a slogan.

### 3.2 Plants and oracles

The primary plant is a pendulum. Continuous reference quantities used by the Safe check are `g = 9.81`, `epsilon = 0.05`, `V = (1/2)(g theta^2 + omega^2)`, and `Vdot = omega * u`. `energy_ok` in the continuous oracle means `Vdot <= epsilon`.

The legacy discrete check is a Q8.8 fixed-point approximation, bit-matched to the Verilog module `wca_ph_energy.v` in simulation. The Safe check (`SafeFixedPointPHCertificate`) uses Q16.16 and an exact integer residual. The reported predicate is

```text
energy_ok <=> 4*omega_q*u_q + 2*(abs(omega_q)+abs(u_q)) + 1
              <= floor(4*epsilon*S^2)
```

with the rounding argument given in `artifacts/RESULTS.md`: under round-to-nearest with error at most half a least significant bit, `Vdot` is bounded by `(prod + (1/2) abs + 1/4) / S^2`. The design goal is one-sided. If the Safe predicate allows, the continuous oracle allows. The converse is not required. Extra refuses are a measured cost, not a contradiction of the safety direction.

A second plant, cart-pole, is used only in the learned-Lyapunov simulation. State is `[x, xdot, theta, thetadot]`, with `g = 9.81`, cart mass 1.0, pole mass 0.1, length 0.5. `V` is a quadratic form `xi^T P xi / 2` with `P` positive definite by a Cholesky construction plus a multiple of the identity. The fit is stochastic gradient on a hinge of `Vdot + alpha V` under a linear policy, seed 42, 400 iterations, batch 32, `alpha = 0.15`, as recorded in `RESULTS.md`. The continuous gate is `Vdot <= 0.05`. The Safe discrete rule adds a Lipschitz margin times half a least significant bit. This is a simulation of one fitted quadratic on one box. It is not a proof for other plants.

### 3.3 LUT allow and proposal path

The allow LUT in the reported episodes is a DiffLogic export with mask `21887` on four features: absolute theta, absolute omega, absolute `u`, and an energy bit, unless a section says otherwise. TLMM is a grouped ternary table lookup used as a proposer. Iso-correctness means agreement with a naive ternary matrix product within absolute tolerance 1e-12, which `RESULTS.md` records as measured in software. Scale behavior is whatever `wca-tlmm-scale` writes under a stated analytical forward budget. The default budget discussed in results is 2e-10 joule per forward, analytical, not electrical.

### 3.4 Analytical energy model

`RESULTS.md` separates two facts. Operation counts are exact in the OpCounter. Joules are the counts times constants:

| Constant | Value (joule) | Role |
|----------|----------------|------|
| `E_LUT_READ` | 1e-12 | LUT read |
| `E_BRAM_WORD` | 1e-11 | BRAM word |
| `E_BITMASK_OP` | 5e-14 | bitmask operation |
| `E_ADD` | 5e-13 | add |
| `E_PACK` | 2e-13 | pack |
| `E_COMMIT_BASE` | 2e-11 | commit overhead |
| `E_REFUSE_OVERHEAD` | 5e-12 | refuse overhead |

`J = sum count_op * E_op`. Structure counters such as shared BRAM hits are reported and are not charged unless they change a counted read. Changing a constant rescales every analytical joule in lockstep. That is why the numbers cannot be compared to a vendor's tokens per joule, to MLPerf Tiny energy, or to a rail measurement. They can be compared across modes inside the same model.

Utility in the internal tables is commit count. Commit count is not a task reward. A policy that commits more can score higher utility per joule while violating the energy oracle. Section 4 therefore does not treat utility per joule as a safety metric.

### 3.5 Tool adapter

`wca-mcp-gate` classifies tools. Read-only tools may execute without a commit record. Unknown tools are treated as irreversible. Irreversible tools require a certificate under the configured compose mode, default `lut_and_safe_and_cbf` in `artifacts/mcp_gate_demo.json`. On refuse, `executed` is false and `executor_calls` is 0. The demo executor records calls and does not perform host input or output. The method string in the demo file is `rust_mcp_commit_gate_v1`.

### 3.6 Simulation of Verilog

The repository emits Verilog and memory images for the allow LUT and the commit gate (`artifacts/fpga/`). `wca-rtl-verify` and Icarus Verilog check bit-exact behavior of those models against the software oracle. Icarus executes a simulation. It does not place, route, or measure a chip. No Vivado or Quartus report is a result of this paper.

### 3.7 Specified browser instrument (not a result)

The completeness path for replication has three stages. Only the first stage exists.

Stage A, present. Rust binaries in `wca-commit` run the episode, the Safe check, the tool demo, and the analytical joule account. Icarus simulates emitted Verilog on a workstation.

Stage B, shipped. The pure decision core (proposal in, certificate out, plant step, analytical joule update) compiles to `wasm32` (`crates/wca-fpga-sim`). A static page at https://research.openie.dev/living/fpga-sim/ loads the module. WebGPU holds the LUT words and a trace buffer of `(step, lut_allow, energy_ok, cbf_ok, decision)` for display. WebGPU timestamps are not joules. On seed-1 (16 steps, theta 1.5, omega 3.0) the WASM episode reports committed 1, refused 15, analytical joule 8.6795e-10, matching Stage A. The WASM module is an emulation of the same functions the Rust crate runs. It is not a cycle-accurate model of an Artix-7, not a switching-activity power model, and not a substitute for Icarus on the Verilog. Stage B does not claim an Alchitry Pt V2 DUT.

Stage C, board programmed; energy still unmetered. An Alchitry Pt V2 was detected and loaded (SRAM) with a closed-loop WCA commit-gate bitstream: on-fabric seed-1 pendulum plant dynamics, TLMM proposal, allow LUT, and Safe Q16.16 port-Hamiltonian residual. UART at 115200 8N1 agreed with the software seed-1 golden on allow/refuse/commit (1 commit, 15 refuses, sole commit at step 6). **Closed-loop** here means plant state evolves from gate commits and refuses on the fabric; it is not a streamed stimulus ROM of plant/proposal state. The Pt V2 has **no onboard joule meter**. No USB inline meter or shunt was attached. Vivado / post-PAR power estimates are not DUT readings. SparkFun's product page names FPGA XC7A100T-2FGG84I and lists 101,440 logic cells, 240 DSP48E1 slices, 4,860 Kb of block RAM, and 256 MB of DDR3L (https://www.sparkfun.com/alchitry-pt-v2.html); those remain vendor specifications. Builder metering methods: [/living/fpga-sim/alchitry/#energy](https://research.openie.dev/living/fpga-sim/alchitry/#energy). `board_synth_claimed` stays false until a meter reading on a stated workload exists.

The scientific reason for stage B is replication and inspection, not a new physical claim. A reader with a browser should eventually be able to step the same seed-1 episode and read the same allow bit and reason codes that the crate prints. Agreement with stage A is the acceptance test for stage B. Agreement with a meter is the acceptance test for stage C. The tests are different, and this paper completes neither beyond stage A.

### 3.8 What is not a method of this paper

No human-subject study. No claim about linguistic relativity beyond the rejection in Section 5. No training-compute extrapolation. No identification of economic satiation, which is the companion paper. No optimization against Groq, Etched, or Taalas throughput. No world-model benchmark.

## 4. Results

All quantities in this section are simulated in the software reference unless a sentence cites an external paper. Analytical joules use Section 3.4. No row is board-measured.

### 4.1 Claim NI-1. The commit record exists as a schema and a Rust type

Schemas `Proposal`, `Certificate`, `RefuseReason`, and `CommitDecision` are in `artifacts/schemas/wca.commit.v1/`. Rust types are in `crates/wca-commit/src/schema.rs`. Round-trip tests are `cargo test -p wca-commit`. This is an existence result about the reference, version `wca.commit.v1`. It is not a uniqueness theorem.

### 4.2 Claim NI-2. Seed-1 pendulum episode

Command, from `RESULTS.md`:

```text
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Reported outcome: committed = 1, refused = 15, analytical episode energy = 8.6795e-10 joule. The same committed and refused counts and the same analytical energy are reported for `--safe-ph` on that seed. `RESULTS.md` states that the single commit is step 6. Toolchain note in that file: Rust 1.98. Re-running the binary is the reproduction. The energy is not a measurement of a chip.

### 4.3 Claim NI-3. False allows of the Safe energy check

`wca-ph-tighten` compares discrete decisions to the continuous oracle `Vdot <= epsilon`. On a 21 cubed grid plus 200,000 near-threshold Monte Carlo samples (209,261 decisions):

| Path | False allow | False refuse | Both allow | Both refuse |
|------|-------------|--------------|------------|-------------|
| Legacy Q8.8 | 30836 | 105 | 104711 | 73609 |
| Safe v1 (Q8.8 over-approximation) | 0 | 42430 | 62386 | 104445 |
| Safe v2 (Q16.16 residual) | 0 | 79 | 104737 | 104445 |

`RESULTS.md` also states that a denser 41 cubed grid plus 50,000 Monte Carlo samples, checked in `cargo test`, asserts false allow equal to 0. Safe v2 cuts false refuses from 42,430 to 79 relative to Safe v1 while keeping false allows at 0. Legacy Q8.8 is not safe on this definition: it records 30,836 false allows. These counts are properties of the numerical test, not of a physical pendulum.

### 4.4 Claim NI-4. Toy barrier comparison, neither definition dominates

`wca-cbf-bakeoff` runs seeds 0 through 4, 40 steps, time step 0.05, action scale 2.5, shared demo TLMM and DiffLogic mask `21887`. The energy-set barrier uses `h = 18 - V` and allows when `h >= 0` and `omega * u <= kappa * h` with `kappa = 0.05`. The discrete shield allows a step that stays inside absolute theta at most 2 and absolute omega at most 4. Closed-loop means differ because trajectories diverge. The file reports per-episode means for commits and sums for violation counts. Selected rows:

| Filter | Commit | Refuse | Analytical J | False allow vs PH | `h < 0` | `Vdot > epsilon` |
|--------|--------|--------|--------------|-------------------|---------|------------------|
| `lut_and_safe_ph` | 1 | 38 | 2.153e-09 | 0 | 4 | 0 |
| `cbf_energy_set` | 1 | 38 | 2.056e-09 | 3 | 0 | 3 |
| `shield_discrete` | 18 | 21 | 2.306e-09 | 90 | 38 | 90 |
| `lut_only` | 40 | 0 | 2.544e-09 | 194 | 220 | 194 |

On this plant and this oracle, `lut_and_safe_ph` has zero `Vdot` violations and four `h < 0` events. The energy-set barrier has zero `h < 0` events and three `Vdot` violations. The shield commits more and violates the energy oracle often. `lut_only` matches `always_allow` on violations in the reported table. Offline agreement on a shared always-allow stream of 200 steps gives 4 disagreements between `lut_and_safe_ph` and `cbf_energy_set`, and 70 against the shield.

Interpretation inside the test: passivity and set invariance are different predicates. The LUT-and-energy gate is not equivalent to an Ames filter, and it does not win every column. A full quadratic-program baseline on a richer plant is not in this table. That comparison remains open. The result that is available is the disagreement, which is evidence against collapsing the two certificates into one word.

### 4.5 Claim NI-5. Cart-pole Safe Lyapunov simulation

On the audit described in Section 3.2 (grid n = 7 plus 20,000 boundary samples inside the Lipschitz box, 26,487 decisions), Safe learned Lyapunov versus the continuous `Vdot` oracle records false allow 0, false refuse 3, both allow 15,925, both refuse 10,559. Closed-loop means over five seeds: `lut_and_safe_lyap` commits 11, refuses 28, analytical J 2.719e-09, and records zero false allows against that oracle. The level-set barrier on the same `V` commits 14 and records 15 energy-oracle violations. The discrete shield commits 29 and records 95. Same pattern as the pendulum: the Safe conjunct tracks its own oracle; a different certificate tracks a different one; permissiveness without the oracle is not safety.

This is one additional simulated plant. It does not establish the commit law on industrial dynamics.

### 4.6 Claim NI-6. MCP demo

`artifacts/mcp_gate_demo.json` records four cases. `board_synth_claimed` in the file is false.

| Case | Class | Executed | Executor calls | Commit |
|------|-------|----------|----------------|--------|
| `read_only_bypass` | read-only | true | (no commit record) | absent |
| `irreversible_refuse` | irreversible | false | 0 | false |
| `irreversible_allow` | irreversible | true | 1 | true |
| `shell_exec_gated` | irreversible | true | (gated) | true |

The refuse case lists `energy_veto` (`vdot` 6.0 against `eps` 0.05) and `cbf_veto`. Plant action on that case is `[0.0]`. The allow case uses compose `lut_and_safe_and_cbf` and plant action `[-0.02]`. The note in the file states that refuse never executes. This is a demo of the adapter, not a field study of computer-use agents.

### 4.7 Claim NI-7. TLMM under an analytical budget

`RESULTS.md` reports a demo 2 by 4, group 2 configuration near 4.24e-11 analytical joule, under the forward budget. The largest configurations that remain under the 2e-10 forward budget stop at 64 parameters. Widths 8 by 16 and above exceed that budget even after the optimizer. Iso-correctness against naive ternary arithmetic is a software comparison at tolerance 1e-12. These statements do not say that the design matches TeLLMe throughput or any board energy.

### 4.8 Claim NI-8. DiffLogic allow versus an energy teacher, toy only

On the hard multi-seed gate benchmark in `RESULTS.md`, after threshold calibration and denser labels, DiffLogic matches the energy teacher on refuse rate 50.0 plus or minus 15.9 percent, precision at threshold 0.890 plus or minus 0.067, and recall 0.802 plus or minus 0.076. A bitmask reference refuses more (71.0 plus or minus 14.9 percent) and recalls less (0.454 plus or minus 0.266). Before calibration, DiffLogic refuse rate was 57.5 plus or minus 14.1 percent with recall 0.724 plus or minus 0.163. The match is on this toy labeling setup. It is not an ImageNet or control-suite result. Internal utility per joule rises for the calibrated gate (3.570e9 versus 3.212e9 before) under the analytical model. As Section 3.4 states, that ratio uses commit count as utility.

### 4.9 What the scan supports

The state-of-the-art note dated with the September 2026 scans records no published system found that composes a learned Boolean allow LUT, a port-Hamiltonian or Lyapunov energy predicate, and a ternary LUT proposal as one commit boundary with bit-exact RTL simulation and an analytical joule account. Nearest neighbors are named there: shields, energy-aware barrier filters, logic networks as the whole model, and TLMM designs without an energy certificate. The scan supports a gap statement about the literature that was searched. It does not support a priority claim over unpublished work, and it does not support an energy-leadership claim.

## 5. Discussion

### 5.1 Scale does not answer the commit question

Kaplan, Hoffmann, Hooker, Sutton, and Epoch answer how proposal cost and loss behave. A larger proposer can still emit an action that fails `Vdot <= epsilon`. Putting that proposer behind the certificate uses scale where the evidence says scale works, and uses the predicate where scale is silent. The Bitter Lesson objects to frozen human features that block learning. It does not entail deleting a safety predicate. If a future result shows that an unconstrained policy meets the same false-allow test at lower analytical cost and equal task error, NI-3's engineering preference for the gate would be weakened on that plant. The logical distinction between proposal and permission would remain.

### 5.2 Natural language and MCP are transport and proposal

MCP solves discovery and call shape. System One solves some decisions without free-form generation. Neither object is `energy_ok`. The demo in NI-6 shows a refuse that does not call the executor. A production deployment could bypass the adapter. The claim is not that the protocol makes bypass impossible. The claim is that permission has to be a separate record if irreversible effects are to be auditable.

### 5.3 Strong linguistic determinism is not the claim

The strong hypothesis that language determines thought is not a premise. The operational statement is local. In this schema, a commit without a passing certificate is not a successful record. An untyped confidence string can be stored beside a success flag and still leave the reason unstated. The enum removes that particular ambiguity. It does not describe human cognition.

### 5.4 Formalism can be wasteful; this predicate is small

Requiring a proof of the whole agent at every step would dominate the budget. The reference formalizes one boundary. Read-only calls bypass. The Safe residual is a fixed-point inequality, not a general SMT query. NI-2's analytical episode energy is 8.6795e-10 joule under the stated constants, dominated by whatever the counters charge, and is still not a fraction of a generative model's board energy because that comparison was not measured. A split between proposal analytical joules and gate analytical joules on a real agent workload is not in the results. Until it is, the cost objection is open for large certificates and unanswered only for this toy gate.

### 5.5 A wrong model with a green light is a real failure

If `V` is not the plant's energy, `energy_ok` can be true while the plant is not safe. The mitigation present in the reference is a continuous twin on the toys, a separated reason code, and a refusal to treat a probability as a certificate. The mitigation not present is disturbance Input-to-State Stability, a verified region of attraction, or a Bayesian credibility budget of the kind Leung and Pare study. NI-4 is the evidence that two respectable certificates disagree. That disagreement is a reason to name the predicate, not a reason to trust either one outside its test.

### 5.6 Prior certificate theory is not duplicated here

Ames, Alshiekh, Dawson, and the runtime-monitoring papers already define filters and monitors. NI-1's addition is the product record and the composition with a LUT export and a tool executor in one reference. Where the toy barrier wins on set invariance, the paper says so (NI-4, NI-5). Composition is `cbf_ok` as another conjunct when that predicate is the one required. It is not a claim that the LUT computes the Ames quadratic program.

### 5.7 Predictors and specialized inference chips

World models reduce some prediction error and leave a residual. Specialized inference devices change the cost of proposals. Vendor throughput figures are vendor reports until an independent meter repeats them. This paper does not repeat them and does not rank the reference against those devices. The gate's job is the irreversible branch. If a device's only interface is a token stream, the commit record still has to live somewhere before actuators or irreversible tools run.

### 5.8 Analytical joules are not a costume for watts

The constants in Section 3.4 are chosen engineering numbers. They make counts comparable inside the repo. They are not calibrated to an Artix-7 rail. Selling them as board watts would be a false measurement report. The correct report is the one given: operation counts are computed; joules are modeled; the board has not been synthesized or metered. Stage B of Section 3.7 makes the same model inspectable in a browser at https://research.openie.dev/living/fpga-sim/. It does not change the measurement class. Stage C would.

## 6. Limits and threats to validity

Internal validity. Seed-1 is one initial condition. The Safe grid is large but still a chosen box and a chosen epsilon. Monte Carlo samples near the threshold stress the boundary the designers chose to stress. A different epsilon or a different plant identity breaks the numerical claim until re-run. The CBF in the bake-off is an energy-set inequality implemented in the same crate, not an independently coded solver from an Ames reference implementation. Disagreement is informative. Absolute ranking against the literature's code is not established.

Construct validity. Commit count as utility does not measure task success. False allow is defined against a named oracle. A system can have zero false allows against `Vdot <= epsilon` and still leave the safe set `h >= 0`, which NI-4 shows. Readers who treat "safe" as one word will misread the table.

External validity. Both plants are toys. There is no manipulator, quadrotor, or human-in-the-loop trial. The MCP demo does not call a network. Verilog is simulated. The browser instrument is shipped as Stage B simulation. The Alchitry Pt V2 is a specified Stage C target, not a measured one. Vendor logic-cell counts are not confirmed here.

Measurement validity. Analytical constants can be edited to any scale. Comparisons to Horowitz's picojoule tables, to Landauer's bound, or to vendor tokens per joule are not valid with these constants. A DUT meter under a stated workload is the missing measurement. Post-place-and-route tool power would be a third class, still not a meter. This paper reports neither.

Statistical reporting. Where `RESULTS.md` gives a mean and a standard deviation, this paper copies them. It does not add confidence intervals that were not computed. Multi-seed coverage is five seeds on the bake-offs and the hard gate benchmark's reported spreads. That is not a large-sample claim.

Claim hygiene. The following are not results: silicon joule leadership; operation near the Landauer bound; brain-equivalent power; a win over System One on latency; a win over world-model benchmarks; strong linguistic determinism; identification of "intelligence" with commit count.

Falsifiers. NI-2 is false if the stated command on the stated crate revision does not print those counts. NI-3 is false if the Safe v2 test reports a false allow on the stated grid. NI-6 is false if the refuse case in the demo file executes. NI-1 is false if the schema and the runtime diverge. A stage B emulator that disagrees with stage A on seed 1 fails its own acceptance test. A future meter that assigns board energy to the analytical number without a calibration study does not confirm the analytical model.

## 7. Conclusion

The paper defined a commit decision as a conjunctive certificate over a LUT allow bit and an energy predicate, with an optional barrier, and showed a software reference that emits the decision before an irreversible effect. On the reported pendulum tests, the Safe fixed-point rule has zero false allows against its continuous oracle, at the cost of a measured false-refuse count. On the reported comparisons, that oracle is not the same as set invariance. Analytical episode energy for the seed-1 run is 8.6795e-10 joule under published constants. Tool refuse in the MCP demo does not call the executor. Verilog checks are simulation. The browser WASM and WebGPU instrument is available at https://research.openie.dev/living/fpga-sim/ so that the same decision can be inspected without a board. It remains a simulation, not a DUT result. The Alchitry Pt V2 remains a possible Stage C DUT after synthesis and metering. Until then, the reference is a measured software artifact and an unmeasured chip.

## References

Alshiekh, M., Bloem, R., Ehlers, R., Konighofer, B., Niekum, S., and Topcu, U. Safe reinforcement learning via shielding. arXiv:1708.08611.

Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P. Control barrier functions: theory and applications. European Control Conference, 2019. https://doi.org/10.23919/ECC.2019.8796030

Amodei, D., and Hernandez, D. AI and compute. OpenAI, 2018. https://openai.com/index/ai-and-compute/

Anthropic. Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

Bacellar, A., et al. Differentiable weightless neural networks. arXiv:2410.11112.

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Brillouin, L. Science and Information Theory. Academic Press, 1956.

Chaitin, G. J. Algorithmic information theory. IBM Journal of Research and Development, 1977. https://doi.org/10.1147/rd.214.0350

Chollet, F. On the measure of intelligence. arXiv:1911.01547.

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Dawson, C., Gao, S., and Fan, C. Safe control with learned certificates: a survey of neural Lyapunov, barrier, and contraction methods. arXiv:2202.11762.

Emberson, L., and Roodman, D. / Epoch AI. The plunging price of thought. 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

Engelbart, D. C. Augmenting human intellect: a conceptual framework. 1962. https://www.dougengelbart.org/pubs/augment-3906-Framework.html

Epoch AI. LLM inference price trends. 12 March 2025. https://epoch.ai/data-insights/llm-inference-price-trends

Greydanus, S., Dzamba, M., and Yosinski, J. Hamiltonian neural networks. arXiv:1906.01563.

Ha, D., and Schmidhuber, J. World models. arXiv:1803.10122.

Hafner, D., Pasukonis, J., Ba, J., and Lillicrap, T. Mastering diverse domains through world models. arXiv:2301.04104.

Hestness, J., et al. Deep learning scaling is predictable, empirically. arXiv:1712.00409.

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Hooker, S. The hardware lottery. arXiv:2009.06489. Communications of the ACM, 2021. https://doi.org/10.1145/3467017

Horowitz, M. Computing's energy problem (and what we can do about it). IEEE International Solid-State Circuits Conference, 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Iverson, K. E. Notation as a tool of thought. Communications of the ACM, 1980. https://dl.acm.org/doi/10.1145/358896.358899

Jaynes, E. T. Information theory and statistical mechanics. Physical Review 106, 620, 1957. https://doi.org/10.1103/PhysRev.106.620

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Kay, A. A personal computer for children of all ages. 1972. https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf

Kolmogorov, A. N. Three approaches to the quantitative definition of information. 1965. English: International Journal of Computer Mathematics, 1968. https://doi.org/10.1080/00207166808803030

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models. https://laya-ai.com/system-one-models

LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., and Huang, F. J. A tutorial on energy-based learning. 2006. http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf

LeCun, Y. Path towards autonomous machine intelligence / JEPA discussion. Meta AI blog. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/

Lee, L. Notational intelligence. 2022. https://thesephist.com/posts/notation/

Leung, K., and Pare, P. E. Energy-aware Bayesian control barrier functions. arXiv:2512.24493.

Ma, S., et al. The era of 1-bit LLMs: all large language models are in 1.58 bits. arXiv:2402.17764.

Manek, G., and Kolter, J. Z. Learning stable deep dynamics models. arXiv:2001.06116.

Marcus, G. Deep learning: a critical appraisal. arXiv:1801.00631.

Matuschak, A., and Nielsen, M. How can we develop transformative tools for thought? https://numinous.productions/ttft/

Mead, C. Neuromorphic electronic systems. Proceedings of the IEEE, 1990. https://doi.org/10.1109/5.58356

Petersen, F., et al. Deep differentiable logic gate networks. arXiv:2210.08277.

Roth, F., et al. Stable port-Hamiltonian neural networks. arXiv:2502.02480.

Sanchez, C., et al. A survey of challenges for runtime verification from advanced application domains. arXiv:1811.06740.

Sandberg, A. Energetics of the brain and AI. arXiv:1602.04019.

Shannon, C. E. A mathematical theory of communication. Bell System Technical Journal, 1948. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Solomonoff, R. J. A formal theory of inductive inference, parts I and II. Information and Control, 1964.

SparkFun. Alchitry Pt V2 product page. https://www.sparkfun.com/alchitry-pt-v2.html

Sutton, R. The bitter lesson. 13 March 2019. http://www.incompleteideas.net/IncIdeas/BitterLesson.html

Sutskever, I. An observation on generalization. Simons Institute talk, 2023. https://www.youtube.com/watch?v=AKMuA_TVz3A

TeLLMe family. arXiv:2504.16266.

Umuroglu, Y., et al. LogicNets. arXiv:2004.03021.

Victor, B. Inventing on principle. 2012. https://www.youtube.com/watch?v=PUv66718DII

Victor, B. Media for thinking the unthinkable. https://worrydream.com/MediaForThinkingTheUnthinkable/

Wei, J., et al. T-MAC. arXiv:2407.00088.

Yu, E., Zikelic, D., and Henzinger, T. A. Neural control and certificate repair via runtime monitoring. arXiv:2412.12996.

Related preprints cited for typed decision models: arXiv:2503.23303 and arXiv:2510.01237.

Cortical energy partitioning caveat: arXiv:2102.06273.

Local measurement record: `artifacts/RESULTS.md` in the `wca-lut-edge` software reference. Schema examples: `artifacts/schemas/wca.commit.v1/examples/`. Demo: `artifacts/mcp_gate_demo.json`.

## Appendix A. Reproducibility

Workstation path used to generate the cited logs: the `wca-lut-edge` tree, Rust 1.98 as recorded in `RESULTS.md`. Day-to-day commands:

```text
cargo test -p wca-commit
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph
cargo run --release --bin wca-ph-tighten -- --grid 21 --out artifacts/ph_tighten_report.json
cargo run --release --bin wca-cbf-bakeoff -- --out artifacts/cbf_bakeoff_report.json
cargo run --release --bin wca-lyap-plant -- --out artifacts/lyap_plant_report.json
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-tlmm-scale -- --out artifacts/tlmm_scale_report.json
```

Icarus Verilog was version 12.0 in the environment note in `RESULTS.md`. RTL checks are simulation. Do not read analytical joules as board power.

Repository flag, factual, not a result: `board_synth_claimed=false`.

## Appendix B. Browser FPGA emulator: architecture to build

This appendix describes the Stage B emulator architecture. The shipped instrument lives at https://research.openie.dev/living/fpga-sim/. Seed-1 agreement numbers below are from the WASM run against the Stage A golden.

Modules.

1. `decision_core`. Pure functions already represented by the Rust certificate, plant step, and joule accumulator. No file system and no threads required. Target `wasm32-unknown-unknown`.
2. `lut_image`. The same memory image the Verilog path loads (`artifacts/fpga/wca_allow_lut.mem` and successors). The browser copy must hash-match the file used for the Icarus check.
3. `trace`. A fixed schema: step index, state, `u`, `lut_allow`, `energy_ok`, `cbf_ok`, reason codes, analytical joule increment, plant action. Identical field names to `wca.commit.v1` so a dump can be diffed against the crate's JSON.
4. `webgpu_view`. Device, queue, and a storage buffer for the LUT and the trace. A shader draws allow and refuse. A second dispatch may map the Safe residual across a grid. Buffers are for inspection. They are not a power model.
5. `workstation_oracle`. Icarus remains the RTL oracle. The browser does not replace it. Disagreement between WASM and the Rust binary fails the build. Disagreement between WASM and Icarus on the shared LUT image fails the build. Neither comparison mentions watts.

Acceptance tests, to be run when the target exists.

- Seed-1, 16 steps, init theta 1.5, omega 3.0: committed 1, refused 15, analytical joule 8.6795e-10, matching NI-2.
- Safe grid smoke: false allow 0 on a published subset of the 209,261-decision test, matching NI-3's direction.
- MCP refuse vector: executor call count 0, matching NI-6.
- A unit test that WebGPU buffer readback equals the WASM trace. If readback is unavailable, the page must show that the GPU path did not confirm the trace, and the CPU WASM trace remains the result.

Physical follow-on for board **joules**. Stage C already programmed a closed-loop commit-gate on the Alchitry Pt V2 with UART decision agreement; the board still has no onboard joule meter. A USB inline power meter or a shunt-plus-scope on the 5 V rail, on a stated workload, is what would support a board-measured joule. Vivado / post-PAR estimates are not that meter. Vendor logic-cell and memory figures stay vendor figures. See [/living/fpga-sim/alchitry/#energy](https://research.openie.dev/living/fpga-sim/alchitry/#energy).

Out of scope for the emulator: training DiffLogic in the browser, claiming Artix-7 dynamic power from a shader, and flipping `board_synth_claimed` to true.

## Appendix C. Relation to the companion study

The companion paper, "Satiation and Scarcity after Free AI," uses the same commit record for a different predicate: stop when a stated work or care loop is complete. The shared sentence is compositional. Refuse if the chore is already complete, or if the physical predicate fails. This paper supplies the physical predicate and the measurement classes. It does not estimate a demand curve.
