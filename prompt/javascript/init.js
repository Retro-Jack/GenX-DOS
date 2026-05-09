// ============================================================
// AMIBIOS BOOT TABLE — extended-ASCII System Configuration
// ============================================================
var AMIBIOS_TABLE = [
    'ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»',
    'º AMIBIOS System Configuration (C) 1985-1991, American Megatrends Inc.,        º',
    'ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶',
    'º Main Processor    : 80486SX          ³ Base Memory Size  : 640 KB            º',
    'º Numeric Processor : None             ³ Ext. Memory Size  : 7424 KB           º',
    'º Floppy Drive A:   : 1.44mb (3.5")    ³ Hard Disk C: Type : Type 47           º',
    'º Floppy Drive B:   : 360kb (5.25")    ³ Hard Disk D: Type : Custom            º',
    'º Display Type      : VGA/PGA/EGA      ³ Serial Port(s)    : COM1              º',
    'º AMIBIOS Date      : 12/12/91         ³ Parallel Port(s)  : LPT1              º',
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

function renderAmiBiosPost(p) {
    var logo = document.createElement('img');
    logo.src = 'img/ami-logo.png';
    logo.alt = 'American Megatrends';
    logo.style.display = 'block';
    logo.style.margin = '0 0 12px 0';
    p.appendChild(logo);

    bootLine(p, [bootG('AMIBIOS (C) 1985-1991 American Megatrends Inc.,')]);
    bootNewline(p);
    bootLine(p, [bootG('Main Processor      : 80486SX')]);
    bootLine(p, [bootG('Numeric Coprocessor : Not Installed')]);
    bootLine(p, [bootG('Memory Test         : 8064 KB OK')]);
    bootNewline(p);
    bootLine(p, [bootG('Detecting Floppy Drive A   : ... 1.44mb (3.5")')]);
    bootLine(p, [bootG('Detecting Floppy Drive B   : ... 360kb (5.25")')]);
    bootLine(p, [bootG('Detecting Hard Disk C      : ... Type 47')]);
    bootLine(p, [bootG('Detecting Hard Disk D      : ... Custom')]);
    bootLine(p, [bootG('Detecting Serial Port(s)   : ... COM1')]);
    bootLine(p, [bootG('Detecting Parallel Port(s) : ... LPT1')]);
    bootNewline(p);
    bootLine(p, [bootG('Hit '), bootW('<DEL>'), bootG(' if you want to run SETUP')]);
    for (var i = 0; i < 4; i++) bootNewline(p);
    bootLine(p, [bootG('(C) American Megatrends Inc.,')]);
    bootLine(p, [bootG('40-0102-001102-00101111-121291-i486-K8')]);
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
//   1. Render AMIBIOS POST → user reads it (logo + POST text)
//   2. Pause 4 s
//   3. Clear screen         (via cls equivalent — wipe #prompt)
//   4. Render AMIBIOS table
//   5. Run autoexec         (no cls — menu echoes append below)
// ============================================================
function init() {
    goFontGo();
    var p = document.getElementById('prompt');
    renderAmiBiosPost(p);

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
