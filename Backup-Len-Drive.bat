@echo off
chcp 65001 >nul
echo ====================================================================
echo   NEPLE (Nep Le) - CONG CU DONG GOI & DONG BO GOOGLE DRIVE TU DONG
echo ====================================================================
echo.

set "SRC_DIR=C:\Users\admin\.gemini\antigravity\scratch\neple-store"
set "DESKTOP_ZIP=C:\Users\admin\Desktop\NEPLE-Store-Full-Backup.zip"

:: Kiem tra thu muc Google Drive tren may (neu da cai Google Drive for Desktop)
set "GDRIVE_DIR="
if exist "G:\My Drive" set "GDRIVE_DIR=G:\My Drive\NEPLE-Store-Backup"
if exist "G:\Bộ nhớ của tôi" set "GDRIVE_DIR=G:\Bộ nhớ của tôi\NEPLE-Store-Backup"
if exist "%USERPROFILE%\Google Drive" set "GDRIVE_DIR=%USERPROFILE%\Google Drive\NEPLE-Store-Backup"

echo [1/2] Dang nen toan bo code & du lieu ra Desktop: %DESKTOP_ZIP% ...
powershell -NoProfile -Command "Compress-Archive -Path '%SRC_DIR%\*' -DestinationPath '%DESKTOP_ZIP%' -Force"
echo       -> Da tao xong file ZIP tren man hinh Desktop!
echo.

if defined GDRIVE_DIR (
    echo [2/2] Phat hien Google Drive tren may! Dang dong bo tu dong...
    if not exist "%GDRIVE_DIR%" mkdir "%GDRIVE_DIR%"
    xcopy "%SRC_DIR%\*" "%GDRIVE_DIR%\neple-store\" /E /I /Y >nul
    copy /Y "%DESKTOP_ZIP%" "%GDRIVE_DIR%\NEPLE-Store-Full-Backup.zip" >nul
    echo       -> Da dong bo thanh cong len Google Drive tai: %GDRIVE_DIR%
) else (
    echo [2/2] Ghi chu: Neu ban cai Google Drive for Desktop, file nay se tu dong day thẳng len Drive.
    echo       Hien tai ban co the keo file "NEPLE-Store-Full-Backup.zip" o ngoai Desktop tha vao drive.google.com!
)

echo.
echo ====================================================================
echo   HOAN TAT!
echo ====================================================================
pause
