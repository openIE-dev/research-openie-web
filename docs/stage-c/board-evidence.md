# Stage C board evidence (Alchitry Pt V2)

Captured: 2026-09-30 02:23:38 EDT on the workstation with the board attached.

## Detect (`ofpga detect`)

```
1 device(s) found:

  FPGA Boards:
    Alchitry Pt V2 (Artix-7)
      USB 0403:6010  -  Jtag
```

USB product string (IOKit): `Alchitry Pt V2` (vid 0x0403 / pid 0x6010, FT2232H JTAG + UART).

## What was built and flashed

- Design: `wca_seed1_uart_pt_v2` (source `wca_seed1_uart_pt_v2.v` / `.xdc`)
- Richer than the earlier toy free-running LED gate: a **seed-1 decision ROM** implements
  `commit = lut_allow AND energy_ok` for the 16-step golden episode, and reports every
  step over **UART** (FT2232H channel B, 115200 8N1).
- Not a full Wise Computer Automation (WCA) system-on-chip (SoC). Ternary lookup matrix
  model (TLMM) proposal and Port-Hamiltonian (PH) energy certification still run in
  software / WebAssembly (WASM); the FPGA ROM matches their seed-1 allow/refuse sequence.
- Open XC7 flow: yosys `synth_xilinx` → nextpnr-xilinx → prjxray `fasm2frames` /
  `xc7frames2bit`. Flash: `ofpga flash` (SRAM).
- Bitstream: `wca_seed1_uart_pt_v2.bit` (3825905 bytes)
- SHA-256: `a1d2d069837f5cdf90fe224f28a75c420148bff6403306f3d995cdcb9320a430`

## Flash (`ofpga flash …/wca_seed1_uart_pt_v2.bit`)

```
Board: Alchitry Pt V2 (Artix-7)
USB:   bus 0 addr 14 (0403:6010)
Mode:  Sram
Size:  3825905 bytes
IDCODE: 0x13631093
Status: 0x35 (DONE=1 INIT=1)
STAT: 0x401079FC (CRC_ERR=0 EOS=1 DONE=1 STARTUP_STATE=4 BUS_WIDTH=x1)
Programmed via JTAG (SRAM)  -  DONE + EOS asserted
```

## UART readback (seed-1 agreement)

Port: `/dev/cu.usbserial-0000001` @ 115200.

Transcript excerpt (one episode):

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

Agreement with software / WASM seed-1 golden: **PASS**
(committed=1, refused=15, sole commit at step 6; `lut_allow=1` every step; `energy_ok` only at step 6).

Artifacts: `uart-transcript.txt`, `uart-agreement.json`, `seed1_uart_expected.txt`.

## Limits (facts)

- **Energy: UNMETERED.** No power meter was attached. Do not invent joules.
- Analytical OpCounter joules (~8.6795e-10 for seed-1) remain model numbers from Stage A/B, not board watts.
- FPGA fabric here is a **seed-1 decision ROM + UART reporter**, not a place-and-routed TLMM+PH SoC.
- `board_synth_claimed` stays false until a meter reading on a stated workload exists.

## Builder guide

How-to: [/living/fpga-sim/alchitry/](../alchitry/)
