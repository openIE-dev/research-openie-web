# Stage C board evidence (Alchitry Pt V2)

Captured: 2026-09-30 02:48:12 EDT on the workstation with the board attached.

## Detect (`ofpga detect`)

```
1 device(s) found:

  FPGA Boards:
    Alchitry Pt V2 (Artix-7)
      USB 0403:6010  -  Jtag
```

USB product string (IOKit): `Alchitry Pt V2` (vid 0x0403 / pid 0x6010, FT2232H JTAG + UART).

## What was built and flashed

- Design: `wca_commit_gate_uart_pt_v2` (sources under `wca-commit-gate/`:
  `wca_commit_gate_uart_pt_v2.v`, `wca_allow_lut.v`, `wca_ph_energy.v`,
  `wca_tlmm_synth.v`, `.xdc`)
- **Replaces the seed-1 decision ROM.** The FPGA computes
  `commit = lut_allow AND energy_ok` from streaming plant/proposal state:
  - TLMM proposal (`wca_tlmm_synth`) from `patterns_packed`
  - `u_q` from a 3-entry Q8.8 map of `tanh(y0)*u_scale` for `y0 in {-1,0,1}`
  - Allow LUT (`wca_allow_lut`, mask 0x557F)
  - Port-Hamiltonian energy (`wca_ph_energy`, legacy Q8.8, `eps_q=13`)
- Stimulus ROM streams seed-1 `(patterns, bits, theta_q, omega_q)` (state, not
  allow/refuse decisions). ASCII UART on FT2232H channel B at 115200 8N1.
- Open XC7 flow: yosys `synth_xilinx -nodsp` → nextpnr-xilinx (50 MHz fabric
  domain via clk/2) → prjxray `fasm2frames` / `xc7frames2bit`. Flash: `ofpga flash` (SRAM).
- Bitstream: `wca_commit_gate_uart_pt_v2.bit` (3825913 bytes)
- SHA-256: `5308f5c4d83bc484c6a6f6b5f6228941e68e880d34be4893dca60b1f6bd5343c`
- Icarus combo pre-check: AGREE PASS (1/15/step 6) before board flash.

## Flash (`ofpga flash …/wca_commit_gate_uart_pt_v2.bit`)

```
Board: Alchitry Pt V2 (Artix-7)
USB:   bus 0 addr 14 (0403:6010)
Mode:  Sram
Size:  3825913 bytes
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
- Plant trajectory / feature bits / TLMM patterns come from a seed-1 stimulus table (not a closed-loop float plant on FPGA).
- `u_q` map is exact for seed-1 `y0 in {-1,0,1}`; not a general tanh unit.
- Legacy Q8.8 PH (not Safe Q16.16). Fabric at 50 MHz (clk/2) for LUT-mul timing without DSP.
- `board_synth_claimed` stays false until a meter reading on a stated workload exists.

## Builder guide

How-to: [/living/fpga-sim/alchitry/](../alchitry/)
