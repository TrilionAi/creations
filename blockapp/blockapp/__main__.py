"""Entry point.

    python -m blockapp              launch the user interface
    python -m blockapp --guardian   run the background enforcement loop

The frozen executable maps the same two modes: no args -> UI, --guardian ->
guardian (see startup.py).
"""
from __future__ import annotations

import sys


def main() -> int:
    if "--guardian" in sys.argv[1:]:
        from .guardian import run
        return run()
    from .ui.main_window import main as ui_main
    ui_main()
    return 0


if __name__ == "__main__":
    sys.exit(main())
