---
name: Cyber Defense Operations
colors:
  surface: '#0b1322'
  surface-dim: '#0b1322'
  surface-bright: '#31394a'
  surface-container-lowest: '#060e1d'
  surface-container-low: '#141c2b'
  surface-container: '#18202f'
  surface-container-high: '#222a3a'
  surface-container-highest: '#2d3545'
  on-surface: '#dbe2f8'
  on-surface-variant: '#c1c6d5'
  inverse-surface: '#dbe2f8'
  inverse-on-surface: '#293041'
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
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#ff5451'
  on-tertiary-container: '#5c0008'
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
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0b1322'
  on-background: '#dbe2f8'
  surface-variant: '#2d3545'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
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
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for mission-critical Security Operations Center (SOC) environments and rapid incident response teams. The aesthetic leans into high-density, technical precision, combining utilitarian clarity with an authoritative, modern enterprise cybersecurity tone. It eliminates ornamental friction, prioritizing cognitive speed, rapid triage, and unambiguous state differentiation under high-stress conditions.

Visual characteristics balance high-contrast technical data display with structural restraint:
- Crisp linear boundaries that segment high-volume threat intelligence.
- Laser-targeted chromatic signals where color strictly represents operational status, severity, or active intent.
- Compact, information-dense layouts optimized for incident timelines, log forensics, telemetry feeds, and responsive mobile inspections during off-hours paging.

## Colors

The chromatic architecture operates on an intentional dark palette designed for extended operational shifts, zero optical fatigue, and clear visual hierarchy.

- **Background Canvas (`#101827`):** Deep oceanic void that grounds the visual workspace.
- **Card & Panel Surface (`#18263B`):** Slightly elevated slate tone that distinguishes interactive operational surfaces from the canvas.
- **Structural Stroke (`#23354E`):** Low-contrast boundary tone providing surgical structure without visual noise.
- **Primary Operational Accent (`#2787F5`):** Hyper-focused cobalt blue for affirmative workflows, active navigation, interactive selections, and command issuance.
- **Critical / Tier-1 Severity (`#EF4444`):** High-saturation crimson reserved exclusively for active breaches, failed authentications, critical alerts, and destructive confirmations.
- **Warning / Tier-2 Severity (`#F59E0B`):** Amber tone indicating anomalies, SLA degradation, and unverified postures.
- **Resolved / Tier-3 Posture (`#25B887`):** Emerald green communicating containment, operational integrity, passed checks, and mitigated vulnerabilities.
- **Text & Telemetry:** Pure white (`#F9FAFB`) for critical metric readouts, cool muted grey (`#94A3B8`) for contextual metadata, and deep slate (`#64748B`) for disabled states and timestamp labels.

## Typography

Typography prioritizes tabular alignment, rapid scan-readiness, and distinct separation between operational labels and standard human communication.

- **Primary Typeface (Inter):** Leveraged for UI structural headers, navigational elements, and conversational notes. Its tight tracking and tall x-height guarantee readability across multi-column data views.
- **Technical Monospace (JetBrains Mono):** Dedicated to technical telemetry, IP addresses, CVE hashes, incident sequence codes, status badges, and terminal log outputs.
- Numbers within tables, time indicators, and incident counts must always enable tabular figures (`font-variant-numeric: tabular-nums`) to prevent optical jitter during live real-time stream updates.

## Layout & Spacing

The layout operates on a compact, responsive 12-column grid system tuned for dense incident investigation consoles that cleanly degrade to a single-column triage layout on mobile viewports.

- **Desktop (1200px+):** 12 columns with `gutter-lg` (1.5rem) and `margin-lg` (2rem). Structured for 3-pane operations: active queue list, detailed incident dossier, and chronological telemetry feed.
- **Tablet (768px – 1199px):** 8 columns with `gutter` (1rem) and `margin-md` (1.5rem). The telemetry feed collapses into a drawer or tabbed panel.
- **Mobile (Below 768px):** 4 columns with `gutter` (1rem) and `margin` (1rem). Direct vertical stack where high-priority severity indicators, host IDs, and quick-action buttons pin to the bottom safe-area.
- **Density:** Interfaces employ tight interior component paddings (`space-xs` to `space-md`) to ensure high density without sacrificing touch targets (minimum 44px hit-box enforced via invisible bounding margins on mobile).

## Elevation & Depth

Visual hierarchy does not rely on diffused skeuomorphic drop shadows. Instead, depth is constructed through tonal surface stepping paired with razor-sharp structural strokes.

- **Ground (Base Canvas):** `#101827` - Host canvas, app shell, and background workspace.
- **Level 1 (Panels & Cards):** `#18263B` coupled with a continuous 1px stroke of `#23354E`.
- **Level 2 (Popovers, Modals, Flyout Drawers):** `#1E2F48` with a 1px stroke of `#344C6E` and an ambient, low-spread dark shadow (`0px 12px 32px rgba(0, 0, 0, 0.5)`).
- **Incident Criticality Elevation:** Critical alerts and focused incident cards cast a subtle directional inner glow or perimeter ring in the incident's semantic color (e.g., `0 0 0 1px #EF4444` for Tier-1 Critical), directing immediate visual focus.

## Shapes

The design system employs a restrained, soft-cornered visual grammar (`roundedness: 1`). Soft corners preserve the disciplined, military-technical cadence of an enterprise command center while avoiding the abrasive harshness of total 0px sharpness.

- **Base Radius (0.25rem / 4px):** Standard buttons, input controls, metric chips, and nested sub-panels.
- **Surface Radius (0.5rem / 8px):** Main incident cards, modal dialogs, flyout drawers, and containment charts.
- **Badge & Pill Elements (0.75rem / 12px):** Monospace tags, status indicators, and SLA micro-counters.

## Components

### Buttons & Quick Actions
- **Primary:** Background `#2787F5`, text `#FFFFFF`, border none, hover state `#1D6FD8`. Active states trigger a swift 0.1s scale compression.
- **Destructive / Containment:** Background `#EF4444`, text `#FFFFFF`, hover `#DC2626`. Utilized for network isolation, asset wipe, and revoking tokens.
- **Secondary / Ghost:** Transparent background with 1px border `#23354E`, text `#94A3B8`, hover border `#344C6E`, hover text `#FFFFFF`.
- **Height & Sizing:** Standard 36px desktop / 44px mobile touch target. Monospace label subtext supported for shortcut triggers (`[CMD+K]`).

### Severity Badges & Status Chips
- Built using `label-sm` or `label-md` JetBrains Mono, uppercase, with 4px corner radius and a 1px border.
- **Critical (P1):** Background `rgba(239, 68, 68, 0.12)`, text `#EF4444`, border `rgba(239, 68, 68, 0.3)`. Includes an animated pulsing indicator dot.
- **Warning (P2):** Background `rgba(245, 158, 11, 0.12)`, text `#F59E0B`, border `rgba(245, 158, 11, 0.3)`.
- **Resolved / Normal (P3/P4):** Background `rgba(37, 184, 135, 0.12)`, text `#25B887`, border `rgba(37, 184, 135, 0.3)`.

### Incident Queue Cards
- Container `#18263B` with border `#23354E`.
- Left-edge 3px vertical accent border reflecting the incident's severity level.
- Internal layout features a two-row distribution: incident ID, title, and timestamp on top; affected host IP, assignee, and MITRE ATT&CK tag along the bottom.
- On active state or triage selection: card border shifts to `#2787F5` with zero layout displacement.

### Form Inputs & Query Fields
- Background `#101827`, 1px solid `#23354E`, text `#F9FAFB`. Placeholder `#64748B`.
- Focus state: border color `#2787F5` with an external 2px ring at `rgba(39, 135, 245, 0.25)`.
- Search bars support pre-pended monospace syntax tokens (`field:value`) and clear action icons.

### Telemetry Timelines & Audit Lists
- Monospace timestamp column left-aligned (`#64748B`), connected via a 1px vertical trace line (`#23354E`).
- Log event entries feature alternating row tinting on deep inspection tables.
- Text selection across raw logs highlights with high-contrast `#2787F5` selection background.

### Checkboxes & Toggle Controls
- Custom square radio/checkbox controls (16x16px) with 1px border `#344C6E` on `#101827`.
- Checked state fills with `#2787F5` using a sharp white linear checkmark.
- Critical toggles (e.g., "Isolate Endpoint") require two-step slide engagement or confirmation modal confirmation.