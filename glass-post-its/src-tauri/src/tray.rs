use tauri::{
    AppHandle, Emitter, Manager,
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    image::Image,
};

pub fn setup_tray(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let new_postit = MenuItem::with_id(app, "new", "New Post-it", true, None::<&str>)?;
    let show_all = MenuItem::with_id(app, "show_all", "Show All", true, None::<&str>)?;
    let hide_all = MenuItem::with_id(app, "hide_all", "Hide All", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&new_postit, &show_all, &hide_all, &quit])?;

    TrayIconBuilder::new()
        .menu(&menu)
        .tooltip("Glass Post-its")
        .icon(Image::from_bytes(include_bytes!("../icons/32x32.png"))?)
        .on_menu_event(move |app, event| {
            match event.id.as_ref() {
                "new" => {
                    let _ = app.emit("create-new-postit", ());
                }
                "show_all" => {
                    for (label, window) in app.webview_windows() {
                        if label.starts_with("postit-") {
                            let _ = window.show();
                        }
                    }
                }
                "hide_all" => {
                    for (label, window) in app.webview_windows() {
                        if label.starts_with("postit-") {
                            let _ = window.hide();
                        }
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}
