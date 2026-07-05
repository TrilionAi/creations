/**
 * StudyLens Storage - Wrapper para chrome.storage.local
 * Dados são organizados por URL normalizada
 */
const EditorStorage = (() => {
  function normalizeUrl(url) {
    try {
      const u = new URL(url || window.location.href);
      return u.origin + u.pathname;
    } catch {
      return window.location.href;
    }
  }

  async function load(key) {
    const storageKey = `eu_${normalizeUrl()}_${key}`;
    const result = await chrome.storage.local.get(storageKey);
    return result[storageKey] || null;
  }

  async function save(key, data) {
    const storageKey = `eu_${normalizeUrl()}_${key}`;
    await chrome.storage.local.set({ [storageKey]: data });
  }

  async function loadGlobal(key) {
    const result = await chrome.storage.local.get(`eu_global_${key}`);
    return result[`eu_global_${key}`] || null;
  }

  async function saveGlobal(key, data) {
    await chrome.storage.local.set({ [`eu_global_${key}`]: data });
  }

  return { load, save, loadGlobal, saveGlobal };
})();
