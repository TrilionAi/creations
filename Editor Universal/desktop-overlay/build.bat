@echo off
echo ============================================
echo   Build - Editor Universal Desktop
echo ============================================
echo.

cd /d "%~dp0"

:: 1. Verificar dependencias
echo [1/4] Verificando dependencias...
pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo Instalando PyInstaller...
    pip install pyinstaller
)
pip show Pillow >nul 2>&1
if errorlevel 1 (
    echo Instalando Pillow ^(para gerar icone^)...
    pip install Pillow
)

:: 2. Gerar icone
echo [2/4] Gerando icone...
if not exist "icon.ico" (
    python create_icon.py
    if errorlevel 1 (
        echo ERRO: Falha ao criar icon.ico
        pause
        exit /b 1
    )
) else (
    echo icon.ico ja existe, pulando.
)

:: 3. Build com PyInstaller
echo [3/4] Empacotando com PyInstaller...
pyinstaller editor_universal.spec --noconfirm
if errorlevel 1 (
    echo ERRO: PyInstaller falhou!
    pause
    exit /b 1
)
echo Build PyInstaller concluido!

:: 4. Compilar instalador com Inno Setup
echo [4/4] Compilando instalador com Inno Setup...
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
        echo ERRO: Inno Setup falhou!
        pause
        exit /b 1
    )
    echo.
    echo ============================================
    echo   BUILD COMPLETO!
    echo   Instalador em: installer_output\
    echo ============================================
) else (
    echo.
    echo AVISO: Inno Setup nao encontrado automaticamente.
    echo O executavel esta em: dist\Editor Universal Desktop\
    echo Abra installer.iss no Inno Setup Compiler manualmente.
)

echo.
pause
