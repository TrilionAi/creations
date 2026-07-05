"""
Settings - Float Timer configuration management
Saves and loads opacity, language, alarm sound, timer configs and layouts.

Settings are stored in the OS user-config directory (e.g. %APPDATA%/FloatTimer
on Windows) so they survive app restarts and reinstalls of onefile builds.
"""

import json
import os
import platform


# Available translations
TRANSLATIONS = {
    'pt': {
        'name': 'Português',
        'stopwatch': 'Cronômetro',
        'minute': 'minuto',
        'minutes': 'minutos',
        'hour': 'hora',
        'custom': 'Personalizado...',
        'opacity': 'Opacidade:',
        'language': 'Idioma',
        'close': 'Fechar',
        'custom_title': 'Tempo Personalizado',
        'custom_prompt': 'Digite o tempo (MM:SS ou segundos):',
        'timer_set': 'Timer definido para {time}',
        'stopwatch_mode': 'Modo cronômetro ativado',
        'time_up': 'Tempo esgotado!',
        'show': 'Mostrar',
        'hide': 'Esconder',
        'set_time': 'Definir Tempo',
        'reset': 'Resetar',
        'quit': 'Sair',
        'pomodoro_25': 'Pomodoro (25 min)',
        'pomodoro_45': 'Pomodoro Longo (45 min)',
        'add_timer': 'Adicionar Timer',
        'remove_timer': 'Remover Timer',
        'arc_color': 'Cor do Arco',
        'silence': 'Silenciar',
        'layouts': 'Layouts',
        'save_layout': 'Salvar layout como...',
        'load_layout': 'Carregar layout',
        'delete_layout': 'Excluir layout',
        'startup_layout': 'Layout ao iniciar',
        'none': 'Nenhum',
        'layout_name_prompt': 'Nome do layout:',
        'layout_saved': 'Layout "{name}" salvo',
        'layout_loaded': 'Layout "{name}" carregado',
        'autostart': 'Iniciar com o sistema',
        'alarm_sound': 'Som do Alarme',
        'volume': 'Volume:',
        'test_sound': 'Testar som',
        'pomodoro_cycle': 'Ciclo Pomodoro',
        'cycle_off': 'Desativar ciclo',
        'cycle_set': 'Ciclo {work}/{brk} min ativado',
        'cycle_disabled': 'Ciclo desativado',
        'focus': 'Foco',
        'break': 'Pausa',
        'phase_started': '{phase} — {min} min',
    },
    'en': {
        'name': 'English',
        'stopwatch': 'Stopwatch',
        'minute': 'minute',
        'minutes': 'minutes',
        'hour': 'hour',
        'custom': 'Custom...',
        'opacity': 'Opacity:',
        'language': 'Language',
        'close': 'Close',
        'custom_title': 'Custom Time',
        'custom_prompt': 'Enter time (MM:SS or seconds):',
        'timer_set': 'Timer set to {time}',
        'stopwatch_mode': 'Stopwatch mode activated',
        'time_up': 'Time is up!',
        'show': 'Show',
        'hide': 'Hide',
        'set_time': 'Set Time',
        'reset': 'Reset',
        'quit': 'Quit',
        'pomodoro_25': 'Pomodoro (25 min)',
        'pomodoro_45': 'Long Pomodoro (45 min)',
        'add_timer': 'Add Timer',
        'remove_timer': 'Remove Timer',
        'arc_color': 'Arc Color',
        'silence': 'Silence',
        'layouts': 'Layouts',
        'save_layout': 'Save layout as...',
        'load_layout': 'Load layout',
        'delete_layout': 'Delete layout',
        'startup_layout': 'Layout on startup',
        'none': 'None',
        'layout_name_prompt': 'Layout name:',
        'layout_saved': 'Layout "{name}" saved',
        'layout_loaded': 'Layout "{name}" loaded',
        'autostart': 'Start with system',
        'alarm_sound': 'Alarm Sound',
        'volume': 'Volume:',
        'test_sound': 'Test sound',
        'pomodoro_cycle': 'Pomodoro Cycle',
        'cycle_off': 'Disable cycle',
        'cycle_set': 'Cycle {work}/{brk} min enabled',
        'cycle_disabled': 'Cycle disabled',
        'focus': 'Focus',
        'break': 'Break',
        'phase_started': '{phase} — {min} min',
    },
    'es': {
        'name': 'Español',
        'stopwatch': 'Cronómetro',
        'minute': 'minuto',
        'minutes': 'minutos',
        'hour': 'hora',
        'custom': 'Personalizado...',
        'opacity': 'Opacidad:',
        'language': 'Idioma',
        'close': 'Cerrar',
        'custom_title': 'Tiempo Personalizado',
        'custom_prompt': 'Ingrese el tiempo (MM:SS o segundos):',
        'timer_set': 'Temporizador configurado para {time}',
        'stopwatch_mode': 'Modo cronómetro activado',
        'time_up': '¡Se acabó el tiempo!',
        'show': 'Mostrar',
        'hide': 'Ocultar',
        'set_time': 'Definir Tiempo',
        'reset': 'Reiniciar',
        'quit': 'Salir',
        'pomodoro_25': 'Pomodoro (25 min)',
        'pomodoro_45': 'Pomodoro Largo (45 min)',
        'add_timer': 'Agregar Timer',
        'remove_timer': 'Eliminar Timer',
        'arc_color': 'Color del Arco',
        'silence': 'Silenciar',
        'layouts': 'Diseños',
        'save_layout': 'Guardar diseño como...',
        'load_layout': 'Cargar diseño',
        'delete_layout': 'Eliminar diseño',
        'startup_layout': 'Diseño al iniciar',
        'none': 'Ninguno',
        'layout_name_prompt': 'Nombre del diseño:',
        'layout_saved': 'Diseño "{name}" guardado',
        'layout_loaded': 'Diseño "{name}" cargado',
        'autostart': 'Iniciar con el sistema',
        'alarm_sound': 'Sonido de Alarma',
        'volume': 'Volumen:',
        'test_sound': 'Probar sonido',
        'pomodoro_cycle': 'Ciclo Pomodoro',
        'cycle_off': 'Desactivar ciclo',
        'cycle_set': 'Ciclo {work}/{brk} min activado',
        'cycle_disabled': 'Ciclo desactivado',
        'focus': 'Enfoque',
        'break': 'Descanso',
        'phase_started': '{phase} — {min} min',
    },
}


def get_config_dir():
    """Returns the per-user config directory for Float Timer"""
    system = platform.system()
    if system == 'Windows':
        base = os.environ.get('APPDATA') or os.path.expanduser('~')
        return os.path.join(base, 'FloatTimer')
    if system == 'Darwin':
        return os.path.expanduser('~/Library/Application Support/FloatTimer')
    base = os.environ.get('XDG_CONFIG_HOME') or os.path.expanduser('~/.config')
    return os.path.join(base, 'floattimer')


def get_sound_options():
    """Returns available alarm sounds as a list of (key, label, path)"""
    system = platform.system()
    candidates = []
    if system == 'Windows':
        media = os.path.join(os.environ.get('SystemRoot', 'C:\\Windows'), 'Media')
        candidates = [
            (os.path.join(media, 'Alarm01.wav'), 'Alarm 1'),
            (os.path.join(media, 'Alarm02.wav'), 'Alarm 2'),
            (os.path.join(media, 'Alarm03.wav'), 'Alarm 3'),
            (os.path.join(media, 'Alarm05.wav'), 'Alarm 4'),
            (os.path.join(media, 'Alarm10.wav'), 'Alarm 5'),
            (os.path.join(media, 'Ring05.wav'), 'Ring'),
            (os.path.join(media, 'chimes.wav'), 'Chimes'),
        ]
    elif system == 'Darwin':
        sounds = '/System/Library/Sounds'
        candidates = [
            (os.path.join(sounds, 'Glass.aiff'), 'Glass'),
            (os.path.join(sounds, 'Ping.aiff'), 'Ping'),
            (os.path.join(sounds, 'Sosumi.aiff'), 'Sosumi'),
            (os.path.join(sounds, 'Submarine.aiff'), 'Submarine'),
            (os.path.join(sounds, 'Blow.aiff'), 'Blow'),
        ]
    options = []
    for path, label in candidates:
        if os.path.exists(path):
            options.append((os.path.basename(path), label, path))
    return options


def resolve_sound_path(key):
    """Returns the full path for a sound key, falling back to the first available"""
    options = get_sound_options()
    if not options:
        return None
    for k, _label, path in options:
        if k == key:
            return path
    return options[0][2]


class Settings:
    """Manages persistent settings"""

    def __init__(self):
        config_dir = get_config_dir()
        try:
            os.makedirs(config_dir, exist_ok=True)
        except OSError:
            config_dir = os.path.dirname(os.path.abspath(__file__))
        self.settings_file = os.path.join(config_dir, 'settings.json')

        # Legacy location (next to the script) used by older versions
        self.legacy_file = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            'settings.json'
        )

        self.defaults = {
            'opacity': 0.85,
            'language': 'en',
            'timers': [{'title': 'Timer', 'pos_x': None, 'pos_y': None}],
            'templates': {},
            'startup_template': None,
            'alert_sound': '',
            'alert_volume': 50,
        }
        self.data = self.defaults.copy()
        self.load()

    def load(self):
        """Loads settings from file (migrating from the legacy location if needed)"""
        try:
            source = None
            if os.path.exists(self.settings_file):
                source = self.settings_file
            elif os.path.exists(self.legacy_file):
                source = self.legacy_file

            if source:
                with open(source, 'r', encoding='utf-8') as f:
                    loaded = json.load(f)
                for key in self.defaults:
                    if key in loaded:
                        self.data[key] = loaded[key]
                # Migrate from old single-position format
                if 'timers' not in loaded:
                    self.data['timers'] = [{
                        'title': 'Timer',
                        'pos_x': loaded.get('pos_x'),
                        'pos_y': loaded.get('pos_y'),
                    }]
        except Exception:
            self.data = self.defaults.copy()

    def save(self):
        """Saves settings to file"""
        try:
            with open(self.settings_file, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=2)
        except Exception:
            pass

    def get(self, key, default=None):
        return self.data.get(key, default)

    def set(self, key, value):
        self.data[key] = value

    def tr(self, key):
        """Returns translated text for the current language"""
        lang = self.data.get('language', 'en')
        if lang in TRANSLATIONS and key in TRANSLATIONS[lang]:
            return TRANSLATIONS[lang][key]
        return TRANSLATIONS['en'].get(key, key)

    @property
    def opacity(self):
        return self.data.get('opacity', 0.85)

    @opacity.setter
    def opacity(self, value):
        self.data['opacity'] = value

    @property
    def language(self):
        return self.data.get('language', 'en')

    @language.setter
    def language(self, value):
        self.data['language'] = value

    @property
    def timers(self):
        return self.data.get('timers', [{'title': 'Timer', 'pos_x': None, 'pos_y': None}])

    @timers.setter
    def timers(self, value):
        self.data['timers'] = value

    @property
    def templates(self):
        return self.data.get('templates', {})

    @templates.setter
    def templates(self, value):
        self.data['templates'] = value


# Global settings instance
settings = Settings()
