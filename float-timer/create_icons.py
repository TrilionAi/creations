"""
Creates 3 icon options for Float Timer
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

def create_icon_1():
    """Icon 1: Minimalist circular timer"""
    size = 256
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = size // 2
    radius = size // 2 - 20

    # Dark background circle
    draw.ellipse([20, 20, size-20, size-20], fill=(40, 40, 45, 255))

    # Outer border
    draw.ellipse([15, 15, size-15, size-15], outline=(80, 80, 85, 255), width=3)

    # Green progress arc (75% complete)
    bbox = [25, 25, size-25, size-25]
    draw.arc(bbox, -90, 180, fill=(0, 200, 100, 255), width=12)

    # "00:00" text in the center
    try:
        font = ImageFont.truetype("consola.ttf", 48)
    except:
        font = ImageFont.load_default()

    text = "05:00"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    draw.text((center - text_width//2, center - text_height//2 - 5),
              text, fill=(255, 255, 255, 255), font=font)

    return img

def create_icon_2():
    """Icon 2: Stylized clock with hands"""
    size = 256
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = size // 2
    radius = size // 2 - 20

    # Background gradient (simulated with circles)
    for i in range(radius, 0, -2):
        alpha = int(255 * (i / radius))
        color = (30 + int(20 * i/radius), 30 + int(20 * i/radius), 35 + int(20 * i/radius), 255)
        draw.ellipse([center-i, center-i, center+i, center+i], fill=color)

    # Bright green border
    draw.ellipse([18, 18, size-18, size-18], outline=(0, 200, 100, 255), width=6)

    # Hour markers
    for i in range(12):
        angle = math.radians(i * 30 - 90)
        x1 = center + int((radius - 25) * math.cos(angle))
        y1 = center + int((radius - 25) * math.sin(angle))
        x2 = center + int((radius - 15) * math.cos(angle))
        y2 = center + int((radius - 15) * math.sin(angle))
        width = 4 if i % 3 == 0 else 2
        draw.line([x1, y1, x2, y2], fill=(150, 150, 150, 255), width=width)

    # Minute hand
    angle = math.radians(0 - 90)  # 12 o'clock
    x = center + int(60 * math.cos(angle))
    y = center + int(60 * math.sin(angle))
    draw.line([center, center, x, y], fill=(255, 255, 255, 255), width=6)

    # Second hand
    angle = math.radians(90 - 90)  # 3 o'clock (15 seconds)
    x = center + int(70 * math.cos(angle))
    y = center + int(70 * math.sin(angle))
    draw.line([center, center, x, y], fill=(0, 200, 100, 255), width=3)

    # Center
    draw.ellipse([center-8, center-8, center+8, center+8], fill=(255, 255, 255, 255))

    return img

def create_icon_3():
    """Icon 3: Modern timer with gradient"""
    size = 256
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = size // 2
    radius = size // 2 - 15

    # Dark background
    draw.ellipse([15, 15, size-15, size-15], fill=(25, 25, 30, 255))

    # Gray outer ring
    draw.ellipse([20, 20, size-20, size-20], outline=(60, 60, 65, 255), width=8)

    # Gradient progress arc (green -> yellow)
    # Draws multiple arcs to simulate gradient
    bbox = [22, 22, size-22, size-22]
    draw.arc(bbox, -90, 120, fill=(0, 200, 100, 255), width=8)
    draw.arc(bbox, 30, 90, fill=(100, 200, 50, 255), width=8)

    # Play symbol in the center
    play_size = 40
    points = [
        (center - play_size//3, center - play_size//2),
        (center - play_size//3, center + play_size//2),
        (center + play_size//2, center)
    ]
    draw.polygon(points, fill=(0, 200, 100, 255))

    return img

def save_icons():
    """Saves the 3 icons"""
    script_dir = os.path.dirname(os.path.abspath(__file__))

    icons = [
        (create_icon_1(), "icon_opcao1.png"),
        (create_icon_2(), "icon_opcao2.png"),
        (create_icon_3(), "icon_opcao3.png"),
    ]

    for img, filename in icons:
        # Save PNG
        png_path = os.path.join(script_dir, filename)
        img.save(png_path, 'PNG')
        print(f"Created: {filename}")

        # Create ICO version
        ico_filename = filename.replace('.png', '.ico')
        ico_path = os.path.join(script_dir, ico_filename)

        # Resize to multiple sizes (ICO)
        sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
        imgs_resized = [img.resize(s, Image.Resampling.LANCZOS) for s in sizes]
        imgs_resized[0].save(ico_path, format='ICO', sizes=[(s[0], s[1]) for s in sizes])
        print(f"Created: {ico_filename}")

if __name__ == '__main__':
    save_icons()
    print("\n3 icon options created!")
    print("Open the folder to see the options.")
