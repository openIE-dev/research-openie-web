# research.openie.dev

OpenIE research hub. Live at **research.openie.dev**.

**IA (locked):**
- `/papers/{ni,satiation}/` — readable research study prose (draft papers)
- `/pdfs/{ni,satiation}.pdf` — real downloadable study PDFs
- `/living/` — **interactive figures** (P0 stubs), not papers
- Status honesty: research study · draft; `board_synth_claimed=false`

No paid research services in the product stack.

## Stack

- Astro 5
- Tailwind 4
- Study markdown: `src/content/papers/*.md`
- PDFs generated into `public/pdfs/` (pandoc + weasyprint)

## Build

```bash
pnpm install
pnpm build
```

Dev:

```bash
pnpm dev
```

Regenerate PDFs (Mac; needs pandoc + weasyprint):

```bash
./scripts/generate-pdfs.sh
```

## Deploy

Production: Tailscale `100.64.224.0` (Mac Studio) via Cloudflare Tunnel → Caddy `:8443`.

```bash
/Users/dcharlot/data-share/vibe-coding/site-ops/deploy/deploy.sh research
```

## Permanence / GitHub

- Canonical site: https://github.com/openIE-dev/research-openie-web
- Drafting tree: sibling `openie-web/research/` (personal remotes — not canonical)

## Source studies

Authoritative study prose often originates from `wca-lut-edge/artifacts/*_STUDY.md`.
Copy/clean into `src/content/papers/` then regenerate PDFs.
Figure shells often originate from `wca-lut-edge/artifacts/living/` → `public/living/`.
