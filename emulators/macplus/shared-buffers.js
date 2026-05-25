// Shared-memory buffer layout used between the renderer (UI thread) and the
// emulator worker. The address constants and lock-state protocol mirror
// Infinite Mac's `src/emulator/common/common.ts` so that the vendored
// BasiliskII WASM (which reads these addresses by name via `workerApi`) sees
// exactly what it expects.
//
// Adapted from Infinite Mac (https://github.com/mihaip/infinite-mac),
// Copyright Mihai Parparita, Apache License 2.0. See LICENSE-infinite-mac.

export const InputBufferAddresses = {
  globalLockAddr: 0,

  mousePositionFlagAddr: 1,
  mousePositionXAddr: 2,
  mousePositionYAddr: 3,
  mouseButtonStateAddr: 4,
  mouseButton2StateAddr: 16,
  mouseDeltaXAddr: 13,
  mouseDeltaYAddr: 14,

  keyEventFlagAddr: 5,
  keyCodeAddr: 6,
  keyStateAddr: 7,
  keyModifiersAddr: 15,

  stopFlagAddr: 8,
  ethernetInterruptFlagAddr: 9,
  audioContextRunningFlagAddr: 10,

  speedFlagAddr: 11,
  speedAddr: 12,

  useMouseDeltasFlagAddr: 17,
  useMouseDeltasAddr: 18,

  pausedAddr: 19,
};

export const LockStates = {
  READY_FOR_UI_THREAD: 0,
  UI_THREAD_LOCK: 1,
  READY_FOR_EMUL_THREAD: 2,
  EMUL_THREAD_LOCK: 3,
};

export const INPUT_BUFFER_SIZE = 100;
export const VIDEO_MODE_BUFFER_SIZE = 10;

// Ethernet receive ring-buffer layout (Int32 header + Uint8 body).
// Header: [0]=writeIndex, [1]=readIndex. Body holds length-prefixed frames
// (uint16 BE length + frame bytes), wrapping at body length.
export const ETHERNET_HEADER_INTS = 2;
export const ETHERNET_BODY_SIZE = 1522 * 16;
export const ETHERNET_BUFFER_SIZE = ETHERNET_HEADER_INTS * 4 + ETHERNET_BODY_SIZE;
