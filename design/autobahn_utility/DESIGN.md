# Design System Document: KFZ-Tracker Visual Identity

## 1. Overview & Creative North Star: "The Precision Navigator"

This design system transcends standard utility to provide a "Precision Navigator" experience for German vehicle management. Moving away from the generic, boxy layouts of typical fleet software, we embrace an **Editorial Utility** aesthetic. 

The Creative North Star is defined by **Structured Fluidity**: the interface should feel as engineered and high-performance as the vehicles it tracks. We break the "template" look by using intentional white space, high-contrast typographic scales, and a layered surface architecture that prioritizes data clarity without sacrificing premium feel.

---

## 2. Colors & Surface Philosophy

Our palette is rooted in a deep, authoritative blue, supported by a sophisticated range of "Cool Grays" that prevent the UI from feeling flat.

### Core Palette
- **Primary (`#1A56DB`):** The "Engine." Used for primary actions and brand presence. Use `primary-container` (#003fb1) for high-intensity states.
- **Surface & Background (`#F9FAFB`):** The "Canvas." A crisp, light gray that reduces eye strain compared to pure white.
- **Status Tones:** 
    - *Success:* Green (Reliability)
    - *Warning:* Yellow/Orange (Attention)
    - *Destructive:* Red (Critical)

### The "No-Line" Rule
To achieve a high-end feel, **prohibit 1px solid borders for sectioning.** Boundaries must be defined through:
1. **Tonal Shifts:** Placing a `surface-container-low` section against the `background`.
2. **Asymmetric Padding:** Using white space to imply grouping.

### The "Glass & Gradient" Rule
For floating elements (Modals, Popovers), use a **Glassmorphism** approach:
- Background: `surface-container-lowest` at 85% opacity.
- Effect: `backdrop-blur(12px)`.
- **Signature Texture:** Apply a subtle linear gradient to main Action Buttons (Primary to Primary-Container) to give a tactile, "machined" finish.

---

## 3. Typography: Geist Sans

We utilize **Geist**, a typeface engineered for precision. Our hierarchy is designed to make complex German compound words (e.g., *Fahrzeugversicherung*) legible and elegant.

| Level | Size | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Display-MD** | 2.75rem | 700 (Bold) | Hero dashboard metrics |
| **Headline-SM** | 1.5rem | 600 (SemiBold) | Main section headers |
| **Title-MD** | 1.125rem | 500 (Medium) | Card titles, Vehicle names |
| **Body-LG** | 1rem | 400 (Regular) | Primary data points |
| **Label-MD** | 0.75rem | 600 (SemiBold) | Metadata tags, Overlines |

**Editorial Note:** Use `Label-MD` in all-caps with 0.05em letter-spacing for category headers to create an authoritative, "spec-sheet" feel.

---

## 4. Elevation & Depth: Tonal Layering

We convey hierarchy through **Tonal Layering** rather than structural lines. The UI is a series of stacked sheets.

- **The Layering Principle:** 
    - Base Level: `surface` (#F9FAFB)
    - Section Level: `surface-container-low`
    - Interaction Level (Cards): `surface-container-lowest` (#FFFFFF)
- **Ambient Shadows:** For floating menus, use a "Cloud Shadow": `0 20px 40px -12px rgba(0, 63, 177, 0.08)`. The shadow color is a tinted version of our Primary Blue, creating a more natural integration with the surface.
- **The Ghost Border:** If a container needs extra definition (e.g., in high-density data views), use a `ring-1` with `outline-variant` at **10% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons (Schaltflächen)
- **Primary:** `primary` background with a subtle top-down gradient. Text: `on-primary`. Radius: `0.625rem`.
- **Secondary:** Transparent background with a `ghost border`. 
- **States:** On hover, shift the background to `primary-fixed-dim`.

### Input Fields (Eingabefelder)
- **Style:** Minimalist. No heavy borders. Use `surface-container-high` as a subtle background fill.
- **Focus State:** A 2px ring of `primary` with a 4px soft outer glow.
- **Labels:** Always use `Label-MD` sitting 4px above the input.

### Cards & Vehicle Lists (Fahrzeuglisten)
- **Constraint:** Forbidden use of divider lines between list items. 
- **Separation:** Use `8px` of vertical white space or alternating tonal shifts (`surface` to `surface-container-low`).
- **Nesting:** Vehicle details should appear on a `surface-container-lowest` card, creating a "lift" effect against the app background.

### Custom Component: Status-Chip
Used for "TÜV fällig" or "In Wartung". 
- **Design:** Non-pill shape. Use the `0.25rem` radius. Soft background (15% opacity of the status color) with high-contrast text.

---

## 6. Do's and Don'ts

### Do
- **DO** use German terminology consistently (e.g., "Kennzeichen" instead of "License Plate").
- **DO** leverage "Breathing Room." If a layout feels cluttered, increase the padding-base by 1.5x rather than adding a divider.
- **DO** use Geist's tabular-nums feature for mileage (Kilometerstand) to ensure numbers align perfectly in lists.

### Don't
- **DON'T** use 100% black text. Use `on-surface-variant` (#434654) for body text to maintain a premium, softer contrast.
- **DON'T** use standard shadows. If an element doesn't look like it's naturally lifting via color, re-evaluate the layering.
- **DON'T** use sharp corners. Every interactive element must respect the `0.625rem` (rounded-xl) or `0.25rem` (sm) radius scale to maintain the system's "engineered" softness.