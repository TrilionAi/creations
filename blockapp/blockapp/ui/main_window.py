"""Main application window: the rule list plus the add/remove flows."""
from __future__ import annotations

import tkinter as tk
from tkinter import ttk

from .. import strings, security, config, manager, startup
from ..storage import Store
from ..scheduler import is_active
from ..models import MODE_DURATION
from . import dialogs
from .add_block import add_block

_REFRESH_MS = 5000


class MainWindow(tk.Tk):
    def __init__(self):
        super().__init__()
        self.store = Store()
        self.title(strings.MAIN_TITLE)
        self.geometry("640x420")
        self.minsize(560, 360)

        self._build_ui()
        self._ensure_password()
        startup.register_autostart()
        startup.ensure_guardian_running()
        self.refresh()
        self.after(_REFRESH_MS, self._tick)

    # -- construction ------------------------------------------------------

    def _build_ui(self):
        header = ttk.Frame(self, padding=(16, 12))
        header.pack(fill="x")
        ttk.Label(header, text=strings.MAIN_TITLE,
                  font=("Segoe UI", 16, "bold")).pack(side="left")
        ttk.Button(header, text=strings.ADD_BLOCK,
                   command=self.on_add).pack(side="right")

        cols = ("target", "type", "when", "status")
        self.tree = ttk.Treeview(self, columns=cols, show="headings", height=10)
        for col, title, width in (
            ("target", strings.COL_TARGET, 240),
            ("type", strings.COL_TYPE, 90),
            ("when", strings.COL_WHEN, 160),
            ("status", strings.COL_STATUS, 110),
        ):
            self.tree.heading(col, text=title)
            self.tree.column(col, width=width, anchor="w")
        self.tree.pack(fill="both", expand=True, padx=16, pady=(0, 8))

        self.empty = ttk.Label(self, text=strings.NO_RULES, foreground="#7f8c8d")

        footer = ttk.Frame(self, padding=(16, 8))
        footer.pack(fill="x")
        ttk.Button(footer, text=strings.REMOVE_BLOCK,
                   command=self.on_remove).pack(side="right")
        ttk.Label(footer, text=strings.APP_TAGLINE,
                  foreground="#7f8c8d").pack(side="left")

    # -- data --------------------------------------------------------------

    def _ensure_password(self):
        if self.store.has_password():
            return
        record = dialogs.set_password(self)
        if record is None:
            # No password means no protection; refuse to run half-secured.
            self.destroy()
            raise SystemExit(0)
        data = self.store.load()
        data["password"] = record
        self.store.save(data)

    def refresh(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
        rules = self.store.get_rules()
        for r in rules:
            status = strings.STATUS_ACTIVE if is_active(r) else strings.STATUS_SCHEDULED
            self.tree.insert("", "end", iid=r.id, values=(
                r.label or r.target,
                {"app": "App", "website": "Website", "folder": "Folder"}.get(r.type, r.type),
                self._when_text(r),
                status,
            ))
        if rules:
            self.empty.pack_forget()
        else:
            self.empty.pack(pady=8)

    def _when_text(self, rule) -> str:
        if rule.mode == MODE_DURATION and rule.end_ts:
            from datetime import datetime
            return "until " + datetime.fromtimestamp(rule.end_ts).strftime("%b %d %H:%M")
        if rule.windows:
            w = rule.windows[0]
            days = ",".join(["M", "T", "W", "T", "F", "S", "S"][d] for d in w.days)
            return f"{days} {w.start}-{w.end}"
        return "—"

    def _tick(self):
        self.refresh()
        startup.ensure_guardian_running()
        self.after(_REFRESH_MS, self._tick)

    # -- actions -----------------------------------------------------------

    def on_add(self):
        rule = add_block(self)
        if rule is None:
            return
        hours = manager.rule_hours(rule)
        steps = manager.confirm_steps_for(hours)
        ok = dialogs.confirm_block(
            self, rule.label or rule.target,
            strings.duration_summary(hours),
            steps=steps, strong=manager.is_strong(hours), hours=hours,
        )
        if not ok:
            return
        manager.commit_rule(rule)
        rules = self.store.get_rules()
        rules.append(rule)
        self.store.set_rules(rules)
        startup.ensure_guardian_running()
        self.refresh()

    def on_remove(self):
        sel = self.tree.selection()
        if not sel:
            return
        rules = self.store.get_rules()
        rule = next((r for r in rules if r.id == sel[0]), None)
        if rule is None:
            return

        # Same-day lock: a rule committed today cannot be removed today.
        if not manager.can_change_today(rule):
            dialogs.info(self, strings.CANNOT_CHANGE_TODAY)
            return

        # Master password, with the wrong-attempt lockout policy.
        data = self.store.load()
        status = dialogs.ask_password(self, data.get("password") or {},
                                      data.get("lockout_until", 0))
        if status == "wrong":
            data["lockout_until"] = security.lockout_deadline()
            self.store.save(data)
            dialogs.info(self, strings.WRONG_PASSWORD + "\n\n" +
                         strings.LOCKED_OUT.format(
                             when=dialogs._fmt_time(data["lockout_until"])))
            return
        if status != "ok":
            return

        # The motivational gauntlet.
        if not dialogs.unlock_challenge(self):
            return

        rules = [r for r in rules if r.id != rule.id]
        self.store.set_rules(rules)
        self.refresh()


def main():
    try:
        MainWindow().mainloop()
    except SystemExit:
        pass


if __name__ == "__main__":
    main()
