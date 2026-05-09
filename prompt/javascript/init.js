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
var BOOT_RED   = 'img/f12.4.png';

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
function bootR(t) { return { text: t, img: BOOT_RED }; }

function renderAmiBiosPost(p) {
    var logo = document.createElement('img');
    logo.src = 'img/ami-logo.png';
    logo.alt = 'American Megatrends';
    logo.style.display = 'block';
    logo.style.margin = '0 0 4px 0';
    p.appendChild(logo);

    bootLine(p, [bootR('www.ami.com')]);
    bootNewline(p);
    bootLine(p, [bootW('AMIBIOS(C) 2006 American Megatrends, Inc.')]);
    bootLine(p, [bootW('G31D-M7 (G31GMB25 BF) BIOS Date: 11/25/08')]);
    bootLine(p, [bootW('CPU : Pentium(R) Dual-Core CPU         E5200 @ 2.50GHz')]);
    bootLine(p, [bootW('CPU Frequency 2.50 GHz')]);
    bootLine(p, [bootW('Memory Frequency For DDR2 667')]);
    bootLine(p, [bootW('Press DEL to run Setup')]);
    bootLine(p, [bootW('Press F9 for BBS POPUP')]);
    bootLine(p, [bootW('Press F12 for BIOS POST Flash')]);
    bootLine(p, [bootW('Initializing USB Controllers .. Done.')]);
    bootLine(p, [bootW('2040MB OK + 8MB Share Memory')]);
    bootLine(p, [bootW('USB Device(s): 1 Keyboard, 1 Mouse')]);
    bootLine(p, [bootW('Auto-Detecting           SATA1 DEVICE..IDE Hard Disk:ST3500641AS  3.AGM')]);
    bootLine(p, [bootW('Auto-detecting USB Mass Storage Devices ..')]);
    bootLine(p, [bootW('00 USB mass storage devices found and configured.')]);
    bootNewline(p);
    bootLine(p, [bootW('   Pri Master Hard Disk:S.M.A.R.T. Status BAD, Backup and Replace')]);
    bootLine(p, [bootW("   Press 'DEL' to Resume")]);
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
//   1. Render AMIBIOS POST  → user reads it (logo + POST text)
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
