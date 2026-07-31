@echo off
setlocal EnableDelayedExpansion
REM Launch a local web server in the repo root and open the landing page in a browser.
REM Closing the browser window stops the server (Edge/Chrome); otherwise press a key.
REM Usage: GenX-DOS.bat [port]

set "PORT=%~1"
if "%PORT%"=="" set "PORT=8765"
set "HOST=127.0.0.1"

cd /d "%~dp0"

REM Locate Python (py launcher preferred, then python / python3).
set "PY="
where py       >nul 2>&1 && set "PY=py -3"
if not defined PY ( where python  >nul 2>&1 && set "PY=python"  )
if not defined PY ( where python3 >nul 2>&1 && set "PY=python3" )
if not defined PY (
    echo python is required but was not found.>&2
    pause
    exit /b 1
)

REM If the chosen port is taken, fall back to a random free port in the IANA
REM dynamic range (49152-65535) rather than giving up.
call :port_busy %PORT%
if "!BUSY!"=="1" (
    echo Port %PORT% is in use - selecting a free port...>&2
    set "ORIG_PORT=%PORT%"
    set "PORT="
    for /l %%i in (1,1,50) do (
        if not defined PORT (
            set /a "CAND=49152 + (!RANDOM! %% 16384)"
            call :port_busy !CAND!
            if "!BUSY!"=="0" set "PORT=!CAND!"
        )
    )
    if not defined PORT (
        echo Could not find a free port after 50 attempts.>&2
        pause
        exit /b 1
    )
    echo Using port !PORT! instead of !ORIG_PORT!.>&2
)

set "URL=http://%HOST%:!PORT!/"
echo Serving GenX-DOS on !URL!

REM Start the server in the background, then give it a moment to come up.
start "" /b %PY% -m http.server !PORT! --bind %HOST% >nul 2>&1
ping -n 2 127.0.0.1 >nul

REM Prefer a dedicated Edge/Chrome window (its own profile is a process we can
REM wait on), so closing the browser stops the server. Otherwise open the default
REM browser and wait for a keypress here.
set "BROWSER="
for %%B in (
    "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
    "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
    "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
    "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
    "%LocalAppData%\Google\Chrome\Application\chrome.exe"
) do if not defined BROWSER if exist "%%~B" set "BROWSER=%%~B"

if defined BROWSER (
    echo Close the browser window to stop the server.
    "!BROWSER!" --new-window --user-data-dir="%TEMP%\genxdos-browser" "!URL!"
) else (
    echo Opening your default browser. Press any key here to stop the server.
    start "" "!URL!"
    pause >nul
)

REM Stop the server (whatever is listening on our port).
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /c:":!PORT! " ^| findstr LISTENING') do taskkill /f /pid %%P >nul 2>&1

echo Server stopped.
pause
exit /b 0

:port_busy
REM %1 = port -> sets BUSY=1 if something is LISTENING on it, else 0.
set "BUSY=0"
netstat -an | findstr /c:":%~1 " | findstr /i "LISTENING" >nul 2>&1 && set "BUSY=1"
goto :eof
