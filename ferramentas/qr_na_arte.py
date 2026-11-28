"""Coloca o QR real dentro do quadrado branco de uma arte pronta (ex.: gerada no ChatGPT).

Uso: python3 ferramentas/qr_na_arte.py ARTE.webp SAIDA_SEM_EXTENSAO [--qr-grande]
Gera SAIDA.png (300 dpi, 10x15 cm) e SAIDA.pdf. Detecta o quadrado branco e usa o espaço
livre abaixo do texto que estiver dentro dele.
"""
import sys, io, segno, numpy as np
from PIL import Image

URL = 'https://rendaextra.nexusjpc.com.br/?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra'
src, out = sys.argv[1], sys.argv[2]
COBRIR = '--qr-grande' in sys.argv   # cobre o texto dentro do quadrado e usa o quadrado inteiro
W, H = 1181, 1772                                   # 10 x 15 cm a 300 dpi
art = Image.open(src).convert('RGB').resize((W, H), Image.LANCZOS)
a = np.asarray(art).astype(int)
white = a.min(axis=2) > 232

cx = W // 2
# limites horizontais do quadrado na altura de 70%
row = white[int(H * .70)]
xs = np.where(row)[0]; xs = xs[(xs > W * .15) & (xs < W * .85)]
x0, x1 = xs.min(), xs.max()
# limites verticais na coluna central
col = white[:, x0 + 8]   # perto da borda interna, onde não há texto
y = int(H * .70)
while y > 0 and col[y - 1]: y -= 1
y0 = y
y = int(H * .70)
while y < H - 1 and col[y + 1]: y += 1
y1 = y
# texto dentro do quadrado: última linha "não branca" na metade de cima do quadrado
inner = ~white[y0:y1, x0 + 10:x1 - 10]
dark = inner.sum(axis=1)
txt = [i for i in range(int((y1 - y0) * .5)) if dark[i] > 2]
top = y0 + (max(txt) + 18 if txt and not COBRIR else 12)
margin = 14
side = min((x1 - x0) - 2 * margin, (y1 - margin) - top)
qx = int((x0 + x1) / 2 - side / 2); qy = int(top + ((y1 - margin) - top - side) / 2)

qr = segno.make(URL, error='q', micro=False)
n = qr.symbol_size(border=4)[0]
scale = max(1, side // n)
buf = io.BytesIO(); qr.save(buf, kind='png', scale=scale, border=4); buf.seek(0)
img = Image.open(buf).convert('RGB').resize((side, side), Image.NEAREST)
if COBRIR:
    art.paste((255, 255, 255), (x0 + 4, y0 + 4, x1 - 4, y1 - 4))
art.paste(img, (qx, qy))
art.save(out + '.png', dpi=(300, 300))
art.save(out + '.pdf', resolution=300)
mm = side / W * 100
print(f'{out}: quadrado x{x0}-{x1} y{y0}-{y1}; QR {side}px = {mm:.1f} mm ({mm / n:.2f} mm/módulo)')
