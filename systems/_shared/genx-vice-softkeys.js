// VICE RUN/STOP + RESTORE soft buttons (and a RUN/STOP key remap).
//
// RUN/STOP: browsers capture Esc before the libretro keyboard callback can see
// it (exits pointer-lock / fullscreen), so a real Esc never reaches VICE as
// RUN/STOP. Workarounds layered for cross-OS coverage:
//   1. Scroll Lock keydown — best on Windows + Linux PC keyboards.
//   2. Pause / Break keydown — backup if Scroll Lock is missing/grabbed.
//   3. A top-left RUN/STOP soft button — for macOS / ChromeOS / touch.
// All three dispatch a synthetic Escape keydown; synthetic events don't trip
// the browser's Esc-capture, so the Escape reaches VICE cleanly.
//
// RESTORE: the C64-family RESTORE key (the NMI key; RUN/STOP+RESTORE soft-
// resets). libretro VICE maps it to PC Page Up, which the browser doesn't
// capture — so the soft button just dispatches a synthetic Page Up (the
// physical Page Up works too, no remap needed).
//
// Include via one tag in each VICE play.html:
//   <script defer src="../_shared/genx-vice-softkeys.js"></script>
(function () {
  const fireKey = (init) => {
    const full = { bubbles: true, cancelable: true, ...init };
    const targets = [document, window, document.body];
    const cv = document.querySelector('canvas');
    if (cv) targets.push(cv);
    for (const t of targets) {
      try {
        t.dispatchEvent(new KeyboardEvent('keydown', full));
        setTimeout(() => t.dispatchEvent(new KeyboardEvent('keyup', full)), 80);
      } catch (_) {
        /* swallow */
      }
    }
  };
  const fireEsc = () =>
    fireKey({ key: 'Escape', code: 'Escape', keyCode: 27, which: 27 });
  const fireRestore = () =>
    fireKey({ key: 'PageUp', code: 'PageUp', keyCode: 33, which: 33 });

  // Key listener: Scroll Lock + Pause/Break both trigger RUN/STOP.
  const handler = (e) => {
    if (
      e.code === 'ScrollLock' ||
      e.key === 'ScrollLock' ||
      e.keyCode === 145 ||
      e.code === 'Pause' ||
      e.key === 'Pause' ||
      e.keyCode === 19
    ) {
      e.preventDefault();
      e.stopPropagation();
      fireEsc();
    }
  };
  document.addEventListener('keydown', handler, true);
  window.addEventListener('keydown', handler, true);

  // Soft buttons — top-left corner, out of the EJS toolbar's hover zone
  // (bottom) and the controls-link zone (bottom-right).
  const ready = () => {
    if (document.getElementById('genx-vice-keys')) return;
    const style = document.createElement('style');
    style.textContent = `
      #genx-vice-keys {
        position: fixed; top: 8px; left: 8px;
        z-index: 100;
        display: flex; flex-direction: column; gap: 6px;
      }
      #genx-vice-keys button {
        color: rgba(255, 176, 0, 0.75); background: #000;
        border: 1px solid rgba(255, 176, 0, 0.35); border-radius: 4px;
        font: 12px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        letter-spacing: 0.05em; padding: 5px 10px;
        cursor: pointer;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      #genx-vice-keys button:hover { color: #ff8800; border-color: #ff8800; }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'genx-vice-keys';

    const mk = (label, title, onClick) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.title = title;
      b.addEventListener('click', () => {
        onClick();
        b.blur();
      });
      return b;
    };
    bar.appendChild(
      mk(
        'RUN/STOP',
        'Sends RUN/STOP to the C64-family core (keyboard shortcut: Scroll Lock or Pause/Break)',
        fireEsc,
      ),
    );
    bar.appendChild(
      mk(
        'RESTORE',
        'Sends RESTORE to the C64-family core (keyboard shortcut: Page Up). RUN/STOP + RESTORE soft-resets.',
        fireRestore,
      ),
    );
    document.body.appendChild(bar);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
