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
    offers.forEach((o) => {
      const titleId = 'title-' + o.id;
      const steps = (o.passos || []).slice(0, 3).map((p) => el('li', { text: p }));
      const card = el('article', { class: 'offer', id: o.id, 'aria-labelledby': titleId }, [
        o.imagem ? el('img', { class: 'cover', src: o.imagem, alt: '', width: '400', height: '225', loading: 'lazy', decoding: 'async' }) : null,
        el('span', { class: 'tag', text: o.perfil || '' }),
        el('h3', { id: titleId, text: o.nome }),
        el('p', { class: 'description', text: o.descricao || '' }),
        steps.length ? el('ol', { class: 'steps', 'aria-label': 'Como funciona' }, steps) : null,
        o.precoConfirmado && o.preco ? el('p', { class: 'price', text: o.preco }) : null,
        el('a', {
          class: 'cta', href: o.link, target: '_blank', rel: 'noopener sponsored',
          'data-offer-id': o.id, 'data-offer-name': o.nome, text: o.cta || 'Conhecer o treinamento'
        })
      ]);
      list.appendChild(card);
    });
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
