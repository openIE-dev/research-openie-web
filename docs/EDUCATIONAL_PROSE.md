# Educational Prose Lock - OpenIE Research Papers

**Author:** David Charlot, Open Interface Engineering
**Date:** Wed Sep 30, 2026 (America/New_York)
**Status:** STYLE LOCK for the two research papers on research.openie.dev
**Genre:** scientific paper. Teaching clarity is required. Op-ed voice is not.

Papers:

1. Notational Intelligence as Commit Law (`ni`)
2. Satiation and Scarcity after Free AI (`satiation`)

Copies: `artifacts/EDUCATIONAL_PROSE.md` (this tree) and `docs/EDUCATIONAL_PROSE.md` (research-openie-web).

## 1. What the reader must be able to do

Name each object. Define it. Say what fails if it is missing. Give one formal or numerical example. Connect it to the next object.

Do not write to sound impressive. Do not write a speech. Claims are cited, measured, or proved. If none of the three is available, the sentence is a limit, a definition, or a specified measurement that has not been run. Label which.

`board_synth_claimed=false` stays in repository metadata and in an appendix until a synthesis log and a meter exist. In the paper body, write the fact: we have not synthesized or metered the FPGA board.

## 2. Acronyms

Spell out on first use, then the acronym in parentheses:

> Wise Computer Automation (WCA)

Each paper has a Notation section before the acronym is used as a bare token. If a term appears once, spell it and skip the acronym.

| Acronym or term | Spell-out |
|-----------------|-----------|
| OpenIE | Open Interface Engineering |
| WCA | Wise Computer Automation |
| EFA | Energy-First Architecture |
| LUT | look-up table |
| TLMM | ternary look-up matrix multiplier |
| CBF | control barrier function |
| MCP | Model Context Protocol |
| DUT | device under test |
| FPGA | field-programmable gate array |
| WASM | WebAssembly |
| WebGPU | browser GPU API of that name (not an abbreviation to invent) |
| Alchitry Pt V2 | the named board (Artix-7 class in vendor docs) |
| RV | runtime verification |
| IT / IS | information theory / information science |
| AGI | artificial general intelligence |
| JSON | JavaScript Object Notation |
| System One | typed decision models (Laya / Jev class) |
| DiffLogic | differentiable logic gate networks |

Also define notational intelligence, commit law, satiation, economic done, and free at the margin in the paper that uses them.

## 3. Prose bans

Dashes. No em-dash. No en-dash used as a dash. Use a period, comma, colon, parentheses, or a new sentence. ASCII hyphen only inside compounds and identifiers.

Refuse these tics: delve, tapestry, landscape used as a metaphor, pivotal, underscore, unveil, robust solutioning, "In today's rapidly evolving", "It is important to note", stacks of synonymous adjectives, "studies show" without a citation, "the model understands".

Prefer short declarative sentences. One claim per sentence when defining a term.

Do not rename measurement class as a moral label. Do not print bracket tags such as surrogate, vendor, or soft as chips beside sentences. Say the measurement class in the sentence.

## 4. Measurement reporting

Three classes, in ordinary words:

- Modeled: a stated formula, including OpCounter counts times analytical energy constants. Say that the joule figure is an analytical estimate, not board power.
- Simulated: the Rust reference or Icarus Verilog executed the case. Verilog simulation is not a placed FPGA.
- Board-measured: a meter on a stated device and workload. None are reported.

Vendor catalog text (SparkFun on the Alchitry Pt V2, Epoch summaries, sell-side notes) is attributed to that source. It is not relabeled as an OpenIE measurement.

Soft comparisons (Brahe and Kepler, technology sequences without a regression) are described as analogies or as orientation. They are not given a result number.

Instrument path, specified and not shipped:

1. Today: Rust software reference and Icarus simulation.
2. Next build: Rust decision core compiled to WebAssembly, LUT and commit trace shown in the browser with WebGPU. Acceptance is agreement with step 1. WebGPU time is not energy.
3. Later, optional: synthesize for an Alchitry Pt V2 and meter it. Only step 3 is board-measured.

Do not write that the emulator already runs. Do not write silicon joule leadership or board watts.

## 5. Paper order

1. Abstract
2. Notation
3. Introduction
4. Related work
5. Definitions and methods
6. Results or evidence
7. Discussion
8. Limits and threats to validity
9. Conclusion
10. References
11. Appendix: commands, paths, and the unshipped emulator specification

Target length: 8,000 to 12,000 words of substance. Do not pad. Do not cut a proof or a table to sound short.

Numbered claims must point at a log, a schema, or a citation. Needs-experiment items appear as protocols or limits, not as findings.

Frozen ledgers still bound what may be asserted: `CLAIM_LEDGER_NI.md`, `CLAIM_LEDGER_SATIATION.md`. Forbidden rows stay out.

## 6. Gate before publish

On both markdown bodies:

1. Fail if an em-dash or en-dash appears.
2. Fail if `WCA`, `EFA`, `TLMM`, or `CBF` appears before its spelled-out definition.
3. Fail if the ban-list words in Section 3 appear.
4. Fail if bracket measurement chips are used as a labeling system.
5. Confirm Notation, a methods section, results tied to sources, limits, references, and a reproducibility appendix.
6. Confirm word count is between 8,000 and 12,000.

## 7. Paths

| Surface | Path |
|---------|------|
| Style lock (box) | `wca-lut-edge/artifacts/EDUCATIONAL_PROSE.md` |
| Style lock (site) | `research-openie-web/docs/EDUCATIONAL_PROSE.md` |
| Live NI paper | `research-openie-web/src/content/papers/ni.md` |
| Live satiation paper | `research-openie-web/src/content/papers/satiation.md` |
| Box NI | `wca-lut-edge/artifacts/NOTATIONAL_INTELLIGENCE_STUDY.md` |
| Box satiation | `wca-lut-edge/artifacts/SATIATION_RESEARCH_STUDY.md` |
| Public site | https://research.openie.dev |

*End of EDUCATIONAL_PROSE.md*
