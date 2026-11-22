---
title: "Time as an Index: What It Would Take to Look Up Tomorrow"
deck: "A formal, numerical, and empirical audit of treating time as a queryable dimension across complexity theory, quantum foundations, analog relaxation hardware, cryptography, Lean 4 kernel-checked horizon models (C1 to C4, M1 to M8), and 195 cataloged anomalies and paradoxes. No external wall or rail power monitor was attached (board_metered is false)."
id: time-as-an-index
status: "Research study · draft"
author: "David Charlot, Open Interface Engineering"
figures: "/living/time-as-an-index/"
pdf: "/pdfs/time-as-an-index.pdf"
board_metered: false
---

# Time as an Index: What It Would Take to Look Up Tomorrow

*{{revision}}. Data and digest summary: [/data/#time-as-an-index](/data/#time-as-an-index). Interactive living figures: [/living/time-as-an-index/](/living/time-as-an-index/). LaTeX archival twin: [/pdfs/latex/time-as-an-index.pdf](/pdfs/latex/time-as-an-index.pdf) ([source](/pdfs/latex/time-as-an-index.tex)).*

## 0. Overview

If a future state of a physical or computational system could be queried directly like an indexed row in a relational table, sequential brute-force search — cryptographic key recovery, hash preimage inversion, and proof-of-work puzzle solving — would cease to protect secrets, because the target witness was never absent, only unindexed. This study tests that premise across computational complexity theory, quantum retrocausality, physical relaxation hardware, cryptographic game reductions, formal verification in Lean 4 (`31` kernel-checked theorems with zero `sorry` axioms), deterministic numerical and symbolic models (`seed = 20261122`), and three structured public catalogs totaling `195` entries (`81` reported temporal anomalies, `40` physical frequency-domain edge cases, and `74` foundational paradoxes). No hardware rail or alternating-current wall power meter was attached (`board_metered = false`).

The verdict splits cleanly along the boundary between formal closed timelike curves (CTCs) and known laboratory physics. Inside Deutsch's fixed-point closed-timelike-curve model, polynomial-time classical and quantum computers both reach full polynomial-space computing power, collapsing elliptic-curve signatures, symmetric block ciphers, cryptographic hashes, proof-of-work puzzles, and prepare-and-measure quantum key distribution (QKD) in a single fixed-point query while sparing only information-theoretic schemes such as the one-time pad. Outside formal time loops, no known physical process grants early lookup: quantum retrocausal interpretations inherit the no-signalling theorem, postselected teleportation loops pay an inverse-probability repetition bill ($\sim 1/p$, reaching $1/d^2$ on $d$-state witness circuits), analog dynamical solvers trade step count for exponential energy fluctuations or exponential frequency precision, and every physically realizable "future index" reduces to precomputation bounded by Hellman's $T \cdot M^2 = N^2$ tradeoff after an $N$-step fill that salts and fresh challenges defeat before construction can start.

**In plain words**

1. **Inside a mathematical time loop, almost every math-based lock opens at once.** If hardware could force a register sent into its own past to return unchanged, consistency alone would compel nondeterministic and polynomial-space answers to appear in polynomial gate count; only information-theoretic secrets such as a one-time pad survive.
2. **In known physics, nothing sends a readable answer backward in time.** Quantum delayed-choice and retrocausal models obey exact marginal no-signalling, postselection discards roughly $1/p$ failed runs to keep one consistent run, and out of `81` audited temporal anomaly reports and `40` frequency-atlas anomalies, zero Grade A or Grade B cases survive as unexplained reception from the future.
3. **Every working "lookup of tomorrow" today is precomputation paid in advance.** Building a table moves the search earlier at fill cost $N$, obeys $T \cdot M^2 = N^2$, dissipates at least $k_B T \ln 2$ per erased bit, and fails completely whenever a fresh salt or previous-block hash withholds the question until the moment of use.

Every substantive statement across the study carries one of four explicit epistemic labels:

| Claim label | Operational meaning in this study |
| :--- | :--- |
| **`Established`** | Proved mathematically inside its stated formal model or replicated in peer-reviewed experimental physics. |
| **`Kernel-checked`** | Verified mechanically in `Lean 4.36.0` (`code_and_proofs/lean/Horizon.lean` and `Paradox.lean`) using zero `sorry` placeholders and at most standard foundational axioms (`propext`, `Classical.choice`, `Quot.sound`). Establishes mathematical consistency on formal structures, never a physical claim about nature. |
| **`Conjecture`** | Coherent theoretical proposal or contested empirical anomaly with stated assumptions and an explicit falsifier, neither proved nor refuted. |
| **`Speculation`** | Unsupported by replicated measurement, contradicted by established bounds unless new physics intervenes, or traced to misreport/fiction (`Debunked` where source fabrication is documented). |

---

## 1. Terms and acronyms

<ul id="terms">
<li>CTC, CTCs, D-CTC, D-CTCs, P-CTC, P-CTCs: closed timelike curve(s), Deutsch fixed-point closed timelike curve(s), and postselected-teleportation closed timelike curve(s)</li>
<li>CR, CV, CNOT, SWAP: chronology-respecting register, causality-violating register, controlled-NOT gate, and two-qubit state-exchange gate</li>
<li>PSPACE, NP, coNP, BQP, PP, PostBQP, HALT: polynomial-space complexity class, nondeterministic polynomial time, complement of NP, bounded-error quantum polynomial time, probabilistic polynomial time, postselected bounded-error quantum polynomial time, and the Turing halting oracle</li>
<li>SAT, CNF, QKD, BB84, B92, OTP: Boolean satisfiability, conjunctive normal form, quantum key distribution, Bennett-Brassard 1984 protocol, Bennett 1992 two-state protocol, and one-time pad</li>
<li>IND-CPA, IND-CCA, UUF-CMA, EUF-CMA: indistinguishability under chosen-plaintext attack, indistinguishability under chosen-ciphertext attack, universal unforgeability under chosen-message attack, and existential unforgeability under chosen-message attack</li>
<li>ECDSA, RSA, AES, SHA, PoW, ASIC, ASICs, IACR: Elliptic Curve Digital Signature Algorithm, Rivest-Shamir-Adleman cryptosystem, Advanced Encryption Standard, Secure Hash Algorithm (SHA-256 and double-hash SHA-256d), proof of work, application-specific integrated circuit(s), and International Association for Cryptologic Research</li>
<li>SQL, TSQL2, DAG, DFT, FFT, DPSS: Structured Query Language, Temporal SQL2 specification, directed acyclic graph, discrete Fourier transform, fast Fourier transform, and discrete prolate spheroidal sequences</li>
<li>TOPS, ARIA, BCI, BCIs, LLM, RL, IMO: tera-operations per second, Advanced Research and Invention Agency, brain-computer interface(s), large language model, reinforcement learning, and International Mathematical Olympiad</li>
<li>DRM, AUC, QRNG, VLF, SEP, KJV, ZFC: Deese-Roediger-McDermott false-memory paradigm, area under the receiver-operating characteristic curve, quantum random number generator, very low frequency, Stanford Encyclopedia of Philosophy, King James Version, and Zermelo-Fraenkel set theory with Choice</li>
<li>MOND, RAR, CDM, LIGO, EHT, FRB, CMB, GRB, AGN, PTA, JWST, ALMA: Modified Newtonian Dynamics, radial acceleration relation, cold dark matter (as in flat Lambda-CDM), Laser Interferometer Gravitational-Wave Observatory, Event Horizon Telescope, fast radio burst, cosmic microwave background, gamma-ray burst, active galactic nucleus, pulsar timing array, James Webb Space Telescope, and Atacama Large Millimeter/submillimeter Array</li>
<li>HVP, QCD, QED, EFT, AMPS, DESI, SH0ES: hadronic vacuum polarization, quantum chromodynamics, quantum electrodynamics, effective field theory, Almheiri-Marolf-Polchinski-Sully firewall argument, Dark Energy Spectroscopic Instrument, and Supernovae and $H_0$ for the Equation of State</li>
<li>OPERA, LSND, BEST, MICROSCOPE, GPS, RTG: Oscillation Project with Emulsion-tRacking Apparatus, Liquid Scintillator Neutrino Detector, Baksan Experiment on Sterile Transitions, Micro-Satellite a trainee Compensee pour l'Observation du Principe d'Equivalence, Global Positioning System, and radioisotope thermoelectric generator</li>
<li>AIR, SPR, DNA, NRC, TSVF, EPR, SNR, QNM, ULP, CODATA, DOI: American Institutes for Research, Society for Psychical Research, deoxyribonucleic acid, National Research Council, two-state vector formalism, Einstein-Podolsky-Rosen, signal-to-noise ratio, quasinormal mode, unit in the last place, Committee on Data of the International Science Council, and Digital Object Identifier</li>
<li>TA, TA001, TA007, TA008, TA009, TA011, TA012, TA014, TA015, TA016, TA017, TA025, TA030, TA031, TA032, TA033, TA036, TA053, TA062, TA063, TA064, TA065, TA066, TA067, TA070, TA077, TA081: Temporal Anomaly catalog entry identifiers (`data/temporal-anomaly-catalog.csv`)</li>
<li>AA, AA01, AA02, AA03, AA04, AA05, AA06, AA07, AA08, AA09, AA10, AA11, AA12, AA17, AA18, AA19, AA26, AA31, AA32, AA34, AA37, AA38, AA40: Frequency Anomaly Atlas entry identifiers (`data/anomaly-atlas.csv`)</li>
<li>CSV, JSON, API, PyPI, AGPL, GPL, IP, CD, PROJEKT, WebMCP, RCE, LUT6: comma-separated values, JavaScript Object Notation, application programming interface, Python Package Index, GNU Affero General Public License, GNU General Public License, intellectual property, CD PROJEKT corporate trademark holder, Web Model Context Protocol, Reality Code Engine [same house], and 6-input Boolean look-up table [same house]</li>
</ul>

To keep forward references transparent from top to bottom, Section 1 defines notation, Section 2 reviews time-loop complexity, Section 3 covers temporal indexing and Hellman precomputation, Section 4 analyses retrocausality and physical relaxation, Section 5 maps cryptographic survival, Section 6 evaluates candidate axioms `A1 to A8` and zero-point conditions `Z1 to Z6`, Section 7 proves Horizon conditions `C1 to C4` and runs models `M1 to M8`, Section 8 audits the three empirical ledgers (`TA001` to `TA081`, `AA01` to `AA40`, and `P01 to P74`), and Section 9 consolidates falsifiers `F1 to F19` alongside game mechanics. Prior Open Interface Engineering studies — [Thermodynamic Bounds and an Optimal Tempo](/papers/agency/), [Metered Commit Gates](/papers/gates/), [Deterministic Null](/papers/deterministic-null/), and [Downward LUT6 Compilation](/papers/lut-adapt/) — are `[same house]` companions cited strictly for architectural context.

---

## 2. Formal Models of Time Loops in Computation (`D-CTC = PSPACE`, `P-CTC = PP`, Unbounded $\Delta_2$)

Deutsch (1991) resolved the classical grandfather contradiction on finite quantum registers by requiring kinematic self-consistency at the boundary of a closed timelike curve. Let a chronology-respecting input state $\rho_{\text{in}}$ on $\mathcal{H}_{\text{CR}}$ interact through a joint unitary $U$ with a causality-violating register $\rho_{\text{CTC}}$ on $\mathcal{H}_{\text{CV}}$ that re-enters its own past. Consistency requires $\rho_{\text{CTC}}$ to be a fixed point of the induced quantum channel (`Established` inside the model):

$$\rho_{\text{CTC}} = \mathrm{Tr}_{\text{CR}}\!\left[\, U \left(\rho_{\text{in}} \otimes \rho_{\text{CTC}}\right) U^\dagger \,\right], \qquad \rho_{\text{out}} = \mathrm{Tr}_{\text{CV}}\!\left[\, U \left(\rho_{\text{in}} \otimes \rho_{\text{CTC}}\right) U^\dagger \,\right].$$

Because every completely positive trace-preserving channel on a compact convex state space of finite dimension possesses at least one Schauder-Brouwer fixed point, no circuit triggers a logical contradiction; instead, deterministic paradoxes become mixed states. Critically, because $\rho_{\text{CTC}}$ depends on $\rho_{\text{in}}$, the effective input-to-output map $\rho_{\text{in}} \mapsto \rho_{\text{out}}$ is **nonlinear** in $\rho_{\text{in}}$. That nonlinearity — rather than quantum superposition alone — drives the computational jump across all formal CTC models:

| Formal result | Mathematical statement | Venue / status | Epistemic label |
| :--- | :--- | :--- | :--- |
| **Brun (2003)** | Classical fixed-point register checking a candidate factor from the future and otherwise running an exhaustive fallback search is consistent only when the factor appears without running the search. | *Found. Phys. Lett.* 16:245 | **`Established`** (classical model) |
| **Bacon (2004)** | Polynomial-gate quantum circuits coupled to `D-CTC` qubits solve `NP`-complete `SAT` by amplifying tiny state separations exponentially across loop passes. | *Phys. Rev. A* 70:032309 | **`Established`** (in `D-CTC` model) |
| **Aaronson & Watrous (2009)** | Classical and quantum polynomial-time `D-CTC` machines have identical power: $\mathrm{P}_{\text{CTC}} = \mathrm{BQP}_{\text{CTC}} = \mathrm{PSPACE}$. Adversarial fixed-point selection stays inside $\mathrm{PSPACE}$. | *Proc. R. Soc. A* 465:631 | **`Established`** (in `D-CTC` model) |
| **Bennett, Leung, Smith & Smolin (2009)** | On *labelled* statistical ensembles, `D-CTC` evolution violates convex linearity; defining computation on labelled mixtures removes state-discrimination shortcuts. | *Phys. Rev. Lett.* 103:170502 | **`Established`** critique; interpretation contested |
| **Lloyd et al. (2011)** | `P-CTC` models a time loop via quantum teleportation conditioned on Bell-state postselection, assigning zero weight to inconsistent branches; computational power equals $\mathrm{PostBQP} = \mathrm{PP}$. | *Phys. Rev. Lett.* 106:040403; *Phys. Rev. D* 84:025007 | **`Established`** (circuit model & photonic test of circuit, not a spacetime CTC) |
| **Brun, Wilde & Winter (2013)** | Polynomial `D-CTC` circuits clone arbitrary quantum states to arbitrary fidelity, rendering `D-CTC` state space effectively classical-accessible. | *Phys. Rev. Lett.* 111:190401 | **`Established`** (in `D-CTC` model) |
| **Aaronson, Bavarian, Gueltrini et al. (2024 v2)** | Unbounded-width `D-CTC` Turing machines decide exactly $\Delta_2 = \mathrm{P}^{\mathrm{HALT}}$ (languages Turing-reducible to halting), correcting an error in the 2016 preprint noted by Raat (2023). | `arXiv:1609.05507v2` (Oct 2024) | **`Established`** (corrected preprint) |

Two structural subtleties govern every fixed-point algorithm. First, in Brun's (2003) knowledge-creation construction, the fallback brute-force loop is never executed along the consistent history, yet **must physically exist and be able to terminate** inside the circuit description; deleting the fallback restores trivial non-solution fixed points such as `0`. Second, fixed points need not be unique (`polchinski_multiplicity`). Reproducing Bishop's `Qhronology` (`arXiv:2601.17459`, `v1.2.1`, AGPL-3.0-or-later non-commercial) grandfather circuit — `CNOT` controlled on `CV` targeting `CR`, followed by `SWAP`, with input $|0\rangle\langle 0|_{\text{CR}}$ — in exact symbolic SymPy (`M2`, `code_and_proofs/run_models_m1_m8.py`) yields the entire one-parameter diagonal family $\rho_{\text{CR}} = \rho_{\text{CV}} = g|0\rangle\langle 0| + (1-g)|1\rangle\langle 1|$ ($g \in [0,1]$) under `D-CTC`, whereas `P-CTC` projects `CR` uniquely onto $|+\rangle\langle +|$ with maximally mixed $\rho_{\text{CV}} = I/2$.

<figure class="my-8">
  <img src="/figures/time-as-an-index/ctc-vs-physics-hierarchy.svg" alt="Five-tier hierarchy comparing Unbounded D-CTC, Polynomial D-CTC, Postselected P-CTC, Standard Quantum BQP, and Known Physical Indexing against cryptographic survival." />
  <figcaption>Figure 1. Complexity ceiling and cryptographic survival from formal closed timelike curves (<code>Δ₂</code> and <code>PSPACE</code>) down to postselected circuits (<code>PP</code>), standard quantum algorithms (<code>BQP</code>), and physically realizable precomputation (<code>Hellman T·M² = N²</code>). Synthesis diagram, not a hardware power reading.</figcaption>
</figure>

---

## 3. Time as an Index in Known Physics: Temporal Databases, Retroactive Lower Bounds, and Hellman's $T \cdot M^2 = N^2$

Computer science already treats recorded past time as an explicit index (`Established`):

1. **Temporal relational tables and event logs**: `SQL:2011` standardized application-time and system-versioned tables following Snodgrass's `TSQL2` design (Kulkarni and Michels 2012), while deterministic record-and-replay debuggers such as `rr` (O'Callahan et al. 2017) reconstruct past program states by logging nondeterministic inputs and re-executing forward transitions.
2. **Persistent versus retroactive data structures**: Driscoll, Sarnak, Sleator, and Tarjan (1989) proved that full persistence — querying or branching any past version while never mutating history — adds only $O(\log n)$ overhead per step. By contrast, Demaine, Iacono, and Langerman (2007) proved that *retroactive* data structures — inserting or deleting an operation at past timestamp $t_0$ and querying the updated present across $r$ subsequent operations — require $\Omega(r / \log r)$ multiplicative overhead in general (`Established`). Rewriting an earlier step forces causal re-evaluation of the chain that followed it.
3. **Precomputation as the sole physical future index**: Indexing an unrecorded future state of an $N$-state deterministic map $f : \{0,\dots,N-1\} \to \{0,\dots,N-1\}$ requires evaluating $f$ ahead of time. Hellman (1980) quantified the tradeoff using $m$ hash chains of length $t$: storing $(x_{\text{start}}, x_{\text{end}})$ pairs consumes memory $M = m$ words, online inversion requires $T = t^2$ evaluations across $t$ tables covering $m t^2 = N$ states, and combined memory $M_{\text{tot}} = m t$ satisfies (`Established`):

$$T \cdot M_{\text{tot}}^2 = N^2 \qquad \text{after a one-time table fill of } \Theta(N) \text{ evaluations.}$$

At the balanced operating point $M_{\text{tot}} = T = N^{2/3}$ (for $N = 2^{16} = 65{,}536$, $N^{2/3} \approx 1{,}625.5$), online lookup is fast only because the filler already paid the full $N$-step exhaustive search upfront, refined in constant factors by Oechslin's (2003) rainbow tables and proved optimal for generic random functions by Fiat and Naor (2000), alongside Bennett's (1989) reversible pebbling bounds. Salting with $s$ random bits multiplies fill work by $2^s$, and binding a query to a fresh challenge (a post-request nonce or previous block header hash) reduces precomputed table reuse to zero (`0.0%` across `200` fresh-block trials in `M7` vs `34.0%` single-table unsalted recovery).

---

## 4. Retrocausality, No-Signalling, Physical Settling, and the Gabor Frequency Window

### 4.1 Quantum retrocausality and the postselection bill

Several foundational programmes describe quantum correlations using future boundary conditions: the Aharonov-Bergmann-Lebowitz (1964) two-state vector formalism (`TSVF`, `Established` as an equivalent reformulation), Leifer and Pusey's (2017) theorem that any $\lambda$-mediated time-symmetric ontology reproducing entanglement must admit retrocausal correlations (`Established` under stated assumptions), Price and Wharton's (2015) zigzag reading (`Speculation` as new physics), Castagnoli's (2009–2025) interpretive rule comparing quantum query counts to a classical learner given half the solution bits (`Conjecture`), and Aharonov and Elitzur's (`arXiv:2611.12971`, Nov 2026 preprint) two-branch time-translation model in which postselected atomic re-excitation survives only within the environment's radiation memory time — roughly $1\text{ fs}$ in free space — before demanding exponentially decaying postselection probabilities (`Conjecture`). Likewise, Ji, Lloyd, and Wilde (*Phys. Rev. Lett.* 136:230801, 2026) derived the noisy `P-CTC` retrocausal capacity from max-information and regularized Doeblin information while explicitly noting that standard quantum mechanics permits zero backward signalling (`Established` in `P-CTC`).

None of these frameworks yields an early lookup oracle because standard quantum mechanics satisfies the **no-signalling theorem**: for any bipartite or two-time state $\rho_{12}$ and any future/remote instrument $\{E_b^y\}$ chosen freely via setting $y$ satisfying $\sum_b E_b^y = I_2$, the earlier marginal outcome distribution is strictly independent of $y$:

$$P(a \mid x, y) = \mathrm{Tr}\!\left[(M_a^x \otimes I_2)\,\rho_{12}\right] = P(a \mid x).$$

Conditioning on a desired postselection outcome $b = b^*$ with probability $p$ requires repeating the preparation roughly $1/p$ times ("anthropic computing", Aaronson 2005). In the explicit unitary witness-search model `M2b` (`3` to `6` bits, Hilbert dimension $d = 2^n \in \{8, 16, 32, 64\}$), `P-CTC` Bell projection succeeds with exact probability $P_{\text{post}} = 1/d^2$, requiring `64`, `256`, `1,024`, and `4,096` expected repetitions — strictly costlier than classical $d/2$ exhaustive guessing (`4` to `32` queries).

### 4.2 Analog settling hardware and the Gabor uncertainty barrier

Physical relaxation machines replace discrete clock ticks with continuous dynamics, yet every analysed substrate relocates exponential combinatorial hardness into another physical resource (`Established` pattern, Aaronson 2005):

| Physical substrate | Mechanism | Limiting resource barrier | Status |
| :--- | :--- | :--- | :--- |
| **Physical reservoir computing** | Fixed nonlinear medium projects past input streams; linear readout trained (Tanaka et al. 2019). | Causal filter over past arrivals; zero lookahead into future inputs. | **`Established`** |
| **Coherent Ising machines** | Degenerate optical parametric oscillators relax toward low-loss spin states (Inagaki et al. 2016; McMahon et al. 2016). | Heuristic approximation; connectivity, calibration, and hard-instance time-to-solution remain open (*Nat. Rev. Phys.* Nov 2026). | **`Established`** (heuristic) |
| **Continuous-time analog `SAT`** | Deterministic ordinary differential equations with solution attractors (Ercsey-Ravasz & Toroczkai 2011). | Polynomial continuous coordinate time requires **exponential auxiliary variable / energy fluctuations** across fractal chaotic basins. | **`Established`** |
| **Frequency-multiplexed memcomputing** | Encodes $2^n$ subset sums into harmonic frequencies (Traversa & Di Ventra 2015). | Resolving $2^n$ frequencies in finite bandwidth requires $\delta f \sim 2^{-n}$, hence observation window $\Delta t \gtrsim 2^n$ and $2^{-n}$ amplitude per line (Aaronson 2015). | **`Speculation`** (polynomial scale contested) |
| **Thermodynamic & `p-bit` silicon** | Normal Computing `CN101` (2025 tape-out; ARIA 2026 bring-up) and Extropic `Z1` (`269,568` `p-bits` projected, `arXiv:2510.23972`). | Targets linear-algebra/Monte Carlo sampling; `1,000x`–`10,000x` efficiency figures are vendor targets/projections, not hardware-rail `NP` proofs. | **`Speculation`** (vendor targets) |

Representing a trajectory $x(t)$ in the frequency domain via $X(f) = \int x(t) e^{-2\pi i f t}\,dt$ — whether digitally in $O(N \log N)$ operations (Cooley and Tukey 1965) or optically in a single propagation pass across silicon metalens `DFT` arrays (Tanuwijaya et al. 2025, `arXiv:2502.08770`) and photonic joint-transform correlators (Yang et al. 2025, `arXiv:2504.01117`, projecting `305 TOPS/W`) — requires the entire sample window to exist before transformation and obeys Gabor's (1946) root-mean-square uncertainty product (`Established`):

$$\Delta t \cdot \Delta f \;\ge\; \frac{1}{4\pi}.$$

Frequency transformation trades temporal localization for spectral resolution; it never deletes the observation duration required to separate closely spaced modes.

---

## 5. Cryptographic Consequences (`ECDSA`, `SHA-256d` Proof of Work, Symmetric Ciphers, `QKD`, Stateful Rewinding)

Every standard public-key, symmetric-key, and hash puzzle verifies a candidate witness in polynomial time, placing key recovery and nonce search inside $\mathrm{NP}$ (or $\mathrm{NP} \cap \mathrm{coNP}$) $\subseteq \mathrm{PSPACE}$. Consequently, a polynomial `D-CTC` oracle breaks all computational cryptography in one fixed-point evaluation, whereas real-world quantum and classical indexing attacks separate sharply by algebraic structure and input freshness:

| Cryptographic target | Formal `D-CTC` (`PSPACE`) | Standard Quantum (`BQP`) | Physical Precomputation (`Known Physics`) |
| :--- | :--- | :--- | :--- |
| **`ECDSA` / `secp256k1`** | **Broken** (`1` fixed-point query) | **Broken** in $\mathrm{poly}(\log N)$ via Shor's group-period algorithm (Aggarwal et al. 2018) | **Secure** against generic tables for 256-bit random curve keys |
| **`SHA-256d` Proof of Work** | **Broken** (`M7`: `1` query solves `8, 12, 16`-bit puzzles) | Quadratic Grover $\frac{\pi}{4}\sqrt{N}$; **no net edge** vs specialized `ASIC` clock rates near-term | **Secure**: header commits to `prev_block_hash`, preventing pre-block table fill (`0.0%` reuse in `M7`) |
| **Static hash preimages** | **Broken** | $2^n \to 2^{n/2}$ queries (Grover optimal) | **Unsalted passwords fall** to Hellman/rainbow tables; per-user salts multiply fill by $2^s$ |
| **Symmetric `AES-256`** | **Broken** (known-plaintext key search) | $\sim 2^{128}$ Grover queries ($\approx 128$-bit post-quantum security retained) | Fixed-plaintext Hellman tables infeasible at $N = 2^{256}$ (Landauer fill floor $\approx 3.32 \times 10^{56}\text{ J}$) |
| **Prepare-and-measure `QKD` (`BB84`, `B92`)** | **Broken in `D-CTC`** via nonlinear state cloning/discrimination (Brun, Harrington & Wilde 2009; disputed on labelled mixtures by Bennett et al. 2009) | **Secure** by Hilbert-space no-cloning and monogamy | Not applicable (online physical channel) |
| **Stateful vs stateless games** | Broken if key is computational | Depends on underlying primitive | **Meier (2022)** (`IACR ePrint 2022/1148`): polynomially bounded state-rewinding breaks stateful `IND-CCA` and `EUF-CMA` bookkeeping while stateless `IND-CPA` and `UUF-CMA` hold |
| **One-time pad (`OTP`) & secret sharing** | **Unconditionally secure** | **Unconditionally secure** | **Unconditionally secure** (all plaintexts remain equiprobable) |

---

## 6. Candidate Searchable-Time Axioms (`A1`–`A8`), Zero-Point Ledger (`Z1`–`Z6`), Reconstruction Memory, and `BCI` Bits-per-Joule

### 6.1 Testing candidate axioms `A1 to A8` and zero-point ledger `Z1 to Z6`

Sections 12 and 13 of the research programme evaluate a proponent model in which macroscopic time emerges bottom-up from asynchronous local transitions and frequency-indexed records:

| Candidate axiom | Evaluation against established physics | Label |
| :--- | :--- | :--- |
| **`A1`** (Time = net count of irreversible transitions; restored transitions add zero) | Relates conceptually to Connes-Rovelli (1994) thermal time and Barbour's (2009) relational configurations, but optical clocks confirm relativistic proper time $d\tau/dt = 1 + \Phi/c^2$ independent of tick dissipation (`F1`). | **`Conjecture`** |
| **`A2`** (Each bit restoration costs $k_B T \ln 2$) | Holds strictly as a floor for *blind* 2-to-1 reset (`2.87e-21 J` at `300 K`, Landauer 1961); informed reversible uncomputation has zero thermodynamic floor (Bennett 1973, `F2`). | **`Established`** (blind reset); conflicts for reversible |
| **`A3`** (Local arrow reversal where restoration succeeds) | Subsystem entropy can decrease locally while exported bath heat keeps closed-system entropy non-decreasing under the second law. | **`Established`** locally |
| **`A4`** (Asynchronous cellular events stitched ~80 ms post-hoc) | Adult humans comprise $\sim 3.0 \times 10^{13}$ human cells and $\sim 3.8 \times 10^{13}$ bacteria turning over $\sim 3.3 \times 10^{11}$ cells/day (Sender, Fuchs & Milo 2016), and flash-lag perception integrates the subsequent $\sim 80\text{ ms}$ (Eagleman & Sejnowski 2000; `F7`). | **`Established`** biology/percept; **`Speculation`** as fundamental physics |
| **`A5`** (Same-element atoms lead/lag; retain distribution rather than mean) | Optical clocks resolve gravitational dilation at $33\text{ cm}$ ($(4.1 \pm 1.6)\times 10^{-17}$, Chou et al. 2010) and across $1\text{ mm}$ of strontium ($-9.8(2.3)\times 10^{-20}\text{ mm}^{-1}$ matching $g/c^2 = 1.09\times 10^{-19}\text{ mm}^{-1}$, Bothwell et al. 2022). Measures rate gradients, not future access (`F3`). | **`Established`** rates; **`Conjecture`** for extra information |
| **`A6`** (Temporal coexistence searchable like spatial coexistence) | Minkowski signature $(-,+,+,+)$ restricts spatial lookups to signals arriving along the past light cone $J^-(o)$; reading records outside $J^-(o)$ violates no-signalling (`F4`, `F6`). | **`Speculation`** (for future cone) |
| **`A7`** (Cycles queryable in invertible Fourier / Compton basis) | Plancherel's identity, $E = h\nu$, and Cs-133 matter-wave clocks near $\nu_C = 2.993 \times 10^{25}\text{ Hz}$ (Lan et al. 2013) are established, subject to Gabor's $\Delta t \cdot \Delta f \ge 1/(4\pi)$ window bound (`F5`). | **`Established`** math; **`Speculation`** as lived frame |
| **`A8`** (Querying time is querying vacuum energy) | Time-translation Noether conjugacy **conserves** energy rather than supplying free work; governed by zero-point ledger `Z1 to Z6` (`F8`). | **`Established`** conjugacy; **`Speculation`** for net harvest |

For vacuum energy extraction (`Z1 to Z6`), six accounting rules close every known laboratory cycle (`Established`): (`Z1`) stationary ground states are passive, $\mathrm{Tr}(U \rho_0 U^\dagger H) \ge E_0$ (`500/500` Haar-random unitaries verified in `M6`, minimum $\Delta E = +0.347 > 0$); (`Z2`) dynamical Casimir photon pairs $\omega_1 + \omega_2 = \omega_d$ draw their energy directly from the boundary pump (Wilson et al. 2011; `M6` parametric squeezing at $r = 5.0$ yields $\sinh^2(5) = 5.51 \times 10^3$ photons paid by pump work); (`Z3`) static mirror attraction $P = \pi^2 \hbar c / (240 a^4)$ (`1.30e-3 Pa` at $1\,\mu\text{m}$, Lamoreaux 1997; `1.30e5 Pa` at $10\text{ nm}$) yields one-shot work $\pi^2 \hbar c / (720 a^3) = 4.33 \times 10^{-10}\text{ J/m}^2$ at $1\,\mu\text{m}$ repaid identically upon reset ($W_{\text{net}} = 0$); (`Z4`) feedback sorting pays $\ge k_B T \ln 2$ per erased bit; (`Z5`) laboratory frames lack CTCs or non-stationary metric pumps; and (`Z6`) any claim requires a closed-cycle calorimetric surplus above $5\sigma$ (`F8`).

### 6.2 Constructive memory, provenance fidelity, textual timelessness, and `BCI` throughput

Neuroscience and cognitive psychology place human memory firmly inside the **allowed past-light-cone reconstruction** branch (`C4`), where the binding failure mode is *provenance* rather than backward causality (`Established`):

* **Constructive recall and post-encoding distortion**: Reactivated memories become labile under protein-synthesis block (Nader, Schafe & LeDoux 2000); Bartlett's (1932) constructive recall and Schacter's (1999) source misattribution appear quantitatively in Loftus and Palmer (1974), where changing one verb (*"smashed"* vs *"hit"*) shifted false broken-glass recall a week later from `14%` to `32%`, and in Roediger and McDermott's (1995) `DRM` paradigm, where never-presented critical lures were recalled at `40%` (Exp. 1) and `55%` (Exp. 2) (`F10`). Hippocampal reverse replay (Foster & Wilson 2006), theta-gamma phase coding (Lisman & Jensen 2013), predictive processing (Friston 2010; Clark 2013), and rest preplay of `14.2%` of qualifying events before an unexplored track (Dragoi & Tonegawa 2011) reflect internal generative priors rather than future signals. Provenance fidelity is quantified by $I(R; E) / H(R)$ between reconstruction $R$ and encoded past record $E$.
* **Media density, eyewitness relay decay, and déjà vu**: Correcting an earlier draft's swapped terminology, McLuhan's *Understanding Media* (1964) defines *hot* media (such as alphabetic print) as high-definition/low-participation and *cool* media as sparse/high-participation; stated neutrally, channel reconstruction demand $D = 1 - I(X; C)/H(C)$ exercises internal generative priors (`Conjecture`). Across human chains (Wells & Olson 2003; NRC 2014), per-hop retention $f$ decays as $f^k$ ($0.9^{10} = 0.35$). Surveys show roughly two thirds of adults experience déjà vu (Brown 2004), yet virtual-navigation experiments confirm next-turn prediction stays at chance despite elevated feelings of knowing (Cleary & Claxton 2018; `F12`), and Bem's (2011) $d = 0.22$ retroactive facilitation failed large replications (Ritchie et al. 2012, $p = 0.83$; Galak et al. 2012, $N = 3{,}289$, $d = 0.04$; `F11`).
* **Scriptural and philosophical timelessness mapped to causal cones**: Classical texts — `2 Samuel 23:2` (*"The Spirit of the Lord spake by me"*), `Psalm 90:4` (*"a thousand years in thy sight are but as yesterday"*), Augustine's *Confessions* XI.18–20 (present of things past as memory, present as sight, future as expectation, reading present signs and causes), Boethius's *Consolation* V.6 (eternity as simultaneous possession outside temporal succession), Weyl (1949), and Barbour's time capsules — distinguish an atemporal standpoint outside spacetime (theological/metaphysical, outside experimental physics) from an embodied observer inside spacetime, for whom assembling a wider "now" from past-light-cone starlight and archives is `Established`, whereas receiving specific future outcomes from outside $J^-(o)$ would constitute timelike signalling (`F4`, `F6`, `F11`, `Speculation`).
* **Human output bandwidth and `BCI` bits per joule**: Against $\sim 20\text{ W}$ whole-brain metabolic power (Balasubramanian 2021) and $\sim 10^9\text{ bit/s}$ sensory intake, human behavioural throughput averages $\sim 10\text{ bit/s}$ (Zheng & Meister 2025) and cross-linguistic speech across `17` languages averages `39 bit/s` (Coupé et al. 2019), yielding $\eta = R/P \approx 0.5$ to $1.95\text{ bit/J}$ — roughly $1.7 \times 10^{20}$ times below the $310\text{ K}$ Landauer ceiling $1/(k_B T \ln 2) = 3.37 \times 10^{20}\text{ bit/J}$ (`M5`). Intracortical speech `BCIs` — `78` words/min ($\approx 19\text{ bit/s}$, Metzger et al. 2023), `62` words/min ($\approx 15\text{ bit/s}$, Willett et al. 2023), and `31.6` words/min ($\approx 7.7\text{ bit/s}$, Card et al. 2024) — remain below natural speech and rely on language-model priors whose authorship share must be audited (`F13a`, `F13b`).

<figure class="my-8">
  <img src="/figures/time-as-an-index/past-cone-provenance-dag.svg" alt="Causal directed acyclic graph comparing solid past-light-cone record reconstruction edges against the dashed speculative timelike signalling edge." />
  <figcaption>Figure 2. Allowed past-light-cone reconstruction (solid edges: lossy encoding, stored records, schema/decoder priors, and provenance gate <code>I(R;E)/H(R)</code>) contrasted against speculative timelike reception from outside <code>J⁻(o)</code> (dashed edge, tested at <code>5σ</code> by <code>F4, F6, F11, F12, F19</code>).</figcaption>
</figure>

---

## 7. The Horizon Theorem (`C1`–`C4`), Explicit Models (`M1`–`M8`), and Lean 4 Kernel-Checked Proofs

### 7.1 Formal Horizon and Consistency theorems (`code_and_proofs/lean/Horizon.lean`)

When is the state of a system at arbitrary time $t$ a well-defined mathematical function of a present record $R$ without violating relativity or quantum mechanics? Section 7 formalizes four jointly consistent sufficient conditions (`C1 to C4`) together with the coarse-record horizon (`H-coarse`) and verifies `17` Horizon theorems plus `14` Paradox theorems (`31` total, zero `sorry`) in self-contained `Lean 4.36.0` (inspired by kernel-verified workflows such as AlphaProof, Hubert et al. 2025):

| Horizon clause | Formal mathematical statement | Verified Lean 4 theorem(s) (`TQ`) | Status |
| :--- | :--- | :--- | :--- |
| **`C1` Faithful index** | Every finite strict acyclic causal order admits an injective linear extension into $\mathbb{N}$ preserving causal precedence ($u \prec v \implies \mathrm{idx}(u) < \mathrm{idx}(v)$). | `M1.exists_time_index`, `M1.dag_irrefl`, `M1.dag_asymm` | **`Kernel-checked`** (`propext`, `Quot.sound`) |
| **`C2` Lossless dynamics** | Under injective/bijective step evolution $T$ (finite unitarity), $T^t(R)$ is uniquely determined, distinct presents map to distinct futures, and $T^{-t}(T^t(R)) = R$ with $I(R; X_t) = H(X_t) = 4.000\text{ bits}$ on `16` states. | `future_determined`, `iterate_injective`, `past_recovered` | **`Kernel-checked`** (`0` axioms / `propext`) |
| **`C3` Band-limited structure** | Any $d$-mode polynomial/trigonometric signal ($z = e^{i\omega t}$) is uniquely fixed at every future point by any $d$ pairwise-distinct past samples; `DFT` on $\mathbb{Z}/4\mathbb{Z}$ satisfies exact Plancherel norm conservation $\sum |X_k|^2 = 4 \sum |x_n|^2$. | `M3.future_from_past_samples`, `M3.plancherel_z4` | **`Kernel-checked`** (standard 3) |
| **`C4` Past-cone locality** | In $1+1$ Minkowski space, $(\Delta t)^2 - (\Delta x)^2 = du \cdot dv$, chronological precedence is irreflexive and transitive, and $I^+(o)$ is strictly disjoint from $J^-(o)$ (`past_cone_no_future_access`). | `M4.interval_lightcone`, `M4.future_timelike`, `M4.future_irrefl`, `M4.future_trans`, `M4.past_cone_no_future_access` | **`Kernel-checked`** (standard 3) |
| **`H-coarse` Horizon boundary** | Any non-injective coarse record (such as the two-atom mean `(-1, 1)` vs `(0, 0)` or a 2-bit binning of a 4-bit state) admits **no** exact decoder; noise and finite Slepian windows blow up extrapolation error past the window horizon. | `M1.coarse_record_horizon`, `M1.mean_not_injective`, `M5.erase_not_injective` | **`Kernel-checked`** (`0` axioms) |
| **Joint satisfiability** | Explicit non-empty witness satisfying `C1`, `C2`, `C3`, and `C4` together alongside ground-state passivity (`M6.ground_state_passive_two_level`). | `horizon_conditions_consistent`, `M6.ground_state_passive_two_level` | **`Kernel-checked`** (`propext`, `Quot.sound`) |

### 7.2 Numerical & symbolic verification across `M1 to M8` and `F5` (`seed = 20261122`)

Executing `code_and_proofs/run_models_m1_m8.py` produces deterministic JSON verification (`code_and_proofs/models_m1_m8_results.json`) across all eight models and the pre-registered `F5` spectral test:

| Model | Verified computation (`seed = 20261122`) | Quantitative output | Physical falsifier |
| :--- | :--- | :--- | :--- |
| **`M1` Indexed dataset** | `n = 1,000,000` ordered records; direct index vs binary search vs linear scan to `777,777`; 2-bit coarse record on 4-bit world; 2-to-1 lossy step at $t=5$. | `1` step vs `20` steps ($\lfloor \log_2 10^6 \rfloor + 1$) vs `777,778` steps; coarse mutual information `2.000` vs `4.000` bits; `8/16` futures survive at $t=5$. | `F3` |
| **`M2` & `M2b` Loops** | Markov fixed point; `Qhronology` CNOT+SWAP symbolic check; `3..6`-bit (`d = 8..64`) unitary witness loop under `D-CTC` vs `P-CTC`. | `D-CTC` converges to witness (`residual = 0.0`) in `1` query; `P-CTC` succeeds with $P = 1/d^2$ (`64, 256, 1,024, 4,096` trials). | `F4`, `F6` |
| **`M3` Frequency index** | `N = 128` Plancherel check; exact $d = 8$ Vandermonde recovery; `128`-sample sub-Nyquist extrapolation (`W = 0.035`, `20` runs). | Plancherel error `2.34e-16`; `DPSS` eigenvalues `[0.991, 0.928, 0.681, 0.289, 0.063, 0.008]`; `cond = 1.94e9`; lead `1..8` error `2.5e-5` (noiseless) $\to$ `5.3e-3` (`80 dB`) $\to$ `0.470` (`20 dB`), rising to `0.600`–`1.294` at lead `57..64`. | `F5` |
| **`M4` Gödel spacetime** | Exact SymPy Christoffel, Ricci, and Einstein tensor evaluation for $ds^2 = -dt^2 - 2e^{\sqrt{2}\omega x} dt\,dy - \frac{1}{2}e^{2\sqrt{2}\omega x} dy^2 + dx^2 + dz^2$. | $\det g = -\frac{1}{2}e^{2\sqrt{2}\omega x} < 0$; $R = -2\omega^2$; $g_{yy} < 0$ everywhere ($\partial_y$ timelike); $G_{\mu\nu} + (-\omega^2)g_{\mu\nu} - 2\omega^2 u_\mu u_\nu \equiv \mathbf{0}$ (`4x4` zero matrix). | `F4`, `F6` |
| **`M5` Count time** | `16`-state permutation Shannon entropy conservation vs bit reset; Landauer room/body floors. | Bijection $\Delta H = 4.44 \times 10^{-16}\text{ nats}$; `300 K` floor `2.871e-21 J/bit` (`0.0179 eV`); $2^{128}$ bits $= 9.77 \times 10^{17}\text{ J}$; $2^{256}$ bits $= 3.32 \times 10^{56}\text{ J}$. | `F1`, `F2` |
| **`M6` Energy query** | `500` Haar-random $4\times 4$ unitaries on ground state; squeezing at $r = 5.0$; static Casimir plates. | $\min \Delta E = +0.347 > 0$ (passive); $\sinh^2(5) = 5,506.1$ photons (Monte Carlo `5,558.4`) paid by pump; closed-cycle $W_{\text{net}} = 0.0\text{ J}$. | `F8` |
| **`M7` Crypto PoW** | Real `SHA-256d` `8, 12, 16`-bit puzzles (`10` runs) + `16`-bit Hellman chains (`m = 256, t = 64`) on unsalted vs fresh-block challenges. | Valid nonces `392, 4245, 9459` (`1` `D-CTC` query vs `243.9, 5,294.2, 27,078.9` mean postselected trials); Hellman reuse drops `34.0%` $\to$ **`0.0%`** on fresh block hash. | `F5` |
| **`M8` Compton bridge** | CODATA `e⁻` and `Cs-133` Compton frequencies $\nu_C = mc^2/h$ and `1 mm` vertical redshift over `1` Julian year. | $\nu_{C,e} = 1.235590 \times 10^{20}\text{ Hz}$; $\nu_{C,\text{Cs}} = 2.993486 \times 10^{25}\text{ Hz}$; $\Delta\tau = 3.443 \times 10^{-12}\text{ s/yr}$ (`6.48e14 rad` Compton, `0.199 rad` hyperfine). | `F3` |
| **`F5` `SHA-256` FFT test** | Pre-registered `rfft` periodogram across `N = 65,536` consecutive `SHA-256` digests (`32,767` interior bins) + `k = 1, 2, 4, 8`-bit prefix predictors. | Max bin `10.5368` vs Gumbel median `10.7637` (Šidák $p = 0.5809$; **`0` bins** $< 10^{-6}$); prefix $z = -0.32, -0.50, +0.11, +1.82$ (all within $\pm 5\sigma$; null retained). | `F5` (executed, null holds) |

---

## 8. Empirical Ledgers: `81` Temporal Anomalies, `40`-Entry Frequency Atlas, and `74`-Paradox Constraint Accounting

### 8.1 Temporal Anomaly Catalog (`TA001` to `TA081`, `data/temporal-anomaly-catalog.csv`)

Auditing `81` widely cited human (`65`) and non-human (`16`) temporal anomaly reports across human categories `H1` (timeslips, `7`), `H2` (out-of-place people/artifacts, `17`), `H3` (precognition/premonitions, `8`), `H4` (déjà vu/dreams, `4`), `H5` (attested religious/cultural sleep-dilation texts, `8`), `H6` (clinical/perceptual distortions, `8`), and `H7` (physics/clock measurements, `13`), plus non-human categories `N1` (animal disaster precursors, `3`), `N2` (companion animals, `2`), `N3` (mechanistic circadian/prime anticipation, `6`), `N4` (millennial dormancy/cryptobiosis, `4`), and `N5` (non-equilibrium relaxation, `1`), yields `33` Grade A peer-reviewed measurements, `20` Grade B contemporaneous/textual records, `11` Grade C later retellings, and `17` Grade D hoaxes/fictions/misidentifications:

* **Zero unexplained Grade A or Grade B cases of future signalling survive.** Famous viral "time travellers" collapse upon primary-source inspection: Rudolph Fentz (`TA012`) is Jack Finney's 1951 short story *"I'm Scared"*; John Titor (`TA014`), Andrew Carlssin (`TA015`), Håkan Nordkvist (`TA017`), and Sergei Ponomarenko (`TA016`) trace to forum fiction, *Weekly World News* satire, a Swedish pension commercial, and a 2012 Ukrainian television drama; the 1928 Chaplin premiere clip (`TA009`), 1941 South Fork Bridge photograph (`TA008`), and 1860 Waldmüller painting (`TA011`) show period hearing aids, sunglasses/cameras, and a prayer book; `OPERA` superluminal neutrinos (`TA053`) traced to a `73 ns` loose fiber connector.
* **Real, replicated time travel in the catalog is strictly one-way relativistic dilation or metabolic suspension**: Hafele-Keating clocks (`TA062`), `GPS` `+38.6 µs/day` net clock advance (`TA063`), Sergei Krikalev's `~0.02 s` orbital kinematic offset (`TA064`), `1 mm` strontium optical-clock redshift (`TA065`), and `46,000`-year Siberian nematode cryptobiosis (`TA077`, Shatilovich et al. 2023). Unresolved Grade A/B reports — Versailles 1901 (`TA001`), retrospective Aberfan letters (`TA025`), presentiment meta-analyses (`TA031`), and pre-seismic toads (`TA067`) — map directly to prospective sealed protocols `F11`, `F12`, `F14`, and `F15`.

### 8.2 Frequency Anomaly Atlas (`AA01` to `AA40`, `data/anomaly-atlas.csv`)

Writing `40` sky (`21`) and Earth-laboratory (`19`) frontier anomalies in frequency form (`16` `resolved`, `17` `open`, `7` `contested`) places the sharpest physical boundary at black-hole and cosmological horizons (`Figure 3`):

1. **Black-hole horizon ringdowns and scrambling delay (`AA01`–`AA08`)**: Every Kerr-Schwarzschild horizon scale varies as $c^3/(GM)$. For a $62\,M_\odot$ remnant (`GW150914`, `AA04`), the fundamental ringdown $f_{\text{QNM}} \approx 195\text{ Hz}$ sits at $9.39 \times \nu_H$ ($\nu_H = 20.7\text{ Hz}$, `AA03`), while `GW250114` (`AA05`) probes horizon angular velocity $2\Omega_H$ and surface-gravity decay $\kappa$ (`F16`). In 2D gravitational island models (Penington 2019; Almheiri et al. 2019), interior information returns in Hawking radiation after the Page time with scrambling latency $t_{\text{scr}} = (4GM/c^3)\ln S \approx 0.23\text{ s}$ at $62\,M_\odot$ ($1/t_{\text{scr}} \approx 4.35\text{ Hz}$, matching the `4.4 Hz` Planck-echo spacing claimed and nulled in `AA06`; `F17`).
2. **Cosmic expansion rate versus galactic acceleration (`AA09`–`AA12`)**: Converting Milgrom's `MOND` scale $a_0 \approx 1.2 \times 10^{-10}\text{ m/s}^2$ into frequency gives $a_0/c = 4.00 \times 10^{-19}\text{ Hz}$, within `6%`–`15%` of $H_0 / (2\pi) = 3.48 \times 10^{-19}$ to $3.77 \times 10^{-19}\text{ Hz}$ across Planck and `SH0ES` (`AA09`). Whether $a_0(z)$ tracks $H(z)$ (`~3.0x` higher at $z = 2$ in flat $\Lambda\text{CDM}$) or stays constant is directly testable via high-redshift kinematic rotation curves (`F18`).

<figure class="my-8">
  <img src="/figures/time-as-an-index/frequency-anomaly-atlas.svg" alt="Logarithmic frequency map of 28 single-frequency entries from AA01 to AA40 across open, contested, and resolved lanes." />
  <figcaption>Figure 3. Frequency Anomaly Atlas (<code>AA01</code> to <code>AA40</code>): <code>28</code> single-frequency sky and laboratory edge cases plotted across <code>61</code> decades from <code>MOND a₀/c = 4.0×10⁻¹⁹ Hz</code> to <code>ν_Planck = 2.95×10⁴² Hz</code> (<code>12</code> multi-scale entries tabulated in <code>data/anomaly-atlas.csv</code>).</figcaption>
</figure>

### 8.3 Paradox Ledger (`P01` to `P74`, `data/paradox-ledger.csv` and `code_and_proofs/lean/Paradox.lean`)

Cataloging `74` paradoxes across theoretical physics (`36`), mathematics and logic (`20`), information and computation (`9`), probability and decision theory (`7`), and network/resource economics (`2`) (`45` `resolved`, `15` `partial`, `14` `open`) converts apparent contradictions into **eleven explicit price tags** verified by `14` Lean theorems in `TQ.Paradox` and numerical checks in `run_models_m1_m8.py`:

| Lean 4 theorem (`TQ.Paradox`) | Paradox constraint proved | Axiom footprint |
| :--- | :--- | :--- |
| `no_total_self_oracle` | No total Boolean oracle $O : Q \to \mathrm{Bool}$ agrees with its negated diagonal $d$ (`Liar` `P45`, `Halting` `P48`, `F19`). | **None** (`0` axioms) |
| `no_universal_answer_table` | No surjection $Q \to (Q \to \mathrm{Bool})$ exists (`Cantor` `P41`, `Russell` `P40`). | **None** (`0` axioms) |
| `mixed_answer_unique` | Over $\mathbb{Q}$, $p = 1 - p$ has unique fixed point $p = 1/2 \in [0, 1]$ (Deutsch mixed dodge for `P01`, `P45`). | Standard 3 |
| `grandfather_no_pure` & `polchinski_multiplicity` | `!b ≠ b` forbids pure NOT-loop fixed points (`P01`), while `id` admits multiple distinct fixed points (`Polchinski` `P06`, `Novikov` `P05`). | **None** (`0` axioms) |
| `no_injection_gt` & `incompressible` | Finite pigeonhole forbids surjections $\mathrm{Fin}(2^n - 1) \to \mathrm{Fin}(2^n)$ (`Bootstrap` `P02`, `Kolmogorov` `P66`). | Standard 3 |
| `recurrence` | Every bijection on $\mathrm{Fin}\,n$ returns every state $x$ within $1 \le d \le n$ steps (`Poincaré` `P25`, forcing a paid Past Hypothesis `P28`). | Standard 3 |
| `zeno_dichotomy`, `instant_measure_zero`, `countable_instants_null` | Exact scaled geometric partial sum $2^n - 1$, zero singleton interval duration, and bounded finite prefix covers (`Zeno` `P51`, `P52`, `Skolem` `P50`). | Standard 3 |
| `hilbert_hotel`, `galileo_squares`, `monty_hall` | `Nat.succ` and $n \mapsto n^2$ are injective without surjectivity on infinite $\mathbb{N}$ (`P60`, `P61`, blocked in finite Bekenstein regions `2.58e43 bits` at `1 m, 1 kg`, `P69`); informed door selection wins `2/3` (`P64`). | Standard 3 |

The eleven resulting accounting rules — (1) no total Boolean self-oracle, (2) paid fixed-point selection, (3) provenance or $\mathrm{PSPACE}$ debt per incompressible bit, (4) measure-zero instants requiring neighbourhood integration, (5) frame-labelled worldline proper time, (6) paid low-entropy Past Hypothesis boundary, (7) Landauer $k_B T \ln 2$ reset floor plus Zeno measurement back-action, (8) Bekenstein ($2.58 \times 10^{43}\text{ bits}$) and holographic ($1.38 \times 10^{69}\text{ bits/m}^2$) capacity caps, (9) quantum correlations distinct from classical records, (10) proper priors and bounded utility (`Two Envelopes` `P56`, `St Petersburg` `P57`, `Bertrand` `P59`), and (11) observer-declared records (`Wigner's Friend` `P15`, `Firewall` `P37`) — leave `14` genuine open debts (`P03, P04, P07, P14, P15, P28, P29, P32..P37, P39`).

---

## 9. Falsifiers (`F1`–`F19`) and Energy-Native Game Design Translation

### 9.1 Consolidated falsifier registry (`F1 to F19`)

Every speculative or conjectural claim in this study is paired with a concrete decision rule:

| ID | Target claim | Protocol and $5\sigma$ / formal decision threshold | Current status |
| :--- | :--- | :--- | :--- |
| **`F1`** | `A1` dissipation-count proper time | Co-located optical clocks differing by $\ge 10^6\times$ in dissipation per tick over $10^6\text{ s}$: `A1` as physical proper time fails if elapsed ratio equals `1` within $10^{-15}$. | Untested directly; standard relativity predicts `1` |
| **`F2`** | `A2` reversible vs blind reset heat | Informed reversible uncomputation dissipating $< 0.5\,k_B T \ln 2$ at $5\sigma$ refutes `A2` universal cost; blind reset $< 0.9\,k_B T \ln 2$ refutes Landauer. | Blind Landauer floor confirmed; `A2` restricted |
| **`F3`** | `A5` atom-resolved clock residuals | Mutual information between per-atom optical-clock residuals at $t$ and `QRNG` bits at $t + \tau$: fails below $10^{-3}\text{ bit/sample}$ across $10^7$ samples. | Open (`Conjecture`) |
| **`F4`** | Timelike signalling (`A6`, retrocausality) | Two-time marginal shift $|P(a \mid x, y) - P(a \mid x, y')|$ across $10^7$ `QRNG`-switched trials ($\sigma \approx 3\times 10^{-4}$): fails within $5\sigma$. | Holds for no-signalling (`0` violations) |
| **`F5`** | `A7` spectral `SHA-256` / `PoW` shortcut | `FFT` periodogram and $k$-bit prefix test on consecutive `SHA-256` digests ($p < 10^{-6}$ family-wise; $2^{-k} \pm 5\sigma$). | **Executed here (`N = 65,536`)**: `0` bins $< 10^{-6}$, null holds |
| **`F6`** | `A6` superluminal / early arrival | Arrival earlier than $t_{\text{emit}} + L/c$ by $> 5\times$ timing jitter across $10^9$ timed events (`NANOGrav`, `GRB`, neutrino baselines). | Holds for causality (`OPERA` connector fixed) |
| **`F7`** | `A4` body-wide global phase lock | Phase-locking value $> 0.9$ across $\ge 3$ independent somatic cell lineages over $\ge 7\text{ days}$ refutes asynchronous `A4`. | `A4` supported by turnover data |
| **`F8`** | `A8` / `Z6` closed-cycle vacuum work | Sealed calorimetric net work $W_{\text{net}} > 0$ above $5\sigma$ over a closed reset cycle without external drive depletion. | Zero positives; passivity holds |
| **`F9`** | Formal inconsistency of `A1`–`A8` | Kernel-checked Lean 4 derivation of `False` from formalized `A1`–`A8` + finite-dimensional quantum channels + Minkowski causality. | Weakened `C1`–`C4` proved consistent (`Horizon.lean`) |
| **`F10`** | Constructive memory provenance | Pre-registered `DRM` + misinformation test ($n \ge 200$): falsified if lure recall exceeds unrelated intrusions by $< 0.05$ with `AUC >= 0.95`. | Survived (`40–55%` `DRM`, `32% vs 14%` Loftus) |
| **`F11`** | Human precognition (`TA025, TA030..TA032`) | `SHA-256`-committed response at $t_1$ vs `QRNG` bit drawn at $t_2 \ge t_1 + 24\text{ h}$ ($N \ge 10^5$, $\sigma \approx 1.58\times 10^{-3}$): requires $> 0.5 + 5\sigma \approx 0.508$ replicated + `F4`. | Prior replications at chance (`d = 0.04`) |
| **`F12`** | Déjà vu / dream navigation (`TA033, TA036`) | Pre-committed report before `QRNG`-selected maze turn ($N \ge 10^4$ tagged trials, $5\sigma$ threshold). | Falsified in Cleary & Claxton (2018) |
| **`F13`** | Denser `BCI` protocol & authorship | (a) Intended-content mutual information $> 39\text{ bit/s}$ over $\ge 10\text{ h}$; (b) blinded user-vs-decoder authorship discrimination $\ge 0.90$. | Current `BCIs` at `7.7`–`19 bit/s` |
| **`F14`** | Animal disaster precursors (`TA066..TA070`) | Continuous multi-year monitoring against declustered quake catalogs + parallel `VLF`/radon/seismic logs ($\ge 20$ events, gain $> 2$ at $p < 10^{-3}$). | Open for physical precursors |
| **`F15`** | Sealed-archive retrocognition (`TA001..TA007`) | Pre-hashed witness reports at sites with third-party-escrowed unpublished past states vs matched controls ($\ge 500$ visits, $5\sigma$). | Untested under escrow |
| **`F16`** | Horizon direct-wave readout (`AA04, AA05`) | $\ge 10$ post-merger events (`SNR >= 30`) testing $2\Omega_H$ and $\kappa$ within `10%` of inspiral Kerr parameters with rising Bayes factor. | `Conjecture` (`GW250114` motivates) |
| **`F17`** | Scrambling echo comb & circuit latency (`AA01, AA06`) | (a) Stack $\ge 20$ mergers for $t_{\text{scr}} = (4GM/c^3)\ln S$ comb at $5\sigma$; (b) $S = 4..10$ qubit scrambling decoding latency $\propto \log S$ vs linear. | `O1`–`O3` echoes consistent with noise |
| **`F18`** | Cosmic scaling of `MOND` $a_0(z)$ (`AA09, AA12`) | Kinematic `RAR` across $1 \le z \le 2.5$ ($\ge 30$ galaxies/bin): $a_0(z)/a_0(0) = H(z)/H_0 \approx 3.0$ at $z=2$ vs constant $1 \pm 0.2$ at $5\sigma$. | `Conjecture` (JWST/ALMA testable) |
| **`F19`** | Novikov diagonal conspiracy audit (`P01, P05, P45`) | Commit prediction at $t_1$; automated hardware negates prediction at $t_2$. Excess hardware-actuation failure rate vs controls tests backward consistency. | `Speculation` (baseline predicts `0` excess) |

### 9.2 Translating time-indexing physics into honest energy-native game mechanics

In strategy and puzzle design (explored interactively in Instrument 4 of [/living/time-as-an-index/](/living/time-as-an-index/)), replacing fantasy free time-travel with explicit joule, heat, memory, and freshness budgets turns the theorems of Sections 2 to 8 into tactile player tradeoffs across four eras:

* **Era 1 — Sweep (`Sequential Brute Search`)**: Live sequential guessing charges deterministic joules per hash and exposes ruinous tail variance on unindexed vaults, whereas verified deterministic scripts have predictable energy envelopes.
* **Era 2 — Ledger vs Salt Storms & Freshness Seals (`Hellman T·M² = N²`)**: Pre-filling a Hellman ledger costs $N$ upfront joules to buy cheap $N^{2/3}$ online lookups, until defenders deploy *Salt Storms* (multiplying fill cost by $2^s$, triggering `stale ledger` failure) or *Freshness Seals* (chaining challenges to the newest block hash so zero precomputation can start early). *Rewind Charms* defeat stateful guards (`IND-CCA` / `EUF-CMA`) while bouncing off stateless guards (`Meier 2022`).
* **Era 3 — Fourier Lens & Settling Basin (`Gabor & Analog Relaxation`)**: *Fourier Lens* reveals periodic vault schedules at $O(N \log N)$ cost only when the observation window satisfies $\Delta t \ge 1/(4\pi\,\Delta f)$ (otherwise failing by `smear`); *Settling Basin* relaxes easy instances rapidly while spiking into exponential heat fluctuations on phase-transition instances (`Ercsey-Ravasz & Toroczkai 2011`), paired with a *Landauer Counter* charging $k_B T \ln 2$ per erased bit unless time is spent uncomputing reversibly.
* **Era 4 — Postselection Gamble & Consistency Loop (`PP` and `PSPACE` Endgame)**: *Postselection Gamble* guarantees a witness at $1/p$ energy burn (`PP` ceiling); *Consistency Loop* unlocks single-query `PSPACE` fixed points while risking adversarial fixed-point selection (`paradox lockout`) and Cauchy-horizon thermal drain (`chronology collapse`), while *One-Time Pad* set-piece vaults remain mathematically unbreakable in every era. Narrative commitment mechanics (`Surprise Pact`, binding a player to a hashed present state revealed later under no-signalling) take distant thematic inspiration from classic folklore and Andrzej Sapkowski's 1993 short story *"A Question of Price"* (in *The Last Wish*) surprise-debt motif; *The Witcher* is a registered trademark of CD PROJEKT S.A., and this independent research and simulation work uses zero names, characters, text, or assets from those works and has no affiliation with or endorsement by CD PROJEKT S.A. or Andrzej Sapkowski.

---

## References

*Transparency note on source access: primary arXiv preprints, open-access proceedings, Lean 4 / SymPy / Python code, and `Qhronology v1.2.1` were executed or inspected directly; paywalled historical monographs and journal articles (`Deutsch 1991`, `Gödel 1949`, `Landauer 1961`, `Cooley & Tukey 1965`, `Gabor 1946`, `Hellman 1980`, `Hawking 1992`, `Friedman et al. 1990`, `Bennett 1973/1989`, `Fiat & Naor 2000`, `Oechslin 2003`, `Bartlett 1932`, `McLuhan 1964`, `Weyl 1949`) are cited via verified Digital Object Identifiers (`DOI`) and secondary mathematical restatements in the open-access literature.*

<ol data-refs>
<li>Aaronson, S. (2005). NP-complete problems and physical reality. <em>ACM SIGACT News</em>, 36(1), 30–52. <code>arXiv:quant-ph/0502072</code>.</li>
<li>Aaronson, S. (2005). Quantum computing, postselection, and probabilistic polynomial-time. <em>Proceedings of the Royal Society A</em>, 461(2063), 3473–3482. doi:10.1098/rspa.2005.1546.</li>
<li>Aaronson, S. (2015). Memrefuting (technical critique of polynomial-resource memcomputing claims). <em>Shtetl-Optimized</em>.</li>
<li>Aaronson, S., &amp; Watrous, J. (2009). Closed timelike curves make quantum and classical computing equivalent. <em>Proceedings of the Royal Society A</em>, 465(2102), 631–647. doi:10.1098/rspa.2008.0350; <code>arXiv:0808.2669</code>.</li>
<li>Aaronson, S., Bavarian, M., Gueltrini, G., Cubitt, T., O'Donnell, R., Grewal, S., &amp; Raat, F. (2024). Computability theory of closed timelike curves (v2 correction). <code>arXiv:1609.05507v2</code>.</li>
<li>Aggarwal, D., Brennen, G. K., Lee, T., Santha, M., &amp; Tomamichel, M. (2018). Quantum attacks on Bitcoin, and how to protect against them. <em>Ledger</em>, 3, 41–62. <code>arXiv:1710.10377</code>.</li>
<li>Aharonov, Y., Bergmann, P. G., &amp; Lebowitz, J. L. (1964). Time symmetry in the quantum process of measurement. <em>Physical Review</em>, 134(6B), B1410–B1416. doi:10.1103/PhysRev.134.B1410.</li>
<li>Aharonov, Y., &amp; Elitzur, A. C. (2026). Time running backwards, and where it stops (preprint). <code>arXiv:2611.12971</code>.</li>
<li>Almheiri, A., Engelhardt, N., Marolf, D., &amp; Maxfield, H. (2019). The entropy of bulk quantum fields and the entanglement wedge of an evaporating black hole. <em>Journal of High Energy Physics</em>, 2019(12), 063.</li>
<li>Almheiri, A., Marolf, D., Polchinski, J., &amp; Sully, J. (2013). Black holes: Complementarity or firewalls? <em>Journal of High Energy Physics</em>, 2013(2), 062.</li>
<li>Bacon, D. (2004). Quantum computational complexity in the presence of closed timelike curves. <em>Physical Review A</em>, 70(3), 032309. doi:10.1103/PhysRevA.70.032309; <code>arXiv:quant-ph/0309189</code>.</li>
<li>Balasubramanian, V. (2021). Brain power. <em>Proceedings of the National Academy of Sciences</em>, 118(32), e2107022118.</li>
<li>Bekenstein, J. D. (1981). Universal upper bound on the entropy-to-energy ratio for bounded systems. <em>Physical Review D</em>, 23(2), 287–298.</li>
<li>Bem, D. J. (2011). Feeling the future: Experimental evidence for anomalous retroactive influences on cognition and affect. <em>Journal of Personality and Social Psychology</em>, 100(3), 407–425; failed replications in Ritchie, Wiseman &amp; French (2012), <em>PLOS ONE</em> 7(3):e32719, and Galak et al. (2012), <em>JPSP</em> 103(6):933–948.</li>
<li>Bennett, C. H. (1973). Logical reversibility of computation. <em>IBM Journal of Research and Development</em>, 17(6), 525–532; and Bennett, C. H. (1989). Time/space trade-offs for reversible computation. <em>SIAM Journal on Computing</em>, 18(4), 766–776. doi:10.1137/0218053.</li>
<li>Bennett, C. H., Leung, D., Smith, G., &amp; Smolin, J. A. (2009). Can closed timelike curves or nonlinear quantum mechanics improve quantum state discrimination or help solve hard problems? <em>Physical Review Letters</em>, 103(17), 170502. <code>arXiv:0908.3023</code>.</li>
<li>Bishop, L. G. (2026). Qhronology: Simulating quantum mechanics with closed timelike curves in Python. <code>arXiv:2601.17459</code> (software package <code>qhronology</code> v1.0.0–v1.2.1).</li>
<li>Bothwell, T., Kennedy, C. J., Aeppli, A., Kedar, D., Robinson, J. M., Oelker, E., Staron, A., &amp; Ye, J. (2022). Resolving the gravitational redshift across a millimetre-scale atomic sample. <em>Nature</em>, 602, 420–424.</li>
<li>Brown, A. S. (2004). <em>The Déjà Vu Experience</em>. Psychology Press; and Cleary, A. M., &amp; Claxton, A. B. (2018). Déjà vu: An illusion of prediction. <em>Psychological Science</em>, 29(4), 635–644.</li>
<li>Brun, T. A. (2003). Computers with closed timelike curves can solve hard problems. <em>Foundations of Physics Letters</em>, 16(3), 245–253. <code>arXiv:gr-qc/0209061</code>.</li>
<li>Brun, T. A., Harrington, J., &amp; Wilde, M. M. (2009). Localized closed timelike curves can perfectly distinguish quantum states. <em>Physical Review Letters</em>, 102(21), 210402. <code>arXiv:0811.1209</code>.</li>
<li>Brun, T. A., Wilde, M. M., &amp; Winter, A. (2013). Quantum state cloning using Deutschian closed timelike curves. <em>Physical Review Letters</em>, 111(19), 190401. <code>arXiv:1306.1795</code>.</li>
<li>Card, N. S., Wairagkar, M., Iacobacci, C., et al. (2024). An accurate and rapidly calibrating speech neuroprosthesis. <em>New England Journal of Medicine</em>, 391(7), 609–618.</li>
<li>Castagnoli, G. (2025). Quantum computational speedup and retrocausality. <code>arXiv:2505.08346</code> (extending <em>Int. J. Theor. Phys.</em> 2009 and <code>arXiv:1603.02246</code>).</li>
<li>Chou, C. W., Hume, D. B., Rosenband, T., &amp; Wineland, D. J. (2010). Optical clocks and relativity. <em>Science</em>, 329(5999), 1630–1633.</li>
<li>Connes, A., &amp; Rovelli, C. (1994). Von Neumann algebra automorphisms and time-thermodynamics relation in generally covariant quantum theories. <em>Classical and Quantum Gravity</em>, 11(12), 2899–2917.</li>
<li>Cooley, J. W., &amp; Tukey, J. W. (1965). An algorithm for the machine calculation of complex Fourier series. <em>Mathematics of Computation</em>, 19(90), 297–301. doi:10.1090/S0025-5718-1965-0178586-1.</li>
<li>Coupé, C., Oh, Y. M., Dediu, D., &amp; Pellegrino, F. (2019). Different languages, similar encoding efficiency: Comparable information rates across the human communicative niche. <em>Science Advances</em>, 5(9), eaaw2594.</li>
<li>Demaine, E. D., Iacono, J., &amp; Langerman, S. (2007). Retroactive data structures. <em>ACM Transactions on Algorithms</em>, 3(2), Article 13.</li>
<li>Deutsch, D. (1991). Quantum mechanics near closed timelike lines. <em>Physical Review D</em>, 44(10), 3197–3217. doi:10.1103/PhysRevD.44.3197.</li>
<li>Dragoi, G., &amp; Tonegawa, S. (2011). Preplay of future place cell sequences by hippocampal cellular assemblies. <em>Nature</em>, 469, 397–401; and Foster, D. J., &amp; Wilson, M. A. (2006). Reverse replay of behavioural sequences in hippocampal place cells during the awake state. <em>Nature</em>, 440, 680–683.</li>
<li>Driscoll, J. R., Sarnak, N., Sleator, D. D., &amp; Tarjan, R. E. (1989). Making data structures persistent. <em>Journal of Computer and System Sciences</em>, 38(1), 86–124.</li>
<li>Eagleman, D. M., &amp; Sejnowski, T. J. (2000). Motion integration and postdiction in visual awareness. <em>Science</em>, 287(5460), 2036–2038.</li>
<li>Echeverria, F., Klinkhammer, G., &amp; Thorne, K. S. (1991). Billiard balls in wormhole spacetimes with closed timelike curves: Classical theory. <em>Physical Review D</em>, 44(4), 1077–1099; and Friedman, J., Morris, M. S., Novikov, I. D., Echeverria, F., Klinkhammer, G., Thorne, K. S., &amp; Yurtsever, U. (1990). Cauchy problem in spacetimes with closed timelike curves. <em>Physical Review D</em>, 42(6), 1915–1930. doi:10.1103/PhysRevD.42.1915.</li>
<li>Ercsey-Ravasz, M., &amp; Toroczkai, Z. (2011). Optimization hardness as transient chaos in an analog approach to constraint satisfaction. <em>Nature Physics</em>, 7, 966–970. <code>arXiv:1208.0526</code>.</li>
<li>Fiat, A., &amp; Naor, M. (2000). Rigorous time-space trade-offs for inverting functions. <em>SIAM Journal on Computing</em>, 29(3), 790–803. doi:10.1137/S0097539795280512.</li>
<li>Gabor, D. (1946). Theory of communication. <em>Journal of the Institution of Electrical Engineers - Part III</em>, 93(26), 429–457. doi:10.1049/ji-3-2.1946.0074.</li>
<li>Gödel, K. (1949). An example of a new type of cosmological solutions of Einstein's field equations of gravitation. <em>Reviews of Modern Physics</em>, 21(3), 447–450. doi:10.1103/RevModPhys.21.447.</li>
<li>Grover, L. K. (1996). A fast quantum mechanical algorithm for database search. <em>Proceedings of the 28th Annual ACM Symposium on Theory of Computing (STOC)</em>, 212–219.</li>
<li>Hawking, S. W. (1992). Chronology protection conjecture. <em>Physical Review D</em>, 46(2), 603–611. doi:10.1103/PhysRevD.46.603.</li>
<li>Hellman, M. E. (1980). A cryptanalytic time-memory trade-off. <em>IEEE Transactions on Information Theory</em>, 26(4), 401–406.</li>
<li>Hubert, T., Mehta, R., Sartran, L., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning (AlphaProof). <em>Nature</em>.</li>
<li>Inagaki, T., Haribara, Y., Igarashi, K., et al. (2016). A coherent Ising machine for 2000-node optimization problems. <em>Science</em>, 354(6312), 603–606. doi:10.1126/science.aah4243; and McMahon, P. L., et al. (2016). A fully programmable 100-spin coherent Ising machine. <em>Science</em>, 354(6312), 614–617. doi:10.1126/science.aah5178.</li>
<li>Ji, Z., Lloyd, S., &amp; Wilde, M. M. (2026). Retrocausal quantum and classical capacities of noisy closed timelike curves. <em>Physical Review Letters</em>, 136, 230801. <code>arXiv:2509.08965</code>.</li>
<li>Kulkarni, K., &amp; Michels, J.-E. (2012). Temporal features in SQL:2011. <em>ACM SIGMOD Record</em>, 41(3), 34–43. doi:10.1145/2380776.2380786.</li>
<li>Lamoreaux, S. K. (1997). Demonstration of the Casimir force in the 0.6 to 6 µm range. <em>Physical Review Letters</em>, 78(1), 5–8; and Wilson, C. M., Johansson, G., Pourkabirian, A., et al. (2011). Observation of the dynamical Casimir effect in a superconducting circuit. <em>Nature</em>, 479, 376–379.</li>
<li>Lan, S.-Y., Kuan, P.-C., Estey, B., English, D., Brown, J. M., Hohensee, M. A., &amp; Müller, H. (2013). A clock directly linking time to a particle's mass. <em>Science</em>, 339(6119), 554–557.</li>
<li>Landauer, R. (1961). Irreversibility and heat generation in the computing process. <em>IBM Journal of Research and Development</em>, 5(3), 183–191. doi:10.1147/rd.53.0183.</li>
<li>Leifer, M. S., &amp; Pusey, M. F. (2017). Is a time symmetric interpretation of quantum theory possible without retrocausality? <em>Proceedings of the Royal Society A</em>, 473(2202), 20160607. <code>arXiv:1607.07871</code>.</li>
<li>Lloyd, S., Maccone, L., Garcia-Patron, R., Giovannetti, V., Shikano, Y., Pirandola, S., Rozema, L. A., Darabi, A., Soudagar, Y., Shalm, L. K., &amp; Steinberg, A. M. (2011). Closed timelike curves via postselection: Theory and experimental test of consistency. <em>Physical Review Letters</em>, 106(4), 040403; <em>Physical Review D</em>, 84(2), 025007. <code>arXiv:1005.2219</code>.</li>
<li>Loftus, E. F., &amp; Palmer, J. C. (1974). Reconstruction of automobile destruction: An example of the interaction between language and memory. <em>Journal of Verbal Learning and Verbal Behavior</em>, 13(5), 585–589; and Roediger, H. L., &amp; McDermott, K. B. (1995). Creating false memories: Remembering words not presented in lists. <em>JEP: Learning, Memory, and Cognition</em>, 21(4), 803–814.</li>
<li>Meier, R. (2022). Security against time-traveling adversaries. <em>IACR Cryptology ePrint Archive</em>, Paper 2022/1148.</li>
<li>Metzger, S. L., Littlejohn, K. T., Silva, A. B., et al. (2023). A high-performance neuroprosthesis for speech decoding and avatar control. <em>Nature</em>, 620, 1037–1046; and Willett, F. R., Kunz, E. M., Fan, C., et al. (2023). A high-performance speech neuroprosthesis. <em>Nature</em>, 620, 1031–1036.</li>
<li>Nader, K., Schafe, G. E., &amp; LeDoux, J. E. (2000). Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval. <em>Nature</em>, 406, 722–726. doi:10.1038/35021052; and Schacter, D. L. (1999). The seven sins of memory. <em>American Psychologist</em>, 54(3), 182–203.</li>
<li>O'Callahan, R., Jones, C., Froyd, N., Huey, K., Noll, A., &amp; Partush, N. (2017). Engineering record and replay for deployability (<code>rr</code>). <em>USENIX ATC 2017</em>, 377–389.</li>
<li>Oechslin, P. (2003). Making a faster cryptanalytic time-memory trade-off. <em>Advances in Cryptology - CRYPTO 2003</em>, LNCS 2729, 617–630. doi:10.1007/978-3-540-45146-4_36.</li>
<li>Open Interface Engineering (2026). Thermodynamic Bounds and an Optimal Tempo; Metered Commit Gates; Deterministic Null; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Penington, G. (2020). Entanglement wedge reconstruction and the information paradox. <em>Journal of High Energy Physics</em>, 2020(9), 002 (preprint 2019).</li>
<li>Sender, R., Fuchs, S., &amp; Milo, R. (2016). Revised estimates for the number of human and bacteria cells in the body. <em>PLOS Biology</em>, 14(8), e1002533; and Shatilovich, A., Gade, V. R., Pippel, M., et al. (2023). A novel nematode species from the Siberian permafrost shares adaptive mechanisms for cryptobiotic survival with C. elegans dauer larva. <em>PLOS Genetics</em>, 19(7), e1010798.</li>
<li>Tanuwijaya, R., et al. (2025). Complex discrete Fourier transform on a metalens array. <code>arXiv:2502.08770</code>; and Yang, Y., et al. (2025). Photonic joint-transform correlator for high-efficiency convolution. <code>arXiv:2504.01117</code>.</li>
<li>Woith, H., Petersen, G. M., Hainzl, S., &amp; Dahm, T. (2018). Review: Can animals predict earthquakes? <em>Bulletin of the Seismological Society of America</em>, 108(3A), 1031–1045.</li>
<li>Zheng, J., &amp; Meister, M. (2025). The unbearable slowness of being: Why do we live at 10 bits/s? <em>Neuron</em>, 113(2), 192–204.</li>
</ol>
