"""Reusable modal dialogs: password prompts, the confirmation gauntlet, and the
motivational unlock challenge. All are plain Tkinter Toplevels so they work with
zero third-party dependencies.
"""
from __future__ import annotations

import tkinter as tk
from tkinter import ttk
from typing import Optional

from .. import strings, security, config

_PAD = 16


class _Modal(tk.Toplevel):
    """Base class: a centered, application-modal dialog."""

    def __init__(self, parent, title: str):
        super().__init__(parent)
        self.title(title)
        self.resizable(False, False)
        self.result = None
        self.transient(parent)
        self.protocol("WM_DELETE_WINDOW", self._on_cancel)
        self.body = ttk.Frame(self, padding=_PAD)
        self.body.pack(fill="both", expand=True)

    def _on_cancel(self):
        self.result = None
        self.destroy()

    def show(self):
        self.grab_set()
        self.wait_window(self)
        return self.result


def set_password(parent) -> Optional[dict]:
    """First-run flow: create the master password. Returns a hash record."""
    dlg = _Modal(parent, strings.SET_PASSWORD_TITLE)
    ttk.Label(dlg.body, text=strings.SET_PASSWORD_BODY, justify="left").pack(anchor="w")
    err = ttk.Label(dlg.body, text="", foreground="#c0392b")
    pw1 = tk.StringVar()
    pw2 = tk.StringVar()

    for label, var in ((strings.SET_PASSWORD_TITLE, pw1), ("Repeat password", pw2)):
        ttk.Label(dlg.body, text=label).pack(anchor="w", pady=(_PAD, 2))
        ttk.Entry(dlg.body, textvariable=var, show="•", width=32).pack(fill="x")
    err.pack(anchor="w", pady=(8, 0))

    def submit():
        a, b = pw1.get(), pw2.get()
        if len(a) < 4:
            err.config(text=strings.PASSWORD_TOO_SHORT)
            return
        if a != b:
            err.config(text=strings.PASSWORD_MISMATCH)
            return
        dlg.result = security.hash_password(a)
        dlg.destroy()

    ttk.Button(dlg.body, text="Create", command=submit).pack(pady=(_PAD, 0))
    return dlg.show()


def ask_password(parent, record: dict, lockout_until: float) -> str:
    """Prompt for the master password.

    Returns one of: "ok" (correct), "wrong" (a real wrong attempt — caller
    should start the lockout), "cancel" (dismissed), or "locked" (attempts are
    currently frozen).
    """
    if security.is_locked_out(lockout_until):
        _info(parent, strings.LOCKED_OUT.format(when=_fmt_time(lockout_until)))
        return "locked"

    dlg = _Modal(parent, strings.ENTER_PASSWORD_TITLE)
    ttk.Label(dlg.body, text=strings.ENTER_PASSWORD_TITLE).pack(anchor="w")
    var = tk.StringVar()
    entry = ttk.Entry(dlg.body, textvariable=var, show="•", width=32)
    entry.pack(fill="x", pady=(8, 0))
    entry.focus_set()
    err = ttk.Label(dlg.body, text="", foreground="#c0392b")
    err.pack(anchor="w", pady=(8, 0))

    def submit():
        dlg.result = "ok" if security.verify_password(var.get(), record) else "wrong"
        dlg.destroy()

    entry.bind("<Return>", lambda _e: submit())
    ttk.Button(dlg.body, text="Unlock", command=submit).pack(pady=(_PAD, 0))
    return dlg.show() or "cancel"


def confirm_block(parent, target: str, duration_text: str,
                  steps: int, strong: bool, hours: float) -> bool:
    """Run the multi-step confirmation gauntlet. True only if fully confirmed."""
    if strong:
        if not _yes_no(parent, strings.CONFIRM_TITLE,
                       strings.CONFIRM_STRONG_WARNING.format(hours=int(hours)),
                       strings.CONFIRM_YES, strings.CONFIRM_NO):
            return False

    for step in range(1, steps + 1):
        is_final = step == steps
        title = strings.CONFIRM_STEP.format(n=step, total=steps)
        if is_final:
            body = strings.CONFIRM_FINAL_BODY.format(target=target)
        else:
            body = strings.CONFIRM_NORMAL_BODY.format(
                target=target, duration=duration_text)
        if not _yes_no(parent, title, body, strings.CONFIRM_YES, strings.CONFIRM_NO):
            return False
    return True


def unlock_challenge(parent) -> bool:
    """The motivational gate before an unlock. True if the user pushes through."""
    total = config.UNLOCK_CHALLENGE_STEPS
    for step in range(1, total + 1):
        phrase = strings.MOTIVATIONAL[(step - 1) % len(strings.MOTIVATIONAL)]
        title = strings.UNLOCK_STEP.format(n=step, total=total)
        body = f"{phrase}\n\n{strings.UNLOCK_TITLE}"
        # Note the button order: "keep it blocked" is the easy default.
        if not _yes_no(parent, title, body,
                       yes=strings.UNLOCK_PROCEED, no=strings.UNLOCK_KEEP,
                       default_no=True):
            return False
    return True


# ---------------------------------------------------------------------------
# Small primitives
# ---------------------------------------------------------------------------

def _yes_no(parent, title: str, body: str, yes: str, no: str,
            default_no: bool = False) -> bool:
    dlg = _Modal(parent, title)
    ttk.Label(dlg.body, text=body, justify="left", wraplength=380).pack(anchor="w")
    row = ttk.Frame(dlg.body)
    row.pack(fill="x", pady=(_PAD, 0))

    def choose(val):
        dlg.result = val
        dlg.destroy()

    no_btn = ttk.Button(row, text=no, command=lambda: choose(False))
    yes_btn = ttk.Button(row, text=yes, command=lambda: choose(True))
    no_btn.pack(side="right", padx=(8, 0))
    yes_btn.pack(side="right")
    (no_btn if default_no else yes_btn).focus_set()
    return bool(dlg.show())


def _info(parent, body: str, title: str = strings.APP_TAGLINE) -> None:
    dlg = _Modal(parent, title)
    ttk.Label(dlg.body, text=body, justify="left", wraplength=380).pack(anchor="w")
    ttk.Button(dlg.body, text="OK", command=dlg._on_cancel).pack(pady=(_PAD, 0))
    dlg.show()


def info(parent, body: str, title: str = strings.APP_TAGLINE) -> None:
    _info(parent, body, title)


def _fmt_time(ts: float) -> str:
    from datetime import datetime
    try:
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M")
    except (ValueError, OSError, OverflowError):
        return "later"
