// NumLock-off warning for VICE-family bundles that set
// `vice_joyport_type='1'` (Numpad) — the joystick is mapped to the
// numeric keypad, which only emits digit keycodes when NumLock is on.
// JavaScript cannot toggle NumLock (it's owned by the OS, not the
// browser), so the best we can do is detect after the first real
// keypress via `getModifierState('NumLock')` and surface a dismissible
// banner so the user knows why their joystick isn't responding.
//
// Self-injects on script load. Include via a single <script> tag in
// any play.html that uses numpad-as-joystick:
//   <script defer src="../_shared/genx-numlock-warn.js"></script>
// Skip the include on bundles without a joystick port (PET).
(function () {
  const ready = () => {
    const css = `
      #genx-numlock-warn {
        position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
        background: #2a1f00; color: #ffcc00;
        border: 1px solid #ffcc00; border-radius: 3px;
        padding: 8px 14px; font: 13px/1.4 monospace;
        z-index: 10000; max-width: min(92vw, 620px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.6);
        display: flex; align-items: center; gap: 12px;
      }
      #genx-numlock-warn[hidden] { display: none; }
      #genx-numlock-warn-msg { flex: 1; }
      #genx-numlock-warn button {
        background: transparent; color: #ffcc00;
        border: 1px solid #ffcc00; border-radius: 2px;
        cursor: pointer; font: inherit; padding: 2px 10px;
        white-space: nowrap;
      }
      #genx-numlock-warn button:hover { background: #ffcc00; color: #000; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const el = document.createElement('div');
    el.id = 'genx-numlock-warn';
    el.hidden = true;
    el.innerHTML =
      '<span id="genx-numlock-warn-msg">' +
        '<strong>NumLock is off.</strong> Joystick is mapped to the numpad (8 / 4 / 6 / 2 = directions, 0 or 5 = fire) — turn NumLock on if directions don\'t work.' +
      '</span>' +
      '<button type="button">dismiss</button>';
    document.body.appendChild(el);
    el.querySelector('button').addEventListener('click', () => { el.hidden = true; });

    let shown = false;
    const onKey = (e) => {
      if (shown) return;
      shown = true;
      window.removeEventListener('keydown', onKey, true);
      // Listen at window/capture so SDL/EJS handlers attached to document
      // or canvas don't beat us to the event. getModifierState is the
      // only way to read NumLock state from JS — there is no
      // navigator.keyboardLockState or similar.
      if (typeof e.getModifierState === 'function' && !e.getModifierState('NumLock')) {
        el.hidden = false;
        setTimeout(() => { el.hidden = true; }, 12000);
      }
    };
    window.addEventListener('keydown', onKey, true);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
