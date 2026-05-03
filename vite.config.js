import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'src/index.html'),
        print: resolve(__dirname, 'src/print/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
