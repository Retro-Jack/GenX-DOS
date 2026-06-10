//
// Copyright (c) 2012,2014,2020 Thomas Skibo. <thomas@skibo.net>
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

// pet2001io.c
//
//      This is the hard part: modeling the PET hardware.  I first did this
//      in Verilog, then C, and now Javascript.
//

function PetIO(_hw, vid) {
    var PIA1_PA  =      0x10,
        PIA1_CRA =      0x11,
        PIA1_PB  =      0x12,
        PIA1_CRB =      0x13,

        PIA2_PA  =      0x20,
        PIA2_CRA =      0x21,
        PIA2_PB  =      0x22,
        PIA2_CRB =      0x23,

        VIA_DRB  =      0x40,
        VIA_DRA  =      0x41,
        VIA_DDRB =      0x42,
        VIA_DDRA =      0x43,
        VIA_T1CL =      0x44,
        VIA_T1CH =      0x45,
        VIA_T1LL =      0x46,
        VIA_T1LH =      0x47,
        VIA_T2CL =      0x48,
        VIA_T2CH =      0x49,
        VIA_SR   =      0x4a,
        VIA_ACR  =      0x4b,
        VIA_PCR  =      0x4c,
        VIA_IFR  =      0x4d,
        VIA_IER  =      0x4e,
        VIA_ANH  =      0x4f;

    var hw = _hw;
    var video = vid;
    var ieee = new PetIEEE(hw);
    var keyrow = new Array(10);

    var i;
    for (i = 0; i < 10; i++)
        keyrow[i] = 0xff;

    var pia1_pa_in =    0xf0;
    var pia1_pa_out =   0;
    var pia1_ddra =     0;
    var pia1_cra =      0;
    var pia1_pb_in =    0xff;
    var pia1_pb_out =   0;
    var pia1_ddrb =     0;
    var pia1_crb =      0;
    var pia1_ca2 =      0;
    var pia1_cb1 =      0;

    var pia2_pa_in =    0;
    var pia2_pa_out =   0;
    var pia2_ddra =     0;
    var pia2_cra =      0;
    var pia2_pb_in =    0;
    var pia2_pb_out =   0;
    var pia2_ddrb =     0;
    var pia2_crb =      0;

    var via_drb_in =    0;
    var via_drb_out =   0;
    var via_dra_in =    0;
    var via_dra_out =   0;
    var via_ddrb =      0;
    var via_ddra =      0;
    var via_t1cl =      0xff;
    var via_t1ch =      0xff;
    var via_t1_1shot =  0;
    var via_t1_undf =   0;
    var via_t1ll =      0xff;
    var via_t1lh =      0xff;
    var via_t2ll =      0xff;
    var via_t2cl =      0xff;
    var via_t2ch =      0xff;
    var via_t2_1shot =  0;
    var via_t2_undf =   0;
    var via_sr =        0;
    var via_sr_cntr =   0;
    var via_sr_start =  0;
    var via_acr =       0;
    var via_pcr =       0;
    var via_ifr =       0;
    var via_ier =       0x80;

    var via_cb1 =       1;
    var via_cb2 =       1;

    var video_cycle =   0;

    this.reset = function() {
        var i;
        for (i = 0; i < 10; i++)
            keyrow[i] = 0xff;

        pia1_pa_in =    0xf0;
        pia1_pa_out =   0;
        pia1_ddra =     0;
        pia1_cra =      0;
        pia1_pb_in =    0xff;
        pia1_pb_out =   0;
        pia1_ddrb =     0;
        pia1_crb =      0;
        pia1_ca2 =      0;
        pia1_cb1 =      0;

        pia2_pa_in =    0;
        pia2_pa_out =   0;
        pia2_ddra =     0;
        pia2_cra =      0;
        pia2_pb_in =    0;
        pia2_pb_out =   0;
        pia2_ddrb =     0;
        pia2_crb =      0;

        via_drb_in =    0;
        via_drb_out =   0;
        via_dra_in =    0;
        via_dra_out =   0;
        via_ddrb =      0;
        via_ddra =      0;
        via_t1cl =      0xff;
        via_t1ch =      0xff;
        via_t1_1shot =  0;
        var_t1_undf =   0;
        via_t1ll =      0xff;
        via_t1lh =      0xff;
        via_t2ll =      0xff;
        via_t2cl =      0xff;
        via_t2ch =      0xff;
        via_t2_1shot =  0;
        via_t2_undf =   0;
        via_sr =        0;
        via_sr_cntr =   0;
        via_sr_start =  0;
        via_acr =       0;
        via_pcr =       0;
        via_ifr =       0;
        via_ier =       0x80;

        via_cb1 =       1;
        via_cb2 =       1;

        video_cycle =   0;

        ieee.reset();
    }

    // Update the IRQ level based upon PIA and VIA.
    this.updateIrq = function() {
        var irq = 0;

        if ((pia1_cra & 0x81) == 0x81 || (pia1_cra & 0x48) == 0x48 ||
            (pia1_crb & 0x81) == 0x81 || (pia1_crb & 0x48) == 0x48)
            irq = 1;
        if ((via_ifr & via_ier & 0x7f) != 0) {
            via_ifr |= 0x80;
            irq = 1;
        }
        else
            via_ifr &= ~0x80;

        hw.irq_signal = irq;
    }

    this.setKeyrows = function(rows) {
        for (var i = 0; i < 10; i++)
            keyrow[i] = rows[i];

        // Update pia1_pb.
        if ((pia1_pa_out & 15) < 10)
            pia1_pb_in = keyrow[pia1_pa_out & 15];
        else
            pia1_pb_in = 0xff;
    }

    this.sync = function(sig) {
        // SYNC signal is wired to PIA1.CB1 and VIA.PB[5]
        if (sig != pia1_cb1) {
            if (((pia1_crb & 0x02) != 0 && sig) ||
                ((pia1_crb & 0x02) == 0 && !sig)) {
                pia1_crb |= 0x80;
                if ((pia1_crb & 0x01) != 0)
                    this.updateIrq();
            }
            pia1_cb1 = sig;
        }

        /* Set/clr VIA.PB[5] */
        via_drb_in = sig ? (via_drb_in | 0x20) :
            (via_drb_in & ~0x20);
    }

    this.read = function(addr) {
        switch (addr) {
        case PIA1_PA:
            if ((pia1_cra & 0x04) != 0) {
                /* Clear IRQs in CRA as side-effect of reading PA. */
                if ((pia1_cra & 0xC0) != 0) {
                    pia1_cra &= 0x3F;
                    this.updateIrq();
                }
                if ((pia1_ddra & 0x40) == 0) {
                    if (ieee.EOIin())
                        pia1_pa_in |= 0x40;
                    else
                        pia1_pa_in &= 0xbf;
                }
                return (pia1_pa_in & ~pia1_ddra) |
                    (pia1_pa_out & pia1_ddra);
            }
            else
                return pia1_ddra;
        case PIA1_CRA:
            return pia1_cra;
        case PIA1_PB:
            if ((pia1_crb & 0x04) != 0) {
                /* Clear IRQs in CRB as side-effect of reading PB. */
                if ((pia1_crb & 0xC0) != 0) {
                    pia1_crb &= 0x3F;
                    this.updateIrq();
                }
                return (pia1_pb_in & ~pia1_ddrb) |
                    (pia1_pb_out & pia1_ddrb);
            }
            else
                return pia1_ddrb;
        case PIA1_CRB:
            return pia1_crb;

        case PIA2_PA:
            if ((pia2_cra & 0x04) != 0) {
                /* Clear IRQs in CRA as side-effect of reading PA. */
                if ((pia2_cra & 0xC0) != 0) {
                    pia2_cra &= 0x3F;
                    this.updateIrq();
                }
                if (pia2_ddra == 0)
                    pia2_pa_in = ieee.DIOin();
                return (pia2_pa_in & ~pia2_ddra) |
                    (pia2_pa_out & pia2_ddra);
            }
            else
                return pia2_ddra;
        case PIA2_CRA:
            return pia2_cra;
        case PIA2_PB:
            if ((pia2_crb & 0x04) != 0) {
                /* Clear IRQs in CRB as side-effect of reading PB. */
                if ((pia2_crb & 0x3F) != 0) {
                    pia2_crb &= 0x3F;
                    this.updateIrq();
                }
                return (pia2_pb_in & ~pia2_ddrb) |
                    (pia2_pb_out & pia2_ddrb);
            }
            else
                return pia2_ddrb;
        case PIA2_CRB:
            if (ieee.SRQin())
                pia2_crb |= 0x80;
            else
                pia2_crb &= 0x7f;
            return pia2_crb;

        case VIA_DRB:
            /* Clear CB2 interrupt flag IFR3 (if not "independent"
             * interrupt)
             */
            if ((via_pcr & 0xa0) != 0x20) {
                if ((via_ifr & 0x08) != 0) {
                    via_ifr &= ~0x08;
                    if ((via_ier & 0x08) != 0)
                        this.updateIrq();
                }
            }
            /* Clear CB1 interrupt flag IFR4 */
            if ((via_ifr & 0x10) != 0) {
                via_ifr &= ~0x10;
                if ((via_ier & 0x10) != 0)
                    this.updateIrq();
            }
            if ((via_ddrb & 0x80) == 0) {
                if (ieee.DAVin())
                    via_drb_in |= 0x80;
                else
                    via_drb_in &= 0x7f;
            }
            if ((via_ddrb & 0x40) == 0) {
                if (ieee.NRFDin())
                    via_drb_in |= 0x40;
                else
                    via_drb_in &= 0xbf;
            }
            if ((via_ddrb & 0x01) == 0) {
                if (ieee.NDACin())
                    via_drb_in |= 0x01;
                else
                    via_drb_in &= 0xfe;
            }
            return (via_drb_in & ~via_ddrb) |
                (via_drb_out & via_ddrb);
        case VIA_DRA:
            /* Clear CA2 interrupt flag IFR0 (if not "independent"
             * interrupt)
             */
            if ((via_pcr & 0x0a) != 0x02) {
                if ((via_ifr & 0x01) != 0) {
                    via_ifr &= ~0x01;
                    if ((via_ier & 0x01) != 0)
                        this.updateIrq();
                }
            }

            /* Clear CA1 interrupt flag IFR1 */
            if ((via_ifr & 0x02) != 0) {
                via_ifr &= ~0x02;
                if ((via_ier & 0x02) != 0)
                    this.updateIrq();
            }
            return (via_dra_in & ~via_ddra) |
                (via_dra_out & via_ddra);
        case VIA_DDRB:
            return via_ddrb;
        case VIA_DDRA:
            return via_ddra;
        case VIA_T1CL:
            /* Clear T1 interrupt flag IFR6 as side-effect of read T1CL. */
            if ((via_ifr & 0x40) != 0) {
                via_ifr &= ~0x40;
                if ((via_ier & 0x40) != 0)
                    this.updateIrq();
            }
            return via_t1cl;
        case VIA_T1CH:
            return via_t1ch;
        case VIA_T1LL:
            return via_t1ll;
        case VIA_T1LH:
            return via_t1lh;
        case VIA_T2CL:
            /* Clear T2 interrupt flag IFR5 as side-effect of reading T2CL */
            if ((via_ifr & 0x20) != 0) {
                via_ifr &= ~0x20;
                if ((via_ier & 0x20) != 0)
                    this.updateIrq();
            }
            return via_t2cl;
        case VIA_T2CH:
            return via_t2ch;
        case VIA_SR:
            /* Clear SR int flag IFR2 */
            if ((via_ifr & 0x04) != 0) {
                via_ifr &= ~0x04;
                if ((via_ier & 0x04) != 0)
                    this.updateIrq();
            }
            /* Start SR counter. */
            if ((via_acr & 0x1c) != 0 && via_sr_cntr == 0)
                via_sr_start = 1;
            return via_sr;
        case VIA_ACR:
            return via_acr;
        case VIA_PCR:
            return via_pcr;
        case VIA_IFR:
            return via_ifr;
        case VIA_IER:
            return via_ier;
        case VIA_ANH:
            /* VIA_PA with no handshake. */
            return (via_dra_in & ~via_ddra) |
                (via_dra_out & via_ddra);
        }

        return 0;
    } // read()

    this.write = function(addr, d8) {
        switch (addr) {
        case PIA1_PA:
            if ((pia1_cra & 0x04) != 0) {
                pia1_pa_out = d8;
                // Which keyrow are we accessing?
                if ((pia1_pa_out & 15) < 10)
                    pia1_pb_in = keyrow[pia1_pa_out & 15];
                else
                    pia1_pb_in = 0xff;
            }
            else
                pia1_ddra = d8;
            break;
        case PIA1_CRA:
            pia1_cra = (pia1_cra & 0xc0) | (d8 & 0x3f);
            // Change in CA2? (screen blank)
            if ((pia1_cra & 0x38) == 0x38 && !pia1_ca2) {
                // CA2 transitioning high. (Screen On)
                pia1_ca2 = 1;
                video.setVideoBlank(0);
                ieee.EOIout(true);
            }
            else if ((pia1_cra & 0x38) == 0x30 && pia1_ca2) {
                // CA2 transitioning low. (Screen Blank)
                pia1_ca2 = 0;
                video.setVideoBlank(1);
                ieee.EOIout(false);
            }
            break;
        case PIA1_PB:
            if ((pia1_crb & 0x04) != 0)
                pia1_pb_out = d8;
            else
                pia1_ddrb = d8;
            break;
        case PIA1_CRB:
            pia1_crb = (pia1_crb & 0xc0) | (d8 & 0x3f);
            break;

        case PIA2_PA:
            if ((pia2_cra & 0x04) != 0)
                pia2_pa_out = d8;
            else
                pia2_ddra = d8;
            break;
        case PIA2_CRA:
            pia2_cra = (pia2_cra & 0xc0) | (d8 & 0x3f);
            ieee.NDACout((pia2_cra & 0x08) != 0x00);
            break;
        case PIA2_PB:
            if ((pia2_crb & 0x04) != 0) {
                pia2_pb_out = d8;
                if (pia2_ddrb == 0xff)
                    ieee.DIOout(pia2_pb_out);
            }
            else
                pia2_ddrb = d8;
            break;
        case PIA2_CRB:
            pia2_crb = (pia2_crb & 0xc0) | (d8 & 0x3f);
            ieee.DAVout((pia2_crb & 0x08) != 0x00);
            break;

        case VIA_DRB:
            /* Clear CB2 interrupt flag IFR3 (if not "independent"
             * interrupt)
             */
            if ((via_pcr & 0xa0) != 0x20) {
                if ((via_ifr & 0x08) != 0) {
                    via_ifr &= ~0x08;
                    if ((via_ier & 0x08) != 0)
                        this.updateIrq();
                }
            }
            /* Clear CB1 interrupt flag IFR4 */
            if ((via_ifr & 0x10) != 0) {
                via_ifr &= ~0x10;
                if ((via_ier & 0x10) != 0)
                    this.updateIrq();
            }
            via_drb_out = d8;
            // Cass write change?
            // if (((via_drb_out ^ d8) &0x08) != 0)
            //     pet2001io_cass_write(io, (d8 & 0x08) != 0);

            // IEEE outputs
            if ((via_ddrb & 0x04) != 0)
                ieee.ATNout((via_drb_out & 0x04) != 0x00);
            if ((via_ddrb & 0x02) != 0)
                ieee.NRFDout((via_drb_out & 0x02) != 0x00);
            break;
        case VIA_DRA:
            /* Clear CA2 interrupt flag IFR0 (if not "independent"
             * interrupt)
             */
            if ((via_pcr & 0x0a) != 0x02) {
                if ((via_ifr & 0x01) != 0) {
                    via_ifr &= ~0x01;
                    if ((via_ier & 0x01) != 0)
                        this.updateIrq();
                }
            }

            /* Clear CA1 interrupt flag IFR1 */
            if ((via_ifr & 0x02) != 0) {
                via_ifr &= ~0x02;
                if ((via_ier & 0x02) != 0)
                    this.updateIrq();
            }
            via_dra_out = d8;
            break;
        case VIA_DDRB:
            via_ddrb = d8;
            break;
        case VIA_DDRA:
            via_ddra = d8;
            break;
        case VIA_T1CL:
            via_t1ll = d8;      /* LATCH */
            break;
        case VIA_T1CH:
            /* Clear T1 interrupt flag IFR6 as side-effect of writing T1CH */
            if ((via_ifr & 0x40) != 0) {
                via_ifr &= ~0x40;
                if ((via_ier & 0x40) != 0)
                    this.updateIrq();
            }
            /* Write to T1LH and set via_t1_undf to set T1 next cycle. */
            via_t1lh = d8;
            via_t1_undf = 1;
            via_t1_1shot = 1;
            break;
        case VIA_T1LL:
            via_t1ll = d8;
            break;
        case VIA_T1LH:
            /* Clear T1 interrupt flag IFR6 as side-effect of writing T1LH */
            if ((via_ifr & 0x40) != 0) {
                via_ifr &= ~0x40;
                if ((via_ier & 0x40) != 0)
                    this.updateIrq();
            }
            via_t1lh = d8;
            break;
        case VIA_T2CL:
            via_t2ll = d8;      /* LATCH */
            break;
        case VIA_T2CH:
            /* Clear T2 interrupt flag IFR5 as side-effect of writing T2CH */
            if ((via_ifr & 0x20) != 0) {
                via_ifr &= ~0x20;
                if ((via_ier & 0x20) != 0)
                    this.updateIrq();
            }
            if ((via_acr & 0x20) == 0)
                via_t2_1shot = 1;
            via_t2cl = via_t2ll;
            via_t2ch = d8;
            /*
             * Increment counter to take into account cycle() will
             * decrement it in the same cycle.
             */
            if ((via_acr & 0x20) == 0 && ++via_t2cl == 0x100) {
                via_t2cl = 0;
                if (++via_t2ch == 0x100)
                    via_t2ch = 0;
            }
            break;
        case VIA_SR:
            /* Clear SR int flag IFR2 */
            if ((via_ifr & 0x04) != 0) {
                via_ifr &= ~0x04;
                if ((via_ier & 0x04) != 0)
                    this.updateIrq();
            }
            /* Start the SR counter. */
            if ((via_acr & 0x1c) != 0)
                via_sr_start = 1;
            via_sr = d8;
            break;
        case VIA_ACR:
            if ((d8 & 0x1c) == 0) {
                via_sr_cntr = 0;
                via_cb1 = 1;
            }
            via_acr = d8;
            break;
        case VIA_PCR:
            /* Did we change CA2 output? */
            if ((via_pcr & 0x0c) == 0x0c && (d8 & 0x0c) == 0x0c &&
                ((via_pcr ^ d8) & 0x02) != 0) {
                video.setCharset((d8 & 0x02) != 0);
            }
            via_pcr = d8;
            break;
        case VIA_IFR:
            /* Clear interrupt flags by writing 1s to the bits. */
            via_ifr &= ~(d8 & 0x7f);
            this.updateIrq();
            break;
        case VIA_IER:
            if ((d8 & 0x80) != 0)
                via_ier |= d8;
            else
                via_ier &= ~d8;
            this.updateIrq();
            break;
        case VIA_ANH:
            /* VIA_PA with no handshake. */
            via_dra_out = d8;
            break;
        }
    } // write()

    // Set both cassette #1's sense and read signals.
    //
    //void
    //pet2001io_set_cass1(struct pet2001io *io, uint8_t sense, uint8_t read)
    //{
    //   /* Set cassette sense PIA1.PA[4] */
    //    if (sense)
    //        pia1_pa_in &= ~0x10;
    //    else
    //        pia1_pa_in |= 0x10;
    //
    //    /* Transition in CA1 ? */
    //    if (read != pia1_ca1) {
    //        if (((pia1_cra & 0x02) == 0 && !read) ||
    //            ((pia1_cra & 0x02) != 0 && read)) {
    //            pia1_cra |= 0x80;
    //            if ((pia1_cra & 0x01) != 0)
    //                pet2001io_update_irq(io);
    //        }
    //        pia1_ca1 = read;
    //    }
    //}

    this.cycle = function () {
        // Synthesisze a SYNC signal at 60.1hz and 76.9% duty cycle.
        if (++video_cycle == 3840)
            this.sync(1);
        else if (video_cycle == 16640) {
            this.sync(0);
            video_cycle = 0;
        }

        /* Handle VIA.TIMER1 */
        if (via_t1_undf) {
            /* T1 underflow.  Reload. */
            via_t1cl = via_t1ll;
            via_t1ch = via_t1lh;
            via_t1_undf = 0;
        } else if (via_t1cl-- == 0) {
            if (via_t1ch-- == 0) {

                via_t1_undf = 1;

                /* Interrupt? */
                if (via_t1_1shot) {
                    via_ifr |= 0x40;
                    if ((via_ier & 0x40) != 0)
                        this.updateIrq();
                    if ((via_acr & 0x40) == 0)
                        via_t1_1shot = 0;
                }
            }
        }
        via_t1cl &= 0xff;
        via_t1ch &= 0xff;

        /* Handle VIA.TIMER2 */
        if (via_t2_undf) {
            via_t2cl = via_t2ll;
            if ((via_acr & 0x1c) == 0x10 && via_sr_cntr > 0) {
                /* Free-running shift register. */
                via_cb1 = !via_cb1;
                if (via_cb1) {
                    via_sr = ((via_sr >> 7) | (via_sr << 1)) & 0xff;
                    via_cb2 = via_sr & 1;
                }
            } else if ((via_acr & 0xc) == 4 && via_sr_cntr > 0) {
                /* Other SR modes clocked by T2. */
                via_cb1 = !via_cb1;
                if (via_cb1) {
                    if ((via_acr & 0x10) != 0)
                        via_sr = ((via_sr >> 7) | (via_sr << 1)) & 0xff;
                    else
                        via_sr = ((via_sr << 1) | 1) & 0xff;
                    via_cb2 = via_sr & 1;
                    if (--via_sr_cntr == 0) {
                        via_ifr |= 0x04;
                        if ((via_ier & 0x04) != 0)
                            this.updateIrq();
                    }
                }
            }
            via_t2_undf = 0;
        } else if ((via_acr & 0x20) == 0 && via_t2cl-- == 0) {
            /* Reload T2L on next cycle? */
            if ((via_acr & 0x14) != 0)
                via_t2_undf = 1;

            if (via_t2ch-- == 0) {
                /* T2 underflow. */
                if (via_t2_1shot) {
                    via_ifr |= 0x20;
                    if ((via_ier & 0x20) != 0)
                        this.updateIrq();
                    via_t2_1shot = 0;
                }
            }
        }
        via_t2cl &= 0xff;
        via_t2ch &= 0xff;

        /* Handle VIA.SR when in system clock mode. */
        if (via_sr_cntr > 0 && (via_acr & 0xc) == 8) {
            via_cb1 = !via_cb1;
            if (via_cb1) {
                if ((via_acr & 0x10) != 0)
                    via_sr = ((via_sr >> 7) | (via_sr << 1)) & 0xff;
                else
                    via_sr = ((via_sr << 1) | 1) & 0xff;
                via_cb2 = via_sr & 1;
                if (--via_sr_cntr == 0) {
                    via_ifr |= 0x04;
                    if ((via_ier & 0x04) != 0)
                        this.updateIrq();
                }
            }
        }
        if (via_sr_start) {
            via_sr_start = 0;
            via_sr_cntr = (via_acr & 0x10) == 0 ? 8 : 9;
        }

    } // cycle()

    this.ieeeLoadData = function(addr, bytes) {
        ieee.ieeeLoadData(addr, bytes);
    }
}
