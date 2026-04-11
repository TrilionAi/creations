# Desk Stickies

Paper-style sticky notes that float on your desktop. Built with **Tauri v2**, **React 19**, and **Tiptap** rich text editor.

Each sticky note is a separate window with a paper texture look and free color customization.

## Features

- **Paper Sticky Note Style** - Clean paper-style notes with free color picker
- **Rich Text Editor** - Bold, italic, underline, strikethrough, highlight, headings, code, blockquotes
- **Checklists** - Nested task lists with checkboxes
- **Free Color Picker** - Choose any color for your sticky notes
- **Auto-Green** - When all tasks in a checklist are completed, the note automatically turns green
- **System Tray** - Create, show/hide all, and quit from the tray icon
- **Persistence** - Notes, content, positions, and sizes are saved to SQLite
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
3. **Edit** - Click on the note to start typing. Use the format toolbar for rich text
4. **Checklists** - Click the checkbox button in the toolbar to add a task list
5. **Color** - Use the color picker to choose any color for your note
6. **Pin** - Click the pin button to keep a note always on top
7. **Close** - Click X to close a note (data is preserved)
8. **Show/Hide All** - Use the tray menu to show or hide all notes

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
│   │   ├── FormatToolbar.tsx # Rich text formatting buttons
│   │   ├── PriorityPicker.tsx # Color selector
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
