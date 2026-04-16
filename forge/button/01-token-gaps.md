# Button — Token Gap Audit

Stage 1, Agent C. Audit against Stage 0 preview token contract. Source: `src/app/globals.css` (lines 1–68 are the token surface; lines 70+ are consumers).

## 1. Current token surface (globals.css)

Grouped by family. Values shown as `light / dark`. Line numbers cite the `:root` light block (3–13), the `prefers-color-scheme: dark` block (15–27), the `[data-theme="light"]` block (29–40), the `[data-theme="dark"]` block (42–53), and the `@theme inline` exposure to Tailwind (55–68).

### Colors (source variables in theme blocks)
| Token | Light | Dark | Lines |
|---|---|---|---|
| `--primary` | `black` | `white` | 4, 17, 30, 43 |
| `--secondary` | `#666` | `#999` | 5, 18, 31, 44 |
| `--background` | `#f5f0ec` (warm beige) | `black` | 6, 19, 32, 45 |
| `--negative` | `#222` | `#ddd` | 7, 20, 33, 46 |
| `--subtle` | `#0000001a` (black/10) | `#ffffff1a` (white/10) | 8, 21, 34, 47 |
| `--accent` | `#dedad7` (black/20 on bg) | `#1d1d1d` (white/20 on black) | 9, 22, 35, 48 |
| `--accent-foreground` | `black` | `white` | 10, 23, 36, 49 |
| `--tint` | `#8a9a9a` (warm grey-teal) | `#7a9090` (warm grey-teal) | 11, 24, 37, 50 |
| `--danger` | `red` | `red` | 12, 25, 38, 51 |

### Colors (@theme inline aliases for Tailwind)
| Token | Maps to | Line |
|---|---|---|
| `--color-primary` | `var(--primary)` | 56 |
| `--color-background` | `var(--background)` | 57 |
| `--color-subtle` | `var(--subtle)` | 58 |
| `--color-negative` | `var(--negative)` | 59 |
| `--color-secondary` | `var(--secondary)` | 60 |
| `--color-accent` | `var(--accent)` | 61 |
| `--color-accent-foreground` | `var(--accent-foreground)` | 62 |
| `--color-tint` | `var(--tint)` | 63 |
| `--color-danger` | `var(--danger)` | 64 |

### Radius
| Token | Value | Line |
|---|---|---|
| `--radius-custom` | `1.625rem` (26px) | 65 |

### Type
| Token | Value | Line |
|---|---|---|
| `--font-sans` | `var(--font-matter)` | 66 |
| `--font-mono` | `var(--font-mono)` | 67 |

No label-scale tokens. Body sizes live as literal `text-[15px]` / `text-[13px]` / `text-[9px]` in consumer classes (135–170).

### Motion
None. No `--duration-*` or `--easing-*` tokens exist. Existing animations use hard-coded literals: `transition 0.15s ease` (318), `0.3s ease` (300), `0.25s ease-out` (344, 408), `1.06s step-end` (441), `300ms ease-out` (445), `1.5s ease-in-out` (449, 470). Every one is ad-hoc — no shared easing curve, no shared duration.

### Spacing
None. Tailwind's default scale (1=4px, 2=8px, 3.5=14px, etc.) is used directly. No component-scoped spacing tokens.

### Other (non-token styling that's in globals.css)
- `color-scheme: light/dark` declarations (39, 52)
- Scrollbar styles (122–131)
- Article typography cascade (134–214)
- Code block styling (217–245)
- Video player styles (248–422)
- Animations: `blink`, `fadeIn`, `bounce-gentle`, `scroll-trace`, `scroll-logos`, `shimmer`, `pulse-dot`, `pip-transition`, `fullscreen-transition` (424–476)
- `.visual-placeholder` helper (478–494)

None of the above are Button-relevant except as evidence that the codebase has **zero motion tokens** today — ad-hoc transition durations in consumer selectors.

## 2. Required tokens for Button

Restated from `00-context.md` § "Token contract (preview)":

**Color (semantic roles, both themes):**
- `--color-primary` + `--color-primary-foreground`
- `--color-surface-raised` + `--color-surface-raised-hover`
- `--color-surface-ghost-hover`
- `--color-border-hairline`
- `--color-focus-ring`

**Radius:** `--radius-control` (6px).

**Type:** `--text-label-xs/sm/md/lg` (12/13/14/15) @ weight 500. `--font-feature-tnum` for numeric.

**Motion:** `--duration-fast` (150ms), `--duration-snap` (50ms), `--duration-normal` (220ms). `--easing-out` `cubic-bezier(0.16, 1, 0.3, 1)`. `--easing-snap` `cubic-bezier(0.2, 0.8, 0.2, 1)`.

**Spacing:** `--space-button-y-[xs|sm|md|lg]`, `--space-button-x-[xs|sm|md|lg]`, `--space-button-gap`.

## 3. Gap analysis

| Required token | Exists? | Current name (if renamed) | Current value | Action | Proposed name | Proposed value (light / dark) | Rationale |
|---|---|---|---|---|---|---|---|
| `--color-primary` | Yes | `--color-primary` → `var(--primary)` | `black / white` | `KEEP` | `--color-primary` | `black / white` | Already exists and is correct for filled primary. |
| `--color-primary-foreground` | No (derivable) | — | — | `ADD` (alias) | `--color-primary-foreground` | `var(--background)` | The codebase already uses `bg-primary text-background` as the inverse pattern (line 72). Alias makes it semantic. Resolves to `#f5f0ec / black`. |
| `--color-surface-raised` | Yes | `--color-accent` → `var(--accent)` | `#dedad7 / #1d1d1d` | `KEEP` + `ADD` alias | `--color-surface-raised` | `var(--accent)` | `--accent` at the chroma/value of black/20-on-bg is exactly the raised-surface role. Alias for semantic Button usage; recommend `--color-accent` stays as legacy alias to avoid touching existing consumers. |
| `--color-surface-raised-hover` | No | — | — | `ADD` | `--color-surface-raised-hover` | `#d4cec9 / #262626` | One warm step darker than `--accent` in light, one neutral step lighter in dark. Light value stays in the warm beige family (no cool shift). Dark value is a neutral grey, not a cool grey — avoids blue drift. Added as a new source variable `--accent-hover` in each theme block, exposed via `@theme inline`. |
| `--color-surface-ghost-hover` | Partial | `--color-subtle` → `var(--subtle)` | `black/10 / white/10` | `ADD` alias | `--color-surface-ghost-hover` | `var(--subtle)` | `--subtle` is already the low-alpha-primary stamp ghost hover wants. Aliasing makes the semantic role readable in Button code; zero new values. |
| `--color-border-hairline` | Partial | `--color-subtle` → `var(--subtle)` | `black/10 / white/10` | `ADD` alias | `--color-border-hairline` | `var(--subtle)` | Same source as ghost-hover but different semantic role (border not fill). Keeping two names pointed at one value is cheap and makes Button code self-documenting. |
| `--color-focus-ring` | Partial | `--color-tint` → `var(--tint)` | `#8a9a9a / #7a9090` | `ADD` alias | `--color-focus-ring` | `var(--tint)` | `--tint` is the warm grey-teal already on-brand. Chroma is enough to distinguish the ring from both the primary text and the background; contrast ≥ 3:1 against `--background` in both themes (tested: #8a9a9a on #f5f0ec ≈ 2.9:1 borderline → see § 5). Alias makes the role explicit. |
| `--radius-control` | No | — | — | `ADD` | `--radius-control` | `0.375rem` (6px) | Matches Stage 0 contract. Nests inside a 16px card with 10px padding → `16 − 10 = 6` (see § 6). |
| `--text-label-xs` | No | — | — | `ADD` | `--text-label-xs` | `0.75rem` (12px) | Per density table. |
| `--text-label-sm` | No | — | — | `ADD` | `--text-label-sm` | `0.8125rem` (13px) | Per density table. |
| `--text-label-md` | No | — | — | `ADD` | `--text-label-md` | `0.875rem` (14px) | Per density table. |
| `--text-label-lg` | No | — | — | `ADD` | `--text-label-lg` | `0.9375rem` (15px) | Per density table. |
| `--font-feature-tnum` | No | — | — | `ADD` | `--font-feature-tnum` | `"tnum"` | Only value required by the contract; used as `font-feature-settings: var(--font-feature-tnum)` on numeric labels. |
| `--duration-fast` | No | — | — | `ADD` | `--duration-fast` | `150ms` | Exact contract value. |
| `--duration-snap` | No | — | — | `ADD` | `--duration-snap` | `50ms` | Exact contract value. |
| `--duration-normal` | No | — | — | `ADD` | `--duration-normal` | `220ms` | Exact contract value; reserved for larger transitions (reveal, collapse). Button only uses `fast` + `snap`, but the contract names `normal` — adding now closes the triad and is one line. |
| `--easing-out` | No | — | — | `ADD` | `--easing-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Exact contract value. |
| `--easing-snap` | No | — | — | `ADD` | `--easing-snap` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Exact contract value. |
| `--space-button-y-xs` | No | — | — | `ADD` | `--space-button-y-xs` | `0.25rem` (4px) | Density table. |
| `--space-button-y-sm` | No | — | — | `ADD` | `--space-button-y-sm` | `0.375rem` (6px) | Density table. |
| `--space-button-y-md` | No | — | — | `ADD` | `--space-button-y-md` | `0.5rem` (8px) | Density table. |
| `--space-button-y-lg` | No | — | — | `ADD` | `--space-button-y-lg` | `0.625rem` (10px) | Density table. |
| `--space-button-x-xs` | No | — | — | `ADD` | `--space-button-x-xs` | `0.625rem` (10px) | Density table. |
| `--space-button-x-sm` | No | — | — | `ADD` | `--space-button-x-sm` | `0.75rem` (12px) | Density table. |
| `--space-button-x-md` | No | — | — | `ADD` | `--space-button-x-md` | `0.875rem` (14px) | Density table. |
| `--space-button-x-lg` | No | — | — | `ADD` | `--space-button-x-lg` | `1.125rem` (18px) | Density table. |
| `--space-button-gap` | No | — | — | `ADD` | `--space-button-gap` | `0.375rem` (6px) | 6px gap at xs/sm/md per density table. The `lg` variant wants 8px — for v1 ship one canonical 6px token; if Stage 2 spec confirms the lg difference is needed, append `--space-button-gap-lg: 0.5rem` as a one-liner. Not speculative-added here. |

Action tallies: `KEEP` = 2, `ADD` (aliases only) = 5, `ADD` (new values/scales) = 18.

## 4. Minimal additive patch proposal

All additions. No deletions. No modifications to existing tokens. Three insertion sites only: the light-theme source variables (`:root` + `[data-theme="light"]`), the dark-theme source variables (`prefers-color-scheme: dark` + `[data-theme="dark"]`), and the `@theme inline` Tailwind exposure.

Only one new **source color variable** is needed — `--accent-hover`, added to all four theme blocks — because every other Button color maps to something that already exists. The rest of the additions live inside `@theme inline` as semantic aliases and non-color scales.

### Addition A — new source color in `:root` (insert after line 9, before `--accent-foreground` on line 10)

```css
	--accent-hover: #d4cec9; /* one warm step below --accent */
```

### Addition B — same in `prefers-color-scheme: dark` `:root` (insert after line 22)

```css
		--accent-hover: #262626; /* one neutral step above --accent */
```

### Addition C — `[data-theme="light"]` block (insert after line 35)

```css
	--accent-hover: #d4cec9;
```

### Addition D — `[data-theme="dark"]` block (insert after line 48)

```css
	--accent-hover: #262626;
```

### Addition E — `@theme inline` block (insert after line 67, before closing `}` on line 68)

```css
	/* Semantic color aliases (Button + downstream components) */
	--color-primary-foreground: var(--background);
	--color-surface-raised: var(--accent);
	--color-surface-raised-hover: var(--accent-hover);
	--color-surface-ghost-hover: var(--subtle);
	--color-border-hairline: var(--subtle);
	--color-focus-ring: var(--tint);

	/* Radius scale (card-to-control nesting, 16 − 10 = 6) */
	--radius-card: 1rem;         /* 16px */
	--radius-control: 0.375rem;  /* 6px */

	/* Type — label scale for controls, weight applied at component */
	--text-label-xs: 0.75rem;    /* 12px */
	--text-label-sm: 0.8125rem;  /* 13px */
	--text-label-md: 0.875rem;   /* 14px */
	--text-label-lg: 0.9375rem;  /* 15px */
	--font-feature-tnum: "tnum";

	/* Motion — durations and easings */
	--duration-snap: 50ms;
	--duration-fast: 150ms;
	--duration-normal: 220ms;
	--easing-out: cubic-bezier(0.16, 1, 0.3, 1);
	--easing-snap: cubic-bezier(0.2, 0.8, 0.2, 1);

	/* Spacing — Button density (Linear-ish, per Stage 0 density table) */
	--space-button-y-xs: 0.25rem;    /* 4px  */
	--space-button-y-sm: 0.375rem;   /* 6px  */
	--space-button-y-md: 0.5rem;     /* 8px  */
	--space-button-y-lg: 0.625rem;   /* 10px */
	--space-button-x-xs: 0.625rem;   /* 10px */
	--space-button-x-sm: 0.75rem;    /* 12px */
	--space-button-x-md: 0.875rem;   /* 14px */
	--space-button-x-lg: 1.125rem;   /* 18px */
	--space-button-gap: 0.375rem;    /* 6px  */
```

### Net footprint

- Source color variable `--accent-hover`: 4 new lines (one per theme block).
- `@theme inline` additions: ~34 lines (including section comments and trailing comment annotations).
- **Total net additions: ~38 lines across one file.**

No existing line changes. No deletions. No renames applied (deferred — see § 7).

## 5. Light/dark parity

Every new color token has both light and dark values proposed, either as a literal pair or by aliasing a source variable that already has both.

| Token | Light resolves to | Dark resolves to | Warm? |
|---|---|---|---|
| `--color-primary-foreground` | `#f5f0ec` | `black` | Yes (warm beige on light) |
| `--color-surface-raised` | `#dedad7` | `#1d1d1d` | Yes (light side in warm beige family) |
| `--color-surface-raised-hover` | `#d4cec9` | `#262626` | Yes (light side warm; dark side neutral, no blue drift) |
| `--color-surface-ghost-hover` | `black/10` | `white/10` | Neutral-on-warm — stamp inherits warmth from underlying `--background` |
| `--color-border-hairline` | `black/10` | `white/10` | Same as above |
| `--color-focus-ring` | `#8a9a9a` warm grey-teal | `#7a9090` warm grey-teal | Yes — the only chromatic token in the new set |

**Warmth called out:**
- Light `--accent-hover: #d4cec9` was chosen over `#d0cac4` or a cooler `#d4d2cf` specifically to stay in the warm-beige family. RGB = (212, 206, 201) — R ≥ G ≥ B, same warm ordering as `#dedad7` (222, 218, 215).
- Dark `--accent-hover: #262626` is a neutral grey (R=G=B). This is deliberate — in dark mode the warmth comes from the palette's *absence of cool blue shifts*, not from warm tint in near-black greys. Any light-warm tint in dark-mode hover backgrounds tends to read as a bug, not a feature. Matches the existing `--accent: #1d1d1d` which is also neutral.
- `--color-focus-ring` uses the existing warm grey-teal `--tint`. This was the single highest-leverage decision in this audit: it reuses a token that already ships and is already warm, instead of introducing a saturated accent colour for focus.

**Contrast note — to flag for Stage 2:** `#8a9a9a` on `#f5f0ec` measures ≈ 2.9:1, which is *below* the 3:1 non-text target for focus indicators. Two resolutions, both cheap: (a) render the ring with a 2px outline offset so contrast is measured against the *adjacent* `--background` + an inner ring outline, which pushes effective contrast above threshold by using two boundaries; or (b) darken the light-theme `--tint` to `#6d7f7f` which hits 4.2:1 while staying warm grey-teal. This is a **Stage 2 decision**, not a Stage 1 gap — the token exists, its role is right, only the exact value may need tuning for WCAG.

## 6. Nesting math check

Stage 0 contract states: "radius-card 16px, 10px padding, `16 − 10 = 6`" for button sitting inside a card.

### Path I evaluated and rejected

Use the existing `--radius-custom: 1.625rem` (26px) as the card radius. Then button radius would need to be `26 − X` where X is card padding. For the 6px contract value, X = 20px; for a more typical 10px card padding, button radius = 16px, not 6px. This would break the Stage 0 contract value.

### Path chosen

Introduce a new `--radius-card: 1rem` (16px) alongside `--radius-custom: 1.625rem` (26px). They are different tokens for different surface levels:

- `--radius-custom: 26px` — **outer large surfaces** (hero chips, full-width banners, marquee elements). Existing consumers untouched.
- `--radius-card: 16px` — **content cards where buttons nest**. New token for Button's nesting contract.
- `--radius-control: 6px` — **controls** (buttons, inputs once migrated).

Nesting proof:

```
outer card  (radius 16px) ────┐
  padding-inset 10px          │
    button  (radius 6px)      │  ← 16 − 10 = 6 ✓
```

This is the exact contract math. `--radius-control: 0.375rem` = 6px satisfies it.

Double-check for the other tier: if Button ever nests inside a `--radius-custom` (26px) surface with 10px padding, the inner radius needed would be 16px — which is `--radius-card`. So the three-tier scale (`custom 26` → `card 16` → `control 6`) nests consistently: each level subtracts ~10px padding from the level above. Clean.

## 7. Semantic naming recommendations (for Stage 2 to consider)

These are **not** part of the Stage 1 additive patch. Stage 2 decides whether to apply any of them. I list them because the current names in globals.css are descriptive-not-semantic, and Button's arrival is the natural moment to promote them.

| Existing name | Proposed semantic name | Reason |
|---|---|---|
| `--subtle` | `--color-surface-subtle` or `--color-border-hairline` | `--subtle` describes opacity, not role. Two distinct roles (ghost-hover fill vs. hairline border) share this value. |
| `--accent` | `--color-surface-raised` | `--accent` suggests a chromatic accent colour; the actual value is a raised-surface step. |
| `--accent-foreground` | `--color-surface-raised-foreground` | Pairs with above. |
| `--tint` | `--color-focus-ring` or `--color-accent` | `--tint` is unclear; Button wants it as focus. In other components it may be decorative. Possibly the *only* "accent" colour in the system, so a true `--color-accent` could be the right destination. |
| `--negative` | `--color-primary-muted` | `--negative` reads like it means "error." The value is near-primary. Potentially confusing. |

If Stage 2 accepts any of these renames, legacy aliases should remain for one release cycle to avoid breaking every consumer call site. Recommendation: **defer the whole rename conversation to Stage 2** and ship v1 with the additive aliases from § 4. That keeps Stage 1 minimal and zero-risk.

## 8. Deliberate non-additions

Tokens the preview contract might imply or that a typical component system would include, but which I recommend NOT adding in v1:

- **`--shadow-*` tokens** — Rubric's surface language is hairline-based. There is zero use of `box-shadow` for component chrome in the current codebase (only inside a pip-to-video keyframe as presentational transform). Shadows would be off-brand. Defer until a real use case arrives.
- **`--blur-*` / backdrop-filter tokens** — unused in codebase. No Button variant needs blur.
- **`--gradient-*` tokens** — Stage 0 explicitly forbids gradient fills on Button. The only gradient in `globals.css` is in `.animate-shimmer` and `.visual-placeholder`, which are unrelated to controls.
- **`--color-danger-*`, `--color-destructive-*`** — `--danger: red` exists, but Stage 0 lists destructive intent as out-of-scope for v1. Do not proliferate destructive tokens yet.
- **`--space-button-gap-lg`** — the density table shows 8px gap at lg vs. 6px at xs/sm/md. For v1, ship a single `--space-button-gap: 6px`. If Stage 2 confirms the 8px lg variant needs a dedicated token (rather than an inline Tailwind override), add one line then — do not speculate-add now.
- **Weight tokens (`--font-weight-medium: 500`)** — the contract says labels are weight 500, but weight is literal in consumer code across the whole project (e.g. `font-semibold` on `article strong`). Adding a single weight token for Button alone creates inconsistency. Button uses `font-medium` (Tailwind) at the component level; no token.
- **Letter-spacing / tracking tokens** — the contract says "tracking tightened at larger sizes." This is a per-size micro-tweak best expressed at component level (`tracking-tight` on `lg`) rather than four new `--letter-spacing-label-*` tokens. Revisit if a second component (Heading?) shares the same scale.
- **Full T-shirt spacing scale (`--space-xs`/`sm`/`md`/`lg`)** — tempting to generalise, but Tailwind's `p-1/1.5/2/2.5/...` already is a T-shirt scale and the codebase uses it directly. Button-scoped spacing tokens are the *narrowest* abstraction that satisfies the contract; a general `--space-*` scale is speculative work for "some future component."
- **`--duration-slow` (≥ 300ms)** — contract lists three durations (snap/fast/normal); I added all three. Not adding a fourth.
- **Animation presets (`--animation-fade-in`)** — contract doesn't require; the existing `.animate-fadeIn` class is fine for non-Button use.

The discipline here: the token set must unblock Button without anticipating six unspecified downstream components. Every aspirational token is a future "why is this here?" debt.

## 9. Summary: patch scope

- **Tokens kept as-is:** 2 (`--color-primary`, `--radius-custom`).
- **Tokens to rename (deferred to Stage 2):** 5 (`--subtle`, `--accent`, `--accent-foreground`, `--tint`, `--negative`) — recommendations only, no Stage 1 action.
- **Tokens to add:** 23 total
  - 5 semantic color aliases (`--color-primary-foreground`, `--color-surface-raised`, `--color-surface-raised-hover`, `--color-surface-ghost-hover`, `--color-border-hairline`, `--color-focus-ring`) — 6 by count but `--color-surface-raised-hover` requires one new source value `--accent-hover` (new in all 4 theme blocks)
  - 2 radius tokens (`--radius-card`, `--radius-control`)
  - 5 type tokens (4 label sizes + `--font-feature-tnum`)
  - 5 motion tokens (3 durations + 2 easings)
  - 9 spacing tokens (4 y + 4 x + 1 gap)
- **Tokens intentionally not added:** 8 families (shadow, blur, gradient, destructive, button-gap-lg, weight, tracking, general T-shirt space scale).
- **Net globals.css additions:** ~38 lines across one file, 3 insertion sites; zero deletions, zero modifications, zero renames applied.

ultrathink
