@echo off
echo ============================================
echo   Build - Editor Universal Desktop
echo ============================================
echo.

cd /d "%~dp0"

:: 1. Check dependencies
echo [1/4] Checking dependencies...
pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo Installing PyInstaller...
    pip install pyinstaller
)
pip show Pillow >nul 2>&1
if errorlevel 1 (
    echo Installing Pillow ^(for icon generation^)...
    pip install Pillow
)

:: 2. Generate icon
echo [2/4] Generating icon...
if not exist "icon.ico" (
    python create_icon.py
    if errorlevel 1 (
        echo ERROR: Failed to create icon.ico
        pause
        exit /b 1
    )
) else (
    echo icon.ico already exists, skipping.
)

:: 3. Build with PyInstaller
echo [3/4] Packaging with PyInstaller...
pyinstaller editor_universal.spec --noconfirm
if errorlevel 1 (
    echo ERROR: PyInstaller failed!
    pause
    exit /b 1
)
echo PyInstaller build completed!

:: 4. Compile installer with Inno Setup
echo [4/4] Compiling installer with Inno Setup...
set "ISCC_PATH="
if exist "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" (
    set "ISCC_PATH=C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
)
if exist "C:\Program Files\Inno Setup 6\ISCC.exe" (
    set "ISCC_PATH=C:\Program Files\Inno Setup 6\ISCC.exe"
)

if defined ISCC_PATH (
    "%ISCC_PATH%" installer.iss
    if errorlevel 1 (
        echo ERROR: Inno Setup failed!
        pause
        exit /b 1
    )
    echo.
    echo ============================================
    echo   BUILD COMPLETE!
    echo   Instalador em: installer_output\
    echo ============================================
) else (
    echo.
    echo WARNING: Inno Setup not found automatically.
    echo The executable is in: dist\Editor Universal Desktop\
    echo Open installer.iss in Inno Setup Compiler manually.
)

echo.
pause
