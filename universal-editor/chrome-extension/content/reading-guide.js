/**
 * Reading Guide - Automatic text selection that follows the cursor
 * Instead of a translucent bar, it automatically selects text
 * under the cursor using the browser's native selection API.
 *
 * API for integration with Highlighter:
 *   setAnchorOverride(node, offset) - locks the selection start point
 *   clearAnchorOverride() - removes the lock, returns to normal behavior
 */
const ReadingGuide = (() => {
  let enabled = false;

  // Current anchor point of automatic selection
  let anchorNode = null;
  let anchorOffset = 0;

  // Highlighter override (when the highlighter locks the point)
  let overrideAnchorNode = null;
  let overrideAnchorOffset = 0;
  let hasOverride = false;

  // State control
  let paused = false;

  /**
   * Finds the text position closest to point (x, y) in the viewport.
   * Validates that the cursor is actually over text (not in margin/padding).
   * Returns {node, offset} or null if no valid text is found.
   */
  function getTextPositionAt(x, y) {
    if (!document.caretRangeFromPoint) return null;

    const range = document.caretRangeFromPoint(x, y);
    if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) return null;

    const textNode = range.startContainer;

    // Create range for the specific character to verify actual position
    const charRange = document.createRange();
    charRange.setStart(textNode, range.startOffset);
    charRange.setEnd(textNode, Math.min(range.startOffset + 1, textNode.length));
    const charRect = charRange.getBoundingClientRect();

    // If the character has dimensions and the mouse X is far to its left, reject
    // This prevents the anchor from being set when the cursor is in the margin
    if (charRect.width > 0 && x < charRect.left - 20) return null;

    // Also reject if the mouse Y is outside the character rectangle (with tolerance)
    if (charRect.height > 0) {
      if (y < charRect.top - 5 || y > charRect.bottom + 5) return null;
    }

    return { node: textNode, offset: range.startOffset };
  }

  /**
   * Checks if the element is inside Universal Editor UI
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
   * Applies selection from the anchor point to the current cursor position
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

      // Determine order (anchor before or after cursor)
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
      // Selections between disconnected nodes can fail silently
    }
  }

  /**
   * Main mousemove handler
   */
  function onMouseMove(e) {
    if (!enabled || paused) return;

    // Ignore if hovering over editor UI
    if (isInsideEditorUI(e.target)) return;

    const pos = getTextPositionAt(e.clientX, e.clientY);
    if (!pos) return;

    // If there is no anchor (and no override), set the initial point
    if (!hasOverride && !anchorNode) {
      anchorNode = pos.node;
      anchorOffset = pos.offset;
      return; // First point, no selection yet
    }

    // Extend the selection to the current position
    updateSelection(pos.node, pos.offset);
  }

  /**
   * Scroll: clears selection and resets anchor
   */
  function onScroll() {
    if (!enabled) return;
    if (hasOverride) return; // Don't reset during highlighting

    // Only clear if the anchor node left the DOM (SPA, dynamic content).
    // The browser's native Selection survives scroll naturally.
    if (anchorNode && !document.contains(anchorNode)) {
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      anchorNode = null;
      anchorOffset = 0;
    }
  }

  /**
   * Mouse left the window: pause
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
   * Mouse returned: reset anchor
   */
  function onMouseEnter() {
    if (!enabled) return;
    paused = false;
    if (!hasOverride) {
      anchorNode = null;
      anchorOffset = 0;
    }
  }

  // --- API for integration with Highlighter ---

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
   * Click: resets the anchor to restart selection from the click point.
   * - Clicked outside text -> clears everything, next mousemove over text sets new anchor
   * - Clicked on text -> new anchor starts at this point
   */
  function onClick(e) {
    if (!enabled || hasOverride) return;

    // Ignore clicks on editor UI
    if (isInsideEditorUI(e.target)) return;

    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();

    const pos = getTextPositionAt(e.clientX, e.clientY);
    if (pos) {
      // Clicked on text -> new anchor here
      anchorNode = pos.node;
      anchorOffset = pos.offset;
    } else {
      // Clicked outside text -> clear anchor
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
