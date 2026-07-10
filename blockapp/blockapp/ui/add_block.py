"""The 'Add block' wizard: collect type, target and timing into a Rule.

Returns an *uncommitted* Rule (no committed_date yet); the caller runs the
confirmation gauntlet and commits it.
"""
from __future__ import annotations

import time
import tkinter as tk
from tkinter import ttk
from tkinter import filedialog
from typing import Optional

from .. import strings, config
from ..models import Rule, MODE_DURATION, MODE_SCHEDULE, Window
from .dialogs import _Modal, info

_UNITS = {"minutes": 60, "hours": 3600, "days": 86400, "months": 2592000}
_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def add_block(parent) -> Optional[Rule]:
    dlg = _Modal(parent, strings.ADD_BLOCK)
    b = dlg.body

    # -- type --------------------------------------------------------------
    ttk.Label(b, text=strings.CHOOSE_TYPE).pack(anchor="w")
    rtype = tk.StringVar(value="app")
    for value, label in (("app", strings.TYPE_APP),
                         ("website", strings.TYPE_WEBSITE),
                         ("folder", strings.TYPE_FOLDER)):
        ttk.Radiobutton(b, text=label, value=value, variable=rtype).pack(anchor="w")

    # -- target ------------------------------------------------------------
    ttk.Label(b, text="Target").pack(anchor="w", pady=(12, 2))
    target = tk.StringVar()
    trow = ttk.Frame(b)
    trow.pack(fill="x")
    entry = ttk.Entry(trow, textvariable=target, width=34)
    entry.pack(side="left", fill="x", expand=True)
    hint = ttk.Label(b, text=strings.TARGET_APP_HINT, foreground="#7f8c8d")
    hint.pack(anchor="w", pady=(2, 0))

    def browse():
        path = filedialog.askdirectory(parent=dlg)
        if path:
            target.set(path)

    browse_btn = ttk.Button(trow, text="Browse…", command=browse)

    def on_type_change(*_):
        hints = {"app": strings.TARGET_APP_HINT,
                 "website": strings.TARGET_WEBSITE_HINT,
                 "folder": strings.TARGET_FOLDER_HINT}
        hint.config(text=hints[rtype.get()])
        if rtype.get() == "folder":
            browse_btn.pack(side="left", padx=(8, 0))
        else:
            browse_btn.forget()
    rtype.trace_add("write", on_type_change)

    # -- timing mode -------------------------------------------------------
    ttk.Label(b, text=strings.CHOOSE_MODE).pack(anchor="w", pady=(12, 2))
    mode = tk.StringVar(value=MODE_DURATION)
    ttk.Radiobutton(b, text=strings.MODE_FOR, value=MODE_DURATION,
                    variable=mode).pack(anchor="w")

    dur_row = ttk.Frame(b)
    dur_row.pack(fill="x", padx=(24, 0))
    amount = tk.StringVar(value="2")
    unit = tk.StringVar(value="hours")
    ttk.Entry(dur_row, textvariable=amount, width=6).pack(side="left")
    ttk.OptionMenu(dur_row, unit, "hours", *(_UNITS.keys())).pack(side="left", padx=(6, 0))

    ttk.Radiobutton(b, text=strings.MODE_SCHEDULE, value=MODE_SCHEDULE,
                    variable=mode).pack(anchor="w", pady=(8, 0))

    sched = ttk.Frame(b)
    sched.pack(fill="x", padx=(24, 0))
    day_vars = []
    days_row = ttk.Frame(sched)
    days_row.pack(anchor="w")
    for i, name in enumerate(_WEEKDAYS):
        v = tk.BooleanVar(value=i < 5)  # default Mon–Fri
        day_vars.append(v)
        ttk.Checkbutton(days_row, text=name, variable=v).pack(side="left")
    time_row = ttk.Frame(sched)
    time_row.pack(anchor="w", pady=(4, 0))
    start = tk.StringVar(value="09:00")
    end = tk.StringVar(value="17:00")
    ttk.Label(time_row, text="from").pack(side="left")
    ttk.Entry(time_row, textvariable=start, width=6).pack(side="left", padx=4)
    ttk.Label(time_row, text="to").pack(side="left")
    ttk.Entry(time_row, textvariable=end, width=6).pack(side="left", padx=4)

    err = ttk.Label(b, text="", foreground="#c0392b")
    err.pack(anchor="w", pady=(10, 0))

    def submit():
        tgt = target.get().strip()
        if not tgt:
            err.config(text=strings.REFUSE_EMPTY)
            return
        kind = rtype.get()

        if kind == "app" and config.is_app_protected(tgt):
            err.config(text=strings.REFUSE_PROTECTED_APP)
            return
        if kind == "folder" and config.is_path_protected(tgt):
            err.config(text=strings.REFUSE_PROTECTED_PATH)
            return

        rule = Rule.new(kind, tgt, mode.get(), label=tgt)
        if mode.get() == MODE_DURATION:
            try:
                secs = float(amount.get()) * _UNITS[unit.get()]
                if secs <= 0:
                    raise ValueError
            except (ValueError, KeyError):
                err.config(text="Enter a valid duration.")
                return
            rule.end_ts = time.time() + secs
        else:
            days = [i for i, v in enumerate(day_vars) if v.get()]
            if not days:
                err.config(text="Pick at least one day.")
                return
            if not (_valid_hhmm(start.get()) and _valid_hhmm(end.get())):
                err.config(text="Use HH:MM times, e.g. 09:00.")
                return
            rule.windows = [Window(days=days, start=start.get(), end=end.get())]

        dlg.result = rule
        dlg.destroy()

    ttk.Button(b, text="Continue", command=submit).pack(pady=(12, 0))
    on_type_change()
    return dlg.show()


def _valid_hhmm(value: str) -> bool:
    try:
        h, m = value.split(":")
        return 0 <= int(h) <= 23 and 0 <= int(m) <= 59
    except (ValueError, AttributeError):
        return False
