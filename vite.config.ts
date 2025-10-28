import { defineConfig } from 'vite';

import dsv from '@rollup/plugin-dsv';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), dsv()],
});
