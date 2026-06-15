//
// Copyright (c) 2012,2014 Thomas Skibo.
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
// pet2001.js
//
//      Container for cpu, hw, io.

function Pet2001(context) {
    var video = new Pet2001Video(context);
    var hw = new Pet2001hw(video);
    var cpu = new Cpu6502(hw);
    var romVers = 2;

    this.reset = function() {
        hw.reset();
        cpu.reset();
    }

    this.cycle = function(n) {
        while (n-- > 0) {
            hw.cycle();
            cpu.cycle();
        }
    }

    this.setRamSize = function(size) {
        hw.setRamsize(size);
        this.reset();
    }

    this.getRamSize = function() { return hw.getRamSize(); }

    this.setRomVers = function(vers) {
        romVers = vers;
        var romImage = (vers == 2) ? petRom2 : petRom1;
        hw.writeRom(ROM_ADDR, romImage, romImage.length);
        this.reset();
    }

    this.getRomVers = function() { return romVers; }

    this.setKeyrows = function(keyrows) {
        hw.setKeyrows(keyrows);
    }

    // Load a program into IEEE input buffer.
    this.ieeeLoadData = function(addr, bytes) {
        hw.ieeeLoadData(addr, bytes);
    }

    this.blankTimeoutFunc = function() {
        video.blankTimeoutFunc();
    }

    this.setRomVers(romVers);
    hw.reset();
    cpu.reset();
}
