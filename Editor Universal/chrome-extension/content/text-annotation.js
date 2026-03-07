/**
 * Text Annotation - Texto puro flutuante sobre a página com edição rica
 * Sem caixa, sem fundo, sem handle. Apenas texto colorido.
 *
 * Interação:
 * - Clique na página: cria texto em modo EDIT (editável, cursor texto)
 * - Blur/clicar fora: vai para modo VIEW (não editável, cursor grab)
 * - Hover em VIEW: mostra cursor grab para indicar arrastar
 * - Mousedown em VIEW: arrasta a anotação
 * - Duplo-clique em VIEW: volta para EDIT
 * - Texto vazio no blur: remove a anotação
 *
 * Edição Rica (modo EDIT):
 * - Selecionar texto → mini toolbar aparece acima da seleção
 * - Botões: B (negrito), I (itálico), cor, tamanho
 * - Atalhos: Ctrl+B (negrito), Ctrl+I (itálico)
 * - Usa document.execCommand() para formatação inline
 *
 * Cor do texto padrão acompanha a cor do pincel (toolbar/context menu).
 */
const TextAnnotation = (() => {
  let active = false;
  let annotations = [];
  let currentFont = 'Segoe UI';
  let currentFontSize = 16;
  let currentColor = '#FF0000'; // Começa com a cor padrão do pincel
  let isBold = false;
  let isItalic = false;

  const FONTS = [
    'Segoe UI', 'Arial', 'Georgia', 'Courier New',
    'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Verdana'
  ];

  // ═══════════════════════════════════════
  //  Mini Toolbar de Formatação
  // ═══════════════════════════════════════

  let miniToolbar = null;

  function createMiniToolbar() {
    if (miniToolbar) return;

    // Range salvo para restaurar seleção após interação com <select>
    let savedRange = null;

    miniToolbar = document.createElement('div');
    miniToolbar.id = 'eu-mini-format-toolbar';
    miniToolbar.innerHTML = `
      <button data-cmd="bold" title="Negrito (Ctrl+B)"><b>B</b></button>
      <button data-cmd="italic" title="Itálico (Ctrl+I)"><i>I</i></button>
      <span class="eu-mini-sep"></span>
      <input type="color" id="eu-mini-color" value="${currentColor}" title="Cor do texto">
      <input type="number" id="eu-mini-size" value="${currentFontSize}" min="8" max="200" title="Tamanho">
    `;
    miniToolbar.style.display = 'none';
    document.documentElement.appendChild(miniToolbar);

    // Prevenir blur na anotação ao clicar na mini toolbar
    // Exceto inputs, que precisam receber foco para edição
    miniToolbar.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'INPUT') {
        e.preventDefault();
      }
      e.stopPropagation();
    });

    // Botões de comando (bold, italic)
    miniToolbar.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('[data-cmd]');
      if (btn) {
        document.execCommand(btn.dataset.cmd, false, null);
      }
    });

    // Cor do texto selecionado
    miniToolbar.querySelector('#eu-mini-color').addEventListener('input', (e) => {
      e.stopPropagation();
      document.execCommand('foreColor', false, e.target.value);
    });

    // Salvar seleção quando o input de tamanho recebe foco
    miniToolbar.querySelector('#eu-mini-size').addEventListener('focus', () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
        savedRange = sel.getRangeAt(0).cloneRange();
      }
    });

    // Aplicar tamanho ao alterar valor (digitar ou setas)
    miniToolbar.querySelector('#eu-mini-size').addEventListener('change', (e) => {
      e.stopPropagation();
      const size = parseInt(e.target.value);
      if (size >= 8 && size <= 200) {
        applyFontSize(size, savedRange);
      }
      savedRange = null;
    });
  }

  /**
   * Aplica tamanho de fonte via span wrapping (substitui execCommand fontSize que é bugado)
   * @param {number} sizePx - Tamanho em pixels
   * @param {Range} [preRange] - Range pré-salvo (usado quando <select> roubou o foco)
   */
  function applyFontSize(sizePx, preRange) {
    const sel = window.getSelection();

    // Usa range pré-salvo se a seleção atual está vazia (foco perdido pelo <select>)
    let range;
    if (preRange) {
      range = preRange;
    } else if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    } else {
      return; // Sem seleção e sem range salvo: nada a fazer
    }

    // Restaura seleção no DOM se necessário
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }

    const fragment = range.extractContents();

    const span = document.createElement('span');
    span.style.fontSize = sizePx + 'px';
    span.appendChild(fragment);

    range.insertNode(span);

    // Reseleciona o conteúdo inserido
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }

  function showMiniToolbar(annotationEl) {
    if (!miniToolbar) createMiniToolbar();

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      hideMiniToolbar();
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Detecta o tamanho real do texto selecionado
    let detectedSize = currentFontSize;
    let detectedColor = currentColor;
    // Pega o elemento onde começa a seleção
    let node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (node) {
      const computed = window.getComputedStyle(node);
      const parsedSize = parseFloat(computed.fontSize);
      if (parsedSize && !isNaN(parsedSize)) {
        detectedSize = Math.round(parsedSize);
      }
      // Detecta cor atual do texto selecionado
      const rgbColor = computed.color;
      if (rgbColor) {
        detectedColor = rgbToHex(rgbColor);
      }
    }

    // Atualiza cor e tamanho com os valores detectados
    const colorInput = miniToolbar.querySelector('#eu-mini-color');
    if (colorInput) colorInput.value = detectedColor;
    const sizeInput = miniToolbar.querySelector('#eu-mini-size');
    if (sizeInput) sizeInput.value = detectedSize;

    miniToolbar.style.display = 'flex';
    miniToolbar.style.left = (rect.left + window.scrollX + rect.width / 2 - 90) + 'px';
    miniToolbar.style.top = (rect.top + window.scrollY - 42) + 'px';
  }

  /**
   * Converte cor RGB/RGBA (ex: "rgb(255, 0, 0)") para hex (ex: "#ff0000")
   */
  function rgbToHex(rgb) {
    const match = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return currentColor;
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  function hideMiniToolbar() {
    if (miniToolbar) miniToolbar.style.display = 'none';
  }

  // ═══════════════════════════════════════
  //  Criar Anotação
  // ═══════════════════════════════════════

  function createAnnotation(x, y) {
    const id = 'eu-text-' + Date.now();

    // Div único — é o texto em si, sem container visual
    const el = document.createElement('div');
    el.id = id;
    el.className = 'eu-text-annotation';
    el.contentEditable = 'true'; // Começa em EDIT mode
    el.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      min-width: 20px;
      min-height: 20px;
      max-width: 500px;
      padding: 2px 4px;
      font-family: '${currentFont}', sans-serif;
      font-size: ${currentFontSize}px;
      color: ${currentColor};
      font-weight: ${isBold ? 'bold' : 'normal'};
      font-style: ${isItalic ? 'italic' : 'normal'};
      z-index: 2147483645;
      line-height: 1.4;
      cursor: text;
    `;

    // Estado interno
    let editing = true;

    // --- Entrar em modo VIEW ---
    function enterView() {
      if (!el.textContent.trim() && !el.innerHTML.trim()) {
        // Vazio: remove
        el.remove();
        annotations = annotations.filter(a => a.id !== id);
        return;
      }
      editing = false;
      el.contentEditable = 'false';
      el.style.cursor = 'grab';
      hideMiniToolbar();
    }

    // --- Entrar em modo EDIT ---
    function enterEdit() {
      editing = true;
      el.contentEditable = 'true';
      el.style.cursor = 'text';
      el.focus();
    }

    // Blur: sai do modo EDIT → VIEW
    el.addEventListener('blur', () => {
      // Delay para permitir double-click e clique na mini toolbar
      setTimeout(() => {
        if (document.activeElement !== el &&
            !document.activeElement.closest('#eu-mini-format-toolbar')) {
          enterView();
        }
      }, 200);
    });

    // Double-click: entra no modo EDIT
    el.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!editing) {
        enterEdit();
      }
    });

    // --- Mini toolbar: mostrar quando texto selecionado em EDIT ---
    el.addEventListener('mouseup', () => {
      if (editing) {
        setTimeout(() => showMiniToolbar(el), 10);
      }
    });

    el.addEventListener('keyup', (e) => {
      if (editing && (e.shiftKey || e.key === 'Shift')) {
        setTimeout(() => showMiniToolbar(el), 10);
      }
    });

    // --- Atalhos Ctrl+B / Ctrl+I dentro da anotação ---
    el.addEventListener('keydown', (e) => {
      if (editing && e.ctrlKey) {
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          e.stopPropagation();
          document.execCommand('bold', false, null);
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          e.stopPropagation();
          document.execCommand('italic', false, null);
        }
      }
    });

    // --- Arrastar em modo VIEW ---
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    el.addEventListener('mousedown', (e) => {
      e.stopPropagation();

      if (!editing) {
        // VIEW mode: inicia arraste
        isDragging = true;
        dragOffsetX = e.pageX - el.offsetLeft;
        dragOffsetY = e.pageY - el.offsetTop;
        el.style.cursor = 'grabbing';
        e.preventDefault(); // Impede seleção de texto durante arraste
      }
      // EDIT mode: não faz nada especial (permite edição nativa)
    });

    const onMouseMove = (e) => {
      if (isDragging) {
        el.style.left = (e.pageX - dragOffsetX) + 'px';
        el.style.top = (e.pageY - dragOffsetY) + 'px';
      }
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        el.style.cursor = 'grab';
      }
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseup', onMouseUp);

    // Previne propagação de cliques (não criar nova anotação ao clicar nesta)
    el.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.body.appendChild(el);
    el.focus();
    annotations.push({ id, el });

    // Registrar na pilha de undo unificada
    DrawingCanvas.pushTextUndo(id);

    return el;
  }

  function onClick(e) {
    if (!active) return;

    // Não criar anotação se clicou em elementos do Editor Universal
    const target = e.target;
    if (target.closest('.eu-text-annotation')) return;
    if (target.closest('#eu-toolbar')) return;
    if (target.closest('#eu-context-menu')) return;
    if (target.closest('#eu-drawing-canvas')) return;
    if (target.closest('#eu-mini-format-toolbar')) return;

    e.preventDefault();
    e.stopPropagation();
    createAnnotation(e.pageX, e.pageY);
  }

  function removeById(id) {
    const idx = annotations.findIndex(a => a.id === id);
    if (idx >= 0) {
      const annot = annotations[idx];
      if (annot.el && annot.el.parentNode) {
        annot.el.remove();
      }
      annotations.splice(idx, 1);
      hideMiniToolbar();
    }
  }

  function removeAll() {
    annotations.forEach(a => {
      if (a.el && a.el.parentNode) {
        a.el.remove();
      }
    });
    annotations = [];
    hideMiniToolbar();
  }

  function toggle() {
    active = !active;
    if (active) {
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = '';
    }
    return active;
  }

  function setActive(val) {
    active = val;
    if (!active) {
      document.body.style.cursor = '';
    }
  }

  function setFont(f) { currentFont = f; }
  function setFontSize(s) { currentFontSize = s; }

  function setColor(c) {
    currentColor = c;
    // Só define cor padrão para novas anotações.
    // Para mudar cor de texto existente, usar a mini toolbar (selecionar texto → mudar cor).
  }

  function setBold(b) { isBold = b; }
  function setItalic(i) { isItalic = i; }

  function init() {
    document.addEventListener('click', onClick);
  }

  return {
    init,
    toggle,
    setActive,
    setFont,
    setFontSize,
    setColor,
    setBold,
    setItalic,
    removeAll,
    removeById,
    FONTS,
    isActive: () => active,
    getFont: () => currentFont,
    getFontSize: () => currentFontSize,
    getColor: () => currentColor,
    isBold: () => isBold,
    isItalic: () => isItalic
  };
})();
