mod commands;
mod database;
mod tray;
mod vibrancy;
mod windows;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .build(),
        )
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .invoke_handler(tauri::generate_handler![
            commands::create_postit_window,
            commands::focus_postit_window,
            commands::close_postit_window,
            commands::update_glass_tint,
            commands::set_always_on_top,
            commands::hide_all_windows,
            commands::show_all_windows,
        ])
        .setup(|app| {
            // Create the hidden manager window
            let _manager_window = tauri::WebviewWindowBuilder::new(
                app,
                "manager",
                tauri::WebviewUrl::App("index.html".into()),
            )
            .title("Manager")
            .visible(false)
            .build()?;

            // Setup system tray
            tray::setup_tray(app.handle())?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
