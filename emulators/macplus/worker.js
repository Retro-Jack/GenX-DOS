// Basilisk II emulator worker — implements the workerApi contract that the
// infinite-mac WASM build expects. Disk is fetched into memory; audio uses
// ringbuf.js RingBuffer shared with the main-thread AudioWorklet.

import {
  InputBufferAddresses,
  LockStates,
} from "./shared-buffers.js";
import { RingBuffer } from "./ringbuf.js";

let Module = null;

self.onmessage = function (msg) {
  if (msg?.data?.type === "start") {
    startEmulator(msg.data.config).catch((error) => {
      console.error("Emulator start failed", error);
      postMessage({
        type: "emulator_error",
        error: String(error?.stack || error),
      });
    });
  }
};

async function fetchBytes(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch ${url}: HTTP ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

function createDisksApi(diskBuffers, getHeap) {
  // diskBuffers: array of { name, data: Uint8Array, readOnly }
  const byName = new Map(diskBuffers.map((d) => [d.name, d]));
  const opened = new Map();
  let nextId = 0;

  return {
    open(name) {
      const spec = byName.get(name);
      if (!spec) {
        console.warn(`disks.open: unknown disk "${name}"`);
        return -1;
      }
      const id = nextId++;
      opened.set(id, { spec });
      return id;
    },
    close(id) {
      opened.delete(id);
    },
    read(id, bufPtr, offset, length) {
      const entry = opened.get(id);
      if (!entry) return -1;
      const heap = getHeap();
      const src = entry.spec.data;
      const end = Math.min(offset + length, src.length);
      const n = Math.max(0, end - offset);
      heap.set(src.subarray(offset, offset + n), bufPtr);
      return n;
    },
    write(id, bufPtr, offset, length) {
      const entry = opened.get(id);
      if (!entry || entry.spec.readOnly) return -1;
      const heap = getHeap();
      const dst = entry.spec.data;
      const end = Math.min(offset + length, dst.length);
      const n = Math.max(0, end - offset);
      dst.set(heap.subarray(bufPtr, bufPtr + n), offset);
      return n;
    },
    size(id) {
      const entry = opened.get(id);
      return entry ? entry.spec.data.length : 0;
    },
    isMediaPresent() { return true; },
    isFixedDisk() { return true; },
    eject() {},
  };
}

function buildPrefs(template, screenWidth, screenHeight) {
  let prefs = template.replace(/\r\n/g, "\n");
  prefs += `screen win/${screenWidth}/${screenHeight}\n`;
  return prefs;
}

async function startEmulator(config) {
  const inputBufferView = new Int32Array(config.inputBuffer);
  const screenBufferView = new Uint8Array(config.screenBuffer);
  const videoModeBufferView = new Int32Array(config.videoModeBuffer);
  const sleepBuffer = new Int32Array(new SharedArrayBuffer(4));

  postMessage({ type: "emulator_loading", completion: 0.1 });

  // Fetch ROM, WASM, prefs template, disk image in parallel.
  const [romData, wasmBytes, prefsTemplate, diskData] = await Promise.all([
    fetchBytes("rom"),
    fetchBytes("BasiliskII.wasm"),
    fetch("prefs_template").then((r) => r.text()),
    fetchBytes(config.diskUrl),
  ]);

  postMessage({ type: "emulator_loading", completion: 0.6 });


  const diskBuffers = [
    { name: "disk", data: diskData, readOnly: false },
  ];
  const prefs = buildPrefs(prefsTemplate, config.screenWidth, config.screenHeight);

  const audioRingBuffer = new RingBuffer(config.audioBuffer, Uint8Array);
  let lastBlitFrameId = 0;
  let lastIdleWaitFrameId = 0;
  let nextExpectedBlitTime = 0;

  const workerApi = {
    InputBufferAddresses,

    idleWait() {
      if (lastIdleWaitFrameId === lastBlitFrameId) return false;
      lastIdleWaitFrameId = lastBlitFrameId;
      const timeout = Math.max(0, nextExpectedBlitTime - performance.now());
      const result = Atomics.wait(
        inputBufferView,
        InputBufferAddresses.globalLockAddr,
        LockStates.READY_FOR_UI_THREAD,
        timeout,
      );
      return result === "ok";
    },

    sleep(timeSeconds) {
      Atomics.wait(sleepBuffer, 0, 0, timeSeconds * 1000);
    },

    didOpenVideo(width, height) {
      postMessage({ type: "emulator_video_open", width, height });
    },

    blit(bufPtr, bufSize) {
      lastBlitFrameId++;
      if (bufPtr) {
        const data = Module.HEAPU8.subarray(bufPtr, bufPtr + bufSize);
        videoModeBufferView[0] = bufSize;
        screenBufferView.set(data);
      }
      nextExpectedBlitTime = performance.now() + 16;
    },

    didOpenAudio(sampleRate, sampleSize, channels) {
      postMessage({
        type: "emulator_audio_open",
        sampleRate,
        sampleSize,
        channels,
      });
    },

    audioBufferSize() {
      return audioRingBuffer.available_read();
    },

    enqueueAudio(bufPtr, nbytes) {
      if (audioRingBuffer.available_write() < nbytes) return;
      audioRingBuffer.push(Module.HEAPU8.slice(bufPtr, bufPtr + nbytes));
    },

    acquireInputLock() {
      const res = Atomics.compareExchange(
        inputBufferView,
        InputBufferAddresses.globalLockAddr,
        LockStates.READY_FOR_EMUL_THREAD,
        LockStates.EMUL_THREAD_LOCK,
      );
      return res === LockStates.READY_FOR_EMUL_THREAD ? 1 : 0;
    },

    releaseInputLock() {
      inputBufferView[InputBufferAddresses.mousePositionFlagAddr] = 0;
      inputBufferView[InputBufferAddresses.mousePositionXAddr] = 0;
      inputBufferView[InputBufferAddresses.mousePositionYAddr] = 0;
      inputBufferView[InputBufferAddresses.mouseButtonStateAddr] = 0;
      inputBufferView[InputBufferAddresses.mouseButton2StateAddr] = 0;
      inputBufferView[InputBufferAddresses.keyEventFlagAddr] = 0;
      inputBufferView[InputBufferAddresses.keyCodeAddr] = 0;
      inputBufferView[InputBufferAddresses.keyStateAddr] = 0;
      inputBufferView[InputBufferAddresses.ethernetInterruptFlagAddr] = 0;
      Atomics.store(
        inputBufferView,
        InputBufferAddresses.globalLockAddr,
        LockStates.READY_FOR_UI_THREAD,
      );
    },

    getInputValue(addr) { return inputBufferView[addr]; },

    // Ethernet not wired; stubs so the WASM doesn't crash if it polls.
    etherSeed() { return Math.floor(Math.random() * 0xffffffff); },
    etherInit() {},
    etherWrite() {},
    etherRead() { return 0; },

    // Clipboard not wired in this build.
    setClipboardText() {},
    getClipboardText() { return undefined; },

    disks: createDisksApi(diskBuffers, () => Module.HEAPU8),
  };

  globalThis.workerApi = workerApi;

  const moduleOverrides = {
    arguments: ["--config", "prefs"],

    instantiateWasm(imports, successCallback) {
      WebAssembly.instantiate(wasmBytes, imports)
        .then((output) => successCallback(output.instance))
        .catch((error) => {
          console.error("WASM instantiate failed", error);
          postMessage({
            type: "emulator_error",
            error: String(error?.stack || error),
          });
        });
      return {};
    },

    preRun: [
      function () {
        const FS = moduleOverrides.FS;
        FS.createDataFile("/", "prefs", prefs, true, true, true);
        FS.createDataFile("/", "rom", romData, true, true, true);
        postMessage({ type: "emulator_loading", completion: 0.9 });
      },
    ],

    onRuntimeInitialized() {
      postMessage({ type: "emulator_ready" });
    },

    print() {},
    printErr() {},

    quit(status) {
      postMessage({ type: "emulator_quit", status });
    },
  };

  Module = moduleOverrides;

  const { default: emulator } = await import("./BasiliskII.js");
  emulator(moduleOverrides);
}
