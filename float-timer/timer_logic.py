"""
Timer Logic - Timer/Stopwatch logic
Manages count-up and countdown
"""

from PyQt6.QtCore import QObject, QTimer, pyqtSignal


class TimerController(QObject):
    """Timer/Stopwatch controller"""

    # Signals
    time_updated = pyqtSignal(int)  # current seconds
    timer_finished = pyqtSignal()  # when timer reaches zero
    state_changed = pyqtSignal(bool)  # running state

    def __init__(self):
        super().__init__()

        self.current_seconds = 0
        self.initial_seconds = 0
        self.is_timer_mode = False  # False = stopwatch, True = timer
        self.is_running = False

        # 1-second tick timer
        self.tick_timer = QTimer()
        self.tick_timer.timeout.connect(self.tick)
        self.tick_timer.setInterval(1000)

    def set_timer(self, seconds):
        """
        Configures a timer (countdown).
        If seconds = 0, configures as stopwatch.
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
        """Starts counting"""
        if not self.is_running:
            self.is_running = True
            self.tick_timer.start()
            self.state_changed.emit(True)

    def pause(self):
        """Pauses counting"""
        if self.is_running:
            self.is_running = False
            self.tick_timer.stop()
            self.state_changed.emit(False)

    def stop(self):
        """Stops completely and resets"""
        self.is_running = False
        self.tick_timer.stop()
        self.state_changed.emit(False)

    def toggle(self):
        """Toggles between play and pause"""
        if self.is_running:
            self.pause()
        else:
            self.start()

    def reset(self):
        """Resets to the initial value"""
        self.stop()
        if self.is_timer_mode:
            self.current_seconds = self.initial_seconds
        else:
            self.current_seconds = 0
        self.time_updated.emit(self.current_seconds)

    def tick(self):
        """Called every second"""
        if self.is_timer_mode:
            # Timer: decrements
            if self.current_seconds > 0:
                self.current_seconds -= 1
                self.time_updated.emit(self.current_seconds)

                if self.current_seconds == 0:
                    self.pause()
                    self.timer_finished.emit()
        else:
            # Stopwatch: increments
            self.current_seconds += 1
            self.time_updated.emit(self.current_seconds)

            # Caps at 99:59:59 (359999 seconds)
            if self.current_seconds >= 359999:
                self.pause()

    def get_current_time(self):
        """Returns the current time in seconds"""
        return self.current_seconds

    def get_formatted_time(self):
        """Returns the time formatted as a string"""
        hours = self.current_seconds // 3600
        minutes = (self.current_seconds % 3600) // 60
        seconds = self.current_seconds % 60

        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        return f"{minutes:02d}:{seconds:02d}"

    def is_timer(self):
        """Returns whether in timer mode"""
        return self.is_timer_mode

    def get_progress(self):
        """
        Returns progress as a float (0.0 to 1.0).
        Only relevant for timer mode.
        """
        if not self.is_timer_mode or self.initial_seconds == 0:
            return 1.0
        return self.current_seconds / self.initial_seconds


if __name__ == '__main__':
    # Simple test
    from PyQt6.QtWidgets import QApplication
    import sys

    app = QApplication(sys.argv)

    controller = TimerController()
    controller.time_updated.connect(lambda t: print(f"Time: {t}s"))
    controller.timer_finished.connect(lambda: print("Timer finished!"))

    # Test stopwatch
    print("Testing stopwatch...")
    controller.set_timer(0)
    controller.start()

    # Stop after 3 seconds
    QTimer.singleShot(3500, controller.pause)
    QTimer.singleShot(3600, lambda: print(f"Final: {controller.get_formatted_time()}"))
    QTimer.singleShot(4000, app.quit)

    sys.exit(app.exec())
