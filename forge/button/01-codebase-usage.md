# Button — Codebase Usage Scan

Grounded in `forge/button` worktree off `dexter/site-rebuild`. Scans `src/`. No external references.

## Current implementation

- **File:** `src/components/button.tsx`
- **LOC:** 51 (including the empty line / closing brace block)
- **Exported API:** Named export `Button` — a function component, not `forwardRef`. Prop signature:
  ```ts
  {
    children: React.ReactNode
    type?: 'button' | 'submit' | 'reset' // default 'button'
    variant?: 'default' | 'ghost' | 'icon' | 'link' | 'outline' // default 'default'
    size?: 'sm' | 'md' | 'lg' // default 'md'
    onClick?: () => void
    className?: string
    disabled?: boolean
  }
  ```
- **Variants currently defined (5):** `default`, `ghost`, `icon`, `link`, `outline`.
  - `default` — `bg-subtle`, hover `bg-black/20` (light) / `bg-white/20` (dark), pill (`rounded-full`).
  - `ghost` — transparent, same hover tints as default, pill (`rounded-full`).
  - `icon` — `!px-1.5 !py-1.5`, `rounded` (NOT pill, NOT `rounded-full`), `focus:ring-0` (disables focus ring!), same hover tints.
  - `link` — `text-secondary` → hover `text-primary`, `focus:ring-0`, `!p-0` (strips padding).
  - `outline` — `border-subtle`, border on hover shifts opacity, pill.
- **Sizes currently defined (3):** `sm` (`p-2 px-4 text-xs`), `md` (`p-3 px-6 text-sm`), `lg` (`p-4 px-8 text-base`). NO `xs`.
- **States handled:**
  - `disabled` prop → `disabled:cursor-not-allowed`; hover variants are gated with `enabled:` modifier so no hover on disabled.
  - `focus` → `focus:ring` + `ring-secondary` + `focus:outline-none` (non-focus-visible; affects mouse clicks too). `icon` + `link` override to `focus:ring-0` (removes focus ring entirely — a11y regression surface).
  - No `loading` state, no `aria-busy`, no spinner, no `focus-visible`, no `active`, no width-locking.
- **Notable internals:**
  - Single `cn()` call composes base + variant + size + className.
  - No `forwardRef`, no `ref` forwarding — so can't compose with Radix Slot, tooltips, or popovers that need the DOM node.
  - No `asChild` / `Slot` pattern — cannot render as `<Link>` without wrapping externally.
  - No `type="submit"` default for form integration despite contact-form having a submit.
  - Hover classes use tag-chained `dark:enabled:hover:` — entire theme strategy is dark-class-on-html rather than the `[data-theme]` + `prefers-color-scheme` model that the Stage 0 brief references for `globals.css`.
  - `transition-all` (not scoped to bg/color) — causes layout-shift transitions on any prop change.
  - Base class includes `w-fit` (hard-coded) — no `fullWidth` escape hatch.

## Call site inventory

25 direct JSX call sites across 12 consumer files. Table ordered by file.

| File:line | Context (section / purpose) | Variant | Size | Icons | State props | Custom `className`? | Notes |
|---|---|---|---|---|---|---|---|
| `src/components/codeblock.tsx:18` | Copy-to-clipboard in code block (MDX) | `icon` | `sm` | Copy / Checkmark (`h-4 w-4`) | onClick | Yes — `absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100` | Position + reveal-on-parent-hover. State swap via children. |
| `src/components/copiable.tsx:31` | MDX inline copiable wrapper (email, etc.) | `{variant}` — passed through | `{size}` (default `md`) | — | onClick | Yes — `cn(className, 'relative inline-flex')` | Pass-through; MDX consumers use `variant="link"` + `size="lg"`. |
| `src/components/figure.tsx:31` | Figure share link button (blog figures) | `icon` | `sm` | ShareIcon (`h-4 w-4`) | onClick | No | Renders inside `Figure.Share` compound. Used 7× indirectly via `<Figure.Share />`. |
| `src/components/video/video.tsx:239` | "Play with sound" overlay CTA on homepage hero video | `default` | `sm` | PlayIcon (`size-4`) leading | onClick | Yes — `bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/40` | Only call site with a LEADING ICON + LABEL combo. Re-skins `default` variant to a translucent dark overlay — essentially a one-off. |
| `src/components/video/video.tsx:270` | Floating video close button | `icon` | `sm` | CrossIcon (`size-5`) | onClick, `aria-label="Close video"` | Yes — `absolute top-1 right-1 z-30` | One of few with `aria-label`. |
| `src/components/video/video-controls.tsx:147` | Video play/pause control | `icon` | `sm` | Pause / Play (`size-5`) | onClick, `aria-label` (dynamic) | Yes — `text-white` | On-video transparent chrome. |
| `src/components/video/video-controls.tsx:160` | Video captions toggle | `icon` | `sm` | CaptionsIcon (`size-5`) | onClick, `aria-label="Toggle Captions"` | Yes — `cn('text-white', isCaptionsOn ? 'bg-white/30' : '')` | TOGGLE STATE expressed via className fork — no `pressed`/`aria-pressed`. |
| `src/components/video/video-controls.tsx:171` | Video fullscreen toggle | `icon` | `sm` | Demaximize / Maximize (`size-5`) | onClick, `aria-label` (dynamic) | Yes — `text-white focus:outline-none` | `focus:outline-none` explicitly stripped → a11y regression. |
| `src/components/blog/claude-code/system-architecture.tsx:335` | Figure: play/pause | `icon` | `sm` | Pause / Play (`h-4 w-4`) | onClick | No | — |
| `src/components/blog/claude-code/system-architecture.tsx:339` | Figure: speed selector (0.5x / 1x / 2x) | `default` **OR** `ghost` (dynamic, based on `speed === s`) | `sm` | None — text label `{s}x` | onClick | No | ONLY call site using `default` or `ghost` for a text-label button. Toggle-group pattern. |
| `src/components/blog/claude-code/system-architecture.tsx:348` | Figure: restart | `icon` | `sm` | RestartIcon (`h-4 w-4`) | onClick | No | — |
| `src/components/blog/primitives-over-pipelines/pipeline-primitives-figure.tsx:369` | Figure: play/pause | `icon` | `sm` | Pause / Play (`h-3.5 w-3.5`) | onClick | No | Icons sized `h-3.5` here; `h-4` in claude-code/system-architecture — inconsistent. |
| `src/components/blog/primitives-over-pipelines/pipeline-primitives-figure.tsx:372` | Figure: restart | `icon` | `sm` | RestartIcon (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/primitives-over-pipelines/list-inspect-figure.tsx:155` | Figure: play/pause | `icon` | `sm` | Pause / Play (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/primitives-over-pipelines/list-inspect-figure.tsx:158` | Figure: restart | `icon` | `sm` | RestartIcon (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:248` | Figure: play/pause | `icon` | `sm` | Pause / Play (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:251` | Figure: restart | `icon` | `sm` | RestartIcon (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:258` | Figure: previous scenario | `icon` | `sm` | Arrow rotated 180° (`h-3.5 w-3.5`) | onClick | No | Arrow used as a directional control — no `aria-label`. |
| `src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:261` | Figure: next scenario | `icon` | `sm` | Arrow (`h-3.5 w-3.5`) | onClick | No | Same — no `aria-label`. |
| `src/components/blog/unblocking-agents/one-way-bridge-figure.tsx:224` | Figure: play/pause | `icon` | `sm` | Pause / Play (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/unblocking-agents/one-way-bridge-figure.tsx:227` | Figure: restart | `icon` | `sm` | RestartIcon (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/unblocking-agents/permissions-trap-figure.tsx:253` | Figure: play/pause | `icon` | `sm` | Pause / Play (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/unblocking-agents/permissions-trap-figure.tsx:256` | Figure: restart | `icon` | `sm` | RestartIcon (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/unblocking-agents/before-after-flow-figure.tsx:169` | Figure: play/pause | `icon` | `sm` | Pause / Play (`h-3.5 w-3.5`) | onClick | No | — |
| `src/components/blog/unblocking-agents/before-after-flow-figure.tsx:172` | Figure: restart | `icon` | `sm` | RestartIcon (`h-3.5 w-3.5`) | onClick | No | — |

Indirect consumers (consuming `<Copiable>`, which emits a Button at `copiable.tsx:31`):
- `src/lib/posts/fine-tuning-for-spam-detection.mdx:114` — `variant="link"`, `size="lg"`.
- `src/lib/posts/personalized-video-at-scale.mdx:228` — `variant="link"`, `size="lg"`.
- `src/lib/posts/multi-staging.mdx:137` — `variant="link"`, `size="lg"`.

## Variant coverage today

- **Variants actually used** (of 5 defined):
  - `icon` — **22 direct call sites** (88% of usage). The only seriously-exercised variant.
  - `default` — **2 direct call sites** (video.tsx `Play with sound`, system-architecture speed selector when active).
  - `ghost` — **1 direct call site** (system-architecture speed selector when inactive — shares a line with `default`, dynamic).
  - `link` — **0 direct call sites**; 3 indirect via `Copiable` in MDX.
  - `outline` — **0 direct call sites, 0 indirect.** Completely unused.
- **Sizes actually used** (of 3 defined):
  - `sm` — **25 direct call sites (all of them)**.
  - `md` — **0 direct**; used as the default prop of `Copiable` but MDX consumers override to `lg`.
  - `lg` — **3 indirect** (MDX `Copiable`). No direct site.
- **States actually used:**
  - `disabled` — **0 call sites pass it.** No site in the repo disables a Button.
  - `onClick` — all 25 sites (it's effectively mandatory).
  - `type` — no site specifies (all rely on default `"button"`). Contact-form uses raw `<button type="submit">` instead of the primitive — see Inconsistencies.
  - No loading, no aria-busy, no focus management.
- **Icon patterns observed:**
  - Icon-only (children = one `<Icon />` element): 22 of 25 direct sites (all `icon` variant uses + `video.tsx:270`).
  - Leading icon + text label: 1 site (`video.tsx:239` — Play + "Play with sound").
  - Text-only (label, no icon): 1 dynamic site (`system-architecture.tsx:339` — "{s}x" label).
  - Trailing icon + text: 0 sites (pattern exists in raw `<Link>`s and contact-form's `<button>` but not in Button primitive).
- **Loading pattern:** NONE. No site ever passes `loading`. `contact-form.tsx:103-114` implements loading manually with `isPending` + disabled + conditional text swap — and does so on a raw `<button>`, bypassing the primitive.
- **Full-width pattern:** NONE direct. Base class `w-fit` blocks it. `Copiable` adds `inline-flex` to restore inline flow. No site attempts `w-full` on a Button.

## Variant gaps (implied but not present)

Sharp mismatch between Stage 0 brief (4 intents × 4 sizes × 6 states) and current surface:

1. **`primary` intent is effectively missing.** The Stage 0 brief calls for a filled `--primary` bg with inverse foreground. `default`'s `bg-subtle` is a subtle neutral chip, not a confirming CTA — and there is no call site in the marketing rebuild (hero, cta, featured-work, contact) using it as a primary CTA.
2. **`secondary` intent is missing.** `outline` resembles it (hairline border) but is unused.
3. **`link` intent exists in the primitive but is used only via `Copiable` in MDX.** All inline-prose link-style CTAs in marketing (`cta.tsx:14`, `featured-work.tsx:23`, `announcement-bar.tsx:22`) use raw `<Link>` with bespoke className.
4. **`lg` size has zero direct sites.** All blog-figure controls are `sm`; the contact-form button is 44px tall raw HTML, not a `lg` Button. The Stage 0 spec wants `lg` as the hero/CTA size — currently dormant.
5. **`xs` size does not exist at all.** Stage 0 brief defines a 24px `xs`; primitive has only sm/md/lg.
6. **`iconOnly` modifier doesn't exist as a semantic prop.** `icon` is a *variant*, not a modifier — conflating purpose with shape. A "primary confirm" with just an icon has no path.
7. **`loading` prop doesn't exist.** Contact-form reinvents it (`isPending ? 'Sending...' : 'Send'`) on raw HTML.
8. **`fullWidth` doesn't exist.** Base `w-fit` is hostile to `<form>` submit buttons that typically stretch on mobile.
9. **`leadingIcon` / `trailingIcon` don't exist as props.** Users manually place `<Icon />` children, leading to inconsistent icon sizes (`h-3.5`, `h-4`, `size-4`, `size-5`).
10. **`disabled` exists but no site tests it.** Stage 0 requires all 6 states designed and tested; `disabled` has no production usage to validate the styling.
11. **Toggle / pressed state** — `video-controls.tsx:160-168` fakes a pressed captions toggle via `className` fork. No `aria-pressed`, no `pressed` prop.
12. **Focus-visible** — primitive uses `focus:` not `focus-visible:`. Mouse-click users get the ring, violating a11y guidance in Stage 0.

## Inconsistencies

Every item has a concrete citation.

1. **`icon` variant disables its own focus ring.** `src/components/button.tsx:7` sets `focus:ring-0` on `icon`; `button.tsx:8` does the same on `link`. The base class at `button.tsx:40` declares `focus:ring` — so two of five variants silently strip it. Affects `video-controls.tsx:147/160/171` (video chrome — keyboard users have no focus indicator).
2. **`focus:outline-none` added twice.** Base already sets `focus:outline-none` (`button.tsx:40`). `video-controls.tsx:174` re-adds `focus:outline-none` in its className ("text-white focus:outline-none") — dead duplication that implies the author wasn't sure what the base does.
3. **Icon sizing is a free-for-all.** `h-3.5 w-3.5` (14px) used in all `primitives-over-pipelines/*`, `unblocking-agents/*`, `shopping-agent-chat-figure.tsx:248-263`. `h-4 w-4` (16px) used in `claude-code/system-architecture.tsx:336/349`, `codeblock.tsx:24`, `figure.tsx:32`. `size-4` in `video.tsx:245`. `size-5` in `video.tsx:277`, `video-controls.tsx:154/167/178`. Five different icon sizes inside a variant spec'd at Stage 0 to be 14–16px fixed.
4. **`'bg-subtle'` (default variant) conflicts with overrides.** `video.tsx:239-247` uses `variant="default"` but overrides `bg-subtle` away with `bg-black/30 text-white backdrop-blur-sm` — i.e. the author wanted a "filled-on-dark" look that doesn't exist as a variant. Off-contract use.
5. **Toggle pressed state is className-forked.** `video-controls.tsx:163` — `isCaptionsOn ? 'bg-white/30' : ''`. No `aria-pressed`. A real `pressed` state would be designed.
6. **Contact form bypasses Button primitive entirely.** `src/components/contact-form.tsx:103-114` — a raw `<button type="submit">` with ~10 lines of bespoke `className` (rounded-full, border, padding, hover), an `isPending` disabled-style fork, and an arrow glyph. This should be a Button `variant="primary" size="lg" loading={isPending} trailingIcon={Arrow}`. Currently the entire v1 submit pattern lives outside the primitive.
7. **Announcement bar bypasses Button primitive.** `src/components/announcement-bar.tsx:22-27` — raw `<Link>` styled as a pill chip. In the Stage 0 success matrix this is the "ghost, xs" test case.
8. **CTA section bypasses Button primitive.** `src/components/cta.tsx:14-19` — raw `<Link>` styled as a link-intent "Start a conversation →". Stage 0 success matrix calls for "primary + secondary side-by-side, lg" here.
9. **Featured-work "See all" bypasses Button primitive.** `src/components/featured-work.tsx:23-31` — `<Link>` with bespoke hover + arrow. A link-intent Button would serve.
10. **Directional icon-only Buttons have no `aria-label`.** `shopping-agent-chat-figure.tsx:258` (prev scenario arrow) and `:261` (next) pass no label. Screen reader users hear nothing. Compare `video.tsx:275` and `video-controls.tsx:152/165/176`, which DO set aria-label — but only some files know the contract.
11. **`transition-all` on base.** `button.tsx:40` — transitions ALL properties, so if `className` layers ever change width/padding (e.g. the `Copiable` MDX variant at `lg`), the width animates. Should be `transition-colors` (or explicit bg/color/transform) per Stage 0's motion spec.
12. **Hover gating uses `enabled:` but base uses generic `cursor-pointer`.** `button.tsx:40` sets `cursor-pointer` unconditionally. When `disabled` is true, `cursor-not-allowed` wins (line 40), but a disabled button still reads as "pointer cursor" to a purely visual test pre-disabled-class application. Minor but noteworthy for state design.
13. **Size scale spacing is non-tokenized.** `button.tsx:14-16` — raw Tailwind (`p-2 px-4 text-xs`) with no reference to `--space-button-*` tokens the Stage 0 brief presumes exist.
14. **`rounded-full` (default/ghost/outline) vs `rounded` (icon) creates shape inconsistency across variants.** The Stage 0 spec wants `--radius-control` (6px) — everywhere. Currently variants disagree on shape itself, not just corner radius.
15. **`'font-matter'` hard-coded in base.** `button.tsx:40` — font family token is inline, not driven by `--font-label`. Ties the primitive to a single typeface reference.
16. **Dark mode uses `dark:` class modifier, not `[data-theme="dark"]`.** Base + variants at `button.tsx:4/5/7/10/40` use `dark:enabled:hover:*`. Stage 0 brief says the codebase uses `[data-theme="light|dark"]` in `globals.css`. If so, these hover states never fire.

## Recommendations for Stage 2 spec

Concrete, grounded in observed usage.

1. **Separate INTENT from SHAPE.** Introduce `intent: 'primary' | 'secondary' | 'ghost' | 'link'` (Stage 0's contract) AND a modifier `iconOnly: boolean` that computes square hit-target padding. Do NOT keep `icon` as a variant — it conflates purpose with geometry. The 22 icon-only call sites are almost all `intent="ghost" iconOnly`.
2. **Add `size="xs"` (24px).** The figure-control row visually wants `xs` (14px icons, tight controls) — it currently lives at `sm` because no smaller size exists. All 22 icon-only blog sites are candidates.
3. **Retire `outline` variant (zero usage).** Its job belongs to `intent="secondary"` (hairline border + surface-raised bg per Stage 0 spec). One concept, one surface.
4. **Add `leadingIcon` / `trailingIcon` props as `React.ComponentType` or ReactElement.** Button internally clones with a locked size (14px @ xs/sm, 16px @ md/lg). This kills the 5-different-icon-sizes inconsistency in one stroke.
5. **Add `loading` prop with width-locked spinner.** The contact-form reinvents this; make the primitive the single source. `aria-busy="true"` + label remains in DOM (sr-only). Width locked via measured rest-width or CSS `grid-template-areas` trick.
6. **Add `fullWidth` prop.** Replaces the `w-fit` hardcode. Contact-form's submit is a prime target; MDX `Copiable` keeps inline flow by default.
7. **Add `pressed` prop + `aria-pressed`.** `video-controls.tsx:160-168` captions toggle proves the need — make it first-class instead of a className fork.
8. **Forward refs.** Export `React.forwardRef<HTMLButtonElement, ButtonProps>`. Enables tooltip, popover, `Slot`, and `asChild` composition without workarounds.
9. **Consider `asChild` / Slot pattern.** The CTA (`cta.tsx:14`), announcement-bar (`announcement-bar.tsx:22`), featured-work (`featured-work.tsx:23`) all want Button styling on an `<a>` / Next `<Link>`. A Slot-based `asChild` is the canonical fix and turns three bespoke link-styles into one primitive. This is the single highest-leverage recommendation for marketing adoption.
10. **Default `type` should depend on usage.** Keep default `"button"`, but the contact-form migration requires `type="submit"` to be cheap. Document it in the spec.
11. **Normalize icon sizing.** Stage 2 should lock: `xs/sm` → 14px icons, `md/lg` → 16px icons (Stage 0 "14–16px SVG"). `leadingIcon`/`trailingIcon`/`iconOnly` enforce it. Direct `children` users are responsibility of their own (or a lint rule).
12. **Replace `focus:` with `focus-visible:`.** Eliminate the need for `icon`/`link` to strip focus — keyboard users get the ring, mouse users don't.
13. **Replace `transition-all` with `transition-[colors,transform,box-shadow]`.** Respect motion tokens `--duration-fast` / `--duration-snap`. Honor `prefers-reduced-motion` via `@media` in a shared CSS or Tailwind `motion-safe:` gate — which does not exist in the current primitive.
14. **Tokenize spacing.** Swap hard-coded Tailwind `p-2 px-4` etc. for `var(--space-button-y-[size])` / `var(--space-button-x-[size])` (Stage 2 / Agent C's territory) — stop encoding density in Tailwind atoms.
15. **Tokenize radius.** Switch all variants to `rounded-[var(--radius-control)]` so nesting math works. Drop the `rounded-full` vs `rounded` inconsistency across variants.
16. **Decide theme mechanism.** Stage 2 must pick one: `[data-theme]` OR Tailwind `dark:`. The current primitive assumes `dark:` but Stage 0 brief references `[data-theme]` — one of these is wrong.
17. **Migration plan scope.** Stage 2 spec should list sites that currently bypass Button (`contact-form.tsx:103`, `cta.tsx:14`, `announcement-bar.tsx:22`, `featured-work.tsx:23-31`) as explicit Stage 3 / Stage 6 targets so "real-context validation" has real contexts.
18. **Add `aria-label` guard.** When `iconOnly`, require `aria-label` at the type level (runtime + TS). Prevents the `shopping-agent-chat-figure.tsx:258/261` omission.

## Raw statistics

- **Total direct call sites:** 25 (`<Button` JSX opens in `src/**/*.tsx`).
- **Total indirect consumers (via `Copiable`):** 3 (MDX files in `src/lib/posts/`).
- **Files with direct Button usage:** 12 (excluding `button.tsx` itself).
- **Files that bypass Button for what should be Button work:** 4 additional (`contact-form.tsx`, `cta.tsx`, `announcement-bar.tsx`, `featured-work.tsx`).
- **Variant distribution (direct sites):** `icon` 22 · `default` 2 · `ghost` 1 (dynamic) · `link` 0 · `outline` 0.
- **Size distribution (direct sites):** `sm` 25 · `md` 0 · `lg` 0.
- **Sites using custom `className` overrides:** 8 of 25 (32%): `codeblock.tsx:19`, `copiable.tsx:35`, `video.tsx:242`, `video.tsx:273`, `video-controls.tsx:150`, `video-controls.tsx:163`, `video-controls.tsx:174`, `system-architecture.tsx` uses none — but note system-architecture uses the only dynamic variant (speed selector).
- **Sites passing `aria-label`:** 5 of 22 icon-only sites (23%) — all in `video*.tsx`. All figure arrow/direction controls lack it.
- **Sites passing `disabled`:** 0.
- **Sites passing `type`:** 0 (all default to `"button"`).
- **Distinct prop combinations observed:**
  1. `variant="icon" size="sm" onClick={fn}` (no className) — 16 sites.
  2. `variant="icon" size="sm" onClick={fn} className=...` — 6 sites.
  3. `variant="icon" size="sm" onClick={fn} aria-label=... className=...` — 3 sites (video-controls: captions/fullscreen/playpause; video.tsx close has no className-free).
  4. `variant="default" size="sm" onClick={fn} className=<overlay skin>` — 1 site (video.tsx Play with sound — leading icon + label).
  5. `variant={speed===s ? 'default' : 'ghost'} size="sm" onClick={fn}` — 1 dynamic site (speed selector, 3 rendered buttons).
  6. `variant={passThrough} size={passThrough} onClick={fn} className=<inline-flex>` — 1 site in `Copiable`, driving 3 MDX consumers at `variant="link" size="lg"`.
  - Total: **6 distinct combinations**.

**Sum reconciliation:** 16 + 6 + 3 + 1 + (1 dynamic call site) + (1 wrapper call site) = 28 visible JSX call occurrences. But `video.tsx:270` is in combo #3 (icon+aria-label+className) and `video.tsx:239` is combo #4 — each listed once. Counting each JSX `<Button>` tag opening: `codeblock` 1 + `copiable` 1 + `figure` 1 + `video` 2 + `video-controls` 3 + 6 blog figures with 2 each = 12 + `shopping-agent-chat` extra 2 = 14 + `system-architecture` 3 = **25** total direct openings. Reconciled.

ultrathink
