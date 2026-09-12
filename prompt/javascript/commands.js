// ============================================================
// BUILT-IN COMMANDS
// ============================================================
registerCmd('exit', function () {
  echo("I'm sorry, Dave. I'm afraid I can't do that.");
  echo('');
});
registerCmd('del', function () {
  echo('Sorry, file(s) last seen running away.');
  echo('');
});
registerCmd('rmdir', function () {
  echo('Bad command or go away.');
  echo('');
});
registerCmd('chkdsk', function () {
  echo("*Checking...*  Yep, that's a disk.");
  echo('');
});
registerCmd('help', function () {
  showFullHelp();
});
registerCmd('format', function () {
  echo('Specified drive does not exist. Anarchist.');
  echo('');
});
registerCmd('edlin', function () {
  echo('Whoa now, this is not MS-DOS!');
  echo('');
});
registerCmd('edit', function () {
  echo('Error: Correction fluid mismatch.');
  echo('');
});
registerCmd('debug', function () {
  echo('Program terminated normally (0000)');
  echo('');
});
registerCmd('attrib', function () {
  echo('A ttrib is a terrible thing to waste.');
  echo('');
});
registerCmd('zerocool', function () {
  txtPal.fg = 11;
  txtPal.bg = 1;
  echo('HACK THE PLANET!');
  echo('');
});
registerCmd('quit', function () {
  echo("You're just gonna quit, huh? Good luck with that.");
  echo('');
});

registerCmd('dopefish', function () {
  echo('Lives!');
  var dope = [
    1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1,
    0, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 2, 9, 1, 9, 1, 9, 1, 9,
    1, 9, 1, 9, 1, 9, 1, 9, 1, 2, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1,
    0, 0, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 0, 2, 2, 2, 2, 0, 1, 9, 1, 9,
    1, 9, 1, 9, 1, 9, 1, 2, 2, 2, 2, 2, 2, 0, 1, 9, 1, 9, 1, 9, 1, 9, 1, 2, 2,
    2, 2, 2, 2, 2, 2, 9, 1, 9, 1, 9, 1, 9, 1, 9, 2, 0, 15, 15, 8, 2, 2, 2, 2, 9,
    1, 9, 1, 9, 1, 9, 0, 2, 15, 15, 15, 15, 2, 2, 2, 2, 1, 9, 1, 9, 1, 9, 1, 2,
    2, 15, 15, 15, 15, 2, 15, 2, 2, 0, 1, 9, 1, 9, 1, 9, 2, 0, 15, 15, 0, 15,
    15, 15, 15, 2, 2, 9, 2, 0, 1, 9, 1, 2, 15, 15, 0, 0, 0, 15, 15, 15, 2, 2, 1,
    2, 2, 9, 1, 9, 2, 15, 15, 0, 0, 0, 0, 15, 15, 2, 2, 2, 2, 2, 0, 9, 1, 2, 15,
    15, 0, 0, 0, 0, 0, 15, 2, 2, 2, 2, 2, 2, 0, 9, 2, 15, 15, 0, 0, 0, 0, 15,
    15, 2, 0, 8, 2, 2, 2, 2, 0, 2, 15, 15, 15, 0, 0, 15, 15, 2, 2, 2, 0, 2, 2,
    2, 2, 2, 2, 0, 15, 15, 15, 2, 2, 2, 2, 0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 7, 15,
    8, 2, 2, 2, 0, 4, 0, 2, 9, 1, 2, 2, 0, 2, 2, 2, 2, 2, 0, 15, 15, 0, 4, 0, 2,
    2, 9, 8, 2, 1, 2, 2, 2, 15, 15, 15, 15, 15, 0, 0, 0, 2, 2, 1, 9, 0, 9, 2, 2,
    2, 15, 15, 15, 15, 15, 0, 0, 0, 2, 2, 9, 1, 0, 2, 2, 2, 2, 15, 15, 15, 15,
    15, 0, 4, 0, 2, 2, 1, 9, 1, 2, 8, 2, 2, 15, 15, 15, 15, 15, 0, 0, 2, 2, 1,
    9, 1, 9, 2, 9, 2, 2, 15, 15, 15, 15, 15, 0, 2, 2, 8, 9, 1, 9, 1, 9, 1, 2, 2,
    0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 9, 1, 9, 1, 9, 2, 0, 2, 2, 0, 2, 2, 2, 2, 0,
    1, 9, 1, 9, 1, 9, 1, 0, 2, 2, 2, 0, 8, 2, 2, 0, 0, 9, 1, 9, 1, 9, 1, 9, 1,
    2, 0, 2, 2, 0, 0, 0, 0, 9, 1, 9, 1, 9, 1, 9, 1, 9, 0, 2, 0, 0, 0, 0, 8, 9,
    1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 0, 2, 2, 2, 2, 0, 1, 9, 1, 9, 1, 9, 1, 9, 1,
    9, 1, 9, 0, 0, 0, 9, 1, 9, 1, 9, 1, 9,
  ];
  for (var y = 0; y < 32; y += 2) {
    for (var x = 0; x < 17; x++) {
      var c = document.createElement('div');
      addClass(c, 'font');
      addClass(c, 'f-' + 220);
      c.style.backgroundColor = pal[dope[y * 17 + x]];
      c.style.backgroundImage = 'url(' + fontSrc[dope[(y + 1) * 17 + x]] + ')';
      promptEl.insertBefore(c, cursorEl);
    }
    var c = document.createElement('div');
    addClass(c, 'font');
    addClass(c, 'f-n');
    promptEl.insertBefore(c, cursorEl);
  }
  echo('');
});

registerCmd('echo', function (cmd) {
  if (cmd == 'off') {
    bEchoOff = true;
    return;
  }
  if (cmd == 'on') {
    // Re-enable echo. Returning undefined lets the dispatcher redraw the
    // C:\> prompt (handleCmd calls prompt() after a command that doesn't
    // return false), so a batch can end with `echo on` to drop to a live
    // prompt — without printing a blank line the way `echo.` does.
    bEchoOff = false;
    return;
  }
  echo(cmd);
});
registerCmd('echo.', function () {
  bEchoOff = false;
  echo('');
});
registerCmd('type', function (cmd) {
  type(cmd);
});
function clearScreen() {
  promptEl.innerHTML = '<div id="cursor" class="font f-95 f-cursor"></div>';
  cursorEl = document.getElementById('cursor');
}
registerCmd('cls', function () {
  clearScreen();
});
registerCmd('dir', function (cmd) {
  dir(cmd);
});
registerCmd('cd', function (cmd) {
  if (!cd(cmd.toLowerCase().replace('cd', '')))
    echo('The system cannot find the path specified.');
});
registerCmd('find', function (cmd) {
  find(cmd);
});
registerCmd('setcol', function (cmd) {
  if (cmd.length != 2) {
    echo('invalid command');
  } else {
    var b = Number('0x' + cmd.charAt(0), 16);
    var f = Number('0x' + cmd.charAt(1), 16);
    if (b + '' != 'NaN' && f + '' != 'NaN') {
      txtPal.bg = b;
      txtPal.fg = f;
    } else echo('invalid command');
  }
});

// ============================================================
// FULL HELP (F1) — text imported from the wiki Commands page
// (the wiki — docs/wiki/Commands.html).
// ============================================================
// The prompt is a fixed 80x25 grid and rolls up like VGA: the buffer keeps
// growing but only the last 25 rows are ever visible, and there is no
// scrollback to reach the rest. A one-per-line reference ran to 31 rows, so
// its first third had scrolled off before the reader saw it. Two columns fit
// the whole reference on one screen, and the columns are padded here rather
// than typed as spaces so a longer description cannot silently misalign them.
var HELP_LEFT = [
  'NAVIGATION',
  '  dir             List the directory',
  '  dir /w          Wide view',
  '  dir /o          Alphabetical order',
  '  dir /w /o       Wide + sorted',
  '  cd <dir>        Change directory',
  '  cd ..           Up one level',
  '  cd \\            Jump to drive root',
  '  cls             Clear the screen',
  '',
  'FILES',
  '  <filename>      Execute (.exe, .bat)',
  "  type <file>     Print a file's data",
  '  find <word>     Search games + menus',
  '  find "<words>"  Quote a phrase',
];
// Padded with blanks so each heading sits level with the one beside it:
// DISPLAY opposite NAVIGATION, KEYBOARD opposite FILES.
var HELP_RIGHT = [
  'DISPLAY',
  '  echo <text>     Print text',
  '  echo off        Hide prompt in a batch',
  '  echo on         Show it again',
  '  echo.           Blank line, echo on',
  '  setcol <BF>     Colours, hex bg+fg',
  '',
  '',
  '',
  '',
  'KEYBOARD',
  '  Enter           Submit',
  '  Backspace       Delete last character',
  '  Up / Down       Command history',
];
var HELP_COL = 40; // left column width, of the grid's 80

function helpPad(s) {
  while (s.length < HELP_COL) s += ' ';
  return s;
}

var HELP_TEXT = (function () {
  var rule = '';
  while (rule.length < 80) rule += '\u00C4'; // CP437 single horizontal, as the menus use
  var out = [
    'GENX-DOS COMMAND REFERENCE - case-insensitive; chain with " && "',
    rule,
  ];
  var rows = Math.max(HELP_LEFT.length, HELP_RIGHT.length);
  for (var i = 0; i < rows; i++) {
    var left = HELP_LEFT[i] || '';
    var right = HELP_RIGHT[i] || '';
    out.push(right ? helpPad(left) + right : left);
  }
  return out;
})();

function showFullHelp() {
  // Clear first. The reference fills the screen, so it reads as a page of its
  // own rather than as output pushed up by whatever came before it, and it
  // always lands in the same place. A blank line after it keeps the returning
  // prompt off the last row of the table.
  clearScreen();
  for (var i = 0; i < HELP_TEXT.length; i++) echo(HELP_TEXT[i]);
  echo('');
}
