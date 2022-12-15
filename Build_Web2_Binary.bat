:: Builds WebUI2 binaries
@ECHO OFF
set batch_path=%~dp0
set lang_enabled_prj_path=%batch_path%..\
set folder="%batch_path%\prod-gzip"
set listfile="%batch_path%\prod-gzip\list.txt"
set isI18n=%2

:: Delete all the bin and hex files located at ../Build_Output/Web/
cd ..\Build_Output\Web\
if exist *web2* (
   del *web2*
)
if exist *www2* (
   del *www2*
)

cd %batch_path%

if '%isI18n%'=='0' goto web2_build_operations
goto web2_i18n_build_operations

:: **************************************************************
:: **************** WebUI2 with i18n feature start **************
:: **************************************************************
:web2_i18n_build_operations
:: Copy the login locale files from locales folder to public\locales folder for only the languages that were enabled via workbook
if not exist "%lang_enabled_prj_path%Tools\Language_Pack\Language_JSON\*.gz" goto lang_files_missing_error
FOR %%I in ("%lang_enabled_prj_path%Tools\Language_Pack\Language_JSON\*.gz") DO robocopy .\locales\%%~nI .\public\locales\%%~nI login.json /s

:: Link, Build and Bundle the WebUI2 files with i18n
call npx javascript-obfuscator --ignore-imports true ./PxGreenUIModule/src/communication/pb.js --output ./PxGreenUIModule/src/communication/pb.js Rem This command will Obfuscate the pb.js file so that its hard to reverse engineer and safe gaurd user authentication info on the browser
call npm run link_build_i18n:win
goto build_binaries
:: **************************************************************
:: **************** WebUI2 with i18n feature end ****************
:: **************************************************************


:: **************************************************************
:: **************** WebUI2 without i18n build start *************
:: **************************************************************
:web2_build_operations
:: Delete the login locale files from public\locales folder if it exists
FOR %%I in ("%lang_enabled_prj_path%Tools\Language_Pack\Language_JSON\*.gz") DO RMDIR .\public\locales\%%~nI /S /Q

:: Link, Build and Bundle the WebUI2 files without i18n
call npx javascript-obfuscator --ignore-imports true ./PxGreenUIModule/src/communication/pb.js --output ./PxGreenUIModule/src/communication/pb.js Rem This command will Obfuscate the pb.js file so that its hard to reverse engineer and safe gaurd user authentication info on the browser
call npm run-script link:win
call npm run-script build
goto build_binaries
:: **************************************************************
:: ****************** WebUI2 without i18n build end *************
:: **************************************************************


:build_binaries
:: Delete the folder if already exists to avoid overwriting
RMDIR %folder% /S /Q

:: Compress the build folder into gzip mode
call npm run-script gzip

if not exist %folder% goto continue_on_error
:: Remove the .gz extension from all the files inside prod-gzip
cd %folder%
forfiles /S /M *.gz /C "cmd /c rename @file @fname"

:: Create media folder to copy fonts from build folder
cd static
mkdir media
cd ../..
xcopy .\build\static\media  .\prod-gzip\static\media /Y
cd %folder%/static/media
:: Deleting the extra fonts files
del *italic*
del *300*
del *700*
del *800*
del *cyrillic*
del *greek*
del *hebrew*
del *vietnamese*
del *all*
del *ext*
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
FOR /R . %%F IN (*.html;*.css;*.js;*.png;*.gif;*.svg;*.woff*;*.json) DO (
        SET "p=%%F"
        SET "p=!p:\=/!"
        SET "p=!p:%r%=!"
        IF NOT !p!==default.html IF NOT !p!==index.html IF NOT !p!==not_found.html ECHO !p!>>%listfile%
)
copy /Y ..\mimes.txt .

:continue_on_error
set current_dir=%batch_path%
echo %current_dir% 

set out_file_name = %1
if '%out_file_name%'=='' (
set out_file_name="%batch_path%..\Build_Output\Web\www2.bin"
)
::Now use txt2hex to convert the files listed in "list.txt" into www.bin

CALL "%batch_path%\txt2upgrade.exe" %out_file_name%

@ECHO ON

@popd

@ECHO OFF
goto :eof

:lang_files_missing_error
echo Language files are missing, please generate them and try again.
goto :eof