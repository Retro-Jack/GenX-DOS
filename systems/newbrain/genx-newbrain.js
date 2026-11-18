// SPDX-License-Identifier: GPL-3.0-or-later
// GenX-DOS boot glue for the Grundy NewBrain.
//
// The machine is emulated by src/, which is ours and the same code published
// at github.com/Retro-Jack/newbrain-js. This file is the part that makes it a
// GenX-DOS system: it loads the ROMs, places the two displays from measured
// regions, runs the machine against the clock, and starts whatever ?game= the
// menu asked for.
//
// Loading a tape on a real NewBrain means typing LOAD and then pressing
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

// Which menu row this is. The prompt entry comes with no game chosen, and it
// is the only one that gets a cassette deck: every other row has its tape
// picked already and the glue below loads it unaided.
const wanted = new URLSearchParams(location.search).get('game');
const atPrompt = !wanted;

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
  put(document.getElementById('tvswitch'), reg.tvswitch.place);

  // The deck is on every row. At the prompt it is the only way to get a
  // tape in; on a game row it is the only thing that shows the load
  // happening at all, since a NewBrain tape loads in real time and the
  // screen stays blank throughout. What differs is whether its keys do
  // anything — see genx-deck.js.
  document.body.classList.add('deck');
  put(document.getElementById('tapedeck'), reg.deck.place);
  within(document.querySelector('#tapedeck i'), reg.deck.reels);
  within(document.getElementById('tapewin'), reg.deck.window);
  for (const [k, r] of Object.entries(reg.deck.buttons)) {
    within(document.querySelector(`#tapedeck .key[data-key="${k}"]`), r);
  }
  for (const sm of reg.deck.seams || []) {
    within(
      document.querySelector(
        `#tapedeck .seam[data-left="${sm.from}"][data-right="${sm.to}"]`,
      ),
      sm,
    );
  }
  // How far a pressed key sinks, measured off the artwork and expressed as a
  // share of the key's own height, so it holds at any size the deck is drawn.
  document
    .getElementById('tapedeck')
    .style.setProperty('--keydrop', reg.deck.keyDrop + '%');
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
// The panel draws around 9px to a character, and Segment16C's strokes are
// thinner than a pixel at that size, so anti-aliasing spreads each one over
// two pixels at partial coverage and none of them ever fills. Measured peak
// alpha was 209 of 255 — all edge, no core, which is why the lit colour above
// never looked as bright as it is. Drawing each glyph more than once, with a
// hairline stroke widening it toward a whole pixel, puts the core back.
// Rendering larger and scaling down does not help: it redistributes coverage
// rather than adding any, and measured slightly worse than doing nothing.
const VFD_PASSES = 2;
const VFD_STROKE = 0.2;
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
  vfdCtx.fillStyle = VFD_UNLIT;
  for (let i = 0; i < N; i++) {
    vfdCtx.fillText('█', cw * (i + 0.5), H / 2); // every segment, faint, as an unlit cell reads
  }
  vfdCtx.fillStyle = VFD_LIT;
  vfdCtx.strokeStyle = VFD_LIT;
  vfdCtx.lineWidth = VFD_STROKE;
  vfdCtx.lineJoin = 'round';
  vfdCtx.shadowColor = VFD_LIT;
  vfdCtx.shadowBlur = VFD_GLOW;
  for (let p = 0; p < VFD_PASSES; p++) {
    for (let i = 0; i < N; i++) {
      const ch = text[i];
      if (!ch || ch === ' ') continue;
      const x = cw * (i + 0.5),
        y = H / 2;
      vfdCtx.fillText(ch, x, y);
      if (VFD_STROKE) vfdCtx.strokeText(ch, x, y);
    }
  }
  vfdCtx.shadowBlur = 0;
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
// Declared above the handlers because they have to know a paste is running --
// see "pasting from the host" below.
let pasting = false;

addEventListener('keydown', (e) => {
  // Return WITHOUT preventDefault: the browser's default action for this
  // keystroke IS the paste, so suppressing it kills the paste event. Returning
  // early is enough to keep V off the matrix, and it has to be kept off --
  // CONTROL and V are both real keys here and CONTROL+V is a real editing
  // command, which turns the cursor into an underline and walks it about.
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyV') return;
  // A paste types on the machine's behalf; a key the user is still holding
  // from the shortcut would land in the middle of it.
  if (pasting) {
    e.preventDefault();
    return;
  }
  const k = KEYMAP[e.code];
  if (!k) return;
  e.preventDefault();
  machine.setKey(k[0], k[1], true);
});
addEventListener('keyup', (e) => {
  if (pasting) {
    e.preventDefault();
    return;
  }
  const k = KEYMAP[e.code];
  if (!k) return;
  e.preventDefault();
  machine.setKey(k[0], k[1], false);
});
addEventListener('blur', () => machine.clearKeys());

// ---- pasting from the host -------------------------------------------------
// Typed on the machine's own matrix, one key at a time, as a person would.
// Nothing is injected into memory and nothing is hurried: the COP scans the
// keyboard every 20ms, so a key is held for three scans and a listing arrives
// at the speed the machine can take it. Esc stops a paste -- which is also the
// machine's STOP key, the right thing to reach for if one is going astray.
//
// The map is of what a key produces on THIS machine rather than what is on the
// host's keycap. The NewBrain moves several characters: the double quote is
// shift-2, the apostrophe lives on 7, and the bracket keys give ( and )
// unshifted. See controls.html. Anything with no key is skipped rather than
// guessed -- a wrong character in a listing is worse than a missing one,
// because it is silent.
const PASTE_KEY = (() => {
  const m = {};
  const plain = (ch, code) => {
    m[ch] = [code, false];
  };
  const shift = (ch, code) => {
    m[ch] = [code, true];
  };
  for (let i = 0; i < 26; i++) {
    const code = 'Key' + String.fromCharCode(65 + i);
    plain(String.fromCharCode(97 + i), code);
    shift(String.fromCharCode(65 + i), code);
  }
  for (let d = 0; d <= 9; d++) plain(String(d), 'Digit' + d);
  plain(' ', 'Space');
  plain('\n', 'Enter');
  plain(',', 'Comma');
  plain('.', 'Period');
  plain('/', 'Slash');
  plain(';', 'Semicolon');
  plain('-', 'Minus');
  plain('=', 'Equal');
  plain('(', 'BracketLeft');
  shift('[', 'BracketLeft');
  plain(')', 'BracketRight');
  shift(']', 'BracketRight');
  plain('+', 'Quote');
  shift('^', 'Quote');
  shift('\\', 'Minus');
  shift('@', 'Equal');
  shift('"', 'Digit2');
  shift("'", 'Digit7');
  shift('#', 'Digit3');
  return m;
})();

// The COP's scan is 20ms, so 60ms of hold is three scans and cannot be missed.
// Shift closes over the keypress with a margin either side; a short overlap is
// how a closing quote once came out as a 2.
const PASTE_HOLD = 60,
  PASTE_GAP = 60,
  PASTE_SHIFT_LEAD = 90;

async function pasteText(text) {
  if (pasting) return;
  pasting = true;
  // Whatever was held to trigger this -- Ctrl, Shift -- is not part of what
  // was pasted.
  machine.clearKeys();
  const SHIFT = KEYMAP.ShiftLeft;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    for (const raw of text.replace(/\r\n?/g, '\n').replace(/\t/g, ' ')) {
      if (!pasting) break;
      const hit = PASTE_KEY[raw];
      if (!hit) continue;
      const [code, needShift] = hit;
      const k = KEYMAP[code];
      if (!k) continue;
      if (needShift) {
        machine.setKey(SHIFT[0], SHIFT[1], true);
        await wait(PASTE_SHIFT_LEAD);
      }
      machine.setKey(k[0], k[1], true);
      await wait(PASTE_HOLD);
      machine.setKey(k[0], k[1], false);
      if (needShift) {
        await wait(PASTE_SHIFT_LEAD);
        machine.setKey(SHIFT[0], SHIFT[1], false);
      }
      await wait(PASTE_GAP);
    }
  } finally {
    machine.clearKeys();
    pasting = false;
  }
}

addEventListener('paste', (e) => {
  const text = e.clipboardData && e.clipboardData.getData('text');
  if (!text) return;
  e.preventDefault();
  pasteText(text);
});
addEventListener('keydown', (e) => {
  if (e.code === 'Escape') pasting = false;
});

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

// ---- the TV switch ---------------------------------------------------------
// `tvp` is the ROM's own TV-picture bit on ENRG1 and the machine writes it
// itself, so there is no hardware line to flip. This gates the drawing
// instead, which is the honest equivalent of the television being off: the
// machine runs on exactly as it did -- it has no way to know -- and its
// sixteen-character VF panel carries on, which is the whole reason the panel
// is there. Plenty of NewBrains were used with no television at all.
const tvEl = document.getElementById('tvswitch');
const tvImg = tvEl.querySelector('img');
let tvOn = true;
tvEl.addEventListener('click', () => {
  tvOn = !tvOn;
  tvEl.setAttribute('aria-pressed', String(tvOn));
  tvImg.src = tvOn ? 'art/tv-on.webp' : 'art/tv-off.webp';
  tvImg.alt = tvOn ? 'TV mode on' : 'TV mode off';
  // Clear once on the way out rather than every frame while it is off.
  if (!tvOn) crt.clearRect(0, 0, crtEl.width, crtEl.height);
});

const { initDeck } = await import('./genx-deck.js');
// The keys are live only at the prompt. On a game row the tape is the
// menu's, not the visitor's, and ejecting it would leave the page with no
// way back but a reload — so the deck is there to be read, not pressed.
const deck = initDeck(sys, { interactive: atPrompt });
const drawDeck = deck.draw;

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
    drawDeck();
    if (tvOn) {
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
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---- whatever the menu asked for -------------------------------------------
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
    // Show it in the deck, named as the tape file is, so the readout has
    // something to say and the bar something to fill against.
    deck.insert([{ name: game.tape.replace(/^.*\//, ''), bytes: tapeBytes }]);

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
      await type('LOAD\n');
      await sleep(200);
      deck.engage(); // the glue is pressing play, so the reels may turn
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
