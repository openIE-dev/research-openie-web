---
title: "Notational Intelligence as Commit Law"
deck: "System One decides in software. Wise Computer Automation decides whether the machine is allowed to move."
id: ni
status: "Teaching paper · research study draft"
author: "David Charlot · Open Interface Engineering"
figures: "/living/ni/"
pdf: "/pdfs/ni.pdf"
board_synth_claimed: false
---

# Notational Intelligence as Commit Law

**Who this is for.** Engineers, operators, and students who want to understand why symbols matter at the moment a machine is allowed to move. You do not need a control-theory background. You do need patience for one careful definition at a time.

**Honesty.** This is a teaching paper and research study draft, not a final journal article. The software reference does not claim Field-Programmable Gate Array (FPGA) board synthesis. The flag stays `board_synth_claimed=false`. Surrogate energy numbers are labeled **[SURROGATE]**. Soft analogies are labeled **[SOFT]**. Vendor numbers stay **[VENDOR]**. Unverified items stay **[UNVERIFIED]**.

**Public.** https://research.openie.dev/papers/ni/ · PDF https://research.openie.dev/pdfs/ni.pdf · Figures https://research.openie.dev/living/ni/

---

## What you will learn

- Why better symbols can matter more than louder tools, and why that claim is incomplete for agents that move matter.
- What Wise Computer Automation (WCA) means as a teachable commit boundary: Proposal, Certificate, RefuseReason, CommitDecision.
- How a Look-Up Table (LUT) allow bit can combine with an energy check (and optionally a Control Barrier Function) before irreversible action.
- How to read honest energy claims by tier, and why surrogate joules are not board watts.
- How to answer common objections without abandoning the claim or inventing evidence.

---

## Glossary

| Term | Plain meaning in this paper |
|------|-----------------------------|
| **Open Interface Engineering (OpenIE)** | Delaware B-Corp building energy-aware computing infrastructure. Public research home: research.openie.dev. |
| **Notational intelligence** | Linus Lee's phrase (2022): better notations can raise effective intelligence more than automated tools alone. |
| **Commit law** | Runtime rule the machine cannot ignore: allow the action, or refuse and hold. |
| **Wise Computer Automation (WCA)** | OpenIE's product name for automation that treats commit and refuse as first-class law at the AI-to-machine boundary. |
| **Energy-First Architecture (EFA)** | Discipline that prices action in energy terms and uses energy structure as part of the certificate, not as a slide after the fact. |
| **Proposal** | Cheap proposed action `u` plus state. Never self-authorizing. |
| **Certificate** | Gate-owned allow or refuse record: look-up allow AND energy OK, optionally AND barrier OK. |
| **RefuseReason** | Typed veto code such as `lut_veto`, `energy_veto`, `cbf_veto`, `budget_exceeded`, or `policy`. Not a vibe score. |
| **CommitDecision** | Envelope that either sets `plant_action = u` or holds at zeros. |
| **Look-Up Table (LUT)** | Discrete table that maps a compact state code to allow or refuse. |
| **Ternary Look-up Matrix Multiplier (TLMM)** | Cheap ternary table-lookup proposal path used in the software reference. |
| **Control Barrier Function (CBF)** | Control-theoretic certificate that keeps the system inside a safe set when its inequality holds. |
| **Model Context Protocol (MCP)** | Anthropic's tool and data transport standard for agents. Transport is not a plant certificate. |
| **System One** | Typed decision models (Laya / Jev class) that collapse generation tax for known option sets. Upstream proposers, not plant gates. |
| **port-Hamiltonian** | Structured energy dynamics used here for passivity-style energy checks on toy plants. |
| **Runtime Verification (RV)** | Checking properties on running traces. Kinship with gates; not the same as shipping product nomenclature. |
| **Device Under Test (DUT)** | Real hardware under a stated workload with a real meter. |
| **Field-Programmable Gate Array (FPGA)** | Reconfigurable silicon. Board synthesis is not claimed in this stack. |
| **DiffLogic** | Differentiable logic networks that train toward gates and look-up structures. |
| **System on Chip loop (SoC loop)** | In this repo: the software plant episode loop (`wca-soc-loop`), not a fabricated chip claim. |
| **JavaScript Object Notation (JSON)** | Text data format used for commit envelopes and demo records. |
| **Artificial General Intelligence (AGI)** | Broad human-level AI aspiration. Not a result claimed here. |
| **Information Theory (IT) / Information Science (IS)** | Shannon-to-Kolmogorov-to-Landauer tradition. Cross-entropy training is information-theoretic; that is not the same as treating commit certificates as product law. |
| **Joule tier A / B / C** | A = surrogate OpCounter times analytical energy constants. B = post-synthesis tool estimates. C = board or DUT meter. |
| **[SURROGATE] / [DUT] / [VENDOR] / [UNVERIFIED] / [SOFT]** | Honesty tags for evidence grade. |

---

## Problem in plain language

Modern AI systems are excellent at proposing.

They draft text. They suggest tool calls. They invent plans. They can sound confident while being wrong. Soft confidence strings are good for ranking options. They are bad as permission to move a plant, run a shell, spend money, or destroy a sample.

Linus Lee's essay *Notational intelligence* (thesephist, 2022) states an old truth clearly: inventing better symbols can raise effective intelligence more than inventing louder tools. He stands in a generous lineage. Kenneth Iverson treated notation as a tool of thought. Douglas Engelbart described humans plus language, artifacts, methods, and training as one augmented system. Alan Kay argued for personal dynamic media. Bret Victor argued that representations must upgrade so consequence stays close to idea. Andy Matuschak and Michael Nielsen diagnosed why tools for thought stall commercially.

That lineage is true. For agentic Physical AI it is incomplete.

The expensive mistakes are no longer only "I could not think the thought." The expensive mistakes are **commits**: torque applied, shell executed, payment sent, sample destroyed. Probability routes. Certificates commit.

The industry center of gravity is still scale: bigger transformers, more tokens per dollar, specialized inference silicon, world models as appearance catalogs. Those bets are real. They are not the same as treating lawful minimal description, joule bounds as product discipline, and certificates that commit under physical law as the primary product program.

OpenIE's teaching claim is narrow. We need notation that the runtime cannot ignore at the irreversible boundary.

---

## Core thesis

Lee is Brahe-scale for notation: precise observation that symbols amplify thought. The Keplerian step for agents that can hurt the world is to treat notation as **runtime commit and refuse law**. In the OpenIE software reference, that law is versioned wire under `wca.commit.v1`:

> Proposal → Certificate → RefuseReason → CommitDecision

Composition is conjunctive on purpose:

> commit = lut_allow ∧ energy_ok [∧ cbf_ok]

Scaled proposers stay welcome upstream. System One can decide in software. Wise Computer Automation decides whether the machine is allowed to move. Silicon joule leadership is not claimed. Board watts are not claimed. The product claim is auditable commit nomenclature you can teach, run, and refuse with typed reasons.

---

## Definitions and objects

### Notational intelligence, taught carefully

**Name.** Notational intelligence.

**Definition.** A change in symbols that makes harder thoughts cheap, clear, or newly possible.

**Why it matters.** Tools automate steps. Notation changes which steps are even thinkable. Iverson's APL made array thought executable. Lee's essay asks for notations that enable previously unthinkable thoughts, not mere productivity.

**Example.** A `RefuseReason` enum does not make a model "understand safety." It makes silent unsafe success unrepresentable as success. The bad outcome cannot be filed as a quiet win.

**Connect.** For Physical AI, the notation that matters most is the one wired into the allow-or-hold branch.

### Proposal

A Proposal is cheap. It carries a candidate action `u`, relevant state, and optional surrogate energy hints. Sources can be a Ternary Look-up Matrix Multiplier path, a System One typed decision, or an agent tool call. A Proposal never self-commits. If your design lets the proposer authorize the plant, you do not have a gate. You have a suggestion with actuators.

### Certificate

A Certificate is gate-owned. It records Boolean allow from the Look-Up Table, an energy or Safe check, and optionally a Control Barrier Function conjunct. It also carries metrics and the honesty flag `board_synth_claimed`. Soft confidence is not a Certificate. A green probability is not a Certificate.

### RefuseReason

RefuseReason is typed. Examples: `lut_veto`, `energy_veto`, `cbf_veto`, `budget_exceeded`, `policy`. Typed reasons make audit possible. "The model felt unsure" is not an audit trail.

### CommitDecision

CommitDecision is the envelope. On allow, `plant_action = u`. On refuse, hold at zeros and keep reasons. The irreversible executor runs only on allow.

### Energy-First Architecture in one paragraph

Energy-First Architecture here means: treat energy structure as part of the permission story. The software reference uses port-Hamiltonian or Safe fixed-point checks on toy plants. That is kinship with energy certificates, not a claim that the stack matches Ames-style Control Barrier Function quadratic programs on rich plants, and not a claim of board watts.

### Compose predicates (software reference)

Three teaching predicates appear often:

1. `lut_and_energy`: Look-Up Table allow and energy OK.
2. `lut_and_safe`: Look-Up Table allow and Safe energy mode.
3. `lut_and_safe_and_cbf`: Look-Up Table allow, Safe, and Control Barrier Function OK.

Read-only or reversible paths may bypass. Irreversible paths must not.

---

## How it works

### Step map

```text
state
  -> optional System One typed branch (software decision)
  -> only if machine action is required:
       Proposal (TLMM / agent / other cheap proposer)
       -> Commit Gate: lut_allow AND energy_ok [AND cbf_ok]
       -> allow: plant_action = u
       -> refuse: plant_action = 0 + RefuseReason list
```

Deck line:

> System One decides in software. Wise Computer Automation decides whether the machine is allowed to move.

### Concrete refuse example

Here is a real envelope pattern from the software reference (schema `wca.commit.v1`). The Look-Up Table allows. Energy refuses. The plant holds.

```json
{
  "schema_version": "wca.commit.v1",
  "decision": "refuse",
  "commit": false,
  "compose": "lut_and_energy",
  "certificate": {
    "lut_allow": true,
    "energy_ok": false,
    "reasons": [
      {
        "code": "energy_veto",
        "vdot_q": 1461,
        "detail": "rtl_energy_veto Vdot_q=1461 > eps_q=13"
      }
    ],
    "board_synth_claimed": false
  },
  "plant_action": [0.0],
  "board_synth_claimed": false
}
```

Teaching point: allow on one conjunct is not enough. Conjunction is the lesson.

### Model Context Protocol beachhead

Model Context Protocol solves discovery and transport for tools. It does not certify passivity or energy before actuators. In the software reference, the irreversible adapter refuses before side effects. Refuse means the executor is never called. Read-only tools may bypass. Unknown tools default to irreversible. Demo mode uses a recording executor that never touches real I/O. Demo record `mcp_gate_demo.json` shows cases such as read-only bypass, irreversible refuse (`executed=false`, `executor_calls=0`), and irreversible allow under `lut_and_safe_and_cbf`.

### Brahe then Kepler **[SOFT]**

Tycho Brahe assembled observations of rare precision without the dynamical law those observations were waiting for. Kepler turned the data into enforceable planetary motion. **[SOFT]** historical analogy: Lee is Brahe-scale for notation. Charlot's program is the bet that Proposal, Certificate, RefuseReason, and CommitDecision are the laws agents must obey at runtime, not optional documentation. Soft analogies teach orientation. They are not evidence.

---

## Evidence from the software reference

All rows below are Allowed only within the frozen claim ledger for this paper. Forbidden claims are omitted on purpose.

### Compositional software-reference novelty

The stack ships Proposal → Certificate → RefuseReason → CommitDecision as runtime commit law (`wca.commit.v1`), with Rust twins and schema files. This is a software reference. `board_synth_claimed=false`.

### Seed-1 System on Chip golden episode **[SURROGATE]**

On the measured software plant loop (`wca-soc-loop`, 16 steps, seed 1, init theta 1.5, omega 3.0):

- committed = 1
- refused = 15
- episode surrogate joules ≈ 8.6795e-10 **[SURROGATE]**
- `board_synth_claimed=false`

These joules are OpCounter times analytical energy constants. They are not board watts. They are not Device Under Test measurements. They teach that refuse can dominate an honest episode without being a slogan.

### Safe energy false-allow discipline on toy grids

Safe port-Hamiltonian mode aims for zero false-allow against continuous checks on toy plants. That is measured on toy plants only. It is not Input-to-State Stability completeness, and it is not a bake-off win against Ames-style Control Barrier Function quadratic programs.

### Dual compose on a toy plant

`lut_allow ∧ energy_ok [∧ cbf_ok]` runs on the software dual plant path. Toy dual. Not an Ames quadratic-program bake-off win.

### Model Context Protocol refuse-before-execute

Irreversible tools require a Certificate. On refuse, executed stays false and the executor is not called. Demo and software gate only. Not a production computer-use agent fleet.

### Iso-correct Ternary Look-up Matrix Multiplier under stated joule budgets **[SURROGATE]**

Control-sized paths keep table-lookup proposals inside stated surrogate joule budgets. Surrogate budget, not TeLLMe board parity.

### Auditable OpCounter accounting **[SURROGATE]**

Energy accounting is explicit and inspectable in code. Language must stay "surrogate joules," never "board watts."

### What scans support (and do not)

Sep 29-30, 2026 product and literature scans did not find a published product stack that ships Boolean allow Look-Up Table AND port-Hamiltonian / Safe energy certificate AND cheap Ternary Look-up Matrix Multiplier (or System One) proposal as one auditable commit boundary. That white space is real as a scan finding. Silicon joule leadership is not. Private unknown systems can exist. Do not upgrade a scan gap into a metaphysical first.

### Compose, do not compete (teaching table)

| Layer | Owns | Does not own |
|-------|------|--------------|
| System One / typed natural language | Software decisions | Plant energy certificates |
| World models / JEPA-class | Imagination / prediction | Permission to move |
| Groq / Etched / Taalas-class | Tokens per joule **[VENDOR]** | Refuse-to-commit |
| Wise Computer Automation / Energy-First gate | `lut ∧ safe [∧ cbf]`, refuse taxonomy | Free-form generation |
| OpenIE metering | Joule-visible budgets | Fantasy board watts |

---


### Teaching the information-science cross-cut without hype

Cross-entropy training of large models is already information-theoretic in a narrow sense. That fact does not settle product law.

Information Theory and Information Science give a spine from Shannon to Kolmogorov to Landauer. Shannon prices communication under noise. Kolmogorov prices description length. Landauer prices irreversible bit erasure with a thermodynamic lower bound. OpenIE's teaching move is different from "cite Landauer on a slide." The move is to make commit certificates and joule honesty the objects an operator can audit before matter moves.

Scale still matters. Kaplan-style and Chinchilla-style scaling results, plus Epoch cost curves, show capability and price tracking compute. Sara Hooker's Hardware Lottery shows research ideas advancing when hardware fits them. None of that erases the commit boundary. It explains why proposers got loud first.

### Why Look-Up Table allow is teachable

A Look-Up Table allow bit is intentionally boring.

You encode a compact discrete state. You look up allow or refuse. You can burn the table toward gates. You can simulate it. You can audit it. Differentiable logic work such as DiffLogic, and FPGA-oriented weightless or look-up nets, show a research path where tables and gates are the substrate rather than dense floating multiply alone.

Boring is a feature at the irreversible boundary. The gate should not invent poetry. The gate should answer: may this action run now?

### Why energy_ok is not "green vibes"

`energy_ok` in this stack means a structural check on a toy energy certificate, often port-Hamiltonian or Safe fixed-point form. Teaching translation: does the proposed action keep the energy story inside the rule we declared?

If the surrogate energy derivative exceeds epsilon, refuse. If the Look-Up Table says no, refuse. If an optional Control Barrier Function says the safe-set inequality fails, refuse. Conjunction means one green light is not enough.

### Worked walk-through for a new reader

Imagine an agent proposes a small torque on a toy rotary plant.

1. The proposer emits a Proposal with action `u` and state.
2. The Look-Up Table maps the discretized state to allow = true.
3. The energy check computes a fixed-point energy rate and compares it to a threshold.
4. The rate is too large. Certificate sets `energy_ok = false` and records `energy_veto`.
5. CommitDecision sets `commit = false` and `plant_action = [0.0]`.
6. An auditor reads the RefuseReason list and sees exactly why the plant held.

No anthropomorphism is required. The runtime did not "understand danger." It enforced a named predicate.

### What success looks like after you learn this

You should be able to teach a colleague, without slides:

- Soft confidence is not permission.
- Proposal is cheap and never self-authorizing.
- Certificate is conjunctive and gate-owned.
- RefuseReason is typed.
- Surrogate joules are labeled until a Device Under Test meter exists.
- System One can decide in software while Wise Computer Automation still owns motion.

If you can say those six sentences in your own words, the paper did its job.



### Honesty tags as part of the notation

Treat honesty tags as vocabulary students must learn:

- **[SURROGATE]**: analytical or proxy meter. Useful for development. Not board watts.
- **[DUT]**: Device Under Test measurement under a stated workload.
- **[VENDOR]**: company-reported figure. May be true. Is not independent science until checked.
- **[UNVERIFIED]**: not checked in the drafting window. Do not launder into fact.
- **[SOFT]**: analogy or pattern recognition. Orientation aid, not proof.

A paper that hides these tags teaches the wrong lesson: that certainty is a prose style. Certainty is an evidence grade.


## Common confusions and counters

Each counter is stated in strong form, then answered briefly.

### "Just scale the model."

Scaled proposers without a commit law still pay propose-then-discard tax and false-act tax. Bigger models belong behind the gate, not instead of it. Hooker's *Hardware Lottery* reminds us ideas win when hardware fits them. Look-up and logic-net lines exist because substrates matter.

### "Natural language plus Model Context Protocol is enough."

They solve discovery and transport. They do not certify passivity or energy before actuators. Typed System One decisions shrink generation cost. They still do not own plant certificates. Probability routes. Certificates commit.

### "This is Sapir-Whorf. Language does not determine thought."

Strong linguistic determinism is rejected here. The weak Iverson claim is enough: executable notation changes which operations are cheap and which errors are expressible. A RefuseReason enum does not cage cognition. It makes silent unsafe commit unrepresentable as success.

### "Formalization is bureaucracy."

Bureaucracy is real when you formalize everything. This stack formalizes only the commit boundary: a cheap Look-Up Table and an energy check, with optional barrier conjunct. Read-only and reversible paths can bypass. That is minimally invasive filtering, not a proof of the whole agent.

### "Checking certificates will burn the edge budget."

Valid for heavy quadratic programs or SMT every step. Weaker for a burned Look-Up Table plus fixed-point energy sized for the plant. Seed-1 golden episode numbers above are **[SURROGATE]** evidence that the gate can be small relative to a full generative proposer. Obligation remains: meter gate joules versus proposal joules on real workloads. That split meter is not fully shipped as product empirics.

### "Certificates create false security."

Strongest objection. A wrong energy model with a green light is worse than an honest soft policy. Mitigations in this stack: continuous twin checks on toys; refuse reason split; never market soft confidence as a certificate; label joule tiers so surrogate never masquerades as silicon. Still missing versus state of the art: disturbance completeness, learned verified Lyapunov coverage, Bayesian credibility budgets. Document residual assumptions. Do not sell completeness you did not measure.

### "Control Barrier Functions and Lyapunov methods already solved this."

They solve important certificate math. A Control Barrier Function certifies set invariance. Lyapunov or energy methods certify decrease or passivity. Wise Computer Automation's contribution here is product nomenclature plus Look-Up Table-exportable discrete shield plus energy conjunct plus Model Context Protocol irreversible beachhead as a shipping software reference. Compose: add `cbf_ok` rather than pretending the Look-Up Table replaced Ames theory.

### "World models make the gate unnecessary."

Prediction error is not zero. World models compose as proposer imagination. The gate still refuses physically illegal commits. Prediction is not permission.

### "Specialized silicon makes software gates irrelevant."

Tokens per joule is the proposal path **[VENDOR]** until independently metered. It does not own refuse-to-commit for actuators or irreversible tools. Specialized inference lowers proposal cost. The gate still owns the irreversible branch.

### "Surrogate joules are cosplay."

Agree when someone sells them as board watts. Label tier A. Keep `board_synth_claimed=false`. Device Under Test tier C is required before strong energy claims.

---

## Limits

Read these as teaching limits, not fine print to skip.

1. **Toy plants.** Measured false-allow discipline and dual compose are on software toy plants, not rich industrial robots.
2. **Surrogate joules only.** Tier A. No Vivado or Quartus board synthesis claim. No Joulescope-class Device Under Test claim.
3. **No silicon leadership claim.** Do not beat Groq, Etched, or Taalas on tokens per joule in this paper.
4. **No world-model primacy claim.** World Labs-class appearance catalogs are proposers, not gates.
5. **No "first energy-aware AI" claim.** Landauer is a lower bound, not a product design point. CMOS practice sits far above \(kT\ln 2\).
6. **No brain-matching efficiency claim.** Biology near 20 W is an existence proof and a messy metabolic story, not a shipping SoC budget.
7. **Incomplete versus barrier state of the art.** Input-to-State Stability, Bayesian barriers, and Ames-style bake-offs remain needs-experiment.
8. **Scan white space is not omniscience.** Unpublished private stacks can exist.
9. **Utility metrics.** Internal commit-count utility is easy to game. It is not MLPerf.

Honesty tags stay visible because they are part of the notation. Lying about the meter is a notational failure.

---

## What to do next

1. Re-state the thesis in your own words: notation becomes law at the irreversible boundary.
2. Open the interactive figures: https://research.openie.dev/living/ni/
3. Download the PDF twin: https://research.openie.dev/pdfs/ni.pdf
4. If you have the software reference, run the demos in the appendix. Compare refuse envelopes to the example above.
5. Read the companion teaching paper on satiation: https://research.openie.dev/papers/satiation/  
   That paper explains why human appetite finishes while capability races, and why refuse also means economic done.

Product rules that follow from the teaching:

- Keep `wca.commit.v1` as the notation product.
- Put scaled proposers and System One upstream.
- Gate irreversible tools before executors run.
- Meter gate joules and proposal joules separately when you instrument real work.
- Never flip `board_synth_claimed` without synthesis plus a meter.

Refuse is not a failure mode. Refuse is the product.

---

## References

### Notational intelligence and tools for thought

- Lee, L. *Notational intelligence.* https://thesephist.com/posts/notation/
- Lee × The Gradient. https://thegradientpub.substack.com/p/linus-lee-at-the-boundary-of-machine
- Iverson, K. E. *Notation as a Tool of Thought.* https://dl.acm.org/doi/10.1145/358896.358899
- Engelbart, D. *Augmenting Human Intellect* (1962). https://www.dougengelbart.org/pubs/augment-3906-Framework.html
- Kay, A. *A Personal Computer for Children of All Ages* (1972). https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf
- Victor, B. *Media for Thinking the Unthinkable.* https://worrydream.com/MediaForThinkingTheUnthinkable/
- Victor, B. *Inventing on Principle.* https://www.youtube.com/watch?v=PUv66718DII
- Matuschak, A. & Nielsen, M. *How can we develop transformative tools for thought?* https://numinous.productions/ttft/
- Chollet, F. *On the Measure of Intelligence.* https://arxiv.org/abs/1911.01547

### Certificates, barriers, runtime verification, energy structure

- Sánchez et al. RV domains survey. https://arxiv.org/abs/1811.06740
- Yu, Žikelić, Henzinger. Certificate repair via runtime monitoring. https://arxiv.org/abs/2412.12996
- Ames et al. Control Barrier Function ECC. https://doi.org/10.23919/ECC.2019.8796030
- Alshiekh et al. Safe RL via Shielding. https://arxiv.org/abs/1708.08611
- Dawson, Gao, Fan. Safe Control With Learned Certificates. https://arxiv.org/abs/2202.11762
- Manek & Kolter. Learning Stable Deep Dynamics. https://arxiv.org/abs/2001.06116
- Leung & Paré. Energy-Aware Bayesian CBFs. https://arxiv.org/abs/2512.24493
- Greydanus et al. Hamiltonian Neural Networks. https://arxiv.org/abs/1906.01563
- Roth et al. Stable Port-Hamiltonian Neural Networks. https://arxiv.org/abs/2502.02480

### Hardware lottery, look-up compute, energy bounds

- Hooker, S. *The Hardware Lottery.* https://arxiv.org/abs/2009.06489
- Petersen et al. DiffLogic. https://arxiv.org/abs/2210.08277
- Bacellar et al. DWN. https://arxiv.org/abs/2410.11112
- Ma et al. BitNet b1.58. https://arxiv.org/abs/2402.17764
- Wei et al. T-MAC. https://arxiv.org/abs/2407.00088
- TeLLMe family. https://arxiv.org/abs/2504.16266
- Landauer, R. (1961). Irreversibility and Heat Generation in the Computing Process.
- Horowitz, M. Computing's Energy Problem (ISSCC 2014).
- Sandberg, A. brain energetics overview. https://arxiv.org/abs/1602.04019

### Agents, world models, System One

- Anthropic Model Context Protocol. https://www.anthropic.com/news/model-context-protocol
- Ha & Schmidhuber. World Models. https://arxiv.org/abs/1803.10122
- Hafner et al. DreamerV3. https://arxiv.org/abs/2301.04104
- Laya System One. https://laya-ai.com/system-one-models
- Related arXiv: https://arxiv.org/abs/2503.23303 · https://arxiv.org/abs/2510.01237
- OpenIE joule-lang. https://github.com/openIE-dev/joule-lang

### Local claim discipline

Frozen Allowed / Forbidden / Needs-experiment rows: OpenIE claim ledger for Notational Intelligence (research archive). Public teaching cut must not promote Forbidden rows.

---

## Appendix A. Reproducibility (short)

Verified toolchain in the drafting window: Rust 1.98.x.

```bash
# SoC episode (seed-1 golden: committed=1 refused=15 J≈8.6795e-10 [SURROGATE])
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1

# Model Context Protocol Commit Gate demo
cargo run --release --bin wca-mcp-gate -- --demo

# Safe energy mode on the toy loop
cargo run --release --bin wca-soc-loop -- --safe-ph --steps 16 --seed 1
```

Do not quote these numbers as board watts. Keep `board_synth_claimed=false` until synthesis and a Device Under Test meter exist.

---

*David Charlot is founder of Open Interface Engineering (openie.dev). Companion teaching paper: Satiation and Scarcity after Free AI. Style lock: EDUCATIONAL_PROSE.md.*
