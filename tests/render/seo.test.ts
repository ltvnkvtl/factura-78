import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import SeoHead from '../../src/components/SeoHead.astro';

describe('seo head', () => {
  it('renders canonical and JSON-LD when schema is provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SeoHead, {
      props: {
        title: 'Тестовая страница',
        description: 'Тестовое описание',
        canonical: 'https://factura78.ru/uslugi/remont-obuvi-spb/',
        schema: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Тестовая страница' }],
      },
    });

    expect(html).toContain('rel="canonical"');
    expect(html).toContain('application/ld+json');
  });
});
