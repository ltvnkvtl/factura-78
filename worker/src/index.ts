export interface Env {
  BOT_TOKEN: string;
  CHAT_ID: string;
  ALLOWED_ORIGINS?: string;
}

const DEFAULT_ALLOWED = [
  'https://factura78.ru',
  'https://www.factura78.ru',
  'http://localhost:4321',
  'http://localhost:4322',
];

const MAX_PHOTOS = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const ACCEPTED_PREFIX = 'image/';
const CONTACT_REGEX = /^(\+?\d[\d\s()\-]{7,}|@[\w_]{4,})$/;
const NAME_MIN = 2;
const NAME_MAX = 100;
const DESCRIPTION_MAX = 500;
const TELEGRAM_CAPTION_MAX = 1024;

function corsHeaders(origin: string | null, allowed: string[]): HeadersInit {
  const o = origin && allowed.includes(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(body: unknown, status: number, cors: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowed = (env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean)) ?? DEFAULT_ALLOWED;
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405, cors);
    }
    if (!origin || !allowed.includes(origin)) {
      return jsonResponse({ ok: false, error: 'Forbidden origin' }, 403, cors);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return jsonResponse({ ok: false, error: 'Невалидная форма' }, 400, cors);
    }

    // Honeypot — silent OK
    const honeypot = (form.get('website') as string | null)?.trim();
    if (honeypot) {
      return jsonResponse({ ok: true }, 200, cors);
    }

    const name = ((form.get('name') as string | null) ?? '').trim();
    const contact = ((form.get('contact') as string | null) ?? '').trim();
    const itemType = ((form.get('itemType') as string | null) ?? '').trim();
    const description = ((form.get('description') as string | null) ?? '').trim();
    const source = ((form.get('source') as string | null) ?? '').trim();

    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      return jsonResponse({ ok: false, error: 'Укажите имя' }, 400, cors);
    }
    if (!CONTACT_REGEX.test(contact)) {
      return jsonResponse({ ok: false, error: 'Невалидный контакт' }, 400, cors);
    }
    if (description.length > DESCRIPTION_MAX) {
      return jsonResponse({ ok: false, error: 'Описание слишком длинное' }, 400, cors);
    }

    const photos: File[] = [];
    let totalSize = 0;
    for (let i = 0; i < MAX_PHOTOS; i++) {
      const f = form.get(`photo_${i}`);
      if (!f || typeof f === 'string') continue;
      const file = f as File;
      if (!file.type.startsWith(ACCEPTED_PREFIX)) {
        return jsonResponse({ ok: false, error: `photo_${i}: not an image` }, 400, cors);
      }
      if (file.size > MAX_FILE_BYTES) {
        return jsonResponse({ ok: false, error: `photo_${i}: > 5 MB` }, 400, cors);
      }
      totalSize += file.size;
      if (totalSize > MAX_TOTAL_BYTES) {
        return jsonResponse({ ok: false, error: 'Total size > 25 MB' }, 400, cors);
      }
      photos.push(file);
    }
    if (photos.length === 0) {
      return jsonResponse({ ok: false, error: 'Прикрепите фото' }, 400, cors);
    }

    const captionRaw = [
      `🆕 Заявка с сайта`,
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      itemType ? `Тип: ${itemType}` : null,
      description ? `Описание: ${description}` : null,
      source ? `Источник: ${source}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    const caption = escapeHtml(captionRaw).slice(0, TELEGRAM_CAPTION_MAX);

    // HEIC/HEIF can't be processed by Telegram as photos — send as documents.
    // Split into photo group and document group; send sequentially.
    const isHeic = (f: File) =>
      f.type === 'image/heic' || f.type === 'image/heif' ||
      /\.(heic|heif)$/i.test(f.name || '');

    const photoFiles = photos.filter(f => !isHeic(f));
    const docFiles = photos.filter(f => isHeic(f));

    async function sendGroup(files: File[], type: 'photo' | 'document', firstCaption: string): Promise<Response> {
      const tg = new FormData();
      tg.append('chat_id', env.CHAT_ID);
      const media = files.map((_, i) => ({
        type,
        media: `attach://file_${i}`,
        ...(i === 0 ? { caption: firstCaption, parse_mode: 'HTML' } : {}),
      }));
      tg.append('media', JSON.stringify(media));
      files.forEach((f, i) => tg.append(`file_${i}`, f, f.name || `file_${i}.${type === 'photo' ? 'jpg' : 'heic'}`));
      return fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMediaGroup`, { method: 'POST', body: tg });
    }

    try {
      if (photoFiles.length > 0) {
        const res = await sendGroup(photoFiles, 'photo', caption);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('Telegram photo error', res.status, text);
          return jsonResponse({ ok: false, error: 'Telegram API error' }, 502, cors);
        }
      }
      if (docFiles.length > 0) {
        // Caption on first doc only if no photos were sent (otherwise caption already in photo group)
        const docCaption = photoFiles.length === 0 ? caption : '';
        const res = await sendGroup(docFiles, 'document', docCaption);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('Telegram doc error', res.status, text);
          return jsonResponse({ ok: false, error: 'Telegram API error' }, 502, cors);
        }
      }
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Telegram unreachable' }, 502, cors);
    }

    return jsonResponse({ ok: true }, 200, cors);
  },
};
