; NSIS hooks for Glass Post-its
; Hard delete: remove all app data on uninstall

!macro NSIS_HOOK_POSTUNINSTALL
  ; Remove WebView2 data and app config from AppData
  RMDir /r "$APPDATA\com.root.glass-post-its"
  RMDir /r "$LOCALAPPDATA\com.root.glass-post-its"
!macroend
