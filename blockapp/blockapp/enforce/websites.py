"""Website blocking via the system hosts file.

We own only the region between our two markers, so unrelated hosts entries are
never disturbed. Blocked domains (and their www. variant) are redirected to a
black-hole IP, which takes effect across every browser at once.
"""
from __future__ import annotations

import os
from typing import Iterable, List, Set

from .. import config


def normalize(domain: str) -> str:
    """Strip scheme, path, and leading www. from a user-entered domain."""
    d = domain.strip().lower()
    for prefix in ("http://", "https://"):
        if d.startswith(prefix):
            d = d[len(prefix):]
    d = d.split("/")[0].split("?")[0].strip()
    if d.startswith("www."):
        d = d[4:]
    return d


def _expand(domains: Iterable[str]) -> List[str]:
    out: List[str] = []
    seen: Set[str] = set()
    for raw in domains:
        d = normalize(raw)
        if not d or d in seen:
            continue
        seen.add(d)
        out.append(d)
        out.append("www." + d)
    return out


def _managed_block(domains: Iterable[str]) -> str:
    lines = [config.HOSTS_MARKER_START]
    for host in _expand(domains):
        lines.append(f"{config.HOSTS_SINK}\t{host}")
    lines.append(config.HOSTS_MARKER_END)
    return "\n".join(lines)


def _strip_existing(text: str) -> str:
    start, end = config.HOSTS_MARKER_START, config.HOSTS_MARKER_END
    if start not in text:
        return text.rstrip("\n")
    before, _, rest = text.partition(start)
    _, _, after = rest.partition(end)
    return (before.rstrip("\n") + "\n" + after.lstrip("\n")).rstrip("\n")


def sync(domains: Iterable[str]) -> bool:
    """Make the hosts file reflect exactly `domains`. Returns True on change."""
    domains = [d for d in domains if d]
    path = config.hosts_path()
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            current = fh.read()
    except OSError:
        current = ""

    base = _strip_existing(current)
    if domains:
        desired = (base + "\n\n" + _managed_block(domains) + "\n") if base else \
                  (_managed_block(domains) + "\n")
    else:
        desired = base + "\n" if base else ""

    if desired == current:
        return False

    try:
        tmp = path + ".blockapp.tmp"
        with open(tmp, "w", encoding="utf-8") as fh:
            fh.write(desired)
        os.replace(tmp, path)
        _flush_dns()
        return True
    except OSError:
        return False


def _flush_dns() -> None:
    if not config.is_windows():
        return
    try:
        import subprocess
        subprocess.run(["ipconfig", "/flushdns"],
                       capture_output=True, check=False,
                       creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
    except Exception:
        pass
