# RCE spec notebook source

`spec.json` drives the pages under `/rce/spec/`. It is generated from the RCE
spec book (`crates/rce/spec/book/`, `crates/rce/spec/examples/`) in the
joulesperbit RCE checkout, using the checker compiled to WebAssembly
(`crates/rce/spec/checker-wasm/pkg`) to classify code blocks and record the
expected result of every example program:

    npm i katex@0.16.47 unified remark-parse remark-gfm remark-rehype rehype-raw rehype-stringify
    node gen.mjs <checkout>/crates/rce/spec spec.json

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
