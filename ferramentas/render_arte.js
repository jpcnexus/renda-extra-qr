// Gera PDF e PNG da arte a partir do SVG. Uso: node ferramentas/render_arte.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = path.join(__dirname, '..', 'material');
  const fs = require('fs');
  const raw = fs.readFileSync(path.join(dir, 'renda-extra-ponto-arte-10x15.svg'), 'utf8').replace(/^<\?xml[^>]*>\s*/, '');
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent(`<style>@page{size:100mm 150mm;margin:0}html,body{margin:0}img{display:block;width:100mm;height:150mm}</style>${raw.replace(/width="100mm" height="150mm"/, 'style="display:block;width:100mm;height:150mm"')}`);
  await p.waitForLoadState('load');
  await p.pdf({ path: path.join(dir, 'renda-extra-ponto-arte-10x15.pdf'), width: '100mm', height: '150mm', printBackground: true });
  const p2 = await b.newPage({ viewport: { width: 1181, height: 1772 } }); // 300 dpi
  await p2.setContent(`<style>html,body{margin:0}img{display:block;width:1181px;height:1772px}</style>${raw.replace(/width="100mm" height="150mm"/, 'style="display:block;width:1181px;height:1772px"')}`);
  await p2.waitForLoadState('load');
  await p2.screenshot({ path: path.join(dir, 'renda-extra-ponto-arte-10x15.png') });
  await b.close();
})();
