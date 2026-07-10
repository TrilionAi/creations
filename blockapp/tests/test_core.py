"""Headless tests for the non-GUI core. Run: python -m blockapp.tests? no —
run with `python tests/test_core.py` from the project root, or `pytest`.

These cover the logic that must be correct even though the GUI can only be
tested on a real desktop: scheduling, the confirmation tiers, the same-day
lock, and the hosts-file sync.
"""
import os
import sys
import time
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from blockapp import config, manager  # noqa: E402
from blockapp.models import Rule, Window, MODE_DURATION, MODE_SCHEDULE  # noqa: E402
from blockapp.scheduler import is_active, is_expired  # noqa: E402
from blockapp.enforce import websites  # noqa: E402

_failures = []


def check(name, cond):
    if cond:
        print(f"  ok  {name}")
    else:
        print(f"FAIL  {name}")
        _failures.append(name)


def test_duration_activation():
    r = Rule.new("app", "game.exe", MODE_DURATION, end_ts=time.time() + 3600)
    check("duration active before end", is_active(r))
    check("duration not expired before end", not is_expired(r))
    past = Rule.new("app", "game.exe", MODE_DURATION, end_ts=time.time() - 10)
    check("duration inactive after end", not is_active(past))
    check("duration expired after end", is_expired(past))


def test_schedule_window():
    # Build a window covering *right now* so the test is deterministic.
    now = datetime.now()
    win = Window(days=[now.weekday()], start="00:00", end="23:59")
    r = Rule.new("website", "x.com", MODE_SCHEDULE, windows=[win])
    check("schedule active inside window", is_active(r))

    other_day = (now.weekday() + 1) % 7
    win2 = Window(days=[other_day], start="00:00", end="23:59")
    r2 = Rule.new("website", "x.com", MODE_SCHEDULE, windows=[win2])
    check("schedule inactive on other day", not is_active(r2))


def test_confirm_tiers():
    check("short block -> 2 steps", manager.confirm_steps_for(2) == config.CONFIRM_STEPS_NORMAL)
    check("long block -> 3 steps", manager.confirm_steps_for(6) == config.CONFIRM_STEPS_STRONG)
    check("5h is strong", manager.is_strong(5))
    check("4h is not strong", not manager.is_strong(4))


def test_same_day_lock():
    r = Rule.new("app", "game.exe", MODE_DURATION, end_ts=time.time() + 3600)
    manager.commit_rule(r)
    check("cannot change on commit day", not manager.can_change_today(r))
    r.committed_date = "2000-01-01"
    check("can change on a later day", manager.can_change_today(r))


def test_safety_lists():
    check("explorer protected", config.is_app_protected("explorer.exe"))
    check("random app not protected", not config.is_app_protected("game.exe"))
    check("root path protected", config.is_path_protected(os.sep))


def test_hosts_roundtrip():
    original = "127.0.0.1\tlocalhost\n"
    stripped = websites._strip_existing(original)
    check("strip leaves unrelated entries", "localhost" in stripped)
    block = websites._managed_block(["instagram.com"])
    check("block contains sink", config.HOSTS_SINK in block)
    check("block contains www variant", "www.instagram.com" in block)
    check("block bounded by markers",
          block.startswith(config.HOSTS_MARKER_START) and
          block.endswith(config.HOSTS_MARKER_END))


def main():
    for fn in (test_duration_activation, test_schedule_window, test_confirm_tiers,
               test_same_day_lock, test_safety_lists, test_hosts_roundtrip):
        print(fn.__name__)
        fn()
    print()
    if _failures:
        print(f"{len(_failures)} check(s) failed")
        return 1
    print("all checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
