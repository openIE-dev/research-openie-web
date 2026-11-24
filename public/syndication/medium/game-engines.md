# Writing a Game Once and Running It Everywhere: Where Exact Replay Ends and Tolerance Begins

*0 Replay Drift Across 3 OSes · 9/9 Suites Pass — Write a game once: exact whole-number physics holds zero drift across Windows, macOS, and Linux, while GPU pixels stay behind a one-way gate.*

> **Public Domain (`CC0-1.0`) · OpenIE Research Essay**  
> **Canonical Primary Source**: [https://research.openie.dev/papers/game-engines/](https://research.openie.dev/papers/game-engines/)  
> **Canonical Artifact ID**: `blake3:tv:77911a4ef555be4fc2b485790d43a76cff398719ebebd3b0f3f9c1fffa353adb` · **Gate Invariant**: `human_in_gate = false`

---

## Three Plain-Language Takeaways (Zero Acronym Soup)

1. Using exact whole-number physics, one game blueprint replays identically for hours across Windows, macOS, Linux, and major engines.
2. Standard decimal math drifts across operating systems within thirty-seven frames, and chaotic collisions quickly amplify tiny rounding gaps.
3. Graphics cards vary slightly pixel by pixel, so visual rendering must sit downstream behind a strict one-way tolerance gate.

![Writing a Game Once and Running It Everywhere: Where Exact Replay Ends and Tolerance Begins — OpenIE Research TV Studio Poster](https://research.openie.dev/media/tv/posters/game-engines-poster.jpg)
*Studio key visual for **Writing a Game Once** (`Reality Code Engine` · 0 Replay Drift Across 3 OSes · 9/9 Suites Pass). Dedicated to the public domain under `CC0-1.0`.*

## Everyday Analogy & Why It Matters

In a chaotic billiard break, a microscopic decimal rounding gap between Windows and macOS snowballs into a totally different game within seconds. Whole-number physics locks the score, while graphics cards paint the screen. Writing game rules once as a checked blueprint cuts Unity C-sharp code seventy-six percent, steps ten thousand actors in fifty-eight microseconds, and replays hour-long matches cleanly.

Game studios burn fortunes rewriting the same gameplay across Unity, Unreal, Bevy, and Godot—or hunting baffling multiplayer desynchronizations. The breakthrough comes from separating layers that require exact bit-for-bit agreement from layers that only paint pixels. We place physics simulation and gameplay scripts inside one checked Reality Code Engine blueprint using sixty-four-bit fixed-point whole numbers, static wiring checks that catch ninety-eight point five percent of broken scene and signal links, and a strict one-way rendering wall.

Across thirty compiler-and-machine combinations and three one-hour replays driven by forty-five-kilobyte input logs alone, whole-number simulation hit zero state mismatches. Meanwhile all twenty-eight DirectX 12, Apple Metal, and Vulkan hardware pairs stayed within two tiny color steps. Compiled C plus plus projections step ten thousand actors in point zero five eight milliseconds—using over seven thousand times less chip energy than interpreted Python—and match all thirty-six headless Godot tasks tick for tick.

## Inside the Mechanism & Candid Limits

Modern game engines tangle gameplay rules, rigid-body collisions, scene asset links, and graphics shaders into one big loop. Even with strict floating-point compiler flags enabled, standard sine and cosine libraries on Windows, macOS, and Linux disagree within ten to thirty-seven frames—shattering cross-machine multiplayer replays in less than one second. Picture a break shot on a billiard table: every collision multiplies any microscopic angle error exponentially along its chaos slope. Across eight hundred forty paired chaotic trajectories, tightening initial decimal precision more than four trillionfold bought only six to fourteen extra seconds before simulated worlds diverged completely.

Our nine-suite empirical study draws a sharp architectural line. Upstream, simulation and gameplay scripts run in sixty-four-bit fixed-point whole-number arithmetic inside one checked blueprint, while static manifest checks catch one hundred twenty-eight of one hundred thirty broken scene and signal faults before launch. Downstream, graphics shaders only read state. Upstream, deterministic whole-number arithmetic holds every state checkpoint identical across Rust, C plus plus, WebAssembly, JavaScript, and Python—replaying three full one-hour, two-hundred-sixteen-thousand-frame sessions across Windows, Linux, and macOS from forty-four-point-six-kilobyte input logs alone, up to two hundred ninety times smaller than compressed state snapshots.

This three-dimensional gyroscopic arena shows Apple Silicon macOS, Zen and Intel Linux, and bare-metal Windows 11 locked in exact simulation phase across thirty host-and-language combinations—while an unguarded floating-point ghost trajectory peels away within frames whenever transcendental functions or fused multiply-add instructions enter collisions. Across seventeen game behaviors from Haunted Jaunt, Survival Shooter, and Tanks, blueprints cut behavior code seventy-six percent versus Unity C-sharp, sixty-one percent versus Bevy Rust, and fifty-two percent versus Godot script with zero trace mismatches. Compiled C plus plus steps ten thousand actors in fifty-eight microseconds and one point seven millijoules, and thirty-six Godot tasks match tick-for-tick. Testing eight hardware graphics endpoints across DirectX 12, Apple Metal, and Vulkan proved a crucial negative boundary: even on the exact same Nvidia or Intel card, switching DirectX 12 to Vulkan flips one tiny color step out of two hundred fifty-five.

Perceptual tolerance passes all twenty-eight hardware pairs cleanly, all nine falsifier suites stand closed, and chip counters claim no wall power meter.

### Epistemic Evidence Tags (`[T]` / `[E]` / `[M]` / `[S]`)

- **`[T]` Theorem / Machine-Checked Formal Proof**
- **`[E]` Empirical / Hardware-Instrumented Experiment**
- **`[M]` Mathematical / Analytical Cost or Physics Model**

## How Energy Was Metered

Open Interface Engineering enforces strict epistemic non-mixing across physical power rails, processor counters, and mathematical bounds (`measured_j` $\perp$ `reported_j` $\perp$ `est_j` $\perp$ `unmetered` — cross-class addition is forbidden by `ScientificGate`):

- **Acquisition Tier**: Chip Energy Counter
- **Plain-Language Disclosure**: Built-in macOS and Linux chip counters across 6 machines; no wall meter used.
- **Substrate Evidence Class**: `unmetered` (`board_metered = false`)
- **Primary Reading**: `unmetered (joules = null; never fabricated as zero)`
- **Meter or Formula**: Six-host Q32.32 lockstep & wgpu PSNR/SSIM reproducibility audit; measured_j unset
- **300 K Landauer Bit-Equivalents**: `null` (unmetered study — analytical/archival scope)

## Continue the Discussion & Verify Every Byte

<!-- x_thread_backlink_slot: {{X_THREAD_URL}} -->
- **Watch in 15 Seconds or 3 Minutes**: Stream the native `9:16` Vertical Snackable ([`game-engines-tiktok.mp4`](https://research.openie.dev/media/tv/tiktok/game-engines-tiktok.mp4)) or explore all four captioned studio cuts (`15s`, `45s`, `90s`, and `3m` 3D cutaway documentary) on **[OpenIE Research TV](https://research.openie.dev/tv/?study=game-engines)**.
- **Join the Synchronized X (Twitter) Thread**: Reply, critique, or inspect the 5-post verification thread on **[X (Twitter)](https://x.com/search?q=%22Writing%20a%20Game%20Once%22%20OR%20research.openie.dev%2Ftv%2F%3Fstudy%3Dgame-engines&src=typed_query)**.
- **Query Grounded Prior Art & Signed WAI1 Receipts**: Explore linked lineage trails on **[The Commons (`scholar.askdavidc.ai`)](https://scholar.askdavidc.ai)**, read the full primary paper & PDF at **[`research.openie.dev/papers/game-engines/`](https://research.openie.dev/papers/game-engines/)**, and verify the Ed25519-signed `WAI1` binary container (`blake3:5896457ae35ac9d2…`) in **[`openie-artifact-substrate`](https://github.com/openIE-dev/openie-artifact-substrate/blob/main/catalog/envelopes/tv-game-engines.wai)**.

---

*Summary & essay text dedicated to the public domain under [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/). Code, verification gates, and `WAI1` schemas licensed under `Apache-2.0`.*
