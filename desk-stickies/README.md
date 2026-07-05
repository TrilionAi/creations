# Desk Stickies

Paper-style sticky notes that float on your desktop. Built with **Tauri v2**, **React 19**, and **Tiptap** rich text editor.

Each sticky note is a separate frameless window with a paper texture look, and the editing experience is fully distraction-free: no fixed toolbar — formatting appears in a floating bubble only when you select text, Notion-style.

## Features

- **Floating Format Menu** - Select text and a bubble menu appears with bold, italic, underline, strikethrough, highlight, text color, font size, and inline code — the note itself is 100% writing space
- **"+" Block Menu** - Insert checklists, bullet/numbered lists, collapsible toggle sections, headings, quotes, and code blocks from a compact menu in the title bar
- **Roll Up (Shade Mode)** - Collapse any note to just its title bar with one click
- **Trash & Restore** - Closing a note moves it to the trash; restore it anytime from the "Notes & Trash" window (auto-purged after 30 days)
- **Notes & Trash Window** - Search across all notes by title or content and jump to any of them
- **Color & Opacity** - Free color picker plus a per-note opacity slider for translucent notes
- **Checklists** - Nested task lists with checkboxes and collapsible sub-tasks
- **Auto-Green** - When all tasks in a checklist are completed, the note automatically turns green
- **System Tray** - Create, search, show/hide all, autostart, and quit from the tray icon
- **Persistence** - Notes, content, positions, sizes, colors, and opacity are saved to SQLite
- **Always-on-Top** - Pin notes above other windows
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
cd creations/desk-stickies

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
2. **New Note** - Right-click the tray icon and select "New Post-it"
3. **Edit** - Click on the note and start typing; select text to open the floating format menu
4. **Blocks** - Use the `+` button in the title bar for checklists, lists, toggles, headings, quotes, and code
5. **Color & Opacity** - Use the palette button in the title bar to pick any color and set the note's opacity
6. **Roll Up** - Click the chevron button to collapse a note to its title bar
7. **Pin** - Click the pin button to keep a note always on top
8. **Close** - Click X to move a note to the trash; restore it from "Notes & Trash" in the tray menu
9. **Search** - Open "Notes & Trash" from the tray to search all notes and jump to any of them

## Tech Stack

- **Tauri v2** - Native desktop framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tiptap** - Rich text editor (ProseMirror-based)
- **SQLite** - Local database via tauri-plugin-sql

## Project Structure

```
desk-stickies/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # React components
│   │   ├── PostIt.tsx      # Main sticky note container
│   │   ├── TitleBar.tsx    # Custom draggable title bar
│   │   ├── Editor.tsx      # Tiptap editor wrapper
│   │   ├── SelectionMenu.tsx # Floating bubble menu (formatting)
│   │   ├── BlockMenu.tsx   # "+" block insert menu
│   │   ├── PriorityPicker.tsx # Color & opacity picker
│   │   ├── HubView.tsx     # Notes & Trash window (search/restore)
│   │   └── Manager.tsx     # Hidden manager window
│   ├── hooks/              # React hooks
│   │   ├── usePostIt.ts    # Note state + auto-save
│   │   └── useAutoGreen.ts # Auto-green on all tasks done
│   ├── lib/                # Utilities
│   │   ├── database.ts     # SQLite operations
│   │   └── colors.ts       # Color definitions
│   ├── styles/             # CSS
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Window routing
│   └── main.tsx            # Entry point
├── src-tauri/              # Backend (Rust)
│   ├── src/                # Rust source code
│   ├── migrations/         # SQLite migrations
│   ├── capabilities/       # Tauri v2 permissions
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
└── package.json            # npm dependencies
```
