import { describe, expect, it } from 'vitest';
import { getCollection, getEntry } from 'astro:content';

describe('base content model', () => {
  it('loads settings, required site pages and the root district entry', async () => {
    const settings = await getEntry('settings', 'site');
    const pages = await getCollection('sitePages');
    const district = await getEntry('districts', 'saint-petersburg');

    expect(settings?.data.brandName).toBe('Faktura / 78');
    expect(settings?.data.city).toBe('Санкт-Петербург');
    expect(pages.map((page) => page.id)).toEqual(expect.arrayContaining(['home', 'services', 'prices', 'delivery', 'contacts', 'faq']));
    expect(district?.data.slug).toBe('saint-petersburg');
  });
});
