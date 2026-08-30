10 REM Apple I: 40x24 text, no inverse video and no graphics, so a solid
20 REM white edge is not possible. An asterisk frame is the closest thing
30 REM available and still marks the addressable edge for a bezel check.
40 FOR I=1 TO 40: PRINT "*";: NEXT
50 FOR R=2 TO 23: PRINT "*"; TAB(40); "*": NEXT
60 FOR I=1 TO 40: PRINT "*";: NEXT
70 END
