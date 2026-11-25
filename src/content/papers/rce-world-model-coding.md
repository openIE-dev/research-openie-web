---
title: "World Model Coding — a world model whose physics is known exactly"
deck: "25 Nov 2026. 'While we continue implementing the goals, lets look at World Model Coding.'"
id: rce-world-model-coding
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# World Model Coding — a world model whose physics is known exactly

*25 Nov 2026. "While we continue implementing the goals, lets look at World Model Coding."
Grounded in the rce-jepa paper ("World Coding, with JEPA as Premise"), the global world-model
landscape (V-JEPA 2, MuZero, Code World Model, compiler world models), and the built
`worldmodel.rs` (exact-physics planner) + `jepa.rs` (learned-inverse prototype). 164/164 tests.*

## The paradigm

World Model Coding = planning over a model of the computational world: a learned/steering part
proposes edits, an exact simulator rolls them out, an energy ranks them, and a gate admits.
"The model steers, the engine renders." It is the coding analog of model-predictive control.

## The RCE delta: known physics

Every other world model must **learn the forward dynamics**:
- **V-JEPA 2 / V-JEPA 2-AC** (Meta): video world model; plans robot actions by minimizing distance
  between a predicted future representation and a goal-image representation; never generates pixels.
- **MuZero / PlaNet / Dreamer**: learn a (value-equivalent / latent) dynamics because planning
  "relies on knowledge of the environment's dynamics" — which they must acquire.
- **Code World Model (CWM)**: mid-trained on Python execution traces / agent trajectories; the
  dynamics are learned; trace prediction is a "first step."
- **Compiler world models**: roll out tensor-schedule actions in latent space to rank candidates.

In RCE the transition function δ is **given and proved**, so the forward dynamics need **no
learning at all** — exact rollout *is* the simulator. What remains to learn is only the **inverse**:
which edit moves a candidate toward the intent. That is a strictly easier, better-posed learning
problem, and it can even be *searched* deterministically (below). This is the decisive difference
from robotics/CWM world models.

## The proposer interface (architecture-agnostic)

The learned part is a *proposer interface*, not one architecture: a JEPA latent encoder, a
trace-trained decoder, a diffusion code model, RL in a formal environment, evolutionary search,
library learning, constrained decoding — all instances. **Latents rank, they never render**
(never decode a latent: MoRAE shows direct generation in a frozen JEPA latent fails dramatically).
The gate is outside the interface; the Laws of Coding do not depend on the proposer. The
purpose-trained instances in the paper (FormJEPA-v1 8.42M params VICReg; FormEBM-v2/v3 contrastive
energy scorers) are the learned inverse; they only propose.

## Built now

- **`worldmodel.rs` — the deterministic inverse.** Goal-conditioned beam search over typed edits
  (`repair::mutations`), **exact rollout** (`eval_expr`) at every node as the known physics,
  cheapest-first, gate-verified. `plan("2 + 3", 6)` → `2 * 3` → Form `6`, verified. This is world-model
  coding with *searched* inverse and *exact* forward model — no learning required.
- **`jepa.rs` — the learned inverse (prototype).** Predicts a competence in canonical-Form latent
  space; gated. The trained FormJEPA/FormEBM at scale is the open frontier (paper: FormJEPA-v1
  admits 177/200 unseen defects, lifts the ladder to 138/151; FormEBM-v3 AUROC 0.9437).

## Connection to Cleanroom

World-model coding is the **airlock's inverse**: it aligns intent→structure at the boundary. The
fab stays deterministic; 99.9% of acts never touch the world model. The world model is consulted
only for the novel residual, and its output is gate-verified before admission — so World Model
Coding and Cleanroom are one system: learned steering at the boundary, exact physics inside.

## Falsifiers (from the paper, carried as open edges)

H3 prediction-in-representation reaches useful acceptance; H13 discrete vs continuous latents over
long edit sequences; H9 cost predicted before execution; RJ-F "never decode a latent." The trained
proposer + full intent→Form synthesis remain open; the exact-physics planner and the prototype are
built and tested.

## Sources
- rce-jepa paper (research.openie.dev/papers/rce-jepa), local decoded copy.
- https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks/
- https://buaacyw.github.io/cwm/ ; https://github.com/buaacyw/code-world-model
- https://proceedings.iclr.cc/paper_files/paper/2026/file/d8a12fde9e72444e1b356e8c37e53753-Paper-Conference.pdf
- https://bjx.fun/p/invited-talk-at-hkustgz-ai-seminar-world-models-for-planning/slides.pdf
- https://medium.com/@gwrx2005/world-models-a-survey-of-architectures-and-training-methods-and-nextwm-a-browser-native-latent-717bc46836f1
- live: competence-catalog worldmodel.rs + jepa.rs, 164/164 tests.