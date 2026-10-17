### 3.2 Definitions

**Definition 1 (the Form).** A program is a tuple

$$P = (S, E, \delta, D, \lambda)$$

- $S = \Sigma_c \times \Sigma_d$, the state space: structures over a fixed vocabulary $\Sigma$, split into control regions $\Sigma_c$ and data $\Sigma_d$. $\Sigma_d$ holds the logical clock, the input count and the typed relations (in the language, also the declared regions). Each state is a database instance in Codd's sense [5].
- $E$, the event alphabet, including the logical clock tick.
- $\delta : S \times E \to S \times O^*$, the transition: total, deterministic and pure, written as a finite set of guarded updates "if $\varphi$ then $f(\bar t) := t_0$", each step reading a bounded set of locations. It returns the next state and the outputs of the step. Write $\delta_1 = \pi_1 \circ \delta$ for its state component.
- $D$, the durable log: a sequence of entries $\{\mathit{seq}, \mathit{event}, \mathit{prev\_hash}, \mathit{state\_hash}, \mathit{hash}\}$, where $\mathit{state\_hash}$ is the SHA-256 of the canonical JSON of the state after the step, $\mathit{hash}$ is the SHA-256 of the canonical JSON of the first four fields, and the first $\mathit{prev\_hash}$ is 64 zeros. The log is a hash chain, so changing any past entry changes every later $\mathit{hash}$.
- $\lambda = \pi_2 \circ \delta : S \times E \to O^*$, the output map. A Mealy machine reads both arguments [6]; a Moore machine reads the state only [7].

**Definition 2 (Form and fit).** The *form* is the tuple shape with four invariants: $\delta$ is deterministic and pure; exploration is bounded; the vocabulary is fixed; state is the fold of the log,

$$\mathrm{state}(D) = \mathrm{foldl}(\delta_1, s_0, D).$$

A log may also carry each entry's outcome, outputs and state. These are derived: they are not hashed, and they must equal replay (T1 and T3 of [§3.7](#37-the-language-versions-06-and-07-costs-and-theorem-status)). Two kinds of rejection are distinct. In the engine profile every event is applied, and an input that fails its contract produces a `reject` output and an error row. In the language a refused event leaves the state unchanged (T8) and is recorded as refused.

The *fit* is the data that fills the shape: the vocabulary $\Sigma$, the alphabets $E$ and $O$, the rule program $\Pi$ that defines $\delta$, the output rules that define $\lambda$, and the initial data $s_0$. In Gurevich's terms the fit is the vocabulary, the ASM program and the initial structures. In Codd's terms $\Sigma$ is the schema and $s_0$ is the instance. In product-line terms a fit is a feature selection [8]. In syntax-guided synthesis (SyGuS) terms a fit is a term from a grammar that meets a specification [9].

**Definition 3 (fit equivalence).** Two fits are equivalent when, for every event sequence $L$, their output sequences under $\lambda$ are equal.

**Definition 4 (fit language).** A grammar whose terms denote fits. Programming languages, SCXML documents, XState configurations and `.rce` specifications are fit languages. A fit language is complete when every ASM program over $\Sigma$ has a term in it.

**Definition 5 (control projection).** Split $\Sigma = \Sigma_c \cup \Sigma_d$ into finite control symbols and data relations. The statechart of $P$ is the projection of $\delta$ onto $\Sigma_c$: states are values of $\Sigma_c$, transitions carry an event and a guard over $\Sigma_d$, and actions are updates to $\Sigma_d$. Harel's statecharts give the hierarchy and the orthogonal regions [10].

**Definition 6 (fit e-graph).** For a fit $F$ and a set $R$ of sound rewrites, the fit e-graph $EG(F, R)$ is the saturated e-graph of $F$'s rule terms under $R$ [11, 12]. Each e-class holds fits equivalent by Definition 3.

**Definition 7 (joule cost).** $\mathrm{cost}_J(t)$ is the estimated energy (`est_j`) to run term $t$ once on a named substrate, weighted by the expected number of runs.

