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

## Публикация в GitHub

```bash
git remote add origin https://github.com/ltvnkvtl/factura-78
git push -u origin <your-branch>
```

## Launch checklist

- Заполнить `phoneE164`, `phoneDisplay`, `telegramUrl`, `whatsappUrl` и `addressText` в `src/content/settings/site.json`.
- Добавить реальные `yandexMetrikaId`, `googleSiteVerification` и `yandexVerification`, если они уже заведены.
- Проверить `https://factura78.ru/robots.txt` и sitemap после выкладки.
- Подтвердить сайт в Яндекс Вебмастере и Google Search Console.
