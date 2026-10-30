// SPDX-License-Identifier: GPL-3.0-or-later
// Grundy NewBrain AD — system: CPU, machine and the hardware timers that tie
// them together. See ATTRIBUTION.md for sources.

import { Z80 } from './vendor/Z80.js';
import { NewBrain } from './newbrain.js';

export const CPU_HZ = 16000000 / 4;   // 4 MHz Z80A

// PWRUP is not software controlled: it rises on an RC time constant,
// R129 * C127 = 560K * 10uF = 5.6s. Until it does, every memory access
// decodes as bank 7, so the CPU runs entirely out of the EF ROM.
export const PWRUP_SECONDS = 5.6;

// The clock interrupt is cleared at 50Hz and re-armed by touching CLCLK.
const CLKINT_HZ = 50;

export class NewBrainSystem {
  constructor(roms, opts = {}) {
    this.machine = new NewBrain(roms, opts);

    this.cpu = new Z80({
      mem_read:  a => this.machine.read(a),
      mem_write: (a, v) => this.machine.write(a, v),
      io_read:   p => this.machine.ioRead(p),
      io_write:  (p, v) => this.machine.ioWrite(p, v),
    });

    this.reset();
  }

  reset() {
    this.machine.reset();
    this.cpu.reset();
    this.cycles = 0;
    this.pwrupAt = PWRUP_SECONDS * CPU_HZ;
    this.nextClkint = CPU_HZ / CLKINT_HZ;
  }

  get seconds() { return this.cycles / CPU_HZ; }

  // Runs until `count` T-cycles have elapsed. Returns instructions executed.
  run(count) {
    const target = this.cycles + count;
    let instructions = 0;

    while (this.cycles < target) {
      const used = this.cpu.run_instruction();
      this.cycles += used;
      this.machine.stepCop(used);
      instructions++;

      if (!this.machine.pwrup && this.cycles >= this.pwrupAt) {
        this.machine.pwrup = 1;
      }

      if (this.cycles >= this.nextClkint) {
        this.nextClkint += CPU_HZ / CLKINT_HZ;
        this.machine.clkint = 0;
        this.machine.checkInterrupt();
      }

      if (this.machine.irq) {
        this.cpu.interrupt(false, 0);
      }
    }
    return instructions;
  }

  runFrame() { return this.run(CPU_HZ / 50); }

  get pc() { return this.cpu.getState().pc; }
  get state() { return this.cpu.getState(); }
}
