// VICE RUN/STOP remap + soft button.
//
// Browsers capture Esc before the libretro keyboard callback can see it
// (exits pointer-lock / fullscreen) so a real Esc never reaches VICE as
// RUN/STOP. Workarounds layered for cross-OS coverage:
//
//   1. **Scroll Lock keydown** — best on Windows + Linux PC keyboards
//      (universal physical key, no browser default behaviour).
//   2. **Pause / Break keydown** — secondary; present on most PC
//      keyboards as a backup if Scroll Lock is missing or grabbed by
//      a tiling WM.
//   3. **Top-left "RUN/STOP" soft button** — for macOS (no Scroll Lock
//      key since 2007), ChromeOS (no Scroll Lock key at all), and
//      touch/mobile (no physical keyboard). Positioned top-left so it
//      doesn't conflict with EmulatorJS's bottom toolbar or the
//      top-right controls link.
//
// All three routes dispatch a synthetic Escape keydown on document +
// window + canvas. Synthetic events don't trigger the browser's
// Esc-capture because they aren't real user gestures, so the synthetic
// Escape reaches VICE cleanly.
//
// Include via one tag in each VICE play.html:
//   <script defer src="../_shared/genx-vice-softkeys.js"></script>
(function () {
  const fireEsc = () => {
    const init = {
      key: 'Escape', code: 'Escape', keyCode: 27, which: 27,
      bubbles: true, cancelable: true,
    };
    const targets = [document, window, document.body];
    const cv = document.querySelector('canvas');
    if (cv) targets.push(cv);
    for (const t of targets) {
      try {
        t.dispatchEvent(new KeyboardEvent('keydown', init));
        setTimeout(() => t.dispatchEvent(new KeyboardEvent('keyup', init)), 80);
      } catch (_) { /* swallow */ }
    }
  };

  // Key listener: Scroll Lock + Pause/Break both trigger RUN/STOP.
  const handler = (e) => {
    if (
      e.code === 'ScrollLock' || e.key === 'ScrollLock' || e.keyCode === 145 ||
      e.code === 'Pause' || e.key === 'Pause' || e.keyCode === 19
    ) {
      e.preventDefault();
      e.stopPropagation();
      fireEsc();
    }
  };
  document.addEventListener('keydown', handler, true);
  window.addEventListener('keydown', handler, true);

  // Soft button — top-left corner, out of the EJS toolbar's hover zone
  // (bottom) and out of the controls-link zone (top-right).
  const ready = () => {
    const css = `
      #genx-vice-runstop {
        position: fixed; top: 8px; left: 8px;
        z-index: 100;
        background: rgba(0,0,0,0.72); color: #c0c0c0;
        border: 1px solid #555; border-radius: 3px;
        font: 12px/1 monospace; padding: 5px 10px;
        cursor: pointer; opacity: 0.6;
        transition: opacity 0.15s;
      }
      #genx-vice-runstop:hover { opacity: 1; background: rgba(60,60,60,0.95); color: #fff; border-color: #aaa; }
      #genx-vice-runstop:active { background: #444; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'genx-vice-runstop';
    btn.type = 'button';
    btn.textContent = 'RUN/STOP';
    btn.title = 'Sends RUN/STOP to the C64-family core (keyboard shortcut: Scroll Lock or Pause/Break)';
    btn.addEventListener('click', fireEsc);
    document.body.appendChild(btn);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
