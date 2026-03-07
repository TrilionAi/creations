"""
Gera icon.ico para o Editor Universal Desktop.
Lápis amarelo cartoon com borracha rosa - estilo clássico.
Requer Pillow: pip install Pillow
"""

from PIL import Image, ImageDraw


# Cores do lápis
YELLOW_BODY = (255, 210, 50, 255)       # Corpo amarelo
YELLOW_DARK = (220, 175, 30, 255)       # Sombra do corpo
ORANGE_BAND = (210, 140, 40, 255)       # Faixa metálica (virola)
ORANGE_DARK = (180, 110, 30, 255)       # Sombra da virola
PINK_ERASER = (255, 160, 170, 255)      # Borracha rosa claro
PINK_DARK = (220, 120, 135, 255)        # Sombra da borracha
TIP_WOOD = (225, 180, 120, 255)         # Madeira da ponta
TIP_DARK = (190, 145, 90, 255)          # Sombra da madeira
GRAPHITE = (70, 70, 70, 255)            # Grafite
BLACK = (0, 0, 0, 255)
OUTLINE = (60, 50, 30, 255)             # Contorno marrom escuro


def draw_pencil(size):
    """Desenha um lápis inclinado ~45 graus no tamanho dado"""
    # Criar imagem maior para rotação limpa, depois redimensionar
    canvas = max(256, size * 4)
    img = Image.new('RGBA', (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Dimensões do lápis (proporcionais ao canvas)
    cx, cy = canvas // 2, canvas // 2

    # O lápis é vertical, depois rotacionamos -45 graus
    pw = canvas * 0.18   # largura do lápis
    ph = canvas * 0.70   # altura total do lápis

    left = cx - pw / 2
    right = cx + pw / 2
    top = cy - ph / 2
    bottom = cy + ph / 2

    # Seções do lápis (de cima pra baixo):
    # 1. Borracha (topo arredondado)
    # 2. Virola metálica
    # 3. Corpo amarelo
    # 4. Ponta madeira (cone)
    # 5. Grafite

    eraser_h = ph * 0.12
    band_h = ph * 0.06
    body_h = ph * 0.55
    wood_h = ph * 0.18
    tip_h = ph * 0.09

    y0 = top  # topo da borracha
    y1 = y0 + eraser_h   # fim borracha / inicio virola
    y2 = y1 + band_h     # fim virola / inicio corpo
    y3 = y2 + body_h     # fim corpo / inicio madeira
    y4 = y3 + wood_h     # fim madeira / inicio grafite
    y5 = y4 + tip_h      # ponta do grafite

    outline_w = max(1, canvas // 100)

    # --- 1. Borracha (retângulo com topo arredondado) ---
    r = pw * 0.35
    # Topo arredondado
    draw.rounded_rectangle(
        [left, y0, right, y1 + r],
        radius=r,
        fill=PINK_ERASER,
    )
    # Retângulo inferior para cobrir arredondamento embaixo
    draw.rectangle([left, y1 - 2, right, y1 + r], fill=PINK_ERASER)
    # Sombra esquerda da borracha
    shadow_w = pw * 0.2
    draw.rounded_rectangle(
        [left, y0, left + shadow_w, y1],
        radius=r // 2,
        fill=PINK_DARK,
    )

    # --- 2. Virola metálica (2 linhas) ---
    draw.rectangle([left, y1, right, y2], fill=ORANGE_BAND)
    # Listras na virola
    stripe_h = band_h / 3
    draw.rectangle([left, y1, right, y1 + stripe_h], fill=ORANGE_DARK)
    draw.rectangle([left, y2 - stripe_h, right, y2], fill=ORANGE_DARK)

    # --- 3. Corpo amarelo ---
    draw.rectangle([left, y2, right, y3], fill=YELLOW_BODY)
    # Sombra lateral esquerda
    draw.rectangle([left, y2, left + shadow_w, y3], fill=YELLOW_DARK)
    # Reflexo/brilho no meio-direita
    highlight_x = cx + pw * 0.1
    highlight_w = pw * 0.12
    draw.rectangle(
        [highlight_x, y2, highlight_x + highlight_w, y3],
        fill=(255, 235, 100, 255)
    )

    # --- 4. Ponta madeira (trapezóide → cone) ---
    # Triângulo: base=largura do lápis em y3, ponta em y5
    points_wood = [
        (left, y3),
        (right, y3),
        (cx + pw * 0.08, y4),
        (cx - pw * 0.08, y4),
    ]
    draw.polygon(points_wood, fill=TIP_WOOD)
    # Sombra esquerda da madeira
    points_wood_shadow = [
        (left, y3),
        (cx - pw * 0.1, y3),
        (cx - pw * 0.04, y4),
        (cx - pw * 0.08, y4),
    ]
    draw.polygon(points_wood_shadow, fill=TIP_DARK)

    # --- 5. Grafite (ponta) ---
    points_tip = [
        (cx - pw * 0.08, y4),
        (cx + pw * 0.08, y4),
        (cx, y5),
    ]
    draw.polygon(points_tip, fill=GRAPHITE)

    # --- Contorno geral ---
    # Contorno do corpo inteiro
    outline_points = [
        (left, y0 + r),  # topo esquerdo (abaixo do arredondamento)
        (left, y3),       # base do corpo esquerda
        (cx - pw * 0.08, y4),  # madeira esquerda
        (cx, y5),              # ponta
        (cx + pw * 0.08, y4),  # madeira direita
        (right, y3),     # base do corpo direita
        (right, y0 + r), # topo direito
    ]
    # Desenhar outline como linhas
    for i in range(len(outline_points) - 1):
        draw.line([outline_points[i], outline_points[i + 1]],
                  fill=OUTLINE, width=outline_w)

    # Arco do topo da borracha
    draw.arc([left, y0, right, y0 + r * 2], 180, 360,
             fill=OUTLINE, width=outline_w)

    # Linhas horizontais de separação
    draw.line([(left, y1), (right, y1)], fill=OUTLINE, width=outline_w)
    draw.line([(left, y2), (right, y2)], fill=OUTLINE, width=outline_w)

    # --- Rotacionar -45 graus ---
    img = img.rotate(35, resample=Image.BICUBIC, expand=False, center=(cx, cy))

    # Crop ao bounding box do conteúdo
    bbox = img.getbbox()
    if bbox:
        # Adicionar pequena margem
        margin = max(4, canvas // 40)
        bbox = (
            max(0, bbox[0] - margin),
            max(0, bbox[1] - margin),
            min(canvas, bbox[2] + margin),
            min(canvas, bbox[3] + margin),
        )
        img = img.crop(bbox)

    # Redimensionar para o tamanho final
    img = img.resize((size, size), Image.LANCZOS)
    return img


def create_icon():
    sizes = [16, 24, 32, 48, 64, 128, 256]
    images = [draw_pencil(s) for s in sizes]

    # Salvar como .ico multi-resolução
    # A imagem maior deve ser a base, menores como append
    images[-1].save(
        'icon.ico',
        format='ICO',
        sizes=[(s, s) for s in sizes],
        append_images=images[:-1]
    )
    print(f"icon.ico criado com {len(sizes)} resolucoes: {sizes}")


if __name__ == '__main__':
    create_icon()
