"""Register the guardian to launch at login with elevated privileges, and make
sure a guardian is running right now.

Windows uses a Scheduled Task (RunLevel HIGHEST) so the guardian starts with
admin rights at every logon and is restarted periodically. macOS uses a
LaunchDaemon plist. Both are best-effort: failure here never blocks the app.
"""
from __future__ import annotations

import os
import subprocess
import sys

from . import config

_TASK_NAME = "BlockAppGuardian"


def _guardian_command() -> list[str]:
    """Command that launches the guardian, whether frozen or run from source."""
    if getattr(sys, "frozen", False):
        return [sys.executable, "--guardian"]
    return [sys.executable, "-m", "blockapp", "--guardian"]


def _no_window():
    return getattr(subprocess, "CREATE_NO_WINDOW", 0)


def ensure_guardian_running() -> None:
    """Spawn a detached guardian process if one is not already enforcing."""
    lock = os.path.join(config.data_dir(), "guardian.lock")
    try:
        if os.path.exists(lock):
            with open(lock, "r", encoding="utf-8") as fh:
                pid = int((fh.read() or "0").strip() or 0)
            if pid and _pid_alive(pid):
                return
    except (OSError, ValueError):
        pass

    cmd = _guardian_command()
    try:
        if config.is_windows():
            flags = getattr(subprocess, "DETACHED_PROCESS", 0) | _no_window()
            subprocess.Popen(cmd, creationflags=flags, close_fds=True)
        else:
            subprocess.Popen(cmd, start_new_session=True, close_fds=True)
    except OSError:
        pass


def _pid_alive(pid: int) -> bool:
    try:
        import psutil
        return psutil.pid_exists(pid)
    except ImportError:
        try:
            os.kill(pid, 0)
            return True
        except OSError:
            return False


def register_autostart() -> bool:
    """Install the OS-level autostart entry. Returns True on success."""
    if config.is_windows():
        return _register_windows_task()
    if config.is_macos():
        return _register_macos_daemon()
    return False


def _register_windows_task() -> bool:
    exe = _guardian_command()
    # schtasks needs a single command string; quote each piece.
    tr = " ".join(f'"{part}"' if " " in part else part for part in exe)
    try:
        subprocess.run(
            ["schtasks", "/Create", "/TN", _TASK_NAME, "/TR", tr,
             "/SC", "ONLOGON", "/RL", "HIGHEST", "/F"],
            capture_output=True, check=False, creationflags=_no_window(),
        )
        return True
    except OSError:
        return False


def _register_macos_daemon() -> bool:
    plist = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.trilionai.blockapp.guardian</string>
  <key>ProgramArguments</key>
  <array>{"".join(f"<string>{a}</string>" for a in _guardian_command())}</array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
</dict>
</plist>
"""
    target = "/Library/LaunchDaemons/com.trilionai.blockapp.guardian.plist"
    try:
        with open(target, "w", encoding="utf-8") as fh:
            fh.write(plist)
        subprocess.run(["launchctl", "load", target],
                       capture_output=True, check=False)
        return True
    except OSError:
        return False
