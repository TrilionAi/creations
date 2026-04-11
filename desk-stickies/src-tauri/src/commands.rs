use tauri::{AppHandle, Manager};
use crate::windows;
use crate::vibrancy;

#[tauri::command]
pub async fn create_postit_window(
    app: AppHandle,
    id: String,
    pos_x: f64,
    pos_y: f64,
    width: f64,
    height: f64,
    priority: String,
) -> Result<(), String> {
    windows::create_postit_window(&app, &id, pos_x, pos_y, width, height)?;
    // Apply vibrancy after window creation
    if let Some(window) = app.get_webview_window(&format!("postit-{}", id)) {
        vibrancy::apply_glass(&window, &priority);
    }
    Ok(())
}

#[tauri::command]
pub async fn close_postit_window(app: AppHandle, id: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&format!("postit-{}", id)) {
        window.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn update_glass_tint(app: AppHandle, id: String, priority: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&format!("postit-{}", id)) {
        vibrancy::apply_glass(&window, &priority);
    }
    Ok(())
}

#[tauri::command]
pub async fn set_always_on_top(app: AppHandle, id: String, pinned: bool) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&format!("postit-{}", id)) {
        window.set_always_on_top(pinned).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn hide_all_windows(app: AppHandle) -> Result<(), String> {
    for (label, window) in app.webview_windows() {
        if label.starts_with("postit-") {
            let _ = window.hide();
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn show_all_windows(app: AppHandle) -> Result<(), String> {
    for (label, window) in app.webview_windows() {
        if label.starts_with("postit-") {
            let _ = window.show();
        }
    }
    Ok(())
}
