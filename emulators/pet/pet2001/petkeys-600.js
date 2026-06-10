////////////////////////////
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

// petkeys.js
var petkeysDisable = false;
var keyrows = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

function petKeypress(col, row, shift) {
    // Press the key
    if ((col & 1) != 0)
        keyrows[row * 2 + 1] &= ~(1 << (col >> 1));
    else
        keyrows[row * 2] &= ~(1 << (col >> 1));

    // Press the left shift key if shift.
    if (shift)
        keyrows[8] &= 0xfe;

    // Space key is a double-wide and return is double-height
    if (row == 4 && col == 5)
        keyrows[8] &= 0xf7;
    else if (row == 4 && col == 6)
        keyrows[9] &= 0xfb;
    else if (row == 2 && col == 10)
        keyrows[6] &= 0xdf;
    else if (row == 3 && col == 10)
        keyrows[4] &= 0xdf;

    pet2001.setKeyrows(keyrows);
}

function petKeyrelease(col, row, shift) {
    // Release the key
    if ((col & 1) != 0)
        keyrows[row * 2 + 1] |= 1 << (col >> 1);
    else
        keyrows[row * 2] |= 1 << (col >> 1);

    // Release the left shift key if shift.
    if (shift)
        keyrows[8] |= 0x01;

    // Space key is a double-wide and return is double-height.
    if (row == 4 && col == 5)
        keyrows[8] |= 0x08;
    else if (row == 4 && col == 6)
        keyrows[9] |= 0x04;
    else if (row == 2 && col == 10)
        keyrows[6] |= 0x20;
    else if (row == 3 && col == 10)
        keyrows[4] |= 0x20;

    pet2001.setKeyrows(keyrows);
}

// Call this to clear all keys
//
function petkeyReleaseAll() {
    for (var i = 0; i < 10; i++)
        keyrows[i] = 0xff;

    pet2001.setKeyrows(keyrows);
}
//////////////////////////// Mouse Events /////////////////////////////////

// onMouseDown event handler.
//
function petkeyOnMouseDown(img, event) {
    var x, y;
    if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
    }
    else {
        x = event.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    x -= img.offsetLeft;
    y -= img.offsetTop;
    if (((x >= (13*0.75) && x < (547*0.75)) || (x >= (594*0.75) && x < (788*0.75))) &&
        (y >= (13*0.75) && y < (257*0.75))) {
        var col = Math.floor((x - (13*0.75)) / (48.5*0.75));
        var row = Math.floor((y - (13*0.75)) / (48.5*0.75));
        petKeypress(col, row, event.shiftKey);
    }
}

function petkeyOnMouseUp(img, event) {
    petkeyReleaseAll();
}

////////////////////////////// Touch events ///////////////////////////////
document.addEventListener('touchstart', function (event) {
    var touch = event.touches[0];
    var petkey = document.getElementById('petkey');
    var x = touch.pageX - petkey.offsetLeft;
    var y = touch.pageY - petkey.offsetTop;
    // console.log("onTouchStart() called! x=%d y=%d", x, y);

    if (((x >= (13*0.75) && x < (547*0.75)) || (x >= (594*0.75) && x < (788*0.75))) &&
        (y >= (13*0.75) && y < (257*0.75))) {
        col = Math.floor((x - (13*0.75)) / (48.5*0.75));
        row = Math.floor((y - (13*0.75)) / (48.5*0.75));
        petKeypress(col, row, false);
    }
}, false);

document.addEventListener('touchmove', function (event) {
    var touch = event.touches[0];
    var petkey = document.getElementById('petkey');
    var x = touch.pageX - petkey.offsetLeft;
    var y = touch.pageY - petkey.offsetTop;
    //console.log("onTouchMove() called! x=%d y=%d", x, y);

    // XXX: punt for now.
}, false);

document.addEventListener('touchend', function (event) {
    var touch = event.touches[0];
    var petkey = document.getElementById('petkey');
    var x = touch.pageX - petkey.offsetLeft;
    var y = touch.pageY - petkey.offsetTop;
    //console.log("onTouchEnd() called! x=%d y=%d", x, y);

    if (((x >= (13*0.75) && x < (547*0.75)) || (x >= (594*0.75) && x < (788*0.75))) &&
        (y >= (13*0.75) && y < (257*0.75))) {
        col = Math.floor((x - (13*0.75)) / (48.5*0.75));
        row = Math.floor((y - (13*0.75)) / (48.5*0.75));
        petKeyrelease(col, row, false);
    }
}, false);

///////////////////////////// Keyboard events ////////////////////////////

var ascii_to_pet_row = [
        -1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,3,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        4,0,0,0,0,0,0,0,0,0,2,3,3,4,4,1,
        4,3,3,3,2,2,2,1,1,1,2,3,4,4,4,3,
        4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,0,4,-1,-1,
        -1,2,3,3,2,1,2,2,2,1,2,2,2,3,3,1,
        1,1,1,2,1,1,3,1,3,1,3,-1,-1,-1,-1,-1,
];
var ascii_to_pet_col = [
        -1,-1,-1,-1,-1,-1,-1,-1,15,-1,-1,-1,-1,10,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        6,0,1,2,3,4,6,5,8,9,15,15,7,14,13,15,
        12,12,13,14,12,13,14,12,13,14,9,8,7,15,8,9,
        2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,7,4,-1,-1,
        -1,0,4,2,2,2,3,4,5,7,6,7,8,6,5,8,
        9,0,3,1,4,6,3,1,1,5,0,-1,-1,-1,-1,-1,
];

var petkeyKeypressTimeoutHandle = null;
var petkeyKeypressTimeoutTime = 50;
var petkeyKeyQueue = [];

function petkeyKeypressTimeout() {
    petkeyReleaseAll();

    // Are there queued keypresses?  Press and set another timeout.
    if (petkeyKeyQueue.length > 0) {
        var code = petkeyKeyQueue.shift();
        if (code != 0)
            petKeypress(ascii_to_pet_col[code],
                        ascii_to_pet_row[code], false);

        petkeyKeypressTimeoutHandle =
            setTimeout("petkeyKeypressTimeout()", petkeyKeypressTimeoutTime);
    }
    else
        petkeyKeypressTimeoutHandle = null;
}

// onKeyPress event handler.
//
function petkeyOnKeyPress(event) {

    if (petkeysDisable || event.metaKey || event.ctrlKey || event.altKey)
        return true;

    var code = event.charCode != 0 ? event.charCode : event.keyCode;
    // console.log("petkeyOnKeyPress(): code=%d", code);

    if (code > 0 && code < 128 && ascii_to_pet_row[code] >= 0) {
        // Is another key already being held?
        if (petkeyKeypressTimeoutHandle == null) {
            // No.  Press key and set timeout.
            petKeypress(ascii_to_pet_col[code],
                        ascii_to_pet_row[code], false);

            petkeyKeypressTimeoutHandle =
                setTimeout("petkeyKeypressTimeout()",
                           petkeyKeypressTimeoutTime);
        }
        else {
            // Yes.  Queue a "blank" to and then the keypress.  The
            // "blank" releases the previous key and is needed when you
            // are pressing the same key again.  Sometimes, it seems the
            // PET needs it even if you aren't pressing the the same key
            // again so I don't bother comparing with the previous key.
            //
            petkeyKeyQueue.push(0);
            petkeyKeyQueue.push(code);
        }
    }

    return false;
}

function petkeyOnKeyDown(event) {
    var code = event.charCode != 0 ? event.charCode : event.keyCode;
    // console.log("petkeyOnKeyDown(): code=%d", code);

    // This is a hack to take back control of backspace key.
    if (code == 8) {
	petkeyOnKeyPress(event);
	return false;
    }

    return true;
}