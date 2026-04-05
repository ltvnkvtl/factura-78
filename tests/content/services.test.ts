import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';

describe('service content', () => {
  it('contains all seven стартовых service pages in display order', async () => {
    const services = await getCollection('services');
    const slugs = services.sort((a, b) => a.data.order - b.data.order).map((service) => service.data.slug);

    expect(slugs).toEqual([
      'remont-obuvi-spb',
      'chistka-obuvi-spb',
      'remont-krossovok-spb',
      'chistka-i-vosstanovlenie-krossovok-spb',
      'remont-sumok-spb',
      'restavratsiia-sumok-spb',
      'pokraska-i-vosstanovlenie-kozhi-spb',
    ]);
  });
});
