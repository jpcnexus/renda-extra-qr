/* Renda Extra no Ponto — renderização das ofertas, consentimento e GA4. */
(() => {
  'use strict';
  const cfg = window.SITE_CONFIG || {};
  const GA_ID = /^G-[A-Z0-9]+$/.test(cfg.ga4MeasurementId || '') ? cfg.ga4MeasurementId : '';
  const CONSENT_KEY = 'rep_consent_v1';

  const store = (area) => ({
    get(k) { try { return window[area].getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window[area].setItem(k, v); } catch (e) { /* bloqueado */ } },
    del(k) { try { window[area].removeItem(k); } catch (e) { /* bloqueado */ } }
  });
  const local = store('localStorage');
  const session = store('sessionStorage');

  /* ---------- Origem QR ---------- */
  const params = new URLSearchParams(location.search);
  const qr = cfg.qr || {};
  const cameFromQr = Object.keys(qr).length > 0 &&
    Object.keys(qr).every((k) => params.get(k) === qr[k]);
  if (cameFromQr) session.set('rep_from_qr', '1');
  const sessionFromQr = () => cameFromQr || session.get('rep_from_qr') === '1';

  /* ---------- Ofertas ---------- */
  const list = document.getElementById('offer-list');
  const offers = (window.OFFERS || [])
    .filter((o) => o && o.ativo && /^https:\/\//.test(o.link || ''))
    .map((o) => {
      const p = o.promo;
      const end = p && Date.parse(p.ate);
      if (!p || !end || Date.now() > end) return o;
      return Object.assign({}, o, {
        preco: p.preco || o.preco, precoDe: p.precoDe || '', parcelas: p.parcelas || '',
        selo: p.selo ? p.selo + (o.selo ? ' • ' + o.selo : '') : o.selo
      });
    })
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const el = (tag, attrs, children) => {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'text') node.textContent = v; else node.setAttribute(k, v);
    });
    (children || []).forEach((c) => c && node.appendChild(c));
    return node;
  };

  if (list) {
    list.textContent = '';
    const jump = document.getElementById('offer-jump');
    offers.forEach((o, idx) => {
      const titleId = 'title-' + o.id;
      const showPrice = o.precoConfirmado && o.preco;
      const items = (o.itens || []).slice(0, 3).map((p) => el('li', { text: p }));
      const priceBox = showPrice ? el('div', { class: 'price-box' }, [
        o.precoDe ? el('span', { class: 'price-from' }, [document.createTextNode('de '), el('s', { text: o.precoDe })]) : null,
        el('span', { class: 'price' }, [o.precoDe ? el('small', { text: 'por ' }) : null, document.createTextNode(o.preco)]),
        o.parcelas ? el('span', { class: 'price-split', text: o.parcelas }) : null
      ]) : null;
      const trust = ['Acesso imediato', o.garantia ? 'Garantia de 7 dias' : null, 'Compra segura pela Kiwify']
        .filter(Boolean).join(' • ');
      const card = el('article', { class: 'offer', id: o.id, 'aria-labelledby': titleId }, [
        o.imagem ? el('div', { class: 'cover' }, [
          el('img', { src: o.imagem, alt: 'Material oficial do curso ' + o.nome, decoding: 'async' })
        ]) : null,
        o.selo ? el('span', { class: 'badge', text: o.selo }) : null,
        el('h3', { id: titleId, text: o.nome }),
        o.gancho ? el('p', { class: 'hook', text: o.gancho }) : null,
        items.length ? el('ul', { class: 'items' }, items) : null,
        priceBox,
        el('a', {
          class: 'cta', href: o.link, target: '_blank', rel: 'noopener sponsored',
          'data-offer-id': o.id, 'data-offer-name': o.nome, text: (o.cta || 'Conhecer o curso') + ' →'
        }),
        el('p', { class: 'trust', text: trust })
      ]);
      list.appendChild(card);
      if (jump) {
        jump.appendChild(el('a', { href: '#' + o.id }, [
          el('span', { text: o.nome.split(' — ')[0] }),
          showPrice ? el('strong', { text: o.preco }) : null
        ]));
      }
    });
    const checked = document.getElementById('checked-at');
    if (checked && window.OFFERS_CHECKED_AT) {
      checked.textContent = 'Preços conferidos nas páginas oficiais em ' + window.OFFERS_CHECKED_AT +
        '. O valor final é sempre o mostrado na página de compra.';
    }
    if (!offers.length) list.appendChild(el('p', { text: 'Novos treinamentos em breve.' }));
  }

  /* ---------- GA4 com consentimento ---------- */
  let gaLoaded = false;
  function loadGa() {
    if (!GA_ID || gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    if (sessionFromQr() && session.get('rep_qr_sent') !== '1') {
      window.gtag('event', 'qr_visit', {
        utm_source: qr.utm_source, utm_medium: qr.utm_medium, utm_campaign: qr.utm_campaign
      });
      session.set('rep_qr_sent', '1');
    }
  }

  function clearGaCookies() {
    document.cookie.split(';').map((c) => c.split('=')[0].trim())
      .filter((n) => /^_ga/.test(n))
      .forEach((n) => {
        const host = location.hostname;
        const domains = ['', host, '.' + host, '.' + host.split('.').slice(-3).join('.')];
        domains.forEach((d) => {
          document.cookie = n + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
        });
      });
  }

  // Clique: nunca impede nem atrasa a navegação.
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest && ev.target.closest('a[data-offer-id]');
    if (!a || !gaLoaded || typeof window.gtag !== 'function') return;
    try {
      window.gtag('event', 'offer_click', {
        offer_id: a.dataset.offerId,
        offer_name: a.dataset.offerName,
        traffic_origin: sessionFromQr() ? 'qr' : 'outro',
        transport_type: 'beacon'
      });
    } catch (e) { /* Analytics indisponível: link segue normalmente */ }
  });

  const banner = document.getElementById('consent');
  const showBanner = (v) => { if (banner) banner.hidden = !v; };

  function setConsent(value) {
    local.set(CONSENT_KEY, value);
    showBanner(false);
    if (value === 'granted') loadGa();
    else if (gaLoaded) { clearGaCookies(); location.reload(); }
    else clearGaCookies();
  }

  if (GA_ID && banner) {
    const saved = local.get(CONSENT_KEY);
    if (saved === 'granted') loadGa();
    else if (saved !== 'denied') showBanner(true);
    banner.querySelector('[data-consent="granted"]').addEventListener('click', () => setConsent('granted'));
    banner.querySelector('[data-consent="denied"]').addEventListener('click', () => setConsent('denied'));
    document.querySelectorAll('[data-open-consent]').forEach((b) => {
      b.hidden = false;
      b.addEventListener('click', () => showBanner(true));
    });
  }
})();
