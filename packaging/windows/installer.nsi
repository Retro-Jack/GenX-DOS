; GenX-DOS offline installer.
; Installs the static site + serve.bat launcher, ensures Python is present
; (silent per-user install if missing), and creates shortcuts to serve.bat.
; Per-user install (no admin / UAC).

Unicode true
SetCompressor /SOLID lzma
!include "MUI2.nsh"
!include "LogicLib.nsh"

Name "GenX-DOS"
OutFile "GenX-DOS-1.0.0-setup.exe"
RequestExecutionLevel user
InstallDir "$LOCALAPPDATA\GenX-DOS"
InstallDirRegKey HKCU "Software\GenX-DOS" "InstallDir"
ShowInstDetails show
ShowUnInstDetails show
BrandingText "GenX-DOS v1.0.0"

!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\serve.bat"
!define MUI_FINISHPAGE_RUN_TEXT "Launch GenX-DOS now"
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

Section "GenX-DOS" SecMain
  SectionIn RO

  SetOutPath "$INSTDIR"
  File "serve.bat"
  SetOutPath "$INSTDIR\site"
  File /r "site\*.*"

  ; --- Ensure Python is available (the launcher uses python -m http.server) ---
  DetailPrint "Checking for Python..."
  nsExec::ExecToStack 'cmd /c where py'
  Pop $0
  Pop $9
  ${If} $0 != 0
    nsExec::ExecToStack 'cmd /c where python'
    Pop $0
    Pop $9
  ${EndIf}
  ${If} $0 != 0
    DetailPrint "Python not found - installing Python 3.12 (per-user, no admin). This can take a minute..."
    SetOutPath "$PLUGINSDIR"
    File "python-setup.exe"
    ExecWait '"$PLUGINSDIR\python-setup.exe" /quiet InstallAllUsers=0 PrependPath=1 Include_launcher=1 Include_test=0 Include_pip=1 SimpleInstall=1' $1
    DetailPrint "Python installer finished (exit code $1)."
    SetOutPath "$INSTDIR"
  ${Else}
    DetailPrint "Python already installed - skipping."
  ${EndIf}

  ; --- Shortcuts to the launcher ---
  CreateDirectory "$SMPROGRAMS\GenX-DOS"
  CreateShortcut "$SMPROGRAMS\GenX-DOS\GenX-DOS.lnk" "$INSTDIR\serve.bat" "" "$INSTDIR\site\favicon.ico" 0 SW_SHOWMINIMIZED "" "Play GenX-DOS"
  CreateShortcut "$DESKTOP\GenX-DOS.lnk"            "$INSTDIR\serve.bat" "" "$INSTDIR\site\favicon.ico" 0 SW_SHOWMINIMIZED "" "Play GenX-DOS"
  CreateShortcut "$SMPROGRAMS\GenX-DOS\Uninstall GenX-DOS.lnk" "$INSTDIR\uninstall.exe"

  ; --- Uninstaller + Add/Remove Programs (per-user) ---
  WriteUninstaller "$INSTDIR\uninstall.exe"
  WriteRegStr   HKCU "Software\GenX-DOS" "InstallDir" "$INSTDIR"
  !define ARP "Software\Microsoft\Windows\CurrentVersion\Uninstall\GenX-DOS"
  WriteRegStr   HKCU "${ARP}" "DisplayName"     "GenX-DOS"
  WriteRegStr   HKCU "${ARP}" "DisplayVersion"  "1.0.0"
  WriteRegStr   HKCU "${ARP}" "Publisher"       "Jack Horton (Retro-Jack)"
  WriteRegStr   HKCU "${ARP}" "DisplayIcon"     "$INSTDIR\site\favicon.ico"
  WriteRegStr   HKCU "${ARP}" "URLInfoAbout"    "https://retro-jack.github.io/GenX-DOS/"
  WriteRegStr   HKCU "${ARP}" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegDWORD HKCU "${ARP}" "NoModify" 1
  WriteRegDWORD HKCU "${ARP}" "NoRepair" 1
SectionEnd

Section "Uninstall"
  RMDir /r "$INSTDIR\site"
  Delete "$INSTDIR\serve.bat"
  Delete "$INSTDIR\uninstall.exe"
  RMDir "$INSTDIR"
  Delete "$SMPROGRAMS\GenX-DOS\GenX-DOS.lnk"
  Delete "$SMPROGRAMS\GenX-DOS\Uninstall GenX-DOS.lnk"
  RMDir  "$SMPROGRAMS\GenX-DOS"
  Delete "$DESKTOP\GenX-DOS.lnk"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\GenX-DOS"
  DeleteRegKey HKCU "Software\GenX-DOS"
SectionEnd
