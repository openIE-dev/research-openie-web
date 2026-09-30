---
title: "Notational Intelligence as Runtime Commit Law"
deck: "System One decides in software. WCA decides whether the machine is allowed to move."
id: ni
status: "Research study · draft"
author: "David Charlot · Open Interface Engineering"
figures: "/living/ni/"
pdf: "/pdfs/ni.pdf"
board_synth_claimed: false
---

# Notational Intelligence as Runtime Commit Law

**A comprehensive research study for OpenIE / WCA**

| Field | Value |
|-------|-------|
| **Author frame** | David Charlot · Open Interface Engineering |
| **Status** | Research study · draft (not a final journal PDF) |
| **Public** | https://research.openie.dev/papers/ni/ · PDF https://research.openie.dev/pdfs/ni.pdf |
| **Supersedes / extends** | NOTATIONAL_INTELLIGENCE_RESEARCH.md (memo; retained in research archive) |
| **Method window** | Tue Sep 29 – Wed Sep 30, 2026 (America/New_York / EDT) |
| **Aligned with** | SOTA_SCAN, PRODUCT_LANDSCAPE, PRODUCT, SYSTEM_ONE_TO_WCA, ARCHITECTURE, README (research archive) |
| **Honesty** | No fabricated citations. Claims carry real URLs / arXiv / DOI, or are marked **[UNVERIFIED]** / **[VENDOR]** / **[SURROGATE]**. Stack is software reference: `board_synth_claimed=false`. Surrogate OpCounter joules ≠ board watts. |

---

## Abstract

Linus Lee’s *notational intelligence* (thesephist, 2022) argues that inventing better notations can raise effective intelligence more than automated tools alone. That claim is historically fertile and intellectually generous. This study treats Lee as **Brahe-scale**: precise observation that notation amplifies thought, without yet stating the dynamical law that agentic Physical AI must obey at the moment of irreversible action.

David Charlot’s program—**WCA / EFA Commit Gate** in `wca-lut-edge`—is framed as the **Keplerian step**: notation as **runtime commit/refuse law**. The product nomenclature is versioned wire types under `wca.commit.v1`:

> **Proposal → Certificate → RefuseReason → CommitDecision**

Composition is conjunctive and explicit:

> `commit = lut_allow ∧ energy_ok [∧ cbf_ok]`

The stack complements **System One** (typed propose / decision tax collapse), does **not** compete with Taalas / Groq / Etched (silicon tokens/J) or World Labs–class world models (predict-then-act), and meters energy under OpenIE-style **joule honesty** with labeled tiers. Rust 1.98 (`crates/wca-commit`) is the hot path; FPGA board synthesis is explicitly **not** claimed.

**Primary finding.** Lee is right that notation is under-invested. Charlot is right that for agentic machines the expensive mistakes are *commits* (joules, torque, irreversible tools), so the notation that matters is the one the runtime cannot ignore. Sep 29–30 2026 landscape scans did **not** find a published product stack that ships Boolean allow-LUT ∧ port-Hamiltonian / Safe energy certificate ∧ cheap TLMM (or System One) proposal as a single auditable commit boundary (`SOTA_SCAN.md` §1.8; `PRODUCT_LANDSCAPE.md` §3.3). That white space is real; **silicon joule leadership is not**.

---

## 0. Method

**Date & timezone.** Research and drafting occurred **Tue Sep 29 – Wed Sep 30, 2026**, America/New_York (EDT, UTC−4). Box-local `date` confirmed EDT during verification runs.

**Sources.**

1. **Primary essay:** WebFetch of https://thesephist.com/posts/notation/ (Lee, 2022-01-02).
2. **Secondary NI / TfT:** Gradient conversation; thesephist speaking index (Compile / Cursor talk listed Jun 2026); Matuschak & Nielsen TfT essay; Iverson / Engelbart / Kay / Victor primary URLs.
3. **Formal methods & safety:** Ames CBF; Alshiekh shielding; Dawson learned certificates; Manek & Kolter stable dynamics; Roth stable pH-NN; Leung & Paré energy-aware Bayesian CBF; Yu / Žikelić / Henzinger certificate repair via runtime monitoring; Sánchez et al. RV survey; Falcone / Bartocci RV intros.
4. **Energy / LUT / edge:** DiffLogic, DWN, BitNet, T-MAC, TeLLMe, Hooker Hardware Lottery, Landauer, Horowitz ISSCC, Sandberg brain energetics.
5. **Agents / tools:** Anthropic MCP announcement; OSWorld-Human; AutoGen; MetaGPT.
6. **Local stack:** README demos executed on the box (`wca-soc-loop` seed-1 golden; `wca-mcp-gate --demo`); schemas under `wca.commit.v1` (research archive); Rust sources under `crates/wca-commit` (research archive).

**Honesty protocol.** Every external factual claim must either (a) cite a live URL / arXiv / DOI checked in this window, or (b) carry an honesty tag. Vendor throughput / watt claims stay **[VENDOR]**. OpCounter × analytical `E_*` stays **[SURROGATE]**. Missing literature is labeled **[UNVERIFIED]** rather than invented.

**Non-goals.** This study does not claim board watts, brain-matching efficiency, or “first energy-aware AI.” It does not punch down on Lee. Star Trek mappings are metaphor only.

---

## 1. Executive synthesis (Brahe → Kepler)

### 1.1 Thesis

| Layer | Lee / TfT lineage | Charlot WCA / EFA |
|-------|-------------------|-------------------|
| What notation *is* | Medium that amplifies human thought (Iverson, Engelbart, Kay, Victor, Lee) | Executable **commit nomenclature** wired into SoC / agent tool boundary |
| Who it primarily serves | Human intellect first; machines as co-authors of notation | Plant / irreversible tool / energy budget first; humans as policy + audit layer |
| Success metric | “Previously unthinkable thoughts”; mnemonic / creative leverage | False-allow → 0; util/J with refuse reasons; surrogate→DUT joule path |
| Failure mode | Beautiful demos that don’t change civilization’s thought patterns (Matuschak–Nielsen warning) | Soft confidence strings sold as safety; surrogate J marketed as silicon W |

**Brahe metaphor (explicit).** Tycho Brahe assembled precise observations without a correct dynamical law; Kepler turned data into enforceable planetary laws. Lee assembles the *observation* that notation amplifies intelligence. Charlot’s bet is that **Proposal / Certificate / RefuseReason / CommitDecision** plus EFA energy checks are the *laws* agents must obey at runtime—not optional documentation.

### 1.2 One-paragraph verdict

Lee is right that notation is under-invested relative to “more automation.” Charlot is right that *agentic* Physical AI fails when notation stops at the whiteboard: LLMs propose in natural language; CBFs and Lyapunovs live in papers; LUTs burn on FPGAs; energy is a blog slide. **WCA’s compositional claim**—Boolean allow-LUT ∧ port-Hamiltonian / Safe energy certificate ∧ cheap TLMM (or System One / agent) proposal as a single commit boundary—was **not found as a published product stack** in the Sep 29–30, 2026 scans. That white space is real; **silicon joule leadership is not**. Treat Lee as intellectual ancestor and Brahe; treat WCA as the Keplerian *law* only when certificates are auditable and joules are labeled by measurement tier.

### 1.3 Product lock (do not drift)

- Beat Lee on **functional proof**: codebase + whitepaper pathway + Medium — not better chalkboards.
- Compose with System One; do not clone it.
- Do not compete with Taalas / World Labs for silicon or world-model primacy.
- Honesty: `board_synth_claimed=false`; OpenIE joule honesty; Rust 1.98 hot path.

---

## 2. Literature: notational intelligence lineage (deepened)

### 2.1 Classical nodes

| Node | Year | Primary URL | One-line claim | Relation to Charlot |
|------|------|-------------|----------------|---------------------|
| **Kenneth E. Iverson**, *Notation as a Tool of Thought* (Turing Award; CACM) | 1979/1980 | https://dl.acm.org/doi/10.1145/358896.358899 ; PDF https://www.eecg.utoronto.ca/~jzhu/csc326/readings/iverson.pdf | Executable + unambiguous programming notation as a tool of thought (APL). | Closest classical ancestor to “notation that runs.” WCA is Iverson for *commit*, not array ops. |
| **Douglas Engelbart**, *Augmenting Human Intellect* | 1962 | https://www.dougengelbart.org/pubs/augment-3906-Framework.html | H-LAM/T: Human using Language, Artifacts, Methodology, Training as one augmented system. | Schemas + gate + human policy layer. |
| **Alan Kay**, *A Personal Computer for Children of All Ages* (Dynabook) | 1972 | https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf | Personal dynamic medium that changes thought patterns. | Medium thesis; Charlot specializes to **AI↔Machine commit**. |
| **Kay & Goldberg**, *Personal Dynamic Media* | 1977 | Overview https://en.wikipedia.org/wiki/Dynabook | Dynabook vision as personal dynamic media. | UI/medium, not plant certificates. |
| **Bret Victor**, *Inventing on Principle* | 2012 | https://www.youtube.com/watch?v=PUv66718DII ; archive https://archive.org/details/vimeo-36579366 | Immediate connection between idea and consequence. | Motivates short propose→certify→sense loops. |
| **Bret Victor**, *Media for Thinking the Unthinkable* | 2013 | https://worrydream.com/MediaForThinkingTheUnthinkable/ | Representations must upgrade for unthinkable system understanding. | Supports commit nomenclature as representation upgrade. |
| **Linus Lee (thesephist)**, *Notational intelligence* | 2022-01-02 | https://thesephist.com/posts/notation/ | Better notations can contribute *more* than automated tools to effective intelligence; coins **notational intelligence**. | **Brahe node.** Dynamic/computable notation; human-first; no refuse-to-commit law. |
| **Linus Lee × The Gradient**, *At the Boundary of Machine and Mind* | 2022 | https://thegradientpub.substack.com/p/linus-lee-at-the-boundary-of-machine | Notation vs language; inventing notations; LM interfaces. | Public expansion; still interface/creative-work centered. |
| **Linus Lee**, *Notational Intelligence* talk (Compile / Cursor) | listed Jun 2026 | https://thesephist.com/ ; YouTube index https://www.youtube.com/watch?v=rv_VS189aVI | Mechanizing invention of new alphabets/notations with DL. | Meta-notation R&D; orthogonal to plant energy certificates. Talk details beyond listing are **[UNVERIFIED]** without transcript audit. |
| **Andy Matuschak & Michael Nielsen**, *How can we develop transformative tools for thought?* | 2019 | https://numinous.productions/ttft/ | TfT undersupplied; insight-through-making; mnemonic medium. | Diagnostic of why NI stalls commercially. |
| **François Chollet**, *On the Measure of Intelligence* | 2019 | https://arxiv.org/abs/1911.01547 | Intelligence ≈ skill-acquisition efficiency / generalization. | Lee cites Chollet; Charlot adds an **energy denominator**. |
| **Terence Tao** (notation properties; via Lee) | various | Summarized in Lee’s essay | Unambiguity / expressiveness / suggestiveness / natural transformation. | Apply checklist to `wca.commit.v1`. |

**Lineage judgment.** Iverson → Engelbart → Kay → Victor → Lee → Matuschak/Nielsen: **symbols + media change what thoughts are cheap.** Charlot’s discontinuity: for agentic Physical AI, expensive mistakes are commits, so the notation that matters is the one the runtime cannot ignore.

### 2.2 What Lee actually says (fair paraphrase)

From the live fetch of the 2022 essay:

- Inventing better notations can contribute **far more** than automated tools to effective intelligence.
- Good notation properties (via Tao): unambiguity, expressiveness, suggestiveness, natural transformation.
- **Computable notation** (programming languages, Wolfram Language, interactive media) is a new class: notation that executes.
- **Dynamic notation** (Victor-aligned): software should make symbols interactive, not clone paper into pixels.
- Success = enabling **previously unthinkable** thoughts—not mere productivity.

Charlot **keeps all of this**. The Keplerian move is to specialize “computable / dynamic notation” to the **irreversible boundary**: the symbols are `Proposal`, `Certificate`, `RefuseReason`, `CommitDecision`; the interaction is allow vs hold; the previously-unthinkable move for agents is **silent unsafe success becoming unrepresentable**.

### 2.3 Formal methods, runtime verification, certificates

NI literature rarely cites runtime verification (RV). Physical AI commit law *is* an RV-shaped problem: monitors over traces of propose/certify/act.

| Work | URL | Why it matters for WCA |
|------|-----|------------------------|
| Sánchez et al., *Survey of Challenges for RV from Advanced Domains* | https://arxiv.org/abs/1811.06740 | RV beyond software; CPS / hybrid domains. |
| Bartocci & Falcone (eds.), *Lectures on Runtime Verification* | https://link.springer.com/book/10.1007/978-3-319-75632-5 | Intro + CPS monitoring chapters. |
| Yu, Žikelić, Henzinger, *Neural Control and Certificate Repair via Runtime Monitoring* | https://arxiv.org/abs/2412.12996 ; AAAI https://ojs.aaai.org/index.php/AAAI/article/view/34840 | Runtime monitor detects certificate / property violations; repair loop. Closest “certificate + runtime” cousin. |
| *Formal Verification of Neural Certificates Done Dynamically* | https://arxiv.org/pdf/2507.11987 | Lightweight runtime verification of neural certificates over lookahead regions. |
| Scalable verification of neural CBFs (LBP) | https://arxiv.org/html/2511.06341 | Verification bottleneck for neural barriers. |

**Implication.** WCA’s gate is a **narrow, plant-facing monitor** with typed refuse codes—not full LTL monitor synthesis, not SMT-backed neural CBF verification. Kinship is real; scope difference is honest.

### 2.4 Control certificates: CBF, Lyapunov, port-Hamiltonian

| Work | URL | Role |
|------|-----|------|
| Ames et al., CBF theory & applications (ECC) | https://doi.org/10.23919/ECC.2019.8796030 | Set invariance via barrier inequalities. |
| Alshiekh et al., Safe RL via Shielding | https://arxiv.org/abs/1708.08611 | Discrete shields / minimally invasive filters. |
| Dawson, Gao, Fan, Safe Control With Learned Certificates | https://arxiv.org/abs/2202.11762 | Survey of learned Lyapunov / barrier certificates. |
| Manek & Kolter, Learning Stable Deep Dynamics | https://arxiv.org/abs/2001.06116 | Joint dynamics + Lyapunov architecture. |
| Greydanus et al., Hamiltonian Neural Networks | https://arxiv.org/abs/1906.01563 | Physics-informed energy structure. |
| Roth et al., Stable Port-Hamiltonian Neural Networks | https://arxiv.org/abs/2502.02480 | pH structure as certificate language. |
| Zhong et al., Neural Energy Casimir Control | https://arxiv.org/abs/2112.03339 | Energy-Casimir control with neural models. |
| Leung & Paré, Energy-Aware Bayesian CBFs | https://arxiv.org/abs/2512.24493 | Energy barriers + GP posteriors; high-probability safety. |

**WCA stance.** Classic SoC uses structural energy (`V̇` / fixed-point PH) ∧ Boolean LUT—not a full CBF-QP. Dual compose `lut_and_safe_and_cbf` exists in `wca-lyap-plant` / MCP gate default. Gap vs Ames on rich plants is acknowledged; composition is the answer, not reinvention theater.

### 2.5 Energy-aware ML, LUT compute, hardware lottery

| Work | URL | Role |
|------|-----|------|
| Hooker, *The Hardware Lottery* | https://arxiv.org/abs/2009.06489 | Ideas win when hardware fits them. |
| Petersen et al., DiffLogic | https://arxiv.org/abs/2210.08277 | Differentiable logic → LUT/gate nets. |
| Bacellar et al., DWN | https://arxiv.org/abs/2410.11112 | FPGA-oriented weightless / LUT nets. |
| Ma et al., BitNet b1.58 | https://arxiv.org/abs/2402.17764 | Ternary LLM era; proposal-path kinship. |
| Wei et al., T-MAC | https://arxiv.org/abs/2407.00088 | CPU table-lookup matmul; energy wins **[paper]**. |
| TeLLMe (edge FPGA ternary LLM family) | https://arxiv.org/html/2510.15926v2 ; https://arxiv.org/abs/2504.16266 | Board-context figures—gold standard WCA must eventually match. |
| Landauer 1961 | https://www.dna.caltech.edu/courses/cs191/paperscs191/landauer1961.pdf | kT ln 2 floor. |
| Horowitz, Computing’s Energy Problem (ISSCC 2014) | https://gwern.net/doc/cs/hardware/2014-horowitz-2.pdf | pJ-scale op tables for calibrating `E_*`. |

### 2.6 MCP, agent tool safety, multi-agent

| Work | URL | Role |
|------|-----|------|
| Anthropic MCP announcement | https://www.anthropic.com/news/model-context-protocol | Tool/data transport standard (Nov 2024). |
| OSWorld-Human | https://arxiv.org/abs/2506.16042 | CUA tax / computer-use benchmarks. |
| AutoGen | https://arxiv.org/abs/2308.08155 | Multi-agent frameworks. |
| MetaGPT | https://arxiv.org/abs/2308.00352 | Multi-agent software generation. |
| LeanDojo | https://leandojo.org/ ; https://arxiv.org/abs/2306.15626 | Offline theorem proving—different certificate class. |

**Compose rule.** MCP discovers and ships tool calls; WCA owns **irreversible** branches (`mcp_gate.rs`, `wca-mcp-gate`). Multi-agent debate does not create plant safety: many propose, **one** commit gate.

### 2.7 World models, specialized silicon, biology, Active Inference

Covered in pathway map (§4). Primary cites retained: Ha & Schmidhuber World Models (https://arxiv.org/abs/1803.10122); DreamerV3 (https://arxiv.org/abs/2301.04104); Meta/LeCun JEPA discussion (https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/); Groq / Etched / Taalas **[VENDOR]**; Loihi 2 brief; Sandberg (https://arxiv.org/abs/1602.04019); cortical partitioning nuance (https://arxiv.org/abs/2102.06273); Friston FEP (https://www.nature.com/articles/nrn2787); OpenIE joule-lang (https://github.com/openIE-dev/joule-lang).

---

## 3. Steelmanned counters (expanded)

Each counter is stated in its strongest form, then answered. Keep all eight from the memo; add three from deeper literature.

### 3.1 Scale-only (“just train bigger”)

**Steelman.** Scaling lore: capability emerges from scale + data; notation design is boutique.

**Reply.** Hooker’s Hardware Lottery shows ideas win when hardware fits. DiffLogic / DWN / LogicNets / TeLLMe / T-MAC win by training for LUTs and table-lookup. Scale without a commit law still pays propose→discard and false-act tax. **Compose:** scaled proposers *behind* the gate.

### 3.2 Sapir–Whorf skepticism

**Steelman.** Strong linguistic determinism is rejected (McWhorter *The Language Hoax*; Pullum overview https://pullum.ppls.ed.ac.uk/LingRelativity.pdf).

**Reply.** Charlot needs Iverson’s weaker claim: executable notation changes which operations are cheap and which errors are expressible. A `RefuseReason` enum does not cage cognition; it makes **silent unsafe commit** unrepresentable as success.

### 3.3 Natural language is sufficient (LLMs + MCP)

**Steelman.** LLMs + MCP are the universal interface; typed System One decisions shrink the need for new notation.

**Reply.** NL + MCP solve discovery and transport, not plant passivity / energy / Boolean allow. System One collapses generation tax; it does not certify Lyapunov / energy before actuators. Probability routes; certificates commit. **Compose:** System One / MCP upstream; WCA on irreversible branches.

### 3.4 Formalization bureaucracy

**Steelman.** Certificates and schemas slow iteration; vibe coding ships.

**Reply.** Bureaucracy is real when formalization wraps everything. WCA formalizes **only the commit boundary** (4-bit allow LUT + PH check; schemas in `artifacts/schemas/wca.commit.v1/`). Read-only / reversible tools may bypass. Ames-style minimally invasive filtering—not full verification of the proposer.

### 3.5 Verification energy tax

**Steelman.** Checking certificates can dominate edge budgets.

**Reply.** Valid for heavy QP / SMT each step. Invalid for burned LUT-6 + fixed-point PH sized for the plant. Seed-1 golden: `lut_reads=16`, `ph_muls=64`, episode J ≈ 8.6795e-10 **[SURROGATE]**. Obligation: meter gate J vs proposal J; kill designs where gate > benefit.

### 3.6 Certificate false security

**Steelman.** “Certified” becomes cargo-cult; wrong V with a green light is worse than an honest soft policy.

**Reply.** Strongest objection. Mitigations: continuous twin; Safe Q16.16 false_allow=0 goal; refuse reason split; never market soft confidence as certificate. Still missing vs SOTA: disturbance ISS, learned verified Lyapunov, Bayesian credibility budgets (Leung & Paré). Document residual assumptions.

### 3.7 CBF / Lyapunov already solved it

**Steelman.** Academic CBF-QP and neural Lyapunov make WCA redundant.

**Reply.** CBF certifies set invariance; Lyapunov/energy certifies decrease / passivity. WCA’s `V̇` gate is structural energy, not a full CBF QP. Composition `lut ∧ energy_ok ∧ cbf_ok` is the honest next step already sketched in product docs.

### 3.8 Surrogate vs measured joules

**Steelman.** OpCounter × analytical E_* is cosplay; MLPerf Tiny / Joulescope / TeLLMe board watts are the adult table.

**Reply.** **Agree.** Label `board_synth_claimed=false` and publish tier A/B/C. Do not put surrogate J in a “watts” claim on Medium.

### 3.9 Runtime monitoring already covers certificates (NEW)

**Steelman.** Yu / Žikelić / Henzinger and dynamic neural-certificate monitors already do runtime certificate checking; WCA reinvents RV.

**Reply.** Those works target neural policy + certificate *repair* and lookahead verification—valuable and citeable. WCA’s contribution is **product nomenclature + LUT-exportable discrete shield + energy conjunct + MCP irreversible beachhead** as a shipping software reference, not a new RV theory paper. Compose: adopt their repair/monitor ideas for learned certificates; keep Boolean LUT for FPGA export.

### 3.10 World models make commit law unnecessary (NEW)

**Steelman.** If the world model is accurate enough, predicted unsafe acts are never proposed.

**Reply.** Prediction error is not zero. Holodeck safety protocols exist in fiction precisely because generators are unbounded. World models / JEPA compose as **proposer imagination**; the gate still refuses physically illegal commits. Physics-informed (HNN / pH-NN) world models compose especially well with EFA certificates.

### 3.11 Specialized silicon makes software gates irrelevant (NEW)

**Steelman.** Taalas / Groq / Etched collapse tokens/J; software commit gates are latency theater.

**Reply.** Tokens/J is the proposal path. It does not own refuse-to-commit for actuators or irreversible tools. Specialized inference lowers proposal cost; Charlot still agrees with the lottery diagnosis → LUT-first, not another HBM race. Vendor tok/s and W remain **[VENDOR]** until independent DUT.

---

## 4. Pathway map vs WCA / OpenIE / System One

### 4.1 Compete vs compose table

| Pathway | Stance if claimed as substitute | Compose with WCA | Key cites |
|---------|--------------------------------|------------------|-----------|
| World models | “Prediction is safety” | Proposer / imagination | Ha & Schmidhuber; DreamerV3; JEPA blog |
| Etched / Groq / Taalas | “Tokens/J is the whole game” | Cheap proposal path | Vendor sites **[VENDOR]**; Hooker |
| System One (Jev / Laya) | “Typed NL replaces commit law” | Upstream decision tax cut | https://laya-ai.com/system-one-models ; arXiv 2503.23303, 2510.01237 |
| Lean / neuro-symbolic | “Proofs replace runtime gate” | Offline properties | LeanDojo |
| MCP / CUA agents | “Tools are enough” | Transport + irreversible class | Anthropic MCP; OSWorld-Human |
| CBF / shields | “Already solved” | Add `cbf_ok` conjunct | Ames; Alshiekh; Dawson |
| pH / Landauer / thermodynamic | “Theory without product” | EFA certificate language | Roth; Landauer; OpenIE joule-lang |
| Neuromorphic | “Spikes replace LUTs” | Sensing / sparse proposal | Loihi 2 brief |
| Active Inference | “FEP is the control law” | Surprise → refuse prior | Friston FEP |
| Multi-agent | “Society of minds is safety” | Many propose, one commit | AutoGen; MetaGPT |
| Biology ~20 W | “We can’t match it anyway” | Aspiration + accounting honesty | Sandberg; 2102.06273 |

### 4.2 ASCII map

```
                    COMPETE                          COMPOSE WITH WCA
                    -------                          -----------------
World models        "prediction is safety"           proposer / imagination
Etched/Groq/Taalas  "tokens/J is the whole game"     cheap proposal path
System One          "typed NL replaces commit law"   upstream decision tax cut
Lean agents         "proofs replace runtime gate"    offline properties
MCP/CUA             "tools are enough"               transport + irreversible class
CBF/shields         "already solved"                 add cbf_ok conjunct
pH / Landauer       "theory without product"         EFA certificate language
Neuromorphic        "spikes replace LUTs"            sensing / sparse proposal
Active Inference    "FEP is the control law"         surprise → refuse prior
Multi-agent         "society of minds is safety"     many propose, one commit
Biology 20W         "we can't match it anyway"       aspiration + accounting honesty
Runtime cert monitors "RV replaces product gate"     repair/monitor kinship
```

### 4.3 System One → WCA → plant (product diagram)

From `SYSTEM_ONE_TO_WCA.md`:

```
state → System One (typed branch) → only if machine action
      → Proposal (TLMM / agent u)
      → Commit Gate: lut ∧ safe [∧ cbf]
      → allow: plant_action = u | refuse: plant_action = 0 + RefuseReason[]
```

Deck line: *System One decides in software. WCA decides whether the machine is allowed to move.*

---

## 5. Energy / joule scoreboard (honesty tiers)

### 5.1 Measurement tiers (OpenIE discipline)

| Tier | Name | Meaning | Allowed claim language |
|------|------|---------|------------------------|
| **A** | Surrogate | OpCounter × analytical `E_*` (`joule.rs`) | “surrogate joules,” never “board watts” |
| **B** | Post-synth estimate | Vendor cell libs / P&R power reports | “estimated post-synth W” with tool chain named |
| **C** | Board meter | Joulescope / shunt / MLPerf-class DUT | “measured W” |

Current stack: **Tier A only.** `board_synth_claimed=false` always.

### 5.2 Scoreboard (verified numbers only)

| System | Quantity | Value | Source | Notes |
|--------|----------|-------|--------|-------|
| Human brain (classic) | Metabolic power order | ~20 W | Sandberg https://arxiv.org/abs/1602.04019 | Order-of-magnitude; not all compute. |
| Brain energy partitioning | Cortical ATP nuance | Computation ≪ total glucose power | https://arxiv.org/abs/2102.06273 | Undercuts naive 20 W = AI budget. |
| Landauer limit | Min heat / irreversible bit erase | kT ln 2 | Landauer PDF | Floor, not CMOS design point. |
| CMOS op energy | pJ-scale ops by node | table values | Horowitz 2014 | Calibrate `E_*` only. |
| DiffLogic | Throughput example | >1M MNIST img/s/CPU core **[paper]** | https://arxiv.org/abs/2210.08277 | Energy depends on deployment. |
| DWN | FPGA energy/latency | paper figures | https://arxiv.org/abs/2410.11112 | Model for future DUT. |
| BitNet b1.58 | Ternary LLM claim | match FP16 from ~3B class **[paper]** | https://arxiv.org/abs/2402.17764 | Proposal kinship. |
| T-MAC | CPU table-lookup | ~4× throughput / ~70% energy ↓ vs llama.cpp **[paper]** | https://arxiv.org/abs/2407.00088 | Axis B. |
| TeLLMe | Edge FPGA ternary LLM | ≤~5–7 W class / tok/s in paper family | https://arxiv.org/html/2510.15926v2 | Board-context gold standard. |
| NVIDIA H100 | TDP | 700 W class | NVIDIA datasheet **[VENDOR]** | Ceiling, not intelligence. |
| Groq / Etched / Taalas | tok/s , W | **[VENDOR]** | vendor sites | Exclude from scientific scoreboard. |
| Loihi 2 | App-level W | workload-specific | Intel brief | Not drop-in LLM. |
| **wca-lut-edge seed-1** | Episode surrogate J | **~8.6795e-10**; committed 1 / refused 15 | README / live run Sep 29 2026 EDT | **[SURROGATE]**; `board_synth_claimed=false` |
| wca util/J | Internal scalar | commit-count utility | RESULTS / SOTA_SCAN | Easy to game; not MLPerf. |

**Scoreboard moral.** Near-term Charlot metric: **task-quality / joule_tier_C** (board), with tier A labeled surrogate. Brain ~20 W is an existence proof, not a claim WCA can make.

### 5.3 Seed-1 golden (verified on box)

Live run (`cargo run --release --bin wca-soc-loop -- --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1`), Tue Sep 29, 2026 EDT:

- committed=1, refused=15, energy_only refuses=15
- J=8.679500e-10 **[SURROGATE]**
- ops: bram=64, lut_reads=16, lut6_toggles=3, ph_muls=64, ph_adds=48
- `board_synth_claimed=false`

---

## 6. Runtime nomenclature as product (`wca.commit.v1`)

### 6.1 Wire types

| Type | Schema | Rust twin | Role |
|------|--------|-----------|------|
| Proposal | `Proposal.schema.json` | `schema.rs` | Cheap propose; never self-commits |
| Certificate | `Certificate.schema.json` | | LUT ∧ energy (∧ optional CBF) + metrics |
| RefuseReason | `RefuseReason.schema.json` | | `lut_veto`, `energy_veto`, `cbf_veto`, `budget_exceeded`, `policy` |
| CommitDecision | `CommitDecision.schema.json` | | Envelope → `plant_action` |

Compose enums: `lut_and_energy` | `lut_and_safe` | `lut_and_safe_and_cbf` | `energy_only` | `lut_only`.

### 6.2 Tao checklist applied to the schemas

| Property | How `wca.commit.v1` aims to satisfy it |
|----------|----------------------------------------|
| Unambiguity | `decision` ∈ {allow, refuse}; `commit` boolean tied to decision; refuse codes are typed, not free-form strings |
| Expressiveness | Covers LUT veto, energy veto, CBF veto, budget, policy; compose ablations for bake-offs |
| Suggestiveness | `lut_allow ∧ energy_ok` reads like the engineering predicate |
| Natural transformation | MCP `tools/call` → Proposal → Certificate → CommitDecision is a natural map from agent tool space to plant space |

### 6.3 MCP irreversible beachhead

From `PRODUCT.md` / `mcp_gate_demo.json` (verified `--demo` run):

- `read_only` may bypass certificate
- `irreversible` requires Certificate; refuse ⇒ `executed=false`, executor never called
- default compose for gate demo: `LutAndSafeAndCbf`
- `RecordingExecutor` never touches real I/O in demo mode

---

## 7. Star Trek capability map (metaphor)

Fiction → engineering ownership. **No claim that WCA delivers Trek tech.**

| Trek capability | Measure | Propose | Commit / Refuse | Human layer |
|-----------------|---------|---------|-----------------|-------------|
| Ship computer Q&A | Sensors + state | NL / System One | Usually N/A (read-only) | Trust calibration |
| Navigational course | Localization | Trajectory / world model | Energy + collision CBF + mission LUT | Helm override |
| Manipulator / tractor | Force sensing | Policy residual | PH passivity + wrench limits | Ethics / ROE |
| Holodeck safety | Occupant tracking | Scene generator | Hard safety interlocks = commit gate | Protocols-off = disaster argument *for* certificates |
| Replicator | Inventory / energy | Generative design | Mass/energy conservation certificate | Scarcity / law |
| Away-team agent | Multimodal sense | Hypothesis generator | Sample/destruction tools gated irreversible | Medical ethics |
| Multi-crew decision | Shared state | Multi-agent debate | Single commit authority | Captain / doctrine |

**Punchline.** Star Trek already wrote refuse-to-commit as drama. Charlot’s program: **safety protocols = executable notation with joule receipts.**

---

## 8. Whitepaper outline (ready to lift)

**Working title:** *Notational Intelligence → Commit Law: LUT ∧ Energy Certificates for Agentic Physical AI*

1. **Introduction** — Brahe/Kepler framing; Lee cited generously; problem = irreversible commit under joule budgets.
2. **Related work** — NI lineage; DiffLogic/DWN/NeuraLUT; TeLLMe/T-MAC; CBF/shields; pH-NN; RV certificate monitors; System One complement; MCP.
3. **Nomenclature** — `wca.commit.v1` schemas; compose predicates; RefuseReason taxonomy.
4. **Architecture** — sense → propose(TLMM|agent) → certify(LUT∧PH[∧CBF]) → commit|refuse; Rust hot path; Icarus oracle.
5. **Energy accounting** — OpCounter; tier A/B/C; `board_synth_claimed` discipline.
6. **Experiments (current software reference)** — seed-1 SoC golden; Safe PH false-allow; gate bake-off; lyap-plant dual compose; MCP gate demo; TLMM scale under joule budget.
7. **Experiments (required before strong claims)** — CBF baseline bake-off vs Ames-style QP; second plant; DUT joule tier C; util ≠ commit-count.
8. **Limitations** — toy plants; surrogate J; no board synth; incomplete ISS / Bayesian barriers.
9. **Conclusion** — compose, don’t compete; honesty as notational contribution.

**Claims allowed now:** compositional software-reference novelty; false-allow=0 Safe PH on toy grids; iso-correct TLMM; auditable OpCounter; MCP refuse-before-execute.

**Claims forbidden now:** board W; brain-matching efficiency; “first energy-aware AI”; beating Jev on latency; silicon leadership.

---

## 9. Demo / code appendix (real paths only)

### 9.1 Layout (from README)

```
wca-lut-edge/
  README.md
  ARCHITECTURE.md
  Cargo.toml                 # Rust workspace (1.98 day-to-day)
  crates/wca-commit/         # SoC + burn + rtl-verify lib + bins
    src/
      schema.rs              # Proposal, Certificate, RefuseReason, CommitDecision
      lut.rs                 # AllowLut
      ph.rs                  # FixedPointPH / Safe
      cbf.rs / lyap.rs       # optional CBF / dual plant
      tlmm.rs                # ternary proposal path
      episode.rs             # SoC episode loop
      mcp_gate.rs            # irreversible tool gate
      joule.rs               # OpCounter × E_* [SURROGATE]
      bin/wca-soc-loop.rs
      bin/wca-mcp-gate.rs
      bin/wca-lut-burn.rs
      bin/wca-rtl-verify.rs
      bin/wca-lyap-plant.rs
      …
  artifacts/schemas/wca.commit.v1/
  artifacts/mcp_gate_demo.json
  artifacts/fpga/            # .v / .mem — Icarus sim OK; no board synth claimed
  tools/py_train/            # DiffLogic train-only exception
```

### 9.2 How a reader runs demos

Verified toolchain: `rustc 1.98.0` (2026-08-18).

```bash
cd /workspace/wca-lut-edge
rustc --version   # expect 1.98.x

# Primary CI
cargo test -p wca-commit

# MCP Commit Gate demo (irreversible refuse / allow)
cargo run --release --bin wca-mcp-gate -- --demo --out artifacts/mcp_gate_demo.json

# SoC episode (seed-1 golden: committed=1 refused=15 J≈8.6795e-10)
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1

# Safe PH mode
cargo run --release --bin wca-soc-loop -- --safe-ph --steps 16 --seed 1

# Dual compose lut ∧ safe ∧ cbf
cargo run --release --bin wca-lyap-plant -- --out artifacts/lyap_plant_report.json

# Burn allow LUT (+ optional PH / SoC wrappers)
cargo run --release --bin wca-lut-burn -- --allow-mask 21887 --n-bits 4 --with-ph --with-soc

# Bit-exact verify (requires iverilog + vvp)
cargo run --release --bin wca-rtl-verify -- \
  --verilog artifacts/fpga/wca_allow_lut.v --mem artifacts/fpga/wca_allow_lut.mem

# Schema roundtrip
cargo test -p wca-commit schema::
cargo test -p wca-commit mcp_gate::
```

### 9.3 Example CommitDecision (real file)

Source: `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` — seed-1 step 0 pattern: LUT allows, energy vetoes, `plant_action = [0.0]`, `board_synth_claimed: false`.

### 9.4 Crate map → diagram boxes

| Diagram box | Code |
|-------------|------|
| TLMM propose | `tlmm.rs`, `wca_tlmm*.v` |
| LUT allow | `lut.rs`, `wca_allow_lut.{v,mem}` |
| Energy / Safe | `ph.rs`, `wca_ph_energy.v`; `--safe-ph` |
| CBF / dual | `cbf.rs`, `lyap.rs`; `wca-lyap-plant` |
| Episode loop | `episode.rs`, `wca-soc-loop` |
| Wire types | `schema.rs` + schemas dir |
| MCP gate | `mcp_gate.rs`, `wca-mcp-gate` |
| Joules | `joule.rs` (**[SURROGATE]**) |

---

## 10. Implications for Medium / code / OpenIE

| Action | Why |
|--------|-----|
| Keep `wca.commit.v1` as the **notation product** | Moat = nomenclature, not weights |
| Ship MCP irreversible adapter | Beachhead where CUAs destroy state |
| Meter gate_J / proposal_J | Answers verification-energy counter |
| Optional `cbf_ok` conjunct | Closes Ames gap without abandoning LUT export |
| OpenIE / joule-lang kinship | Compile-time budgets ↔ runtime certificates |
| Never flip `board_synth_claimed` without Vivado/Quartus + meter | Integrity |
| Medium #1 = Brahe→Kepler narrative; #2 = satiation | Public series; study = backbone |

---

## 11. Bibliography (primary URLs only)

### Notational intelligence & tools for thought
- Lee, L. *Notational intelligence.* https://thesephist.com/posts/notation/
- Lee × Gradient. https://thegradientpub.substack.com/p/linus-lee-at-the-boundary-of-machine
- thesephist speaking index (Compile Jun 2026 listing). https://thesephist.com/
- Iverson, K. E. *Notation as a Tool of Thought.* https://dl.acm.org/doi/10.1145/358896.358899
- Engelbart, D. *Augmenting Human Intellect* (1962). https://www.dougengelbart.org/pubs/augment-3906-Framework.html
- Kay, A. *A Personal Computer for Children of All Ages* (1972). https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf
- Victor, B. *Media for Thinking the Unthinkable.* https://worrydream.com/MediaForThinkingTheUnthinkable/
- Victor, B. *Inventing on Principle.* https://www.youtube.com/watch?v=PUv66718DII
- Matuschak, A. & Nielsen, M. *Transformative tools for thought.* https://numinous.productions/ttft/
- Chollet, F. *On the Measure of Intelligence.* https://arxiv.org/abs/1911.01547

### Formal methods, RV, certificates, CBF / energy
- Sánchez et al. RV domains survey. https://arxiv.org/abs/1811.06740
- Bartocci & Falcone (eds.). *Lectures on Runtime Verification.* https://link.springer.com/book/10.1007/978-3-319-75632-5
- Yu, Žikelić, Henzinger. Certificate repair via runtime monitoring. https://arxiv.org/abs/2412.12996
- Dynamic verification of neural certificates. https://arxiv.org/pdf/2507.11987
- Scalable neural CBF verification (LBP). https://arxiv.org/html/2511.06341
- Ames et al. CBF ECC. https://doi.org/10.23919/ECC.2019.8796030
- Alshiekh et al. Shielding. https://arxiv.org/abs/1708.08611
- Dawson et al. Learned certificates. https://arxiv.org/abs/2202.11762
- Manek & Kolter. Stable deep dynamics. https://arxiv.org/abs/2001.06116
- Leung & Paré. Energy-aware Bayesian CBF. https://arxiv.org/abs/2512.24493
- Greydanus et al. HNN. https://arxiv.org/abs/1906.01563
- Roth et al. Stable pH-NN. https://arxiv.org/abs/2502.02480
- Zhong et al. Neural Energy Casimir. https://arxiv.org/abs/2112.03339

### Energy, LUT, hardware lottery
- Hooker. Hardware Lottery. https://arxiv.org/abs/2009.06489
- Petersen et al. DiffLogic. https://arxiv.org/abs/2210.08277
- Bacellar et al. DWN. https://arxiv.org/abs/2410.11112
- Ma et al. BitNet b1.58. https://arxiv.org/abs/2402.17764
- Wei et al. T-MAC. https://arxiv.org/abs/2407.00088
- TeLLMe family. https://arxiv.org/html/2510.15926v2 ; https://arxiv.org/abs/2504.16266
- Landauer 1961. https://www.dna.caltech.edu/courses/cs191/paperscs191/landauer1961.pdf
- Horowitz 2014. https://gwern.net/doc/cs/hardware/2014-horowitz-2.pdf
- Sandberg brain energetics. https://arxiv.org/abs/1602.04019
- Cortical energy partitioning. https://arxiv.org/abs/2102.06273

### World models, agents, MCP, biology adjacent
- Ha & Schmidhuber. World Models. https://arxiv.org/abs/1803.10122
- Hafner et al. DreamerV3. https://arxiv.org/abs/2301.04104
- Meta / LeCun JEPA discussion. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/
- Anthropic MCP. https://www.anthropic.com/news/model-context-protocol
- OSWorld-Human. https://arxiv.org/abs/2506.16042
- AutoGen. https://arxiv.org/abs/2308.08155
- MetaGPT. https://arxiv.org/abs/2308.00352
- LeanDojo. https://leandojo.org/ ; https://arxiv.org/abs/2306.15626
- Friston FEP. https://www.nature.com/articles/nrn2787
- OpenIE joule-lang. https://github.com/openIE-dev/joule-lang
- Laya System One. https://laya-ai.com/system-one-models
- Laya-adjacent arXiv. https://arxiv.org/abs/2503.23303 ; https://arxiv.org/abs/2510.01237

### Local stack
- `README.md`, `ARCHITECTURE.md`
- `artifacts/SOTA_SCAN.md`, `PRODUCT_LANDSCAPE.md`, `PRODUCT.md`, `SYSTEM_ONE_TO_WCA.md`, `RESULTS.md`
- `artifacts/schemas/wca.commit.v1/`
- `artifacts/NOTATIONAL_INTELLIGENCE_RESEARCH.md` (prior memo)
- `artifacts/presentations/MEDIUM_SATIATION.md` (Medium #2)

---

## 12. Honesty appendix

| Item | Status |
|------|--------|
| Lee essay quotes / paraphrase | Live fetch https://thesephist.com/posts/notation/ (2022-01-02) |
| Compile 2026 talk details | Secondary (site/YouTube listings); don’t over-quote without transcript → residual **[UNVERIFIED]** on talk substance |
| TypeSafe Jev architecture / exact multiples | **[VENDOR/PRESS]** — see PRODUCT_LANDSCAPE |
| Groq / Etched / Taalas absolute tok/s and W | **[VENDOR]** |
| Brain = 20 W “compute” | Oversimplified; cite partitioning papers |
| wca episode joules | **[SURROGATE]** analytical OpCounter |
| `board_synth_claimed` | **false** |
| “First” compositional LUT∧PH∧TLMM product | Plausible white space per Sep 2026 scan—not a guarantee against unknown private systems |
| OpenIE joule-lang | Public GitHub; integration depth **evolving**, not peer-reviewed SOTA |
| Star Trek mapping | Metaphor only |
| Sapir–Whorf | Weak form only |
| LeCun 2022 AMI PDF | Prefer Meta blog; avoid unstable mirror hashes |
| Neural certificate runtime papers (2412.12996, 2507.11987, 2511.06341) | Fetched via search indexes in method window; PDF/HTML URLs listed—quote numbers only from primary text if used in future whitepaper |
| Exact McWhorter page cites beyond Pullum overview | Prefer Pullum / Webster critical discussion URLs already in memo |

**Method stamp:** WebSearch + WebFetch + local artifact read + live `cargo` demos on 2026-09-29 EDT (continuing into Sep 30 window for study polish). No citations invented to fill holes.

---

## 13. Bottom line for David

1. **Keep Lee as Brahe**—cite him generously; do not punch down.
2. **Own Kepler**—`wca.commit.v1` + LUT∧EFA as *runtime law*, with functional proof in this repo.
3. **Compose, don’t compete** with System One, MCP, world models, Groq-class inference, CBF theory, and RV certificate monitors.
4. **Win the honesty war** on joules and certificates; that *is* the notational contribution.
5. **Ship the irreversible-tool beachhead** while the whitepaper strengthens plants, CBF baselines, and DUT meters.
6. **Public series:** Medium #1 (this Kepler frame) + Medium #2 (satiation) + this study as backbone.

*End of study.*
