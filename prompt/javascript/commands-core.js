// ============================================================
// FILESYSTEM COMMANDS — dir
// Lists contents of the current directory.
// Supports /w (wide), /o (ordered/sorted), /p (paged — stub).
// ============================================================
function dir(sw) {
    if (typeof sw !== 'undefined') sw = sw.toLowerCase();
    else sw = '';

    var strPrompt = "";
    strPrompt += fs[path[0]].name + ':\\';
    var fsc = fs[path[0]];
    for (var i = 1; i < path.length; i++) {
        strPrompt += fsc.directories[path[i]].name + '\\';
        fsc = fsc.directories[path[i]];
    }

    var listD = [], listF = [];
    for (var i = 0; i < fsc.directories.length; i++) listD[listD.length] = fsc.directories[i].name;
    for (var i = 0; i < fsc.files.length; i++)      listF[listF.length] = fsc.files[i].name;

    var swW = sw.indexOf('/w') != -1,
        swO = sw.indexOf('/o') != -1;

    if (swO) { listD.sort(); listF.sort(); }

    // Add . and .. navigation entries when not in root
    if (path.length > 1) {
        var navDirs = ['.', '..'];
        navDirs[0].refID = -1;
        navDirs[1].refID = -1;
        listD = navDirs.concat(listD);
    }

    echo('Directory of ' + strPrompt.toUpperCase() + '.');
    var totalSize = 0;

    var iMax = listD.length;
    if (listF.length > iMax) iMax = listF.length;

    for (var i = 0; i < iMax; i++) {
        var fdat = '';
        for (var f = 0; f < fsc.files.length; f++) {
            if (pad(fsc.files[f].name, 16, true) == listF[i] && typeof fsc.files[f].data !== 'undefined') {
                fdat = fsc.files[f].data;
                break;
            }
        }
        if (swW) {
            if (i < listD.length) listD[i] = pad('[' + listD[i] + ']', 16, true);
            if (i < listF.length) {
                var iSize = fdat.length || 1337 / listF.length;
                totalSize += iSize;
                listF[i] = pad(listF[i], 16, true);
            }
        } else {
            if (i < listD.length) listD[i] = '31/01/1993  01:02 AM    ' + pad('<DIR>', 16, true) + pad(listD[i], 16, true);
            if (i < listF.length) {
                var iSize = fdat.length || 1337 / listF.length;
                totalSize += iSize;
                listF[i] = '31/01/1993  01:02 AM    ' + pad(Math.floor(iSize) + ' ', 16, false) + pad(listF[i], 16, true);
            }
        }
    }

    if (swW) echo(listD.join('') + listF.join(''));
    else     echo(listD.join('\n') + '\n' + listF.join('\n'));

    echo(pad(pad((fsc.files.length) + '', 5, false) + ' File(s)', 16, true) + pad(Math.ceil(totalSize) + ' ', 16, false) + 'Bytes.');
    echo(pad(pad((fsc.directories.length + 2) + '', 5, false) + ' Dir(s)', 16, true) + pad('111,744 ', 16, false) + 'Bytes free.');
    echo('');
}

// ============================================================
// FILESYSTEM COMMANDS — attemptExec
// Tries to run a file in the current directory by name.
// Returns: 0=not found, 1=link opened, 2=batch executed.
// ============================================================
function attemptExec(file) {
    file = file.toLowerCase();
    var fsc = fs[path[0]];
    for (var i = 1; i < path.length; i++) fsc = fsc.directories[path[i]];

    for (var i = 0; i < fsc.files.length; i++) {
        var fname = fsc.files[i].name.toLowerCase();
        var fbase = fname.split('.')[0];
        if (fname == file || fbase == file) {
            if (typeof fsc.files[i].link !== 'undefined') {
                var win = window.open(fsc.files[i].link, "_blank");
                if (win) {
                    var poll = setInterval(function() {
                        if (win.closed) {
                            clearInterval(poll);
                            enterCmd('cd ..\n');
                            enterCmd('menu\n');
                        }
                    }, 500);
                }
                return 1;
            }
            if (typeof fsc.files[i].data !== 'undefined' && fname.split('.')[1] == 'bat') {
                prompt();
                executeBatch(fsc.files[i].data);
                return 2;
            }
        }
    }
    return 0;
}

// ============================================================
// FILESYSTEM COMMANDS — cd
// Changes the current directory. Supports absolute paths
// (starting with \), relative paths, . and .. navigation.
// ============================================================
function cd(dir) {
    if (dir.charAt(dir.length - 1) == '\\' && dir.length > 3)
        dir = dir.substr(0, dir.length - 1);

    dir = dir.toLowerCase();
    while (dir.charAt(0) == ' ' && dir.length > 0) dir = dir.substr(1);

    // cd \ — go to drive root
    if (dir.charAt(0) == '\\' && dir.length == 1) { path = [0]; return true; }

    // Absolute path from root
    if (dir.charAt(0) == '\\') {
        var dir = dir.split('\\');
        var newPath = [0];
        var fsc = fs[newPath[0]];
        for (var d = 1; d < dir.length; d++) {
            var bFound = false;
            for (var i = 0; i < fsc.directories.length; i++) {
                if (fsc.directories[i].name.toLowerCase() == dir[d]) {
                    newPath[d] = i;
                    fsc = fsc.directories[newPath[d]];
                    bFound = true;
                    break;
                }
            }
            if (!bFound) return false;
        }
        path = newPath;
        return true;
    }

    // Relative path
    if (dir == '..' && path.length > 1) { path.pop(); return true; }
    if (dir == '.') { return true; }
    if (dir.substr(0, 3) == '..\\'  && path.length > 1) { dir = dir.substr(3); path.pop(); }

    var fsc = fs[path[0]];
    for (var i = 1; i < path.length; i++) fsc = fsc.directories[path[i]];
    if (dir.substr(0, 2) == '.\\') dir = dir.substr(2);

    for (var i = 0; i < fsc.directories.length; i++) {
        if (fsc.directories[i].name.toLowerCase() == dir) {
            path[path.length] = i;
            return true;
        }
    }
    return false;
}

// ============================================================
// FILESYSTEM COMMANDS — type
// Prints the contents (data or link) of a file.
// ============================================================
function type(file) {
    file = file.toLowerCase();
    var fsc = fs[path[0]];
    for (var i = 1; i < path.length; i++) fsc = fsc.directories[path[i]];

    for (var i = 0; i < fsc.files.length; i++) {
        var fname = fsc.files[i].name.toLowerCase();
        if (fname == file || fname.split('.')[0] == file) {
            if (typeof fsc.files[i].data  !== 'undefined') { echo(fsc.files[i].data);  return true; }
            if (typeof fsc.files[i].link  !== 'undefined') { echo(fsc.files[i].link);  return true; }
        }
    }
    echo('The syntax of the command is incorrect.');
    return false;
}

// ============================================================
// COMMAND REGISTRY
// Commands are registered by name and dispatched via handleCmd.
// ============================================================
function registerCmd(name, method, replace) {
    if (typeof commands[name] !== 'undefined' && replace !== true) {
        console.log('command ' + name + ' already exists.');
    }
    commands[name] = { name: name, method: method };
}

function handleCmd(cmd) {
    // Handle command chaining with ' && '
    if (cmd.split(' && ').length > 1) {
        var cmds = cmd.split(' && ');
        echo('\n');
        prompt();
        for (var i = 0; i < cmds.length; i++) {
            console.log(cmds[i] + ' |> ' + i);
            prompt(cmds[i]);
            handleCmd(cmds[i]);
        }
        return;
    }

    if (ctxStack.length > 0) { ctxStack[ctxStack.length - 1].handleCmd(cmd); return; }

    cmd = cmd.replace(' \& ', ' & ');

    if (!bEchoOff) {
        promptMode = true;
        document.onkeypress({ keyCode: 13, stopPropagation: function() {}, preventDefault: function() {} });
        promptMode = false;
    }

    cmdStack[cmdStack.length] = cmd;
    cmdStackIdx = cmdStack.length - 1;

    if (cmd == '' && !bEchoOff) echo('');
    if (cmd.charAt(1) == ':' && cmd.replace(' ', '').length == 2) {
        // Drive change (e.g. A:) — stub, not implemented
    }

    // Dispatch to registered command handler
    var c = cmd.toLowerCase().split(/ |\\|\.\\|\.\.|\//i)[0];
    if (typeof commands[c] !== 'undefined') {
        if (typeof commands[c].method === 'function') {
            if (commands[c].method(cmd.substr(c.length)) !== false) prompt();
            return;
        }
    }

    // Try running a file, or print error
    if (cmd.replace(' ', '') != '') {
        var r = attemptExec(c);
        if (!r)    echo('Bad command or file name');
        else if (r == 2) return;
    }
    prompt();
}
