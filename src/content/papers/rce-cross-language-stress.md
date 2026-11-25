---
title: "Cross-language stress test — the nuance and gotchas, exposed and preserved"
deck: "25 Nov 2026. 'we need to really stress test this. all languages have nuance and differences and"
id: rce-cross-language-stress
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# Cross-language stress test — the nuance and gotchas, exposed and preserved

*25 Nov 2026. "we need to really stress test this. all languages have nuance and differences and
potential gotchas in going between. python to rust. rust to fortran. fortran to ada. rust to haskell
or ocaml." Built `semantics.rs` (per-language arithmetic semantics + semantic-aware `preserve`) and
`tests/stress.rs`. 181/181 local, 178/178 monorepo; merged to openIE-dev/rce main.*

## The gotchas (real, exposed by the stress test)

Syntactic LUT emission preserves *syntax*, not *semantics*. The same operator means different things:

| Transition | div | mod | Naive port correct? |
|---|---|---|---|
| python→rust | floor vs trunc | floor-mod vs trunc-rem | **NO** — `-7 % 2`: python `1`, rust `-1` |
| rust→fortran | trunc vs trunc | trunc-rem vs trunc-rem | yes (div/mod agree) |
| fortran→ada | trunc vs trunc | trunc-rem vs floor-mod | **NO** — modulo sign differs |
| rust→haskell | trunc vs floor | trunc-rem vs floor-mod | **NO** |
| rust→ocaml | trunc vs trunc | trunc-rem vs trunc-rem | yes |

The stress battery (`-7/2, -7%2, 7/-2, 7%-2, -7/-2, -7%-2, 7/2, 7%2`) confirms: mismatches > 0 exactly
where rounding/sign semantics differ, and 0 where they agree. This is the honest finding — a naive
cross-language port silently changes behavior on negative operands.

## The fix: semantic-aware `preserve`

`semantics::preserve(expr, from, to)` rewrites `/` and `%` so the ported expression evaluates
identically under the target's native semantics, using the identity that trunc and floor results
differ exactly when the operands have opposite signs and the remainder is nonzero (adjustment =
divisor). Verified: `eval(preserve(e, from, to), to) == eval(e, from)` for every battery expression
across all seven pairs (python→rust, rust→fortran, fortran→ada, rust→haskell, rust→ocaml,
python→haskell, ada→rust).

## Layer 2 — index base, layout, overflow, short-circuit (built)

- **Index base:** Fortran/Ada 1-based vs C/Rust/Python 0-based. `preserve_index` shifts indices by
  the base difference so a port addresses the same element (`a[0]` rust → `a[0+1]` fortran). Verified.
- **Column-major vs row-major:** Fortran col-major `(i=1,j=2) in 3×4 → 7` vs Rust row-major `→ 6`.
  `linearize` models it; a 2-D port must relinearize. Exposed.
- **Overflow:** Python/Haskell arbitrary precision vs C/Rust/Ada fixed-width wrap.
  `9223372036854775807 + 1` = `…808` (python) vs `-…808` (rust i64 wrap). Exposed; compensation
  requires bigint (open).
- **Short-circuit/laziness:** `0 and (1/0)` = `0` under short-circuit (dead division not evaluated)
  but fails under eager evaluation. `eval_sc` models both. Exposed.

Mutability/ownership (Rust) is a *structural* gotcha outside pure value semantics — it constrains
which ports are legal, not the computed value; handled by the type/borrow layer, not arithmetic.

## What this means for lift/emission

Emission must be **semantic**, not just syntactic: the LUT gives the surface, and `preserve` supplies
the behavior-preserving lowering across language semantics. This is the stress-tested bridge that
makes "one Form, every language" actually correct, not merely pretty. Other gotchas (1-based arrays,
column-major, overflow, laziness, mutability) live outside the arithmetic fragment and are the next
stress layers; the mechanism (model source/target semantics, compensate) generalizes.

## Sources / grounding
- live: competence-catalog semantics.rs + tests/stress.rs; 181/181.
- language semantics: Python floor-div/mod; Rust/Fortran/OCaml trunc; Haskell/Ada floor-mod.