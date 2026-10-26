from PIL import Image
import os

ROOT = r"d:\CV_PRESENTACION"
OUT = os.path.join(ROOT, "public", "brand")
os.makedirs(OUT, exist_ok=True)

im = Image.open(os.path.join(ROOT, "logo.jpg")).convert("RGBA")
w, h = im.size
pixels = im.load()
minx, miny, maxx, maxy = w, h, 0, 0
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if g > 40 and g > r * 1.1 and g > b * 1.1 and (r + g + b) < 280:
            minx = min(minx, x)
            miny = min(miny, y)
            maxx = max(maxx, x)
            maxy = max(maxy, y)

pad = 40
box = (
    max(0, minx - pad),
    max(0, miny - pad),
    min(w, maxx + pad),
    min(h, maxy + pad),
)
crop = im.crop(box)

# Green mark on transparent
mark = crop.copy()
px = mark.load()
for y in range(mark.size[1]):
    for x in range(mark.size[0]):
        r, g, b, a = px[x, y]
        if r > 210 and g > 210 and b > 205:
            px[x, y] = (0, 0, 0, 0)
        elif g > 40 and g > r * 1.05 and g > b * 1.05:
            px[x, y] = (49, 92, 73, 255)

mark.save(os.path.join(OUT, "logo-mark.png"))

for size in (192, 512, 180, 32, 48):
    # White rounded square background
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    m = mark.copy()
    m.thumbnail((int(size * 0.72), int(size * 0.72)), Image.Resampling.LANCZOS)
    ox = (size - m.size[0]) // 2
    oy = (size - m.size[1]) // 2
    canvas.paste(m, (ox, oy), m)
    canvas.save(os.path.join(OUT, f"icon-{size}.png"), optimize=True)

print("icons regenerated with white background")
