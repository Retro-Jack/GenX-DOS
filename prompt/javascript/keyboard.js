// ============================================================
// KEYBOARD HANDLER — keypress
// Handles printable characters and Enter. Each keystroke becomes a font
// div inserted before the cursor, carrying its character in a `v`
// attribute so a command can be read back off the screen. The terminal's
// own output arrives here too, as synthetic keypresses (see terminal.js).
// ============================================================
document.onkeypress = function (e) {
  if (typeof e === 'undefined') e = event;

  var c = document.createElement('div');
  addClass(c, 'font');
  var k = e.keyCode || e.charCode;

  // '&' and '(' share their codes with Up and Down; see kUp in globals.js.
  if (k == 38 && kUp == true) return;
  if (k == 40 && kDown == true) return;

  // Enter key — submit command. Typed by the user, it reads the command
  // back from the cursor to the last protected character and runs it; the
  // new line is then drawn by the command's own output. Typed by the
  // terminal, it is just a new line (.f-n).
  if (k == 13) {
    if (!promptMode) {
      var strCMD = '';
      var el = cursorEl;
      while (!gotClass(el.previousSibling, 'p')) {
        el = el.previousSibling;
        strCMD = el.getAttribute('v') + strCMD;
      }
      handleCmd(strCMD);
      return;
    }
    k = 'n';
  }

  // Backspace is handled in keydown (doKeyDown) — modern browsers no longer
  // fire keypress for it. Ignore here so it never renders as a glyph.
  if (k == 8) return;

  // Render the character as a font div
  addClass(c, 'f-' + k);
  if (promptMode) addClass(c, 'p');
  c.setAttribute('v', String.fromCharCode(k));
  if (k == 13) c.setAttribute('v', '\n');

  c.style.backgroundColor = pal[txtPal.bg];
  c.style.backgroundImage = 'url(' + fontSrc[txtPal.fg] + ')';

  promptEl.insertBefore(c, cursorEl);

  // Enforce max 60 visible lines — remove oldest line when exceeded
  if (document.querySelectorAll('.f-n').length >= 60) {
    var nl = document.querySelectorAll('.f-n')[0];
    var iMax = 0;
    if (nl == promptEl.firstChild) {
      promptEl.removeChild(nl);
    } else {
      while (promptEl.firstChild != nl || iMax == 79) {
        promptEl.removeChild(promptEl.firstChild);
        iMax++;
      }
      promptEl.removeChild(nl);
    }
  }

  if (typeof e.stopPropagation === 'undefined')
    e.stopPropagation = function () {};
  if (typeof e.preventDefault === 'undefined')
    e.preventDefault = function () {};
  e.stopPropagation();
  e.preventDefault();
  return false;
};

// ============================================================
// KEYBOARD HANDLER — keydown
// Handles Backspace, and Up/Down arrow history navigation through the
// command stack. Neither produces a keypress in current browsers.
// ============================================================
function doKeyDown(e) {
  if (typeof e === 'undefined') e = event;
  if (typeof e.stopPropagation === 'undefined')
    e.stopPropagation = function () {};
  if (typeof e.preventDefault === 'undefined')
    e.preventDefault = function () {};

  var k = e.keyCode || e.charCode;

  // Backspace — delete the character before the cursor. Handled here in
  // keydown for every browser (keypress no longer fires for Backspace in
  // modern Chrome/Firefox/Safari). The 'p' class marks the protected prompt
  // prefix / printed output, which must not be erased.
  if (k == 8) {
    e.stopPropagation();
    e.preventDefault();
    var prev = cursorEl && cursorEl.previousSibling;
    if (prev && !gotClass(prev, 'p')) {
      cursorEl.parentElement.removeChild(prev);
    }
    return false;
  }

  var up = 38,
    down = 40;

  // Up arrow — step backward through command history
  if (k == up && cmdStackIdx > -1) {
    var el = cursorEl,
      hold;
    while (!gotClass(el, 'p')) {
      hold = el;
      el = el.previousSibling;
      if (hold !== cursorEl) promptEl.removeChild(hold);
    }
    if (cmdStackIdx >= cmdStack.length) cmdStackIdx--;
    enterCmd(cmdStack[cmdStackIdx]);
    cmdStackIdx--;
  }

  // Down arrow — step forward through command history
  if (k == down && cmdStackIdx < cmdStack.length) {
    var el = cursorEl,
      hold;
    while (!gotClass(el, 'p')) {
      hold = el;
      el = el.previousSibling;
      if (hold !== cursorEl) promptEl.removeChild(hold);
    }
    cmdStackIdx++;
    if (cmdStackIdx >= cmdStack.length) enterCmd('');
    else enterCmd(cmdStack[cmdStackIdx]);
  }

  if (k == down) kDown = true;
  if (k == up) kUp = true;
  if (k == down || k == up) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}

// ============================================================
// KEYBOARD HANDLER — keyup
// Resets arrow-key held state.
// ============================================================
function doKeyUp(e) {
  if (typeof e === 'undefined') e = event;
  if (typeof e.stopPropagation === 'undefined')
    e.stopPropagation = function () {};
  if (typeof e.preventDefault === 'undefined')
    e.preventDefault = function () {};

  var k = e.keyCode || e.charCode;
  if (k == 40) kDown = false;
  if (k == 38) kUp = false;

  e.stopPropagation();
  e.preventDefault();
  return false;
}
