---
title: "The Language Constellation — a knowledge graph + information theory for every curated language"
deck: "26 Nov 2026. Built in `competence-catalog::constellation`, measured on real tree-sitter"
id: rce-language-constellation
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# The Language Constellation — a knowledge graph + information theory for every curated language

*26 Nov 2026. Built in `competence-catalog::constellation`, measured on real tree-sitter
`node-types.json`, enumerated from the exhaustive curation (GitHub Linguist `languages.yml`,
cross-referenced with the tree-sitter grammar directory, Wikipedia's list and Rosetta Code).
Interactive artifact: `rce-language-constellation.html`. Graph JSON: `constellation` example.*

## BLUF

RCE cannot honestly claim "one IR for all languages" without *knowing* each language. The
constellation is that knowledge: **855 curated entries (578 programming languages)** as graph
nodes, of which **48 are measured** against a real grammar and carry a grammar-derived
information profile and the **Law of Coding** frame `I = H_task − H_corpus → 0`, priced in joules.
Every other language is present as a node with `measured=false` and **no invented numbers** —
the graph knows *of* it without pretending to *know* it. Edges encode family (lineage), paradigm,
and documented influence; the interactive page renders them as a constellation.

## What each measured node carries (all computed, none asserted)

- `named_nodes` N — the grammar's named node types (its syntactic surface size).
- `constructs` C — distinct universal constructs those nodes realize (semantic breadth).
- `coverage` — mapped/total named nodes (1.0000 for all 48).
- `h_struct_bits` H — Shannon entropy of the construct histogram: how evenly the grammar's
  surface spreads across the universal taxonomy. **Structural, not corpus** — honestly labelled.
- `redundancy` = 1 − H/log2(C) — the surface variety that is syntactic sugar, not free information.
- `surface_per_construct` = N/C — the mean surface forms per universal construct: **exactly the
  distance the one-IR LUT must bridge for this language.**
- `law` — the frame: H_corpus structural proxy, the redundancy the IR collapses at admission,
  the G0 lookup floor (1 µJ) vs cold proposer (5,000,000 µJ), the 5,000,000× reuse ratio, whether
  an emission LUT row exists, and a plain-language statement of the law for that language.

## The measured insight (why this is credibility, not decoration)

The bridging distance is *not* uniform. Python (1.77), JavaScript (1.72), Go (1.75), Lua (1.09),
Elixir (1.05), R (1.05) map nearly one surface form per universal construct — low redundancy
(0.03–0.08): their syntax is already close to the IR. Standard ML (11.17), OCaml (6.27), Idris
(6.03), Ada (5.85), Haskell (5.50) carry many surface forms per construct — higher redundancy
(0.13–0.26): the IR must collapse more sugar. This is a measured, per-language statement of how
much work the universal IR does, and it is what makes the emission LUT a *checked* bridge rather
than a slogan.

## Measured per-language information profile (48)

| language | named N | constructs C | coverage | H (bits) | redundancy | surface/C |
|---|---|---|---|---|---|---|
| D | 284 | 71 | 1.0000 | 5.030 | 0.182 | 4.00 |
| OCaml | 276 | 44 | 1.0000 | 4.282 | 0.216 | 6.27 |
| MoonBit | 257 | 62 | 1.0000 | 4.820 | 0.190 | 4.15 |
| Fortran | 240 | 47 | 1.0000 | 4.322 | 0.222 | 5.11 |
| C# | 233 | 72 | 1.0000 | 5.191 | 0.159 | 3.24 |
| C++ | 230 | 68 | 1.0000 | 5.082 | 0.165 | 3.38 |
| Ada | 228 | 39 | 1.0000 | 4.027 | 0.238 | 5.85 |
| Reason | 226 | 42 | 1.0000 | 4.399 | 0.184 | 5.38 |
| Dart | 223 | 66 | 1.0000 | 5.126 | 0.152 | 3.38 |
| Cangjie | 202 | 43 | 1.0000 | 4.603 | 0.152 | 4.70 |
| F# | 201 | 39 | 1.0000 | 4.437 | 0.160 | 5.15 |
| Haskell | 187 | 34 | 1.0000 | 4.446 | 0.126 | 5.50 |
| Idris | 181 | 30 | 1.0000 | 3.917 | 0.202 | 6.03 |
| Scala | 173 | 44 | 1.0000 | 4.775 | 0.125 | 3.93 |
| Rust | 169 | 66 | 1.0000 | 5.400 | 0.107 | 2.56 |
| Erlang | 164 | 33 | 1.0000 | 4.197 | 0.168 | 4.97 |
| ReScript | 160 | 59 | 1.0000 | 5.077 | 0.137 | 2.71 |
| PHP | 157 | 62 | 1.0000 | 5.269 | 0.115 | 2.53 |
| Crystal | 152 | 43 | 1.0000 | 4.665 | 0.140 | 3.53 |
| Java | 151 | 72 | 1.0000 | 5.704 | 0.076 | 2.10 |
| Ruby | 149 | 44 | 1.0000 | 4.513 | 0.173 | 3.39 |
| Lean | 141 | 34 | 1.0000 | 4.468 | 0.122 | 4.15 |
| Mojo | 141 | 76 | 1.0000 | 5.873 | 0.060 | 1.86 |
| F* | 134 | 50 | 1.0000 | 4.798 | 0.150 | 2.68 |
| Standard ML | 134 | 12 | 1.0000 | 2.827 | 0.211 | 11.17 |
| C | 132 | 57 | 1.0000 | 5.153 | 0.117 | 2.32 |
| Python | 129 | 73 | 1.0000 | 5.838 | 0.057 | 1.77 |
| PureScript | 128 | 25 | 1.0000 | 4.150 | 0.106 | 5.12 |
| Nim | 127 | 40 | 1.0000 | 4.561 | 0.143 | 3.17 |
| Kotlin | 120 | 54 | 1.0000 | 5.038 | 0.125 | 2.22 |
| JavaScript | 119 | 69 | 1.0000 | 5.753 | 0.058 | 1.72 |
| Go | 112 | 64 | 1.0000 | 5.496 | 0.084 | 1.75 |
| Zig | 99 | 57 | 1.0000 | 5.294 | 0.092 | 1.74 |
| Gleam | 97 | 48 | 1.0000 | 5.096 | 0.088 | 2.02 |
| Elm | 92 | 25 | 1.0000 | 4.066 | 0.124 | 3.68 |
| Julia | 89 | 54 | 1.0000 | 5.165 | 0.103 | 1.65 |
| Agda | 72 | 30 | 1.0000 | 4.371 | 0.109 | 2.40 |
| Swift | 72 | 32 | 1.0000 | 4.396 | 0.121 | 2.25 |
| Wenyan | 64 | 17 | 1.0000 | 3.011 | 0.263 | 3.76 |
| Lua | 51 | 47 | 1.0000 | 5.388 | 0.030 | 1.09 |
| Common Lisp | 50 | 23 | 1.0000 | 4.029 | 0.109 | 2.17 |
| Elixir | 45 | 43 | 1.0000 | 5.211 | 0.040 | 1.05 |
| Nix | 42 | 28 | 1.0000 | 3.899 | 0.189 | 1.50 |
| R | 40 | 38 | 1.0000 | 5.011 | 0.045 | 1.05 |
| Clojure | 35 | 16 | 1.0000 | 3.421 | 0.145 | 2.19 |
| Racket | 32 | 19 | 1.0000 | 3.828 | 0.099 | 1.68 |
| Scheme | 27 | 13 | 1.0000 | 3.323 | 0.102 | 2.08 |
| Emacs Lisp | 20 | 12 | 1.0000 | 3.139 | 0.124 | 1.67 |

## Graph structure

- **Nodes:** 578 languages + family hubs (C/systems, JVM, ML/functional/proof, Lisp, BEAM,
  JavaScript, Python, Ruby, Scientific/array, Logic, Shell, SQL, Config, Esoteric, Smalltalk,
  Pascal, Apple/Swift, PHP, Lua, Modern systems, East-Asian-new, …) + paradigm hubs.
- **Edges:** `family` (language→lineage hub), `paradigm` (language→paradigm hub), `influence`
  (documented lineage, e.g. C→C++/Rust/Go, Haskell→Rust/Elm/PureScript, OCaml→Rust/F#/ReScript,
  Erlang→Elixir/Gleam, Python→Mojo, Coq→Lean, Rust/OCaml→MoonBit, Kotlin/Swift/Rust→Cangjie).
- **Layout:** golden-angle phyllotaxis (even spacing, no dense blob), family-coloured; measured
  nodes glow green; influence edges are the constellation lines. Pan/zoom/search/filter; click a
  node for its full profile + Law frame.

## Reproduce

```
cargo run --example constellation -- /tmp/constellation.json   # graph from real node-types
cargo test --test constellation                                 # bounds + honesty checks
python3 /tmp/build_constellation_html.py                        # interactive artifact
```

Universe: `data/universe.json` (parsed from github-linguist/linguist `languages.yml`, 855 entries).
Grammars: upstream tree-sitter repos (see rce-language-coverage-100.md for the 28 prior; the 20
new are ionide/fsharp, MatthewFluet/sml, postsolar/purescript, oaustegard/mojo, jstzwj/cangjie,
duskmoon314/wenyan, elm-tooling/elm, 6cdh/racket, theHamsta/commonlisp, Wilfred/elisp,
gleam-lang/gleam, moonbitlang/moonbit, rescript-lang/rescript, reasonml-editor/reason,
nix-community/nix, kayhide/idris, tree-sitter/agda, Julian/lean, FStarLang/fstar, briot/ada).

## Open (named, honest)

- **Measure the rest of the universe.** 530 programming languages are present but unmeasured
  (no public tree-sitter grammar ingested). Each is a registered node, not a fabricated profile.
- **Perl, Coq, Dhall, Unison** have grammars whose `node-types.json` is build-generated (not
  committed); generating them (tree-sitter CLI) is the next step. **Nadeshiko (JP), Ezhil (Tamil),
  Alusus (Arabic)** have no public grammar — authoring seed grammars is registered open work.
- Corpus-level entropy (true H_corpus over real code) remains a measurement beyond the structural
  proxy reported here; the structural figures are labelled as such, never conflated.

The Law frame is the same for every language — `I = H_task − H_corpus → 0` — but the *distance*
each language's surface must be collapsed is now a measured, per-language number. That is the
credibility the one-IR claim needed.
