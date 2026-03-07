"""
Timer Logic - Lógica do Timer/Cronômetro
Gerencia contagem progressiva e regressiva
"""

from PyQt6.QtCore import QObject, QTimer, pyqtSignal


class TimerController(QObject):
    """Controlador de Timer/Cronômetro"""

    # Sinais
    time_updated = pyqtSignal(int)  # segundos atuais
    timer_finished = pyqtSignal()  # quando timer chega a zero
    state_changed = pyqtSignal(bool)  # running state

    def __init__(self):
        super().__init__()

        self.current_seconds = 0
        self.initial_seconds = 0
        self.is_timer_mode = False  # False = cronômetro, True = timer
        self.is_running = False

        # Timer de 1 segundo
        self.tick_timer = QTimer()
        self.tick_timer.timeout.connect(self.tick)
        self.tick_timer.setInterval(1000)

    def set_timer(self, seconds):
        """
        Configura um timer (contagem regressiva).
        Se seconds = 0, configura como cronômetro.
        """
        self.stop()

        if seconds > 0:
            self.is_timer_mode = True
            self.initial_seconds = seconds
            self.current_seconds = seconds
        else:
            self.is_timer_mode = False
            self.initial_seconds = 0
            self.current_seconds = 0

        self.time_updated.emit(self.current_seconds)

    def start(self):
        """Inicia a contagem"""
        if not self.is_running:
            self.is_running = True
            self.tick_timer.start()
            self.state_changed.emit(True)

    def pause(self):
        """Pausa a contagem"""
        if self.is_running:
            self.is_running = False
            self.tick_timer.stop()
            self.state_changed.emit(False)

    def stop(self):
        """Para completamente e reseta"""
        self.is_running = False
        self.tick_timer.stop()
        self.state_changed.emit(False)

    def toggle(self):
        """Alterna entre play e pause"""
        if self.is_running:
            self.pause()
        else:
            self.start()

    def reset(self):
        """Reseta para o valor inicial"""
        self.stop()
        if self.is_timer_mode:
            self.current_seconds = self.initial_seconds
        else:
            self.current_seconds = 0
        self.time_updated.emit(self.current_seconds)

    def tick(self):
        """Chamado a cada segundo"""
        if self.is_timer_mode:
            # Timer: decrementa
            if self.current_seconds > 0:
                self.current_seconds -= 1
                self.time_updated.emit(self.current_seconds)

                if self.current_seconds == 0:
                    self.pause()
                    self.timer_finished.emit()
        else:
            # Cronômetro: incrementa
            self.current_seconds += 1
            self.time_updated.emit(self.current_seconds)

            # Limita a 99:59:59 (359999 segundos)
            if self.current_seconds >= 359999:
                self.pause()

    def get_current_time(self):
        """Retorna o tempo atual em segundos"""
        return self.current_seconds

    def get_formatted_time(self):
        """Retorna o tempo formatado como string"""
        hours = self.current_seconds // 3600
        minutes = (self.current_seconds % 3600) // 60
        seconds = self.current_seconds % 60

        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        return f"{minutes:02d}:{seconds:02d}"

    def is_timer(self):
        """Retorna se está em modo timer"""
        return self.is_timer_mode

    def get_progress(self):
        """
        Retorna o progresso como float (0.0 a 1.0).
        Só relevante para modo timer.
        """
        if not self.is_timer_mode or self.initial_seconds == 0:
            return 1.0
        return self.current_seconds / self.initial_seconds


if __name__ == '__main__':
    # Teste simples
    from PyQt6.QtWidgets import QApplication
    import sys

    app = QApplication(sys.argv)

    controller = TimerController()
    controller.time_updated.connect(lambda t: print(f"Time: {t}s"))
    controller.timer_finished.connect(lambda: print("Timer finished!"))

    # Teste cronômetro
    print("Testing stopwatch...")
    controller.set_timer(0)
    controller.start()

    # Para após 3 segundos
    QTimer.singleShot(3500, controller.pause)
    QTimer.singleShot(3600, lambda: print(f"Final: {controller.get_formatted_time()}"))
    QTimer.singleShot(4000, app.quit)

    sys.exit(app.exec())
