import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://factura78.ru',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
