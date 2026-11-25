# Deterministic Cross-Platform Simulation Steps: Reconciling 1.69 mJ/Tick and the 7,728x Python-vs-C++20 Ratio

*Verifies bit-identical 100,000-tick Q32.32 integer state steps across 8 languages and 4 CPU architectures, clarifying that 1.694 mJ/tick and 7,728x are Linux RAPL reported_j comparing C++20 -O3 against interpreted rce emit python (not Unity/Godot).*

> **Signed Provenance · Self-Checked** (`human_in_gate = false`; automated build, benchmark, and proof-checking scripts ran without manual override — not externally peer-reviewed; see [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) and [Epistemic Glossary](https://blog.openie.dev/glossary/)).  
> **Canonical Post-Review Essay (`rel="canonical"`)**: [https://blog.openie.dev/posts/game-engines/](https://blog.openie.dev/posts/game-engines/)  
> **Primary Research Paper**: [https://research.openie.dev/papers/game-engines/](https://research.openie.dev/papers/game-engines/)  
> **1-Command Replication Kit**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) · **Study Repository**: [https://github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)  
> **Canonical Artifact ID**: `blake3:tv:77911a4ef555be4fc2b485790d43a76cff398719ebebd3b0f3f9c1fffa353adb` · **Evidence Tags**: `[E]` · `[M]` · `[S]` · **Telemetry Class**: `unmetered`

---

![Deterministic Simulation Steps — 0 mismatches across 32 language-host cells and 1.694 mJ C++20 vs 13.09 J Python reported_j](https://research.openie.dev/media/tv/posters/game-engines-poster.jpg)
*Cross-platform `Q32.32` lockstep parity (`32/32` cells) and reconciled `1.694 mJ/tick` (`C++20 -O3`) vs. `13,090.57 mJ/tick` (`CPython 3.14`) `reported_j` ratio (`7,728x`). Dedicated to the public domain under `CC0-1.0`.*

## Key Claims & Audited Scope (`[T]` / `[E]` / `[M]` / `[S]`)

1. **[E · Reconciled Telemetry Class & Both Sides of `7,728x` (`reported_j`)]** Earlier metadata paired `board_metered = false` (`measured_j = null`) with an unqualified `"1.7 mJ"` and `"> 7,000x"` headline. Grounded in `GE-H5` (`src/content/papers/game-engines.md`), **both numbers are Intel Core i9-13900H Linux `intel-rapl:0` socket `reported_j` over `500` ticks of `N = 10,000` `Q32.32` fixed-point actors**: compiled **`C++20` (`clang++ -O3`) used `1.694 mJ/tick` (`0.0583 ms/tick`, `p99 = 0.0654 ms`)**, `Wasm32` (`Node V8`) used `2.211 mJ/tick` (`0.0724 ms`), and `Rust -O3` used `3.673 mJ/tick` (`0.1248 ms`), compared against **boxed interpreted `rce emit python` (`CPython 3.14`) at `13,090.57 mJ/tick` (`13.09 J/tick`, `564.58 ms/tick`)**—a **`7,728x` (`C++20`)** and **`3,564x–7,728x` speedup/energy cut over interpreted Python**, **not** over commercial C++/C# engines (`Unity Burst/DOTS`, `Unreal`, `Godot`).
2. **[E · `32/32` Cross-Architecture Lockstep Parity]** Replacing IEEE-754 floats (whose `FMA` contraction, x87/SSE rounding, and transcendental libraries diverge across chips) with `Q32.32` fixed-point integer Forms yielded **`0` state-hash divergences across `100,000` ticks** in all `32` cells (`8` target languages × `4` architectures: `macOS arm64`, `Linux aarch64`, `Linux x86-64`, `Windows x86-64`) in `GE-H1`.
3. **[E · Scope Boundary: State Logic Only, Not Rendering or Mesh Physics]** Benchmarks step pure deterministic gameplay/kinematic state transitions; GPU rasterization/raytracing, triangle-mesh broadphase/narrowphase collision, audio mixing, and multithreaded ECS job stealing remain outside scope.

> **Telemetry & Frame-Budget Scope Note**: The primary `game-engines` study (`GE-H1` through `GE-H4` and `GE-H6` through `GE-H9`) is an **`unmetered` cross-OS determinism and pixel-tolerance investigation (`measured_j = null`, `board_metered = false`)** citing external `16.67 ms` / `20 ms` frame-budget orders of magnitude (such as GameRule's `65 µs/actor` `308`-actor `20 ms` ceiling `[S]`). In `GE-H5`, the `1.694 mJ/tick` vs. `13,090.57 mJ/tick` (`7,728x`) Intel Core i9 Linux `RAPL` `reported_j` ratio measures compiled `C++20 -O3` against boxed interpreted `CPython 3.14` emitted from the same Form — **never** against native commercial C++/C# engines (`Unity`, `Unreal`, `Godot`).

## Methods, Baselines, Sample Sizes (`N`) & Licensing Scope

- **Hardware & Telemetry**: `GE-H5` 10k-actor scaling: `Intel Core i9-13900H` Linux `powercap` `intel-rapl:0` socket `L2` + core `PP0` `reported_j` (`measured_j = null`, `board_metered = false`). `GE-H1` 100k-tick parity: `Apple Silicon` (`ri_energy_nj` `L3` `0.073–13.60 J`), `Linux x86-64` (`RAPL` `1.89–181.87 J`), `Linux aarch64`, and `Windows x86-64`.
- **Workload & Suite**: `GE-H1`: `100,000`-tick deterministic arena state machine emitted to `8` targets (`C++20`, `Rust`, `Zig/C`, `Go`, `Wasm32`, `JavaScript`, `Scala/JVM`, `Python`). `GE-H5`: `N = 10,000` `Q32.32` fixed-point bouncing/interacting actors stepped for `500` ticks.
- **Baselines Compared**: Compiled native/Wasm RCE emitters (`C++20 -O3`, `Wasm32`, `Rust -O3`) vs. reference interpreted `rce emit python` (`CPython 3.14`); floating-point cross-compiler drift probe vs. `Q32.32` integer arithmetic. **External commercial game engines (`Unity`, `Unreal`, `Godot`, `Bevy`): not benchmarked in `GE-H5`.**
- **Runs (`N`) & Uncertainty / Spread**: `GE-H1`: `32` language×host cells × `100,000` ticks (`0` bit mismatches). `GE-H5`: `500` consecutive ticks at `N = 10,000` actors (`C++20` mean `0.0583 ms/tick`, `p99 = 0.0654 ms`, `1.694 mJ/tick` socket / `1.454 mJ` core `reported_j`).
- **Cold vs. Warm Caching Scope**: Warm in-memory tick loop (`V8` JIT warmed prior to `Wasm32`/`JS` steady-state window; zero cross-tick memoization since actor positions mutate every tick).
- **Artifact & License Status**: Core emitters public in `openIE-dev/rce` (`Apache-2.0`); benchmark tables and primary paper (`CC0-1.0`) at `research.openie.dev/papers/game-engines/`; self-checked, not externally peer-reviewed.

## Reconciling `joules = null` Metadata with `1.694 mJ/tick` and `7,728x`

In OpenIE’s manuscript frontmatter, `board_metered: false` indicates `measured_j = null` (no physical inline DC shunt or wall wattmeter was attached), **not** the absence of on-chip CPU counters. Setting this post’s `energyClass` explicitly to `reported_j` and naming both sides of the ratio removes all ambiguity `[E]`:

- **Numerator (`13,090.57 mJ/tick`, `564.58 ms/tick`):** Reference `rce emit python` running on `CPython 3.14`, which allocates boxed Python `int` objects on every `Q32.32` fixed-point multiply-shift across `10,000` actors `[E]`.

- **Denominator (`1.694 mJ/tick` socket / `1.454 mJ` core, `0.0583 ms/tick`):** Unboxed `int64_t` `C++20` (`clang++ -O3`) generated from the **exact same RCE Form**, achieving a **`7,728x` lower socket `reported_j`** (`5,921x` for `Node V8 Wasm32` at `2.211 mJ/tick`; `3,564x` for `Rust -O3` at `3.673 mJ/tick` due to extra bounds/struct-copy checks in the emitted Rust projection) `[E]`.

This `7,728x` figure therefore measures the **interpreter boxing tax removed by multi-target native codegen**, not a speedup over handwritten C++ or Unity Burst/DOTS `[E]`.

## Deterministic Lockstep & Replay Verification (`GE-H1`)

Multiplayer rollback netcode (GGPO) and simulation replay require identical state hashes from identical input logs across heterogeneous client CPUs (`arm64` Apple/Snapdragon vs. `x86-64` AMD/Intel, browser `Wasm32` vs. native server) `[S]`. By banning hardware-dependent IEEE-754 rounding from core transition Forms and compiling one `Q32.32` specification across `8` targets, all `32` host×language combinations produced identical `SHA-256` state digests after `100,000` steps `[E]`.

## Limitations & Unbenchmarked Subsystems

- **Not a full game engine:** A production engine spends most frame power in GPU shader execution, VRAM bandwidth, skeletal animation, GJK/EPA convex-hull collision, and spatial audio—none of which are modeled in `10,000`-actor 2D/kinematic state stepping `[E]`.

- **Single-threaded step:** Multi-core data-oriented ECS schedulers (`Bevy`, `Flecs`, `Unity DOTS`) and SIMD `AVX2`/`NEON` vectorization of emitted loops remain open work `[E]`.

## Energy & Telemetry Scope

All joule values are Linux `intel-rapl:0` (`L2`) and macOS `ri_energy_nj` (`L3`) `reported_j` (`measured_j = null`, `board_metered = false`), compared strictly within the `Intel Core i9-13900H` `GE-H5` run.

## Epistemic Non-Mixing & Telemetry Ledger

Open Interface Engineering enforces strict non-mixing across physical rail shunts, on-chip counters, datasheet models, and uninstrumented analyses (`measured_j` ⊥ `reported_j` ⊥ `est_j` ⊥ `unmetered` — cross-class addition or direct cross-tier ratioing is blocked):

- **Provenance Gate**: `Signed Provenance · Self-Checked` (`human_in_gate = false`)
- **Acquisition Tier**: Unmetered Determinism Study (External Frame Budgets)
- **Telemetry Disclosure**: Unmetered cross-OS Q32.32 replay & GPU pixel-tolerance study citing external 16.67-20 ms frame-budget orders of magnitude (GE-H5 RAPL compares C++20 vs boxed Python only).
- **Evidence Class**: `unmetered` (`board_metered = false`)
- **Catalog Anchor Reading**: `null` (`unmetered` — no hardware wattmeter or chip energy counter claimed)
- **Sensor / Formula Scope**: Unmetered cross-OS Q32.32 determinism & wgpu tolerance audit citing external 20 ms frame-budget literature [S] (GE-H5 Core i9 RAPL reported_j compares C++20 vs boxed Python only; measured_j = null)

## Related Work & Primary Literature (`[S]`)

- **Bettner & Terrano (Age of Empires, GDC 2001) & Cannon (GGPO Rollback Netcode, 2009):** Deterministic input-log lockstep and rollback networking in commercial games `[S]`.
- **Monniaux (ACM TOPLAS, 2008):** Pitfalls of verifying floating-point computations across x86/ARM compilers and FMA instructions `[S]`.
- **Pereira et al. (SLE 2017) & Berger, Parnin & Vitek (2023):** Cross-language CPU `RAPL` energy comparisons and interpreter vs. native execution caveats `[S]`.
- **Unity DOTS / Burst, Bevy ECS & Box2D v3:** Production deterministic/data-oriented simulation architectures `[S]`.

## Replicate, Critique & Inspect Raw Artifacts

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Canonical Post-Review Blog Dossier**: [https://blog.openie.dev/posts/game-engines/](https://blog.openie.dev/posts/game-engines/)
- **Primary Research Manuscript & PDF**: [https://research.openie.dev/papers/game-engines/](https://research.openie.dev/papers/game-engines/) ([PDF](https://research.openie.dev/pdfs/game-engines.pdf))
- **1-Command Public Replication Harness**: [https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate](https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate) and [https://github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)
- **9:16 Vertical Snackable (`60fps`) & Research TV Cuts**: [https://research.openie.dev/media/tv/tiktok/game-engines-tiktok.mp4](https://research.openie.dev/media/tv/tiktok/game-engines-tiktok.mp4) · [OpenIE Research TV](https://research.openie.dev/tv/?study=game-engines)
- **Verification & Glossary Standards**: [Verification & AI-Use Disclosure](https://blog.openie.dev/verification/) · [Epistemic Glossary](https://blog.openie.dev/glossary/)

---

*Prose and summary text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Public replication harnesses and `WAI1` schemas are licensed under `Apache-2.0` unless explicitly noted in the licensing ledger above.*
