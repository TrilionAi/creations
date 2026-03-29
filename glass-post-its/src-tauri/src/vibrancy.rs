use tauri::WebviewWindow;

#[allow(unused_variables)]
pub fn apply_glass(window: &WebviewWindow, priority: &str) {
    // Paper mode: no vibrancy/acrylic effects needed
    // The CSS provides the opaque paper background
    // Window transparency is kept for rounded corners
}
