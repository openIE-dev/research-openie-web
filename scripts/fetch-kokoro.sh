#!/usr/bin/env bash
# Downloads the read-aloud assets for /rce/spec/ into public/rce/spec/tts/ (not in git).
# Model: onnx-community/Kokoro-82M-v1.0-ONNX (Apache-2.0), q8 (WASM), fp32 (WebGPU) and fp16 weights and the af_heart voice.
# ONNX Runtime web build: the one bundled with @huggingface/transformers 3.5.1, which kokoro-js 1.2.1 uses.
set -euo pipefail
cd "$(dirname "$0")/../public/rce/spec/tts"
HF=https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main
M=models/Kokoro-82M-v1.0-ONNX
mkdir -p "$M/onnx" voices ort
for f in config.json tokenizer.json tokenizer_config.json onnx/model_quantized.onnx onnx/model.onnx onnx/model_fp16.onnx; do
  [ -s "$M/$f" ] || curl -fsSL "$HF/$f" -o "$M/$f"
done
[ -s voices/af_heart.bin ] || curl -fsSL "$HF/voices/af_heart.bin" -o voices/af_heart.bin
ORT=https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist
for f in ort-wasm-simd-threaded.jsep.mjs ort-wasm-simd-threaded.jsep.wasm; do
  [ -s "ort/$f" ] || curl -fsSL "$ORT/$f" -o "ort/$f"
done
ls -la "$M" "$M/onnx" voices ort
