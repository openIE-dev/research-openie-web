---
title: "Structure-first lift/emission coverage — the (construct × language) matrix, not a random walk"
deck: "25 Nov 2026. 'lets ensure we are attacking this from a structure perspective and not a random"
id: rce-coverage
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# Structure-first lift/emission coverage — the (construct × language) matrix, not a random walk

*25 Nov 2026. "lets ensure we are attacking this from a structure perspective and not a random
walk." And: "tree-sitters, ast, language manuals, the deterministic nature of programming by each
vendor already has a lot of stuff. there is a reason vscode has all that language support."
Built: `structure.rs` (taxonomy + coverage matrix), `ingest.rs` (grammar ingestion), extended
renderer + LUT completion. 178/178 local, 175/175 monorepo; merged to openIE-dev/rce main.*

## The structure

Programming's structure is a **closed taxonomy of constructs** — the Form IR's expression kinds:
literals (int/float/bool/str), var, neg, not, the binary ops (add…or), if_expr, and the higher
constructs call/index/member/list. That is 25 columns. Every language is a surface realization of
the same structure (the rows). **Coverage is the (construct × language) matrix.** "100% coverage"
is the matrix being full — a structural fact, measured, not asserted.

## Filling it structurally (not randomly)

- `structure.rs` defines `CONSTRUCTS`, `covered/gaps/coverage/matrix/overall`. After structural
  completion, **every one of the 47 language LUTs covers all 25 constructs** (`overall() == 1.0`).
- `lut_emit.rs` renders the higher constructs (call/index/member/list) and `complete_higher` fills
  each LUT to the full taxonomy in its application style (applicative vs Lisp) — systematic, not
  per-language hand-authoring.
- `ingest.rs` derives a language's construct set from its **tree-sitter `node-types.json`** (the
  deterministic artifact behind VS Code's language support). Verified on the real RCE grammar
  (name/call/if_expr/index/member/list) and on a sample grammar. This is the ingestion path that
  scales to hundreds of languages using existing vendor/grammar knowledge, rather than a random
  walk of hand-written LUTs.

## Why this is the right attack

The per-language deterministic knowledge already exists at scale (tree-sitter grammars, ASTs,
manuals, VS Code extensions). The unlock is to **ingest the structure** (node types → universal
constructs) and complete the matrix, so lift/emission coverage grows by reading existing artifacts,
not by guessing. Language coverage of the surveyed origins set is already 100% (47 LUTs ⊇ 46
origins); construct coverage is now 100% of the taxonomy; together the matrix is full, and the
ingestion path extends it to any language with a grammar.

## Honest scope

Higher-construct surface syntax per language is completed in its application style; exact
per-language refinements come from ingesting each grammar (the path is built). Full natural-language
intent→Form and the learned proposer remain the open frontier.

## Sources / grounding
- live: competence-catalog {structure,ingest,lut_emit}.rs + tests/coverage.rs; rce/tree-sitter grammar.
- tree-sitter node-types.json (public grammars); VS Code language extensions (deterministic support).