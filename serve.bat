@echo off
setlocal EnableDelayedExpansion
REM Start a local web server in the repo root and open the landing page in the default browser.
REM Usage: serve.bat [port]

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
        exit /b 1
    )
    echo Using port !PORT! instead of !ORIG_PORT!.>&2
)

set "URL=http://%HOST%:!PORT!/"

echo Serving GenX-DOS on !URL!
echo Press Ctrl+C to stop.

REM Give the server a moment to come up, then open the browser.
start "" /b cmd /c "ping -n 2 127.0.0.1 >nul & start !URL!"

%PY% -m http.server !PORT! --bind %HOST%
exit /b 0

:port_busy
REM %1 = port -> sets BUSY=1 if something is LISTENING on it, else 0.
set "BUSY=0"
netstat -an | findstr /c:":%~1 " | findstr /i "LISTENING" >nul 2>&1 && set "BUSY=1"
goto :eof
