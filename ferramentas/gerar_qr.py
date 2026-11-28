"""Gera o QR único e a arte de impressão (10 x 15 cm).

Uso:  python3 ferramentas/gerar_qr.py [URL_DO_QR] [URL_CURTA_LEGIVEL]
Requer: pip install segno
Só imprima depois de a URL estar publicada com HTTPS e validada.
"""
import io, sys, pathlib, segno

URL = sys.argv[1] if len(sys.argv) > 1 else \
    'https://rendaextra.nexusjpc.com.br/?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra'
CURTA = sys.argv[2] if len(sys.argv) > 2 else 'rendaextra.nexusjpc.com.br'
OUT = pathlib.Path(__file__).resolve().parent.parent / 'material'
OUT.mkdir(exist_ok=True)

qr = segno.make(URL, error='q', micro=False)
n = qr.symbol_size(border=4)[0]
qr.save(OUT / 'renda-extra-ponto-qr.svg', border=4, scale=10, dark='#000', light='#fff', xmldecl=True, svgns=True)
qr.save(OUT / 'renda-extra-ponto-qr.png', border=4, scale=max(1, 1200 // n), dark='#000', light='#fff')

# Caminho do QR em unidades de módulo, para embutir na arte
buf = io.BytesIO()
qr.save(buf, kind='svg', border=4, scale=1, xmldecl=False, svgns=True, dark='#000', light='#fff', omitsize=True)
inner = buf.getvalue().decode()
inner = inner[inner.index('>') + 1: inner.rindex('</svg>')]

W, H = 100, 150          # mm
Q = 56                   # lado do QR em mm (inclui a margem branca de 4 módulos)
qx, qy = (W - Q) / 2, 72
s = Q / n
F = 'Arial Black, Arial, Helvetica, sans-serif'
F2 = 'Arial, Helvetica, sans-serif'

arte = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="0%" r="110%">
      <stop offset="0" stop-color="#1B2A3A"/><stop offset=".65" stop-color="#101820"/>
    </radialGradient>
  </defs>
  <rect width="{W}" height="{H}" fill="url(#bg)"/>
  <!-- selo -->
  <rect x="{W/2-34}" y="7" width="68" height="9" rx="4.5" fill="#4ADE80"/>
  <text x="{W/2}" y="13.3" font-family="{F2}" font-size="4.4" font-weight="700" fill="#052E16" text-anchor="middle">ESPERANDO O ÔNIBUS?</text>
  <!-- título -->
  <g font-family="{F}" font-weight="900" text-anchor="middle">
    <text x="{W/2}" y="28" font-size="9" fill="#F8FAFC">Aprenda a vender</text>
    <text x="{W/2}" y="38.5" font-size="9" fill="#F8FAFC">pela internet</text>
    <text x="{W/2}" y="49" font-size="8" fill="#F97316">usando só o celular</text>
  </g>
  <text x="{W/2}" y="56.5" font-family="{F2}" font-size="4.2" fill="#CBD5E1" text-anchor="middle">3 cursos práticos • veja em 1 minuto</text>
  <!-- moldura do QR -->
  <rect x="{qx-3}" y="{qy-9.5}" width="{Q+6}" height="{Q+12.5}" rx="4" fill="#F97316"/>
  <text x="{W/2}" y="{qy-3.6}" font-family="{F}" font-size="4.2" font-weight="900" fill="#1A0E05" text-anchor="middle">APONTE A CÂMERA AQUI ↓</text>
  <rect x="{qx}" y="{qy}" width="{Q}" height="{Q}" rx="1.5" fill="#fff"/>
  <g transform="translate({qx} {qy}) scale({s})">{inner}</g>
  <!-- rodapé -->
  <text x="{W/2}" y="{qy+Q+10}" font-family="{F2}" font-size="4.8" font-weight="700" fill="#F8FAFC" text-anchor="middle">{CURTA}</text>
  <text x="{W/2}" y="{H-4}" font-family="{F2}" font-size="2.9" fill="#94A3B8" text-anchor="middle">Cursos pagos de terceiros. Um projeto da Nexus JPC.</text>
</svg>
'''
(OUT / 'renda-extra-ponto-arte-10x15.svg').write_text(arte, encoding='utf-8')
print('QR:', URL, '| módulos:', n, '| versão:', qr.version, '| correção: Q')
