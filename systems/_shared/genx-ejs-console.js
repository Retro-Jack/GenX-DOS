// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// GenX-DOS console-switch buttons for the EmulatorJS Atari consoles.
//
// The 2600 and 7800 put their switches on the console itself, physically
// labelled: GAME SELECT and GAME RESET on the 2600, SELECT / RESET / PAUSE on
// the 7800. Games depend on them — RESET is how most 2600 titles begin, and
// SELECT is how you pick the game variation, which on a 2600 cartridge is often
// the difference between one game and thirty.
//
// Those switches are on the keyboard here (V, Enter and so on), documented on
// the controls page, and invisible while you play. A player who has never met
// a 2600 sits looking at a variation number with no idea how to change it, or
// at a title screen with no idea how to start. Same complaint as the Atari
// 8-bit OPTION key, same answer: put the labels back on the machine.
//
// THE MECHANISM IS DIFFERENT FROM THE OTHER SOFT KEYS. Everywhere else we
// dispatch a synthetic KeyboardEvent, because those engines read the DOM's
// keyboard events. EmulatorJS does not — a synthetic keydown at document is
// simply ignored (measured: firing V on the 2600 left the variation number
// sitting where it was). EJS routes input through its own layer instead, so
// these go through gameManager.simulateInput(player, buttonId, value), which is
// the same path its own on-screen controls use.
//
// Button ids are EJS's, read from its source rather than guessed
// (data/src/emulator.js, the getControlScheme() blocks).
//
// Include via one tag in the bundle's play.html:
//   <script defer src="../_shared/genx-ejs-console.js"></script>
(function () {
  // control scheme -> the switches worth surfacing, in console order.
  const SWITCHES = {
    atari2600: [
      {
        label: 'SELECT',
        id: 2,
        hint: 'GAME SELECT switch — cycles the game variation',
      },
      { label: 'RESET', id: 3, hint: 'GAME RESET switch — starts the game' },
    ],
    atari7800: [
      {
        label: 'SELECT',
        id: 2,
        hint: 'SELECT switch — cycles the game variation',
      },
      {
        label: 'RESET',
        id: 9,
        hint: 'RESET switch — starts the game from the title screen',
      },
      { label: 'PAUSE', id: 3, hint: 'PAUSE switch' },
    ],
  };

  const emu = () => window.EJS_emulator;
  const ready = () => {
    const e = emu();
    return !!(
      e &&
      e.gameManager &&
      typeof e.gameManager.simulateInput === 'function'
    );
  };

  // A switch is a momentary contact: press, then release. Holding RESET down
  // would be the same as holding the real switch over, which some games read as
  // "still resetting" and never start.
  const flick = (id) => {
    const gm = emu().gameManager;
    try {
      gm.simulateInput(0, id, 1);
      setTimeout(() => {
        try {
          gm.simulateInput(0, id, 0);
        } catch (_) {
          /* swallow */
        }
      }, 120);
    } catch (_) {
      /* swallow */
    }
  };

  const build = (switches) => {
    const style = document.createElement('style');
    style.textContent = `
      #genx-ejs-console {
        position: fixed; top: calc(8px + var(--gx-banner-h, 0px)); left: 8px;
        z-index: 100;
        display: flex; gap: 6px;
      }
      #genx-ejs-console button {
        color: rgba(255, 176, 0, 0.75); background: #000;
        border: 1px solid rgba(255, 176, 0, 0.35); border-radius: 4px;
        font: 12px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        letter-spacing: 0.05em; padding: 5px 10px;
        cursor: pointer;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      #genx-ejs-console button:hover { color: #ff8800; border-color: #ff8800; }
      #genx-ejs-console button:focus-visible { outline: 2px solid #ff8800; outline-offset: 2px; }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'genx-ejs-console';

    for (const sw of switches) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = sw.label;
      btn.title = sw.hint;
      btn.addEventListener('click', () => {
        flick(sw.id);
        btn.blur();
      });
      bar.appendChild(btn);
    }

    document.body.appendChild(bar);
  };

  // EJS publishes its emulator object well after the page parses, and the
  // control scheme is only knowable from it, so wait rather than race.
  const start = () => {
    if (!ready()) return false;
    const scheme = emu().getControlScheme && emu().getControlScheme();
    const switches = SWITCHES[scheme];
    if (switches) build(switches);
    return true;
  };

  if (!start()) {
    const timer = setInterval(() => {
      if (start()) clearInterval(timer);
    }, 250);
    setTimeout(() => clearInterval(timer), 30000);
  }
})();
