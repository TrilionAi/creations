/**
 * Highlighter - Two-click highlighter
 *
 * State: IDLE -> ANCHORED (1st click) -> IDLE (2nd click applies)
 *
 * 1st click: locks start point, integrates with ReadingGuide.setAnchorOverride()
 * Mouse move: automatic selection extends from locked point to cursor (via guide)
 * 2nd click: captures window.getSelection(), applies highlight, clears
 *
 * Translucent colors (hexToRgba with alpha 0.35) for readable text.
 */
const Highlighter = (() => {
  let active = false;
  let currentColor = '#FFFF00';
  let highlights = [];
  let highlightCounter = 0;

  // State machine: 'IDLE' | 'ANCHORED'
  let state = 'IDLE';

  function generateId() {
    return 'eu-hl-' + (++highlightCounter) + '-' + Date.now();
  }

  /**
   * Converts hex color to rgba with alpha
   */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Creates a styled highlight span with translucent color
   */
  function createHighlightSpan(id, color) {
    const span = document.createElement('span');
    span.className = 'eu-highlight';
    span.dataset.highlightId = id;
    span.style.backgroundColor = hexToRgba(color, 0.35);
    span.dataset.originalColor = color;
    return span;
  }

  /**
   * Gets all text nodes within a Range
   */
  function getTextNodesInRange(range) {
    const nodes = [];
    const container = range.commonAncestorContainer;

    if (container.nodeType === Node.TEXT_NODE) {
      return [container];
    }

    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const nodeRange = document.createRange();
          nodeRange.selectNodeContents(node);
          if (
            range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0 &&
            range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }
    return nodes;
  }

  /**
   * Applies highlight to a selected Range
   */
  function highlightRange(range, color) {
    const id = generateId();
    const textNodes = getTextNodesInRange(range);

    if (textNodes.length === 0) return null;

    textNodes.forEach((node, i) => {
      const span = createHighlightSpan(id, color);
      const nodeRange = document.createRange();

      if (textNodes.length === 1) {
        nodeRange.setStart(node, range.startOffset);
        nodeRange.setEnd(node, range.endOffset);
      } else if (i === 0) {
        nodeRange.setStart(node, range.startOffset);
        nodeRange.setEnd(node, node.length);
      } else if (i === textNodes.length - 1) {
        nodeRange.setStart(node, 0);
        nodeRange.setEnd(node, range.endOffset);
      } else {
        nodeRange.selectNodeContents(node);
      }

      if (nodeRange.toString().length > 0) {
        try {
          nodeRange.surroundContents(span);
        } catch (e) {
          // surroundContents fails on ranges that cross elements
          const fragment = nodeRange.extractContents();
          span.appendChild(fragment);
          nodeRange.insertNode(span);
        }
      }
    });

    highlights.push({ id, color, text: range.toString() });
    saveHighlights();
    return id;
  }

  /**
   * Finds text position under the cursor (with bounds validation)
   */
  function getTextPositionAt(x, y) {
    if (!document.caretRangeFromPoint) return null;

    const range = document.caretRangeFromPoint(x, y);
    if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) return null;

    const textNode = range.startContainer;
    const charRange = document.createRange();
    charRange.setStart(textNode, range.startOffset);
    charRange.setEnd(textNode, Math.min(range.startOffset + 1, textNode.length));
    const charRect = charRange.getBoundingClientRect();

    if (charRect.width > 0 && x < charRect.left - 20) return null;
    if (charRect.height > 0 && (y < charRect.top - 5 || y > charRect.bottom + 5)) return null;

    return { node: textNode, offset: range.startOffset };
  }

  /**
   * Click event - two-click state machine
   */
  function onClick(e) {
    if (!active) return;

    // Ignore clicks on editor UI
    const target = e.target;
    if (target.closest('#eu-context-menu')) return;
    if (target.closest('#eu-toolbar')) return;
    if (target.closest('#eu-drawing-canvas')) return;

    // Click on existing highlight: don't interfere
    if (target.closest('.eu-highlight')) return;

    if (state === 'IDLE') {
      // 1st CLICK: lock start point
      const pos = getTextPositionAt(e.clientX, e.clientY);
      if (!pos) return;

      state = 'ANCHORED';
      document.body.style.cursor = 'crosshair';

      // Lock anchor in ReadingGuide
      ReadingGuide.setAnchorOverride(pos.node, pos.offset);

    } else if (state === 'ANCHORED') {
      // 2nd CLICK: apply highlight
      const selection = window.getSelection();

      if (selection && !selection.isCollapsed && selection.toString().trim()) {
        try {
          const range = selection.getRangeAt(0);

          const ancestor = range.commonAncestorContainer;
          const el = ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentElement : ancestor;
          if (el && (el.closest('#eu-context-menu') || el.closest('#eu-toolbar'))) {
            return;
          }

          highlightRange(range, currentColor);
        } catch (err) {
          console.warn('[Universal Editor] Error highlighting:', err.message);
        }
      }

      // Return to IDLE
      state = 'IDLE';
      document.body.style.cursor = active ? 'text' : '';

      // Release anchor
      ReadingGuide.clearAnchorOverride();

      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
    }
  }

  /**
   * Removes a highlight by ID
   */
  function removeHighlight(id) {
    const spans = document.querySelectorAll(`.eu-highlight[data-highlight-id="${id}"]`);
    spans.forEach(span => {
      const parent = span.parentNode;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
      parent.normalize();
    });
    highlights = highlights.filter(h => h.id !== id);
    saveHighlights();
  }

  /**
   * Removes all highlights
   */
  function clearAll() {
    const spans = document.querySelectorAll('.eu-highlight');
    spans.forEach(span => {
      const parent = span.parentNode;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
      parent.normalize();
    });
    highlights = [];
    saveHighlights();
  }

  async function saveHighlights() {
    try {
      await EditorStorage.save('highlights', highlights);
    } catch {
      // Storage may not be available
    }
  }

  function setColor(color) {
    currentColor = color;
  }

  function toggle() {
    active = !active;
    if (!active) {
      if (state === 'ANCHORED') {
        ReadingGuide.clearAnchorOverride();
      }
      state = 'IDLE';
    }
    document.body.style.cursor = active ? 'text' : '';
    return active;
  }

  function setActive(val) {
    if (!val && active && state === 'ANCHORED') {
      ReadingGuide.clearAnchorOverride();
      state = 'IDLE';
    }
    active = val;
    document.body.style.cursor = active ? 'text' : '';
  }

  function init() {
    document.addEventListener('click', onClick);

    // Double-click on highlight to remove
    document.addEventListener('dblclick', (e) => {
      const hl = e.target.closest('.eu-highlight');
      if (hl && hl.dataset.highlightId) {
        e.preventDefault();
        removeHighlight(hl.dataset.highlightId);
      }
    });

    // Escape cancels ANCHORED state
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state === 'ANCHORED') {
        state = 'IDLE';
        document.body.style.cursor = active ? 'text' : '';
        ReadingGuide.clearAnchorOverride();
      }
    });
  }

  return {
    init,
    toggle,
    setActive,
    setColor,
    removeHighlight,
    clearAll,
    getColor: () => currentColor,
    isActive: () => active,
    getHighlights: () => [...highlights],
    getState: () => state
  };
})();
