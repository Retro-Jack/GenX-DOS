// TRS-80 CLEAR soft button.
//
// Most TRS-80 arcade games use the CLEAR key to start play (and CLEAR has no
// obvious equivalent on a modern keyboard). sdltrs maps the TRS-80 CLEAR key to
// the PC **Home** (or Delete) key, so the physical shortcut already works — but
// a labelled on-screen button makes it discoverable and covers touch/laptop
// keyboards with no Home key.
//
// The button dispatches a synthetic Home keydown/keyup on document + window +
// body + canvas. Emscripten's SDL2 keyboard handler reads event.code/keyCode
// and doesn't require isTrusted, so the synthetic key reaches the emulator the
// same as a real press. Modelled on genx-vice-softkeys.js (the C64-family
// RUN/STOP button); kept TRS-80-specific so its label/key never drift.
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
    const targets = [document, window, document.body];
    const cv = document.querySelector('canvas');
    if (cv) targets.push(cv);
    for (const t of targets) {
      try {
        t.dispatchEvent(new KeyboardEvent('keydown', init));
        setTimeout(() => t.dispatchEvent(new KeyboardEvent('keyup', init)), 80);
      } catch (_) {
        /* swallow */
      }
    }
  };

  // Soft button — top-left corner, clear of the top-right controls link.
  const ready = () => {
    const css = `
      #genx-trs80-clear {
        position: fixed; top: 8px; left: 8px;
        z-index: 100;
        background: rgba(0,0,0,0.72); color: #c0c0c0;
        border: 1px solid #555; border-radius: 3px;
        font: 12px/1 monospace; padding: 5px 10px;
        cursor: pointer; opacity: 0.6;
        transition: opacity 0.15s;
      }
      #genx-trs80-clear:hover { opacity: 1; background: rgba(60,60,60,0.95); color: #fff; border-color: #aaa; }
      #genx-trs80-clear:active { background: #444; }
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
    btn.addEventListener('click', fireClear);
    document.body.appendChild(btn);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
