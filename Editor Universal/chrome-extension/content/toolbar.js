/**
 * Toolbar - Barra de ferramentas flutuante
 * Controla desenho, texto, cores, espessura, undo/clear
 * Arrastável pelo header, minimizável
 * Ferramentas: lápis, retângulo, círculo, linha, seta, selecionar/mover
 */
const Toolbar = (() => {
  let toolbarEl = null;
  let visible = false;
  let currentMode = 'none'; // 'none' | 'draw' | 'text'

  function create() {
    toolbarEl = document.createElement('div');
    toolbarEl.id = 'eu-toolbar';
    toolbarEl.innerHTML = `
      <div class="eu-tb-header" id="eu-tb-header">
        <span class="eu-tb-title">Editor Universal</span>
        <div class="eu-tb-header-btns">
          <button class="eu-tb-header-btn" id="eu-tb-minimize" title="Minimizar">&#8211;</button>
          <button class="eu-tb-header-btn" id="eu-tb-close" title="Fechar">&times;</button>
        </div>
      </div>
      <div class="eu-tb-body" id="eu-tb-body">
        <!-- Ferramentas de Desenho -->
        <div class="eu-tb-group">
          <div class="eu-tb-label">Desenho</div>
          <div class="eu-tb-row">
            <button class="eu-tb-btn" data-tool="freehand" title="Desenho Livre">&#9998;</button>
            <button class="eu-tb-btn" data-tool="rectangle" title="Retângulo">&#9634;</button>
            <button class="eu-tb-btn" data-tool="circle" title="Círculo">&#9675;</button>
          </div>
          <div class="eu-tb-row" style="margin-top:4px">
            <button class="eu-tb-btn" data-tool="line" title="Linha">╱</button>
            <button class="eu-tb-btn" data-tool="arrow" title="Seta">→</button>
            <button class="eu-tb-btn" data-tool="select" title="Selecionar / Mover">✋</button>
          </div>
          <div class="eu-tb-row" style="margin-top:4px">
            <button class="eu-tb-btn" data-tool="filled-rect" title="Retângulo Preenchido (Shift=branco, Shift+Alt=preto)">■</button>
            <button class="eu-tb-btn" data-tool="highlighter" title="Marca-texto (Desenho)">🖍</button>
            <button class="eu-tb-btn" data-tool="eraser" title="Borracha (apagar traço)">🧹</button>
          </div>
        </div>

        <!-- Ferramenta de Texto -->
        <div class="eu-tb-group">
          <div class="eu-tb-label">Texto</div>
          <div class="eu-tb-row">
            <button class="eu-tb-btn" data-tool="text" title="Anotação de Texto">T</button>
            <select id="eu-font-select" class="eu-tb-select" title="Fonte">
            </select>
          </div>
          <div class="eu-tb-row">
            <input type="number" id="eu-font-size" class="eu-tb-input" value="16" min="8" max="72" title="Tamanho">
            <button class="eu-tb-btn eu-tb-btn-sm" id="eu-bold" title="Negrito"><b>B</b></button>
            <button class="eu-tb-btn eu-tb-btn-sm" id="eu-italic" title="Itálico"><i>I</i></button>
          </div>
        </div>

        <!-- Estilo -->
        <div class="eu-tb-group">
          <div class="eu-tb-label">Estilo</div>
          <div class="eu-tb-row eu-tb-row-center">
            <input type="color" id="eu-brush-color" value="#FF0000" class="eu-tb-color" title="Cor">
            <input type="range" id="eu-brush-size" min="1" max="20" value="3" class="eu-tb-range" title="Espessura">
            <span id="eu-brush-size-label" class="eu-tb-size-label">3px</span>
          </div>
        </div>

        <!-- Ações -->
        <div class="eu-tb-group eu-tb-group-last">
          <div class="eu-tb-row">
            <button class="eu-tb-btn eu-tb-btn-action" id="eu-undo" title="Desfazer (Ctrl+Z)">&#8634; Desfazer</button>
            <button class="eu-tb-btn eu-tb-btn-action eu-tb-btn-danger" id="eu-clear" title="Limpar Tudo">&#128465; Limpar</button>
          </div>
        </div>
      </div>
    `;
    toolbarEl.style.display = 'none';
    document.documentElement.appendChild(toolbarEl);

    populateFonts();
    attachEvents();
    makeDraggable();
  }

  function populateFonts() {
    const select = toolbarEl.querySelector('#eu-font-select');
    TextAnnotation.FONTS.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f;
      opt.style.fontFamily = f;
      select.appendChild(opt);
    });
  }

  function setActiveToolButton(toolName) {
    toolbarEl.querySelectorAll('[data-tool]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === toolName);
    });
  }

  function switchMode(newMode, toolName) {
    // Desativa modos anteriores
    if (currentMode === 'draw') {
      DrawingCanvas.setActive(false);
    } else if (currentMode === 'text') {
      TextAnnotation.setActive(false);
    }

    if (newMode === currentMode && toolName !== undefined) {
      // Se mesmo modo e mesma ferramenta: toggle off
      if (newMode === 'draw' && DrawingCanvas.getTool() === toolName) {
        currentMode = 'none';
        setActiveToolButton('');
        document.body.style.cursor = '';
        return;
      }
      // Se mesmo modo mas ferramenta diferente: troca ferramenta
      if (newMode === 'draw') {
        DrawingCanvas.setTool(toolName);
        DrawingCanvas.setActive(true);
        setActiveToolButton(toolName);
        return;
      }
      // Toggle off para texto
      currentMode = 'none';
      setActiveToolButton('');
      document.body.style.cursor = '';
      return;
    }

    currentMode = newMode;

    if (newMode === 'draw') {
      DrawingCanvas.setTool(toolName);
      DrawingCanvas.setActive(true);
      setActiveToolButton(toolName);
    } else if (newMode === 'text') {
      TextAnnotation.setActive(true);
      setActiveToolButton('text');
    }
  }

  function attachEvents() {
    // Seleção de ferramenta
    toolbarEl.querySelectorAll('[data-tool]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const toolName = btn.dataset.tool;
        if (toolName === 'text') {
          switchMode('text', toolName);
        } else {
          switchMode('draw', toolName);
        }
      });
    });

    // Cor — se há desenho selecionado, atualiza ele; senão, define para o próximo
    toolbarEl.querySelector('#eu-brush-color').addEventListener('input', (e) => {
      const color = e.target.value;
      if (DrawingCanvas.hasSelection()) {
        DrawingCanvas.updateSelectedColor(color);
      } else {
        DrawingCanvas.setColor(color);
      }
      TextAnnotation.setColor(color);
    });

    // Espessura — se há desenho selecionado, atualiza ele; senão, define para o próximo
    toolbarEl.querySelector('#eu-brush-size').addEventListener('input', (e) => {
      const size = parseInt(e.target.value);
      if (DrawingCanvas.hasSelection()) {
        DrawingCanvas.updateSelectedSize(size);
      } else {
        DrawingCanvas.setSize(size);
      }
      toolbarEl.querySelector('#eu-brush-size-label').textContent = size + 'px';
    });

    // Fonte
    toolbarEl.querySelector('#eu-font-select').addEventListener('change', (e) => {
      TextAnnotation.setFont(e.target.value);
    });

    // Tamanho da fonte
    toolbarEl.querySelector('#eu-font-size').addEventListener('input', (e) => {
      TextAnnotation.setFontSize(parseInt(e.target.value) || 16);
    });

    // Bold
    toolbarEl.querySelector('#eu-bold').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      btn.classList.toggle('active');
      TextAnnotation.setBold(btn.classList.contains('active'));
    });

    // Italic
    toolbarEl.querySelector('#eu-italic').addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.currentTarget;
      btn.classList.toggle('active');
      TextAnnotation.setItalic(btn.classList.contains('active'));
    });

    // Undo
    toolbarEl.querySelector('#eu-undo').addEventListener('click', (e) => {
      e.stopPropagation();
      DrawingCanvas.undo();
    });

    // Clear
    toolbarEl.querySelector('#eu-clear').addEventListener('click', (e) => {
      e.stopPropagation();
      DrawingCanvas.clearAll();
      TextAnnotation.removeAll();
      Highlighter.clearAll();
    });

    // Minimize
    toolbarEl.querySelector('#eu-tb-minimize').addEventListener('click', (e) => {
      e.stopPropagation();
      const body = toolbarEl.querySelector('#eu-tb-body');
      const isHidden = body.style.display === 'none';
      body.style.display = isHidden ? 'block' : 'none';
      e.currentTarget.textContent = isHidden ? '\u2013' : '+';
    });

    // Close
    toolbarEl.querySelector('#eu-tb-close').addEventListener('click', (e) => {
      e.stopPropagation();
      hide();
      switchMode('none');
    });

    // Previne propagação
    toolbarEl.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });

    // Atalho Ctrl+Z para undo
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'z' && DrawingCanvas.isActive()) {
        e.preventDefault();
        DrawingCanvas.undo();
      }
      // Delete remove desenho selecionado
      if (e.key === 'Delete' && DrawingCanvas.hasSelection()) {
        e.preventDefault();
        DrawingCanvas.deleteSelected();
      }
    });
  }

  function makeDraggable() {
    const header = toolbarEl.querySelector('#eu-tb-header');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.eu-tb-header-btn')) return;
      isDragging = true;
      offsetX = e.clientX - toolbarEl.offsetLeft;
      offsetY = e.clientY - toolbarEl.offsetTop;
      header.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        toolbarEl.style.left = (e.clientX - offsetX) + 'px';
        toolbarEl.style.top = (e.clientY - offsetY) + 'px';
        toolbarEl.style.right = 'auto';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'grab';
      }
    });
  }

  function show() {
    visible = true;
    if (toolbarEl) toolbarEl.style.display = 'block';
  }

  function hide() {
    visible = false;
    if (toolbarEl) toolbarEl.style.display = 'none';
  }

  function toggle() {
    visible ? hide() : show();
    return visible;
  }

  function init() {
    create();
  }

  return {
    init,
    show,
    hide,
    toggle,
    isVisible: () => visible,
    getCurrentMode: () => currentMode
  };
})();
