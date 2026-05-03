#!/usr/bin/env node
/**
 * Generates Instagram-format PNGs for every (format × language × category)
 * combination — the category list is read from src/data/prices.json so adding
 * or removing a category in the JSON automatically reshapes the export set.
 *
 * Output: dist/exports/instagram/{format}/{lang}/{cat}.png
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const FORMATS = [
  { name: 'stories',  w: 1080, h: 1920, page: 'ig-stories' },
  { name: 'square',   w: 1080, h: 1080, page: 'ig-square' },
  { name: 'portrait', w: 1080, h: 1350, page: 'ig-portrait' },
];

const LANGS = ['ua', 'ru', 'en'];

async function main() {
  const pricesText = await fs.readFile(path.join(ROOT, 'src/data/prices.json'), 'utf8');
  const prices = JSON.parse(pricesText);
  const cats = ['all', ...prices.categories.filter(c => c.exportable !== false).map(c => c.id)];

  const total = FORMATS.length * LANGS.length * cats.length;
  console.log(`→ Exporting ${FORMATS.length} formats × ${LANGS.length} langs × ${cats.length} cats = ${total} PNGs`);
  console.log(`  cats: ${cats.join(', ')}`);

  // Force base to '/' for the export server even when CI sets VITE_BASE,
  // so template URLs are simple (the env var only matters for production
  // build path rewriting, which doesn't apply to the dev-mode server).
  const server = await createServer({
    configFile: path.join(ROOT, 'vite.config.js'),
    server: { port: 5175, host: '127.0.0.1' },
    base: '/',
    logLevel: 'warn',
  });
  await server.listen();
  const url0 = server.resolvedUrls?.local?.[0] || `http://127.0.0.1:5175/`;
  const baseUrl = url0.replace(/\/$/, '');
  console.log(`  server: ${baseUrl}`);

  const browser = await chromium.launch();
  let done = 0;

  try {
    for (const f of FORMATS) {
      for (const lang of LANGS) {
        for (const cat of cats) {
          const ctx = await browser.newContext({
            viewport: { width: f.w, height: f.h },
            deviceScaleFactor: 1,
          });
          const page = await ctx.newPage();
          const target = `${baseUrl}/templates/${f.page}.html?lang=${lang}&cat=${cat}`;
          await page.goto(target, { waitUntil: 'domcontentloaded' });
          await page.waitForFunction(() => document.body?.dataset?.ready === '1', { timeout: 15000 });
          await page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all([...document.images].map(img =>
              img.complete
                ? Promise.resolve()
                : new Promise(r => { img.onload = r; img.onerror = r; })
            ));
          });
          await page.waitForTimeout(80);

          const outDir = path.join(ROOT, 'dist/exports/instagram', f.name, lang);
          await fs.mkdir(outDir, { recursive: true });
          const outFile = path.join(outDir, `${cat}.png`);
          await page.screenshot({ path: outFile, type: 'png' });

          await ctx.close();
          done++;
          process.stdout.write(`\r  ${done}/${total}  ${f.name}/${lang}/${cat}`.padEnd(64));
        }
      }
    }
    process.stdout.write('\n');
    console.log('✓ All exports written to dist/exports/instagram/');
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch(e => {
  console.error('\n✗ export-ig failed:', e);
  process.exit(1);
});
