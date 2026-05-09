// ============================================================
// AMIBIOS BOOT TABLE — extended-ASCII System Configuration
// ============================================================
var AMIBIOS_TABLE = [
    'ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»',
    'º AMIBIOS System Configuration (C) 1985-1991, American Megatrends Inc.,        º',
    'ÇÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¶',
    'º Main Processor    : 80486SX          ³ Base Memory Size  : 640 KB            º',
    'º Numeric Processor : Absent           ³ Ext. Memory Size  : 7424 KB           º',
    'º Floppy Drive A:   : 1.44mb (3.5")    ³ Hard Disk C: Type : Type 47           º',
    'º Floppy Drive B:   : 360kb (5.25")    ³ Hard Disk D: Type : Custom            º',
    'º Display Type      : VGA              ³ Serial Port(s)    : COM1              º',
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

function bootMemTestLine(p) {
    // "Memory Test         : " static prefix, 4 mutable digit slots, " KB OK" suffix
    bootChars(p, 'Memory Test         : ');
    var digits = [];
    for (var i = 0; i < 4; i++) {
        var d = document.createElement('div');
        d.className = 'font f-48'; // '0'
        p.appendChild(d);
        digits.push(d);
    }
    bootChars(p, ' KB OK');
    bootNewline(p);
    return digits;
}

function animateMemTest(digits, target, onComplete) {
    var current = 0;
    var step = 64;
    function tick() {
        var s = ('000' + current).slice(-4);
        for (var i = 0; i < 4; i++) {
            digits[i].className = 'font f-' + s.charCodeAt(i);
        }
        if (current >= target) { if (onComplete) onComplete(); return; }
        current = Math.min(current + step, target);
        setTimeout(tick, 32);
    }
    tick();
}

function renderAmiBiosPost(p, onComplete) {
    var logo = document.createElement('img');
    logo.src = 'img/ami-logo.png';
    logo.alt = 'American Megatrends';
    logo.style.display = 'block';
    logo.style.margin = '0 0 12px 0';
    p.appendChild(logo);

    // Beat of black after the logo before the video BIOS speaks up,
    // so it feels like a real cold-boot transition.
    setTimeout(function () {
        // Video BIOS POST — runs first on real PCs, before the system BIOS
        bootLine(p, [bootG('Tseng ET4000 VGA BIOS Version 3.00')]);
        bootLine(p, [bootG('(C) 1990 Tseng Laboratories, Inc.')]);
        bootNewline(p);

        // System BIOS POST
        bootLine(p, [bootG('AMIBIOS (C) 1985-1991 American Megatrends Inc.,')]);
        bootNewline(p);
        bootLine(p, [bootG('Main Processor      : 80486SX')]);
        bootLine(p, [bootG('Numeric Coprocessor : Absent')]);

        var memDigits = bootMemTestLine(p);

        animateMemTest(memDigits, 8064, function () {
        bootNewline(p);
        var detectionLines = [
            'Floppy Drive A    : 1.44mb (3.5")',
            'Floppy Drive B    : 360kb (5.25")',
            'Hard Disk C       : Type 47',
            'Hard Disk D       : Custom',
            'Serial Port(s)    : COM1',
            'Parallel Port(s)  : LPT1'
        ];
        function renderNext(idx) {
            if (idx >= detectionLines.length) {
                bootNewline(p);
                bootLine(p, [bootG('Hit '), bootW('<DEL>'), bootG(' if you want to run SETUP')]);
                for (var i = 0; i < 4; i++) bootNewline(p);
                bootLine(p, [bootG('(C) American Megatrends Inc.,')]);
                bootLine(p, [bootG('40-0102-001102-00101111-121291-i486-K8')]);
                if (onComplete) onComplete();
                return;
            }
            bootLine(p, [bootG(detectionLines[idx])]);
            setTimeout(function () { renderNext(idx + 1); }, 500);
        }
        renderNext(0);
        });
    }, 300);
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
//   1. Render AMIBIOS POST  — Tseng ET4000 video BIOS line, AMIBIOS
//                             header, CPU, coprocessor, memory test
//                             (animated count 0000 → 8064 KB at 64 KB
//                             per 32 ms), then six device detection
//                             lines stream in at 500 ms intervals,
//                             then the footer (Hit <DEL>, BIOS ID).
//   2. Pause 5 s            — full POST visible.
//   3. Clear screen         — cls equivalent (wipe #prompt).
//   4. Render AMIBIOS table.
//   5. Run autoexec         — no cls; menu echoes append below the table.
// ============================================================
function init() {
    goFontGo();
    var p = document.getElementById('prompt');
    renderAmiBiosPost(p, function () {
        setTimeout(function () {
            p.innerHTML = '';
            renderAmiBios(p);
            initTerminal();
        }, 5000);
    });
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
