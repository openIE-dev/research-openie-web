// Runs Kokoro-82M off the main thread so the page stays responsive while speech is generated.
let modelP = null;
async function load(base) {
  self.KOKORO_VOICE_BASE = base + 'tts/voices/';
  const { KokoroTTS, env } = await import(base + 'tts/kokoro.web.js');
  const tf = env.transformers;
  tf.allowLocalModels = false;
  tf.remoteHost = base + 'tts/models/';
  tf.remotePathTemplate = '{model}/';
  env.wasmPaths = base + 'tts/ort/';
  return KokoroTTS.from_pretrained('Kokoro-82M-v1.0-ONNX', { dtype: 'q8', device: 'wasm' });
}
self.onmessage = async (e) => {
  const { id, base, text } = e.data;
  try {
    modelP ||= load(base);
    const model = await modelP;
    if (text == null) { self.postMessage({ id, ready: true }); return; }
    const a = await model.generate(text, { voice: 'af_heart' });
    self.postMessage({ id, audio: a.audio, rate: a.sampling_rate }, [a.audio.buffer]);
  } catch (err) {
    modelP = null;
    self.postMessage({ id, error: String(err) });
  }
};
