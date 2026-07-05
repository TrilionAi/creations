"""
Toolbar Theme - Visual constants, dimensions and button definitions for the toolbar
"""

from PySide6.QtGui import QColor, QFontDatabase

# --- Icon font detection ---

_icon_font_name = None

def get_icon_font():
    """Returns the name of the icon font available on the system"""
    global _icon_font_name
    if _icon_font_name is not None:
        return _icon_font_name

    families = QFontDatabase.families()
    for candidate in ('Segoe Fluent Icons', 'Segoe MDL2 Assets'):
        if candidate in families:
            _icon_font_name = candidate
            return _icon_font_name

    _icon_font_name = ''  # no icon font available
    return _icon_font_name

# Segoe Fluent / MDL2 Icons (Unicode codepoints)
ICONS = {
    'pointer':     '\uE8B0',
    'freehand':    '\uEE56',
    'highlighter': '\uE7E6',
    'eraser':      '\uE75C',
    'line':        '\uE738',
    'arrow':       '\uE72A',
    'rectangle':   '\uE739',
    'circle':      '\uEA3A',
    'filled-rect': '\uE73B',
    'color':       '\uE790',
    'guide':       '\uE736',
    'text':        '\uE8D2',
    'undo':        '\uE7A7',
    'clear':       '\uE74D',
    'ghost':       '\uE81E',
    'minimize':    '\uE70E',
    'expand':      '\uE70D',
}

# Fallback: emojis for when no icon font is available
ICONS_FALLBACK = {
    'pointer':     '\u25C7',
    'freehand':    '\u270F',
    'highlighter': '\U0001F58D',
    'eraser':      '\U0001F9F9',
    'line':        '\u2571',
    'arrow':       '\u2192',
    'rectangle':   '\u25AD',
    'circle':      '\u25CB',
    'filled-rect': '\u25A0',
    'color':       '\u25CF',
    'guide':       '\U0001F4D6',
    'text':        'T',
    'undo':        '\u21B6',
    'clear':       '\U0001F5D1',
    'ghost':       '\U0001F47B',
    'minimize':    '\u25B2',
    'expand':      '\u25BC',
}

# --- Theme colors ---

BG_DARK = QColor(20, 20, 28, 240)
BG_BUTTON = QColor(32, 33, 42)
BG_HOVER = QColor(48, 50, 65)
BG_ACTIVE = QColor(45, 85, 165)
ACCENT = QColor(66, 140, 255)
TEXT_COLOR = QColor(210, 215, 225)
TEXT_DIM = QColor(110, 115, 130)
BORDER_COLOR = QColor(50, 52, 62)
SEPARATOR_COLOR = QColor(42, 44, 54)
DANGER_BG = QColor(120, 35, 35)
GREEN = QColor(76, 175, 80)

# Special state colors
POINTER_ACTIVE_BG = QColor(35, 75, 50)
POINTER_ACTIVE_BORDER = QColor(76, 175, 80)
GHOST_ACTIVE_BG = QColor(120, 70, 20)
GHOST_ACTIVE_BORDER = QColor(255, 165, 0)

# --- Thickness presets ---

SIZE_PRESETS = [1, 3, 5, 8, 12, 20]

# --- Dimensions ---

BAR_WIDTH = 44
BTN_SIZE = 40
GRIP_HEIGHT = 14
SEP_HEIGHT = 1
PADDING = 3
CORNER_RADIUS = 12
BTN_CORNER_RADIUS = 8


def get_icon(btn_id):
    """Returns the correct icon based on the available font"""
    if get_icon_font():
        return ICONS.get(btn_id, '?')
    return ICONS_FALLBACK.get(btn_id, '?')


def build_buttons(brush_size):
    """Returns list of button definitions.
    Format: (id, icon, tooltip, type)
    Types: 'pointer_mode', 'tool', 'color', 'size', 'toggle_guide', 'toggle_text',
           'toggle_ghost', 'action_undo', 'action_clear', 'minimize', 'sep'
    """
    return [
        ('pointer', get_icon('pointer'), 'Normal Mode (Ctrl+Num1)', 'pointer_mode'),
        ('sep1', '', '', 'sep'),
        ('freehand', get_icon('freehand'), 'Pen', 'tool'),
        ('highlighter', get_icon('highlighter'), 'Highlighter', 'tool'),
        ('eraser', get_icon('eraser'), 'Eraser', 'tool'),
        ('line', get_icon('line'), 'Line', 'tool'),
        ('arrow', get_icon('arrow'), 'Arrow', 'tool'),
        ('rectangle', get_icon('rectangle'), 'Rectangle', 'tool'),
        ('circle', get_icon('circle'), 'Circle', 'tool'),
        ('filled-rect', get_icon('filled-rect'), 'Filled Rectangle (Shift=white)', 'tool'),
        ('sep2', '', '', 'sep'),
        ('color', get_icon('color'), 'Color', 'color'),
        ('size', str(brush_size), 'Thickness (click to cycle)', 'size'),
        ('sep3', '', '', 'sep'),
        ('guide', get_icon('guide'), 'Reading Guide (Ctrl+Num2)', 'toggle_guide'),
        ('text', get_icon('text'), 'Text Mode (Ctrl+Num3)', 'toggle_text'),
        ('ghost', get_icon('ghost'), 'Presentation Mode (drawings disappear on release)', 'toggle_ghost'),
        ('sep4', '', '', 'sep'),
        ('undo', get_icon('undo'), 'Undo (Ctrl+Z)', 'action_undo'),
        ('clear', get_icon('clear'), 'Clear All', 'action_clear'),
        ('sep5', '', '', 'sep'),
        ('minimize', get_icon('minimize'), 'Minimize', 'minimize'),
    ]
