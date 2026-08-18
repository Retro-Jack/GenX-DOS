// SPDX-License-Identifier: GPL-3.0-or-later
// Part of GenX-DOS. This file runs alongside GPL-licensed emulator
// engines, so it is GPL-3.0-or-later rather than the repo's CC BY-NC.
// TRS-80 CLEAR soft button.
//
// Most TRS-80 arcade games use the CLEAR key to start play (and CLEAR has no
// obvious equivalent on a modern keyboard). sdltrs maps the TRS-80 CLEAR key to
// the PC **Home** (or Delete) key, so the physical shortcut already works — but
// a labelled on-screen button makes it discoverable and covers touch/laptop
// keyboards with no Home key.
//
// The button dispatches a synthetic Home keydown/keyup. Emscripten's SDL2
// keyboard handler reads event.code/keyCode and doesn't require isTrusted, so
// the synthetic key reaches the emulator the same as a real press. Kept
// TRS-80-specific so its label/key never drift.
//
// Include via one tag in systems/trs80/play.html:
//   <script defer src="../_shared/genx-trs80-softkeys.js"></script>
(function () {
  const fireClear = () => {
    const init = {
      key: 'Home',
      code: 'Home',
      keyCode: 36,
      which: 36,
      bubbles: true,
      cancelable: true,
    };
    // ONE dispatch, at document. Firing at document + window + body + canvas
    // "to be safe" is not safe: the events bubble, so a single click arrives at
    // window four times over and the emulator sees four presses. That shape
    // crashed atari800 outright when a player clicked impatiently; sdltrs is
    // gentler about it, but four CLEARs where one was asked for is wrong
    // regardless. One dispatch at document still reaches SDL2's handler.
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

  // Soft button — under the set, in the same amber style and the same place as
  // the Atari console keys, so the machine keys look like one family across the
  // site. It was previously grey-on-grey at 0.6 opacity in the top-left, which
  // read as a disabled control rather than the one thing that starts the game.
  const ready = () => {
    const css = `
      #genx-trs80-clear {
        position: fixed; bottom: 58px; left: 50%; transform: translateX(-50%);
        z-index: 100;
        color: rgba(255, 176, 0, 0.75); background: #000;
        border: 1px solid rgba(255, 176, 0, 0.35); border-radius: 4px;
        font: 12px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        letter-spacing: 0.05em; padding: 5px 10px;
        cursor: pointer;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      #genx-trs80-clear:hover { color: #ff8800; border-color: #ff8800; }
      #genx-trs80-clear:focus-visible { outline: 2px solid #ff8800; outline-offset: 2px; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'genx-trs80-clear';
    btn.type = 'button';
    btn.textContent = 'CLEAR';
    btn.title =
      'Sends the TRS-80 CLEAR key (keyboard shortcut: Home or Delete) — most games start with CLEAR';
    btn.addEventListener('click', () => {
      fireClear();
      btn.blur();
    });
    document.body.appendChild(btn);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
