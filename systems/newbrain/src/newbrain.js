// SPDX-License-Identifier: GPL-3.0-or-later
// Grundy NewBrain AD — machine.
//
// Reimplemented from the hardware behaviour described in MAME's newbrain
// driver (BSD-3-Clause, copyright Curt Coder) and the Grundy NewBrain
// Software Technical Manual. See ATTRIBUTION.md.
//
// The CPU is injected rather than owned: anything exposing the usual
// read/write/in/out hooks will do, so the Z80 can be swapped without
// touching the machine.

import { COP420 } from './cop420.js';
import { encodeTape, TapePlayer, TapeRecorder } from './tape.js';

export const SCREEN_W = 640;
export const SCREEN_H = 250;

// ENRG1 (port 0x07) bit assignments.
const ENRG_CLK  = 0x01;
const ENRG_TVP  = 0x04;

// TVTL (ports 0x0c-0x0f) bit assignments.
const TVTL_RV    = 0x01;  // reverse the whole field
const TVTL_FS    = 0x02;  // 256 chars rather than 128 + 128 reversed
const TVTL_32_40 = 0x04;  // narrower pixel-graphics field
const TVTL_UCR   = 0x08;  // 8x8 matrix / 31 lines, rather than 8x10 / 25
const TVTL_80L   = 0x40;  // 80 column rather than 40

export class NewBrain {
  // roms: { ab, cd, ef, chargen } as Uint8Array
  constructor(roms, { ramSize = 32 * 1024 } = {}) {
    this.rom = new Uint8Array(0x6000);
    this.rom.set(roms.ab.subarray(0, 0x2000), 0x0000);
    this.rom.set(roms.cd.subarray(0, 0x2000), 0x2000);
    this.rom.set(roms.ef.subarray(0, 0x2000), 0x4000);
    this.charRom = roms.chargen;

    this.ram = new Uint8Array(ramSize);

    // The keyboard and VFD hang off a COP420 running its own microcode. One
    // counter (k405) selects both the keyboard row and the VFD digit.
    this.k402 = 0;      // 16-bit shift register, clocked by the COP's SK
    this.k405 = 0;      // 7-bit row/digit counter
    this.k403d = 0;     // keyboard nibble latched from the selected row
    this.k403q = 0xf;
    this.copSo = 0; this.copK6 = 0;
    this.keys = new Uint8Array(16);               // 16 rows x 4 bits, ACTIVE HIGH
    this.digits = new Uint16Array(16);           // 14-segment patterns

    this.cop = roms.cop ? new COP420(roms.cop, {
      readG:  () => this.copGRead(),
      readIN: () => this.copInRead(),
      writeG: v => this.copGWrite(v),
      writeD: v => this.copDWrite(v),
      writeSO: v => { this.copSo = v & 1; },
      writeSK: v => { if (v) this.k402 = ((this.k402 << 1) | this.copSo) & 0xffff; },
      readSI: () => (this.tapeIn ^ this.copTdo) & 1,
    }) : null;
    this.copDiv = 0;

    this.cpu = null;
    this.reset();
  }

  reset() {
    // Until the ROM sets PWRUP, every access decodes as bank 7 — so the Z80
    // fetches the EF ROM at address 0, which begins with a JP into E000.
    // That is what the ROM's own symbols mean by "this rom is copied to 0000".
    this.pwrup = 0;

    this.enrg = 0;
    this.clk = 0;
    this.tvp = 0;

    // Cassette. TPIN is the level coming off the tape; TDO is what the COP
    // writes to it. SI sees the two XORed together, so a recording reads back
    // as a steady level while playback is the tape's own signal.
    this.tapeIn = 0;
    this.copTdo = 0;
    this.expansion = this.expansion || null;

    // Elapsed T-states, which the cassette is timed against.
    this.cycles = 0;
    this.tape = null;

    // Cassette motor. The COP drives it through G1 (and G3 for the second
    // deck) gated with K6, by way of a relay that takes a moment to drop out.
    // The ROM stops the motor between blocks, so the tape must stop with it.
    this.copG = 0x0f;
    this.motor = false;
    this.motorOffAt = -1;

    // Whatever the machine writes to tape is captured off the same line it
    // would drive a recorder with, and demodulated on request. Nothing is
    // intercepted: this listens to TDO exactly as a cassette would.
    this.recorder = new TapeRecorder();

    this.tvl = 0;
    this.rv = 0;
    this.fs = 0;
    this.c32_40 = 0;
    this.ucr = 0;
    this.c80l = 0;

    this.clkint = 1;   // active low
    this.copint = 1;
    this.expint = 0;
    this.irq = false;

    this.ram.fill(0);
  }

  // ---- memory -------------------------------------------------------------
  // Eight 8K banks selected by A15-A13. Banks 0-3 are RAM, 4 is unmapped and
  // 5/6/7 are the AB, CD and EF ROMs.

  read(addr) {
    addr &= 0xffff;
    let bank = this.pwrup ? (addr >> 13) & 0x07 : 7;

    if (bank < 4) {
      const off = (bank << 13) | (addr & 0x1fff);
      return off < this.ram.length ? this.ram[off] : 0xff;
    }
    switch (bank) {
      // Bank 4 is the expansion slot, empty unless a card is fitted. The
      // board owns 0-3 as RAM and 5-7 as ROM and answers over the top of a
      // card for those, so bank 4 is the only one a card gets to itself —
      // that is the whole of the arbitration.
      case 4: return this.expansion ? this.expansion.hostRead(addr & 0x1fff) : 0xff;
      case 5: return this.rom[0x0000 + (addr & 0x1fff)];
      case 6: return this.rom[0x2000 + (addr & 0x1fff)];
      case 7: return this.rom[0x4000 + (addr & 0x1fff)];
      default: return 0xff;  // bank 4 is nothing at all
    }
  }

  write(addr, val) {
    addr &= 0xffff;
    const bank = this.pwrup ? (addr >> 13) & 0x07 : 7;
    if (bank < 4) {
      const off = (bank << 13) | (addr & 0x1fff);
      if (off < this.ram.length) this.ram[off] = val & 0xff;
    } else if (bank === 4 && this.expansion) {
      this.expansion.hostWrite(addr & 0x1fff, val & 0xff);
    }
    // ROM writes, and bank 4 with an empty slot, go nowhere.
  }

  // ---- I/O ----------------------------------------------------------------
  // Decoded on A4-A2, so each function occupies a group of four ports.

  ioRead(port) {
    port &= 0xff;
    switch ((port >> 2) & 0x07) {
      case 1:
        if ((port & 3) === 0) { this.clclk(); return 0xff; }
        if ((port & 3) === 2) return this.copRead();
        return 0xff;
      case 5:
        return (port & 2) ? this.ustB() : this.ustA();
      default:
        return 0xff;
    }
  }

  ioWrite(port, val) {
    // A card's control register answers at port FF with address line 9 high.
    // Z80 I/O carries the B register on the top half of the bus, so the full
    // address matters here and this has to come before the usual masking.
    if (this.expansion && (port & 0xff) === 0xff && ((port >> 9) & 1)) {
      this.expansion.hostControl(val & 0xff);
      return;
    }
    port &= 0xff; val &= 0xff;
    switch ((port >> 2) & 0x07) {
      case 1:
        switch (port & 3) {
          case 0: this.clclk(); break;
          case 2: this.copWrite(val); break;
          case 3: this.enrgWrite(val); break;
        }
        break;
      case 2: this.tvlWrite(val, (port >> 6) & 1); break;
      case 3: this.tvtlWrite(val); break;
    }
  }

  enrgWrite(val) {
    this.enrg = val;
    const clk = val & ENRG_CLK;
    if (clk !== this.clk) { this.clk = clk; this.checkInterrupt(); }
    this.tvp = (val & ENRG_TVP) ? 1 : 0;
  }

  // Latches the video address counter. A5-A0 come from the column mode, A6
  // from the port address, and A14-A7 from the data byte.
  tvlWrite(val, a6) {
    this.tvl = (this.c80l ? 0x04 : 0x02) | (a6 << 6) | (val << 7);
  }

  tvtlWrite(val) {
    this.rv     = (val & TVTL_RV)    ? 1 : 0;
    this.fs     = (val & TVTL_FS)    ? 1 : 0;
    this.c32_40 = (val & TVTL_32_40) ? 1 : 0;
    this.ucr    = (val & TVTL_UCR)   ? 1 : 0;
    this.c80l   = (val & TVTL_80L)   ? 1 : 0;
  }

  ustA() {
    let data = 0x5c;
    // ENRG bits 7-6 select what bit 0 reports; 10 is the tape input.
    data |= ((this.enrg >> 6) & 3) === 2 ? (this.tapeIn & 1) : 1;
    // ENRG bits 5-4 select what bit 1 reports; 00 is the power-up test.
    switch ((this.enrg >> 4) & 3) {
      case 0: data |= this.pwrup ? 0x00 : 0x02; break;
      case 1: break;
      default: data |= 0x02; break;
    }
    data |= this.clkint << 5;
    data |= this.copint << 7;
    return data & 0xff;
  }

  ustB() {
    // Bit 5 is the tape input; the V24 and printer lines stay idle.
    return (0x5c | ((this.tapeIn & 1) << 5)) & 0xff;
  }

  clclk() { this.clkint = 1; this.checkInterrupt(); }

  // Asserted when the clock interrupt is pending with the clock enabled, or
  // the COP or expansion is asking. clkint/copint are active low.
  checkInterrupt() {
    this.irq = (!this.clk && !this.clkint) || !this.copint || this.expint;
  }

  // The COP420 is not emulated as a chip; its protocol is handled separately.
  // MICROBUS: the Z80 reads the COP's Q latch, and writing to it sets Q and
  // pulls G0 low, which is how the COP is told the host wants attention.
  copRead() { return this.cop ? this.cop.q : 0xff; }
  copWrite(val) {
    if (!this.cop) return;
    this.cop.writeG(this.cop.g & 0xe);
    this.cop.q = val & 0xff;
  }

  // The COP runs at 16MHz/4/16, so one COP cycle per 16 Z80 cycles.
  stepCop(z80Cycles) {
    this.cycles += z80Cycles;
    if (this.motorOffAt >= 0 && this.cycles >= this.motorOffAt) {
      this.motor = false;
      this.motorOffAt = -1;
    }
    if (this.tape && this.motor) this.tapeIn = this.tape.advance(z80Cycles);
    if (!this.cop) return;
    this.copDiv += z80Cycles;
    while (this.copDiv >= 16) {
      this.copDiv -= 16;
      this.cop.step();
      // Only while the motor is turning, and only when no tape is playing —
      // otherwise this would record the machine's own read-back.
      if (this.motor && !this.tape) this.recorder.sample(this.copTdo, 16);
    }
  }

  // ---- COP420 pins ---------------------------------------------------------
  // G0 reads back _COPINT; G1/G2/G3 carry keyboard bits 1/0/3.
  copGRead() {
    let d = this.copint ? 0 : 1;
    d |= ((this.k403q >> 1) & 1) << 1;
    d |= ((this.k403q >> 0) & 1) << 2;
    d |= ((this.k403q >> 3) & 1) << 3;
    return d;
  }

  // IN0 is keyboard bit 2; the rest are bus strobes we hold inactive.
  copInRead() { return 0xe | ((this.k403q >> 2) & 1); }

  // Relay dropout, assuming a 500 ohm coil and 47uF: it falls out at a fifth
  // of the coil voltage, which is about 38ms.
  static MOTOR_DROPOUT = Math.round(500 * 47e-6 * Math.log(5) * 4e6);

  updateMotor() {
    const drive = !((this.copG >> 1) & 1) && !this.copK6;
    if (drive) {
      this.motor = true;
      this.motorOffAt = -1;
    } else if (this.motor && this.motorOffAt < 0) {
      this.motorOffAt = this.cycles + NewBrain.MOTOR_DROPOUT;
    }
  }

  copGWrite(v) {
    this.copG = v & 0x0f;
    this.updateMotor();
    const copint = (v & 1) ? 0 : 1;
    if (copint !== this.copint) { this.copint = copint; this.checkInterrupt(); }
  }

  // D0 resets the row counter, D2 clocks it. On the falling edge of K6 the
  // selected row is sampled; on the rising edge the shifted word is latched
  // into the matching VFD digit.
  copDWrite(v) {
    const k4 = (v & 1) ? 0 : 1;
    const k6 = (v & 4) ? 0 : 1;
    this.copTdo = (v >> 1) & 1;   // D1 is TDO, the tape output

    if (k4) {
      this.k405 = 0;
    } else if (this.copK6 && !k6) {
      this.k405 = (this.k405 + 1) & 0x7f;
    }

    if (!this.copK6 && k6) this.k403d = this.keys[this.k405 & 0x0f] & 0x0f;

    if (k6) {
      this.k403q = this.k403d;
    } else {
      this.k403q = 0xf;   // keyboard data disabled reads all-high
      // COP-to-VFD serial order, bits 15..0:  A B J I x H G2 C x F G1 E K L M D
      this.digits[this.k405 & 0x0f] = NewBrain.vfdBitswap(this.k402) & 0x3fff;
    }
    this.copK6 = k6;
    this.updateMotor();
  }

  static vfdBitswap(v) {
    const order = [11, 7, 1, 13, 10, 3, 2, 12, 9, 5, 6, 4, 0, 8, 14, 15];
    let r = 0;
    for (const b of order) r = (r << 1) | ((v >> b) & 1);
    return r;
  }

  // ---- keyboard ------------------------------------------------------------
  // 16 rows of 4 bits, active low.
  setKey(row, col, down) {
    if (row < 0 || row > 15 || col < 0 || col > 3) return;
    if (down) this.keys[row] |=  (1 << col);
    else      this.keys[row] &= ~(1 << col);
  }
  clearKeys() { this.keys.fill(0); }

  // ---- expansion -----------------------------------------------------------
  // The slot the disc controller went in. Nothing ships in it: this emulates
  // the machine as sold, and the disc system was bought separately.
  //
  // It is kept because the bus arrangement is the awkward part to work out
  // again, and because a card is a self-contained thing to write against. A
  // card needs three methods:
  //
  //   hostRead(addr)      bank 4, 0000-1FFF
  //   hostWrite(addr, v)  the same
  //   hostControl(v)      port FF with A9 high
  //
  // ▲ Fitting a disc controller is known NOT to work. The wiring here is
  // right — a card answering 0xFF boots exactly as an empty slot does — but
  // a card returning the real d413 ROM stops the machine booting on every
  // BIOS revision, and why is unexplained. See the notes kept alongside the
  // abandoned attempt before spending time on it.
  fitExpansion(dev) { this.expansion = dev; }

  // ---- cassette ------------------------------------------------------------
  // Attaches a tape image. Nothing intercepts the COP: the image is turned
  // into a signal and presented at TPIN, and the real microcode reads it.
  loadTape(bytes, opts) {
    this.tape = bytes && bytes.length
      ? (({ durations, dataEnd }) => new TapePlayer(durations, dataEnd))(encodeTape(bytes, opts))
      : null;
  }

  ejectTape() { this.tape = null; this.tapeIn = 0; }

  // What the machine has written to tape, as a tape file.
  recordedTape() { return this.recorder.bytes(); }
  clearRecording() { this.recorder.clear(); }
  get hasRecording() { return !this.recorder.empty; }

  // How far through the tape the playback has run, 0 to 1.
  get tapeProgress() { return this.tape ? this.tape.progress : 0; }

  // ---- VFD ----------------------------------------------------------------
  // The 16-character panel hangs off the COP420, which the Z80 feeds with a
  // DISPCOM transfer. The Technical Manual describes that transfer as 18 bytes
  // of which "the first 2 bytes are don't care, the remaining 16 are the
  // contents of OUTBUFF" — so the panel's contents are simply OUTBUFF, and
  // reading it needs no COP emulation and no protocol interception.
  //
  // OUTBUFF sits just past the RST 38 vector, matching the initialisation
  // template the EF ROM copies down (DISPCOM, status, then 16 spaces).
  static COPCTL  = 0x3b;
  static OUTBUFF = 0x3e;
  static VFD_COLS = 16;

  // OUTBUFF is filled right-to-left: the ROM pushes characters in from the
  // right-hand end of the panel, so the buffer reads back reversed.
  vfdText() {
    let s = '';
    for (let i = NewBrain.VFD_COLS - 1; i >= 0; i--) {
      const b = this.ram[NewBrain.OUTBUFF + i] & 0x7f;
      s += (b >= 32 && b < 127) ? String.fromCharCode(b) : ' ';
    }
    return s;
  }

  // ---- video --------------------------------------------------------------
  // Ported from MAME's do_screen_update. The display is generated by walking
  // RAM from the TVL latch; a 00 byte shifts a flag through qa/qb/qc, which
  // is how the hardware marks end-of-row, end-of-frame and graphics rows.

  // Rows start at the TVL latch and sit 64 bytes apart in 40-column mode, 128
  // in 80, exactly as the hardware counts them.
  //
  // These were pinned to 122 and columns+8 for a while, tuned against the boot
  // screen because the real figures appeared to render it wrong. They did not:
  // the COP was still mis-executing its microcode at the time, and the screen
  // the constants were fitted to was itself a symptom. Fitted to one known
  // screen they survive a boot banner and nothing else — a second line lands
  // in the wrong place and every line after it walks further across, which is
  // what put READY at four different offsets once a few returns were pressed.
  static VIDEO_START = 0;
  static rowStride(columns) { return columns === 80 ? 128 : 64; }

  // Length of the first run of 00 bytes in a displayed row, 0 if it has none.
  // One is a row terminator, two mark the end of the frame, three or more hand
  // the rest of the frame over to pixel graphics.
  //
  // ▲ It reports the FIRST run only. A row that terminates early and happens
  // to have three 00s later in its unused tail would be read as text, which is
  // the right answer; a row that deliberately did both would not be. No such
  // row has been seen.
  zeroRun(rowAddr, columns) {
    for (let c = 0; c < columns; c++) {
      if (this.ram[(rowAddr + c) & 0x7fff] !== 0) continue;
      let n = 0;
      while (c + n < columns && this.ram[(rowAddr + c + n) & 0x7fff] === 0) n++;
      return n;
    }
    return 0;
  }

  renderInto(rgba) {
    if (!this.tvp) { rgba.fill(0); return; }

    const columns = this.c80l ? 80 : 40;
    const border = this.c32_40 ? (columns / 10) | 0 : 0;

    let rowAddr = this.tvl + NewBrain.VIDEO_START;
    let videoAddr = rowAddr;
    let rc = 0, vsr = 0, grsr = 0;
    let qa = true, qb = true, qc = true;

    // The 461 shifts a flag in for each 00 byte fetched: one ends the row, two
    // end the frame, three start a graphics line.
    //
    // ▲ The flags are reset for every scanline here, which is NOT what MAME
    // does, and the divergence is deliberate. MAME carries them from scanline
    // to scanline and restores only qc, from qb, at the top of each one. That
    // works whenever a row's 00 is followed by two or more fetched bytes —
    // the state lands on (qa,qb,qc) = (1,1,0) and qc comes back up — but a 00
    // in column 38 leaves exactly one byte behind it and the state ends
    // (1,0,1). qc is already high so nothing is restored, the stale low qb
    // shifts into qc on the next scanline's first column, and that scanline
    // renders blank. The row comes out drawn on alternate scanlines.
    //
    // Column 38 is where BASIC puts the terminator after a 38-character line,
    // which is an ordinary thing to print: `PRINT "Time and score displayed at
    // the bottom"` from BreakOut's instructions does it. A machine that
    // striped that line would have been unusable, so the hardware cannot
    // behave the way carrying the flags suggests. Checked against MAME 0.243
    // directly, which draws the line solid — though only because that version
    // has no terminator logic at all and simply paints all 240 lines.
    //
    // So the row terminator is handled per scanline, which is what makes a
    // row's 00 blank the same columns on all ten of its scanlines, and the
    // frame end is latched separately below rather than being carried in the
    // flags.
    //
    // Pixel graphics need the opposite, though, and that is what the latch
    // below is for. Three 00 bytes drop qc for good: from there the flags must
    // NOT be reset, because it is the stale low qb shifting into qc that keeps
    // every later scanline a graphics line. So the reset applies to text rows
    // only. Once a row's zero run reaches three the flags are let run exactly
    // as MAME has them — the one scanline that starts the region begins clean,
    // its own three 00s bring qc down part way across, and every scanline
    // after that carries. videoAddr then runs on linearly instead of returning
    // to the row, the character row counter stops, and each byte is eight
    // pixels out of grsr, least significant first.
    let p = 0;
    let frameEnded = false, endsAfterThisRow = false;
    let graphics = false, enteringGraphics = false;

    for (let y = 0; y < SCREEN_H; y++) {
      if (rc === 0 && !graphics) {
        // The marker blanks the rows BELOW it; this row still blanks itself
        // from its own 00 onwards, through the terminator above.
        if (endsAfterThisRow) frameEnded = true;
        const run = this.zeroRun(rowAddr, columns);
        endsAfterThisRow = !frameEnded && run === 2;
        // Three or more, and the rest of the frame is a bitmap. Checked once,
        // on the row that starts it; after that the flags carry it themselves.
        if (!frameEnded && run >= 3) { graphics = true; enteringGraphics = true; }
      }

      if (!graphics || enteringGraphics) {
        qa = qb = qc = true;
        enteringGraphics = false;
      } else if (!qc) {
        qc = qb;
      }

      const grLine = !qa && !qc;
      if (!grLine) videoAddr = rowAddr;

      for (let sx = 0; sx < columns; sx++) {
        const window = sx >= border && sx < columns - border;
        const count = grLine ? window : (qa || qc || sx < columns - border);
        const rd = count ? this.ram[videoAddr & 0x7fff] : 0;
        if (count) videoAddr++;

        if (qc) { qc = qb; qb = qa; qa = rd !== 0; }

        const gr = !qa && !qc;
        const en = !frameEnded && (gr ? window : qc);

        const rc3 = (rc >> 3) & 1;
        const txt = !(((rd >> 6) & 1) || ((rd >> 5) & 1));
        const txtq = this.ucr || txt;

        let rcl = rc & 0x07;
        if (rc3 && txt) rcl = 7;

        const charAddr = (this.ucr << 11) | (rcl << 8) |
                         ((((rd >> 7) & 1) && this.fs) << 7) | (rd & 0x7f);
        const crd = this.charRom[charAddr & 0xfff];
        const crd0 = crd & 1;

        const ldvsr = !(((!rc3 ^ crd0) || gr) || txtq);
        if (!ldvsr && !gr) vsr = (crd & 0xfe) | ((crd0 && txtq) ? 1 : 0);
        if (gr) grsr = rd;

        for (let i = 0; i < 8; i++) {
          const bit = gr ? (grsr & 1) : ((vsr >> 7) & 1);
          const on = en && (bit ^ this.rv);
          // The machine has no colour hardware — one bit per pixel, lit or not,
          // out through UHF or the monitor socket as plain luminance. Whatever
          // colour it appeared in belonged to the display, not the NewBrain,
          // and the bezel here is a Microvitec CUB: a colour monitor, which
          // fed a monochrome signal drives all three guns together and shows
          // white. Kept a little under full white so the glyphs read as
          // phosphor rather than backlight, and warmed slightly: a tube's
          // white is never a perfect neutral, and a cold one sits badly
          // against the brown surround. Luminance is unchanged from the
          // neutral it replaces (232 either way) — only the tint moves.
          const r = on ? 0xee : 0, g = on ? 0xe8 : 0, b = on ? 0xdc : 0;
          rgba[p++] = r; rgba[p++] = g; rgba[p++] = b; rgba[p++] = 255;
          if (columns === 40) {
            rgba[p++] = r; rgba[p++] = g; rgba[p++] = b; rgba[p++] = 255;
          }
          grsr >>= 1;
          vsr = (vsr << 1) & 0xff;
        }
      }

      if (!grLine) {
        rc++;
        if (rc === (this.ucr ? 8 : 10)) {
          rc = 0;
          rowAddr += NewBrain.rowStride(columns);
        }
      }
    }
  }
}
