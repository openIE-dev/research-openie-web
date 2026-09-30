# PDF twin map — living figure IDs

**Purpose:** PDF export uses the **same IDs** as the living page. Captions match inventory defaults. Static snapshot = each figure’s `default_state`.

**Printable HTML (v0):** [`pdf-twin/`](pdf-twin/) — open in browser → **Print → Save as PDF**.

| Path | Contents |
|------|----------|
| [`pdf-twin/index.html`](pdf-twin/index.html) | Hub + export instructions |
| [`pdf-twin/ni.html`](pdf-twin/ni.html) | P1 + shared IDs (incl. `ni-3d-01`) |
| [`pdf-twin/satiation.html`](pdf-twin/satiation.html) | P2 + shared IDs (incl. `sat-3d-01`) |

| id | Paper | Caption (PDF twin) | § slot |
|----|-------|--------------------|--------|
| `ni-inf-01` | P1 | Brahe→Kepler notational lineage (Iverson→…→Lee→WCA); cite list | §1 / §2 |
| `ni-diag-01` | P1 | System One → WCA → Plant complement; owns / does not own | §2 / §7 |
| `ni-diag-02` | P1 | Commit stack sense→propose→certify→commit\|refuse; compose predicate | §3 / §4 |
| `ni-fig-01` | P1 | Annotated `wca.commit.v1` refuse example JSON | §3 / §4 |
| `ni-run-01` | P1 | Seed-1 SoC scoreboard: committed=1 / refused=15 / J≈8.6795e-10 **[SURROGATE]** | §5 |
| `ni-run-02` | P1 | Safe-PH false-allow=0 table excerpt (toy) | §5 |
| `ni-run-03` | P1 | MCP gate demo case table (`mcp_gate_demo.json`) | §5 / §7 |
| `ni-inf-02` | P1 | Joule tier A/B/C ladder; `board_synth_claimed=false` | §5 / §8 |
| `ni-3d-01` | P1 | Toy plant 3D orbit stub — static 2D phase snapshot (illustrative / modelled toy) | §5 / Appendix |
| `sat-inf-01` | P2 | Engagement KPI vs economic-done lenses | §1 / §3 |
| `sat-fig-01` | P2 | Bliss-point / indifference ellipses; U modelled textbook | §3 / §4 |
| `sat-tab-01` | P2 | Race→satiation→commodity cycle; **[SOFT]** historical rows | §2 / §5 |
| `sat-fig-02` | P2 | Epoch-cited free-at-margin price arc; ≠ free joules | §5 |
| `sat-inf-02` | P2 | Scarcity map: still scarce vs commodity-heading | §4 / §7 |
| `sat-diag-01` | P2 | Refuse = economic done ∪ physical unsafe | §4 / §7 |
| `sat-tab-02` | P2 | R-S6–R-S12 decision rules (design, not empiric) | §7 |
| `sat-fig-04` | P2 | Steelman counters (status / creative / military / Jevons) scoped | §6 |
| `sat-3d-01` | P2 | Bliss utility surface 3D stub — static 2D contour twin (modelled textbook) | §4 |
| `shared-diag-01` | both | Full System One → WCA → Plant complement path | §7 / §7 |
| `shared-inf-01` | both | Hardware/scale wave center vs IT/IS commit-law bet | §1 / §1 |
| `shared-inf-02` | both | Honesty tag legend + `board_synth_claimed=false` | §8 / §8 |
| `shared-fig-01` | both | Compose atom strip: Proposal / Certificate / RefuseReason / CommitDecision | §3–4 / §4 |
| `shared-tab-01` | both | Joule tier A/B/C vocabulary table | §8 / §8 |

**Export note:** Snapshot each living section’s default visible state; caption must include the stable id (e.g. `Figure ni-run-01`). Do not invent a second figure set for PDF. Optional weasyprint/pandoc not required — browser Print-to-PDF is the v0 path.
