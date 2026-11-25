---
title: "The graph-based nature of RCE — why the phenomenon is possible"
deck: "25 Nov 2026. 'Where is our discussion on the graph-based nature of RCE to enable this"
id: rce-graph-nature
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# The graph-based nature of RCE — why the phenomenon is possible

*25 Nov 2026. "Where is our discussion on the graph-based nature of RCE to enable this
phenomenon? flowg-lang.dev is my precursor effort to RCE." The phenomenon — coding as
formula, not brute guess; reuse at the energy floor; `I = H_task − H_corpus → 0`; AI
coding at <0.1% of today's energy — is possible **because meaning is a graph**, not
text. This records that argument and the flow-g → RCE lineage. Grounded in the local
`flow-g/` design docs (why / math / history / ecosystem) and flowg-lang.dev, and in the
RCE papers and the public substrate.*

## The precursor: flowg already said it

flowg is a **graph-native language**: "Every program is already a graph. Keep it, and
the wins compound." Its IR is a typed hypergraph — 22 closed primitive node kinds, 11
resource-typed wire kinds (Move/Borrow/MutBorrow/Copy/Stream/Feedback…) — and **the graph
is the source of truth; every language is a projection of it, produced by lookup, not
guessed token by token.** Its math doc gives five results, one object:

1. **Information theory** — text is a redundant, structure-implicit serialization
   `s : G → Σ*`; compiling is the inverse `p : Σ* → G` that re-derives bindings, types,
   flow, ownership every build. Storing `G` makes that re-derivation a one-time reusable fact.
2. **Computation theory** — a closed kernel (Böhm–Jacopini spine extended to 22 primitives).
3. **Determinism** — `emit : Graph × Language → Text` is a pure function: deterministic,
   idempotent, drift-free. All N projections are `emit(G, Lᵢ)` of one `G`; they cannot disagree.
4. **Type theory** — wires are a substructural algebra (linear logic on the edge); whole
   bug classes (use-after-move, data race, deadlock) become structurally impossible.
5. **Physics** — every op carries a picojoule cost `E(op) ≈ a·flops + b·bytes + c`, `b ≫ a`;
   placement is `argmin_backend Ê(op, backend)`; the receipt is `Σ E(op)`.

flowg's lineage (dataflow, interaction nets, content-addressed code/Unison, projectional
editing, ML graph IRs, Horowitz's energy table) is the ground RCE stands on too.

## Why the graph is what enables the phenomenon

The Law of Coding says the residual information a task needs is its entropy minus what
the owned corpus resolves. **The graph is what makes the corpus ownable, addressable,
shareable, and operable** — i.e., what makes `H_corpus` a real, growing, reusable quantity
rather than a pile of text. Each property of the graph removes a reason to guess:

| Graph property | What it removes | RCE mechanism |
|---|---|---|
| **Structure-explicit** (graph is the meaning) | re-deriving bindings/types/flow from text every build | the Form IR; lift recovers `G` once |
| **Content-addressed nodes** (name-free hash) | re-paying for identical work; merge conflicts; drift | name-free key; rce-vc Merkle HAMT; the ~70% clone economy |
| **DAG dependencies** | recomputing the world on a local edit; coordinating disjoint work | incremental build (only the changed closure); commutation of disjoint subgraphs |
| **Equivalence as a graph relation** | treating `a+b` and `b+a` as different; guessing the cheapest form | canonicalization / e-graph; symbolic equivalence; G2 synthesis picks the cheapest correct graph |
| **Pure materialization** | per-language re-porting and re-debugging; drift | LUT emission `emit(G, L)`; 47 targets, byte-identical |
| **Resource-typed wires** | whole bug classes; energy spent re-checking/repairing | correctness by construction; less inference repairing |
| **Cost on every node/edge** | invisible energy; no way to rank paths | joule pricing; gear ladder; placement argmin |
| **Hash-chained log** | trusting a result without reproducing it | state = fold(log); replay = deterministic traversal = the gate |

Read together: because meaning is a graph, it can be **looked up** (G0), **rewritten**
(G1), **composed/searched** (G2), **projected** (emit), **incremented** (build), **equated**
(canonical/symbolic), **admitted** (replay), and **priced** (joules) — all deterministic
operations on one object. A model is needed only for the residual no stored graph covers.
That is the inversion from brute guess to formula, and it is *enabled by the graph*, not by
a better model.

## flow-g → RCE: what carries over, what RCE adds

flowg established the graph substrate: one typed hypergraph, many surfaces (lux, jmax,
joule) and many silicons (CPU/Metal/WGPU/AMX), pure materialization, energy-metered. RCE
carries that thesis to **all** languages and adds the pieces that turn a substrate into an
economy:

- **The gate** — admission by replay (correctness as constraint), which flowg's determinism
  makes possible but flowg does not itself enforce as an admission law.
- **The competence economy** — the content-addressed catalog of *verified, joule-priced*
  competence that crystallizes and compounds (the `H_corpus` term), above compilation.
- **The Law of Coding + gear ladder** — `I = H_task − H_corpus`, cheapest correct gear wins.
- **RCE-SPEC / RCE-JEPA** — the intent→form bridge and the gated AI residual.

So flowg is the graph; RCE is the graph **plus the gate plus the economy plus the law**.
The graph is the necessary substrate; the economy is RCE's delta. (Blaze independently
converged on the same graph/content-addressed foundations from the build angle; its delta
vs RCE is likewise the absence of the joule-priced competence economy.)

## Where the graph lives in the built substrate

- `rce/spec` Form `P=(S,E,δ,D,λ)` — `D` the hash-chained log (state = fold).
- `rce-vc/crates/rcevc-core` — name-free `key(u)=H(body, key(d₀)…key(dₘ))`, Merkle HAMT,
  commutation over closures: the dependency DAG.
- `competence-catalog/src/canonical.rs` + `symbolic.rs` — equivalence collapse / e-graph-style
  canonical polynomial form.
- `competence-catalog/src/build.rs` — item-grain incremental DAG (Blaze/DBSP lineage).
- `competence-catalog/src/lut_emit.rs` — pure materialization to 47 languages.
- `competence-catalog/src/energy.rs` + flowg substrate-energy — the joule attribute.

## Honest scope

The graph substrate is real and tested; the *economy at scale* (a large crystallized
`H_corpus`, trained JEPA proposer, full-language lift) is the remaining work. The argument
here is why the graph makes the phenomenon possible in principle and in the built core —
not a claim that the full economy is already at planetary scale.

## Sources

- https://flowg-lang.dev/ (and /math, /history)
- local `flow-g/docs/src/design/{why,math,history,ecosystem}.md`
- research.openie.dev papers: rce, rce-compile, rce-vc, rce-jepa, agency, three-body
- Horowitz ISSCC 2014; Böhm–Jacopini 1966; Lafont interaction nets 1990; Unison; MLIR; ProGraML