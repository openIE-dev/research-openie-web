# The Search for JouleOS

*310 Passing Rust Tests · 78,400 Provenance Checks — Today's operating systems schedule clock slices, not energy—so we mapped what an agent machine must require and tested its core rules in Rust.*

> **Public Domain (`CC0-1.0`) · OpenIE Research Essay**  
> **Canonical Primary Source**: [https://research.openie.dev/products/jouleos/](https://research.openie.dev/products/jouleos/)  
> **Canonical Artifact ID**: `blake3:tv:7dc57a2972460389e4fabd076f069c237545d6154f816d489335f8b3eed65e07` · **Gate Invariant**: `human_in_gate = false`

---

## Three Plain-Language Takeaways (Zero Acronym Soup)

1. Modern computers stack many separate software layers, and today's AI agents are bolted on top without changing the floor underneath.
2. None of those underlying layers asks, before an agent acts, how much energy the action will spend or whether it fits.
3. A machine built for agents must meter energy honestly, grant strict budgets, and refuse any action that breaks its limit.

![The Search for JouleOS — OpenIE Research TV Studio Poster](https://research.openie.dev/media/tv/posters/jouleos-poster.jpg)
*Studio key visual for **The Search for JouleOS** (`Hardware, Silicon & OS` · 310 Passing Rust Tests · 78,400 Provenance Checks). Dedicated to the public domain under `CC0-1.0`.*

## Everyday Analogy & Why It Matters

Wrapping a new policy sandbox around a fifty-year-old kernel is like putting a turnstile in front of an unmetered power plant. Counting milliseconds or instructions treats idle waiting and a full GPU burst as identical. The Search for Joule Operating System sets ten checkable architectural rules and verifies a three-hundred-ten-test Rust reference spine that reserves budgets before actions run.

Modern agent sandboxes jail file access or count virtual instructions, yet elevated commands still escape onto the host kernel, and one virtual instruction spends wildly different physical energy depending on memory traffic, cache misses, and chip frequency. Our review maps ten distinct jobs from bare silicon up to the human screen. It specifies a schedule that tries cheap deterministic checks before language models, signed energy grants that only shrink when delegated to sub-tasks, and tool outputs treated strictly as passive untrusted data.

Our reference Rust spine passes all three hundred ten conformance tests for crash-safe two-phase energy holds and signed binary receipts, while proving exhaustively across seventy-eight thousand four hundred pairs that software estimates can never masquerade as physical hardware measurements. By separating verified software checks from unverified bare-metal kernel claims, this design guide gives systems engineers a concrete, checkable blueprint for building agent machines governed by energy law.

## Inside the Mechanism & Candid Limits

New agent-safety platforms add sandboxes, external watchdogs, and policy wrappers on top of Linux, macOS, or Windows kernels. That engineering solves real file and network containment problems, yet it treats the underlying process model as permanently fixed—where an agent remains an ordinary guest program and no kernel gates commits on certified energy bounds. Before naming any commercial product, our study teaches the ten-step stack from bare silicon, chip, board, and firmware through instruction sets, hardware abstraction, kernels, compilers, and programs right up to the human interface. Even formally verified microkernels prove functional C code correctness while saying nothing at all about joules or power limits.

Closing that architectural gap requires four linked open contracts: an energy-oriented schedule ordered cheapest operator first rather than billed in tokens, narrowing capability-and-joule grants checked outside the AI model, transactional commits bounded by preconditions, postconditions, invariants, and joule ceilings, and an eight-step isolation ladder carrying honest hardware or estimator meter tags. Even built-in processor energy counters on modern chips are partly mathematical models rather than inline wire shunts, missing operand-level variations. Our monotone lattice algebra tests all seventy-eight thousand four hundred pairs of sensor boundaries and attribution rules so combining a hardware shunt with an estimate always preserves the weaker label. In our three-dimensional stack view, authorization runs strictly outside the language model, and every tool response arrives tagged as untrusted passive data rather than executable instructions so poisoned prompts cannot hijack control.

Before any actuation begins, the runtime reserves a crash-safe energy hold and settles a hash-chained cryptographic receipt afterward. Across seven Rust workspace crates, three hundred ten automated conformance tests verify deterministic binary encoding without floating-point ambiguity, reject revoked, duplicate, or over-budget calls, replay exact ledger balances after simulated power loss, and automatically drop net energy splits whenever host idle power drifts past five percent. This white paper is written as an honest architectural review and requirement guide, never an inflated product pitch. Ratios cited from the private Joule Operating System repository—such as hundred-thousand-fold corpus efficiency claims—are explicitly flagged as unverified project claims rather than measurements, and bare-metal external power metering remains unset.

### Epistemic Evidence Tags (`[T]` / `[E]` / `[M]` / `[S]`)

- **`[T]` Theorem / Machine-Checked Formal Proof**
- **`[E]` Empirical / Hardware-Instrumented Experiment**
- **`[S]` Survey / Historical Price or Accounting Audit**

## How Energy Was Metered

Open Interface Engineering enforces strict epistemic non-mixing across physical power rails, processor counters, and mathematical bounds (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition is forbidden by `ScientificGate`):

- **Acquisition Tier**: Verified Software + Model
- **Plain-Language Disclosure**: Verified software tests and analytical models; no bare-metal power meter used.
- **Substrate Evidence Class**: `unmetered` (`board_metered = false`)
- **Primary Reading**: `unmetered (joules = null; never fabricated as zero)`
- **Meter or Formula**: Operating-system energy-grant architecture & 310-test Rust spine review; unmetered
- **300 K Landauer Bit-Equivalents**: `null` (unmetered study — analytical/archival scope)

## Continue the Discussion & Verify Every Byte

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Watch in 15 Seconds or 3 Minutes**: Stream the native `9:16` Vertical Snackable ([`jouleos-tiktok.mp4`](https://research.openie.dev/media/tv/tiktok/jouleos-tiktok.mp4)) or explore all four captioned studio cuts (`15s`, `45s`, `90s`, and `3m` 3D cutaway documentary) on **[OpenIE Research TV](https://research.openie.dev/tv/?study=jouleos)**.
- **Join the Synchronized X (Twitter) Thread**: Reply, critique, or inspect the 5-post verification thread on **[X (Twitter)](https://x.com/search?q=%22The%20Search%20for%20JouleOS%22%20OR%20research.openie.dev%2Ftv%2F%3Fstudy%3Djouleos&src=typed_query)**.
- **Query Grounded Prior Art & Signed WAI1 Receipts**: Explore linked lineage trails on **[The Commons (`scholar.askdavidc.ai`)](https://scholar.askdavidc.ai)**, read the full primary paper & PDF at **[`research.openie.dev/products/jouleos/`](https://research.openie.dev/products/jouleos/)**, and verify the Ed25519-signed `WAI1` binary container (`blake3:59b204ffc7e76323…`) in **[`openie-artifact-substrate`](https://github.com/openIE-dev/openie-artifact-substrate/blob/main/catalog/envelopes/tv-jouleos.wai)**.

---

*Summary & essay text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Code, verification gates, and `WAI1` schemas licensed under `Apache-2.0`.*
