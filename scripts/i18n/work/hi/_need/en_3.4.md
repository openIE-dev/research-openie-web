### 3.4 Propositions

**Proposition 1 (the Form captures every sequential algorithm).** For every sequential algorithm $A$ there is a Form instance $P$ whose runs are the runs of $A$.

*Proof sketch.* Theorem 6.13 gives an ASM $B$ with the states, initial states and one-step map of $A$. Set $E = \{\varepsilon\}$, $\delta(s, \varepsilon) = \tau_B(s)$, $D = (s_0, \varepsilon^n)$ and $\lambda$ the identity. The fold after $n$ ticks is $\tau_A^n(s_0)$. By Gurevich's Corollary 3.3, $P$ and $A$ have the same runs. ∎

**Proposition 1b (interactive programs).** Extend $\Sigma$ with a nullary input symbol set to $e$ before each step; then $\delta(s, e) = \tau(s[\mathit{in} := e])$ is a sequential algorithm over the extended vocabulary, and Proposition 1 applies. The construction is ours.

**Proposition 1c (computability).** Under the Dershowitz and Gurevich axiom, every Form instance computes a Turing-computable function [4, 16, 17]. The Form adds no power. It gives every program in the class one shape.

**Proposition 1d (proofs are fits).** "For each proof of a given proposition, there is a program of the corresponding type" [18]. A type is a specification and a proof is a fit that meets it. The correctness gate is the existence of that proof or of a passing acceptance test.

**Proposition 2 (one generator).** One function $G : \mathrm{Fit} \to \mathrm{Program}$ generates a runnable program for every fit and reads no domain. *Basis:* every program is a Form instance, so $G$ emits a typed store, an event type, compiled rules, a log with a fold and an output dispatcher. Scaffolders such as Rails generators, JHipster and Yeoman are $G$ restricted to small fit languages. Product-line engineering starts from "the systematic discovery and exploitation of commonality across related software systems" [8]; the commonality is the Form.

**Proposition 3 (least-energy extraction).** Extraction with $\mathrm{cost}_J$ returns the least-joule term the extractor finds in the e-class of $F$. *Proof sketch.* The rewrites are sound, so every term in the e-class has $F$'s observable behavior and passes the same gate. Extraction minimizes the cost, and the cost is joules. ∎ This is Mixture of Limits applied to code: keep the minimal fit that does the task, and the rest is waste.

**Proposition 4 (replay determinism).** If $\delta$ reads no wall clock, orders updates without names and logs every input, two replays of one $D$ give identical state hashes at every step.

**Proposition 5 (statechart projection is sound).** Project each state of a run onto $\Sigma_c$. The result is a run of the emitted statechart under the same events.

**Proposition 6 (coordination budget).** Rules tagged monotone run on replicas without coordination; only non-monotone rules need a coordination point. *Basis:* the CALM theorem, "the programs that have consistent, coordination-free distributed implementations are exactly the programs that can be expressed in monotonic logic" [19].

The tag is derived from the rule, never declared, and the IR check refuses a Form whose stored tag differs from the derived one (specification, Appendix D.5):

| Rule has | Tag | Reason |
|---|---|---|
| no resolve, read, join or scan | monotone | its writes only add keys and grow counters |
| a resolve | not monotone | it deletes escalation rows |
| a read of its own sink | not monotone | read, modify, write |
| a keyed join | not monotone | the joined row may be absent now and present later, or overwritten |
| a scan | not monotone | it observes the whole relation, including what is absent |

The tag is sound and not complete: a join against an insert-only relation would be monotone, but the profile does not prove that a relation is insert-only, so the tag does not claim it. A Form is coordination-free when every rule is monotone. Every read, join and scan sees the state at the event's entry, so the post-state of an input event does not depend on the order in which rules for different sinks run; only the output order does, and it is fixed by content hash.

**Proposition 7 (intelligence as a joule derivative).** Let $X$ count tasks through the gate and $J$ the joules spent. $\iota = dX/dJ$ is read in hindsight from $D$, which records every event and its `est_j`. Extraction under $\mathrm{cost}_J$ holds the gate fixed and does not raise $J$, so at equal $X$ it does not lower $\iota$.

