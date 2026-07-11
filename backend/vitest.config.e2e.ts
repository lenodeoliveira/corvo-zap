import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    alias: {
      '@src': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
    include: ['tests/**/e2e/**/*.spec.ts'],
    coverage: {
      enabled: false,
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@src': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
  },
  plugins: []
  //plugins: [swc.vite({ module: { type: 'es6' } })],
});
