/**
 * Context Menu - Menu customizado ativado pelo botão direito
 * Substitui o menu padrão (Shift+botão direito = menu original)
 * Controla guia de leitura, marca-texto, ferramentas de desenho, cores
 */
const ContextMenu = (() => {
  let menuEl = null;

  const COLORS = [
    { hex: '#FFFF00', name: 'Amarelo' },
    { hex: '#FF9900', name: 'Laranja' },
    { hex: '#FF3333', name: 'Vermelho' },
    { hex: '#33FF33', name: 'Verde' },
    { hex: '#3399FF', name: 'Azul' },
    { hex: '#CC66FF', name: 'Roxo' },
    { hex: '#FF69B4', name: 'Rosa' },
    { hex: '#00FFFF', name: 'Ciano' },
    { hex: '#FFFFFF', name: 'Branco' },
  ];

  function create() {
    menuEl = document.createElement('div');
    menuEl.id = 'eu-context-menu';
    menuEl.innerHTML = `
      <!-- Guia de Leitura -->
      <div class="eu-menu-item" data-action="toggle-guide">
        <span class="eu-menu-icon">&#9776;</span>
        <span>Guia de Leitura</span>
        <span class="eu-status eu-status-off" id="eu-guide-status">OFF</span>
      </div>

      <!-- Marca-texto -->
      <div class="eu-menu-item" data-action="toggle-highlight">
        <span class="eu-menu-icon">&#9998;</span>
        <span>Marca-Texto</span>
        <span class="eu-status eu-status-off" id="eu-highlight-status">OFF</span>
      </div>

      <div class="eu-menu-divider"></div>

      <!-- Ferramentas de Desenho -->
      <div class="eu-menu-item" data-action="toggle-toolbar">
        <span class="eu-menu-icon">&#127912;</span>
        <span>Ferramentas de Desenho</span>
      </div>

      <div class="eu-menu-divider"></div>

      <!-- Cores -->
      <div class="eu-menu-label">Cor do Marca-Texto</div>
      <div class="eu-color-picker" id="eu-color-picker">
        ${COLORS.map(c =>
          `<div class="eu-color-swatch${c.hex === '#FFFF00' ? ' selected' : ''}"
                data-color="${c.hex}"
                style="background:${c.hex}"
                title="${c.name}"></div>`
        ).join('')}
      </div>

      <div class="eu-menu-divider"></div>

      <!-- Limpar highlights -->
      <div class="eu-menu-item" data-action="clear-highlights">
        <span class="eu-menu-icon">&#128465;</span>
        <span>Limpar Grifos desta Página</span>
      </div>
    `;
    menuEl.style.display = 'none';
    document.documentElement.appendChild(menuEl);
    attachEvents();
  }

  function attachEvents() {
    // Cliques nos itens do menu
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

        // Marca o swatch selecionado
        menuEl.querySelectorAll('.eu-color-swatch').forEach(s =>
          s.classList.remove('selected')
        );
        swatch.classList.add('selected');
        hide();
      }
    });

    // Previne propagação
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
    // Atualiza estados
    updateStatus('eu-guide-status', ReadingGuide.isEnabled());
    updateStatus('eu-highlight-status', Highlighter.isActive());

    // Marca a cor atual
    const currentColor = Highlighter.getColor();
    menuEl.querySelectorAll('.eu-color-swatch').forEach(s => {
      s.classList.toggle('selected', s.dataset.color === currentColor);
    });

    menuEl.style.display = 'block';

    // Posiciona sem sair da tela
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

    // Botão direito mostra menu customizado
    document.addEventListener('contextmenu', (e) => {
      // Shift+right-click = menu padrão do navegador
      if (e.shiftKey) return;

      // Não mostra sobre toolbar ou dentro de anotações
      if (e.target.closest('#eu-toolbar')) return;
      if (e.target.closest('.eu-text-annotation')) return;

      e.preventDefault();
      show(e.clientX, e.clientY);
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (menuEl && !menuEl.contains(e.target)) {
        hide();
      }
    });

    // Fecha ao rolar
    document.addEventListener('scroll', () => {
      hide();
    }, { passive: true });

    // Fecha com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hide();
      }
    });
  }

  return { init, show, hide };
})();
