/*************************************************************
 * Microvision Emulator – Intel 8021 CPU + Bit-Banged 16×16 LCD
 * A fan-made educational emulator by Berrry Computer 🍓
 *************************************************************/

(function () {
  'use strict';

  // ─── PREFERENCES / PERSISTENCE ────────────────────────────
  const PREFS_KEY = 'microvision_prefs';
  const ROM_KEY = 'microvision_rom';
  const ROM_NAME_KEY = 'microvision_rom_name';

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    } catch { return {}; }
  }
  function savePrefs(p) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  }
  let prefs = loadPrefs();

  // ─── INTEL 8021 CPU EMULATOR ──────────────────────────────
  // The Microvision's architecture is unique:
  //  - The CPU lives INSIDE each cartridge (not in the console)
  //  - The console only has the 16×16 LCD, battery, and controls
  //  - There is NO dedicated graphics chip — the CPU IS the GPU
  //  - The ~0.1 MHz processor directly bit-bangs pixels to the LCD
  //  - Different cartridges used different CPUs (Intel 8021 or TMS1100)
  //
  // Intel 8021 (MCS-48 family subset):
  //  - 1KB internal ROM
  //  - 64 bytes internal RAM
  //  - 8-bit accumulator
  //  - Two-level hardware stack
  //  - Ports P0, P1, P2 (BUS) — directly drive the LCD columns/rows
  //  - 8-bit timer/counter
  //  - ~66 instructions

  class Intel8021 {
    constructor() {
      this.reset();
    }

    reset() {
      this.A = 0;           // Accumulator
      this.PC = 0;          // Program Counter (10-bit for 1KB)
      this.PSW = 0;         // Program Status Word (flags: CY, AC, F0, BS, S2-S0)
      this.ram = new Uint8Array(64);
      this.rom = new Uint8Array(1024);
      this.timer = 0;
      this.timerRunning = false;
      this.timerOverflow = false;
      this.interruptsEnabled = false;
      this.timerInterruptEnabled = false;
      
      // Stack: the 8021 has a simple 2-level stack
      this.stack = [0, 0];
      this.stackPtr = 0;
      
      // I/O Ports
      this.P0 = 0xFF;  // Port 0 (active low on real hardware)
      this.P1 = 0xFF;  // Port 1
      this.P2 = 0xFF;  // Port 2 (BUS)
      this.DBB = 0;    // Data Bus Buffer
      
      // Register bank select
      this.regBank = 0;
      
      // Memory bank select for program memory
      this.memBank = 0;
      
      // CPU state
      this.halted = false;
      this.cycles = 0;
      this.instructionsExecuted = 0;
      
      // External inputs
      this.T0 = 0;   // Test pin 0
      this.T1 = 0;   // Test pin 1
      this.INT = 1;   // Interrupt pin (active low)
      
      // For display bit-bang tracking
      this.portWriteCallback = null;
      this.portReadCallback = null;
      
      // Last instruction info for disassembly
      this.lastPC = 0;
      this.lastOpcode = 0;
    }

    loadROM(data) {
      this.rom.fill(0xFF);
      for (let i = 0; i < Math.min(data.length, 1024); i++) {
        this.rom[i] = data[i];
      }
    }

    // Get register from RAM (R0-R7)
    getReg(n) {
      return this.ram[(this.regBank * 24) + n];
    }

    setReg(n, v) {
      this.ram[(this.regBank * 24) + n] = v & 0xFF;
    }

    // Get indirect RAM value via R0 or R1
    getIndirect(rn) {
      const addr = this.getReg(rn) & 0x3F;
      return this.ram[addr];
    }

    setIndirect(rn, v) {
      const addr = this.getReg(rn) & 0x3F;
      this.ram[addr] = v & 0xFF;
    }

    getCY() { return (this.PSW >> 7) & 1; }
    setCY(v) { this.PSW = v ? (this.PSW | 0x80) : (this.PSW & 0x7F); }
    
    getAC() { return (this.PSW >> 6) & 1; }
    setAC(v) { this.PSW = v ? (this.PSW | 0x40) : (this.PSW & 0xBF); }
    
    getF0() { return (this.PSW >> 5) & 1; }
    setF0(v) { this.PSW = v ? (this.PSW | 0x20) : (this.PSW & 0xDF); }

    getBS() { return (this.PSW >> 4) & 1; }

    readROM(addr) {
      return this.rom[addr & 0x3FF];
    }

    fetchByte() {
      const b = this.readROM(this.PC);
      this.PC = (this.PC + 1) & 0x3FF;
      return b;
    }

    pushStack() {
      if (this.stackPtr < 2) {
        this.stack[this.stackPtr] = this.PC | ((this.PSW & 0xF0) << 4);
        this.stackPtr++;
      }
    }

    popStack() {
      if (this.stackPtr > 0) {
        this.stackPtr--;
        const val = this.stack[this.stackPtr];
        this.PC = val & 0x3FF;
        this.PSW = (this.PSW & 0x0F) | ((val >> 4) & 0xF0);
      }
    }

    // Execute one instruction, returns cycles consumed
    step() {
      if (this.halted) return 1;

      this.lastPC = this.PC;
      const op = this.fetchByte();
      this.lastOpcode = op;
      this.instructionsExecuted++;

      let cyclesUsed = 1; // Most instructions are 1 cycle (1 machine cycle = ~2.5µs at 3.58MHz)

      switch (op) {
        // NOP
        case 0x00: break;

        // ADD A, Rn (0x68-0x6F)
        case 0x68: case 0x69: case 0x6A: case 0x6B:
        case 0x6C: case 0x6D: case 0x6E: case 0x6F: {
          const r = this.getReg(op & 7);
          const result = this.A + r;
          this.setAC(((this.A & 0x0F) + (r & 0x0F)) > 0x0F ? 1 : 0);
          this.setCY(result > 0xFF ? 1 : 0);
          this.A = result & 0xFF;
          break;
        }

        // ADD A, @Ri (0x60, 0x61)
        case 0x60: case 0x61: {
          const r = this.getIndirect(op & 1);
          const result = this.A + r;
          this.setAC(((this.A & 0x0F) + (r & 0x0F)) > 0x0F ? 1 : 0);
          this.setCY(result > 0xFF ? 1 : 0);
          this.A = result & 0xFF;
          break;
        }

        // ADD A, #data (0x03)
        case 0x03: {
          const d = this.fetchByte();
          const result = this.A + d;
          this.setAC(((this.A & 0x0F) + (d & 0x0F)) > 0x0F ? 1 : 0);
          this.setCY(result > 0xFF ? 1 : 0);
          this.A = result & 0xFF;
          cyclesUsed = 2;
          break;
        }

        // ADDC A, Rn (0x78-0x7F)
        case 0x78: case 0x79: case 0x7A: case 0x7B:
        case 0x7C: case 0x7D: case 0x7E: case 0x7F: {
          const r = this.getReg(op & 7);
          const c = this.getCY();
          const result = this.A + r + c;
          this.setAC(((this.A & 0x0F) + (r & 0x0F) + c) > 0x0F ? 1 : 0);
          this.setCY(result > 0xFF ? 1 : 0);
          this.A = result & 0xFF;
          break;
        }

        // ADDC A, @Ri (0x70, 0x71)
        case 0x70: case 0x71: {
          const r = this.getIndirect(op & 1);
          const c = this.getCY();
          const result = this.A + r + c;
          this.setAC(((this.A & 0x0F) + (r & 0x0F) + c) > 0x0F ? 1 : 0);
          this.setCY(result > 0xFF ? 1 : 0);
          this.A = result & 0xFF;
          break;
        }

        // ADDC A, #data (0x13)
        case 0x13: {
          const d = this.fetchByte();
          const c = this.getCY();
          const result = this.A + d + c;
          this.setAC(((this.A & 0x0F) + (d & 0x0F) + c) > 0x0F ? 1 : 0);
          this.setCY(result > 0xFF ? 1 : 0);
          this.A = result & 0xFF;
          cyclesUsed = 2;
          break;
        }

        // ANL A, Rn (0x58-0x5F)
        case 0x58: case 0x59: case 0x5A: case 0x5B:
        case 0x5C: case 0x5D: case 0x5E: case 0x5F:
          this.A &= this.getReg(op & 7);
          break;

        // ANL A, @Ri (0x50, 0x51)
        case 0x50: case 0x51:
          this.A &= this.getIndirect(op & 1);
          break;

        // ANL A, #data (0x53)
        case 0x53:
          this.A &= this.fetchByte();
          cyclesUsed = 2;
          break;

        // ANL P1, #data (0x99)
        case 0x99: {
          const d = this.fetchByte();
          this.P1 &= d;
          if (this.portWriteCallback) this.portWriteCallback(1, this.P1);
          cyclesUsed = 2;
          break;
        }

        // ANL P2, #data (0x9A)
        case 0x9A: {
          const d = this.fetchByte();
          this.P2 &= d;
          if (this.portWriteCallback) this.portWriteCallback(2, this.P2);
          cyclesUsed = 2;
          break;
        }

        // ORL A, Rn (0x48-0x4F)
        case 0x48: case 0x49: case 0x4A: case 0x4B:
        case 0x4C: case 0x4D: case 0x4E: case 0x4F:
          this.A |= this.getReg(op & 7);
          break;

        // ORL A, @Ri (0x40, 0x41)
        case 0x40: case 0x41:
          this.A |= this.getIndirect(op & 1);
          break;

        // ORL A, #data (0x43)
        case 0x43:
          this.A |= this.fetchByte();
          cyclesUsed = 2;
          break;

        // ORL P1, #data (0x89)
        case 0x89: {
          const d = this.fetchByte();
          this.P1 |= d;
          if (this.portWriteCallback) this.portWriteCallback(1, this.P1);
          cyclesUsed = 2;
          break;
        }

        // ORL P2, #data (0x8A)
        case 0x8A: {
          const d = this.fetchByte();
          this.P2 |= d;
          if (this.portWriteCallback) this.portWriteCallback(2, this.P2);
          cyclesUsed = 2;
          break;
        }

        // XRL A, Rn (0xD8-0xDF)
        case 0xD8: case 0xD9: case 0xDA: case 0xDB:
        case 0xDC: case 0xDD: case 0xDE: case 0xDF:
          this.A ^= this.getReg(op & 7);
          break;

        // XRL A, @Ri (0xD0, 0xD1)
        case 0xD0: case 0xD1:
          this.A ^= this.getIndirect(op & 1);
          break;

        // XRL A, #data (0xD3)
        case 0xD3:
          this.A ^= this.fetchByte();
          cyclesUsed = 2;
          break;

        // INC A (0x17)
        case 0x17:
          this.A = (this.A + 1) & 0xFF;
          break;

        // INC Rn (0x18-0x1F)
        case 0x18: case 0x19: case 0x1A: case 0x1B:
        case 0x1C: case 0x1D: case 0x1E: case 0x1F:
          this.setReg(op & 7, (this.getReg(op & 7) + 1) & 0xFF);
          break;

        // INC @Ri (0x10, 0x11)
        case 0x10: case 0x11: {
          const addr = this.getReg(op & 1) & 0x3F;
          this.ram[addr] = (this.ram[addr] + 1) & 0xFF;
          break;
        }

        // DEC A (0x07)
        case 0x07:
          this.A = (this.A - 1) & 0xFF;
          break;

        // DEC Rn (0xC8-0xCF)
        case 0xC8: case 0xC9: case 0xCA: case 0xCB:
        case 0xCC: case 0xCD: case 0xCE: case 0xCF:
          this.setReg(op & 7, (this.getReg(op & 7) - 1) & 0xFF);
          break;

        // CLR A (0x27)
        case 0x27:
          this.A = 0;
          break;

        // CPL A (0x37)
        case 0x37:
          this.A = (~this.A) & 0xFF;
          break;

        // DA A (0x57) - Decimal Adjust
        case 0x57: {
          let a = this.A;
          if ((a & 0x0F) > 9 || this.getAC()) {
            a += 6;
            if (a > 0xFF) this.setCY(1);
          }
          if (((a >> 4) & 0x0F) > 9 || this.getCY()) {
            a += 0x60;
            if (a > 0xFF) this.setCY(1);
          }
          this.A = a & 0xFF;
          break;
        }

        // SWAP A (0x47)
        case 0x47:
          this.A = ((this.A & 0x0F) << 4) | ((this.A >> 4) & 0x0F);
          break;

        // RL A (0xE7)
        case 0xE7: {
          const bit7 = (this.A >> 7) & 1;
          this.A = ((this.A << 1) | bit7) & 0xFF;
          break;
        }

        // RLC A (0xF7)
        case 0xF7: {
          const oldCY = this.getCY();
          this.setCY((this.A >> 7) & 1);
          this.A = ((this.A << 1) | oldCY) & 0xFF;
          break;
        }

        // RR A (0x77)
        case 0x77: {
          const bit0 = this.A & 1;
          this.A = ((this.A >> 1) | (bit0 << 7)) & 0xFF;
          break;
        }

        // RRC A (0x67)
        case 0x67: {
          const oldCY = this.getCY();
          this.setCY(this.A & 1);
          this.A = ((this.A >> 1) | (oldCY << 7)) & 0xFF;
          break;
        }

        // MOV A, Rn (0xF8-0xFF)
        case 0xF8: case 0xF9: case 0xFA: case 0xFB:
        case 0xFC: case 0xFD: case 0xFE: case 0xFF:
          this.A = this.getReg(op & 7);
          break;

        // MOV A, @Ri (0xF0, 0xF1)
        case 0xF0: case 0xF1:
          this.A = this.getIndirect(op & 1);
          break;

        // MOV A, #data (0x23)
        case 0x23:
          this.A = this.fetchByte();
          cyclesUsed = 2;
          break;

        // MOV Rn, A (0xA8-0xAF)
        case 0xA8: case 0xA9: case 0xAA: case 0xAB:
        case 0xAC: case 0xAD: case 0xAE: case 0xAF:
          this.setReg(op & 7, this.A);
          break;

        // MOV @Ri, A (0xA0, 0xA1)
        case 0xA0: case 0xA1:
          this.setIndirect(op & 1, this.A);
          break;

        // MOV Rn, #data (0xB8-0xBF)
        case 0xB8: case 0xB9: case 0xBA: case 0xBB:
        case 0xBC: case 0xBD: case 0xBE: case 0xBF:
          this.setReg(op & 7, this.fetchByte());
          cyclesUsed = 2;
          break;

        // MOV @Ri, #data (0xB0, 0xB1)
        case 0xB0: case 0xB1:
          this.setIndirect(op & 1, this.fetchByte());
          cyclesUsed = 2;
          break;

        // MOV A, PSW (0xC7)
        case 0xC7:
          this.A = this.PSW;
          break;

        // MOV PSW, A (0xD7)
        case 0xD7:
          this.PSW = this.A;
          this.regBank = (this.PSW >> 4) & 1;
          break;

        // MOV A, T (0x42) - Read timer
        case 0x42:
          this.A = this.timer;
          break;

        // MOV T, A (0x62) - Write timer
        case 0x62:
          this.timer = this.A;
          break;

        // OUTL P1, A (0x39)
        case 0x39:
          this.P1 = this.A;
          if (this.portWriteCallback) this.portWriteCallback(1, this.P1);
          break;

        // OUTL P2, A (0x3A)
        case 0x3A:
          this.P2 = this.A;
          if (this.portWriteCallback) this.portWriteCallback(2, this.P2);
          break;

        // OUTL BUS, A (0x02)
        case 0x02:
          this.DBB = this.A;
          this.P0 = this.A;
          if (this.portWriteCallback) this.portWriteCallback(0, this.P0);
          break;

        // IN A, P1 (0x09)
        case 0x09:
          if (this.portReadCallback) this.A = this.portReadCallback(1);
          else this.A = this.P1;
          break;

        // IN A, P2 (0x0A)
        case 0x0A:
          if (this.portReadCallback) this.A = this.portReadCallback(2);
          else this.A = this.P2;
          break;

        // INS A, BUS (0x08)
        case 0x08:
          if (this.portReadCallback) this.A = this.portReadCallback(0);
          else this.A = this.P0;
          break;

        // MOVD A, Pp (0x0C, 0x0D, 0x0E, 0x0F) - Read 4 bits from expander port
        case 0x0C: case 0x0D: case 0x0E: case 0x0F:
          this.A = 0x0F; // Default pull-up
          break;

        // MOVD Pp, A (0x3C, 0x3D, 0x3E, 0x3F) - Write 4 bits to expander port
        case 0x3C: case 0x3D: case 0x3E: case 0x3F:
          // Expander port write - not commonly used in Microvision
          break;

        // CLR C (0x97)
        case 0x97:
          this.setCY(0);
          break;

        // CPL C (0xA7)
        case 0xA7:
          this.setCY(this.getCY() ? 0 : 1);
          break;

        // CLR F0 (0x85)
        case 0x85:
          this.setF0(0);
          break;

        // CPL F0 (0x95)
        case 0x95:
          this.setF0(this.getF0() ? 0 : 1);
          break;

        // JMP addr (0x04, 0x24, 0x44, 0x64, 0x84, 0xA4, 0xC4, 0xE4)
        case 0x04: case 0x24: case 0x44: case 0x64:
        case 0x84: case 0xA4: case 0xC4: case 0xE4: {
          const addr = this.fetchByte();
          const page = (op >> 5) & 7;
          this.PC = (page << 8) | addr;
          cyclesUsed = 2;
          break;
        }

        // JMPP @A (0xB3) - Jump indirect from current page
        case 0xB3: {
          const tableAddr = (this.PC & 0x700) | this.A;
          this.PC = (this.PC & 0x700) | this.readROM(tableAddr);
          cyclesUsed = 2;
          break;
        }

        // DJNZ Rn, addr (0xE8-0xEF)
        case 0xE8: case 0xE9: case 0xEA: case 0xEB:
        case 0xEC: case 0xED: case 0xEE: case 0xEF: {
          const addr = this.fetchByte();
          const rn = op & 7;
          let val = (this.getReg(rn) - 1) & 0xFF;
          this.setReg(rn, val);
          if (val !== 0) {
            this.PC = (this.PC & 0x700) | addr;
          }
          cyclesUsed = 2;
          break;
        }

        // JC addr (0xF6)
        case 0xF6: {
          const addr = this.fetchByte();
          if (this.getCY()) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JNC addr (0xE6)
        case 0xE6: {
          const addr = this.fetchByte();
          if (!this.getCY()) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JZ addr (0xC6)
        case 0xC6: {
          const addr = this.fetchByte();
          if (this.A === 0) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JNZ addr (0x96)
        case 0x96: {
          const addr = this.fetchByte();
          if (this.A !== 0) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JT0 addr (0x26)
        case 0x26: {
          const addr = this.fetchByte();
          if (this.T0) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JNT0 addr (0x36)
        case 0x36: {
          const addr = this.fetchByte();
          if (!this.T0) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JT1 addr (0x56)
        case 0x56: {
          const addr = this.fetchByte();
          if (this.T1) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JNT1 addr (0x46)
        case 0x46: {
          const addr = this.fetchByte();
          if (!this.T1) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JF0 addr (0xB6)
        case 0xB6: {
          const addr = this.fetchByte();
          if (this.getF0()) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JF1 addr (0x76)
        case 0x76: {
          const addr = this.fetchByte();
          // F1 flag - not standard on 8021, treat as always false
          cyclesUsed = 2;
          break;
        }

        // JTF addr (0x16) - Jump if timer overflow flag
        case 0x16: {
          const addr = this.fetchByte();
          if (this.timerOverflow) {
            this.PC = (this.PC & 0x700) | addr;
            this.timerOverflow = false;
          }
          cyclesUsed = 2;
          break;
        }

        // JNI addr (0x86) - Jump if INT is active (low)
        case 0x86: {
          const addr = this.fetchByte();
          if (!this.INT) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // JBb addr (0x12, 0x32, 0x52, 0x72, 0x92, 0xB2, 0xD2, 0xF2)
        // Jump if bit b of A is set
        case 0x12: case 0x32: case 0x52: case 0x72:
        case 0x92: case 0xB2: case 0xD2: case 0xF2: {
          const addr = this.fetchByte();
          const bit = (op >> 5) & 7;
          if ((this.A >> bit) & 1) this.PC = (this.PC & 0x700) | addr;
          cyclesUsed = 2;
          break;
        }

        // CALL addr (0x14, 0x34, 0x54, 0x74, 0x94, 0xB4, 0xD4, 0xF4)
        case 0x14: case 0x34: case 0x54: case 0x74:
        case 0x94: case 0xB4: case 0xD4: case 0xF4: {
          const addr = this.fetchByte();
          const page = (op >> 5) & 7;
          this.pushStack();
          this.PC = (page << 8) | addr;
          cyclesUsed = 2;
          break;
        }

        // RET (0x83)
        case 0x83:
          this.popStack();
          cyclesUsed = 2;
          break;

        // RETR (0x93) - Return and restore PSW
        case 0x93:
          this.popStack();
          this.regBank = (this.PSW >> 4) & 1;
          cyclesUsed = 2;
          break;

        // STRT T (0x55) - Start timer
        case 0x55:
          this.timerRunning = true;
          break;

        // STRT CNT (0x45) - Start counter
        case 0x45:
          // Counter mode - count T1 transitions
          this.timerRunning = true;
          break;

        // STOP TCNT (0x65) - Stop timer/counter
        case 0x65:
          this.timerRunning = false;
          break;

        // EN I (0x05) - Enable interrupts
        case 0x05:
          this.interruptsEnabled = true;
          break;

        // DIS I (0x15) - Disable interrupts
        case 0x15:
          this.interruptsEnabled = false;
          break;

        // EN TCNTI (0x25) - Enable timer/counter interrupt
        case 0x25:
          this.timerInterruptEnabled = true;
          break;

        // DIS TCNTI (0x35) - Disable timer/counter interrupt
        case 0x35:
          this.timerInterruptEnabled = false;
          break;

        // SEL RB0 (0xC5)
        case 0xC5:
          this.regBank = 0;
          this.PSW &= ~0x10;
          break;

        // SEL RB1 (0xD5)
        case 0xD5:
          this.regBank = 1;
          this.PSW |= 0x10;
          break;

        // SEL MB0 (0xE5)
        case 0xE5:
          this.memBank = 0;
          break;

        // SEL MB1 (0xF5)
        case 0xF5:
          this.memBank = 1;
          break;

        // MOVP A, @A (0xA3) - Move from current page of ROM
        case 0xA3: {
          const addr = (this.PC & 0x700) | this.A;
          this.A = this.readROM(addr);
          cyclesUsed = 2;
          break;
        }

        // MOVP3 A, @A (0xE3) - Move from page 3 of ROM
        case 0xE3: {
          const addr = 0x300 | this.A;
          this.A = this.readROM(addr);
          cyclesUsed = 2;
          break;
        }

        // XCH A, Rn (0x28-0x2F)
        case 0x28: case 0x29: case 0x2A: case 0x2B:
        case 0x2C: case 0x2D: case 0x2E: case 0x2F: {
          const rn = op & 7;
          const tmp = this.A;
          this.A = this.getReg(rn);
          this.setReg(rn, tmp);
          break;
        }

        // XCH A, @Ri (0x20, 0x21)
        case 0x20: case 0x21: {
          const addr = this.getReg(op & 1) & 0x3F;
          const tmp = this.A;
          this.A = this.ram[addr];
          this.ram[addr] = tmp;
          break;
        }

        // XCHD A, @Ri (0x30, 0x31) - Exchange low nibble
        case 0x30: case 0x31: {
          const addr = this.getReg(op & 1) & 0x3F;
          const aLow = this.A & 0x0F;
          const mLow = this.ram[addr] & 0x0F;
          this.A = (this.A & 0xF0) | mLow;
          this.ram[addr] = (this.ram[addr] & 0xF0) | aLow;
          break;
        }

        // ORLD Pp, A (0x8C, 0x8D, 0x8E, 0x8F)
        case 0x8C: case 0x8D: case 0x8E: case 0x8F:
          break;

        // ANLD Pp, A (0x9C, 0x9D, 0x9E, 0x9F)
        case 0x9C: case 0x9D: case 0x9E: case 0x9F:
          break;

        // MOV A, P1 - not a standard 8021 instruction, but sometimes seen
        // If we encounter unknown opcodes, just NOP them
        default:
          // Unknown opcode - NOP
          // console.warn(`Unknown opcode: 0x${op.toString(16).padStart(2,'0')} at PC=0x${this.lastPC.toString(16).padStart(3,'0')}`);
          break;
      }

      // Timer update (increments every machine cycle when running)
      if (this.timerRunning) {
        this.timer = (this.timer + cyclesUsed) & 0xFF;
        if (this.timer === 0) {
          this.timerOverflow = true;
        }
      }

      this.cycles += cyclesUsed;
      return cyclesUsed;
    }
  }

  // ─── DISASSEMBLER ─────────────────────────────────────────
  const MNEMONICS = {};
  function addMne(op, name, bytes) { MNEMONICS[op] = { name, bytes }; }
  addMne(0x00, 'NOP', 1);
  addMne(0x02, 'OUTL BUS,A', 1);
  addMne(0x03, 'ADD A,#', 2);
  addMne(0x05, 'EN I', 1);
  addMne(0x07, 'DEC A', 1);
  addMne(0x08, 'INS A,BUS', 1);
  addMne(0x09, 'IN A,P1', 1);
  addMne(0x0A, 'IN A,P2', 1);
  addMne(0x13, 'ADDC A,#', 2);
  addMne(0x15, 'DIS I', 1);
  addMne(0x16, 'JTF', 2);
  addMne(0x17, 'INC A', 1);
  addMne(0x23, 'MOV A,#', 2);
  addMne(0x25, 'EN TCNTI', 1);
  addMne(0x27, 'CLR A', 1);
  addMne(0x35, 'DIS TCNTI', 1);
  addMne(0x37, 'CPL A', 1);
  addMne(0x39, 'OUTL P1,A', 1);
  addMne(0x3A, 'OUTL P2,A', 1);
  addMne(0x42, 'MOV A,T', 1);
  addMne(0x43, 'ORL A,#', 2);
  addMne(0x45, 'STRT CNT', 1);
  addMne(0x47, 'SWAP A', 1);
  addMne(0x53, 'ANL A,#', 2);
  addMne(0x55, 'STRT T', 1);
  addMne(0x57, 'DA A', 1);
  addMne(0x62, 'MOV T,A', 1);
  addMne(0x65, 'STOP TCNT', 1);
  addMne(0x67, 'RRC A', 1);
  addMne(0x77, 'RR A', 1);
  addMne(0x83, 'RET', 1);
  addMne(0x85, 'CLR F0', 1);
  addMne(0x89, 'ORL P1,#', 2);
  addMne(0x8A, 'ORL P2,#', 2);
  addMne(0x93, 'RETR', 1);
  addMne(0x95, 'CPL F0', 1);
  addMne(0x96, 'JNZ', 2);
  addMne(0x97, 'CLR C', 1);
  addMne(0x99, 'ANL P1,#', 2);
  addMne(0x9A, 'ANL P2,#', 2);
  addMne(0xA3, 'MOVP A,@A', 1);
  addMne(0xA7, 'CPL C', 1);
  addMne(0xB3, 'JMPP @A', 1);
  addMne(0xC5, 'SEL RB0', 1);
  addMne(0xC6, 'JZ', 2);
  addMne(0xC7, 'MOV A,PSW', 1);
  addMne(0xD3, 'XRL A,#', 2);
  addMne(0xD5, 'SEL RB1', 1);
  addMne(0xD7, 'MOV PSW,A', 1);
  addMne(0xE3, 'MOVP3 A,@A', 1);
  addMne(0xE5, 'SEL MB0', 1);
  addMne(0xE6, 'JNC', 2);
  addMne(0xE7, 'RL A', 1);
  addMne(0xF5, 'SEL MB1', 1);
  addMne(0xF6, 'JC', 2);
  addMne(0xF7, 'RLC A', 1);

  // Range-based opcodes
  for (let i = 0; i < 8; i++) {
    addMne(0x04 | (i << 5), `JMP ${i}`, 2);
    addMne(0x14 | (i << 5), `CALL ${i}`, 2);
    addMne(0x12 | (i << 5), `JB${i}`, 2);
    addMne(0x68 + i, `ADD A,R${i}`, 1);
    addMne(0x78 + i, `ADDC A,R${i}`, 1);
    addMne(0x58 + i, `ANL A,R${i}`, 1);
    addMne(0x48 + i, `ORL A,R${i}`, 1);
    addMne(0xD8 + i, `XRL A,R${i}`, 1);
    addMne(0x18 + i, `INC R${i}`, 1);
    addMne(0xC8 + i, `DEC R${i}`, 1);
    addMne(0xF8 + i, `MOV A,R${i}`, 1);
    addMne(0xA8 + i, `MOV R${i},A`, 1);
    addMne(0xB8 + i, `MOV R${i},#`, 2);
    addMne(0x28 + i, `XCH A,R${i}`, 1);
    addMne(0xE8 + i, `DJNZ R${i}`, 2);
  }
  for (let i = 0; i < 2; i++) {
    addMne(0x60 + i, `ADD A,@R${i}`, 1);
    addMne(0x70 + i, `ADDC A,@R${i}`, 1);
    addMne(0x50 + i, `ANL A,@R${i}`, 1);
    addMne(0x40 + i, `ORL A,@R${i}`, 1);
    addMne(0xD0 + i, `XRL A,@R${i}`, 1);
    addMne(0x10 + i, `INC @R${i}`, 1);
    addMne(0xF0 + i, `MOV A,@R${i}`, 1);
    addMne(0xA0 + i, `MOV @R${i},A`, 1);
    addMne(0xB0 + i, `MOV @R${i},#`, 2);
    addMne(0x20 + i, `XCH A,@R${i}`, 1);
    addMne(0x30 + i, `XCHD A,@R${i}`, 1);
  }
  addMne(0x26, 'JT0', 2);
  addMne(0x36, 'JNT0', 2);
  addMne(0x46, 'JNT1', 2);
  addMne(0x56, 'JT1', 2);
  addMne(0x76, 'JF1', 2);
  addMne(0x86, 'JNI', 2);
  addMne(0xB6, 'JF0', 2);
  for (let i = 0; i < 4; i++) {
    addMne(0x0C + i, `MOVD A,P${4+i}`, 1);
    addMne(0x3C + i, `MOVD P${4+i},A`, 1);
    addMne(0x8C + i, `ORLD P${4+i},A`, 1);
    addMne(0x9C + i, `ANLD P${4+i},A`, 1);
  }

  function disassemble(rom, addr) {
    const op = rom[addr & 0x3FF];
    const info = MNEMONICS[op];
    if (!info) return { text: `??? (0x${op.toString(16).padStart(2, '0')})`, bytes: 1 };
    if (info.bytes === 2) {
      const operand = rom[(addr + 1) & 0x3FF];
      return { text: `${info.name} 0x${operand.toString(16).padStart(2, '0')}`, bytes: 2 };
    }
    return { text: info.name, bytes: 1 };
  }

  // ─── GLOBALS ──────────────────────────────────────────────
  const cpu = new Intel8021();
  let romLoaded = false;
  let romData = null;
  let romFileName = '';
  let emulationState = 'stopped'; // 'running', 'paused', 'stopped'
  let emulationSpeed = prefs.emulationSpeed || 1.0;
  let showBitBang = prefs.showBitBang || false;
  let debugOpen = prefs.debugOpen || false;

  // Display framebuffer 16x16
  const framebuffer = new Uint8Array(16 * 16);
  
  // Bit-bang tracking
  let currentColumn = 0;
  let columnData = new Uint8Array(16);
  let bitBangLog = []; // Track recent port writes

  // Input state
  let paddleValue = 128;
  let buttonPressed = false;

  // Timing
  // The Microvision CPU runs at ~0.1 MHz (100 KHz) effective instruction rate.
  // The Intel 8021 has a 3.58 MHz crystal but divides by 15 internally,
  // giving ~238 KHz machine cycles. The TMS1100 variant runs at ~100 KHz.
  // We use 100 KHz as the effective rate for authentic speed.
  const CPU_FREQ = 100000; // ~0.1 MHz effective (CPU is inside the cartridge!)
  const CYCLES_PER_FRAME = Math.floor(CPU_FREQ / 60); // ~1667 cycles per frame at 60fps
  let frameCount = 0;
  let fpsTimer = 0;
  let fpsCount = 0;
  let lastFPS = 0;

  // Easter egg
  let miltonBuffer = '';

  // ─── DOM REFERENCES ───────────────────────────────────────
  const lcdCanvas = document.getElementById('lcd-canvas');
  const lcdCtx = lcdCanvas.getContext('2d');
  const bitbangCanvas = document.getElementById('bitbang-canvas');
  const bitbangCtx = bitbangCanvas.getContext('2d');

  // ─── PORT CALLBACKS FOR BIT-BANGING ───────────────────────
  // On the real Microvision:
  // - There is NO GPU — the CPU inside the cartridge IS the graphics engine
  // - P1 drives column select (active column scan)
  // - P2 (or BUS/P0) drives row data for each column
  // - The CPU scans all 16 columns rapidly, writing row data to create a full frame
  // - This "bit-banging" means the CPU spends most of its time just driving the display
  // - With only ~0.1 MHz, there's barely enough time for game logic + display refresh
  
  cpu.portWriteCallback = function (port, value) {
    if (port === 1) {
      // P1 write - treat lower 4 bits as column address
      currentColumn = value & 0x0F;
      bitBangLog.push({ port, value, col: currentColumn, type: 'col' });
    }
    if (port === 0 || port === 2) {
      // Row data write for current column
      // Each bit represents a pixel in the current column
      // Write to framebuffer
      for (let row = 0; row < 8; row++) {
        framebuffer[currentColumn * 16 + row] = (value >> row) & 1;
      }
      // For port 2, handle upper rows
      if (port === 2) {
        for (let row = 0; row < 8; row++) {
          framebuffer[currentColumn * 16 + row + 8] = (value >> row) & 1;
        }
      } else {
        // P0/BUS - lower 8 rows
        for (let row = 0; row < 8; row++) {
          framebuffer[currentColumn * 16 + row] = (value >> row) & 1;
        }
      }
      columnData[currentColumn] = value;
      bitBangLog.push({ port, value, col: currentColumn, type: 'row' });
    }
    
    // Keep log manageable
    if (bitBangLog.length > 256) bitBangLog = bitBangLog.slice(-128);
  };

  cpu.portReadCallback = function (port) {
    if (port === 1) {
      // Reading P1 - return paddle value (ADC)
      return paddleValue;
    }
    if (port === 0 || port === 2) {
      // Return button state on bit 0
      return buttonPressed ? 0xFE : 0xFF;
    }
    return 0xFF;
  };

  // ─── LCD RENDERING ────────────────────────────────────────
  const PIXEL_SIZE = 18;
  const PIXEL_GAP = 2;
  const LCD_BG = '#8B9A6B';
  const LCD_DARK = '#0F380F';
  const LCD_LIGHT = '#9dad7a';

  function drawLCD() {
    lcdCtx.fillStyle = LCD_BG;
    lcdCtx.fillRect(0, 0, 320, 320);

    for (let col = 0; col < 16; col++) {
      for (let row = 0; row < 16; row++) {
        const x = col * (PIXEL_SIZE + PIXEL_GAP) + PIXEL_GAP;
        const y = row * (PIXEL_SIZE + PIXEL_GAP) + PIXEL_GAP;
        const on = framebuffer[col * 16 + row];
        
        lcdCtx.fillStyle = on ? LCD_DARK : LCD_LIGHT;
        lcdCtx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
        
        // Slight bevel effect
        if (on) {
          lcdCtx.fillStyle = 'rgba(0,0,0,0.15)';
          lcdCtx.fillRect(x, y + PIXEL_SIZE - 2, PIXEL_SIZE, 2);
          lcdCtx.fillRect(x + PIXEL_SIZE - 2, y, 2, PIXEL_SIZE);
        }
      }
    }
  }

  // ─── OVERLAY SYSTEM ───────────────────────────────────────
  // The Microvision's 16×16 LCD was so low-res that games relied on
  // plastic overlays placed ON TOP of the screen to add:
  // - Colors (the LCD was monochrome)
  // - Static backgrounds and borders
  // - Score areas and UI elements
  // - Game-specific visual context
  
  const overlayCanvas = document.getElementById('overlay-canvas');
  const overlayCtx = overlayCanvas ? overlayCanvas.getContext('2d') : null;
  let overlayActive = false;
  let currentOverlay = 'none';

  const OVERLAY_DESIGNS = {
    blockbuster: {
      name: 'Block Buster',
      draw: function(ctx) {
        ctx.clearRect(0, 0, 320, 320);
        // Colored regions for the bricks area
        const pw = 20; // pixel width in overlay coords
        // Top rows: colored bricks
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(0, 0, 320, pw * 3);
        ctx.fillStyle = '#ff8844';
        ctx.fillRect(0, pw * 3, 320, pw * 3);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(0, pw * 6, 320, pw * 2);
        ctx.fillStyle = '#44cc44';
        ctx.fillRect(0, pw * 8, 320, pw * 2);
        // Bottom area: paddle zone
        ctx.fillStyle = '#4488ff';
        ctx.fillRect(0, pw * 14, 320, pw * 2);
        ctx.globalAlpha = 1.0;
        // Score label
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = 'bold 8px "Press Start 2P"';
        ctx.fillText('SCORE', 4, 316);
      }
    },
    bowling: {
      name: 'Bowling',
      draw: function(ctx) {
        ctx.clearRect(0, 0, 320, 320);
        const pw = 20;
        ctx.globalAlpha = 0.3;
        // Lane
        ctx.fillStyle = '#cd853f';
        ctx.fillRect(pw * 3, 0, pw * 10, 320);
        // Gutters
        ctx.fillStyle = '#444444';
        ctx.fillRect(pw * 2, 0, pw * 1, 320);
        ctx.fillRect(pw * 13, 0, pw * 1, 320);
        // Pin area
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.2;
        ctx.fillRect(pw * 4, 0, pw * 8, pw * 4);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 8px "Press Start 2P"';
        ctx.fillText('PINS', 4, 12);
      }
    },
    connect4: {
      name: 'Connect Four',
      draw: function(ctx) {
        ctx.clearRect(0, 0, 320, 320);
        const pw = 20;
        ctx.globalAlpha = 0.3;
        // Blue board
        ctx.fillStyle = '#2244cc';
        ctx.fillRect(pw, pw * 2, pw * 14, pw * 12);
        // Grid circles (holes)
        ctx.globalCompositeOperation = 'destination-out';
        for (let col = 0; col < 7; col++) {
          for (let row = 0; row < 6; row++) {
            ctx.beginPath();
            ctx.arc(pw * 2.5 + col * pw * 2, pw * 3.5 + row * pw * 2, pw * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
      }
    },
    pinball: {
      name: 'Pinball',
      draw: function(ctx) {
        ctx.clearRect(0, 0, 320, 320);
        const pw = 20;
        ctx.globalAlpha = 0.25;
        // Playfield border
        ctx.strokeStyle = '#ff4488';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pw * 2, 320);
        ctx.lineTo(pw * 1, pw * 4);
        ctx.quadraticCurveTo(pw * 8, -pw, pw * 15, pw * 4);
        ctx.lineTo(pw * 14, 320);
        ctx.stroke();
        // Bumpers
        ctx.fillStyle = '#ff4488';
        ctx.beginPath(); ctx.arc(pw * 6, pw * 5, pw, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(pw * 10, pw * 5, pw, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(pw * 8, pw * 8, pw, 0, Math.PI * 2); ctx.fill();
        // Flippers area
        ctx.fillStyle = '#44aaff';
        ctx.fillRect(pw * 3, pw * 14, pw * 4, pw * 0.5);
        ctx.fillRect(pw * 9, pw * 14, pw * 4, pw * 0.5);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = 'rgba(255,200,255,0.4)';
        ctx.font = 'bold 7px "Press Start 2P"';
        ctx.fillText('SCORE', 4, 316);
        ctx.fillText('BALL', 268, 316);
      }
    },
    custom: {
      name: 'Custom Colors',
      draw: function(ctx) {
        ctx.clearRect(0, 0, 320, 320);
        // Rainbow gradient overlay
        const grad = ctx.createLinearGradient(0, 0, 320, 320);
        grad.addColorStop(0, 'rgba(255,0,0,0.15)');
        grad.addColorStop(0.25, 'rgba(255,165,0,0.15)');
        grad.addColorStop(0.5, 'rgba(0,200,0,0.15)');
        grad.addColorStop(0.75, 'rgba(0,100,255,0.15)');
        grad.addColorStop(1, 'rgba(128,0,255,0.15)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 320, 320);
      }
    }
  };

  function drawOverlay(name) {
    if (!overlayCtx) return;
    const design = OVERLAY_DESIGNS[name];
    if (design) {
      design.draw(overlayCtx);
    } else {
      overlayCtx.clearRect(0, 0, 320, 320);
    }
  }

  // Overlay event handlers
  const overlayToggle = document.getElementById('overlay-toggle');
  const overlaySelect = document.getElementById('overlay-select');
  const plasticOverlay = document.getElementById('plastic-overlay');

  if (overlayToggle) {
    overlayToggle.addEventListener('change', () => {
      overlayActive = overlayToggle.checked;
      if (plasticOverlay) {
        plasticOverlay.classList.toggle('overlay-hidden', !overlayActive);
      }
      if (overlayActive) {
        drawOverlay(overlaySelect.value);
      }
    });
  }

  if (overlaySelect) {
    overlaySelect.addEventListener('change', () => {
      currentOverlay = overlaySelect.value;
      if (overlayActive) {
        drawOverlay(currentOverlay);
      }
    });
  }

  // ─── WELCOME SCREEN ───────────────────────────────────────
  const welcomeText = 'INSERT CARTRIDGE';
  let welcomeScroll = 0;

  // Simple 4x5 pixel font for the LCD
  const PIXEL_FONT = {
    'I': [0x04,0x04,0x04,0x04,0x04],
    'N': [0x11,0x19,0x15,0x13,0x11],
    'S': [0x0E,0x10,0x0E,0x01,0x1E],
    'E': [0x1F,0x10,0x1E,0x10,0x1F],
    'R': [0x1E,0x11,0x1E,0x14,0x12],
    'T': [0x1F,0x04,0x04,0x04,0x04],
    ' ': [0x00,0x00,0x00,0x00,0x00],
    'C': [0x0E,0x11,0x10,0x11,0x0E],
    'A': [0x0E,0x11,0x1F,0x11,0x11],
    'D': [0x1C,0x12,0x11,0x12,0x1C],
    'G': [0x0F,0x10,0x13,0x11,0x0F],
    'L': [0x10,0x10,0x10,0x10,0x1F],
    'M': [0x11,0x1B,0x15,0x11,0x11],
    'O': [0x0E,0x11,0x11,0x11,0x0E],
    'P': [0x1E,0x11,0x1E,0x10,0x10],
    'B': [0x1E,0x11,0x1E,0x11,0x1E],
    'U': [0x11,0x11,0x11,0x11,0x0E],
    'H': [0x11,0x11,0x1F,0x11,0x11],
    'W': [0x11,0x11,0x15,0x1B,0x11],
    'Y': [0x11,0x0A,0x04,0x04,0x04],
    'V': [0x11,0x11,0x0A,0x0A,0x04],
    'X': [0x11,0x0A,0x04,0x0A,0x11],
    'K': [0x12,0x14,0x18,0x14,0x12],
    'F': [0x1F,0x10,0x1E,0x10,0x10],
    'J': [0x01,0x01,0x01,0x11,0x0E],
    'Q': [0x0E,0x11,0x15,0x12,0x0D],
    'Z': [0x1F,0x02,0x04,0x08,0x1F],
    '0': [0x0E,0x13,0x15,0x19,0x0E],
    '1': [0x04,0x0C,0x04,0x04,0x0E],
    '2': [0x0E,0x01,0x06,0x08,0x1F],
    '3': [0x1E,0x01,0x0E,0x01,0x1E],
    '4': [0x12,0x12,0x1F,0x02,0x02],
    '5': [0x1F,0x10,0x1E,0x01,0x1E],
    '6': [0x0E,0x10,0x1E,0x11,0x0E],
    '7': [0x1F,0x01,0x02,0x04,0x04],
    '8': [0x0E,0x11,0x0E,0x11,0x0E],
    '9': [0x0E,0x11,0x0F,0x01,0x0E],
  };

  function drawWelcomeScreen() {
    framebuffer.fill(0);
    const text = welcomeText;
    const charWidth = 6; // 5 pixels + 1 gap
    const totalWidth = text.length * charWidth;
    
    const startX = 16 - Math.floor(welcomeScroll / 2) % (totalWidth + 16);
    
    for (let ci = 0; ci < text.length; ci++) {
      const ch = text[ci];
      const glyph = PIXEL_FONT[ch] || PIXEL_FONT[' '];
      const cx = startX + ci * charWidth;
      
      for (let px = 0; px < 5; px++) {
        const col = cx + px;
        if (col < 0 || col >= 16) continue;
        for (let py = 0; py < 5; py++) {
          if ((glyph[py] >> (4 - px)) & 1) {
            framebuffer[col * 16 + (5 + py)] = 1;
          }
        }
      }
    }
    
    welcomeScroll++;
    if (welcomeScroll > (totalWidth + 16) * 2) welcomeScroll = 0;
  }

  // Milton Bradley easter egg
  function drawMiltonLogo() {
    framebuffer.fill(0);
    const logo = [
      '..####..####..',
      '.#....##....#.',
      '#..MILTON.B..#',
      '#............#',
      '.#..........#.',
      '..##########..',
    ];
    // Simple "MB" in center
    // M
    const mGlyph = PIXEL_FONT['M'];
    const bGlyph = PIXEL_FONT['B'];
    for (let px = 0; px < 5; px++) {
      for (let py = 0; py < 5; py++) {
        if ((mGlyph[py] >> (4 - px)) & 1) framebuffer[(3 + px) * 16 + (5 + py)] = 1;
        if ((bGlyph[py] >> (4 - px)) & 1) framebuffer[(9 + px) * 16 + (5 + py)] = 1;
      }
    }
    // Border
    for (let i = 0; i < 16; i++) {
      framebuffer[i * 16 + 0] = 1;
      framebuffer[i * 16 + 15] = 1;
      framebuffer[0 * 16 + i] = 1;
      framebuffer[15 * 16 + i] = 1;
    }
  }

  // ─── BIT-BANG VISUALIZATION ───────────────────────────────
  function drawBitBang() {
    if (!showBitBang) return;
    const ctx = bitbangCtx;
    const w = 200, h = 200;
    ctx.fillStyle = '#0a0a18';
    ctx.fillRect(0, 0, w, h);

    // Draw 16x16 grid showing which column is currently active
    const cellW = 11;
    const cellH = 11;
    const ox = 6, oy = 6;

    for (let col = 0; col < 16; col++) {
      for (let row = 0; row < 16; row++) {
        const x = ox + col * cellW;
        const y = oy + row * cellH;
        const on = framebuffer[col * 16 + row];
        
        if (col === currentColumn) {
          ctx.fillStyle = on ? '#ff6644' : '#442211';
        } else {
          ctx.fillStyle = on ? '#44cc44' : '#112211';
        }
        ctx.fillRect(x, y, cellW - 1, cellH - 1);
      }
    }

    // Column indicator
    ctx.fillStyle = '#ffb347';
    ctx.font = '9px JetBrains Mono';
    ctx.fillText(`Col: ${currentColumn}  P1: 0x${cpu.P1.toString(16).padStart(2, '0')}  P0: 0x${cpu.P0.toString(16).padStart(2, '0')}`, 6, h - 6);
  }

  // ─── DEBUG PANEL UPDATE ───────────────────────────────────
  function hex8(v) { return '0x' + (v & 0xFF).toString(16).toUpperCase().padStart(2, '0'); }
  function hex10(v) { return '0x' + (v & 0x3FF).toString(16).toUpperCase().padStart(3, '0'); }
  function bin8(v) { return (v & 0xFF).toString(2).padStart(8, '0'); }

  function updateDebugPanel() {
    if (!debugOpen) return;

    // Registers
    const regEl = document.getElementById('reg-display');
    regEl.innerHTML = [
      `<span class="label">A:  </span><span class="value">${hex8(cpu.A)}</span>  <span class="label">PC: </span><span class="value">${hex10(cpu.PC)}</span>`,
      `<span class="label">PSW:</span><span class="value">${hex8(cpu.PSW)}</span>  <span class="label">SP: </span><span class="value">${cpu.stackPtr}</span>`,
      `<span class="label">TMR:</span><span class="value">${hex8(cpu.timer)}</span>  <span class="label">CY: </span><span class="value">${cpu.getCY()}</span>  <span class="label">F0: </span><span class="value">${cpu.getF0()}</span>`,
      `<span class="label">R0-R3:</span> <span class="value">${hex8(cpu.getReg(0))} ${hex8(cpu.getReg(1))} ${hex8(cpu.getReg(2))} ${hex8(cpu.getReg(3))}</span>`,
      `<span class="label">R4-R7:</span> <span class="value">${hex8(cpu.getReg(4))} ${hex8(cpu.getReg(5))} ${hex8(cpu.getReg(6))} ${hex8(cpu.getReg(7))}</span>`,
    ].join('<br>');

    // Ports
    const portEl = document.getElementById('port-display');
    portEl.innerHTML = [
      `<span class="label">P0: </span>${colorBits(cpu.P0)}  <span class="label">${hex8(cpu.P0)}</span>`,
      `<span class="label">P1: </span>${colorBits(cpu.P1)}  <span class="label">${hex8(cpu.P1)}</span>`,
      `<span class="label">P2: </span>${colorBits(cpu.P2)}  <span class="label">${hex8(cpu.P2)}</span>`,
    ].join('<br>');

    // Disassembly
    const disasmEl = document.getElementById('disasm-view');
    let html = '';
    let addr = Math.max(0, cpu.PC - 6);
    for (let i = 0; i < 16; i++) {
      const d = disassemble(cpu.rom, addr);
      const isCurrent = (addr === cpu.PC);
      const cls = isCurrent ? ' class="disasm-current"' : '';
      const hexBytes = [];
      for (let b = 0; b < d.bytes; b++) hexBytes.push(cpu.rom[(addr + b) & 0x3FF].toString(16).padStart(2, '0'));
      html += `<div${cls}>${hex10(addr)}: ${hexBytes.join(' ').padEnd(6)} ${d.text}</div>`;
      addr = (addr + d.bytes) & 0x3FF;
    }
    disasmEl.innerHTML = html;

    // RAM
    const ramEl = document.getElementById('ram-display');
    let ramHtml = '';
    for (let row = 0; row < 8; row++) {
      let line = `${(row * 8).toString(16).padStart(2, '0')}: `;
      for (let col = 0; col < 8; col++) {
        line += cpu.ram[row * 8 + col].toString(16).padStart(2, '0') + ' ';
      }
      ramHtml += line + '\n';
    }
    ramEl.textContent = ramHtml;

    // Clock
    const clockEl = document.getElementById('clock-display');
    clockEl.innerHTML = [
      `<span class="label">Cycles:  </span><span class="value">${cpu.cycles.toLocaleString()}</span>`,
      `<span class="label">Instrs:  </span><span class="value">${cpu.instructionsExecuted.toLocaleString()}</span>`,
      `<span class="label">Speed:   </span><span class="value">${emulationSpeed.toFixed(1)}x</span>`,
      `<span class="label">Note:    </span><span class="value" style="color:#ff6b35;font-size:9px">CPU is in cartridge, no GPU</span>`,
    ].join('<br>');
  }

  function colorBits(val) {
    let s = '';
    for (let i = 7; i >= 0; i--) {
      const on = (val >> i) & 1;
      s += `<span class="${on ? 'port-bit-on' : 'port-bit-off'}">${on}</span>`;
    }
    return s;
  }

  // ─── EMULATION LOOP ───────────────────────────────────────
  let lastTime = 0;
  let miltonFlashTimer = 0;

  function mainLoop(timestamp) {
    requestAnimationFrame(mainLoop);

    const dt = timestamp - lastTime;
    lastTime = timestamp;

    // FPS
    fpsTimer += dt;
    fpsCount++;
    if (fpsTimer >= 1000) {
      lastFPS = fpsCount;
      fpsCount = 0;
      fpsTimer -= 1000;
      document.getElementById('fps-display').textContent = `${lastFPS} FPS`;
    }

    // Milton easter egg flash
    if (miltonFlashTimer > 0) {
      miltonFlashTimer -= dt;
      if (miltonFlashTimer <= 0) miltonFlashTimer = 0;
      drawMiltonLogo();
      drawLCD();
      return;
    }

    if (emulationState === 'running' && romLoaded) {
      // Execute appropriate number of cycles for this frame
      const cyclesToRun = Math.floor(CYCLES_PER_FRAME * emulationSpeed * (dt / 16.67));
      let cyclesRun = 0;
      const maxCycles = Math.min(cyclesToRun, 500000); // Safety cap
      
      while (cyclesRun < maxCycles) {
        cyclesRun += cpu.step();
        if (cpu.halted) break;
      }
    } else if (!romLoaded && miltonFlashTimer <= 0) {
      drawWelcomeScreen();
    }

    drawLCD();

    if (showBitBang) drawBitBang();

    frameCount++;
    if (frameCount % 6 === 0) updateDebugPanel();

    // Status
    document.getElementById('emu-status').textContent =
      !romLoaded ? 'No ROM Loaded' :
      emulationState === 'running' ? 'Running' :
      emulationState === 'paused' ? 'Paused' : 'Stopped';
  }

  // ─── ROM LOADING ──────────────────────────────────────────
  function loadROM(data, filename) {
    romData = new Uint8Array(data);
    romFileName = filename || 'unknown.bin';
    romLoaded = true;

    cpu.reset();
    cpu.loadROM(romData);
    framebuffer.fill(0);

    // Update UI
    document.getElementById('drop-zone').style.display = 'none';
    document.getElementById('rom-info').style.display = 'block';
    document.getElementById('rom-name').textContent = romFileName;
    document.getElementById('rom-size').textContent = romData.length;

    // Hex preview
    const preview = Array.from(romData.slice(0, 32))
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
    document.getElementById('hex-preview').textContent = preview;

    document.getElementById('rom-status-name').textContent = romFileName;
    document.getElementById('cartridge-icon').innerHTML = '▓▓▓▓▓▓<br>║CPU✓║<br>▓▓▓▓▓▓';

    // Save to localStorage
    try {
      const b64 = btoa(String.fromCharCode(...romData));
      localStorage.setItem(ROM_KEY, b64);
      localStorage.setItem(ROM_NAME_KEY, romFileName);
    } catch (e) { /* ROM too large for localStorage */ }

    emulationState = 'running';
  }

  function ejectROM() {
    romLoaded = false;
    romData = null;
    romFileName = '';
    emulationState = 'stopped';
    cpu.reset();
    framebuffer.fill(0);

    document.getElementById('drop-zone').style.display = 'block';
    document.getElementById('rom-info').style.display = 'none';
    document.getElementById('rom-status-name').textContent = '—';
    document.getElementById('cartridge-icon').innerHTML = '▓▓▓▓▓▓<br>║ ROM ║<br>▓▓▓▓▓▓';

    localStorage.removeItem(ROM_KEY);
    localStorage.removeItem(ROM_NAME_KEY);
  }

  // ─── EVENT HANDLERS ───────────────────────────────────────

  // File input
  document.getElementById('load-btn').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });

  document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadROM(reader.result, file.name);
    reader.readAsArrayBuffer(file);
  });

  // Drag and drop
  const dropZone = document.getElementById('drop-zone');
  const romUpload = document.getElementById('rom-upload-area');

  ['dragenter', 'dragover'].forEach(evt => {
    romUpload.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    romUpload.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    });
  });

  romUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadROM(reader.result, file.name);
    reader.readAsArrayBuffer(file);
  });

  // Reset / Eject
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (romData) {
      cpu.reset();
      cpu.loadROM(romData);
      framebuffer.fill(0);
      emulationState = 'running';
    }
  });

  document.getElementById('eject-btn').addEventListener('click', ejectROM);

  // Paddle control
  const paddleTrack = document.getElementById('paddle-track');
  const paddleKnob = document.getElementById('paddle-knob');
  let paddleDragging = false;

  function updatePaddleUI() {
    const pct = paddleValue / 255;
    const trackW = paddleTrack.offsetWidth;
    const knobW = paddleKnob.offsetWidth;
    paddleKnob.style.left = (pct * (trackW - knobW)) + 'px';
    document.getElementById('paddle-value').textContent = paddleValue;
  }

  function handlePaddleMove(clientX) {
    const rect = paddleTrack.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    paddleValue = Math.round(pct * 255);
    updatePaddleUI();
  }

  paddleTrack.addEventListener('mousedown', (e) => {
    paddleDragging = true;
    handlePaddleMove(e.clientX);
  });

  document.addEventListener('mousemove', (e) => {
    if (paddleDragging) handlePaddleMove(e.clientX);
  });

  document.addEventListener('mouseup', () => { paddleDragging = false; });

  // Touch support
  paddleTrack.addEventListener('touchstart', (e) => {
    paddleDragging = true;
    handlePaddleMove(e.touches[0].clientX);
    e.preventDefault();
  });

  document.addEventListener('touchmove', (e) => {
    if (paddleDragging) {
      handlePaddleMove(e.touches[0].clientX);
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', () => { paddleDragging = false; });

  // Action button
  const actionBtn = document.getElementById('action-btn');
  actionBtn.addEventListener('mousedown', () => { buttonPressed = true; actionBtn.classList.add('pressed'); });
  actionBtn.addEventListener('mouseup', () => { buttonPressed = false; actionBtn.classList.remove('pressed'); });
  actionBtn.addEventListener('mouseleave', () => { buttonPressed = false; actionBtn.classList.remove('pressed'); });
  actionBtn.addEventListener('touchstart', (e) => { buttonPressed = true; actionBtn.classList.add('pressed'); e.preventDefault(); });
  actionBtn.addEventListener('touchend', () => { buttonPressed = false; actionBtn.classList.remove('pressed'); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        paddleValue = Math.max(0, paddleValue - 8);
        updatePaddleUI();
        e.preventDefault();
        break;
      case 'ArrowRight':
        paddleValue = Math.min(255, paddleValue + 8);
        updatePaddleUI();
        e.preventDefault();
        break;
      case ' ':
      case 'Enter':
        buttonPressed = true;
        actionBtn.classList.add('pressed');
        e.preventDefault();
        break;
    }

    // Easter egg detection
    miltonBuffer += e.key.toUpperCase();
    if (miltonBuffer.length > 10) miltonBuffer = miltonBuffer.slice(-10);
    if (miltonBuffer.includes('MILTON')) {
      miltonFlashTimer = 2000;
      miltonBuffer = '';
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      buttonPressed = false;
      actionBtn.classList.remove('pressed');
    }
  });

  // Debug panel toggle
  const debugToggle = document.getElementById('debug-toggle');
  const debugPanel = document.getElementById('debug-panel');

  debugToggle.addEventListener('click', () => {
    debugOpen = !debugOpen;
    debugPanel.style.display = debugOpen ? 'block' : 'none';
    debugToggle.textContent = debugOpen ? 'CPU Inspector ▼' : 'CPU Inspector ▶';
    prefs.debugOpen = debugOpen;
    savePrefs(prefs);
  });

  // Initialize debug panel state
  if (debugOpen) {
    debugPanel.style.display = 'block';
    debugToggle.textContent = 'CPU Inspector ▼';
  }

  // Emulation controls
  document.getElementById('run-btn').addEventListener('click', () => {
    if (romLoaded) emulationState = 'running';
  });

  document.getElementById('pause-btn').addEventListener('click', () => {
    emulationState = 'paused';
  });

  document.getElementById('step-btn').addEventListener('click', () => {
    if (romLoaded) {
      emulationState = 'paused';
      cpu.step();
      updateDebugPanel();
    }
  });

  document.getElementById('cpu-reset-btn').addEventListener('click', () => {
    if (romData) {
      cpu.reset();
      cpu.loadROM(romData);
      framebuffer.fill(0);
      updateDebugPanel();
    }
  });

  // Speed slider
  const speedSlider = document.getElementById('speed-slider');
  const speedLabel = document.getElementById('speed-label');
  speedSlider.value = Math.round(emulationSpeed * 10);

  speedSlider.addEventListener('input', () => {
    emulationSpeed = speedSlider.value / 10;
    speedLabel.textContent = emulationSpeed.toFixed(1) + 'x';
    prefs.emulationSpeed = emulationSpeed;
    savePrefs(prefs);
  });

  // Bit-bang toggle
  const bitbangToggle = document.getElementById('bitbang-toggle');
  const bitbangView = document.getElementById('bitbang-view');
  bitbangToggle.checked = showBitBang;
  bitbangView.style.display = showBitBang ? 'block' : 'none';

  bitbangToggle.addEventListener('change', () => {
    showBitBang = bitbangToggle.checked;
    bitbangView.style.display = showBitBang ? 'block' : 'none';
    prefs.showBitBang = showBitBang;
    savePrefs(prefs);
  });

  // ─── RESTORE LAST ROM ────────────────────────────────────
  try {
    const savedROM = localStorage.getItem(ROM_KEY);
    const savedName = localStorage.getItem(ROM_NAME_KEY);
    if (savedROM) {
      const binary = atob(savedROM);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      loadROM(bytes.buffer, savedName || 'restored.bin');
    }
  } catch (e) { /* ignore */ }

  // ─── INITIALIZE ───────────────────────────────────────────
  updatePaddleUI();
  drawLCD();
  requestAnimationFrame(mainLoop);


  // GenX-DOS bridge: expose loadROM + autoload from ?game=
  window.__mvLoadROM = loadROM;
  (function autoloadFromQuery() {
    const params = new URLSearchParams(location.search);
    const game = params.get('game');
    if (!game) return;
    fetch('roms/' + game + '.bin')
      .then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error('HTTP ' + r.status)))
      .then(buf => loadROM(buf, game + '.bin'))
      .catch(e => console.warn('GenX-DOS autoload failed:', e));
  })();
})();