"""Tamper-evident persistent store for rules, password and lockout state.

The store is a JSON document accompanied by an HMAC signature. Deleting or
editing the file by hand invalidates the signature; the guardian then restores
the last known-good copy from the backup slot. This is deliberately *friction*,
not unbreakable security — a determined admin can still get around it, but not
by casually deleting a file.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import platform
import time
from typing import List

from . import config
from .models import Rule

_STORE_NAME = "rules.json"
_SIG_NAME = "rules.sig"
_BACKUP_NAME = "rules.bak.json"
_BACKUP_SIG_NAME = "rules.bak.sig"

_DEFAULT = {
    "version": 1,
    "password": None,
    "lockout_until": 0.0,
    "rules": [],
}


def _hmac_key() -> bytes:
    # Key is derived from a constant plus a machine identifier. This is
    # obfuscation-grade: it stops casual edits, not a reverse engineer.
    machine = (platform.node() or "") + "|" + platform.system()
    return hashlib.sha256(("blockapp::" + machine).encode("utf-8")).digest()


def _sign(payload: bytes) -> str:
    return hmac.new(_hmac_key(), payload, hashlib.sha256).hexdigest()


def _paths():
    d = config.data_dir()
    return (
        os.path.join(d, _STORE_NAME),
        os.path.join(d, _SIG_NAME),
        os.path.join(d, _BACKUP_NAME),
        os.path.join(d, _BACKUP_SIG_NAME),
    )


def _read_signed(store_path: str, sig_path: str):
    """Return the parsed dict if the file exists and its signature matches."""
    if not (os.path.exists(store_path) and os.path.exists(sig_path)):
        return None
    try:
        with open(store_path, "rb") as fh:
            payload = fh.read()
        with open(sig_path, "r", encoding="utf-8") as fh:
            expected = fh.read().strip()
    except OSError:
        return None
    if not hmac.compare_digest(_sign(payload), expected):
        return None
    try:
        return json.loads(payload.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return None


class Store:
    """Loads and saves the block configuration with integrity protection."""

    def __init__(self):
        (self.store_path, self.sig_path,
         self.backup_path, self.backup_sig_path) = _paths()

    # -- persistence -------------------------------------------------------

    def load(self) -> dict:
        """Load state, transparently restoring from backup if tampered."""
        data = _read_signed(self.store_path, self.sig_path)
        if data is not None:
            return self._normalize(data)

        # Primary missing or tampered: fall back to backup and heal.
        backup = _read_signed(self.backup_path, self.backup_sig_path)
        if backup is not None:
            self.save(backup, _from_restore=True)
            return self._normalize(backup)

        return dict(_DEFAULT)

    def save(self, data: dict, _from_restore: bool = False) -> None:
        payload = json.dumps(data, indent=2, sort_keys=True).encode("utf-8")
        sig = _sign(payload)

        self._atomic_write(self.store_path, payload)
        self._atomic_write(self.sig_path, sig.encode("utf-8"))

        # Keep the backup in lock-step so a restore never loses data. When we
        # are ourselves restoring, we still refresh the backup for consistency.
        self._atomic_write(self.backup_path, payload)
        self._atomic_write(self.backup_sig_path, sig.encode("utf-8"))

    @staticmethod
    def _atomic_write(path: str, data: bytes) -> None:
        tmp = path + ".tmp"
        with open(tmp, "wb") as fh:
            fh.write(data)
            fh.flush()
            os.fsync(fh.fileno())
        os.replace(tmp, path)

    @staticmethod
    def _normalize(data: dict) -> dict:
        merged = dict(_DEFAULT)
        merged.update(data or {})
        merged.setdefault("rules", [])
        return merged

    # -- typed convenience helpers ----------------------------------------

    def get_rules(self, data: dict | None = None) -> List[Rule]:
        data = data if data is not None else self.load()
        return [Rule.from_dict(r) for r in data.get("rules", [])]

    def set_rules(self, rules: List[Rule], data: dict | None = None) -> dict:
        data = data if data is not None else self.load()
        data["rules"] = [r.to_dict() for r in rules]
        self.save(data)
        return data

    def has_password(self) -> bool:
        return bool(self.load().get("password"))
