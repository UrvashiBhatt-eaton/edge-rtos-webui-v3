::Builds select files into the PXGreen
@set folder=prod-gzip
@set listfile=list.txt

@ECHO OFF

:: Build and bundle the Web UI code
call npm run-script build

:: Delete the folder if already exists to avoid overwriting
RMDIR %folder% /S /Q

:: Compress the build folder into gzip mode
call npm run-script gzip

:: Remove the .gz extension from all the files inside prod-gzip
cd %folder%
forfiles /S /M *.gz /C "cmd /c rename @file @fname"

:: Create media folder to copy fonts from build folder
cd static
mkdir media
cd ../..
xcopy .\build\static\media  .\prod-gzip\static\media /Y
cd %folder%/static/media
del *italic*
del *.woff2
cd ../../..

::Allow usage of ! and delayed expansion in for-loop
setlocal ENABLEDELAYEDEXPANSION

echo Creating %folder%\list.txt from all files in %folder%

pushd %folder%
del /Q %listfile%

::List must start with default, index, and not_found
ECHO default.html>>%listfile%
ECHO index.html>>%listfile%
ECHO not_found.html>>%listfile%	

SET "r=%__CD__:\=/%"
FOR /R . %%F IN (*.html;*.css;*.js;*.png;*.gif;*.svg;*.woff;*.json) DO (
        SET "p=%%F"
        SET "p=!p:\=/!"
        SET "p=!p:%r%=!"
        IF NOT !p!==default.html IF NOT !p!==index.html IF NOT !p!==not_found.html ECHO !p!>>%listfile%
)

copy /Y ..\mimes.txt .

::Now use txt2hex to convert the files listed in "list.txt" into www.bin
CALL ..\txt2upgrade.exe ..\www.bin

@ECHO ON

@popd


::Build for srec
.\bin2srec\srec_cat.exe .\www.bin -binary -offset 0x08080000 -o www.hex -intel --line-length=44