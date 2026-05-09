// ============================================================
// AMIBIOS BOOT TABLE — extended-ASCII System Configuration
// ============================================================
var AMIBIOS_TABLE = [
    'ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»',
    'º AMIBIOS System Configuration (C) 1985-1991, American Megatrends Inc.,        º',
    'ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶',
    'º Main Processor    : 80486SX          ³ Base Memory Size  : 640 KB            º',
    'º Numeric Processor : None             ³ Ext. Memory Size  : 7424 KB           º',
    'º Floppy Drive A:   : None             ³ Hard Disk C: Type : None              º',
    'º Floppy Drive B:   : None             ³ Hard Disk D: Type : None              º',
    'º Display Type      : VGA/PGA/EGA      ³ Serial Port(s)    : None              º',
    'º AMIBIOS Date      : 12/12/91         ³ Parallel Port(s)  : None              º',
    'ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼'
];

// ============================================================
// BOOT-PHASE TEXT HELPERS
// Render text into #screen using the bitmap font sprite sheet.
// Used only during the pre-terminal boot animation.
// ============================================================
var BOOT_WHITE = 'img/f12.15.png';

function bootChars(container, str, imgOverride) {
    for (var i = 0; i < str.length; i++) {
        var d = document.createElement('div');
        d.className = 'font f-' + str.charCodeAt(i);
        if (imgOverride) d.style.backgroundImage = 'url(' + imgOverride + ')';
        container.appendChild(d);
    }
}

function bootNewline(container) {
    var d = document.createElement('div');
    d.className = 'font f-n';
    container.appendChild(d);
}

function bootLine(container, segments) {
    for (var i = 0; i < segments.length; i++) {
        bootChars(container, segments[i].text, segments[i].img || null);
    }
    bootNewline(container);
}

function bootG(t) { return { text: t }; }
function bootW(t) { return { text: t, img: BOOT_WHITE }; }

function renderAwardPost(s) {
    bootLine(s, [bootG('Award Modular BIOS v4.51PG, An Energy Star Ally')]);
    bootLine(s, [bootG('Copyright (C) 1984-97, Award Software, Inc.')]);
    bootNewline(s);
    bootLine(s, [bootG('(SSXWUQ@E) Intel i430VX PCIset (TM)')]);
    bootNewline(s);
    bootLine(s, [bootG('PENTIUM-S CPU at 75MHz')]);
    bootLine(s, [bootG('Memory Test : 32768K OK')]);
    bootNewline(s);
    bootLine(s, [bootG('Award Plug and Play BIOS Extension v1.0A')]);
    bootLine(s, [bootG('Copyright (C) 1997, Award Software, Inc.')]);
    bootLine(s, [bootG('  Detecting IDE Primary Master ... (Press '), bootW('F4'), bootG(' to skip)')]);
    for (var i = 0; i < 7; i++) bootNewline(s);
    bootLine(s, [bootG('Press '), bootW('DEL'), bootG(' to enter SETUP')]);
    bootLine(s, [bootG('12/10/97-i430VX,UMC86669-2A59GH2BC-00')]);
}

function renderAmiBios(s) {
    for (var i = 0; i < AMIBIOS_TABLE.length; i++) {
        bootLine(s, [bootG(AMIBIOS_TABLE[i])]);
    }
}

// ============================================================
// INITIALIZATION
// Boot phase (Award POST → AMIBIOS) feeds straight into the
// terminal phase on the same page. Hiding #screen and revealing
// #prompt-wrap happens in the same JS tick as autoexec running,
// so the menu appears with no flash or navigation.
// ============================================================
function init() {
    goFontGo();

    var s = document.getElementById('screen');
    renderAwardPost(s);

    setTimeout(function () {
        s.innerHTML = '';
        renderAmiBios(s);

        setTimeout(function () {
            s.style.display = 'none';
            document.getElementById('prompt-wrap').style.display = '';
            initTerminal();
        }, 4000);
    }, 4000);
}

function initTerminal() {
    document.onkeydown = doKeyDown;
    document.onkeyup   = doKeyUp;

    cursorEl = document.getElementById('cursor');
    promptEl = document.getElementById('prompt');

    curItvl = setInterval(function() {
        cursorEl.style.opacity = (cursorEl.style.opacity != 1) ? 1 : 0;
    }, 150);

    prompt();

    var autoexec = false;
    for (var i = 0; i < fs[0].files.length; i++) {
        if (fs[0].files[i].name.toLowerCase() == 'autoexec.bat' && typeof fs[0].files[i].data !== 'undefined') {
            autoexec = fs[0].files[i].data;
            break;
        }
    }
    if (autoexec != false) executeBatch(autoexec);
}
