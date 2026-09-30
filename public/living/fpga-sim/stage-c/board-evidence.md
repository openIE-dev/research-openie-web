# Stage C board evidence — closed-loop plant + Safe Q16.16 PH

Captured: 2026-09-30 03:51:29 EDT on the Alchitry Pt V2 host.

## Detect

Alchitry Pt V2 (Artix-7), USB 0403:6010 (FT2232H JTAG + UART).

## What was built and flashed

- Design: `wca_commit_gate_uart_pt_v2` **closed-loop**
  - On-fabric **pendulum** plant (Q16.16), stepped after each UART step line
  - Torque = `u` on commit else `0` (gate commit/refuse drives plant)
  - Live TLMM → `u_q`, allow LUT, **Safe Q16.16 PH** (`wca_ph_energy`)
  - `commit = lut_allow AND energy_ok`
- **No stimulus ROM** of plant/proposal state. Features from live `(θ,ω)`.
- Dual clock: UART on 100 MHz `clk` with `DIV=868` (115200 8N1);
  plant/TLMM/LUT/PH on `clk_plant = clk/32` (~3.125 MHz) for mul timing.
- Open XC7: yosys `synth_xilinx -nobram -nodsp` → nextpnr-xilinx (seed 2,
  `clk_plant` Fmax 7.47 MHz PASS @ 7 MHz) → prjxray → `ofpga flash` (SRAM).
- Bitstream SHA-256: `e97e2b078bd61e94f3df0e7d1dce21b1380e513ec2f7f89d9c84f29996e6bac9`
- Icarus combo plant path: AGREE PASS (1/15/step 6) before flash.

## UART readback

Port: `/dev/cu.usbserial-0000001` @ 115200 (pyserial).

```
WCA1 C01 R15 S06
S00 L1 E0 C0
S01 L1 E0 C0
S02 L1 E0 C0
S03 L1 E0 C0
S04 L1 E0 C0
S05 L1 E0 C0
S06 L1 E1 C1
S07 L1 E0 C0
S08 L1 E0 C0
S09 L1 E0 C0
S0A L1 E0 C0
S0B L1 E0 C0
S0C L1 E0 C0
S0D L1 E0 C0
S0E L1 E0 C0
S0F L1 E0 C0
```

Agreement with software / seed-1 closed-loop golden: **PASS**
(committed=1, refused=15, sole commit at step 6; `lut_allow=1` every step;
`energy_ok` only at step 6). Repeated across 50+ episode banners in one capture.

## Closed-loop (precise)

On fabric, `(θ,ω)` are Q16.16 registers. After each reported step line, the plant
advances with torque = `u` if that step committed, else `0`. Episode reset
returns to seed-1 ICs `(θ0,ω0)=(98304,196608)`. No streamed plant ROM.

## Safe Q16.16 PH

Residual certificate matching `wca_commit::ph::SafeFixedPointPHCertificate`:
`4·ω·u + 2(|ω|+|u|) + 1 ≤ ⌊4·ε·S²⌋` with `S=65536`, `ε=0.05`, `RHS=858993459`.
Board decisions match the software residual path on this episode.

## Energy

**UNMETERED.** Pt V2 has no onboard joule meter. Vivado post-PAR estimates are
not DUT watt-seconds. See
https://research.openie.dev/living/fpga-sim/alchitry/#energy

Artifacts: `uart-transcript-closedloop.txt`, `uart-agreement-closedloop.json`,
`uart-block-closedloop.txt`.
