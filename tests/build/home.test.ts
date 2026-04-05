import { beforeAll, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import { readFile } from 'node:fs/promises';

beforeAll(async () => {
  await execa('npm', ['run', 'build'], { stdio: 'inherit' });
});

describe('homepage build', () => {
  it('renders the city-specific hero and primary CTA', async () => {
    const html = await readFile('dist/index.html', 'utf8');
    expect(html).toContain('Ремонт и реставрация сумок и обуви в Санкт-Петербурге');
    expect(html).toContain('Отправить фото');
  });
});
