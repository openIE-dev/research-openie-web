# NI Manim scenes (research.openie.dev)

Manim Community Edition ≥0.19 (Mac Homebrew 0.21.0).
No LaTeX. Scenes use `Text` (unicode), not `MathTex`.

```bash
cd /Users/dcharlot/data-share/vibe-coding/research-openie-web/manim/ni
manim -qm --fps 30 --format=mp4 scenes/lineage.py NotationalLineage
manim -qm --fps 30 --format=mp4 scenes/commit_stack.py CommitStackCompose
manim -qm --fps 30 --format=mp4 scenes/joule_tiers.py JouleTierLadder
```

Living IDs → `public/living/ni/media/`:
- `ni-inf-01-lineage`
- `ni-diag-02-commit-stack`
- `ni-inf-02-joule-tiers`

Honesty: no invented measured_j or board watts. Tier A = surrogate. board_synth_claimed=false.
Voice: short teacher lines (compute-video / energy-video pacing). No marketing slogans.
