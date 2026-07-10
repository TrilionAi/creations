"""Business rules for the discipline flow, independent of any UI.

Keeping this logic here (not in the window code) makes it testable headlessly.
"""
from __future__ import annotations

import time
from datetime import date, datetime

from . import config
from .models import Rule, MODE_DURATION


def today_str(now_ts: float | None = None) -> str:
    now_ts = now_ts if now_ts is not None else time.time()
    return datetime.fromtimestamp(now_ts).strftime("%Y-%m-%d")


def rule_hours(rule: Rule, now_ts: float | None = None) -> float:
    """Approximate the length of a block, used to pick the confirmation tier."""
    now_ts = now_ts if now_ts is not None else time.time()
    if rule.mode == MODE_DURATION and rule.end_ts:
        return max(0.0, (rule.end_ts - now_ts) / 3600.0)
    # Schedule blocks are open-ended; treat them as long by definition.
    return float(config.STRONG_CONFIRM_THRESHOLD_HOURS + 1)


def confirm_steps_for(hours: float) -> int:
    if hours >= config.STRONG_CONFIRM_THRESHOLD_HOURS:
        return config.CONFIRM_STEPS_STRONG
    return config.CONFIRM_STEPS_NORMAL


def is_strong(hours: float) -> bool:
    return hours >= config.STRONG_CONFIRM_THRESHOLD_HOURS


def commit_rule(rule: Rule, now_ts: float | None = None) -> Rule:
    """Stamp the rule as locked-in today."""
    rule.committed_date = today_str(now_ts)
    if not rule.created_ts:
        rule.created_ts = now_ts if now_ts is not None else time.time()
    return rule


def can_change_today(rule: Rule, now_ts: float | None = None) -> bool:
    """A committed rule may only be changed on a later calendar day."""
    if not rule.committed_date:
        return True
    return rule.committed_date != today_str(now_ts)
