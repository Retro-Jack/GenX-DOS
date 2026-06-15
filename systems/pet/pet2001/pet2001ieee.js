//
// Copyright (c) 2015 Thomas Skibo.
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

// pet2001ieee.js
function PetIEEE(_hw) {
    var hw = _hw;

    // State machine
    var STATE_IDLE = 0,
    	STATE_LISTEN = 1,
    	STATE_FNAME = 2,
    	STATE_LOAD = 3,
        STATE_SAVE = 4,
        STATE_SAVE1 = 5;
    var state = STATE_IDLE;

    // signals
    var	dio = 0x00,
	ndac_i = true,
    	ndac_o = true,
    	nrfd_i = true,
    	nrfd_o = true,
    	atn = true,
    	dav_i = true,
    	dav_o = true,
    	srq = true,
    	eoi_i = true;
    	eoi_o = true;

    var MY_ADDRESS = 8;
    var filename;
    var oldRom = false;

    var load_data = [ 0x01, 0x04, 0x0a, 0x04, 0x64, 0x00, 0x8f,
                      0x20, 0x48, 0x49, 0x00, 0x00, 0x00 ];
    var data_index;
    var save_data;

    this.ieeeLoadData = function(addr, bytes) {
        load_data = [ addr & 0xff, addr >> 8 ].concat(bytes);
    }

    function dataIn(d8) {
        // console.log("Data: " + d8.toString(16) + " ATN: " +
        //           atn.toString() + " EOI: " + (eoi_i && eoi_o).toString());
        if (!atn) {
            switch (state) {
            case STATE_IDLE:
                if (d8 == 0x20 + MY_ADDRESS)
                    state = STATE_LISTEN;
                else if (d8 == 0x40 + MY_ADDRESS) {
                    oldRom = false;
                    state = STATE_LOAD;
                }
                else if (d8 == 0x7f && filename.length > 0 &&
                         load_data.length > 2) {
                    // Old PET ROMs LOAD.
                    // Assume program starts at either 0x0400 or 0x0401.
                    data_index = load_data[0] == 0 ? 2 : 1;

                    // Put first data on bus.
                    dio = load_data[data_index] ^ 0xff;
                    dav_i = false;

                    oldRom = true;
                    state = STATE_LOAD;
                }
                else if (d8 == 0x3f && filename.length > 0) {
                    // Old PET ROMs SAVE.
                    oldRom = true;
                    save_data = "";
                    state = STATE_SAVE1;
                }
                break;
            case STATE_LISTEN:
                // UNListen
                if (d8 == 0x3f)
                    state = STATE_IDLE;
                // LOAD or SAVE
                else if (d8 == 0xf0 || d8 == 0xf1) {
                    filename = "";
                    data_index = 0;
                    state = STATE_FNAME;
                }
                else if (d8 == 0x61) {
                    save_data = "";
                    state = STATE_SAVE;
                }
                break;
            case STATE_FNAME:
                // UNListen
                if (d8 == 0x3f)
                    state = STATE_IDLE;
                break;
            case STATE_LOAD:
                // UNTalk
                if (d8 == 0x5f)
                    state = STATE_IDLE;
                break;
            case STATE_SAVE:
                // UNListen
                if (d8 == 0x3f) {
                    saveFile(filename, save_data);
                    state = STATE_IDLE;
                }
                break;
            case STATE_SAVE1:
                if (eoi_o) {
                    // Data comes with ATN low in old ROMs.
                    save_data += String.fromCharCode(d8);
                    data_index++;
                    // console.log("Save Data: " + d8.toString(16));
                }
                else {
                    // Ignore last byte.
                    // console.log("Save EOI");
                    save_data = String.fromCharCode(0) +
                        String.fromCharCode(4) + save_data;
                    saveFile(filename, save_data);
                    oldRom = false;
                    state = STATE_IDLE;
                }
            }
        }
        else {
            switch (state) {
            case STATE_FNAME:
                filename += String.fromCharCode(d8);
                // if (!eoi_o)
                //    console.log("Filename: " + filename);
                break;
            case STATE_SAVE:
                save_data += String.fromCharCode(d8);
                data_index++;
                // console.log("Save Data: " + d8.toString(16));
                // if (!eoi_o)
                //   console.log("Save EOI");
                break;
            }
        }
    }

    this.reset = function() {
        state = STATE_IDLE;
        filename = "";
        save_data = "";
        oldRom = false;
        data_index = 0;
    }

    this.DIOout = function (d8) {
        // if (dio != d8)
        //   console.log("PetIEEE.DIOout: ", d8);
        dio = d8;
    }

    this.DIOin = function() {
        // console.log("PetIEEE.DIOin: ", dio);
        return dio;
    }

    this.NDACin = function() {
        // console.log("PetIEEE.NDACin");
        return ndac_i && ndac_o;
    }

    this.NDACout = function(flag) {
        // if (ndac_o != flag)
        //    console.log("PetIEEE.NDACout: ", flag);
        if (!ndac_o && flag) {
            // Positive transition of NDAC.  Data acknowledged.
            if (state == STATE_LOAD) {
                dav_i = true;
                eoi_i = true;
                data_index++;
                if (oldRom && data_index == load_data.length) {
                    alert("Load completed.  You must hit STOP.");
                    state = STATE_IDLE;
                }
            }
        }
        ndac_o = flag;
    }

    this.NRFDin = function() {
        // console.log("PetIEEE.NRFDin");
        return nrfd_i && nrfd_o;
    }

    this.NRFDout = function(flag) {
        // if (nrfd_o != flag)
        //    console.log("PetIEEE.NRFDout: ", flag);
        if (!nrfd_o && flag) {
            // Positive transition of NRFD.  Put data on bus.
            if (state == STATE_LOAD && data_index < load_data.length) {
                dio = load_data[data_index] ^ 0xff;
                dav_i = false;
                // console.log("LoadData: " + (dio ^ 0xff).toString(16));
                if (data_index == load_data.length - 1) {
                    // console.log("LoadData EOI");
                    eoi_i = false;
                }
            }
        }
        nrfd_o = flag;
    }

    this.EOIin = function() {
        // console.log("PetIEEE.EOIin");
        return eoi_i && eoi_o;
    }

    this.EOIout = function(flag) {
        // if (eoi_o != flag)
        //    console.log("PetIEEE.EOIout: ", flag);
        eoi_o = flag;
    }

    this.ATNout = function(flag) {
        // if (atn != flag)
        //    console.log("PetIEEE.ATNout: ", flag);
        if (atn && !flag) {
            // Negative transition of ATN
            ndac_i = false;
        }
        else if (!atn && flag) {
            // Positive transition of ATN
            if (state == STATE_LOAD && nrfd_o) {
                // Put first data on bus.
                dio = load_data[0] ^ 0xff;
                dav_i = false;
            }
        }
        atn = flag;
    }

    this.DAVout = function(flag) {
        // if (dav_o != flag)
        //   console.log("PetIEEE.DAVout: ", flag);
        if (dav_o && !flag) {
            // Negative transition of DAV.
            ndac_i = true;
            nrfd_i = false;
            dataIn(dio ^ 0xff);
        }
        else if (!dav_o && flag) {
            // Positive transition of DAV.
            ndac_i = false;
            nrfd_i = true;
        }
        dav_o = flag;
    }

    this.DAVin = function() {
        // console.log("PetIEEE.DAVin");
        return dav_i && dav_o;
    }

    this.SRQin = function() {
        // console.log("PetIEEE.SRQin");
        return srq;
    }
}
