@echo off
setlocal

:: Download WinRAR
powershell -Command "Invoke-WebRequest -OutFile '%~dp0winrar-x64-610.exe' -Uri 'https://www.rarlab.com/rar/winrar-x64-610.exe'"

:: Install WinRAR silently
start /wait winrar-x64-624.exe /s

:: Add WinRAR to the PATH
setx /M PATH "%PATH%;C:\Program Files\WinRAR\"

endlocal