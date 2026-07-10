<h1 align="center">BlockApp</h1>
<p align="center"><strong>Block distractions. Build discipline.</strong></p>
<p align="center">A cross-platform desktop focus tool that enforces your own discipline — with intentional friction, not willpower.</p>

---

## Overview

BlockApp is a desktop application for people who want to hold themselves
accountable. You choose what to block — an **application**, a **website**, or a
**folder** — and for how long: a fixed duration (from minutes to months) or a
recurring weekly schedule. The moment a block is confirmed, it is **locked in
for the day**; it cannot be undone until the next day, and only after passing a
short motivational challenge.

The product thesis is behavioural, not technical: most focus tools fail because
they are trivial to switch off in a moment of weakness. BlockApp is engineered
so that turning a block off *on impulse* is hard enough that your disciplined
self wins — while never letting you lock yourself out of your own machine.

## Key features

- **Three block types** — applications (process is terminated on launch),
  websites (blocked system-wide via the `hosts` file, so it works in every
  browser at once), and folders (access denied via OS permissions).
- **Flexible scheduling** — block for a set duration or on a recurring weekly
  schedule with per-day time windows (including windows that wrap past midnight).
- **Graduated confirmation** — 2 confirmation steps for short blocks; an
  explicit warning plus 3 steps for long blocks (5 hours or more).
- **Same-day lock** — once confirmed, a block cannot be removed until the next
  calendar day.
- **Motivational unlock gate** — removing a block requires the master password
  plus three motivational check-ins.
- **Anti-impulse lockout** — a single wrong master password freezes all changes
  for 24 hours.
- **Safety first** — core OS executables, system folders, drive roots, and the
  app itself can never be blocked.

## Engineering highlights

- **Split-process architecture** — a background **guardian** enforces the rules
  independently of the UI. Closing the window does not lift a block. The
  guardian runs as a single instance, relaunches at login with elevated
  privileges, and self-heals.
- **Tamper-evident storage** — rules are persisted as a signed (HMAC) document
  with an atomic write and a mirrored backup. Deleting or hand-editing the file
  invalidates the signature, and the guardian transparently restores the last
  known-good copy.
- **System-wide web blocking** — a marker-delimited region of the `hosts` file
  is owned and synchronised by the app, leaving all unrelated entries intact,
  with a DNS-cache flush on change.
- **Secure secrets** — the master password is stored as a salted PBKDF2-SHA256
  hash (200k iterations); verification is constant-time.
- **Fully localisable** — every user-facing string lives in one module.
- **Headless-tested core** — all business logic (scheduling, confirmation
  tiers, the same-day lock, hosts synchronisation) is covered by tests that run
  without a display, and gate every CI build.

## Tech stack

| Area | Choice |
|------|--------|
| Language | Python 3.12 |
| UI | Tkinter (zero third-party UI dependencies) |
| Process control | psutil |
| Packaging | PyInstaller — portable `.exe` (Windows, auto-elevating via UAC) and `.dmg` (macOS) |
| CI/CD | GitHub Actions — test → build (Windows + macOS) → release |

## The discipline flow

| Situation | What happens |
|-----------|--------------|
| Creating a block under 5h | 2 confirmation steps |
| Creating a block of 5h or more | Extra warning + 3 confirmation steps |
| After the final confirmation | Locked until tomorrow — no early undo |
| Removing a block (next day) | Master password + 3 motivational questions |
| Wrong master password | All changes frozen for 24 hours |

## Requirements

BlockApp needs **administrator / elevated** privileges to edit the hosts file,
change folder permissions, and reliably terminate processes. The Windows build
requests elevation automatically via UAC.

## Running from source

```bash
pip install -r requirements.txt
python -m blockapp             # launch the UI
python -m blockapp --guardian  # run the guardian loop directly
python tests/test_core.py      # headless logic tests
```

## Roadmap

- v0.1.0 — Windows-first release (primary target), macOS best-effort.
- Next — a true SYSTEM-level Windows service and code-signed builds for both
  platforms.

---

<p align="center"><sub>Part of the <a href="https://github.com/TrilionAi/creations">creations</a> collection of desktop productivity apps.</sub></p>
