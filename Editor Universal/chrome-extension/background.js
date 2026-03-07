/**
 * Background Service Worker - Editor Universal
 * Manifest V3: service worker efêmero
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Editor Universal] Extensão instalada');
});
