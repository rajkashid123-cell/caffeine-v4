# Caffeine v4 — Design System Brief: Apple-Style + Per-Mode Warm Accents

## Purpose & Essence

A calm, professional desktop-only spec-building tool for makers and product teams. The app transforms vague ideas into clear, written specifications through a structured, click-driven interview. Apple-style aesthetic is the primary default (clean, light, soft, modern). Classic Caffeine (dark, terminal, technical) remains available as an optional theme. Five mode-specific warm accents (soft indigo, teal, sage, amber, soft violet), each with light/dark mode support, all sharing one authoritative design system. The experience is intentional and focused: one thing at a time, clear hierarchy, inline interactions only, no modals. After cloning a template, Launchers (non-technical users) see a simplified sidebar that de-emphasizes Design and Develop while keeping Organize, Live, and Market prominent.

## Visual Themes

| Theme | Font | Corners | Character | Default? |
|:---|:---|:---|:---|:---|
| **Apple-style** `data-theme='soils'` | Inter + GeistMono | 12px soft | Clean modern, calm, generous whitespace | ✓ Yes, primary |
| **Classic Caffeine** `data-theme='classic'` | JetBrains Mono | 2px sharp | Hacker terminal, powerful, tight | Optional |

## Apple-Style Palette (Primary)

| Element | Light | Dark | Purpose |
|:---|:---|:---|:---|
| Background | `0.97 0.008 80` warm off-white | `0.14 0.008 80` warm dark | Primary workspace, approachable |
| Card | `0.99 0.002 0` pure white | `0.2 0.01 80` elevated warm | Elevated containers, clean |
| Text | `0.2 0.02 80` warm dark | `0.92 0.01 0` light | Primary content, readable |
| Border | `0.88 0.006 80` soft | `0.28 0.01 80` subtle | Semantic separation, calm |
| Shadows | Soft, subtle | Soft, subtle | Elevation without harshness |

## Per-Mode Warm Accent Colors

| Mode | Color | L C H | Feeling | Launcher? |
|:---|:---|:---|:---|:---|
| **Design** | Soft indigo | `0.55 0.18 270` | Creative, building, calm | Muted 60% |
| **Develop** | Teal | `0.58 0.14 185` | Energy, focus, actionable | Muted 60% |
| **Organize** | Sage green | `0.58 0.12 155` | Order, growth, trust | Full |
| **Live** | Warm amber | `0.65 0.16 70` | Operational, friendly, alert | Full |
| **Market** | Soft violet | `0.55 0.16 300` | Discovery, community, growth | Full |

**No neon, no electric colors.** All accents work in both light and dark modes with appropriate contrast and warmth.

## Typography

**Primary (Apple-style):** Inter for display and body, GeistMono for code. Display: 32px Bold (1.3 lh). Heading L: 24px Semibold (1.3 lh). Body: 13px Regular (1.6 lh). Label: 14px Medium (1.4 lh). Normal letter-spacing, generous leading.

**Secondary (Classic Caffeine):** JetBrains Mono exclusively. Display: 32px Bold (1.2 lh). Heading L: 24px Bold (1.2 lh). Body: 12px Regular (1.5 lh). Tight letter-spacing, technical register.

## Layout & Structure

Desktop-only, minimum 1024px. Three-column fixed: sidebar (48px collapsed, 220px expanded), main workspace (flex-grow), right detail panel (360px fixed). All pages standardized on PageWrapper component. Stepped Design flow: full-screen, calm, no layout shift between steps. Launcher sidebar: Builder section (Design, Develop) visually quieter; Manage section (Organize, Live, Market) prominent. Both remain accessible.

## Motion & Language

**Functional motion only:** Mode switch 400ms, hover 150ms, tab switch 150ms. All transitions respect prefers-reduced-motion (1ms). Layouts stable; no elements shift or resize.

**Plain English terminology:** Credits (not Cycles), Daily usage (not Burn rate), Days remaining (not Runway), Go live (not Deploy), All good (not Healthy).

## Token Enforcement

All tokens in `src/frontend/src/index.css` as OKLCH CSS custom properties. Never hardcoded hex/rgb. Tailwind config wired to CSS variables. Components use semantic tokens only. If a new design need arises, add it to the token system first, then use it everywhere.

## Quality Bar

Bench: Linear, Stripe, Apple. Apple-style default emphasizes calm, approachability, modern clarity. Classic Caffeine available for users who prefer hacker aesthetic. Five warm, inviting per-mode accents. Strong contrast. No generic defaults. Professional, intentional. Launcher sidebar guides non-technical users toward operational workflows while keeping all tools accessible.
