import QRCode from 'qrcode';
import { clear } from './dom.js';

export async function renderQR(container, url, opts = {}) {
  if (!container) return;
  clear(container);
  const svgString = await QRCode.toString(url, {
    type: 'svg',
    margin: opts.margin ?? 0,
    errorCorrectionLevel: opts.errorCorrectionLevel || 'M',
    color: {
      dark: opts.dark || '#1a2e22',
      light: opts.light || '#ffffff',
    },
  });
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;
  if (svg.tagName.toLowerCase() === 'svg') {
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    container.append(svg);
  }
}

export function getPaymentUrl() {
  // From /print/ → strip the trailing path to derive the site root, then point to #pay
  const base = new URL('../', window.location.href);
  return `${base.href}#pay`;
}
