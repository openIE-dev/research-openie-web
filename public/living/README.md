# Living paper shells (P0 + 3D stubs + PDF twin v0)

**Date:** Wed Sep 30, 2026 (America/New_York, EDT)  
**Contract:** [`../LIVING_PAPER_CONTRACT.md`](../LIVING_PAPER_CONTRACT.md) · inventory [`../FIGURE_INVENTORY.md`](../FIGURE_INVENTORY.md)

Interactive **web is canonical**. PDF twin = same IDs + static captions ([`pdf-twin-map.md`](pdf-twin-map.md), printable HTML under [`pdf-twin/`](pdf-twin/)).

## Open locally (living + 3D)

ES modules need an HTTP origin (not `file://`):

```bash
cd /workspace/wca-lut-edge/artifacts/living
python3 -m http.server 8765
# Hub:        http://127.0.0.1:8765/
# Paper 1:    http://127.0.0.1:8765/ni/          ← includes #ni-3d-01
# Paper 2:    http://127.0.0.1:8765/satiation/   ← includes #sat-3d-01
```

### How to open 3D stubs

1. Start the local server above.
2. **NI plant orbit:** open `/ni/#ni-3d-01` — drag canvas to orbit; θ/ω sliders; toy allow/refuse paint. Pure canvas (no Three.js / no npm).
3. **Satiation bliss surface:** open `/satiation/#sat-3d-01` — drag to orbit; x*/y* sliders; textbook \(U=-a(x-x^*)^2-b(y-y^*)^2\) wireframe.
4. Grades stay honest: **illustrative / modelled (toy)** for `ni-3d-01`; **modelled (textbook)** for `sat-3d-01`; **[SURROGATE]** chips where energy-adjacent; **no fake board watts**.

## Export PDF twin v0

Prefer browser Print-to-PDF (no weasyprint required):

```bash
cd /workspace/wca-lut-edge/artifacts/living
python3 -m http.server 8765
# Open:
#   http://127.0.0.1:8765/pdf-twin/
#   http://127.0.0.1:8765/pdf-twin/ni.html
#   http://127.0.0.1:8765/pdf-twin/satiation.html
# Then: Browser → Print… → Destination: Save as PDF
```

Same section `id=` values as living pages. Map: [`pdf-twin-map.md`](pdf-twin-map.md).

## Layout

| Path | Role |
|------|------|
| `index.html` | Hub linking P1 + P2 + PDF twin |
| `ni/index.html` | NI Commit Law — NI + shared + `ni-3d-01` |
| `satiation/index.html` | Satiation — sat + shared + `sat-3d-01` |
| `css/living.css` | Shared shell + orbit3d + print helpers |
| `js/living-core.js` | Badge toggle, helpers |
| `js/orbit3d.js` | Pure-canvas perspective orbit (minimal deps) |
| `js/ni-3d.js` / `js/sat-3d.js` | 3D figure widgets |
| `js/honesty-legend.js` | `shared-inf-02` interactive legend |
| `js/data-frozen.js` | Frozen RESULTS / MCP numbers (**no invented joules**) |
| `js/ni-widgets.js` / `js/sat-widgets.js` | Paper interactivity |
| `pdf-twin/*.html` | Printable HTML twins |
| `pdf-twin-map.md` | id → caption map |

## ID status (this pass)

### Paper 1 (`ni/*`)

| ID | Status | Notes |
|----|--------|-------|
| `ni-inf-01` … `ni-inf-02` | interactive (P0) | unchanged from P0 shells |
| `ni-3d-01` | **interactive 3D stub** | Canvas orbit plant; illustrative / modelled (toy) |

### Paper 2 (`sat/*`)

| ID | Status | Notes |
|----|--------|-------|
| `sat-inf-01` … `sat-fig-04` | interactive (P0) | unchanged from P0 shells |
| `sat-3d-01` | **interactive 3D stub** | Canvas bliss surface; modelled (textbook) |

### Shared (both pages)

| ID | Status | Notes |
|----|--------|-------|
| `shared-diag-01` / `shared-inf-01` / `shared-fig-01` / `shared-tab-01` | interactive | P0 |
| `shared-inf-02` | **interactive** (upgraded) | Clickable honesty tag cards + definitions |

## Code-runner honesty

Browser stubs **do not invent joules**. Frozen goldens from `RESULTS.md` / `mcp_gate_demo.json`. `board_synth_claimed=false` everywhere.

```bash
cd /workspace/wca-lut-edge
cargo run --release --bin wca-soc-loop -- --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
cargo run --release --bin wca-soc-loop -- --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph
cargo run --release --bin wca-mcp-gate
```

## Non-goals

- No Three.js CDN required (pure canvas orbit)
- No fake board-watts charts
- No invented Epoch price points
- No npm / heavy framework
- No `git push` / global git config from this workstream


## Stage B FPGA simulator

Live path: [`fpga-sim/`](fpga-sim/) (also https://research.openie.dev/living/fpga-sim/).

Rust decision core compiled to WebAssembly; WebGPU paints the LUT and commit trace.
Seed-1 acceptance: committed 1, refused 15, analytical J 8.6795e-10.
This is simulated / emulated software. It is not an Alchitry Pt V2 DUT measurement.
Rebuild: see `crates/wca-fpga-sim/README.md` in wca-lut-edge.
