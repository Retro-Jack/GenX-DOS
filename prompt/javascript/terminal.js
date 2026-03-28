// Simulate typing a string into the prompt
function enterCmd(d) {
    for (var i = 0; i < d.length; i++) {
        if (d.charAt(i) == '\n')
            document.onkeypress({ keyCode: 13, stopPropagation: function() {}, preventDefault: function() {} });
        else
            document.onkeypress({ keyCode: d.charCodeAt(i), stopPropagation: function() {}, preventDefault: function() {} });
    }
}

// Execute a multi-line batch script string line by line
function executeBatch(d) {
    var cmds = d.split('\n');
    for (var i = 0; i < cmds.length; i++) {
        if (cmds[i].length > 0) handleCmd(cmds[i]);
    }
    bEchoOff = false; // always restore echo after a batch
}

// ============================================================
// PROMPT & DISPLAY
// ============================================================

// Print the current drive/path prompt (e.g. C:\>), or a custom string
function prompt(txt) {
    if (bEchoOff) return;
    if (typeof txt === 'undefined') {
        var strPrompt = "";
        strPrompt += fs[path[0]].name + ':\\';
        var fsc = fs[path[0]].directories;
        for (var i = 1; i < path.length; i++) {
            strPrompt += fsc[path[i]].name;
            if (i < path.length - 1) strPrompt += '\\';
            fsc = fsc[path[i]].directories;
        }
        strPrompt = strPrompt.toUpperCase() + '>';
    } else {
        strPrompt = txt;
    }
    promptMode = true;
    for (var i = 0; i < strPrompt.length; i++) {
        document.onkeypress({ keyCode: strPrompt.charCodeAt(i), stopPropagation: function() {}, preventDefault: function() {} });
    }
    promptMode = false;
}

// Print a string to the terminal, wrapping at 80 columns
function echo(str) {
    promptMode = true;
    var offset = 0;
    for (var i = 0; i < str.length; i++) {
        if ((i - offset) % 80 == 0 && i != 0)
            document.onkeypress({ keyCode: 13, stopPropagation: function() {}, preventDefault: function() {} });
        if (str.charAt(i) == '\n') {
            document.onkeypress({ keyCode: 13, stopPropagation: function() {}, preventDefault: function() {} });
            offset = i % 80;
        } else {
            document.onkeypress({ keyCode: str.charCodeAt(i), stopPropagation: function() {}, preventDefault: function() {} });
        }
    }
    document.onkeypress({ keyCode: 13, stopPropagation: function() {}, preventDefault: function() {} });
    promptMode = false;
}

// Right- or left-pad a string to a given length
function pad(str, len, right) {
    var strP = '';
    for (var i = 0; i < len - str.length; i++) strP += ' ';
    if (right) return str + strP;
    return strP + str;
}
