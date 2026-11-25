// Standards-compliant WebAudio AudioWorklet processor for 16 kHz Whisper ONNX STT capture.
// Runs on the dedicated WebAudio rendering thread with zero main-thread jank.
class OpenIEPcmCaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch && ch.length > 0) {
      const copy = new Float32Array(ch);
      this.port.postMessage(copy, [copy.buffer]);
    }
    return true;
  }
}

registerProcessor('openie-pcm-capture', OpenIEPcmCaptureProcessor);
