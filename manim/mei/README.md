# MEI Manim scenes (research.openie.dev)

Render with Manim Community Edition ≥0.19 (Mac has 0.21.0 via Homebrew).
**No LaTeX required** — scenes use `Text` (unicode) not `MathTex`.

```bash
cd /Users/dcharlot/data-share/vibe-coding/research-openie-web/manim/mei
manim -qm --fps 30 --format=mp4 scenes/dual_scale.py DualScaleBudget
manim -qm --fps 30 --format=mp4 scenes/obtain_router.py ObtainRouterJmQ

# encode + land (example):
# ffmpeg -y -i media/videos/dual_scale/720p30/DualScaleBudget.mp4 \
#   -c:v libx264 -pix_fmt yuv420p -movflags +faststart \
#   ../../public/living/mei/media/mei-diag-01-dual-scale.mp4
# ffmpeg gif (fps=12,scale=960) + webm (libvpx-vp9 crf 35) similarly
```

Living IDs: `mei-diag-01-dual-scale`, `mei-diag-02-obtain-router` → `public/living/mei/media/`.

Backlog (not yet rendered): `mei-diag-03` grid lever order motion; enzyme vs MLP bar motion.

Honesty: never invent measured_j or board watts; estimates labeled; board_synth_claimed=false.
