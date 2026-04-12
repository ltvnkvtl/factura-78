import { useCallback, useEffect, useId, useState } from 'preact/hooks';

interface Props {
  title: string;
  description?: string;
  beforeAlt: string;
  afterAlt: string;
}

export default function BeforeAfterSlider({ title, description, beforeAlt, afterAlt }: Props) {
  const id = useId();
  const labelId = `${id}-label`;
  const [pct, setPct] = useState(50);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const onInput = useCallback((e: Event) => {
    const v = (e.target as HTMLInputElement).value;
    setPct(Number(v));
  }, []);

  return (
    <div
      class="card overflow-hidden p-0 border-[var(--color-border-subtle)]"
      role="region"
      aria-labelledby={labelId}
    >
      <div class="p-5 md:p-6 border-b border-[var(--color-border-subtle)]">
        <h3 id={labelId} class="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-1">
          {title}
        </h3>
        {description ? (
          <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
        ) : null}
      </div>

      <div class="relative aspect-[16/10] bg-[var(--color-bg-elevated)] select-none touch-pan-y">
        <div class="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-text-tertiary)] text-center px-6">
          {beforeAlt}
        </div>
        <div
          class="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-text-tertiary)] text-center px-6 overflow-hidden border-l-2 border-[var(--color-on-accent)] shadow-[4px_0_24px_rgba(0,0,0,0.35)]"
          style={{
            clipPath: reducedMotion ? 'inset(0 50% 0 0)' : `inset(0 ${100 - pct}% 0 0)`,
          }}
          aria-hidden="true"
        >
          {afterAlt}
        </div>

        {!reducedMotion ? (
          <>
            <div
              class="absolute top-0 bottom-0 w-0.5 bg-[var(--color-on-accent)] pointer-events-none shadow-md z-10"
              style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={pct}
              onInput={onInput}
              class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label="Сравнить фото до и после"
            />
          </>
        ) : null}

        <span class="absolute top-3 left-3 z-30 text-xs font-semibold bg-[var(--color-bg-base)]/90 text-[var(--color-text-secondary)] px-2 py-0.5 rounded border border-[var(--color-border-subtle)]">
          До
        </span>
        <span class="absolute top-3 right-3 z-30 text-xs font-semibold bg-[var(--color-accent-cta)] text-[var(--color-on-accent)] px-2 py-0.5 rounded">
          После
        </span>
      </div>

      {!reducedMotion ? (
        <p class="px-5 py-3 text-xs text-[var(--color-text-tertiary)] border-t border-[var(--color-border-subtle)]">
          Двигайте ползунок на фото, чтобы сравнить результат.
        </p>
      ) : (
        <p class="px-5 py-3 text-xs text-[var(--color-text-tertiary)] border-t border-[var(--color-border-subtle)]">
          Статичное сравнение 50/50 (включён режим уменьшения анимации в системе).
        </p>
      )}
    </div>
  );
}
