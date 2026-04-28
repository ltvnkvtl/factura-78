import { useState, useEffect, useRef } from 'preact/hooks';

interface Props {
  whatsappUrl: string;
  telegramUrl: string;
  buttonLabel?: string;
}

export default function MessengerModal({ whatsappUrl, telegramUrl, buttonLabel = 'Оценка по фото' }: Props) {
  const [open, setOpen] = useState(false);
  const firstBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('open-messenger-modal', handler);
    return () => document.removeEventListener('open-messenger-modal', handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      document.addEventListener('keydown', onKey);
      setTimeout(() => firstBtnRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Sticky floating button */}
      <button
        onClick={() => {
          const section = document.getElementById('contact-cta');
          if (section) {
            const top = section.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
          } else {
            setOpen(true);
          }
        }}
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 90, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'var(--color-accent-cta)', color: 'var(--color-on-accent)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9375rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(139,58,46,0.4)', transition: 'background-color 200ms ease-out' }}
        aria-label={buttonLabel}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        <span>{buttonLabel}</span>
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          role="dialog" aria-modal="true" aria-label="Выберите мессенджер"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(35,26,27,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '320px', position: 'relative' }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: '1.25rem', lineHeight: 1 }} aria-label="Закрыть">×</button>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Выберите мессенджер</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>Отправьте фото изделия — ответим за 1 час</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a ref={firstBtnRef} href={whatsappUrl} target="_blank" rel="noopener noreferrer" class="btn-primary" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                WhatsApp
              </a>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" class="btn-secondary" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
