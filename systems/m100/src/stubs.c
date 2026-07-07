/* stubs.c — GenX-DOS WASM port of VirtualT.
 *
 * No-op implementations of the peripheral / GUI modules we don't build for the
 * browser: the RTC clock chips, the parallel printer, the T200 dock, the
 * remote-debug server, and the FLTK setup/preferences entry point. None are
 * needed to boot the Model 100 or run games. Exactly the symbol set emcc
 * reported still-undefined after the core + headless display link.
 *
 * (C linkage: exact parameter types don't affect linking, and this file
 * includes none of the module headers, so no prototype conflict.)
 */

/* Data symbols the core references from the modules we don't build.
 * setup: the peripheral config struct (io.c reads setup.com_mode); zero-init
 * means com_mode == SETUP_COM_NONE, i.e. serial off — the right headless default.
 */
#include "setup.h"
peripheral_setup_t setup;

/* --- The M100's uPD1990AC RTC lives in clock_headless.c (real host time, so
 * TIME$ advances). Only the T200's rp5c01 stays stubbed — the M100 never uses
 * it. Signatures MUST match clock.h exactly or wasm calls trap. --- */
unsigned char rp5c01_read(unsigned char val) { (void)val; return 0; }
void rp5c01_write(unsigned char port, unsigned char val) { (void)port; (void)val; }

/* --- Parallel printer (lpt.cpp) --- */
void send_to_lpt(unsigned char byte) { (void)byte; }
void lpt_perodic_update(void) {}
void lpt_check_errors(void) {}
void handle_lpt_timeout(void) {}
void periph_mon_update_lpt_log(void) {}

/* --- Remote-debug server (remote.cpp) --- */
void lock_remote(void) {}
void unlock_remote(void) {}

/* --- Parallel printer init/deinit (lpt.cpp) --- */
void init_lpt(void) {}
void deinit_lpt(void) {}

/* --- Remote-debug server init (remote.cpp) --- */
void init_remote(void) {}
void set_remote_cmdline_port(int port) { (void)port; }
void set_remote_cmdline_telnet(int on) { (void)on; }

/* --- Preferences loaders (setup.cpp / rememcfg.cpp) — headless uses defaults --- */
void load_setup_preferences(void) {}
void load_memory_preferences(void) {}
void load_remote_preferences(void) {}

/* --- Memory config struct (setup.cpp), not a function; zero-init defaults --- */
memory_setup_t mem_setup;

/* --- Model time-of-day persistence (clock.cpp) — both void per clock.h --- */
void get_model_time(void) {}
void save_model_time(void) {}

/* --- T200 dock (tdock.cpp) — signatures per tdock.h --- */
unsigned char tdock_read(void) { return 0; }
void tdock_write(unsigned char device, unsigned char data) { (void)device; (void)data; }

/* --- TPDD disk drive over serial (tpddserver.cpp). Never reached at runtime:
 * setup.com_mode is zero (SETUP_COM_NONE), so the serial/TPDD path is off.
 * Present only to satisfy the link. --- */
void *tpdd_alloc_context(void) { return 0; }
void  tpdd_free_context(void *c) { (void)c; }
void  tpdd_open_serial(void *c) { (void)c; }
void  tpdd_close_serial(void *c) { (void)c; }
void  tpdd_load_prefs(void *c) { (void)c; }
int   tpdd_ser_poll(void *c) { (void)c; return 0; }
int   tpdd_ser_read_byte(void *c) { (void)c; return 0; }
void  tpdd_ser_write_byte(void *c, int b) { (void)c; (void)b; }
void  tpdd_ser_set_baud(void *c, int b) { (void)c; (void)b; }
void  tpdd_ser_set_signals(void *c, int s) { (void)c; (void)s; }
int   tpdd_ser_get_flags(void *c) { (void)c; return 0; }

/* --- FLTK file viewer (fileview.cpp) — the loader pokes it to refresh the UI --- */
void fileview_model_changed(void) {}
