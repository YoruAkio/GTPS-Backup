@echo off
:loop
npm install
node index.js
IF %errorlevel% NEQ 0 (
    echo The script exited with error level %errorlevel%. Please press any key to continue.
    pause
)
goto loop