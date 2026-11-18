// SPDX-License-Identifier: GPL-3.0-or-later
// The cassette deck.
//
// Adapted from the standalone emulator at github.com/Retro-Jack/newbrain-js.
// It serves two different purposes depending on how the page was reached, and
// `interactive` is which.
//
// At the prompt there is no tape and no program, so the deck is the only way
// in: eject opens the file picker, play starts it, and the window in the lid
// says what is on the tape and how far through it the machine has got.
//
// On a game row the menu has already chosen the tape and the glue loads it
// unaided — but a NewBrain tape loads in real time, and without the deck the
// page showed nothing at all while it did. A minute of a dead screen reads as
// a broken page. So the deck comes along to say otherwise: the reels turn, the
// readout names the file, and the bar fills. The transport keys stay inert
// there, because that tape belongs to the menu rather than to the visitor and
// ejecting it would leave the page with no way back but a reload.
//
// Nothing here touches the COP. A file is turned into a signal and played into
// TPIN, and the machine's own microcode reads it, so the sequence is the one a
// real deck needs: tell BASIC to listen, then press play.
import { tapeBlocks } from './src/tape.js';

// A separator for the scrolling lines: spaces, a middle dot, spaces.
const TW_GAP = '   ·   ';
// Nineteen cells plus its two brackets is twenty-one characters, the full
// width of the readout grid — the same span as the rules above and below it.
const TW_CELLS = 19;
// The cursor the ROM blinks at the prompt, and how long to remember having
// seen it. It is dark for about 280ms at a time, so a single look lands in the
// gap often enough that it has to be remembered rather than tested outright.
const TW_CURSOR = 0x7f;
const TW_BLINK = 800;
const TW_ROWS = 24;
const TW_COLS = 40;
const TW_STRIDE = 64;

export function initDeck(sys, { interactive = true } = {}) {
  const machine = sys.machine;

  const deck = {
    // A cassette holds programs one after another, and a multi-part title is
    // exactly that: a BASIC loader followed by a binary, with the loader
    // asking for the binary once it is running. So the tape is a LIST of
    // files, concatenated. Each is already a chain of blocks whose type byte
    // flags its own first and last, so the join needs nothing in between.
    parts: [],
    bytes: null,
    // Where each part starts in the concatenated tape, so the readout can say
    // which file is going past rather than listing every one of them.
    offsets: [],
    total: 0,
    showing: -1,
    fileEl: document.getElementById('tapefile'),
    deckEl: document.getElementById('tapedeck'),
    // The reels turn only once the transport has been engaged from the panel.
    // The motor line alone will not do: typing LOAD raises it and holds it
    // high while the machine sits waiting for a signal, with nothing in the
    // deck and nothing moving, so the reels would spin at a stopped tape.
    engaged: false,
  };

  const winEl = document.getElementById('tapewin');
  const twName = document.getElementById('twname');
  const twBar = document.getElementById('twbar');
  const twCount = document.getElementById('twcount');
  const twNote = document.getElementById('twnote');

  // A line of the readout, scrolled only when it will not fit.
  //
  // The separator goes on the end of BOTH copies, not between them. Written as
  // text+gap+text the span is 2*text+gap wide, so translating -50% moves
  // text+gap/2 — half a separator short of one period, and it jumps by that
  // much every time round. Written as (text+gap)+(text+gap) the halves are
  // identical, -50% is exactly one period, and the loop closes.
  function twFit(box, text) {
    const span = box.firstElementChild;
    span.textContent = text;
    box.classList.remove('scroll');
    span.style.animationDuration = '';
    span.style.animationTimingFunction = '';
    if (!text) return;
    requestAnimationFrame(() => {
      if (span.scrollWidth - box.clientWidth <= 1) return;
      const period = text + TW_GAP;
      span.textContent = period.repeat(2);
      box.classList.add('scroll');
      // A steady reading pace whatever the length: one pass takes as long as
      // the text is wide.
      span.style.animationDuration =
        (span.scrollWidth / 2 / 26).toFixed(1) + 's';
      // Stepped, not smooth. The travel is one period, so one step per
      // character in it moves the line a whole cell at a time, which is the
      // only way a character display can move anything.
      span.style.animationTimingFunction = `steps(${period.length})`;
    });
  }

  function deckHint(text) {
    twFit(document.getElementById('twhint'), text || '');
    winEl.classList.toggle('nohint', !text);
  }

  // What each key is allowed to do, given what is in the deck.
  const can = { eject: true, next: false, rew: false, play: false, rec: false };

  const KEYS = {};
  for (const el of document.querySelectorAll('#tapedeck .key')) {
    KEYS[el.dataset.key] = el;
  }

  function deckKeys() {
    for (const [name, el] of Object.entries(KEYS)) {
      el.classList.toggle('off', !interactive || !can[name]);
    }
  }

  function deckState() {
    const loaded = !!deck.bytes;
    const playing = !!machine.tape;
    can.eject = true; // insert when empty, eject when not
    can.next = loaded; // parts after the first
    can.play = loaded && !playing;
    can.rew = playing;
    can.rec = machine.hasRecording;
    deckKeys();
    tapeWindow();
  }

  // The bar fills a cell at a time; null empties the trough entirely, which is
  // what an empty deck shows.
  function twProgress(frac) {
    if (frac === null) {
      twBar.textContent = '';
      return;
    }
    const lit = Math.max(0, Math.min(TW_CELLS, Math.round(frac * TW_CELLS)));
    twBar.textContent =
      '[' + '#'.repeat(lit) + '='.repeat(TW_CELLS - lit) + ']';
  }

  // Is BASIC sitting at its prompt, waiting to be told something?
  //
  // This started as a guess from the transport — motor stopped for longer than
  // a block gap — and the guess was wrong often enough to matter: the gaps
  // between blocks measured 0.18s, 2.70s and 3.72s on a multi-part load, and a
  // 3s threshold duly fired in the middle of the 3.72s one and told the user to
  // type something while the tape was still running.
  //
  // The machine will just say, though. The display is characters in RAM, 40 to
  // a row on a 64-byte stride from `tvl`, in plain ASCII, and the cursor is
  // 0x7F. Measured across a whole load: 0x7F never appears while the tape is
  // reading, never appears during either block gap, and blinks steadily through
  // the time the machine spends at the prompt. Unlike a timer it cannot be
  // wrong about a slow block.
  function cursorShowing() {
    const ram = machine.ram;
    const base = machine.tvl;
    const stride = machine.c80l ? TW_STRIDE * 2 : TW_STRIDE;
    const cols = machine.c80l ? TW_COLS * 2 : TW_COLS;
    for (let r = 0; r < TW_ROWS; r++) {
      const a = base + r * stride;
      for (let c = 0; c < cols; c++) {
        if (ram[(a + c) & 0x7fff] === TW_CURSOR) return true;
      }
    }
    return false;
  }

  function tapeWindow() {
    const n = deck.parts.length;
    winEl.classList.toggle('notape', !n);
    deck.deckEl.classList.toggle('empty', !n);
    // Not just the state but the remedy: the eject button is how a tape gets
    // in, and that is only discoverable from a tooltip, which is a hover away
    // and no use at all on a phone. "Press eject to insert" is exactly
    // twenty-one characters, so it fills the grid without scrolling.
    deck.showing = currentPart();
    const name = n ? deck.parts[deck.showing].name : 'No tape';
    // A tape in the deck shows an empty trough; an empty deck shows nothing.
    twProgress(n ? (machine.tape ? machine.tape.progress : 0) : null);
    // One sentence across two rows, so the count line takes the comma and the
    // note finishes it. With a single file there is no note to finish it, so
    // that line ends in a stop instead.
    twCount.textContent = n
      ? `${n} file${n === 1 ? '' : 's'} on the tape${n > 1 ? ',' : '.'}`
      : 'Press eject to insert';
    // Order only means something when there is more than one.
    twNote.textContent = n > 1 ? 'in that order.' : '';
    twFit(twName, name);
  }

  // Lays the parts end to end to make the tape.
  function deckRebuild() {
    const total = deck.parts.reduce((n, p) => n + p.bytes.length, 0);
    deck.offsets = [];
    deck.total = total;
    deck.showing = -1;
    if (!total) {
      deck.bytes = null;
      return;
    }
    const tape = new Uint8Array(total);
    let at = 0;
    for (const p of deck.parts) {
      deck.offsets.push(at);
      tape.set(p.bytes, at);
      at += p.bytes.length;
    }
    deck.bytes = tape;
  }

  // Which file is going past. The readout names that one rather than the whole
  // tape: a three-part title joined with " + " runs well past twenty-one
  // columns, so it scrolled, and a name that is scrolling is a name you cannot
  // read at a glance.
  //
  // At a boundary the offset lands on the next part's first byte, which is the
  // right answer: the file just read is finished with, and the one the machine
  // is about to be asked for is the one worth naming.
  function currentPart() {
    const n = deck.parts.length;
    if (!n) return -1;
    const at = machine.tape ? machine.tape.progress * deck.total : 0;
    let i = 0;
    while (i < n - 1 && at >= deck.offsets[i + 1]) i++;
    return i;
  }

  function doPlay() {
    deck.engaged = true;
    deck.waiting = undefined;
    deck.promptShown = false;
    machine.loadTape(deck.bytes);
    deckHint('Playing.');
  }

  function doRewind() {
    deck.engaged = true;
    deck.waiting = undefined;
    deck.promptShown = false;
    machine.loadTape(deck.bytes);
    deckHint('Rewound; playing from the start.');
  }

  function doEject() {
    deck.engaged = false;
    machine.ejectTape();
    deck.parts = [];
    deck.bytes = null;
    deck.fileEl.value = '';
    deck.offsets = [];
    deck.total = 0;
    deck.showing = -1;
    twProgress(null);
    deckHint('');
  }

  // Hands back whatever the machine has written to tape. The bytes are read off
  // the tape line and demodulated, so the file is the same shape as one off a
  // real cassette — the COP's own 00 in front of each block included — and it
  // loads straight back in.
  function doSave() {
    const bytes = machine.recordedTape();
    if (!bytes.length) {
      deckHint('Nothing recorded.');
      return;
    }
    deck.engaged = true;

    // Name the file after the tape's own name block, if it has one.
    let name = 'newbrain';
    if (bytes[0] === 0 && bytes.length > 3) {
      const count = bytes[1] | (bytes[2] << 8);
      if (bytes[3 + count] === 0x81 && count > 0 && count < 32) {
        const n = String.fromCharCode(...bytes.slice(3, 3 + count))
          .replace(/[^A-Za-z0-9 ._-]/g, '')
          .trim();
        if (n) name = n;
      }
    }

    const url = URL.createObjectURL(
      new Blob([bytes], { type: 'application/octet-stream' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '.bas';
    a.click();
    URL.revokeObjectURL(url);
    deckHint(`Saved ${name}.bas, ${bytes.length} bytes.`);
  }

  // They drive the deck's controls rather than repeating them, so what is
  // allowed when stays written down in one place. A key whose control is
  // disabled does nothing and stops looking clickable.
  const keyAction = {
    // Eject does double duty, which is what the two symbols moulded on it say:
    // with nothing in the deck it opens the file picker, and with a tape in it
    // ejects that tape and every part of it.
    eject: () => (deck.parts.length ? doEject() : deck.fileEl.click()),
    // Parts after the first go on with NEXT.
    next: () => deck.fileEl.click(),
    rew: doRewind,
    play: doPlay,
    ff: null, // nothing wired to it yet
    rec: doSave,
  };

  for (const [name, el] of Object.entries(KEYS)) {
    if (!interactive) break;
    el.addEventListener('click', () => {
      if (!can[name] || !keyAction[name]) return;
      // Play stays down for as long as the tape runs, so it is left to the
      // frame loop; the rest are momentary and flash.
      if (name !== 'play') {
        el.classList.add('down');
        setTimeout(() => el.classList.remove('down'), 170);
      }
      keyAction[name]();
      deckState();
    });
  }

  if (interactive)
    deck.fileEl.addEventListener('change', async () => {
      const picked = [...deck.fileEl.files];
      if (!picked.length) return;
      const first = !deck.parts.length;
      for (const file of picked) {
        deck.parts.push({
          name: file.name,
          bytes: new Uint8Array(await file.arrayBuffer()),
        });
      }
      deckRebuild();
      machine.ejectTape();
      twProgress(0);
      deckState();
      // A file that is not in tape format contributes no blocks, and encodeTape
      // simply has nothing to lay down for it — so it would go on the tape
      // silently and not be there. A raw memory image is one such. Say so rather
      // than let it look loaded.
      const notTapes = deck.parts.filter((p) => !tapeBlocks(p.bytes).length);
      if (notTapes.length) {
        deckHint(`${notTapes[0].name} is not a tape file.`);
      } else {
        deckHint(
          first
            ? 'Type  LOAD  then press play.'
            : `${deck.parts.length} programs on the tape, in that order.`,
        );
      }
      deck.fileEl.value = ''; // so the same file can be added again
      deck.fileEl.blur();
    });

  // Called once everything the readout needs exists.
  deckState();

  // What the glue puts in the deck on a game row: the menu's tape, named so the
  // readout can say which file is going past. `engage` is the glue pressing
  // play on the visitor's behalf — without it the reels stay still, since the
  // motor line alone is not evidence the transport is running.
  function insert(parts) {
    deck.parts = parts;
    deckRebuild();
    deckState();
  }
  function engage() {
    deck.engaged = true;
    deck.waiting = undefined;
    deck.promptShown = false;
    deckState();
  }

  // Driven from the host's frame loop, so the deck never runs a timer of its
  // own and never draws on a frame the machine did not advance through.
  function drawDeck() {
    const tape = machine.tape;
    // The reels follow the motor, but only after play or save has been
    // pressed — before that the deck is stopped however the motor line reads.
    deck.deckEl.classList.toggle('on', deck.engaged && machine.motor);
    // Play is held down while the tape is running, as it would be on the deck.
    KEYS.play.classList.toggle('down', deck.engaged && !!tape && !tape.played);
    if (can.rec !== machine.hasRecording) deckState();
    if (!tape) return;
    twProgress(tape.progress);

    // Name the file the tape is in now, and only re-set it when it changes —
    // twFit restarts the scroll, so calling it every frame would peg a long
    // name to its first character for ever.
    const part = currentPart();
    if (part !== deck.showing && part >= 0) {
      deck.showing = part;
      twFit(twName, deck.parts[part].name);
    }

    // A load is not one continuous run of tape. The ROM stops the motor between
    // blocks while it digests what it just read, and on a long program that
    // pause is easily long enough to look like something has gone wrong. Saying
    // so is the whole point of the line.
    //
    // Only transitions are announced, and the first reading is adopted in
    // silence, so this cannot talk over the hint whoever pressed the button
    // just set.
    if (deck.engaged && !tape.played) {
      const waiting = !machine.motor;
      if (deck.waiting === undefined) {
        deck.waiting = waiting;
      } else if (waiting !== deck.waiting) {
        deck.waiting = waiting;
        deckHint(waiting ? 'Please wait.' : 'Playing.');
      }

      // Stopped a good while with tape still to come, on a tape with more than
      // one file: the machine has finished a file and gone back to the prompt,
      // and it will sit there until told what to do next. Nobody is coming to
      // tell them that, so the readout does.
      //
      // It does not say which command, because the deck cannot know. A plain
      // multi-file tape wants LOAD again; a tape fronted by a loader, which
      // is most of them, wants RUN and then fetches the rest itself.
      if (waiting && deck.parts.length > 1) {
        if (cursorShowing()) deck.cursorAt = performance.now();
        const atPrompt =
          deck.cursorAt !== undefined &&
          performance.now() - deck.cursorAt < TW_BLINK;
        if (atPrompt && !deck.promptShown) {
          deck.promptShown = true;
          deckHint('Waiting. Type  RUN  or  LOAD  for the next part.');
        }
      } else {
        deck.cursorAt = undefined;
        deck.promptShown = false;
      }
    }

    // `played`, not `finished`: the ROM stops the motor on the last block and
    // never runs out the gap tone behind it, so the signal never ends on its
    // own. Once the data has gone past there is nothing left to say, so the
    // status clears rather than sitting on "playing" for good.
    if (tape.played && !deck.doneShown) {
      deck.doneShown = true;
      deckHint('');
      deckState();
    } else if (!tape.played) {
      deck.doneShown = false;
    }
  }

  return { draw: drawDeck, insert, engage };
}
