// SPDX-License-Identifier: GPL-3.0-or-later
// National Semiconductor COP420 — 4-bit microcontroller.
//
// The NewBrain's keyboard and 16-character VFD hang off one of these, running
// its own 1K microcode ROM. Reimplemented from the behaviour described in
// MAME's cop400 device (BSD-3-Clause, copyright Curt Coder) and National's
// published instruction set. See ATTRIBUTION.md.
//
// COP420: 1024 x 8 ROM, 64 x 4 RAM.
//   A    4-bit accumulator          B   6-bit RAM address (Br:Bd)
//   C    1-bit carry                EN  4-bit enable register
//   G    4-bit bidirectional port   Q   8-bit latch feeding the L port
//   SIO  4-bit shift register       T   8-bit timer
//   SA/SB/SC  three-deep subroutine stack
//
// The host supplies the pin callbacks; nothing here knows about a NewBrain.

const ROM_SIZE = 0x400;
const RAM_SIZE = 64;

export class COP420 {
  // rom: Uint8Array(1024). io: { readG, writeG, writeD, readIN, writeL,
  // readSI, writeSO, writeSK, readCKO } — all optional.
  constructor(rom, io = {}) {
    if (!rom || rom.length < ROM_SIZE) throw new Error('COP420: need a 1K ROM');
    this.rom = rom.subarray(0, ROM_SIZE);
    this.ram = new Uint8Array(RAM_SIZE);
    this.io = io;
    this.reset();
  }

  reset() {
    this.pc = 0; this.prevPc = 0;
    this.a = 0; this.b = 0; this.c = 0;
    this.en = 0; this.g = 0; this.q = 0;
    this.sa = 0; this.sb = 0; this.sc = 0;
    this.sio = 0; this.si = 0; this.skl = 1;
    this.t = 0; this.sktLatch = 0;
    this.il = 0;
    this.skip = false; this.lastSkip = false; this.skipLbi = 0;
    this.secondByte = false; this.opcode = 0;
    this.halt = false; this.idle = false;
    this.ram.fill(0);
    this.io.writeD?.(0);
    this.io.writeG?.(0);
  }

  // ---- helpers -------------------------------------------------------------
  ramR(addr) { return this.ram[addr & 0x3f] & 0x0f; }
  ramW(addr, v) { this.ram[addr & 0x3f] = v & 0x0f; }
  push(addr) { this.sc = this.sb; this.sb = this.sa; this.sa = addr & 0x3ff; }
  pop() { this.pc = this.sa; this.sa = this.sb; this.sb = this.sc; }
  doSkip() { this.skip = true; }

  writeQ(v) {
    this.q = v & 0xff;
    // The L port only drives when EN2 is set.
    if (this.en & 0x04) this.io.writeL?.(this.q);
  }
  writeG(v) { this.g = v & 0x0f; this.io.writeG?.(this.g); }
  writeEN(v) {
    this.en = v & 0x0f;
    this.io.writeL?.((this.en & 0x04) ? this.q : 0);
    this.skUpdate();
  }
  skUpdate() {
    // EN0 picks what SK carries: the serial clock, or the SKL latch.
    this.io.writeSK?.((this.en & 0x01) ? (this.sio & 1) : this.skl);
  }
  inG()  { return (this.io.readG?.() ?? 0x0f) & 0x0f; }
  inIN() { return (this.io.readIN?.() ?? 0x0f) & 0x0f; }
  inL()  { return 0xff; }

  // ---- timer and serial ----------------------------------------------------
  timerTick() {
    this.t = (this.t + 1) & 0xff;
    if (this.t === 0) this.sktLatch = 1;
  }

  serialTick() {
    const si = (this.io.readSI?.() ?? 0) & 1;

    if (this.en & 0x01) {
      // EN0=1: SIO is an asynchronous binary counter, decrementing on every
      // low-going pulse at SI. A pulse has to hold each level for two
      // instruction cycles, so the edge is taken from the pattern 1100 in a
      // 4-deep history of SI. This is how the cassette is read: the COP counts
      // pulses to measure the width of each half cycle coming off the tape.
      this.io.writeSO?.((this.en & 0x08) ? 1 : 0);
      this.si = ((this.si << 1) | si) & 0x0f;
      if (this.si === 0x0c) this.sio = (this.sio - 1) & 0x0f;
    } else {
      // EN0=0: SIO is a shift register, shifting left one place per
      // instruction cycle with SI entering at the bottom. SO carries the top
      // bit when EN3 enables it.
      this.io.writeSO?.((this.en & 0x08) ? ((this.sio >> 3) & 1) : 0);
      this.sio = ((this.sio << 1) | si) & 0x0f;
    }
  }

  // IN-port change latch, which is what raises the interrupt.
  inilTick(inVal) {
    const prev = this._lastIn ?? 0x0f;
    // a 1->0 transition on IN3 latches an interrupt request
    if ((prev & 0x08) && !(inVal & 0x08)) this.il |= 0x02;
    if ((prev & 0x01) && !(inVal & 0x01)) this.il |= 0x01;
    this._lastIn = inVal & 0x0f;
  }

  // ---- execution -----------------------------------------------------------
  static TWO_BYTE = (() => {
    const t = new Uint8Array(256);
    t[0x23] = 1; t[0x33] = 1;
    for (let r = 0; r < 4; r++) { t[0x60 + r] = 1; t[0x68 + r] = 1; }
    return t;
  })();

  // Runs one machine cycle. Returns 1 always (the COP is fixed-cycle).
  step() {
    if (this.halt || this.idle) { this.timerTick(); return 1; }

    if (!this.secondByte) this.prevPc = this.pc;

    // Sync pulse. With EN0 clear, SK carries a clock that ticks once per
    // instruction whenever SKL is set — this is what shifts the VFD's serial
    // register, so without it the display is never clocked at all.
    if (!(this.en & 0x01) && this.skl) {
      this.io.writeSK?.(0);
      this.io.writeSK?.(1);
    }

    const operand = this.rom[this.pc & 0x3ff];
    this.pc = (this.pc + 1) & 0x3ff;
    if (!this.secondByte) this.opcode = operand;

    // Interrupt, once any run of control-transfer or LBI instructions is done.
    if (!this.secondByte && (this.en & 0x02) && (this.il & 0x02) &&
        !COP420.isControlTransfer(this.opcode) && !this.skipLbi) {
      this.il &= ~0x02;
      this.lastSkip = this.skip;
      this.skip = false;
      this.push(this.pc);
      this.pc = 0x0ff;
      this.en &= ~0x02;
      this.timerTick();
      return 1;
    }

    if (!this.secondByte && COP420.TWO_BYTE[this.opcode]) {
      this.secondByte = true;
    } else if (this.skip) {
      this.skip = false;
      this.secondByte = false;
    } else if (!this.secondByte && (this.opcode === 0xff || this.opcode === 0xbf)) {
      // JID / LQID transfer control first, then fetch through A/M.
      if (this.opcode === 0xbf) this.push(this.pc);
      this.pc = (this.pc & 0x300) | ((this.a << 4) | this.ramR(this.b));
      this.secondByte = true;
    } else {
      this.exec(this.opcode, operand);
      if (this.skipLbi > 0) this.skipLbi--;
      this.secondByte = false;
    }

    this.serialTick();
    this.timerTick();
    return 1;
  }

  static isControlTransfer(op) {
    // JP, JSRP, JMP, JSR, RET, RETSK — anything that moves PC.
    if (op >= 0x80) return true;                 // JP / JSRP / JID / LQID
    if (op >= 0x60 && op <= 0x6f) return true;   // JMP / JSR
    if (op === 0x48 || op === 0x49) return true; // RET / RETSK
    return false;
  }

  exec(op, operand) {
    const hi = op & 0xf0, lo = op & 0x0f;

    // ---- single-byte groups the table repeats ----
    // LBI must be tested FIRST. In each 0x10 block the layout is
    //   0-3 misc | 4-7 XIS/LD/X/XDS | 8-f LBI
    // and the XIS/LD/X/XDS masks below also match 0x0c-0x0f, 0x1c-0x1f and so
    // on, so testing them first silently stole sixteen LBI opcodes.
    if (op < 0x40 && (op & 0x08)) { this.lbi(op); return; }

    if ((op & 0xc7) === 0x04) {  // XIS  0x04,0x14,0x24,0x34
      const r = op & 0x30, t = this.ramR(this.b);
      this.ramW(this.b, this.a); this.a = t;
      const bd = ((this.b & 0x0f) + 1) & 0x0f;
      this.b = ((this.b & 0x30) | bd) ^ r;
      if (bd === 0) this.doSkip();
      return;
    }
    if ((op & 0xc7) === 0x05) {  // LD
      const r = op & 0x30;
      this.a = this.ramR(this.b);
      this.b ^= r;
      return;
    }
    if ((op & 0xc7) === 0x06) {  // X
      const r = op & 0x30, t = this.ramR(this.b);
      this.ramW(this.b, this.a); this.a = t;
      this.b ^= r;
      return;
    }
    if ((op & 0xc7) === 0x07) {  // XDS
      const r = op & 0x30, t = this.ramR(this.b);
      this.ramW(this.b, this.a); this.a = t;
      const bd = ((this.b & 0x0f) - 1) & 0x0f;
      this.b = ((this.b & 0x30) | bd) ^ r;
      if (bd === 0x0f) this.doSkip();
      return;
    }
    // LQID and JID reach here on their SECOND cycle, after control has already
    // been transferred to the table entry. They must NOT fall through to the
    // generic JP handler below — LQID loads Q from the table byte and returns,
    // JID jumps to it. Getting this wrong corrupts the stack.
    if (op === 0xbf) { this.writeQ(operand); this.pop(); return; }   // LQID
    if (op === 0xff) { this.pc = (this.pc & 0x300) | operand; return; } // JID

    // 0x50 is CAB, not AISC — AISC is 0x51-0x5f. Decoding 0x50 as "AISC 0"
    // makes it a no-op, and CAB is what loads A into B's low nibble before an
    // OBD, so the keyboard/VFD scan never advanced off row 0.
    if (op === 0x50) { this.b = (this.b & 0x30) | this.a; return; }  // CAB
    if (hi === 0x50) { this.aisc(op); return; }           // AISC (0x51-0x5f)
    if (hi === 0x70) { this.ramW(this.b, lo); this.incBd(); return; } // STII
    if (op >= 0x80)  { this.jp(op); return; }

    switch (op) {
      case 0x00: this.a = 0; return;                                  // CLRA
      case 0x01: if (!(this.ramR(this.b) & 1)) this.doSkip(); return;  // SKMBZ0
      case 0x02: this.a ^= this.ramR(this.b); return;                 // XOR
      case 0x03: if (!(this.ramR(this.b) & 4)) this.doSkip(); return;  // SKMBZ2
      case 0x10: {                                                    // CASC
        let v = (this.a ^ 0x0f) + this.ramR(this.b) + this.c;
        if (v > 0x0f) { this.c = 1; this.doSkip(); v &= 0x0f; } else this.c = 0;
        this.a = v; return;
      }
      case 0x11: if (!(this.ramR(this.b) & 2)) this.doSkip(); return;  // SKMBZ1
      case 0x12: {                                                    // XABR
        const br = this.a & 0x03, bd = this.b & 0x0f;
        this.a = this.b >> 4; this.b = (br << 4) | bd; return;
      }
      case 0x13: if (!(this.ramR(this.b) & 8)) this.doSkip(); return;  // SKMBZ3
      case 0x20: if (this.c) this.doSkip(); return;                   // SKC
      case 0x21: if (this.a === this.ramR(this.b)) this.doSkip(); return; // SKE
      case 0x22: this.c = 1; return;                                  // SC
      case 0x23: this.exec23(operand); return;
      case 0x30: {                                                    // ASC
        let v = this.a + this.c + this.ramR(this.b);
        if (v > 0x0f) { this.c = 1; this.doSkip(); v &= 0x0f; } else this.c = 0;
        this.a = v; return;
      }
      case 0x31: this.a = (this.a + this.ramR(this.b)) & 0x0f; return; // ADD
      case 0x32: this.c = 0; return;                                   // RC
      case 0x33: this.exec33(operand); return;
      case 0x40: this.a ^= 0x0f; return;                               // COMP
      case 0x41: if (this.sktLatch) { this.sktLatch = 0; this.doSkip(); } return; // SKT
      case 0x42: this.ramW(this.b, this.ramR(this.b) & 0xb); return;   // RMB2
      case 0x43: this.ramW(this.b, this.ramR(this.b) & 0x7); return;   // RMB3
      case 0x44: return;                                               // NOP
      case 0x45: this.ramW(this.b, this.ramR(this.b) & 0xd); return;   // RMB1
      case 0x46: this.ramW(this.b, this.ramR(this.b) | 0x4); return;   // SMB2
      case 0x47: this.ramW(this.b, this.ramR(this.b) | 0x2); return;   // SMB1
      case 0x48: this.pop(); this.skip = this.lastSkip; return;        // RET
      case 0x49: this.pop(); this.doSkip(); return;                    // RETSK
      case 0x4a: this.a = (this.a + 10) & 0x0f; return;                // ADT
      case 0x4b: this.ramW(this.b, this.ramR(this.b) | 0x8); return;   // SMB3
      case 0x4c: this.ramW(this.b, this.ramR(this.b) & 0xe); return;   // RMB0
      case 0x4d: this.ramW(this.b, this.ramR(this.b) | 0x1); return;   // SMB0
      case 0x4e: this.a = this.b & 0x0f; return;                       // CBA
      case 0x4f: {                                                     // XAS
        const t = this.sio; this.sio = this.a; this.a = t;
        if (this.skl !== this.c) { this.skl = this.c; this.skUpdate(); }
        return;
      }
      case 0x60: case 0x61: case 0x62: case 0x63:                      // JMP
        this.pc = ((op & 0x07) << 8) | operand; return;
      case 0x68: case 0x69: case 0x6a: case 0x6b:                      // JSR
        this.push(this.pc); this.pc = ((op & 0x07) << 8) | operand; return;
      default: return;                                                 // unused
    }
  }

  incBd() { this.b = (this.b & 0x30) | (((this.b & 0x0f) + 1) & 0x0f); }

  aisc(op) {
    const y = op & 0x0f;
    this.a += y;
    if (this.a > 0x0f) { this.doSkip(); this.a &= 0x0f; }
  }

  lbi(operand) {
    // Successive LBIs execute only once — the rest are skipped.
    this.skipLbi++;
    if (this.skipLbi > 1) return;
    this.skipLbi++;
    if (operand & 0x80) this.b = operand & 0x3f;
    else this.b = (operand & 0x30) | (((operand & 0x0f) + 1) & 0x0f);
  }

  jp(op) {
    const page = this.pc >> 6;
    if (page === 2 || page === 3) {
      this.pc = (this.pc & 0x380) | (op & 0x7f);
    } else if ((op & 0xc0) === 0xc0) {
      this.pc = (this.pc & 0x3c0) | (op & 0x3f);
    } else {
      this.push(this.pc);
      this.pc = 0x80 | (op & 0x3f);
    }
  }

  exec23(operand) {
    if (operand < 0x40) this.a = this.ramR(operand & 0x3f);          // LDD
    else if (operand >= 0x80 && operand < 0xc0) {                     // XAD
      const rd = operand & 0x3f, t = this.a;
      this.a = this.ramR(rd); this.ramW(rd, t);
    }
  }

  exec33(operand) {
    const skgbz = bit => { if (!((this.inG() >> bit) & 1)) this.doSkip(); };
    switch (operand) {
      case 0x01: skgbz(0); return;
      case 0x03: skgbz(2); return;
      case 0x11: skgbz(1); return;
      case 0x13: skgbz(3); return;
      case 0x21: if (this.inG() === 0) this.doSkip(); return;         // SKGZ
      case 0x28: this.a = this.inIN(); return;                        // ININ
      case 0x29: this.a = (this.il & 0x09) | ((this.io.readCKO?.() ?? 0) << 2);
                 this.il = 0; return;                                 // INIL
      case 0x2a: this.a = this.inG(); return;                         // ING
      case 0x2c: this.ramW(this.b, this.q >> 4); this.a = this.q & 0x0f; return; // CQMA
      case 0x2e: { const l = this.inL(); this.ramW(this.b, l >> 4); this.a = l & 0x0f; return; } // INL
      case 0x3a: this.writeG(this.ramR(this.b)); return;              // OMG
      case 0x3c: this.writeQ((this.a << 4) | this.ramR(this.b)); return; // CAMQ
      case 0x3e: this.io.writeD?.(this.b & 0x0f); return;             // OBD
      default:
        if (operand >= 0x50 && operand <= 0x5f) { this.writeG(operand & 0x0f); return; } // OGI
        if (operand >= 0x60 && operand <= 0x6f) { this.writeEN(operand & 0x0f); return; } // LEI
        if (operand >= 0x80 && operand <= 0xbf) { this.lbi(operand); return; }            // LBI
    }
  }
}
