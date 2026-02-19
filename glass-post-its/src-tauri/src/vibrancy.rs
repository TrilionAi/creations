use tauri::WebviewWindow;

#[allow(unused_variables)]
pub fn apply_glass(window: &WebviewWindow, priority: &str) {
    let color = match priority {
        "red" => (255, 100, 100, 40),
        "orange" => (255, 180, 100, 40),
        "yellow" => (255, 255, 150, 40),
        "green" => (100, 255, 150, 40),
        _ => (255, 255, 255, 25), // "glass" - subtle white
    };

    #[cfg(target_os = "windows")]
    {
        use window_vibrancy::apply_acrylic;
        let _ = apply_acrylic(window, Some((color.0, color.1, color.2, color.3)));
    }

    #[cfg(target_os = "macos")]
    {
        use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
        let _ = apply_vibrancy(window, NSVisualEffectMaterial::HudWindow, None, None);
    }
}
