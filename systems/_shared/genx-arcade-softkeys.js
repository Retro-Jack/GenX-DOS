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
// Order matches the cabinet: coin first, then start, because that is the order
// the machine demands them in.
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
  const START = 3;          // button id, per this bundle's map in play.html
  const HOLD_MS = 120;

  const emu = () => window.EJS_emulator;
  const ready = () =>
    emu() && emu().gameManager && emu().gameManager.functions &&
    typeof emu().gameManager.functions.simulateInput === 'function';

  function press(id, player) {
    if (!ready()) return;
    const gm = emu().gameManager;
    const p = player || 0;
    gm.functions.simulateInput(p, id, 1);
    setTimeout(() => gm.functions.simulateInput(p, id, 0), HOLD_MS);
  }

  function build() {
    const css = `
      /* Top-left on the wallpaper, under the controls link — the standard soft
         key position on this site. NOT bottom-centre like the TRS-80's CLEAR:
         this cabinet is sized to full viewport height, so there is no wallpaper
         below it and a bottom bar lands on top of the game screen.
         The offset clears the audio banner, which is fixed at the top and would
         otherwise bury these exactly when a player is hunting for the way in. */
      #genx-arcade-keys {
        position: fixed;
        top: calc(62px + var(--gx-banner-h, 0px));
        left: 16px;
        z-index: 100; display: flex; align-items: center; gap: 10px;
      }
      /* The coin slot is the artwork itself rather than a labelled button —
         it is the one control that needs no words in any language. */
      #genx-arcade-coin {
        width: 44px; height: 44px; padding: 0; border-radius: 4px;
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
        width: 44px; height: 44px; padding: 0; border: 0; background: transparent
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
    coin.addEventListener('click', () => { press(COIN); coin.blur(); });

    const mk = (id, label, title, player) => {
      const b = document.createElement('button');
      b.id = id;
      b.className = 'gx-arcade-start';
      b.type = 'button';
      b.title = title;
      b.setAttribute('aria-label', label);
      b.addEventListener('click', () => { press(START, player); b.blur(); });
      return b;
    };

    bar.appendChild(coin);
    bar.appendChild(mk('genx-arcade-1p', '1 player start',
      'One player start — needs a credit first (keyboard: 1)', 0));
    bar.appendChild(mk('genx-arcade-2p', '2 player start',
      'Two player start, alternating — needs two credits (keyboard: 2)', 1));
    document.body.appendChild(bar);
  }

  // EJS publishes its emulator object well after the page parses, and a control
  // delivered before the machine has booted is wasted, so wait rather than race.
  if (!ready()) {
    const timer = setInterval(() => {
      if (ready()) { clearInterval(timer); build(); }
    }, 250);
    setTimeout(() => clearInterval(timer), 30000);
  } else {
    build();
  }
})();
