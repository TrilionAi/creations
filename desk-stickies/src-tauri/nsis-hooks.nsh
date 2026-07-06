; NSIS hooks for Desk Stickies
; Hard delete: remove all app data on real uninstall only.
; During an update, Tauri runs the old uninstaller with /UPDATE
; ($UpdateMode = 1) — in that case we must NOT touch user data,
; otherwise every update would wipe the user's stickies.

!macro NSIS_HOOK_POSTUNINSTALL
  ${If} $UpdateMode <> 1
    ; Make sure $APPDATA/$LOCALAPPDATA resolve to the user profile
    SetShellVarContext current
    ; Current identifier (tauri.conf.json): config, SQLite DB and WebView2 data
    RMDir /r "$APPDATA\com.trilionai.desk-stickies"
    RMDir /r "$LOCALAPPDATA\com.trilionai.desk-stickies"
    ; Legacy identifier from old "Glass Post-its" builds — clean leftovers too
    RMDir /r "$APPDATA\com.root.glass-post-its"
    RMDir /r "$LOCALAPPDATA\com.root.glass-post-its"
  ${EndIf}
!macroend
