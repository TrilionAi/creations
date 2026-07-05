use tauri::{
    AppHandle, Emitter, Manager,
    menu::{CheckMenuItem, Menu, MenuItem, PredefinedMenuItem},
    tray::TrayIconBuilder,
    image::Image,
};
use tauri_plugin_autostart::ManagerExt;

pub fn setup_tray(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let new_postit = MenuItem::with_id(app, "new", "New Post-it", true, None::<&str>)?;
    let notes_hub = MenuItem::with_id(app, "hub", "Notes && Trash", true, None::<&str>)?;
    let show_all = MenuItem::with_id(app, "show_all", "Show All", true, None::<&str>)?;
    let hide_all = MenuItem::with_id(app, "hide_all", "Hide All", true, None::<&str>)?;

    let is_autostart = app.autolaunch().is_enabled().unwrap_or(false);
    let autostart = CheckMenuItem::with_id(
        app, "autostart", "Start with System", true, is_autostart, None::<&str>,
    )?;

    let sep1 = PredefinedMenuItem::separator(app)?;
    let sep2 = PredefinedMenuItem::separator(app)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(
        app,
        &[&new_postit, &notes_hub, &show_all, &hide_all, &sep1, &autostart, &sep2, &quit],
    )?;

    TrayIconBuilder::new()
        .menu(&menu)
        .tooltip("Glass Post-its")
        .icon(Image::from_bytes(include_bytes!("../icons/32x32.png"))?)
        .on_menu_event(move |app, event| {
            match event.id.as_ref() {
                "new" => {
                    let _ = app.emit("create-new-postit", ());
                }
                "hub" => {
                    if let Some(window) = app.get_webview_window("hub") {
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    } else {
                        let _ = tauri::WebviewWindowBuilder::new(
                            app,
                            "hub",
                            tauri::WebviewUrl::App("index.html".into()),
                        )
                        .title("Desk Stickies — Notes & Trash")
                        .inner_size(400.0, 560.0)
                        .min_inner_size(320.0, 400.0)
                        .center()
                        .build();
                    }
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
                "autostart" => {
                    let manager = app.autolaunch();
                    let is_enabled = manager.is_enabled().unwrap_or(false);
                    if is_enabled {
                        let _ = manager.disable();
                    } else {
                        let _ = manager.enable();
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
