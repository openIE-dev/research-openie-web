// Sovereign In-Browser Vision-Language Worker (Camera & Screen-Share Inspection).
// Supports WebGPU SmolVLM-256M-Instruct (when WebGPU fp16/fp32 is available and selected)
// and compact universal ONNX ViT-GPT2 image captioning fallback via @huggingface/transformers@3.5.1,
// zero paid cloud APIs, running 100% client-side.

const TF_CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1';
const SMOLVLM_ID = 'HuggingFaceTB/SmolVLM-256M-Instruct';
const COMPACT_VLM_ID = 'Xenova/vit-gpt2-image-captioning';

let vlmState = null;
let vlmPromise = null;
let currentTier = null;
let inferChain = Promise.resolve();

function postProgress(p) {
  try {
    self.postMessage({
      type: 'progress',
      engine: 'vision-vlm',
      status: p?.status || 'loading',
      file: p?.file || '',
      progress: typeof p?.progress === 'number' ? p.progress : null,
      loaded: p?.loaded ?? null,
      total: p?.total ?? null,
    });
  } catch {
    // Ignore serialization errors
  }
}

async function loadCompactCaptioner(tf, t0, fellBackReason = null) {
  const { pipeline } = tf;
  const captioner = await pipeline('image-to-text', COMPACT_VLM_ID, {
    device: 'wasm',
    dtype: 'q8',
    session_options: { logSeverityLevel: 3 },
    progress_callback: postProgress,
  });
  return {
    kind: 'captioner',
    pipe: captioner,
    info: {
      model: COMPACT_VLM_ID,
      device: 'wasm',
      dtype: 'q8',
      loadMs: Math.round(performance.now() - t0),
      fellBack: fellBackReason,
    },
  };
}

async function initVision(tier = 'auto') {
  const t0 = performance.now();
  const tf = await import(TF_CDN);
  const { env, AutoProcessor, AutoModelForVision2Seq, RawImage } = tf;
  env.allowLocalModels = false;
  const threads = self.crossOriginIsolated
    ? Math.max(1, Math.min(8, (self.navigator?.hardwareConcurrency || 4) - 1))
    : 1;
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.numThreads = threads;
  }
  if (env.backends?.onnx) {
    env.backends.onnx.logLevel = 'error';
  }

  let hasWebGpuFp16 = false;
  if (tier !== 'compact' && self.navigator?.gpu) {
    try {
      const adapter = await self.navigator.gpu.requestAdapter();
      hasWebGpuFp16 = !!(adapter && (tier === 'smolvlm' || adapter.features?.has('shader-f16')));
    } catch {
      hasWebGpuFp16 = false;
    }
  }

  if (tier === 'smolvlm' || (tier === 'auto' && hasWebGpuFp16)) {
    try {
      const processor = await AutoProcessor.from_pretrained(SMOLVLM_ID, {
        progress_callback: postProgress,
      });
      const model = await AutoModelForVision2Seq.from_pretrained(SMOLVLM_ID, {
        dtype: {
          embed_tokens: 'fp16',
          vision_encoder: 'q4',
          decoder_model_merged: 'q4',
        },
        device: 'webgpu',
        session_options: { logSeverityLevel: 3 },
        progress_callback: postProgress,
      });
      return {
        kind: 'smolvlm',
        processor,
        model,
        RawImage,
        info: {
          model: SMOLVLM_ID,
          device: 'webgpu',
          dtype: 'fp16/q4',
          loadMs: Math.round(performance.now() - t0),
          fellBack: null,
        },
      };
    } catch (err) {
      return loadCompactCaptioner(tf, t0, String(err));
    }
  }

  return loadCompactCaptioner(tf, t0, null);
}

self.onmessage = async (e) => {
  const { id, type, dataUrl, prompt, tier = 'auto' } = e.data || {};
  try {
    if (!vlmPromise || (tier && currentTier && tier !== currentTier && type === 'warmup')) {
      currentTier = tier;
      vlmPromise = initVision(tier).then((res) => {
        vlmState = res;
        return res;
      });
    }
    const state = await vlmPromise;
    if (type === 'warmup' || !dataUrl) {
      self.postMessage({ id, ready: true, info: state.info });
      return;
    }

    const job = inferChain.then(async () => {
      const t0 = performance.now();
      let caption = '';
      if (state.kind === 'smolvlm') {
        const image = await state.RawImage.fromURL(dataUrl);
        const userQuestion = prompt || 'Describe any diagrams, equations, text, code, or hardware visible in this frame concisely.';
        const messages = [
          {
            role: 'user',
            content: [
              { type: 'image' },
              { type: 'text', text: userQuestion },
            ],
          },
        ];
        const chatPrompt = state.processor.apply_chat_template(messages, {
          add_generation_prompt: true,
        });
        const inputs = await state.processor(chatPrompt, [image]);
        const generatedIds = await state.model.generate({
          ...inputs,
          max_new_tokens: 96,
          do_sample: false,
        });
        const trimmed = generatedIds.slice(null, [inputs.input_ids.dims.at(-1), null]);
        const decoded = state.processor.batch_decode(trimmed, { skip_special_tokens: true });
        caption = String(decoded?.[0] || '').trim();
      } else {
        const out = await state.pipe(dataUrl, { max_new_tokens: 48 });
        const raw = Array.isArray(out) ? out[0]?.generated_text : out?.generated_text;
        caption = String(raw || '').trim();
      }
      const ms = Math.round(performance.now() - t0);
      self.postMessage({ id, caption, ms, info: state.info });
    });
    inferChain = job.catch(() => {});
    await job;
  } catch (err) {
    if (!vlmState) vlmPromise = null;
    self.postMessage({ id, error: String((err && err.stack) || err) });
  }
};
