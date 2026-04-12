import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://factura78.ru',
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !page.includes('politika-konfidencialnosti'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
