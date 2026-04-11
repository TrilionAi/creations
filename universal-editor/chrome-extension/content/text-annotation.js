/**
 * Text Annotation - Pure floating text over the page with rich editing
 * No box, no background, no handle. Just colored text.
 *
 * Interaction:
 * - Click on page: creates text in EDIT mode (editable, text cursor)
 * - Blur/click outside: goes to VIEW mode (non-editable, grab cursor)
 * - Hover in VIEW: shows grab cursor to indicate dragging
 * - Mousedown in VIEW: drags the annotation
 * - Double-click in VIEW: returns to EDIT
 * - Empty text on blur: removes the annotation
 *
 * Rich Editing (EDIT mode):
 * - Select text -> mini toolbar appears above the selection
 * - Buttons: B (bold), I (italic), color, size
 * - Shortcuts: Ctrl+B (bold), Ctrl+I (italic)
 * - Uses document.execCommand() for inline formatting
 *
 * Default text color follows the brush color (toolbar/context menu).
 */
const TextAnnotation = (() => {
  let active = false;
  let annotations = [];
  let currentFont = 'Segoe UI';
  let currentFontSize = 16;
  let currentColor = '#FF0000'; // Starts with the default brush color
  let isBold = false;
  let isItalic = false;

  const FONTS = [
    'Segoe UI', 'Arial', 'Georgia', 'Courier New',
    'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Verdana'
  ];

  // ═══════════════════════════════════════
  //  Mini Formatting Toolbar
  // ═══════════════════════════════════════

  let miniToolbar = null;

  function createMiniToolbar() {
    if (miniToolbar) return;

    // Saved range to restore selection after interaction with <select>
    let savedRange = null;

    miniToolbar = document.createElement('div');
    miniToolbar.id = 'eu-mini-format-toolbar';
    miniToolbar.innerHTML = `
      <button data-cmd="bold" title="Bold (Ctrl+B)"><b>B</b></button>
      <button data-cmd="italic" title="Italic (Ctrl+I)"><i>I</i></button>
      <span class="eu-mini-sep"></span>
      <input type="color" id="eu-mini-color" value="${currentColor}" title="Text color">
      <input type="number" id="eu-mini-size" value="${currentFontSize}" min="8" max="200" title="Size">
    `;
    miniToolbar.style.display = 'none';
    document.documentElement.appendChild(miniToolbar);

    // Prevent blur on annotation when clicking the mini toolbar
    // Except inputs, which need to receive focus for editing
    miniToolbar.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'INPUT') {
        e.preventDefault();
      }
      e.stopPropagation();
    });

    // Command buttons (bold, italic)
    miniToolbar.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('[data-cmd]');
      if (btn) {
        document.execCommand(btn.dataset.cmd, false, null);
      }
    });

    // Selected text color
    miniToolbar.querySelector('#eu-mini-color').addEventListener('input', (e) => {
      e.stopPropagation();
      document.execCommand('foreColor', false, e.target.value);
    });

    // Save selection when the size input receives focus
    miniToolbar.querySelector('#eu-mini-size').addEventListener('focus', () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
        savedRange = sel.getRangeAt(0).cloneRange();
      }
    });

    // Apply size when value changes (typing or arrows)
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
   * Applies font size via span wrapping (replaces buggy execCommand fontSize)
   * @param {number} sizePx - Size in pixels
   * @param {Range} [preRange] - Pre-saved range (used when <select> stole focus)
   */
  function applyFontSize(sizePx, preRange) {
    const sel = window.getSelection();

    // Use pre-saved range if current selection is empty (focus lost by <select>)
    let range;
    if (preRange) {
      range = preRange;
    } else if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    } else {
      return; // No selection and no saved range: nothing to do
    }

    // Restore selection in DOM if necessary
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }

    const fragment = range.extractContents();

    const span = document.createElement('span');
    span.style.fontSize = sizePx + 'px';
    span.appendChild(fragment);

    range.insertNode(span);

    // Reselect the inserted content
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

    // Detect the actual size of the selected text
    let detectedSize = currentFontSize;
    let detectedColor = currentColor;
    // Get the element where the selection starts
    let node = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (node) {
      const computed = window.getComputedStyle(node);
      const parsedSize = parseFloat(computed.fontSize);
      if (parsedSize && !isNaN(parsedSize)) {
        detectedSize = Math.round(parsedSize);
      }
      // Detect current color of selected text
      const rgbColor = computed.color;
      if (rgbColor) {
        detectedColor = rgbToHex(rgbColor);
      }
    }

    // Update color and size with detected values
    const colorInput = miniToolbar.querySelector('#eu-mini-color');
    if (colorInput) colorInput.value = detectedColor;
    const sizeInput = miniToolbar.querySelector('#eu-mini-size');
    if (sizeInput) sizeInput.value = detectedSize;

    miniToolbar.style.display = 'flex';
    miniToolbar.style.left = (rect.left + window.scrollX + rect.width / 2 - 90) + 'px';
    miniToolbar.style.top = (rect.top + window.scrollY - 42) + 'px';
  }

  /**
   * Converts RGB/RGBA color (e.g., "rgb(255, 0, 0)") to hex (e.g., "#ff0000")
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
  //  Create Annotation
  // ═══════════════════════════════════════

  function createAnnotation(x, y) {
    const id = 'eu-text-' + Date.now();

    // Single div -- it is the text itself, no visual container
    const el = document.createElement('div');
    el.id = id;
    el.className = 'eu-text-annotation';
    el.contentEditable = 'true'; // Starts in EDIT mode
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

    // Internal state
    let editing = true;

    // --- Enter VIEW mode ---
    function enterView() {
      if (!el.textContent.trim() && !el.innerHTML.trim()) {
        // Empty: remove
        el.remove();
        annotations = annotations.filter(a => a.id !== id);
        return;
      }
      editing = false;
      el.contentEditable = 'false';
      el.style.cursor = 'grab';
      hideMiniToolbar();
    }

    // --- Enter EDIT mode ---
    function enterEdit() {
      editing = true;
      el.contentEditable = 'true';
      el.style.cursor = 'text';
      el.focus();
    }

    // Blur: exits EDIT mode -> VIEW
    el.addEventListener('blur', () => {
      // Delay to allow double-click and clicks on mini toolbar
      setTimeout(() => {
        if (document.activeElement !== el &&
            !document.activeElement.closest('#eu-mini-format-toolbar')) {
          enterView();
        }
      }, 200);
    });

    // Double-click: enters EDIT mode
    el.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!editing) {
        enterEdit();
      }
    });

    // --- Mini toolbar: show when text is selected in EDIT ---
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

    // --- Ctrl+B / Ctrl+I shortcuts inside the annotation ---
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

    // --- Drag in VIEW mode ---
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    el.addEventListener('mousedown', (e) => {
      e.stopPropagation();

      if (!editing) {
        // VIEW mode: start drag
        isDragging = true;
        dragOffsetX = e.pageX - el.offsetLeft;
        dragOffsetY = e.pageY - el.offsetTop;
        el.style.cursor = 'grabbing';
        e.preventDefault(); // Prevent text selection during drag
      }
      // EDIT mode: nothing special (allows native editing)
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

    // Prevent click propagation (don't create new annotation when clicking this one)
    el.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.body.appendChild(el);
    el.focus();
    annotations.push({ id, el });

    // Register in the unified undo stack
    DrawingCanvas.pushTextUndo(id);

    return el;
  }

  function onClick(e) {
    if (!active) return;

    // Don't create annotation if clicked on Universal Editor elements
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
    // Only sets default color for new annotations.
    // To change existing text color, use the mini toolbar (select text -> change color).
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
