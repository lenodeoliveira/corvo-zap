import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    alias: {
      src: resolve(__dirname, './src'),
      '@src': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
    include: [
      'tests/**/*.spec.ts'
    ],
    coverage: {
      include: ['src/modules/**/*.ts'],
      exclude: [
        'tests/**/*.ts',
        'src/modules/**/*.dto.ts',
        'src/modules/**/*-dto.ts',
        'src/modules/**/dto/**/*.ts',
        'src/modules/**/dtos/**/*.ts',
        'src/modules/**/*.interface.ts',
        'src/modules/**/repositories/**/*.ts',
        'src/modules/**/gateways/**/*.ts',
        'src/modules/**/*.spec.ts',
        'src/modules/**/*.module.ts',
        'src/modules/**/infra/database/typeorm/models/**/*.ts',
        'src/modules/**/infra/database/typeorm/config/**/*.ts',
        'src/modules/**/domain/tokens/**/*.ts',
        'src/modules/**/domain/@types/**/*.ts',
        'src/modules/**/database/typeorm/**/*.ts'
      ],
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@src': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
  },
  plugins: [swc.vite({ module: { type: 'es6' } })]
});
