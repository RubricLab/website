# Button — Stage 0 Context Lock

## Mission

Button is the lighthouse primitive for Rubric's design system. Every subsequent component is "the same polish bar, applied to X." If Button is right, the system is unblocked.

## Positioning

Rubric is an applied AI lab and product studio. Tone: restrained, confident, warm-tinted, technically credible. Density matches Linear (not Stripe/Vercel). Light AND dark ship simultaneously at v1 with side-by-side parity in Figma.

## The 7 polish dimensions applied to Button

1. **Radius nesting** — all buttons use `radius-control` (6px target). When a button sits inside a card (radius-card 16px, 10px padding), `16 − 10 = 6` nests perfectly. Nesting is proven, not promised.
2. **Surfaces** — four surface treatments: filled (primary), raised-subtle (secondary), ghost (reveal on hover), link (none). Each surface has a warm-tinted theme parity.
3. **Borders** — primary: none (surface does the work). Secondary: hairline 1px at low-alpha primary. Ghost: none. Focus: 2px ring with 2px offset, distinct from border.
4. **Type rhythm** — `text-label` scale (13/14/15px by size), weight 500, tracking tightened at larger sizes. Tabular figures for numeric content.
5. **Motion** — hover bg transition: `duration-fast (150ms) / out-cubic`. Active scale 0.98: `duration-snap (50ms) / out-expo`, releases on pointer-up. Focus ring: instant (no transition — accessibility clarity). `prefers-reduced-motion` disables scale, keeps color transitions.
6. **States** — rest · hover · focus-visible · active · disabled · loading. All six designed, all six in Figma, all six covered in snapshot tests.
7. **Brand** — restraint first. No gradient fills, no animated borders, no glow. Warmth comes from the existing `#f5f0ec` / `black` palette, amplified via tinted surface hovers.

## Density — Linear-ish interpretation

| Size | Height | Paddings (y/x) | Label | Icon gap |
|------|--------|----------------|-------|----------|
| xs   | 24px   | 4 / 10         | 12px  | 6px      |
| sm   | 28px   | 6 / 12         | 13px  | 6px      |
| md   | 32px   | 8 / 14         | 14px  | 6px      |
| lg   | 40px   | 10 / 18        | 15px  | 8px      |

Height numbers are targets — Stage 2 spec authoritatively locks. Not 44/48 the way Stripe/Vercel sit.

## Variant matrix

```
Intent    × Size × State             × Theme
─────────   ─────   ─────────────────   ─────
primary     xs      rest                light
secondary   sm      hover               dark
ghost       md      focus-visible
link        lg      active
                    disabled
                    loading
```

**4 intents × 4 sizes × 6 states × 2 themes = 192 Figma variant cells.** Every cell exists, every cell is reachable in code.

Intent semantics:
- `primary` — filled `--primary` bg, inverse foreground. One per surface. Default in context = the confirming action.
- `secondary` — `surface-raised` bg + hairline border + `--primary` text. Neutral affirmative.
- `ghost` — transparent at rest, `surface-ghost-hover` tint on hover. Toolbar, nav, dense contexts.
- `link` — no surface; underlined `--primary` text. Inline prose, small inline CTAs.

Modifiers (composable, Stage 2 locks the prop API):
- `leadingIcon` / `trailingIcon` (14–16px SVG)
- `iconOnly` (square hit-target padding)
- `loading` (spinner replaces label, width locked to prevent shift)
- `fullWidth` (sizes to container)

## Token contract (preview — Stage 2 spec is authoritative)

Button requires, at minimum, these tokens to exist before it is buildable:

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

## Accessibility baseline — non-negotiable

- Semantic `<button>` element (never `<a>` / `<div>` for button intent).
- `aria-busy="true"` during loading; label remains in DOM (sr-only if visually hidden).
- Focus-visible ring ≥ 3:1 contrast against background, 2px ring + 2px offset, radius-matched.
- Label contrast ≥ 4.5:1 (WCAG AA).
- Hit target ≥ 44px at md/lg. xs/sm permitted in dense contexts (Linear precedent).
- `prefers-reduced-motion: reduce` disables scale + bg transitions.
- Keyboard: Space AND Enter both trigger. `Tab` focus order natural. No custom focus traps.

## Light/dark — side-by-side mandate

Both themes ship at v1. Figma frames present every (intent × size × state) cell in **light and dark simultaneously, side by side** — parity is proven visually, not promised.

Code uses existing `[data-theme="light|dark"]` pattern + `prefers-color-scheme` media query already in `src/app/globals.css`.

## Success criteria (Stage 6 real-context test)

Button passes when, placed in these contexts, Dexter's eye says yes:
1. **Hero CTA** on homepage (primary, md, light + dark)
2. **CTA section** at page bottom (primary + secondary side-by-side, lg)
3. **Inside a Card** (secondary, sm — tests radius nesting)
4. **AnnouncementBar** (ghost, xs — tests dense context)
5. **Inline in MDX body** (link variant, tests prose integration)

Screenshots captured for each, side-by-side light/dark. No visual regressions against Figma.

## Out of scope for v1

- `ButtonGroup` / `SplitButton` — separate primitives later
- Destructive intent — additive after base locks
- Gradient fills, animated borders, glow effects — off-brand
- Sound / haptics / confetti
- Async loading text transitions (typewriter, morph) — v1 is spinner-in-place only
- Kbd-hint badges, count badges — compound patterns, separate primitive

## Stage 1 dispatch plan (upon your greenlight)

Three Opus agents, single message, parallel, each in its own scope:

- **Agent A — Codebase usage scan.** Reads `src/components/button.tsx` + greps every `<Button>` call site on `dexter/site-rebuild`. Outputs variant coverage matrix: which intents/sizes/states are used today, which are implied but missing, which are unused.
- **Agent B — Latent voice extraction.** Reads `src/app/globals.css`, `src/components/card.tsx`, `src/components/nav.tsx`, `src/components/footer.tsx`, `src/components/hero/scaffold.tsx`. Extracts the implicit Rubric design language: what does the existing palette/type/radius/motion vocabulary imply about how a button should feel? NOT looking at external brands.
- **Agent C — Token gap audit.** Reads `src/app/globals.css`. Against the token contract listed above, identifies exactly which tokens exist, which need adding, which need renaming for semantic clarity. Produces a minimal patch proposal for Stage 2 to validate.

Each agent writes one file, nothing else. Outputs land at `forge/button/01-codebase-usage.md`, `01-latent-voice.md`, `01-token-gaps.md`. I synthesize into a greenlight summary for Stage 2.

---

**Gate status: awaiting Dexter signoff on Stage 0 context.**

If any of the above is wrong in intent, correct it before Stage 1 fires. Stage 1 runs on this brief.
