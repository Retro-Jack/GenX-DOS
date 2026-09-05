// ============================================================
// FILESYSTEM COMMANDS — dir
// Lists contents of the current directory.
// Supports /w (wide), /o (ordered/sorted), /p (paged — stub).
// ============================================================
function dir(sw) {
  if (typeof sw !== 'undefined') sw = sw.toLowerCase();
  else sw = '';

  var strPrompt = '';
  strPrompt += fs[path[0]].name + ':\\';
  var fsc = fs[path[0]];
  for (var i = 1; i < path.length; i++) {
    strPrompt += fsc.directories[path[i]].name + '\\';
    fsc = fsc.directories[path[i]];
  }

  var listD = [],
    listF = [];
  for (var i = 0; i < fsc.directories.length; i++)
    listD[listD.length] = fsc.directories[i].name;
  for (var i = 0; i < fsc.files.length; i++)
    listF[listF.length] = fsc.files[i].name;

  var swW = sw.indexOf('/w') != -1,
    swO = sw.indexOf('/o') != -1;

  if (swO) {
    listD.sort();
    listF.sort();
  }

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
      if (
        pad(fsc.files[f].name, 16, true) == listF[i] &&
        typeof fsc.files[f].data !== 'undefined'
      ) {
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
      if (i < listD.length)
        listD[i] =
          '31/01/1993  01:02 AM    ' +
          pad('<DIR>', 16, true) +
          pad(listD[i], 16, true);
      if (i < listF.length) {
        var iSize = fdat.length || 1337 / listF.length;
        totalSize += iSize;
        listF[i] =
          '31/01/1993  01:02 AM    ' +
          pad(Math.floor(iSize) + ' ', 16, false) +
          pad(listF[i], 16, true);
      }
    }
  }

  if (swW) echo(listD.join('') + listF.join(''));
  else echo(listD.join('\n') + '\n' + listF.join('\n'));

  echo(
    pad(pad(fsc.files.length + '', 5, false) + ' File(s)', 16, true) +
      pad(Math.ceil(totalSize) + ' ', 16, false) +
      'Bytes.',
  );
  echo(
    pad(pad(fsc.directories.length + 2 + '', 5, false) + ' Dir(s)', 16, true) +
      pad('111,744 ', 16, false) +
      'Bytes free.',
  );
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
        var win = window.open(fsc.files[i].link, '_blank');
        if (win) {
          var poll = setInterval(function () {
            if (win.closed) {
              clearInterval(poll);
              enterCmd('menu\n');
            }
          }, 500);
        }
        return 1;
      }
      if (
        typeof fsc.files[i].data !== 'undefined' &&
        fname.split('.')[1] == 'bat'
      ) {
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
  if (dir.charAt(0) == '\\' && dir.length == 1) {
    path = [0];
    return true;
  }

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
  if (dir == '..' && path.length > 1) {
    path.pop();
    return true;
  }
  if (dir == '.') {
    return true;
  }
  if (dir.substr(0, 3) == '..\\' && path.length > 1) {
    dir = dir.substr(3);
    path.pop();
  }

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
      if (typeof fsc.files[i].data !== 'undefined') {
        echo(fsc.files[i].data);
        return true;
      }
      // A launcher is a program, so TYPE treats it as one: DOS printed the
      // raw bytes of an .EXE and honoured Ctrl-Z as end-of-file, which is why
      // you got a short burst of noise rather than pages of it. The bytes are
      // generated, never stored — 351 files of saved junk would bloat fs.js
      // for nothing — and are seeded from the filename, so each program's
      // garbage is stable and its own.
      if (
        typeof fsc.files[i].link !== 'undefined' &&
        fname.split('.')[1] === 'exe'
      ) {
        typeExe(fname);
        return true;
      }
      if (typeof fsc.files[i].link !== 'undefined') {
        echo(fsc.files[i].link);
        return true;
      }
    }
  }
  echo('The syntax of the command is incorrect.');
  return false;
}


// ============================================================
// TYPE on an .EXE — the DOS behaviour, reproduced.
// Real MS-DOS printed the file's bytes to screen; the terminal rendered
// each one as its CP437 glyph, and TYPE stopped dead at the first 0x1A
// (Ctrl-Z), the end-of-file marker. So you saw "MZ", a burst of noise,
// and then the prompt came back.
//
// Deliberately NOT included: "This program cannot be run in DOS mode."
// That string belongs to the Windows PE stub and would be an anachronism
// on a machine pretending to be a DOS box — a real DOS executable is
// just MZ followed by binary.
// ============================================================
function typeExe(name) {
  var seed = 0;
  for (var i = 0; i < name.length; i++)
    seed = (seed * 31 + name.charCodeAt(i)) >>> 0;
  function nextByte() {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return (seed >>> 16) & 0xff;
  }

  var eof = 60 + (nextByte() % 220); // where this file's Ctrl-Z happens to sit
  var line = 'MZ';
  for (var n = 0; n < eof; n++) {
    var b = nextByte();
    if (b === 26) break; // Ctrl-Z reached early: DOS stops here too
    // DOS wrote these bytes to the console, which acted on a handful of
    // them instead of drawing a glyph: bell, backspace, tab, linefeed and
    // carriage return. Shift those into printable range so the run stays a
    // solid block; every other control code draws its CP437 glyph, which is
    // exactly what a real screenful of executable looked like.
    if (b === 7 || b === 8 || b === 9 || b === 10 || b === 13) b = 32 + b;
    line += String.fromCharCode(b);
    if (line.length >= 78) {
      echo(line);
      line = '';
    }
  }
  if (line.length) echo(line);
}

// ============================================================
// FILESYSTEM COMMANDS — find
// Search the virtual FS for games (.exe launchers) and emulator
// menus (sub-directories), matching the query against the launcher
// name and against the human title parsed from each menu.bat.
// ============================================================
var FIND_CODE_COL = 11; // width of the leading launcher-name column
var FIND_INDENT = '             '; // 2 + FIND_CODE_COL spaces, for the path line

function find(query) {
  var raw = (query || '').trim();
  if (!raw) {
    echo('Usage:  find <word>');
    echo('        find "<two or more words>"');
    echo('Searches games and emulator menus by name or short code.');
    return;
  }
  if (raw.charAt(0) === '"') {
    if (raw.charAt(raw.length - 1) !== '"' || raw.length < 2) {
      echo('Unmatched quote.  Use: find "<text>"');
      return;
    }
    raw = raw.substr(1, raw.length - 2);
  } else if (/\s/.test(raw)) {
    echo('Multi-word searches must be quoted.  Use: find "' + raw + '"');
    return;
  }
  var q = raw.trim().toLowerCase();
  if (!q) {
    echo('Empty search.');
    return;
  }


  // One pass over node.files collecting:
  //   byNum:         { rowNumber -> title }      menu rows keyed by their N.
  //   launcherTitle: { launcher  -> title }      via the numbered .bat
  //   dirTitle:      { dirName   -> title }      via the numbered .bat
  // Menu rows look like:  echo <pad> º   N.  Title text        (year) º
  // The row number is the only stable key: the title may contain single
  // spaces ("Duke Nukem") and the trailing year is not part of it.
  // Each numbered .bat then says what row N actually does — `smb` runs a
  // launcher, `cd bbc` descends into a directory — which is what turns a
  // row's human title into a title for the thing it points at.
  function parseDir(node) {
    var byNum = {},
      numToLauncher = {},
      numToDir = {};
    for (var i = 0; i < node.files.length; i++) {
      var f = node.files[i];
      if (typeof f.data === 'undefined') continue;
      var lname = f.name.toLowerCase();
      if (lname === 'menu.bat') {
        var lines = f.data.split('\n');
        for (var j = 0; j < lines.length; j++) {
          // The echo is padded out to centre the box, so allow for that.
          var m = lines[j].match(/^echo\s+º\s+(\d+)\.\s+(.+?)\s*º\s*$/);
          if (!m || m[1] === '0') continue;
          // Collapse the column padding, but keep the trailing year: it is
          // what tells two "Demon Attack"s apart in the results.
          var title = m[2]
            .replace(/^\[GAMES\]\s*/i, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
          if (!title) continue;
          byNum[m[1]] = title;
        }
        continue;
      }
      var fbase = lname.split('.')[0];
      if (!/^\d+$/.test(fbase) || fbase === '0') continue;
      var dlines = f.data.split('\n');
      for (var l = 0; l < dlines.length; l++) {
        var line = dlines[l].trim();
        if (!line) continue;
        var bits = line.split(/\s+/);
        var tok = bits[0].toLowerCase();
        if (tok === 'echo' || tok === 'echo.' || tok === 'cls' || tok === 'menu')
          continue;
        // `cd bbc` — this row opens a sub-directory. `cd ..` goes back and
        // names nothing, so keep looking.
        if (tok === 'cd') {
          if (bits[1] && bits[1] !== '..' && !numToDir[fbase])
            numToDir[fbase] = bits[1].toLowerCase();
          continue;
        }
        numToLauncher[fbase] = tok;
        break;
      }
    }
    // Invert both maps into name -> title using the menu row each came from.
    var launcherTitle = {},
      dirTitle = {};
    for (var n in numToLauncher) {
      if (byNum[n]) launcherTitle[numToLauncher[n]] = byNum[n];
    }
    for (var dn in numToDir) {
      if (byNum[dn]) dirTitle[numToDir[dn]] = byNum[dn];
    }
    return {
      launcherTitle: launcherTitle,
      dirTitle: dirTitle,
    };
  }

  // Match `needle` (already lowercased) at a word boundary inside `hayLower`.
  // "nes" matches "NES" and "Nintendo Ent. System" but NOT "Cybernes".
  // Menu titles are stored as the font wants them, not as anyone would type
  // them: the sprite sheet is indexed by character code, so a CP437 glyph is
  // written as whatever character sits at that code. "Pokémon" holds char 130
  // and "Odyssey²" holds char 253. Folded back to plain letters here so that
  // `find pokemon` and `find "odyssey 2"` reach them; the displayed title is
  // untouched. Indexed from 128, covering CP437's accented-letter block.
  var CP437_FOLD =
    'cueaaaaceeeiiiaaeAAooouuyOU   f' + // 128-158, then 159 (ƒ)
    'aioun';                           // 160-164
  function searchable(str) {
    var outp = '';
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (code === 253) outp += '2'; // ² — the Odyssey² trick
      else if (code === 252) outp += 'n'; // ⁿ
      else if (code >= 128 && code - 128 < CP437_FOLD.length)
        outp += CP437_FOLD.charAt(code - 128);
      else outp += str.charAt(i);
    }
    return outp.toLowerCase();
  }

  function matchesOne(hayLower, needle) {
    var idx = hayLower.indexOf(needle);
    while (idx !== -1) {
      if (idx === 0 || /[^a-z0-9]/.test(hayLower.charAt(idx - 1))) return true;
      idx = hayLower.indexOf(needle, idx + 1);
    }
    return false;
  }

  // Also compared with the spaces taken out of both sides, so that a title
  // the font runs together ("Odyssey²") is still found by the spaced name
  // someone would actually type ("odyssey 2").
  function matches(hayLower, needle) {
    hayLower = searchable(hayLower);
    if (matchesOne(hayLower, needle)) return true;
    return matchesOne(hayLower.replace(/ /g, ''), needle.replace(/ /g, ''));
  }

  var games = [];
  var menus = [];

  function walk(node, currentPath) {
    var meta = parseDir(node);

    for (var i = 0; i < node.files.length; i++) {
      var f = node.files[i];
      if (typeof f.link === 'undefined') continue;
      var fname = f.name.toLowerCase();
      // Launchers are .exe (they carry a link); .bat is kept for the
      // numbered aliases and menus, which are not games.
      if (fname.indexOf('.exe') === -1) continue;
      var code = fname.split('.')[0];
      if (/^\d+$/.test(code)) continue;
      var title = meta.launcherTitle[code] || code.toUpperCase();
      if (matches(title.toLowerCase(), q) || matches(code, q)) {
        games.push({
          code: code.toUpperCase(),
          title: title,
          path: currentPath,
        });
      }
    }

    for (var di = 0; di < node.directories.length; di++) {
      var d = node.directories[di];
      var dcode = d.name.toLowerCase();
      var dtitle = meta.dirTitle[dcode] || d.name;
      if (matches(dtitle.toLowerCase(), q) || matches(dcode, q)) {
        menus.push({
          code: d.name,
          title: dtitle,
          path: currentPath,
        });
      }
      walk(d, currentPath + '\\' + d.name);
    }
  }

  walk(fs[0], 'C:');

  function printSection(label, items) {
    if (!items.length) return;
    echo(label + ' (' + items.length + ')');
    for (var i = 0; i < items.length; i++) {
      echo('  ' + pad(items[i].code, FIND_CODE_COL, true) + items[i].title);
      echo(FIND_INDENT + items[i].path);
    }
    echo('');
  }

  var total = games.length + menus.length;
  echo('');
  echo('Searching for "' + q + '"...');
  if (total === 0) {
    echo('No matches found.');
    echo('');
    return;
  }
  echo(total + ' match' + (total === 1 ? '' : 'es') + ' found.');
  echo('');
  printSection('GAMES', games);
  printSection('MENUS', menus);
}

// ============================================================
// COMMAND REGISTRY
// Commands are registered by name and dispatched via handleCmd.
// ============================================================
function registerCmd(name, method, replace) {
  if (typeof commands[name] !== 'undefined' && replace !== true) {
    console.log('command ' + name + ' already exists.');
  }
  commands[name] = {
    name: name,
    method: method,
  };
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

  if (ctxStack.length > 0) {
    ctxStack[ctxStack.length - 1].handleCmd(cmd);
    return;
  }

  if (!bEchoOff) {
    promptMode = true;
    document.onkeypress({
      keyCode: 13,
      stopPropagation: function () {},
      preventDefault: function () {},
    });
    promptMode = false;
  }

  cmdStack[cmdStack.length] = cmd;
  cmdStackIdx = cmdStack.length - 1;

  if (cmd == '' && !bEchoOff) echo('');
  if (cmd.charAt(1) == ':' && cmd.replace(' ', '').length == 2) {
    // Drive change (e.g. A:, D:). Only C: exists in this virtual FS;
    // anything else gets the canonical DOS "Drive not ready." reply
    // followed by a blank line and a fresh prompt.
    var drive = cmd.charAt(0).toUpperCase();
    if (drive !== 'C') {
      echo('Drive not ready.');
      echo('');
    }
    prompt();
    return;
  }

  // Dispatch to registered command handler.
  // Strip the separator space between the command name and its args once
  // here, so individual handlers can treat their input as a clean argstring.
  var c = cmd.toLowerCase().split(/ |\\|\.\\|\.\.|\//i)[0];
  if (typeof commands[c] !== 'undefined') {
    if (typeof commands[c].method === 'function') {
      var arg = cmd.substr(c.length);
      if (arg.charAt(0) === ' ') arg = arg.substr(1);
      if (commands[c].method(arg) !== false) prompt();
      return;
    }
  }

  // Try running a file, or print error
  if (cmd.replace(' ', '') != '') {
    var r = attemptExec(c);
    if (!r) echo('Bad command or file name');
    else if (r == 2) return;
  }
  prompt();
}
