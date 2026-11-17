# CURIOFORGE — Design System

> **Status:** Planned. No UI is built yet. Tokens below are the single visual source of truth for `client/`.
> Scope from `PRD.md`, structure from `ARCHITECTURE.md`, limits from `RULES.md` (C-11: no ad-hoc colours or spacing).
> Contrast ratios are **approximate** and must be re-checked with a contrast tool in Phase 7.

## 1. Brand Identity

| Item | Value |
|---|---|
| Name | CURIOFORGE |
| Tagline | Turning Curiosity into Invention |
| Metaphor | A forge: raw curiosity (spark) shaped into something real |
| Personality | Curious, encouraging, precise, never childish, never cold |
| Logo (MVP) | Text wordmark "CURIO" in primary text colour + "FORGE" in blue→purple gradient, with a small Lucide `Sparkles` or `Flame` glyph. No custom artwork required |
| Voice | Short sentences, "Let's find out", asks before telling, plain words for grade 6–8 |

## 2. Design Philosophy

1. **Premium dark tech**, calm and focused, not neon.
2. **Workspace, not chatbot.** The Curiosity screen is a two-pane workspace (conversation + live Idea Board), never a single endless chat column.
3. **Show structure.** AI output appears as cards, chips, steps and callouts, not walls of text.
4. **Honest UI.** Simulations, AI content and live data are always labelled.
5. **Minimal, meaningful motion.** Motion confirms an action or reveals new content; nothing decorative.
6. **Readable first.** Big type, generous spacing, strong contrast.

## 3. Colour Palette

### Backgrounds and surfaces
| Token | HEX | Use |
|---|---|---|
| `bg-deep` | `#080C16` | App background behind everything |
| `bg-base` | `#0D1322` | Main page background |
| `surface` | `#131B2E` | Cards, panels |
| `surface-raised` | `#1A2440` | Hovered/elevated cards, popovers, inputs |
| `surface-charcoal` | `#161922` | Neutral panels (code-like areas, data tables) |
| `border-subtle` | `#232D4A` | Default 1 px borders |
| `border-strong` | `#34416A` | Hover/active borders, dividers |

### Text
| Token | HEX | Approx. contrast on `bg-base` | Use |
|---|---|---|---|
| `text-primary` | `#EAEEF9` | ~15:1 | Headings, body |
| `text-secondary` | `#AAB4D0` | ~8.5:1 | Secondary text |
| `text-muted` | `#8490B0` | ~5.5:1 | Hints, captions (minimum size 14 px) |
| `text-on-accent` | `#FFFFFF` | 4.6:1 on `primary-600` | Text inside filled primary buttons |

### Accents
| Token | HEX | Use |
|---|---|---|
| `primary-400` | `#6EA0FF` | Links, focus rings, icons, text accents on dark |
| `primary-500` | `#4F8CFF` | Highlights, chart strategy B line |
| `primary-600` | `#3B6FE0` | Filled primary buttons (white text) |
| `accent-400` | `#A78BFA` | Purple text/accents (readable on dark) |
| `accent-500` | `#8B5CF6` | Purple decorative fills, gradient end, chart strategy A line |
| `gradient-brand` | `linear-gradient(135deg, #4F8CFF 0%, #8B5CF6 100%)` | Wordmark, hero accents, progress. **Not** behind small body text |

### Semantic
| Token | HEX | Use (always with icon + text) |
|---|---|---|
| `success` | `#34D399` | Success, "ready", good result |
| `warning` | `#FBBF24` | Caution, supervision notes |
| `danger` | `#F87171` | Errors, unsafe |
| `info` | `#38BDF8` | Info, "Simulation" label background tint |

Tinted backgrounds for semantic callouts use the colour at 12–15% opacity over `surface`, with a 1 px border at 35% opacity.

### Tailwind mapping (documentation of intent; implemented in Phase 0)
```js
// tailwind.config.js (theme.extend.colors)
colors: {
  bg:      { deep: '#080C16', base: '#0D1322' },
  surface: { DEFAULT: '#131B2E', raised: '#1A2440', charcoal: '#161922' },
  line:    { subtle: '#232D4A', strong: '#34416A' },
  ink:     { primary: '#EAEEF9', secondary: '#AAB4D0', muted: '#8490B0' },
  primary: { 400: '#6EA0FF', 500: '#4F8CFF', 600: '#3B6FE0' },
  accent:  { 400: '#A78BFA', 500: '#8B5CF6' },
  success: '#34D399', warning: '#FBBF24', danger: '#F87171', info: '#38BDF8',
}
```

## 4. Typography

| Role | Font | Fallback | Notes |
|---|---|---|---|
| Headings / display | **Space Grotesk** (600, 700) | `system-ui, sans-serif` | Distinct, technical |
| Body / UI | **Inter** (400, 500, 600) | `system-ui, sans-serif` | High readability |
| Numbers / code / data | **JetBrains Mono** (400, 500) | `ui-monospace, monospace` | Simulation values, tables |

Loading: Google Fonts `<link>` with `display=swap` in `client/index.html` (assumption; alternative is self-hosting later). UI must remain usable if fonts fail to load.

## 5. Heading and Body Hierarchy

| Style | Size / line-height | Weight | Font | Use |
|---|---|---|---|---|
| Display | 40 / 48 px (mobile 32 / 40) | 700 | Space Grotesk | Dashboard hero only |
| H1 | 32 / 40 (mobile 26 / 34) | 700 | Space Grotesk | Page titles |
| H2 | 24 / 32 | 600 | Space Grotesk | Section titles |
| H3 | 18 / 28 | 600 | Space Grotesk | Card titles |
| Body L | 17 / 28 | 400 | Inter | Mentor messages, blueprint prose |
| Body | 15 / 24 | 400 | Inter | Default |
| Small | 14 / 20 | 400–500 | Inter | Captions, chips (never below 14 px for text) |
| Mono | 14 / 20 | 500 | JetBrains Mono | Values, units |

Maximum line length for prose: ~70 characters (`max-w-prose`).

## 6. Spacing System

4 px base grid. Allowed scale (Tailwind units): `1 (4)`, `2 (8)`, `3 (12)`, `4 (16)`, `6 (24)`, `8 (32)`, `12 (48)`, `16 (64)`.

| Context | Spacing |
|---|---|
| Card padding | 20 px (`p-5`) mobile 16 px |
| Gap between cards | 16–24 px |
| Section vertical rhythm | 32–48 px |
| Page padding | 16 px mobile / 24 px tablet / 32 px desktop |
| Content max width | 1200 px; reading content 720 px |

## 7. Border Radius

| Token | Value | Use |
|---|---|---|
| `rounded-md` | 8 px | Chips, small inputs |
| `rounded-lg` | 12 px | Buttons, inputs |
| `rounded-xl` | 16 px | Cards, panels |
| `rounded-2xl` | 24 px | Hero panels, modals |
| `rounded-full` | 9999 px | Avatars, pills |

## 8. Shadows and Effects

| Effect | Value |
|---|---|
| Card | `0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.35)` |
| Elevated (modal/popover) | `0 16px 48px rgba(0,0,0,0.5)` |
| Focus ring | `0 0 0 2px #0D1322, 0 0 0 4px #6EA0FF` (2 px offset + 2 px ring; never removed) |
| Glow (use sparingly: primary CTA hover, active nav) | `0 0 24px rgba(79,140,255,0.25)` |
| Background accent | One soft radial gradient (blue at ~8% opacity top-left, purple at ~6% bottom-right) on `bg-deep`. Static, no animation |
| Glass | Avoided in MVP (cost and readability) |

## 9. Buttons

| Variant | Style | Use |
|---|---|---|
| Primary | `primary-600` fill, white text, `rounded-lg`, 44 px min height, hover lighten + glow, active scale 0.98 | One main action per view (e.g. Generate blueprint) |
| Secondary | `surface-raised` fill, `border-strong` border, `text-primary` | Supporting actions |
| Ghost | transparent, `text-secondary`, hover `surface` | Tertiary, toolbar |
| Danger | `danger` outline, tinted hover | Delete |
| Icon button | 44×44 px, `aria-label` required | |

States: hover, focus-visible ring, active, disabled (50% opacity, `cursor-not-allowed`, `aria-disabled`), loading (Spinner replaces icon, label stays, width fixed).

## 10. Inputs and Forms

- Height 44 px; textarea min 96 px; `surface-raised` background, `border-subtle` border, `rounded-lg`.
- Focus: border `primary-400` + focus ring.
- Label above field (always visible; placeholders are never labels). Helper text `text-muted`; error text `danger` with an icon and `aria-describedby`.
- Hero input (Dashboard): large `rounded-2xl` textarea with inline primary submit button and example-prompt chips below ("Help farmers save water", "A way to know when my plant is thirsty").
- Character counter appears at 80% of the 1000-char limit.

## 11. Sidebar

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280 px | Expanded, 264 px, `bg-deep`, right border `border-subtle` |
| 1024–1279 px | Icon rail, 72 px, tooltips + `aria-label` |
| < 1024 px | Hidden; **bottom nav** (4 items) + top bar with logo |

Items (only for built features): Dashboard (`LayoutDashboard`), Create (`Lightbulb`), Blueprints (`FileText`), STEM Lab (`FlaskConical`), Learn (`BookOpen`). Textbook (`BookMarked`) appears only after Phase 6. Active item: `primary-400` icon + text, left 3 px gradient bar, `surface` background. Footer: profile chip (nickname + grade band).

## 12. Dashboard Cards

| Card | Content |
|---|---|
| Hero | Greeting, big prompt input, example chips |
| Continue | Most recent project: title, progress chips (Idea ✓, Blueprint ✓, Simulation ○), Continue button |
| Journey tracker | 9-stage strip (Curiosity → … → Invention) highlighting the current project's stage |
| Recent projects | Grid of project cards (title, date, mode chip) with delete menu; `EmptyState` when none |
| Tips | One-line "Mentor tip" card (static, honest copy, no fake stats) |

Card anatomy: `surface`, `rounded-xl`, 1 px `border-subtle`, hover → `border-strong` + 2 px translate-up (150 ms, disabled for reduced motion).

## 13. Chat Interface (Curiosity Workspace)

Layout (≥ 1024 px): **left 60%** conversation, **right 40%** Idea Board. On mobile, the board is a collapsible panel above the input with a "Idea Board (3)" toggle.

| Element | Spec |
|---|---|
| Mentor message | Left aligned, `surface` card with a small gradient "forge" avatar, Body L, `rounded-xl` with a squared top-left corner |
| Student message | Right aligned, `primary-600` at ~20% tint over `surface`, 1 px primary border at 40% |
| Follow-up questions | Rendered as tappable chips under the mentor message; tapping fills the input (student can edit) |
| Thinking prompt | Callout with `Lightbulb` icon, accent-400 border-left |
| Typing/loading | Three-dot pulse inside a mentor bubble, `aria-live="polite"` text "Mentor is thinking…" |
| Input | Docked at the bottom, auto-grow textarea, Enter sends, Shift+Enter newline, visible Send button |
| Error | Inline `ErrorState` in the thread with Retry; student text preserved |
| **Idea Board** | Sections: Goal, Who it's for, Constraints, Detected concepts (chips with "Learn" link), Open questions. Fields animate-in (fade 200 ms) when updated. Primary CTA at the bottom: "Generate blueprint" |

Avoid: speech tails everywhere, full-screen centred "ChatGPT-style" column, markdown walls.

## 14. Blueprint Presentation

- **Header:** title, mode chip (Hardware / Software), "AI-generated guidance — not verified" badge, Regenerate (secondary), Open lab (if `labId`).
- **Sticky section index** (desktop right rail; mobile horizontal chips): Summary · Concepts · How it works · Components · Build steps · Test plan · Improve · Safety.
- **Components:** grid of cards: name, purpose, cost tier chip (low = success, medium = warning, high = danger, each with text "Low/Medium/High cost"), "Cheaper alternatives" accordion.
- **Build steps:** vertical timeline with numbered circles (gradient border), step title, instructions as a checklist (local-only tick state), "Why this step?" expandable, `SafetyCallout` where `safetyNote` exists (warning colour, `ShieldAlert` icon, prefix "Safety:").
- **Test plan:** table-like cards (Question / How to test / What you should see).
- **Safety and limitations:** pinned callouts at the end and a compact safety banner at the top for hardware.
- Prose limited to `max-w-prose`; no section over ~8 lines without a break.

## 15. STEM Simulation Interface

| Zone | Spec |
|---|---|
| Header | Title "Soil Moisture Lab", **persistent `SIMULATION` badge** (info colour, `FlaskConical` icon) and text "Simplified model — not real farm advice" |
| Control panel | Left (desktop) / top accordion (mobile). Grouped: Soil & crop, Weather (manual or Open-Meteo), Strategy A (schedule), Strategy B (sensor). Sliders have visible numeric values (JetBrains Mono), units, and ±1 buttons for keyboard/touch |
| Weather panel | City search, results list, "Use this forecast" button, source/fetch-time line "Open-Meteo · fetched 14:32" |
| Chart | Custom SVG: x = day, y = moisture %. Strategy A = `accent-500` dashed line, Strategy B = `primary-500` solid line (different dash patterns, not colour alone), stress threshold = `danger` dotted line with label, irrigation events as small markers. Legend above. "View as table" toggle (`surface-charcoal`, mono) |
| KPI cards | Water used A vs B, Water saved %, Stress days, Wasted water; big mono numbers + unit + one-line explanation |
| Predict & explain | "What do you predict?" textarea **before** the "Explain my results" button; result in a mentor-style card with caveats list and improvement chips |
| Animation | Chart line draws in 400 ms once on first render; updates snap (no animation) for slider responsiveness |

## 16. Responsive Design Rules

| Breakpoint | Width | Layout |
|---|---|---|
| Base | 360–639 px | Single column, bottom nav, collapsible panels, 16 px padding |
| `sm` | ≥ 640 px | Two-column card grids where useful |
| `md` | ≥ 768 px | Larger type for display/H1, wider padding |
| `lg` | ≥ 1024 px | Icon-rail sidebar, two-pane Curiosity and Lab layouts |
| `xl` | ≥ 1280 px | Full sidebar, content max 1200 px |

Rules: design mobile-first; no horizontal page scroll (tables and the chart scroll within their containers); tap targets ≥ 44 px; text never below 14 px; test at 360, 768 and 1280 px.

## 17. Accessibility and Contrast Requirements

- Body text ≥ 4.5:1, large text and UI borders/icons ≥ 3:1. Use `ink-primary` or `ink-secondary` for body; `ink-muted` only for non-essential hints ≥ 14 px.
- **Purple text must use `accent-400`** (`accent-500` is for fills and lines).
- Filled primary buttons use `primary-600` with white text (≈ 4.6:1). Do not put white text on `primary-500`.
- Focus ring visible on every interactive element (see §8).
- Status is never colour-only: icon + label (e.g. ✓ Success, ⚠ Caution).
- `prefers-reduced-motion: reduce` disables transforms, glow transitions and the chart draw-in.
- Charts: line dash patterns + direct labels + table alternative.
- AI result regions use `aria-live="polite"`; loading text is read out.
- Respect user zoom up to 200%; use `rem`-based sizing for text.

## 18. Reusable Component Guidelines

| Component | Props (minimum) | Notes |
|---|---|---|
| `Button` | `variant`, `size`, `loading`, `iconLeft`, `disabled` | Variants per §9 |
| `Card` | `as`, `interactive`, `padding` | Base for all panels |
| `Chip` | `tone` (neutral/primary/success/warning/danger), `onClick?` | Cost tiers, concepts, follow-ups |
| `Badge` | `tone`, `icon` | SIMULATION, AI-generated labels |
| `Input`, `Textarea`, `Select` | `label`, `hint`, `error`, `id` | Always labelled |
| `Spinner` | `label` | Includes visually-hidden text |
| `ErrorState` | `title`, `message`, `onRetry` | Used by all AI/network views |
| `EmptyState` | `icon`, `title`, `message`, `action` | Used when no data |
| `SafetyCallout` | `tone`, `children` | Warning/danger styles |
| `SectionHeader` | `title`, `description`, `actions` | Page structure |

Rules: components consume tokens only (no raw hex in JSX); icons from Lucide at 20 px (16 px in chips, 24 px in headers) with `aria-hidden` unless meaningful; each component supports keyboard use; new components must reuse existing primitives before adding variants.

### Motion catalogue (the only animations allowed in MVP)
| Animation | Duration | Where |
|---|---|---|
| Card hover lift | 150 ms | Interactive cards |
| Fade-in of new content | 200 ms | Mentor messages, Idea Board updates, blueprint sections |
| Button press scale | 100 ms | Buttons |
| Chart draw-in | 400 ms once | Simulation chart first render |
| Loading dots/spinner | continuous while loading | Loading states |

Anything else needs approval (`RULES.md` §9).
