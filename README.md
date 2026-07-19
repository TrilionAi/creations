# Creations

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platforms](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS-lightgrey)](https://github.com/TrilionAi/creations/releases)
[![Releases](https://img.shields.io/github/v/release/TrilionAi/creations?label=latest%20release)](https://github.com/TrilionAi/creations/releases)
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D0J123HIA2)

A collection of lightweight desktop utilities built for everyday productivity — sticky notes, floating timers, screen annotation, and system monitoring. Each tool is designed to stay out of your way while keeping important info always visible, and ships with automated cross-platform builds (Windows + macOS) via GitHub Actions.

## The Apps

---

### [Desk Stickies](desk-stickies/)

Paper-style sticky notes that float on your desktop — with a distraction-free, Notion-like editing experience.

- **Floating format menu** — no fixed toolbar eating your space; select text and a bubble appears with bold, italic, underline, strikethrough, highlight, text color and font size
- **"+" block menu** — insert checklists, bullet/numbered lists, collapsible toggle sections, headings, quotes and code blocks
- Nested checklists with checkboxes — when all tasks are done, the note auto-turns green
- **Roll up** any note to just its title bar; set per-note **color and opacity**
- **Trash with restore** — closed notes go to a searchable "Notes & Trash" window instead of being lost
- Pin notes as always-on-top, resize and drag anywhere; everything persists across restarts (SQLite)
- **Stack:** Tauri v2, React 19, TypeScript, Tiptap

**Tips:**
- Right-click the system tray icon to create new notes, open "Notes & Trash", or show/hide all at once
- Select any text to open the floating format menu; use the `+` button in the title bar for blocks
- Use `Ctrl+B` for bold, `Ctrl+I` for italic
- Pin a note so it stays above all windows — great for keeping a TODO visible while you work

---

### [Float Timer](float-timer/)

Circular timer and stopwatch widget that stays always visible on your desktop.

- Multiple independent timers — run as many as you need simultaneously
- Click the title to rename each timer (e.g., "Break", "Meeting", "Pomodoro")
- Switch between timer (countdown) and stopwatch (count up) modes
- Built-in Pomodoro presets (25min work, 5min break, etc.)
- Custom arc color per timer so you can tell them apart at a glance
- Looping alarm with a silence button when time is up
- **Stack:** Python, PyQt5

**Tips:**
- Right-click the widget to access settings, switch modes, or add a new timer
- Drag the circular widget anywhere on your screen — it stays always-on-top
- Use Pomodoro presets for productivity: 25 minutes of focus, 5 minute break
- Each timer has its own color — set different colors to visually group your timers

---

### [Universal Editor](universal-editor/)

Draw and annotate directly over any window on your screen. Comes with a desktop overlay app and a Chrome extension.

- **Draw mode** — freehand drawing over any window with customizable pen color and thickness
- **Text mode** — place floating text annotations anywhere on screen
- **Reading guide** — highlights the line you're reading, great for long documents or code reviews
- Chrome extension brings the same tools to any webpage
- **Stack:** Python (desktop), JavaScript (Chrome extension)

**Tips:**
- `Ctrl+Num1` — toggle draw mode (start/stop drawing over your screen)
- `Ctrl+Num2` — toggle reading guide (highlights text as you move your mouse)
- `Ctrl+Num3` — toggle text annotation mode (click anywhere to place a note)
- `Ctrl+Num0` — quit the app
- Right-click while drawing to open the context menu and change colors, thickness, or clear the canvas
- The Chrome extension adds the same tools inside your browser — load it as an unpacked extension from the `chrome-extension/` folder

---

### [Perf Overlay](perf-overlay/)

Lightweight system performance monitoring overlay that stays on top of everything.

- Real-time CPU, GPU, RAM usage and temperatures
- Transparent overlay that doesn't get in the way of your work
- Drag to reposition anywhere on screen
- Configurable hotkeys to toggle visibility
- Auto-start with Windows option
- **Stack:** Python, PyQt5

**Tips:**
- `Ctrl+Num1` — toggle the overlay visibility
- `Ctrl+Num2` — enter drag mode to reposition the overlay
- `Ctrl+Num3` — quit the app
- Right-click the system tray icon to access settings where you can customize fonts, colors, temperature thresholds, and hotkeys
- Works great alongside games or full-screen apps to keep an eye on your system

---

### [BlockApp](blockapp/)

Block distractions. Build discipline. A focus tool that enforces its own rules with intentional friction, not willpower — block an app, website, or folder for a fixed duration or a recurring weekly schedule, and once confirmed it's locked in until tomorrow.

- **Three block types** — apps (process killed on launch), websites (blocked system-wide via the `hosts` file), folders (OS-level permission denial)
- **Graduated confirmation** — 2 steps for short blocks, an extra warning + 3 steps for 5h+ blocks
- **Same-day lock** — no undo until the next calendar day
- **Anti-impulse lockout** — one wrong master password freezes all changes for 24 hours
- **Split-process architecture** — a background guardian enforces rules independently of the UI; closing the window doesn't lift a block
- **Tamper-evident storage** — HMAC-signed rules file with atomic writes and self-healing backup restore
- **Stack:** Python, Tkinter, psutil, PyInstaller

**Tips:**
- Needs administrator/elevated privileges to edit the hosts file and reliably terminate processes
- The Windows build requests elevation automatically via UAC
- See [blockapp/README.md](blockapp/README.md) for the full engineering write-up

---

## Also Live On the Web

### [Math Dojo](https://playmathdojo.com) · [source](https://github.com/TrilionAi/math-dojo)

A free, belt-ranked math practice game inspired by the Kumon method — earn your way from White Belt (basic addition) to Coral Belt (Calculus I), one small step at a time. 110 stripes across 6 belts, English/Portuguese/Spanish, optional account for syncing progress across devices. No install needed — it's a web app, not a desktop download like the others in this repo, so it now lives in [its own repository](https://github.com/TrilionAi/math-dojo).

---

## Download

Head to the [Releases](https://github.com/TrilionAi/creations/releases) page and grab the latest version for your platform:

| App | Windows | macOS |
|-----|---------|-------|
| Desk Stickies | `.exe` installer | `.dmg` disk image |
| Float Timer | `.exe` installer | `.dmg` disk image |
| Universal Editor | `.exe` installer + Chrome `.zip` | Coming soon |
| Perf Overlay | Portable `.exe` | Coming soon |
| BlockApp | Portable `.exe` | `.dmg` disk image |

> Just download, install, and run. No setup or configuration needed.
>
> Math Dojo isn't in this table — it's a web app, just open [playmathdojo.com](https://playmathdojo.com).

### Antivirus / False Positive Warning

**Windows Defender and some antivirus software may flag these apps as suspicious.** This is a common false positive that happens with virtually all independent/open-source desktop apps and is **not** a virus or malware.

**Why does this happen?**
- These apps are built with tools like [PyInstaller](https://pyinstaller.org/) and [Tauri](https://tauri.app/) that bundle an interpreter or runtime into a single executable. Antivirus engines often flag this bundling pattern because it looks similar to how some malware packages itself — even though the technique is completely legitimate and used by thousands of open-source projects.
- The apps are not signed with an expensive code-signing certificate (which costs hundreds of dollars per year). Without a signature, Windows SmartScreen shows a "Windows protected your PC" warning for any new/unknown publisher.
- This is a well-known issue in the open-source community: [PyInstaller FAQ](https://pyinstaller.org/en/stable/antivirusfalsepositive.html), [Tauri FAQ](https://tauri.app/distribute/sign/windows/).

**What to do:**
1. When Windows SmartScreen shows "Windows protected your PC", click **"More info"** and then **"Run anyway"**
2. If your antivirus quarantines the `.exe`, add it to the exceptions/whitelist
3. You can verify the app is safe by checking the source code right here in this repository — everything is open source

> All the code is available in this repo for full transparency. You're welcome to build from source if you prefer not to trust the pre-built binaries.

## Building from Source

Each app is self-contained in its own folder with its own dependencies.

```bash
git clone https://github.com/TrilionAi/creations.git
cd creations/<app-folder>
```

### Desk Stickies (Tauri)
```bash
cd desk-stickies
npm install
npm run tauri dev      # development
npm run tauri build    # production build
```

### Python Apps (Float Timer, Universal Editor, Perf Overlay)
```bash
cd <app-folder>
pip install -r requirements.txt
python main.py
```

## Contributing

Contributions are welcome! Whether it's bug fixes, new features, or entirely new creations.

1. Fork this repository
2. Create a feature branch (`git checkout -b feat/my-improvement`)
3. Make your changes and test locally
4. Submit a Pull Request — we'll review it and merge if it looks good

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Project Structure

```
creations/
├── desk-stickies/       # Tauri + React desktop sticky notes
├── float-timer/         # Python circular timer widget
├── universal-editor/    # Python drawing overlay + Chrome extension
├── perf-overlay/        # Python system performance monitor
├── blockapp/            # Python focus/distraction-blocking tool
├── .github/workflows/   # CI/CD builds for all apps
├── CONTRIBUTING.md      # How to contribute
└── LICENSE              # MIT License
```

## Author

**Lucas Morosov** — Software Developer

[![GitHub](https://img.shields.io/badge/GitHub-TrilionAi-181717?logo=github)](https://github.com/TrilionAi)
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D0J123HIA2)

Creator and maintainer of all projects in this repository. Everything here is free — if one of these tools helped you and you'd like to say thanks, a tip is always welcome, but never the point. Designed, built, and tested every app from scratch — from architecture and UI to CI/CD pipelines and cross-platform packaging.

Development assisted by [Claude Code](https://claude.ai/code) (Anthropic).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
