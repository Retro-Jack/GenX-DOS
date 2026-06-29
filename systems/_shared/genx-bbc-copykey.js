// GenX-DOS COPY soft button for the jsbeeb (BBC Micro / Master) bundles.
//
// The BBC's COPY key has no obvious PC equivalent — jsbeeb maps it to the PC
// End key (also Right-Ctrl / F11). Several BBC games use COPY (e.g. Manic
// Miner's "continue" after a freeze), so this adds a clickable COPY button,
// top-left, in the same style as the VICE RUN/STOP softkey. jsbeeb listens for
// keydown on `document` and reads `event.which/keyCode` (no isTrusted check),
// so a synthetic End event maps cleanly to COPY.
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
    const targets = [document, window, document.body];
    const cv = document.querySelector('#screen, canvas');
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

  const ready = () => {
    if (document.getElementById('genx-bbc-copy')) return;
    const style = document.createElement('style');
    style.textContent = `
      #genx-bbc-copy {
        position: fixed; top: 8px; left: 8px;
        z-index: 100;
        color: rgba(255, 176, 0, 0.75); background: #000;
        border: 1px solid rgba(255, 176, 0, 0.35); border-radius: 4px;
        font: 12px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        letter-spacing: 0.05em; padding: 5px 10px;
        cursor: pointer;
        transition: color 0.15s ease, border-color 0.15s ease;
      }
      #genx-bbc-copy:hover { color: #ff8800; border-color: #ff8800; }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'genx-bbc-copy';
    btn.type = 'button';
    btn.textContent = 'COPY';
    btn.title =
      'Sends the BBC COPY key (keyboard shortcut: End) — e.g. Manic Miner "continue" after a freeze';
    btn.addEventListener('click', () => {
      fireCopy();
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
