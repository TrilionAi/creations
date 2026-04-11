/**
 * Content.js - Orquestrador principal do Editor Universal
 * Inicializa todos os módulos e gerencia comunicação com popup/background
 */
(function () {
  'use strict';

  // Previne inicialização dupla
  if (window.__editorUniversalInit) return;
  window.__editorUniversalInit = true;

  // Inicializa todos os módulos na ordem correta
  ReadingGuide.init();
  Highlighter.init();
  DrawingCanvas.init();
  TextAnnotation.init();
  Toolbar.init();
  ContextMenu.init();

  // Escuta mensagens do popup e background
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch (msg.type) {
      case 'toggle-guide':
        sendResponse({ enabled: ReadingGuide.toggle() });
        break;

      case 'toggle-highlight':
        sendResponse({ enabled: Highlighter.toggle() });
        break;

      case 'toggle-toolbar':
        sendResponse({ visible: Toolbar.toggle() });
        break;

      case 'set-highlight-color':
        Highlighter.setColor(msg.color);
        sendResponse({ ok: true });
        break;

      case 'get-status':
        sendResponse({
          guideEnabled: ReadingGuide.isEnabled(),
          highlightActive: Highlighter.isActive(),
          toolbarVisible: Toolbar.isVisible(),
          drawingActive: DrawingCanvas.isActive(),
          textActive: TextAnnotation.isActive()
        });
        break;

      default:
        sendResponse({ error: 'unknown message type' });
    }
    return true; // Mantém canal aberto para resposta async
  });

  console.log('[Editor Universal] Inicializado com sucesso');
})();
