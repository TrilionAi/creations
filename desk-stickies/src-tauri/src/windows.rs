use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

pub fn create_postit_window(
    app: &AppHandle,
    id: &str,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
) -> Result<(), String> {
    let label = format!("postit-{}", id);

    WebviewWindowBuilder::new(app, &label, WebviewUrl::App("index.html".into()))
        .title("Post-it")
        .inner_size(width, height)
        .position(x, y)
        .decorations(false)
        .transparent(true)
        .visible(true)
        .resizable(true)
        // Sticky notes must never maximize (double-click on the drag
        // region would otherwise blow the note up to full screen)
        .maximizable(false)
        .skip_taskbar(true)
        .build()
        .map_err(|e| e.to_string())?;

    Ok(())
}
