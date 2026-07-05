/**
 * Context Menu - Custom menu activated by right-click
 * Replaces the default menu (Shift+right-click = original menu)
 * Controls reading guide, highlighter, drawing tools, colors
 */
const ContextMenu = (() => {
  let menuEl = null;

  const COLORS = [
    { hex: '#FFFF00', name: 'Yellow' },
    { hex: '#FF9900', name: 'Orange' },
    { hex: '#FF3333', name: 'Red' },
    { hex: '#33FF33', name: 'Green' },
    { hex: '#3399FF', name: 'Blue' },
    { hex: '#CC66FF', name: 'Purple' },
    { hex: '#FF69B4', name: 'Pink' },
    { hex: '#00FFFF', name: 'Cyan' },
    { hex: '#FFFFFF', name: 'White' },
  ];

  function create() {
    menuEl = document.createElement('div');
    menuEl.id = 'eu-context-menu';
    menuEl.innerHTML = `
      <!-- Reading Guide -->
      <div class="eu-menu-item" data-action="toggle-guide">
        <span class="eu-menu-icon">&#9776;</span>
        <span>Reading Guide</span>
        <span class="eu-status eu-status-off" id="eu-guide-status">OFF</span>
      </div>

      <!-- Highlighter -->
      <div class="eu-menu-item" data-action="toggle-highlight">
        <span class="eu-menu-icon">&#9998;</span>
        <span>Highlighter</span>
        <span class="eu-status eu-status-off" id="eu-highlight-status">OFF</span>
      </div>

      <div class="eu-menu-divider"></div>

      <!-- Drawing Tools -->
      <div class="eu-menu-item" data-action="toggle-toolbar">
        <span class="eu-menu-icon">&#127912;</span>
        <span>Drawing Tools</span>
      </div>

      <div class="eu-menu-divider"></div>

      <!-- Colors -->
      <div class="eu-menu-label">Highlighter Color</div>
      <div class="eu-color-picker" id="eu-color-picker">
        ${COLORS.map(c =>
          `<div class="eu-color-swatch${c.hex === '#FFFF00' ? ' selected' : ''}"
                data-color="${c.hex}"
                style="background:${c.hex}"
                title="${c.name}"></div>`
        ).join('')}
      </div>

      <div class="eu-menu-divider"></div>

      <!-- Clear highlights -->
      <div class="eu-menu-item" data-action="clear-highlights">
        <span class="eu-menu-icon">&#128465;</span>
        <span>Clear Highlights from this Page</span>
      </div>
    `;
    menuEl.style.display = 'none';
    document.documentElement.appendChild(menuEl);
    attachEvents();
  }

  function attachEvents() {
    // Menu item clicks
    menuEl.addEventListener('click', (e) => {
      const item = e.target.closest('[data-action]');
      const swatch = e.target.closest('.eu-color-swatch');

      if (item) {
        handleAction(item.dataset.action);
        hide();
      } else if (swatch) {
        const color = swatch.dataset.color;
        Highlighter.setColor(color);
        DrawingCanvas.setColor(color);
        TextAnnotation.setColor(color);

        // Mark the selected swatch
        menuEl.querySelectorAll('.eu-color-swatch').forEach(s =>
          s.classList.remove('selected')
        );
        swatch.classList.add('selected');
        hide();
      }
    });

    // Prevent propagation
    menuEl.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
  }

  function handleAction(action) {
    switch (action) {
      case 'toggle-guide': {
        const state = ReadingGuide.toggle();
        updateStatus('eu-guide-status', state);
        break;
      }
      case 'toggle-highlight': {
        const state = Highlighter.toggle();
        updateStatus('eu-highlight-status', state);
        break;
      }
      case 'toggle-toolbar': {
        Toolbar.toggle();
        break;
      }
      case 'clear-highlights': {
        Highlighter.clearAll();
        break;
      }
    }
  }

  function updateStatus(elementId, isOn) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = isOn ? 'ON' : 'OFF';
      el.className = `eu-status ${isOn ? 'eu-status-on' : 'eu-status-off'}`;
    }
  }

  function show(x, y) {
    // Update states
    updateStatus('eu-guide-status', ReadingGuide.isEnabled());
    updateStatus('eu-highlight-status', Highlighter.isActive());

    // Mark the current color
    const currentColor = Highlighter.getColor();
    menuEl.querySelectorAll('.eu-color-swatch').forEach(s => {
      s.classList.toggle('selected', s.dataset.color === currentColor);
    });

    menuEl.style.display = 'block';

    // Position without going off screen
    const rect = menuEl.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 10;
    const maxY = window.innerHeight - rect.height - 10;
    menuEl.style.left = Math.min(x, Math.max(0, maxX)) + 'px';
    menuEl.style.top = Math.min(y, Math.max(0, maxY)) + 'px';
  }

  function hide() {
    if (menuEl) menuEl.style.display = 'none';
  }

  function init() {
    create();

    // Right-click shows custom menu
    document.addEventListener('contextmenu', (e) => {
      // Shift+right-click = browser default menu
      if (e.shiftKey) return;

      // Don't show over toolbar or inside annotations
      if (e.target.closest('#eu-toolbar')) return;
      if (e.target.closest('.eu-text-annotation')) return;

      e.preventDefault();
      show(e.clientX, e.clientY);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (menuEl && !menuEl.contains(e.target)) {
        hide();
      }
    });

    // Close on scroll
    document.addEventListener('scroll', () => {
      hide();
    }, { passive: true });

    // Close with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hide();
      }
    });
  }

  return { init, show, hide };
})();
