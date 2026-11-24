# Metered Commit Gates: Energy-to-Correct-Completion for Agentic Systems

*11,428 Picojoules per Hardware Gate Check — Why computers must check before taking undoable actions, start with the cheapest tool, and log every joule.*

> **Public Domain (`CC0-1.0`) · OpenIE Research Essay**  
> **Canonical Primary Source**: [https://research.openie.dev/papers/gates/](https://research.openie.dev/papers/gates/)  
> **Canonical Artifact ID**: `blake3:tv:b6075421aa4a225d509d07481bc5a850f9e1dc14424cd92bd9abe3ebe93260a3` · **Gate Invariant**: `human_in_gate = false`

---

## Three Plain-Language Takeaways (Zero Acronym Soup)

1. A computer should not take an irreversible action until an independent check confirms it is safe.
2. It should try the cheapest method first and wake a large AI model only when simpler tools miss.
3. Every decision is written to a receipt with the energy it used, so anyone can audit it later.

![Metered Commit Gates: Energy-to-Correct-Completion for Agentic Systems — OpenIE Research TV Studio Poster](https://research.openie.dev/media/tv/posters/gates-poster.jpg)
*Studio key visual for **Metered Commit Gates** (`Foundations & Thermodynamics` · 11,428 Picojoules per Hardware Gate Check). Dedicated to the public domain under `CC0-1.0`.*

## Everyday Analogy & Why It Matters

When software moves money, edits records, or steers machinery, saying sorry after a bad guess cannot undo the damage. A commit gate acts like a physical cockpit lock that blocks unsafe switches before anything moves. Measured by an onboard circuit-board power sensor, checking safety rules costs about eleven thousand picojoules per cycle while leaving a permanent, auditable receipt for every single decision.

Think of how a hospital pharmacy or airplane cockpit separates suggesting an action from executing it. An AI model can propose whatever clever step it likes, while an independent deterministic gate holds the sole key to external tools. Instead of waking a massive neural network on routine tasks, our cascade tries table lookup first, then simple formulas, then exact solvers, and finally a model, stopping the instant a check passes or refusing cleanly when remaining budget runs low.

Across more than two hundred nine thousand simulated control checks, the discrete safety gate allowed zero unsafe actions. On real programmable hardware with an inline circuit-board power sensor, one whole-module gate cycle measured eleven thousand four hundred twenty-eight picojoules. Model-generated suggestions are never silently relabeled as guaranteed rules, and every allowed or refused step writes its exact reason and labeled energy source to a permanent receipt for later inspection.

## Inside the Mechanism & Candid Limits

Chatbots can recover from a clumsy sentence by writing another polite paragraph, yet autonomous software tools cross real-world boundaries that cannot be rolled back once executed. Even cheap per-word AI becomes wasteful and dangerous when ten unverified guesses corrupt records, trigger expensive rollbacks, and force human cleanup afterward. Imagine a hospital pharmacy where routine refills follow an exact printed checklist, unusual prescriptions escalate to a specialist, and a physical barcode lock refuses to open the drawer if dosage or allergy limits fail. Neither raw speed nor model cleverness ever gets an informal side channel around that gate.

Every irreversible action passes through four strict runtime records in our Rust reference implementation. First comes an untrusted proposal that cannot authorize itself. Second comes a joint certificate requiring table permission, energy budget headroom, and optional safety barriers. Third comes commit or typed refusal, and fourth comes a timestamped receipt.

By classic sequential search theory, trying gears in decreasing order of pass probability divided by energy cost minimizes expected spend across every workload. Measuring total energy to correct completion penalizes every failed retry and refusal, showing clearly why spending picojoules on early deterministic checks saves whole joules of wasted model runs. This three-dimensional hardware cutaway shows eight parallel safety gates checking rule tables, energy budgets, and safety barriers together at twenty-five megahertz on reconfigurable silicon, while an onboard circuit-board current sensor measures real module supply power across interleaved start-and-stop runs and matches software decisions step for step. Across two hundred nine thousand two hundred sixty-one fixed-point control checks, the discrete gate recorded zero unsafe approvals and only seventy-nine cautious refusals, while blocking unsafe external tool calls before execution.

Interleaved hardware board-sensor measurements recorded eleven thousand four hundred twenty-eight picojoules per gate cycle across four passes. Every energy figure states plainly how it was obtained and what remains unmeasured. Our eleven-thousand-picojoule hardware reading spans the whole vision module supply rather than an isolated core rail, a tiny ninety-eight-picojoule seed test stayed inconclusive near sensor resolution, and software operation counts stay clearly labeled as analytical estimates.

### Epistemic Evidence Tags (`[T]` / `[E]` / `[M]` / `[S]`)

- **`[T]` Theorem / Machine-Checked Formal Proof**
- **`[E]` Empirical / Hardware-Instrumented Experiment**

## How Energy Was Metered

Open Interface Engineering enforces strict epistemic non-mixing across physical power rails, processor counters, and mathematical bounds (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition is forbidden by `ScientificGate`):

- **Acquisition Tier**: Board Power Sensor
- **Plain-Language Disclosure**: Direct circuit-board power sensor on vision module; software runs stay estimates.
- **Substrate Evidence Class**: `measured_j` (`board_metered = true`)
- **Primary Reading**: `11.43 nJ (measured_j)`
- **Meter or Formula**: AMD Kria KV260 whole-module physical board power shunt (11,428 pJ per hardware commit gate check)
- **300 K Landauer Bit-Equivalents**: `3.9805e+12` bits (`E / (k_B · 300 K · ln 2)`)

## Continue the Discussion & Verify Every Byte

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Watch in 15 Seconds or 3 Minutes**: Stream the native `9:16` Vertical Snackable ([`gates-tiktok.mp4`](https://research.openie.dev/media/tv/tiktok/gates-tiktok.mp4)) or explore all four captioned studio cuts (`15s`, `45s`, `90s`, and `3m` 3D cutaway documentary) on **[OpenIE Research TV](https://research.openie.dev/tv/?study=gates)**.
- **Join the Synchronized X (Twitter) Thread**: Reply, critique, or inspect the 5-post verification thread on **[X (Twitter)](https://x.com/search?q=%22Metered%20Commit%20Gates%22%20OR%20research.openie.dev%2Ftv%2F%3Fstudy%3Dgates&src=typed_query)**.
- **Query Grounded Prior Art & Signed WAI1 Receipts**: Explore linked lineage trails on **[The Commons (`scholar.askdavidc.ai`)](https://scholar.askdavidc.ai)**, read the full primary paper & PDF at **[`research.openie.dev/papers/gates/`](https://research.openie.dev/papers/gates/)**, and verify the Ed25519-signed `WAI1` binary container (`blake3:8b0257faf37972a9…`) in **[`openie-artifact-substrate`](https://github.com/openIE-dev/openie-artifact-substrate/blob/main/catalog/envelopes/tv-gates.wai)**.

---

*Summary & essay text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Code, verification gates, and `WAI1` schemas licensed under `Apache-2.0`.*
