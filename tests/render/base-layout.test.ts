import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

describe('base layout', () => {
  it('renders the shell, theme toggle and skip link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BaseLayout, {
      props: { title: 'Тестовая страница', description: 'Проверяем базовый layout' },
      slots: { default: '<section><h1>Контент</h1></section>' },
    });

    expect(html).toContain('Перейти к содержимому');
    expect(html).toContain('data-theme-toggle');
    expect(html).toContain('Faktura / 78');
  });
});
