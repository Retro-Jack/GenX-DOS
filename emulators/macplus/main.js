// Macintosh emulator renderer — screen, audio, input, and worker management.
// Uses infinite-mac's Basilisk II WASM build with ringbuf.js audio pipeline.
// coi-serviceworker.js (loaded from play.html) provides cross-origin
// isolation for SharedArrayBuffer on GitHub Pages.

import {
  InputBufferAddresses,
  LockStates,
  INPUT_BUFFER_SIZE,
  VIDEO_MODE_BUFFER_SIZE,
} from "./shared-buffers.js";
import { JS_CODE_TO_ADB_KEYCODE } from "./key-codes.js";
import { RingBuffer } from "./ringbuf.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const SCREEN_BUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT * 4; // RGBA

// Audio: 22.05 kHz mono 16-bit, ~1 second ring buffer via ringbuf.js.
// Matches infinite-mac's SharedMemoryEmulatorAudio layout.
const AUDIO_FREQ = 22050;
const AUDIO_CHANNELS = 1;
const AUDIO_BUFFER_CAPACITY = 2 * AUDIO_FREQ; // 1 second of 16-bit mono

// ---------------------------------------------------------------------------
// Shared buffers (SAB requires cross-origin isolation)
// ---------------------------------------------------------------------------

if (typeof SharedArrayBuffer === "undefined" || !crossOriginIsolated) {
  document.body.innerHTML =
    '<div style="padding:40px;color:#fff;font-family:monospace">' +
    "<h2>Cross-origin isolation required</h2>" +
    "<p>SharedArrayBuffer is not available. The page needs a moment to install " +
    "the coi-serviceworker shim — try reloading. If it still doesn't work " +
    "after a reload, your browser may not support SharedArrayBuffer.</p>" +
    "</div>";
  throw new Error("SharedArrayBuffer unavailable");
}

const inputBuffer = new SharedArrayBuffer(INPUT_BUFFER_SIZE * 4);
const inputBufferView = new Int32Array(inputBuffer);
const videoModeBuffer = new SharedArrayBuffer(VIDEO_MODE_BUFFER_SIZE * 4);
const videoModeBufferView = new Int32Array(videoModeBuffer);
const screenBuffer = new SharedArrayBuffer(SCREEN_BUFFER_SIZE);
const screenBufferView = new Uint8Array(screenBuffer);
const audioBuffer = RingBuffer.getStorageForCapacity(AUDIO_BUFFER_CAPACITY, Uint8Array);

// ---------------------------------------------------------------------------
// Canvas
// ---------------------------------------------------------------------------

const canvas = document.getElementById("canvas");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const canvasCtx = canvas.getContext("2d");
const imageData = canvasCtx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);

function fitCanvas() {
  let h = window.innerHeight;
  let w = Math.floor(h * (4 / 3));
  if (w > window.innerWidth) {
    w = window.innerWidth;
    h = Math.floor(w * 0.75);
  }
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
}
window.addEventListener("resize", fitCanvas);
fitCanvas();

let stopDrawing = false;
function drawScreen() {
  if (stopDrawing) return;
  const len = videoModeBufferView[0];
  if (len > 0) {
    imageData.data.set(screenBufferView.subarray(0, len));
    canvasCtx.putImageData(imageData, 0, 0);
  }
}

// ---------------------------------------------------------------------------
// Audio — AudioWorklet + ringbuf.js RingBuffer shared with the worker.
// ---------------------------------------------------------------------------

let audioContext = null;

async function initAudio() {
  audioContext = new AudioContext({ sampleRate: AUDIO_FREQ });
  await audioContext.audioWorklet.addModule("audio-worklet.js");
  const node = new AudioWorkletNode(audioContext, "basilisk-audio", {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [AUDIO_CHANNELS],
    processorOptions: { audioBuffer, sampleSize: 16 },
  });
  node.connect(audioContext.destination);
}

// ---------------------------------------------------------------------------
// Input (mouse + keyboard)
// ---------------------------------------------------------------------------

let inputQueue = [];

function acquireLock(view, addr) {
  return Atomics.compareExchange(
    view, addr,
    LockStates.READY_FOR_UI_THREAD,
    LockStates.UI_THREAD_LOCK,
  ) === LockStates.READY_FOR_UI_THREAD;
}

function releaseInputLock() {
  Atomics.store(inputBufferView, InputBufferAddresses.globalLockAddr, LockStates.READY_FOR_EMUL_THREAD);
  Atomics.notify(inputBufferView, InputBufferAddresses.globalLockAddr);
}

function tryToSendInput() {
  if (!inputQueue.length) return;
  if (!acquireLock(inputBufferView, InputBufferAddresses.globalLockAddr)) return;

  let hasMousePosition = false;
  let mousePositionX = 0, mousePositionY = 0;
  let mouseButtonState = -1, mouseButton2State = -1;
  let hasKeyEvent = false;
  let keyCode = -1, keyState = -1;
  const remaining = [];

  for (const ev of inputQueue) {
    switch (ev.type) {
      case "mousemove":
        hasMousePosition = true;
        mousePositionX = ev.x; mousePositionY = ev.y;
        break;
      case "mousedown":
      case "mouseup":
        if (ev.button === 2) mouseButton2State = ev.type === "mousedown" ? 1 : 0;
        else mouseButtonState = ev.type === "mousedown" ? 1 : 0;
        break;
      case "keydown":
      case "keyup":
        if (hasKeyEvent) { remaining.push(ev); break; }
        hasKeyEvent = true;
        keyState = ev.type === "keydown" ? 1 : 0;
        keyCode = ev.keyCode;
        break;
    }
  }

  if (hasMousePosition) {
    inputBufferView[InputBufferAddresses.mousePositionFlagAddr] = 1;
    inputBufferView[InputBufferAddresses.mousePositionXAddr] = mousePositionX;
    inputBufferView[InputBufferAddresses.mousePositionYAddr] = mousePositionY;
  }
  inputBufferView[InputBufferAddresses.mouseButtonStateAddr] = mouseButtonState;
  inputBufferView[InputBufferAddresses.mouseButton2StateAddr] = mouseButton2State;
  if (hasKeyEvent) {
    inputBufferView[InputBufferAddresses.keyEventFlagAddr] = 1;
    inputBufferView[InputBufferAddresses.keyCodeAddr] = keyCode;
    inputBufferView[InputBufferAddresses.keyStateAddr] = keyState;
  }

  releaseInputLock();
  inputQueue = remaining;
}

let canvasRect = canvas.getBoundingClientRect();
window.addEventListener("resize", () => { canvasRect = canvas.getBoundingClientRect(); });
const updateRect = () => { canvasRect = canvas.getBoundingClientRect(); };
window.addEventListener("scroll", updateRect, { passive: true });

function canvasToEmulator(event) {
  return {
    x: Math.round(((event.clientX - canvasRect.left) * SCREEN_WIDTH) / canvasRect.width),
    y: Math.round(((event.clientY - canvasRect.top) * SCREEN_HEIGHT) / canvasRect.height),
  };
}

canvas.addEventListener("mousemove", (e) => inputQueue.push({ type: "mousemove", ...canvasToEmulator(e) }));
canvas.addEventListener("mousedown", (e) => inputQueue.push({ type: "mousedown", button: e.button }));
canvas.addEventListener("mouseup", (e) => inputQueue.push({ type: "mouseup", button: e.button }));
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

window.addEventListener("keydown", (e) => {
  const adb = JS_CODE_TO_ADB_KEYCODE[e.code];
  if (adb === undefined) return;
  e.preventDefault();
  inputQueue.push({ type: "keydown", keyCode: adb });
});
window.addEventListener("keyup", (e) => {
  const adb = JS_CODE_TO_ADB_KEYCODE[e.code];
  if (adb === undefined) return;
  e.preventDefault();
  inputQueue.push({ type: "keyup", keyCode: adb });
});

// ---------------------------------------------------------------------------
// Worker startup (deferred until user click so AudioContext can start
// unsuspended and the Mac startup chime plays)
// ---------------------------------------------------------------------------

const loadingEl = document.getElementById("loading");
const progressEl = document.getElementById("progress");
const bootOverlay = document.getElementById("boot-overlay");

function setLoadingProgress(pct, label) {
  if (progressEl) progressEl.style.width = `${Math.max(2, pct)}%`;
  if (loadingEl && label) loadingEl.querySelector(".label").textContent = label;
}

const params = new URLSearchParams(location.search);
const gameKey = params.get("game") || "";

let worker = null;

async function startEmulator() {
  if (worker) return;
  if (bootOverlay) bootOverlay.style.display = "none";
  if (loadingEl) loadingEl.style.display = "";

  let diskUrl = "disk";
  if (gameKey) {
    try {
      const resp = await fetch("games.json");
      const games = await resp.json();
      if (games[gameKey]) {
        diskUrl = games[gameKey].disk;
        document.title = games[gameKey].title + " — Macintosh";
      }
    } catch (e) {}
  }

  await initAudio();

  worker = new Worker("worker.js", { type: "module" });

  worker.postMessage({
    type: "start",
    config: {
      inputBuffer,
      screenBuffer,
      videoModeBuffer,
      audioBuffer,
      screenWidth: SCREEN_WIDTH,
      screenHeight: SCREEN_HEIGHT,
      diskUrl,
    },
  });

  worker.onmessage = onWorkerMessage;
}

// Boot on first user gesture (click or key).
if (bootOverlay) {
  bootOverlay.addEventListener("click", startEmulator);
  document.addEventListener("keydown", startEmulator, { once: true });
} else {
  startEmulator();
}

function onWorkerMessage(e) {
  const msg = e.data;
  switch (msg?.type) {
    case "emulator_loading":
      setLoadingProgress(msg.completion * 100, "Loading Macintosh…");
      break;
    case "emulator_ready":
      setLoadingProgress(95, "Booting…");
      break;
    case "emulator_video_open":
      if (loadingEl) loadingEl.style.display = "none";
      canvas.focus();
      break;
    case "emulator_audio_open":
      break;
    case "emulator_error":
      console.error("Emulator error:", msg.error);
      if (loadingEl) {
        loadingEl.innerHTML = `<div class="err">Emulator error: ${msg.error}</div>`;
      }
      break;
    case "emulator_quit":
      stopDrawing = true;
      break;
  }
}

function asyncLoop() {
  drawScreen();
  tryToSendInput();
  requestAnimationFrame(asyncLoop);
}
asyncLoop();
