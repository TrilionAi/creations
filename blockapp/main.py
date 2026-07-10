"""Frozen-executable entry point (used by PyInstaller).

Mirrors `python -m blockapp`:
    BlockApp.exe              -> user interface
    BlockApp.exe --guardian   -> background enforcement loop
"""
import sys

from blockapp.__main__ import main

if __name__ == "__main__":
    sys.exit(main())
