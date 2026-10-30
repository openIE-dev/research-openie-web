# research.openie.dev

OpenIE research hub. Live at **research.openie.dev**.

**IA (locked):**
- `/papers/{ni,satiation,mol,mei,spellcheck}/` — readable research study prose (draft papers)
- `/pdfs/{ni,satiation,mol,mei,spellcheck}.pdf` — real downloadable study PDFs
- `/living/` — **interactive figures** (P0 stubs), not papers
- `/living/fpga-sim/` — Stage B Rust→WASM commit-gate simulator (WebGPU viz; simulated, not Alchitry watts)
- `/living/fpga-sim/alchitry/` - Stage C builder guide (Alchitry Pt V2 detect/build/flash/LEDs; programmed, energy unmetered)
- `/living/fpga-sim/stage-c/` - Stage C evidence artifacts (bitstream + board-evidence.md)
- Status honesty: research study · draft; `board_synth_claimed=false`; Stage C programmed unmetered

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

PDFs follow their pages automatically: `pnpm build` ends with
`scripts/generate-pdfs.sh --stale`, which reprints every PDF whose page changed
since its stamp in `public/pdfs/stamps.json` (Chrome on the Mac, else a
Chromium on PATH or under /opt/pw-browsers, else weasyprint) and copies it into
`dist/pdfs/`. The build fails if a PDF is out of date and nothing can print it.
Run `./scripts/generate-pdfs.sh` after `pnpm build` to reprint every PDF.

## Versions are read, not typed

A paper's version line is `{{revision}}` in its Markdown; the build replaces it
with the last commit that changed the file and its date
(`src/plugins/remark-revision.mjs`). Pages that cite a paper use
`paperRevisionText(id)` from `src/lib/revision.mjs`. Do not type a version
number or date for a paper anywhere.

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

## Writing rule: define before use

Readers read top to bottom, so nothing on a page may be referenced before it is introduced. Labelled items (H#, RJ-F#, Part #, Phase #, W#, Section #, Figure #) must ascend as a reader meets them; [B#], [C#] and [T#] citations are numbered in order of first citation; every acronym is expanded at first use or listed in the page's terms list (id="terms") before it is used. `node scripts/lint-order.mjs` checks this on the built HTML (currently /about/rce-jepa/) and runs at the end of `pnpm build`.

## Writing rule: no narrated author

Running prose names the work or group ("the RCE-JEPA proposal", "the RCE project", "this article", "the OpenIE authors"), never the author as a narrated person ("David Charlot's proposal", "the author's analysis", "his"), and uses no vague "we". Bylines, metadata and citation author lists are unchanged. `scripts/lint-claims.mjs` flags author names in running prose.
