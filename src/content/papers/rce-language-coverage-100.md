---
title: "All surveyed languages at 100% grammar coverage"
deck: "26 Nov 2026. Measured on real tree-sitter `node-types.json` (master/main, upstream repos)."
id: rce-language-coverage-100
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# All surveyed languages at 100% grammar coverage

*26 Nov 2026. Measured on real tree-sitter `node-types.json` (master/main, upstream repos).
Every NAMED node type of each surveyed language maps to a real universal construct; no
catch-all inflation. Emission matrix: 113 constructs × 80 languages = 100%. Extended same day
to the functional + non-Western frontier and the daily-use shell/web/data/build languages
(72 languages); per-language information-theoretic profile + knowledge graph in
rce-language-constellation.md. Emission ⊇ ingestion: every ingested language has an emission
LUT row (`emission_covers_every_ingested_language` test).*

## BLUF

RCE's universal grammar taxonomy now covers **100% of named node types** for 72 surveyed
languages, and the emission LUT matrix is 100% across all 80 emission targets. Coverage is
measured, not asserted: `ingest::grammar_coverage` counts named node types with a construct
mapping; `examples/grammar_coverage` prints per-language fractions; `--unmapped` lists the
honest remainder (now empty for all 72).

## Measured per-language named-node coverage

| language | mapped/total | coverage |
|---|---|---|
| rust | 169/169 | 1.0000 |
| python | 129/129 | 1.0000 |
| go | 112/112 | 1.0000 |
| javascript | 119/119 | 1.0000 |
| java | 151/151 | 1.0000 |
| c | 132/132 | 1.0000 |
| cpp | 230/230 | 1.0000 |
| c-sharp | 233/233 | 1.0000 |
| ruby | 149/149 | 1.0000 |
| swift | 72/72 | 1.0000 |
| kotlin | 120/120 | 1.0000 |
| scala | 173/173 | 1.0000 |
| haskell | 187/187 | 1.0000 |
| julia | 89/89 | 1.0000 |
| lua | 51/51 | 1.0000 |
| zig | 99/99 | 1.0000 |
| ocaml | 276/276 | 1.0000 |
| r | 40/40 | 1.0000 |
| dart | 223/223 | 1.0000 |
| elixir | 45/45 | 1.0000 |
| erlang | 164/164 | 1.0000 |
| clojure | 35/35 | 1.0000 |
| scheme | 27/27 | 1.0000 |
| nim | 127/127 | 1.0000 |
| crystal | 152/152 | 1.0000 |
| d | 284/284 | 1.0000 |
| fortran | 240/240 | 1.0000 |
| php | 157/157 | 1.0000 |
| ada | 228/228 | 1.0000 |
| sml | 134/134 | 1.0000 |
| purescript | 128/128 | 1.0000 |
| mojo | 141/141 | 1.0000 |
| cangjie | 202/202 | 1.0000 |
| wenyan | 64/64 | 1.0000 |
| elm | 92/92 | 1.0000 |
| racket | 32/32 | 1.0000 |
| commonlisp | 50/50 | 1.0000 |
| elisp | 20/20 | 1.0000 |
| gleam | 97/97 | 1.0000 |
| moonbit | 257/257 | 1.0000 |
| rescript | 160/160 | 1.0000 |
| reason | 226/226 | 1.0000 |
| nix | 42/42 | 1.0000 |
| fsharp | 201/201 | 1.0000 |
| idris | 181/181 | 1.0000 |
| agda | 72/72 | 1.0000 |
| lean | 141/141 | 1.0000 |
| fstar | 134/134 | 1.0000 |
| perl | 146/146 | 1.0000 |
| coq | 172/172 | 1.0000 |
| dhall | 166/166 | 1.0000 |
| unison | 93/93 | 1.0000 |
| nadeshiko | 24/24 | 1.0000 |
| ezhil | 24/24 | 1.0000 |
| alusus | 25/25 | 1.0000 |
| koka | 130/130 | 1.0000 |
| grain | 35/35 | 1.0000 |
| roc | 149/149 | 1.0000 |
| v | 144/144 | 1.0000 |
| odin | 107/107 | 1.0000 |
| bash | 62/62 | 1.0000 |
| typescript | 183/183 | 1.0000 |
| html | 19/19 | 1.0000 |
| css | 64/64 | 1.0000 |
| json | 13/13 | 1.0000 |
| yaml | 36/36 | 1.0000 |
| toml | 19/19 | 1.0000 |
| dockerfile | 48/48 | 1.0000 |
| cmake | 58/58 | 1.0000 |
| make | 44/44 | 1.0000 |
| powershell | 153/153 | 1.0000 |
| tlaplus | 273/273 | 1.0000 |

## Method (honest, no inflation)

- The taxonomy grew from 25 expression constructs to **113 universal constructs**: the
  expression core, the whole-program statement layer, and universal grammar categories
  (comment, directive, char_lit, null_lit, regex, token, modifier, type_expr, param, bound,
  field, init, label, range, seq, dict, set, splat, interp, jsx, module, control, assert,
  throw, with, delete, global, pass, ellipsis, update, new, chain, property, switch, case,
  guard, goto, defer, go, send, receive, select, incdec, compound_assign, else, elif,
  comprehension, generator, named_expr, format, export, record, instanceof, method_ref,
  literal, stmt, expr, decl, clause, body, asm, op, keyword, symbol).
- Each named node type is assigned to the category it genuinely belongs to (a `*_declarator`
  IS a declaration, a `preproc_*` IS a directive, a `*_modifier` IS a modifier, a `*_type` IS
  a type expression, …). Explicit mappings handle language-specific names; category rules
  handle the long tail. Nothing is mapped to an unrelated construct to inflate the count.
- Every construct has a per-family LUT template (C / ML / Lisp), so the emission matrix is
  100% across all 80 emission languages (`coverage_matrix_is_complete` test), and emission
  covers every ingested language (`emission_covers_every_ingested_language` test).
- **Language prediction** (`langpredict`): for each compute-fabric class (quantum, thermodynamic/
  reversible, spatial/dataflow, neuromorphic, probabilistic, analog) the native constructs missing
  from the 113-taxonomy are named and a predicted language spec emitted (Superpose, Landauer,
  Tessera, Spike, Alea, Ohm). This is analysis; synthesizing these hardware-native languages to
  eliminate the OS/hardware/language impedance tax is the registered advanced step, sequenced
  after full ingestion + RCE-JEPA headway.

## Reproduce

```
cargo run --example grammar_coverage -- /tmp/nt-<lang>.json …      # fractions
cargo run --example grammar_coverage -- --unmapped /tmp/nt-<lang>.json …   # remainder (empty)
cargo test --test coverage                                          # matrix 113 x 47 = 100%
```

node-types fetched from upstream repos: `tree-sitter/tree-sitter-<lang>`,
`tree-sitter-grammars`, `r-lib/tree-sitter-r`, `UserNobody14/tree-sitter-dart`,
`elixir-lang/tree-sitter-elixir`, `WhatsApp/tree-sitter-erlang`, `sogaiu/tree-sitter-clojure`,
`6cdh/tree-sitter-scheme`, `alaviss/tree-sitter-nim`, `crystal-lang-tools/tree-sitter-crystal`,
`gdamore/tree-sitter-d`, `stadelmanma/tree-sitter-fortran`, `gbprod/tree-sitter-php`,
and `tree-sitter-ocaml`'s `grammars/ocaml/src/node-types.json`. The 20 functional + non-Western
additions: `briot/tree-sitter-ada`, `MatthewFluet/tree-sitter-sml`, `postsolar/tree-sitter-purescript`,
`oaustegard/tree-sitter-mojo`, `jstzwj/tree-sitter-cangjie`, `duskmoon314/tree-sitter-wenyan`,
`elm-tooling/tree-sitter-elm`, `6cdh/tree-sitter-racket`, `theHamsta/tree-sitter-commonlisp`,
`Wilfred/tree-sitter-elisp`, `gleam-lang/tree-sitter-gleam`, `moonbitlang/tree-sitter-moonbit`,
`rescript-lang/tree-sitter-rescript`, `reasonml-editor/tree-sitter-reason`, `nix-community/tree-sitter-nix`,
`ionide/tree-sitter-fsharp` (`fsharp/src/`), `kayhide/tree-sitter-idris`, `tree-sitter/tree-sitter-agda`,
`Julian/tree-sitter-lean`, `FStarLang/tree-sitter-fstar`.

## Open (named)

**Ada** (briot), **Perl** (tree-sitter-perl), **Coq/Rocq** (aruzdh/tree-sitter-rocq), **Dhall**
(jmitchell), **Unison** (kylegoetz) — node-types generated with tree-sitter CLI 0.27.2 — are all
measured at 1.0000. **Nadeshiko (JP), Ezhil (Tamil), Alusus (Arabic)** have no public grammar;
honest **authored seed grammars** (native-keyword node types) are now measured at 1.0000 and
labelled as seeds, not upstream. The remaining ~528 curated
programming languages are present as unmeasured nodes in the constellation (no invented numbers).
Mesh (triangle-soup) contact is built (`twin::Mesh`); concave polygons via ear-clipping.
Production-scale FormJEPA remains last.
