import { defineConfig } from 'vite';
import vituum from 'vituum';

import dsv from '@rollup/plugin-dsv';
import tailwindcss from '@tailwindcss/vite';
import twig from '@vituum/vite-plugin-twig';

export default defineConfig({
  plugins: [
    tailwindcss(),
    dsv(),
    vituum(),
    twig({
      root: './src',
    }),
  ],
});
