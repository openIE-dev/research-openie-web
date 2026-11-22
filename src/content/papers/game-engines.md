---
title: "Writing a Game Once and Running It Everywhere: Where Exact Replay Ends and Tolerance Begins"
deck: "Can a game be written once as a checked state machine and projected into several engines, instruction sets, and graphics stacks? Executed across 25 multi-ISA target × host cells for 100,000 ticks under Q32.32 integer physics (GE-H1: 0 / 20,500 SHA-256 mismatches across arm64 macOS, aarch64 Linux, and AMD/Intel x86_64 Linux), 25,000 cross-ISA floating-point ticks (GE-H2: t_div = 10 Apple libm vs GNU glibc sin/cos, t_div = 406 x86_64 FMA vs arm64 fmadd without -ffast-math), and 4 physical GPUs across Metal and Vulkan (GE-H3: 1.3%–9.3% LSB pixel drift, Δ_max ≤ 2, PSNR 64.2–72.1 dB, SSIM ≥ 0.99983), paired with a playable joule-budgeted Q32.32 WebXR/Canvas prototype."
id: game-engines
status: "Research study"
author: "David Charlot, Open Interface Engineering"
figures: "/living/game-engines/"
pdf: "/pdfs/game-engines.pdf"
board_metered: false
---

# Writing a Game Once and Running It Everywhere: Where Exact Replay Ends and Tolerance Begins

*{{revision}}. Interactive explorer, cross-GPU inspector, and playable `Q32.32` Chrono-Budget Arena: [research.openie.dev/living/game-engines/](/living/game-engines/).*

## Abstract

This study asks whether a game can be written once as a checked state machine and then projected across languages, central processing unit (CPU) instruction set architectures (ISAs), and graphics processing unit (GPU) back ends. Both the surveyed specifications and three executed empirical falsifier suites give a sharp boundary: **yes** for game rules and simulation under pinned fixed-point integer arithmetic (`(GE-H1)`: `0 / 20,500` Secure Hash Algorithm 256-bit (`SHA-256`) checkpoint mismatches across `100,000` ticks of a 16-body 2D arena projected across `25` target × host cells on `arm64` `macOS 27.2.1`, `aarch64` `Linux 6.8`, and Advanced Micro Devices (`AMD`) Zen 5 and Intel Raptor Lake `x86_64` `Linux 7.0`, spanning `0.073 J` to `13.60 J` in macOS per-process `reported_j` and `1.89 J` to `181.87 J` in Linux Running Average Power Limit (`RAPL`) package `reported_j`); **no** when unpinned floating-point transcendentals or fused multiply-add (`FMA`) lowering enter chaotic multi-body collisions (`(GE-H2)`: even *without* `-ffast-math`, Apple `libSystem` `libm` vs Linux system `glibc` `std::sin`/`std::cos` diverges at tick `10`, cross-ISA `x86_64` `-mavx2 -mfma` vs `arm64` `fmadd` diverges at tick `406`, and V8 `Math.sin` diverges across ISAs at tick `66`); and **no** for bit-exact pixels across GPU vendors, yet **yes** under a bounded one-way tolerance gate (`(GE-H3)`: across Apple `Metal`, `AMD` Mesa Radeon Vulkan (`RADV`), Nvidia Vulkan (`NVIDIA`), and Intel Mesa Vulkan (`ANV`) at `512×512` `RGBA8Unorm`, `24 / 24` cross-GPU frame pairs differ in raw `SHA-256` across `1.30%`–`9.34%` of pixels, yet keep maximum per-channel error $\Delta_{\max} \le 2 / 255$, peak signal-to-noise ratio (`PSNR`) `64.16`–`72.06 dB`, and structural similarity (`SSIM`) `0.99983`–`0.99999`, with `measured_j = None` and `board_metered = false`).

**In plain words**

1. **Exact simulation across chips and languages works when arithmetic is integer-pinned.** Over `100,000` ticks (`20,500` verified `SHA-256` checkpoints), native Rust, C++20 (`Clang` and the compiler collection (`GCC`)), WebAssembly (`Wasm`), JavaScript `BigInt`, and Python replay the exact same 732-byte state bit-for-bit across Apple Silicon (`arm64`), NVIDIA Jetson Thor (`aarch64`), AMD Zen 5 (`x86_64`), and Intel Raptor Lake (`x86_64`) with zero mismatches.
2. **Standard floating-point physics drifts across operating systems and CPU families even without `-ffast-math`.** Pure algebraic `+`, `-`, `*`, `/`, and `sqrt` with `FMA` disabled (`-ffp-contract=off`) match across `x86_64` and `arm64` for all `25,000` tested ticks, but calling `std::sin`/`std::cos` across macOS `libm` vs Linux `glibc` flips a bit at tick `10` (`0.17 s` at `60 Hz`) and desynchronizes gameplay scores by tick `9,798` (`163.3 s`), while enabling default `FMA` contraction (`-ffp-contract=fast`) diverges between `x86_64` and `arm64` at tick `406` and desynchronizes gameplay at tick `11,205`.
3. **Graphics cards do not draw identical bits, so rendering belongs downstream of a one-way tolerance gate.** Across Apple `Metal`, AMD `RADV` Vulkan, NVIDIA Vulkan, and Intel `ANV` Vulkan, `1.3%` to `9.3%` of pixels differ by `1` to `2` least significant bits (`LSB`), breaking naive framebuffer `SHA-256` checks while passing perceptual tolerance (`PSNR > 64 dB`, `SSIM > 0.9998`) because no GPU value ever flows back into simulation state.

![Diagram of the proposed split. A box at the top holds the game Form P equals S, E, delta, D, lambda, with typed interface schemas and a strict checker. Arrows lead to four projections: simulation (Rust, WebAssembly, XState, SCXML, Python) and scripting (Rhai, Lua, Luau) on the left in the exact zone, judged by a per-tick state hash; scene (BSN-like, glTF, OpenUSD) and rendering (Slang, WGSL, WESL) on the right in the tolerance zone, judged by per-pixel error. A dashed vertical line marks the determinism boundary. A band at the bottom lists host effects that enter only as logged events: input, clock, audio, network, asset input and output, GPU draws, cosmetic physics.](/figures/game-engines/architecture.svg)

*Figure 1. Proposed split. One Form feeds four projections. Simulation and scripting sit in the exact zone, judged by per-tick state hashes. Scene and rendering sit in the tolerance zone, judged by per-pixel error. Host effects enter only as logged events.*

![Grid with eleven existing representations as rows (Slang, Naga, WGSL and WESL, glTF, OpenUSD, BSN, SCXML and XState, VGDL, GameRule, nAIVE, SpacetimeDB) and seven capability columns (behavior, scene, shader, execution order, multi-target, replay log, cross-layer checking). Green cells mark documented capability, amber partial, grey absent or undocumented. The cross-layer column is grey except for partial marks on Slang and nAIVE.](/figures/game-engines/coverage.svg)

*Figure 2. Coverage of existing representations, scored only from the documents read for this study. Green: documented capability. Amber: partial. Grey: absent or undocumented. The rightmost column, cross-layer checking, is nearly empty.*

## 1. Terms, notation, and the idea under test

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF: Reality Code Engine [same house], intermediate representation, entity component system, finite-state machine, and signed distance field</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL: central processing unit, graphics processing unit, instruction set architecture(s), single instruction multiple data, Advanced Vector Extensions 2, Arm Advanced SIMD, special function unit, raster operations pipeline, and Intel Raptor Lake mobile architecture</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8: Institute of Electrical and Electronics Engineers (as in IEEE 754 floating-point), fused multiply-add, x86_64 vector fused multiply-add and negated multiply-add opcodes, AArch64 scalar fused multiply-add and multiply-subtract opcodes, unit in the last place, least significant bit, Secure Hash Algorithm (`SHA-256`), mean absolute error, root mean squared error, peak signal-to-noise ratio, structural similarity index, standard deviation, and 8-bit-per-channel red-green-blue-alpha framebuffer format</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, CUDA: WebGPU Shading Language, WebGPU Extended Shading Language, Standard Portable Intermediate Representation V, OpenGL Shading Language, High-Level Shading Language, Metal Shading Language, Direct3D 11, Direct3D 12, and Compute Unified Device Architecture</li>
<li>RADV, ANV, LLVM, GNU, GCC, PE, OS, API, APIs, WebXR, WebMCP, URL, JSON, YAML, README, MB, CS0246, RE, ENGINE, DFU: Mesa Radeon Vulkan driver, Mesa Intel Vulkan driver, Low Level Virtual Machine compiler infrastructure, GNU's Not Unix project, GNU Compiler Collection, Windows Portable Executable, operating system, application programming interface(s), Web Extended Reality API, Web Model Context Protocol, Uniform Resource Locator, JavaScript Object Notation, YAML Ain't Markup Language, repository README documentation file, megabytes, C# compiler missing-type diagnostic CS0246, Capcom RE ENGINE ("Reach for the Moon" / "RE neXt" engine branding), and Dagstuhl Follow-Ups DOI prefix</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG: State Chart XML, Game Description Language, Video Game Description Language, Bevy Scene Notation, Boldsea Semantic Language, Multi-Level Intermediate Representation, atomic/consistent/isolated/durable transactions, Good Game Peace Out rollback networking library, Graphics Language Transmission Format (ISO/IEC 12113:2022), Open Universal Scene Description, Universal Scene Description, local area network, artificial intelligence, and Computational Intelligence and Games</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, V100, GH200, CTC: Satiation Tiered Benchmark telemetry levels (`L2` socket/package counter, `L3` per-process kernel counter) [same house], Running Average Power Limit, model-specific register, process identifier, `proc_pid_rusage` (`RUSAGE_INFO_V6`), Advanced Micro Devices, NVIDIA Corporation, Volta V100 GPU, Grace Hopper GH200 superchip, and closed timelike curve</li>
</ul>

To keep forward references transparent from top to bottom, Section 1 defines the Form notation, Section 2 surveys existing game representations, Section 3 analyzes floating-point divergence, Section 4 tabulates intermediate representations, Section 5 states the proposed layer split, Section 6 reports the multi-ISA and cross-GPU falsifier runs, Section 7 lists infeasibility flags, and Section 8 documents sources and limits.

The [Reality Code Engine (RCE)](https://research.openie.dev/about/rce/) treats a program as a state machine called a Form, written $P = (S, E, \delta, D, \lambda)$:

- $S$: the set of states;
- $E$: the set of events (inputs);
- $\delta : S \times E \to S$: the transition function;
- $D$: an append-only log of every step taken;
- $\lambda$: the output map from state to observable output.

A strict checker either accepts a Form or names the rule it breaks. Emitters then project the accepted Form into Rust, Python, JavaScript and Scala. XState (a JavaScript and TypeScript statechart library), SCXML (a World Wide Web Consortium Recommendation) and WebAssembly (`Wasm`) are not among the emitters' targets; this study treats them as candidate projections. Because every step lands in $D$, any run can be replayed.

A game engine is a much larger machine. It runs a fixed-step simulation, a scripting layer, a scene description, and a rendering pipeline on a GPU. Sections 1 to 8 ask which of those layers can live inside a Form, which must stay outside as host effects, and where exactness has to give way to tolerance.

The idea has a long pedigree. The Stanford [Game Description Language (GDL) specification](http://ggp.stanford.edu/readings/gdl_spec.pdf) covers "finite, discrete, deterministic multi-player games of complete information" and observes that the natural underlying model of such games "is a finite state machine." What is new in a game engine is not the state machine but everything around it: floating-point physics, scripts, scenes, and GPUs.

## 2. What the landscape shows

### 2.1 Game logic as data already works, on one backend

GameRule ([Multimedia Systems 32:564, 2026](https://doi.org/10.1007/s00530-026-02629-8)) expresses behavior as per-actor *when-do* rules over 14 create, read, update and delete actions and 6 conditions. Its deterministic contract is concrete: one central scheduler runs from a single FixedUpdate in declaration order, the last write wins, and spawns and deletes are deferred to the end of the traversal. The authors justify the contract by quoting Unity's manual, which says script execution order "isn't guaranteed across builds, machines, or Unity versions." Across three Unity sample games (Haunted Jaunt, Survival Shooter, Tanks), behavior code shrank from 572 to 107 lines (−81.3%).

The price is measured. Rule interpretation costs about $c \approx 65\ \mu\text{s}$ per actor per step. With a step budget $T = 20$ ms, the actor ceiling is

$$N_{\max} = \frac{T}{c} = \frac{20\ \text{ms}}{65\ \mu\text{s}} \approx 308,$$

which agrees with the paper's observation that the budget is exceeded between 200 and 350 actors (23.872 ms at 350). Only a Unity backend exists, so portability across engines is argued but not demonstrated.

### 2.2 Order of execution can be made deterministic by construction

The ECS pattern stores game state as components attached to entity identifiers and runs behavior as systems over them. Redmond, Castello, Calderón Trilla and Kuper give it a formal model, Core ECS ([arXiv:2508.15264](https://arxiv.org/abs/2508.15264)). They prove that a schedule in which every concurrent pair of mutations commutes is deterministic, and that two sub-schedules writing disjoint sets of component labels may run in parallel without changing the result. Surveying Bevy ECS, EnTT, Flecs, Specs and apecs, they find that none allows attaching a new component concurrently with another mutation; such structural changes are deferred and applied serially. Tasnim and Zhao ([SAC 2026, doi:10.1145/3748522.3779910](https://doi.org/10.1145/3748522.3779910)) add an operational semantics and a type system for archetype ECS that tracks read and write sets per system, and report on a Tower Defense simulation that a parallel archetype layout reached 109.54 frames per second against 36.13 for an object-oriented baseline. GameRule's deferred spawn and delete is the same discipline, reached independently.

### 2.3 Compiling is not the same as being right

The Mage benchmark ([arXiv:2605.07342](https://arxiv.org/abs/2605.07342)) ran 858 generation attempts over 26 Unity mechanic patterns. Without an IR, 43% of outputs passed at runtime, yet mechanism F1 (agreement between requested and implemented mechanics) was only about 0.12. Conditioning on an IR dropped runtime pass to 14% to 21% but lifted mechanism F1 to 0.82 to 1.00. Compile rate was anti-correlated with functional correctness: the missing-type error CS0246 appeared 469 times under IR conditioning and zero times without it. A behavior-only IR and a full-scene IR were statistically indistinguishable (McNemar p = 1.0). The lesson for RCE: a checker that only proves "it compiles" measures the wrong quantity. Interface checks must be behavioral.

### 2.4 Public benchmarks with replayable traces exist

GameCraft-Bench ([arXiv:2606.17861](https://arxiv.org/abs/2606.17861); [repository](https://github.com/FreedomIntelligence/gamecraft-bench)) offers 140 Godot 4 two-dimensional tasks in 15 families. Submissions carry replayable input traces. The strongest agent in the paper scored 41.46%, and the repository later reports 65.70%. It does not cover Unity, Unreal, 3D, multiplayer, or large physics scenes. [Summer Engine](https://www.summerengine.com/templates) publishes 17 open-source game templates (rally, platformer, tower defense, metroidvania, survivors, first-person shooter, LAN multiplayer, voxel, and others). The General Video Game AI framework and its VGDL ([arXiv:1802.10363](https://arxiv.org/abs/1802.10363)) supply 120 single-player and 60 two-player games defined by sprite, interaction, termination, and level-mapping sets.

### 2.5 Convergence across industry and research

Several efforts are converging on the same shape: declarative scene and pipeline files, a sandboxed scripting layer, a modern shader language, and an event log.

- [nAIVE](https://github.com/poro/nAIVE) is built in Rust on `wgpu` with an ECS (hecs), YAML scenes, materials and render pipelines, Lua 5.4 with per-entity sandboxing, Slang shaders cross-compiled to WGSL, Rapier physics, an event bus with YAML schema validation, and a headless test runner. Its [site](https://naive.dev/) shows a 92-line YAML file declaring a five-pass deferred pipeline. Its README also describes GPU compute simulation driving 50,000+ entities, a choice that places that simulation on the tolerance side of the boundary drawn next.
- Capcom describes REX ("RE neXt Engine") as a staged evolution of RE ENGINE involving about 200 engineers ([Capcom IR](https://www.capcom.co.jp/ir/english/data/oar/2025/re-engine.html)). Press coverage ([PC Gamer](https://www.pcgamer.com/gaming-industry/game-development/capcom-announces-plans-to-transform-its-re-engine-into-an-ai-generation-game-engine/)) reports six programs, among them Re:Dox, which translates different types of data into a common set of rules, and RE:Flows, which converts game mechanic ideas into a standardised programming language; it also reports that more than 2,000 people use RE Engine.
- Bevy's BSN proposal ([discussion 14437](https://github.com/bevyengine/bevy/discussions/14437)) defines scenes as composable Patch, EntityPatch, and DynamicScene values with a `bsn!` macro and an asset format, while leaving event handlers unresolved.
- [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) runs game logic as reducers that execute as ACID transactions over tables and replays a commit log, which is the RCE log $D$ under another name.
- Executable Ontologies ([doi:10.48550/arXiv.2601.07964](https://doi.org/10.48550/arXiv.2601.07964)) model game behavior in BSL over an append-only, immutable event graph. The paper recommends a hybrid in which physics, rendering and animation keep traditional high-frequency approaches while quests and decisions run on the event graph, joined through aggregated events. That is the same layer split proposed here.

## 3. The physics of divergence: why exactness is binary

Floating-point addition is not associative. On parallel hardware the order of a reduction varies run to run. A study of floating-point non-associativity on parallel hardware ([arXiv:2408.05148](https://arxiv.org/abs/2408.05148)) defines the scalar variability

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

where $f_d$ is a deterministic reduction and $f_{nd}$ a nondeterministic one. Permuting a sum of $10^6$ normally distributed double-precision values changed the result by up to about $4.26 \times 10^{-13}$, and the maximum $|V_s|$ grew as $\sqrt{n}$. A deterministic tree reduction cost about 0.2% relative to atomic accumulation on an NVIDIA V100 and up to 7.8% on a GH200. In 1,000 graph-network training runs, every run produced distinct weights.

A game turns such tiny differences into visible ones. Rigid-body contact and many-body dynamics are typically chaotic. Under a local Lyapunov exponent $\Lambda$, a perturbation grows as

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

so the time until it reaches a gameplay-visible size $\Delta$ is

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*Illustrative model:* take $\delta_0 \approx 6 \times 10^{-8}$ (one ULP of single precision, relative), $\Delta = 1$ (an object on the other side of a wall), and an assumed $\Lambda = 2\ \text{s}^{-1}$. Then $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s. The logarithm is the key: shrinking $\delta_0$ a millionfold buys only about 6.9 more seconds. Approximate agreement therefore cannot rescue simulation. Either the state is bitwise identical or it eventually diverges — a prediction tested directly across 25,000 multi-ISA collision ticks below (`GE-H2`).

Practice agrees. [Gaffer On Games](https://gafferongames.com/post/floating_point_determinism/) records that cross-machine determinism requires the same compiler and instruction set, that Battlezone 2 hit AMD versus Intel differences in transcendental functions, and that MotoGP replays could not be shared between Xbox and personal computers. It cites Markstein's advice to forbid FMA contraction and reassociation. The [Rapier guide](https://rapier.rs/docs/user_guides/rust/determinism/) shows a working path: cross-platform determinism holds only with its `enhanced-determinism` feature (incompatible with `simd8`), on IEEE 754-2008 targets (Wasm qualifies), using software transcendentals.

For rendering, the [WGSL specification](https://www.w3.org/TR/WGSL/) states that "WGSL sometimes permits several possible behaviors for a given feature. This is a portability hazard." Its floating-point section goes further: "WGSL does not specify a rounding mode"; "An implementation may reassociate operations"; it "may fuse operations if the transformed expression is at least as accurate as the original"; subnormal inputs and outputs of many operations "may be flushed to zero"; and the `fma` built-in "may expand to an ordinary multiply ... and an add." Pixels are thus specified to differ across implementations. The [SPIR-V specification](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) offers a narrower tool: its NoContraction decoration marks an arithmetic instruction that "cannot be combined with another instruction to form a single operation," and such operations "are not allowed to reassociate." That is a per-instruction guard on one back end, not a portable guarantee for a whole shader.

## 4. The IR table

| Representation | Layer | Strongest property (documented) | What it lacks for a Form |
|---|---|---|---|
| [Slang](https://shader-slang.org/) | Shaders | Module IR; back ends for D3D12, Vulkan, Metal, D3D11, OpenGL, CUDA, WebGPU, CPU; capability system | No game state, no events, no exact-semantics guarantee for floats |
| [Naga](https://github.com/gfx-rs/wgpu/tree/trunk/naga) | Shaders | Validated IR; WGSL, SPIR-V and GLSL in; SPIR-V, WGSL, MSL, HLSL and GLSL out | Same; no link to a scene schema |
| [WGSL](https://www.w3.org/TR/WGSL/) / [WESL](https://wesl-lang.dev/) | Shaders | Uniformity analysis; WESL adds imports, conditional compilation, packages, `wgsl-test` | Permits reassociation, fusion and flush-to-zero; no host-side types |
| [SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) | Shader binary IR | NoContraction decoration forbids fusion and reassociation per instruction | Per-instruction only; no game semantics |
| [MLIR](https://mlir.llvm.org/) | Compiler infrastructure | Multi-level dialects for lowering | Not a game model; semantics left to each dialect |
| [glTF 2.0](https://www.khronos.org/gltf/) (ISO/IEC 12113:2022) | Assets and scene | Interchange standard across tools | No behavior, no execution order |
| [OpenUSD](https://openusd.org/release/intro.html) | Scene | Composition arcs, namespace paths | Self-described "Not a rigging system"; no simulation semantics |
| [BSN](https://github.com/bevyengine/bevy/discussions/14437) | Scene | Typed patches over components, versioned imports | Event handlers unresolved; Bevy only |
| [SCXML](https://www.w3.org/TR/scxml/) / [XState](https://stately.ai/docs/xstate) | Behavior | Microstep and macrostep semantics, document-order priority, serial parallel regions | Data model is platform-specific; no numeric discipline, no scene or shader |
| [GDL](http://ggp.stanford.edu/readings/gdl_spec.pdf) | Rules | Logic description of finite, discrete, deterministic games | No continuous physics, no rendering |
| [VGDL](https://arxiv.org/abs/1802.10363) | Rules | Compact 2D grid games, large public corpus | 2D grid only; no rendering or physics fidelity |
| [Core ECS](https://arxiv.org/abs/2508.15264) | Execution order | Theorem giving a condition for deterministic concurrent schedules | A formal model, not an engine format; no scene or shader |
| [GameRule](https://doi.org/10.1007/s00530-026-02629-8) | Rules | Deterministic scheduler contract, measured code savings | Unity only; about 65 µs per actor; no formal checker |
| [nAIVE](https://github.com/poro/nAIVE) | Whole engine | YAML scenes and pipelines, Lua, Slang, event schema validation | No published formal semantics or cross-layer type check |
| [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) | Server logic | Reducers as transactions, commit-log replay | Server side only; no client rendering or scene |

## 5. Proposed architecture

### 5.1 Layer split

1. **Simulation Form (exact).** $S$ holds fixed-point or strict IEEE 754 values, with FMA and reassociation disabled and transcendentals implemented in integer or pinned software routines. $E$ holds tick events and logged inputs. $\delta$ uses SCXML macrostep semantics: per tick, process events in queue order, resolve conflicts by document order, run parallel regions serially. Collections iterate in a declared order, following GameRule's contract (declaration order, last write wins, structural changes deferred to the end of the tick). Where parallelism is wanted, the checker admits only schedules that satisfy the Core ECS disjointness condition.
2. **Scripting projection (exact).** Designer scripts compile to guards and actions over $S$, emitted as [Rhai](https://rhai.rs/book/about/features.html) (sandboxed, with a "Don't Panic" guarantee, no-std and Wasm support), Lua, or [Luau](https://luau.org/) (sandboxed by default, with gradual types). Scripts may only call $\delta$ through declared actions. They cannot read clocks, random sources, or GPU results directly.
3. **Scene projection (tolerance downstream).** $\lambda$ maps $S$ to a BSN-like patch tree whose component schema is part of the Form. glTF and OpenUSD serve as export targets for assets.
4. **Rendering projection (tolerance).** Materials and passes are authored in Slang or WGSL, and emitted through Slang or Naga to Metal and Vulkan back ends. Rendering is a pure function of $\lambda(s)$. No GPU result ever flows back into $S$.

### 5.2 Inside the Form versus host effects

Inside: state, transitions, rule order, fixed-point physics for gameplay-relevant bodies, the random generator with its seed in $S$, interface schemas. Outside, as logged events: device input, wall-clock time, network packets, audio output, asset input and output, GPU draws, and any third-party physics used for cosmetic effects. Replay feeds $D$ back through $\delta$ rather than touching devices. Storage cost is modest. At a tick rate $f_{\text{tick}} = 60$ Hz and $b = 16$ bytes of input per tick, the log grows at $f_{\text{tick}} \cdot b = 960$ B/s, about 3.5 MB per hour.

### 5.3 Determinism boundary

- **Exact zone criterion:** for targets A and B and every tick $t$, $H(s_t^A) = H(s_t^B)$, where $H$ is a cryptographic hash over a canonical serialization of $S$.
- **Tolerance zone criterion:** for rendered frames $I^A$ and $I^B$ of the same $s_t$, the fraction of pixels with per-channel error above $\varepsilon$ must not exceed $p_{\max}$, paired with bounded structural similarity (`SSIM`) and peak signal-to-noise ratio (`PSNR`) floors. Section 6.3 executes this calibration across four GPU architectures (`Metal`, `RADV` Vulkan, `NVIDIA` Vulkan, and `ANV` Vulkan).
- Rollback networking in the style of [GGPO](https://github.com/pond3r/ggpo), which relies on input prediction and speculative execution, is valid only on the exact side of this boundary.

### 5.4 Cross-layer interface checking

The checker validates four typed edges before any emission: (a) script to simulation: every action names a declared transition with matching argument types; (b) simulation to scene: the output of $\lambda$ matches the component schema; (c) scene to rendering: every material binding matches a Slang or WGSL resource of compatible type, group, and binding index; (d) event coverage: every event a script listens for is producible by some transition or host source. Mage's finding (Section 2.3) is the reason edge checks are judged by behavior traces, not by compile success.

## 6. Falsifier-first test plan and executed multi-ISA / cross-GPU results

Each hypothesis is listed with its kill criterion. If the criterion is met, the claim is withdrawn. Subsections 6.1 to 6.4 report the three executed empirical falsifier suites (`GE-H1` multi-ISA `Q32.32` replay across 25 target × host cells, `GE-H2` cross-ISA floating-point drift across `x86_64` and `arm64`/`aarch64`, and `GE-H3` cross-GPU headless `wgpu` rendering tolerance across Apple `Metal` and AMD, NVIDIA, and Intel `Vulkan`), plus an interactive joule-budgeted `Q32.32` prototype (`GE-H4` through `GE-H9` remain open).

| ID | Hypothesis | Test corpus | Measure | Kill criterion | Status |
|---|---|---|---|---|---|
| GE-H1 | Simulation projections are bitwise identical across languages, OSs, and CPU ISAs | 16-body 2D arena Form (`Q32.32` fixed-point, `732`-byte state) across `arm64` macOS, `aarch64` Linux, and AMD/Intel `x86_64` Linux | $H(s_t)$ across Rust, Wasm32, C++20 (`Clang`/`GCC`), Node.js `BigInt`, Python 3 for $10^5$ ticks (`25` cells) | Any hash mismatch at any checkpoint on any `(host, target)` cell | **Executed (`0 / 20,500` mismatches, Section 6.1)** |
| GE-H2 | Strict mode vs cross-ISA floating-point boundary & library/FMA drift | 16-body 2D chaotic arena (`25,000` ticks across `arm64` macOS, `aarch64` Linux, and AMD/Intel `x86_64` Linux) | Exact divergence ticks `t_div` across strict `f64`, cross-OS `libm` `sin/cos`, cross-ISA `FMA`, V8 `Math.sin`, and `f32` | Unexpected mismatch under pinned algebraic arithmetic, or unpredicted silent drift | **Executed across `arm64`, `aarch64`, and `x86_64` (Section 6.2)** |
| GE-H3 | Cross-GPU rendering stays within bounded tolerance (`wgpu` / WGSL) | 4 canonical `Q32.32` states (`t = 0, 250, 1k, 10k`) rendered at `512×512` `RGBA8Unorm` on 4 physical GPUs (`Metal`, `RADV`, `NVIDIA`, `ANV`) + `llvmpipe` + `CPU Q16.16` | Framebuffer `SHA-256`, differing pixel `%`, $\Delta_{\max}$, MAE, RMSE, `PSNR`, and `SSIM` | Any physical GPU pair failing `PSNR > 40 dB`, `SSIM > 0.999`, or $p(\Delta > 8) \le 0.001$ | **Executed (`24/24` pass gate: `PSNR 64.2–72.1 dB`, `SSIM ≥ 0.99983`, Section 6.3)** |
| GE-H4 | Form-encoded rules cut code as GameRule did | Haunted Jaunt, Survival Shooter, Tanks behaviors | Lines of behavior code | Reduction under 50% (GameRule reached 81.3%) | Open |
| GE-H5 | Form runtime exceeds the GameRule ceiling | Synthetic actor scaling | Step time against $N$ | Step time over 20 ms below $N = 350$ | Open |
| GE-H6 | Interface checks catch real defects | Mage's 26 patterns; injected binding and schema faults | Detection rate; mechanism F1 | Detection below 90% of injected faults, or F1 no better than the no-IR 0.12 | Open |
| GE-H7 | Full $\ln(\Delta/\delta_0)$ slope sweep on Summer Engine templates | Physics-heavy Summer Engine templates re-expressed as Forms | Divergence time against injected $\delta_0$ | Slope of $t^{*}$ against $\ln(1/\delta_0)$ not distinguishable from zero | Open |
| GE-H8 | Replay is complete | One-hour recorded sessions | Final hash reproduced from $D$ alone | Any replay that needs state not in $D$ | Open |
| GE-H9 | Benchmark parity | GameCraft-Bench 140 tasks via a Form-to-Godot emitter | Pass rate against native Godot submissions | Lower pass rate on behavior-identical inputs | Open |

![Two-panel empirical summary across the determinism boundary. Left panel shows Exact Zone GE-H1 (0 mismatches across 20,500 SHA-256 checkpoints over 25 cells on arm64 macOS, aarch64 Linux, and AMD/Intel x86_64 Linux) and GE-H2 cross-ISA f64 divergence ticks (t_div = 10 for Apple libm vs GNU glibc sin/cos, t_div = 406 for x86_64 VFMADD vs arm64 FMADD without -ffast-math). Right panel shows Tolerance Zone GE-H3 minimum PSNR bars across all 6 physical GPU pairs (Apple Metal, AMD RADV Vulkan, Intel ANV Vulkan, NVIDIA Vulkan) spanning 64.2 to 72.1 dB well above the 40 dB gate, with 1.3% to 9.3% 1-to-2 LSB pixel differences.](/figures/game-engines/cross-gpu-tolerance.svg)

*Figure 3. Empirical boundary across `GE-H1`, `GE-H2`, and `GE-H3`. Upstream `Q32.32` simulation state (`S`) achieves `0 / 20,500` `SHA-256` checkpoint mismatches across five machines and three ISAs, whereas unpinned `f64` `sin/cos` and `FMA` diverge across OS/ISA boundaries within `10` to `406` ticks. Downstream of $\lambda(s_t)$, all four GPU architectures produce distinct `RGBA8Unorm` `SHA-256` digests (`1.3%`–`9.3%` pixel differences of `1–2` LSB) while staying strictly above `64.1 dB` `PSNR` and `0.99983` `SSIM` (`measured_j = None`, `board_metered = false`).*

### 6.1 `GE-H1`: Multi-ISA and multi-OS 100,000-tick determinism (`Q32.32` integer physics)

*Pre-registered under `PREREG_wave3_multi_isa_wgpu.json` (`SHA-256: 1721e5bdffaf...`). Telemetry strictly separates `SATB` levels `L2` and `L3` `reported_j` (`L2`: Linux `/sys/class/powercap/intel-rapl:0/energy_uj` socket/package and core counters; `L3`: macOS per-PID `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj`; `measured_j = None`, `board_metered = false`). Interactive explorer and raw JSON: [`/living/game-engines/`](/living/game-engines/) ([`results.json`](/living/game-engines/results.json)).*

A 16-body + 4-pickup 2D elastic-collision and cooldown-FSM arena Form (`Q32.32` signed 64-bit fixed-point coordinates in `[-64, +64]`, `128`-bit intermediate products, integer floor square root `isqrt_u128`, deferred structural pickup respawn, `732`-byte little-endian canonical state vector) was executed for `100,000` ticks across **five machines, three ISAs (`arm64`/`AArch64`, `x86_64`, `wasm32`), two operating systems (`macOS 27.2.1`, `Ubuntu Linux 6.8 / 7.0`), and six language/compiler projections (`25` target × host cells)**:

| Host (`ISA` · `OS`) | Target projection | Wall ms / `100k` (mean ± SD) | `ns / tick` | Telemetry channel (`reported_j`) | `reported_j` / `100k` (J) | Verified `SHA-256` checkpoints |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_native` (`rustc 1.100 -O`) | `22.333 ± 5.043` | `223.3` | `L3` per-PID `ri_energy_nj` | **`0.1028 ± 0.0247`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `cpp20_clang_o3` (`Apple Clang 21`) | `21.022 ± 1.657` | `210.2` | `L3` per-PID `ri_energy_nj` | **`0.1090 ± 0.0134`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_wasm32_node` (`Node v26.13`) | `84.300 ± 11.334` | `843.0` | `L3` per-PID `ri_energy_nj` | **`0.4480 ± 0.0881`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `javascript_bigint_node` (`ES2024`) | `717.955 ± 36.304` | `7,179.6` | `L3` per-PID `ri_energy_nj` | **`4.4021 ± 0.4048`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `python_3_13` (`CPython 3.13.14`) | `2,945.816 ± 284.033` | `29,458.2` | `L3` per-PID `ri_energy_nj` | **`13.5999 ± 1.9086`** | `100 / 100` (`stride 1,000`) |
| **Apple M3 Ultra** (`arm64` · `macOS 27.2.1`) | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | `L3` per-PID `ri_energy_nj` | **`0.0729` / `0.0755`** | `2 × 1,000 / 1,000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` – `266.8` | `L2` AMD RAPL pkg (core `0.13`–`0.21 J`) | **`1.958` / `2.349` / `2.932`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1,347.80` / `2,546.42` | `1,452.9` – `25,464.2` | `L2` AMD RAPL pkg (core `1.01`–`12.23 J`) | **`14.44` / `115.81` / `181.87`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` – `587.9` | `L2` Intel RAPL pkg (core `1.64`–`2.68 J`) | **`2.062` / `1.888` / `3.026`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1,390.46` / `3,375.07` | `1,583.5` – `33,750.7` | `L2` Intel RAPL pkg (core `5.65`–`124.90 J`) | **`6.89` / `60.79` / `149.48`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **NVIDIA Jetson Thor** (`Armv9-A` `aarch64` · `Linux 6.8`) | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28` (`GCC`) – `4,407.89` (`Py`) | `392.8` – `44,078.9` | CPU-only (`reported_j = null`, GPU untouched) | `null` | `6 × 1,000 / 1,000` (`stride 100`) |

- **Verdict**: **`PASS_ZERO_MISMATCHES` (`0 / 20,500` verified `SHA-256` checkpoints; `0 / 190,000` pairwise stride-`100` comparisons across the `20` full-trace Wave 3 cells)**. Every target on every host produced `2683c3f7cb8b...` at tick `100`, `21fa688e4ee8...` at tick `1,000`, `ea01ba793841...` at tick `50,000`, and `82e404df6475d64d...` at tick `100,000`.
- **Telemetry scope & OS coverage**: Notice why `L2` and `L3` `reported_j` must never be conflated: Apple `L3` `ri_energy_nj` attributes CPU core energy strictly to the benchmarked child PID (`0.073`–`0.109 J` for native Rust/C++), whereas Linux `/sys/class/powercap/intel-rapl:0` (`L2`) integrates socket-wide package power across all background daemons (`1.89`–`2.06 J` package vs `0.13`–`1.83 J` `core` sub-domain). Cross-compilation via `x86_64-w64-mingw32-g++` / `wine64` was checked and absent on the shared Linux runners, and the bare-metal Windows `x86_64` host was powered off during the run; Windows PE execution therefore remains unverified on bare metal, though OS-independent `wasm32-unknown-unknown` matched identically across macOS and Linux on both `arm64` and `x86_64`.

### 6.2 `GE-H2`: Cross-ISA and cross-OS 25,000-tick floating-point drift (`IEEE 754` `f64`)

To test whether `IEEE 754` `binary64` (`f64`) simulations stay synchronized across `x86_64` and `arm64`/`aarch64` when `-ffast-math` is *forbidden*, the identical 16-body chaotic arena was stepped for `25,000` ticks (`~6.94` minutes at `60 Hz`), hashing canonical `IEEE 754` bits (`t_div_ieee_bits`), quantized `10^-3` arena-unit positions (`t_div_macro_1e3`), and discrete gameplay state (`t_div_gameplay`) at every single tick:

| Host / Target A | Host / Target B | Perturbation mechanism | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `arm64` macOS `Clang 21` (`f64_strict`) | AMD Zen 5 & Intel RPL `x86_64` Linux `Clang 21` / `GCC 15.2` | Cross-ISA & Cross-OS `f64` algebraic + `sqrt`, `FMA` off (`-ffp-contract=off`, no trig) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| `x86_64` Linux `glibc 2.43` (`f64_trig`) | `aarch64` Linux `glibc 2.39` (`f64_trig`) | Cross-ISA Linux GNU `glibc` `std::sin/cos` (`-ffp-contract=off`, no `-ffast-math`) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **Cross-OS standard `libm` `std::sin/cos` (`Apple libSystem` vs `GNU glibc`, no `-ffast-math`)** | **`10`** (`0.17 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **Cross-ISA `FMA` lowering (`x86_64 VFMADD/VFNMADD` vs `AArch64 FMADD/FMSUB`, algebraic only, no `-ffast-math`)** | **`406`** (`6.77 s`) | **`7,422`** | **`11,205`** (`186.8 s`) |
| **`x86_64` Linux `Node v22.22` (`f64_trig`)** | **`aarch64` Linux `Node v24.22` (`f64_trig`)** | **Cross-ISA Node.js V8 `Math.sin/cos` (`x86_64` vs `aarch64`)** | **`66`** (`1.10 s`) | **`7,617`** | **`10,093`** (`168.2 s`) |
| **`cpp_f64_strict` (`-ffp-contract=off`)** | **`cpp_f64_fma` / `-ffast-math`** | **Same-host `FMA` contraction (`-ffp-contract=off` vs `-ffp-contract=fast`)** | **`192`** (`3.20 s`) | **`5,927`–`6,576`** | **`8,869`–`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **Precision step-down (`binary64` `f64` vs `binary32` `f32`)** | **`1`** | **`8`–`9`** | **`1,370`–`2,240`** |

Three sharp cross-ISA findings emerge:
1. **IEEE 754-2008 `+`, `-`, `*`, `/`, and `sqrt` with `FMA` disabled (`-ffp-contract=off`) are bitwise portable across `x86_64` and `arm64`/`aarch64`** (`0` mismatches over `25,000` ticks across `Clang`, `GCC`, `Rustc`, and `V8`), because all five operations are mandated to round to `0.5` ULP.
2. **Standard C++ `std::sin`/`std::cos` breaks cross-OS determinism at tick `10` (`0.17 s`) even with `-ffp-contract=off -fno-fast-math`**: Apple's `libSystem` `libm` and GNU `glibc` round a steering impulse differently by `1` ULP at tick `10`, which chaotic 16-body collisions amplify into `> 10^-3` position error by tick `5,900` and discrete score/pickup desynchronization by tick `9,798` (`163.3 s`).
3. **Compiler default `FMA` contraction (`-ffp-contract=fast`, without `-ffast-math` or any trigonometry) breaks cross-ISA determinism at tick `406` (`6.77 s`)**: while AMD Zen 5 and Intel Raptor Lake agree bit-for-bit on `x86_64` (`844172b5...`), and Apple M3 Ultra and Jetson Thor agree bit-for-bit on `AArch64` (`deeb446c...`), LLVM lowers negated multiply-subtract expressions differently across `x86_64` (`AVX2` `VFMADD`/`VFNMADD`) and `AArch64` (`NEON` `FMADD`/`FMSUB`), desynchronizing gameplay at tick `11,205`.

### 6.3 `GE-H3`: Cross-GPU headless `wgpu` (`Metal` / `Vulkan`) rendering tolerance

To test the right-hand side of Figure 1 empirically, a self-contained Rust headless `wgpu` (`v22.1.0`) benchmark (`ge_h3_wgpu_bench`) rendered four canonical `Q32.32` simulation snapshots (`ticks 0, 250, 1,000, 10,000`) into `512×512` `RGBA8Unorm` framebuffers (`262,144` pixels, `1,048,576` bytes/frame) via a two-pass WGSL pipeline (trigonometric procedural radar/grid background + `20` declaration-ordered `SrcAlpha / OneMinusSrcAlpha` alpha-blended SDF and Blinn-Phong lit 3D sphere/torus entities), alongside a zero-float `CPU Q16.16` integer software reference rasterizer:

| Adapter A (`API` · Driver) | Adapter B (`API` · Driver) | Mean differing pixels (`%`) | Max $|\Delta|$ (`0..255`) | Mean MAE (`u8`) | Mean RMSE (`u8`) | Min `PSNR` (`dB`) | Min `SSIM` | `GE-H3` Gate |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **Apple M3 Ultra (`Metal` 4)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `1.301%` | `2` | `0.00386` | `0.06215` | **`72.06`** | **`0.999986`** | **Pass** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Apple M3 Ultra (`Metal` 4)** | `3.103%` | `1` | `0.00788` | `0.08876` | **`69.09`** | **`0.999956`** | **Pass** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `3.774%` | `2` | `0.01022` | `0.10116` | **`67.97`** | **`0.999951`** | **Pass** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `6.553%` | `2` | `0.01735` | `0.13179` | **`65.64`** | **`0.999874`** | **Pass** |
| **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `8.280%` | `2` | `0.02149` | `0.14667` | **`64.79`** | **`0.999844`** | **Pass** |
| **Apple M3 Ultra (`Metal` 4)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `9.337%` | `2` | `0.02467` | `0.15720` | **`64.16`** | **`0.999833`** | **Pass** |
| Physical GPUs (`4` vendors) | `Mesa llvmpipe` (`LLVM 21.1.8` CPU `Vulkan`) | `1.541%` – `9.633%` | `2` – `3` | `0.00477` – `0.02601` | `0.06895` – `0.16173` | `63.86` – `70.87` | `0.999828` – `0.999984` | **Pass** |
| Physical GPUs (`4` vendors) | `CPU Q16.16` Zero-Float Integer Reference | `20.400%` – `27.626%` | `2` | `0.05612` – `0.07864` | `0.23689` – `0.28068` | `59.13` – `60.58` | `0.999556` – `0.999693` | **Pass** |

- **Bit-exactness falsified, bounded tolerance confirmed (`24 / 24` physical GPU frame pairs)**: Every physical GPU pair produced distinct raw `RGBA8` `SHA-256` digests (`0 / 24` bitwise matches) due to hardware SFU `sin`/`cos`/`pow` approximations and `unorm8` ROP blend rounding, yet **zero pixels on any physical GPU pair differed by more than `2 / 255`** ($p(|\Delta| > 8) = 0.000000 \le 0.001$), `PSNR` exceeded `64.16 dB` (`> 40.0 dB` gate), and `SSIM` exceeded `0.999833` (`> 0.999` gate) at `0.31`–`2.80 ms` per frame.
- **Software rasterizer contrast**: The zero-float `CPU Q16.16` integer software rasterizer achieved `0` `SHA-256` framebuffer mismatches across `Apple M3 Ultra` (`arm64`), `AMD Zen 5` (`x86_64`), and `Intel Raptor Lake` (`x86_64`) (`9c693a38...` at tick `0`, `ce3b2cec...` at tick `10,000`), and `Mesa llvmpipe` (`LLVM 21.1.8`) matched bitwise between AMD and Intel `x86_64` hosts (`ccb291f6...` at tick `0`), illustrating that pixel divergence stems specifically from GPU shader/ROP hardware variability rather than scene projection $\lambda(s_t)$.

### 6.4 Playable joule-native `Q32.32` Chrono-Budget Arena (`/living/game-engines/`)

Joining this study's exact `Q32.32` replay contract with the energy-native temporal mechanics of [Time as an Index](/papers/time-as-an-index/) (Section 9.2), Instrument 4 of [`/living/game-engines/`](/living/game-engines/) ships a playable `60 Hz` deterministic orbital-navigation and pickup-defense mini-game running in JavaScript `BigInt` (`0` floating-point operations inside simulation):

- **Live `SHA-256` state tape & deterministic replay**: Every tick updates a rolling `SHA-256` state digest and records compact 1-byte player input events into $D$; clicking `Replay & Verify SHA-256` re-executes the entire match from `(seed, D)` and verifies bitwise hash equality (`replayed_sha256 === live_sha256`).
- **Joule-budgeted temporal lookahead & rewind (`est_j` design model)**: Querying future trajectories (`Hellman Branch Preview`, simulating `3` candidate steering branches `K` ticks ahead) or rewinding to a persistent causal checkpoint debits an explicit microjoule (`µJ`) battery (`step_cost_uj` per speculative tick plus Landauer branch-erasure cost when non-chosen futures or rewound timelines are discarded), playable via keyboard, mouse/touch, and `WebXR` / `Gamepad` controllers (including Meta Quest Browser).

## 7. Infeasibility flags

1. **Cross-GPU bit-exact hardware rendering: infeasible (`0 / 24` `SHA-256` matches across `Metal`, `RADV`, `NVIDIA`, and `ANV` in `GE-H3`), whereas bounded perceptual tolerance (`PSNR > 64 dB`, `SSIM > 0.9998`, $\Delta_{\max} \le 2$) holds when GPU outputs never feed back into $S$.**
2. **Cross-platform exact physics with stock floating-point settings: infeasible.** Even *without* `-ffast-math`, cross-OS `std::sin`/`std::cos` (`Apple libm` vs `GNU glibc`) diverges at tick `10` and cross-ISA `FMA` lowering (`x86_64` vs `arm64` `-ffp-contract=fast`) diverges at tick `406`, cascading into gameplay desynchronization within `9,798`–`11,205` ticks (`GE-H2`).
3. **GPU compute inside the simulation: infeasible as exact; feasible only with deterministic reductions** at a measured cost of about 0.2% to 7.8% on the cited hardware, and still subject to compiler contraction unless guarded per instruction (SPIR-V NoContraction) on every target.
4. **Engine-portable behavior: not demonstrated in any external source read; demonstrated at the 2D physics kernel level in `GE-H1` across `25` target × host cells (`5` machines, `3` ISAs, `6` runtimes/compilers), while full engine projections (`GE-H4`, `GE-H9`) remain open.**
5. **Interpreted rules at large actor counts: constrained.** The GameRule measurement implies a ceiling near 300 actors at 20 ms (`GE-H1` further shows Python `int` costs `73×`–`132×` native Rust `reported_j` across Intel, AMD, and Apple Silicon); a compiled native or WebAssembly projection is required at scale.
6. **Proprietary engines and bare-metal Windows targets as exact targets: unverified.** Unity's manual, as quoted by GameRule, disclaims ordering guarantees; the Unity and Unreal template catalogs could not be read (their pages render client-side), no Unreal execution-order source was read, and bare-metal Windows `PE` execution was not active in the Wave 3 Linux/macOS runner pool.

## 8. Sources and limits

Every source above was read in full at the passage cited, except: the GameCraft-Bench paper (abstract and repository README read), the RCE about page (summary page read), and the Capcom press story (one article). Companion house studies cited for telemetry levels (`SATB`) and joule-budgeted temporal game mechanics are [Time as an Index](/papers/time-as-an-index/) and the [Satiation Tiered Benchmark Harness](/papers/satb-harness/) (`[same house]`). Sources consulted but not cited as evidence: the [Ludii portal](https://ludii.games/), which describes games as structured sets of ludemes; the Game Grammar hobby repository; and the [PlayCanvas](https://github.com/playcanvas/engine), [Babylon.js](https://github.com/BabylonJS/Babylon.js) and [three.js](https://github.com/mrdoob/three.js) READMEs, which describe rendering libraries rather than game description formats.

Not read, paywalled or otherwise unavailable: T. Schaul, "A Video Game Description Language for Model-based or Interactive Learning," IEEE CIG 2013, doi:10.1109/CIG.2013.6633610; J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845. M. Ebner et al., "Towards a Video Game Description Language," doi:10.4230/DFU.Vol6.12191.85, is open access but was not read for this study.

In Section 6, `GE-H1`, `GE-H2`, and `GE-H3` leave `measured_j = None` and `board_metered = false` across all runs (separating macOS `L3` per-process `ri_energy_nj` from Linux `L2` socket/core `RAPL` `reported_j`, and keeping the Chrono-Budget Arena's `est_j` mechanics strictly analytical). Bare-metal Windows `PE` execution, Direct3D 12 `wgpu` rendering, and multi-engine emitters (`GE-H4`–`GE-H9`) remain open work.
