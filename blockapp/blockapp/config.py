"""Global configuration, filesystem paths, and safety lists for BlockApp.

Everything platform-specific is resolved lazily so this module imports cleanly
on any OS (including the headless build machine).
"""
from __future__ import annotations

import os
import sys

APP_NAME = "BlockApp"
APP_VERSION = "0.1.0"

# ---------------------------------------------------------------------------
# Platform helpers
# ---------------------------------------------------------------------------

def is_windows() -> bool:
    return os.name == "nt"


def is_macos() -> bool:
    return sys.platform == "darwin"


def data_dir() -> str:
    """Directory where rules and state live.

    We prefer a system-level, admin-writable location so a standard user
    cannot trivially edit the rules file. Falls back to a user directory when
    the system location is not writable (e.g. during development).
    """
    if is_windows():
        base = os.environ.get("PROGRAMDATA", r"C:\ProgramData")
        path = os.path.join(base, APP_NAME)
    elif is_macos():
        path = os.path.join("/Library", "Application Support", APP_NAME)
    else:
        path = os.path.join(os.path.expanduser("~"), ".local", "share", "blockapp")

    try:
        os.makedirs(path, exist_ok=True)
        # Probe writability; fall back to a user dir if we cannot write.
        probe = os.path.join(path, ".probe")
        with open(probe, "w") as fh:
            fh.write("ok")
        os.remove(probe)
        return path
    except OSError:
        fallback = os.path.join(os.path.expanduser("~"), ".blockapp")
        os.makedirs(fallback, exist_ok=True)
        return fallback


def hosts_path() -> str:
    if is_windows():
        return os.path.join(
            os.environ.get("SystemRoot", r"C:\Windows"),
            "System32", "drivers", "etc", "hosts",
        )
    return "/etc/hosts"


# ---------------------------------------------------------------------------
# Enforcement constants
# ---------------------------------------------------------------------------

# The guardian rewrites only the region between these markers in the hosts file.
HOSTS_MARKER_START = "# >>> BlockApp managed block >>>"
HOSTS_MARKER_END = "# <<< BlockApp managed block <<<"

# IP the blocked domains are redirected to (a black hole).
HOSTS_SINK = "0.0.0.0"

# How often the guardian re-evaluates and enforces rules, in seconds.
ENFORCE_INTERVAL_SECONDS = 3

# Above this duration a block requires the stronger 3-step confirmation flow.
STRONG_CONFIRM_THRESHOLD_HOURS = 5

# Number of confirmation steps for each tier.
CONFIRM_STEPS_NORMAL = 2
CONFIRM_STEPS_STRONG = 3

# How many times we ask (with motivational nudges) before allowing an unlock.
UNLOCK_CHALLENGE_STEPS = 3

# Wrong master password -> attempts are frozen for this many hours.
WRONG_PASSWORD_LOCKOUT_HOURS = 24

# ---------------------------------------------------------------------------
# Safety lists — things that must NEVER be blockable
# ---------------------------------------------------------------------------

# Executables whose blocking could make the machine unusable or lock the user
# out of the OS entirely. Compared case-insensitively by base name.
PROTECTED_APPS = {
    # Windows core
    "explorer.exe", "winlogon.exe", "csrss.exe", "services.exe", "lsass.exe",
    "svchost.exe", "smss.exe", "wininit.exe", "dwm.exe", "logonui.exe",
    "system", "registry", "conhost.exe", "ctfmon.exe", "fontdrvhost.exe",
    "sihost.exe", "runtimebroker.exe", "spoolsv.exe", "cmd.exe",
    "powershell.exe", "python.exe", "pythonw.exe", "blockapp.exe",
    # macOS core
    "finder", "windowserver", "loginwindow", "dock", "systemuiserver",
    "launchd", "kernel_task", "coreauthd", "securityd", "python", "python3",
}


def _protected_path_prefixes() -> list[str]:
    if is_windows():
        sysroot = os.environ.get("SystemRoot", r"C:\Windows")
        progdata = os.environ.get("PROGRAMDATA", r"C:\ProgramData")
        prefixes = [
            sysroot,
            os.environ.get("ProgramFiles", r"C:\Program Files"),
            os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)"),
            progdata,
            r"C:\\",
        ]
    elif is_macos():
        prefixes = ["/System", "/Library", "/usr", "/bin", "/sbin", "/private", "/"]
    else:
        prefixes = ["/usr", "/bin", "/sbin", "/etc", "/boot", "/lib", "/"]
    return [p.rstrip("\\/").lower() for p in prefixes if p]


def is_app_protected(name: str) -> bool:
    return os.path.basename(name).strip().lower() in PROTECTED_APPS


def is_path_protected(path: str) -> bool:
    """True if `path` is a system location that must never be blocked."""
    try:
        norm = os.path.normpath(os.path.abspath(path)).lower()
    except (OSError, ValueError):
        return True  # if we cannot even resolve it, refuse to touch it

    # Never allow a bare drive root / filesystem root.
    if is_windows():
        if len(norm) <= 3:  # e.g. "c:\"
            return True
    else:
        if norm in ("/", ""):
            return True

    for prefix in _protected_path_prefixes():
        if norm == prefix or norm.startswith(prefix + os.sep):
            return True
    # Never block our own data directory.
    if norm.startswith(data_dir().lower()):
        return True
    return False
