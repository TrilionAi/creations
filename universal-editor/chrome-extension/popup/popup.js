/**
 * Popup - Interface de toggles rápidos
 * Comunica com content script via chrome.tabs.sendMessage
 */
document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  const guideToggle = document.getElementById('guide-toggle');
  const highlightToggle = document.getElementById('highlight-toggle');
  const toolbarToggle = document.getElementById('toolbar-toggle');

  // Obtém status atual
  try {
    chrome.tabs.sendMessage(tab.id, { type: 'get-status' }, (response) => {
      if (chrome.runtime.lastError) return;
      if (response) {
        guideToggle.checked = response.guideEnabled || false;
        highlightToggle.checked = response.highlightActive || false;
        toolbarToggle.checked = response.toolbarVisible || false;
      }
    });
  } catch {
    // Tab pode não ter content script injetado
  }

  guideToggle.addEventListener('change', () => {
    chrome.tabs.sendMessage(tab.id, { type: 'toggle-guide' });
  });

  highlightToggle.addEventListener('change', () => {
    chrome.tabs.sendMessage(tab.id, { type: 'toggle-highlight' });
  });

  toolbarToggle.addEventListener('change', () => {
    chrome.tabs.sendMessage(tab.id, { type: 'toggle-toolbar' });
  });
});
