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
        background: rgba(0,0,0,0.72); color: #c0c0c0;
        border: 1px solid #555; border-radius: 3px;
        font: 12px/1 monospace; padding: 5px 10px;
        cursor: pointer; opacity: 0.6;
        transition: opacity 0.15s;
      }
      #genx-bbc-copy:hover { opacity: 1; background: rgba(60,60,60,0.95); color: #fff; border-color: #aaa; }
      #genx-bbc-copy:active { background: #444; }
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
