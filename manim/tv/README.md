# OpenIE Research TV v3.0 — Plain-Language 84-Film Generator (`manim/tv/`)

Reproducible broadcast studio pipeline for **OpenIE Research TV (`/tv/`)**, generating:
- **`84` distinct `1280×720` (`30 fps`, `H.264` + `AAC 128k` `44.1 kHz`) plain-language research films** across all `21` OpenIE studies and `4` telescoping pedagogical depth slots—where **every film starts with the paper's 3 high-level layperson bullets (`plain_bullets`)** and expands smoothly with zero unexplained acronyms:
  1. **`15s` ("3 Plain Points" · `15–23 s`)**: Speaks and highlights the 3 plain-language bullets (`bullet_focus_1..3`) so any layperson grasps the whole paper in under twenty seconds.
  2. **`45s` ("Plain + Example" · `40–53 s`)**: Opens with the exact 3 plain-language bullets, adds a vivid everyday analogy (`analogy_spotlight`), and closes with why it matters.
  3. **`90s` ("Full Briefing" · `81–99 s`)**: Opens with the 3 plain-language bullets, illustrates the everyday problem, walks step-by-step through how the method works, and presents the clearest measured outcome.
  4. **`180s` ("3m Deep Cut · 3D" · `162–198 s`)**: Full 10-scene documentary cut opening with the 3 plain-language bullets and expanding into conventional bottlenecks, grounding analogies, step-by-step mechanisms, governing trade-off curves, headless **Blender 5.3 EEVEE 3D architecture turntables**, full empirical results, and candid scientific limits.
- **Automated Zero-Acronym-Soup & 3-Bullet Telescoping Gate (`lint_tv_clarity.py`)**:
  - Deterministically audits all 21 studies and all 84 scripts + on-screen labels before synthesis, refusing internal benchmark IDs, code symbols, and unexplained technical acronyms, while enforcing identical 3-bullet openings across all four time slots.
- **21-Presenter Global Studio Ensemble (`voices_and_labs.py` + `audio_studio.py`)**:
  - Primary TTS: **`ElevenLabs eleven_v4`** (`mp3_44100_192`) with `1` distinct presenter per study across global accents, ages, and genders (`Joy`, `George`, `Hari`, `Mia`, `Hakim`, `Cecily`, `Jenny`, `Gabriel`, `Alice`, `Jyothi`, `Lem`, `River`, `Charlie`, `Bill`, `Sean`, `Misha`, `Osato`, `Edwin`, `Nylo`, `Bobby`, `Julius`), SHA-256 cached in `work_dir/eleven_cache/`.
  - Zero-Key Free Neural Fallback: Automatically falls back to **`edge-tts` multicultural neural voices** when `ELEVENLABS_API_KEY` is unset — robotic OS speech (`/usr/bin/say`) is never used.
- **`84` frame-accurate `WebVTT` caption tracks** (`public/media/tv/captions/<study_id>-<tier>.vtt`).
- **`21` high-DPI `1280×720` plain-language 3-bullet posters** (`public/media/tv/posters/<study_id>-poster.jpg`).
- **`src/data/tv-catalog.json` (`v3.0.0`)**: Complete manifest including `plain_bullets`, `duration_s`, `bytes`, `sha256`, `hook`, `transcript`, synced `cues`, `narrator_name`, `narrator_profile`, `tutorial_lab_id`, and plain-language energy measurement disclosures.

## Reproduction

```bash
# 1. Lint all 21 studies & 84 scripts for 3-bullet telescoping and zero acronym soup
python3 manim/tv/lint_tv_clarity.py

# 2. Render the 10 seamless 3D cutaway turntables in Blender 5.3
blender -b -P manim/tv/blender_cutaways.py -- --out-dir ./build_tv/cutaways_3d

# 3. Synthesize audio (set ELEVENLABS_API_KEY in env for eleven_v4, or omit for edge-tts neural fallback),
#    render posters, all 84 MP4 films, captions, and tv-catalog.json
python3 manim/tv/render_tv_films.py \
  --work-dir ./build_tv/work \
  --cutaway-dir ./build_tv/cutaways_3d \
  --media-dir ./public/media/tv \
  --catalog-out ./src/data/tv-catalog.json
```
