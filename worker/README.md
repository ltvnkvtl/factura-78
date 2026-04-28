# factura78-lead — Cloudflare Worker

Принимает заявки с фото с сайта [factura78.ru](https://factura78.ru) и пересылает их в Telegram-чат мастера через Telegram Bot API.

## Архитектура

```
[Browser (LeadForm.tsx)]
   ─POST FormData (name, contact, photo_0..4, ...)─►
[Cloudflare Worker]
   1. Проверяет Origin
   2. Валидирует поля и фото
   3. Вызывает sendMediaGroup в Telegram Bot API
   ─{ok: true}─►
[Browser]
```

Токен бота **не покрашен в клиенте** — хранится как secret в Worker'е.

## Первичная настройка

### 1. Создать Telegram-бота

1. Открыть `@BotFather` в Telegram, отправить `/newbot`.
2. Дать имя и username, скопировать `BOT_TOKEN`.

### 2. Получить `CHAT_ID`

1. Открыть чат с ботом со своего аккаунта мастера, нажать **Start**.
2. Отправить любое сообщение боту (например, `/start`).
3. В браузере открыть `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`.
4. Найти `"chat":{"id":...}` — это `CHAT_ID` (число, может быть отрицательным для групп).

> Если хочется получать заявки в группу — добавить бота в группу, отправить туда сообщение, получить `chat.id` тем же способом.

### 3. Деплой Worker

```bash
cd worker
npm install
npx wrangler login                  # один раз — авторизация в Cloudflare
npx wrangler secret put BOT_TOKEN   # вставить токен бота
npx wrangler secret put CHAT_ID     # вставить chat_id
npx wrangler deploy
```

После `deploy` Cloudflare выдаст URL вида:

```
https://factura78-lead.<account>.workers.dev
```

### 4. Прокинуть URL в сайт

В корне основного репозитория создать `.env`:

```
PUBLIC_LEAD_FORM_URL=https://factura78-lead.<account>.workers.dev
```

Для GitHub Pages деплоя — добавить тот же `PUBLIC_LEAD_FORM_URL` как secret в GitHub Actions и пробросить в build step.

## Лимиты

| Параметр | Значение |
| --- | --- |
| Запросов в день (free tier) | 100 000 |
| CPU на запрос (free) | 10 ms |
| Размер тела запроса | 100 MB |
| Фото на заявку | 1–5 |
| Размер одного фото | ≤ 5 MB |
| Суммарный размер | ≤ 25 MB |

## Локальная разработка

```bash
npx wrangler dev
```

Будет крутиться на `http://localhost:8787`. Чтобы фронт сайта мог стучаться к локальному Worker'у, временно установите `PUBLIC_LEAD_FORM_URL=http://localhost:8787` в корневом `.env`.

## Тесты с curl

```bash
# Отправка заявки (origin должен быть в whitelist)
curl -X POST https://factura78-lead.<acc>.workers.dev \
  -H "Origin: https://factura78.ru" \
  -F "name=Тест" \
  -F "contact=+79991234567" \
  -F "photo_0=@./test.jpg"

# Проверка CORS — чужой origin → 403
curl -X POST https://factura78-lead.<acc>.workers.dev \
  -H "Origin: https://evil.example" \
  -F "name=x" -F "contact=@user1234" -F "photo_0=@./test.jpg"
```

## Изменение списка разрешённых Origin

По умолчанию разрешены `factura78.ru`, `www.factura78.ru`, `localhost:4321`, `localhost:4322`. Чтобы переопределить — добавить в `wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGINS = "https://factura78.ru,https://staging.factura78.ru"
```

И задеплоить заново.
