"""
Settings - Float Timer configuration management
Saves and loads opacity, position and language
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
    },
}


class Settings:
    """Gerencia configurações persistentes"""

    def __init__(self):
        # Arquivo de configurações na mesma pasta do app
        self.settings_file = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            'settings.json'
        )
        self.defaults = {
            'opacity': 0.85,
            'pos_x': None,  # None = screen center
            'pos_y': None,
            'language': 'en',  # Default language
        }
        self.data = self.defaults.copy()
        self.load()

    def load(self):
        """Carrega configurações do arquivo"""
        try:
            if os.path.exists(self.settings_file):
                with open(self.settings_file, 'r', encoding='utf-8') as f:
                    loaded = json.load(f)
                    # Mescla com defaults (para garantir que novas configs existam)
                    for key in self.defaults:
                        if key in loaded:
                            self.data[key] = loaded[key]
        except Exception:
            # Se falhar, usa defaults
            self.data = self.defaults.copy()

    def save(self):
        """Salva configurações no arquivo"""
        try:
            with open(self.settings_file, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=2)
        except Exception:
            pass  # Ignora erros de salvamento

    def get(self, key, default=None):
        """Obtém uma configuração"""
        return self.data.get(key, default)

    def set(self, key, value):
        """Define uma configuração"""
        self.data[key] = value

    def tr(self, key):
        """Returns translated text for the current language"""
        lang = self.data.get('language', 'en')
        if lang in TRANSLATIONS and key in TRANSLATIONS[lang]:
            return TRANSLATIONS[lang][key]
        # Fallback to English
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
    def position(self):
        """Retorna (x, y) ou None se não definido"""
        x = self.data.get('pos_x')
        y = self.data.get('pos_y')
        if x is not None and y is not None:
            return (x, y)
        return None

    @position.setter
    def position(self, pos):
        """Define posição como tupla (x, y)"""
        if pos:
            self.data['pos_x'] = pos[0]
            self.data['pos_y'] = pos[1]
        else:
            self.data['pos_x'] = None
            self.data['pos_y'] = None


# Instância global de settings
settings = Settings()
