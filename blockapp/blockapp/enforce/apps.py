"""Application blocking: terminate any running process on the block list.

The guardian calls `enforce(targets)` on every tick. Protected system
executables are never touched.
"""
from __future__ import annotations

import os
from typing import Iterable, Set

from .. import config

try:
    import psutil
except ImportError:  # keeps the module importable on the build host
    psutil = None


def normalize(target: str) -> str:
    """Reduce a target to a comparable base executable name."""
    return os.path.basename(target).strip().lower()


def enforce(targets: Iterable[str]) -> int:
    """Terminate processes whose name matches any target. Returns kill count."""
    if psutil is None:
        return 0

    wanted: Set[str] = {normalize(t) for t in targets if t}
    wanted = {t for t in wanted if t and not config.is_app_protected(t)}
    if not wanted:
        return 0

    killed = 0
    for proc in psutil.process_iter(["name"]):
        try:
            name = (proc.info.get("name") or "").strip().lower()
            if not name:
                continue
            if name in wanted and not config.is_app_protected(name):
                proc.terminate()
                killed += 1
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    if killed:
        # Give processes a moment, then force-kill the stubborn ones.
        gone, alive = psutil.wait_procs(
            [p for p in psutil.process_iter(["name"])
             if (p.info.get("name") or "").strip().lower() in wanted],
            timeout=1.0,
        )
        for p in alive:
            try:
                p.kill()
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
    return killed
