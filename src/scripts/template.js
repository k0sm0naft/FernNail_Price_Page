import '../styles/tokens.css';
import '../styles/export.css';

import prices from '../data/prices.json';
import { setLang, t } from './i18n.js';
import { fmtPriceNodes } from './services.js';
import { el, clear, $ } from './dom.js';

function renderRow(item, lang) {
  return el('div', { class: 'tpl__row', dataset: { item: item.id } },
    el('div', { class: 'tpl__row__name' }, item.labels[lang]),
    el('div', { class: 'tpl__row__price' }, ...fmtPriceNodes(item, lang)),
  );
}

function renderSingleCategory(catId, lang) {
  const cat = prices.categories.find(c => c.id === catId);
  if (!cat) return;
  const titleEl = $('#catTitle');
  const listEl = $('#items');
  if (titleEl) titleEl.textContent = cat.labels[lang];
  if (listEl) {
    clear(listEl);
    const card = el('div', { class: 'tpl__card' },
      cat.items.map(item => renderRow(item, lang)),
    );
    listEl.append(card);
  }
}

function renderAll(lang) {
  const titleEl = $('#catTitle');
  const listEl = $('#items');
  if (titleEl) titleEl.textContent = t('print.title');
  if (listEl) {
    clear(listEl);
    listEl.classList.add('tpl__list--all');
    for (const cat of prices.categories) {
      const group = el('div', { class: 'tpl__group', dataset: { cat: cat.id } },
        el('h2', { class: 'tpl__group__h' }, cat.labels[lang]),
        cat.items.map(item => renderRow(item, lang)),
      );
      listEl.append(group);
    }
  }
}

function renderFooter() {
  const foot = $('#footText');
  if (foot) foot.textContent = 'Fern nail art';
}

export function renderTemplate({ lang = 'ua', cat = 'all' } = {}) {
  setLang(lang);
  document.documentElement.lang = lang === 'ua' ? 'uk' : lang;
  if (cat === 'all') renderAll(lang);
  else renderSingleCategory(cat, lang);
  renderFooter();
  document.body.dataset.ready = '1';
}

const params = new URLSearchParams(window.location.search);
renderTemplate({
  lang: params.get('lang') || 'ua',
  cat: params.get('cat') || 'all',
});
