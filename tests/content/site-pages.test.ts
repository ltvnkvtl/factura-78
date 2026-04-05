import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listFixtureIds, readJsonFixture } from '../helpers/content-fixtures';

describe('base content model', () => {
  it('loads settings, required site pages and the root district entry', async () => {
    const settings = await readJsonFixture<{ brandName: string; city: string }>(
      path.resolve('src/content/settings/site.json'),
    );
    const pages = await listFixtureIds(path.resolve('src/content/site-pages'), '.md');
    const district = await readJsonFixture<{ slug: string }>(
      path.resolve('src/content/districts/saint-petersburg.json'),
    );

    expect(settings.brandName).toBe('Faktura / 78');
    expect(settings.city).toBe('Санкт-Петербург');
    expect(pages).toEqual(expect.arrayContaining(['home', 'services', 'prices', 'delivery', 'contacts', 'faq']));
    expect(district.slug).toBe('saint-petersburg');
  });
});
