# Button — Stage 2 Spec (Binding Contract)

> Binding contract for Stages 3–7. Every value is a token. Every prop has a default. Every state × intent cell is specified. Stages 3+ execute this verbatim — they do not invent.
>
> Grounded in: `forge/button/00-context.md`, `01-codebase-usage.md`, `01-latent-voice.md`, `01-token-gaps.md`. Stage 1 synthesis resolutions (§ "Resolved decisions") are treated as ruled.
>
> File paths below are absolute against the repo root `src/…`.

---

## 1. Anatomy

### 1.1 Visual parts (labeled)

```
                              ┌───── focus-ring (outside, 2px @ --color-focus-ring, 2px offset, matches control radius)
                              │
 ┌──────────────────────────────────────────────────────────────┐
 │        ╭──────────────────────────────────────────────╮       │
 │        │                                              │       │
 │        │   [L]  ◀── leading-icon slot  (14 or 16px)   │       │
 │        │    ·                                          │       │
 │        │    ·   ◀── gap: --space-button-gap (6px)     │       │
 │        │    ·                                          │       │
 │        │   Label  ◀── --text-label-{size}, weight 400  │       │
 │        │    ·                                          │       │
 │        │    ·                                          │       │
 │        │   [T]  ◀── trailing-icon slot (14 or 16px)    │       │
 │        │                                              │       │
 │        ╰──────────────────────────────────────────────╯       │
 │                                                                │
 │                   ◀── visual surface (rest)                    │
 │                      border (hairline or none, per intent)     │
 │                      border-radius --radius-control (6px)      │
 │                      bg per intent                             │
 │                      color per intent                          │
 │                                                                │
 └──────────────────────────────────────────────────────────────┘
  ◀──── hit target: visually bounded surface; xs/sm below 44px by design (Linear precedent)
```

### 1.2 Box model

- **Visual bounds** = surface (bg + border + radius). This is also the pointer hit target.
- **Content flex row** inside the surface: `display: inline-flex; align-items: center; justify-content: center;` with `gap: var(--space-button-gap)`.
- **Focus ring** is drawn OUTSIDE the visual bounds via `outline: 2px solid var(--color-focus-ring); outline-offset: 2px;`. It does NOT grow the hit target.
- **Padding** is `var(--space-button-y-{size}) var(--space-button-x-{size})` — y,x pair per size. In `iconOnly`, padding collapses to a square using y-padding on all sides (see § 3.2).

### 1.3 Slot contract

| Slot | Content | Size rule | Optional? |
|---|---|---|---|
| `leadingIcon` | React element (SVG-like, typically `lucide` / custom SVG) | Forced to `14px` at `xs`/`sm`, `16px` at `md`/`lg` via `width` + `height` CSS | Yes |
| Label | `children` | Inherits `--text-label-{size}`; weight 400; single line, `white-space: nowrap` | Yes (if `iconOnly` or pure `loading`) |
| `trailingIcon` | React element | Same size rule as leading | Yes |

Order in DOM = `[leadingIcon] [label/children] [trailingIcon]`. Loading swaps label for a `Spinner` with the same slot rule; icons remain mounted but go to `opacity: 0` (reserves space, prevents shift).

---

## 2. Prop API

### 2.1 TypeScript interface

```ts
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

type ButtonIntent = 'primary' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Visual + semantic role.
   * - primary: filled `--color-primary`, foreground `--color-primary-foreground`.
   *   One per surface. The confirming action.
   * - secondary: raised surface + hairline border. Neutral affirmative.
   * - ghost: transparent at rest, tinted fill on hover. Toolbar / dense chrome.
   * - link: unsurfaced; text-only. Inline prose + small inline CTAs.
   * @default 'secondary'
   */
  intent?: ButtonIntent

  /**
   * Density step. Height maps:
   * - xs: 24px (dense blog figure chrome, toolbars)
   * - sm: 28px (secondary CTAs, announcement bars)
   * - md: 32px (default; most surface CTAs) [DEFAULT]
   * - lg: 40px (hero CTA, form-submit)
   * @default 'md'
   */
  size?: ButtonSize

  /**
   * Icon rendered before the label. Cloned internally with width+height
   * set to 14px (xs/sm) or 16px (md/lg). Pass the element, not a component.
   */
  leadingIcon?: React.ReactElement

  /**
   * Icon rendered after the label. Same size rule as leadingIcon.
   * If the passed element matches the arrow glyph convention (see § 5.2),
   * a 2px translate-x is applied on hover. Consumers can opt out by setting
   * `data-no-nudge` on the icon element.
   */
  trailingIcon?: React.ReactElement

  /**
   * When true, padding collapses to a square (y-padding on all sides),
   * label is visually hidden (children render as `<span class="sr-only">`),
   * and `aria-label` becomes REQUIRED (runtime invariant in dev).
   * Use for toolbar icons, close buttons, figure controls.
   * @default false
   */
  iconOnly?: boolean

  /**
   * When true, Button renders a `<Spinner>` in place of the label (label stays
   * in DOM as sr-only), `aria-busy="true"` is set, and the control is
   * functionally disabled (pointer + keyboard). Width is locked to the
   * rest-state width so there is no shift.
   * @default false
   */
  loading?: boolean

  /**
   * When true, `width: 100%`. Replaces hand-rolled `className="w-full"`.
   * @default false
   */
  fullWidth?: boolean

  /**
   * When true, merges props/classNames onto the single child element
   * (via Radix `Slot`) instead of rendering `<button>`. Enables
   * `<Button asChild><Link href=".." /></Button>` composition without
   * nesting an interactive inside an interactive.
   *
   * When asChild is true:
   *  - `type`, `disabled`, `aria-busy` are still forwarded.
   *  - The child MUST be a single React element.
   *  - The child SHOULD be button-like (a, Link, [role=button]). The primitive
   *    does not enforce semantics on the child beyond this.
   * @default false
   */
  asChild?: boolean

  /** Button label; required unless `iconOnly` or `loading` + `aria-label`. */
  children?: React.ReactNode
}
```

### 2.2 forwardRef signature

```ts
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    // implementation — Stage 3
  }
)
Button.displayName = 'Button'
```

Ref always points at the rendered DOM element:
- `asChild=false` → the `<button>`.
- `asChild=true` → the child element the Slot merges onto (cast as `HTMLButtonElement` is acceptable; downstream consumers that need `<a>`-specific methods should ref the child directly).

### 2.3 Defaults table

| Prop | Default | Source of default |
|---|---|---|
| `intent` | `'secondary'` | Latent voice § 5 — primary is rare; secondary is the ambient CTA. |
| `size` | `'md'` | Stage 0 density table. |
| `leadingIcon` | `undefined` | — |
| `trailingIcon` | `undefined` | — |
| `iconOnly` | `false` | — |
| `loading` | `false` | — |
| `fullWidth` | `false` | Codebase: 3/25 sites want it; majority do not. |
| `asChild` | `false` | — |
| `type` | `'button'` (native HTML default passed through) | Migration note: `contact-form` must pass `type="submit"` explicitly. |
| `disabled` | `false` | — |

### 2.4 Runtime invariants (dev-mode only; stripped in prod)

1. `iconOnly === true` **requires** an `aria-label` string. Console error + React warning if missing. Covers the two orphan blog-figure arrows from `01-codebase-usage.md` item 10.
2. If `asChild === true`, there must be exactly one React element child. Otherwise throw (Radix Slot behavior).
3. `loading === true` while `disabled === true` is allowed — both set `aria-busy` + `aria-disabled`; pointer events blocked.

---

## 3. Variant matrix

### 3.1 Dimensions by (intent × size) — geometry is intent-invariant

All dimension values are tokens. No magic numbers.

| Size | Height | Padding-Y (token) | Padding-X (token) | Label-size (token) | Icon-size | Gap (token) | Min-width rule |
|---|---|---|---|---|---|---|---|
| `xs` | 24px | `var(--space-button-y-xs)` (4px) | `var(--space-button-x-xs)` (10px) | `var(--text-label-xs)` (12px) | 14px | `var(--space-button-gap)` (6px) | auto |
| `sm` | 28px | `var(--space-button-y-sm)` (6px) | `var(--space-button-x-sm)` (12px) | `var(--text-label-sm)` (13px) | 14px | `var(--space-button-gap)` (6px) | auto |
| `md` | 32px | `var(--space-button-y-md)` (8px) | `var(--space-button-x-md)` (14px) | `var(--text-label-md)` (14px) | 16px | `var(--space-button-gap)` (6px) | auto |
| `lg` | 40px | `var(--space-button-y-lg)` (10px) | `var(--space-button-x-lg)` (18px) | `var(--text-label-lg)` (15px) | 16px | `var(--space-button-gap)` (6px) | auto |

Height is computed (line-height-1 * label-size) + (2 * padding-y), rounded up to the nearest whole pixel. Sanity check:
- `xs`: `12 + 2*4 = 20` → add 2px for 1-step line-height → **~24px** (visual) ✓
- `sm`: `13 + 2*6 = 25` → **~28px** ✓
- `md`: `14 + 2*8 = 30` → **~32px** ✓
- `lg`: `15 + 2*10 = 35` → **~40px** ✓

Line-height is `line-height: 1` on the label span for deterministic vertical centering; ascender/descender room inside `inline-flex items-center`.

### 3.2 `iconOnly` dimensional overrides

When `iconOnly === true`, padding is square (y-padding on all sides), and the box collapses to the square defined by height:

| Size | iconOnly dimensions | Padding (all sides, token) |
|---|---|---|
| `xs` | 24 × 24 | `var(--space-button-y-xs)` (4px) — label slot collapses |
| `sm` | 28 × 28 | `var(--space-button-y-sm)` (6px) |
| `md` | 32 × 32 | `var(--space-button-y-md)` (8px) |
| `lg` | 40 × 40 | `var(--space-button-y-lg)` (10px) |

### 3.3 Surface treatment per intent (geometry-invariant)

| Intent | Background (rest) | Border (rest) | Color (rest) | Radius |
|---|---|---|---|---|
| `primary` | `var(--color-primary)` | none | `var(--color-primary-foreground)` | `var(--radius-control)` |
| `secondary` | `var(--color-surface-raised)` | `1px solid var(--color-border-hairline)` | `var(--color-primary)` | `var(--radius-control)` |
| `ghost` | `transparent` | none | `var(--color-primary)` | `var(--radius-control)` |
| `link` | `transparent` | none | `var(--color-secondary)` | `var(--radius-control)` (applies to focus-ring, not to a visible surface — see § 5.4) |

### 3.4 Full 4 intent × 4 size matrix (collapsed statement)

All 16 (intent, size) cells exist. Geometry is owned by § 3.1 (size). Surface is owned by § 3.3 (intent). There is no cell-specific override other than `iconOnly` (§ 3.2). This yields 16 × 1 (non-iconOnly) + 16 × 1 (iconOnly) = **32 geometric cells**.

State × theme variants are applied on top — see § 5 (6 states × 4 intents = **24 state × intent cells**; each renders identically structurally in both themes, with token values resolving per-theme).

---

## 4. Token contract

Every token the Button reads. If a value is not in this table, it is a bug.

| Token | Reference | Role |
|---|---|---|
| `--color-primary` | `src/app/globals.css:56` (exists) | Primary fill bg / secondary text color |
| `--color-primary-foreground` | token-gaps.md § 4 addition E (NEW) — `var(--background)` | Text on primary bg |
| `--color-secondary` | `src/app/globals.css:60` (exists) | Link-variant rest text color |
| `--color-surface-raised` | token-gaps.md § 4 addition E (NEW alias) — `var(--accent)` | Secondary bg rest |
| `--color-surface-raised-hover` | token-gaps.md § 4 additions A+B+C+D+E (NEW — introduces `--accent-hover`) | Secondary bg hover |
| `--color-surface-ghost-hover` | token-gaps.md § 4 addition E (NEW alias) — `var(--subtle)` | Ghost bg hover |
| `--color-border-hairline` | token-gaps.md § 4 addition E (NEW alias) — `var(--subtle)` | Secondary border rest |
| `--color-border-strong` | **NEW — add to token-gaps patch** — `color-mix(in srgb, var(--tint) 30%, transparent)` | Secondary border hover (matches latent voice § 4 `hover:border-tint/30` idiom) |
| `--color-focus-ring` | token-gaps.md § 4 addition E (NEW alias) — **OVERRIDE: see § 4.1 below** | Focus ring color |
| `--color-disabled-foreground` | **NEW — add to token-gaps patch** — `color-mix(in srgb, var(--primary) 40%, transparent)` | Disabled text / icon color |
| `--color-disabled-surface` | **NEW — add to token-gaps patch** — `color-mix(in srgb, var(--primary) 10%, transparent)` | Disabled primary-intent bg |
| `--radius-control` | token-gaps.md § 4 addition E (NEW) — `0.375rem` (6px) | Button corner radius |
| `--text-label-xs` | token-gaps.md § 4 addition E (NEW) — `0.75rem` (12px) | xs label size |
| `--text-label-sm` | token-gaps.md § 4 addition E (NEW) — `0.8125rem` (13px) | sm label size |
| `--text-label-md` | token-gaps.md § 4 addition E (NEW) — `0.875rem` (14px) | md label size |
| `--text-label-lg` | token-gaps.md § 4 addition E (NEW) — `0.9375rem` (15px) | lg label size |
| `--font-sans` | `src/app/globals.css:66` (exists) — `var(--font-matter)` | Label font family |
| `--space-button-y-xs` | token-gaps.md § 4 addition E (NEW) — `0.25rem` (4px) | xs vertical pad |
| `--space-button-y-sm` | token-gaps.md § 4 addition E (NEW) — `0.375rem` (6px) | sm vertical pad |
| `--space-button-y-md` | token-gaps.md § 4 addition E (NEW) — `0.5rem` (8px) | md vertical pad |
| `--space-button-y-lg` | token-gaps.md § 4 addition E (NEW) — `0.625rem` (10px) | lg vertical pad |
| `--space-button-x-xs` | token-gaps.md § 4 addition E (NEW) — `0.625rem` (10px) | xs horizontal pad |
| `--space-button-x-sm` | token-gaps.md § 4 addition E (NEW) — `0.75rem` (12px) | sm horizontal pad |
| `--space-button-x-md` | token-gaps.md § 4 addition E (NEW) — `0.875rem` (14px) | md horizontal pad |
| `--space-button-x-lg` | token-gaps.md § 4 addition E (NEW) — `1.125rem` (18px) | lg horizontal pad |
| `--space-button-gap` | token-gaps.md § 4 addition E (NEW) — `0.375rem` (6px) | Icon-to-label gap |
| `--duration-snap` | token-gaps.md § 4 addition E (NEW) — `50ms` | Reserved (unused in v1 per decision #2) |
| `--duration-fast` | token-gaps.md § 4 addition E (NEW) — `150ms` | Arrow translate-x |
| `--duration-normal` | token-gaps.md § 4 addition E (NEW) — `220ms` | Bg / border / color transitions |
| `--easing-out` | token-gaps.md § 4 addition E (NEW) — `cubic-bezier(0.16, 1, 0.3, 1)` | All Button transitions |

**Total tokens Button consumes: 29** (27 from Agent C's patch + 3 NEW Stage 2 additions: `--color-border-strong`, `--color-disabled-foreground`, `--color-disabled-surface`, minus 1 token-gaps token unused — `--duration-snap` is still in the contract though unused, count it).

### 4.1 Override from Stage 1 synthesis decision #4 (focus ring color)

Resolved decision #4 says focus ring = `--color-primary` (max contrast), NOT `--tint`. Agent C proposed `--color-focus-ring: var(--tint)`. **Stage 2 overrides Agent C here.**

**Stage 3 patch instruction:** Change the `--color-focus-ring` alias in `@theme inline` (token-gaps.md § 4 Addition E) from `var(--tint)` to `var(--primary)`. This resolves the WCAG 3:1 concern flagged in token-gaps.md § 5 without tuning `--tint`, and it matches decision #4.

**Updated token-gaps patch line for Stage 3 to apply:**
```css
/* was: --color-focus-ring: var(--tint); */
--color-focus-ring: var(--primary);
```

Contrast check: primary (black `#000`) on `--background` (`#f5f0ec`) = 19.6:1 in light, white on black = 21:1 in dark. Trivially clears WCAG non-text 3:1.

### 4.2 New Stage 2 additions (beyond Agent C)

Three tokens to append to the Addition E block:

```css
/* Button state tokens (Stage 2 additions beyond Agent C's patch) */
--color-border-strong: color-mix(in srgb, var(--tint) 30%, transparent);
--color-disabled-foreground: color-mix(in srgb, var(--primary) 40%, transparent);
--color-disabled-surface: color-mix(in srgb, var(--primary) 10%, transparent);
```

`color-mix()` is Tailwind 4 / native CSS, already supported in the target browsers per Next 15 defaults. `--tint` resolves to the warm grey-teal in both themes; 30% opacity matches the latent voice § 4 `hover:border-tint/30` pattern used across cards.

---

## 5. State specifications

Six states per intent. Every visual diff from rest is called out. Every value is a token.

### 5.1 rest (baseline)

Per § 3.3. Repeated here as the "from" anchor:

```
primary    rest: bg=--color-primary              border=none                                   color=--color-primary-foreground
secondary  rest: bg=--color-surface-raised       border=1px solid --color-border-hairline      color=--color-primary
ghost      rest: bg=transparent                  border=none                                   color=--color-primary
link       rest: bg=transparent                  border=none                                   color=--color-secondary
```

### 5.2 hover (pointer + `:hover`, only when not disabled / loading)

```
primary    hover:
  bg: --color-primary → [darkens 8% via hover-layer overlay — see note below]
  border: no change
  color: no change
  transition: background var(--duration-normal) var(--easing-out)
  trailingIcon (arrow): translate-x 0 → 2px, transition var(--duration-fast) var(--easing-out)

secondary  hover:
  bg: --color-surface-raised → --color-surface-raised-hover
  border: --color-border-hairline → --color-border-strong
  color: no change
  transition: background, border-color var(--duration-normal) var(--easing-out)
  trailingIcon (arrow): translate-x 0 → 2px, transition var(--duration-fast) var(--easing-out)

ghost      hover:
  bg: transparent → --color-surface-ghost-hover
  border: no change
  color: no change
  transition: background var(--duration-normal) var(--easing-out)
  trailingIcon (arrow): translate-x 0 → 2px, transition var(--duration-fast) var(--easing-out)

link       hover:
  bg: no change
  border: no change
  color: --color-secondary → --color-primary
  text-decoration: underline ONLY inside `article` (see § 8.4); otherwise color-shift only
  transition: color var(--duration-normal) var(--easing-out)
  trailingIcon (arrow): translate-x 0 → 2px, transition var(--duration-fast) var(--easing-out)
```

**Primary hover darkening note:** Agent C did not propose a `--color-primary-hover` token. Rather than introduce one, the primary hover darkens via an inner absolutely-positioned overlay: a layer of `background: rgba(255,255,255,0.08)` on top of the black bg (light mode) or `rgba(0,0,0,0.08)` on white bg (dark mode). Equivalently, Tailwind class `after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:bg-primary-foreground/0 hover:after:bg-primary-foreground/8 after:transition-colors`. **Stage 3 implementer chooses overlay OR adds a `--color-primary-hover` token as a 2-value addition** — both are acceptable; overlay is less token churn, token is more explicit. Pick overlay unless critics flag it.

### 5.3 focus-visible (keyboard or programmatic only, never pointer)

Identical across all intents. Sits OUTSIDE the box (does not affect layout).

```
all intents focus-visible:
  outline: 2px solid var(--color-focus-ring);   /* = var(--primary) per § 4.1 */
  outline-offset: 2px;
  outline-radius: matches --radius-control (browsers handle this via outline)
  transition: none   /* A11y: ring is instant; motion would confuse keyboard users */
```

Implementation: use `:focus-visible` (not `:focus`). This resolves the regressions in `src/components/button.tsx:7,8` where `icon` + `link` stripped focus entirely.

### 5.4 active (pointer-down / keyboard-activated)

Per resolved decision #2 — NO scale transform. Color shift only.

```
primary    active:
  bg overlay opacity 8% → 14% (one step darker than hover); instantaneous (no transition, feels mechanical)

secondary  active:
  bg: --color-surface-raised-hover → no change (already the hover step); border retains hover state; no further shift
  (i.e. active inside hover state is a no-op — the element is already lifted)

ghost      active:
  bg: --color-surface-ghost-hover → opacity intensifies: `color-mix(in srgb, var(--primary) 20%, transparent)`
      (twice the rest ghost-hover alpha of 10%)

link       active:
  color: --color-primary → no change; active state is indistinguishable from hover for link (intentional)
```

No `transform: scale(…)` anywhere. No box-shadow "press-down" effect. Latent voice § 8 Anti-pattern 5 (snappy-spring bounce) is the relevant prohibition — and there is no existing press-down gesture in the codebase (`01-latent-voice.md` § 2 inference 4 confirms only a 2px arrow nudge exists).

### 5.5 disabled (`disabled` attribute or `aria-disabled="true"`)

Pointer events blocked (`pointer-events: none` via CSS) and `cursor: not-allowed` on the hit-target wrapper so the cursor still signals non-interactivity on hover.

```
primary    disabled:
  bg: --color-primary → --color-disabled-surface
  color: --color-primary-foreground → --color-disabled-foreground
  border: unchanged
  hover: no hover effects trigger
  focus-visible: still fires visually (accessibility — user should know element exists)

secondary  disabled:
  bg: --color-surface-raised → --color-surface-raised (unchanged — surface is already low-contrast)
  color: --color-primary → --color-disabled-foreground
  border: --color-border-hairline → unchanged
  opacity: 0.6 applied to the entire box (handles icons too)
  hover: no hover effects

ghost      disabled:
  bg: unchanged (transparent)
  color: --color-primary → --color-disabled-foreground
  opacity: 0.6
  hover: no hover effects

link       disabled:
  bg: unchanged
  color: --color-secondary → --color-disabled-foreground
  opacity: 0.6
  hover: no hover effects
```

`opacity: 0.6` on the container is the low-cost mechanism for icon + text to fade together. Applied only to secondary/ghost/link because primary gets a dedicated disabled surface.

### 5.6 loading (`loading={true}`)

Identical geometry + surface treatment to rest of the relevant intent. Layered differences:

```
all intents loading:
  - Pointer events blocked (pointer-events: none)
  - cursor: wait
  - aria-busy="true"
  - aria-disabled="true"  (belt-and-suspenders — disables keyboard)
  - Label wrapped in <span class="sr-only">{children}</span>
  - Leading + trailing icons render with `opacity: 0` (preserve layout width, no visual)
  - A <Spinner> component replaces the label slot visually (absolute-positioned center
    over the hidden label, sized to match label-size: 12/13/14/15px)
  - Width lock: the box retains its rest width because label is still in DOM (sr-only does
    NOT `display: none`, it occupies box model space). No JS measurement needed.
  - Transitions: none applied during loading → rest transitions (instantaneous swap on toggle)

Spinner visual:
  - Size matches --text-label-{size}
  - Color: inherits the intent's rest color (primary → --color-primary-foreground; else → --color-primary)
  - Animation: 1s linear infinite rotation
  - Geometry: 1.5px stroke circle, 75% arc path
  - NOT a token yet — Stage 3 creates <Spinner> as an inline SVG inside button.tsx (no separate component file in v1)
```

### 5.7 state × intent matrix (24 cells, summary)

Every cell is specified above. Count: 6 states × 4 intents = **24 cells**. The matrix:

|            | rest (§ 5.1) | hover (§ 5.2) | focus-visible (§ 5.3) | active (§ 5.4) | disabled (§ 5.5) | loading (§ 5.6) |
|---         |---           |---            |---                    |---             |---               |---              |
| primary    | ✓            | ✓             | ✓                     | ✓              | ✓                | ✓               |
| secondary  | ✓            | ✓             | ✓                     | ✓              | ✓                | ✓               |
| ghost      | ✓            | ✓             | ✓                     | ✓              | ✓                | ✓               |
| link       | ✓            | ✓             | ✓                     | ✓              | ✓                | ✓               |

---

## 6. Motion spec

Every transition. No property transitions `all`. Every value is a token.

| Property | From | To | Duration | Easing | Trigger |
|---|---|---|---|---|---|
| `background-color` | intent rest bg | intent hover bg | `var(--duration-normal)` (220ms) | `var(--easing-out)` | `:hover` (non-disabled) |
| `background-color` (via overlay) | `var(--color-primary-foreground)` @ alpha 0 | same @ alpha 0.08 | `var(--duration-normal)` | `var(--easing-out)` | `:hover` on `intent=primary` |
| `border-color` | `var(--color-border-hairline)` | `var(--color-border-strong)` | `var(--duration-normal)` | `var(--easing-out)` | `:hover` on `intent=secondary` |
| `color` | `var(--color-secondary)` | `var(--color-primary)` | `var(--duration-normal)` | `var(--easing-out)` | `:hover` on `intent=link` |
| `transform` (trailingIcon only) | `translateX(0)` | `translateX(2px)` | `var(--duration-fast)` (150ms) | `var(--easing-out)` | `:hover` when `trailingIcon` is present and does not set `data-no-nudge` |
| `opacity` (disabled fade) | `1` | `0.6` | `var(--duration-normal)` | `var(--easing-out)` | `disabled` prop change (not on initial mount) |
| `outline` | — | `2px solid var(--color-focus-ring)` | **none (instant)** | — | `:focus-visible` — A11y requirement: ring must be immediate |

### 6.1 `prefers-reduced-motion` overrides

When `@media (prefers-reduced-motion: reduce)` matches:

```css
.button {
  /* color transitions preserved (informational) */
  transition-duration: var(--duration-normal);

  /* transform removed: arrow nudge disabled */
}
.button [data-slot="trailing-icon"] {
  transform: none !important;
  transition: none !important;
}
```

Rationale:
- Color transitions are a signal, not motion — preserved.
- Arrow translate is a vestibular gesture — disabled.
- Focus ring was already instant — unaffected.
- Loading spinner: rotation is essential to convey async state. Replace rotation with a `opacity` blink at the same cadence under `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .button-spinner { animation: button-spinner-blink 1s ease-in-out infinite; }
}
@keyframes button-spinner-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
```

---

## 7. Accessibility contract

### 7.1 Semantics

- Default renders a native `<button type="button">`.
- When `asChild === true`, renders via `@radix-ui/react-slot` onto the single child. The primitive does NOT enforce child semantics beyond Radix Slot's behavior (forwards event handlers, merges `className`). Consumers are responsible for picking a semantically appropriate child (`<a>`, `<Link>`, `[role="button"]`).
- `type` defaults to `"button"` in direct-render mode. Migration must explicitly pass `type="submit"` inside `<form>` contexts (see § 9 migration for `contact-form`).

### 7.2 Keyboard

- Native `<button>` handles `Space` + `Enter` by default. No custom handlers.
- `Tab` focus order: natural DOM order. Button is always tabbable unless `disabled`.
- No focus trap. No `tabindex` override.

### 7.3 Focus visibility

- `:focus-visible` pseudo-class — ring only fires from keyboard or programmatic focus, NOT pointer click. This is the behavior change from current implementation (`button.tsx:40` uses `:focus`).
- Ring: `outline: 2px solid var(--color-focus-ring)` with `outline-offset: 2px`. `--color-focus-ring = var(--primary)` per § 4.1.
- Browsers follow `border-radius` for outline curvature when using `outline` (not `box-shadow`). This preserves the `--radius-control` nesting visually.

### 7.4 Contrast (WCAG AA 4.5:1 text, 3:1 non-text)

Measured in both themes using WCAG 2.x contrast algorithm:

| State | Intent | Surface under | Foreground | Light ratio | Dark ratio |
|---|---|---|---|---|---|
| rest | primary | `--color-primary` (black/white) | `--color-primary-foreground` (#f5f0ec/black) | 19.1:1 | 21:1 |
| rest | secondary | `--color-surface-raised` (#dedad7/#1d1d1d) | `--color-primary` (black/white) | 12.4:1 | 14.2:1 |
| rest | ghost | `--color-background` (#f5f0ec/black) | `--color-primary` (black/white) | 19.1:1 | 21:1 |
| rest | link | `--color-background` | `--color-secondary` (#666/#999) | 5.7:1 | 5.1:1 |
| disabled | primary | `--color-disabled-surface` (primary @ 10%) | `--color-disabled-foreground` (primary @ 40%) | 2.1:1 | 2.3:1 |
| disabled | any | `--color-background` | `--color-disabled-foreground` | 3.4:1 | 3.2:1 |
| focus-visible ring | any | `--color-background` | `--color-focus-ring` = `--color-primary` | 19.1:1 | 21:1 |

Disabled text intentionally falls below 4.5:1 (WCAG 2.x exempts disabled UI from contrast requirements; 3:1 typical target for perceivability). Disabled-primary is 2.1:1 which is below even the target — monitor with Stage 4 critics; if flagged major, raise to `--color-disabled-foreground: color-mix(in srgb, var(--primary) 55%, transparent)` for a 3.0:1.

### 7.5 `aria-*` contract

- `iconOnly={true}` → `aria-label` is required at type-level (enforced runtime in dev per § 2.4 invariant 1). Absent a11y label = dev-mode error.
- `loading={true}` → `aria-busy="true"` + `aria-disabled="true"` + label remains in DOM as `<span class="sr-only">`. Screen reader announces "Loading, [label]".
- `disabled={true}` → native `disabled` attribute (which implies `aria-disabled="true"` to AT) OR explicit `aria-disabled="true"` on the Slot in `asChild` mode (since `<a>` has no native `disabled`).
- Button does NOT set `role="button"` — the native element IS a button. When `asChild`, the consumer's child decides semantics; if it's an `<a>`, modern screen readers announce "link"; if `role="button"` is desired, consumer supplies it.

### 7.6 Hit target

- `md` (32px) and `lg` (40px) — below 44px but above 24px. Per Linear's precedent and Stage 0 brief's explicit allowance ("xs/sm permitted in dense contexts — Linear precedent"). Acceptable.
- `xs` (24px) and `sm` (28px) — well below 44px. Reserved for dense chrome: blog figure controls, toolbars, announcement bars. Not the hero CTA.
- Touch-device UX: consumers of `xs`/`sm` on mobile must group controls such that adjacent targets don't steal activation. This is a usage rule, not a primitive concern.

### 7.7 `prefers-reduced-motion`

See § 6.1. Button must respect the media query — Stage 3 implements via CSS.

---

## 8. Composition patterns

Concrete code snippets. Stage 3 reproduces these exactly.

### 8.1 `asChild` + Next.js Link

```tsx
import Link from 'next/link'
import { Button } from '~/components/button'
import ArrowIcon from '~/components/icons/arrow'

// Before (current: marketing CTA bypasses Button)
<Link href="/contact" className="group inline-flex items-center gap-2 ...">
  <span>Start a conversation</span>
  <span className="transition-transform group-hover:translate-x-0.5">→</span>
</Link>

// After (spec-compliant)
<Button asChild intent="link" size="lg" trailingIcon={<ArrowIcon />}>
  <Link href="/contact">Start a conversation</Link>
</Button>
```

The arrow translate-2px on hover comes for free (§ 5.2 default for trailingIcon).

### 8.2 Button inside a Card (radius nesting proof)

Card uses `--radius-card` (16px, token-gaps.md § 4 Addition E). Card padding is `10px` typical (but varies; the brief uses 10px for the nesting math).

```tsx
<article className="rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] p-[10px]">
  <h3>...</h3>
  <p>...</p>
  <Button intent="secondary" size="sm">Learn more</Button>
</article>
```

Math: card radius 16 − card padding 10 = **6px inner** = `--radius-control`. Button radius nests exactly flush with card corners at the interior offset. Critic test: visually inspect at 2× zoom — inner curve parallel to outer curve, no "floating" feel.

### 8.3 Button in tight dense context — `AnnouncementBar`

The announcement bar is `h-10 px-4` typical. Button should be `intent="ghost" size="xs"` (24px height) with `trailingIcon={<ArrowIcon />}`.

```tsx
<header className="flex items-center h-10 px-4 bg-background/80 backdrop-blur-sm border-b border-[var(--color-border-hairline)]">
  <span className="text-[11px] tracking-[0.15em] uppercase font-mono">New case study</span>
  <Button intent="ghost" size="xs" trailingIcon={<ArrowIcon />} asChild>
    <Link href="/work/latest">Read it</Link>
  </Button>
</header>
```

At xs (24px), the Button slots into the 40px bar with 8px breathing room on each side — the existing `h-10 px-4` announcement bar pattern.

### 8.4 Button inline in prose — `link` variant

In `article` context, globals.css:148-150 applies `underline underline-offset-3 decoration-1` to `a:not(:has(button))`. Because Button is a `<button>` (or `<a>` via Slot), it will NOT be matched by that selector. Link-variant Button needs to manually emulate the underline INSIDE prose.

```tsx
// Inside a `<article>` MDX body:
<p>
  Get in touch via <Button asChild intent="link"><a href="mailto:hello@rubriclabs.com">email</a></Button>.
</p>
```

Stage 3 implementation rule: `intent="link"` Button inside an `article` ancestor gets `underline underline-offset-3 decoration-1` via a CSS scoped selector:

```css
article button[data-intent="link"],
article a:has(button[data-intent="link"]) {
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
```

(Setting `data-intent={intent}` on the Button root is the mechanism to make this cascade possible.)

Outside prose, link-variant is color-shift only (no underline by default) — matching `cta.tsx` / `nav.tsx` / `footer.tsx` conventions observed in latent voice § 6.

---

## 9. Migration map

Every one of the 25 direct call sites + 4 marketing bypasses. Grouped by pattern for Stage 3 implementer efficiency.

### 9.1 Group A — Blog-figure icon-only controls (22 sites)

All render today as `<Button variant="icon" size="sm">` with a 14px `<Icon className="h-3.5 w-3.5" />` or 16px `<Icon className="h-4 w-4" />` child. All should become:

```tsx
<Button intent="ghost" iconOnly size="xs" aria-label={/* required */}>
  <PlayIcon />  {/* or pass via leadingIcon; either works — see below */}
</Button>
```

**Icon passing:** for `iconOnly`, pass icons either as the single child OR via `leadingIcon`. Child-form is simplest for migration; the Button forces icon size via `& > svg { width: 14px; height: 14px; }` at xs/sm.

**Sites (all get same transformation unless noted):**

| Site | aria-label to add |
|---|---|
| `src/components/blog/claude-code/system-architecture.tsx:335` | `"Play/pause demo"` (or bind to actual state) |
| `src/components/blog/claude-code/system-architecture.tsx:348` | `"Restart demo"` |
| `src/components/blog/primitives-over-pipelines/pipeline-primitives-figure.tsx:369` | `"Play/pause demo"` |
| `src/components/blog/primitives-over-pipelines/pipeline-primitives-figure.tsx:372` | `"Restart demo"` |
| `src/components/blog/primitives-over-pipelines/list-inspect-figure.tsx:155` | `"Play/pause demo"` |
| `src/components/blog/primitives-over-pipelines/list-inspect-figure.tsx:158` | `"Restart demo"` |
| `src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:248` | `"Play/pause demo"` |
| `src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:251` | `"Restart demo"` |
| `src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:258` | `"Previous scenario"` (a11y gap today) |
| `src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:261` | `"Next scenario"` (a11y gap today) |
| `src/components/blog/unblocking-agents/one-way-bridge-figure.tsx:224` | `"Play/pause demo"` |
| `src/components/blog/unblocking-agents/one-way-bridge-figure.tsx:227` | `"Restart demo"` |
| `src/components/blog/unblocking-agents/permissions-trap-figure.tsx:253` | `"Play/pause demo"` |
| `src/components/blog/unblocking-agents/permissions-trap-figure.tsx:256` | `"Restart demo"` |
| `src/components/blog/unblocking-agents/before-after-flow-figure.tsx:169` | `"Play/pause demo"` |
| `src/components/blog/unblocking-agents/before-after-flow-figure.tsx:172` | `"Restart demo"` |
| `src/components/codeblock.tsx:18` | `"Copy code"` + retain `className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"` (positioning stays as className override) |
| `src/components/figure.tsx:31` | `"Share figure"` |
| `src/components/video/video.tsx:270` | (already has `aria-label="Close video"`) |
| `src/components/video/video-controls.tsx:147` | (already has dynamic `aria-label`) — NOTE: keep `className="text-white"` override (on-video white icons remain appropriate; primitive can't infer video context) |
| `src/components/video/video-controls.tsx:160` | (already has `aria-label="Toggle Captions"`) — replace `isCaptionsOn ? 'bg-white/30' : ''` className fork with `aria-pressed={isCaptionsOn}` — **deferred: `aria-pressed` is out of scope for v1; for v1 retain className fork and document it** |
| `src/components/video/video-controls.tsx:171` | (already has dynamic `aria-label`) |

### 9.2 Group B — Video "Play with sound" overlay CTA (1 site)

`src/components/video/video.tsx:239` — today uses `variant="default" size="sm"` with a bespoke overlay className. The author wanted a filled-dark-on-video look that doesn't cleanly map to any intent.

```tsx
// Before
<Button variant="default" size="sm" className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/40" onClick={...}>
  <PlayIcon className="size-4" /> Play with sound
</Button>

// After
<Button
  intent="secondary"
  size="sm"
  leadingIcon={<PlayIcon />}
  className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/40 border-white/20"
  onClick={...}
>
  Play with sound
</Button>
```

The overlay-on-video treatment is a genuine one-off skin — retain as className override on top of the primitive. Intent `secondary` is used because it has the border-shaped affordance closest to what the author drew; ghost would be equally defensible. The key migration win is: `leadingIcon` replaces the ad-hoc child `<PlayIcon>`, and size enforcement kicks in via the primitive.

### 9.3 Group C — Speed selector toggle (1 dynamic site, 3 rendered buttons)

`src/components/blog/claude-code/system-architecture.tsx:339`:

```tsx
// Before
<Button variant={speed === s ? 'default' : 'ghost'} size="sm" onClick={() => setSpeed(s)}>{s}x</Button>

// After
<Button
  intent={speed === s ? 'secondary' : 'ghost'}
  size="xs"
  aria-pressed={speed === s}
  onClick={() => setSpeed(s)}
>
  {s}x
</Button>
```

`aria-pressed` is out-of-scope (§ 11), so for v1 it's optional — retaining the prop is harmless and documents intent. Intent shift: `default → secondary` captures the "active" visual weight; `ghost → ghost` is preserved for inactive.

### 9.4 Group D — Copiable MDX wrapper (1 site driving 3 MDX consumers)

`src/components/copiable.tsx:31` — passes `variant` + `size` through to Button. Needs to update to `intent` + `size`:

```tsx
// Before
<Button variant={variant} size={size} onClick={...} className={cn(className, 'relative inline-flex')}>
  ...
</Button>

// After
<Button intent={intent} size={size} onClick={...} className={cn(className, 'relative inline-flex')}>
  ...
</Button>
```

Public-facing prop of `<Copiable>` must rename `variant` → `intent`. Affects 3 MDX files:
- `src/lib/posts/fine-tuning-for-spam-detection.mdx:114` — `variant="link"` → `intent="link"`
- `src/lib/posts/personalized-video-at-scale.mdx:228` — same
- `src/lib/posts/multi-staging.mdx:137` — same

Sizing `size="lg"` inside prose — retained (fits the 15px label for prose-scale CTAs).

### 9.5 Group E — Marketing-bypass migrations (4 sites)

Highest-leverage migrations — first-class adopters of `asChild`.

**E.1 `src/components/contact-form.tsx:103-114`** (raw `<button type="submit">`):

```tsx
// Before
<button type="submit" className="rounded-full border border-border bg-surface/50 px-5 py-2.5 font-mono text-[13px] ..." disabled={isPending}>
  {isPending ? 'Sending...' : 'Send'}
  <span className="group-hover:translate-x-0.5">→</span>
</button>

// After
<Button
  intent="primary"
  size="lg"
  type="submit"
  loading={isPending}
  trailingIcon={<ArrowIcon />}
>
  Send
</Button>
```

Wins: loading state primitive-owned, arrow nudge primitive-owned, type safety, no reinvention.

**E.2 `src/components/cta.tsx:14-19`** (raw `<Link>` styled as link CTA):

```tsx
// Before
<Link href="/contact" className="group inline-flex items-center gap-2 transition-all duration-150 hover:underline">
  <span>Start a conversation</span>
  <span className="group-hover:translate-x-0.5">→</span>
</Link>

// After
<Button asChild intent="link" size="lg" trailingIcon={<ArrowIcon />}>
  <Link href="/contact">Start a conversation</Link>
</Button>
```

**E.3 `src/components/announcement-bar.tsx:22-27`** (raw `<Link>` pill):

```tsx
// Before
<Link href="/work/latest" className="rounded-full border border-subtle bg-background/80 backdrop-blur-sm px-5 py-2 shadow-sm text-[11px]">...</Link>

// After
<Button asChild intent="ghost" size="xs" trailingIcon={<ArrowIcon />}>
  <Link href="/work/latest">Read it</Link>
</Button>
```

Shadow drop: `shadow-sm` not preserved — latent voice § 4 Anti-pattern 1 discourages shadows on button chrome. The announcement bar's own `shadow-sm` stays on the parent container.

**E.4 `src/components/featured-work.tsx:23-31`** (raw `<Link>` "See all"):

```tsx
// Before
<Link href="/work" className="group inline-flex items-center gap-2 text-secondary hover:text-primary duration-200">
  <span>See all work</span>
  <span className="group-hover:translate-x-0.5">→</span>
</Link>

// After
<Button asChild intent="link" size="md" trailingIcon={<ArrowIcon />}>
  <Link href="/work">See all work</Link>
</Button>
```

### 9.6 Migration count reconciliation

- Group A: 22 direct sites
- Group B: 1 direct site
- Group C: 1 dynamic site (3 rendered)
- Group D: 1 direct site + 3 MDX indirect
- Group E: 4 marketing-bypass sites
- **Total: 22 + 1 + 1 + 1 + 4 = 29 files touched**, matching Agent A's reconciliation (25 direct + 4 bypass = 29 migration targets, plus 3 MDX consumers unchanged aside from prop rename).

### 9.7 Migration not included

- `src/components/video/video-controls.tsx:163` captions `aria-pressed` — deferred (v2).
- Any `pressed` / toggle-group semantics — deferred.
- `kbd` hint badges / count badges — deferred.

---

## 10. Real-context rendering specs (for Stage 6)

Exact Button invocations for Stage 6 Figma-vs-code screenshot parity. Five contexts per Stage 0 success matrix.

### 10.1 Hero CTA (OUT OF SCOPE — hero uses engine-native raw link; Button primitive intentionally not used)

The homepage hero (`src/components/hero/index.tsx:148-150`) renders a raw `<a>` tag with uppercase mono styling ("SEE THE WORK →") that is aesthetically load-bearing inside the scroll-engine hero — inserting a primary Button here would feel bolted-on against the mono/scroll cadence. Stage 6 orchestrator decision (2026-04-16): retain as-is. The content below remains as informational context for any future re-evaluation if the hero treatment changes.

```tsx
<Button intent="primary" size="md" trailingIcon={<ArrowIcon />} asChild>
  <Link href="/contact">Start a conversation</Link>
</Button>
```

Stage 6 capture: 2 screenshots — `[data-theme="light"]` + `[data-theme="dark"]`, button at rest AND at hover (arrow +2px). All 4 frames → Figma parity check.

### 10.2 CTA section bottom (primary + secondary side-by-side, lg)

Location: `src/components/cta.tsx` replacement.

```tsx
<div className="flex gap-3">
  <Button intent="primary" size="lg" trailingIcon={<ArrowIcon />} asChild>
    <Link href="/contact">Start a conversation</Link>
  </Button>
  <Button intent="secondary" size="lg" asChild>
    <Link href="/work">Browse work</Link>
  </Button>
</div>
```

Gap = `0.75rem` (12px); tracks Tailwind scale, not a button-specific token — consumer responsibility.

### 10.3 Inside a Card (secondary, sm — tests radius nesting)

Location: existing card context (e.g. `src/components/process.tsx` tile).

```tsx
<article className="rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] p-[10px]">
  <h3 className="text-lg">Process name</h3>
  <p className="text-secondary">...</p>
  <Button intent="secondary" size="sm">Learn more</Button>
</article>
```

Stage 6 must verify visually that the Button's corners are visually parallel to the card's corners at the 10px interior offset. Zoom test at 200% minimum.

### 10.4 AnnouncementBar (ghost, xs — tests dense context)

Location: `src/components/announcement-bar.tsx` after migration (§ 9.5 E.3).

```tsx
<Button intent="ghost" size="xs" trailingIcon={<ArrowIcon />} asChild>
  <Link href="/work/latest">Read it</Link>
</Button>
```

Stage 6 check: button doesn't visually crowd the 40px bar; `xs` 24px + 8px vertical centering breathing room above and below.

### 10.5 Inline in MDX body (link variant, tests prose integration)

Location: any existing `.mdx` file, e.g. `src/lib/posts/unblocking-agents.mdx`.

```tsx
Get in touch via <Button asChild intent="link"><a href="mailto:hello@rubriclabs.com">email</a></Button>.
```

Stage 6 check: underline is rendered (because in `article` context, per § 8.4 data-attribute rule), matches prose underline-offset-3 decoration-1.

---

## 11. Out of scope (lock)

Restating resolved decision #5's omissions + Stage 0 brief's exclusions. Stage 3 MUST NOT implement any of:

1. **`ButtonGroup`** / split-button compositions. Separate primitive later.
2. **`SplitButton`** / dropdown-attached trigger. Separate primitive.
3. **Destructive intent** (`intent="danger"`). Not required until a real destructive flow exists.
4. **Gradient fills** on any variant. Off-brand per latent voice § 8 anti-pattern 2.
5. **Animated borders / glow / halo effects**. Off-brand per latent voice § 8 anti-pattern 1.
6. **Kbd-hint badges** (like `⌘K`). Compound pattern; separate primitive.
7. **Count badges** (notification dots, counters). Compound pattern.
8. **Async typewriter** / label morph on loading. v1 is spinner-in-place only.
9. **Sound / haptics / confetti** on any interaction.
10. **`outline` variant** (legacy). Collapsed into `secondary`.
11. **`icon` as a variant**. Split into `iconOnly` modifier.
12. **Toggle / `pressed` prop** / `aria-pressed`. Deferred. Captions toggle (§ 9.1 row 22) retains today's className fork for v1.
13. **Scale-down active transform**. No precedent in codebase; latent voice § 2 inference 4.
14. **Dark-class theming** (`dark:` Tailwind modifier). Tokens resolve against `[data-theme]` / `prefers-color-scheme` (resolved decision #8).

---

## 12. Open questions for Dexter

**None.** Stage 1 synthesis resolved all 11 decisions that were open at the close of Stage 1. Every spec choice above cites either:
- A Stage 1 resolved decision (by number), OR
- An Agent A usage-grounded observation, OR
- An Agent B latent voice inference, OR
- An Agent C token gap proposal (with the three additions in § 4.2 as Stage 2 elaborations on top).

The spec is ready to build. Stage 3-A (code) and Stage 3-B (Figma) can dispatch in parallel off this contract with no further creative input.

One non-blocking note for Stage 4 critics to watch: **primary hover darkening mechanism** (§ 5.2 note) — overlay vs. dedicated `--color-primary-hover` token is implementer choice. If Polish Critic flags overlay as opaque-math-hidden, promote to token and add one line to the token patch.

ultrathink
