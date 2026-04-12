import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import pricesData from '../data/prices.json';

type Category = 'shoes' | 'bags' | 'jackets' | 'cleaning';

interface StepOption {
  value: string;
  label: string;
}

const CATEGORIES: StepOption[] = [
  { value: 'shoes', label: 'Ремонт обуви' },
  { value: 'bags', label: 'Ремонт сумки' },
  { value: 'jackets', label: 'Ремонт куртки' },
  { value: 'cleaning', label: 'Химчистка' },
];

const CONDITIONS: StepOption[] = [
  { value: 'light', label: 'Небольшой износ' },
  { value: 'medium', label: 'Заметные повреждения' },
  { value: 'heavy', label: 'Серьёзные повреждения' },
];

const WHATSAPP_URL = 'https://wa.me/79991234567';
const TELEGRAM_URL = 'https://t.me/factura78';

export default function QuizCalculator() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [itemType, setItemType] = useState<string | null>(null);
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [condition, setCondition] = useState<string | null>(null);

  const categoryData = category ? pricesData[category] : null;
  const worksMap = categoryData?.works as Record<string, { label: string; min: number; max: number; days_min: number; days_max: number }> | undefined;

  function getTypes(): string[] {
    return categoryData?.types ?? [];
  }

  function getWorks(): StepOption[] {
    if (!worksMap) return [];
    return Object.entries(worksMap).map(([key, val]) => ({
      value: key,
      label: val.label,
    }));
  }

  function calculate() {
    if (!worksMap || !condition) return null;
    const mult = pricesData.conditionMultiplier[condition as keyof typeof pricesData.conditionMultiplier] ?? 1;
    let totalMin = 0;
    let totalMax = 0;
    let daysMin = 0;
    let daysMax = 0;

    for (const workKey of selectedWorks) {
      const work = worksMap[workKey];
      if (work) {
        totalMin += work.min;
        totalMax += work.max;
        daysMax = Math.max(daysMax, work.days_max);
        daysMin = Math.max(daysMin, work.days_min);
      }
    }

    return {
      priceMin: Math.round(totalMin * mult),
      priceMax: Math.round(totalMax * mult),
      daysMin,
      daysMax,
    };
  }

  function toggleWork(key: string) {
    setSelectedWorks(prev =>
      prev.includes(key)
        ? prev.filter(w => w !== key)
        : [...prev, key]
    );
  }

  function buildWhatsAppMessage(): string {
    const catLabel = CATEGORIES.find(c => c.value === category)?.label ?? '';
    const workLabels = selectedWorks
      .map(wk => worksMap?.[wk]?.label)
      .filter(Boolean)
      .join(', ');
    const condLabel = CONDITIONS.find(c => c.value === condition)?.label ?? '';
    const text = `Здравствуйте! Хочу оценить ${catLabel.toLowerCase()}.\nТип: ${itemType}\nРаботы: ${workLabels}\nСостояние: ${condLabel}`;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return category !== null;
      case 1: return itemType !== null;
      case 2: return selectedWorks.length > 0;
      case 3: return condition !== null;
      default: return false;
    }
  }

  function goBack() {
    if (step === 0) return;
    setStep(step - 1);
  }

  function goNext() {
    if (!canProceed()) return;
    setStep(step + 1);
  }

  function restart() {
    setStep(0);
    setCategory(null);
    setItemType(null);
    setSelectedWorks([]);
    setCondition(null);
  }

  const result = step === 4 ? calculate() : null;
  const totalSteps = 4;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Progress */}
      {step < 4 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Шаг {step + 1} из {totalSteps}</span>
          </div>
          <div style={{ height: '4px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '2px' }}>
            <div style={{
              height: '100%',
              width: `${((step + 1) / totalSteps) * 100}%`,
              backgroundColor: 'var(--color-accent-cta)',
              borderRadius: '2px',
              transition: 'width 300ms ease-out',
            }} />
          </div>
        </div>
      )}

      {/* Step 0: Category */}
      {step === 0 && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            Что нужно сделать?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {CATEGORIES.map(cat => (
              <OptionCard
                key={cat.value}
                label={cat.label}
                selected={category === cat.value}
                onClick={() => setCategory(cat.value as Category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Item type */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            Уточните тип изделия
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {getTypes().map(t => (
              <OptionCard
                key={t}
                label={t}
                selected={itemType === t}
                onClick={() => setItemType(t)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Works (multi-select) */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            Какая работа нужна?
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '1.5rem' }}>
            Можно выбрать несколько
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {getWorks().map(w => (
              <CheckboxCard
                key={w.value}
                label={w.label}
                checked={selectedWorks.includes(w.value)}
                onChange={() => toggleWork(w.value)}
                price={worksMap?.[w.value]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Condition */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            Оцените состояние изделия
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CONDITIONS.map(c => (
              <OptionCard
                key={c.value}
                label={c.label}
                selected={condition === c.value}
                onClick={() => setCondition(c.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 4 && result && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            padding: '2rem',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
              Ориентировочная стоимость
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent-cta)', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
              {result.priceMin.toLocaleString('ru-RU')} – {result.priceMax.toLocaleString('ru-RU')} ₽
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Срок: {result.daysMin}–{result.daysMax} рабочих дней
            </p>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '1.5rem' }}>
            Точная стоимость определяется после осмотра или по фото
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
              style={{ justifyContent: 'center', width: '100%' }}
            >
              Отправить фото для точной оценки
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary"
              style={{ justifyContent: 'center', width: '100%' }}
            >
              Написать в Telegram
            </a>
            <button
              onClick={restart}
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-tertiary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                textDecoration: 'underline',
              }}
            >
              Рассчитать заново
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 0 ? (
            <button onClick={goBack} class="btn-secondary" style={{ fontSize: '0.875rem' }}>
              ← Назад
            </button>
          ) : <div />}
          <button
            onClick={goNext}
            class="btn-primary"
            style={{ fontSize: '0.875rem', opacity: canProceed() ? 1 : 0.5, pointerEvents: canProceed() ? 'auto' : 'none' }}
            disabled={!canProceed()}
          >
            {step === 3 ? 'Рассчитать' : 'Далее →'}
          </button>
        </div>
      )}
    </div>
  );
}

function OptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '1rem',
        borderRadius: '12px',
        border: `1px solid ${selected ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
        backgroundColor: selected
          ? 'color-mix(in srgb, var(--color-accent) 14%, var(--color-bg-surface))'
          : 'var(--color-bg-surface)',
        color: 'var(--color-text-primary)',
        fontSize: '0.875rem',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        textAlign: 'left' as const,
        transition: 'all 200ms ease-out',
      }}
    >
      {label}
    </button>
  );
}

function CheckboxCard({
  label,
  checked,
  onChange,
  price,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  price?: { min: number; max: number };
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: '12px',
        border: `1px solid ${checked ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
        backgroundColor: checked
          ? 'color-mix(in srgb, var(--color-accent) 14%, var(--color-bg-surface))'
          : 'var(--color-bg-surface)',
        cursor: 'pointer',
        transition: 'all 200ms ease-out',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          width: '18px',
          height: '18px',
          accentColor: 'var(--color-accent-cta)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{label}</span>
      {price && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
          от {price.min.toLocaleString('ru-RU')} ₽
        </span>
      )}
    </label>
  );
}
