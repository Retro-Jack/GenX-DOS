// ============================================================
// KEYBOARD HANDLER — keypress
// Handles printable character input, Enter, and Backspace.
// Each keystroke renders a font div into the prompt area.
// ============================================================
document.onkeypress = function(e) {
    if (typeof e === 'undefined') e = event;

    var c = document.createElement('div');
    addClass(c, 'font');
    var k = e.keyCode || e.charCode;

    if (k == 38 && kUp == true)   return;
    if (k == 40 && kDown == true) return;

    // Enter key — submit command
    if (k == 13) {
        if (!promptMode) {
            var strCMD = "";
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

    // Backspace key — delete previous character
    if (k == 8) {
        if (gotClass(cursorEl.previousSibling, 'p')) return;
        cursorEl.parentElement.removeChild(cursorEl.previousSibling);
        return;
    }

    // Render the character as a font div
    addClass(c, 'f-' + k);
    if (promptMode) addClass(c, 'p');
    c.setAttribute('v', String.fromCharCode(k));
    if (k == 13) c.setAttribute('v', '\n');

    c.style.backgroundColor  = pal[txtPal.bg];
    c.style.backgroundImage  = 'url(' + fontSrc[txtPal.fg] + ')';

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

    if (typeof e.stopPropagation === 'undefined') e.stopPropagation = function() {};
    if (typeof e.preventDefault  === 'undefined') e.preventDefault  = function() {};
    e.stopPropagation(); e.preventDefault();
    return false;
};

// ============================================================
// KEYBOARD HANDLER — keydown
// Handles Backspace (Firefox fix), and Up/Down arrow
// history navigation through the command stack.
// ============================================================
function doKeyDown(e) {
    if (typeof e === 'undefined') e = event;
    if (typeof e.stopPropagation === 'undefined') e.stopPropagation = function() {};
    if (typeof e.preventDefault  === 'undefined') e.preventDefault  = function() {};

    var k = e.keyCode || e.charCode;

    // Backspace — Firefox doesn't fire keypress for backspace
    if (k == 8) {
        e.stopPropagation(); e.preventDefault();
        if (window.navigator.userAgent.toLowerCase().indexOf("firefox") == -1)
            document.onkeypress({ keyCode: 8 });
        return false;
    }

    // F1 — show full command help (browser would otherwise open its own help)
    if (k == 112) {
        e.stopPropagation(); e.preventDefault();
        if (typeof showFullHelp === 'function') showFullHelp();
        return false;
    }

    var up = 38, down = 40;

    // Up arrow — step backward through command history
    if (k == up && cmdStackIdx > -1) {
        var el = cursorEl, hold;
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
        var el = cursorEl, hold;
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
    if (k == up)   kUp   = true;
    if (k == down || k == up) {
        e.stopPropagation(); e.preventDefault();
        return false;
    }
}

// ============================================================
// KEYBOARD HANDLER — keyup
// Resets arrow-key held state.
// ============================================================
function doKeyUp(e) {
    if (typeof e === 'undefined') e = event;
    if (typeof e.stopPropagation === 'undefined') e.stopPropagation = function() {};
    if (typeof e.preventDefault  === 'undefined') e.preventDefault  = function() {};

    var k = e.keyCode || e.charCode;
    if (k == 40) kDown = false;
    if (k == 38) kUp   = false;

    e.stopPropagation(); e.preventDefault(); return false;
}
