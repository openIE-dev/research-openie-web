# Translation checklist (resumable)

Source: src/content/papers/<slug>.md (English). Target: src/content/translations/<lang>/<slug>.md.
Rules: keep math, citations [n], code, numbers and link targets; English anchor ids kept as anchor-alias divs before each heading; reference list kept in its original language; no en or em dashes.
States: abstract = title and abstract only (complete: false); full = whole text (complete: true), committed and deployed; stale = whole text was full, but the English source was revised afterwards, so the translation must be redone against the current English before it returns to full.

| paper | zh-Hans | es | fr | de | ja | pt | hi | ar |
|---|---|---|---|---|---|---|---|---|
| rce | full | full | full | full | full | full | full | full |
| agency | full | full | full | full | full | full | full | full |
| ai-coding-market | full | full | full | full | full | full | full | full |
| interface-economics | full | full | full | full | full | abstract | abstract | abstract |
| latency | abstract | abstract | abstract | abstract | abstract | abstract | abstract | abstract |
| gates | abstract | abstract | abstract | abstract | abstract | abstract | abstract | abstract |
| satiation | full | full | full | full | full | full | full | full |
| three-body | abstract | abstract | abstract | abstract | abstract | abstract | abstract | abstract |
| spellcheck | abstract | abstract | abstract | abstract | abstract | abstract | abstract | abstract |

## Deploy rule

Deploy only from the tree that contains the translation line. The full translations are committed on the working branch of the Mac checkout `research-openie-web` and may not exist on any pushed branch. A deploy from a clean checkout of another branch (for example `fix/rce-public-accuracy`) silently replaces every translation missing from that branch with its abstract stub. This happened on 17 October 2026 (agency in ar, hi, ja, pt, zh-Hans; interface-economics zh-Hans; the rce corrections note).

- Never run `VIBE=<clean checkout> deploy.sh research`. Deploy with `deploy.sh research` from the Mac working tree, after merging any other branch into it.
- `scripts/i18n/guard.mjs` enforces this: `pnpm build` and `deploy.sh research` fail when a page marked `full` above lacks its source, has `complete: false`, is tiny, or is a stub in `dist/`. Keep this table true: change a row to `full` only when the translation is committed in the tree being deployed.
- Tests: `pnpm test:guard`.
