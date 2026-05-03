import '../styles/tokens.css';
import '../styles/main.css';
import '../styles/payment.css';
import '../styles/export-ui.css';

import config from '../data/config.json';
import { setLang, getLang, renderI18n } from './i18n.js';
import { renderServices } from './services.js';
import { renderCalculator, getLastTotal } from './calculator.js';
import { initPayment } from './payment.js';
import { initExport, rerenderExportLabels } from './export.js';
import { registerPwa } from './pwa.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function renderConfig() {
  const lang = getLang();
  $$('[data-config]').forEach(el => {
    const key = el.dataset.config;
    const parts = key.split('.');
    const value = parts.reduce((o, k) => (o == null ? undefined : o[k]), config);
    if (value == null) return;
    if (typeof value === 'string') {
      el.textContent = value;
    } else if (typeof value === 'object' && value[lang]) {
      el.textContent = value[lang];
    }
  });
  $$('[data-config-href]').forEach(el => {
    const key = el.dataset.configHref;
    const parts = key.split('.');
    const value = parts.reduce((o, k) => (o == null ? undefined : o[k]), config);
    if (typeof value === 'string') el.setAttribute('href', value);
  });
}

function syncLangPills() {
  const lang = getLang();
  $$('.hd__lang button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === lang));
  $$('.lm__row').forEach(r => {
    const check = r.querySelector('.lm__check');
    if (check) check.classList.toggle('is-on', r.dataset.lang === lang);
  });
}

function rerenderAll() {
  renderI18n();
  renderConfig();
  renderServices($('#svcGrid'));
  renderCalculator($('#calcBody'));
  syncLangPills();
  rerenderExportLabels();
}

function setupLangSwitching() {
  $$('.hd__lang button').forEach(b => b.addEventListener('click', () => {
    setLang(b.dataset.lang);
    rerenderAll();
  }));
  $$('.lm__row').forEach(r => r.addEventListener('click', () => {
    setLang(r.dataset.lang);
    const lm = $('#lm');
    if (lm) lm.classList.remove('is-open');
    rerenderAll();
  }));
}

function setupSmoothScroll() {
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
  }));
}

function setupParallax() {
  const leaves = $$('.hl');
  if (!leaves.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      leaves.forEach(s => {
        const sp = parseFloat(s.dataset.pspeed || 0.06);
        if (!s.dataset.baseT) s.dataset.baseT = s.style.transform || '';
        s.style.transform = `${s.dataset.baseT} translateY(${(-y * sp).toFixed(1)}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

// Init document lang attribute on first load
const initialLang = getLang();
document.documentElement.lang = initialLang === 'ua' ? 'uk' : initialLang;

rerenderAll();
setupLangSwitching();
setupSmoothScroll();
setupParallax();
initPayment(() => getLastTotal());
initExport();
registerPwa();
