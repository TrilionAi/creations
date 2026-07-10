"""Data model for block rules and their (de)serialization."""
from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from typing import List, Optional

RULE_TYPES = ("app", "website", "folder")
MODE_DURATION = "duration"
MODE_SCHEDULE = "schedule"


@dataclass
class Window:
    """A recurring blocked time window.

    days: weekday indices, Monday=0 .. Sunday=6.
    start/end: "HH:MM" local time. If end <= start the window wraps past
    midnight (e.g. 22:00 -> 06:00).
    """
    days: List[int]
    start: str
    end: str

    def to_dict(self) -> dict:
        return {"days": list(self.days), "start": self.start, "end": self.end}

    @classmethod
    def from_dict(cls, d: dict) -> "Window":
        return cls(days=list(d.get("days", [])),
                   start=str(d.get("start", "00:00")),
                   end=str(d.get("end", "00:00")))


@dataclass
class Rule:
    id: str
    type: str            # one of RULE_TYPES
    target: str          # exe name, domain, or folder path
    mode: str            # MODE_DURATION or MODE_SCHEDULE
    label: str = ""
    end_ts: Optional[float] = None          # absolute epoch end for duration mode
    windows: List[Window] = field(default_factory=list)   # for schedule mode
    committed_date: str = ""                # YYYY-MM-DD the rule was locked in
    created_ts: float = 0.0
    enabled: bool = True

    @staticmethod
    def new(type: str, target: str, mode: str, **kwargs) -> "Rule":
        return Rule(
            id=uuid.uuid4().hex,
            type=type,
            target=target,
            mode=mode,
            created_ts=time.time(),
            **kwargs,
        )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": self.type,
            "target": self.target,
            "mode": self.mode,
            "label": self.label,
            "end_ts": self.end_ts,
            "windows": [w.to_dict() for w in self.windows],
            "committed_date": self.committed_date,
            "created_ts": self.created_ts,
            "enabled": self.enabled,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "Rule":
        return cls(
            id=str(d.get("id") or uuid.uuid4().hex),
            type=str(d.get("type", "app")),
            target=str(d.get("target", "")),
            mode=str(d.get("mode", MODE_DURATION)),
            label=str(d.get("label", "")),
            end_ts=d.get("end_ts"),
            windows=[Window.from_dict(w) for w in d.get("windows", [])],
            committed_date=str(d.get("committed_date", "")),
            created_ts=float(d.get("created_ts", 0.0)),
            enabled=bool(d.get("enabled", True)),
        )
