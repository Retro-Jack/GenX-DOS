// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// GenX-DOS console-key buttons for the Atari 400 / 800XL (atari800) bundles.
//
// The Atari 8-bits put OPTION, SELECT and START on their own labelled keys
// beside the keyboard, and games lean on them heavily — most titles will not
// begin until you press START, and many pick difficulty or player count with
// OPTION and SELECT before that. atari800 maps them to F2, F3 and F4.
//
// On the real machine those keys were sitting there with their names printed on
// them. In a browser there is nothing to see: a game boots, sits on its title
// screen waiting, and a player with no manual has no way to guess that the way
// in is a function key. Reported by a reader as "it's not obvious how to hit
// custom keys, like the Atari 8-bit OPTION key" — the keys work and are
// documented on the controls page, but nothing on screen says so.
//
// So these are the labels the machine used to have, in the same style as the
// BBC COPY and TRS-80 CLEAR buttons.
//
// RESET is deliberately absent. It is F5 on the controls page, and a button for
// it beside the other three would sit one mis-click away from throwing a game
// away — the console keys earn their place because they start games, not
// because they end them.
//
// Emscripten's SDL2 keyboard handler reads event.code/keyCode off whichever
// target it bound, so the event is dispatched at several.
//
// Include via one tag in each atari800-family play.html:
//   <script defer src="../_shared/genx-atari-console.js"></script>
(function () {
  const KEYS = [
    {
      label: 'OPTION',
      key: 'F2',
      keyCode: 113,
      hint: 'OPTION console key — usually cycles a game option',
    },
    {
      label: 'SELECT',
      key: 'F3',
      keyCode: 114,
      hint: 'SELECT console key — usually chooses game or player count',
    },
    {
      label: 'START',
      key: 'F4',
      keyCode: 115,
      hint: 'START console key — begins most games',
    },
  ];

  const fire = (spec) => {
    const init = {
      key: spec.key,
      code: spec.key,
      keyCode: spec.keyCode,
      which: spec.keyCode,
      bubbles: true,
      cancelable: true,
    };
    // ONE dispatch, at document. Firing at document + window + body + canvas
    // "to be safe" is not safe: the events bubble, so a single click arrives at
    // window four times over, and the emulator sees the console key pressed
    // four times. A few clicks in quick succession then flood it and it dies
    // with "memory access out of bounds" and a black screen. Measured, after
    // the crash was reproduced by clicking START the way an impatient player
    // does. One dispatch at document still reaches SDL2's handler and still
    // bubbles to window, which is all the emulator needs.
    try {
      document.dispatchEvent(new KeyboardEvent('keydown', init));
      setTimeout(
        () => document.dispatchEvent(new KeyboardEvent('keyup', init)),
        80,
      );
    } catch (_) {
      /* swallow */
    }
  };

  const build = () => {
    const style = document.createElement('style');
    style.textContent = `
      #genx-atari-console {
        /* Under the set, matching the 2600 and 7800 panels — where a console
             sat, rather than floating over the wallpaper. At the bottom it also
             clears the suspended-audio banner without the --gx-banner-h offset
             the top-left placement needed. */
          position: fixed; bottom: 58px; left: 50%; transform: translateX(-50%);
        z-index: 100;
        display: flex; gap: 6px;
      }
      #genx-atari-console button {
        color: rgba(255, 176, 0, 0.75); background: #000;
        border: 1px solid rgba(255, 176, 0, 0.35); border-radius: 4px;
        font: 12px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        letter-spacing: 0.05em; padding: 5px 10px;
        cursor: pointer;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      #genx-atari-console button:hover:not(:disabled) { color: #ff8800; border-color: #ff8800; }
      #genx-atari-console button:disabled { opacity: 0.4; cursor: default; }
      #genx-atari-console button:focus-visible { outline: 2px solid #ff8800; outline-offset: 2px; }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'genx-atari-console';

    const buttons = [];
    for (const spec of KEYS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = spec.label;
      btn.disabled = true;
      btn.title = 'Starting up\u2026';
      btn.addEventListener('click', () => {
        fire(spec);
        btn.blur();
      });
      bar.appendChild(btn);
      buttons.push([btn, spec]);
    }

    document.body.appendChild(bar);

    // The buttons appear straight away but do not work yet, because a console
    // key delivered while the Atari is still bringing the cartridge up crashes
    // the emulator outright — "memory access out of bounds", black screen, no
    // recovery. That is not a theoretical risk: the game sits on a silent title
    // screen, so clicking START repeatedly is exactly what an impatient player
    // does, and it is how this was found.
    //
    // Module.calledRun goes true when the Emscripten runtime starts, which is
    // well before the machine has finished booting, so it is necessary and not
    // sufficient — hence the settle period on top of it. Showing the buttons
    // greyed rather than hiding them keeps the point of the whole exercise:
    // the player learns the keys exist while they wait.
    const SETTLE_MS = 6000;
    const enable = () => {
      for (const [btn, spec] of buttons) {
        btn.disabled = false;
        btn.title = spec.hint + ' (keyboard: ' + spec.key + ')';
      }
    };
    const waitForBoot = () => {
      if (window.Module && window.Module.calledRun) {
        setTimeout(enable, SETTLE_MS);
        return true;
      }
      return false;
    };
    if (!waitForBoot()) {
      const timer = setInterval(() => {
        if (waitForBoot()) clearInterval(timer);
      }, 250);
      // Never leave them dead if the runtime flag never appears.
      setTimeout(() => {
        clearInterval(timer);
        enable();
      }, 30000);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
