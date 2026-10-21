---
name: Executive Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is tailored for elite document creation, high-stakes career management, and dossier orchestration. The target audience comprises senior executives, technical specialists, and credentialed professionals requiring structured curriculum vitae assembly, portfolio compilation, and multi-document PDF export suites. 

The aesthetic marries high-density Swiss functionalism with modern SaaS refinement. It rejects playful frivolity in favor of composure, authoritative typographic hierarchy, and surgical alignment. The experience must evoke unyielding competence, calm control during high-pressure applications, and administrative mastery. Visual tension is achieved through stark contrasts between deep oceanic slates, hyper-crisp architectural lines, and luminous cobalt interaction cues.

## Colors

The palette establishes an immediate institutional gravity through layered slates offset by surgical signals of utility and success:

- **Primary Action (`#2563EB`)**: An authoritative, high-saturation royal cobalt reserved strictly for primary forward-motion CTAs (document compilation, bundle export, section publication) and active state anchors.
- **Deep Slate Corporate Anchor (`#0F172A`, `#1E293B`)**: Serves as the bedrock for high-contrast typography, sidebar navigation panels, document headers, and high-priority metadata containers.
- **Verification Emerald (`#10B981`)**: Dedicated to verified employment badges, signature confirmations, export readiness indicators, and profile completeness benchmarks.
- **Credential Amber (`#F59E0B`)**: Applied exclusively to high-tier certifications, security clearances, regulatory document tags, and draft state notifications.
- **Canvas & Surface System (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`)**: Clean, low-glare architectural foundations that isolate the A4 working document plane from surrounding application chrome.
- **Structural Boundaries (`#E2E8F0`, `#CBD5E1`)**: Precise, low-contrast boundary lines engineered for clean division without visual weight.

## Typography

Typographic scale is anchored by **Plus Jakarta Sans**, chosen for its geometric precision, contemporary neutral aperture, and legible numeric figures. When building dense CV forms and multi-column document settings, letter spacing tightening at larger scales keeps headers locked and structural, while body sizes feature optimized line-heights for rapid scan-reading.

An auxiliary inclusion of **JetBrains Mono** is utilized strictly for technical metadata, document hash validations, bundle file sizes, page limits (e.g., `A4 - 210 x 297mm`), and Supabase synchronized database timestamps.

## Layout & Spacing

The system enforces a dual-viewport layout engine: an operational UI shell and a fixed-ratio document rendering canvas:

- **Desktop Framework**: A 12-column variable grid flanked by a fixed 280px left management rail for multi-profile dossiers and categorical navigation. The working editor splits between dynamic form fields (6 columns) and a real-time scaled A4 preview viewport (6 columns).
- **Breakpoint Rules**:
  - `Desktop (> 1280px)`: Concurrent split-screen live preview, full drag handles visible, multi-bundle export queue pinned to right tray.
  - `Tablet (768px - 1279px)`: Editor collapses to single panel layout with a floating toggle trigger to inspect the live preview sheet.
  - `Mobile (< 767px)`: Form fields expand to 100% viewport width; the canvas transforms into an export status monitor with off-canvas configuration sheets.
- **Rhythmic Rules**: Internal card and component padding strictly abides by an 8pt spatial cadence. Structural gaps between distinct document segments adhere to `space-lg` (24px), while intra-component micro-spacing respects `space-xs` (4px) and `space-sm` (8px).

## Elevation & Depth

Visual hierarchy uses architectural layering: light borders define bounds, while deep slate ambient shadows represent physical paper lift.

- **Level 0 (Flat Canvas)**: Background `#F8FAFC`, bordered by `#E2E8F0` hairline strokes. No shadow. Used for base editor scaffolding, secondary inputs, and table headers.
- **Level 1 (Card & Section Containers)**: White surface (`#FFFFFF`) with a 1px border of `#E2E8F0` and subtle shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Active Drag State & Popovers)**: Elevated cards during drag-reordering, action menus, and dropdowns: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Level 3 (A4 Live Document Sheet)**: The physical document preview uses a deep dual-stage drop shadow replicating heavy paper stock: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`, framed by a delicate outer outline of `#CBD5E1`.
- **Level 4 (Modal Dialogs & Bundle Orchestration)**: Heavy focus overlay with backdrop blur (`backdrop-filter: blur(8px); background: rgba(15, 23, 42, 0.6)`) accompanied by an elevated dialog: `0 25px 50px -12px rgba(15, 23, 42, 0.25)`.

## Shapes

The design system adopts **Soft** geometry (`roundedness: 1`), conveying corporate discipline, engineering precision, and administrative cleanliness. Sharp, tight radii emphasize tabular alignment and modular density:

- Default components (inputs, secondary buttons, badges, list cards) use `0.25rem` (4px).
- Primary structural cards, export bundles, and live preview viewports use `rounded-lg` (`0.5rem` / 8px).
- Elevated system modals and full-sheet presentation overlays cap at `rounded-xl` (`0.75rem` / 12px).
- Circular pills (`9999px`) are restricted solely to status indicators, profile completeness meters, and numeric badge counts.

## Components

### Buttons
- **Primary**: Slate dark `#0F172A` background with crisp white text, transitioning to `#1E293B` on hover; or cobalt `#2563EB` with `#1D4ED8` on hover for primary export actions. Height: 40px; padding: 0 16px; radius: 4px; font: `label-md`.
- **Secondary**: White background with 1px `#E2E8F0` border and `#0F172A` text. Hover yields `#F8FAFC` background with `#CBD5E1` border.
- **Ghost/Icon**: Transparent background, `#64748B` text/icon color, shifting to `#F1F5F9` background and `#0F172A` text on interaction.

### Drag-and-Drop Sortable Export Cards
- Bounded card with 1px `#E2E8F0` border, `#FFFFFF` background.
- Left-flanked six-dot tactile drag handle (`#94A3B8`).
- When dragged: card scales to `1.02`, elevation increases to Level 2, and border shifts to `#2563EB`. Insertion indicator renders as a 2px horizontal bar in `#2563EB`.

### Category Tabs & Profile Completeness
- **Tabs**: Underlined horizontal bar or slate pill style. Active tab is styled with `#0F172A` text and a 2px bottom border in `#2563EB`. Inactive tabs render in `#64748B`.
- **Completeness Meter**: A segmented progress ring or 6px horizontal track (`#E2E8F0`) filled with Emerald (`#10B981`) upon field validation. Features mono-spaced percentage readout (`mono-code`) and tooltips detailing missing profile vectors.

### A4 Live Document Preview Card
- Scaled true-to-aspect-ratio (1:1.414) white surface anchored centrally against a `#F1F5F9` workspace canvas.
- Framed with Level 3 paper elevation, top-right zoom controls, page-break boundary watermarks, and real-time page-count status badges.

### Interactive Modal-Style Badges
- **Verified**: Emerald tint (`#ECFDF5`), `#065F46` label, with a 1px `#A7F3D0` border and mini checkmark icon.
- **Credential / Clearance (DC-3)**: Amber tint (`#FFFBEB`), `#92400E` label, `#FDE68A` border, featuring a click-to-expand popover detailing issuance authority, expiration, and cryptographic hash verification.

### Input Fields & Selectors
- Background: `#FFFFFF`; border: 1px `#CBD5E1`; text: `#0F172A`; placeholder: `#94A3B8`.
- Focus: Uncompromising 1px border in `#2563EB` combined with a 3px outer glow (`rgba(37, 99, 235, 0.15)`). Height: 40px; internal padding: 10px 12px.