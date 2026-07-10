"""Folder blocking by denying access permissions.

Windows: an explicit Deny ACE for the Everyone group via icacls.
macOS/Linux: strip all permission bits (original mode is remembered so the
folder can be fully restored).

A small state file records which folders we locked and how to undo it, so the
guardian can release them the moment a block becomes inactive. System paths are
refused up front by config.is_path_protected().
"""
from __future__ import annotations

import json
import os
import subprocess
from typing import Dict, Iterable

from .. import config

_STATE_NAME = "folder_locks.json"
# S-1-1-0 is the well-known SID for the "Everyone" group.
_EVERYONE_SID = "*S-1-1-0"


def _state_path() -> str:
    return os.path.join(config.data_dir(), _STATE_NAME)


def _load_state() -> Dict[str, dict]:
    try:
        with open(_state_path(), "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return {}


def _save_state(state: Dict[str, dict]) -> None:
    try:
        with open(_state_path(), "w", encoding="utf-8") as fh:
            json.dump(state, fh)
    except OSError:
        pass


def _no_window():
    return getattr(subprocess, "CREATE_NO_WINDOW", 0)


def _lock(path: str) -> dict | None:
    """Apply an access denial. Returns undo info, or None on failure."""
    if config.is_path_protected(path) or not os.path.isdir(path):
        return None
    if config.is_windows():
        r = subprocess.run(
            ["icacls", path, "/deny", f"{_EVERYONE_SID}:(OI)(CI)(F)"],
            capture_output=True, check=False, creationflags=_no_window(),
        )
        return {"kind": "win"} if r.returncode == 0 else None
    try:
        original = os.stat(path).st_mode & 0o777
        os.chmod(path, 0o000)
        return {"kind": "posix", "mode": original}
    except OSError:
        return None


def _unlock(path: str, info: dict) -> bool:
    if info.get("kind") == "win":
        r = subprocess.run(
            ["icacls", path, "/remove:d", _EVERYONE_SID],
            capture_output=True, check=False, creationflags=_no_window(),
        )
        return r.returncode == 0
    try:
        os.chmod(path, info.get("mode", 0o700))
        return True
    except OSError:
        return False


def enforce(targets: Iterable[str]) -> None:
    """Lock every target folder; release any folder we locked but shouldn't be."""
    wanted = {os.path.normpath(t) for t in targets
              if t and not config.is_path_protected(t)}
    state = _load_state()

    # Release folders that are no longer in the wanted set.
    for path in list(state.keys()):
        if path not in wanted:
            if _unlock(path, state[path]):
                state.pop(path, None)

    # Lock folders that aren't locked yet.
    for path in wanted:
        if path not in state:
            info = _lock(path)
            if info is not None:
                state[path] = info

    _save_state(state)


def release_all() -> None:
    """Undo every folder lock we own (used on clean shutdown/uninstall)."""
    state = _load_state()
    for path, info in list(state.items()):
        if _unlock(path, info):
            state.pop(path, None)
    _save_state(state)
