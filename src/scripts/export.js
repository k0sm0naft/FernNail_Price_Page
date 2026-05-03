import * as htmlToImage from 'html-to-image';
import prices from '../data/prices.json';
import { getLang, t } from './i18n.js';
import { $, $$, el, clear } from './dom.js';

const FORMATS = {
  stories:  { w: 1080, h: 1920, page: 'ig-stories',  labelKey: 'export.fmtStories' },
  square:   { w: 1080, h: 1080, page: 'ig-square',   labelKey: 'export.fmtSquare' },
  portrait: { w: 1080, h: 1350, page: 'ig-portrait', labelKey: 'export.fmtPortrait' },
};

const LANGS = ['ua', 'ru', 'en'];

const state = {
  format: 'stories',
  lang: getLang(),
  cat: 'all',
};

function baseUrl() {
  return import.meta.env.BASE_URL || '/';
}

function staticPngUrl(format, lang, cat) {
  return `${baseUrl()}exports/instagram/${format}/${lang}/${cat}.png`;
}

async function renderViaIframe(format, lang, cat) {
  const f = FORMATS[format];
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = `position:fixed;left:-99999px;top:0;width:${f.w}px;height:${f.h}px;border:0;visibility:hidden;`;
  iframe.src = `${baseUrl()}templates/${f.page}.html?lang=${lang}&cat=${cat}`;
  document.body.appendChild(iframe);
  try {
    await new Promise((r, rej) => {
      iframe.addEventListener('load', r, { once: true });
      iframe.addEventListener('error', rej, { once: true });
    });
    await new Promise((resolve) => {
      const start = Date.now();
      const tick = () => {
        const ready = iframe.contentDocument?.body?.dataset?.ready === '1';
        if (ready) resolve();
        else if (Date.now() - start > 10000) resolve();
        else setTimeout(tick, 100);
      };
      tick();
    });
    if (iframe.contentDocument?.fonts) await iframe.contentDocument.fonts.ready;
    const imgs = iframe.contentDocument ? [...iframe.contentDocument.images] : [];
    await Promise.all(imgs.map(img => img.complete
      ? Promise.resolve()
      : new Promise(r => { img.onload = r; img.onerror = r; })));
    const node = iframe.contentDocument.body;
    return await htmlToImage.toPng(node, { width: f.w, height: f.h, pixelRatio: 1 });
  } finally {
    iframe.remove();
  }
}

async function loadOrRender(format, lang, cat) {
  const url = staticPngUrl(format, lang, cat);
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const ct = res.headers.get('content-type') || '';
    // Dev server SPA fallback returns 200 + text/html for missing routes.
    // Only accept the cached PNG when the response is actually image content.
    if (res.ok && ct.startsWith('image/')) return { kind: 'url', src: url };
  } catch { /* fallthrough */ }
  const dataUrl = await renderViaIframe(format, lang, cat);
  return { kind: 'data', src: dataUrl };
}

let activeRequestToken = 0;

async function refresh() {
  const status = $('#exportStatus');
  const preview = $('#exportPreview');
  const download = $('#exportDownload');
  if (!status || !preview || !download) return;

  const token = ++activeRequestToken;
  status.textContent = t('export.loading');
  status.classList.add('is-loading');
  status.classList.remove('is-error');
  download.setAttribute('aria-disabled', 'true');
  download.classList.add('pay__btn-disabled');
  preview.removeAttribute('src');
  preview.classList.add('is-loading');

  try {
    const result = await loadOrRender(state.format, state.lang, state.cat);
    if (token !== activeRequestToken) return; // newer request superseded this one
    preview.src = result.src;
    preview.classList.remove('is-loading');
    download.href = result.src;
    download.setAttribute('download', `fern-${state.format}-${state.lang}-${state.cat}.png`);
    download.removeAttribute('aria-disabled');
    download.classList.remove('pay__btn-disabled');
    status.textContent = result.kind === 'url' ? t('export.ready') : t('export.rendered');
    status.classList.remove('is-loading');
  } catch (e) {
    if (token !== activeRequestToken) return;
    console.warn('export failed:', e);
    status.textContent = t('export.failed');
    status.classList.remove('is-loading');
    status.classList.add('is-error');
    preview.classList.remove('is-loading');
  }
}

function fillFormatOptions() {
  const sel = $('#exportFormat');
  if (!sel) return;
  clear(sel);
  for (const [id, f] of Object.entries(FORMATS)) {
    sel.append(el('option', { value: id }, t(f.labelKey)));
  }
  sel.value = state.format;
}

function fillLangOptions() {
  const sel = $('#exportLang');
  if (!sel) return;
  clear(sel);
  for (const code of LANGS) {
    const label = t(`lang.${code}.name`);
    sel.append(el('option', { value: code }, label));
  }
  sel.value = state.lang;
}

function fillCatOptions() {
  const sel = $('#exportCat');
  if (!sel) return;
  clear(sel);
  sel.append(el('option', { value: 'all' }, t('export.catAll')));
  for (const cat of prices.categories) {
    sel.append(el('option', { value: cat.id }, cat.labels[state.lang]));
  }
  sel.value = state.cat;
}

export function rerenderExportLabels() {
  fillFormatOptions();
  fillLangOptions();
  fillCatOptions();
}

export function openExport() {
  const dlg = $('#exportModal');
  if (!dlg) return;
  rerenderExportLabels();
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
  refresh();
}

export function closeExport() {
  const dlg = $('#exportModal');
  if (!dlg) return;
  if (typeof dlg.close === 'function') dlg.close();
  else dlg.removeAttribute('open');
}

export function initExport() {
  const dlg = $('#exportModal');
  if (!dlg) return;

  $$('[data-action="open-export"]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    openExport();
  }));

  $$('[data-export-close]', dlg).forEach(b => b.addEventListener('click', closeExport));
  dlg.addEventListener('click', e => { if (e.target === dlg) closeExport(); });

  rerenderExportLabels();

  $('#exportFormat')?.addEventListener('change', e => { state.format = e.target.value; refresh(); });
  $('#exportLang')?.addEventListener('change', e => { state.lang = e.target.value; fillCatOptions(); refresh(); });
  $('#exportCat')?.addEventListener('change', e => { state.cat = e.target.value; refresh(); });
}
