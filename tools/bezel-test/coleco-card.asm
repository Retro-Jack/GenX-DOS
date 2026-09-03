; Bezel test card for the ColecoVision -> systems/coleco/bezelcard.col
;
; The ColecoVision cannot be typed into, so its card is a cartridge — the same
; approach the Apple ][ and Apple I use.
;
; This card blanks the display and sets the TMS9918 backdrop to white, so the
; whole addressable area comes up solid white. That is enough for the bezel
; check: it shows exactly how far the picture reaches, and any letterbox or
; gap appears as black or wallpaper beside it.
;
; Why not the usual white-border-on-black frame? Two things got in the way.
; gearcoleco renders only the 256x192 active area, so the backdrop border a
; real set would show is cropped away — a border-register card shows nothing.
; Drawing the frame in the name table instead assembles and loads correctly
; but comes up black, and that is not yet solved; the tables are written but
; something in the Graphics I setup is wrong. The blanked-backdrop form below
; is verified working, so it is what ships.
;
; A valid stack matters: the BIOS enables the VDP interrupt, which is wired to
; NMI here, so one can fire between the jump into the cartridge and the moment
; the display is reconfigured.
;
; Assemble:  sjasmplus --raw=../../systems/coleco/bezelcard.col coleco-card.asm

                DEVICE NOSLOT64K
                ORG $8000

                DB  $55,$AA             ; skip the BIOS title screen
                DW  $0000               ; sprite name table
                DW  $0000               ; sprite order table
                DW  $7000               ; work buffer
                DW  $0000               ; controller map
                DW  start               ; entry point
                JP  isr                 ; RST 08
                JP  isr                 ; RST 10
                JP  isr                 ; RST 18
                JP  isr                 ; RST 20
                JP  isr                 ; RST 28
                JP  isr                 ; RST 30
                JP  isr                 ; RST 38
                JP  isr                 ; NMI (vertical retrace)
isr:            retn

start:          di
                ld   sp,$7400           ; Coleco RAM, mirrored from $6000

                ld   a,$80              ; R1: 16K, display blanked, ints off
                out  ($BF),a
                ld   a,$81
                out  ($BF),a

                ld   a,$0F              ; R7: backdrop = white
                out  ($BF),a
                ld   a,$87
                out  ($BF),a

stop:           jr   stop

                DS $A000-$, $FF         ; pad to a full 8K cartridge
