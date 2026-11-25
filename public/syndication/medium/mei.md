# Minimum Energy Intelligence (MEI): 8-Year Coin-Cell Budget Math, -20 °C Brownout Simulation, and All Five Event Counts

*Product/CAD simulation audit (est_j, 0 physical tags cycled): shows exact 8-yr 10 uW = 2.52 kJ vs CR2032 ~2.38 kJ cold-derated capacity math and reconciles 10,000 wakeups, 500 beacons, 490 refusals, 40/40 cold alerts, and 2,680 JCR-1 receipts.*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/mei/](https://blog.openie.dev/posts/mei/)  
> **Primary Research Paper**: [https://research.openie.dev/products/mei/](https://research.openie.dev/products/mei/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/openie-artifact-substrate](https://github.com/openIE-dev/openie-artifact-substrate)  
> **Canonical Artifact ID**: `blake3:tv:33f41b6dafca0a637986a28756e35c305743509289ac7774cfb84fcbc91804cb` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `est_j`

---

![Minimum Energy Intelligence — 8-year 2.52 kJ vs CR2032 cold derating math and 40/40 -20 C simulated alert survival](https://research.openie.dev/media/tv/posters/mei-poster.jpg)
*Datasheet/CAD cold-chain simulation (`est_j`): explicit `2.52 kJ` 8-year budget vs. `CR2032` derating and reconciled `10,000 / 500 / 490 / 40 / 2,680` event counts. Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[M/S · Explicit 8-Year Coin-Cell Arithmetic (`est_j`)]** `10 uW × 8 yr × 3.15576 × 10^7 s/yr = 2,524.6 J ≈ 2.52 kJ` (the primary review’s `9.9 uW` STM32U3 + duty-cycled BME690 schedule spends `312 J/yr = 2,499 J` over `8 yr`). **Candid battery gap:** a standard `3.0 V, 220 mAh` `CR2032` holds **`~2,376 J` nominal** (`2,430 J` at `225 mAh` in `cad-sim`, `2,538 J` at `235 mAh` `+21 °C` datasheet) *before* `~1%/yr` self-discharge and cold impedance derating (`2,193 J` usable to `2.0 V` at `+25 °C`, `2,059 J` at `+4 °C`, and **`0 J` unbuffered under `12 mA` BLE TX pulses at `-20 °C`** where internal resistance `R_int` jumps `6x` from `12.0 ohm` to `71.78 ohm`, sagging terminal voltage to `1.951 V < 2.00 V` brownout). True 8-year service therefore requires **either `< 5 uW` duty-cycled sleep (`5.1 uW` with `nRF54L15 = ~1.29 kJ` over `8 yr`) or a larger `CR2477` / `Li-SOCl2` primary cell** plus a pulse buffer capacitor.
2. **[M/E · All Five Event Counts Reconciled (`10,000`, `500`, `490`, `40`, `2,680`)]** Each simulated ambient trace (`+25 °C`, `+4 °C`, `-20 °C`) steps **`10,000` scheduled sensor wakeups** containing **`500` routine BLE beacon attempts** and **`40` safety-critical temperature-excursion alert attempts** (`540` radio attempts/trace). At `-20 °C`, two-phase `hold`/`settle` grant sharding (`35 mJ` safety reserve) **refuses `490` of `500` routine beacons** (`10` allowed) so **`40 / 40` (`100%`) safety alerts succeed** (vs. brownout collapse on an unsharded baseline). Because each allowed TX writes **`2` `JCR-1` receipts** (`hold` + `settle`) and each refusal writes **`1` receipt**, the three traces emit `1,080` (`+25 °C`: `540 × 2`) + `1,010` (`+4 °C`: `470 × 2 + 70`) + `590` (`-20 °C`: `50 × 2 + 490`) = **`2,680` Ed25519-signed `det-CBOR` `JCR-1` receipts**.
3. **[M · Simulation Scope Disclosure]** Every tag and campus-fleet number in `mei` comes from component datasheets (`STM32U3`, `nRF54L15`, `BME690`, Energizer `CR2032`) and discrete Python/Rust simulation (`est_j`, `board_metered = false`); no physical tag has undergone environmental chamber testing.

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: Analytical/simulated (`est_j`, `board_metered = false`, `measured_j = null`). Component parameters drawn from published STM32U385, Nordic nRF54L15, Bosch BME690, and Energizer CR2032 temperature-impedance datasheets.
- **Workload & Suite**: Three `10,000`-wakeup cold-chain excursion simulations (`+25 °C`, `+4 °C`, `-20 °C`), each scheduling `500` routine BLE status beacons + `40` critical excursion alerts (`1,620` total TX attempts, `2,680` `JCR-1` receipts).
- **Baselines Compared**: Unsharded greedy FIFO battery consumption (which exhausts pulse headroom on routine beacons and drops `-20 °C` safety alerts via `V_term < 2.00 V` brownout) vs. two-phase `hold`/`settle` safety-reserve grant sharding (`35 mJ` reserve + `100 uF–470 uF` pulse buffer model).
- **Runs (`N`) & Uncertainty / Spread**: Deterministic `1`-scenario-per-temperature trace (`N = 3` temperatures × `10,000` wakeups; Spread: Monte Carlo cell-to-cell `R_int` manufacturing variance not modeled in single-curve datasheet simulation).
- **Cold vs. Warm Caching Scope**: Not a caching workload; models electro-thermal battery internal-resistance (`R_int`) transitions from warm `+25 °C` (`12.0 ohm`) to cold `-20 °C` (`71.78 ohm`).
- **Artifact & License Status**: Architecture review and simulation tables public (`CC0-1.0`) at `research.openie.dev/products/mei/`; `det-CBOR`/Ed25519 primitives in `openIE-dev/openie-artifact-substrate` (`Apache-2.0`); CAD/simulation repo partially internal.

## 8-Year Coin-Cell Energy Arithmetic & Cold-Chain Derating

Critique #6 flagged that `10 uW` continuous power over `8 years` exceeds a real `CR2032` once derating is included. Showing the full ledger from `src/content/products/mei.md` confirms that critique `[M, S]`:

- **Demand side:** `10.0 uW × 8 × 365.25 × 86,400 s = 2,524.6 J` (`2.52 kJ`; at `9.9 uW` = `2,499 J`, plus BLE TX bursts) `[M]`.

- **Supply side (`CR2032`, `3.0 V` nominal):** `220 mAh` = `792 C` ≈ **`2,376 J`** (`225 mAh` = `2,430 J`; `235 mAh` Energizer datasheet = `2,538 J` at `+21 °C` low-drain). After `~1%/yr` shelf self-discharge (`~8%` over 8 yr) and `2.0 V` cutoff impedance losses, usable energy drops to **`2,193 J` at `+25 °C`** and **`2,059 J` at `+4 °C`**; at **`-20 °C` without a parallel pulse capacitor**, `R_int = 71.78 ohm` causes immediate `12 mA` TX brownout (`1.951 V < 2.00 V`, `0 J` unbuffered radio capacity) `[M, S]`.

- **Engineering consequence:** Achieving an 8-year sealed cold-chain rating requires **either** lowering quiescent draw to `~5.1 uW` (`~1.29 kJ` over 8 yr, e.g., `nRF54L15` + sparser gas-sensor duty cycling) **or** stepping up to a **`CR2477` (`1,000 mAh ≈ 10.8 kJ`) / `Li-SOCl2` primary cell** paired with a low-leakage pulse buffer capacitor `[M, S]`.

## Reconciling All Five Simulation Event Counts (`10,000 / 500 / 490 / 40 / 2,680`)

The five integers in earlier summaries come from one accounting identity across the three simulated temperature traces (`+25 °C`, `+4 °C`, `-20 °C`) `[E, M]`:

- **`10,000`:** Total scheduled sensor-check wakeups per temperature trace.

- **`500` and `40`:** Scheduled routine BLE status beacons (`500`) and critical cold-chain excursion alerts (`40`) inside each `10,000`-wakeup trace (`540` total TX requests/trace).

- **`490` refused / `40` preserved (`-20 °C`):** Under `-20 °C` impedance derating, the routine shard exhausts after `10` beacons and **refuses `490` routine beacons** (`1` refusal receipt each), protecting the `35 mJ` emergency reserve so all **`40 / 40` critical excursion alerts** transmit cleanly (`50` total allowed sends × `2` receipts + `490` refusals × `1` receipt = `590` receipts at `-20 °C`).

- **`2,680` total `JCR-1` receipts:** Summing `+25 °C` (`540` allowed × `2` = `1,080`), `+4 °C` (`470` allowed × `2` + `70` refused = `1,010`), and `-20 °C` (`50` allowed × `2` + `490` refused = `590`) equals **`2,680` deterministic CBOR (`det-CBOR`) Ed25519-verified receipts** `[E]`.

## Limitations & Chamber Validation Requirements

- **Zero physical hardware measurements (`est_j` only):** Passivation-layer growth on lithium anodes, MLCC DC-bias/low-temperature capacitance loss (`X7R`/`X5R` at `-20 °C`), crystal startup drift, and flash write wear must be measured in environmental chamber hardware (`LA-F` / `MEI-F` bench protocol) before any production lifetime claim is made `[M]`.

## Energy & Telemetry Scope

Strictly `est_j` (`board_metered = false`, `measured_j = null`, `reported_j = null`), modeled from vendor datasheet curves.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` ⊥ `reported_j` ⊥ `est_j` ⊥ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Datasheet & CAD Simulation (est_j)
- **Telemetry Disclosure**: Analytical datasheet + cold-impedance discrete simulation (est_j); zero physical coin-cell tags fabricated or chamber-tested.
- **Evidence Class**: `est_j` (`board_metered = false`)
- **Catalog Anchor Reading**: `0.035 J (est_j)`
- **Sensor / Formula Scope**: Datasheet-calibrated electro-thermal simulation (est_j: 2.52 kJ 8-yr @ 10 uW vs CR2032 derating; 35 mJ safety reserve; 0 physical tags built)

## Related Work & Primary Literature (`[S]`)

- **Hester & Sorber (Flicker / Ekho, SenSys 2017) & Colin et al. (Capuchin / Chain, OOPSLA 2016):** Intermittent energy-harvesting/buffered MCU task atomicity and capacitor sizing `[S]`.
- **Zeng et al. (ECOSystem, ASPLOS 2002) & Roy et al. (Cinder, EuroSys 2011):** Reserve-and-tap energy-budget allocation adapted here as two-phase `hold`/`settle` radio sharding `[S]`.
- **Energizer CR2032 / CR2477 Technical Bulletins, STMicroelectronics STM32U3 & Nordic nRF54L15 Datasheets:** Primary electrochemical pulse-impedance and sleep-current specifications `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/mei/](https://blog.openie.dev/posts/mei/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/products/mei/](https://research.openie.dev/products/mei/) ([PDF](https://research.openie.dev/pdfs/mei.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/openie-artifact-substrate](https://github.com/openIE-dev/openie-artifact-substrate)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/mei-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/mei-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=mei)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
