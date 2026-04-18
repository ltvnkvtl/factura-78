import { useState, useRef } from 'preact/hooks';

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPct?: number;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt = 'До', afterAlt = 'После', initialPct = 50 }: Props) {
  const [pct, setPct] = useState(initialPct);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function getNewPct(clientX: number) {
    const rect = containerRef.current!.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'ew-resize', userSelect: 'none', touchAction: 'none', width: '100%', height: '100%' }}
      onPointerDown={(e) => { setDragging(true); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setPct(getNewPct(e.clientX)); }}
      onPointerMove={(e) => { if (dragging) { e.preventDefault(); setPct(getNewPct(e.clientX)); } }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <img src={beforeSrc} alt={beforeAlt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
      <img src={afterSrc} alt={afterAlt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pct}% 0 0)` }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct}%`, width: '2px', background: '#8B3A2E', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '44px', height: '44px', borderRadius: '50%', background: '#8B3A2E', boxShadow: '0 2px 12px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10H14M6 10L3 7M6 10L3 13M14 10L17 7M14 10L17 13" stroke="#FAF6F3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
      <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(250,246,243,0.9)', color: '#514557', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '100px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>До</span>
      <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(139,58,46,0.9)', color: '#FAF6F3', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '100px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>После</span>
    </div>
  );
}
