# Glass Post-its

Transparent, frosted-glass post-it notes that float on your desktop. Built with **Tauri v2**, **React 19**, and **Tiptap** rich text editor.

Each post-it is a separate transparent window with native glass/acrylic effects (Windows) or vibrancy (macOS).

## Features

- **Glass/Frosted Effect** - Native Acrylic (Windows) / Vibrancy (macOS) transparency
- **Rich Text Editor** - Bold, italic, underline, strikethrough, highlight, headings, code, blockquotes
- **Checklists** - Nested task lists with checkboxes
- **Priority Colors** - Visual priority system (Default, Red/Urgent, Orange/High, Yellow/Medium, Green/Done)
- **Auto-Green** - When all tasks in a checklist are completed, the post-it automatically turns green
- **System Tray** - Create, show/hide all, and quit from the tray icon
- **Persistence** - Post-its, content, positions, and sizes are saved to SQLite
- **Always-on-Top** - Pin post-its above other windows
- **Custom Title Bar** - Draggable, borderless windows with inline title editing

## Prerequisites

1. **Rust** - Install from [rustup.rs](https://rustup.rs/)
2. **Node.js** (v18+) - Install from [nodejs.org](https://nodejs.org/)

### Windows-specific
No additional dependencies required. Tauri uses WebView2 which comes preinstalled on Windows 10/11.

### macOS-specific
```bash
xcode-select --install
```

### Linux-specific
```bash
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf libssl-dev
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/TrilionAi/creations.git
cd creations/glass-post-its

# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

## Building for Production

```bash
npm run tauri build
```

The built installer will be in `src-tauri/target/release/bundle/`.

## Usage

1. **Launch** - The app starts with a system tray icon
2. **New Post-it** - Right-click the tray icon and select "New Post-it"
3. **Edit** - Click on the post-it to start typing. Use the format toolbar for rich text
4. **Checklists** - Click the checkbox button in the toolbar to add a task list
5. **Priority** - Click the colored dots below the toolbar to change priority/color
6. **Pin** - Click the pin button to keep a post-it always on top
7. **Close** - Click X to close a post-it (data is preserved)
8. **Show/Hide All** - Use the tray menu to show or hide all post-its

## Tech Stack

- **Tauri v2** - Native desktop framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **Tiptap** - Rich text editor (ProseMirror-based)
- **window-vibrancy** - Native glass effects
- **SQLite** - Local database via tauri-plugin-sql

## Project Structure

```
glass-post-its/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # React components
│   │   ├── PostIt.tsx      # Main post-it container
│   │   ├── TitleBar.tsx    # Custom draggable title bar
│   │   ├── Editor.tsx      # Tiptap editor wrapper
│   │   ├── FormatToolbar.tsx # Rich text formatting buttons
│   │   ├── PriorityPicker.tsx # Color/priority selector
│   │   └── Manager.tsx     # Hidden manager window
│   ├── hooks/              # React hooks
│   │   ├── usePostIt.ts    # Post-it state + auto-save
│   │   └── useAutoGreen.ts # Auto-green on all tasks done
│   ├── lib/                # Utilities
│   │   ├── database.ts     # SQLite operations
│   │   └── colors.ts       # Priority color definitions
│   ├── styles/             # CSS
│   │   ├── global.css      # Reset + base styles
│   │   ├── glass.css       # Glass surface + UI styles
│   │   └── editor.css      # Tiptap editor styles
│   ├── types/              # TypeScript types
│   │   └── postit.ts       # PostIt, Task, SubTask interfaces
│   ├── App.tsx             # Window routing (manager vs post-it)
│   └── main.tsx            # Entry point
├── src-tauri/              # Backend (Rust)
│   ├── src/
│   │   ├── lib.rs          # Tauri setup + plugins
│   │   ├── main.rs         # Entry point
│   │   ├── commands.rs     # Tauri IPC commands
│   │   ├── windows.rs      # Window creation
│   │   ├── vibrancy.rs     # Glass effect application
│   │   ├── tray.rs         # System tray setup
│   │   └── database.rs     # Data structures
│   ├── migrations/         # SQLite migrations
│   ├── capabilities/       # Tauri v2 permissions
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
└── package.json            # npm dependencies
```
