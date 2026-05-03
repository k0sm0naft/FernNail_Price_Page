import '../styles/tokens.css';
import '../styles/print.css';

import config from '../data/config.json';
import { setLang, getLang, renderI18n } from './i18n.js';
import { getCategories, fmtPriceNodes } from './services.js';
import { renderQR, getPaymentUrl } from './print-qr.js';
import { el, clear, $, $$ } from './dom.js';

function renderPaperServices(container) {
  if (!container) return;
  const lang = getLang();
  clear(container);
  for (const cat of getCategories()) {
    const block = el('div', { class: 'paper__cat', dataset: { cat: cat.id } },
      el('h2', { class: 'paper__cat__h' }, cat.labels[lang]),
      el('div', { class: 'paper__cat__list' },
        cat.items.map(item =>
          el('div', { class: 'paper__row', dataset: { item: item.id } },
            el('div', { class: 'paper__row__name' }, item.labels[lang]),
            el('div', { class: 'paper__row__price' }, ...fmtPriceNodes(item, lang)),
          ),
        ),
      ),
    );
    container.append(block);
  }
}

function renderConfig() {
  const lang = getLang();
  $$('[data-config]').forEach(node => {
    const key = node.dataset.config;
    const parts = key.split('.');
    const value = parts.reduce((o, k) => (o == null ? undefined : o[k]), config);
    if (value == null) return;
    if (typeof value === 'string') node.textContent = value;
    else if (typeof value === 'object' && value[lang]) node.textContent = value[lang];
  });
}

function syncLangPills() {
  const lang = getLang();
  $$('.ph__lang button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === lang));
}

function renderPayUrl() {
  const url = getPaymentUrl();
  const code = $('#qrUrl');
  if (code) code.textContent = url;
}

async function rerenderAll() {
  renderI18n();
  renderConfig();
  renderPaperServices($('#services'));
  renderPayUrl();
  syncLangPills();
  await renderQR($('#qr'), getPaymentUrl(), { width: 220, margin: 0, dark: '#1a2e22' });
}

function setupLangSwitching() {
  $$('.ph__lang button').forEach(b => b.addEventListener('click', () => {
    setLang(b.dataset.lang);
    rerenderAll();
  }));
}

function setupPrintBtn() {
  const btn = $('#printBtn');
  if (btn) btn.addEventListener('click', () => window.print());
}

const initialLang = getLang();
document.documentElement.lang = initialLang === 'ua' ? 'uk' : initialLang;
rerenderAll();
setupLangSwitching();
setupPrintBtn();
