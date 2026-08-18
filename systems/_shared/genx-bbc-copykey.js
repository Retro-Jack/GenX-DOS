// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// GenX-DOS COPY soft button for the jsbeeb (BBC Micro / Master) bundles.
//
// The BBC's COPY key has no obvious PC equivalent — jsbeeb maps it to the PC
// End key (also Right-Ctrl / F11). Several BBC games use COPY (as an in-game
// "continue" or action key), so this adds a clickable COPY button under the
// machine, in the same amber style and the same place as the TRS-80 CLEAR and
// the Atari console keys. jsbeeb listens for keydown on `document` and reads
// `event.which/keyCode` (no isTrusted check), so a synthetic End event maps
// cleanly to COPY.
//
// Include via one tag in each jsbeeb dist/index.html:
//   <script defer src="../../_shared/genx-bbc-copykey.js"></script>
(function () {
  // PC End (keyCode 35) → BBC COPY in jsbeeb's keymap.
  const fireCopy = () => {
    const init = {
      key: 'End',
      code: 'End',
      keyCode: 35,
      which: 35,
      bubbles: true,
      cancelable: true,
    };
    // ONE dispatch, at document. Firing at document + window + body + canvas
    // "to be safe" is not safe: those events bubble, so a single click reaches
    // window four times over and the emulator sees four presses. The same
    // shape crashed atari800 outright when a player clicked impatiently.
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

  const ready = () => {
    if (document.getElementById('genx-bbc-copy')) return;
    const style = document.createElement('style');
    style.textContent = `
      /* Under the machine, matching the TRS-80 CLEAR and the Atari console
         keys — the soft keys should read as one family across the site. At the
         bottom it also clears the suspended-audio banner, which is fixed to the
         top at a very high z-index and used to bury this button at exactly the
         moment a player was hunting for a control. */
      #genx-bbc-copy {
        position: fixed; bottom: 58px; left: 50%; transform: translateX(-50%);
        z-index: 100;
        color: rgba(255, 176, 0, 0.75); background: #000;
        border: 1px solid rgba(255, 176, 0, 0.35); border-radius: 4px;
        font: 12px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        letter-spacing: 0.05em; padding: 5px 10px;
        cursor: pointer;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      #genx-bbc-copy:hover { color: #ff8800; border-color: #ff8800; }
      #genx-bbc-copy:focus-visible { outline: 2px solid #ff8800; outline-offset: 2px; }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'genx-bbc-copy';
    btn.type = 'button';
    btn.textContent = 'COPY';
    btn.title =
      'Sends the BBC COPY key (keyboard shortcut: End) — an in-game "continue" or action key in some titles';
    btn.addEventListener('click', () => {
      fireCopy();
      btn.blur();
    });
    document.body.appendChild(btn);
  };

  // Only on the games that actually use COPY — four of the twenty across the
  // two BBC bundles. The key is an in-game "continue"/action key in those and
  // means nothing in the rest. The game key comes from genx-gamedoc-link.js,
  // which already owns the disc-to-gamedoc map and runs before this script.
  var gate = function () {
    var system = window.GENX_SYSTEM;
    var game = window.GENX_GAME_KEY;
    if (!window.GenXSoftKeys) return ready(); // policy script absent: fail open
    window.GenXSoftKeys.allowed(system, game, 'COPY').then(function (ok) {
      if (ok) ready();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', gate);
  } else {
    gate();
  }
})();
