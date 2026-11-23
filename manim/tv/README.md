# OpenIE Research TV — Reproducible 84-Film Generator (`manim/tv/`)

Reproducible broadcast studio pipeline for **OpenIE Research TV (`/tv/`)**, generating:
- **`84` distinct `1280×720` (`30 fps`, `H.264` + `AAC 128k`) research films** across all `21` OpenIE studies and `4` bespoke pedagogical depth tiers:
  1. **`5s` ("The Flash" · `5.0–7.0 s`)**: One-sentence thesis, animated kinetic metric reveal, and 3D/vector visual signature.
  2. **`30s` ("The Elevator" · `27–35 s`)**: Four-scene arc (*Hook Question -> Surprising Bottleneck -> Counter-Intuitive Mechanism -> Verified Receipt*).
  3. **`60s` ("The Briefing" · `55–66 s`)**: Five-scene mechanism walkthrough (*Stakes -> Multi-Stage Architecture -> Governing Formula/Bound -> Quantitative Benchmark -> Plain-Language Takeaway*).
  4. **`90s` ("The Lab Cut" · `84–98 s`)**: Six-scene documentary cut incorporating headless **Blender 5.3 EEVEE 3D domain cutaways**, formal proof callouts, multi-host telemetry, and explicit falsifier audits.
- **`84` frame-accurate `WebVTT` caption tracks** (`public/media/tv/captions/<study_id>-<tier>.vtt`).
- **`21` high-DPI `1280×720` studio posters** (`public/media/tv/posters/<study_id>-poster.jpg`).
- **`src/data/tv-catalog.json`**: Complete manifest with exact `duration_s`, `bytes`, `sha256`, `hook`, `transcript`, synced `cues`, `[T]/[E]/[M]/[S]` epistemic tags, and energy provenance tiers.

## Visual Algebra & Honesty Contract

All scenes follow OpenIE's 4-color visual algebra on an obsidian `#0b1020` coordinate canvas:
- **Amber (`#f59e0b`)**: Joules, power rails, and thermodynamic budgets
- **Cyan (`#22d3ee`)**: Signal, lossless Form, state transitions, and information
- **Emerald (`#10b981`)**: Verified commit gates, kernel-checked theorems, and passing checks
- **Rose (`#f43f5e`)**: Unverified drift, Byzantine faults, and active falsifiers

**Narration & Energy Metering Disclosure**:
- Studio voiceover is AI-synthesized from deterministic scripts strictly bound to verified OpenIE study artifacts.
- Energy readings strictly distinguish **`measured_j`** (physical rail shunts: AMD Kria `KV260` `INA260` in `gates`, and `NVIDIA Jetson AGX Thor` `TI INA238`/`INA3221` in `satb-harness` and `communication-avalanche`), **`reported_j`** (`RAPL`, `IOReport`, `NVML`), and **`est_j`** (analytical/datasheet schedules).

## Module Layout

- `blender_cutaways.py`: Headless Blender 5.3 EEVEE generator for the 10 seamless 90-frame RGBA 3D hardware and mathematical cutaways.
- `studies_part1.py`, `studies_part2.py`, `studies_part3.py`: Bespoke 4-tier scripts, equations, state-machine nodes, benchmark bars, and falsifier badges for all 21 studies.
- `audio_studio.py`: Neural voiceover cue synthesis, closed-loop duration calibration, `-30 dB` ambient harmonic synth pad + transition chimes, EBU R128 `loudnorm`, and `WebVTT` export.
- `visual_scenes.py`: `1280×720` `pycairo` vector motion-graphics and 3D alpha-compositing renderer.
- `render_tv_films.py`: Parallel render, `ffprobe` validation, `SHA-256` hashing, and `tv-catalog.json` emitter.

## Reproduction

```bash
# 1. Render the 10 seamless 3D cutaway turntables in Blender 5.3
blender -b -P manim/tv/blender_cutaways.py -- --out-dir ./build_tv/cutaways_3d

# 2. Synthesize audio, captions, posters, all 84 MP4 films, and tv-catalog.json
python3 manim/tv/render_tv_films.py \
  --work-dir ./build_tv/work \
  --cutaway-dir ./build_tv/cutaways_3d \
  --media-dir ./public/media/tv \
  --catalog-out ./src/data/tv-catalog.json
```
