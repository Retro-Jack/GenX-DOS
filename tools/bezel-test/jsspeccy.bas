REM Typed as three direct commands, not a program. In K mode each of these
REM is ONE keypress: B = BORDER, O = POKE, V = CLS.
REM   B 7            ENTER   -> BORDER 7 (white)
REM   O 23693,0      ENTER   -> POKE 23693,0  (ATTR-P: black ink on black paper)
REM   V              ENTER   -> CLS
REM PAPER is not reachable from K mode at all, which is why the permanent
REM attribute byte at 23693 is poked instead.
BORDER 7
POKE 23693,0
CLS
