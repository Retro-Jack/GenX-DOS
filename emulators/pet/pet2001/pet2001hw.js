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

// pet2001hw.js

var     VIDRAM_ADDR =   0x8000,
        VIDRAM_SIZE =   0x0400,
        IO_ADDR =       0xe800,
        IO_SIZE =       0x0800,
        ROM_ADDR =      0xC000,
        ROM_SIZE =      0x3800,
        MAX_RAM_SIZE =  0x8000;


// Memory and signal interface for cpu6502.  If I wanted to bother,
// I'd have a parent abstract class called Hardware which only had
// read(), write(), reset(), cycle(), irq_signal, and nmi_signal.
//
function Pet2001hw(vid) {
    var ram = new Array(MAX_RAM_SIZE);
    var rom = new Array(ROM_SIZE);
    var ramsize = 8192;
    var video = vid;
    var io = new PetIO(this, video);

    this.irq_signal = 0;
    this.nmi_signal = 0;

    this.reset = function() {
        io.reset();
        this.irq_signal = 0;
        this.nmi_signal = 0;

        for (var i = 0; i < MAX_RAM_SIZE; i++)
            ram[i] = 0x44;
    }

    this.cycle = function() {
        io.cycle();
    }

    this.getRamSize = function() { return ramsize; }

    this.setKeyrows = function(rows) {
        io.setKeyrows(rows);
    }

    this.writeRom = function(addr, romdata, len) {
        for (var i = 0; i < len; i++) {
            if (addr > IO_ADDR)
                rom[addr - ROM_ADDR - IO_SIZE + i] = romdata[i];
            else
                rom[addr - ROM_ADDR + i] = romdata[i];
        }
    }

    this.readRam = function(addr, data, len) {
        for (var i = 0; i < len; i++)
            data[i] = ram[addr + i];
    }

    this.writeRam = function(addr, data, len) {
        for (var i = 0; i < len; i++)
            ram[addr + i] = data[i];
    }

    this.setRamsize = function(size) {
        ramsize = size;
    }

    this.ieeeLoadData = function(addr, bytes) {
        io.ieeeLoadData(addr, bytes);
    }

    this.read = function(addr) {
        var d8;

        if (addr < ramsize)
            d8 = ram[addr];
        else if (addr >= ROM_ADDR && addr < IO_ADDR)
            d8 = rom[addr - ROM_ADDR];
        else if (addr >= IO_ADDR + IO_SIZE)
            d8 = rom[addr - ROM_ADDR - IO_SIZE];
        else if (addr >= VIDRAM_ADDR && addr < VIDRAM_ADDR + VIDRAM_SIZE)
            d8 = video.vidram[addr - VIDRAM_ADDR];
        else if (addr >= IO_ADDR && addr < IO_ADDR + IO_SIZE)
            d8 = io.read(addr - IO_ADDR);
        else
            d8 = 0x55;

        //    console.log("Pet2001hw.read(): %s %s",
        //              addr.toString(16), d8.toString(16));

        return d8;
    }

    this.write = function(addr, d8) {
        //    console.log("Pet2001hw.write(): %s %s",
        //              addr.toString(16), d8.toString(16));
        // if (d8 < 0 || d8 > 0xff)
        //      console.err("Pet2001hw.write() d8 too big!");

        if (addr < ramsize)
            ram[addr] = d8;
        else if (addr >= VIDRAM_ADDR && addr < VIDRAM_ADDR + VIDRAM_SIZE)
            video.write(addr - VIDRAM_ADDR, d8);
        else if (addr >= IO_ADDR && addr < IO_ADDR + IO_SIZE)
            io.write(addr - IO_ADDR, d8);
    }
}
