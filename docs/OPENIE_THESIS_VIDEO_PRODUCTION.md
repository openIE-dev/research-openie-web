# Production plan — OpenIE thesis film

## Goal

A dedicated ~2.5–3.5 minute OpenIE thesis film that teaches:

**Energy Efficient + Resource Efficient compute for Intelligent Computer Automation**

with light, jargon-light touches of MoL floors, NI commit/refuse, and satiation/scarcity.

## Pipeline (reuse, do not invent)

Adapted from `openie-mission-video` + `compute-video` + photo-real habits from `shoal-video` / `energy-video`:

1. `production_plan.py` — narration, BFL prompts, Manim keys  
2. `generate_narration.py` — ElevenLabs George → `narration/<key>.mp3`  
3. `generate_backgrounds.py` — BFL Flux → `images/<key>.jpg`  
4. `manim_overlays.py` — transparent overlays → `overlays/<key>.mov`  
5. `assemble_video.py` — Ken Burns + overlay + mux → `segments/` → `output/openie-thesis-ee-re-ica.mp4`

**Not used:** Remotion, After Effects, faeble (deprecated).

## Visual treatment by scene

| Scene | Treatment |
| --- | --- |
| 01 hook, 04 automation, 06 scarcity, 09 close | Photo-real BFL plates (shoal/energy documentary feel where living/scarce) |
| 02 two efficiencies | Photo-real split plate + Manim EE/RE labels |
| 03 floors, 05 commit/refuse, 07 stack, 08 honesty | Manim primary on dark plate; formulas and gates |

Music bed policy: low, continuous, non-melodic bed under −18 LUFS relative to VO; duck −6 dB under speech; no vocal samples; optional silence for honesty beat (08). Prefer reuse of corridor/mission bed library if licensed; otherwise dry VO for v0.

## Claim hygiene

- Every on-screen energy figure: illustrative or analytical.
- Burn `board_synth_claimed=false` into scene 08 overlay (and captions).
- No measured board watts. No invented joules.

## Output paths

- Project: `/Users/dcharlot/data-share/vibe-coding/openie-thesis-video/`
- Final mp4: `output/openie-thesis-ee-re-ica.mp4`
- Inventory mirror: `docs/` + box `/workspace/openie-thesis-video-refs.md`
- Optional later publish note under `research-openie-web/docs/`

## Music / VO / delivery

- VO primary: George `JBFqnCBsd6RMkjVDRZzb`, model `eleven_flash_v2_5`
- Optional elevated: Sarah
- Delivery page: research.openie.dev living thesis page TBD (not this pass)
