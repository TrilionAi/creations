"""
Hardware Monitor - Module for reading system metrics
Uses HWiNFO for temperatures + NVIDIA for GPU
"""

import psutil

# Try to import pynvml for NVIDIA GPU
try:
    import pynvml
    NVIDIA_AVAILABLE = True
except ImportError:
    NVIDIA_AVAILABLE = False

# Import the HWiNFO reader
from hwinfo_reader import get_cpu_temp_from_hwinfo, get_gpu_temp_from_hwinfo, cleanup_hwinfo

# NVML (NVIDIA) initialization
_nvml_initialized = False


def init_nvidia():
    """Initializes the NVIDIA library if available"""
    global _nvml_initialized
    if NVIDIA_AVAILABLE and not _nvml_initialized:
        try:
            pynvml.nvmlInit()
            _nvml_initialized = True
            return True
        except Exception:
            return False
    return _nvml_initialized


def shutdown_nvidia():
    """Shuts down the NVIDIA library"""
    global _nvml_initialized
    if _nvml_initialized:
        try:
            pynvml.nvmlShutdown()
            _nvml_initialized = False
        except Exception:
            pass


def get_cpu_usage():
    """Returns CPU usage as a percentage (0-100)"""
    try:
        return psutil.cpu_percent(interval=None)
    except Exception:
        return 0.0


def get_ram_usage():
    """Returns RAM usage as a percentage (0-100)"""
    try:
        return psutil.virtual_memory().percent
    except Exception:
        return 0.0


def get_cpu_temperature():
    """Returns CPU temperature in Celsius (via HWiNFO)"""
    try:
        temp = get_cpu_temp_from_hwinfo()
        if temp is not None and temp > 0:
            return round(temp, 1)
    except Exception:
        pass
    return None


def get_gpu_usage():
    """Returns GPU usage as a percentage (0-100)"""
    if init_nvidia():
        try:
            handle = pynvml.nvmlDeviceGetHandleByIndex(0)
            utilization = pynvml.nvmlDeviceGetUtilizationRates(handle)
            return utilization.gpu
        except Exception:
            pass
    return None


def get_gpu_temperature():
    """Returns GPU temperature in Celsius"""
    # Try NVIDIA first (more accurate)
    if init_nvidia():
        try:
            handle = pynvml.nvmlDeviceGetHandleByIndex(0)
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
            return temp
        except Exception:
            pass

    # Fallback to HWiNFO
    try:
        temp = get_gpu_temp_from_hwinfo()
        if temp is not None and temp > 0:
            return round(temp, 1)
    except Exception:
        pass

    return None


def get_all_metrics():
    """Returns all metrics in a dictionary"""
    return {
        'cpu_usage': get_cpu_usage(),
        'ram_usage': get_ram_usage(),
        'cpu_temp': get_cpu_temperature(),
        'gpu_usage': get_gpu_usage(),
        'gpu_temp': get_gpu_temperature(),
    }


def cleanup():
    """Cleans up all resources"""
    shutdown_nvidia()
    try:
        cleanup_hwinfo()
    except:
        pass
