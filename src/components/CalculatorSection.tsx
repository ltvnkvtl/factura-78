import { useState, useRef } from 'preact/hooks';
import QuizCalculator from './QuizCalculator';

export default function CalculatorSection() {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  function openCalculator() {
    setExpanded(true);
    setTimeout(() => {
      let wrapper: Element | null = sectionRef.current;
      while (wrapper && wrapper.tagName.toLowerCase() !== 'astro-island') {
        wrapper = wrapper.parentElement;
      }
      const target = wrapper?.previousElementSibling ?? sectionRef.current;
      if (!target) return;
      const headerHeight = (document.querySelector('header') as HTMLElement)?.offsetHeight ?? 0;
      const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 50);
  }

  return (
    <section
      id="calculator"
      ref={sectionRef}
      class="section"
      style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}
    >
      <div class="container">
        {!expanded ? (
          <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-accent)',
              marginBottom: '0.75rem',
            }}>
              Онлайн-калькулятор
            </p>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
              fontWeight: 700,
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-heading)',
            }}>
              Узнайте стоимость за&nbsp;1&nbsp;минуту
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem' }}>
              Ответьте на 4 вопроса — получите ориентировочную цену и срок
            </p>
            <button
              onClick={openCalculator}
              class="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}
            >
              Открыть калькулятор
            </button>
          </div>
        ) : (
          <QuizCalculator />
        )}
      </div>
    </section>
  );
}
