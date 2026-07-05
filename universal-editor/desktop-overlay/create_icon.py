"""
Generates icon.ico for Universal Editor Desktop.
Yellow cartoon pencil with pink eraser - classic style.
Requires Pillow: pip install Pillow
"""

from PIL import Image, ImageDraw


# Pencil colors
YELLOW_BODY = (255, 210, 50, 255)       # Yellow body
YELLOW_DARK = (220, 175, 30, 255)       # Body shadow
ORANGE_BAND = (210, 140, 40, 255)       # Metal band (ferrule)
ORANGE_DARK = (180, 110, 30, 255)       # Ferrule shadow
PINK_ERASER = (255, 160, 170, 255)      # Light pink eraser
PINK_DARK = (220, 120, 135, 255)        # Eraser shadow
TIP_WOOD = (225, 180, 120, 255)         # Wood tip
TIP_DARK = (190, 145, 90, 255)          # Wood shadow
GRAPHITE = (70, 70, 70, 255)            # Graphite
BLACK = (0, 0, 0, 255)
OUTLINE = (60, 50, 30, 255)             # Dark brown outline


def draw_pencil(size):
    """Draws a pencil tilted ~45 degrees at the given size"""
    # Create larger image for clean rotation, then resize
    canvas = max(256, size * 4)
    img = Image.new('RGBA', (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Pencil dimensions (proportional to canvas)
    cx, cy = canvas // 2, canvas // 2

    # The pencil is vertical, then we rotate -45 degrees
    pw = canvas * 0.18   # pencil width
    ph = canvas * 0.70   # total pencil height

    left = cx - pw / 2
    right = cx + pw / 2
    top = cy - ph / 2
    bottom = cy + ph / 2

    # Pencil sections (top to bottom):
    # 1. Eraser (rounded top)
    # 2. Metal ferrule
    # 3. Yellow body
    # 4. Wood tip (cone)
    # 5. Graphite

    eraser_h = ph * 0.12
    band_h = ph * 0.06
    body_h = ph * 0.55
    wood_h = ph * 0.18
    tip_h = ph * 0.09

    y0 = top  # eraser top
    y1 = y0 + eraser_h   # eraser end / ferrule start
    y2 = y1 + band_h     # ferrule end / body start
    y3 = y2 + body_h     # body end / wood start
    y4 = y3 + wood_h     # wood end / graphite start
    y5 = y4 + tip_h      # graphite tip

    outline_w = max(1, canvas // 100)

    # --- 1. Eraser (rectangle with rounded top) ---
    r = pw * 0.35
    # Rounded top
    draw.rounded_rectangle(
        [left, y0, right, y1 + r],
        radius=r,
        fill=PINK_ERASER,
    )
    # Bottom rectangle to cover rounding at the bottom
    draw.rectangle([left, y1 - 2, right, y1 + r], fill=PINK_ERASER)
    # Eraser left shadow
    shadow_w = pw * 0.2
    draw.rounded_rectangle(
        [left, y0, left + shadow_w, y1],
        radius=r // 2,
        fill=PINK_DARK,
    )

    # --- 2. Metal ferrule (2 stripes) ---
    draw.rectangle([left, y1, right, y2], fill=ORANGE_BAND)
    # Ferrule stripes
    stripe_h = band_h / 3
    draw.rectangle([left, y1, right, y1 + stripe_h], fill=ORANGE_DARK)
    draw.rectangle([left, y2 - stripe_h, right, y2], fill=ORANGE_DARK)

    # --- 3. Yellow body ---
    draw.rectangle([left, y2, right, y3], fill=YELLOW_BODY)
    # Left side shadow
    draw.rectangle([left, y2, left + shadow_w, y3], fill=YELLOW_DARK)
    # Reflection/highlight on center-right
    highlight_x = cx + pw * 0.1
    highlight_w = pw * 0.12
    draw.rectangle(
        [highlight_x, y2, highlight_x + highlight_w, y3],
        fill=(255, 235, 100, 255)
    )

    # --- 4. Wood tip (trapezoid -> cone) ---
    # Triangle: base=pencil width at y3, tip at y5
    points_wood = [
        (left, y3),
        (right, y3),
        (cx + pw * 0.08, y4),
        (cx - pw * 0.08, y4),
    ]
    draw.polygon(points_wood, fill=TIP_WOOD)
    # Wood left shadow
    points_wood_shadow = [
        (left, y3),
        (cx - pw * 0.1, y3),
        (cx - pw * 0.04, y4),
        (cx - pw * 0.08, y4),
    ]
    draw.polygon(points_wood_shadow, fill=TIP_DARK)

    # --- 5. Graphite (tip) ---
    points_tip = [
        (cx - pw * 0.08, y4),
        (cx + pw * 0.08, y4),
        (cx, y5),
    ]
    draw.polygon(points_tip, fill=GRAPHITE)

    # --- General outline ---
    # Full body outline
    outline_points = [
        (left, y0 + r),  # top left (below rounding)
        (left, y3),       # body base left
        (cx - pw * 0.08, y4),  # wood left
        (cx, y5),              # tip
        (cx + pw * 0.08, y4),  # wood right
        (right, y3),     # body base right
        (right, y0 + r), # top right
    ]
    # Draw outline as lines
    for i in range(len(outline_points) - 1):
        draw.line([outline_points[i], outline_points[i + 1]],
                  fill=OUTLINE, width=outline_w)

    # Eraser top arc
    draw.arc([left, y0, right, y0 + r * 2], 180, 360,
             fill=OUTLINE, width=outline_w)

    # Horizontal separation lines
    draw.line([(left, y1), (right, y1)], fill=OUTLINE, width=outline_w)
    draw.line([(left, y2), (right, y2)], fill=OUTLINE, width=outline_w)

    # --- Rotate -45 degrees ---
    img = img.rotate(35, resample=Image.BICUBIC, expand=False, center=(cx, cy))

    # Crop to content bounding box
    bbox = img.getbbox()
    if bbox:
        # Add small margin
        margin = max(4, canvas // 40)
        bbox = (
            max(0, bbox[0] - margin),
            max(0, bbox[1] - margin),
            min(canvas, bbox[2] + margin),
            min(canvas, bbox[3] + margin),
        )
        img = img.crop(bbox)

    # Resize to final size
    img = img.resize((size, size), Image.LANCZOS)
    return img


def create_icon():
    sizes = [16, 24, 32, 48, 64, 128, 256]
    images = [draw_pencil(s) for s in sizes]

    # Save as multi-resolution .ico
    # The largest image should be the base, smaller ones as append
    images[-1].save(
        'icon.ico',
        format='ICO',
        sizes=[(s, s) for s in sizes],
        append_images=images[:-1]
    )
    print(f"icon.ico created with {len(sizes)} resolutions: {sizes}")


if __name__ == '__main__':
    create_icon()
