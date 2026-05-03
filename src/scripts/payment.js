import config from '../data/config.json';
import { t } from './i18n.js';
import { $, $$ } from './dom.js';

const JAR_PLACEHOLDER = 'PLACEHOLDER_JAR_ID';
let toastTimer = null;

function dialog() {
  return $('#payModal');
}

function isMonoConfigured() {
  const jar = config.payment?.monobankJar;
  return jar && jar !== JAR_PLACEHOLDER;
}

function buildMonoUrl(amountUah) {
  const jar = config.payment?.monobankJar;
  if (!jar || jar === JAR_PLACEHOLDER) return null;
  const kop = Math.max(0, Math.round(Number(amountUah) || 0) * 100);
  const params = new URLSearchParams();
  if (kop > 0) params.set('a', String(kop));
  const qs = params.toString();
  return `https://send.monobank.ua/jar/${encodeURIComponent(jar)}${qs ? `?${qs}` : ''}`;
}

function refreshMonoLink() {
  const link = $('#payMono');
  if (!link) return;
  const amountInput = $('#payAmount');
  const amount = amountInput ? amountInput.value : '';
  const url = buildMonoUrl(amount);
  if (url) {
    link.setAttribute('href', url);
    link.removeAttribute('aria-disabled');
    link.classList.remove('pay__btn-disabled');
    link.removeAttribute('title');
  } else {
    link.setAttribute('href', '#');
    link.setAttribute('aria-disabled', 'true');
    link.classList.add('pay__btn-disabled');
    link.setAttribute('title', t('pay.noJar'));
  }
}

async function copyCard() {
  const card = config.payment?.card || '';
  const digits = card.replace(/\s/g, '');
  try {
    await navigator.clipboard.writeText(digits);
    showToast();
  } catch {
    // Fallback: select + execCommand (some older browsers / file://)
    const tmp = document.createElement('input');
    tmp.value = digits;
    document.body.appendChild(tmp);
    tmp.select();
    try { document.execCommand('copy'); showToast(); } catch {}
    document.body.removeChild(tmp);
  }
}

function showToast() {
  const toast = $('#payToast');
  if (!toast) return;
  toast.classList.add('is-on');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1800);
}

export function openPay(prefillAmount) {
  const dlg = dialog();
  if (!dlg) return;
  const amountInput = $('#payAmount');
  if (amountInput) {
    if (prefillAmount && prefillAmount > 0) amountInput.value = String(Math.round(prefillAmount));
  }
  refreshMonoLink();
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
}

export function closePay() {
  const dlg = dialog();
  if (!dlg) return;
  if (typeof dlg.close === 'function') dlg.close();
  else dlg.removeAttribute('open');
}

function setupCloseHandlers() {
  const dlg = dialog();
  if (!dlg) return;
  $$('[data-pay-close]', dlg).forEach(b => b.addEventListener('click', closePay));
  // Click backdrop to close
  dlg.addEventListener('click', e => {
    if (e.target === dlg) closePay();
  });
}

function setupOpenHandlers(getInitialAmount) {
  $$('[data-action="open-pay"]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    openPay(typeof getInitialAmount === 'function' ? getInitialAmount() : undefined);
  }));
}

function setupHashTrigger(getInitialAmount) {
  function checkHash() {
    if (window.location.hash === '#pay') {
      openPay(typeof getInitialAmount === 'function' ? getInitialAmount() : undefined);
    }
  }
  window.addEventListener('hashchange', checkHash);
  checkHash();
}

export function initPayment(getInitialAmount) {
  const dlg = dialog();
  if (!dlg) return;
  const copyBtn = $('#payCopy');
  if (copyBtn) copyBtn.addEventListener('click', copyCard);
  const amountInput = $('#payAmount');
  if (amountInput) amountInput.addEventListener('input', refreshMonoLink);
  setupCloseHandlers();
  setupOpenHandlers(getInitialAmount);
  setupHashTrigger(getInitialAmount);
  refreshMonoLink();
}
