// ============================================================
// INITIALIZATION
// Wires up the DOM, starts the cursor blink interval,
// renders the prompt, and runs AUTOEXEC.BAT if present.
// ============================================================
function init() {
    goFontGo();
    document.onkeydown = doKeyDown;
    document.onkeyup   = doKeyUp;

    cursorEl = document.getElementById('cursor');
    promptEl = document.getElementById('prompt');

    curItvl = setInterval(function() {
        cursorEl.style.opacity = (cursorEl.style.opacity != 1) ? 1 : 0;
    }, 150);

    prompt();

    // Run AUTOEXEC.BAT from root of C: if it exists
    var autoexec = false;
    for (var i = 0; i < fs[0].files.length; i++) {
        if (fs[0].files[i].name.toLowerCase() == 'autoexec.bat' && typeof fs[0].files[i].data !== 'undefined') {
            autoexec = fs[0].files[i].data;
            break;
        }
    }
    if (autoexec != false) executeBatch(autoexec);
}
