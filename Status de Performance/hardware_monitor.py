"""
Hardware Monitor - Módulo para leitura de métricas do sistema
Usa HWiNFO para temperaturas + NVIDIA para GPU
"""

import psutil

# Tenta importar pynvml para GPU NVIDIA
try:
    import pynvml
    NVIDIA_AVAILABLE = True
except ImportError:
    NVIDIA_AVAILABLE = False

# Importa o leitor do HWiNFO
from hwinfo_reader import get_cpu_temp_from_hwinfo, get_gpu_temp_from_hwinfo, cleanup_hwinfo

# Inicialização do NVML (NVIDIA)
_nvml_initialized = False


def init_nvidia():
    """Inicializa a biblioteca NVIDIA se disponível"""
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
    """Finaliza a biblioteca NVIDIA"""
    global _nvml_initialized
    if _nvml_initialized:
        try:
            pynvml.nvmlShutdown()
            _nvml_initialized = False
        except Exception:
            pass


def get_cpu_usage():
    """Retorna uso da CPU em porcentagem (0-100)"""
    try:
        return psutil.cpu_percent(interval=None)
    except Exception:
        return 0.0


def get_ram_usage():
    """Retorna uso da RAM em porcentagem (0-100)"""
    try:
        return psutil.virtual_memory().percent
    except Exception:
        return 0.0


def get_cpu_temperature():
    """Retorna temperatura da CPU em Celsius (via HWiNFO)"""
    try:
        temp = get_cpu_temp_from_hwinfo()
        if temp is not None and temp > 0:
            return round(temp, 1)
    except Exception:
        pass
    return None


def get_gpu_usage():
    """Retorna uso da GPU em porcentagem (0-100)"""
    if init_nvidia():
        try:
            handle = pynvml.nvmlDeviceGetHandleByIndex(0)
            utilization = pynvml.nvmlDeviceGetUtilizationRates(handle)
            return utilization.gpu
        except Exception:
            pass
    return None


def get_gpu_temperature():
    """Retorna temperatura da GPU em Celsius"""
    # Tenta NVIDIA primeiro (mais preciso)
    if init_nvidia():
        try:
            handle = pynvml.nvmlDeviceGetHandleByIndex(0)
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
            return temp
        except Exception:
            pass

    # Fallback para HWiNFO
    try:
        temp = get_gpu_temp_from_hwinfo()
        if temp is not None and temp > 0:
            return round(temp, 1)
    except Exception:
        pass

    return None


def get_all_metrics():
    """Retorna todas as métricas em um dicionário"""
    return {
        'cpu_usage': get_cpu_usage(),
        'ram_usage': get_ram_usage(),
        'cpu_temp': get_cpu_temperature(),
        'gpu_usage': get_gpu_usage(),
        'gpu_temp': get_gpu_temperature(),
    }


def cleanup():
    """Limpa todos os recursos"""
    shutdown_nvidia()
    try:
        cleanup_hwinfo()
    except:
        pass
