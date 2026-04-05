import { describe, expect, it, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

vi.mock('../../src/lib/content', () => ({
  getPrimaryCtaHref: () => 'https://t.me/faktura78',
  getSiteSettings: async () => ({
    brandName: 'Faktura / 78',
    siteUrl: 'https://factura78.ru',
    city: 'Санкт-Петербург',
    defaultTheme: 'dark',
    primaryCtaLabel: 'Отправить фото',
    secondaryCtaLabel: 'Цены и сроки',
    scheduleText: ['Ежедневно, 11:00-20:00'],
    yandexMetrikaId: undefined,
    googleSiteVerification: undefined,
    yandexVerification: undefined,
  }),
}));

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
