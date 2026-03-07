"""
HWiNFO Shared Memory Reader
Lê dados de sensores do HWiNFO via memória compartilhada
"""

import ctypes
from ctypes import Structure, c_uint, c_double, c_char, c_ulonglong, sizeof, c_void_p, memmove, create_string_buffer

# Windows API
kernel32 = ctypes.windll.kernel32

# Configura tipos de retorno das funções Windows
kernel32.OpenFileMappingW.restype = ctypes.c_void_p
kernel32.MapViewOfFile.restype = ctypes.c_void_p
kernel32.UnmapViewOfFile.argtypes = [ctypes.c_void_p]
kernel32.CloseHandle.argtypes = [ctypes.c_void_p]

# Constantes Windows
FILE_MAP_READ = 0x0004

# Constantes do HWiNFO
HWINFO_SENSORS_MAP_FILE_NAME = "Global\\HWiNFO_SENS_SM2"
HWINFO_SENSORS_STRING_LEN = 128
HWINFO_UNIT_STRING_LEN = 16


class HWiNFO_SENSORS_SHARED_MEM(Structure):
    _pack_ = 1
    _fields_ = [
        ("dwSignature", c_uint),
        ("dwVersion", c_uint),
        ("dwRevision", c_uint),
        ("poll_time", c_ulonglong),
        ("dwOffsetOfSensorSection", c_uint),
        ("dwSizeOfSensorElement", c_uint),
        ("dwNumSensorElements", c_uint),
        ("dwOffsetOfReadingSection", c_uint),
        ("dwSizeOfReadingElement", c_uint),
        ("dwNumReadingElements", c_uint),
    ]


class HWiNFO_SENSORS_SENSOR_ELEMENT(Structure):
    _pack_ = 1
    _fields_ = [
        ("dwSensorID", c_uint),
        ("dwSensorInst", c_uint),
        ("szSensorNameOrig", c_char * HWINFO_SENSORS_STRING_LEN),
        ("szSensorNameUser", c_char * HWINFO_SENSORS_STRING_LEN),
    ]


class HWiNFO_SENSORS_READING_ELEMENT(Structure):
    _pack_ = 1
    _fields_ = [
        ("tReading", c_uint),
        ("dwSensorIndex", c_uint),
        ("dwReadingID", c_uint),
        ("szLabelOrig", c_char * HWINFO_SENSORS_STRING_LEN),
        ("szLabelUser", c_char * HWINFO_SENSORS_STRING_LEN),
        ("szUnit", c_char * HWINFO_UNIT_STRING_LEN),
        ("Value", c_double),
        ("ValueMin", c_double),
        ("ValueMax", c_double),
        ("ValueAvg", c_double),
    ]


# Tipos de leitura
SENSOR_TYPE_NONE = 0
SENSOR_TYPE_TEMP = 1
SENSOR_TYPE_VOLT = 2
SENSOR_TYPE_FAN = 3
SENSOR_TYPE_CURRENT = 4
SENSOR_TYPE_POWER = 5
SENSOR_TYPE_CLOCK = 6
SENSOR_TYPE_USAGE = 7
SENSOR_TYPE_OTHER = 8


class HWiNFOReader:
    """Leitor de dados do HWiNFO via shared memory"""

    def __init__(self):
        self.hMapFile = None
        self.pMapView = None
        self.header = None
        self.connected = False

    def connect(self):
        """Conecta à memória compartilhada do HWiNFO"""
        try:
            # Abre o mapeamento de memória existente
            self.hMapFile = kernel32.OpenFileMappingW(
                FILE_MAP_READ,
                False,
                HWINFO_SENSORS_MAP_FILE_NAME
            )

            if not self.hMapFile:
                return False

            # Mapeia a visão do arquivo
            self.pMapView = kernel32.MapViewOfFile(
                self.hMapFile,
                FILE_MAP_READ,
                0, 0, 0
            )

            if not self.pMapView:
                kernel32.CloseHandle(self.hMapFile)
                self.hMapFile = None
                return False

            # Lê o header diretamente da memória
            self.header = HWiNFO_SENSORS_SHARED_MEM.from_address(self.pMapView)

            # Verifica assinatura "HWiS" = 0x53695748
            if self.header.dwSignature != 0x53695748:
                self.disconnect()
                return False

            self.connected = True
            return True
        except Exception as e:
            self.connected = False
            return False

    def disconnect(self):
        """Desconecta da memória compartilhada"""
        if self.pMapView:
            try:
                kernel32.UnmapViewOfFile(self.pMapView)
            except:
                pass
        if self.hMapFile:
            try:
                kernel32.CloseHandle(self.hMapFile)
            except:
                pass
        self.pMapView = None
        self.hMapFile = None
        self.header = None
        self.connected = False

    def _read_structure(self, struct_class, offset):
        """Lê uma estrutura de forma segura"""
        try:
            return struct_class.from_address(self.pMapView + offset)
        except:
            return None

    def get_readings(self):
        """Retorna todas as leituras de sensores"""
        if not self.connected:
            if not self.connect():
                return []

        readings = []
        try:
            for i in range(min(self.header.dwNumReadingElements, 500)):  # Limite de segurança
                offset = self.header.dwOffsetOfReadingSection + (i * self.header.dwSizeOfReadingElement)
                reading = self._read_structure(HWiNFO_SENSORS_READING_ELEMENT, offset)

                if reading is None:
                    continue

                # Pega o nome do sensor
                sensor_offset = self.header.dwOffsetOfSensorSection + (reading.dwSensorIndex * self.header.dwSizeOfSensorElement)
                sensor = self._read_structure(HWiNFO_SENSORS_SENSOR_ELEMENT, sensor_offset)

                if sensor is None:
                    continue

                readings.append({
                    'sensor_name': sensor.szSensorNameOrig.decode('utf-8', errors='ignore').strip('\x00'),
                    'label': reading.szLabelOrig.decode('utf-8', errors='ignore').strip('\x00'),
                    'unit': reading.szUnit.decode('utf-8', errors='ignore').strip('\x00'),
                    'value': reading.Value,
                    'type': reading.tReading,
                })
        except Exception as e:
            pass

        return readings

    def get_cpu_temperature(self):
        """Retorna a temperatura da CPU"""
        readings = self.get_readings()

        # Procura CPU Package ou Tctl/Tdie (AMD)
        for r in readings:
            if r['type'] == SENSOR_TYPE_TEMP:
                label_lower = r['label'].lower()
                sensor_lower = r['sensor_name'].lower()

                if 'cpu' in sensor_lower:
                    if 'package' in label_lower or 'tctl' in label_lower or 'tdie' in label_lower:
                        return r['value']

        # Fallback: qualquer temp de CPU core
        for r in readings:
            if r['type'] == SENSOR_TYPE_TEMP:
                sensor_lower = r['sensor_name'].lower()
                if 'cpu' in sensor_lower and 'core' in r['label'].lower():
                    return r['value']

        return None

    def get_gpu_temperature(self):
        """Retorna a temperatura da GPU"""
        readings = self.get_readings()

        for r in readings:
            if r['type'] == SENSOR_TYPE_TEMP:
                sensor_lower = r['sensor_name'].lower()
                label_lower = r['label'].lower()

                if 'gpu' in sensor_lower or 'nvidia' in sensor_lower or 'geforce' in sensor_lower:
                    if 'temp' in label_lower or 'temperature' in label_lower:
                        return r['value']

        return None


# Instância global
_reader = None


def get_hwinfo_reader():
    """Retorna a instância global do leitor"""
    global _reader
    if _reader is None:
        _reader = HWiNFOReader()
    return _reader


def get_cpu_temp_from_hwinfo():
    """Função auxiliar para obter temp da CPU"""
    reader = get_hwinfo_reader()
    return reader.get_cpu_temperature()


def get_gpu_temp_from_hwinfo():
    """Função auxiliar para obter temp da GPU"""
    reader = get_hwinfo_reader()
    return reader.get_gpu_temperature()


def cleanup_hwinfo():
    """Limpa recursos"""
    global _reader
    if _reader:
        _reader.disconnect()
        _reader = None


if __name__ == '__main__':
    print("Testando HWiNFO Reader...")

    reader = HWiNFOReader()
    if reader.connect():
        print("Conectado ao HWiNFO!")
        print(f"Versao: {reader.header.dwVersion}.{reader.header.dwRevision}")
        print(f"Sensores: {reader.header.dwNumSensorElements}")
        print(f"Leituras: {reader.header.dwNumReadingElements}")

        print(f"\nTemperatura CPU: {reader.get_cpu_temperature()}°C")
        print(f"Temperatura GPU: {reader.get_gpu_temperature()}°C")

        print("\n--- Sensores de temperatura encontrados ---")
        for r in reader.get_readings():
            if r['type'] == SENSOR_TYPE_TEMP:
                print(f"{r['sensor_name']} - {r['label']}: {r['value']:.1f}{r['unit']}")

        reader.disconnect()
    else:
        print("Não foi possível conectar ao HWiNFO.")
        print("Certifique-se que o HWiNFO está aberto com 'Shared Memory Support' ativado.")
