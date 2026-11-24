# OpenIE Research TV v3.1 — Plain-Language 108-Film Generator (`manim/tv/`)

Reproducible broadcast studio pipeline for **OpenIE Research TV (`/tv/`)**, generating:
- **`108` distinct `1280×720` (`30 fps`, `H.264` + `AAC 128k` `44.1 kHz`) plain-language research films** across **`27` catalog entries** (`21` published OpenIE research studies in `studies_part1..3.py` + `6` flagship `*.openie.dev` ecosystem channel openers in `ecosystem_studies.py`: `eco-avalanche`, `eco-stack`, `eco-compute`, `eco-synthesis`, `eco-knowledge`, `eco-database`) and `4` telescoping pedagogical depth slots—where **every film starts with the study's 3 high-level layperson bullets (`plain_bullets`)** and expands smoothly with zero unexplained acronyms:
  1. **`15s` ("3 Plain Points" · `15–23 s`)**: Speaks and highlights the 3 plain-language bullets (`bullet_focus_1..3`) so any layperson grasps the core takeaway in under twenty-three seconds.
  2. **`45s` ("Plain + Example" · `40–53 s`)**: Opens with the exact 3 plain-language bullets, adds a vivid everyday analogy (`analogy_spotlight`), and closes with why it matters.
  3. **`90s` ("Full Briefing" · `81–99 s`)**: Opens with the 3 plain-language bullets, illustrates the everyday problem, walks step-by-step through how the method works, and presents the clearest measured outcome.
  4. **`180s` ("3m Deep Cut · 3D" · `162–198 s`)**: Full 10-scene documentary cut opening with the 3 plain-language bullets and expanding into conventional bottlenecks, grounding analogies, step-by-step mechanisms, governing trade-off curves, headless **Blender 5.3 EEVEE 3D architecture turntables**, full empirical results, and candid scientific limits.
- **Automated Zero-Acronym-Soup & 3-Bullet Telescoping Gate (`lint_tv_clarity.py`)**:
  - Deterministically audits all `27` studies and all `108` scripts + on-screen labels before synthesis, refusing internal benchmark IDs, code symbols, commercial jargon, and unexplained technical acronyms, while enforcing identical 3-bullet openings across all four time slots.
- **Global Studio Ensemble (`voices_and_labs.py` + `audio_studio.py`)**:
  - Primary TTS: **`ElevenLabs eleven_v4`** (`mp3_44100_192`) across diverse global voices (`Joy`, `George`, `Hari`, `Mia`, `Hakim`, `Cecily`, `Jenny`, `Gabriel`, `Alice`, `Jyothi`, `Lem`, `River`, `Charlie`, `Bill`, `Sean`, `Misha`, `Osato`, `Edwin`, `Nylo`, `Bobby`, `Julius`), SHA-256 cached in `work_dir/eleven_cache/`.
  - Zero-Key Free Neural Fallback: Automatically falls back to **`edge-tts` multicultural neural voices** when `ELEVENLABS_API_KEY` is unset — robotic OS speech (`/usr/bin/say`) is never used.
- **`108` frame-accurate `WebVTT` caption tracks** (`public/media/tv/captions/<study_id>-<tier>.vtt`).
- **`27` high-DPI `1280×720` plain-language 3-bullet posters** (`public/media/tv/posters/<study_id>-poster.jpg`).
- **`src/data/tv-catalog.json` (`v3.1.0`)**: Complete manifest including `plain_bullets`, `duration_s`, `bytes`, `sha256`, `hook`, `transcript`, synced `cues`, `narrator_name`, `narrator_profile`, `tutorial_lab_id`, and plain-language energy measurement disclosures.

## Reproduction

```bash
# 1. Lint all 27 studies & 108 scripts for 3-bullet telescoping and zero acronym soup
python3 manim/tv/lint_tv_clarity.py

# 2. Render the 10 seamless 3D cutaway turntables in Blender 5.3
blender -b -P manim/tv/blender_cutaways.py -- --out-dir ./build_tv/cutaways_3d

# 3a. Full 27-study (108-film) render
python3 manim/tv/render_tv_films.py \
  --work-dir ./build_tv/work \
  --cutaway-dir ./build_tv/cutaways_3d \
  --media-dir ./public/media/tv \
  --catalog-out ./src/data/tv-catalog.json

# 3b. Incremental render of ONLY the 6 *.openie.dev channel openers (preserving existing 21 studies)
python3 manim/tv/render_tv_films.py \
  --only-ids eco-avalanche,eco-stack,eco-compute,eco-synthesis,eco-knowledge,eco-database \
  --require-elevenlabs \
  --work-dir ./build_tv/work \
  --cutaway-dir ./build_tv/cutaways_3d \
  --media-dir ./public/media/tv \
  --catalog-out ./src/data/tv-catalog.json
```
