"""Decides whether a rule is actively blocking at a given moment."""
from __future__ import annotations

import time
from datetime import datetime

from .models import Rule, MODE_DURATION, MODE_SCHEDULE, Window


def _minutes(hhmm: str) -> int:
    try:
        h, m = hhmm.split(":")
        return (int(h) % 24) * 60 + (int(m) % 60)
    except (ValueError, AttributeError):
        return 0


def _window_active(win: Window, now: datetime) -> bool:
    now_min = now.hour * 60 + now.minute
    start = _minutes(win.start)
    end = _minutes(win.end)
    weekday = now.weekday()          # Monday=0
    prev_weekday = (weekday - 1) % 7

    if start == end:
        # Zero-length window means "all day" on the listed days.
        return weekday in win.days

    if start < end:
        # Same-day window, e.g. 09:00 -> 17:00.
        return weekday in win.days and start <= now_min < end

    # Wrapping window, e.g. 22:00 -> 06:00. It belongs to the day it started on.
    if weekday in win.days and now_min >= start:
        return True
    if prev_weekday in win.days and now_min < end:
        return True
    return False


def is_active(rule: Rule, now_ts: float | None = None) -> bool:
    """Return True if the rule should currently be enforcing a block."""
    if not rule.enabled:
        return False

    now_ts = now_ts if now_ts is not None else time.time()

    if rule.mode == MODE_DURATION:
        return rule.end_ts is not None and now_ts < rule.end_ts

    if rule.mode == MODE_SCHEDULE:
        now = datetime.fromtimestamp(now_ts)
        return any(_window_active(w, now) for w in rule.windows)

    return False


def is_expired(rule: Rule, now_ts: float | None = None) -> bool:
    """Duration rules become expired once their end time passes.

    Schedule rules never expire on their own.
    """
    if rule.mode != MODE_DURATION:
        return False
    now_ts = now_ts if now_ts is not None else time.time()
    return rule.end_ts is not None and now_ts >= rule.end_ts
