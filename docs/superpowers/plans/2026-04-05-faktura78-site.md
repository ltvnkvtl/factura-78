# Faktura / 78 Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать и запустить быстрый статический коммерческий сайт Faktura / 78 на Astro с типизированным контентом, SEO-ready страницами и понятным сценарием обращения из Санкт-Петербурга.

**Architecture:** Один Astro-проект в корне репозитория, где весь контент хранится в `src/content`, а страницы собираются статически через `getStaticPaths()` и `getCollection()`. Общие layout/components отвечают за тему, типографику, CTA и SEO, а Nginx раздает уже собранный `dist/` без серверной бизнес-логики. Для устойчивости к отсутствующим боевым контактам CTA всегда имеет fallback на `/kontakty/`, а production-деплой считается готовым только после заполнения контактных полей в `src/content/settings/site.json`.

**Tech Stack:** Astro 5, TypeScript, Astro Content Collections, Vitest, Node 22, Nginx, Schema.org JSON-LD, CSS variables.

---

## Scope Check

Эта спецификация остается в пределах одного подсистемного плана: MVP маркетингового сайта услуг. Контентная модель, фронтенд, SEO-артефакты и Nginx-конфиг остаются в одном документе, потому что они жестко связаны одним build output и одним способом публикации.

## Locked Assumptions

- Production URL в этом плане фиксируем как `https://factura78.ru`.
- Основной регион: `Санкт-Петербург`.
- До подтверждения боевых контактов primary CTA ведет на `/kontakty/`, а не ломает сценарий.
- Каналы аналитики остаются опциональными и подключаются только если ID реально добавлены в settings.

## File Structure

### Application Shell

- Create: `package.json` - scripts, dependencies и единая точка запуска.
- Create: `astro.config.mjs` - static output, trailing slash и sitemap integration.
- Create: `tsconfig.json` - strict TypeScript через Astro starter.
- Create: `src/env.d.ts` - Astro type hints.
- Create: `vitest.config.ts` - тестовый раннер поверх Astro Vite config.

### Content Layer

- Create: `src/content.config.ts` - все collection schemas.
- Create: `src/content/settings/site.json` - бренд, тема, schedule, optional contacts, optional analytics IDs.
- Create: `src/content/site-pages/home.md` - copy для главной.
- Create: `src/content/site-pages/services.md` - copy для страницы услуг.
- Create: `src/content/site-pages/prices.md` - copy для страницы цен и сроков.
- Create: `src/content/site-pages/delivery.md` - copy для страницы забора и доставки.
- Create: `src/content/site-pages/contacts.md` - copy для страницы контактов.
- Create: `src/content/site-pages/faq.md` - intro copy для FAQ.
- Create: `src/content/services/*.md` - 7 стартовых service entries.
- Create: `src/content/cases/*.md` - 3 стартовых кейса до/после.
- Create: `src/content/faq/*.json` - 6 FAQ entries.
- Create: `src/content/districts/saint-petersburg.json` - future-ready локальный entry.

### Shared Logic

- Create: `src/lib/content.ts` - helpers для settings, page entries, services, cases, faq.
- Create: `src/lib/seo.ts` - canonical, breadcrumbs schema, organization schema.

### UI Shell

- Create: `src/styles/tokens.css` - палитра и spacing tokens для dark/light theme.
- Create: `src/styles/global.css` - layout, typography, cards, buttons.
- Create: `src/layouts/BaseLayout.astro` - общий HTML shell.
- Create: `src/components/ThemeToggle.astro` - легкий theme switcher на inline JS.
- Create: `src/components/SiteHeader.astro` - nav и CTA.
- Create: `src/components/SiteFooter.astro` - локальные trust signals.
- Create: `src/components/SeoHead.astro` - meta tags и JSON-LD.
- Create: `src/components/PrimaryCta.astro` - primary and secondary CTA links.
- Create: `src/components/Breadcrumbs.astro` - хлебные крошки.
- Create: `src/components/Hero.astro` - hero block для home/service pages.
- Create: `src/components/ServiceCard.astro` - карточка услуги.
- Create: `src/components/CaseCard.astro` - карточка кейса.
- Create: `src/components/FaqList.astro` - список FAQ.
- Create: `src/components/Analytics.astro` - conditional Yandex/Google snippets.

### Routes

- Create: `src/pages/index.astro` - главная.
- Create: `src/pages/uslugi/index.astro` - индекс услуг.
- Create: `src/pages/uslugi/[slug].astro` - шаблон service landing page.
- Create: `src/pages/raboty/index.astro` - кейсы.
- Create: `src/pages/ceny-i-sroki.astro` - цены и сроки.
- Create: `src/pages/zabor-i-dostavka.astro` - доставка.
- Create: `src/pages/kontakty.astro` - контакты.
- Create: `src/pages/faq.astro` - FAQ.
- Create: `src/pages/robots.txt.ts` - динамический robots.
- Create: `src/pages/404.astro` - production-safe 404.

### Infra and Docs

- Create: `Dockerfile` - build + static serve через Nginx.
- Create: `nginx/factura78.conf` - static host config.
- Create: `README.md` - локальный запуск, build, deploy и launch checklist.

### Tests

- Create: `tests/build/home.test.ts` - smoke test главной.
- Create: `tests/content/site-pages.test.ts` - settings/site pages/district entry.
- Create: `tests/content/services.test.ts` - required service slugs and sort order.
- Create: `tests/content/social-proof.test.ts` - cases + faq.
- Create: `tests/render/base-layout.test.ts` - layout/theme shell.
- Create: `tests/render/seo.test.ts` - SEO helpers and meta rendering.
- Create: `tests/build/service-routes.test.ts` - built service pages.
- Create: `tests/build/support-pages.test.ts` - built commercial pages.
- Create: `tests/build/seo-artifacts.test.ts` - robots/sitemap/JSON-LD.
- Create: `tests/config/deploy.test.ts` - Dockerfile and Nginx config sanity.

### Task 1: Bootstrap Astro Workspace And Test Harness

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `vitest.config.ts`
- Create: `tests/build/home.test.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Scaffold the Astro app in the repo root**

Run:

```bash
npm create astro@latest . -- --template basics --install --no-git --yes
```

Expected: CLI finishes without prompts and prints that the project was created in the current directory.

- [ ] **Step 2: Install the test tooling and wire scripts**

Run:

```bash
npm install -D vitest execa @types/node
```

Update `package.json` scripts to:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Write the failing smoke test for the homepage**

Create `vitest.config.ts`:

```ts
/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 120000,
  },
});
```

Create `tests/build/home.test.ts`:

```ts
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
```

- [ ] **Step 4: Run the test to confirm it fails against the starter page**

Run:

```bash
npm test -- tests/build/home.test.ts
```

Expected: FAIL because the starter `index.astro` does not contain the Faktura / 78 hero copy.

- [ ] **Step 5: Replace the starter page with a minimal domain-specific homepage**

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://factura78.ru',
  output: 'static',
  trailingSlash: 'always',
});
```

Replace `src/pages/index.astro` with:

```astro
---
const title = 'Ремонт и реставрация сумок и обуви в Санкт-Петербурге | Faktura / 78';
const description =
  'Faktura / 78 помогает восстановить обувь и сумки в Санкт-Петербурге. Оценка по фото, понятные сроки и бережная работа с материалом.';
---

<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <main>
      <h1>Ремонт и реставрация сумок и обуви в Санкт-Петербурге</h1>
      <p>
        Локальная мастерская для тех, кому нужен понятный процесс, реальные кейсы и
        возможность быстро отправить фото на оценку.
      </p>
      <a href="/kontakty/">Отправить фото</a>
    </main>
  </body>
</html>
```

- [ ] **Step 6: Re-run the test and type check**

Run:

```bash
npm test -- tests/build/home.test.ts
npm run check
```

Expected: homepage smoke test PASS, `astro check` exits with code `0`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/env.d.ts src/pages/index.astro vitest.config.ts tests/build/home.test.ts
git commit -m "chore: bootstrap astro site and test harness"
```

### Task 2: Define Content Collections And Base Site Copy

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/settings/site.json`
- Create: `src/content/districts/saint-petersburg.json`
- Create: `src/content/site-pages/home.md`
- Create: `src/content/site-pages/services.md`
- Create: `src/content/site-pages/prices.md`
- Create: `src/content/site-pages/delivery.md`
- Create: `src/content/site-pages/contacts.md`
- Create: `src/content/site-pages/faq.md`
- Create: `tests/content/site-pages.test.ts`

- [ ] **Step 1: Write the failing test for settings and top-level page entries**

Create `tests/content/site-pages.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getCollection, getEntry } from 'astro:content';

describe('base content model', () => {
  it('loads settings, required site pages and the root district entry', async () => {
    const settings = await getEntry('settings', 'site');
    const pages = await getCollection('sitePages');
    const district = await getEntry('districts', 'saint-petersburg');

    expect(settings?.data.brandName).toBe('Faktura / 78');
    expect(settings?.data.city).toBe('Санкт-Петербург');
    expect(pages.map((page) => page.id)).toEqual(
      expect.arrayContaining(['home', 'services', 'prices', 'delivery', 'contacts', 'faq']),
    );
    expect(district?.data.slug).toBe('saint-petersburg');
  });
});
```

- [ ] **Step 2: Run the test to verify the collections are missing**

Run:

```bash
npm test -- tests/content/site-pages.test.ts
```

Expected: FAIL with errors about missing collection config or missing collection entries.

- [ ] **Step 3: Implement the collection schemas and initial content**

Create `src/content.config.ts`:

```ts
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    brandName: z.string(),
    siteUrl: z.string().url(),
    city: z.literal('Санкт-Петербург'),
    defaultTheme: z.enum(['dark', 'light']),
    primaryCtaLabel: z.string(),
    secondaryCtaLabel: z.string(),
    phoneE164: z.string().optional(),
    phoneDisplay: z.string().optional(),
    telegramUrl: z.string().url().optional(),
    whatsappUrl: z.string().url().optional(),
    addressText: z.string().optional(),
    scheduleText: z.array(z.string()).min(1),
    yandexMetrikaId: z.string().optional(),
    googleSiteVerification: z.string().optional(),
    yandexVerification: z.string().optional(),
  }),
});

const sitePages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site-pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    heroTitle: z.string().optional(),
    heroLead: z.string().optional(),
    order: z.number().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    excerpt: z.string(),
    order: z.number(),
    priceNote: z.string(),
    turnaround: z.string(),
    city: z.literal('Санкт-Петербург'),
    relatedFaq: z.array(z.string()).default([]),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    excerpt: z.string(),
    service: reference('services'),
    order: z.number(),
    finishedAt: z.string(),
    result: z.array(z.string()).min(2),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number(),
    services: z.array(z.string()).default([]),
  }),
});

const districts = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/districts' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    summary: z.string(),
    deliveryNote: z.string(),
  }),
});

export const collections = { settings, sitePages, services, cases, faq, districts };
```

Create `src/content/settings/site.json`:

```json
{
  "brandName": "Faktura / 78",
  "siteUrl": "https://factura78.ru",
  "city": "Санкт-Петербург",
  "defaultTheme": "dark",
  "primaryCtaLabel": "Отправить фото",
  "secondaryCtaLabel": "Посмотреть цены",
  "scheduleText": [
    "Пн-Сб: 11:00-20:00",
    "Вс: по договоренности"
  ]
}
```

Create `src/content/districts/saint-petersburg.json`:

```json
{
  "name": "Санкт-Петербург",
  "slug": "saint-petersburg",
  "summary": "Основной регион продвижения и обслуживания сайта Faktura / 78.",
  "deliveryNote": "Забор и доставка по Санкт-Петербургу согласуются отдельно по фото и адресу."
}
```

Create `src/content/site-pages/home.md`:

```md
---
title: Главная
description: Главная страница Faktura / 78.
seoTitle: Ремонт и реставрация сумок и обуви в Санкт-Петербурге | Faktura / 78
seoDescription: Ремонт обуви, кроссовок и сумок в Санкт-Петербурге. Оценка по фото, понятные сроки и бережная работа с материалом.
heroTitle: Ремонт и реставрация сумок и обуви в Санкт-Петербурге
heroLead: Помогаем вернуть вещам аккуратный вид и рабочее состояние без сложных форм и лишнего пафоса.
---
Faktura / 78 - локальная мастерская для тех, кому важны качество работы, предсказуемый процесс и реальные кейсы до и после.

## Почему обращаются к нам

- Ориентир по стоимости и срокам можно получить по фото.
- Работаем и с обувью, и с сумками одинаково внимательно.
- На сайте сразу видны коммерческие страницы, цены и сценарий обращения.
- Забор и доставка по Санкт-Петербургу встроены в клиентский путь, а не спрятаны в конце.
```

Create `src/content/site-pages/services.md`:

```md
---
title: Услуги
description: Все ключевые услуги Faktura / 78.
seoTitle: Услуги по ремонту обуви и сумок в Санкт-Петербурге | Faktura / 78
seoDescription: Ремонт обуви, кроссовок, сумок, покраска и восстановление кожи в Санкт-Петербурге.
heroTitle: Услуги мастерской Faktura / 78
heroLead: Начинаем с сильных коммерческих посадочных страниц, которые отвечают на конкретный запрос пользователя.
order: 10
---
Эта страница собирает стартовые направления, которые уже закрывают широкий локальный спрос: обувь, кроссовки, сумки и восстановление кожи.
```

Create `src/content/site-pages/prices.md`:

```md
---
title: Цены и сроки
description: Ориентиры по цене и срокам.
seoTitle: Цены и сроки на ремонт обуви и сумок | Faktura / 78
seoDescription: Ориентиры по цене и срокам на ремонт обуви, кроссовок, сумок и восстановление кожи в Санкт-Петербурге.
heroTitle: Цены и сроки
heroLead: Публикуем не абстрактные обещания, а рабочие диапазоны. Финальная стоимость всегда уточняется после фото или осмотра.
order: 20
---
На старте важнее честно показывать вилки и логику оценки, чем обещать точную цену без понимания состояния вещи.
```

Create `src/content/site-pages/delivery.md`:

```md
---
title: Забор и доставка
description: Как работает забор и доставка по Санкт-Петербургу.
seoTitle: Забор и доставка по Санкт-Петербургу | Faktura / 78
seoDescription: Забор и доставка сумок и обуви по Санкт-Петербургу для ремонта, чистки и восстановления.
heroTitle: Забор и доставка по Санкт-Петербургу
heroLead: Если неудобно приехать в мастерскую, можно согласовать передачу изделия по фото и адресу.
order: 30
---
Сценарий доставки не должен выглядеть как отдельная сложная услуга. Это просто удобный способ передать вещь, когда нужен ремонт или чистка без лишних поездок.
```

Create `src/content/site-pages/contacts.md`:

```md
---
title: Контакты
description: Как связаться с Faktura / 78.
seoTitle: Контакты мастерской Faktura / 78 | Санкт-Петербург
seoDescription: Контакты, график работы и способы связи с мастерской Faktura / 78 в Санкт-Петербурге.
heroTitle: Контакты
heroLead: На этой странице всегда должны быть понятные способы связаться, отправить фото и договориться о передаче вещи.
order: 40
---
Даже если часть production-контактов появится чуть позже, сама структура страницы должна быть готова сразу: телефон, мессенджеры, адрес, график и пояснение по доставке.
```

Create `src/content/site-pages/faq.md`:

```md
---
title: FAQ
description: Частые вопросы по ремонту, чистке и реставрации.
seoTitle: FAQ по ремонту обуви и сумок | Faktura / 78
seoDescription: Ответы на частые вопросы о сроках, оценке по фото, доставке и уходе за обувью и сумками.
heroTitle: Частые вопросы
heroLead: FAQ закрывает возражения до обращения и разгружает коммерческие страницы от длинных повторяющихся блоков.
order: 50
---
На старте нужны короткие, коммерчески полезные ответы: как быстро называем цену, что нужно для оценки, можно ли отправить фото и как работает забор по городу.
```

- [ ] **Step 4: Re-run the content test**

Run:

```bash
npm test -- tests/content/site-pages.test.ts
```

Expected: PASS, entries load through `astro:content` without schema errors.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/settings/site.json src/content/districts/saint-petersburg.json src/content/site-pages tests/content/site-pages.test.ts
git commit -m "feat: define typed content model and base site copy"
```

### Task 3: Seed The Service Pages Content

**Files:**
- Create: `src/content/services/remont-obuvi-spb.md`
- Create: `src/content/services/chistka-obuvi-spb.md`
- Create: `src/content/services/remont-krossovok-spb.md`
- Create: `src/content/services/chistka-i-vosstanovlenie-krossovok-spb.md`
- Create: `src/content/services/remont-sumok-spb.md`
- Create: `src/content/services/restavratsiia-sumok-spb.md`
- Create: `src/content/services/pokraska-i-vosstanovlenie-kozhi-spb.md`
- Create: `tests/content/services.test.ts`

- [ ] **Step 1: Write the failing test for required service slugs**

Create `tests/content/services.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';

describe('service content', () => {
  it('contains all seven стартовых service pages in display order', async () => {
    const services = await getCollection('services');
    const slugs = services
      .sort((a, b) => a.data.order - b.data.order)
      .map((service) => service.data.slug);

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
```

- [ ] **Step 2: Run the service test to verify it fails**

Run:

```bash
npm test -- tests/content/services.test.ts
```

Expected: FAIL because the `services` collection is still empty.

- [ ] **Step 3: Add the seven service entries with real commercial copy**

Create `src/content/services/remont-obuvi-spb.md`:

```md
---
title: Ремонт обуви в Санкт-Петербурге
slug: remont-obuvi-spb
description: Замена набоек, профилактика, ремонт швов и молний, укрепление подошвы и пятки.
seoTitle: Ремонт обуви в Санкт-Петербурге | Faktura / 78
seoDescription: Ремонт обуви в Санкт-Петербурге: набойки, подошва, швы, молнии, укрепление пятки. Оценка по фото и понятные сроки.
excerpt: Восстанавливаем повседневную и сезонную обувь аккуратно, без потери удобства и формы.
order: 10
priceNote: От 1 500 ₽ за базовые работы; точная цена после фото или осмотра.
turnaround: Обычно 1-5 дней.
city: Санкт-Петербург
relatedFaq:
  - kak-otpravit-foto
  - kak-bystro-nazvaete-tsenu
---
## Что делаем

- Меняем набойки и профилактику.
- Восстанавливаем швы, молнии и ослабленные участки.
- Усиливаем пятку, подошву и проблемные зоны.

## Когда стоит обращаться

Если пара вам по-прежнему удобна и нравится по посадке, чаще спокойнее и выгоднее восстановить ее, чем искать замену.
```

Create `src/content/services/chistka-obuvi-spb.md`:

```md
---
title: Чистка обуви в Санкт-Петербурге
slug: chistka-obuvi-spb
description: Бережная чистка кожи, замши, нубука и комбинированных материалов.
seoTitle: Чистка обуви в Санкт-Петербурге | Faktura / 78
seoDescription: Профессиональная чистка обуви в Санкт-Петербурге: кожа, замша, нубук, восстановление свежего внешнего вида без агрессивной химии.
excerpt: Убираем городские загрязнения и возвращаем аккуратный вид без искусственного блеска.
order: 20
priceNote: От 1 800 ₽, итог зависит от материала и глубины загрязнений.
turnaround: Обычно 2-4 дня.
city: Санкт-Петербург
relatedFaq:
  - kak-otpravit-foto
  - est-li-zabor-i-dostavka
---
## Что делаем

- Чистим кожу, замшу и нубук.
- Снимаем солевые следы и уличной налет.
- Выравниваем внешний вид пары перед сезоном.

## Для кого подходит

Это страница для тех, кто хочет вернуть обуви ухоженный вид без полной реставрации и без риска испортить материал домашними средствами.
```

Create `src/content/services/remont-krossovok-spb.md`:

```md
---
title: Ремонт кроссовок в Санкт-Петербурге
slug: remont-krossovok-spb
description: Работаем с подошвой, швами, задниками, сеткой и повседневным износом кроссовок.
seoTitle: Ремонт кроссовок в Санкт-Петербурге | Faktura / 78
seoDescription: Ремонт кроссовок в Санкт-Петербурге: подошва, задник, швы, сетка, укрепление проблемных зон и понятные сроки.
excerpt: Помогаем продлить жизнь любимой паре, когда кроссовки уже разношены и менять их не хочется.
order: 30
priceNote: От 1 700 ₽ за типовые работы, сложные случаи оцениваем отдельно.
turnaround: Обычно 2-6 дней.
city: Санкт-Петербург
relatedFaq:
  - kak-bystro-nazvaete-tsenu
  - skolko-zanimaet-rabota
---
## Что делаем

- Восстанавливаем задник и внутренние проблемные зоны.
- Работаем со швами, отклейкой и деформацией.
- Укрепляем пару для повседневной носки.

## Практический эффект

Смысл ремонта кроссовок не в косметике ради фото, а в том, чтобы пара снова выдерживала городскую нагрузку и выглядела собранно.
```

Create `src/content/services/chistka-i-vosstanovlenie-krossovok-spb.md`:

```md
---
title: Чистка и восстановление кроссовок в Санкт-Петербурге
slug: chistka-i-vosstanovlenie-krossovok-spb
description: Глубокая чистка, работа с белой подошвой, освежение цвета и аккуратная сборка внешнего вида пары.
seoTitle: Чистка и восстановление кроссовок в Санкт-Петербурге | Faktura / 78
seoDescription: Чистка и восстановление кроссовок в Санкт-Петербурге: белая подошва, ткань, кожа, освежение цвета, оценка по фото.
excerpt: Возвращаем кроссовкам чистый и собранный вид без ощущения перекрашенной вещи.
order: 40
priceNote: От 2 200 ₽, точный объем определяем после фото пары.
turnaround: Обычно 3-6 дней.
city: Санкт-Петербург
relatedFaq:
  - mozhno-li-otpravit-foto-v-messendzhere
  - est-li-zabor-i-dostavka
---
## Что делаем

- Глубоко чистим верх и подошву.
- Снимаем следы сезонной носки и городскую серость.
- Освежаем цвет там, где это действительно нужно.

## Когда эта услуга уместна

Когда пара в целом жива, но визуально устала: появились серость, пятна, потеря яркости и ощущение неухоженности.
```

Create `src/content/services/remont-sumok-spb.md`:

```md
---
title: Ремонт сумок в Санкт-Петербурге
slug: remont-sumok-spb
description: Работаем с ручками, молниями, швами, кантами и нагруженными узлами сумки.
seoTitle: Ремонт сумок в Санкт-Петербурге | Faktura / 78
seoDescription: Ремонт сумок в Санкт-Петербурге: ручки, молнии, швы, канты, усиление нагруженных участков и понятная оценка по фото.
excerpt: Восстанавливаем рабочие элементы сумки так, чтобы вещью снова было удобно пользоваться каждый день.
order: 50
priceNote: От 2 000 ₽ за типовые работы; финальная цена зависит от конструкции изделия.
turnaround: Обычно 2-7 дней.
city: Санкт-Петербург
relatedFaq:
  - kak-bystro-nazvaete-tsenu
  - skolko-zanimaet-rabota
---
## Что делаем

- Меняем или усиливаем ручки и крепления.
- Работаем с молниями, швами и деформированными зонами.
- Сохраняем утилитарность и аккуратный внешний вид.

## Что важно клиенту

Эта страница должна обещать не абстрактную реставрацию, а понятное возвращение сумки в нормальный повседневный режим использования.
```

Create `src/content/services/restavratsiia-sumok-spb.md`:

```md
---
title: Реставрация сумок в Санкт-Петербурге
slug: restavratsiia-sumok-spb
description: Восстановление цвета, фактуры и общего вида сумки с опорой на реальное состояние изделия.
seoTitle: Реставрация сумок в Санкт-Петербурге | Faktura / 78
seoDescription: Реставрация сумок в Санкт-Петербурге: восстановление цвета, поверхности и общего внешнего вида без luxury-подачи и пустых обещаний.
excerpt: Подходит для сумок, которые хочется снова носить регулярно, а не просто аккуратно убрать на полку.
order: 60
priceNote: От 3 500 ₽, стоимость зависит от площади и состояния поверхности.
turnaround: Обычно 4-8 дней.
city: Санкт-Петербург
relatedFaq:
  - mozhno-li-otpravit-foto-v-messendzhere
  - skolko-zanimaet-rabota
---
## Что делаем

- Выравниваем тон и восстанавливаем общий вид поверхности.
- Работаем с потертостями и визуальной усталостью изделия.
- Помогаем вернуть сумке ощущение ухоженной вещи, которой снова приятно пользоваться.

## Подход

Важно говорить честно: не каждую сумку нужно делать как новую. Иногда цель - вернуть достойный внешний вид и уверенно носить вещь дальше.
```

Create `src/content/services/pokraska-i-vosstanovlenie-kozhi-spb.md`:

```md
---
title: Покраска и восстановление кожи в Санкт-Петербурге
slug: pokraska-i-vosstanovlenie-kozhi-spb
description: Работаем с кожаными поверхностями обуви и сумок, когда нужно вернуть ровный цвет и аккуратную фактуру.
seoTitle: Покраска и восстановление кожи в Санкт-Петербурге | Faktura / 78
seoDescription: Покраска и восстановление кожи в Санкт-Петербурге для обуви и сумок: выравнивание цвета, работа с потертостями и поверхностью.
excerpt: Эта страница закрывает запросы на восстановление цвета, когда вещь функциональна, но визуально сильно устала.
order: 70
priceNote: От 2 800 ₽, итоговая цена зависит от площади и глубины повреждений.
turnaround: Обычно 3-7 дней.
city: Санкт-Петербург
relatedFaq:
  - kak-bystro-nazvaete-tsenu
  - est-li-zabor-i-dostavka
---
## Что делаем

- Освежаем и выравниваем цвет кожаной поверхности.
- Работаем с потертостями, матовостью и визуальными перепадами.
- Согласуем ожидаемый результат по фото до запуска в работу.

## Зачем нужна отдельная страница

Это самостоятельный коммерческий кластер под Санкт-Петербург, а не второстепенный абзац внутри других услуг.
```

- [ ] **Step 4: Re-run the service test**

Run:

```bash
npm test -- tests/content/services.test.ts
```

Expected: PASS with all seven slug values in the fixed display order.

- [ ] **Step 5: Commit**

```bash
git add src/content/services tests/content/services.test.ts
git commit -m "feat: add service landing content"
```

### Task 4: Seed Cases And FAQ Content

**Files:**
- Create: `src/content/cases/krossovki-glubokaia-chistka.md`
- Create: `src/content/cases/kozhanaia-sumka-vosstanovlenie-ruchki.md`
- Create: `src/content/cases/obuv-posle-sezonnogo-remonta.md`
- Create: `src/content/faq/kak-bystro-nazvaete-tsenu.json`
- Create: `src/content/faq/kak-otpravit-foto.json`
- Create: `src/content/faq/mozhno-li-otpravit-foto-v-messendzhere.json`
- Create: `src/content/faq/est-li-zabor-i-dostavka.json`
- Create: `src/content/faq/skolko-zanimaet-rabota.json`
- Create: `src/content/faq/chto-nuzhno-dlia-otsenki.json`
- Create: `tests/content/social-proof.test.ts`

- [ ] **Step 1: Write the failing test for cases and FAQ**

Create `tests/content/social-proof.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';

describe('cases and faq content', () => {
  it('loads the first social-proof entries for the launch version', async () => {
    const cases = await getCollection('cases');
    const faq = await getCollection('faq');

    expect(cases).toHaveLength(3);
    expect(faq.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        'kak-bystro-nazvaete-tsenu',
        'kak-otpravit-foto',
        'mozhno-li-otpravit-foto-v-messendzhere',
        'est-li-zabor-i-dostavka',
        'skolko-zanimaet-rabota',
        'chto-nuzhno-dlia-otsenki',
      ]),
    );
  });
});
```

- [ ] **Step 2: Run the content test to verify it fails**

Run:

```bash
npm test -- tests/content/social-proof.test.ts
```

Expected: FAIL because `cases` and `faq` entries do not exist yet.

- [ ] **Step 3: Add the initial cases and FAQ entries**

Create `src/content/cases/krossovki-glubokaia-chistka.md`:

```md
---
title: Белые кроссовки после глубокой чистки и восстановления тона
slug: krossovki-glubokaia-chistka
seoTitle: Кейс: чистка и восстановление кроссовок | Faktura / 78
seoDescription: Реальный кейс по чистке и восстановлению белых кроссовок в Санкт-Петербурге.
excerpt: Убрали въевшуюся городскую грязь, выровняли тон и вернули паре аккуратный вид.
service: chistka-i-vosstanovlenie-krossovok-spb
order: 10
finishedAt: 2026-03-20
result:
  - Убрали серый налет и старые следы улицы.
  - Вернули ровный цвет и чистое общее впечатление.
---
Пара пришла после активного зимнего сезона. Основная задача была не сделать кроссовки "как из коробки", а вернуть им собранный и чистый вид без агрессивного вмешательства.
```

Create `src/content/cases/kozhanaia-sumka-vosstanovlenie-ruchki.md`:

```md
---
title: Кожаная сумка после восстановления ручки и нагруженных швов
slug: kozhanaia-sumka-vosstanovlenie-ruchki
seoTitle: Кейс: ремонт сумки и ручек | Faktura / 78
seoDescription: Реальный кейс по ремонту кожаной сумки в Санкт-Петербурге: ручка, швы и повседневная нагрузка.
excerpt: Вернули сумке рабочее состояние без ощущения грубого вмешательства в конструкцию.
service: remont-sumok-spb
order: 20
finishedAt: 2026-03-24
result:
  - Усилили ручку и проблемные швы.
  - Вернули сумке уверенную повседневную носку.
---
В этом кейсе важен утилитарный результат: клиент снова может ежедневно пользоваться сумкой, не переживая за нагруженные зоны.
```

Create `src/content/cases/obuv-posle-sezonnogo-remonta.md`:

```md
---
title: Демисезонная обувь после профилактики, швов и восстановления пятки
slug: obuv-posle-sezonnogo-remonta
seoTitle: Кейс: сезонный ремонт обуви | Faktura / 78
seoDescription: Реальный кейс по сезонному ремонту обуви в Санкт-Петербурге: пятка, швы и профилактика.
excerpt: Сохранили удобную пару и вернули ей рабочее состояние перед сезоном.
service: remont-obuvi-spb
order: 30
finishedAt: 2026-03-28
result:
  - Укрепили пятку и проблемные швы.
  - Подготовили пару к следующему сезону без срочной замены.
---
Кейс показывает типичную причину обращения: обувь еще нравится владельцу по посадке и виду, но отдельные зоны уже требуют нормального ремонта.
```

Create `src/content/faq/kak-bystro-nazvaete-tsenu.json`:

```json
{
  "question": "Как быстро вы называете цену?",
  "answer": "Ориентир по стоимости даем после фото в день обращения. Финальную цену фиксируем после осмотра изделия, если по фото не видно всех нюансов.",
  "order": 10,
  "services": ["remont-obuvi-spb", "remont-sumok-spb", "pokraska-i-vosstanovlenie-kozhi-spb"]
}
```

Create `src/content/faq/kak-otpravit-foto.json`:

```json
{
  "question": "Что нужно для оценки по фото?",
  "answer": "Достаточно прислать 3-4 фото с общим видом и крупным планом проблемных зон. Если есть сомнения по материалу или масштабу работ, мы скажем, что еще снять.",
  "order": 20,
  "services": ["remont-obuvi-spb", "chistka-obuvi-spb", "remont-krossovok-spb"]
}
```

Create `src/content/faq/mozhno-li-otpravit-foto-v-messendzhere.json`:

```json
{
  "question": "Можно ли отправить фото в мессенджере?",
  "answer": "Да. Это базовый сценарий обращения: присылаете фото, получаете ориентир по срокам и стоимости, после чего договариваемся о передаче вещи.",
  "order": 30,
  "services": ["chistka-i-vosstanovlenie-krossovok-spb", "restavratsiia-sumok-spb"]
}
```

Create `src/content/faq/est-li-zabor-i-dostavka.json`:

```json
{
  "question": "Есть ли забор и доставка по Санкт-Петербургу?",
  "answer": "Да, по городу можно согласовать забор и доставку. Удобнее всего сначала прислать фото и адрес, чтобы сразу понять формат передачи вещи.",
  "order": 40,
  "services": ["chistka-obuvi-spb", "chistka-i-vosstanovlenie-krossovok-spb", "pokraska-i-vosstanovlenie-kozhi-spb"]
}
```

Create `src/content/faq/skolko-zanimaet-rabota.json`:

```json
{
  "question": "Сколько обычно занимает работа?",
  "answer": "Большинство типовых работ укладывается в 1-7 дней. Если случай сложный или требует нескольких этапов, срок согласуем до запуска в работу.",
  "order": 50,
  "services": ["remont-krossovok-spb", "remont-sumok-spb", "restavratsiia-sumok-spb"]
}
```

Create `src/content/faq/chto-nuzhno-dlia-otsenki.json`:

```json
{
  "question": "Нужно ли сразу привозить вещь в мастерскую?",
  "answer": "Нет, на старте удобнее прислать фото. Это экономит время и вам, и мастерской, а очный осмотр нужен только когда по фото не хватает деталей для точной оценки.",
  "order": 60,
  "services": ["remont-obuvi-spb", "remont-sumok-spb", "chistka-i-vosstanovlenie-krossovok-spb"]
}
```

- [ ] **Step 4: Re-run the social proof test**

Run:

```bash
npm test -- tests/content/social-proof.test.ts
```

Expected: PASS with `3` case entries and `6` FAQ entries.

- [ ] **Step 5: Commit**

```bash
git add src/content/cases src/content/faq tests/content/social-proof.test.ts
git commit -m "feat: add launch cases and faq content"
```

### Task 5: Build The Design System, Layout, And Content Helpers

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/lib/content.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `tests/render/base-layout.test.ts`

- [ ] **Step 1: Write the failing render test for the global layout shell**

Create `tests/render/base-layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

describe('base layout', () => {
  it('renders the shell, theme toggle and skip link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BaseLayout, {
      props: {
        title: 'Тестовая страница',
        description: 'Проверяем базовый layout',
      },
      slots: {
        default: '<section><h1>Контент</h1></section>',
      },
    });

    expect(html).toContain('Перейти к содержимому');
    expect(html).toContain('data-theme-toggle');
    expect(html).toContain('Faktura / 78');
  });
});
```

- [ ] **Step 2: Run the render test to verify it fails**

Run:

```bash
npm test -- tests/render/base-layout.test.ts
```

Expected: FAIL because `BaseLayout.astro` and related components do not exist yet.

- [ ] **Step 3: Implement tokens, helper functions and the layout shell**

Create `src/styles/tokens.css`:

```css
:root {
  --font-sans: "Manrope", "Inter", system-ui, sans-serif;
  --color-bg: #171717;
  --color-surface: #222222;
  --color-text: #f4efe8;
  --color-muted: #b9b0a3;
  --color-accent: #c7a36a;
  --color-border: rgba(255, 255, 255, 0.12);
  --container: 72rem;
  --radius: 1.25rem;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --space-2xl: 4rem;
}

:root[data-theme='light'] {
  --color-bg: #f5f1ea;
  --color-surface: #ffffff;
  --color-text: #1d1b19;
  --color-muted: #6d655c;
  --color-accent: #1d1b19;
  --color-border: rgba(29, 27, 25, 0.1);
}
```

Create `src/styles/global.css`:

```css
@import './tokens.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  color-scheme: dark;
  background: var(--color-bg);
}

html[data-theme='light'] {
  color-scheme: light;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background:
    radial-gradient(circle at top left, rgba(199, 163, 106, 0.16), transparent 28rem),
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 24rem),
    var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

a {
  color: inherit;
}

.skip-link {
  position: absolute;
  left: -9999px;
}

.skip-link:focus {
  left: 1rem;
  top: 1rem;
  z-index: 20;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border-radius: 999px;
}

.container {
  width: min(calc(100% - 2rem), var(--container));
  margin: 0 auto;
}

.section {
  padding: var(--space-2xl) 0;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-lg);
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.85rem 1.1rem;
  text-decoration: none;
  font-weight: 600;
}

.button-primary {
  background: var(--color-accent);
  color: var(--color-bg);
}

.button-secondary {
  border: 1px solid var(--color-border);
}

.grid {
  display: grid;
  gap: var(--space-lg);
}
```

Create `src/lib/content.ts`:

```ts
import { getCollection, getEntry } from 'astro:content';

export async function getSiteSettings() {
  const settings = await getEntry('settings', 'site');

  if (!settings) {
    throw new Error('Missing settings/site.json');
  }

  return settings.data;
}

export async function getSitePage(id: 'home' | 'services' | 'prices' | 'delivery' | 'contacts' | 'faq') {
  const page = await getEntry('sitePages', id);

  if (!page) {
    throw new Error(`Missing site page: ${id}`);
  }

  return page;
}

export async function getOrderedServices() {
  const services = await getCollection('services');
  return services.sort((a, b) => a.data.order - b.data.order);
}

export async function getOrderedCases() {
  const cases = await getCollection('cases');
  return cases.sort((a, b) => a.data.order - b.data.order);
}

export async function getOrderedFaq() {
  const faq = await getCollection('faq');
  return faq.sort((a, b) => a.data.order - b.data.order);
}

export function getPrimaryCtaHref(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  if (settings.telegramUrl) return settings.telegramUrl;
  if (settings.whatsappUrl) return settings.whatsappUrl;
  if (settings.phoneE164) return `tel:${settings.phoneE164}`;
  return '/kontakty/';
}
```

Create `src/components/ThemeToggle.astro`:

```astro
<button class="button button-secondary" type="button" aria-label="Переключить тему" data-theme-toggle>
  <span data-theme-label>Светлая тема</span>
</button>

<script is:inline>
  const storageKey = 'factura78-theme';
  const root = document.documentElement;
  const label = document.querySelector('[data-theme-label]');
  const button = document.querySelector('[data-theme-toggle]');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (label) {
      label.textContent = theme === 'dark' ? 'Светлая тема' : 'Темная тема';
    }
  };

  const saved = localStorage.getItem(storageKey);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved ?? preferred);

  button?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(storageKey, next);
    applyTheme(next);
  });
</script>
```

Create `src/components/SiteHeader.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';

const { brandName, primaryHref, primaryLabel } = Astro.props;
---

<header class="section">
  <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
    <a href="/" style="font-size:1.125rem;font-weight:700;text-decoration:none;">{brandName}</a>
    <nav style="display:flex;gap:1rem;flex-wrap:wrap;">
      <a href="/uslugi/">Услуги</a>
      <a href="/raboty/">Работы</a>
      <a href="/ceny-i-sroki/">Цены и сроки</a>
      <a href="/kontakty/">Контакты</a>
    </nav>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
      <ThemeToggle />
      <a class="button button-primary" href={primaryHref}>{primaryLabel}</a>
    </div>
  </div>
</header>
```

Create `src/components/SiteFooter.astro`:

```astro
---
const { brandName, city, scheduleText } = Astro.props;
---

<footer class="section">
  <div class="container card" style="display:grid;gap:0.75rem;">
    <strong>{brandName}</strong>
    <span>{city}</span>
    <span>Сайт услуг без лишнего шума: ремонт, чистка, реставрация, доставка по городу.</span>
    <span>{scheduleText.join(' · ')}</span>
  </div>
</footer>
```

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
import { getPrimaryCtaHref, getSiteSettings } from '../lib/content';

const { title, description } = Astro.props;
const settings = await getSiteSettings();
const primaryHref = getPrimaryCtaHref(settings);
---

<!doctype html>
<html lang="ru" data-theme={settings.defaultTheme}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <a class="skip-link" href="#content">Перейти к содержимому</a>
    <SiteHeader brandName={settings.brandName} primaryHref={primaryHref} primaryLabel={settings.primaryCtaLabel} />
    <main id="content">
      <slot />
    </main>
    <SiteFooter brandName={settings.brandName} city={settings.city} scheduleText={settings.scheduleText} />
  </body>
</html>
```

- [ ] **Step 4: Re-run the layout test**

Run:

```bash
npm test -- tests/render/base-layout.test.ts
```

Expected: PASS with header, theme toggle and skip link present in rendered HTML.

- [ ] **Step 5: Commit**

```bash
git add src/styles src/lib/content.ts src/layouts/BaseLayout.astro src/components/ThemeToggle.astro src/components/SiteHeader.astro src/components/SiteFooter.astro tests/render/base-layout.test.ts
git commit -m "feat: add design tokens and global layout shell"
```

### Task 6: Add SEO Utilities And Shared Commercial Components

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/components/SeoHead.astro`
- Create: `src/components/PrimaryCta.astro`
- Create: `src/components/Breadcrumbs.astro`
- Create: `src/components/Hero.astro`
- Create: `tests/render/seo.test.ts`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write the failing test for SEO rendering**

Create `tests/render/seo.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import SeoHead from '../../src/components/SeoHead.astro';

describe('seo head', () => {
  it('renders canonical and JSON-LD when schema is provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SeoHead, {
      props: {
        title: 'Тестовая страница',
        description: 'Тестовое описание',
        canonical: 'https://factura78.ru/uslugi/remont-obuvi-spb/',
        schema: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Тестовая страница' }],
      },
    });

    expect(html).toContain('rel="canonical"');
    expect(html).toContain('application/ld+json');
  });
});
```

- [ ] **Step 2: Run the SEO test to verify it fails**

Run:

```bash
npm test -- tests/render/seo.test.ts
```

Expected: FAIL because the SEO component and helpers do not exist yet.

- [ ] **Step 3: Implement SEO helpers and shared CTA components**

Create `src/lib/seo.ts`:

```ts
type BreadcrumbItem = {
  name: string;
  href: string;
};

export function canonicalFromPath(siteUrl: string, pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };
}

export function buildOrganizationSchema(settings: {
  brandName: string;
  siteUrl: string;
  city: string;
  phoneDisplay?: string;
  addressText?: string;
  scheduleText: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.brandName,
    url: settings.siteUrl,
    areaServed: settings.city,
    telephone: settings.phoneDisplay,
    openingHours: settings.scheduleText,
    address: settings.addressText
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.addressText,
          addressLocality: settings.city,
        }
      : undefined,
  };
}
```

Create `src/components/SeoHead.astro`:

```astro
---
const { title, description, canonical, schema = [] } = Astro.props;
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
{
  schema.length > 0 && (
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  )
}
```

Create `src/components/PrimaryCta.astro`:

```astro
---
const { href, label, variant = 'primary' } = Astro.props;
const className = variant === 'primary' ? 'button button-primary' : 'button button-secondary';
---

<a class={className} href={href}>{label}</a>
```

Create `src/components/Breadcrumbs.astro`:

```astro
---
const { items } = Astro.props;
---

<nav aria-label="Хлебные крошки" class="container" style="padding-top:1rem;">
  <ol style="display:flex;gap:0.5rem;list-style:none;padding:0;margin:0;flex-wrap:wrap;">
    {
      items.map((item, index) => (
        <li>
          {index < items.length - 1 ? <a href={item.href}>{item.name}</a> : <span>{item.name}</span>}
        </li>
      ))
    }
  </ol>
</nav>
```

Create `src/components/Hero.astro`:

```astro
---
import PrimaryCta from './PrimaryCta.astro';

const { eyebrow, title, lead, primaryHref, primaryLabel, secondaryHref, secondaryLabel } = Astro.props;
---

<section class="section">
  <div class="container card" style="display:grid;gap:1rem;">
    {eyebrow && <span style="color:var(--color-muted);text-transform:uppercase;letter-spacing:0.08em;">{eyebrow}</span>}
    <h1 style="margin:0;font-size:clamp(2.25rem,5vw,4rem);line-height:1.05;">{title}</h1>
    <p style="margin:0;font-size:1.125rem;max-width:52rem;">{lead}</p>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
      <PrimaryCta href={primaryHref} label={primaryLabel} />
      <PrimaryCta href={secondaryHref} label={secondaryLabel} variant="secondary" />
    </div>
  </div>
</section>
```

Update `src/layouts/BaseLayout.astro` head block to:

```astro
---
import '../styles/global.css';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
import SeoHead from '../components/SeoHead.astro';
import { buildOrganizationSchema, canonicalFromPath } from '../lib/seo';
import { getPrimaryCtaHref, getSiteSettings } from '../lib/content';

const { title, description, pathname = '/', schema = [] } = Astro.props;
const settings = await getSiteSettings();
const primaryHref = getPrimaryCtaHref(settings);
const canonical = canonicalFromPath(settings.siteUrl, pathname);
const fullSchema = [buildOrganizationSchema(settings), ...schema];
---

<!doctype html>
<html lang="ru" data-theme={settings.defaultTheme}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <SeoHead title={title} description={description} canonical={canonical} schema={fullSchema} />
  </head>
  <body>
    <a class="skip-link" href="#content">Перейти к содержимому</a>
    <SiteHeader brandName={settings.brandName} primaryHref={primaryHref} primaryLabel={settings.primaryCtaLabel} />
    <main id="content">
      <slot />
    </main>
    <SiteFooter brandName={settings.brandName} city={settings.city} scheduleText={settings.scheduleText} />
  </body>
</html>
```

- [ ] **Step 4: Re-run the SEO test**

Run:

```bash
npm test -- tests/render/seo.test.ts
```

Expected: PASS with canonical link and JSON-LD script in the rendered HTML.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/components/SeoHead.astro src/components/PrimaryCta.astro src/components/Breadcrumbs.astro src/components/Hero.astro src/layouts/BaseLayout.astro tests/render/seo.test.ts
git commit -m "feat: add seo helpers and shared commercial components"
```

### Task 7: Build Home, Services Index, And Dynamic Service Pages

**Files:**
- Create: `src/components/ServiceCard.astro`
- Create: `src/pages/uslugi/index.astro`
- Create: `src/pages/uslugi/[slug].astro`
- Modify: `src/pages/index.astro`
- Create: `tests/build/service-routes.test.ts`

- [ ] **Step 1: Write the failing build test for the services routes**

Create `tests/build/service-routes.test.ts`:

```ts
import { beforeAll, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import { readFile } from 'node:fs/promises';

beforeAll(async () => {
  await execa('npm', ['run', 'build'], { stdio: 'inherit' });
});

describe('service pages build', () => {
  it('builds the services index and at least one service landing', async () => {
    const servicesIndex = await readFile('dist/uslugi/index.html', 'utf8');
    const servicePage = await readFile('dist/uslugi/remont-obuvi-spb/index.html', 'utf8');

    expect(servicesIndex).toContain('Услуги мастерской Faktura / 78');
    expect(servicePage).toContain('Ремонт обуви в Санкт-Петербурге');
    expect(servicePage).toContain('Обычно 1-5 дней');
  });
});
```

- [ ] **Step 2: Run the build test to verify it fails**

Run:

```bash
npm test -- tests/build/service-routes.test.ts
```

Expected: FAIL because `/uslugi/` routes do not exist yet.

- [ ] **Step 3: Implement the service cards and both route types**

Create `src/components/ServiceCard.astro`:

```astro
---
const { service } = Astro.props;
---

<article class="card">
  <h2 style="margin-top:0;">{service.data.title}</h2>
  <p>{service.data.excerpt}</p>
  <p><strong>{service.data.priceNote}</strong></p>
  <a class="button button-secondary" href={`/uslugi/${service.data.slug}/`}>Открыть страницу</a>
</article>
```

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import ServiceCard from '../components/ServiceCard.astro';
import { getOrderedCases, getOrderedServices, getPrimaryCtaHref, getSitePage, getSiteSettings } from '../lib/content';

const settings = await getSiteSettings();
const homePage = await getSitePage('home');
const services = await getOrderedServices();
const cases = (await getOrderedCases()).slice(0, 3);
const primaryHref = getPrimaryCtaHref(settings);
---

<BaseLayout title={homePage.data.seoTitle} description={homePage.data.seoDescription} pathname="/">
  <Hero
    eyebrow="Санкт-Петербург"
    title={homePage.data.heroTitle}
    lead={homePage.data.heroLead}
    primaryHref={primaryHref}
    primaryLabel={settings.primaryCtaLabel}
    secondaryHref="/ceny-i-sroki/"
    secondaryLabel={settings.secondaryCtaLabel}
  />

  <section class="section">
    <div class="container grid" style="grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));">
      {services.map((service) => <ServiceCard service={service} />)}
    </div>
  </section>

  <section class="section">
    <div class="container card">
      <h2>Как устроено обращение</h2>
      <ol>
        <li>Присылаете фото изделия и задачу.</li>
        <li>Получаете ориентир по срокам и стоимости.</li>
        <li>Передаете вещь в мастерскую или через доставку по городу.</li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="container card">
      <h2>Кейсы до и после</h2>
      <ul>
        {cases.map((item) => <li>{item.data.title}</li>)}
      </ul>
      <a class="button button-secondary" href="/raboty/">Смотреть все работы</a>
    </div>
  </section>
</BaseLayout>
```

Create `src/pages/uslugi/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { getOrderedServices, getPrimaryCtaHref, getSitePage, getSiteSettings } from '../../lib/content';

const settings = await getSiteSettings();
const page = await getSitePage('services');
const services = await getOrderedServices();
const primaryHref = getPrimaryCtaHref(settings);
---

<BaseLayout title={page.data.seoTitle} description={page.data.seoDescription} pathname="/uslugi/">
  <Hero
    eyebrow="Услуги"
    title={page.data.heroTitle}
    lead={page.data.heroLead}
    primaryHref={primaryHref}
    primaryLabel={settings.primaryCtaLabel}
    secondaryHref="/ceny-i-sroki/"
    secondaryLabel={settings.secondaryCtaLabel}
  />

  <section class="section">
    <div class="container grid" style="grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));">
      {services.map((service) => <ServiceCard service={service} />)}
    </div>
  </section>
</BaseLayout>
```

Create `src/pages/uslugi/[slug].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import { getCollection } from 'astro:content';
import { getPrimaryCtaHref, getSiteSettings } from '../../lib/content';
import { buildBreadcrumbSchema } from '../../lib/seo';

export async function getStaticPaths() {
  const services = await getCollection('services');

  return services.map((service) => ({
    params: { slug: service.data.slug },
    props: { service },
  }));
}

const { service } = Astro.props;
const settings = await getSiteSettings();
const primaryHref = getPrimaryCtaHref(settings);
const { Content } = await service.render();
const breadcrumbs = [
  { name: 'Главная', href: settings.siteUrl },
  { name: 'Услуги', href: `${settings.siteUrl}/uslugi/` },
  { name: service.data.title, href: `${settings.siteUrl}/uslugi/${service.data.slug}/` },
];
---

<BaseLayout
  title={service.data.seoTitle}
  description={service.data.seoDescription}
  pathname={`/uslugi/${service.data.slug}/`}
  schema={[buildBreadcrumbSchema(breadcrumbs)]}
>
  <Breadcrumbs items={breadcrumbs} />
  <Hero
    eyebrow="Услуга"
    title={service.data.title}
    lead={service.data.description}
    primaryHref={primaryHref}
    primaryLabel={settings.primaryCtaLabel}
    secondaryHref="/ceny-i-sroki/"
    secondaryLabel={settings.secondaryCtaLabel}
  />

  <section class="section">
    <div class="container grid" style="grid-template-columns:2fr 1fr;">
      <article class="card">
        <p><strong>{service.data.priceNote}</strong></p>
        <p><strong>{service.data.turnaround}</strong></p>
        <Content />
      </article>
      <aside class="card">
        <h2>Почему это удобно</h2>
        <ul>
          <li>Оценка по фото до визита.</li>
          <li>Понятный срок еще до передачи вещи.</li>
          <li>Fallback на страницу контактов, если мессенджер не задан.</li>
        </ul>
      </aside>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Re-run the service routes build test**

Run:

```bash
npm test -- tests/build/service-routes.test.ts
```

Expected: PASS with generated `dist/uslugi/index.html` and `dist/uslugi/remont-obuvi-spb/index.html`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ServiceCard.astro src/pages/index.astro src/pages/uslugi/index.astro src/pages/uslugi/[slug].astro tests/build/service-routes.test.ts
git commit -m "feat: implement home and service landing pages"
```

### Task 8: Build Cases, Prices, Delivery, Contacts, FAQ, And 404 Pages

**Files:**
- Create: `src/components/CaseCard.astro`
- Create: `src/components/FaqList.astro`
- Create: `src/pages/raboty/index.astro`
- Create: `src/pages/ceny-i-sroki.astro`
- Create: `src/pages/zabor-i-dostavka.astro`
- Create: `src/pages/kontakty.astro`
- Create: `src/pages/faq.astro`
- Create: `src/pages/404.astro`
- Create: `tests/build/support-pages.test.ts`

- [ ] **Step 1: Write the failing build test for the supporting commercial pages**

Create `tests/build/support-pages.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the build test to verify it fails**

Run:

```bash
npm test -- tests/build/support-pages.test.ts
```

Expected: FAIL because the support pages do not exist yet.

- [ ] **Step 3: Implement the support components and pages**

Create `src/components/CaseCard.astro`:

```astro
---
const { item } = Astro.props;
---

<article class="card">
  <h2 style="margin-top:0;">{item.data.title}</h2>
  <p>{item.data.excerpt}</p>
  <ul>
    {item.data.result.map((point) => <li>{point}</li>)}
  </ul>
</article>
```

Create `src/components/FaqList.astro`:

```astro
---
const { items } = Astro.props;
---

<div class="grid">
  {
    items.map((item) => (
      <details class="card">
        <summary style="font-weight:700;cursor:pointer;">{item.data.question}</summary>
        <p>{item.data.answer}</p>
      </details>
    ))
  }
</div>
```

Create `src/pages/raboty/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import CaseCard from '../../components/CaseCard.astro';
import { getOrderedCases } from '../../lib/content';

const cases = await getOrderedCases();
---

<BaseLayout title="Работы / До-после | Faktura / 78" description="Реальные кейсы до и после" pathname="/raboty/">
  <section class="section">
    <div class="container">
      <h1>Работы / До-после</h1>
      <div class="grid">
        {cases.map((item) => <CaseCard item={item} />)}
      </div>
    </div>
  </section>
</BaseLayout>
```

Create `src/pages/ceny-i-sroki.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getOrderedServices, getSitePage } from '../lib/content';

const page = await getSitePage('prices');
const services = await getOrderedServices();
---

<BaseLayout title={page.data.seoTitle} description={page.data.seoDescription} pathname="/ceny-i-sroki/">
  <section class="section">
    <div class="container card">
      <h1>{page.data.heroTitle}</h1>
      <p>{page.data.heroLead}</p>
      <ul>
        {services.map((service) => <li><strong>{service.data.title}</strong>: {service.data.priceNote} · {service.data.turnaround}</li>)}
      </ul>
    </div>
  </section>
</BaseLayout>
```

Create `src/pages/zabor-i-dostavka.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getSitePage } from '../lib/content';

const page = await getSitePage('delivery');
---

<BaseLayout title={page.data.seoTitle} description={page.data.seoDescription} pathname="/zabor-i-dostavka/">
  <section class="section">
    <div class="container card">
      <h1>{page.data.heroTitle}</h1>
      <p>{page.data.heroLead}</p>
      <ol>
        <li>Присылаете фото и адрес в Санкт-Петербурге.</li>
        <li>Получаете ориентир по стоимости и формату передачи вещи.</li>
        <li>Согласовываете забор или доставку без лишних звонков.</li>
      </ol>
    </div>
  </section>
</BaseLayout>
```

Create `src/pages/kontakty.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PrimaryCta from '../components/PrimaryCta.astro';
import { getPrimaryCtaHref, getSitePage, getSiteSettings } from '../lib/content';

const page = await getSitePage('contacts');
const settings = await getSiteSettings();
const primaryHref = getPrimaryCtaHref(settings);
---

<BaseLayout title={page.data.seoTitle} description={page.data.seoDescription} pathname="/kontakty/">
  <section class="section">
    <div class="container grid" style="grid-template-columns:2fr 1fr;">
      <div class="card">
        <h1>{page.data.heroTitle}</h1>
        <p>{page.data.heroLead}</p>
        <p>Город: {settings.city}</p>
        <p>График: {settings.scheduleText.join(' · ')}</p>
        {settings.addressText && <p>Адрес: {settings.addressText}</p>}
      </div>
      <aside class="card">
        <h2>Связаться</h2>
        <div style="display:grid;gap:0.75rem;">
          <PrimaryCta href={primaryHref} label={settings.primaryCtaLabel} />
          {settings.telegramUrl && <PrimaryCta href={settings.telegramUrl} label="Написать в Telegram" variant="secondary" />}
          {settings.whatsappUrl && <PrimaryCta href={settings.whatsappUrl} label="Написать в WhatsApp" variant="secondary" />}
          {settings.phoneE164 && <PrimaryCta href={`tel:${settings.phoneE164}`} label={settings.phoneDisplay ?? 'Позвонить'} variant="secondary" />}
        </div>
      </aside>
    </div>
  </section>
</BaseLayout>
```

Create `src/pages/faq.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import FaqList from '../components/FaqList.astro';
import { getOrderedFaq, getSitePage } from '../lib/content';

const page = await getSitePage('faq');
const faq = await getOrderedFaq();
---

<BaseLayout title={page.data.seoTitle} description={page.data.seoDescription} pathname="/faq/">
  <section class="section">
    <div class="container">
      <h1>{page.data.heroTitle}</h1>
      <p>{page.data.heroLead}</p>
      <FaqList items={faq} />
    </div>
  </section>
</BaseLayout>
```

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Страница не найдена | Faktura / 78" description="Проверьте адрес или вернитесь на главную страницу." pathname="/404/">
  <section class="section">
    <div class="container card">
      <h1>Страница не найдена</h1>
      <p>Проверьте адрес страницы или вернитесь на главную.</p>
      <a class="button button-primary" href="/">На главную</a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Re-run the support pages build test**

Run:

```bash
npm test -- tests/build/support-pages.test.ts
```

Expected: PASS with generated prices, contacts, FAQ and `404.html`.

- [ ] **Step 5: Commit**

```bash
git add src/components/CaseCard.astro src/components/FaqList.astro src/pages/raboty/index.astro src/pages/ceny-i-sroki.astro src/pages/zabor-i-dostavka.astro src/pages/kontakty.astro src/pages/faq.astro src/pages/404.astro tests/build/support-pages.test.ts
git commit -m "feat: implement supporting commercial pages"
```

### Task 9: Add Technical SEO, Sitemap, Robots, And Analytics Hooks

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/components/Analytics.astro`
- Create: `src/pages/robots.txt.ts`
- Create: `tests/build/seo-artifacts.test.ts`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Install the sitemap integration and write the failing artifact test**

Run:

```bash
npm install @astrojs/sitemap
```

Create `tests/build/seo-artifacts.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the SEO artifact test to verify it fails**

Run:

```bash
npm test -- tests/build/seo-artifacts.test.ts
```

Expected: FAIL because there is no robots route, no sitemap integration and no analytics component in layout.

- [ ] **Step 3: Implement sitemap, robots and conditional analytics**

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://factura78.ru',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
```

Create `src/components/Analytics.astro`:

```astro
---
const { yandexMetrikaId, googleSiteVerification, yandexVerification } = Astro.props;
---

{googleSiteVerification && <meta name="google-site-verification" content={googleSiteVerification} />}
{yandexVerification && <meta name="yandex-verification" content={yandexVerification} />}
{
  yandexMetrikaId && (
    <script
      is:inline
      set:html={`window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};ym(${yandexMetrikaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
    />
  )
}
```

Create `src/pages/robots.txt.ts`:

```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(
    ['User-agent: *', 'Allow: /', 'Host: https://factura78.ru', 'Sitemap: https://factura78.ru/sitemap-index.xml'].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
};
```

Update `src/layouts/BaseLayout.astro` to include `Analytics.astro` inside `<head>`:

```astro
---
import '../styles/global.css';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
import SeoHead from '../components/SeoHead.astro';
import Analytics from '../components/Analytics.astro';
import { buildOrganizationSchema, canonicalFromPath } from '../lib/seo';
import { getPrimaryCtaHref, getSiteSettings } from '../lib/content';

const { title, description, pathname = '/', schema = [] } = Astro.props;
const settings = await getSiteSettings();
const primaryHref = getPrimaryCtaHref(settings);
const canonical = canonicalFromPath(settings.siteUrl, pathname);
const fullSchema = [buildOrganizationSchema(settings), ...schema];
---

<!doctype html>
<html lang="ru" data-theme={settings.defaultTheme}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <SeoHead title={title} description={description} canonical={canonical} schema={fullSchema} />
    <Analytics
      yandexMetrikaId={settings.yandexMetrikaId}
      googleSiteVerification={settings.googleSiteVerification}
      yandexVerification={settings.yandexVerification}
    />
  </head>
  <body>
    <a class="skip-link" href="#content">Перейти к содержимому</a>
    <SiteHeader brandName={settings.brandName} primaryHref={primaryHref} primaryLabel={settings.primaryCtaLabel} />
    <main id="content">
      <slot />
    </main>
    <SiteFooter brandName={settings.brandName} city={settings.city} scheduleText={settings.scheduleText} />
  </body>
</html>
```

- [ ] **Step 4: Re-run the SEO artifact test**

Run:

```bash
npm test -- tests/build/seo-artifacts.test.ts
```

Expected: PASS with built `robots.txt`, sitemap output and canonical tags in page HTML.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src/components/Analytics.astro src/pages/robots.txt.ts src/layouts/BaseLayout.astro tests/build/seo-artifacts.test.ts
git commit -m "feat: add technical seo and analytics hooks"
```

### Task 10: Add Deploy Files, README, And Final Verification

**Files:**
- Create: `Dockerfile`
- Create: `nginx/factura78.conf`
- Create: `README.md`
- Create: `tests/config/deploy.test.ts`

- [ ] **Step 1: Write the failing deploy config test**

Create `tests/config/deploy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('deploy files', () => {
  it('contains a static Docker + Nginx setup for the built dist output', async () => {
    const dockerfile = await readFile('Dockerfile', 'utf8');
    const nginx = await readFile('nginx/factura78.conf', 'utf8');

    expect(dockerfile).toContain('COPY --from=build /app/dist /usr/share/nginx/html');
    expect(nginx).toContain('root /usr/share/nginx/html;');
    expect(nginx).toContain('error_page 404 /404.html;');
  });
});
```

- [ ] **Step 2: Run the deploy test to verify it fails**

Run:

```bash
npm test -- tests/config/deploy.test.ts
```

Expected: FAIL because deployment files do not exist yet.

- [ ] **Step 3: Add Dockerfile, Nginx config and the runbook**

Create `Dockerfile`:

```Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/factura78.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
```

Create `nginx/factura78.conf`:

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location = /robots.txt {
    try_files $uri =404;
  }

  location / {
    try_files $uri $uri/ =404;
  }

  error_page 404 /404.html;
}
```

Create `README.md`:

````md
# Faktura / 78

Статический Astro-сайт для мастерской по ремонту, чистке и реставрации обуви и сумок в Санкт-Петербурге.

## Локальный запуск

```bash
npm install
npm run dev
```

## Проверки

```bash
npm test
npm run check
npm run build
```

## Production build

```bash
docker build -t factura78 .
docker run --rm -p 8080:80 factura78
```

## Launch checklist

- Заполнить `phoneE164`, `phoneDisplay`, `telegramUrl`, `whatsappUrl` и `addressText` в `src/content/settings/site.json`.
- Добавить реальные `yandexMetrikaId`, `googleSiteVerification` и `yandexVerification`, если они уже заведены.
- Проверить `https://factura78.ru/robots.txt` и sitemap после выкладки.
- Подтвердить сайт в Яндекс Вебмастере и Google Search Console.
````

- [ ] **Step 4: Re-run the deploy test and the full verification suite**

Run:

```bash
npm test -- tests/config/deploy.test.ts
npm test
npm run check
npm run build
```

Expected: deploy test PASS, then full test suite PASS, `astro check` exits with code `0`, and build completes with generated `dist/`.

- [ ] **Step 5: Commit**

```bash
git add Dockerfile nginx/factura78.conf README.md tests/config/deploy.test.ts
git commit -m "chore: add deployment config and launch runbook"
```

## Self-Review

### 1. Spec Coverage

- Astro + TypeScript + static deploy: covered by Tasks 1, 9, 10.
- Content Collections for `services`, `cases`, `faq`, `districts`, `site-pages`, `settings`: covered by Tasks 2, 3, 4.
- Two-theme design system with CSS variables and manual toggle: covered by Task 5.
- Start pages from the design spec: covered by Tasks 7 and 8.
- SEO for Санкт-Петербург, schema.org, sitemap, robots, canonical: covered by Tasks 6 and 9.
- Fast conversion path with photo-first CTA and fallback path: covered by Tasks 5, 6, 7, 8.
- Nginx/CDN-ready static deploy: covered by Task 10.

Gap check: no uncovered requirement from `docs/superpowers/specs/2026-04-05-factura78-site-design.md` remains.

### 2. Placeholder Scan

- `TODO`, `TBD`, `implement later` and similar placeholders are absent.
- Единственный явно зафиксированный operational gate - заполнить реальные контакты и аналитические ID перед production deploy. Это не placeholder в коде, а launch requirement.

### 3. Type Consistency

- Collection names везде совпадают: `settings`, `sitePages`, `services`, `cases`, `faq`, `districts`.
- Slug-путь для service pages везде один и тот же: `/uslugi/${slug}/`.
- Основной helper и layout contract не расходятся: `getSiteSettings()`, `getPrimaryCtaHref()`, `BaseLayout` принимают одинаковые поля.
- Hyphenated content directories не конфликтуют с именами коллекций, потому что схема явно использует `glob()` loaders.
