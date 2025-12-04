import { defineConfig } from 'vite';
import vituum from 'vituum';

import dsv from '@rollup/plugin-dsv';
import tailwindcss from '@tailwindcss/vite';
import posthtml from '@vituum/vite-plugin-posthtml';

export default defineConfig({
  plugins: [
    vituum(),
    posthtml({
      root: './src',
    }),
    tailwindcss(),
    dsv(),
  ],
});
