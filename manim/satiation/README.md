# Satiation Manim scenes (research.openie.dev)

Manim Community Edition ≥0.19 (Mac Homebrew 0.21.0).
No LaTeX. Scenes use `Text` (unicode), not `MathTex`.

```bash
cd /Users/dcharlot/data-share/vibe-coding/research-openie-web/manim/satiation
manim -qm --fps 30 --format=mp4 scenes/engagement_lens.py EngagementVsDone
manim -qm --fps 30 --format=mp4 scenes/refuse_venn.py RefuseDoneUnsafe
manim -qm --fps 30 --format=mp4 scenes/bliss_point.py BlissPointGeometry
```

Living IDs → `public/living/satiation/media/`:
- `sat-inf-01-engagement-lens`
- `sat-diag-01-refuse-venn`
- `sat-fig-01-bliss-point`

Honesty: no invented measured_j or board watts. Bliss is textbook geometry (Andersen lineage), not agent eval. Epoch figures stay on sat-fig-02 cite chips only. board_synth_claimed=false.
Voice: short teacher lines (compute-video / energy-video pacing). No em-dashes. No marketing slogans.
