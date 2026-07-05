"""
Settings - Configuration management for Universal Editor Desktop
Saves to %APPDATA%/Editor Universal when packaged, or to the script directory in dev.
"""

import sys
import json
import os
import shutil

APP_NAME = 'Editor Universal'


def _get_config_dir():
    """Determines the configuration directory"""
    if getattr(sys, 'frozen', False):
        # Packaged executable -> AppData
        appdata = os.environ.get('APPDATA', os.path.expanduser('~'))
        config_dir = os.path.join(appdata, APP_NAME)
        os.makedirs(config_dir, exist_ok=True)

        # Migration: copy old settings.json from exe directory
        exe_dir = os.path.dirname(sys.executable)
        old_config = os.path.join(exe_dir, 'settings.json')
        new_config = os.path.join(config_dir, 'settings.json')
        if os.path.exists(old_config) and not os.path.exists(new_config):
            try:
                shutil.copy2(old_config, new_config)
            except Exception:
                pass

        return config_dir
    else:
        # Development -> script directory
        return os.path.dirname(os.path.abspath(__file__))


CONFIG_DIR = _get_config_dir()
CONFIG_FILE = os.path.join(CONFIG_DIR, 'settings.json')

DEFAULT_SETTINGS = {
    # Hotkeys
    'hotkey_toggle_draw': 'ctrl+num1',
    'hotkey_toggle_guide': 'ctrl+num2',
    'hotkey_toggle_text': 'ctrl+num3',
    'hotkey_undo': 'ctrl+z',
    'hotkey_clear': 'ctrl+shift+c',
    'hotkey_quit': 'ctrl+num0',
    # Drawing
    'brush_color': '#FF0000',
    'brush_size': 3,
    # Reading guide
    'guide_color_r': 255,
    'guide_color_g': 255,
    'guide_color_b': 0,
    'guide_color_a': 45,
    'guide_height': 32,
    # Text
    'font_family': 'Segoe UI',
    'font_size': 16,
    'font_color': '#FFFFFF',
    # Toolbar
    'toolbar_x': None,
    'toolbar_y': None,
}


def load_settings():
    """Loads settings from JSON file"""
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                settings = json.load(f)
                return {**DEFAULT_SETTINGS, **settings}
    except Exception:
        pass
    return DEFAULT_SETTINGS.copy()


def save_settings(settings):
    """Saves settings to JSON file"""
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(settings, f, indent=2, ensure_ascii=False)
        return True
    except Exception:
        return False
