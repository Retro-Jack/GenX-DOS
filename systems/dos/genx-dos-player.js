/* genx-dos-player.js — a small DOS frontend for GenX-DOS.
 *
 * js-dos ships a full player of its own, but we use the layer underneath it,
 * the `emulators` package, for three reasons: its player wants OPFS and so
 * refuses to run outside a secure context; it brings a UI we would only have
 * to hide; and it hands back a canvas we do not control, where this bezel
 * needs one we do. What is left is a frame stream, a key sink and a sound
 * queue, which is all a DOS game needs and is what this file wires up.
 *
 * Nothing here talks to the network. The emulator, the game and its DOSBox
 * configuration are all served from this site.
 */
(function () {
  "use strict";

  // Browser KeyboardEvent.code → DOSBox key code. Taken from the emulators
  // package's own table (src/keys.ts), not worked out by hand.
  const KEYS = {
    Digit0: 48, Digit1: 49, Digit2: 50, Digit3: 51, Digit4: 52,
    Digit5: 53, Digit6: 54, Digit7: 55, Digit8: 56, Digit9: 57,
    Escape: 256, Enter: 257, Tab: 258, Backspace: 259, Space: 32,
    Insert: 260, Delete: 261, Home: 268, End: 269,
    PageUp: 266, PageDown: 267,
    ArrowRight: 262, ArrowLeft: 263, ArrowDown: 264, ArrowUp: 265,
    CapsLock: 280, ScrollLock: 281, NumLock: 282,
    PrintScreen: 283, Pause: 284,
    ShiftLeft: 340, ControlLeft: 341, AltLeft: 342,
    ShiftRight: 344, ControlRight: 345, AltRight: 346,
    Backquote: 96, Minus: 45, Equal: 61, Backslash: 92,
    BracketLeft: 91, BracketRight: 93, Semicolon: 59, Quote: 39,
    Comma: 44, Period: 46, Slash: 47,
    NumpadDecimal: 330, NumpadDivide: 331, NumpadMultiply: 332,
    NumpadSubtract: 333, NumpadAdd: 334, NumpadEnter: 335,
  };
  for (let i = 0; i <= 9; i++) KEYS["Numpad" + i] = 320 + i;
  for (let i = 0; i < 26; i++) KEYS["Key" + String.fromCharCode(65 + i)] = 65 + i;
  for (let i = 1; i <= 12; i++) KEYS["F" + i] = 289 + i;

  // The keys the browser would otherwise act on itself. A DOS game wants all
  // of them: Ctrl and Alt are Commander Keen's jump and pogo, the function
  // keys are Digger's sound and music, and Tab and the arrows would scroll
  // the page out from under the player.
  function swallow(event) {
    return !(event.ctrlKey && (event.code === "KeyC" || event.code === "KeyV")) &&
           !(event.metaKey);
  }

  function attachKeyboard(ci) {
    const down = new Set();
    addEventListener("keydown", (e) => {
      const code = KEYS[e.code];
      if (code === undefined) return;
      if (swallow(e)) e.preventDefault();
      if (down.has(code)) return;      // ignore the OS auto-repeat; DOS does its own
      down.add(code);
      ci.sendKeyEvent(code, true);
    });
    addEventListener("keyup", (e) => {
      const code = KEYS[e.code];
      if (code === undefined) return;
      if (swallow(e)) e.preventDefault();
      down.delete(code);
      ci.sendKeyEvent(code, false);
    });
    // A window that loses focus mid-press would otherwise leave the key stuck
    // down inside DOS, which in a game means walking into a wall for ever.
    addEventListener("blur", () => {
      for (const code of down) ci.sendKeyEvent(code, false);
      down.clear();
    });
  }

  function attachScreen(ci, canvas) {
    const ctx = canvas.getContext("2d", { alpha: false });
    let image = null;

    // DOSBox greets you with its own banner, and this build has no setting to
    // turn it off, so nothing is drawn until DOS has wiped it away. Every
    // game's autoexec ends its preamble with cls, so the signal we wait for
    // is the blank screen that produces: the first frame that is essentially
    // all black. Waiting on a video-mode change instead looked right until a
    // text-mode game came along and never changed mode at all. The timer is
    // only a backstop.
    let show = false;
    const reveal = () => { show = true; clearTimeout(fallback); };
    const fallback = setTimeout(() => { show = true; }, 4000);

    // Cheap enough to run on every frame until it fires: it samples rather
    // than reads every pixel, and stops mattering the moment the screen is up.
    function cleared(rgb) {
      for (let i = 0; i < rgb.length; i += 192) {
        if (rgb[i] || rgb[i + 1] || rgb[i + 2]) return false;
      }
      return true;
    }

    function resize(width, height) {
      canvas.width = width;
      canvas.height = height;
      image = ctx.createImageData(width, height);
      // Opaque from the start: the alpha byte is never written below.
      const d = image.data;
      for (let i = 3; i < d.length; i += 4) d[i] = 255;
    }
    resize(ci.width(), ci.height());
    ci.events().onFrameSize(resize);

    ci.events().onFrame((rgb) => {
      if (!rgb || !image) return;
      if (!show) {
        if (!cleared(rgb)) return;
        reveal();
      }
      const d = image.data;
      for (let i = 0, j = 0; i < rgb.length; i += 3, j += 4) {
        d[j] = rgb[i]; d[j + 1] = rgb[i + 1]; d[j + 2] = rgb[i + 2];
      }
      ctx.putImageData(image, 0, 0);
    });
  }

  // Sound arrives as blocks of samples whenever DOSBox has some. They are
  // queued back to back against the audio clock rather than played as they
  // land, so a late block doesn't click.
  function attachSound(ci) {
    let audio = null;
    let next = 0;
    const rate = ci.soundFrequency();
    const pending = [];

    function start() {
      if (audio) return;
      audio = new (window.AudioContext || window.webkitAudioContext)();
      next = audio.currentTime;
      while (pending.length) push(pending.shift());
    }
    // Browsers will not make noise until the page has been interacted with.
    addEventListener("keydown", start, { once: true });
    addEventListener("pointerdown", start, { once: true });

    function push(samples) {
      if (!audio) { if (pending.length < 64) pending.push(samples); return; }
      const buffer = audio.createBuffer(1, samples.length, rate);
      buffer.getChannelData(0).set(samples);
      const source = audio.createBufferSource();
      source.buffer = buffer;
      source.connect(audio.destination);
      if (next < audio.currentTime) next = audio.currentTime;
      source.start(next);
      next += buffer.duration;
    }
    ci.events().onSoundPush((samples) => push(new Float32Array(samples)));
  }

  // Start the game named in ?game=, or the first one in games.json.
  async function boot() {
    const key = new URLSearchParams(location.search).get("game") || "digger";
    const games = await (await fetch("games.json")).json();
    const game = games[key];
    if (!game) throw new Error("No such game: " + key);

    document.title = game.title + " — IBM PC — GenX-DOS";
    window.GENX_GAME_KEY = key;   // the corner link reads this

    const dir = "games/" + key + "/";

    // Ask for every file at once rather than one after another. The games
    // are small — a quarter of a megabyte at worst — but Captain Comic is 54
    // separate files and Commander Keen 42, and a round trip to the host
    // costs far more than the bytes do. Fetched in turn those 54 files took
    // 29 seconds; asked for together over HTTP/2, which multiplexes them
    // down one connection, they take about one.
    const [conf, ...files] = await Promise.all([
      fetch(dir + "dosbox.conf").then((r) => r.text()),
      ...game.files.map((name) =>
        fetch(dir + name)
          .then((r) => {
            if (!r.ok) throw new Error(name + ": " + r.status);
            return r.arrayBuffer();
          })
          .then((buf) => ({ path: name, contents: new Uint8Array(buf) }))),
    ]);

    const initFs = [{ dosboxConf: conf, jsdosConf: { version: "8" } }, ...files];

    emulators.pathPrefix = "jsdos/emulators/";
    const ci = await emulators.dosboxDirect(initFs);

    attachScreen(ci, document.getElementById("screen"));
    attachKeyboard(ci);
    attachSound(ci);
    document.body.classList.add("running");
    window.GENX_CI = ci;
  }

  addEventListener("DOMContentLoaded", () => {
    boot().catch((err) => {
      const el = document.querySelector(".loading");
      if (el) el.textContent = "Could not start: " + err.message;
      console.error(err);
    });
  });
})();
