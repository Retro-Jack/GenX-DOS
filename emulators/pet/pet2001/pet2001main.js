//
// Copyright (c) 2014 Thomas Skibo.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY AUTHOR AND CONTRIBUTORS ``AS IS'' AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED.  IN NO EVENT SHALL AUTHOR OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
// OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
// OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
// SUCH DAMAGE.
//

// pet2001main.js
//
// Javascript in <body>.

var petContext = document.getElementById('petscreen').getContext("2d");
var pet2001 = new Pet2001(petContext);
var petIntervalTime = 50;
var extraCycles = 0;

window.onkeydown = petkeyOnKeyDown;
window.onkeypress = petkeyOnKeyPress;

function petIntervalFunc() {
    pet2001.cycle(1000 * petIntervalTime);
}

var petIntervalHandle = window.setInterval("petIntervalFunc()",
                                           petIntervalTime);

function resetButton() {
    pet2001.reset();
}

function pauseButton() {
    if (petIntervalHandle != null) {
        window.clearInterval(petIntervalHandle);
        petIntervalHandle = null;
        document.getElementById('pausebutton').value = 'Resume';
    }
    else {
        petIntervalHandle = window.setInterval("petIntervalFunc()",
                                               petIntervalTime);
        document.getElementById('pausebutton').value = 'Pause ';
    }
}

function romSelection() {
    var vers = document.getElementById('romselection').value;
    pet2001.setRomVers(vers);
}

function ramsizeSelection() {
    var size = document.getElementById('ramselection').value;
    pet2001.setRamSize(size * 1024);
}

function loadFile() {
    var file = document.getElementById('loadfile').files[0];

    if (!file)
        return;

    var fread = new FileReader();
    fread.readAsArrayBuffer(file);
    fread.onload = function(levent) {
        var data = new DataView(levent.target.result);
        var size = levent.target.result.byteLength;
        var addr = data.getUint8(0) + data.getUint8(1) * 256;

        var bytes = Array(size - 2);
        for (var i = 0; i < size - 2; i++)
            bytes[i] = data.getUint8(i + 2);

        pet2001.ieeeLoadData(addr, bytes);
    }
}

function saveFile(filename, data) {
    console.log("saveFile: %s", filename);

    var foo = window.document.createElement('a');
    foo.href = "data:application/octet-stream;base64," + btoa(data);
    foo.download = filename + ".prg";
    document.body.appendChild(foo);
    foo.click();
    document.body.removeChild(foo);
}

function blankTimeoutFunc() {
    pet2001.blankTimeoutFunc();
}
