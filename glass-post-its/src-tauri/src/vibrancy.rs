use tauri::WebviewWindow;

#[allow(unused_variables)]
pub fn apply_glass(window: &WebviewWindow, priority: &str) {
    #[cfg(target_os = "windows")]
    {
        use window_vibrancy::apply_acrylic;
        // Use very transparent tint - let the CSS handle the color overlay
        // The acrylic effect provides the frosted blur of the desktop behind
        let tint = match priority {
            "red" => (180, 40, 40, 80),
            "orange" => (180, 100, 30, 80),
            "yellow" => (180, 170, 50, 80),
            "green" => (40, 150, 70, 80),
            _ => (200, 200, 220, 60), // glass - very subtle cool white
        };
        let _ = apply_acrylic(window, Some((tint.0, tint.1, tint.2, tint.3)));
    }

    #[cfg(target_os = "macos")]
    {
        use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
        let _ = apply_vibrancy(window, NSVisualEffectMaterial::HudWindow, None, None);
    }
}
