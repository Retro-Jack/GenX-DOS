REM Typed at the Disk BASIC prompt (boot ?game=trsdos, answer the date/time
REM prompts, type BASIC, Enter through "How Many Files?" and "Memory Size?").
REM Colons do NOT survive synthetic typing on sdltrs, so every statement gets
REM its own line rather than "FOR X=0 TO 127: SET(X,0): NEXT".
10 CLS
20 FOR X=0 TO 127
30 SET(X,0)
40 SET(X,47)
50 NEXT
60 FOR Y=0 TO 47
70 SET(0,Y)
80 SET(127,Y)
90 NEXT
100 GOTO 100
