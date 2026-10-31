# RCE spec notebook source

`spec.json` drives the pages under `/rce/spec/`. It is generated from the RCE
spec book (`spec/book/`, `spec/examples/`) in a checkout of openIE-dev/rce,
using the checker compiled to WebAssembly (`spec/checker-wasm/pkg`) to classify
code blocks and record the expected result of every example program:

    npm i katex@0.16.47 unified remark-parse remark-gfm remark-rehype rehype-raw rehype-stringify
    node gen.mjs <checkout>/spec spec.json

From an export instead of a checkout (no `.git`), name the commit:

    git -C <checkout> archive <commit> spec/book spec/examples spec/checker-wasm/pkg tree-sitter/grammar.js | tar -x -C <dir>
    RCE_COMMIT=<commit> node gen.mjs <dir>/spec spec.json

`spec.json` is generated from the book and the example programs, not from
`spec/data/spec-data.json` of openIE-dev/rce. Since openIE-dev/rce #54 the
programs that require change are in `spec/examples/change/{syntax,types,admission}`
(earlier `reject/`, `ill_typed/` and `inadmissible/`), `tree-sitter/` is at the
repository root, and the browser checker reports a step whose event does not
apply as `kept` (earlier `refused`); `gen.mjs` and `public/rce/spec/notebook.js`
read both layouts. The current `spec.json` is generated from 0c015c43, with
`checker-wasm/pkg` rebuilt from that commit (`wasm-pack build --release --target web
--out-dir pkg`, then `wasm-opt -O` from binaryen 117), because the `pkg` committed
there predates its last checker change.

Then copy `checker-wasm/pkg/rce_spec_check_wasm.js` and
`rce_spec_check_wasm_bg.wasm` into `public/rce/spec/wasm/`.

Read-aloud assets: `public/rce/spec/tts/kokoro.web.js` is kokoro-js 1.2.1's
web build with two changes: the voice URL reads `globalThis.KOKORO_VOICE_BASE`
so voices are served from this site, and the exported `env` also exposes the
bundled transformers.js `env` as `env.transformers` so the model host can be
set to this site. Speech is generated in `public/rce/spec/tts-worker.js`, off
the main thread. The model, voice and ONNX Runtime files
are not in git; `scripts/fetch-kokoro.sh` downloads them into
`public/rce/spec/tts/`.

Read-aloud backends: WebGPU with the fp32 model when the browser has a WebGPU
adapter, otherwise WebAssembly with the q8 model, using threads when the page
is cross-origin isolated. Caddy sends `Cross-Origin-Opener-Policy: same-origin`
and `Cross-Origin-Embedder-Policy: credentialless` on `/rce/spec*` only. Add
`?tts=wasm` or `?tts=fp16` to a page URL to force a backend or weight file.

Highlighting: `public/rce/spec/ts/tree-sitter-rce.wasm` is the RCE tree-sitter
grammar (`tree-sitter/` in openIE-dev/rce) built with `tree-sitter build --wasm`
(CLI 0.27.1), loaded with web-tree-sitter 0.27.1. Code cells also show the
program's Form JSON (spec 6.1), produced by the checker.
