"""Master-password hashing and wrong-attempt lockout helpers."""
from __future__ import annotations

import binascii
import hashlib
import hmac
import os
import time

from . import config

_PBKDF2_ITERATIONS = 200_000


def hash_password(password: str) -> dict:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, _PBKDF2_ITERATIONS)
    return {
        "salt": binascii.hexlify(salt).decode(),
        "hash": binascii.hexlify(dk).decode(),
        "iter": _PBKDF2_ITERATIONS,
    }


def verify_password(password: str, record: dict) -> bool:
    if not record:
        return False
    try:
        salt = binascii.unhexlify(record["salt"])
        iterations = int(record.get("iter", _PBKDF2_ITERATIONS))
        dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    except (KeyError, binascii.Error, ValueError):
        return False
    return hmac.compare_digest(binascii.hexlify(dk).decode(), record["hash"])


def is_locked_out(lockout_until: float, now_ts: float | None = None) -> bool:
    now_ts = now_ts if now_ts is not None else time.time()
    return now_ts < (lockout_until or 0)


def lockout_deadline(now_ts: float | None = None) -> float:
    now_ts = now_ts if now_ts is not None else time.time()
    return now_ts + config.WRONG_PASSWORD_LOCKOUT_HOURS * 3600
