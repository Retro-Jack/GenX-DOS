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
// Render text into #prompt directly using the bitmap font sprite
// sheet. Used only during the pre-terminal boot animation.
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

function renderAwardPost(p) {
    var logo = document.createElement('img');
    logo.src = 'img/ami-logo.png';
    logo.alt = 'American Megatrends';
    logo.style.display = 'block';
    logo.style.margin = '0 auto 12px';
    p.appendChild(logo);

    bootLine(p, [bootG('Award Modular BIOS v4.51PG, An Energy Star Ally')]);
    bootLine(p, [bootG('Copyright (C) 1984-97, Award Software, Inc.')]);
    bootNewline(p);
    bootLine(p, [bootG('(SSXWUQ@E) Intel i430VX PCIset (TM)')]);
    bootNewline(p);
    bootLine(p, [bootG('PENTIUM-S CPU at 75MHz')]);
    bootLine(p, [bootG('Memory Test : 32768K OK')]);
    bootNewline(p);
    bootLine(p, [bootG('Award Plug and Play BIOS Extension v1.0A')]);
    bootLine(p, [bootG('Copyright (C) 1997, Award Software, Inc.')]);
    bootLine(p, [bootG('  Detecting IDE Primary Master ... (Press '), bootW('F4'), bootG(' to skip)')]);
    for (var i = 0; i < 7; i++) bootNewline(p);
    bootLine(p, [bootG('Press '), bootW('DEL'), bootG(' to enter SETUP')]);
    bootLine(p, [bootG('12/10/97-i430VX,UMC86669-2A59GH2BC-00')]);
}

function renderAmiBios(p) {
    for (var i = 0; i < AMIBIOS_TABLE.length; i++) {
        bootLine(p, [bootG(AMIBIOS_TABLE[i])]);
    }
}

// ============================================================
// INITIALIZATION
// Boot animation runs inside #prompt so the AMIBIOS table stays
// on-screen while the menu draws below it (no cls between them):
//
//   1. Render Award POST   → user reads it
//   2. Pause 4 s
//   3. Clear screen        (via cls equivalent — wipe #prompt)
//   4. Render AMIBIOS table
//   5. Run autoexec        (no cls — menu echoes append below)
// ============================================================
function init() {
    goFontGo();
    var p = document.getElementById('prompt');
    renderAwardPost(p);

    setTimeout(function () {
        p.innerHTML = '';
        renderAmiBios(p);
        initTerminal();
    }, 4000);
}

function initTerminal() {
    document.onkeydown = doKeyDown;
    document.onkeyup   = doKeyUp;

    promptEl = document.getElementById('prompt');

    // Add the cursor at the end of #prompt (after the AMIBIOS table)
    cursorEl = document.createElement('div');
    cursorEl.id = 'cursor';
    cursorEl.className = 'font f-95 f-cursor';
    promptEl.appendChild(cursorEl);

    curItvl = setInterval(function() {
        cursorEl.style.opacity = (cursorEl.style.opacity != 1) ? 1 : 0;
    }, 150);

    // Run AUTOEXEC.BAT with echo suppressed so no `C:\>` lines pollute
    // the AMIBIOS-then-menu look. executeBatch() restores echo at the end.
    var autoexec = false;
    for (var i = 0; i < fs[0].files.length; i++) {
        if (fs[0].files[i].name.toLowerCase() == 'autoexec.bat' && typeof fs[0].files[i].data !== 'undefined') {
            autoexec = fs[0].files[i].data;
            break;
        }
    }
    if (autoexec != false) {
        bEchoOff = true;
        executeBatch(autoexec);
    } else {
        prompt();
    }
}
