import { beforeAll, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import { readFile } from 'node:fs/promises';

beforeAll(async () => {
  await execa('npm', ['run', 'build'], { stdio: 'inherit' });
});

describe('technical seo artifacts', () => {
  it('builds robots, sitemap and canonical output', async () => {
    const robots = await readFile('dist/robots.txt', 'utf8');
    const home = await readFile('dist/index.html', 'utf8');
    const service = await readFile('dist/uslugi/remont-obuvi-spb/index.html', 'utf8');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Sitemap: https://factura78.ru/sitemap-index.xml');
    expect(home).toContain('application/ld+json');
    expect(service).toContain('rel="canonical"');
  });
});
