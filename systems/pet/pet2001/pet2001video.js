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

function Pet2001Video(context) {
    this.vidram = new Array(VIDRAM_SIZE);

    var ctx = context;
    var charset = petCharRom1;
    var textMode = false;   // true while the PET shows its lower/upper case set
    var newCharRom = false; // use the later character ROM's text set
    var blank = false;

    // Draw a character from character ROM to canvas.
    function drawChar(addr, d8) {
        // Determine location from video memory address (offset)
        var col = addr % 40;
        var row = Math.floor(addr / 40);

        // Black-out entire character
        ctx.fillStyle = "#000000";
        ctx.fillRect(col * 16, row * 16, 16, 16);

        // Color for "white" pixels
        ctx.fillStyle = "#60d0a0";

        for (var y = 0; y < 8; y++) {
            var bits = charset[(d8 & 0x7f) * 8 + y];

            // Inverse?
            if ((d8 & 0x80) != 0)
                bits ^= 0xff;

            for (var x = 0; x < 8; x++) {
                if ((bits & 0x80) != 0)
                    ctx.fillRect(col * 16 + x * 2, row * 16 + y * 2, 2, 2);
                bits <<= 1;
            }
        }
    }

    // Redraw entire screen after removing blanking or changing char set.
    function redrawScreen(vidram) {
        for (var addr = 0; addr < 1000; addr++)
            drawChar(addr, vidram[addr]);
    }

    // Blank screen
    function blankScreen() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 640, 400);
    }

    // Write to video ram.
    this.write = function(addr, d8) {
        this.vidram[addr] = d8;
        if (addr < 1000 && !blank)
            drawChar(addr, d8);
    }

    var blankTimeout = null;
    
    this.blankTimeoutFunc = function() {
        // console.log("screen blank time-out called");
        blankScreen();
        blankTimeout = null;
    }

    // Called in response to change in blanking signal.
    // Blanking of the screen is delayed by 100ms to avoid flickering
    // during scrolling.
    this.setVideoBlank = function(flag) {
        if (flag && !blank) {
            if (!blankTimeout)
                blankTimeout = setTimeout(function () { blankTimeoutFunc(); }, 100);
            blank = true;
        }
        else if (blank && !flag) {
            if (blankTimeout) {
                clearTimeout(blankTimeout);
                blankTimeout = null;
            }
            redrawScreen(this.vidram);
            blank = false;
        }
    }

    // Called in response to character set signal change.
    this.setCharset = function(flag) {
        textMode = flag;
        charset = flag ? (newCharRom ? petCharRom3 : petCharRom2) : petCharRom1;
        redrawScreen(this.vidram);
    }

    // Choose which character ROM's text set to show: false for the original
    // PET 2001 ROM, true for the later one. Takes effect at once if the
    // screen is already in text mode.
    this.setNewCharRom = function(flag) {
        newCharRom = flag;
        this.setCharset(textMode);
    }
}
