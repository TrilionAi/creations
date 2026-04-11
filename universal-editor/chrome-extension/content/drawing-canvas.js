/**
 * Drawing Canvas - Canvas de desenho que rola com a página
 * Suporta: desenho livre, marca-texto (highlighter), borracha (eraser),
 * retângulo, círculo, linha, seta, selecionar/mover
 * Usa position: absolute para que desenhos acompanhem o scroll
 */
const DrawingCanvas = (() => {
  let canvas = null;
  let ctx = null;
  let active = false;
  let tool = 'freehand'; // 'freehand' | 'highlighter' | 'eraser' | 'rectangle' | 'filled-rect' | 'circle' | 'line' | 'arrow' | 'select'

  /**
   * Converte cor hex (#RRGGBB) para rgba string
   */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  let brushColor = '#FF0000';
  let brushSize = 3;
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let paths = [];
  let currentPath = [];

  // Pilha de undo unificada: registra ordem de criação de desenhos e textos
  // Formato: { type: 'path' } ou { type: 'text', id: 'eu-text-...' }
  let undoStack = [];

  // Estado para ferramenta select/move
  let selectedIndex = -1;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function create() {
    canvas = document.createElement('canvas');
    canvas.id = 'eu-drawing-canvas';
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2147483645;
      pointer-events: none;
      cursor: default;
    `;
    resizeCanvas();
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const resizeObserver = new ResizeObserver(() => {
      const oldPaths = [...paths];
      resizeCanvas();
      paths = oldPaths;
      redrawAll();
    });
    resizeObserver.observe(document.documentElement);

    window.addEventListener('load', () => {
      resizeCanvas();
      redrawAll();
    });
  }

  function resizeCanvas() {
    if (!canvas) return;
    const w = Math.max(
      document.documentElement.scrollWidth || 0,
      document.body.scrollWidth || 0,
      window.innerWidth
    );
    const h = Math.max(
      document.documentElement.scrollHeight || 0,
      document.body.scrollHeight || 0,
      window.innerHeight
    );
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  function redrawAll() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach((p, i) => drawPathData(p, i === selectedIndex));
  }

  /**
   * Desenha a cabeça de uma seta
   */
  function drawArrowHead(ctx, fromX, fromY, toX, toY, size) {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLen = Math.max(size * 4, 12);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLen * Math.cos(angle - Math.PI / 6),
      toY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLen * Math.cos(angle + Math.PI / 6),
      toY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  }

  function drawPathData(pathData, isSelected) {
    // Highlighter usa composição multiply para efeito natural
    const isHighlighter = pathData.type === 'highlighter';
    if (isHighlighter) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
    }

    ctx.strokeStyle = pathData.color;
    ctx.fillStyle = pathData.color;
    ctx.lineWidth = pathData.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Borda de seleção
    if (isSelected) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over'; // Seleção sempre normal
      ctx.strokeStyle = 'rgba(58, 134, 255, 0.7)';
      ctx.lineWidth = pathData.size + 4;
      ctx.setLineDash([6, 4]);
      drawShapeStroke(pathData);
      ctx.restore();
      // Re-set cor original
      ctx.strokeStyle = pathData.color;
      ctx.fillStyle = pathData.color;
      ctx.lineWidth = pathData.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([]);
    }

    drawShapeStroke(pathData);

    // Cabeça da seta
    if (pathData.type === 'arrow') {
      drawArrowHead(ctx, pathData.x1, pathData.y1, pathData.x2, pathData.y2, pathData.size);
    }

    if (isHighlighter) {
      ctx.restore();
    }
  }

  /**
   * Desenha apenas o stroke da forma (reutilizado para seleção e desenho)
   */
  function drawShapeStroke(pathData) {
    switch (pathData.type) {
      case 'highlighter':
      case 'freehand': {
        if (pathData.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pathData.points[0].x, pathData.points[0].y);
        for (let i = 1; i < pathData.points.length; i++) {
          ctx.lineTo(pathData.points[i].x, pathData.points[i].y);
        }
        ctx.stroke();
        break;
      }
      case 'rectangle': {
        ctx.beginPath();
        ctx.strokeRect(pathData.x, pathData.y, pathData.w, pathData.h);
        break;
      }
      case 'filled-rect': {
        // Retângulo preenchido — usa fillColor para o fundo
        ctx.fillStyle = pathData.fillColor || pathData.color;
        ctx.fillRect(pathData.x, pathData.y, pathData.w, pathData.h);
        break;
      }
      case 'circle': {
        ctx.beginPath();
        ctx.ellipse(
          pathData.cx, pathData.cy,
          Math.abs(pathData.rx), Math.abs(pathData.ry),
          0, 0, Math.PI * 2
        );
        ctx.stroke();
        break;
      }
      case 'line':
      case 'arrow': {
        ctx.beginPath();
        ctx.moveTo(pathData.x1, pathData.y1);
        ctx.lineTo(pathData.x2, pathData.y2);
        ctx.stroke();
        break;
      }
    }
  }

  /**
   * Hit-test: verifica se o ponto (px, py) está próximo de um path
   */
  function hitTest(pathData, px, py) {
    const threshold = Math.max(pathData.size * 2, 10);

    switch (pathData.type) {
      case 'highlighter':
      case 'freehand': {
        for (const pt of pathData.points) {
          if (Math.hypot(pt.x - px, pt.y - py) < threshold) return true;
        }
        return false;
      }
      case 'rectangle': {
        const { x, y, w, h } = pathData;
        // Checa proximidade com as 4 bordas
        return (
          distToSegment(px, py, x, y, x + w, y) < threshold ||
          distToSegment(px, py, x + w, y, x + w, y + h) < threshold ||
          distToSegment(px, py, x + w, y + h, x, y + h) < threshold ||
          distToSegment(px, py, x, y + h, x, y) < threshold
        );
      }
      case 'filled-rect': {
        // Retângulo preenchido: qualquer ponto dentro conta
        const rx = Math.min(pathData.x, pathData.x + pathData.w);
        const ry = Math.min(pathData.y, pathData.y + pathData.h);
        const rw = Math.abs(pathData.w);
        const rh = Math.abs(pathData.h);
        return px >= rx - threshold && px <= rx + rw + threshold &&
               py >= ry - threshold && py <= ry + rh + threshold;
      }
      case 'circle': {
        const { cx, cy, rx, ry } = pathData;
        // Aproximação: checa se está na borda da elipse
        if (rx === 0 && ry === 0) return false;
        const normalized = Math.pow((px - cx) / rx, 2) + Math.pow((py - cy) / ry, 2);
        return Math.abs(normalized - 1) < (threshold / Math.min(rx, ry));
      }
      case 'line':
      case 'arrow': {
        return distToSegment(px, py, pathData.x1, pathData.y1, pathData.x2, pathData.y2) < threshold;
      }
    }
    return false;
  }

  /**
   * Distância de um ponto a um segmento de reta
   */
  function distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  /**
   * Translada um path por (dx, dy)
   */
  function translatePath(pathData, dx, dy) {
    switch (pathData.type) {
      case 'highlighter':
      case 'freehand':
        pathData.points = pathData.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
        break;
      case 'filled-rect':
      case 'rectangle':
        pathData.x += dx;
        pathData.y += dy;
        break;
      case 'circle':
        pathData.cx += dx;
        pathData.cy += dy;
        break;
      case 'line':
      case 'arrow':
        pathData.x1 += dx;
        pathData.y1 += dy;
        pathData.x2 += dx;
        pathData.y2 += dy;
        break;
    }
  }

  // --- Eventos de mouse ---

  function onMouseDown(e) {
    if (!active || e.button !== 0) return;
    const x = e.pageX;
    const y = e.pageY;

    // Eraser: apaga traço sob o cursor
    if (tool === 'eraser') {
      for (let i = paths.length - 1; i >= 0; i--) {
        if (hitTest(paths[i], x, y)) {
          paths.splice(i, 1);
          if (selectedIndex === i) selectedIndex = -1;
          else if (selectedIndex > i) selectedIndex--;
          redrawAll();
          break;
        }
      }
      isDrawing = true; // Para continuar apagando no mousemove
      return;
    }

    if (tool === 'select') {
      // Tenta selecionar um path existente (de trás para frente)
      selectedIndex = -1;
      for (let i = paths.length - 1; i >= 0; i--) {
        if (hitTest(paths[i], x, y)) {
          selectedIndex = i;
          dragOffsetX = x;
          dragOffsetY = y;
          isDrawing = true;
          redrawAll();
          return;
        }
      }
      // Clicou no vazio: deseleciona
      selectedIndex = -1;
      redrawAll();
      return;
    }

    isDrawing = true;
    startX = x;
    startY = y;
    currentX = x;
    currentY = y;
    currentPath = [{ x, y }];

    if (tool === 'freehand' || tool === 'highlighter') {
      const drawColor = tool === 'highlighter' ? hexToRgba(brushColor, 0.3) : brushColor;
      const drawSize = tool === 'highlighter' ? Math.max(brushSize, 20) : brushSize;
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (tool === 'highlighter') ctx.globalCompositeOperation = 'multiply';
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }

  function onMouseMove(e) {
    if (!isDrawing || !active) return;
    const x = e.pageX;
    const y = e.pageY;

    // Eraser contínuo ao arrastar
    if (tool === 'eraser') {
      for (let i = paths.length - 1; i >= 0; i--) {
        if (hitTest(paths[i], x, y)) {
          paths.splice(i, 1);
          if (selectedIndex === i) selectedIndex = -1;
          else if (selectedIndex > i) selectedIndex--;
          redrawAll();
        }
      }
      return;
    }

    if (tool === 'select') {
      // Mover o item selecionado
      if (selectedIndex >= 0) {
        const dx = x - dragOffsetX;
        const dy = y - dragOffsetY;
        translatePath(paths[selectedIndex], dx, dy);
        dragOffsetX = x;
        dragOffsetY = y;
        redrawAll();
      }
      return;
    }

    currentX = x;
    currentY = y;

    if (tool === 'freehand' || tool === 'highlighter') {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      currentPath.push({ x, y });
    } else {
      // Preview de formas
      redrawAll();
      ctx.strokeStyle = brushColor;
      ctx.fillStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'rectangle') {
        ctx.strokeRect(startX, startY, x - startX, y - startY);
      } else if (tool === 'filled-rect') {
        // Preview com cor translúcida
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = brushColor;
        ctx.fillRect(startX, startY, x - startX, y - startY);
        ctx.restore();
      } else if (tool === 'circle') {
        const rx = Math.abs(x - startX) / 2;
        const ry = Math.abs(y - startY) / 2;
        const cx = (startX + x) / 2;
        const cy = (startY + y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        drawArrowHead(ctx, startX, startY, x, y, brushSize);
      }
    }
  }

  function onMouseUp(e) {
    if (!isDrawing || !active) return;
    isDrawing = false;

    if (tool === 'select') return; // Soltar move termina
    if (tool === 'eraser') {
      // Restaura composição (caso mudou)
      ctx.globalCompositeOperation = 'source-over';
      return;
    }

    const x = e.pageX;
    const y = e.pageY;

    // Restaura composição para highlighter
    if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
    }

    let added = false;

    if (tool === 'freehand') {
      if (currentPath.length >= 2) {
        paths.push({
          type: 'freehand',
          points: [...currentPath],
          color: brushColor,
          size: brushSize
        });
        added = true;
      }
    } else if (tool === 'highlighter') {
      if (currentPath.length >= 2) {
        paths.push({
          type: 'highlighter',
          points: [...currentPath],
          color: hexToRgba(brushColor, 0.3),
          size: Math.max(brushSize, 20)
        });
        added = true;
      }
    } else if (tool === 'rectangle') {
      paths.push({
        type: 'rectangle',
        x: startX, y: startY,
        w: x - startX, h: y - startY,
        color: brushColor, size: brushSize
      });
      added = true;
    } else if (tool === 'filled-rect') {
      // Shift = branco, Shift+Alt = preto, senão = cor do pincel
      let fillColor = brushColor;
      if (e.shiftKey && e.altKey) {
        fillColor = '#000000';
      } else if (e.shiftKey) {
        fillColor = '#FFFFFF';
      }
      paths.push({
        type: 'filled-rect',
        x: startX, y: startY,
        w: x - startX, h: y - startY,
        color: brushColor, size: brushSize,
        fillColor: fillColor
      });
      added = true;
    } else if (tool === 'circle') {
      paths.push({
        type: 'circle',
        cx: (startX + x) / 2, cy: (startY + y) / 2,
        rx: Math.abs(x - startX) / 2, ry: Math.abs(y - startY) / 2,
        color: brushColor, size: brushSize
      });
      added = true;
    } else if (tool === 'line') {
      paths.push({
        type: 'line',
        x1: startX, y1: startY, x2: x, y2: y,
        color: brushColor, size: brushSize
      });
      added = true;
    } else if (tool === 'arrow') {
      paths.push({
        type: 'arrow',
        x1: startX, y1: startY, x2: x, y2: y,
        color: brushColor, size: brushSize
      });
      added = true;
    }

    if (added) {
      undoStack.push({ type: 'path' });
    }

    currentPath = [];
    redrawAll();
  }

  function getCursorForTool(t) {
    if (t === 'select') return 'default';
    if (t === 'eraser') return 'pointer';
    return 'crosshair';
  }

  function toggle() {
    active = !active;
    selectedIndex = -1;
    if (canvas) {
      canvas.style.pointerEvents = active ? 'auto' : 'none';
      canvas.style.cursor = active ? getCursorForTool(tool) : 'default';
    }
    return active;
  }

  function setActive(val) {
    active = val;
    selectedIndex = -1;
    if (canvas) {
      canvas.style.pointerEvents = active ? 'auto' : 'none';
      canvas.style.cursor = active ? getCursorForTool(tool) : 'default';
    }
  }

  function setTool(t) {
    tool = t;
    selectedIndex = -1;
    if (canvas && active) {
      canvas.style.cursor = getCursorForTool(tool);
    }
    redrawAll();
  }

  function setColor(c) { brushColor = c; }
  function setSize(s) { brushSize = s; }

  function hasSelection() {
    return selectedIndex >= 0;
  }

  function updateSelectedColor(color) {
    if (selectedIndex >= 0 && selectedIndex < paths.length) {
      paths[selectedIndex].color = color;
      redrawAll();
    }
  }

  function updateSelectedSize(size) {
    if (selectedIndex >= 0 && selectedIndex < paths.length) {
      paths[selectedIndex].size = size;
      redrawAll();
    }
  }

  function deleteSelected() {
    if (selectedIndex >= 0 && selectedIndex < paths.length) {
      paths.splice(selectedIndex, 1);
      selectedIndex = -1;
      redrawAll();
    }
  }

  /**
   * Registra uma anotação de texto na pilha de undo unificada
   */
  function pushTextUndo(textId) {
    undoStack.push({ type: 'text', id: textId });
  }

  /**
   * Undo unificado: desfaz o último item (desenho ou texto) na ordem de criação
   */
  function undo() {
    if (undoStack.length === 0) return;

    const last = undoStack.pop();
    if (last.type === 'path') {
      if (paths.length > 0) {
        paths.pop();
        selectedIndex = -1;
        redrawAll();
      }
    } else if (last.type === 'text') {
      TextAnnotation.removeById(last.id);
    }
  }

  function clearAll() {
    paths = [];
    undoStack = [];
    selectedIndex = -1;
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function init() {
    create();
    canvas.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseup', onMouseUp);
  }

  return {
    init,
    toggle,
    setActive,
    setTool,
    setColor,
    setSize,
    undo,
    clearAll,
    pushTextUndo,
    hasSelection,
    updateSelectedColor,
    updateSelectedSize,
    deleteSelected,
    isActive: () => active,
    getTool: () => tool,
    getColor: () => brushColor,
    getSize: () => brushSize
  };
})();
