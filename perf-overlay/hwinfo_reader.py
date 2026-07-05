"""
HWiNFO Shared Memory Reader
Reads sensor data from HWiNFO via shared memory
"""

import ctypes
from ctypes import Structure, c_uint, c_double, c_char, c_ulonglong, sizeof, c_void_p, memmove, create_string_buffer

# Windows API
kernel32 = ctypes.windll.kernel32

# Configure return types for Windows functions
kernel32.OpenFileMappingW.restype = ctypes.c_void_p
kernel32.MapViewOfFile.restype = ctypes.c_void_p
kernel32.UnmapViewOfFile.argtypes = [ctypes.c_void_p]
kernel32.CloseHandle.argtypes = [ctypes.c_void_p]

# Windows constants
FILE_MAP_READ = 0x0004

# HWiNFO constants
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


# Reading types
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
    """HWiNFO data reader via shared memory"""

    def __init__(self):
        self.hMapFile = None
        self.pMapView = None
        self.header = None
        self.connected = False

    def connect(self):
        """Connects to HWiNFO shared memory"""
        try:
            # Open existing memory mapping
            self.hMapFile = kernel32.OpenFileMappingW(
                FILE_MAP_READ,
                False,
                HWINFO_SENSORS_MAP_FILE_NAME
            )

            if not self.hMapFile:
                return False

            # Map the file view
            self.pMapView = kernel32.MapViewOfFile(
                self.hMapFile,
                FILE_MAP_READ,
                0, 0, 0
            )

            if not self.pMapView:
                kernel32.CloseHandle(self.hMapFile)
                self.hMapFile = None
                return False

            # Read the header directly from memory
            self.header = HWiNFO_SENSORS_SHARED_MEM.from_address(self.pMapView)

            # Verify signature "HWiS" = 0x53695748
            if self.header.dwSignature != 0x53695748:
                self.disconnect()
                return False

            self.connected = True
            return True
        except Exception as e:
            self.connected = False
            return False

    def disconnect(self):
        """Disconnects from shared memory"""
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
        """Reads a structure safely"""
        try:
            return struct_class.from_address(self.pMapView + offset)
        except:
            return None

    def get_readings(self):
        """Returns all sensor readings"""
        if not self.connected:
            if not self.connect():
                return []

        readings = []
        try:
            for i in range(min(self.header.dwNumReadingElements, 500)):  # Safety limit
                offset = self.header.dwOffsetOfReadingSection + (i * self.header.dwSizeOfReadingElement)
                reading = self._read_structure(HWiNFO_SENSORS_READING_ELEMENT, offset)

                if reading is None:
                    continue

                # Get the sensor name
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
        """Returns the CPU temperature"""
        readings = self.get_readings()

        # Look for CPU Package or Tctl/Tdie (AMD)
        for r in readings:
            if r['type'] == SENSOR_TYPE_TEMP:
                label_lower = r['label'].lower()
                sensor_lower = r['sensor_name'].lower()

                if 'cpu' in sensor_lower:
                    if 'package' in label_lower or 'tctl' in label_lower or 'tdie' in label_lower:
                        return r['value']

        # Fallback: any CPU core temp
        for r in readings:
            if r['type'] == SENSOR_TYPE_TEMP:
                sensor_lower = r['sensor_name'].lower()
                if 'cpu' in sensor_lower and 'core' in r['label'].lower():
                    return r['value']

        return None

    def get_gpu_temperature(self):
        """Returns the GPU temperature"""
        readings = self.get_readings()

        for r in readings:
            if r['type'] == SENSOR_TYPE_TEMP:
                sensor_lower = r['sensor_name'].lower()
                label_lower = r['label'].lower()

                if 'gpu' in sensor_lower or 'nvidia' in sensor_lower or 'geforce' in sensor_lower:
                    if 'temp' in label_lower or 'temperature' in label_lower:
                        return r['value']

        return None


# Global instance
_reader = None


def get_hwinfo_reader():
    """Returns the global reader instance"""
    global _reader
    if _reader is None:
        _reader = HWiNFOReader()
    return _reader


def get_cpu_temp_from_hwinfo():
    """Helper function to get CPU temperature"""
    reader = get_hwinfo_reader()
    return reader.get_cpu_temperature()


def get_gpu_temp_from_hwinfo():
    """Helper function to get GPU temperature"""
    reader = get_hwinfo_reader()
    return reader.get_gpu_temperature()


def cleanup_hwinfo():
    """Cleans up resources"""
    global _reader
    if _reader:
        _reader.disconnect()
        _reader = None


if __name__ == '__main__':
    print("Testing HWiNFO Reader...")

    reader = HWiNFOReader()
    if reader.connect():
        print("Connected to HWiNFO!")
        print(f"Version: {reader.header.dwVersion}.{reader.header.dwRevision}")
        print(f"Sensors: {reader.header.dwNumSensorElements}")
        print(f"Readings: {reader.header.dwNumReadingElements}")

        print(f"\nCPU Temperature: {reader.get_cpu_temperature()}°C")
        print(f"GPU Temperature: {reader.get_gpu_temperature()}°C")

        print("\n--- Temperature sensors found ---")
        for r in reader.get_readings():
            if r['type'] == SENSOR_TYPE_TEMP:
                print(f"{r['sensor_name']} - {r['label']}: {r['value']:.1f}{r['unit']}")

        reader.disconnect()
    else:
        print("Could not connect to HWiNFO.")
        print("Make sure HWiNFO is running with 'Shared Memory Support' enabled.")
