// SPDX-License-Identifier: GPL-3.0-or-later
// GenX-DOS boot glue for the Grundy NewBrain.
//
// The machine is emulated by src/, which is ours and the same code published
// at github.com/Retro-Jack/newbrain-js. This file is the part that makes it a
// GenX-DOS system: it loads the ROMs, places the two displays from measured
// regions, runs the machine against the clock, and starts whatever ?game= the
// menu asked for.
//
// Loading a tape on a real NewBrain means typing LOAD "" and then pressing
// play, in that order — the machine has to be listening before the tape
// starts. A visitor picking a game from a menu should not have to know that,
// so the glue types it and starts the tape itself.

import { NewBrainSystem, CPU_HZ } from './src/system.js';
import { NewBrain, SCREEN_W, SCREEN_H } from './src/newbrain.js';

// Nothing is captioned on the page: the monitor and the machine are the whole
// picture, and a line of grey text under them only competes with it. Progress
// and failures still go somewhere — the console — so a page that cannot find
// its ROMs can still be diagnosed without being narrated to the visitor.
const say = (t) => console.log('[newbrain] ' + t);

// ---- the two displays, placed from measured regions ------------------------
const reg = await fetch('art/regions.json').then((r) => r.json());
{
  const put = (el, r) => {
    el.style.left = r.left + '%';
    el.style.top = r.top + '%';
    el.style.width = r.width + '%';
  };
  const within = (el, r) => {
    el.style.left = r.left + '%';
    el.style.top = r.top + '%';
    el.style.width = r.width + '%';
    el.style.height = r.height + '%';
  };
  put(document.getElementById('monitor'), reg.cub.place);
  put(document.getElementById('machine'), reg.machine.place);
  within(document.getElementById('screenbg'), reg.cub.hole);
  within(document.getElementById('crt'), reg.cub.crt);
  within(document.getElementById('vfd'), reg.machine.vfd);
}

// ---- ROMs ------------------------------------------------------------------
const ROMS = [
  'aben191.ic6',
  'cdi3.ic7',
  'ef iss 1.ic8',
  'char eprom iss 1.ic453',
  'cop420-guw.ic419',
];
let ab, cd, ef, chargen, copRaw;
try {
  [ab, cd, ef, chargen, copRaw] = await Promise.all(
    ROMS.map((n) =>
      fetch('roms/' + encodeURIComponent(n))
        .then((r) => {
          if (!r.ok) throw new Error(n + ': HTTP ' + r.status);
          return r.arrayBuffer();
        })
        .then((b) => new Uint8Array(b)),
    ),
  );
} catch (err) {
  say('ROMs missing — see ROMS.txt');
  throw err;
}

// MAME marks this dump BAD and repairs two bytes before running it; the file
// on disk is never modified.
const cop = Uint8Array.from(copRaw);
cop[0x20a] = 0xc6;
cop[0x231] = 0xa6;

const sys = new NewBrainSystem({ ab, cd, ef, chargen, cop });
const machine = sys.machine;
window.genxNewBrain = sys; // a handle for the console, as the other bundles keep

// ---- CRT -------------------------------------------------------------------
const crtEl = document.getElementById('crt');
const crt = crtEl.getContext('2d', { alpha: true });
const src = document.createElement('canvas');
src.width = SCREEN_W;
src.height = SCREEN_H;
const sctx = src.getContext('2d', { alpha: false });
const img = sctx.createImageData(SCREEN_W, SCREEN_H);

// Drawn through an offscreen canvas rather than by CSS: the picture is wider
// than its box on most windows, and `image-rendering: pixelated` on a
// downscale drops whole columns, taking parts of glyphs with it.
function sizeCrt() {
  const r = crtEl.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.round(r.width * dpr));
  const h = Math.max(1, Math.round(r.height * dpr));
  if (crtEl.width !== w || crtEl.height !== h) {
    crtEl.width = w;
    crtEl.height = h;
  }
  crt.imageSmoothingEnabled = w < SCREEN_W || h < SCREEN_H;
  crt.imageSmoothingQuality = 'high';
}
sizeCrt();
addEventListener('resize', sizeCrt);
new ResizeObserver(sizeCrt).observe(crtEl);

// ---- VF display ------------------------------------------------------------
const vfdEl = document.getElementById('vfd');
const vfdCtx = vfdEl.getContext('2d');
const VFD_LIT = 'rgb(222,255,236)';
const VFD_UNLIT = 'rgba(150,210,170,0.13)';
const VFD_GLOW = 6;
let vfdPrev = null;
let vfdReady = false;
document.fonts.load('16px Segment16C').then(() => {
  vfdReady = true;
  vfdPrev = null;
});

// Drawn at the size it is shown, not scaled from a fixed bitmap — the panel is
// drawn rather than blitted, so there is nothing to preserve by doing it the
// other way, and a downscale would eat parts of the strokes.
function sizeVfd() {
  const r = vfdEl.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.round(r.width * dpr));
  const h = Math.max(1, Math.round(r.height * dpr));
  if (vfdEl.width !== w || vfdEl.height !== h) {
    vfdEl.width = w;
    vfdEl.height = h;
    vfdPrev = null;
  }
}
sizeVfd();
addEventListener('resize', sizeVfd);
new ResizeObserver(sizeVfd).observe(vfdEl);

function drawVfd() {
  if (!vfdReady) return;
  const text = machine.vfdText();
  if (text === vfdPrev) return;
  vfdPrev = text;
  const W = vfdEl.width,
    H = vfdEl.height,
    N = 16,
    cw = W / N;
  vfdCtx.clearRect(0, 0, W, H);
  vfdCtx.textAlign = 'center';
  vfdCtx.textBaseline = 'middle';
  vfdCtx.font = Math.round(H * 0.92) + 'px Segment16C';
  for (let i = 0; i < N; i++) {
    const x = cw * (i + 0.5),
      y = H / 2;
    vfdCtx.fillStyle = VFD_UNLIT;
    vfdCtx.fillText('█', x, y); // every segment, faint, as an unlit cell reads
    const ch = text[i];
    if (ch && ch !== ' ') {
      vfdCtx.fillStyle = VFD_LIT;
      vfdCtx.shadowColor = VFD_LIT;
      vfdCtx.shadowBlur = VFD_GLOW;
      vfdCtx.fillText(ch, x, y);
      vfdCtx.shadowBlur = 0;
    }
  }
}

// ---- keyboard --------------------------------------------------------------
// Mapped by physical key, so the layout does not depend on the host's keymap.
const KEYMAP = {
  KeyA: [13, 0],
  KeyB: [7, 3],
  KeyC: [9, 3],
  KeyD: [11, 0],
  KeyE: [11, 2],
  KeyF: [10, 0],
  KeyG: [9, 0],
  KeyH: [8, 0],
  KeyI: [3, 0],
  KeyJ: [2, 3],
  KeyK: [13, 3],
  KeyL: [6, 0],
  KeyM: [4, 3],
  KeyN: [3, 3],
  KeyO: [5, 0],
  KeyP: [9, 1],
  KeyQ: [13, 2],
  KeyR: [10, 2],
  KeyS: [12, 0],
  KeyT: [9, 2],
  KeyU: [2, 0],
  KeyV: [8, 3],
  KeyW: [12, 2],
  KeyX: [10, 3],
  KeyY: [4, 0],
  KeyZ: [11, 3],
  Digit1: [8, 2],
  Digit2: [7, 2],
  Digit3: [6, 2],
  Digit4: [5, 2],
  Digit5: [4, 2],
  Digit6: [3, 2],
  Digit7: [2, 2],
  Digit8: [2, 1],
  Digit9: [3, 1],
  Digit0: [4, 1],
  Space: [14, 2],
  Enter: [13, 1],
  NumpadEnter: [13, 1],
  ShiftLeft: [15, 0],
  ShiftRight: [15, 0],
  ControlLeft: [15, 3],
  ControlRight: [15, 3],
  Escape: [0, 1],
  Home: [14, 3],
  Insert: [12, 3],
  ArrowUp: [1, 3],
  ArrowDown: [1, 0],
  ArrowLeft: [1, 2],
  ArrowRight: [1, 1],
  Comma: [5, 3],
  Period: [6, 3],
  Slash: [14, 0],
  Semicolon: [7, 0],
  Minus: [11, 1],
  Equal: [10, 1],
  BracketLeft: [5, 1],
  BracketRight: [6, 1],
  Quote: [12, 1],
  Backquote: [8, 1],
  Tab: [15, 1],
  Backspace: [1, 2],
};
addEventListener('keydown', (e) => {
  const k = KEYMAP[e.code];
  if (!k) return;
  e.preventDefault();
  machine.setKey(k[0], k[1], true);
});
addEventListener('keyup', (e) => {
  const k = KEYMAP[e.code];
  if (!k) return;
  e.preventDefault();
  machine.setKey(k[0], k[1], false);
});
addEventListener('blur', () => machine.clearKeys());

// ---- the cassette ----------------------------------------------------------
// There is no deck on the page. The machine still loads from tape exactly as
// it did — the signal is real and the ROM decodes it bit by bit — but the
// page drives it: a visitor picking a game from a menu never has to know that
// a NewBrain wants telling to listen before the tape starts, so there is
// nothing for them to press and nothing to explain.
let tapeBytes = null;

function startTape() {
  if (!tapeBytes) return;
  machine.loadTape(tapeBytes);
}

// Types on the machine's own matrix, holding each key long enough for the
// COP's scan to see it.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function type(text) {
  for (const ch of text) {
    const quoted = ch === '"';
    const k = KEYMAP[quoted ? 'Digit2' : keyFor(ch)];
    if (!k) continue;
    if (quoted) {
      machine.setKey(15, 0, true);
      await sleep(120);
    }
    machine.setKey(k[0], k[1], true);
    await sleep(130);
    machine.setKey(k[0], k[1], false);
    await sleep(130);
    if (quoted) {
      machine.setKey(15, 0, false);
      await sleep(160);
    }
  }
}
function keyFor(ch) {
  if (ch === '\n') return 'Enter';
  if (ch === ' ') return 'Space';
  if (ch >= 'A' && ch <= 'Z') return 'Key' + ch;
  if (ch >= '0' && ch <= '9') return 'Digit' + ch;
  return null;
}

// ---- run -------------------------------------------------------------------
// Paced against the clock, not the display: rAF fires at the monitor's refresh
// rate, which on a fast panel would run the machine several times too quickly.
// The draw happens only when the machine has moved on, so a 180Hz screen does
// not redraw a 50Hz picture three times over.
const FRAME_MS = 1000 / 50;
let acc = 0,
  prev = performance.now();

// A tape loads in real time, because that is what a tape does: BreakOut takes
// the better part of a minute. That is honest for a machine you are sitting in
// front of and tiresome for someone who has just clicked a menu entry, so the
// machine is run hard while a tape is loading and dropped back to its own
// speed once the game is up. Nothing about the emulation changes — the tape is
// clocked off machine cycles, so every signal stays in proportion; only the
// wall clock moves.
let turbo = false;
const FRAMES_PER_TICK = () => (turbo ? 60 : 4);

function frame() {
  const now = performance.now();
  acc += Math.min(now - prev, 200);
  prev = now;
  let ran = 0;
  const budget = FRAMES_PER_TICK();
  if (turbo) acc = FRAME_MS * budget; // run flat out rather than against the clock
  while (acc >= FRAME_MS && ran < budget) {
    sys.runFrame();
    acc -= FRAME_MS;
    ran++;
  }
  if (ran) {
    drawVfd();
    machine.renderInto(img.data);
    sctx.putImageData(img, 0, 0);
    crt.clearRect(0, 0, crtEl.width, crtEl.height);
    crt.drawImage(
      src,
      0,
      0,
      SCREEN_W,
      SCREEN_H,
      0,
      0,
      crtEl.width,
      crtEl.height,
    );
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---- whatever the menu asked for -------------------------------------------
const wanted = new URLSearchParams(location.search).get('game');
if (!wanted) {
  say('NewBrain BASIC');
} else {
  let games;
  try {
    games = await (await fetch('games.json')).json();
  } catch (e) {
    say('Failed to load games.json: ' + e.message);
    throw e;
  }
  const game = games[wanted];
  if (!game) {
    say('Unknown game: ' + wanted);
  } else {
    say('Loading ' + game.title + '…');
    tapeBytes = new Uint8Array(await (await fetch(game.tape)).arrayBuffer());

    // PWRUP is an RC delay of 5.6 seconds on the real machine, and BASIC is
    // not listening until it has passed. Wait it out, tell the machine to
    // load, and only then start the tape.
    (async () => {
      // PWRUP rises on a 5.6 second RC delay, but the ROM is not ready for a
      // command the instant it does — it still has its own start-up to do.
      // Typing into it too early is swallowed, and the machine sits at READY
      // having heard nothing.
      turbo = true;
      while (!machine.pwrup) await sleep(100);
      await sleep(4000);
      await type('LOAD ""\n');
      await sleep(200);
      startTape();
      say('Loading ' + game.title + '\u2026');

      // A tape only puts the program in memory; the machine sits at READY
      // afterwards waiting to be told to run it. Someone who picked a game
      // from a menu has already said what they want.
      // Not `tape.finished`: the tape only moves while the motor turns, and
      // the ROM stops the motor the moment it has the last block — leaving
      // the run-out tone unplayed, so the tape never reports itself finished.
      // The motor going quiet and staying quiet is what means "done".
      let still = 0;
      while (still < 10) {
        await sleep(200);
        still = machine.motor ? 0 : still + 1;
      }
      await type('RUN\n');
      turbo = false;
      say(game.title);
    })();
  }
}
