// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator engines, so
// it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// GenX-DOS coin door for the arcade bundle.
//
// An arcade cabinet has no Start button until you have paid. Every one of these
// games sits in attract mode saying so — "PLEASE DEPOSIT COIN AND TRY THIS
// GAME", "1 COIN 1 PLAY", "CREDIT 0" — and a player with a keyboard has no way
// to know the answer is the 5 key. It is the least guessable control on the
// whole site, so it gets the most literal button: a coin slot.
//
// The slot sits between the two start buttons, which is where the coin door is
// on the cabinet: centred under the panel with 1P to its left and 2P to its
// right, so the button you want is on the side you are standing.
//
// MECHANISM: EmulatorJS ignores synthetic KeyboardEvents outright, so these go
// through gameManager.simulateInput(player, buttonId, value) — the path EJS's
// own on-screen controls use. Ids are the ones this bundle maps in play.html:
// 2 = SELECT = coin, 3 = START.
//
// THE PRESS MUST BE HELD. MAME samples input per frame, so a press and release
// inside one frame is simply never seen — tested, and a burst of instant coin
// presses registered nothing at all while a held one worked every time. 120ms
// is comfortably over a frame at 60Hz without feeling sticky.
(function () {
  const COIN = 2;
  const START = 3; // button id, per this bundle's map in play.html
  const HOLD_MS = 120;

  const emu = () => window.EJS_emulator;
  const ready = () =>
    emu() &&
    emu().gameManager &&
    emu().gameManager.functions &&
    typeof emu().gameManager.functions.simulateInput === 'function';

  function press(id, player) {
    if (!ready()) return;
    const gm = emu().gameManager;
    const p = player || 0;
    gm.functions.simulateInput(p, id, 1);
    setTimeout(() => gm.functions.simulateInput(p, id, 0), HOLD_MS);
  }

  // A PAD BUTTON FOR 2P START, on the one cabinet that plays with it. On
  // I, Robot the start buttons are the camera, so play.html names a first-pad
  // button in window.GENX_ARCADE_PAD_START2. EmulatorJS reads player 2 from the
  // second pad, so that button is watched here and mirrored onto player 2's
  // START — held while it is held, since the game reads the button, not a tap.
  // The flag is read every frame because play.html sets it during boot, which
  // may land after this script has run.
  (function padStart2() {
    let held = false;
    function tick() {
      const idx = window.GENX_ARCADE_PAD_START2;
      if (idx !== undefined && ready() && navigator.getGamepads) {
        let down = false;
        for (const pad of navigator.getGamepads()) {
          if (pad && pad.buttons[idx] && pad.buttons[idx].pressed) down = true;
        }
        if (down !== held) {
          held = down;
          emu().gameManager.functions.simulateInput(1, START, down ? 1 : 0);
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  function build() {
    const css = `
      /* A second corner box, beside the Gameplay controls link rather than
         floating under it. Same background, border, radius and padding, and
         its height is measured off that link at runtime — the label is two
         lines of a webfont, so its height is not a number that can be written
         down here and stay true. NOT bottom-centre like the TRS-80's CLEAR:
         this cabinet is sized to full viewport height, so there is no wallpaper
         below it and a bottom bar lands on top of the game screen.
         left and height are set from JS; the rest is fixed. */
      #genx-arcade-keys {
        position: fixed;
        top: 6px;
        left: 12px;
        z-index: 99999;
        box-sizing: border-box;
        background: var(--gx-btn-bg, #4c2e1d);
        border: 1px solid var(--gx-btn-line, rgba(255,176,0,0.35));
        border-radius: 4px;
        padding: 4px 10px;
        display: flex; align-items: center; gap: 10px;
      }
      /* The coin slot is the artwork itself rather than a labelled button —
         it is the one control that needs no words in any language. */
      #genx-arcade-coin {
        height: 100%; aspect-ratio: 1; padding: 0; border-radius: 4px;
        border: 1px solid var(--gx-btn-line, rgba(255,176,0,0.35));
        background: url('coin.png') center/cover no-repeat;
        cursor: pointer; display: block;
        transition: border-color 0.15s ease, transform 0.08s ease;
      }
      #genx-arcade-coin:hover { border-color: var(--gx-btn-hot, #ff8800); }
      /* The start buttons are the moulded cabinet buttons themselves, so they
         get no border or background — a chrome button in a chrome-coloured box
         would read as a picture of a button rather than a button. */
      .gx-arcade-start {
        height: 100%; aspect-ratio: 1; padding: 0; border: 0; background: transparent
          center/contain no-repeat;
        cursor: pointer; display: block;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6));
        transition: transform 0.08s ease, filter 0.15s ease;
      }
      #genx-arcade-1p { background-image: url('start1p.png'); }
      #genx-arcade-2p { background-image: url('start2p.png'); }
      .gx-arcade-start:hover { filter: drop-shadow(0 0 4px var(--gx-btn-hot, #ff8800)); }
      #genx-arcade-coin:active, .gx-arcade-start:active { transform: translateY(1px); }
      #genx-arcade-coin:focus-visible, .gx-arcade-start:focus-visible {
        outline: 2px solid var(--gx-btn-hot, #ff8800); outline-offset: 2px;
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'genx-arcade-keys';

    const coin = document.createElement('button');
    coin.id = 'genx-arcade-coin';
    coin.type = 'button';
    coin.title = 'Insert coin (keyboard: 5)';
    coin.setAttribute('aria-label', 'Insert coin');
    // A coin dropping through the slot mechanism, on the slot button and on
    // the 5 key. Sound: Hollywood Edge Foley Sound Library, via SoundDogs.com
    // (see ATTRIBUTION.md). A second coin before the first has finished
    // restarts it rather than stacking a second copy on top.
    //
    // coin-drop.mp3 IS NOT IN THE REPOSITORY, on purpose. It is a licensed
    // library sound, so it exists only on the web host (live and staging),
    // uploaded there by hand; deploy.sh protects it from the --delete that
    // would otherwise remove it. A clone or the release zip has no file here,
    // and that is harmless: play() simply fails, the failure is swallowed,
    // and the coin still goes in, silently.
    const drop = new Audio('coin-drop.mp3');
    drop.preload = 'auto';
    const clink = () => {
      drop.currentTime = 0;
      drop.play().catch(() => {});
    };
    coin.addEventListener('click', () => {
      press(COIN);
      clink();
      coin.blur();
    });
    // The 5 key is the machine's coin input. EmulatorJS reads keys only when
    // they land inside its own game element, though, and focus is often
    // elsewhere -- after a reload, or after this very coin button, which gives
    // focus up on purpose. The key then played the sound and inserted nothing.
    // So a 5 that lands outside the game element is inserted here, through the
    // same path as the slot; one that lands inside is left to EmulatorJS, so a
    // coin is never counted twice. Digit5 alone, because that is the key
    // play.html binds, and the numpad 5 inserts no coin. Held keys repeat; a
    // coin is one press.
    addEventListener(
      'keydown',
      (e) => {
        if (e.code !== 'Digit5' || e.repeat) return;
        const game = emu() && emu().elements && emu().elements.parent;
        if (!game || !game.contains(e.target)) press(COIN);
        clink();
      },
      true,
    );

    const mk = (id, label, title, player) => {
      const b = document.createElement('button');
      b.id = id;
      b.className = 'gx-arcade-start';
      b.type = 'button';
      b.title = title;
      b.setAttribute('aria-label', label);
      b.addEventListener('click', () => {
        press(START, player);
        b.blur();
      });
      return b;
    };

    bar.appendChild(
      mk(
        'genx-arcade-1p',
        '1 player start',
        'One player start — needs a credit first (keyboard: 1)',
        0,
      ),
    );
    bar.appendChild(coin);
    bar.appendChild(
      mk(
        'genx-arcade-2p',
        '2 player start',
        'Two player start, alternating — needs two credits (keyboard: 2)',
        1,
      ),
    );
    document.body.appendChild(bar);
    place(bar);
  }

  // Sit the box immediately right of the Gameplay controls link and match its
  // height. Measured rather than assumed: the link's height comes from two
  // lines of IBM Plex Mono, so it changes when the webfont arrives and again
  // if the browser's own metrics differ. Re-run on both.
  function place(bar) {
    const link = document.querySelector('.gx-corner-link.gx-left');
    if (!link) return; // keyless boot: no link, stay in the corner
    const r = link.getBoundingClientRect();
    bar.style.left = r.right + 10 + 'px';
    bar.style.height = r.height + 'px';
  }

  const replace = () => {
    const bar = document.getElementById('genx-arcade-keys');
    if (bar) place(bar);
  };
  addEventListener('resize', replace);
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(replace);

  // EJS publishes its emulator object well after the page parses, and a control
  // delivered before the machine has booted is wasted, so wait rather than race.
  if (!ready()) {
    const timer = setInterval(() => {
      if (ready()) {
        clearInterval(timer);
        build();
      }
    }, 250);
    setTimeout(() => clearInterval(timer), 30000);
  } else {
    build();
  }
})();
