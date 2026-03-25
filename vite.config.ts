import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/osm-drone-simulator/',
  plugins: [solid(), tailwindcss()],
  server: {
    port: 3000,
    open: true,
  },
});
