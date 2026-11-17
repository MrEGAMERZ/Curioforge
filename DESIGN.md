# CURIOFORGE — Design System

> **Status:** Planned. No UI is built yet. Tokens below are the visual source of truth for the PWA; SwiftUI and Android token mappings are included in §3.
> Scope from `PRD.md`, structure from `ARCHITECTURE.md`, limits from `RULES.md` (C-11: no ad-hoc colours or spacing).
> Contrast ratios are **approximate** and must be re-checked with a contrast tool in Phase 7.

## 1. Brand Identity

| Item | Value |
|---|---|
| Name | CURIOFORGE |
| Tagline | Turning Curiosity into Invention |
| Metaphor | A forge: raw curiosity (spark) shaped into something real |
| Personality | Curious, encouraging, precise, playful but never childish, never cold |
| Logo | Text wordmark "CURIO" in primary text colour + "FORGE" in blue→purple gradient, with a small sparkles/flame glyph. No custom artwork required |
| Voice | Short sentences, "Let's find out", asks before telling, plain words for age 7–8. Every spoken line is also shown on screen |

## 2. Design Philosophy

1. **Premium dark tech**, calm and focused, not neon and not "kiddie cartoon".
2. **Activity, not chatbot.** The primary stage is a mic, a camera and an Activity Plan — never an endless text column.
3. **Voice-first with a text path.** Voice is the fastest input for a 7-year-old; text is always available and visible.
4. **Show structure.** AI output appears as ordered blocks, cards, chips and callouts, not walls of text.
5. **Honest UI.** Simulations, AI content and live data are always labelled.
6. **Big and readable.** Larger type and targets than an adult tool; generous spacing; one idea per card.
7. **Minimal, meaningful motion.** Motion confirms an action or reveals new content; nothing decorative.
8. **Portable.** The same ActivityProgram blocks look and behave consistently on macOS, Android and web.

## 3. Colour Palette

### Backgrounds and surfaces
| Token | HEX | Use |
|---|---|---|
| `bg-deep` | `#080C16` | App background behind everything |
| `bg-base` | `#0D1322` | Main page background |
| `surface` | `#131B2E` | Cards, panels |
| `surface-raised` | `#1A2440` | Hovered/elevated cards, popovers, inputs |
| `surface-charcoal` | `#161922` | Neutral panels (data tables, result notes) |
| `border-subtle` | `#232D4A` | Default 1 px borders |
| `border-strong` | `#34416A` | Hover/active borders, dividers |

### Text
| Token | HEX | Approx. contrast on `bg-base` | Use |
|---|---|---|---|
| `text-primary` | `#EAEEF9` | ~15:1 | Headings, body |
| `text-secondary` | `#AAB4D0` | ~8.5:1 | Secondary text |
| `text-muted` | `#8490B0` | ~5.5:1 | Hints, captions (minimum size 15 px) |
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
| `warning` | `#FBBF24` | Caution, supervision notes, listening state |
| `danger` | `#F87171` | Errors, unsafe, safety redirect |
| `info` | `#38BDF8` | Info, "Simulation" label background tint |

Tinted backgrounds for semantic callouts use the colour at 12–15% opacity over `surface`, with a 1 px border at 35% opacity.

### Platform token mapping

| Token | PWA (Tailwind) | SwiftUI | Android (Compose) |
|---|---|---|---|
| `bg-base` | `bg:base` | `Color("bgBase")` | `CurioTheme.colors.bgBase` |
| `surface` | `surface.DEFAULT` | `Color("surface")` | `CurioTheme.colors.surface` |
| `surface-raised` | `surface.raised` | `Color("surfaceRaised")` | `CurioTheme.colors.surfaceRaised` |
| `border-subtle` | `line.subtle` | `Color("lineSubtle")` | `CurioTheme.colors.lineSubtle` |
| `text-primary` | `ink.primary` | `Color("inkPrimary")` | `CurioTheme.colors.inkPrimary` |
| `primary-400` | `primary.400` | `Color("primary400")` | `CurioTheme.colors.primary400` |
| `warning` | `warning` | `Color("warning")` | `CurioTheme.colors.warning` |

Tailwind mapping (documentation of intent; implemented in Phase 2):

```js
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
| Headings / display | **Space Grotesk** (600, 700) | SF Pro Display / `system-ui` | Distinct, technical |
| Body / UI | **Inter** (400, 500, 600) | SF Pro Text / `system-ui` | High readability |
| Numbers / data | **JetBrains Mono** (400, 500) | `ui-monospace, monospace` | Simulation values, tables |

Loading for PWA: Google Fonts `<link>` with `display=swap` (assumption; self-host later). macOS uses SF Pro; Android uses Roboto/Inter fallback. UI must remain usable if fonts fail to load.

## 5. Heading and Body Hierarchy

| Style | Size / line-height | Weight | Font | Use |
|---|---|---|---|---|
| Display | 44 / 52 px (mobile 36 / 44) | 700 | Space Grotesk | Activity welcome hero only |
| H1 | 36 / 44 px (mobile 28 / 36) | 700 | Space Grotesk | Page titles |
| H2 | 26 / 34 px | 600 | Space Grotesk | Section titles |
| H3 | 20 / 28 px | 600 | Space Grotesk | Card titles |
| Body L | 19 / 30 px | 400 | Inter | Spoken/mentor text, ActivityPlan prose |
| Body | 17 / 28 px | 400 | Inter | Default |
| Small | 15 / 22 px | 400–500 | Inter | Captions, chips (never below 15 px for child-facing text) |
| Mono | 15 / 22 px | 500 | JetBrains Mono | Values, units |

Maximum line length for prose: ~68 characters (`max-w-prose`).

## 6. Spacing System

4 px base grid. Allowed scale: `1 (4)`, `2 (8)`, `3 (12)`, `4 (16)`, `6 (24)`, `8 (32)`, `10 (40)`, `12 (48)`, `14 (56)`, `16 (64)`.

| Context | Spacing |
|---|---|
| Card padding | 24 px (`p-6`) mobile 20 px |
| Gap between cards | 20–28 px |
| Section vertical rhythm | 40–56 px |
| Page padding | 20 px mobile / 28 px tablet / 36 px desktop |
| Content max width | 1200 px; reading content 760 px |

## 7. Border Radius

| Token | Value | Use |
|---|---|---|
| `rounded-md` | 10 px | Chips, small inputs |
| `rounded-lg` | 14 px | Buttons, inputs |
| `rounded-xl` | 20 px | Cards, panels |
| `rounded-2xl` | 28 px | Hero panels, modals |
| `rounded-full` | 9999 px | Avatars, pills, mic button |

## 8. Shadows and Effects

| Effect | Value |
|---|---|
| Card | `0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.35)` |
| Elevated (modal/popover) | `0 16px 48px rgba(0,0,0,0.5)` |
| Focus ring | `0 0 0 2px #0D1322, 0 0 0 4px #6EA0FF` (2 px offset + 2 px ring; never removed) |
| Glow (use sparingly: primary CTA hover, active mic) | `0 0 24px rgba(79,140,255,0.25)` |
| Background accent | One soft radial gradient (blue at ~8% opacity top-left, purple at ~6% bottom-right) on `bg-deep`. Static, no animation |
| Glass | Avoided (cost and readability) |

## 9. Buttons and Primary Controls

| Variant | Style | Use |
|---|---|---|
| Primary | `primary-600` fill, white text, `rounded-lg`, 56 px min height, hover lighten + glow, active scale 0.98 | One main action per view (e.g. Start activity) |
| Secondary | `surface-raised` fill, `border-strong` border, `text-primary` | Supporting actions |
| Ghost | transparent, `text-secondary`, hover `surface` | Tertiary, toolbar |
| Danger | `danger` outline, tinted hover | Delete |
| Icon button | 52×52 px, accessibility label required | |
| **Mic button** | 96 px circle, `primary-600` fill, SF/Lucide mic glyph 32 px, `warning` ring + pulse while listening | Primary input |
| **Camera button** | 72 px circle, `surface-raised` fill, `primary-400` border, camera glyph 28 px | Materials/result capture |

States: hover, focus-visible ring, active, disabled (50% opacity, `cursor-not-allowed`, `aria-disabled`), loading (Spinner replaces icon, label stays, width fixed).

## 10. Inputs and Forms

- Height 52 px; textarea min 120 px; `surface-raised` background, `border-subtle` border, `rounded-lg`.
- Focus: border `primary-400` + focus ring.
- Label above field (always visible; placeholders are never labels). Helper text `text-muted`; error text `danger` with an icon and `aria-describedby` equivalent.
- Voice-first fallback: a text input labelled "Or type your idea" sits below the mic, never above it.
- Transcript bubble appears under the mic with a "Edit words" control after listening.
- Character counter appears at 80% of the 1000-character limit on typed input.

## 11. Shell Chrome and Navigation

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280 px | Expanded sidebar, 264 px, `bg-deep`, right border `border-subtle` |
| 1024–1279 px | Icon rail, 72 px, tooltips + accessibility labels |
| < 1024 px | Hidden; bottom nav (4 items) + top bar with logo |

Items (only for built features): Activity (`Waveform`/`Mic`), History (`Clock`), Parent (`ShieldCheck`), Learn (`BookOpen`). Textbook (`BookMarked`) appears only after Phase 6. Active item: `primary-400` icon + text, left 3 px gradient bar, `surface` background. Footer: profile chip (nickname + age band + locale).

macOS mirrors the sidebar at all window sizes ≥ 1024 px; minimum supported window 1024×700. Android uses bottom nav and Material 3 navigation bar.

## 12. Activity Home Cards

| Card | Content |
|---|---|
| Hero | "What do you want to make?" + big mic + camera + typed fallback + example chips ("Something that fizzes", "A plant water reminder") |
| Continue | Most recent activity: title, block progress chips (`Plan ✓`, `Predict ○`, `Result ○`), Continue button |
| Recent activities | Grid of activity cards (title, date, concept chips, safety redirect badge if any); `EmptyState` when none |
| Mentor tip | One-line static honest copy ("Say what you want to make — I'll help you build it") |

Card anatomy: `surface`, `rounded-xl`, 1 px `border-subtle`, hover → `border-strong` + 2 px translate-up (150 ms, disabled for reduced motion).

## 13. Voice and Camera Interaction

| Element | Spec |
|---|---|
| Idle mic | 96 px circle, label "Tap to talk" below |
| Listening | `warning` ring, slow pulse (1.2 s), live text "I'm listening…", Stop button always visible |
| Transcript | `surface-raised` card with the child's words in Body L; "Edit words" ghost button |
| Thinking | Three-dot pulse + accessible live text "Mentor is thinking…" |
| Camera idle | 72 px circle, label "Snap materials" or "Snap result" depending on block |
| Photo preview | 160 px thumbnail with Retake and Use Photo; never shows people prominently — guidance text says materials only |
| Permission denied | `SafetyCallout` with tone `info` and text "Allow camera in Settings to use this step. You can type what you have instead." |
| TTS playback | `speak` card has Play/Stop and replay icon; spoken text always visible in the card |

Avoid: fake waveform animations when no mic is active, speech tails everywhere, full-screen centred "ChatGPT-style" column.

## 14. ActivityPlan Presentation (ActivityProgram interpreter)

- **Header:** activity title, age band chip, locale chip, "AI-generated guidance — not verified" badge.
- **Block list:** vertical sequence of cards, one block per card, numbered lightly (01, 02, …). Current block has `primary-400` left border; completed blocks dim to `text-secondary` with a check icon.
- **`speak`:** mentor avatar + Body L text + Play/Stop. Text is visible even if TTS is unavailable.
- **`showCard`:** title, body, optional icon; max ~6 lines; "Next" button.
- **`askPredict`:** big prompt in Body L, textarea + mic, "Skip for now" secondary. Explanation stays locked until answered or skipped.
- **`simulate`:** embeds the Living Canvas card (§15) with the simulation's `label`.
- **`capturePhoto`:** camera control + preview + Retake/Use Photo.
- **`supervisionNote`:** `warning` callout with shield icon, prefix "Adult help:".
- **`explainResult`:** mentor card with explanation, caveats list, next question chip; `info` label "AI explanation".
- **`branch` / unsupported:** friendly card "This device can't do this step yet" + Continue; never a blank step.

## 15. Living Canvas Interface

| Zone | Spec |
|---|---|
| Header | Title "Living Canvas", **persistent `SIMULATION` badge** (info colour, sparkles icon) and text "Simplified model — not real lab advice" |
| Control panel | Left (desktop) / top accordion (mobile). Sliders for safe inputs (`bakingSodaTsp`, `vinegarMl`, `containerMl`) with visible numeric values (JetBrains Mono), units, and ± buttons |
| Canvas | SwiftUI `Canvas` / SVG / Compose Canvas: cup outline, bubbles rising, foam level; no glass effect |
| KPI cards | Peak foam, duration, overflow risk; big mono numbers + unit + one-line explanation |
| Prediction | "What do you predict?" textarea/mic **before** the result is revealed |
| Explain | "Explain my result" primary button → mentor card with caveats and one next question |
| Animation | Bubbles rise 400 ms once after prediction; updates snap for slider responsiveness; disabled under reduce-motion |

`containerMl` never permits a sealed-container mode; a sealed choice shows a `supervisionNote` and is rejected.

## 16. Parent/Teacher Gate

| Element | Spec |
|---|---|
| Gate | Simple local PIN/question view labelled "Grown-up space — not a security lock" |
| Header | "What Riya made today" + date filter |
| Activity list | Read-only cards: title, concepts, block count, result note |
| Safety feed | `danger`/`warning` callouts with reason + safe pivot from `SafetyEvent` |
| Local notice | "This stays on this device. No account, no camera in this view." |
| No write controls | No editing, deleting or AI actions presented as working |

## 17. Responsive and Platform Rules

| Breakpoint | Width | Layout |
|---|---|---|
| Base | 360–639 px | Single column, bottom nav, collapsible panels, 20 px padding |
| `sm` | ≥ 640 px | Two-column card grids where useful |
| `md` | ≥ 768 px | Larger type for display/H1, wider padding |
| `lg` | ≥ 1024 px | Icon-rail sidebar, two-pane ActivityPlan + Canvas where useful |
| `xl` | ≥ 1280 px | Full sidebar, content max 1200 px |

Rules: design mobile-first; no horizontal page scroll (tables/canvas scroll within containers); tap targets ≥ 44 px (primary controls ≥ 52 px); child-facing text never below 15 px; test at 360, 768 and 1280 px. macOS uses the `lg`/`xl` layout; Android uses base/`sm` with 48 dp minimum touch targets.

## 18. Accessibility and Contrast Requirements

- Body text ≥ 4.5:1, large text and UI borders/icons ≥ 3:1. Use `ink-primary` or `ink-secondary` for body; `ink-muted` only for non-essential hints ≥ 15 px.
- **Purple text must use `accent-400`** (`accent-500` is for fills and lines).
- Filled primary buttons use `primary-600` with white text (≈ 4.6:1). Do not put white text on `primary-500`.
- Focus ring visible on every interactive element (see §8).
- Status is never colour-only: icon + label (e.g. ✓ Ready, ⚠ Adult help, ! Unsafe).
- Reduce-motion disables transforms, glow transitions and the bubble animation.
- Living Canvas has a text summary and data-table alternative.
- AI result regions use live-region equivalents; loading text is read out.
- Voice is never the only input; every spoken block is visible as text.
- Respect user zoom up to 200%; use `rem`/dynamic-type-friendly sizing.

## 19. Reusable Component Guidelines

| Component | Props (minimum) | Notes |
|---|---|---|
| `Button` | `variant`, `size`, `loading`, `iconLeft`, `disabled` | Variants per §9 |
| `MicButton` | `state` (idle/listening/processing), `onStop`, `transcript` | 96 px circle |
| `CameraButton` | `purpose`, `permissionState`, `onCapture` | Materials/result |
| `Card` | `as`, `interactive`, `padding` | Base for all panels |
| `Chip` | `tone` (neutral/primary/success/warning/danger), `onClick?` | Concepts, cost tiers, age band |
| `Badge` | `tone`, `icon` | SIMULATION, AI-generated, Safety redirect |
| `Input`, `Textarea`, `Select` | `label`, `hint`, `error`, `id` | Always labelled |
| `Spinner` | `label` | Includes visually-hidden text |
| `ErrorState` | `title`, `message`, `onRetry` | Used by all AI/network views |
| `EmptyState` | `icon`, `title`, `message`, `action` | Used when no data |
| `SafetyCallout` | `tone`, `title`, `children` | Warning/danger styles |
| `SectionHeader` | `title`, `description`, `actions` | Page structure |
| `BlockCard` | `block`, `index`, `state` | One ActivityProgram block |

Rules: components consume tokens only (no raw hex in views); icons from the shell's approved set at 20 px (16 px in chips, 28 px in primary controls) with `aria-hidden` unless meaningful; each component supports keyboard use; new components must reuse existing primitives before adding variants.

### Motion catalogue (the only animations allowed)

| Animation | Duration | Where |
|---|---|---|
| Card hover lift | 150 ms | Interactive cards |
| Fade-in of new block | 200 ms | New ActivityProgram block, explanation |
| Button press scale | 100 ms | Buttons |
| Mic listening pulse | 1.2 s loop | While listening only |
| Bubble rise / chart draw-in | 400 ms once | Living Canvas after prediction |
| Loading dots/spinner | continuous while loading | Loading states |

Anything else needs approval (`RULES.md` §9).
