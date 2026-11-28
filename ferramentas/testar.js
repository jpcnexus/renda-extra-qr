// Testes automáticos locais. Uso: node ferramentas/testar.js  (serve public/ na porta 8765)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'public');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f));
}).listen(8765);
const BASE = 'http://localhost:8765/';
const QRQ = '?utm_source=ponto_onibus&utm_medium=qr&utm_campaign=renda_extra';
const EXPECTED = {
  mov: 'https://kiwify.app/cdH39sl?afid=F64hqxZa',
  videos_ia: 'https://kiwify.app/m7fQ44k?afid=oQhdXQjt',
  shopee: 'https://kiwify.app/m0mn4dS?afid=ANrYBM87'
};
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASSOU ' : 'FALHOU ') + m); if (!c) fails++; };

(async () => {
  const b = await chromium.launch();
  async function page(opts = {}) {
    const ctx = await b.newContext({ viewport: { width: opts.w || 390, height: 800 } });
    const p = await ctx.newPage(); const errors = [], gtm = [], kiwi = [];
    await ctx.route(/kiwify\.app/, r => { kiwi.push(r.request().url()); r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }); });
    p.on('console', m => m.type() === 'error' && errors.push(m.text()));
    p.on('pageerror', e => errors.push(String(e)));
    await ctx.route(/googletagmanager|google-analytics/, r => { gtm.push(r.request().url()); r.fulfill({ status: 200, body: '' }); });
    await ctx.route(/fonts\.g/, r => r.abort());
    if (!opts.ga) await ctx.route('**/config.js', async r => {
      const body = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8').replace(/ga4MeasurementId: '[^']*'/, "ga4MeasurementId: ''");
      r.fulfill({ status: 200, contentType: 'text/javascript', body });
    });
    if (opts.ga) await ctx.route('**/config.js', async r => {
      const body = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8').replace(/ga4MeasurementId: '[^']*'/, "ga4MeasurementId: 'G-TESTE123'");
      r.fulfill({ status: 200, contentType: 'text/javascript', body });
    });
    return { ctx, p, errors, gtm, kiwi };
  }

  for (const w of [360, 390, 768]) {
    for (const q of ['', QRQ]) {
      const { ctx, p, errors, gtm } = await page({ w });
      await p.goto(BASE + q);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth);
      const links = await p.$$eval('a[data-offer-id]', a => a.map(x => [x.dataset.offerId, x.href, x.rel, x.target]));
      ok(sw <= w, `${w}px ${q ? 'com UTM' : 'sem UTM'}: sem rolagem horizontal (scrollWidth ${sw})`);
      ok(links.length === 3 && links.every(([id, h, rel]) => EXPECTED[id] === h && rel.includes('sponsored') && rel.includes('noopener')),
        `${w}px: 3 ofertas com links/afid exatos e rel="noopener sponsored" (${links.map(l => l[0]).join(',')})`);
      const imgs = await p.$$eval('.cover img', a => a.map(i => i.complete && i.naturalWidth > 0));
      ok(imgs.length === 3 && imgs.every(Boolean) || w !== 390, `${w}px: imagens oficiais carregadas`);
      ok(errors.length === 0, `${w}px: sem erros de console ${errors.join(' | ')}`);
      ok(gtm.length === 0, `${w}px: sem GA4 configurado, nenhuma requisição ao Google`);
      ok(await p.isHidden('#consent'), `${w}px: sem GA4 configurado, aviso de cookies oculto`);
      if (w === 390 && q) await p.screenshot({ path: path.join(__dirname, '..', 'relatorios', 'captura-390.png'), fullPage: true });
      await ctx.close();
    }
  }

  // GA4 com ID de teste: recusa
  { const { ctx, p, gtm } = await page({ ga: true });
    await p.goto(BASE + QRQ);
    ok(await p.isVisible('#consent'), 'GA4: aviso de consentimento aparece');
    ok(gtm.length === 0, 'GA4: tag não carrega antes do consentimento');
    await p.click('[data-consent="denied"]');
    await p.click('a[data-offer-id="mov"]').catch(() => {});
    await p.waitForTimeout(300);
    ok(gtm.length === 0, 'GA4: recusa não carrega tag analítico');
    ok(!(await p.evaluate(() => document.cookie)).includes('_ga'), 'GA4: recusa sem cookies _ga');
    await p.reload();
    ok(await p.isHidden('#consent') && gtm.length === 0, 'GA4: recusa lembrada após recarregar');
    ok(await p.isVisible('[data-open-consent]'), 'GA4: botão para rever a escolha disponível');
    await ctx.close(); }

  // GA4: aceite com QR
  { const { ctx, p, gtm, kiwi } = await page({ ga: true });
    await p.goto(BASE + QRQ);
    await p.click('[data-consent="granted"]');
    const ev = () => p.evaluate(() => (window.dataLayer || []).map(a => Array.from(a)).filter(a => a[0] === 'event').map(a => [a[1], a[2]]));
    ok(gtm.length === 1, 'GA4: aceite carrega a tag uma vez');
    let e = await ev();
    ok(e.filter(x => x[0] === 'qr_visit').length === 1, 'GA4: qr_visit disparado uma vez com UTMs do QR');
    const [popup] = await Promise.all([ctx.waitForEvent('page'), p.click('a[data-offer-id="shopee"]')]);
    e = await ev();
    const click = e.find(x => x[0] === 'offer_click');
    ok(click && click[1].offer_id === 'shopee' && click[1].traffic_origin === 'qr', 'GA4: offer_click com offer_id=shopee e traffic_origin=qr');
    await popup.waitForLoadState().catch(() => {});
    ok(kiwi[0] === EXPECTED.shopee, 'Clique abre exatamente o link de afiliado em nova aba, sem UTMs extras (' + kiwi[0] + ')');
    await p.reload();
    e = await ev();
    ok(e.filter(x => x[0] === 'qr_visit').length === 0, 'GA4: recarregar não duplica qr_visit');
    await ctx.close(); }

  // GA4: aceite sem QR
  { const { ctx, p } = await page({ ga: true });
    await p.goto(BASE);
    await p.click('[data-consent="granted"]');
    const e = await p.evaluate(() => (window.dataLayer || []).map(a => Array.from(a)).filter(a => a[0] === 'event').map(a => a[1]));
    ok(!e.includes('qr_visit'), 'GA4: acesso sem marcador não registra qr_visit');
    ok(!e.includes('purchase'), 'GA4: nenhum evento purchase');
    await ctx.close(); }

  // Privacidade
  { const { ctx, p, errors } = await page();
    const r = await p.goto(BASE + 'privacidade.html');
    ok(r.status() === 200 && errors.length === 0, 'privacidade.html abre sem erros');
    await ctx.close(); }

  await b.close(); srv.close();
  console.log(fails ? `\n${fails} FALHA(S)` : '\nTODOS OS TESTES PASSARAM');
  process.exit(fails ? 1 : 0);
})();
