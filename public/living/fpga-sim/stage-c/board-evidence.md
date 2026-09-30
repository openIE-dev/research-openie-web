# Stage C board evidence: closed-loop plant + Safe Q16.16 PH + CBF

Captured: 2026-09-30 (EDT) on the Alchitry Pt V2 host. UART capture pending flash of CBF conjunct bitstream.

## Detect

Alchitry Pt V2 (Artix-7), USB 0403:6010 (FT2232H JTAG + UART).

## What was built

- Design: `wca_commit_gate_uart_pt_v2` **closed-loop**
  - On-fabric **pendulum** plant (Q16.16), stepped after each UART step line
  - Torque = `u` on commit else `0` (gate commit/refuse drives plant)
  - Live TLMM → `u_q`, allow LUT, **Safe Q16.16 PH** (`wca_ph_energy`), **Ames energy-set control barrier function (CBF)** (`wca_cbf_energy`)
  - `commit = lut_allow AND energy_ok AND cbf_ok`
- **No stimulus ROM** of plant/proposal state. Features from live `(θ,ω)`.
- Dual clock: UART on 100 MHz `clk` with `DIV=868` (115200 8N1);
  plant/TLMM/LUT/PH/CBF on `clk_plant = clk/32` (~3.125 MHz) for mul timing.
- Open XC7: yosys `synth_xilinx -nobram -nodsp` → nextpnr-xilinx → prjxray → `ofpga flash` (SRAM).
- Bitstream SHA-256: `PENDING_FLASH`
- Icarus combo plant path: **AGREE PASS** (1 commit / 15 refuses / step 6) before flash.
  On seed-1 the CBF conjunct matches LUT and Safe PH alone (sole commit at step 6 has u=0, so the CBF Lie check holds).

## Control barrier function (CBF)

A control barrier function is a set-invariance certificate. With barrier `h = E_max - V` on the same pendulum energy `V = 1/2 (g θ² + ω²)`, the fabric refuses when `h < 0` or when `ω·u ≤ κ·h` fails. Safe Q16.16 residual twin (soft-mul, no dividers):

`cbf_ok <=> h_num ≥ 0 && (lhs << FRAC) ≤ (4 · κ_q · h_num)`

with `lhs = 4·ω·u + 2·(|ω|+|u|) + 1`, defaults `E_max=18`, `κ=0.05`, `FRAC=16`.

## Energy

**UNMETERED.** Pt V2 has no onboard joule meter. Vivado post-PAR estimates are not DUT watt-seconds. See https://research.openie.dev/living/fpga-sim/alchitry/#energy

Artifacts: `uart-transcript-closedloop.txt`, `uart-agreement-closedloop.json`, `combo_agree.txt`, `wca_cbf_energy.v`.
