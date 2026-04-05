import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { readMarkdownScalar } from '../helpers/content-fixtures';

describe('service content', () => {
  it('contains all seven стартовых service pages in display order', async () => {
    const dirPath = path.resolve('src/content/services');
    const files = (await readdir(dirPath)).filter((file) => file.endsWith('.md'));
    const services = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        return {
          order: Number(await readMarkdownScalar(filePath, 'order')),
          slug: await readMarkdownScalar(filePath, 'slug'),
        };
      }),
    );
    const slugs = services.sort((a, b) => a.order - b.order).map((service) => service.slug);

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
