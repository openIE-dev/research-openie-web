# Time as an Index: Formal Complexity Horizons, Precomputation Bounds, and SHA-256 Spectral Controls

*Formal Lean 4 proofs over oracle/CTC models (31 theorems), Hellman time-memory tradeoffs, and 65,536-digest SHA-256 spectral null tests (unmetered formal/simulation study).*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/time-as-an-index/](https://blog.openie.dev/posts/time-as-an-index/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/time-as-an-index/](https://research.openie.dev/papers/time-as-an-index/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments)  
> **Canonical Artifact ID**: `blake3:tv:8c0f52b355033650a2de30ded99d38f44343f6ae6b1f00c5244304f6651c6b26` · **Evidence Tags**: `[T]` · `[E]` · `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![Time as an Index — 31 Lean 4.36.0 theorems and N = 65,536 SHA-256 spectral null checks (unmetered)](https://research.openie.dev/media/tv/posters/time-as-an-index-poster.jpg)
*Formal complexity horizons, Hellman precomputation tradeoffs, and SHA-256 spectral null tests (joules = null, unmetered). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[T · Lean 4.36.0, 6/6 kernels]** `Horizon.lean` and `Paradox.lean` machine-check **31 primary theorems** (`50` theorem/lemma declarations, `58,796` kernel declarations verified by `con-leche` and `con-ron` inside Linux `bubblewrap` with `0 sorry`, `0 opaque`, and `0 ofReduceBool`) formalizing causal-cone exclusivity, fixed-point consistency, and salt-invalidated precomputation over abstract discrete models.
2. **[E/M · Deterministic Simulation, unmetered]** Across `N = 65,536` `SHA-256` digests (`32,768` FFT spectral bins in experiment `F5` and `M1–M8`), **0 spectral bins** crossed the Bonferroni-corrected significance threshold `p = 10^-6`, matching an unindexed white-noise null.
3. **[S · Literature Synthesis]** Known closed-timelike-curve complexity classes (`D-CTC = PSPACE`, `P-CTC = PP`, Aaronson & Watrous 2009) collapse computationally bounded ciphers inside hypothetical fixed-point loops while leaving information-theoretic one-time pads intact; outside such loops, every real O(1) lookup is amortized Hellman precomputation (`T * M^2 = N^2`).

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Unmetered (`joules = null`, `board_metered = false`). Lean `4.36.0` `lake check --paranoid` executed inside Linux `bubblewrap` (`bwrap`); deterministic Python/Rust spectral scripts without hardware power probes.
- **Workload & Suite**: `31` formal theorems (`50` total Lean declarations), `M1–M8` discrete horizon/tradeoff simulations, `F5` `SHA-256` FFT spectral scan (`N = 65,536` digests), and a `195`-entry anomaly/paradox literature catalog (`TA001–TA081`, `AA01–AA40`, `P01–P74`).
- **Baselines Compared**: Uniform pseudorandom white-noise null (`Bonferroni alpha = 10^-6` across `32,768` bins) for `F5`; unsalted vs. salted Hellman rainbow-table amortization curves for `M1–M8`.
- **Runs (`N`) & Uncertainty / Spread**: Deterministic seeded `SHA-256` counter sweep (`N = 65,536` digests; exact reproducible max spectral peak within Gaussian/exponential null envelope; single seeded sweep, multi-seed variance not needed for deterministic hash check but limits sample horizon to `2^16`).
- **Cold vs. Warm Caching Scope**: Explicitly models offline precomputation ("warm rainbow table") vs. salted per-instance cold evaluation: adding an `s`-bit fresh salt multiplies precomputation table work by `2^s`, forcing cold online work.
- **Artifact & License Status**: Primary paper and `195`-entry catalog (`CC0-1.0`); proof check logs and scripts self-checked by OpenIE (`Apache-2.0` subset; not externally peer-reviewed).

## Problem, Scope & Framing Qualifiers

This study asks a foundational boundary question: what separates sequential computation from spatial array indexing? Rather than claiming exotic physical effects, the paper proves and catalogs why "looking up tomorrow" is impossible in standard quantum and classical physics `[S, T]`. All CTC results (`PSPACE` / `PP` collapse of hardness assumptions) apply strictly to hypothetical Deutschian mathematical fixed-point models, not to realizable laboratory hardware `[S, T]`.

## Mechanism, Formal Proofs & Spectral Results

Three results anchor the paper:

- **Machine-checked horizon & salt theorems `[T]`:** Across `Horizon.lean` and `Paradox.lean` (`31` theorems verified across all `6/6` independent Lean checkers with `0 sorry`), any state-indexed lookup table over an deterministic transition must pay at least linear offline state-visitation work prior to query arrival, and prepending a fresh unpredictable salt renders pre-built index tables statistically independent of the target.

- **Hellman precomputation tradeoff `[S, M]`:** Hellman (1980) and Oechslin (2003) show that unsalted inversions trade online time `T` against precomputed memory `M` along `T * M^2 = N^2` `[S]`. Simulated curves (`M1–M8`) illustrate how Bitcoin block-header chaining and TLS/Argon2 nonces reset the precomputation horizon to zero before each challenge exists `[M]`.

- **Finite-sample `SHA-256` spectral control `[E]`:** Applying a `65,536`-point discrete Fourier analysis across sequential `SHA-256` outputs yields `0 / 32,768` frequency bins below `p = 10^-6` `[E]`.

## Limitations, Negative Results & Falsifiers

- **Finite spectral power:** Testing `N = 65,536` (`2^16`) `SHA-256` digests rules out gross linear periodicities at that sample size; it is **not** a cryptanalytic security proof against algebraic or differential attacks `[M]`.

- **Abstract axiom boundary:** Lean theorems verify discrete mathematical definitions of causal cones, fixed points, and finite maps; physical no-signalling and Gabor `Delta t * Delta f >= 1/(4 pi)` bounds rest on established physics literature `[S]`, not proof-assistant axioms.

- **Catalog scope:** The `195` cataloged timing/frequency anomalies (`TA001–TA081`, `AA01–AA40`, `P01–P74`) synthesize published metrology glitches (e.g., OPERA loose fiber connector), oscillator tolerances, and logical paradoxes from secondary and primary literature `[S]`.

## Energy & Telemetry Scope

No hardware power meter or OS energy counter was used to support any claim in this study (`energyClass = unmetered`, `joules = null`, `board_metered = false`). Thermodynamic discussions inside the manuscript refer analytically to classical literature bounds rather than measured silicon energy.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered Formal & Spectral Study
- **Telemetry Disclosure**: Lean 4.36.0 proofs and seeded 65,536-digest SHA-256 spectral checks only; joules = null.
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered formal complexity proofs and deterministic SHA-256 spectral simulation (joules = null)

## Related Work & Primary Literature (`[S]`)

- **Deutsch (1991) & Aaronson & Watrous (Proc. R. Soc. A, 2009):** Quantum mechanics near closed timelike curves and the exact equivalence `CTC_BQP = CTC_P = PSPACE` `[S]`.
- **Hellman (IEEE Trans. Inf. Theory, 1980) & Oechslin (CRYPTO 2003):** Cryptanalytic time-memory tradeoffs (`T * M^2 = N^2`) and rainbow tables `[S]`.
- **Bennett, Brassard, Crépeau & Maurer (1995) & Shannon (1949):** Information-theoretic secrecy of one-time pads and privacy amplification `[S]`.
- **Gabor (J. IEE, 1946) & Peres (1995):** Time-frequency uncertainty limit on finite-window spectral estimation and quantum no-signalling theorems `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/time-as-an-index/](https://blog.openie.dev/posts/time-as-an-index/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/time-as-an-index/](https://research.openie.dev/papers/time-as-an-index/) ([PDF](https://research.openie.dev/pdfs/time-as-an-index.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/time-as-an-index-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/time-as-an-index-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=time-as-an-index)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
