# research.openie.dev

OpenIE research / living-papers hub. Live at **research.openie.dev**.

Lists research projects (NI Commit Law, Satiation, …). Interactive web is canonical; PDF twin maps the same IDs. No paid research services.

## Stack

- Astro 5
- Tailwind 4

## Build

```bash
pnpm install
pnpm build
```

Dev:

```bash
pnpm dev
```

Living P0 shells ship as static assets under `public/living/` (ES modules need HTTP — use `pnpm preview` or any static server after build). Canonical paper paths:

- `/papers/ni/` → redirect → `/living/ni/`
- `/papers/satiation/` → redirect → `/living/satiation/`

## Deploy

Production: Tailscale `100.64.224.0` (Mac Studio) via Cloudflare Tunnel (`e5522233-…` / joule) → Caddy `:8443`.

```bash
# Preferred:
/Users/dcharlot/data-share/vibe-coding/site-ops/deploy/deploy.sh research

# After Caddyfile hostname changes:
/Users/dcharlot/data-share/vibe-coding/site-ops/deploy/deploy.sh --caddy

# Or manually:
pnpm build
rsync -azq --delete dist/ dcharlot@100.64.224.0:/Users/dcharlot/sites/research-openie-web/
```

## DNS / tunnel

- DNS CNAME (already present): `research.openie.dev` → `e5522233-8dc5-40cb-8001-e073e21c5ced.cfargotunnel.com` (proxied), same tunnel as other `*.openie.dev` siblings
- Tunnel catch-all → Caddy `:8443`
- Caddy: `@researchopenie host research.openie.dev` → `~/sites/research-openie-web`

## Site-ops

Manifest: `site-ops/deploy/manifest.toml` → `[[site]] name = "research"`.

## Permanence / GitHub

Public home for OpenIE materials: **https://github.com/openIE-dev** (org).

- Site source: local `research-openie-web/` (prefer remote under `openIE-dev/` when published)
- Contract / inventory / living export drafts: sibling `openie-web/research/` (local drafting tree; remotes today are personal Forgejo + `dcharlot65-personal` — migrate permanence into an `openIE-dev` repo rather than treating personal as canonical)

## Source living export

Authoritative shells often originate from `wca-lut-edge/artifacts/living/`. Re-copy into `public/living/` when shells update.
