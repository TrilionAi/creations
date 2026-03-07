/**
 * Reading Guide - Seleção automática de texto que segue o cursor
 * Em vez de uma barra translúcida, seleciona automaticamente o texto
 * sob o cursor usando a API nativa de seleção do navegador.
 *
 * API para integração com Highlighter:
 *   setAnchorOverride(node, offset) - fixa o ponto de início da seleção
 *   clearAnchorOverride() - remove a fixação, volta ao comportamento normal
 */
const ReadingGuide = (() => {
  let enabled = false;

  // Ponto âncora atual da seleção automática
  let anchorNode = null;
  let anchorOffset = 0;

  // Override do highlighter (quando o marca-texto fixa o ponto)
  let overrideAnchorNode = null;
  let overrideAnchorOffset = 0;
  let hasOverride = false;

  // Controle de estado
  let paused = false;

  /**
   * Encontra a posição de texto mais próxima do ponto (x, y) na viewport.
   * Valida que o cursor está realmente sobre o texto (não na margem/padding).
   * Retorna {node, offset} ou null se não encontrar texto válido.
   */
  function getTextPositionAt(x, y) {
    if (!document.caretRangeFromPoint) return null;

    const range = document.caretRangeFromPoint(x, y);
    if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) return null;

    const textNode = range.startContainer;

    // Cria range do caractere específico para verificar posição real
    const charRange = document.createRange();
    charRange.setStart(textNode, range.startOffset);
    charRange.setEnd(textNode, Math.min(range.startOffset + 1, textNode.length));
    const charRect = charRange.getBoundingClientRect();

    // Se o caractere tem dimensão e o mouse X está muito à esquerda dele, rejeita
    // Isso impede que a âncora seja definida quando o cursor está na margem
    if (charRect.width > 0 && x < charRect.left - 20) return null;

    // Também rejeita se o mouse Y está fora do retângulo do caractere (com tolerância)
    if (charRect.height > 0) {
      if (y < charRect.top - 5 || y > charRect.bottom + 5) return null;
    }

    return { node: textNode, offset: range.startOffset };
  }

  /**
   * Verifica se o elemento está dentro de UI do Editor Universal
   */
  function isInsideEditorUI(el) {
    if (!el) return false;
    const elem = el.nodeType === Node.TEXT_NODE ? el.parentElement : el;
    return elem && (
      elem.closest('#eu-context-menu') ||
      elem.closest('#eu-toolbar') ||
      elem.closest('.eu-text-annotation') ||
      elem.closest('#eu-drawing-canvas')
    );
  }

  /**
   * Aplica a seleção do ponto âncora até a posição atual do cursor
   */
  function updateSelection(toNode, toOffset) {
    if (!toNode) return;

    const aNode = hasOverride ? overrideAnchorNode : anchorNode;
    const aOffset = hasOverride ? overrideAnchorOffset : anchorOffset;

    if (!aNode) return;

    try {
      const sel = window.getSelection();
      if (!sel) return;

      const range = document.createRange();

      // Determina a ordem (âncora antes ou depois do cursor)
      let isAnchorBefore;
      if (aNode === toNode) {
        isAnchorBefore = aOffset <= toOffset;
      } else {
        const comparison = aNode.compareDocumentPosition(toNode);
        isAnchorBefore = !!(comparison & Node.DOCUMENT_POSITION_FOLLOWING);
      }

      if (isAnchorBefore) {
        range.setStart(aNode, Math.min(aOffset, aNode.length || 0));
        range.setEnd(toNode, Math.min(toOffset, toNode.length || 0));
      } else {
        range.setStart(toNode, Math.min(toOffset, toNode.length || 0));
        range.setEnd(aNode, Math.min(aOffset, aNode.length || 0));
      }

      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
      // Seleções entre nodes desconexos podem falhar silenciosamente
    }
  }

  /**
   * Handler principal de mousemove
   */
  function onMouseMove(e) {
    if (!enabled || paused) return;

    // Ignora se estiver sobre UI do editor
    if (isInsideEditorUI(e.target)) return;

    const pos = getTextPositionAt(e.clientX, e.clientY);
    if (!pos) return;

    // Se não tem âncora (e sem override), define o ponto inicial
    if (!hasOverride && !anchorNode) {
      anchorNode = pos.node;
      anchorOffset = pos.offset;
      return; // Primeiro ponto, ainda não seleciona
    }

    // Estende a seleção até a posição atual
    updateSelection(pos.node, pos.offset);
  }

  /**
   * Scroll: limpa seleção e reseta âncora
   */
  function onScroll() {
    if (!enabled) return;
    if (hasOverride) return; // Não reseta durante marca-texto

    // Só limpa se o nó âncora saiu do DOM (SPA, conteúdo dinâmico).
    // A Selection nativa do browser sobrevive ao scroll naturalmente.
    if (anchorNode && !document.contains(anchorNode)) {
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      anchorNode = null;
      anchorOffset = 0;
    }
  }

  /**
   * Mouse saiu da janela: pausa
   */
  function onMouseLeave() {
    if (!enabled) return;
    paused = true;
    if (!hasOverride) {
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
    }
  }

  /**
   * Mouse voltou: reseta âncora
   */
  function onMouseEnter() {
    if (!enabled) return;
    paused = false;
    if (!hasOverride) {
      anchorNode = null;
      anchorOffset = 0;
    }
  }

  // --- API para integração com Highlighter ---

  function setAnchorOverride(node, offset) {
    overrideAnchorNode = node;
    overrideAnchorOffset = offset;
    hasOverride = true;
  }

  function clearAnchorOverride() {
    overrideAnchorNode = null;
    overrideAnchorOffset = 0;
    hasOverride = false;

    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    anchorNode = null;
    anchorOffset = 0;
  }

  function toggle() {
    enabled = !enabled;
    if (!enabled) {
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      anchorNode = null;
      anchorOffset = 0;
      paused = false;
    }
    return enabled;
  }

  function setEnabled(val) {
    if (enabled === val) return;
    enabled = val;
    if (!enabled) {
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      anchorNode = null;
      anchorOffset = 0;
      paused = false;
    }
  }

  /**
   * Click: reseta a âncora para recomeçar a seleção a partir do clique.
   * - Clicou fora de texto → limpa tudo, próximo mousemove sobre texto define nova âncora
   * - Clicou sobre texto → nova âncora começa nesse ponto
   */
  function onClick(e) {
    if (!enabled || hasOverride) return;

    // Ignora cliques na UI do editor
    if (isInsideEditorUI(e.target)) return;

    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();

    const pos = getTextPositionAt(e.clientX, e.clientY);
    if (pos) {
      // Clicou sobre texto → nova âncora aqui
      anchorNode = pos.node;
      anchorOffset = pos.offset;
    } else {
      // Clicou fora de texto → limpa âncora
      anchorNode = null;
      anchorOffset = 0;
    }
  }

  function init() {
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('click', onClick);
  }

  return {
    init,
    toggle,
    setEnabled,
    setAnchorOverride,
    clearAnchorOverride,
    isEnabled: () => enabled
  };
})();
