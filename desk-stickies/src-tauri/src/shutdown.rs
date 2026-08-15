//! Answer Windows' session-end handshake so the app never appears on the
//! "This app is preventing shutdown" screen.
//!
//! When the user shuts down or logs off, Windows sends WM_QUERYENDSESSION to
//! every top-level window and waits. Tauri/tao leaves the reply to
//! DefWindowProc and keeps the process alive through WM_ENDSESSION, so the OS
//! runs out its timeout and lists every note window ("postit-1", "postit-2",
//! ...) as blocking the shutdown. Every edit is already persisted to SQLite by
//! the time these messages arrive, so the honest reply is: agree instantly,
//! and exit for real once the session is truly ending.

#[cfg(windows)]
mod imp {
    use tauri::WebviewWindow;
    use windows_sys::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
    use windows_sys::Win32::UI::Shell::{DefSubclassProc, SetWindowSubclass};
    use windows_sys::Win32::UI::WindowsAndMessaging::{WM_ENDSESSION, WM_QUERYENDSESSION};

    unsafe extern "system" fn subclass_proc(
        hwnd: HWND,
        msg: u32,
        wparam: WPARAM,
        lparam: LPARAM,
        _subclass_id: usize,
        _ref_data: usize,
    ) -> LRESULT {
        match msg {
            // "May the session end?" — yes, immediately. There is nothing to
            // flush: notes are saved on every edit, not on exit.
            WM_QUERYENDSESSION => 1,
            // The session IS ending. Exit now instead of waiting to be killed
            // after the timeout that puts this app on the blocking screen.
            // wparam == 0 means the shutdown was cancelled by someone else —
            // keep running, the notes stay on screen.
            WM_ENDSESSION if wparam != 0 => std::process::exit(0),
            _ => DefSubclassProc(hwnd, msg, wparam, lparam),
        }
    }

    pub fn install(window: &WebviewWindow) {
        // Subclassing only works from the thread that owns the window, and
        // windows are created from async commands too — always hop over.
        let win = window.clone();
        let _ = window.run_on_main_thread(move || {
            if let Ok(hwnd) = win.hwnd() {
                unsafe {
                    SetWindowSubclass(hwnd.0 as HWND, Some(subclass_proc), 1, 0);
                }
            }
        });
    }
}

#[cfg(not(windows))]
mod imp {
    /// macOS and Linux end sessions through the ordinary quit path; nothing
    /// to intercept there.
    pub fn install(_window: &tauri::WebviewWindow) {}
}

pub use imp::install;
