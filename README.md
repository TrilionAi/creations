# Creations

A collection of lightweight, transparent desktop utilities built for everyday productivity. Each tool is designed to stay out of your way while keeping important info always visible.

## The Apps

---

### [Desk Stickies](desk-stickies/)

Paper-style sticky notes that float on your desktop.

- Rich text editor with bold, italic, underline, strikethrough, highlights, headings, and code blocks
- Nested checklists with checkboxes — when all tasks are done, the note auto-turns green
- Free color picker to customize each note's color
- Pin notes as always-on-top, resize and drag anywhere
- All notes persist across restarts (saved to SQLite)
- **Stack:** Tauri v2, React 19, TypeScript, Tiptap

**Tips:**
- Right-click the system tray icon to create new notes or show/hide all at once
- Click the note title to rename it
- Use `Ctrl+B` for bold, `Ctrl+I` for italic, and the toolbar for checklists and highlights
- Pin a note with the pin button so it stays above all windows — great for keeping a TODO visible while you work

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

## Download

Head to the [Releases](https://github.com/TrilionAi/creations/releases) page and grab the latest version for your platform:

| App | Windows | macOS |
|-----|---------|-------|
| Desk Stickies | `.exe` installer | `.dmg` disk image |
| Float Timer | `.exe` installer | `.dmg` disk image |
| Universal Editor | `.exe` installer + Chrome `.zip` | Coming soon |
| Perf Overlay | Portable `.exe` | Coming soon |

> Just download, install, and run. No setup or configuration needed.

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
├── .github/workflows/   # CI/CD builds for all apps
├── CONTRIBUTING.md      # How to contribute
└── LICENSE              # MIT License
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with care by [TrilionAi](https://github.com/TrilionAi)
