#!/usr/bin/env bash
# Downloads the read-aloud and live-call Kokoro-82M neural TTS assets (not tracked in git).
# Model: onnx-community/Kokoro-82M-v1.0-ONNX (Apache-2.0), q8 (WASM), fp16, and fp32 (WebGPU) weights
# plus 4 sovereign neural voices (af_heart, af_bella, am_adam, bm_george).
# ONNX Runtime web build: the one bundled with @huggingface/transformers 3.5.1, which kokoro-js 1.2.1 uses.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_TTS_DIR="$SCRIPT_DIR/../public/rce/spec/tts"
OUT_DIR="${1:-$SRC_TTS_DIR}"

mkdir -p "$OUT_DIR"
if [ -s "$SRC_TTS_DIR/kokoro.web.js" ] && [ ! -s "$OUT_DIR/kokoro.web.js" ]; then
  cp "$SRC_TTS_DIR/kokoro.web.js" "$OUT_DIR/kokoro.web.js"
fi

cd "$OUT_DIR"
HF=https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main
M=models/Kokoro-82M-v1.0-ONNX
mkdir -p "$M/onnx" voices ort

for f in config.json tokenizer.json tokenizer_config.json onnx/model_quantized.onnx onnx/model_fp16.onnx onnx/model.onnx; do
  [ -s "$M/$f" ] || curl -fsSL "$HF/$f" -o "$M/$f"
done

for v in af_heart.bin af_bella.bin am_adam.bin bm_george.bin; do
  [ -s "voices/$v" ] || curl -fsSL "$HF/voices/$v" -o "voices/$v"
done

ORT=https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist
for f in ort-wasm-simd-threaded.jsep.mjs ort-wasm-simd-threaded.jsep.wasm; do
  [ -s "ort/$f" ] || curl -fsSL "$ORT/$f" -o "ort/$f"
done

ls -lh kokoro.web.js "$M" "$M/onnx" voices ort
