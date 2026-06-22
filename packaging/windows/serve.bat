@echo off
title GenX-DOS
cd /d "%~dp0site"
echo.
echo   GenX-DOS  -  http://127.0.0.1:8765/
echo.
echo   Your browser will open in a moment.
echo   Keep this window open while you play; close it to stop GenX-DOS.
echo.
start "" "http://127.0.0.1:8765/"
where py >nul 2>&1 && goto :py
where python >nul 2>&1 && goto :python
echo   Python was not found on this PC. Re-run the GenX-DOS installer, or
echo   install Python 3 from https://www.python.org/ and try again.
echo.
pause
goto :eof
:py
py -m http.server 8765
goto :eof
:python
python -m http.server 8765
goto :eof
