# Educational Prose Lock — OpenIE Research Papers

**Author:** David Charlot · Open Interface Engineering  
**Date:** Wed Sep 30, 2026 (America/New_York / EDT)  
**Status:** STYLE LOCK for public teaching papers on research.openie.dev  
**Audience:** learners, builders, and operators who need to *explain* the claim after reading

This file is the shared writing contract for both living papers:

1. Notational Intelligence as Commit Law (`ni`)
2. Satiation and Scarcity after Free AI (`satiation`)

Copy lives at `artifacts/EDUCATIONAL_PROSE.md` (box / wca-lut-edge) and `docs/EDUCATIONAL_PROSE.md` (research-openie-web).

---

## 1. Philosophy (Institute + OpenIE)

Teach first principles, then skilled use. One idea at a time.

For every important object:

1. **Name** the thing.
2. **Define** it in plain language.
3. **Show why it matters** (what fails without it).
4. Give a **concrete example**.
5. **Connect** it to the next object.

The Feynman bar applies: the reader should leave able to explain the claim in their own words. Do not write to impress with jargon.

Interactive figures remain separate under `/living/`. Paper prose must stand alone as education. A reader who never opens a figure must still understand the thesis.

Honesty is pedagogy:

- Keep `board_synth_claimed=false` until board synthesis and a real meter exist.
- Tag claims: **[SURROGATE]**, **[DUT]**, **[VENDOR]**, **[UNVERIFIED]**, **[SOFT]**.
- Soft historical analogies must be marked **[SOFT]**.
- Do not invent scientific claims. Reorder and rewrite for teaching only.

Tone target: Physical AI Institute education copy (physicalai-bmi.org/education). Concrete. Sequential. No hype. Medium cuts under `artifacts/presentations/MEDIUM_*.md` are closer to human voice, but they still contain em-dashes. Strip those.

---

## 2. Acronyms (academic standard)

Spell out on **first use**, then put the acronym in parentheses:

> Wise Computer Automation (WCA)

Every paper opens early with a **Glossary** of all acronyms and coined terms used in that paper.

Never lead a section with bare WCA, EFA, TLMM, CBF, LUT, MCP, DUT, or similar.

If a term appears only once, prefer spelling it out and skip the acronym.

Define when used (non-exhaustive):

| Acronym / term | Spell-out / gloss |
|----------------|-------------------|
| OpenIE | Open Interface Engineering |
| WCA | Wise Computer Automation |
| EFA | Energy-First Architecture (or Energy-First Automation when that is the local sense; say which) |
| LUT | Look-Up Table |
| TLMM | Ternary Look-up Matrix Multiplier (ternary table-lookup proposal path) |
| CBF | Control Barrier Function |
| MCP | Model Context Protocol |
| DUT | Device Under Test |
| FPGA | Field-Programmable Gate Array |
| RV | Runtime Verification |
| IT | Information Theory |
| IS | Information Science |
| AGI | Artificial General Intelligence |
| OTLP | OpenTelemetry Protocol (if used) |
| RAPL | Running Average Power Limit |
| NVML | NVIDIA Management Library |
| SoC | System on Chip / software plant loop in this stack (say which) |
| JSON | JavaScript Object Notation |
| WASM | WebAssembly |
| System One | typed decision models that collapse generation tax (Laya / Jev class) |
| DiffLogic | differentiable logic networks that map toward gates / LUTs |
| port-Hamiltonian | structured energy dynamics used for passivity / energy certificates |

Also define **OpenIE**, **notational intelligence**, **commit law**, **satiation**, **economic done**, and **free-at-margin** when used as if known.

---

## 3. Ban list (AI grammar / ticks)

**Dashes**

- No em-dashes (`—`).
- No en-dashes (`–`) used as em-dashes.
- Prefer period, comma, colon, parentheses, or a short new sentence.
- Prefer ASCII hyphen-minus (`-`) in prose compounds when a hyphen is truly needed.
- Code and math may use minus signs as required by the language.

**Words and templates to refuse**

- delve, tapestry, landscape (figurative), pivotal, underscore, unveil
- robust solutioning
- "In today's rapidly evolving"
- "It is important to note that"
- parallel triad spam of synonymous adjectives
- "studies show" without a cite
- anthropomorphic "the model understands"

**Prefer**

- Short declarative sentences (about 15–20 words on average)
- Active voice
- One claim per sentence when teaching a definition
- Blunt asides when they teach
- Fewer ornamental tables; keep tables only when they teach a comparison the reader needs
- Sound like a clear teacher, not a research memo for insiders
- Strip refrain templates and fake dialectic

---

## 4. Shared educational skeleton

Keep this order for both papers (section titles may vary slightly):

1. Title + who this is for
2. What you will learn (3–5 bullets)
3. Glossary (required)
4. Problem in plain language
5. Core thesis (one crisp paragraph)
6. Definitions / objects (teach each formally)
7. How it works (steps + example)
8. Evidence from the software reference (honest tags)
9. Common confusions / counters
10. Limits
11. What to do next / figures link
12. References (keep cite integrity; do not invent cites)

Optional short appendix: reproducibility commands without insider path spam in the main teaching body.

Length aim: readable teaching paper, about 4–8k words of body. Cut dump of the old study. Preserve claim-ledger honesty.

Shared deck line (both papers may use):

> System One decides in software. Wise Computer Automation decides whether the machine is allowed to move.

Shared refuse bridge:

> Refuse = economic done ∪ physical unsafe

---

## 5. Claim integrity

Frozen ledgers remain binding:

- `CLAIM_LEDGER_NI.md`
- `CLAIM_LEDGER_SATIATION.md`

Allowed rows may appear. Forbidden rows must not appear, even softened. Needs-experiment rows appear only as limits or future work.

Seed-1 / Model Context Protocol demo numbers appear only if they exist in sources. Surrogate joules stay labeled **[SURROGATE]**.

---

## 6. Verification gate (before publish)

Run on both paper markdown bodies:

1. Fail if `—` or `–` appears in prose body (prefer ASCII hyphen-minus).
2. Fail if `\bWCA\b` appears before the spelled-out first definition line. Same for EFA, TLMM, CBF.
3. Count ban-list words; expect about zero.
4. Spot-check first screen: Glossary present, first acronym uses spelled out, teaching skeleton visible.

---

## 7. Where prose lives

| Surface | Path |
|---------|------|
| Style lock (box) | `wca-lut-edge/artifacts/EDUCATIONAL_PROSE.md` |
| Style lock (site) | `research-openie-web/docs/EDUCATIONAL_PROSE.md` |
| Live NI paper | `research-openie-web/src/content/papers/ni.md` |
| Live Satiation paper | `research-openie-web/src/content/papers/satiation.md` |
| Box canonical NI | `wca-lut-edge/artifacts/NOTATIONAL_INTELLIGENCE_STUDY.md` |
| Box canonical Satiation | `wca-lut-edge/artifacts/SATIATION_RESEARCH_STUDY.md` |
| Public site | https://research.openie.dev |

*End of EDUCATIONAL_PROSE.md*
