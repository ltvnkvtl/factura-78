import { beforeAll, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import { readFile } from 'node:fs/promises';

beforeAll(async () => {
  await execa('npm', ['run', 'build'], { stdio: 'inherit' });
});

describe('service routes build', () => {
  it('builds the services index and first service page', async () => {
    const index = await readFile('dist/uslugi/index.html', 'utf8');
    const service = await readFile('dist/uslugi/remont-obuvi-spb/index.html', 'utf8');

    expect(index).toContain('Услуги мастерской Faktura / 78');
    expect(service).toContain('Ремонт обуви в Санкт-Петербурге');
  });
});
