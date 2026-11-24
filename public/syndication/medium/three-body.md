# The Pursuit of AGI Resolves the Three-Body Problem in Computing

*Checked Handoffs Stop Bug Cascades Cold — Big software disasters hide in unwritten guesses between theorists, builders, and users—machine-checked handoffs lock the stack.*

> **Public Domain (`CC0-1.0`) · OpenIE Research Essay**  
> **Canonical Primary Source**: [https://research.openie.dev/papers/three-body/](https://research.openie.dev/papers/three-body/)  
> **Canonical Artifact ID**: `blake3:tv:16e4e4b439081a0ed33c49753fe852f5ef4a4ac5f32d4bdf70826f08da0e7738` · **Gate Invariant**: `human_in_gate = false`

---

## Three Plain-Language Takeaways (Zero Acronym Soup)

1. Most major computer failures start at the handoffs between teams or system layers, not inside individual parts.
2. The culprit is usually an unwritten guess crossing a boundary, such as which physical units a number uses.
3. When every boundary guess is written down and machine-checked, fixing one problem stays fixed without breaking upper layers.

![The Pursuit of AGI Resolves the Three-Body Problem in Computing — OpenIE Research TV Studio Poster](https://research.openie.dev/media/tv/posters/three-body-poster.jpg)
*Studio key visual for **The Three-Body Problem in Computing** (`Foundations & Thermodynamics` · Checked Handoffs Stop Bug Cascades Cold). Dedicated to the public domain under `CC0-1.0`.*

## Everyday Analogy & Why It Matters

Space engineers lost the Mars Climate Orbiter because one team sent thruster data in pounds while another read metric newtons. Like three orbiting stars, theorists, builders, and users drift chaotically whenever handoffs go unchecked. Because autonomous AI agents cannot rely on unspoken office folklore, making software safe for AI forces every boundary assumption into a machine-checked contract.

The Ariane 5 rocket broke apart forty seconds into its maiden flight because inertial guidance code reused from slower Ariane 4 overflowed a sixteen-bit velocity number. Earlier, Mars Climate Orbiter burned up over pound-versus-newton thruster units—both unwritten guesses crossing a team handoff. Computing couples three distinct roles: theorists who state mathematical models, makers who build chips and compilers, and users who run real workloads.

Just as Lagrange points stabilize three orbiting bodies by locking their relative frame, explicit machine-checked contracts prevent boundary drift across all three. Independent Csmith fuzzing uncovered hundreds of wrong-code bugs in every C compiler tested except CompCert's machine-checked middle passes, while the verified seL4 operating-system kernel and formal cloud blueprints eliminated whole bug classes inside their stated contracts. Pursuing artificial general intelligence across every layer of the software stack leaves zero room for hallway folklore—turning chaotic whack-a-mole debugging into steady, lasting repairs.

## Inside the Mechanism & Candid Limits

Every software team knows the frustration: every unit test passes in isolation, the mathematical theorem holds, the processor meets its datasheet, yet the combined system crashes in production—and fixing one bug quietly breaks two downstream callers that depended on undocumented edge behavior. In physics, two bodies orbit in clean closed form, yet adding a third led Henri Poincaré to discover deterministic chaos where tiny mismatches grow exponentially. Still, Joseph-Louis Lagrange proved three bodies stay stable at co-rotating triangle points where spacecraft now park—because stability lives in balanced relations between the bodies. Computing has its own three coherent bodies: theorists who write specifications, makers who build hardware, compilers, and libraries, and users who run real workloads and uncover unspoken needs.

Mars Climate Orbiter was lost to pound-versus-newton unit drift, and Ariane 5 broke up over an unstated velocity envelope reused from slower Ariane 4. Decades of systems research—from Melvin Conway's org-chart mirroring and David Parnas's module boundaries to Tony Hoare's contracts, end-to-end checks, and Nancy Leveson's interaction safety—converge on one clear proposition: a local repair stays fixed at its own level and everywhere above it if and only if every assumption crossing a handoff is stated and machine-checked. Our three-dimensional gyroscopic model renders specification, implementation, and operation as three coupled rings. When handoff bands stay dashed and unwritten, tiny mismatches cascade across levels; when physical units, numeric ranges, interface versions, and state transitions pass explicit machine gates at the center, all three rings hold lockstep.

Empirical landmarks confirm both sides of the boundary. John Regehr and Xuejun Yang's Csmith fuzzer found hundreds of silent wrong-code bugs across mainstream C compilers, yet zero inside CompCert's machine-checked middle passes. Likewise, the verified seL4 microkernel and formal cloud state blueprints eliminate whole defect classes inside their checked seams. Even CompCert exhibited bugs inside its unverified C front-end parser, proving verification protects only what lies inside the stated contract.

Orbital gravity serves strictly as structural analogy rather than physical force, no energy meter is claimed here, and pursuing general AI across the entire stack is what finally forces every handoff contract into machine-checked form.

### Epistemic Evidence Tags (`[T]` / `[E]` / `[M]` / `[S]`)

- **`[T]` Theorem / Machine-Checked Formal Proof**
- **`[S]` Survey / Historical Price or Accounting Audit**

## How Energy Was Metered

Open Interface Engineering enforces strict epistemic non-mixing across physical power rails, processor counters, and mathematical bounds (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition is forbidden by `ScientificGate`):

- **Acquisition Tier**: Theory + Case Audit
- **Plain-Language Disclosure**: Structural interface proof and historical failure audit; no power meter claimed.
- **Substrate Evidence Class**: `unmetered` (`board_metered = false`)
- **Primary Reading**: `unmetered (joules = null; never fabricated as zero)`
- **Meter or Formula**: Architectural interface-assumption & verified-systems synthesis; unmetered
- **300 K Landauer Bit-Equivalents**: `null` (unmetered study — analytical/archival scope)

## Continue the Discussion & Verify Every Byte

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Watch in 15 Seconds or 3 Minutes**: Stream the native `9:16` Vertical Snackable ([`three-body-tiktok.mp4`](https://research.openie.dev/media/tv/tiktok/three-body-tiktok.mp4)) or explore all four captioned studio cuts (`15s`, `45s`, `90s`, and `3m` 3D cutaway documentary) on **[OpenIE Research TV](https://research.openie.dev/tv/?study=three-body)**.
- **Join the Synchronized X (Twitter) Thread**: Reply, critique, or inspect the 5-post verification thread on **[X (Twitter)](https://x.com/search?q=%22The%20Three-Body%20Problem%20in%20Computing%22%20OR%20research.openie.dev%2Ftv%2F%3Fstudy%3Dthree-body&src=typed_query)**.
- **Query Grounded Prior Art & Signed WAI1 Receipts**: Explore linked lineage trails on **[The Commons (`scholar.askdavidc.ai`)](https://scholar.askdavidc.ai)**, read the full primary paper & PDF at **[`research.openie.dev/papers/three-body/`](https://research.openie.dev/papers/three-body/)**, and verify the Ed25519-signed `WAI1` binary container (`blake3:c7471e0d2df5c738…`) in **[`openie-artifact-substrate`](https://github.com/openIE-dev/openie-artifact-substrate/blob/main/catalog/envelopes/tv-three-body.wai)**.

---

*Summary & essay text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Code, verification gates, and `WAI1` schemas licensed under `Apache-2.0`.*
