import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(['User-agent: *', 'Allow: /', 'Host: https://factura78.ru', 'Sitemap: https://factura78.ru/sitemap-index.xml'].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
