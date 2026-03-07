"""
Win32 Utils - Constantes e helpers para Windows API (click-through, Z-order)
"""

import ctypes

try:
    user32 = ctypes.windll.user32
    GWL_EXSTYLE = -20
    WS_EX_TRANSPARENT = 0x00000020
    WS_EX_LAYERED = 0x00080000
    HWND_TOPMOST = -1
    SWP_NOMOVE = 0x0002
    SWP_NOSIZE = 0x0001
    SWP_NOACTIVATE = 0x0010
    SWP_SHOWWINDOW = 0x0040
    SWP_FRAMECHANGED = 0x0020
    WIN32_AVAILABLE = True

    import ctypes.wintypes
    user32.GetWindowLongW.argtypes = [ctypes.wintypes.HWND, ctypes.c_int]
    user32.GetWindowLongW.restype = ctypes.c_long
    user32.SetWindowLongW.argtypes = [ctypes.wintypes.HWND, ctypes.c_int, ctypes.c_long]
    user32.SetWindowLongW.restype = ctypes.c_long
    user32.SetWindowPos.argtypes = [
        ctypes.wintypes.HWND, ctypes.wintypes.HWND,
        ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_int,
        ctypes.wintypes.UINT
    ]
    user32.SetWindowPos.restype = ctypes.wintypes.BOOL
    user32.SetForegroundWindow.argtypes = [ctypes.wintypes.HWND]
    user32.SetForegroundWindow.restype = ctypes.wintypes.BOOL
except Exception:
    WIN32_AVAILABLE = False
    user32 = None


def set_click_through(hwnd, enabled, toolbar_hwnd=None):
    """Alterna click-through via Windows API"""
    if not WIN32_AVAILABLE:
        return
    try:
        style = user32.GetWindowLongW(hwnd, GWL_EXSTYLE)
        if enabled:
            new_style = style | WS_EX_TRANSPARENT | WS_EX_LAYERED
        else:
            new_style = (style & ~WS_EX_TRANSPARENT) | WS_EX_LAYERED

        user32.SetWindowLongW(hwnd, GWL_EXSTYLE, new_style)

        if enabled:
            user32.SetWindowPos(
                hwnd, HWND_TOPMOST, 0, 0, 0, 0,
                SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_FRAMECHANGED
            )
        else:
            user32.SetWindowPos(
                hwnd, HWND_TOPMOST, 0, 0, 0, 0,
                SWP_NOMOVE | SWP_NOSIZE | SWP_FRAMECHANGED | SWP_SHOWWINDOW
            )
            if toolbar_hwnd:
                raise_window(toolbar_hwnd)
    except Exception as e:
        import logging
        logging.error(f"set_click_through({enabled}) falhou: {e}")


def raise_window(hwnd):
    """Eleva uma janela ao topo via Windows API"""
    if not WIN32_AVAILABLE or not hwnd:
        return
    try:
        user32.SetWindowPos(
            hwnd, HWND_TOPMOST, 0, 0, 0, 0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW
        )
    except Exception:
        pass


def set_foreground(hwnd):
    """Coloca janela em foreground"""
    if not WIN32_AVAILABLE:
        return
    try:
        user32.SetForegroundWindow(hwnd)
    except Exception:
        pass


def stay_on_top(hwnd, toolbar_hwnd=None):
    """Força janela no topo"""
    if not WIN32_AVAILABLE:
        return
    try:
        user32.SetWindowPos(
            hwnd, HWND_TOPMOST, 0, 0, 0, 0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW
        )
    except Exception:
        pass
    if toolbar_hwnd:
        raise_window(toolbar_hwnd)
