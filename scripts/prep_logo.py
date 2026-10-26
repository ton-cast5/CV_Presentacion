from PIL import Image
import os

im = Image.open(r"d:\CV_PRESENTACION\logo.jpg").convert("RGBA")
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

print("bounds", minx, miny, maxx, maxy)
pad = 40
box = (
    max(0, minx - pad),
    max(0, miny - pad),
    min(w, maxx + pad),
    min(h, maxy + pad),
)
crop = im.crop(box)
print("crop", crop.size)

out = crop.copy()
px = out.load()
for y in range(out.size[1]):
    for x in range(out.size[0]):
        r, g, b, a = px[x, y]
        if r > 210 and g > 210 and b > 205:
            px[x, y] = (0, 0, 0, 0)
        elif g > 40 and g > r * 1.05 and g > b * 1.05:
            px[x, y] = (49, 92, 73, 255)

os.makedirs(r"d:\CV_PRESENTACION\public\brand", exist_ok=True)
crop.save(r"d:\CV_PRESENTACION\public\brand\logo-source.png")
out.save(r"d:\CV_PRESENTACION\public\brand\logo-mark.png")

for size in (192, 512, 180, 32, 48):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mark = out.copy()
    mark.thumbnail((int(size * 0.82), int(size * 0.82)), Image.Resampling.LANCZOS)
    ox = (size - mark.size[0]) // 2
    oy = (size - mark.size[1]) // 2
    canvas.paste(mark, (ox, oy), mark)
    canvas.save(rf"d:\CV_PRESENTACION\public\brand\icon-{size}.png")

print("done")
