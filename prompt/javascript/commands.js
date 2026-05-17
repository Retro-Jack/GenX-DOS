// ============================================================
// BUILT-IN COMMANDS
// ============================================================
registerCmd('exit',    function()    { echo("I'm sorry, Dave, I'm afraid I can't do that."); });
registerCmd('del',     function()    { echo("File(s) too important for me to allow you to jeopardize."); });
registerCmd('rmdir',   function()    { echo("Bad command or go away."); });
registerCmd('chkdsk',  function()    { echo("*Checking...*  Yep, that's a disk."); });
registerCmd('help',    function()    { showFullHelp(); });
registerCmd('format',  function()    { echo("Specified drive does not exist. Anarchist."); });
registerCmd('edlin',   function()    { echo("Whoa now, this is not MS-DOS!"); });
registerCmd('edit',    function()    { echo("Error: Correction fluid mismatch."); });
registerCmd('debug',   function()    { echo("Program terminated normally (0000)"); });
registerCmd('attrib',  function()    { echo("A ttrib is a terrible thing to waste."); });
registerCmd('zerocool',function()    { txtPal.fg = 11; txtPal.bg = 1; echo("HACK THE PLANET!"); });
registerCmd('quit',    function()    { echo("You're just gonna quit, huh? Good luck with that."); });

registerCmd('dopefish', function() {
    echo("Lives!");
    var dope = [1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,0,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,2,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,2,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,0,0,9,1,9,1,9,1,9,1,9,1,9,1,9,0,2,2,2,2,0,1,9,1,9,1,9,1,9,1,9,1,2,2,2,2,2,2,0,1,9,1,9,1,9,1,9,1,2,2,2,2,2,2,2,2,9,1,9,1,9,1,9,1,9,2,0,15,15,8,2,2,2,2,9,1,9,1,9,1,9,0,2,15,15,15,15,2,2,2,2,1,9,1,9,1,9,1,2,2,15,15,15,15,2,15,2,2,0,1,9,1,9,1,9,2,0,15,15,0,15,15,15,15,2,2,9,2,0,1,9,1,2,15,15,0,0,0,15,15,15,2,2,1,2,2,9,1,9,2,15,15,0,0,0,0,15,15,2,2,2,2,2,0,9,1,2,15,15,0,0,0,0,0,15,2,2,2,2,2,2,0,9,2,15,15,0,0,0,0,15,15,2,0,8,2,2,2,2,0,2,15,15,15,0,0,15,15,2,2,2,0,2,2,2,2,2,2,0,15,15,15,2,2,2,2,0,2,2,1,2,2,2,2,2,2,7,15,8,2,2,2,0,4,0,2,9,1,2,2,0,2,2,2,2,2,0,15,15,0,4,0,2,2,9,8,2,1,2,2,2,15,15,15,15,15,0,0,0,2,2,1,9,0,9,2,2,2,15,15,15,15,15,0,0,0,2,2,9,1,0,2,2,2,2,15,15,15,15,15,0,4,0,2,2,1,9,1,2,8,2,2,15,15,15,15,15,0,0,2,2,1,9,1,9,2,9,2,2,15,15,15,15,15,0,2,2,8,9,1,9,1,9,1,2,2,0,0,0,0,0,0,2,2,0,1,9,1,9,1,9,2,0,2,2,0,2,2,2,2,0,1,9,1,9,1,9,1,0,2,2,2,0,8,2,2,0,0,9,1,9,1,9,1,9,1,2,0,2,2,0,0,0,0,9,1,9,1,9,1,9,1,9,0,2,0,0,0,0,8,9,1,9,1,9,1,9,1,9,1,9,0,2,2,2,2,0,1,9,1,9,1,9,1,9,1,9,1,9,0,0,0,9,1,9,1,9,1,9];
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
});

registerCmd('echo', function(cmd) {
    if (cmd == 'off') { bEchoOff = true; return; }
    echo(cmd);
});
registerCmd('echo.', function() { bEchoOff = false; echo(''); });
registerCmd('type', function(cmd) { type(cmd); });
registerCmd('cls', function() {
    promptEl.innerHTML = '<div id="cursor" class="font f-95 f-cursor"></div>';
    cursorEl = document.getElementById('cursor');
});
registerCmd('dir', function(cmd) { dir(cmd); });
registerCmd('cd', function(cmd) {
    if (!cd(cmd.toLowerCase().replace('cd', '')))
        echo('The system cannot find the path specified.');
});
registerCmd('find', function(cmd) { find(cmd); });
registerCmd('setcol', function(cmd) {
    if (cmd.length != 2) {
        echo('invalid command');
    } else {
        var b = Number('0x' + cmd.charAt(0), 16);
        var f = Number('0x' + cmd.charAt(1), 16);
        if (b + '' != 'NaN' && f + '' != 'NaN') { txtPal.bg = b; txtPal.fg = f; }
        else echo('invalid command');
    }
});

// ============================================================
// FULL HELP (F1) — text imported from the wiki Commands page
// (github.com/Retro-Jack/GenX-DOS/wiki/Commands).
// ============================================================
var HELP_TEXT = [
    'GENX-DOS COMMAND REFERENCE',
    '(case-insensitive; chain commands with " && ")',
    '',
    'NAVIGATION',
    '  dir              List the current directory',
    '  dir /w           Wide view',
    '  dir /o           Alphabetical order',
    '  dir /w /o        Wide + sorted',
    '  cd <dir>         Change directory',
    '  cd ..            Go up one level',
    '  cd \\             Jump to drive root',
    '  cls              Clear the screen',
    '',
    'FILES',
    '  <filename>       Execute (link opens URL, .bat runs as batch)',
    '  type <file>      Print the file\'s data',
    '  find <word>      Search games + emulator menus by name or code',
    '  find "<phrase>"  Quote multi-word queries',
    '',
    'DISPLAY',
    '  echo <text>      Print text',
    '  echo off         Suppress C:\\> prompt re-render until end of batch',
    '  echo.            Print a blank line and re-enable prompt re-render',
    '  setcol <BF>      Set background + foreground hex colour',
    '',
    'STUB COMMANDS (one-liner responses)',
    '  exit, del, rmdir, format, chkdsk, edlin, edit, debug,',
    '  attrib, quit',
    '',
    'KEYBOARD',
    '  Enter            Submit',
    '  Backspace        Delete last character',
    '  Up / Down        Step through command history'
];

function showFullHelp() {
    echo('');
    for (var i = 0; i < HELP_TEXT.length; i++) echo(HELP_TEXT[i]);
}
