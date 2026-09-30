# wca-fpga-sim (Stage B)

Browser-runnable **simulation / emulation** of the WCA commit gate (allow LUT +
energy refuse path). Decision logic is Rust compiled to WebAssembly. The living
page may paint the LUT and commit trace with WebGPU. This is **not** an Alchitry
Pt V2 DUT measurement and **not** board watts. `board_synth_claimed=false`.
WebGPU GPU time is not joules.

## Acceptance (seed-1)

Matches Stage A software golden:

| Metric | Value |
|--------|-------|
| committed / refused | 1 / 15 |
| refuse split | energy_only=15 |
| episode J (analytical) | 8.6795e-10 |
| ops | bram=64 lut_reads=16 lut6_toggles=3 ph_muls=64 ph_adds=48 |
| sole commit step | 6 |
| LUT mem SHA-256 | `a7186a4cc63fc90ad76cad75c1dc2f8209666717a0a1943c2184e931114284a9` |

## Build (reproducible)

Requires Rust 1.98+, `wasm-pack`, target `wasm32-unknown-unknown`.

```bash
cd /workspace/wca-lut-edge
rustup target add wasm32-unknown-unknown
cargo test -p wca-fpga-sim
cargo test -p wca-commit --lib seed1_16step

# Web artifact (ES module)
wasm-pack build crates/wca-fpga-sim --target web --release \
  --out-dir ../../research-pkg  # or see site sync below

# Preferred: write into the research site living figure
wasm-pack build crates/wca-fpga-sim --target web --release \
  --out-dir /tmp/wca-fpga-sim-pkg
# then copy pkg/* into research-openie-web/public/living/fpga-sim/pkg/
```

On the Mac site tree:

```bash
cd /Users/dcharlot/data-share/vibe-coding/research-openie-web
# after copying pkg/ into public/living/fpga-sim/pkg/
pnpm build
/Users/dcharlot/data-share/vibe-coding/site-ops/deploy/deploy.sh research
```

Live URL: https://research.openie.dev/living/fpga-sim/

## Stage C (optional, not this crate)

Alchitry Pt V2 (vendor: Artix-7 XC7A100T) is a planned later DUT after synthesis
and metering. This crate does not claim board results.

## Limits

- Emulation of the software decision core, not Icarus RTL replacement.
- Analytical OpCounter joules only.
- No DiffLogic training in the browser.
- No Artix-7 dynamic power from shaders.
