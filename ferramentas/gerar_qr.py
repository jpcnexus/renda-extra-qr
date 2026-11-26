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
Q = 68                   # lado do QR em mm (com margem branca)
qx, qy = (W - Q) / 2, 56
s = Q / n

arte = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">
  <rect width="{W}" height="{H}" fill="#FFF3E3"/>
  <rect x="4" y="4" width="{W-8}" height="{H-8}" rx="5" fill="none" stroke="#F28C28" stroke-width="1.2"/>
  <g font-family="Arial, Helvetica, sans-serif" fill="#1F120C" text-anchor="middle">
    <text x="{W/2}" y="20" font-size="7.6" font-weight="700">ESPERANDO O ÔNIBUS?</text>
    <text x="{W/2}" y="31" font-size="5">Conheça 3 possibilidades de aprender</text>
    <text x="{W/2}" y="37.5" font-size="5">sobre renda extra pela internet.</text>
    <text x="{W/2}" y="49" font-size="4.6" font-weight="700" fill="#B85C0A">Aponte a câmera do celular e descubra.</text>
  </g>
  <rect x="{qx-1}" y="{qy-1}" width="{Q+2}" height="{Q+2}" rx="2" fill="#fff"/>
  <g transform="translate({qx} {qy}) scale({s})">{inner}</g>
  <g font-family="Arial, Helvetica, sans-serif" fill="#1F120C" text-anchor="middle">
    <text x="{W/2}" y="{qy+Q+8}" font-size="4.6" font-weight="700">{CURTA}</text>
    <text x="{W/2}" y="{H-11}" font-size="3.3" fill="#3A2218">Treinamentos pagos de terceiros. Um projeto da Nexus JPC.</text>
  </g>
</svg>
'''
(OUT / 'renda-extra-ponto-arte-10x15.svg').write_text(arte, encoding='utf-8')
print('QR:', URL, '| módulos:', n, '| versão:', qr.version, '| correção: Q')
