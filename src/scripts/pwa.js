/* Register the service worker only in production so dev iteration
   isn't blocked by aggressive caching. */
export function registerPwa() {
  if (!import.meta.env.PROD) return;
  if (!('serviceWorker' in navigator)) return;
  const swUrl = `${import.meta.env.BASE_URL || '/'}sw.js`;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl, { scope: import.meta.env.BASE_URL || '/' })
      .catch(err => console.warn('SW registration failed:', err));
  });
}
