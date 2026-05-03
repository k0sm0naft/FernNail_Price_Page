import prices from '../data/prices.json';
import { getLang, t } from './i18n.js';
import { el, clear } from './dom.js';

export function fmtPriceNodes(item, lang = getLang()) {
  const currency = t('currency', lang);
  if (item.range) return [`${item.range} ${currency}`];
  if (item.from)  return [el('em', {}, t('from', lang)), ` ${item.price} ${currency}`];
  return [`${item.price} ${currency}`];
}

export function getEstimate(item) {
  return item.estimatePrice ?? item.price ?? 0;
}

export function getItemById(id) {
  for (const cat of prices.categories) {
    for (const item of cat.items) {
      if (item.id === id) return item;
    }
  }
  return null;
}

export function getCategories() {
  return prices.categories;
}

function renderInfoNode(tipKey, lang) {
  const tip = prices.tooltips?.[tipKey]?.[lang];
  if (!tip) return null;
  return el('span', { class: 'info', tabindex: '0' }, 'i',
    el('span', { class: 'info__tip' }, tip),
  );
}

export function renderServices(container) {
  if (!container) return;
  const lang = getLang();
  clear(container);
  for (const cat of prices.categories) {
    const block = el('div', { class: 'cat', dataset: { cat: cat.id } },
      el('h2', { class: 'cat__h' }, cat.labels[lang]),
      el('div', { class: 'card' },
        cat.items.map(item =>
          el('div', { class: 'row', dataset: { item: item.id } },
            el('div', { class: 'row__name' },
              item.labels[lang],
              item.info ? renderInfoNode(item.info, lang) : null,
            ),
            el('div', { class: 'row__price' }, ...fmtPriceNodes(item, lang)),
          ),
        ),
      ),
    );
    container.append(block);
  }
}
