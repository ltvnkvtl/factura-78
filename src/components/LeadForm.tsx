import { useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import services from '../data/services.json';

interface Props {
  defaultItemType?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

const MAX_PHOTOS = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const CONTACT_REGEX = /^(\+?\d[\d\s()\-]{7,}|@[\w_]{4,})$/;

const ITEM_TYPES: { value: string; label: string }[] = [
  ...services.map(s => ({ value: s.title, label: s.title })),
  { value: 'Другое', label: 'Другое' },
];

export default function LeadForm({ defaultItemType, compact = false, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [itemType, setItemType] = useState(defaultItemType ?? '');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const endpoint = (import.meta.env.PUBLIC_LEAD_FORM_URL as string | undefined) ?? '';

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Укажите имя';
    if (!CONTACT_REGEX.test(contact.trim())) e.contact = 'Телефон или @username';
    if (photos.length === 0) e.photos = 'Прикрепите хотя бы одно фото';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    const existingTotal = photos.reduce((s, f) => s + f.size, 0);
    const accepted: File[] = [];
    const fileErrors: string[] = [];
    let runningTotal = existingTotal;

    for (const f of incoming) {
      if (photos.length + accepted.length >= MAX_PHOTOS) {
        fileErrors.push(`Не больше ${MAX_PHOTOS} фото`);
        break;
      }
      if (!ACCEPTED_TYPES.includes(f.type) && !/\.(jpe?g|png|webp|heic|heif)$/i.test(f.name)) {
        fileErrors.push(`${f.name}: неподдерживаемый формат`);
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        fileErrors.push(`${f.name}: больше 5 МБ`);
        continue;
      }
      if (runningTotal + f.size > MAX_TOTAL_BYTES) {
        fileErrors.push('Суммарный размер фото больше 20 МБ');
        break;
      }
      accepted.push(f);
      runningTotal += f.size;
    }

    if (accepted.length > 0) {
      setPhotos(prev => [...prev, ...accepted]);
      setErrors(prev => ({ ...prev, photos: '' }));
    }
    if (fileErrors.length > 0) {
      setErrors(prev => ({ ...prev, photos: fileErrors[0] }));
    }
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }

  function handleFileInput(e: JSX.TargetedEvent<HTMLInputElement>) {
    const files = (e.currentTarget as HTMLInputElement).files;
    if (files) addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!validate()) return;
    if (!endpoint) {
      setStatus('error');
      setErrorMsg('Не настроен URL формы. Свяжитесь с нами в мессенджере ниже.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      fd.append('contact', contact.trim());
      fd.append('itemType', itemType.trim());
      fd.append('description', description.trim());
      fd.append('source', typeof window !== 'undefined' ? window.location.href : '');
      fd.append('website', website);
      photos.forEach((p, i) => fd.append(`photo_${i}`, p, p.name));

      const res = await fetch(endpoint, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Не удалось отправить заявку');
      }
      setStatus('success');
      onSuccess?.();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Ошибка сети');
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            backgroundColor: 'color-mix(in srgb, var(--color-success) 15%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          Заявка отправлена
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
          Мастер свяжется с вами в течение часа.
        </p>
        <button
          onClick={() => {
            setName(''); setContact(''); setItemType(defaultItemType ?? '');
            setDescription(''); setPhotos([]); setErrors({}); setStatus('idle');
          }}
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-tertiary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            textDecoration: 'underline',
          }}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  const sending = status === 'sending';
  const inputStyle: JSX.CSSProperties = {
    width: '100%',
    padding: '0.75rem 0.875rem',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-body)',
    backgroundColor: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'border-color 150ms ease-out',
  };

  const labelStyle: JSX.CSSProperties = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    marginBottom: '0.375rem',
    color: 'var(--color-text-secondary)',
  };

  const errorStyle: JSX.CSSProperties = {
    fontSize: '0.75rem',
    color: 'var(--color-error)',
    marginTop: '0.25rem',
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        textAlign: 'left',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: compact ? '1.25rem' : '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '560px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <div>
        <label style={labelStyle} for="lead-name">Как вас зовут?</label>
        <input
          id="lead-name"
          type="text"
          value={name}
          onInput={e => setName((e.currentTarget as HTMLInputElement).value)}
          placeholder="Имя"
          autoComplete="given-name"
          style={{ ...inputStyle, borderColor: errors.name ? 'var(--color-error)' : 'var(--color-border-subtle)' }}
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      <div>
        <label style={labelStyle} for="lead-contact">Телефон или Telegram</label>
        <input
          id="lead-contact"
          type="text"
          value={contact}
          onInput={e => setContact((e.currentTarget as HTMLInputElement).value)}
          placeholder="+7 999 123-45-67 или @username"
          autoComplete="tel"
          style={{ ...inputStyle, borderColor: errors.contact ? 'var(--color-error)' : 'var(--color-border-subtle)' }}
        />
        {errors.contact && <p style={errorStyle}>{errors.contact}</p>}
      </div>

      <div>
        <label style={labelStyle}>Фото изделия</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
          style={{
            border: `2px dashed ${dragActive ? 'var(--color-accent-cta)' : errors.photos ? 'var(--color-error)' : 'var(--color-border-default)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: dragActive ? 'color-mix(in srgb, var(--color-accent-cta) 6%, transparent)' : 'var(--color-bg-base)',
            transition: 'all 150ms ease-out',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style={{ margin: '0 auto 0.5rem' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--color-accent-cta)', fontWeight: 600 }}>Выбрать фото</span> или перетащить сюда
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
            До {MAX_PHOTOS} штук, по 5 МБ
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>
        {errors.photos && <p style={errorStyle}>{errors.photos}</p>}

        {photos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '0.5rem', marginTop: '0.75rem' }}>
            {photos.map((p, i) => (
              <PhotoPreview key={`${p.name}-${i}`} file={p} onRemove={() => removePhoto(i)} />
            ))}
          </div>
        )}
      </div>

      <details style={{ fontSize: '0.875rem' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--color-text-secondary)', userSelect: 'none' }}>
          Добавить тип изделия и описание
        </summary>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
          <div>
            <label style={labelStyle} for="lead-type">Тип изделия</label>
            <select
              id="lead-type"
              value={itemType}
              onChange={e => setItemType((e.currentTarget as HTMLSelectElement).value)}
              style={inputStyle}
            >
              <option value="">Не указано</option>
              {ITEM_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle} for="lead-desc">Что нужно сделать?</label>
            <textarea
              id="lead-desc"
              value={description}
              onInput={e => setDescription((e.currentTarget as HTMLTextAreaElement).value)}
              placeholder="Например: потёртости на носке, нужна перекраска"
              maxLength={500}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
            />
          </div>
        </div>
      </details>

      <input
        type="text"
        name="website"
        value={website}
        onInput={e => setWebsite((e.currentTarget as HTMLInputElement).value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
      />

      {status === 'error' && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'color-mix(in srgb, var(--color-error) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-error) 30%, transparent)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--color-error)',
          }}
        >
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        class="btn-primary"
        disabled={sending}
        style={{ justifyContent: 'center', width: '100%', opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer' }}
      >
        {sending ? 'Отправляем…' : 'Отправить заявку'}
      </button>

      <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', textAlign: 'center', margin: 0 }}>
        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
      </p>
    </form>
  );
}

function PhotoPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState<string>(() => URL.createObjectURL(file));

  // Note: we intentionally don't revoke on unmount because component lifetime equals form lifetime
  // and revoking too early breaks rerender previews.
  void setUrl;

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '1',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-elevated)',
      }}
    >
      <img src={url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Удалить фото"
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.65)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
