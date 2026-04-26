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
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function getNewPct(clientX: number) {
    const rect = containerRef.current!.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'ew-resize', userSelect: 'none', touchAction: 'none', width: '100%', height: '100%' }}
      onPointerDown={(e) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setPct(getNewPct(e.clientX)); }}
      onPointerMove={(e) => { if (dragging.current) { e.preventDefault(); setPct(getNewPct(e.clientX)); } }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerLeave={() => { dragging.current = false; }}
    >
      {/* Before image */}
      <img src={beforeSrc} alt={beforeAlt} draggable={false} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
      {/* After image clipped */}
      <img src={afterSrc} alt={afterAlt} draggable={false} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pct}% 0 0)` }} />
      {/* Divider */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct}%`, width: '2px', background: '#C8964A', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', borderRadius: '50%', background: '#C8964A', boxShadow: '0 2px 12px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10H14M6 10L3 7M6 10L3 13M14 10L17 7M14 10L17 13" stroke="#1A1310" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
      {/* Labels */}
      <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(26,19,16,0.75)', color: '#C4B09A', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '100px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>До</span>
      <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(160,82,45,0.9)', color: '#F5EDE4', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '100px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>После</span>
    </div>
  );
}
