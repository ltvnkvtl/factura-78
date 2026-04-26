# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Factura 78
**Generated:** 2026-04-12 15:42:31
**Updated:** 2026-04-26
**Category:** E-commerce Luxury

---

## Global Rules

### Color Palette

| Role              | Hex       | CSS Variable                  |
| ----------------- | --------- | ----------------------------- |
| Background base   | `#F2F2F2` | `--color-bg-base`             |
| Background surface| `#ffffff`  | `--color-bg-surface`          |
| Background elevated| `#e8e3df`| `--color-bg-elevated`         |
| Border default    | `#B8A296` | `--color-border-default`      |
| Border subtle     | `#ddd5cf` | `--color-border-subtle`       |
| Text primary      | `#231A1B` | `--color-text-primary`        |
| Text secondary    | `#514557` | `--color-text-secondary`      |
| Text tertiary     | `#6E5B58` | `--color-text-tertiary`       |
| Accent (links)    | `#514557` | `--color-accent`              |
| Accent hover      | `#3d3342` | `--color-accent-hover`        |
| CTA (buttons)     | `#653539` | `--color-accent-cta`          |
| CTA hover         | `#4f2a2c` | `--color-accent-cta-hover`    |
| On accent (text)  | `#F2F2F2` | `--color-on-accent`           |
| Promo background  | `#653539` | `--color-promo-bg`            |
| Promo text        | `#F2F2F2` | `--color-promo-text`          |
| Success           | `#16a34a` | `--color-success`             |
| Error             | `#dc2626` | `--color-error`               |
| Info              | `#514557` | `--color-info`                |

**Color Notes:** Единственная тема. Тёплая нейтральная палитра — бежевый, пыльный фиолетовый, бургундский. Без тёмной темы и переключателя.

### Typography

- **Heading Font:** Manrope (`--font-heading`) — weight 700
- **Body Font:** Cabin (`--font-body`) — weight 400–700
- **Mono Font:** JetBrains Mono (`--font-mono`)
- **Mood:** warm, craft, premium artisan, refined neutral
- **Google Fonts:** [Manrope + Cabin](https://fonts.google.com/share?selection.family=Manrope:wght@400;500;600;700;800|Cabin:wght@400;500;600;700)

**CSS Import:**

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Cabin:wght@400;500;600;700&display=swap');
```

### Spacing Variables


| Token         | Value             | Usage                     |
| ------------- | ----------------- | ------------------------- |
| `--space-xs`  | `4px` / `0.25rem` | Tight gaps                |
| `--space-sm`  | `8px` / `0.5rem`  | Icon gaps, inline spacing |
| `--space-md`  | `16px` / `1rem`   | Standard padding          |
| `--space-lg`  | `24px` / `1.5rem` | Section padding           |
| `--space-xl`  | `32px` / `2rem`   | Large gaps                |
| `--space-2xl` | `48px` / `3rem`   | Section margins           |
| `--space-3xl` | `64px` / `4rem`   | Hero padding              |


### Shadow Depths


| Level         | Value                          | Usage                       |
| ------------- | ------------------------------ | --------------------------- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`   | Subtle lift                 |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)`    | Cards, buttons              |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)`  | Modals, dropdowns           |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |


---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--color-accent-cta);   /* #653539 */
  color: var(--color-on-accent);          /* #F2F2F2 */
  padding: 12px 24px;
  border-radius: 8px;
  font-family: var(--font-heading);
  font-weight: 600;
  transition: background-color 200ms ease-out, transform 150ms ease-out;
  cursor: pointer;
  border: none;
}

.btn-primary:hover {
  background: var(--color-accent-cta-hover);  /* #4f2a2c */
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);       /* #231A1B */
  border: 1px solid var(--color-border-default);  /* #B8A296 */
  padding: 12px 24px;
  border-radius: 8px;
  font-family: var(--font-heading);
  font-weight: 600;
  transition: all 200ms ease-out;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--color-bg-elevated);
  border-color: var(--color-accent);      /* #514557 */
}
```

### Cards

```css
.card {
  background: var(--color-bg-surface);    /* #ffffff */
  border: 1px solid var(--color-border-subtle);  /* #ddd5cf */
  border-radius: 12px;
  padding: 24px;
  transition: border-color 200ms ease-out, box-shadow 200ms ease-out;
}

.card:hover {
  border-color: var(--color-border-default);  /* #B8A296 */
  box-shadow: 0 4px 24px rgba(101, 53, 57, 0.12);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid var(--color-border-default);  /* #B8A296 */
  border-radius: 8px;
  font-size: 16px;
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: var(--color-accent);      /* #514557 */
  outline: none;
  box-shadow: 0 0 0 3px rgba(81, 69, 87, 0.15);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(35, 26, 27, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--color-bg-surface);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 25px rgba(101, 53, 57, 0.15);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Liquid Glass

**Keywords:** Flowing glass, morphing, smooth transitions, fluid effects, translucent, animated blur, iridescent, chromatic aberration

**Best For:** Premium SaaS, high-end e-commerce, creative platforms, branding experiences, luxury portfolios

**Key Effects:** Morphing elements (SVG/CSS), fluid animations (400-600ms curves), dynamic blur (backdrop-filter), color transitions

### Page Pattern

**Pattern Name:** Horizontal Scroll Journey

- **Conversion Strategy:** Immersive product discovery. High engagement. Keep navigation visible.
28,Bento Grid Showcase,bento,  grid,  features,  modular,  apple-style,  showcase", 1. Hero, 2. Bento Grid (Key Features), 3. Detail Cards, 4. Tech Specs, 5. CTA, Floating Action Button or Bottom of Grid, Card backgrounds: #F5F5F7 or Glass. Icons: Vibrant brand colors. Text: Dark., Hover card scale (1.02), video inside cards, tilt effect, staggered reveal, Scannable value props. High information density without clutter. Mobile stack.
29,Interactive 3D Configurator,3d,  configurator,  customizer,  interactive,  product", 1. Hero (Configurator), 2. Feature Highlight (synced), 3. Price/Specs, 4. Purchase, Inside Configurator UI + Sticky Bottom Bar, Neutral studio background. Product: Realistic materials. UI: Minimal overlay., Real-time rendering, material swap animation, camera rotate/zoom, light reflection, Increases ownership feeling. 360 view reduces return rates. Direct add-to-cart.
30,AI-Driven Dynamic Landing,ai,  dynamic,  personalized,  adaptive,  generative", 1. Prompt/Input Hero, 2. Generated Result Preview, 3. How it Works, 4. Value Prop, Input Field (Hero) + 'Try it' Buttons, Adaptive to user input. Dark mode for compute feel. Neon accents., Typing text effects, shimmering generation loaders, morphing layouts, Immediate value demonstration. 'Show, don't tell'. Low friction start.
- **CTA Placement:** Floating Sticky CTA or End of Horizontal Track
- **Section Order:** 1. Intro (Vertical), 2. The Journey (Horizontal Track), 3. Detail Reveal, 4. Vertical Footer

---

## Anti-Patterns (Do NOT Use)

- ❌ Vibrant & Block-based
- ❌ Playful colors

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- No emojis used as icons (use SVG instead)
- All icons from consistent icon set (Heroicons/Lucide)
- `cursor-pointer` on all clickable elements
- Hover states with smooth transitions (150-300ms)
- Light mode: text contrast 4.5:1 minimum
- Focus states visible for keyboard navigation
- `prefers-reduced-motion` respected
- Responsive: 375px, 768px, 1024px, 1440px
- No content hidden behind fixed navbars
- No horizontal scroll on mobile

