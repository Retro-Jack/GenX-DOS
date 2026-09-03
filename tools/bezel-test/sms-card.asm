; Bezel test card for the Sega Master System and Game Gear
;   -> systems/sms/bezelcard.sms  and  systems/gamegear/bezelcard.gg
;
; Neither console can be typed into, so the card is a cartridge.
;
; Same shape as the ColecoVision card: blank the display and set the backdrop
; to white, so the whole addressable picture comes up solid white and shows
; exactly how far it reaches. On a blanked Sega VDP the backdrop fills the
; screen, so this needs no name table, no tiles and no timing care.
;
; The backdrop colour is R7's low nibble, indexing the SPRITE half of CRAM
; (entries 16..31), so CRAM entry 16 is the one to set. SMS colour bytes are
; --BBGGRR, two bits per gun, so $3F is full white.
;
; Assemble:
;   sjasmplus --raw=../../systems/sms/bezelcard.sms sms-card.asm
;   sjasmplus --raw=../../systems/gamegear/bezelcard.gg sms-card.asm

VDP_DATA        equ $BE
VDP_CTRL        equ $BF

                DEVICE NOSLOT64K
                ORG $0000
                di
                im   1
                jp   start

                ; Pad rather than ORG to the vectors: a bare ORG makes sjasmplus
                ; SKIP those bytes in a --raw file instead of filling them, which
                ; shifts everything after it and produces a broken ROM (the first
                ; build of this card was 93 bytes short for exactly that reason).
                DS $0038-$, $FF
                ei                      ; maskable interrupt (VDP line/frame)
                reti

                DS $0066-$, $FF
                retn                    ; NMI — the PAUSE button

start:          ld   sp,$DFF0           ; top of the SMS work RAM

                ; CRAM entry 16 (first sprite colour) = white
                ld   a,$10
                out  (VDP_CTRL),a
                ld   a,$C0              ; $C0 = write to CRAM
                out  (VDP_CTRL),a
                ld   a,$3F              ; --BBGGRR all on
                out  (VDP_DATA),a

                ; VDP registers: R0 mode 4, R1 display OFF (screen shows the
                ; backdrop), R7 backdrop = sprite colour 0 -> CRAM 16
                ld   hl,vdpregs
                ld   b,11
                ld   c,0
regloop:        ld   a,(hl)
                out  (VDP_CTRL),a
                ld   a,c
                or   $80
                out  (VDP_CTRL),a
                inc  hl
                inc  c
                djnz regloop

stop:           jr   stop

vdpregs:        DB $04                  ; R0  mode 4
                DB $80                  ; R1  display off, no frame interrupt
                DB $FF                  ; R2  name table
                DB $FF                  ; R3  unused in mode 4
                DB $FF                  ; R4  unused in mode 4
                DB $FF                  ; R5  sprite attribute table
                DB $FB                  ; R6  sprite patterns
                DB $00                  ; R7  backdrop = CRAM 16 (white)
                DB $00                  ; R8  horizontal scroll
                DB $00                  ; R9  vertical scroll
                DB $FF                  ; R10 line counter off

                DS $8000-$, $FF         ; pad to a 32K cartridge
