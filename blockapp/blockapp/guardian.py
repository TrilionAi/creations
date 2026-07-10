"""The always-on enforcement process.

Runs independently of the window. Closing the UI does not stop it. A single
instance guard keeps duplicate guardians (e.g. from the startup task firing
again) from fighting each other. On every tick it:

  1. reloads the rules (self-healing from backup if the file was tampered),
  2. drops expired duration rules,
  3. enforces every active rule by type,
  4. keeps the hosts file in sync with exactly the active website blocks.
"""
from __future__ import annotations

import os
import sys
import time

from . import config
from .scheduler import is_active, is_expired
from .storage import Store
from .enforce import apps, websites, folders

_LOCK_NAME = "guardian.lock"


def _lock_path() -> str:
    return os.path.join(config.data_dir(), _LOCK_NAME)


def _acquire_single_instance() -> bool:
    """Best-effort single-instance guard using a PID lock file."""
    path = _lock_path()
    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as fh:
                old_pid = int((fh.read() or "0").strip() or 0)
            if old_pid and _pid_alive(old_pid):
                return False  # another guardian owns the lock
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(str(os.getpid()))
        return True
    except (OSError, ValueError):
        return True  # never let lock trouble stop enforcement


def _pid_alive(pid: int) -> bool:
    try:
        import psutil
        return psutil.pid_exists(pid)
    except ImportError:
        try:
            os.kill(pid, 0)
            return True
        except (OSError, ProcessLookupError):
            return False


def _enforce_once(store: Store) -> None:
    data = store.load()
    rules = store.get_rules(data)

    # Prune duration rules whose time is up so they stop showing as blocks.
    live, changed = [], False
    for r in rules:
        if is_expired(r):
            changed = True
            continue
        live.append(r)
    if changed:
        store.set_rules(live, data)
        rules = live

    active = [r for r in rules if is_active(r)]

    app_targets = [r.target for r in active if r.type == "app"]
    site_targets = [r.target for r in active if r.type == "website"]
    folder_targets = [r.target for r in active if r.type == "folder"]

    if app_targets:
        apps.enforce(app_targets)
    websites.sync(site_targets)   # empty list clears our hosts block
    folders.enforce(folder_targets)


def run() -> int:
    if not _acquire_single_instance():
        return 0
    store = Store()
    while True:
        try:
            _enforce_once(store)
        except Exception:
            # The guardian must never die on a transient error.
            pass
        time.sleep(config.ENFORCE_INTERVAL_SECONDS)


if __name__ == "__main__":
    sys.exit(run())
