# Stage C board evidence (Alchitry Pt V2)

Captured: 2026-09-30 01:49:59 EDT on the workstation with the board attached.

## Detect (`ofpga detect`)

```
1 device(s) found:

  FPGA Boards:
    Alchitry Pt V2 (Artix-7)
      USB 0403:6010  -  Jtag
```

USB product string (IOKit): `Alchitry Pt V2` (vid 0x0403 / pid 0x6010, FT2232H JTAG).

## What was built and flashed

- Design: `wca_commit_gate_pt_v2.fpga`  -  minimal commit-gate LED demo
  (`commit = lut_allow AND energy_ok`, plus refuse / heartbeat LEDs).
- Not a full WCA SoC. Extends the known blink path with allow/refuse predicates.
- Toolchain: `ofpga build … -t alchitry-pt-v2` (native XC7 emitter).
- Bitstream: `wca_commit_gate_pt_v2.bit` (104140 bytes)
- SHA-256: `08e130e35eee764e13f3f9d6ddc5cedbc3c0d3dda3974d101ba1a9161e816fd7`

## Flash (`ofpga flash build/wca_commit_gate_pt_v2.bit`)

```
Board: Alchitry Pt V2 (Artix-7)
USB:   bus 0 addr 14 (0403:6010)
Mode:  Sram
Size:  104140 bytes
IDCODE: 0x13631093
Status: 0x35 (DONE=1 INIT=1)
STAT: 0x501079FC (CRC_ERR=0 EOS=1 DONE=1 STARTUP_STATE=4 BUS_WIDTH=x1)
Programmed 104140 bytes via JTAG (SRAM)  -  DONE + EOS asserted
```

Functional evidence observed: USB detect with product string, JTAG IDCODE for
XC7A100T, configuration DONE and EOS asserted, CRC_ERR clear. Serial UART
readback was not instrumented for this design (no UART TX in the demo).

## Limits (honesty)

- **Energy: UNMETERED.** No power meter was attached. Do not invent joules.
- Analytical OpCounter joules from Stage A/B remain model numbers, not board watts.
- Native XC7 synth reported 8 LUTs / 0 FFs after optimization for this toy netlist;
  LED allow/refuse visibility is best-effort for this minimal demo, not a cycle-
  accurate WCA core.
- Stage C is therefore **partially done**: board detected and programmed with a
  commit-gate-related bitstream and JTAG success; metered energy and full SoC
  remain future work.

## Builder guide

How-to (detect, build, flash, LED map, Stage A/B/C): [/living/fpga-sim/alchitry/](../alchitry/)
