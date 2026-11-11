---
name: SENTINEL Tactical SOC
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c1c6d5'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#8b919f'
  outline-variant: '#414753'
  surface-tint: '#a8c8ff'
  primary: '#a8c8ff'
  on-primary: '#003062'
  primary-container: '#3791ff'
  on-primary-container: '#002956'
  inverse-primary: '#005eb4'
  secondary: '#57dda9'
  on-secondary: '#003826'
  secondary-container: '#00ab7b'
  on-secondary-container: '#003624'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a8c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#00468a'
  secondary-fixed: '#76fac4'
  secondary-fixed-dim: '#57dda9'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#005139'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 0.75rem
  gutter-desktop: 1.25rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system projects mission-critical authority, defensive vigilance, and precision operations for security operations centers (SOC) and enterprise incident response teams. The interface balances high-density data ingestion with rapid triage ergonomics, reducing cognitive fatigue during prolonged operational shifts and high-stress security breaches.

The visual style blends **High-Precision Corporate Modern** with an **Instrumented Dark Cyber-Grid**:
- **Palette & Atmosphere:** Void-level blue-grays establish deep contrast without pure black eye strain. Key telemetry and alerts cut through cleanly with signal-level chromatic clarity.
- **Micro-Accents:** Restrained luminous halos, micro-borders with sub-pixel crispness, and monospaced telemetry values denote operational readiness and systemic control.
- **Emotional Response:** Inspires decisive triage, defensive resilience, uncompromised structural stability, and analytical exactitude.

## Colors

The system uses an ambient-attenuated dark mode architecture calibrated for 24/7 continuous SOC monitoring. Surfaces tier up structurally through calculated value gradations rather than stark light emission.

### Operational Roles
- **Base Canvas (`#101827`):** The foundational viewport floor. Immerses the analyst in deep negative space.
- **Structural Surfaces (`#18263B`):** Structural panels, side navigation rails, top app headers, and collapsible dock trays.
- **Elevated Surfaces (`#1F324D`):** Dynamic cards, floating diagnostic overlays, incident tickets, and contextual flyouts.
- **Accent Primary (`#2787F5`):** Interactive focal points, primary action triggers, active tabs, and primary thread indicators.
- **System Telemetry & Signals:**
  - **Success / Mitigated (`#25B887`):** Normalized health checks, patched vulnerabilities, and resolved incidents.
  - **Warning / Medium Severity (`#F59E0B`):** Elevated risk anomalies, pending expirations, and warning-tier alerts.
  - **Critical / High Severity (`#EF4444`):** Active intrusions, critical CVE discoveries, compromised endpoints, and destructive actions.
- **Borders & Dividers (`#2E4365` or `rgba(255, 255, 255, 0.08)`):** Explicit visual demarcation boundaries isolating operational partitions.
- **Typography Tone:**
  - **Primary Text (`#F8FAFC`):** Maximum contrast for rapid scanning of IOC signatures, telemetry metrics, and alert titles.
  - **Secondary / Supporting Text (`#94A3B8`):** Timestamp metadata, table column headers, and ancillary field descriptions.

## Typography

The type system prioritizes structural hierarchy and immediate legibility under high-density constraints:
- **Inter:** Drives human-language clarity across system headlines, incident summaries, modal copy, and analytical writeups. Tight letter-spacing rules ensure modern, polished density without clutter.
- **JetBrains Mono:** Dedicated to computational metrics, hashes, IP addresses, CVE tracking codes, port tags, timestamps, and status labels. Its distinct character shapes prevent critical recognition errors (such as mistaking `0` for `O`, or `1` for `l`) during rapid forensic investigation.

## Layout & Spacing

This design system uses a 12-column fluid grid tailored for wide-display operations centers and adaptable field laptops:

### Layout Rhythm & Breakpoints
- **Mobile (< 768px):** Single-column stack with dynamic sliding drawers for filter controls. Top header converts to an edge-docked status indicator. Outermost page padding matches `margin` (1rem).
- **Tablet (768px - 1199px):** 8-column layout. Side navigation collapses to an icon rail (64px). Secondary metric feeds collapse into horizontal scroll rows.
- **Desktop / Wallboard (>= 1200px):** 12-column persistent workspace. Global side nav (240px) anchors left, main triage grid spans column spans (e.g., 8 cols for incident grid, 4 cols for live threat stream), bounded by `margin-desktop` (2rem).

### Component Density Rules
- Density is tightly controlled: tabular rows leverage a strict 36px/44px height profile to maximize visible events per viewport.
- Gaps between telemetry widgets conform to `space-md` (0.75rem) to preserve tactical density while keeping visual relationships unambiguous.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows, which muddy dark interfaces. Depth is expressed through **Tonal Stacking**, **Crisp Perimeter Boundaries**, and **Radiant Glow Accents**:

- **Ground Level (Canvas `#101827`):** Deepest plane, strictly reserved for base canvas background.
- **Tier 1 Surface (`#18263B`):** Structural sidebars, primary control toolbars, and dashboard layout cards. Encased in a `1px` border of `#2E4365`.
- **Tier 2 Surface (`#1F324D`):** Hovered states, active triage rows, modal dialogs, and popovers. Accompanied by a diffused, low-opacity ambient drop shadow: `0 8px 24px rgba(0, 0, 0, 0.45)`.
- **Radiant Status Lighting:** Critical and high-priority objects utilize localized inset and out-of-bounds chromatic glows rather than standard shadows:
  - Critical Severity Glow: `0 0 12px rgba(239, 68, 68, 0.25)` with a 1px border of `#EF4444`.
  - Active Threat Focus Glow: `0 0 16px rgba(39, 135, 245, 0.2)` with a 1px border of `#2787F5`.

## Shapes

The interface embraces a precise, architectural silhouette using a **Soft / Technical (`roundedness: 1`)** geometry:
- **Base Components:** Standard inputs, metric panels, data rows, action buttons, and severity containers feature a `0.25rem` (4px) corner radius. This conveys structural precision without the harshness of a pure 0px edge.
- **Floating Modals & Cards:** Leverage `rounded-lg` (0.5rem / 8px) to soften larger surfaces without appearing playful or consumer-oriented.
- **Pill Exceptions:** Threat status badges, triage tags, and health indicators utilize full capsule rounding (`rounded-full`) to contrast sharply against geometric cards and data grids.

## Components

### Buttons
- **Primary:** Background `#2787F5`, text `#F8FAFC`, font weight 600, border radius `0.25rem`. Hover state scales background brightness to `#3B95F8` with a subtle focus glow `0 0 0 2px rgba(39, 135, 245, 0.4)`.
- **Secondary / Ghost:** Transparent surface with a `1px solid #2E4365` border. Text `#94A3B8`. Hover converts background to `rgba(31, 50, 77, 0.5)` and text to `#F8FAFC`.
- **Destructive / Containment:** Background `rgba(239, 68, 68, 0.12)`, border `1px solid #EF4444`, text `#EF4444`. Used for incident isolation, host containment, and credential revocations.

### Chips & Status Pills
- Compact height (20px to 24px), font `JetBrains Mono` (`label-sm`), uppercase tracking.
- **Critical Pill:** Background `rgba(239, 68, 68, 0.15)`, text `#EF4444`, border `1px solid rgba(239, 68, 68, 0.3)`. Includes an animated pulsing radial dot indicator.
- **Mitigated Pill:** Background `rgba(37, 184, 135, 0.15)`, text `#25B887`, border `1px solid rgba(37, 184, 135, 0.3)`.

### Administrative Data Tables
- Header row styled in `#101827`, typography `JetBrains Mono` (`label-md`), text color `#94A3B8`, border-bottom `1px solid #2E4365`.
- Data rows on surface `#18263B`. Row hover transitions smoothly to `#1F324D` with a high-contrast left border highlight (`3px solid #2787F5`).
- Monospaced cell formatting for IP addresses, MAC identifiers, and timestamps ensures aligned, easily comparable vertical scanning.

### Input Fields & Search Bars
- Background `#101827`, border `1px solid #2E4365`, text `#F8FAFC`, placeholder `#94A3B8` (opacity 60%).
- Active focus state changes border to `#2787F5` with an outer ring `0 0 0 1px #2787F5`.
- Incident search bar incorporates leading monospaced search syntax markers (`grep:`, `ip:`, `cve:`).

### Metric Cards & Analytical Panels
- Background `#18263B`, elevated card surface `#1F324D` for inner sections. Border `1px solid #2E4365`.
- Displays top-right operational health indicators, large-format numerical metrics in `Inter` Bold, accompanied by mini sparkline diagrams in `#2787F5` or severity colors.

### Selection Controls (Checkboxes & Radios)
- Custom square box (radius 2px), background `#101827`, border `1px solid #2E4365`.
- Selected state fills with `#2787F5` and renders a crisp `#F8FAFC` check glyph.