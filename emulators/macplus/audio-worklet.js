// AudioWorkletProcessor that drains the ringbuf.js RingBuffer shared with the
// BasiliskII worker. Matches infinite-mac's emulator-audio-worklet.ts pattern.

import { RingBuffer } from "./ringbuf.js";

const READ_CHUNK_SIZE = 384 * 2 * 2;

class BasiliskAudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const { audioBuffer, sampleSize } = options.processorOptions;
    this.ringBuffer = new RingBuffer(audioBuffer, Uint8Array);
    this.sampleSize = sampleSize || 16;
    this.currentData = null;
    this.currentView = null;
    this.currentOffset = 0;
  }

  process(_inputs, outputs) {
    const channel = outputs[0][0];
    if (!channel) return true;
    for (let i = 0; i < channel.length; i++) {
      channel[i] = this.nextSample();
    }
    return true;
  }

  nextSample() {
    if (!this.currentData || this.currentOffset >= this.currentData.byteLength) {
      if (this.ringBuffer.empty()) return 0;
      const avail = this.ringBuffer.available_read();
      this.currentData = new Uint8Array(Math.min(avail, READ_CHUNK_SIZE));
      this.ringBuffer.pop(this.currentData);
      this.currentView = new DataView(
        this.currentData.buffer,
        this.currentData.byteOffset
      );
      this.currentOffset = 0;
    }
    if (this.currentOffset >= this.currentData.byteLength) return 0;
    const sample = this.currentView.getInt16(this.currentOffset);
    this.currentOffset += 2;
    return sample / 0x8000;
  }
}

registerProcessor("basilisk-audio", BasiliskAudioProcessor);
