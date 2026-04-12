import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const githubPages = process.env.ASTRO_GITHUB_PAGES === 'true';
const [ghOwner, ghRepo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');

const site =
  githubPages && ghOwner && ghRepo
    ? `https://${ghOwner}.github.io`
    : 'https://factura78.ru';

const base = githubPages && ghRepo ? `/${ghRepo}/` : '/';

export default defineConfig({
  site,
  base,
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
