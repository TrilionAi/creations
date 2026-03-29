"""
Settings - Float Timer configuration management
Saves and loads opacity, language and timer configs
"""

import json
import os


# Traduções disponíveis
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
        'hide_this': 'Esconder este Timer',
        'remove_timer': 'Remover Timer',
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
        'hide_this': 'Hide this Timer',
        'remove_timer': 'Remove Timer',
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
        'hide_this': 'Ocultar este Timer',
        'remove_timer': 'Eliminar Timer',
    },
}


class Settings:
    """Gerencia configurações persistentes"""

    def __init__(self):
        self.settings_file = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            'settings.json'
        )
        self.defaults = {
            'opacity': 0.85,
            'language': 'en',
            'timers': [{'title': 'Timer', 'pos_x': None, 'pos_y': None}],
        }
        self.data = self.defaults.copy()
        self.load()

    def load(self):
        """Carrega configurações do arquivo"""
        try:
            if os.path.exists(self.settings_file):
                with open(self.settings_file, 'r', encoding='utf-8') as f:
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
        """Salva configurações no arquivo"""
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


# Instância global de settings
settings = Settings()
