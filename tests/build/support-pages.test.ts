import { beforeAll, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import { readFile } from 'node:fs/promises';

beforeAll(async () => {
  await execa('npm', ['run', 'build'], { stdio: 'inherit' });
});

describe('supporting pages build', () => {
  it('builds the core commercial support pages', async () => {
    const prices = await readFile('dist/ceny-i-sroki/index.html', 'utf8');
    const contacts = await readFile('dist/kontakty/index.html', 'utf8');
    const faq = await readFile('dist/faq/index.html', 'utf8');
    const notFound = await readFile('dist/404.html', 'utf8');

    expect(prices).toContain('Цены и сроки');
    expect(contacts).toContain('Контакты');
    expect(faq).toContain('Частые вопросы');
    expect(notFound).toContain('Страница не найдена');
  });
});
