import ua from '../data/locales/ua.json';
import ru from '../data/locales/ru.json';
import en from '../data/locales/en.json';

const LOCALES = { ua, ru, en };
const SUPPORTED = ['ua', 'ru', 'en'];
const DEFAULT_LANG = 'ua';

let currentLang = loadInitialLang();

function loadInitialLang() {
  const stored = localStorage.getItem('fa.lang');
  if (stored && SUPPORTED.includes(stored)) return stored;
  const navLang = (navigator.language || '').slice(0, 2).toLowerCase();
  if (navLang === 'uk') return 'ua';
  if (SUPPORTED.includes(navLang)) return navLang;
  return DEFAULT_LANG;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem('fa.lang', lang);
  document.documentElement.lang = LOCALES[lang]._iso || lang;
}

export function t(key, lang = currentLang) {
  const dict = LOCALES[lang];
  const value = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
  return value ?? key;
}

export function renderI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const value = t(el.dataset.i18n);
    if (typeof value === 'string') el.textContent = value;
  });
}
