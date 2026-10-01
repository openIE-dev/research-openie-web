# MoL Manim scenes (research.openie.dev)

Render with Manim Community Edition ≥0.19 (Mac has 0.21.0 via Homebrew).
**No LaTeX required** — scenes use `Text` (unicode) not `MathTex`.

```bash
cd /Users/dcharlot/data-share/vibe-coding/research-openie-web/manim/mol
manim -qm --fps 30 --format=mp4 scenes/lineage.py LineageCompress
manim -qm --fps 30 --format=mp4 scenes/cascade.py CascadeLast
manim -qm --fps 30 --format=mp4 scenes/floors.py EnergyFloorEstimate
manim -qm --fps 30 --format=mp4 scenes/close.py CloseReceipt
manim -qm --fps 30 --format=mp4 scenes/mol_not_moe.py MolNotMoe

# encode + land (example for floors):
# ffmpeg -y -i media/videos/floors/720p30/EnergyFloorEstimate.mp4 \
#   -c:v libx264 -pix_fmt yuv420p -movflags +faststart \
#   ../../public/living/mol/media/mol-diag-02-floors.mp4
# ffmpeg gif (fps=12,scale=960) + webm (libvpx-vp9 crf 35) similarly
```

Living IDs: `mol-inf-01-lineage`, `mol-diag-01-cascade`, `mol-diag-02-floors`,
`mol-diag-03-close`, `mol-tab-01-not-moe` → `public/living/mol/media/`.

Honesty: never invent measured_j or board watts; Landauer = labeled estimate; board_synth_claimed=false.
