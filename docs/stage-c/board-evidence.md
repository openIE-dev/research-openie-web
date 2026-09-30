# Stage C board evidence: closed-loop plant + Safe Q16.16 PH + CBF

Captured: 2026-09-30 (EDT) on the Alchitry Pt V2 host.

## Detect

Alchitry Pt V2 (Artix-7), USB 0403:6010 (FT2232H JTAG + UART).

## Fabric control barrier function (CBF)

A control barrier function is a set-invariance certificate. Software carries the full Ames Lie form `ω·u ≤ κ·h` with `h = E_max - V`. **On fabric**, OpenXC7 timing forced a lean synthesizable conjunct:

`cbf_ok <=> h ≥ 0` (set membership `V ≤ E_max`), with conservative `V_upper = V_num + |θ| + |ω|`.

Port-Hamiltonian (PH) residual `energy_ok` still enforces the soft-mul twin of `ω·u ≤ ε` on fabric. Full Lie-form CBF remains software-only (soft-mul of `κ·h` was OpenXC7-heavy).

`commit = lut_allow AND energy_ok AND cbf_ok`

## Icarus (pre-flash)

`combo_agree.txt`: **AGREE PASS** commits=1 refuses=15 cstep=6 with `B=1` on all seed-1 steps (lean CBF does not change the PH-only commit set on this trajectory).

## Open XC7 build (CBF conjunct bitstream)

- Flow: yosys `synth_xilinx -flatten -abc9 -nobram -nodsp` → nextpnr-xilinx (`--freq 4`, seed 7) → prjxray `fasm2frames` / `xc7frames2bit` → `ofpga flash` (SRAM).
- Dual clock: UART on 100 MHz `clk` with `DIV=868` (115200 8N1); plant/TLMM/LUT/PH/CBF on `clk_plant = clk/32` (~3.125 MHz).
- Bitstream: `wca_commit_gate_uart_pt_v2_cbf.bit`
- SHA-256: `c646827062772d6447e11fb4b7f5659b506aa97489618786d633a349c86300a7`
- P&R: seed 7 MET — Fmax plant 7.01 MHz / UART 179.66 MHz (PASS at 4.00 MHz target).

## Board UART (CBF bitstream) — **AGREE FAIL**

Port: `/dev/cu.usbserial-0000001` @ 115200.

Observed block (banner string is **hardcoded** in RTL as `WCA1 C01 R15 S06`; per-step L/E/C are the live fields):

```
WCA1 C01 R15 S06
S00 L0 E0 C1
S01 L0 E0 C1
S02 L0 E0 C1
S03 L0 E0 C1
S04 L0 E0 C1
S05 L0 E0 C1
S06 L0 E1 C0
S07 L0 E0 C1
S08 L0 E0 C1
S09 L0 E0 C1
S0A L0 E0 C1
S0B L0 E0 C1
S0C L0 E0 C1
S0D L0 E0 C1
S0E L0 E0 C1
S0F L0 E0 C1
```

Golden seed-1 / Icarus:

```
WCA1 C01 R15 S06
S00 L1 E0 C0
…
S06 L1 E1 C1
…
S0F L1 E0 C0
```

**agree_seed1_golden = false.** Energy field E matches the golden sole-true-at-step-6 pattern; LUT allow L is stuck low in the UART sample; commit C is inverted vs golden. Prior SafePH-only closed-loop board agree (`uart-agreement-closedloop.json`, SHA `e97e2b07…`) remains the last PASS and is **not** CBF-on-board.

Artifacts: `uart-agreement-cbf-board.json`, `uart-transcript-cbf-board.txt`, `uart-block-cbf-board.txt`, `combo_agree.txt`, `wca_cbf_energy.v`.

## Energy

**UNMETERED.** Pt V2 has no onboard joule meter. No joule / pJ claims on this board.

## Blocker / next levers

1. **UART CDC sampling of `lut_allow` / `commit` into the UART domain** still disagrees with Icarus/golden despite lean CBF that passes combo sim. Next lever: plant-domain freeze of `{L,E,C}` on `step_pulse` with a single synchronized word to UART (not three independent 2FF syncs), or scan-out via a known-good PH-only top plus a 1-bit CBF sticky.
2. Do **not** treat the hardcoded banner `WCA1 C01 R15 S06` as live counters.
3. ABC9 must be run uninterrupted (~220 s); classic `abc -lut` closes fast but misses `clk/32` timing (~0.66 MHz Fmax).
