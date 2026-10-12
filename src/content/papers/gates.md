---
title: "Metered Commit Gates: Energy-to-Correct-Completion for Agentic Systems"
deck: "A gate that lets an agent act only after a check passes, a cascade that tries the cheapest method first, and the energy measurements of both, labeled by how each was obtained."
id: gates
status: "Research paper"
author: "David Charlot, Open Interface Engineering"
figures: "/living/ni/"
pdf: "/pdfs/gates.pdf"
board_metered: true
---

<div id="notational-intelligence-as-commit-law" class="anchor-alias" aria-hidden="true"></div>

# Metered Commit Gates: Energy-to-Correct-Completion for Agentic Systems

*Version 1.2, 11 October 2026. Data and code: [research.openie.dev/data/](/data/#gates). LaTeX PDF: [/pdfs/latex/gates.pdf](/pdfs/latex/gates.pdf) ([source](/pdfs/latex/gates.tex)).*

## 0. Overview

This paper defines a gate that lets a machine act only after a check passes, and a rule that tries the cheapest method first. It reports software results and one board-level energy measurement, each labeled by how it was obtained.

**In plain words**

1. A computer should not take an action that cannot be undone until a simple check says it is safe.
2. It should try the cheapest way to finish a job first and use a big AI model only if nothing cheaper works.
3. Every decision is written down with the energy it used, so anyone can check it later.

This paper has two parts that share one rule: correctness is the gate, and joules are the ranking. Part I is the commit gate. A proposal may not authorize itself. An irreversible act runs only behind a certificate, and every decision, commit or refuse, is written to a receipt. Part II is Mixture of Limits, which is threshold convergence: a task needs a minimal amount of computation to close, and computation spent past that threshold buys no verified progress, so it is waste. Its standard instance is a cascade that tries the cheapest gear first: Lookup, then Formula, then Solver, then Model. The cascade stops as soon as the task completion predicate $C(z)$ holds, and it refuses with a receipt when the next gear would break the budget. Among systems that complete the task correctly, the one that needs fewer joules ranks higher.

One board measurement anchors the gate fabric. On an AMD Kria KV260, the onboard INA260 read SOM-level A/B/A differences of 11,428 pJ per gate cycle (standard error 129 pJ, N = 4) for the WCA gate fabric, and 98.0 pJ per seed cycle (standard error 30.8 pJ, N = 4) for the seed fabric. The INA260 sits on `VCC_SOM`, which feeds the processing system, the programmable logic, DDR memory and the module regulators ([KV260 device tree, `ina260@40`](https://gbmc.googlesource.com/linux/+/ccd1cdca5cd433c8a5dff78b69a79b31d9b77ee1/arch/arm64/boot/dts/xilinx/zynqmp-sck-kv-g-revB.dtso)), so these are whole-module differences, not a core-rail or PL-only figure (Section I.3.7). The seed-fabric difference is about 1 mW at 5 V, near the part's 1.25 mA current resolution, and is reported as inconclusive until a PL-rail meter and at least 10 passes are run.

### 0.1 Contributions

1. A commit envelope: proposal, then certificate, then commit or refuse, then receipt. The certificate is conjunctive: look-up allow AND an energy predicate, optionally AND a control barrier function. Refusal reasons are typed. A Rust software reference implementation, Wise Computer Automation (WCA), runs it (Part I).
2. A typed provenance invariant. Output labeled `ModelGenerated` can never be promoted to `Deterministic` (Parts I and II).
3. A cascade with named refusals, and the condition under which cheapest first is optimal in expected joules, which follows from Simon and Kadane's ordering result for sequential search: try gears in decreasing order of $p_i / c_i$, where $p_i$ is the probability that gear $i$ closes the task and $c_i$ its expected energy in joules (Simon and Kadane, 1975) (Part II).
4. Energy to correct completion as the ranking, defined in Section I.0.2.
5. Receipts as an instrument. Each receipt holds the prediction hash and its timestamp before the act, the outcome, the match, the joules by tier (measured, reported, estimated, never summed) and the refusal reason.

### 0.2 Energy to correct completion

Let $C(z)$ be the task completion predicate, with any deadline written into it. For a system $S$ with policies $\pi$ and an allowed failure rate $\delta$,

$$
J^*(S) = \min_{\pi} \; \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta .
$$

Correctness and deadlines are constraints. Among systems that pass the gate, joules alone order them. Ordering systems by the real number $J^*$ is a total preorder, since any two reals compare. If each reading carries meter error at most $\epsilon$ joules, two systems whose $J^*$ differ by more than $2\epsilon$ keep their order. MLPerf Power gates every power result behind an accuracy target. $J^*$ has the same form.

### 0.3 How to read this paper

Sections in Part I are numbered I.n and sections in Part II are numbered II.n, so Section I.3.7 and §II.8.5 both point inside this paper. Each part has its own reference list. Two figures carry the main ideas: Figure 1 (Section I.1) draws the commit gate, and Figure 2 (Section II.2) draws the floor and the plateau of Mixture of Limits. Prices and demand are not argued here.

<div id="part-i" class="anchor-alias" aria-hidden="true"></div>

## Part I. The commit gate (Notational Intelligence)


<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## I. Abstract

Agents propose actions. Irreversible work begins only when an action is allowed to run. This paper treats that permission step as a formal object. Linus Lee's notational intelligence is the observation that a change in symbols can make some thoughts cheap and others expressible. The claim here is narrower. For machines that can move matter or call an irreversible tool, the useful notation is a runtime law: a proposal may not authorize itself. The software reference, Wise Computer Automation (WCA), records the law as four objects under schema `wca.commit.v1`: a proposal, a certificate, a typed refuse reason, and a commit decision. The certificate used in the reference is conjunctive. A look-up table (LUT) allow bit must hold, and an energy predicate must hold. An optional control barrier function (CBF) may be added. Read-only calls may bypass the gate. Irreversible calls may not.

Energy numbers in this paper are products of operation counts and analytical energy constants (an OpCounter model). They are not board power. Field-programmable gate array (FPGA) behavior has three classes here. Icarus Verilog simulation checks the emitted register-transfer logic. An Alchitry Pt V2 runs the closed-loop gate and agrees with the software on every decision. It has no meter, so its energy is unmetered. An AMD Kria KV260 runs the gate fabric under its onboard INA260 power monitor. Halting and running the same bitstream, interleaved A/B/A, gives a board-level metered difference of 11,428 pJ per gate cycle (standard error 129 pJ, N = 4) for eight parallel evaluations of LUT allow, energy predicate and barrier at 25 MHz. The smaller seed fabric gives 98.0 pJ per seed cycle (standard error 30.8 pJ, N = 4). These are `measured_j` at board level. They are not core-rail readings and not a closed-loop plant joule cost (Section I.3.7). Stage B is available as a browser instrument at https://research.openie.dev/living/fpga-sim/. It compiles the same Rust gate to WebAssembly (WASM) and shows LUT state and commit traces through the WebGPU API. That instrument is an emulation. It is not a device-under-test (DUT) measurement and it is not Alchitry board power.

The measured software results are bounded. On a 16-step pendulum episode with seed 1, the reference commits 1 step and refuses 15. The analytical episode energy is 8.6795e-10 joule. On the reported Safe fixed-point port-Hamiltonian check, false allows against the continuous energy oracle `Vdot <= epsilon` are 0 on the stated grids, and the price is 79 false refuses in 209,261 decisions (Section I.4.3). That is the safety and liveness pair on that test set (Section I.4.10). A Model Context Protocol (MCP) demo refuses an irreversible tool call without invoking the executor. A toy comparison with an energy-set barrier and a discrete shield shows disagreement across safety definitions. None of these results is a claim of silicon energy leadership, of industrial control performance, or of a core-rail measurement.

<div id="notation" class="anchor-alias" aria-hidden="true"></div>

## I. Notation

Terms are defined at first scientific use below and collected here so later sections can use the short form.

| Term | Definition in this paper |
|------|--------------------------|
| Notational intelligence | Lee's claim that better notations can raise what a person or system can reliably do, beyond adding tools alone. |
| Commit gate | A runtime rule that either applies a proposed action or refuses it. The proposer does not get a second, informal channel. |
| Wise Computer Automation (WCA) | The software reference that implements the commit gate at the boundary between a proposal and an irreversible effect. |
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
| Device under test (DUT) | Hardware measured under a stated workload with a stated meter. The KV260 runs of Section I.3.7 are the only DUT measurements in this paper. |
| Field-programmable gate array (FPGA) | Reconfigurable logic. This paper reports Verilog simulation, a programmed Alchitry Pt V2 with unmetered energy, and board-level KV260 meter readings (Section I.3.7). |
| WebAssembly (WASM) | A portable compilation target for the browser. The Stage B WASM FPGA emulator is shipped at https://research.openie.dev/living/fpga-sim/. |
| WebGPU | The browser GPU API named as the display and grid-evaluation path for that emulator. |
| Alchitry Pt V2 | Vendor documentation identifies a Xilinx Artix-7 XC7A100T. FPGA programmed (SRAM-loaded) with the closed-loop commit gate; energy unmetered (Section I.3.7). |
| DiffLogic | Differentiable logic gate networks trained toward Boolean structure (Petersen et al., 2022). |
| Analytical energy estimate | `J = sum_op count_op * E_op` with named constants. Not board power. |
| Modeled | A quantity obtained from a stated formula or fitted structure. |
| Simulated | A quantity obtained by executing the software or Verilog model. |
| Board-measured | A quantity from a meter on a stated device and workload. Only the KV260 readings of NI-9 are in this class. |
| Oracle-safe | Agreement with the continuous energy oracle `Vdot <= epsilon` on the stated plant. |
| Check-safe | The discrete Safe fixed-point / Q16.16 residual that approximates that oracle in the gate. |
| Set-safe | Set-invariance under a barrier or shield predicate (for example an energy-set CBF), which can disagree with oracle-safe. |

<div id="terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### I. Terms used here

This paper already distinguishes three safety predicates. **Oracle-safe** means the continuous `Vdot <= epsilon` oracle. **Check-safe** means the discrete Safe Q16.16 residual that tracks that oracle in the gate. **Set-safe** means set-invariance under a barrier or shield. NI-4 shows check-safe and set-safe can disagree. Software reference, evidence classes, and the board-result flag are on the shared [glossary](/glossary/).

**Analytical constants.** `E_LUT_READ = 1e-12` J and the other OpCounter constants in Section I.3.4 are engineering stand-ins for relative comparison inside this model. They are not calibrated board measurements. Do not read them as silicon joules. The zero-false-allows counts against the named oracle stay as reported.

**Living figures.** Commit stack: [/living/ni/#ni-diag-02](/living/ni/#ni-diag-02). Seed-1 runner: [/living/ni/#ni-run-01](/living/ni/#ni-run-01). Safe false-allow=0: [/living/ni/#ni-run-02](/living/ni/#ni-run-02). Stage B simulator: [/living/fpga-sim/](/living/fpga-sim/).

**Scope of Part I.** Section I.2 places the commit record against notation research, information theory, scaling results, LUT networks, control certificates, and runtime enforcement. Section I.3 defines the objects, the plants, the analytical energy model, the browser instrument, and the boards. Section I.4 reports only quantities produced by the software reference, by the boards, or by a cited external source. Section I.5 answers objections that have published form. Section I.6 states what would falsify the claims and what was not measured.

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>

## I.1. Introduction

A language model can rank actions. Ranking is not permission. The failure mode that matters for a plant, a shell, a payment, or a destructive laboratory step is a commit: the action runs. Soft scores remain useful upstream. They are the wrong type at the irreversible branch, because a probability does not name which predicate failed, and it does not force the actuator command to zero.

Lee (2022) states a prior claim cleanly. Notation is not decoration. A notation that makes an operation executable changes which errors can be written down and which can be hidden. Iverson (1980) made the same point for array languages: notation is a tool of thought. Engelbart (1962) treated language, artifacts, methods, and training as one system. Kay (1972) and Victor (2013; 2012 talk) argued that representations should keep consequences near the idea being edited. Matuschak and Nielsen asked why tools for thought stall as products. That literature is about cognition and media. It does not, by itself, specify a record that a machine must obey before it moves.

The industrial center of recent artificial intelligence is scale. Kaplan et al. (2020) and Hoffmann et al. (2022) report loss scaling with parameters, data, and compute. Hooker (2021) argues that ideas spread when they fit available hardware and kernels. Those results describe how the capability of a proposer grows with the resources spent on it. They do not define a commit predicate.

This paper's contribution is a software reference for that predicate, plus a report of what the reference actually does on toy plants. The contribution is compositional. Boolean LUT shields, energy certificates, ternary table lookup, and tool transports each exist in prior work. The reference wires them as one auditable decision: proposal, then certificate, then typed refuse or commit. The scan recorded in the project state-of-the-art note did not find a published product that ships that exact composition as one boundary. A scan is not a proof of absence. Private systems can exist. The claim is the existence and behavior of this reference, not a global first.

Three measurement statements constrain every later number. First, joules computed by the OpCounter are analytical estimates. Second, Verilog results are simulation. Third, the only board joules are the KV260 board-level differences of Section I.3.7, filed as `measured_j` with the meter named. The board-result flag is true for those KV260 runs alone. The Pt V2 stays unmetered. A reader should be able to tell modeled, simulated, and board-measured apart from the method clause attached to the number.

Figure 1 draws the commit gate.

![Flow diagram: propose, then certify against the predicate and certificate, then either commit an act on the world or refuse with no act. Both outcomes write a receipt with a hash, joules and a reason.](/figures/gates/commit-gate.svg)

*Figure 1. The commit gate. Diagram of propose, certify, commit or refuse, and receipt, as defined in Section I.3. A [PNG copy](/figures/gates/commit-gate.png) is provided.*

## I.2. Related work

<div id="21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>

### I.2.1 Notation and tools for thought

Lee (2022) argues that inventing notations can matter more than inventing additional automated tools, because a notation changes the thoughts that are cheap. The interview record with The Gradient is consistent with that essay and is not an independent empirical result. Iverson (1980), Turing Award lecture, is the classical computer-science statement: notation is a tool of thought, and executability is part of the test. Engelbart (1962) locates intelligence in a human plus artifact system, not in a bare brain. Kay (1972) specifies a personal dynamic medium. Victor's "Media for Thinking the Unthinkable" and "Inventing on Principle" argue that creators need representations whose consequences are visible while the idea is still being formed. Matuschak and Nielsen, "How can we develop transformative tools for thought?", document adoption and institutional failure modes of such tools.

This paper uses that lineage for one limited inference. If a notation is executable, some failures become ordinary data rather than unrepresented accidents. A typed refuse reason is an instance. It does not support the strong Sapir-Whorf claim that language determines thought. The strong claim is rejected in Section I.5. The weak claim, which is Iverson's, is that an executable notation changes the cost of operations and the representability of errors.

Chollet (2019) defines intelligence as skill-acquisition efficiency and grounds the definition in algorithmic information theory. That definition is about learning new skills, not about commit.

<div id="22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### I.2.2 Information, description length, and physical cost

Shannon (1948) defines entropy and channel capacity. Shannon (1959) defines rate-distortion: how much description is required for a stated fidelity. Kolmogorov (1965) defines description length by program size. Solomonoff (1964) defines inductive inference by a mixture over programs. Chaitin (1977) develops program-size complexity. Cover and Thomas (2006) is the textbook spine. Jaynes (1957) uses maximum entropy as a rule for distributions under constraints. Brillouin (1956) connects information to physical negentropy in the Maxwell-demon line.

Cross-entropy training of a language model is an information-theoretic objective on a data distribution. Sutskever's 2023 Simons Institute talk, which is a talk and not a paper, discusses unsupervised learning as compression. That fact does not yield a Kolmogorov certificate for a particular string, and it does not yield a commit bit. The distinction is the one drawn in the project citation spine: statistical compression of a training measure is not the same object as a runtime allow set under a plant constraint.

Landauer (1961) proves a lower bound: logically irreversible erasure dissipates at least `kT ln 2` per bit in the ideal model. Bennett (1973) shows that logically reversible computation can avoid that erasure cost in the limit. Horowitz (2014) reports practical CMOS energy at picojoule scales for operations and memory movement, far above the Landauer bound, and treats energy rather than transistor count as the constraint. Mead (1990) is the neuromorphic argument for analog efficiency. Sandberg (2016) warns that a brain power near 20 watt does not bound the energy of an engineered system trained from scratch. A cortical partitioning preprint (arXiv:2102.06273) further warns against treating all of that biological power as comparable compute. This paper uses Landauer and Horowitz as bounds and practice tables. It does not claim that any model in the reference operates near `kT ln 2`.

<div id="23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>

<div id="i23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>

### I.2.3 Scale and hardware fit

Hestness et al. (2017), Kaplan et al. (2020), and Hoffmann et al. (2022) document empirical scaling of deep learning loss. Amodei and Hernandez (2018), an OpenAI blog post, describe rapid growth in training compute for landmark results. The page is a vendor essay. This paper does not depend on a specific doubling time from it. Sutton (2019) argues that general methods which use computation have beaten systems that encode the contents of human knowledge as fixed features. The essay is not an argument against every constraint. A commit predicate is a constraint on action, not a hand-built chess feature. Hooker (2021) explains why alternatives lose when the installed base of chips and libraries rewards dense matrix multiplication.

This paper ranks by joules to correct completion and separates proposal cost from permission. A price is not a term in either.

<div id="24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>

### I.2.4 LUT networks, ternary lookup, and differentiable logic

Umuroglu et al. (2020) map sparse low-bit networks to FPGA truth tables (LogicNets). Petersen et al. (2022) train networks of logic gates with differentiable relaxations (DiffLogic). Bacellar et al. (2024) train weightless networks of LUTs (differentiable weightless neural networks). Ma et al. (2024) study ternary-weight language models (BitNet b1.58). Wei et al. (2024) implement low-bit matrix multiplication by table lookup on CPUs (T-MAC). The TeLLMe line (arXiv:2504.16266) is a ternary LUT matrix-multiplication design aimed at FPGA execution. Those systems show that tables and gates are a real compute substrate. They do not, in the papers cited, attach a port-Hamiltonian energy veto and a typed commit envelope to a tool executor.

The reference uses DiffLogic as a thin allow table on toy features, and TLMM as a proposal path. That is a different job from using a logic network as the whole classifier, which is the usual DiffLogic evaluation (vision benchmarks, large gate counts). Section I.6 records the capacity gap.

<div id="25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>

### I.2.5 Certificates, shields, and runtime monitoring

Ames et al. (2019) survey control barrier functions as set-invariance certificates, typically enforced by a filter or a quadratic program. Alshiekh et al. (2018 preprint arXiv:1708.08611) introduce shields that replace unsafe actions with safe ones, minimally when possible. Dawson, Gao, and Fan (2022) survey learned Lyapunov and barrier certificates and the failure modes of treating a neural network as a certificate without a check. Manek and Kolter (2020) learn stable dynamics with a Lyapunov structure. Greydanus, Dzamba, and Yosinski (2019) learn Hamiltonian neural networks. Roth et al. (2025) study stable port-Hamiltonian neural networks. Yu, Zikelic, and Henzinger (2024) repair neural certificates using runtime monitors. Leung and Paré (arXiv:2512.24493) give Bayesian safety guarantees for port-Hamiltonian systems with learned energy functions. Their energy is the plant's physical Hamiltonian. It is not the energy of computation. The Safe path of this reference uses energy in that same physical sense. The joules of computation are a separate account (Section I.3.4). Sanchez et al. (2018) survey runtime-verification taxonomies.

**The gate is a Simplex.** Sha's Simplex architecture runs an unverified high-performance controller beside a verified safety controller, and a decision module hands control to the safety controller before the plant leaves the region it can recover from (Sha 2001). "A proposal may not authorize itself" is that rule, carried from control loops to tool calls and actuators. Runtime assurance is its name in avionics and robotics. Three older results fix the rest of the shape. Saltzer and Schroeder named complete mediation: every access is checked against authority, every time (1975). A reference monitor is the mechanism that does the checking. Gray's two-phase commit separates prepare from commit, so no participant commits alone (1978). Necula's proof-carrying code ships a proof that the host checks before untrusted code runs (1997). The commit record here is a reference monitor in front of irreversible effects, with a Simplex switch to refusal and a certificate the host checks, as in proof-carrying code. What the reference adds to that lineage is one conjunct and one ledger: an energy predicate inside the certificate, and joules on the same record as the decision.

The reference does not replace that mathematics. The Safe path is a conservative fixed-point test of a known energy identity on a pendulum, `V = (1/2)(g theta^2 + omega^2)` with `Vdot = omega * u`. The CBF used in the toy bake-off is an energy-set inequality on the same `V`, not a claim to have solved the Ames quadratic program on a manipulator. Learned Lyapunov structure on a cart-pole is a second toy, reported in Section I.4, and is not a region-of-attraction theorem for arbitrary plants.

<div id="26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>

### I.2.6 World models, typed decisions, and tool transport

Ha and Schmidhuber (2018) and Hafner et al. (DreamerV3, arXiv:2301.04104) show that learned models can propose actions from imagined trajectories. LeCun's JEPA essays (Meta research blog) argue for predictive world models. LeCun et al. (2006) is the earlier energy-based learning tutorial. Prediction error is not identically zero in these systems. A predictor can sit upstream of a gate. It cannot replace the gate unless its predictions are perfect and the plant model is the plant. This paper does not compete with those systems on prediction benchmarks.

System One models return a typed answer and a probability for each allowed option in one forward pass, with no free-form text. TypeSafe AI named the category with its hosted Jev model (15 September 2026). Open models followed, among them Laya from Convai Innovations, an encoder with decision heads. They collapse generation cost when the option set is typed and known. Anthropic's Model Context Protocol announcement specifies discovery and transport for tools. Transport delivers a call. It does not evaluate `Vdot`. The reference's MCP adapter is a beachhead: irreversible tools require a certificate before the executor runs. That is an engineering claim about this adapter, tested by the demo in Section I.4, not a claim about every MCP server in production.

<div id="27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>

### I.2.7 What the composition adds

Shields refuse unsafe actions but are not, in the cited papers, exported as the reference's four-field commit record with an analytical joule account. DiffLogic and LUT networks compute functions. They are not, in those papers, a veto in front of a separate proposer and a tool executor. Energy-aware barrier filters are continuous. The reference's allow bit is a table. The compositional claim is the wiring: LUT allow and energy predicate and optional barrier, recorded with a typed reason, applied before an irreversible effect, with analytical energy kept distinct from board power. Section I.4 states which parts of that wiring were executed.

<div id="28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>

<div id="i28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>

### I.2.8 Certify / commit peers (2025 to 2026)

Peer systems now enforce a decision **before** an irreversible tool runs. That strengthens the commit-gate thesis; it does not duplicate this reference's record.

Shi et al., **Progent** (arXiv:[2504.11703](https://arxiv.org/abs/2504.11703)), check every tool call against symbolic least-privilege rules and use an SMT solver so privilege can only narrow without approval (monotonic confinement). Chen, Kang, and Li, **ShieldAgent** (ICML 2025; [proceedings.mlr.press/v267/chen25ae.html](https://proceedings.mlr.press/v267/chen25ae.html)), enforce verifiable safety-policy circuits over agent action trajectories before shielding. Yu, Žikelić, and Henzinger (AAAI 2025; [doi:10.1609/aaai.v39i25.34840](https://doi.org/10.1609/aaai.v39i25.34840)) repair neural certificates via runtime monitoring. A companion line verifies ReLU control-barrier certificates online over a lookahead region (arXiv:[2507.11987](https://arxiv.org/abs/2507.11987)).

**What Part I adds.** Those peers are policy, shield, or certificate-repair objects. This reference ships a four-field commit envelope (`proposal` → `certificate` → `commit|refuse` → receipt) with a conjunctive LUT allow bit and an energy predicate, typed refuse reasons, and analytical joules kept distinct from board power. Transport (MCP) remains proposal. Board joules exist only for the KV260 runs in Section I.3.7, at board level.

### I.2.9 Runtime enforcement

The gate is a security automaton. Schneider showed that execution monitors enforce exactly the safety properties [Schneider 2000](https://doi.org/10.1145/353323.353382), and Ligatti, Bauer and Walker extended the monitor to edit automata that suppress or insert actions [Ligatti et al. 2005](https://doi.org/10.1007/s10207-004-0046-8). Falcone set out when to enforce rather than verify [Falcone 2010](https://doi.org/10.1007/978-3-642-16612-9_9), and Bauer, Leucker and Schallhart gave runtime verdicts three values [Bauer et al. 2011](https://doi.org/10.1145/2000799.2000800), which map onto allow, refuse and `settle_refuse`. What this paper adds to that line is the energy predicate in the certificate and the receipt. Agent guards of 2024 to 2026 have the same shape, a check between a proposed tool call and its effect: GuardAgent [arXiv:2406.09187](https://arxiv.org/abs/2406.09187) and AgentSpec [arXiv:2503.18666](https://arxiv.org/abs/2503.18666). PolicyGuide argues that a check on each action cannot steer a multi-step workflow [arXiv:2608.19861](https://arxiv.org/abs/2608.19861); that is why Part II puts the stop on the task predicate $C(z)$ rather than on the single act. Multi-step irreversible work also needs compensation, which sagas supply [Garcia-Molina and Salem 1987](https://doi.org/10.1145/38713.38742), and "a proposal may not authorize itself" is the reference-monitor principle that capability kernels such as seL4 enforce by proof [Klein et al. 2009](https://doi.org/10.1145/1629575.1629596). The 0-false-allow scan of Section I.4 is a test over a grid, not a proof; Section I.6 states that limit, and it applies to every summary of the result.

### I.2.10 Reference points for the board figure

An FPGA implementation of a function is expected to cost more energy than an ASIC; Kuon and Rose measured the dynamic power gap [Kuon and Rose 2007](https://doi.org/10.1109/TCAD.2006.884574), and Horowitz gives the CMOS energy per operation that frames such figures [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323). A vendor power estimate for the same bitstream beside the SOM reading is part of the PL-rail protocol.

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## I.3. Definitions and methods

<div id="31-objects" class="anchor-alias" aria-hidden="true"></div>

### I.3.1 Objects

Fix a state `x` and a candidate action `u` in a set `U`. A proposal is a tuple

```text
Proposal = (u, x, hints)
```

`hints` may include analytical energy quantities. A proposal has no interpretation as permission.

A certificate is a tuple

```text
Certificate = (lut_allow, energy_ok, cbf_ok, reasons, metrics)
```

`lut_allow` and `energy_ok` are Booleans. `cbf_ok` is a Boolean when the selected compose mode requires it, and is absent otherwise. `reasons` is a list of refuse reasons. `metrics` includes the analytical energy account and the board-result flag.

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

Worked record. File `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` stores a refuse in which `lut_allow` is true and `energy_ok` is false. The reason code is `energy_veto`. The fixed-point detail string is `Vdot_q=1461 > eps_q=13`. `plant_action` is `[0.0]`. The record sets the board-result flag to false. One true conjunct does not commit. That is the content of the conjunction, not a slogan.

<div id="32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>

### I.3.2 Plants and oracles

The primary plant is a pendulum. Continuous reference quantities used by the Safe check are `g = 9.81`, `epsilon = 0.05`, `V = (1/2)(g theta^2 + omega^2)`, and `Vdot = omega * u`. `energy_ok` in the continuous oracle means `Vdot <= epsilon`.

The legacy discrete check is a Q8.8 fixed-point approximation, bit-matched to the Verilog module `wca_ph_energy.v` in simulation. The Safe check (`SafeFixedPointPHCertificate`) uses Q16.16 and an exact integer residual. The reported predicate is

```text
energy_ok <=> 4*omega_q*u_q + 2*(abs(omega_q)+abs(u_q)) + 1
              <= floor(4*epsilon*S^2)
```

with the rounding argument given in `artifacts/RESULTS.md`: under round-to-nearest with error at most half a least significant bit, `Vdot` is bounded by `(prod + (1/2) abs + 1/4) / S^2`. The design goal is one-sided. If the Safe predicate allows, the continuous oracle allows. The converse is not required. Extra refuses are a measured cost, not a contradiction of the safety direction.

A second plant, cart-pole, is used only in the learned-Lyapunov simulation. State is `[x, xdot, theta, thetadot]`, with `g = 9.81`, cart mass 1.0, pole mass 0.1, length 0.5. `V` is a quadratic form `xi^T P xi / 2` with `P` positive definite by a Cholesky construction plus a multiple of the identity. The fit is stochastic gradient on a hinge of `Vdot + alpha V` under a linear policy, seed 42, 400 iterations, batch 32, `alpha = 0.15`, as recorded in `RESULTS.md`. The continuous gate is `Vdot <= 0.05`. The Safe discrete rule adds a Lipschitz margin times half a least significant bit. This is a simulation of one fitted quadratic on one box. It is not a proof for other plants.

<div id="33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>

### I.3.3 LUT allow and proposal path

The allow LUT in the reported episodes is a DiffLogic export with mask `21887` on four features: absolute theta, absolute omega, absolute `u`, and an energy bit, unless a section says otherwise. TLMM is a grouped ternary table lookup used as a proposer. Iso-correctness means agreement with a naive ternary matrix product within absolute tolerance 1e-12, which `RESULTS.md` records as measured in software. Scale behavior is whatever `wca-tlmm-scale` writes under a stated analytical forward budget. The default budget discussed in results is 2e-10 joule per forward, analytical, not electrical.

<div id="34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>

### I.3.4 Analytical energy model

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

`J = sum count_op * E_op`. These constants are engineering stand-ins, not measurements. Structure counters such as shared BRAM hits are reported and are not charged unless they change a counted read. Changing a constant rescales every analytical joule in lockstep. That is why the numbers cannot be compared to a vendor's tokens per joule, to MLPerf Tiny energy, or to a rail measurement. They can be compared across modes inside the same model.

Utility in the internal tables is commit count. Commit count is not a task reward. A policy that commits more can score higher utility per joule while violating the energy oracle. Section I.4 therefore does not treat utility per joule as a safety metric.

<div id="35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>

### I.3.5 Tool adapter

`wca-mcp-gate` classifies tools. Read-only tools may execute without a commit record. Unknown tools are treated as irreversible. Irreversible tools require a certificate under the configured compose mode, default `lut_and_safe_and_cbf` in `artifacts/mcp_gate_demo.json`. On refuse, `executed` is false and `executor_calls` is 0. The demo executor records calls and does not perform host input or output. The method string in the demo file is `rust_mcp_commit_gate_v1`.

<div id="36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>

### I.3.6 Simulation of Verilog

The repository emits Verilog and memory images for the allow LUT and the commit gate (`artifacts/fpga/`). `wca-rtl-verify` and Icarus Verilog check bit-exact behavior of those models against the software oracle. Icarus executes a simulation. It does not place, route, or measure a chip. Vivado reports enter only for the KV260 runs of Section I.3.7, as utilization and timing closure. Vivado power estimates are not results.

<div id="37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>

### I.3.7 Browser instrument and boards

The completeness path for replication has three stages. Stages A and B exist. Stage C has two boards: one for decision agreement and one for joules.

Stage A, present. Rust binaries in `wca-commit` run the episode, the Safe check, the tool demo, and the analytical joule account. Icarus simulates emitted Verilog on a workstation.

Stage B, shipped. The pure decision core (proposal in, certificate out, plant step, analytical joule update) compiles to `wasm32` (`crates/wca-fpga-sim`). A static page at https://research.openie.dev/living/fpga-sim/ loads the module. WebGPU holds the LUT words and a trace buffer of `(step, lut_allow, energy_ok, cbf_ok, decision)` for display. WebGPU timestamps are not joules. On seed-1 (16 steps, theta 1.5, omega 3.0) the WASM episode reports committed 1, refused 15, analytical joule 8.6795e-10, matching Stage A. The WASM module is an emulation of the same functions the Rust crate runs. It is not a cycle-accurate model of an Artix-7, not a switching-activity power model, and not a substitute for Icarus on the Verilog. Stage B does not claim an Alchitry Pt V2 DUT.

Stage C, board programmed, energy unmetered. An Alchitry Pt V2 was detected and loaded (SRAM) with a closed-loop WCA commit-gate bitstream: on-fabric seed-1 pendulum plant dynamics, TLMM proposal, allow LUT, Safe Q16.16 port-Hamiltonian residual, and Ames-style energy-set control barrier function (CBF) residual. Fabric commit is `lut_allow ∧ energy_ok ∧ cbf_ok`. UART at 115200 8N1 agreed with the software composite golden on allow/refuse/commit (1 commit, 15 refuses, sole commit at step 6). On that seed-1 closed-loop episode the CBF conjunct did not change the allow/refuse trace versus LUT and Safe PH alone (the sole PH commit has u=0, so the CBF Lie check holds). **Closed-loop** here means plant state evolves from gate commits and refuses on the fabric; it is not a streamed stimulus ROM of plant/proposal state. The Pt V2 has **no onboard joule meter**. No USB inline meter or shunt was attached. Vivado / post-PAR power estimates are not DUT readings. SparkFun's product page names FPGA XC7A100T-2FGG84I and lists 101,440 logic cells, 240 DSP48E1 slices, 4,860 Kb of block RAM, and 256 MB of DDR3L (https://www.sparkfun.com/alchitry-pt-v2.html); those remain vendor specifications. Builder metering methods: [/living/fpga-sim/alchitry/#energy](https://research.openie.dev/living/fpga-sim/alchitry/#energy).

Stage C, board metered. An AMD Kria KV260 carries an onboard INA260 power monitor (`ina260_u14`). Three rungs ran on 30 September 2026, each as interleaved A/B/A passes with N = 4, settle 15 s and sampling 25 s at about 4 Hz. Rung 1 compares a free-running seed fabric (439 LUTs) to the board's baseline bitstream. It gives watts only, with no operation count, so it gives no joules per operation. Rung 2 halts and runs one seed bitstream (975 LUTs) at about 100 MHz under an on-device operation counter. The difference is +0.0098 W (standard error 0.0031 W), which is 98.0 pJ per seed cycle (standard error 30.8 pJ). Rung 3 halts and runs the gate bitstream: eight lanes, each the conjunction of the allow LUT, the Safe Q16.16 energy residual and the barrier residual, in 6,370 LUTs and 128 DSP slices, timing closed at 25 MHz. The difference is +0.2857 W (standard error 0.0032 W). At 2.4999 × 10⁷ gate cycles per second that is 11,428 pJ per gate cycle (standard error 129 pJ), about 1.43 nJ per lane decision. The A2 minus A1 drift was +0.0047 W (standard error 0.0040 W). The bitstream hashes and logs are in the `wca-kv260-meter` artifact of the reference.

What the meter can and cannot see. The INA260 specifies a maximum offset of 5 mA and a maximum system gain error of 0.15%, with a current step of 1.25 mA (TI INA260 datasheet). The offset is common to A and B on the same board and rail, so the halt-versus-run difference cancels it. Gain error scales the difference by at most 0.15%. The meter senses board power, so the difference includes clock tree and routing switched by the enable, not the gate logic alone. Rung 2's difference is about three standard errors from zero. Rung 3's is about ninety. The next protocol is fixed: read the core rail (VCCINT) through the module's regulator telemetry or a source-measure unit; at least 30 randomized interleaved A/B pairs; at least 10⁹ gate evaluations per block; die temperature logged with an idle baseline before each block; gross and subtracted values both reported; the Vivado power estimate reported beside the reading with the discrepancy. Rung 3 is not a closed-loop plant joule cost, and the analytical constants of Section I.3.4 are not calibrated by it.

The scientific reason for stage B is replication and inspection, not a new physical claim. A reader with a browser steps the same seed-1 episode and reads the same allow bit and reason codes that the crate prints. Agreement with stage A is the acceptance test for stage B, and it passes on seed 1. Agreement of decisions is the acceptance test for the Pt V2, and it passes on seed 1. A meter reading on a stated workload is the acceptance test for the KV260, and rungs 2 and 3 meet it at board level.

<div id="38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>

### I.3.8 What is not a method of this paper

No human-subject study. No claim about linguistic relativity beyond the rejection in Section I.5. No training-compute extrapolation. No identification of economic satiation. No optimization against Groq, Etched, or Taalas throughput. No world-model benchmark.

<div id="4-results" class="anchor-alias" aria-hidden="true"></div>

## I.4. Results

All quantities in this section are simulated in the software reference unless a sentence cites an external paper. Analytical joules use Section I.3.4. Only NI-9 is board-measured.

<div id="41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>

### I.4.1 Claim NI-1. The commit record exists as a schema and a Rust type

Schemas `Proposal`, `Certificate`, `RefuseReason`, and `CommitDecision` are in `artifacts/schemas/wca.commit.v1/`. Rust types are in `crates/wca-commit/src/schema.rs`. Round-trip tests are `cargo test -p wca-commit`. This is an existence result about the reference, version `wca.commit.v1`. It is not a uniqueness theorem.

<div id="42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>

### I.4.2 Claim NI-2. Seed-1 pendulum episode

Command, from `RESULTS.md`:

```text
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Reported outcome: committed = 1, refused = 15, analytical episode energy = 8.6795e-10 joule. The same committed and refused counts and the same analytical energy are reported for `--safe-ph` on that seed. `RESULTS.md` states that the single commit is step 6. Toolchain note in that file: Rust 1.98. Re-running the binary is the reproduction. The energy is not a measurement of a chip.

<div id="43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>

### I.4.3 Claim NI-3. False allows of the Safe energy check

`wca-ph-tighten` compares discrete decisions to the continuous oracle `Vdot <= epsilon`. On a 21 cubed grid plus 200,000 near-threshold Monte Carlo samples (209,261 decisions):

| Path | False allow | False refuse | Both allow | Both refuse |
|------|-------------|--------------|------------|-------------|
| Legacy Q8.8 | 30836 | 105 | 104711 | 73609 |
| Safe v1 (Q8.8 over-approximation) | 0 | 42430 | 62386 | 104445 |
| Safe v2 (Q16.16 residual) | 0 | 79 | 104737 | 104445 |

`RESULTS.md` also states that a denser 41 cubed grid plus 50,000 Monte Carlo samples, checked in `cargo test`, asserts false allow equal to 0. Safe v2 cuts false refuses from 42,430 to 79 relative to Safe v1 while keeping false allows at 0. Legacy Q8.8 is not safe on this definition: it records 30,836 false allows. These counts are properties of the numerical test, not of a physical pendulum.

<div id="44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>

### I.4.4 Claim NI-4. Toy barrier comparison, neither definition dominates

`wca-cbf-bakeoff` runs seeds 0 through 4, 40 steps, time step 0.05, action scale 2.5, shared demo TLMM and DiffLogic mask `21887`. The energy-set barrier uses `h = 18 - V` and allows when `h >= 0` and `omega * u <= kappa * h` with `kappa = 0.05`. The discrete shield allows a step that stays inside absolute theta at most 2 and absolute omega at most 4. Closed-loop means differ because trajectories diverge. The file reports per-episode means for commits and sums for violation counts. Selected rows:

| Filter | Commit | Refuse | Analytical J | False allow vs PH | `h < 0` | `Vdot > epsilon` |
|--------|--------|--------|--------------|-------------------|---------|------------------|
| `lut_and_safe_ph` | 1 | 38 | 2.153e-09 | 0 | 4 | 0 |
| `cbf_energy_set` | 1 | 38 | 2.056e-09 | 3 | 0 | 3 |
| `shield_discrete` | 18 | 21 | 2.306e-09 | 90 | 38 | 90 |
| `lut_only` | 40 | 0 | 2.544e-09 | 194 | 220 | 194 |

On this plant and this oracle, `lut_and_safe_ph` has zero `Vdot` violations and four `h < 0` events. The energy-set barrier has zero `h < 0` events and three `Vdot` violations. The shield commits more and violates the energy oracle often. `lut_only` matches `always_allow` on violations in the reported table. Offline agreement on a shared always-allow stream of 200 steps gives 4 disagreements between `lut_and_safe_ph` and `cbf_energy_set`, and 70 against the shield.

Interpretation inside the test: passivity and set invariance are different predicates. The LUT-and-energy gate is not equivalent to an Ames filter, and it does not win every column. A full quadratic-program baseline on a richer plant is not in this table. That comparison remains open. The result that is available is the disagreement, which is evidence against collapsing the two certificates into one word.

<div id="45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>

### I.4.5 Claim NI-5. Cart-pole Safe Lyapunov simulation

On the audit described in Section I.3.2 (grid n = 7 plus 20,000 boundary samples inside the Lipschitz box, 26,487 decisions), Safe learned Lyapunov versus the continuous `Vdot` oracle records false allow 0, false refuse 3, both allow 15,925, both refuse 10,559. Closed-loop means over five seeds: `lut_and_safe_lyap` commits 11, refuses 28, analytical J 2.719e-09, and records zero false allows against that oracle. The level-set barrier on the same `V` commits 14 and records 15 energy-oracle violations. The discrete shield commits 29 and records 95. Same pattern as the pendulum: the Safe conjunct tracks its own oracle; a different certificate tracks a different one; permissiveness without the oracle is not safety.

This is one additional simulated plant. It does not establish the commit gate on industrial dynamics.

<div id="46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>

### I.4.6 Claim NI-6. MCP demo

`artifacts/mcp_gate_demo.json` records four cases. The board-result flag in the file is false.

| Case | Class | Executed | Executor calls | Commit |
|------|-------|----------|----------------|--------|
| `read_only_bypass` | read-only | true | (no commit record) | absent |
| `irreversible_refuse` | irreversible | false | 0 | false |
| `irreversible_allow` | irreversible | true | 1 | true |
| `shell_exec_gated` | irreversible | true | (gated) | true |

The refuse case lists `energy_veto` (`vdot` 6.0 against `eps` 0.05) and `cbf_veto`. Plant action on that case is `[0.0]`. The allow case uses compose `lut_and_safe_and_cbf` and plant action `[-0.02]`. The note in the file states that refuse never executes. This is a demo of the adapter, not a field study of computer-use agents.

<div id="47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>

### I.4.7 Claim NI-7. TLMM under an analytical budget

`RESULTS.md` reports a demo 2 by 4, group 2 configuration near 4.24e-11 analytical joule, under the forward budget. The largest configurations that remain under the 2e-10 forward budget stop at 64 parameters. Widths 8 by 16 and above exceed that budget even after the optimizer. Iso-correctness against naive ternary arithmetic is a software comparison at tolerance 1e-12. These statements do not say that the design matches TeLLMe throughput or any board energy.

<div id="48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>

### I.4.8 Claim NI-8. DiffLogic allow versus an energy teacher, toy only

On the hard multi-seed gate benchmark in `RESULTS.md`, after threshold calibration and denser labels, DiffLogic matches the energy teacher on refuse rate 50.0 plus or minus 15.9 percent, precision at threshold 0.890 plus or minus 0.067, and recall 0.802 plus or minus 0.076. A bitmask reference refuses more (71.0 plus or minus 14.9 percent) and recalls less (0.454 plus or minus 0.266). Before calibration, DiffLogic refuse rate was 57.5 plus or minus 14.1 percent with recall 0.724 plus or minus 0.163. The match is on this toy labeling setup. It is not an ImageNet or control-suite result. Internal utility per joule rises for the calibrated gate (3.570e9 versus 3.212e9 before) under the analytical model. As Section I.3.4 states, that ratio uses commit count as utility.

<div id="49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>

### I.4.9 Claim NI-9. Board-level joules of the gate fabric

| Rung | Fabric | Clock | Difference (W) | Operation | Joules per operation | Label |
|---|---|---|---|---|---|---|
| 1 | Seed freerun vs board baseline | n/a | −0.8212 (SE 0.0024) | none | none | `measured_j`, watts only |
| 2 | Seed, halt vs run | about 100 MHz | +0.0098 (SE 0.0031) | one seed cycle | 98.0 pJ (SE 30.8) | `measured_j`, INA260, SOM rail (`VCC_SOM`) |
| 3 | Gate, 8 lanes, halt vs run | 25 MHz | +0.2857 (SE 0.0032) | one gate cycle, 8 decisions | 11,428 pJ (SE 129) | `measured_j`, INA260, SOM rail (`VCC_SOM`) |

N = 4 interleaved A/B/A passes per rung. Rung 1's negative sign means the seed bitstream draws less than the board's baseline bitstream. It does not mean the seed is free. Section I.3.7 gives the limits of a board-level reading.

<div id="410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>

### I.4.10 Safety and liveness

Zero false allows is safety. A gate that refuses everything is also safe, and useless. Liveness is the other axis: false refuses, and the share of tasks the gated agent completes. NI-3 reports both on the Safe grid. Safe v2 cuts false refuses from 42,430 to 79 at zero false allows. The seed-1 episode commits 1 step of 16, and that count alone does not say whether the plant reached its goal. The required report is a frontier per plant: task completion rate against false-allow rate, one point per compose mode of NI-4 (`lut_only`, `shield_discrete`, `cbf_energy_set`, `lut_and_safe_ph`), each point with its seeds and spread. On agent workloads the same frontier uses an attack suite for false allows and a benign task suite for completion. A gate is judged on the frontier, not on one axis.

<div id="411-what-the-scan-supports" class="anchor-alias" aria-hidden="true"></div>

### I.4.11 What the scan supports

The state-of-the-art note dated with the September 2026 scans records no published system found that composes a learned Boolean allow LUT, a port-Hamiltonian or Lyapunov energy predicate, and a ternary LUT proposal as one commit boundary with bit-exact RTL simulation and an analytical joule account. Nearest neighbors are named there: shields, energy-aware barrier filters, logic networks as the whole model, and TLMM designs without an energy certificate. The scan supports a gap statement about the literature that was searched. It does not support a priority claim over unpublished work, and it does not support an energy-leadership claim.

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>

## I.5. Discussion

<div id="51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>

### I.5.1 Scale does not answer the commit question

Kaplan, Hoffmann, Hooker, and Sutton describe how loss and proposal capability scale. A larger proposer can still emit an action that fails `Vdot <= epsilon`. Putting that proposer behind the certificate uses scale where the evidence says scale works, and uses the predicate where scale is silent. The Bitter Lesson objects to frozen human features that block learning. It does not entail deleting a safety predicate. If a future result shows that an unconstrained policy meets the same false-allow test at lower analytical cost and equal task error, NI-3's engineering preference for the gate would be weakened on that plant. The logical distinction between proposal and permission would remain.

<div id="52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>

### I.5.2 Natural language and MCP are transport and proposal

MCP solves discovery and call shape. System One solves some decisions without free-form generation. Neither object is `energy_ok`. The demo in NI-6 shows a refuse that does not call the executor. A production deployment could bypass the adapter. The claim is not that the protocol makes bypass impossible. The claim is that permission has to be a separate record if irreversible effects are to be auditable.

<div id="53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>

### I.5.3 Strong linguistic determinism is not the claim

The strong hypothesis that language determines thought is not a premise. The operational statement is local. In this schema, a commit without a passing certificate is not a successful record. An untyped confidence string can be stored beside a success flag and still leave the reason unstated. The enum removes that particular ambiguity. It does not describe human cognition.

<div id="54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>

### I.5.4 Formalism can be wasteful; this predicate is small

Requiring a proof of the whole agent at every step would dominate the budget. The reference formalizes one boundary. Read-only calls bypass. The Safe residual is a fixed-point inequality, not a general SMT query. NI-2's analytical episode energy is 8.6795e-10 joule under the stated constants. It cannot be stated as a fraction of a generative model's board energy, because that comparison was not measured. A split between proposal joules and gate joules on a real agent workload is not in the results. Until it is, the cost objection is answered for this toy gate and remains open for large certificates.

<div id="55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>

### I.5.5 A wrong model with a green light is a real failure

If `V` is not the plant's energy, `energy_ok` can be true while the plant is not safe. The mitigation present in the reference is a continuous twin on the toys, a separated reason code, and a refusal to treat a probability as a certificate. The mitigation not present is disturbance Input-to-State Stability, a verified region of attraction, or a Bayesian credibility budget of the kind Leung and Paré study. NI-4 is the evidence that two respectable certificates disagree. That disagreement is a reason to name the predicate, not a reason to trust either one outside its test.

<div id="56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>

### I.5.6 Prior certificate theory is not duplicated here

Ames, Alshiekh, Dawson, and the runtime-monitoring papers already define filters and monitors. NI-1's addition is the product record and the composition with a LUT export and a tool executor in one reference. Where the toy barrier wins on set invariance, the paper says so (NI-4, NI-5). Composition is `cbf_ok` as another conjunct when that predicate is the one required. It is not a claim that the LUT computes the Ames quadratic program.

<div id="57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>

### I.5.7 Predictors and specialized inference chips

World models reduce some prediction error and leave a residual. Specialized inference devices change the cost of proposals. Vendor throughput figures are vendor reports until an independent meter repeats them. The gate's job is the irreversible branch. If a device's only interface is a token stream, the commit record still has to live somewhere before actuators or irreversible tools run.

<div id="58-analytical-joules-are-not-a-costume-for-watts" class="anchor-alias" aria-hidden="true"></div>

### I.5.8 Analytical joules are not a costume for watts

The constants in Section I.3.4 are chosen engineering numbers. They make counts comparable inside the repo. They are not calibrated to an Artix-7 rail. Selling them as board watts would be a false measurement report. The correct report is the one given: operation counts are computed; analytical joules are modeled; board joules come only from the KV260 meter and are filed apart. Stage B of Section I.3.7 makes the same model inspectable in a browser at https://research.openie.dev/living/fpga-sim/. It does not change the measurement class. The KV260 rungs do, for the fabric they ran.

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## I.6. Limits and threats to validity

Internal validity. Seed-1 is one initial condition. The Safe grid is large but still a chosen box and a chosen epsilon. Monte Carlo samples near the threshold stress the boundary the designers chose to stress. A different epsilon or a different plant identity breaks the numerical claim until re-run. The CBF in the bake-off is an energy-set inequality implemented in the same crate, not an independently coded solver from an Ames reference implementation. Disagreement is informative. Absolute ranking against the literature's code is not established.

Construct validity. Commit count as utility does not measure task success. False allow is defined against a named oracle. A system can be oracle-safe and check-safe (zero false allows against `Vdot <= epsilon`) and still fail set-safe (`h >= 0`), which NI-4 shows. Readers who treat "safe" as one word will misread the table.

External validity. Both plants are toys. There is no manipulator, quadrotor, or human-in-the-loop trial. The MCP demo does not call a network. Verilog is simulated. The browser instrument is shipped as Stage B simulation. The Alchitry Pt V2 agrees on decisions and is unmetered. The KV260 reading is board level and open loop. Vendor logic-cell counts are not confirmed here.

Measurement validity. Analytical constants can be edited to any scale. Comparisons to Horowitz's picojoule tables, to Landauer's bound, or to vendor tokens per joule are not valid with these constants. The KV260 rungs are a board-level meter under a stated workload. A core-rail reading under the closed-loop episode is the missing measurement. Post-place-and-route tool power would be a third class, still not a meter, and it is not reported as a result.

Statistical reporting. Where `RESULTS.md` gives a mean and a standard deviation, this paper copies them. It does not add confidence intervals that were not computed. Multi-seed coverage is five seeds on the bake-offs and the hard gate benchmark's reported spreads. That is not a large-sample claim.

Claim hygiene. The following are not results: silicon joule leadership; operation near the Landauer bound; brain-equivalent power; a win over System One on latency; a win over world-model benchmarks; strong linguistic determinism; identification of "intelligence" with commit count.

Falsifiers. NI-2 is false if the stated command on the stated crate revision does not print those counts. NI-3 is false if the Safe v2 test reports a false allow on the stated grid. NI-6 is false if the refuse case in the demo file executes. NI-1 is false if the schema and the runtime diverge. A stage B emulator that disagrees with stage A on seed 1 fails its own acceptance test. A future meter that assigns board energy to the analytical number without a calibration study does not confirm the analytical model.

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## I.7. Conclusion

The paper defined a commit decision as a conjunctive certificate over a LUT allow bit and an energy predicate, with an optional barrier, and showed a software reference that emits the decision before an irreversible effect. On the reported pendulum tests, the Safe fixed-point rule has zero false allows against its continuous oracle `Vdot <= epsilon` on the stated test set, at the cost of 79 false refuses in 209,261 decisions. On the reported comparisons, that oracle is not the same as set invariance. Analytical episode energy for the seed-1 run is 8.6795e-10 joule under published constants. Tool refuse in the MCP demo does not call the executor. Verilog checks are simulation. The browser WASM and WebGPU instrument is available at https://research.openie.dev/living/fpga-sim/ so that the same decision can be inspected without a board. It remains a simulation, not a DUT result. The Alchitry Pt V2 agrees with the software on every decision of seed 1 and stays unmetered. The KV260 meters the gate fabric at board level: 11,428 pJ per eight-lane gate cycle at 25 MHz. The reference is a measured software artifact and a board-metered fabric. The closed-loop chip joule is the next measurement.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## I. References

Simon, H. A., and Kadane, J. B. Optimal problem-solving search: all-or-none solutions. Artificial Intelligence 6(3), 235-247, 1975. https://doi.org/10.1016/0004-3702(75)90002-8

Alshiekh, M., Bloem, R., Ehlers, R., Konighofer, B., Niekum, S., and Topcu, U. Safe reinforcement learning via shielding. arXiv:1708.08611.

Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P. Control barrier functions: theory and applications. European Control Conference, 2019. https://doi.org/10.23919/ECC.2019.8796030

Amodei, D., and Hernandez, D. AI and compute. OpenAI, 2018. https://openai.com/index/ai-and-compute/

Anthropic. Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

Bacellar, A., et al. Differentiable weightless neural networks. arXiv:2410.11112.

Bauer, A., Leucker, M., and Schallhart, C. Runtime verification for LTL and TLTL. ACM Transactions on Software Engineering and Methodology 20(4), 14, 2011. https://doi.org/10.1145/2000799.2000800

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Brillouin, L. Science and Information Theory. Academic Press, 1956.

Chaitin, G. J. Algorithmic information theory. IBM Journal of Research and Development, 1977. https://doi.org/10.1147/rd.214.0350

Chen, Z., Kang, M., and Li, B. ShieldAgent: Shielding Agents via Verifiable Safety Policy Reasoning. ICML 2025 (PMLR v267). arXiv:2503.22738. https://proceedings.mlr.press/v267/chen25ae.html

Chollet, F. On the measure of intelligence. arXiv:1911.01547.

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Dawson, C., Gao, S., and Fan, C. Safe control with learned certificates: a survey of neural Lyapunov, barrier, and contraction methods. arXiv:2202.11762.

Engelbart, D. C. Augmenting human intellect: a conceptual framework. 1962. https://www.dougengelbart.org/pubs/augment-3906-Framework.html

Falcone, Y. You should better enforce than verify. Runtime Verification (RV 2010), Lecture Notes in Computer Science 6418, 89-105. Springer, 2010. https://doi.org/10.1007/978-3-642-16612-9_9

Garcia-Molina, H., and Salem, K. Sagas. Proceedings of ACM SIGMOD 1987, 249-259. https://doi.org/10.1145/38713.38742

Gray, J. Notes on data base operating systems. In Operating Systems: An Advanced Course, Lecture Notes in Computer Science 60, 393-481. Springer, 1978. https://doi.org/10.1007/3-540-08755-9_9

Greydanus, S., Dzamba, M., and Yosinski, J. Hamiltonian neural networks. arXiv:1906.01563.

Ha, D., and Schmidhuber, J. World models. arXiv:1803.10122.

Hafner, D., Pasukonis, J., Ba, J., and Lillicrap, T. Mastering diverse domains through world models. arXiv:2301.04104.

Henzinger, T. A., Kueffner, K., and Yu, E. Formal verification of neural certificates done dynamically. arXiv:2507.11987. https://arxiv.org/abs/2507.11987

Hestness, J., et al. Deep learning scaling is predictable, empirically. arXiv:1712.00409.

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Hooker, S. The hardware lottery. arXiv:2009.06489. Communications of the ACM, 2021. https://doi.org/10.1145/3467017

Horowitz, M. Computing's energy problem (and what we can do about it). IEEE International Solid-State Circuits Conference, 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Iverson, K. E. Notation as a tool of thought. Communications of the ACM, 1980. https://dl.acm.org/doi/10.1145/358896.358899

Jaynes, E. T. Information theory and statistical mechanics. Physical Review 106, 620, 1957. https://doi.org/10.1103/PhysRev.106.620

Kang, S., Yu, T., and Hwang, S. J. PolicyGuide: from guarding one action to guiding the whole workflow for policy-compliant LLM agents. arXiv:2608.19861. https://arxiv.org/abs/2608.19861

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Kay, A. A personal computer for children of all ages. 1972. https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf

Klein, G., et al. seL4: formal verification of an OS kernel. Proceedings of SOSP 2009, 207-220. https://doi.org/10.1145/1629575.1629596

Kolmogorov, A. N. Three approaches to the quantitative definition of information. 1965. English: International Journal of Computer Mathematics, 1968. https://doi.org/10.1080/00207166808803030

Kuon, I., and Rose, J. Measuring the gap between FPGAs and ASICs. IEEE Transactions on Computer-Aided Design 26(2), 203-215, 2007. https://doi.org/10.1109/TCAD.2006.884574

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

LeCun, Y. Path towards autonomous machine intelligence / JEPA discussion. Meta AI blog. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/

LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., and Huang, F. J. A tutorial on energy-based learning. 2006. http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf

Lee, L. Notational intelligence. 2022. https://thesephist.com/posts/notation/

Leung, C. H., and Paré, P. E. Bayesian safety guarantees for port-Hamiltonian systems with learned energy functions. arXiv:2512.24493.

Levy, W. B., and Calvert, V. G. Cerebral cortical communication overshadows computational energy-use, but these combine to predict synapse number. arXiv:2102.06273.

Ligatti, J., Bauer, L., and Walker, D. Edit automata: enforcement mechanisms for run-time security policies. International Journal of Information Security 4, 2-16, 2005. https://doi.org/10.1007/s10207-004-0046-8

Ma, S., et al. The era of 1-bit LLMs: all large language models are in 1.58 bits. arXiv:2402.17764.

Manek, G., and Kolter, J. Z. Learning stable deep dynamics models. arXiv:2001.06116.

Matuschak, A., and Nielsen, M. How can we develop transformative tools for thought? https://numinous.productions/ttft/

Mead, C. Neuromorphic electronic systems. Proceedings of the IEEE, 1990. https://doi.org/10.1109/5.58356

Necula, G. C. Proof-carrying code. Proceedings of the 24th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL '97), 106-119, 1997. https://doi.org/10.1145/263699.263712

Petersen, F., et al. Deep differentiable logic gate networks. arXiv:2210.08277.

Qiao, Y., Chen, Z., Zhang, Y., Wang, Y., et al. TeLLMe: an energy-efficient ternary LLM accelerator for prefilling and decoding on edge FPGAs. arXiv:2504.16266.

Roth, F., et al. Stable port-Hamiltonian neural networks. arXiv:2502.02480.

Saltzer, J. H., and Schroeder, M. D. The protection of information in computer systems. Proceedings of the IEEE 63(9), 1278-1308, 1975. https://doi.org/10.1109/PROC.1975.9939

Sanchez, C., et al. A survey of challenges for runtime verification from advanced application domains. arXiv:1811.06740.

Sandberg, A. Energetics of the brain and AI. arXiv:1602.04019.

Schneider, F. B. Enforceable security policies. ACM Transactions on Information and System Security 3(1), 30-50, 2000. https://doi.org/10.1145/353323.353382

Sha, L. Using simplicity to control complexity. IEEE Software 18(4), 20-28, 2001. https://doi.org/10.1109/MS.2001.936213

Shannon, C. E. A mathematical theory of communication. Bell System Technical Journal, 1948. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Shi, T., He, J., Wang, Z., et al. Progent: Securing AI Agents with Privilege Control. arXiv:2504.11703. https://arxiv.org/abs/2504.11703

Solomonoff, R. J. A formal theory of inductive inference, parts I and II. Information and Control, 1964.

SparkFun. Alchitry Pt V2 product page. https://www.sparkfun.com/alchitry-pt-v2.html

Sutskever, I. An observation on generalization. Simons Institute talk, 2023. https://www.youtube.com/watch?v=AKMuA_TVz3A

Sutton, R. The bitter lesson. 13 March 2019. http://www.incompleteideas.net/IncIdeas/BitterLesson.html

Texas Instruments. INA260 precision digital current and power monitor, data sheet. https://www.ti.com/lit/ds/symlink/ina260.pdf

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Umuroglu, Y., et al. LogicNets. arXiv:2004.03021.

Victor, B. Inventing on principle. 2012. https://www.youtube.com/watch?v=PUv66718DII

Victor, B. Media for thinking the unthinkable. https://worrydream.com/MediaForThinkingTheUnthinkable/

Wang, H., Poskitt, C. M., and Sun, J. AgentSpec: customizable runtime enforcement for safe and reliable LLM agents. arXiv:2503.18666. https://arxiv.org/abs/2503.18666

Wei, J., et al. T-MAC. arXiv:2407.00088.

Xiang, Z., Zheng, L., Li, Y., Hong, J., et al. GuardAgent: safeguard LLM agents by a guard agent via knowledge-enabled reasoning. arXiv:2406.09187. https://arxiv.org/abs/2406.09187

Yu, E., Žikelić, Đ., and Henzinger, T. A. Neural control and certificate repair via runtime monitoring. AAAI 2025. https://doi.org/10.1609/aaai.v39i25.34840 (arXiv:2412.12996).

Local measurement record: `artifacts/RESULTS.md` in the `wca-lut-edge` software reference. KV260 meter record: `artifacts/stage-c/wca-kv260-meter/` (protocol, claim status, A/B/A logs and summaries). Schema examples: `artifacts/schemas/wca.commit.v1/examples/`. Demo: `artifacts/mcp_gate_demo.json`.

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## I. Appendix A. Reproducibility

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

Repository flag, factual, not a result: FPGA board result claimed for the KV260 Stage C rungs 1 to 3 only (Section I.3.7), at board level. Every other result in this paper is simulation or analytical.

<div id="appendix-b-browser-fpga-emulator-architecture-to-build" class="anchor-alias" aria-hidden="true"></div>

## I. Appendix B. Browser FPGA emulator: architecture

This appendix describes the architecture of the Stage B emulator, which runs at https://research.openie.dev/living/fpga-sim/. Seed-1 agreement numbers below are from the WASM run against the Stage A golden.

Modules.

1. `decision_core`. Pure functions already represented by the Rust certificate, plant step, and joule accumulator. No file system and no threads required. Target `wasm32-unknown-unknown`.
2. `lut_image`. The same memory image the Verilog path loads (`artifacts/fpga/wca_allow_lut.mem` and successors). The browser copy must hash-match the file used for the Icarus check.
3. `trace`. A fixed schema: step index, state, `u`, `lut_allow`, `energy_ok`, `cbf_ok`, reason codes, analytical joule increment, plant action. Identical field names to `wca.commit.v1` so a dump can be diffed against the crate's JSON.
4. `webgpu_view`. Device, queue, and a storage buffer for the LUT and the trace. A shader draws allow and refuse. A second dispatch may map the Safe residual across a grid. Buffers are for inspection. They are not a power model.
5. `workstation_oracle`. Icarus remains the RTL oracle. The browser does not replace it. Disagreement between WASM and the Rust binary fails the build. Disagreement between WASM and Icarus on the shared LUT image fails the build. Neither comparison mentions watts.

Acceptance tests. The seed-1 test passes (Section I.3.7). The others are the specified checks for the module.

- Seed-1, 16 steps, init theta 1.5, omega 3.0: committed 1, refused 15, analytical joule 8.6795e-10, matching NI-2.
- Safe grid smoke: false allow 0 on a published subset of the 209,261-decision test, matching NI-3's direction.
- MCP refuse vector: executor call count 0, matching NI-6.
- A unit test that WebGPU buffer readback equals the WASM trace. If readback is unavailable, the page must show that the GPU path did not confirm the trace, and the CPU WASM trace remains the result.

Physical follow-on for board **joules**. Stage C already programmed a closed-loop commit-gate on the Alchitry Pt V2 with UART decision agreement; the board still has no onboard joule meter. A USB inline power meter or a shunt-plus-scope on the 5 V rail, on a stated workload, is what would support a board-measured joule. Vivado / post-PAR estimates are not that meter. Vendor logic-cell and memory figures stay vendor figures. See [/living/fpga-sim/alchitry/#energy](https://research.openie.dev/living/fpga-sim/alchitry/#energy).

Out of scope for the emulator: training DiffLogic in the browser, claiming Artix-7 dynamic power from a shader, and flipping the board-result flag to true.

<div id="part-ii" class="anchor-alias" aria-hidden="true"></div>

<div id="mixture-of-limits-navigation-law-for-computer-intelligence" class="anchor-alias" aria-hidden="true"></div>

## Part II. The cascade (Mixture of Limits)


<div id="mol-abstract" class="anchor-alias" aria-hidden="true"></div>

## II. Abstract

Mixture of Limits is a navigation rule for computer intelligence, and it is threshold convergence. For a task there is a **floor**: the minimal spend that closes it. Tokens, parameters, or joules spent past the floor buy no verified progress on the task, so they are waste. The rule rests on information theory and physics, and it has a long history in science. Compression into predictive formulas and invariants has repeatedly done more with less than enumeration of cases: Kepler's laws over Tycho's tables, Newton's closed forms, Shannon's accounting of bits, and Landauer's thermodynamic floor on irreversible erasure. Mixture of Limits states that lineage as a rule a machine can run. Its standard instance is **Lookup → Formula → Solver → Model**, and it closes through Part I's record: propose → certify → commit or refuse → receipt.

Mixture-of-Experts (MoE) routing works inside a generative model and decides which parameters run. Mixture of Limits works around any gear, including a model, and decides whether to spend at all. It names its floors explicitly: value of information (VoI), grammar coverage, energy, certificate, and settle refuse. The two compose: an MoE model can be the Model gear of a Mixture of Limits cascade. Past the floor, the remaining engineering is to reach the same verified result with fewer joules, which is the subject of §II.8. The software reference `mol prove` shows that the rule and its runtime exist in software. Catalog and Landauer figures on its receipts are **estimates**, and `measured_j` is set only when a labeled meter returns a reading.

<div id="mol-terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### II. Terms used here

**Software reference** has one meaning in this paper: the software reference path that implements the navigation rule and verifies it against its specification, without board synthesis or package metering. Receipts on that path label energy as estimate and leave `measured_j` unset until a named meter returns. Software reference is not a second, looser evidence class for live silicon. Periodic Stack, replay class, value of information, evidence classes, and the board-result flag are defined on the shared [glossary](/glossary/).

**Model leaf.** The model gear is a conditionally available residual: off by default (`allow_model=false`), opened only when cheaper gears miss, and never coercible to Deterministic (`ModelGenerated` cannot be rewritten as `Deterministic`).

**Living figures for claims on this page.** Cascade: [/living/mol/#mol-diag-01](/living/mol/#mol-diag-01). Named floors: [/living/mol/#mol-diag-02](/living/mol/#mol-diag-02). Commit or refuse then receipt: [/living/mol/#mol-diag-03](/living/mol/#mol-diag-03). MoE contrast: [/living/mol/#mol-tab-01](/living/mol/#mol-tab-01).

<div id="the-law-before-the-survey" class="anchor-alias" aria-hidden="true"></div>

### II. The rule before the survey

Lookup → Formula → Solver → Model is the default order of trial. It is one instance of the rule in Section II.2. Floors stop escalation when more bits stop buying outcomes: VoI, grammar, energy estimate, certificate, settle refuse. Every close goes through propose → certify → commit or refuse → receipt. Section II.8 surveys ways to spend less once the floor is reached. It is a survey under the rule, not the rule itself.


---

<div id="1-introduction-pursuit-of-limits-toward-agi" class="anchor-alias" aria-hidden="true"></div>

## II.1. Introduction: the pursuit of limits

The dominant construction for computer intelligence (CI) treats the neural net as the substrate and excess tokens as the growth variable. That construction diverges from the historical method that produced reliable science. When Brahe enumerated planetary positions, the tables were necessary but not the law. Kepler compressed years of positions into three predictive relations. Newton further compressed those relations into invariants and closed forms that travel across domains. The same pattern recurs wherever a grammar of nature is covered: a short formula outruns an infinite ledger of cases.

Information theory gives the modern accounting of that pattern. Shannon (1948) measures information in bits. Value of Information (VoI) prices whether another observation is worth its cost for a decision. Landauer (1961) prices irreversible bit erasure in joules at temperature T: $E_{\min} = k_B T \ln 2$ per bit erased in the ideal model. That Landauer quantity is a thermodynamic lower bound and, on Mixture of Limits receipts, a **labeled estimate**, not a wattmeter reading. Together they imply floors: past a point, more bits stop buying outcomes that matter for a stated benefit.

**Thesis.** Reliable computer intelligence comes from finding the floor for each task and stopping there. Adding tokens, parameters, or experts past the floor does not raise the value of information for the stated benefit. Mixture of Limits is the executable navigation rule that binds the named floors: VoI, grammar coverage, energy as a labeled estimate, certificate, and settle refuse. Once VoI is zero past a floor, more spend buys nothing verifiable on that coordinate, and the remaining work is to reach the same result with fewer joules.

The floors themselves are established theory: Shannon, Landauer, Kolmogorov, Solomonoff, Chaitin, and Howard's value of information state them, and formula-first science keeps confirming them.

Many current techniques serve that remaining work: deeper latents, energy-based hybrids, world models, test-time compute, super learning, state-space hybrids, mixture of experts, and the cache, routing, and decode methods of §II.8.13 and §II.8.14. Each is a way to spend less once the floor is known. None of them removes a floor. §II.8.12 places that spend on real devices.

This paper's contribution for Part II is the statement of the rule, grounded in the clean-room `mixture-of-limits` software reference (Apache-2.0 OR MIT). Part I supplies the commit record. Mixture of Limits decides *which gear closes* and *when refuse is success*.

Three measurement facts constrain every later number in Part II. First, joules from catalog surrogates and OpCounter-style analytics are **estimates**, not board power. Second, Landauer annotations are **estimates**, distinct from RAPL, NVML, or `measured_j`. Third, the Mixture of Limits reference makes no board measurement: `measured_j` is set only when a labeled probe returns a reading. The only board joules in this paper are Part I's KV260 readings.

**Scope of Part II.** Section II.2 states the rule and its floors. Section II.3 states the cost model $E(x) \ge \theta(D)\cdot\mu(S,V)$. Section II.4 describes the cascade, the close, and when cheapest first is optimal. Section II.5 connects to the stop on task completion. Section II.6 maps each verified criterion of the software reference to its claim. Section II.7 sketches the mathematics of the VoI stop, grammar coverage, and settle refuse. Section II.8 surveys related work: the established results that state the floors, the historical lineage, formula and mechanism systems, and the techniques that reduce spend once the floor is reached (§II.8.7 to §II.8.14). Section II.9 sets Mixture of Limits beside MoE and model-to-model routing, and states the baselines a cascade claim must beat.

---

<div id="2-law-floors-where-more-bits-stop-buying-outcomes" class="anchor-alias" aria-hidden="true"></div>

## II.2. Floors where more bits stop buying outcomes

**Mixture of Limits** asserts that for a task coordinate there is a floor past which additional tokens, parameters, or joules do not purchase verifiable progress. Intelligence is then a **navigation rule** over a structured stack of primitives: spend what the task needs, then stop.

**A rule, not one cascade.** The floor is the least spend that closes the task. Spend past it is waste: if Lookup, Formula, or Solver already covers the coordinate, opening a generator is waste. The plateau is the region past the floor, where VoI is zero and more spend changes nothing verified. That is threshold convergence: converge on the minimal amount needed, and treat more as waste. Mixture of Limits is that philosophy. It is not one fixed cascade or one selector. Lookup → Formula → Solver → Model is one instance. Any selector that stops where additional joules no longer purchase verifiable progress is another.

Consequences:

1. **Mathematical compression / formulas beat excess tokens** when the grammar is covered.
2. **Neural nets are a conditionally available residual leaf** (off by default; never coercible to Deterministic), not the default substrate of CI.
3. Routing is **cheapest-sufficient**: escalate only on miss; refuse when escalation is unsafe or VoI-negative.
4. Proof / energy cost model: $E(x) \ge \theta(D)\cdot\mu(S,V)$ with labeled joule receipts; Landauer labeled as estimate.
5. **Available devices / multi-fabric**: after a cascade gear closes, pick the cheapest sufficient device class; not one accelerator by default.

**Where the model sits.** Model last is an order of trial. It is not a verdict on what models can do. Snell, Lee, Xu and Kumar showed that a compute-optimal schedule of test-time compute beats a best-of-N baseline by more than 4x in efficiency, and that on some problems test-time compute can stand in for a larger model (arXiv:[2408.03314](https://arxiv.org/abs/2408.03314)). That result is about the schedule inside the model gear. Mixture of Limits prices that schedule in joules like any other gear. The model gear opens whenever the cheaper gears cannot close $C(z)$, and it opens first when they pass too rarely to pay for their failures. Simon and Kadane (1975) give the ordering condition: with $p_i$ the probability that gear $i$ closes the task and $c_i$ its expected energy in joules, trying gears in decreasing order of $p_i / c_i$ minimizes expected energy to the first close.

Figure 2 draws the floor and the plateau for one task.

![Diagram of verified progress against spend for one task. Progress rises in steps as the cascade escalates from Lookup to Formula to Solver; the Solver closes the task, marking the floor. Past the floor the Model stage adds spend with no further verified progress, the plateau where value of information is zero.](/figures/gates/mol-plateau.svg)

*Figure 2. Mixture of Limits on one task. Diagram, not a measurement: verified progress rises in steps through the cascade until the floor, and spend past the floor buys no verified progress (Section II.8.7). A [PNG copy](/figures/gates/mol-plateau.png) is provided.*

<div id="named-floors" class="anchor-alias" aria-hidden="true"></div>

### II. Named floors

| Limit id | Kind | Meaning |
|---|---|---|
| `voi` | ValueOfInformation | Marginal bits worthless under budget. **stop** |
| `grammar` | GrammarCoverage | Covered by Lookup/Formula/Solver; or refuse unknown |
| `energy` | Energy | Joule budget floor; Landauer-aware **estimates** |
| `efa_certificate` | Certificate | Diverge / fail certify → refuse before commit |
| `settle_refuse` | SettleRefuse | Ternary / energy-landscape settle will not settle → refuse |
| `primitive_gap` | PrimitiveGap | Missing Periodic Stack primitive; surface the gap |
| `safety` / `wca_refuse` | Safety / WCA | Capability deny; WCA certify refuse |
| `information` / `latency` | Information / Latency | Sufficiency and soft wall-clock ceilings |

<div id="neural-net-demotion" class="anchor-alias" aria-hidden="true"></div>

### II. Neural net demotion

The model gear is a conditionally available residual: off by default (`allow_model=false`), opened only when cheaper gears miss, and never coercible to Deterministic (`ModelGenerated` cannot be rewritten as `Deterministic`). It may propose residual content; it never bypasses certify-before-commit. On a coin cell or an edge device, the default close is a constant-time formula plus a LUT refuse, not a small transformer.

### II. Periodic Stack

The reference's catalog of computation primitives, grouped into families, is called the Periodic Stack in this paper. Each cell is either Present (an implemented primitive) or Gap (none yet).

<div id="mixture-of-limits-is-not-moe" class="anchor-alias" aria-hidden="true"></div>

### II. The cascade lineage

Mixture of Limits is threshold convergence: spend until the next unit no longer buys verifiable progress, then stop. Its parts have a lineage. Anytime algorithms and their performance profiles trade computation for quality with an interruptible stop ([Dean and Boddy 1988](https://cdn.aaai.org/AAAI/1988/AAAI88-009.pdf)). Attentional cascades reject easy cases with cheap stages first ([Viola and Jones 2001](https://doi.org/10.1109/CVPR.2001.990517)). Model cascading sends an input to a larger model only when a smaller one is unsure ([Varshney and Baral 2022](https://doi.org/10.18653/v1/2022.emnlp-main.756)); speculative decoding lets a small model draft and a large one verify ([Leviathan et al. 2023](https://proceedings.mlr.press/v202/leviathan23a.html)); Mixture-of-Depths allocates compute per token inside one model ([Raposo et al. 2024](https://arxiv.org/abs/2404.02258)). The plateau is measured: reasoning models spend tokens after the first correct answer that do not change it ([Chen et al. 2024](https://arxiv.org/abs/2412.21187)), and a survey of efficient reasoning collects the methods that stop earlier ([Sui et al. 2025](https://arxiv.org/abs/2503.16419)). Mixture of Limits takes the stop from these works, puts it on the task predicate $C(z)$ and prices it in joules.

### II. Mixture of Limits is not MoE

The names are similar and the objects differ. MoE chooses parameters inside one model. Mixture of Limits chooses whether and where to spend across gears, and an MoE model can serve as its Model gear.

| MoE (inside a generative model) | Mixture of Limits (navigation rule) |
|---|---|
| Experts live *inside* a model; gate selects parameters | Limits live *outside* generation; floors stop escalation |
| More experts → more capacity for the same generative act | More named floors → sharper refuse / cheaper close |
| Success = next-token likelihood | Success = closed grammar + certified commit + joule receipt |
| Model is the substrate | Model is a **residual leaf**: the last gear tried, opened when cheaper gears cannot close $C(z)$ |

Mixture of Limits is a rule plus a runtime, written clean-room. It is not a wrapper on MoE.

---

<div id="3-proof-spine-ex--θdμsv" class="anchor-alias" aria-hidden="true"></div>
<div id="ii3-proof-spine-ex--θdμsv" class="anchor-alias" aria-hidden="true"></div>

## II.3. Cost model: E(x) ≥ θ(D)·μ(S,V)

The energy / impedance cost model used throughout Mixture of Limits is:

$$
E(x) \ge \theta(D)\cdot\mu(S,V)
$$

where $E(x)$ is path energy for closing act x, $\theta(D)$ scales with decision / difficulty structure D, and $\mu(S,V)$ is an impedance factor for stack coordinate S and view V. Reference receipts stamp catalog μ with `mu_source=catalog` and a `landauer_floor_ratio`. The product is an **analytical / catalog estimate**, not a package joule reading.

**Status of the spine.** $\theta$ and $\mu$ are catalog constants. So the inequality is a cost model with stated constants. It prices a gear before any joule is spent. It is not derived from physics. The physical floor under it is Landauer's, below. What ranks a closed act is the metered joules on its receipt, behind the gate $C(z)$ (Proposition 8 of the [agency track](https://research.openie.dev/papers/agency/)).

**Landauer (estimate only).** For irreversible erasure of n bits at temperature T,

$$
E_{\mathrm{Landauer}}(n,T) = n k_B T \ln 2
$$

Receipts may annotate `landauer_floor_J` from this formula. That annotation is **estimate ≠ measured**. Reference closes keep `measured_j=None`. Optional OS meter features (RAPL / IOReport / powermetrics), when present and successful, may populate `measured_j` only under a labeled `MeasureSource`; failure or VM stays `unavailable`. Software reference prove criteria do not require those meters.

**Historical rhyme.** Kepler did not need every future observation once the three laws closed the grammar of planetary motion for the epoch. Newton did not need a larger ephemeris table to predict a new orbit once F=ma and inverse-square gravitation covered the coordinate. Shannon did not need infinite samples to bound channel capacity. Landauer did not need a particular chip to state a thermodynamic lower bound. Mixture of Limits makes the same move for computer intelligence: bind a floor, close with the cheapest sufficient gear, and refuse when the floor says stop. This is an analogy, offered to teach. The evidence is the receipts and the propositions.

**Constructive existence (software).** `cargo run -p mol-cli -- prove` prints VERIFIED per criterion and exits 0 (about 29 criteria spanning deterministic close, formula/lookup without model, VoI refuse, settle commit+refuse, certificate refuse, capability default-deny, receipt labels, replay-class coercion deny, Periodic Stack subset navigation, μ catalog, transcript replay, Z2 cite / Z1 compose, agent mailbox, bitemporal memory, fabric routing, desktop headless shell, OS meter labels, WASM capsule, Agent Lane, multi-fabric receipts, ecosystem e2e certify; see PLAN.md in the Mixture of Limits workspace). That is constructive existence **in software**: an implementation exists and passes every stated criterion. It is not the proof of a theorem, and it is not a board energy measurement. Section II.6 maps each criterion to its claim.

---

<div id="4-cascade-and-close-lookup--formula--solver--model-last" class="anchor-alias" aria-hidden="true"></div>

## II.4. Cascade and close: Lookup → Formula → Solver → Model

Cascade order, with replay classes enforced by type:

```text
Lookup → Formula (closed-form) → Solver / settle → Model
```

| Mixture of Limits tier | Role | Replay class (typical) |
|---|---|---|
| Lookup | LUT / allow-table / registry hit | `Deterministic` |
| Formula | Closed identity / unit convert / law instance | `Deterministic` |
| Solver | Sparse solve / ternary settle | `Deterministic` or compose under Solver |
| Model | Stochastic residual only | `ModelGenerated` |

**Invariant:** `ModelGenerated` ↛ `Deterministic`. Typed answers refuse coercion.

Automation / close loop:

```text
sense → classify grammar → cheapest sufficient → certify → commit|refuse → receipt
```

Mixture of Limits **owns close**. Refuse over escalate when unsafe or VoI-negative. Refuse is a **lawful success** and still emits a receipt.

<div id="co0-bind-sketch-namespaces" class="anchor-alias" aria-hidden="true"></div>

### II. co/0 bind sketch (namespaces)

Reference receipt labels bind act namespaces (a sketch):

| Namespace | Role |
|---|---|
| `claim.*` | Seeded / retrieved knowledge claims (Z2); unknown → refuse, no invent |
| `act.*` | Capability-gated acts; Mutate/External default-deny |
| `close.*` | Route + certify gate; commit or refuse |
| `receipt.*` | `estimated_j` labeled; `measured_j` only if Metered probe returned |

Rules stamped on every reference close:

1. **Certify-before-commit**; no irreversible side effect without certificate pass.
2. **`ModelGenerated` ↛ `Deterministic`**; sealed replay markers.
3. **`measured_j` only if Metered**; otherwise `None` / unavailable.
4. **Refuse = lawful success + receipt**. VoI / settle_refuse / certificate / capability denies still close the ledger.

Multi-fabric routing: after tier selection, the reference routes to the cheapest sufficient `DeviceKind` (Cpu always present; Gpu, Wasm, and ThermoSettle optional). Detecting a device is not measuring its joules.

**When the order is optimal.** A fixed order from cheapest up is optimal in expected joules when each cheap gear passes often enough to pay for its failures. For a light gear L ahead of a heavy gear H that always passes, light first wins if and only if $q_L c_H > c_L$, where $q_L$ is the light gear's pass probability and $c$ is joules. For independent gears the optimal order sorts by pass probability per joule, $p/c$ (Simon and Kadane 1975, DOI:[10.1016/0004-3702(75)90002-8](https://doi.org/10.1016/0004-3702(75)90002-8)). Proposition 9 of the [agency track](https://research.openie.dev/papers/agency/) proves both. When the condition fails, the cascade starts at the heavier gear. Under a binding joule budget, the joules of failed light attempts stay spent, and a selector that prices pass probability against joules can close tasks the fixed order cannot. Section 8.11 of the [agency paper](https://research.openie.dev/papers/agency/) reports a first kernel-reported comparison.

---

<div id="5-econ-bridge-satiation" class="anchor-alias" aria-hidden="true"></div>

<div id="ii5-econ-bridge-satiation" class="anchor-alias" aria-hidden="true"></div>

## II.5. Stop bridge: task completion

Mixture of Limits supplies the *machine* stop: VoI and grammar floors refuse excess generation once benefit is covered, and Part I's commit and refuse receipts record the irreversible boundary.

The task-completion stop is a written completeness predicate $C(z) \in \{0,1\}$: once $C = 1$, further computation on the task cannot raise it. Part I owns the commit record; Mixture of Limits owns navigation floors that make "done" and "unsafe" executable without opening the model leaf.

---

<div id="6-prove--claim-map" class="anchor-alias" aria-hidden="true"></div>

## II.6. Prove ↔ claim map

The Mixture of Limits harness `mol prove` checks a close rule that rests on information theory and physics. This section maps only what `mol prove` actually stamps `VERIFIED` onto the paper's `claim.*` ids. The mapping shows known floors embodied in software. It does not claim new physics.

A claim is **implemented and verified against its specification** when the in-tree harness prints `VERIFIED` for the named criterion and exits 0. That is software existence. It is not a theorem, and it is not independent replication. A claim is **software reference only** when PLAN §6 marks it OUT OF PROOF SCOPE, or when the criterion itself stamps software reference / fixture / feature-gated behavior rather than live silicon. Verified-path rows keep `measured_j=None` unless a Metered probe returns, and make no board measurement.


Measurement labels used below:

| Label | Meaning |
|---|---|
| **Unmetered** | Reference path; `measured_j=None`; estimate may be labeled |
| **Estimated** | Catalog / Landauer / fuel / μ surrogate with explicit `EstimateKind` or `mu_source=catalog` |
| **Metered** | Optional live probe (`energy-meter`) returned numbers (not required for prove) |

Default close path for all verified claims: **Unmetered**, plus **Estimated** where μ, Landauer, or fuel figures appear. The verified path makes no board measurement.

<div id="61-harness-meta" class="anchor-alias" aria-hidden="true"></div>

### II.6.1 Harness meta

| Prove # | Criterion (PLAN) | Paper claim id | Status | Measurement |
|---|---|---|---|---|
| P0 | `cargo test --workspace` green | `claim.mol.ci_workspace` | Verified against specification (CI / operator; not printed by `mol prove`) | none |
| P1 | `cargo run -p mol-cli -- prove` exits 0 | `claim.mol.prove_harness` | Verified against specification (prints `VERIFIED` per row below) | Unmetered |

<div id="62-proven-claims-p2-p24" class="anchor-alias" aria-hidden="true"></div>

<div id="ii62-proven-claims-p2-p24" class="anchor-alias" aria-hidden="true"></div>

### II.6.2 Verified claims (P2-P24)

| Prove # | Criterion (PLAN) | Paper claim id | Claim (one sentence) | Software reference / scope note | Measurement |
|---|---|---|---|---|---|
| P2 | Deterministic close (double-run) | `claim.mol.deterministic_close` | Same asks yield the same commit/refuse + limit id. | none | Unmetered |
| P3 | Formula/lookup close without model | `claim.mol.formula_lookup_no_model` | Landauer / unit-convert closes COMMIT at Lookup or Formula; model never answered. | none | Unmetered / Estimated (Landauer floor on receipt) |
| P4 | VoI refuse when `!allow_model` | `claim.mol.voi_refuse` | Free-form ask → REFUSE `voi`. | none | Unmetered |
| P5 | Settle commit + settle refuse | `claim.mol.settle_ternary` | Ternary settle → COMMIT; `will not settle` → REFUSE `settle_refuse`. | Software-ref settle stub; no VM / FPGA | Unmetered |
| P6 | Certificate refuse on diverge | `claim.mol.efa_certificate_refuse` | Formula + `diverge` → REFUSE `efa_certificate`. | In-tree EFA-style cert; Ferric / live BMI loop software reference | Unmetered |
| P7 | Capability default-deny mutate | `claim.mol.capability_deny_mutate` | `AutomateGate::default().gate(Mutate)` → Refuse. | none | Unmetered |
| P8 | Receipt labels | `claim.mol.receipt_honesty` | Software-ref: `measured_j=None`, estimate labeled (`EstimateKind`). | Live RAPL/NVML default close OUT OF SCOPE | Unmetered / Estimated |
| P9 | `ModelGenerated` ↛ `Deterministic` | `claim.mol.replay_no_strengthen` | `TypedAnswer::weaken_to` returns `ReplayCoercion`. | none | none |
| P10 | Periodic Stack live catalog navigation | `claim.mol.stack_live_catalog` | Family + present + scale → COMMIT at Lookup; 258 live Lookup/Formula/Solver/Navigate gears; note cites 258/33. | μ calib + silicon HW OUT OF SCOPE; software reference Gap sims in proof | Unmetered |
| P11 | `primitive_gap` via registry probe | `claim.mol.primitive_gap` | Gap marker `physical_settle` + absent name → REFUSE `primitive_gap` (not string-only). | none | Unmetered |
| P12 | μ / impedance catalog | `claim.mol.mu_catalog` | Receipts stamp `mu_source=catalog`, `mu`, `landauer_floor_ratio`; `E≈θ·μ` (catalog estimate, not RAPL/`measured_j`). | μ **calib corpus** OUT OF SCOPE | Estimated |
| P13 | Receipt transcript replay | `claim.mol.receipt_replay` | JSONL/in-memory replay reproduces commit/refuse + limit id; model never answered. | none | Unmetered |
| P14 | Z2 retrieve+cite | `claim.mol.z2_retrieve_cite` | Seeded factual hit → COMMIT `RetrievedCited` + citation ids; unknown → REFUSE `claim_unknown` (no invent). | Seed corpus in-tree only | Unmetered |
| P15 | Z1 compose/synthesis | `claim.mol.z1_compose` | ≥2 cited claims → COMMIT `Composed` + `synthesis.composed_from`; missing → REFUSE `compose_missing`; never laundered as Deterministic/RetrievedCited alone. | none | Unmetered |
| P16 | Agent mailbox loop | `claim.mol.agent_mailbox` | Goal/Message/Act → close → commit\|refuse + receipt in transcript; demo hits formula/cite/compose COMMIT and voi/settle_refuse REFUSE; model cold; measurement flags hold. | none | Unmetered |
| P17 | Bitemporal state + memory | `claim.mol.bitemporal_memory` | Writes only on Mixture of Limits close COMMIT; Mutate deny / free-form remember → REFUSE; recall → `RetrievedCited` + `memory:` cite; unknown → `memory_unknown`. | none | Unmetered |
| P18 | Fabric routing + software reference inventory | `claim.mol.fabric_soft_ref` | Offline inventory valid (`source=software_ref`, Cpu always); Lookup/Formula→Cpu; Settle→ThermoSettle\|Cpu; Model→Gpu* or REFUSE `fabric_unavailable`; detect ≠ measured joules. | Live wgpu presence optional / not required for prove | Unmetered |
| P19 | Desktop shell headless | `claim.mol.desktop_headless` | `ShellSession` ask/close → receipt view (zone/fabric/limit/estimated_j/`measured_j=None`); joule ledger; VoI refuse; GUI not required. | egui GUI optional | Unmetered / Estimated |
| P20 | OS meter labels | `claim.mol.os_meter_honesty` | Feature off / VM / no permission → `measured_j=None`, empty components, `measure_source=unavailable`; fixtures stamp labeled sources; default close stays unmetered. | Live probe optional (`energy-meter`) | Unmetered (default) / Metered only when probe returns |
| P21 | WASM capsule certify | `claim.mol.wasm_capsule` | `add.wasm` under stub runtime; fuel → estimated_j only; FS/net grant / fuel exceed / host-share → REFUSE; close stamps capsule. | Optional `wasmtime` feature | Unmetered / Estimated (fuel) |
| P22 | Agent Lane session path | `claim.mol.agent_lane` | Lane partitions; `host_invoke` without provenance refuses; keyword confirm insufficient; need `GrantReceipt`; allow stamps `AgentLaneReceipt`. | none | Unmetered |
| P23 | Multi-fabric compute receipt | `claim.mol.fabric_compute_receipt` | Software reference inventory; `ComputeFabric` / `ScheduleDecision` / `ComputeStepReceipt` with `fabric_id`; cascade stamps `fabric:route`; CPU Formula COMMIT; Model residual may `fabric_unavailable`; `measured_j=None` on software reference path. | Ferric not path-dep'd | Unmetered |
| P23b | Live fabric soft | `claim.mol.fabric_live_soft` | Feature off stays software_ref; mock/live Metal can stamp `gpu_metal`; Formula stays Cpu; missing Gpu* fail-closed; prove does not require a GPU; `measured_j=None` unless Metered. | Soft / optional detect | Unmetered |
| P23c | wgpu / Metal tiny kernel | `claim.mol.kernel_vector_add` | Clean-room WGSL vector-add; soft stub offline (same checksum); Gpu* stamps `kernel:vector_add` + `execution_proof`; optional overlapping meter may stamp package `measured_j` with `energy_honesty=measured` (field name); no rail-sum package joules. | Live Metal optional; fixture OK for prove | Unmetered (default) / Metered only if meter returns |
| P24 | Ecosystem e2e certify (one receipt) | `claim.mol.ecosystem_e2e` | Lane → fabric (Cpu software reference) → WASM → energy labels (estimated fuel; optional meter_sample) → host invoke only with `GrantReceipt` → commit\|refuse on **one** receipt; refuse-without-grant → `grant_receipt_required`. | none | Unmetered / Estimated |

<div id="63-soft-ref-only" class="anchor-alias" aria-hidden="true"></div>

### II.6.3 Software reference only

These are PLAN §6 residuals. Citing them is allowed as roadmap / reference semantics. Treating them as measured results is not.

| Software reference item | Why software reference | Related prove row (if any) |
|---|---|---|
| Live silicon RAPL / NVML as **default** close | Optional `energy-meter`; `mol prove` stays `measured_j=None` | P8, P20 |
| Live wgpu adapter presence | Feature `fabric-detect`; the offline inventory remains the default for `mol prove` | P18, P23b, P23c |
| Ferric / on-device EFA (BMI hardware loop) | Reference semantics only; not path-dep'd | P6, P18, P23* |
| VM WASM / FPGA meter (real pJ) | Software-ref `StubKlereSettle` | P5 |
| Live `openie-path` / leapfrog ask bridge | Adapter port | none |
| Live WCA MCP / `wca-lut-edge` in-proc certify | Adapter port | none |
| μ calib corpus + silicon HW (physical_settle / reversible / ising / adiabatic / ferric / quantum / analog / photonic Gap cells) | Live catalog (258 Present / 258 live gears) + Gap + tier μ catalog + Stage C/Ferric software reference inventories + HW Gaps software reference sims ×8 (`stage_c_measured=false`; Gap cells retained) are in proof; silicon meters OUT | P10, P12 |
| Trained weights / candle / tract Model leaf | Model stays demoted stub | P3, P4, P16 |

<div id="64-seeded-knowledge-claims-z2-corpus-not-the-prove-map" class="anchor-alias" aria-hidden="true"></div>

### II.6.4 Seeded knowledge claims (Z2 corpus; not the prove map)

In-tree `ClaimStore` seeds used by P14/P15 (retrieve/compose), distinct from the paper claim ids above:

- `claim:landauer.principle`
- `claim:mol.law`
- `claim:mol.proof_law`
- `claim:mol.cascade`
- `claim:stack.scale`
- `claim:honesty.no_fake_rapl`
- `claim:replay.retrieved_cited`
- `claim:openie.z2`

<div id="65-measurement-scope-of-the-proven-map" class="anchor-alias" aria-hidden="true"></div>

<div id="ii65-measurement-scope-of-the-proven-map" class="anchor-alias" aria-hidden="true"></div>

### II.6.5 Measurement scope of the verified map

- The `mol prove` path: `measured_j=None` (Unmetered); Metered only when a live probe returns.
- The verified path makes no board measurement.
- Version 0.1 of `mol prove` is constructive existence in software, not a board energy result.
- Roadmap items (§II.6.3) stay roadmap; they are not escalated to verified claims.

---

<div id="7-math-sketches-voi-stop-grammar-coverage-settle-refuse" class="anchor-alias" aria-hidden="true"></div>

## II.7. Math sketches: VoI stop, grammar coverage, settle-refuse

<div id="71-voi-stop" class="anchor-alias" aria-hidden="true"></div>

### II.7.1 VoI stop

Let B be a benefit functional for a decision, x the current information state, and c the cost (bits, latency, or estimated joules) of acquiring observation y. A simple stop rule:

$$
\Delta(x,y) = \mathbb{E}[B \mid x,y] - \mathbb{E}[B \mid x] - \lambda\, c(y)
$$

Refuse escalation when $\Delta(x,y) \le 0$ (or $\le \tau$ for a configured threshold). The reference encodes this as floor `voi` with `allow_model=false` by default: free-form asks that would only open the model leaf refuse rather than spend. This is the Shannon/decision-theoretic cousin of Kepler stopping new naked-eye points once the law predicts within tolerance. Domain-calibrated Bayesian VoI tables remain a deployment parameter, not a software reference prove deliverable. Classical cousins: **anytime algorithms** allocate deliberation under a utility-of-computation schedule (Zilberstein, 1996); the **information bottleneck** prices compressed representations that keep task-relevant bits (Tishby, Pereira, and Bialek, 1999; Tishby and Zaslavsky, 2015, arXiv:1503.02406). The reference encodes the stop as named floors rather than importing those libraries as prove deliverables.

<div id="72-grammar-coverage" class="anchor-alias" aria-hidden="true"></div>

### II.7.2 Grammar coverage

Let G be the covered grammar (Lookup registry ∪ Formula identities ∪ Solver settle programs). A query q is **covered** if a deterministic derivation $q \vdash_G a$ exists with replay class not `ModelGenerated`. Cascade order tries Lookup, then Formula, then Solver. If covered, **do not open the model**. If uncovered and policy forbids model escalation, refuse (`grammar` / `voi` / `primitive_gap` as applicable). Historical analog: once Newton's grammar covers orbital mechanics for the force law at hand, one does not re-enumerate Brahe's table to answer a new initial-condition query.

<div id="73-settle-refuse" class="anchor-alias" aria-hidden="true"></div>

### II.7.3 Settle-refuse

Under Solver, a ternary / energy-landscape settle either reaches a certified fixed point (commit) or signals will-not-settle (refuse `settle_refuse`). The reference implements this as real in-tree settle logic plus certificate diverge tags (`efa_certificate`). Thermodynamic-settle inspiration is conceptual: software reference v0.1 has no annealer drivers and no adiabatic wall joules. Landauer appears as a labeled estimate on receipts.

<div id="74-bound-sketch-tying-shannon-and-landauer" class="anchor-alias" aria-hidden="true"></div>

### II.7.4 Bound sketch tying Shannon and Landauer

For n irreversible erasures on a path that closes a decision,

$$
E_{\mathrm{path}} \ge E_{\mathrm{Landauer}}(n,T) = n k_B T \ln 2
$$

and the Mixture of Limits catalog estimate further requires $E_{\mathrm{est}}(x) \ge \theta(D)\cdot\mu(S,V)$. `measured_j` requires a Metered probe. Excess tokens that do not change B fail the VoI test even when joule budgets remain; the information floor binds first.

---

<div id="8-related-work-proof-points-lineage-and-tier-a" class="anchor-alias" aria-hidden="true"></div>

## II.8. Related work: proof points, lineage, and Tier A

<div id="80-academic-proof-points-top-minds-already-named-the-floors" class="anchor-alias" aria-hidden="true"></div>

### II.8.0 Established results that state the floors

Mixture of Limits is an executable navigation rule over floors that information theorists, physicists, and decision theorists already stated as settled theory, and that formula-first work in AI keeps finding again in modern form. Below is a citation chain from historical to recent results, each with its DOI or arXiv identifier. Together they show that compression, floors, and formulas close covered tasks with less spend than enumeration.

**Information, complexity, and physical cost**

| Proof point | Who / when | What they already said | Cite (verified) |
|---|---|---|---|
| Bits under uncertainty | Shannon (1948) | Quantitative communication limits; entropy as missing information | [10.1002/j.1538-7305.1948.tb01338.x](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) (Part I); Part II [10.1002/j.1538-7305.1948.tb00917.x](https://doi.org/10.1002/j.1538-7305.1948.tb00917.x) |
| Irreversible erasure costs heat | Landauer (1961) | Logical irreversibility ⇒ minimal heat ~kT per irreversible function | [10.1147/rd.53.0183](https://doi.org/10.1147/rd.53.0183) |
| Reversible computing | Bennett (1973) | Computation can be logically reversible; Landauer cost is about erasure, not "computing" per se | [10.1147/rd.176.0525](https://doi.org/10.1147/rd.176.0525) |
| Algorithmic complexity | Kolmogorov (1965/1968) | Quantity of information as shortest program length; compression as definition | Russian original *Probl. Peredachi Inf.* 1(1):3-11 (1965), no DOI; English transl. [10.1080/00207166808803030](https://doi.org/10.1080/00207166808803030); IEEE note [10.1109/TIT.1968.1054210](https://doi.org/10.1109/TIT.1968.1054210) |
| Algorithmic probability / induction | Solomonoff (1964) | Prefer short programs; universal prior over computable regularities | Part I [10.1016/S0019-9958(64)90223-2](https://doi.org/10.1016/S0019-9958(64)90223-2) |
| Algorithmic incompleteness | Chaitin (1977) | Algorithmic information bounds what finitely axiomatized theories can prove | [10.1147/rd.214.0350](https://doi.org/10.1147/rd.214.0350) |
| Probability as extended logic | Jaynes (2003 book; earlier papers) | Maximum-entropy / logic-of-science discipline against ad-hoc excess modeling | [10.1017/CBO9780511790423](https://doi.org/10.1017/CBO9780511790423) |
| Textbook IT + decision links | Cover & Thomas | Canonical Elements of Information Theory (2nd ed.) | Wiley book DOI [10.1002/047174882X](https://doi.org/10.1002/047174882X) |
| Value of Information | Howard (1966) | Shannon bits ≠ decision value; VoI joins probability with economic consequence; stop when information is worthless for the decision | [10.1109/TSSC.1966.300074](https://doi.org/10.1109/TSSC.1966.300074) |
| Physics of computation lectures | Feynman (pub. Hey/Allen eds.) | Physical limits of computing, reversible/thermo themes in lecture form | Anniversary ed. [10.1201/9781003358817](https://doi.org/10.1201/9781003358817); 1996 Addison-Wesley ISBN 0-201-48991-0 |

**Historical mathematical physics.** §II.8.1 follows Brahe, Kepler, and Newton: the history before information theory in which tables yield to laws.

**Recent formula, mechanism, and certify systems (Tier A)**, from the Mixture of Limits workspace survey of 30 September 2026:

| Proof point | Who | Mixture of Limits reading | Cite (verified) |
|---|---|---|---|
| AI Feynman | Udrescu & Tegmark | NN decomposes; closed form is the commit | [10.1126/sciadv.aay2631](https://doi.org/10.1126/sciadv.aay2631) |
| SINDy | Brunton / Proctor / Kutz | Sparse grammar; reject dense residual fits | [10.1073/pnas.1517384113](https://doi.org/10.1073/pnas.1517384113) |
| PySR | Cranmer | Production symbolic regression | arXiv:[2305.01582](https://arxiv.org/abs/2305.01582) |
| AI-Newton | Fang et al. | Concept library + general laws across experiments | arXiv:[2504.01538](https://arxiv.org/abs/2504.01538) |
| AlphaGeometry / AlphaProof | Trinh et al.; Hubert et al. (Google DeepMind) | Propose → symbolic or Lean certify (hard floor) | Nature [10.1038/s41586-023-06747-5](https://doi.org/10.1038/s41586-023-06747-5); Nature [10.1038/s41586-025-09833-y](https://doi.org/10.1038/s41586-025-09833-y) |
| LeanDojo / ReProver | Yang et al. | Retrieval-augmented Lean proving; tool interaction with proof state | arXiv: [2306.15626](https://arxiv.org/abs/2306.15626) |
| Mechanistic World Models | Posner / Lei / Schölkopf | Reusable mechanisms as the unit of explanation, rather than predictive modules | arXiv:[2607.12474](https://arxiv.org/abs/2607.12474) |
| Automated basis generation for SINDy | Basiri & Nicholson | PySR → library → SINDy | arXiv:[2605.09696](https://arxiv.org/abs/2605.09696) |

<div id="801-the-gap-is-embodiment-not-awareness" class="anchor-alias" aria-hidden="true"></div>

### II.8.1 Historical lineage: compression beats enumeration

**Tycho Brahe → Kepler.** Brahe's program was high-fidelity enumeration. Kepler's three laws compressed those tables into predictive relations. Enumeration was necessary input; the law was the compressible object that stopped needing every future observation.

**Kepler → Newton.** Newton folded planetary regularities into invariants and closed forms (F=ma; universal gravitation). Predictive power migrated from case tables to formulas that travel. AI-Newton (Fang et al., arXiv:2504.01538) is a contemporary soft echo: concept libraries and general laws across many noisy mechanics experiments. There the network proposes and the law is the result.

**Invariants and closed forms.** Symmetry → conservation (Noether tradition), Hamiltonian/Lagrangian reduction, and integrals of motion are the mathematical-physics statement of "formula wins when grammar is covered." The Formula gear of Mixture of Limits is that tradition in a machine.

**Information theory and physical cost.** Shannon, Howard (VoI), Landauer, Bennett, Kolmogorov/Solomonoff/Chaitin, and Cover & Thomas form the chain of information, decision, and thermodynamic results in §II.8.0. Mixture of Limits binds them as named floors and labeled estimates. Landauer stamps on receipts are lower-bound estimates, not claims that silicon runs near the bound.

**Notational intelligence.** Lee's notational-intelligence claim is the frame for executable predicates; see [Part I](#part-i-the-commit-gate-notational-intelligence).

<div id="82-tier-a-detail-formula--mechanism--executable-physics" class="anchor-alias" aria-hidden="true"></div>

### II.8.2 Tier A detail: formula / mechanism / executable physics

From the workspace survey of 30 September 2026. Short readings:

1. **AI Feynman (+ 2.0):** Physics-inspired symbolic regression; NN for symmetries/separability, then recursive formula recovery. Canonical *Formula* gear.
2. **SINDy:** Sparse identification of nonlinear dynamics; explicit grammar + sparsity floor.
3. **PySR:** Evolutionary symbolic regression; distill NNs → closed forms.
4. **AI-Newton:** Concept-driven law discovery across noisy mechanics experiments.
5. **AlphaGeometry / AlphaProof:** LM proposes; verifier is the hard floor (propose → certify → commit|refuse template).
6. **Mechanistic World Models:** A related philosophy: reusable mechanisms are the unit of explanation.

Other systems in the survey (AtomAgents and SciAgents, KeplerAgent and NewtonBench, AI-Descartes, DreamCoder, Robot Scientist) are hybrids or mechanism libraries of the same kind.

**Mixture of Limits reading of Tier A.** Where a recovered formula or an executable mechanism covers the task, it closes with less spend than escalating tokens. That is a statement about cost on covered tasks. It is not a ranking of methods in general.

<div id="83-what-mixture-of-limits-adds" class="anchor-alias" aria-hidden="true"></div>

### II.8.4 Latent space: depth buys compression, not freedom from floors

A **latent space** is a compressed coordinate system for states that matter to a task: continuous vectors (dense embeddings), discrete codes (VQ / codebook indices), or hybrids. Depth in a latent buys what Shannon and Kolmogorov already price: a shorter description of structure that would otherwise be enumerated as raw observations, pixels, tokens, or traces. Autoencoders, VAEs, diffusion latents, and continuous reasoning traces are modern instances of that move. The representation can make Lookup hits cheaper, Formula edits local, and Solver landscapes smoother.

Representation is not law. A deeper latent does not erase the floors Mixture of Limits names:

1. **Value of Information (VoI).** Extra latent dimensions, longer continuous traces, or denser codebooks are more bits under a budget. When marginal latent bits do not change the decision benefit B, VoI says stop. Excess latent enumeration is the same failure mode as excess token enumeration, only in a different alphabet.
2. **Grammar coverage.** If Lookup, Formula, or Solver already covers the coordinate, opening a latent generator is waste. Covered grammar closes before Model. A latent that rediscovers a closed form is still Model residual when a Formula leaf was available.
3. **Energy / Landauer.** Encoding, decoding, denoising, and gradient edits on latents erase and rewrite information. Landauer prices irreversible erasure as a thermodynamic lower bound and appears on receipts as a **labeled estimate**. Catalog or OpCounter estimates for latent paths remain **Estimated** / **Unmetered** on the software reference path (`measured_j=None`).
4. **Certify-before-commit.** A low-energy latent state is a proposal until a certificate, settle, or typed refuse closes the act. The reference close still binds propose → certify → commit|refuse → receipt. Latent score ≠ irreversible commit.

**Teach-first takeaway.** Latent depth is a compression technology and a plateau option when Model is open. Mixture of Limits navigates whether that compression is cheapest-sufficient for the task, or whether refuse is the lawful success. See §II.8.7 (SOTA at the plateau) and §II.9: the question is whether a generator should run at all, then how little energy to spend on the plateau.

<div id="85-logical-intelligence-energy-based-reasoning-with-llms-and-latents" class="anchor-alias" aria-hidden="true"></div>

### II.8.5 Logical Intelligence: energy-based reasoning with LLMs and latents

**Logical Intelligence** (logicalintelligence.com) is a company building energy-based reasoning systems for constraint-heavy and mission-critical settings. Public materials (company blog and product pages, January 2026) teach a hybrid stack rather than a single chatbot:

- **Kona** is their core **energy-based model (EBM)** for reasoning (sometimes called an energy-based reasoning model, EBRM). An EBM assigns a scalar **energy** to a candidate state: low energy means more consistent with constraints and objectives; high energy means something is broken. Per their technical blog (Bodnia and Hanin, 21 Jan 2026), Kona is non-autoregressive at the *trace* level, globally scored over partial and complete traces, and reasons in a **continuous latent space** with dense vector tokens so local gradient-style edits can reduce constraint violations without regenerating an entire discrete prefix.
- **Aleph** is their orchestration / agentic layer that coordinates Kona, LLMs, and other tools. Public positioning: LLMs handle natural-language interface and candidate generation; the EBM layer evaluates and repairs under constraints. Aleph is also described as delivering verified / formal-reasoning workflows today (benchmark claims such as PutnamBench appear on their site; treat score numbers as **author-reported** unless independently reproduced here).
- Product framing on the Kona page: Kona is not marketed as a chatbot. Language models express and explore; Kona is positioned to evaluate what is valid or permissible before irreversible action in high-stakes domains (company examples include energy, manufacturing, semiconductor verification, robotics). Kona 1.0 was announced for partner pilots (company and press materials, Jan 2026). Leadership publicly listed includes founder and CEO Eve Bodnia and Yann LeCun as founding chair of a technical research board (company site / press).

**Classical EBM backdrop (established ML architecture).** Energy-based models treat inference as finding low-energy configurations under a learned energy function. That framing is older than any one product; LeCun and others have long argued that reasoning can be cast as optimization over an energy landscape. Logical Intelligence's public thesis is that discrete, locally scored, autoregressive LLM traces scale poorly for long-horizon constraint satisfaction, and that continuous, globally scored EBM traces address that gap when paired with LLMs for interface.

**Mixture of Limits reading (cascade map, not a product endorsement).**

| Logical Intelligence public piece | Cascade rhyme | Floor that still binds |
|---|---|---|
| Continuous latent trace + energy score | Soft rhyme with **Solver / settle**: optimize / repair under constraints | `settle_refuse`, VoI, energy estimate; low energy ≠ board joules |
| LLM for language / candidates | **Model** residual for expression and proposal | The last cascade stage; `ModelGenerated` ↛ `Deterministic` |
| Aleph orchestration among tools | Cheapest-sufficient routing among gears | Grammar coverage first; refuse when escalation is VoI-negative or unsafe |
| Constraint / proof-oriented close | Certify-before-commit spirit | Certificate / typed refuse before irreversible act |

Verified here: the public architecture story and the cascade map: energy-based settle can rhyme with Solver; LLM residual stays the last cascade stage; latents do not erase VoI or Landauer floors. Author-reported latency and Sudoku figures stay field results (not Mixture of Limits `measured_j`). Internal training details, unpublished energy functions, and claims about general intelligence are outside this paper.

<div id="851-embodiment-classes-the-convergence-is-hybrid-interplay" class="anchor-alias" aria-hidden="true"></div>

### II.8.6 World Labs: spatial intelligence and world models

**World Labs** (worldlabs.ai) is a frontier research and product company focused on **spatial intelligence**: models that perceive, generate, reason about, and interact with virtual and physical worlds across space and time. Co-founders publicly include Fei-Fei Li, Justin Johnson, Ben Mildenhall, and Christoph Lassner (company About page).

**Teach the products and architecture first (public sources).**

- **Marble** is their first product: generative 3D world models that create spatially coherent, persistent 3D worlds from images, video, text, and 3D layouts (company About).
- **Atlas** (company blog, 1 Sep 2026) is described as an omni **world model** pretrained to operate on text, images, video, and 3D. Architecture: a **multimodal autoregressive diffusion transformer**. Inputs are grounded in 3D to form a shared **spatial context**; the model generates what comes next while aiming for 3D consistency with what it has seen, and imagining what lies beyond. Public capability claims include camera-controlled video generation, sparse-view spatial reconstruction (including explicit 3D such as point clouds / Gaussian splats), space-time simulation for Real-to-Sim robotics workflows, and image / 360 generation. Atlas is positioned to power future Marble versions and is in early access with select partners. Author-reported benchmarks on camera-conditioned generation and 3D reconstruction appear on the Atlas post; cite the architecture and task list here, not those numbers as OpenIE measurements.

Fei-Fei's public spatial-intelligence framing (including the "from words to worlds" thesis) states that world models must handle semantic, physical, geometric, and dynamic complexity beyond today's LLM text corridor. That is a generator-class ambition: better world generators and simulators.

**Mixture of Limits reading: world models meet the same floors.**

1. **Grammar coverage.** Faithful reconstruction from enough views is not the same as a closed predictive law for a task. When a Formula or Lookup already answers the coordinate, generating a world is excess. Imagination that fills unseen regions is generative residual, not Deterministic commit.
2. **Certify-before-commit.** A spatially consistent video or splat is a proposal about geometry and appearance. Irreversible acts (robot motion, financial or safety-critical side effects) still require certify → commit|refuse → receipt. ReplayClass typing still applies: generative world output does not launder into Deterministic without a certificate path.
3. **VoI and energy.** Longer videos, denser 3D contexts, more denoising steps, and Real-to-Sim rollouts spend bits and joules. VoI stops when extra world detail does not change the decision benefit. Landauer bounds irreversible erasure as a labeled estimate; Atlas / Marble training or inference joules are field / author-reported, not Mixture of Limits `measured_j`.

World Labs systems optimize **which world generator / simulator runs** and how well it tracks space. Mixture of Limits asks whether that generator should run for the stated benefit, and which named floor closes first. See §II.9 for the comparison with MoE.

<div id="87-sota-at-the-plateau-voi-zero-past-the-floor" class="anchor-alias" aria-hidden="true"></div>

### II.8.7 SOTA at the plateau: VoI zero past the floor

**Plateau thesis.** Once the floor is known and Value of Information is zero past it, additional tokens, parameters, latent depth, or thinking steps do not purchase verifiable progress on the task coordinate. The only remaining work is **optimize energy and compute on that plateau**: cheapest-sufficient Lookup → Formula → Solver/settle → Model, with refuse as lawful success when escalation is VoI-negative or unsafe.

Latent compression, EBM settle hybrids (Logical Intelligence), spatial world models (World Labs), test-time compute, super learning, SSM hybrids, mixture of experts, speculative decode, RAG, transmission / gearing / cascade / memory-context methods, and the cross-field plateau moves of §II.8.14 can each be projected as superior *inside* a generative or hybrid corridor for their stated jobs. Superiority on the plateau does not cancel Shannon pricing of bits, Howard pricing of VoI, Landauer pricing of irreversible erasure, or certify-before-commit. Those methods are **implementation options for plateau spend**: how to spend less energy or move fewer bits once Model is the residual leaf. They are not a ranking of brands. The useful race is toward the floors.

Mixture of Limits is the **navigation rule** that names the floors, finds the plateau, and binds the cascade. `mol prove` remains constructive existence **in software**. No figure in this survey, whether from Logical Intelligence, World Labs, or OpenIE, sets `measured_j` on a Mixture of Limits receipt.


<div id="88-test-time-compute-as-plateau-spend" class="anchor-alias" aria-hidden="true"></div>

### II.8.8 Test-time compute as plateau spend

**Teach first.** **Test-time inference** (also called **test-time compute**) means spending additional computation *after* training, when answering a query: longer **chain-of-thought** (CoT) traces, search over candidate solutions, **majority vote** across samples, verifier-guided selection, or **process reward** scoring of intermediate steps. OpenAI's o1 / o3-style systems popularized sequential scaling of reasoning traces at inference (OpenAI, "Learning to reason with LLMs," 2024). Related process supervision trains reward models on step-level labels rather than only final answers (Lightman et al., "Let's Verify Step by Step," arXiv:2305.20050; ICLR 2024). Parallel strategies sample many short traces and aggregate; sequential strategies extend one long trace. Surveys of inference-time scaling for complex tasks document both families and their dependence on verifier quality (e.g. arXiv:2504.00294).

Extra thinking tokens are treated as a new scaling axis parallel to training tokens and parameters. That axis is real as *engineering*: longer verified search can raise accuracy on hard problems when the verifier is good and the budget is spent on the right difficulty band. Empirical work on o1-like models also shows diminishing returns, overthinking, and cases where longer CoTs degrade accuracy or where parallel majority-style methods scale better than unbounded sequential length (e.g. ACL 2025 findings on o1-like test-time scaling; related overthinking analyses).

**Mixture of Limits reading.** Extra inference tokens are still bits under a budget.

1. **Value of Information (VoI).** Another thinking step is another observation about an internal search state. When the marginal step does not change the decision benefit B, VoI says stop. Majority vote that re-samples without changing B fails the same test.
2. **Grammar coverage.** If Lookup, Formula, or Solver already covers the coordinate, opening a long CoT generator is waste. Covered grammar closes before Model.
3. **Energy / Landauer.** Every additional sampled token and every verifier forward pass erases and rewrites information. Landauer prices irreversible erasure as a thermodynamic lower bound and appears on receipts as a **labeled estimate**. Catalog or OpCounter estimates for test-time paths remain **Estimated** / **Unmetered** on the software reference path (`measured_j=None`).
4. **Certify-before-commit.** A process-reward score or majority winner is a proposal until certify → commit|refuse → receipt. ReplayClass typing still applies: a long reasoning trace does not launder into `Deterministic` without a certificate path.

**Teach-first takeaway.** Test-time compute is a plateau spend knob inside the generative corridor. Mixture of Limits navigates whether that budget should open at all, then how little thinking to spend once VoI is zero past the floor. More thinking steps are not free of VoI, grammar, energy, or certify floors.

<div id="89-super-learning-as-plateau-ensemble-spend" class="anchor-alias" aria-hidden="true"></div>

### II.8.9 Super learning as plateau ensemble spend

**Teach first (academic term).** **Super learning** (also called the **super learner**) is a cross-validated ensemble / stacking method from targeted learning: fit a library of candidate algorithms, collect out-of-fold predictions, then learn a meta-learner that combines them to minimize cross-validated risk (van der Laan, Polley, and Hubbard, 2007; Polley and van der Laan, "Super Learner In Prediction," U.C. Berkeley Biostatistics Working Paper 266). It is related to stacking as introduced by Wolpert (1992) and adapted by Breiman (1996). A discrete super learner selects the single best candidate by cross-validated risk; an ensemble super learner learns weights (often non-negative and summing to one) over candidates. The oracle results for cross-validation selectors underwrite asymptotic optimality *relative to the library*, not freedom from information or energy floors.

**A note on the name.** Super learning is the van der Laan estimator: a cross-validated stack. It is unrelated to talk of "superintelligence."

**Mixture of Limits reading.** Ensembles and stacks are still Model-class residual when they generate; when they combine deterministic candidates they still face VoI and certify limits.

1. **VoI.** Another base learner or another fold is another observation. When the meta-learner cannot change B, stop.
2. **Grammar.** If Formula or Lookup covers the coordinate, stacking neural candidates is excess enumeration under a different name.
3. **Energy labels.** Training and evaluating a library multiplies forward passes. Estimates remain estimates; reference ensembles keep `measured_j=None`.
4. **Certify.** A stacked prediction is still a proposal until a certificate or typed refuse closes the act. Oracle optimality inside a library does not coerce `ModelGenerated` to `Deterministic`.

**Teach-first takeaway.** Super learning is cross-validated ensemble selection, a plateau option for combining residual leaves. Mixture of Limits maps it onto floors: better combination on the plateau does not retire VoI, grammar, energy, or certify.

<div id="810-live-sota-methods-for-plateau-energycompute-20252026" class="anchor-alias" aria-hidden="true"></div>

<div id="ii810-live-sota-methods-for-plateau-energycompute-20252026" class="anchor-alias" aria-hidden="true"></div>

### II.8.10 Live SOTA methods for plateau energy/compute (2025 to 2026)

Each row is a verified **implementation option for plateau spend**: teach the technique once with a cite, then one Mixture of Limits floor sentence. Author-reported speedups and benchmark scores are **field results**, distinct from OpenIE software reference measurements.

| Approach | What it is (teach once) | Verified cite | Floor that still binds |
|---|---|---|---|
| **Speculative decoding** | A small **drafter** proposes several tokens; the large **target** model verifies them in parallel, preserving the target distribution while cutting serial decode steps | Leviathan, Kalman, and Matias, "Fast Inference from Transformers via Speculative Decoding," ICML 2023 (PMLR); Li et al., **EAGLE**, ICML 2024 (arXiv:2401.15077); see also §II.9 HCSpec / CAS-Spec | Speeds generation; does not refuse generation when VoI or grammar says stop |
| **Mixture-of-Depths (MoD)** | Per-layer top-$k$ routing so only a budgeted subset of tokens enter attention/MLP at each depth; residual skip for the rest (static compute graph, dynamic token compute) | Raposo et al., "Mixture-of-Depths: Dynamically allocating compute in transformer-based language models," arXiv:2404.02258 (2024) | Adaptive depth *inside* the generator; not Lookup→Formula→Solver refuse outside generation |
| **Weight / activation quantization** | Post-training low-bit weights (and sometimes activations): **GPTQ** (second-order PTQ), **AWQ** (activation-aware weight scaling), **FP8** / INT8 / INT4 serving formats | Frantar et al., GPTQ, arXiv:2210.17323; Lin et al., AWQ, MLSys 2024 (arXiv:2306.00978); Micikevicius et al., FP8 formats (NVIDIA, 2022) | Cheaper plateau bits per weight; does not invent VoI stop or certify-before-commit |
| **Inference engines (KV systems)** | Serving runtimes that page and reuse KV cache: **vLLM** / PagedAttention; **SGLang** / RadixAttention for structured LM programs and prefix reuse | Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention," arXiv:2309.06180 (vLLM); Zheng et al., SGLang, arXiv:2312.07104 | Systems efficiency on the plateau; still serves generators; floors decide whether to open decode |
| **Mixture of experts (MoE)** | Sparse gating routes each token to a few expert feed-forward modules so total parameters grow faster than active compute | Shazeer et al., "Outrageously Large Neural Networks," ICLR 2017 (arXiv:1701.06538); Lepikhin et al., GShard, 2020 (arXiv:2006.16668); Fedus et al., Switch Transformers, JMLR 2022 | Capacity *inside* the generative corridor; Mixture of Limits floors live *outside* generation (§II.2, §II.9) |
| **State-space models (SSMs)** | Sequence models with a compact recurrent state and near-linear scaling in context (selective SSM / **Mamba**) as an alternative or complement to attention | Gu and Dao, "Mamba: Linear-Time Sequence Modeling with Selective State Spaces," arXiv:2312.00752 (2023); Gu, Goel, and Ré, S4, ICLR 2022 | Efficient sequence leaf; still the last cascade stage when used as generator; VoI and certify unchanged |
| **Retrieval-augmented generation (RAG)** | Retrieve documents from an external index, then condition the generator on those passages so knowledge need not live only in weights | Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," NeurIPS 2020 (arXiv:2005.11401) | Retrieval can rhyme with Lookup when the hit is certified; uncertified retrieved text remains proposal, not Deterministic commit |
| **Reasoning models / CoT scaling** | Models trained or prompted to emit long intermediate reasoning (o1/o3-style, DeepSeek-R1, QwQ, and cousins) | OpenAI o1 public writeup (2024); DeepSeek-AI et al., DeepSeek-R1 technical report (2025); §II.8.8 | Extra reasoning tokens still hit VoI and energy floors; longer is not always better |
| **Diffusion language models** | Discrete or continuous **diffusion** denoising over tokens or latents rather than purely left-to-right next-token prediction (e.g. score-entropy discrete diffusion) | Lou, Meng, and Ermon, "Discrete Diffusion Modeling by Estimating the Ratios of the Data Distribution" (SEDD), ICML 2024 (PMLR v235) | Denoising steps spend bits and joules; Landauer remains a labeled estimate only; certify before commit |
| **Linear attention / retention variants** | Attention alternatives with linear or chunkwise cost for long context (e.g. **Retentive Network / RetNet** multi-scale retention) | Sun et al., "Retentive Network: A Successor to Transformer for Large Language Models," arXiv:2307.08621 (2023) | Cheaper long context is algorithmic efficiency; floors still stop when VoI or grammar is covered |

**Teach-first takeaway.** Every live SOTA method above optimizes *how* a generator runs or *which* parameters activate on the plateau. Mixture of Limits asks whether the generator should run for the stated benefit, which named floor closes first, and, once VoI is zero past that floor, how to spend least energy/compute on the plateau (Lookup → Formula → Solver → Model).

<div id="8101-adaptive-depth-precision-and-serving-as-plateau-levers" class="anchor-alias" aria-hidden="true"></div>

### II.8.10.1 Adaptive depth, precision, and serving as plateau levers

Three complementary plateau levers sit beside MoE and speculative decode:

1. **Mixture-of-Depths** (Raposo et al., arXiv:2404.02258) learns which tokens need full block compute and which may residual-skip under a fixed FLOP budget. That is generator-internal cheapest-sufficient *depth*, a rhyme with Mixture of Limits cascade, not a substitute for floors outside generation.
2. **Quantization** (GPTQ, AWQ, FP8/INT families) moves fewer bits per weight and raises arithmetic intensity on memory-bound decode. Author-reported speedups and perplexity deltas are field results; software reference receipts keep Landauer as a labeled estimate and `measured_j=None` unless Metered.
3. **Inference engines** (vLLM PagedAttention; SGLang RadixAttention) refuse waste of fragmented KV and repeated prefix compute. That is transmission / memory economics at the serving layer (§II.8.13), still under the last cascade stage when the cascade opens the generator.

**Floor bind.** Adaptive depth, lower precision, and better KV paging optimize plateau spend. They do not retire VoI, grammar coverage, certificate, or settle-refuse.

<div id="811-ssm-hybrids-moe-and-implementation-efficiency-on-the-plateau" class="anchor-alias" aria-hidden="true"></div>

### II.8.11 SSM hybrids, MoE, and implementation efficiency on the plateau

**Plateau options (verified methods, not a brand race).** Once Model is the residual leaf and VoI is zero past the floor, SOTA at the plateau means spend less energy and move fewer bits for the same certified benefit. The following are implementation options:

- **State-space models (SSMs) / Mamba.** Selective state-space sequence models with linear-time scaling in context (Gu and Dao, 2023; Gu, Goel, and Ré, S4, ICLR 2022). Plateau use: cheaper long-context sequence leaf under the last cascade stage.
- **SSM + attention + MoE hybrids (Jamba-class).** Interleaved Transformer attention and Mamba layers, plus mixture-of-experts on some MLPs, aimed at high throughput and a smaller key-value cache on long contexts (Lieber et al., "Jamba: A Hybrid Transformer-Mamba Language Model," arXiv:2403.19887; Jamba-1.5, arXiv:2408.12570). Plateau use: cut memory and raise throughput for long generative contexts. Author-reported benchmark and throughput numbers are **field results**, not Mixture of Limits `measured_j`.
- **Fine-grained MoE + systems co-design (DeepSeek-class).** DeepSeekMoE (Dai et al., ACL 2024) and DeepSeek-V3 (DeepSeek-AI, arXiv:2412.19437) combine fine-grained MoE, multi-head latent attention, and systems co-design (including reported FP8 mixed-precision training and pipeline overlap). DeepSeek-R1 applies large-scale reinforcement learning for reasoning traces on that efficient base. Plateau use: lower active compute and training/inference cost per benefit. Treat GPU-hour and benchmark figures as **author-reported**, not software reference meters.
- **MoE reasoning / agentic releases (GLM-class).** GLM-4.5 and related Zhipu / Z.ai releases (arXiv:2508.06471) use large total parameter counts with smaller active counts per token, plus agentic / reasoning post-training. Plateau use: active-parameter efficiency on available silicon. Scores and active-parameter claims are field/author-reported.

Related plateau levers (quantization, speculative decoding, training-systems overlap) appear again in §II.8.10 and §II.8.13. Vendor ranking is out of scope.

**Mixture of Limits reading.**

1. SSM hybrids and MoE routing are legitimate plateau efficiency leaves. They remain generators. Floors still bind.
2. **Implementation efficiency** (algorithms, precision, routing, RL post-training) lowers device-dollar and joule cost on the plateau. That is applied engineering, not a repeal of Shannon, Howard, or Landauer.
3. No architecture announcement retires VoI, grammar coverage, labeled energy estimates, or certify-before-commit. Jamba / DeepSeek / GLM joules remain field / author-reported.

**Teach-first takeaway.** SOTA at the plateau is optimize energy/compute with cheapest-sufficient cascade. SSM hybrids, MoE, and systems co-design are how field stacks spend less once the floor is known, not a narrative about which brand won.

<div id="812-hardware-economics-plateau-spend-on-real-devices" class="anchor-alias" aria-hidden="true"></div>

<div id="ii812-hardware-economics-plateau-spend-on-real-devices" class="anchor-alias" aria-hidden="true"></div>

### II.8.12 Hardware: plateau spend on real devices

**The hardware premise of this study.**

1. **Computers are hardware.** Every program runs on materials and devices: gates, memory, interconnects, power delivery, cooling. There is no software that escapes physics.
2. **Software is written for hardware.** Instruction sets, memory hierarchies, batch sizes, and quantization schemes exist because of devices. Software is **human applied engineering** under constraints. It is not a separate realm detached from devices, yield, and joules.
3. **Plateau efficiency margins remain.** Inefficient deployment on the newest hardware leaves room. Optimized algorithms, MoE routing, training-systems co-design, and inference tricks on older or cheaper accelerators extract more work per device on the plateau. DeepSeek / GLM-class implementation efficiency (§II.8.11) and speculative decoding / quantization stacks (§II.8.10) are instances. Vendor scoreboards are field reports, not OpenIE meters.
4. **Mixture of Limits reading.** Plateau options (SSM hybrids, mixture of experts, test-time compute, diffusion language models, linear attention, retrieval-augmented generation, world models, energy-based hybrids) do not retire floors. The hard part remains **applied mathematics embodied in materials and devices**, plus labeled joule accounting. Algorithmic efficiency is real, and it is why floors matter: once VoI is zero past the floor, cheaper implementations are the remaining work, and they still stop when VoI, grammar, or energy says stop. Estimates (`estimated_j`, Landauer as a labeled estimate) are not board energy.

**Edge / TinyML floors (verified cites).** Coin-cell and MCU closes are not tiny transformers by default. MCUNet co-designs TinyNAS + TinyEngine for ImageNet-class inference on microcontrollers (Lin et al., NeurIPS 2020, arXiv:2007.10319). T-MAC accelerates low-bit LLM matmul on edge CPUs via table lookup without dequantization (Wei et al., arXiv:2407.00088). Mixture of Limits reading: Formula+LUT refuse under device SRAM/Flash is the lawful edge close; a quantized residual Model leaf is still the last cascade stage.

**Neuromorphic and thermodynamic substrates.** Loihi-2 neuromorphic mapping of a MatMul-free LLM reports author-estimated throughput and mJ/token vs edge-GPU transformers (Abreu et al., arXiv:2503.18002). These are field silicon results, not Mixture of Limits `measured_j`. Digital thermodynamic computers for generative sampling (for example CN101, Holdijk et al., arXiv:2608.00754) correspond to the reference's `ThermoSettle` device kind; their joules stay field results until a meter is attached. Bennett's reversible computing is settled theory (§II.8.0); reversible ASIC products are outside the scope of `mol prove`.

**Bridge.** §II.8.12 adds the hardware corollary: plateau techniques extract more work per device, and Mixture of Limits binds that spend to floors when more work buys nothing. They make a generator cheaper to run; they do not decide whether it should run.

<div id="8121-hardware-paired-navigation-20252026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="ii8121-hardware-paired-navigation-20252026-peers" class="anchor-alias" aria-hidden="true"></div>

### II.8.12.1 Hardware-paired navigation (2025 to 2026 peers)

Mixture of Limits is not a software-only order. Navigation is Lookup → Formula → Solver → Model **on hardware that is available, accessible, and capable**. Hooker's hardware lottery remains an established result: ideas look like progress when they fit installed chips and kernels (Hooker, 2021; [doi:10.1145/3467017](https://doi.org/10.1145/3467017)).

Recent field work strengthens the pairing without replacing the navigation rule. Huang et al. (arXiv:2507.19142, Jul 2025), **A3D-MoE**, co-design MoE routing with 3D heterogeneous integration, score-aware HBM access, and attention-MoE fusion; author-reported energy cuts of about 2× to 4× are **their** architecture result, not a `measured_j` reading of this paper. Chung, Wu, Ma, and Chowdhury (arXiv:2601.22076, 2026), **Where Do the Joules Go?**, measure 1,858 inference configurations on H100/B200 and map energy to latent factors across algorithm, software, and hardware layers. Task type alone can swing LLM energy per response by about 25×. That is plateau diagnosis of spend on available fabric. It is not Lookup → Formula → Solver refuse.




<div id="813-plateau-techniques-transmission-gearing-cascade-memorycontext-test-time" class="anchor-alias" aria-hidden="true"></div>

### II.8.13 Plateau techniques: transmission, gearing, cascade, memory/context, test-time

**Thesis of this section (SOTA at the plateau).** Public research programs optimize **transmission** (how bits move through attention, KV cache, and interconnect), **gearing / MoE routing** (which expert / path / attention mode fires), **cascade** (early-exit prefill, self-decoder then cross-decoder; Lookup→Formula→Solver→Model as OpenIE order), **memory/context** (long-horizon KV, conditional memory, hybrid attention windows), and **test-time** (reasoning budgets, multi-token prediction, speculative decode) under hardware and economic constraints. That is **plateau spend**: algorithmic efficiency on available silicon once Model is open. These programs approach Mixture of Limits ideas, such as using the cheapest sufficient compute and refusing waste of HBM, SSD, or prefill FLOPs, without stating a floor outside the model. Author-reported FLOPs and cache bytes are **field results**, not Mixture of Limits `measured_j`. Labs are cited by method, as sources of plateau techniques.

Teach the shared primitives before the technique sections:

| Primitive | Meaning in this survey | Floor bind |
|---|---|---|
| **YOCO** (You Only Cache Once) | Decoder-decoder layout: a self-decoder builds shared global KV once; a cross-decoder reuses it via cross-attention; prefill can early-exit after the self-decoder (Sun et al., NeurIPS 2024; arXiv:2405.05254) | Cuts KV memory and prefill work; still a generator architecture; VoI / grammar / certify floors remain |
| **HySparse2** | Hybrid sparse attention with two-level KV sharing: outer KV Bridging (YOCO-style self-/cross-decoder, full-attention layers only) plus inner KV Reuse (sparse layers reuse full-attention KV and token-level top-k); prefill exits after the self-decoder (Wei, Gao, …, Luo / Xiaomi LLM-Core; arXiv:2609.26368) | Compresses long-context transmission cost; does not invent a refuse floor outside generation |
| **CSA2 / CED** | DeepSeek-V4.1-Flash: Causal Encoder-Decoder (CED, YOCO-inspired) plus Compressed Sparse Attention 2 (Full / Reindex / Reuse modes, hierarchical sparse indexer, FP4 main KV) | Extreme KV and prefill compression for agents; still MoE generation |
| **MoE routing** | Gate selects a small active expert set per token (DeepSeekMoE, Qwen MoE, Kimi, Sarvam, Solar, …) | Gearing inside the generative corridor: cheaper than dense, not Mixture of Limits floors |
| **MTP / speculative path** | Multi-token prediction or draft modules densify training and accelerate decode | Test-time / decode gearing; energy and VoI floors still bind |
| **Prefix-cache reuse** | A session that keeps its prompt prefix reuses cached KV instead of recomputing prefill; a session that breaks reuse recomputes it. | Cheapest-sufficient transmission; a broken prefix is escalated generative work, not a certified refuse |

<div id="8131-transmission-attention-kv-cache-and-interconnect-cost" class="anchor-alias" aria-hidden="true"></div>

#### II.8.13.1 Transmission: attention, KV cache, and interconnect cost

**YOCO → CED / CSA2 (DeepSeek-V4.1-Flash).** YOCO showed that caching global KV once and early-exiting prefill after a self-decoder cuts memory and latency by orders of magnitude on long contexts (Sun et al., 2024; arXiv:2405.05254). DeepSeek-V4.1-Flash pushes that lineage into agent workloads: a multimodal MoE with 552B backbone parameters, up to **1M** context, Causal Encoder-Decoder (CED) activating **8B** parameters per token in prefill and **16B** in decode, Compressed Sparse Attention 2 (CSA2) with Full / Reindex / Reuse modes, FP4 main KV, SWA Bounded Replay, Engram conditional memory, and DSpark speculative decoding (DeepSeek-AI, arXiv:2609.19969; weights at [huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)). Author-reported global KV footprint is **890 bytes/token** (~1/4 of V4-Flash); persistent KV with SWA Bounded Replay ~1/8 of V4-Flash. That is **transmission** law under HBM/SSD constraints, not a board joule claim.

**HySparse2 (Xiaomi LLM-Core).** HySparse2 (Wei, Gao, …, Cao, Luo / Xiaomi LLM-Core, arXiv:2609.26368) teaches two-level KV sharing for long-horizon agents: KV Bridging (YOCO-style) so prefill can exit after the self-decoder, plus KV Reuse with **token-level** sparse selection and a forced local window (no separate SWA branch in sparse layers). On matched 80B-A3B MoE ablations, author-reported 1M-token prefill FLOPs drop ~2.92× vs HySparse and ~5.02× vs Hybrid SWA; KV cache ~2.69 GB vs 6.72 / 12.09 GB. Transmission compression under device memory. It is still a generator stack.

**Prefix-cache reuse.** Reusing a cached prompt prefix is cheapest-sufficient transmission: the KV for the prefix is read, not recomputed. When reuse breaks, prefill is recomputed, and that spend is still generative corridor work, not a certified refuse.

**Interconnect locality (Huawei LocMoE / PanGu-Σ).** LocMoE reduces MoE communication overhead on Ascend clusters (IJCAI 2024; arXiv:2401.13920). PanGu-Σ targets sparse trillion-scale sparse heterogeneous compute (arXiv:2303.10845). **Floor bind:** routing locality as transmission cost on available accelerators: hardware economics, not software reference joules.

<div id="8132-gearing--moe-routing-which-expert-or-path-fires" class="anchor-alias" aria-hidden="true"></div>

#### II.8.13.2 Gearing / MoE routing: which expert or path fires

**DeepSeekMoE / V3.** DeepSeek-V3 is a Mixture-of-Experts (MoE) language model with 671B total parameters and 37B activated per token, using Multi-head Latent Attention (MLA), DeepSeekMoE routing, auxiliary-loss-free load balancing, and a Multi-Token Prediction (MTP) training objective that can also support speculative decoding (DeepSeek-AI, arXiv:2412.19437; earlier DeepSeekMoE at ACL 2024). That is **gearing**: only a sparse expert path runs per token. It approaches cheapest-sufficient *inside* generation.

**Xiaomi MiMo (hybrid attention + MoE).** Xiaomi's public LLM line is **MiMo**. MiMo-7B is a dense reasoning model pretrained on ~25T tokens with MTP and RL post-training (Xiaomi LLM-Core, arXiv:2505.07608). MiMo-V2-Flash is a 309B-total / 15B-active MoE with hybrid Sliding-Window Attention (SWA) and global attention (5:1, 128-token window), MTP reused as speculative draft, native context extended to 256K (arXiv:2601.02780). Public reporting attributes MiMo V3’s intended architecture to HySparse2 under Xiaomi MiMo lead Fuli Luo (team materials / TechNode 2026-09-24; HySparse2 paper authorship). V3 product status is a field announcement until a full V3 technical report is published; the routing, staging, and transmission claims here rest on the HySparse2 paper. **Floor bind:** Xiaomi compresses long-context transmission and prefill cascade under device memory (cheapest-sufficient, adjacent to Mixture of Limits) while remaining MoE/hybrid-generator first.

**Qwen / Alibaba.** Qwen3 MoE uses fine-grained expert segmentation (e.g. 128 experts, 8 active; no shared experts in the Qwen3 MoE design) plus a unified thinking / non-thinking mode and thinking-budget control (Qwen Team, arXiv:2505.09388). Qwen3-Next further sparsifies (public Alibaba materials: hybrid attention, highly sparse MoE, MTP). **Floor bind:** gearing + test-time budget, still generative; budget is not VoI refuse outside the model.

**GLM / Zhipu.** Already in §II.8.11: GLM-4.5 MoE reasoning / agentic releases (arXiv:2508.06471). **Floor bind:** active-parameter efficiency on silicon; floors outside generation remain Mixture of Limits law.

**Moonshot / Kimi.** Kimi K2 is a ~1.04T-total / ~32B-active MoE with MLA-class attention and MuonClip training (MoonshotAI, arXiv:2507.20534). **Floor bind:** extreme sparse gearing; agentic length still hits energy/VoI.

**Sarvam.** Sarvam-30B is a public MoE (≈30B total / ≈2.4B active; 128 sparse experts + shared expert; top-6 routing; GQA) aimed at multilingual / Indic-language reasoning with efficient deployment (Sarvam model card / docs; Hugging Face `sarvamai/sarvam-30b` config). **Floor bind:** expert gearing for multilingual benefit under smaller active FLOPs.

**Other sourced MoE / efficiency lines (routing-relevant only).**
- **Baichuan.** Baichuan 2 public report is dense 7B/13B training systems work (arXiv:2309.10305). Include it only as efficiency-under-hardware, not as MoE routing. **Floor bind:** systems gearing ≠ Mixture of Limits cascade.
- **ByteDance Seed.** Public Seed / Doubao lines emphasize long-context and agent products. Where MoE or sparse attention is documented, bind as generative gearing under §II.8.12 economics.
- **SB Intuitions (SoftBank group).** Sarashina2-8×70B is a Japanese MoE upcycled from Sarashina2-70B (8 experts, top-2 active; public SB Intuitions release 2024). **Floor bind:** sparse gearing under language-local silicon economics.
- **Upstage.** Solar Open / Solar Open 2 public MoE lines (e.g. ~100B-class with ~12B active; later ~250B / ~15B active with hundreds of routed experts; arXiv:2601.07022 and Upstage blogs). **Floor bind:** MoE gearing on constrained GPU budgets.
- **Krutrim.** Public Krutrim LLM technical report describes a dense multilingual foundational model (arXiv:2502.09642). It is **not** an MoE routing paper.
- **AI4Bharat.** Strong open Indic datasets and benchmarks (e.g. IndicXTREME / related suites) that other systems evaluate against. They are infrastructure for grammar coverage of Indic languages, not a MoE router itself.

<div id="8133-cascade-early-exit-prefill-and-staged-decode-paths" class="anchor-alias" aria-hidden="true"></div>

#### II.8.13.3 Cascade: early-exit prefill and staged decode paths

Cascade here means staged work: finish a cheaper stage, then optionally open a costlier one: self-decoder then cross-decoder; prefill then decode; or Lookup→Formula→Solver→Model.

- **YOCO / CED early-exit.** Prefill can exit after the self-decoder once global KV is built (Sun et al., 2024; DeepSeek-V4.1-Flash CED). That is a generator-internal cascade that refuses *waste of prefill FLOPs*, not a VoI refuse outside generation.
- **HySparse2 prefill exit.** Same YOCO-style exit after KV Bridging; author-reported 1M-token prefill FLOPs compressions above (§II.8.13.1).
- **CED active-parameter schedule.** DeepSeek-V4.1-Flash activates **8B** per token in prefill and **16B** in decode: a cascade of capacity with stage, still MoE generation.
- **Contrast.** Mixture of Limits cascade is Lookup → Formula → Solver/settle → Model with typed refuse. Field cascades above densify or sparsify *generation*; they do not certify commit|refuse before irreversible effect.

<div id="8134-memory--context-long-horizon-kv-and-conditional-memory" class="anchor-alias" aria-hidden="true"></div>

#### II.8.13.4 Memory / context: long-horizon KV and conditional memory

- **DeepSeek-V4.1-Flash.** 1M context; FP4 main KV; **890 bytes/token** global KV; SWA Bounded Replay; Engram conditional memory (arXiv:2609.19969). Memory/context is becoming first-class; settle-refuse and VoI outside generation are not.
- **Xiaomi MiMo / HySparse2.** MiMo-V2-Flash native context to 256K with hybrid SWA/global attention; HySparse2 author-reported KV cache ~2.69 GB at 1M tokens on the matched MoE ablation (vs 6.72 / 12.09 GB baselines).
- **NAVER HyperCLOVA.** HyperCLOVA X THINK technical materials emphasize reasoning / long context (arXiv:2506.22403). Include them as a context / test-time path, not as MoE gearing unless a MoE card is cited.
- **Floor bind.** Compressing KV and extending context refuses waste of HBM/SSD under silicon constraints (adjacent to Mixture of Limits on transmission). The decision to open the generator still sits outside these designs.

<div id="8135-test-time-reasoning-budgets-and-speculative-paths" class="anchor-alias" aria-hidden="true"></div>

#### II.8.13.5 Test-time: reasoning budgets and speculative paths

**DeepSeek-R1 (test-time reasoning path).** DeepSeek-R1 incentivizes reasoning via large-scale reinforcement learning (RL), with R1-Zero showing emergent reflection/verification behaviors and R1 adding cold-start data plus multi-stage training; public report arXiv:2501.12948, with a Nature paper (Guo et al., 2025, DOI [10.1038/s41586-025-09422-z](https://doi.org/10.1038/s41586-025-09422-z)). R1 dynamically allocates more reasoning tokens to harder problems (a test-time cascade) while still overthinking on easy items. Mixture of Limits reading: longer chains are not free of VoI or energy floors (§II.8.8).

**MTP / speculative decode.** DeepSeek-V3 MTP and DeepSeek-V4.1-Flash DSpark; MiMo MTP reused as speculative draft; Qwen3-Next MTP. All are decode gearing inside the generative corridor.

**Qwen thinking budget.** Unified thinking / non-thinking mode with thinking-budget control (arXiv:2505.09388): a test-time spend knob, not VoI refuse outside the model.

**HyperCLOVA X THINK.** Reasoning / long-context materials (arXiv:2506.22403): a test-time / context path as above.

**Floor bind (DeepSeek, across releases).** DeepSeek repeatedly removes *waste of KV, prefill, and active parameters* while total MoE capacity keeps growing. Memory and context are becoming first-class; settle refuse and VoI outside generation are not.

**Section close.** Across these sources, the convergent plateau move is: move fewer bits (YOCO / CED / HySparse2 / FP4 KV), fire fewer experts (MoE), and spend test-time tokens where difficulty rises (R1 / thinking budgets). These are SOTA energy/compute options on available silicon. That converges toward the Mixture of Limits **floors** (stop waste; cheapest sufficient Lookup → Formula → Solver → Model) without stating VoI, grammar, certificate, or settle refuse as rules. Author-reported KV bytes are field reports, not `measured_j`.



<div id="814-race-to-the-plateau-floors-across-aiml-fields" class="anchor-alias" aria-hidden="true"></div>

<div id="ii814-race-to-the-saturation-points-across-aiml-fields" class="anchor-alias" aria-hidden="true"></div>

### II.8.14 Race to the plateau floors across AI/ML fields

**Thesis.** AI progress is often described as growth in scale: more parameters, more tokens, more experts. Mixture of Limits reads the same progress as movement toward floors. Across every major AI/ML field below, the plateau move is real engineering (cheaper bits, fewer steps, better uncertainty, better routing). The floor that binds is still VoI, grammar coverage, labeled energy, certificate, or settle-refuse. Once VoI is zero past that floor, optimize energy/compute there (Lookup → Formula → Solver → Model) rather than escalate generation.

One cited source per row. Author-reported speedups and scores are **field results**, not Mixture of Limits `measured_j`.

| Field | Plateau move | Floor that binds | Cite |
|---|---|---|---|
| **RL / RLHF / process reward** | Preference reward models + PPO (or process reward on steps) reshape the generative policy toward preferred traces | Reward shaping is still proposal until certify; extra RL / CoT tokens hit VoI and energy once B is covered (§II.8.8) | Ouyang et al., InstructGPT / RLHF, NeurIPS 2022, arXiv:2203.02155; Lightman et al., process supervision, arXiv:2305.20050 |
| **Diffusion (image/video) + distillation** | Latent diffusion + step distillation cut denoising compute while preserving sample quality | Denoising steps spend bits/joules; Landauer stays a labeled estimate; certify before commit of generated media | Rombach et al., Latent Diffusion, CVPR 2022; Salimans & Ho, Progressive Distillation, ICLR 2022, arXiv:2202.00512; Blattmann et al., Stable Video Diffusion, arXiv:2311.15127 |
| **Graph neural nets** | Message-passing GCNs / cousins compress relational structure into local updates | Graph message passes remain Model-class when generative; structure that is Lookup/Formula-covered closes before GNN | Kipf & Welling, GCN, ICLR 2017, arXiv:1609.02907 |
| **Multimodal fusion** | Contrastive image-text alignment (CLIP-class) shares a joint embedding for zero-shot transfer | Aligned latents do not invent VoI stop; multimodal generation still the last cascade stage under certify | Radford et al., CLIP, ICML 2021 (PMLR v139) |
| **Federated learning** | FedAvg aggregates client updates without centralizing raw data; communication rounds become the scarce resource | Comm rounds are plateau cost; VoI still prices whether another round changes B; energy labels stay Estimated unless Metered | McMahan et al., FedAvg, AISTATS 2017 (PMLR v54) |
| **Continual learning** | Elastic Weight Consolidation (and cousins) protect important weights against catastrophic forgetting across tasks | Retaining old tasks is plateau memory economics; does not retire grammar coverage or settle-refuse on the new coordinate | Kirkpatrick et al., EWC, *PNAS* 2017. DOI: 10.1073/pnas.1611835114 |
| **Pruning / sparsity (beyond MoD)** | Lottery-ticket iterative magnitude pruning finds sparse trainable subnetworks that match dense accuracy | Sparse generators still generate; floors outside generation decide whether to open decode (§II.8.10 MoD for token-depth sparsity) | Frankle & Carbin, Lottery Ticket, ICLR 2019, arXiv:1803.03635 |
| **Knowledge distillation** | Teacher→student soft-target transfer compresses ensemble or large-model behavior into a cheaper deployable student | Distilled student is cheaper plateau leaf; VoI/grammar still stop escalation when covered | Hinton, Vinyals & Dean, Distilling the Knowledge in a Neural Network, arXiv:1503.02531 (2015) |
| **NAS / hardware-aware NAS** | Search (RL or supernet) for architectures; Once-for-All specializes one trained net to device latency without retraining | Architecture search optimizes plateau spend on silicon; does not name refuse outside generation | Zoph & Le, NAS with RL, ICLR 2017, arXiv:1611.01578; Cai et al., Once-for-All, ICLR 2020, arXiv:1908.09791 |
| **Bayesian deep learning / uncertainty** | MC dropout (and variational cousins) approximate posterior predictive uncertainty at test time | Uncertainty scores are proposals for refuse thresholds, not automatic Mixture of Limits receipts until typed certify | Gal & Ghahramani, Dropout as Bayesian Approximation, ICML 2016 (PMLR v48), arXiv:1506.02142 |
| **Conformal prediction** | Distribution-free prediction sets with finite-sample coverage under exchangeability; abstention when the set is too large | Closest formal cousin to typed refuse: coverage-calibrated abstain rhymes with settle-refuse / VoI stop | Angelopoulos & Bates, Conformal Prediction: A Gentle Introduction, arXiv:2107.07511; Vovk, Gammerman & Shafer, *Algorithmic Learning in a Random World* (2nd ed., 2022) |
| **Causal ML** | Structural causal models / do-calculus separate intervention from association | Causal identification is Formula/Solver grammar when the graph is known; associative generators stay the last cascade stage | Pearl, *Causality* (2nd ed.); Pearl, Causal inference in statistics: An overview, *Stat. Surv.* 2009 |
| **Active learning (VoI cousin)** | Query the label that most reduces expected risk / uncertainty under a labeling budget | Settles-class active selection **is** Howard VoI operationalized for labels; stop when marginal label VoI ≤ cost | Settles, Active Learning Literature Survey, U. Wisconsin TR 1648 (2009); Howard (1966) VoI (§II.7.1) |
| **Compression / distillation cascades** | Progressive or multi-stage distill (diffusion steps; teacher→student chains) compound plateau compression | Cascaded distill remains generative efficiency; OpenIE cascade is Lookup→Formula→Solver→Model with typed refuse | Salimans & Ho (2022); Hinton et al. (2015); §II.8.13.3 field early-exit cascades |
| **CUDA Graphs / kernel fusion** | Capture static GPU work as a replayable graph; fuse kernels to cut launch and memory traffic | Systems plateau spend on the device; still serves generators; floors decide whether work runs | NVIDIA CUDA Programming Guide (CUDA Graphs); PyTorch CUDA Graphs / `torch.compile` reduce-overhead notes |
| **Agent memory systems** | OS-inspired paging of agent context (main vs external memory; MemGPT-class) under fixed context windows | Memory hierarchy is transmission/context economics (§II.8.13.4); unbounded agent loops still hit VoI/energy; certify before irreversible tool effects | Packer et al., MemGPT, arXiv:2310.08560 (2023) |
| **RAG variants (GraphRAG)** | Build entity/community graph summaries; map-reduce over communities for global corpus questions | Graph index can rhyme with Lookup when certified; uncertified community text remains proposal (§II.8.10 RAG row) | Edge et al., GraphRAG, arXiv:2404.16130 (2024) |
| **Structured generation (beyond GCD/CRANE)** | FSM / regex / CFG-guided decoding (Outlines-class) masks illegal tokens at sample time | Constrains **tokens**; Mixture of Limits constrains **commit** (§II.9 GCD/CRANE). Grammar coverage can close at Formula without an LLM | Willard & Louf, Efficient Guided Generation for LLMs (Outlines), arXiv:2307.09702 (2023) |

**Teach-first takeaway.** Every row moves toward a cheaper or safer plateau. None removes a floor. Across AI/ML the work is to **find the floor, then reach it with the fewest joules**.

**Scope of the table.** Exhaustive taxonomies of RL algorithms, video products without a public methods paper, and surveys organized by region are left out, so that each row can be read against a floor. Formal theorem proving in the LeanDojo class is cited in the reference list as a relative of the Solver gear.


<div id="9-mixture-of-limits-is-not-moe-and-the-model-to-model-sota-table" class="anchor-alias" aria-hidden="true"></div>

## II.9. Mixture of Limits beside MoE and model-to-model routing

<div id="90-spine-history--mathematics-sota-at-the-plateau" class="anchor-alias" aria-hidden="true"></div>

### II.9.0 Where this section sits

Mixture of Limits rests on information theory and physics: the Kepler and Newton lineage of law discovery, then Shannon, Landauer, algorithmic complexity, and value of information. The systems in this section mostly decide **which neural generator runs** and how fast. §II.8.4 to §II.8.14 already place those techniques as ways to spend less past the floor. Mixture of Limits asks first whether a generator should run at all, and then how little energy reaches the verified result.

<div id="91-law-contrast-not-a-rebrand" class="anchor-alias" aria-hidden="true"></div>

### II.9.1 Law contrast (not a rebrand)

Mixture of Experts (MoE) places experts **inside** a generative corridor: a gate selects parameters; success is next-token likelihood; capacity grows by adding experts to the same act. Mixture of Limits places named **floors outside** generation: Lookup → Formula → Solver/settle → **Model**; success is closed grammar + certified commit or refuse + joule receipt; the model is a residual leaf, off by default (`allow_model=false`). The two work at different levels and compose.

| Axis | MoE / model↔model field | Mixture of Limits |
|---|---|---|
| Where the mixture lives | Inside the model (experts, draft/target pairs, strong/weak LLMs) | Outside generation (named floors + cascade gears) |
| Routing object | Which **model** (or draft head) answers | Which **tier** closes: Lookup / Formula / Solver / Model |
| Refuse | Rare; usually escalate to a larger model | First-class: VoI, grammar, settle, certificate, primitive_gap, fabric_unavailable, … |
| Energy labels | Often latency/cost proxies; some papers meter GPU energy for **LLM** serving | Receipts: `estimated_j` labeled; `measured_j=None` unless a meter returns |
| Success metric | Tokens/s, cost@quality, speculative speedup | Certified commit + typed ReplayClass + receipt |

RouteLLM, GreenServ, and HCSpec optimize **which neural generator runs** (cost, Wh, or decode speedup inside the generative corridor). Mixture of Limits asks whether a generator should run at all.

**Cascades and metareasoning.** The cascade is a classical form. Viola and Jones ran a cascade of boosted classifiers: cheap stages reject most inputs, and only hard inputs reach costly stages (CVPR 2001, DOI:[10.1109/CVPR.2001.990517](https://doi.org/10.1109/CVPR.2001.990517)). Russell and Wefald priced each computation by its expected value to the decision, net of its cost, and stopped when no computation had positive net value (*Artificial Intelligence* 49, 1991, DOI:[10.1016/0004-3702(91)90015-C](https://doi.org/10.1016/0004-3702(91)90015-C)). Horvitz set the same trade for reasoning under bounded resources (UAI 1987, arXiv:[1304.2759](https://arxiv.org/abs/1304.2759)). FrugalGPT cascades language models and stops when a learned scorer accepts the answer (Chen, Zaharia and Zou 2023, arXiv:[2305.05176](https://arxiv.org/abs/2305.05176)). Mixture of Limits is this lineage with three changes. The stages include non-neural gears, lookup, formula and solver, ahead of any model. The stop test is the completeness predicate $C(z)$, not a learned score. The cost is metered joules on a receipt, not dollars or latency. The order is optimal under the condition above and not otherwise.

**Baselines.** A cascade claim is tested on a cost-quality frontier: joules per task against closure rate, on one typed task set. The arms are always-large model, always-small model, a learned router in the style of RouteLLM, a FrugalGPT-style scored cascade, the σ-law selector (itself a Mixture of Limits instance), and an oracle that knows the cheapest sufficient gear for each task. The fixed Lookup → Formula → Solver → Model cascade claims the frontier only where its curve lies below every arm.

<div id="92-field-sota-all-modelmodel-routing--speculation--constrained-generation" class="anchor-alias" aria-hidden="true"></div>

### II.9.2 Field SOTA (all model↔model routing / speculation / constrained generation)

Every row below is **model↔model**: routers choose among LLMs; speculative methods draft-then-verify with draft/target models; constrained decoding still samples from an LLM under a grammar. None implements Lookup→Formula→Solver→Model with refuse-to-commit as the close rule.

Measurement labels: **Metered**, **Estimated**, **Unmetered**; each paper's own method section sets its label. Field joules stay field results. The `mol prove` path is **Unmetered**.

| System | Title (verified) | ID | Class | What it routes / accelerates | Energy / cost as reported by authors | Vs Mixture of Limits |
|---|---|---|---|---|---|---|
| **RouteLLM** | *RouteLLM: Learning to Route LLMs with Preference Data* (arXiv); ICLR 2025 venue title uses *from Preference Data* | arXiv:[2406.18665](https://arxiv.org/abs/2406.18665) · ICLR 2025 | Preference router (strong↔weak LLM) | Query → strong or weak LLM | Cost / quality (API \$); not Mixture of Limits Landauer receipts | Model↔model; no Lookup/Formula floor; no typed refuse-to-commit |
| **PEARL** (routing) | *PEARL: Performance and energy aware routing for LLMs* | DOI:[10.1016/j.future.2025.108218](https://doi.org/10.1016/j.future.2025.108218) · FGCS 176:108218 | Energy-aware multi-LLM router | Query → LLM under energy cap (EMM predicts energy) | Authors report energy-aware routing (GPU/infra); **not** imported as Mixture of Limits `measured_j` | Still picks a model; Mixture of Limits may refuse before any model |
| **GreenServ** | *GreenServ: Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference* | arXiv:[2601.17551](https://arxiv.org/abs/2601.17551) · ICPE 2026 | Contextual bandit multi-LLM router | Query features → LLM; accuracy vs **measured GPU energy** (Zeus) | **Metered** (authors’ GPU Wh via Zeus) on their LLM pool (field result, not Mixture of Limits board synth) | Model pool routing; Mixture of Limits cascade is non-neural first |
| **VoltanaLLM** | *VoltanaLLM: Energy-Efficient and SLO-Aware Disaggregated LLM Serving via Adaptive Frequency Control and State-Space Routing* | arXiv:[2509.04827](https://arxiv.org/abs/2509.04827) | P/D-disagg serving + frequency + state-space route | Prefill/decode instances + GPU frequency under TTFT/ITL SLOs | **Metered** (authors; pyNVML on A100/GH200) up to ~36.3% E2E GPU energy vs max-freq baseline (field serving result) | Routes **instances of the same generative stack**; Mixture of Limits may never open decode |
| **HCSpec** | *HCSpec: Two-Tier Horizontal Cascade Speculative Decoding for High-Efficiency Large Language Model Inference* | DOI:[10.18653/v1/2026.acl-long.353](https://doi.org/10.18653/v1/2026.acl-long.353) · ACL 2026 | Speculative decoding (draft↔target) | Position-specialized draft cascade → target verify | Latency speedup (vs EAGLE-3 / AR); energy not Mixture of Limits claim | Speeds generation; does not refuse generation on floors |
| **CAS-Spec** | *CAS-Spec: Cascade Adaptive Self-Speculative Decoding for On-the-Fly Lossless Inference Acceleration of LLMs* | arXiv:[2510.26843](https://arxiv.org/abs/2510.26843) · NeurIPS 2025 | Self-speculative cascade (DSIA drafts) | Draft stages from target (sparsity/quant) + DyTC | Latency speedup ~1.1×-2.3× AR (authors); lossless tokens | Model-internal draft hierarchy ≠ Mixture of Limits floors |
| **GCD** | *Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning* | arXiv:[2305.13971](https://arxiv.org/abs/2305.13971) · DOI:[10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674) · EMNLP 2023 | Grammar-constrained LLM decoding | Mask logits to CFG | Unmetered / quality metrics | Constrains **tokens**; Mixture of Limits constrains **commit** |
| **CRANE** | *CRANE: Reasoning with constrained LLM generation* | arXiv:[2502.09061](https://arxiv.org/abs/2502.09061) · ICML 2025 (PMLR v267) | Reasoning-augmented constrained decoding | Alternate unconstrained reason ↔ constrained answer | Accuracy on GSM-symbolic / FOLIO; not Mixture of Limits joules | Still LLM generation under grammar; Mixture of Limits can close at Formula without an LLM |
| **Constitutional AI** | *Constitutional AI: Harmlessness from AI Feedback* | arXiv:[2212.08073](https://arxiv.org/abs/2212.08073) | Principle-trained refuse / RLAIF | Critique→revise under a written constitution; RL from AI feedback | Alignment quality / human prefs; not Mixture of Limits joules | **Trained** textual refuse inside the generator; Mixture of Limits **typed** certify-before-commit + receipted floors outside generation |
| **Toolformer / ReAct** | Toolformer (NeurIPS 2023); *ReAct: Synergizing Reasoning and Acting in Language Models* | Toolformer arXiv:[2302.04761](https://arxiv.org/abs/2302.04761) · ReAct arXiv:[2210.03629](https://arxiv.org/abs/2210.03629) | Tool-use / agent loop | LM decides when to call APIs / act↔observe | Task accuracy; not Mixture of Limits Landauer receipts | Agent routing among **tools still opens a model**; Mixture of Limits may close at Lookup/Formula before any tool or model |

**Name collision (do not conflate):** ICLR 2025 also has *PEARL: Parallel Speculative Decoding with Adaptive Draft Length* (arXiv:[2408.11850](https://arxiv.org/abs/2408.11850)); speculative, not the FGCS energy router. §II.9’s PEARL row is the **routing** paper (DOI 10.1016/j.future.2025.108218). Speculative PEARL sits in the same model↔model bucket as HCSpec/CAS-Spec if cited later.

<div id="93-what-mixture-of-limits-claims-instead" class="anchor-alias" aria-hidden="true"></div>

### II.9.3 What Mixture of Limits claims instead

From PLAN prove (see §II.6):

1. **The cascade order is the default policy**, optimal in expected joules under the condition of Section II.4, and not a heuristic over LLMs: Lookup → Formula → Solver/settle → Model.
2. **Refuse-to-commit** is typed and receipted (`voi`, `settle_refuse`, `efa_certificate`, `primitive_gap`, `fabric_unavailable`, `claim_unknown`, …).
3. **Receipt labels** on the verified path: `measured_j=None` (Unmetered), estimates labeled (**Estimated**), no board measurement.
4. **ReplayClass** cannot strengthen: `ModelGenerated` ↛ `Deterministic`.
5. Multi-fabric routing chooses a `DeviceKind` after the tier closes; it does not choose among language models.

<div id="94-measurement-bounds" class="anchor-alias" aria-hidden="true"></div>

### II.9.4 Measurement bounds

| Bound | Allowed |
|---|---|
| `measured_j` on the `mol prove` path | `measured_j=None` unless a Metered probe returns |
| Board-result flag without a meter and a synthesis log | Not set |
| GreenServ or VoltanaLLM watt-hours as Mixture of Limits energy | Cited as **field** results with their own Metered labels |
| Tokens per joule against HCSpec | Not claimed; a cascade claim is joules per task against closure rate (Baselines, §II.9.1) |

The field systems above route **model to model**. The contribution of Mixture of Limits is not a better router among generators. It is a navigation rule that embodies known information and energy floors, with a harness that keeps the model off by default and refuse first-class.

---

<div id="10-toward-agi-via-limits-open-questions-and-companions" class="anchor-alias" aria-hidden="true"></div>

## II. References

Entries are numbered in one sequence and grouped by the section that cites them; the text cites by author and year. Primary workspace sources, which are not peer-reviewed publications: the `mixture-of-limits` README.md, BLUEPRINT.md, and PLAN.md, and the workspace survey documents (author: David Charlot, OpenIE).

<div id="information-theory--decision--thermo--complexity" class="anchor-alias" aria-hidden="true"></div>

### II. Information theory / decision / thermo / complexity

1. Shannon, C. E. (1948). A mathematical theory of communication. *Bell System Technical Journal*, 27(3), 379-423. DOI: [10.1002/j.1538-7305.1948.tb01338.x](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x). Part II: 27(4), 623-656. DOI: [10.1002/j.1538-7305.1948.tb00917.x](https://doi.org/10.1002/j.1538-7305.1948.tb00917.x).
2. Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development*, 5(3), 183-191. DOI: [10.1147/rd.53.0183](https://doi.org/10.1147/rd.53.0183).
3. Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development*, 17(6), 525-532. DOI: [10.1147/rd.176.0525](https://doi.org/10.1147/rd.176.0525).
4. Kolmogorov, A. N. (1965). Three approaches to the definition of the concept “quantity of information.” *Problemy Peredachi Informatsii*, 1(1), 3-11 (no DOI). English transl. (1968): *International Journal of Computer Mathematics*, 2(1-4), 157-168. DOI: [10.1080/00207166808803030](https://doi.org/10.1080/00207166808803030). See also IEEE *Trans. Inf. Theory* note DOI: [10.1109/TIT.1968.1054210](https://doi.org/10.1109/TIT.1968.1054210).
5. Solomonoff, R. J. (1964). A formal theory of inductive inference, Part I. *Information and Control*, 7(1), 1-22. DOI: [10.1016/S0019-9958(64)90223-2](https://doi.org/10.1016/S0019-9958(64)90223-2).
6. Chaitin, G. J. (1977). Algorithmic information theory. *IBM Journal of Research and Development*, 21(4), 350-359. DOI: [10.1147/rd.214.0350](https://doi.org/10.1147/rd.214.0350).
7. Howard, R. A. (1966). Information value theory. *IEEE Transactions on Systems Science and Cybernetics*, 2(1), 22-26. DOI: [10.1109/TSSC.1966.300074](https://doi.org/10.1109/TSSC.1966.300074).
8. Cover, T. M., & Thomas, J. A. *Elements of Information Theory* (2nd ed.). Wiley. Book DOI: [10.1002/047174882X](https://doi.org/10.1002/047174882X).
9. Jaynes, E. T. (2003). *Probability Theory: The Logic of Science* (G. L. Bretthorst, Ed.). Cambridge University Press. DOI: [10.1017/CBO9780511790423](https://doi.org/10.1017/CBO9780511790423).
10. Feynman, R. P. *Feynman Lectures on Computation* (A. J. G. Hey & R. W. Allen, Eds.). Anniversary edition DOI: [10.1201/9781003358817](https://doi.org/10.1201/9781003358817); 1996 Addison-Wesley ISBN 0-201-48991-0.

<div id="formula--mechanism-systems-tier-a" class="anchor-alias" aria-hidden="true"></div>

### II. Formula / mechanism systems (Tier A)

11. Udrescu, S.-M., & Tegmark, M. AI Feynman. *Science Advances*. DOI: [10.1126/sciadv.aay2631](https://doi.org/10.1126/sciadv.aay2631).
12. Brunton, S. L., Proctor, J. L., & Kutz, J. N. SINDy. *PNAS*. DOI: [10.1073/pnas.1517384113](https://doi.org/10.1073/pnas.1517384113).
13. Cranmer, M. (2023). Interpretable Machine Learning for Science with PySR and SymbolicRegression.jl. arXiv:[2305.01582](https://arxiv.org/abs/2305.01582).
14. Fang, Y.-L., Jian, D.-S., Li, X., & Ma, Y.-Q. AI-Newton. arXiv:[2504.01538](https://arxiv.org/abs/2504.01538).
15. Posner, I., Lei, A., & Schölkopf, B. (2026). From Observation to Insight: Mechanistic World Models and the Quest for Autonomous Discovery. arXiv:[2607.12474](https://arxiv.org/abs/2607.12474).
16. Hubert, T., Mehta, R., Sartran, L., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning (AlphaProof). *Nature*. DOI: [10.1038/s41586-025-09833-y](https://doi.org/10.1038/s41586-025-09833-y).
17. Trinh, T. H., Wu, Y., Le, Q. V., et al. (2024). Solving olympiad geometry without human demonstrations (AlphaGeometry). *Nature*, 625, 476-482. DOI: [10.1038/s41586-023-06747-5](https://doi.org/10.1038/s41586-023-06747-5).
18. Basiri, M. A., & Nicholson, C. (2026). Discovery of Nonlinear Dynamics with Automated Basis Function Generation. arXiv:[2605.09696](https://arxiv.org/abs/2605.09696).

<div id="latent--ebm-hybrid--spatial-world-models--sota-at-the-plateau-84-87-continued-in-88-813" class="anchor-alias" aria-hidden="true"></div>

### II. Latent / EBM hybrid / spatial world models / SOTA at the plateau (§II.8.4 to §II.8.7; continued in §II.8.8 to §II.8.13)

19. Bodnia, E., & Hanin, B. (21 Jan 2026). Energy-Based Models for Reasoning, LLMs for the Interface: Scaling Reasoning with Agentic AI. Logical Intelligence blog. https://logicalintelligence.com/blog/energy-based-models-for-reasoning
20. Logical Intelligence. Kona 1.0 product page. https://logicalintelligence.com/kona-ebms-energy-based-models (accessed 2026-10-01).
21. Logical Intelligence. Company site (Aleph / leadership / latent reasoning positioning). https://logicalintelligence.com/ (accessed 2026-10-01).
22. Logical Intelligence. What Sudoku Reveals About AI Reasoning Architectures (Kona demo writeup). https://logicalintelligence.com/blog/energy-based-model-sudoku-demo (accessed 2026-10-01). Author-reported Sudoku latency/accuracy figures are field results, not Mixture of Limits `measured_j`.

<div id="embodiment-class-limits-851" class="anchor-alias" aria-hidden="true"></div>

### II. Cascades, stopping, and routing (§II.2, §II.4, §II.9)

80. Simon, H. A., & Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence*, 6(3), 235-247. DOI: [10.1016/0004-3702(75)90002-8](https://doi.org/10.1016/0004-3702(75)90002-8).
81. Dean, T., & Boddy, M. (1988). An analysis of time-dependent planning. *AAAI-88*, 49-54. https://cdn.aaai.org/AAAI/1988/AAAI88-009.pdf
82. Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. *UAI 1987*. arXiv:[1304.2759](https://arxiv.org/abs/1304.2759).
83. Russell, S., & Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence*, 49, 361-395. DOI: [10.1016/0004-3702(91)90015-C](https://doi.org/10.1016/0004-3702(91)90015-C).
84. Viola, P., & Jones, M. (2001). Rapid object detection using a boosted cascade of simple features. *CVPR 2001*. DOI: [10.1109/CVPR.2001.990517](https://doi.org/10.1109/CVPR.2001.990517).
85. Varshney, N., & Baral, C. (2022). Model cascading: towards jointly improving efficiency and accuracy of NLP systems. *EMNLP 2022*. DOI: [10.18653/v1/2022.emnlp-main.756](https://doi.org/10.18653/v1/2022.emnlp-main.756).
86. Chen, L., Zaharia, M., & Zou, J. (2023). FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance. arXiv:[2305.05176](https://arxiv.org/abs/2305.05176).
87. Snell, C., Lee, J., Xu, K., & Kumar, A. (2024). Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters. arXiv:[2408.03314](https://arxiv.org/abs/2408.03314).
88. Chen, X., Xu, J., Liang, T., He, Z., et al. (2024). Do NOT Think That Much for 2+3=? On the Overthinking of o1-Like LLMs. arXiv:[2412.21187](https://arxiv.org/abs/2412.21187).
89. Sui, Y., Chuang, Y.-N., Wang, G., Zhang, J., et al. (2025). Stop Overthinking: A Survey on Efficient Reasoning for Large Language Models. arXiv:[2503.16419](https://arxiv.org/abs/2503.16419).
90. Micikevicius, P., et al. (2022). FP8 Formats for Deep Learning. arXiv:[2209.05433](https://arxiv.org/abs/2209.05433).
91. Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. arXiv:[2406.18665](https://arxiv.org/abs/2406.18665).
92. PEARL: Performance and energy aware routing for LLMs. *Future Generation Computer Systems*, 176, 108218 (2025). DOI: [10.1016/j.future.2025.108218](https://doi.org/10.1016/j.future.2025.108218).
93. GreenServ: Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. ICPE 2026. arXiv:[2601.17551](https://arxiv.org/abs/2601.17551).
94. VoltanaLLM: Energy-Efficient and SLO-Aware Disaggregated LLM Serving via Adaptive Frequency Control and State-Space Routing. arXiv:[2509.04827](https://arxiv.org/abs/2509.04827).
95. HCSpec: Two-Tier Horizontal Cascade Speculative Decoding for High-Efficiency Large Language Model Inference. ACL 2026. DOI: [10.18653/v1/2026.acl-long.353](https://doi.org/10.18653/v1/2026.acl-long.353).
96. CAS-Spec: Cascade Adaptive Self-Speculative Decoding for On-the-Fly Lossless Inference Acceleration of LLMs. NeurIPS 2025. arXiv:[2510.26843](https://arxiv.org/abs/2510.26843).
97. Geng, S., Josifoski, M., Peyrard, M., & West, R. (2023). Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning. EMNLP 2023. DOI: [10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674).
98. CRANE: Reasoning with constrained LLM generation. ICML 2025. arXiv:[2502.09061](https://arxiv.org/abs/2502.09061).
99. PEARL: Parallel Speculative Decoding with Adaptive Draft Length. ICLR 2025. arXiv:[2408.11850](https://arxiv.org/abs/2408.11850).

<div id="test-time-compute--process-reward--reasoning-models-88" class="anchor-alias" aria-hidden="true"></div>

### II. Test-time compute / process reward / reasoning models (§II.8.8)

100. OpenAI (2024). Learning to reason with LLMs (o1 public writeup). https://openai.com/index/learning-to-reason-with-llms/
101. Lightman, H., et al. (2023). Let's Verify Step by Step. arXiv:[2305.20050](https://arxiv.org/abs/2305.20050). ICLR 2024.
102. Balachandran, V., Chen, J., Chen, L., Garg, S., et al. (2025). Inference-Time Scaling for Complex Tasks: Where We Stand and What Lies Ahead. arXiv:[2504.00294](https://arxiv.org/abs/2504.00294).
103. Zeng, Z., et al. (2025). Revisiting the Test-Time Scaling of o1-like Models: Do They Truly Possess Test-Time Scaling Capabilities? ACL 2025. https://aclanthology.org/2025.acl-long.232.pdf

<div id="super-learning-89" class="anchor-alias" aria-hidden="true"></div>

### II. Super learning (§II.8.9)

104. van der Laan, M. J., Polley, E. C., & Hubbard, A. E. (2007). Super Learner. *Statistical Applications in Genetics and Molecular Biology*, 6(1). Related working paper: Polley & van der Laan, Super Learner In Prediction, U.C. Berkeley Biostatistics Working Paper 266. https://biostats.bepress.com/ucbbiostat/paper266/
105. Wolpert, D. H. (1992). Stacked generalization. *Neural Networks*, 5(2), 241-259.
106. Breiman, L. (1996). Stacked regressions. *Machine Learning*, 24, 49-64.

<div id="hardware-paired-navigation-peers-8121" class="anchor-alias" aria-hidden="true"></div>

### II. Hardware-paired navigation peers (§II.8.12.1)

107. Hooker, S. (2021). The hardware lottery. *Communications of the ACM*. [doi:10.1145/3467017](https://doi.org/10.1145/3467017); arXiv:[2009.06489](https://arxiv.org/abs/2009.06489).
108. Huang, W.-H., Sharda, J., Shih, C.-J., et al. (2025). A3D-MoE: Acceleration of Large Language Models with Mixture of Experts via 3D Heterogeneous Integration. arXiv:[2507.19142](https://arxiv.org/abs/2507.19142).
109. Chung, J.-W., Wu, R., Ma, J. J., & Chowdhury, M. (2026). Where Do the Joules Go? Diagnosing Inference Energy Consumption. arXiv:[2601.22076](https://arxiv.org/abs/2601.22076).

<div id="live-sota-methods-for-plateau-spend-810" class="anchor-alias" aria-hidden="true"></div>

### II. Live SOTA methods for plateau spend (§II.8.10)

110. Leviathan, Y., Kalman, M., & Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. *ICML* (PMLR). https://proceedings.mlr.press/v202/leviathan23a.html
111. Shazeer, N., et al. (2017). Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer. ICLR. arXiv:[1701.06538](https://arxiv.org/abs/1701.06538).
112. Lepikhin, D., et al. (2020). GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding. arXiv:[2006.16668](https://arxiv.org/abs/2006.16668).
113. Fedus, W., Zoph, B., & Shazeer, N. (2022). Switch Transformers. *JMLR*, 23(120).
114. Gu, A., & Dao, T. (2023). Mamba: Linear-Time Sequence Modeling with Selective State Spaces. arXiv:[2312.00752](https://arxiv.org/abs/2312.00752).
115. Gu, A., Goel, K., & Ré, C. (2022). Efficiently Modeling Long Sequences with Structured State Spaces (S4). ICLR.
116. Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS*. arXiv:[2005.11401](https://arxiv.org/abs/2005.11401).
117. Lou, A., Meng, C., & Ermon, S. (2024). Discrete Diffusion Modeling by Estimating the Ratios of the Data Distribution (SEDD). *ICML* (PMLR v235). https://proceedings.mlr.press/v235/lou24a.html
118. Sun, Y., et al. (2023). Retentive Network: A Successor to Transformer for Large Language Models. arXiv:[2307.08621](https://arxiv.org/abs/2307.08621).

<div id="ssm-hybrids--moe--implementation-efficiency-on-the-plateau-811" class="anchor-alias" aria-hidden="true"></div>

### II. SSM hybrids / MoE / implementation efficiency on the plateau (§II.8.11)

119. Lieber, O., et al. (2024). Jamba: A Hybrid Transformer-Mamba Language Model. arXiv:[2403.19887](https://arxiv.org/abs/2403.19887). AI21 announcement: https://www.ai21.com/blog/announcing-jamba/
120. Team Jamba / AI21 (2024). Jamba-1.5: Hybrid Transformer-Mamba Models at Scale. arXiv:[2408.12570](https://arxiv.org/abs/2408.12570).
121. Dai, D., et al. (2024). DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models. *ACL*. https://aclanthology.org/2024.acl-long.70.pdf
122. DeepSeek-AI (2024). DeepSeek-V3 Technical Report. arXiv:[2412.19437](https://arxiv.org/abs/2412.19437).
123. Guo, D., Yang, D., Zhang, H., et al. / DeepSeek-AI (2025). DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning. arXiv:[2501.12948](https://arxiv.org/abs/2501.12948). Nature version: Guo et al., *Nature* 645, 633-638 (2025). DOI: [10.1038/s41586-025-09422-z](https://doi.org/10.1038/s41586-025-09422-z).
124. GLM-4.5 Team / Zhipu AI (2025). GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models. arXiv:[2508.06471](https://arxiv.org/abs/2508.06471).
125. GLM Team (2024). ChatGLM: A Family of Large Language Models from GLM-130B to GLM-4 All Tools. arXiv:[2406.12793](https://arxiv.org/abs/2406.12793).


<div id="plateau-techniques-transmission--gearing--cascade--memory-context--test-time-813" class="anchor-alias" aria-hidden="true"></div>

### II. Plateau techniques: transmission / gearing / cascade / memory-context / test-time (§II.8.13)

126. Sun, Y., Dong, L., Zhu, Y., et al. (2024). You Only Cache Once: Decoder-Decoder Architectures for Language Models (YOCO). *NeurIPS*. arXiv:[2405.05254](https://arxiv.org/abs/2405.05254).
127. DeepSeek-AI (2026). DeepSeek-V4.1-Flash: Pushing the Limits of KV Cache Compression. arXiv:[2609.19969](https://arxiv.org/abs/2609.19969). Model card: https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash.
128. Wei, J., Gao, Y., Zhang, Q., et al. / Xiaomi LLM-Core (2026). HySparse2: Hybrid Sparse Attention with Two-Level KV Sharing. arXiv:[2609.26368](https://arxiv.org/abs/2609.26368).
129. Xiaomi LLM-Core (2025). MiMo: Unlocking the Reasoning Potential of Language Model: From Pretraining to Posttraining. arXiv:[2505.07608](https://arxiv.org/abs/2505.07608).
130. Xiaomi Team / LLM-Core (2026). MiMo-V2-Flash Technical Report. arXiv:[2601.02780](https://arxiv.org/abs/2601.02780).
131. Qwen Team (2025). Qwen3 Technical Report. arXiv:[2505.09388](https://arxiv.org/abs/2505.09388).
132. MoonshotAI / Team Kimi (2025). Kimi K2: Open Agentic Intelligence. arXiv:[2507.20534](https://arxiv.org/abs/2507.20534).
133. Yang, A., et al. (2023). Baichuan 2: Open Large-scale Language Models. arXiv:[2309.10305](https://arxiv.org/abs/2309.10305).
134. Ren, X., et al. (2023). PanGu-Σ: Towards Trillion Parameter Language Model with Sparse Heterogeneous Computing. arXiv:[2303.10845](https://arxiv.org/abs/2303.10845).
135. Li, J., et al. (2024). LocMoE: A Low-Overhead MoE for Large Language Model Training. *IJCAI*. arXiv:[2401.13920](https://arxiv.org/abs/2401.13920).
136. Sarvam AI (2025 to 2026). Sarvam-30B MoE model card / docs (≈30B total / ≈2.4B active; 128 experts + shared; top-6). https://huggingface.co/sarvamai/sarvam-30b ; https://docs.sarvam.ai/
137. Kallappa, A., et al. / Krutrim Team (2025). Krutrim LLM: Multilingual Foundational Model for over a Billion People. arXiv:[2502.09642](https://arxiv.org/abs/2502.09642).
138. SB Intuitions (2024). Sarashina2-8x70B MoE release notes / tech blog (8 experts, top-2). https://www.sbintuitions.co.jp/
139. Upstage (2026). Solar Open Technical Report. arXiv:[2601.07022](https://arxiv.org/abs/2601.07022). Solar Open 2 product materials: https://www.upstage.ai/
140. NAVER Cloud / HyperCLOVA (2025). HyperCLOVA X THINK. arXiv:[2506.22403](https://arxiv.org/abs/2506.22403).

<div id="plateau-levers-added-in-industry-gap-pass-quantization--engines--mod--edge--neuromorphic--refuse--tools--formal" class="anchor-alias" aria-hidden="true"></div>

### II. Quantization, serving, adaptive depth, edge and neuromorphic hardware, agents, and formal tools

141. Frantar, E., Ashkboos, S., Hoefler, T., & Alistarh, D. (2022). GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers. arXiv: 2210.17323.
142. Lin, J., Tang, J., Tang, H., et al. (2024). AWQ: Activation-aware Weight Quantization for On-Device LLM Compression and Acceleration. MLSys. arXiv: 2306.00978.
143. Kwon, W., Li, Z., Zhuang, S., et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM). arXiv: 2309.06180.
144. Zheng, L., Yin, L., Xie, Z., et al. (2023/2024). SGLang: Efficient Execution of Structured Language Model Programs. arXiv: 2312.07104.
145. Raposo, D., Ritter, S., Richards, B., et al. (2024). Mixture-of-Depths: Dynamically allocating compute in transformer-based language models. arXiv: 2404.02258.
146. Li, Y., Wei, F., Zhang, C., & Zhang, H. (2024). EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty. ICML (PMLR). arXiv: 2401.15077.
147. Bai, Y., Kadavath, S., Kundu, S., et al. (2022). Constitutional AI: Harmlessness from AI Feedback. arXiv: 2212.08073.
148. Schick, T., Dwivedi-Yu, J., Dessì, R., et al. (2023). Toolformer: Language Models Can Teach Themselves to Use Tools. NeurIPS. arXiv: 2302.04761.
149. Yao, S., Zhao, J., Yu, D., et al. (2023). ReAct: Synergizing Reasoning and Acting in Language Models. ICLR. arXiv: 2210.03629.
150. Yang, K., Swope, A., Gu, A., et al. (2023). LeanDojo: Theorem Proving with Retrieval-Augmented Language Models. NeurIPS. arXiv: 2306.15626.
151. Lin, J., Chen, W.-M., Lin, Y., et al. (2020). MCUNet: Tiny Deep Learning on IoT Devices. NeurIPS. arXiv: 2007.10319.
152. Wei, J., et al. (2024). T-MAC: CPU Renaissance via Table Lookup for Low-Bit LLM Deployment on Edge. arXiv: 2407.00088.
153. Abreu, S., Shrestha, S. B., Zhu, R.-J., & Eshraghian, J. (2025). Neuromorphic Principles for Efficient Large Language Models on Intel Loihi 2. arXiv: 2503.18002.
154. Holdijk, L., Melanson, D., Mensch, Z., Birchall, B., et al. (2026). CN101: A Digital Thermodynamic Computer for Generative AI. arXiv: 2608.00754.
155. Zilberstein, S. (1996). Using Anytime Algorithms in Intelligent Systems. *AI Magazine*, 17(3).
156. Tishby, N., Pereira, F. C., & Bialek, W. (1999). The information bottleneck method. Allerton / arXiv physics:0004057. Tishby & Zaslavsky (2015), Deep Learning and the Information Bottleneck Principle, arXiv: 1503.02406.

<div id="race-to-plateau-floors-across-aiml-fields-814" class="anchor-alias" aria-hidden="true"></div>

<div id="ii-race-to-saturation-points-across-aiml-fields-814" class="anchor-alias" aria-hidden="true"></div>

### II. Race to plateau floors across AI/ML fields (§II.8.14)

157. Ouyang, L., Wu, J., Jiang, X., et al. (2022). Training language models to follow instructions with human feedback (InstructGPT / RLHF). *NeurIPS*. arXiv:[2203.02155](https://arxiv.org/abs/2203.02155).
158. Rombach, R., Blattmann, A., Lorenz, D., Esser, P., & Ommer, B. (2022). High-Resolution Image Synthesis with Latent Diffusion Models. *CVPR*. arXiv:[2112.10752](https://arxiv.org/abs/2112.10752).
159. Salimans, T., & Ho, J. (2022). Progressive Distillation for Fast Sampling of Diffusion Models. *ICLR*. arXiv:[2202.00512](https://arxiv.org/abs/2202.00512).
160. Blattmann, A., et al. (2023). Stable Video Diffusion: Scaling Latent Video Diffusion Models to Large Datasets. arXiv:[2311.15127](https://arxiv.org/abs/2311.15127).
161. Kipf, T. N., & Welling, M. (2017). Semi-Supervised Classification with Graph Convolutional Networks. *ICLR*. arXiv:[1609.02907](https://arxiv.org/abs/1609.02907).
162. Radford, A., et al. (2021). Learning Transferable Visual Models From Natural Language Supervision (CLIP). *ICML* (PMLR v139).
163. McMahan, H. B., Moore, E., Ramage, D., Hampson, S., & Agüera y Arcas, B. (2017). Communication-Efficient Learning of Deep Networks from Decentralized Data (FedAvg). *AISTATS* (PMLR v54).
164. Kirkpatrick, J., et al. (2017). Overcoming catastrophic forgetting in neural networks (EWC). *PNAS*. DOI: [10.1073/pnas.1611835114](https://doi.org/10.1073/pnas.1611835114).
165. Frankle, J., & Carbin, M. (2019). The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural Networks. *ICLR*. arXiv:[1803.03635](https://arxiv.org/abs/1803.03635).
166. Hinton, G., Vinyals, O., & Dean, J. (2015). Distilling the Knowledge in a Neural Network. arXiv:[1503.02531](https://arxiv.org/abs/1503.02531).
167. Zoph, B., & Le, Q. V. (2017). Neural Architecture Search with Reinforcement Learning. *ICLR*. arXiv:[1611.01578](https://arxiv.org/abs/1611.01578).
168. Cai, H., Gan, C., Wang, T., Zhang, Z., & Han, S. (2020). Once-for-All: Train One Network and Specialize it for Efficient Deployment. *ICLR*. arXiv:[1908.09791](https://arxiv.org/abs/1908.09791).
169. Gal, Y., & Ghahramani, Z. (2016). Dropout as a Bayesian Approximation: Representing Model Uncertainty in Deep Learning. *ICML* (PMLR v48). arXiv:[1506.02142](https://arxiv.org/abs/1506.02142).
170. Angelopoulos, A. N., & Bates, S. (2021/2023). A Gentle Introduction to Conformal Prediction and Distribution-Free Uncertainty Quantification. arXiv:[2107.07511](https://arxiv.org/abs/2107.07511); *Foundations and Trends in Machine Learning*.
171. Vovk, V., Gammerman, A., & Shafer, G. (2022). *Algorithmic Learning in a Random World* (2nd ed.). Springer. DOI: [10.1007/978-3-031-06649-8](https://doi.org/10.1007/978-3-031-06649-8).
172. Pearl, J. (2009). Causal inference in statistics: An overview. *Statistics Surveys*, 3, 96-146. See also Pearl, *Causality* (2nd ed.).
173. Settles, B. (2009). Active Learning Literature Survey. University of Wisconsin-Madison Computer Sciences Technical Report 1648.
174. NVIDIA. CUDA Programming Guide: CUDA Graphs (documentation). https://docs.nvidia.com/cuda/cuda-programming-guide/ (accessed 2026-10-02). PyTorch CUDA Graphs / `torch.compile` reduce-overhead notes: https://pytorch.org/docs/stable/notes/cuda.html
175. Packer, C., et al. (2023). MemGPT: Towards LLMs as Operating Systems. arXiv:[2310.08560](https://arxiv.org/abs/2310.08560).
176. Edge, D., et al. (2024). From Local to Global: A GraphRAG Approach to Query-Focused Summarization. arXiv:[2404.16130](https://arxiv.org/abs/2404.16130).
177. Willard, B. T., & Louf, R. (2023). Efficient Guided Generation for Large Language Models (Outlines). arXiv:[2307.09702](https://arxiv.org/abs/2307.09702).

<div id="claim-regimes-labels-and-facility-duties-1141" class="anchor-alias" aria-hidden="true"></div>

## II. Appendix A. Measurement bounds

- The `mol prove` path makes no board measurement; `measured_j=None` unless a Metered probe returns.
- Landauer figures on receipts are labeled thermodynamic lower-bound estimates.
- Analytical and catalog `estimated_j` is not board power.
- About 29 `VERIFIED` criteria from `mol prove` are constructive existence in **software**.
- Mixture of Limits is a clean-room rule plus runtime, not an MoE wrapper.
- §II.8.4 to §II.8.14 place latents, energy-based hybrids, world models, test-time compute, super learning, quantization, serving engines, state-space and MoE efficiency, edge and neuromorphic hardware, and cross-field techniques as ways to spend less past the floor. Author-reported joules, KV bytes, and scores stay field results.

<div id="appendix-b-reproducibility-pointers" class="anchor-alias" aria-hidden="true"></div>

## II. Appendix B. Reproducibility pointers

```bash
# On a machine with the mixture-of-limits workspace:
cargo test --workspace
cargo run -p mol-cli -- prove   # expect VERIFIED lines, exit 0
```

Site preview for this study (research-openie-web):

```bash
# From the research-openie-web checkout root:
pnpm install
pnpm dev
# open /papers/gates/#part-ii-the-cascade-mixture-of-limits , /about/gates/ , /living/mol/
```

LaTeX PDF of this paper: `scripts/latex/build.sh gates` (needs pandoc and tectonic).
