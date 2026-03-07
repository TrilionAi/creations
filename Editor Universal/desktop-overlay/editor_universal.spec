# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec file para Editor Universal Desktop

block_cipher = None

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=[
        'pynput.keyboard._win32',
        'pynput.mouse._win32',
        'pynput._util.win32',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        # Modulos Python desnecessarios
        'matplotlib', 'numpy', 'scipy', 'pandas', 'tkinter',
        'unittest', 'email', 'html', 'http', 'xml', 'xmlrpc',
        'pydoc', 'doctest', 'difflib',
        # Modulos PySide6 nao utilizados (app usa apenas QtWidgets, QtCore, QtGui)
        'PySide6.QtWebEngine', 'PySide6.QtWebEngineWidgets',
        'PySide6.QtWebEngineCore', 'PySide6.QtMultimedia',
        'PySide6.QtNetwork', 'PySide6.QtSql', 'PySide6.QtSvg',
        'PySide6.QtBluetooth', 'PySide6.QtDBus',
        'PySide6.QtDesigner', 'PySide6.QtHelp',
        'PySide6.QtOpenGL', 'PySide6.QtOpenGLWidgets',
        'PySide6.QtPositioning', 'PySide6.QtPrintSupport',
        'PySide6.QtQml', 'PySide6.QtQuick', 'PySide6.QtQuickWidgets',
        'PySide6.QtRemoteObjects', 'PySide6.QtSensors',
        'PySide6.QtSerialPort', 'PySide6.QtTest',
        'PySide6.QtXml', 'PySide6.Qt3DCore', 'PySide6.Qt3DRender',
        'PySide6.Qt3DInput', 'PySide6.Qt3DLogic', 'PySide6.Qt3DAnimation',
        'PySide6.QtCharts', 'PySide6.QtDataVisualization',
        'PySide6.QtGraphs', 'PySide6.QtLocation',
        # Excluir PyQt6 inteiramente (nao mais usado)
        'PyQt6',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='Editor Universal Desktop',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='icon.ico',
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='Editor Universal Desktop',
)
