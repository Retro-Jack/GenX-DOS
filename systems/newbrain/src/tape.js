// SPDX-License-Identifier: GPL-3.0-or-later
// Grundy NewBrain AD — cassette.
//
// The COP420 modulates and demodulates the tape itself; the Z80 only hands it
// whole bytes. So a tape is emulated by driving the TPIN pin with a signal the
// real microcode will accept, and the ROM then does its own framing and
// checksumming exactly as it would off a real cassette.
//
// The encoding below was measured from recordings the emulated machine made of
// itself, and verified by decoding them back: 150 half cycles of a saved block
// parse into 15 frames with no framing violations and the bytes the ROM wrote.
//
//   a 1 bit   two cycles of the high tone      four half cycles of ~832
//   a 0 bit   one cycle of the low tone        ~1660 then ~1795
//   a byte    start bit 1, eight data bits most significant first, stop bit 0
//
// A block's type byte reads: bit 7 first block, bit 6 last block, bits 0-5 the
// sequence number — which matches the format published at newbrainemu.eu, as
// does everything above that was measured here rather than read.
//   a leader  repeating 2208 2208 1120 1120, a tone of its own
//
// All figures are Z80 T-states at 4MHz. The leader runs out one half cycle
// into its group before the first frame, which the demodulator needs in order
// to find the start bit — without it nothing decodes at all.

const LEADER_GROUP = [2208, 2208, 1120, 1120];
const JOIN         = 2208;
const ONE          = [832, 832, 832, 832];   // 3328
const ZERO         = [1655, 1793];           // 3448

// Leader before a block, and tone after it. The gap has to be long enough for
// the ROM to stow one block and come back for the next.
export const TAPE_DEFAULTS = { leaderCells: 600, gapCells: 200 };

// Splits a tape file into blocks. Each is a 00 the COP lays down itself, a
// two byte count, the data, a type byte, a two byte checksum and nine zeroes.
export function tapeBlocks(bytes) {
  const raw = Uint8Array.from(bytes), out = [];
  let p = 0;
  while (p + 3 <= raw.length && raw[p] === 0x00) {
    const count = raw[p + 1] | (raw[p + 2] << 8);
    const body = p + 3 + count + 3;          // 00, count, data, type, checksum
    if (body > raw.length) break;
    // The nine byte trailer is laid down by the writer and never read back, so
    // a file whose last one was cut short is still perfectly loadable.
    out.push(raw.subarray(p, Math.min(body + 9, raw.length)));
    p = body + 9;
  }
  return out;
}

// Turns a tape file into a list of half cycle lengths.
export function encodeTape(bytes, opts = {}) {
  const { leaderCells, gapCells } = { ...TAPE_DEFAULTS, ...opts };
  const blocks = tapeBlocks(bytes);
  const out = [];
  const push = a => { for (const v of a) out.push(v); };

  for (const block of (blocks.length ? blocks : [Uint8Array.from(bytes)])) {
    for (let i = 0; i < leaderCells; i++) push(LEADER_GROUP);
    out.push(JOIN);
    for (const byte of block) {
      push(ONE);                                        // start
      for (let b = 7; b >= 0; b--) push((byte >> b) & 1 ? ONE : ZERO);
      push(ZERO);                                       // stop
    }
    for (let i = 0; i < gapCells; i++) push(LEADER_GROUP);
  }
  return Int32Array.from(out);
}

// Reads back what the machine put on the tape line, which is the exact inverse
// of encodeTape. The four half cycle lengths in play separate cleanly: the
// data's are about 832 and 1660/1795, the leader tone's about 1120 and 2208,
// so a window either side of 1000..1400 tells data from tone without having to
// find the leader's end first.
const isShort = g => g < 1000;                   // a data 1's quarter
const isLong  = g => g >= 1400 && g < 2000;      // a data 0's half

// Turns captured half cycle lengths back into the bytes that were written.
export function decodeTape(gaps) {
  const out = [];
  let i = 0;

  while (i < gaps.length) {
    // Walk forward to the start of a frame: a 1 bit, which is the start bit.
    if (!(isShort(gaps[i]) && isShort(gaps[i + 1]) &&
          isShort(gaps[i + 2]) && isShort(gaps[i + 3]))) { i++; continue; }

    const cells = [];
    let j = i;
    while (cells.length < 10) {
      if (isShort(gaps[j]) && isShort(gaps[j + 1]) &&
          isShort(gaps[j + 2]) && isShort(gaps[j + 3])) { cells.push(1); j += 4; }
      else if (isLong(gaps[j]) && isLong(gaps[j + 1])) { cells.push(0); j += 2; }
      else break;
    }

    // start bit 1, eight data bits most significant first, stop bit 0
    if (cells.length === 10 && cells[0] === 1 && cells[9] === 0) {
      let v = 0;
      for (let k = 0; k < 8; k++) v = (v << 1) | cells[1 + k];
      out.push(v);
      i = j;
    } else {
      i++;
    }
  }
  return Uint8Array.from(out);
}

// Captures the tape line while the machine is writing to it, as the lengths
// between level changes. Nothing is decoded until the bytes are asked for, so
// recording costs one number per half cycle and no more.
export class TapeRecorder {
  constructor() { this.gaps = []; this.clock = 0; this.last = -1; this.sinceEdge = 0; }

  get empty() { return this.gaps.length === 0; }
  clear() { this.gaps.length = 0; this.sinceEdge = 0; this.last = -1; }

  // Called with the tape output level and the cycles elapsed since last time.
  sample(level, delta) {
    this.sinceEdge += delta;
    if (this.last === -1) { this.last = level; this.sinceEdge = 0; return; }
    if (level !== this.last) {
      this.gaps.push(this.sinceEdge);
      this.sinceEdge = 0;
      this.last = level;
    }
  }

  bytes() { return decodeTape(this.gaps); }
}

// Plays a list of half cycle lengths, flipping the tape level as each elapses.
// It is driven by elapsed time rather than absolute cycles, because the tape
// only moves while the motor is running: the ROM stops it between blocks while
// it stows one away, and the tape has to wait exactly as a real one would.
export class TapePlayer {
  constructor(durations) {
    this.durations = durations;
    this.index = 0;
    this.level = 0;
    this.clock = 0;
    this.nextAt = 0;
  }

  get finished() { return this.index >= this.durations.length; }
  get progress() { return this.durations.length ? this.index / this.durations.length : 1; }

  // Runs the tape on by `delta` T-states, returning the level now at TPIN.
  advance(delta) {
    this.clock += delta;
    while (this.index < this.durations.length && this.clock >= this.nextAt) {
      this.nextAt += this.durations[this.index++];
      this.level ^= 1;
    }
    return this.level;
  }
}
