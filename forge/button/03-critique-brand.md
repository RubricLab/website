# Button — Brand Critique (Stage 4-C)

## Verdict

Mostly yes — restraint, warm palette, and the 2px arrow nudge are faithfully inherited — but one foreign gesture (synthesized faux-bold `font-medium` Matter label) and two generic-reading color moves (white-overlay primary hover; `opacity: 0.6` on disabled secondary/ghost/link) prevent this primitive from reading as unmistakably Rubric at every state × intent cell.

## Does it feel like Rubric?

### Restraint test

1. **No glow, no halo, no gradient, no scale-on-press.** `button.tsx` contains zero `box-shadow`, zero `drop-shadow`, zero gradient, zero `scale-*` utility. Anti-patterns 1–2 and 5 from `01-latent-voice.md` § 8 are all respected. Restraint holds.
2. **Motion is color-forward, not transform-forward.** `button.tsx:65` declares `transition-[background-color,border-color,color,opacity]` — bounded set, exactly the repo's `transition-colors` idiom generalized. The only `transition-transform` in the file is scoped to the trailing-icon nudge (`button.tsx:78`). This matches latent voice § 2 inference 4 precisely.
3. **2px arrow nudge is inherited, not invented.** `group-hover:not-disabled:[&:not([data-no-nudge])]:translate-x-[2px]` (`button.tsx:78`) is the repo's signature mannerism (latent voice § 6, 11+ occurrences), now primitive-owned. This is the right kind of gesture to steal.
4. **`font-medium` is a restraint leak.** `button.tsx:65` applies `font-medium` (weight 500) to every Button. Matter is loaded at weight 400 only (`layout.tsx:9–12`). The browser synthesizes faux-bold — visible rendering artifacts against warm-paper antialiasing. Latent voice § 8 anti-pattern 3 forbids this explicitly; spec § 1.3 explicitly says "weight 400." See MAJOR finding below.
5. **Primary hover uses a white overlay, not a warm-tone shift.** `button.tsx:22` uses `after:bg-[var(--color-primary-foreground)]` with `hover:after:opacity-[0.08]`. In light mode that's a cream-over-black wash — defensible. In dark mode it becomes black-over-white, which reads clinical rather than warm-paper. The warm palette doesn't reach the primary-hover moment. See MINOR finding.

### Warmth test

1. **Rest states read warm.** `--color-surface-raised` resolves to `--accent` (`#dedad7` light, `#1d1d1d` dark). Secondary at rest is a tinted-paper card shape — directly in the warm trio from latent voice § 1. Correct.
2. **Secondary hover uses `--color-border-strong` = `--tint` @ 30%.** `globals.css:82` and `button.tsx:24` thread the signature warm-teal hover-border idiom (`hover:border-tint/30`) through tokens. This is *exactly* the lift signal the rest of the system uses. Warmth preserved.
3. **Ghost hover uses `--color-surface-ghost-hover` = `--subtle`.** `globals.css:77`, `button.tsx:26`. `--subtle` is 10% ink on warm-paper — the warm substrate shows through. Correct.
4. **Disabled-foreground / disabled-surface use monochrome primary at 40% / 10%.** `globals.css:83–84`. Correct that they're restrained, but they miss the warm-paper undertone — a disabled secondary over `#f5f0ec` with `--color-disabled-foreground = primary @ 40%` reads cool-grey, not warm. Latent voice § 1 lesson was "warmth lives in the accent/tint trio"; disabled text falls outside that trio. See MINOR finding.
5. **No cool blues or saturated accents snuck in.** No `sky`, `blue`, `emerald`, `violet`, `amber` anywhere in `button.tsx`. Anti-pattern 4 (saturated intent) held.

### Craft test

- **Radius nesting:** `--radius-control: 0.375rem` (6px) declared (`globals.css:88`); card math `16 − 10 = 6` is honored. Inner arc parallel to outer arc — the detail in latent voice § 3 is actually delivered.
- **Hairlines:** `--color-border-hairline = var(--subtle) = 10% ink` — the repo-universal border value, threaded through tokens rather than magic numbers. Consistent with every card in the system.
- **Tokens not magic numbers:** Every surface color, border color, radius, pad, gap, duration, and easing consumed by Button is a CSS variable. The sole exception is `after:opacity-[0.08]` / `[0.14]` and `translate-x-[2px]` in `button.tsx:22, 78` — literals. The 2px translate is fine (it *is* the repo gesture). The 0.08/0.14 overlay opacity is a hidden magic number that the spec § 5.2 note explicitly flagged as "implementer choice — overlay OR add `--color-primary-hover` token." See NIT finding.
- **Motion values:** `--duration-normal` 220ms, `--duration-fast` 150ms, `--easing-out` cubic-bezier(0.16, 1, 0.3, 1). Declared as tokens and consumed by the primitive. Technical credibility: high.

### Density test

Heights 24/28/32/40 land directly on the Stage 0 Linear-ish table. Real-context placement confirms density without cramping:
- `cta.tsx:17` uses `size="lg"` (40px) — sits right under a 32px-leading headline, reads assertive but not chunky.
- `announcement-bar.tsx:23` uses `size="xs"` (24px) inside a 64px `h-16` bar with `pt-1`. Button occupies ~38% of the bar height; plenty of breathing room, the dense chrome the spec promised.
- `featured-work.tsx:25` uses `size="md"` (32px) against an 11px uppercase `Work` eyebrow — it fights the eyebrow slightly (the md Button reads as *more* assertive than a typical "See all" link because the 14px label is larger than the surrounding micro-type). See finding.
- `contact-form.tsx:107` uses `size="lg"` (40px) — form-submit scale, appropriate.

Density holds across the four sizes. Linear-ish stance is real, not aspirational.

### Anti-pattern adherence

Walking latent voice § 8:
- **AP1 (glow/halo/shadow >4px blur):** No shadows at all on the Button. Pass.
- **AP2 (gradient fills):** No gradient. Pass.
- **AP3 (sans label weight 600/700):** **VIOLATED.** `button.tsx:65` applies `font-medium` (500) to Matter, which is regular-only. This is the one anti-pattern that slipped through. MAJOR.
- **AP4 (saturated intent colors):** No blue/green/amber. Pass.
- **AP5 (snappy-spring bounce/overshoot):** No scale, no spring, no overshoot. `--easing-out` cubic-bezier(0.16, 1, 0.3, 1) overshoots very slightly on the y-axis but is a known sane out-curve, not a bounce. Pass.

Inference check (latent voice § 7, ten inferences):
- **INF1 (radius 6px not full):** Pass — `--radius-control: 0.375rem`.
- **INF2 (label 13–14px not 16px):** Pass — 12/13/14/15 scale.
- **INF3 (weight 500 requires mono, not sans):** **FAIL.** See AP3 above.
- **INF4 (motion <300ms, color not transform):** Pass.
- **INF5 (2px arrow nudge default, not opt-in):** Pass — default on every trailingIcon unless `data-no-nudge`.
- **INF6 (hairline + tint hover):** Pass.
- **INF7 (no saturated fills):** Pass.
- **INF8 (focus ring as deliberate new token):** Pass — `--color-focus-ring = var(--primary)` per § 4.1 override.
- **INF9 (primary is rare, secondary is the ambient default):** Pass — `intent` defaults to `'secondary'` (`button.tsx:46`).
- **INF10 (link underline prose-scoped):** Pass — `globals.css:199–204` scopes `text-decoration-line: underline` to `article button[data-intent="link"]`.

**Score: 9/10 inferences honored, 4/5 anti-patterns honored.** The single miss is weight 500.

## Real-context read-through

### cta.tsx (marketing link CTA, size=lg, intent=link)

Placed under a 32px `font-normal` headline and an 18px secondary paragraph. Feels right: no surface, trailing arrow, color shifts secondary → primary on hover. This is *the* pattern the repo was already using at `philosophy.tsx:27–35` — now centralized. The one quibble: `size="lg"` on a link-variant doesn't render a visible 40px surface (link has `bg=transparent`), so what "lg" actually means here is "15px label" — which is 1px larger than the body text around it. The label asserts itself a touch more than the in-situ inline CTAs do today (13–14px). Not wrong; marginally louder than the rest of the system's "link" CTAs. Matches spec § 10.2.

### announcement-bar.tsx (ghost, xs — the dense chrome test)

Sits alone in a 64px floating container. Ghost-xs + trailing arrow gives a 24px pill-free text-button with a 2px arrow nudge on hover. Compared to the pre-migration `rounded-full border border-subtle bg-background/80 backdrop-blur-sm shadow-sm px-5 py-2` (latent voice § 6), the new version drops the pill, drops the backdrop-blur, drops the shadow-sm, drops the border. That is *correct* per spec § 9.5 E.3 but it removes the "bar" visual that used to signal "floating, tappable object." In isolation above a non-scrolled page, this reads as a bare headline with an arrow rather than an announcement pill. The spec knowingly made this trade (shadow-sm off-brand); worth double-checking in design parity. See finding: consider if ghost-xs is *too* stripped for a floating announcement, or whether this is acceptable restraint. Likely acceptable — but flag for Stage 6 screenshot review.

### featured-work.tsx (link, md — prose-adjacent)

Top-right of the Work section, opposite the uppercase-mono `Work` eyebrow. Reads as "See all work →" in 14px sans with color-shift + arrow nudge on hover. Sits correctly against the eyebrow typographically. The small tension: `intent="link" size="md"` emits a 14px label in Matter — but the rest of this section's mouse-feel CTA (lines 60–65: "Read case study →") is 12px mono. So within the same section there are now two flavors of CTA-arrow pattern: the primitive-owned sans at 14px, and the hand-rolled mono at 12px. Both are brand-correct in isolation, but the visual weight difference between them is real. Could read as "See all work" asserts louder than "Read case study," which is a hierarchy the designer may or may not want.

### contact-form.tsx (primary, lg — form submit with loading)

Bottom-right of the form, paired with an email fallback link at left. Primary fill + arrow nudge + loading spinner. This is the form-submit canonical moment, and the primitive handles it correctly: `loading={isPending}` (`contact-form.tsx:109`), spinner replaces label without width shift (spec § 5.6). The one brand observation: the primary fill is pure black (light) / pure white (dark) — the hardest-contrast element on the page. Latent voice § 7 inference 9 explicitly clears this ("correct for a confirming moment") but worth noting that the form's sibling components (inputs using `border-b` on transparent, email link in mono) are *very* quiet, so the primary Button reads as loud against that backdrop. This is deliberate, not a bug — just a note that the page now has a clear hierarchical apex. Brand-appropriate.

### blog/unblocking-agents/one-way-bridge-figure.tsx (ghost iconOnly xs)

`button.tsx:224, 227` render Play/Pause and Restart icons at 14px (`h-3.5 w-3.5`) inside a 24px square ghost button. Sits in a dense control strip at the foot of a diagram. Compared to the Figure.Share next to it (same row), the controls read as quiet, on-brand, no surface until hover. This is the best read of any context — the primitive dissolves into the figure chrome. One sub-observation: the icon is forced to 14px by `[&_[data-slot=icon]]:size-[14px]` (`button.tsx:31`), but this figure passes icons as children directly (not via `leadingIcon`), so the clone/data-slot path isn't applied — instead the child icon's own `h-3.5 w-3.5` class wins. Works correctly by coincidence in this case; in other figures (where child icons lack explicit size), iconOnly will size them via the `& > svg` selector. Worth validating at Stage 6 that every blog-figure iconOnly call site sizes identically.

## Findings

- **[MAJOR]** restraint · `src/components/button.tsx:65` · Matter + `font-medium` triggers faux-bold synthesis
  - Evidence: `'... font-sans font-medium leading-none ...'` on the root className. `src/app/layout.tsx:9–12` loads Matter at weight 400 only. Latent voice § 8 anti-pattern 3: "A bold Button label would either trigger browser-synthesized faux-bold (visible rendering artifact against the antialiased paper) or require adding a new font weight that does not exist today." Spec § 1.3 explicitly: "Inherits `--text-label-{size}`; weight 400." The implementation ships 500.
  - Fix: Change `font-medium` → `font-normal` in `button.tsx:65`. If a weight-500 look is desired for primary intent specifically, the path is to load Matter Medium in `layout.tsx` first (adds a new font file) — not to rely on synthesis.

- **[MINOR]** warmth · `src/components/button.tsx:22` · Primary hover overlay reads cool, not warm
  - Evidence: `after:bg-[var(--color-primary-foreground)] ... hover:after:opacity-[0.08]`. In light mode, overlay is `#f5f0ec` @ 8% on black — cream wash, warm. In dark mode, overlay is black @ 8% on white — a neutral darken. Neither path uses `--accent` or `--tint` to carry warmth. Latent voice § 1 locked warmth into the `background/accent/tint` trio; the primary-hover step sits outside that trio.
  - Fix: Promote the overlay to a dedicated token (spec § 5.2 note authorized this). Light: `--color-primary-hover: color-mix(in srgb, var(--primary) 92%, var(--accent) 8%)`. Dark: same formula resolves to a warm-neutral lift. Replace the `::after` overlay with `hover:bg-[var(--color-primary-hover)]`. Cleaner + warmer + drops two magic numbers.

- **[MINOR]** warmth · `src/app/globals.css:83` + `button.tsx:24,26,27` · Disabled reads as cool grey, not warm dimmer
  - Evidence: `--color-disabled-foreground: color-mix(in srgb, var(--primary) 40%, transparent)`. Primary is pure black/white — no warm undertone. On `#f5f0ec`, black @ 40% reads as a cool-grey text label; the rest of the system uses `--secondary: #666` for quiet text, which has the same-ish value but different *temperature expectation*. Disabled text/icons therefore read colder than the site's typical quiet text.
  - Fix: Consider `--color-disabled-foreground: color-mix(in srgb, var(--secondary) 60%, transparent)` in light mode — mixes against `#666` rather than pure black, tracking the existing quiet-text color family. Or leave primary-based but accept the temperature drift. Creative-direction call.

- **[MINOR]** craft · `src/components/button.tsx:22` · Magic-number opacity values 0.08 / 0.14
  - Evidence: `hover:after:opacity-[0.08] not-disabled:active:after:opacity-[0.14]`. Spec § 5.2 explicitly flagged these as "implementer choice — overlay OR add `--color-primary-hover` token. Pick overlay unless critics flag it." Flagging. These literals hide the darkening math from the token system.
  - Fix: Same as MINOR #1 above — promote to `--color-primary-hover` and `--color-primary-active` tokens. Kills the literal, makes the hover step inspectable per-theme.

- **[MINOR]** density · `src/components/featured-work.tsx:25` · md link sits louder than the surrounding mono-12 CTAs
  - Evidence: The section has two CTA shapes on the same page — `Button intent="link" size="md"` (14px Matter) at the section header, and a hand-rolled `font-mono text-[12px]` + arrow at each card's footer. The sans-14 is a heavier stroke than mono-12 despite being a sibling-level call-to-action.
  - Fix: Either drop the section-header Button to `size="sm"` (13px) to track the 12/13 micro-UI band, or migrate the in-card "Read case study" spans to `Button intent="link" size="xs"` (12px) for internal consistency. Creative-direction call — the primitive is correct; the hierarchy is a design decision.

- **[NIT]** anti-pattern adherence · `src/components/button.tsx:31,32` · iconOnly child-as-icon path bypasses forced sizing
  - Evidence: `[&_[data-slot=icon]]:size-[14px]` selector only fires when icons are cloned with `data-slot="icon"` by the `clone()` helper — i.e., via `leadingIcon` / `trailingIcon` props. For `iconOnly` children passed as direct `children` (see `one-way-bridge-figure.tsx:225–228`), sizing relies on the caller's `h-3.5 w-3.5` class. Spec § 1.3 said "Forced to 14px at xs/sm, 16px at md/lg." The forcing only works down one of two paths.
  - Fix: Add a second selector pass that targets raw SVG children inside iconOnly mode: `iconOnly && '[&>svg]:size-[14px]'` at xs/sm (and 16px at md/lg). Makes the size contract path-independent.

- **[NIT]** warmth · `announcement-bar.tsx:23` · Ghost-xs floating alone loses pill-shape signal
  - Evidence: Pre-migration the announcement bar was a `rounded-full border bg-background/80 backdrop-blur-sm shadow-sm` pill — latent voice § 6 identified it as one of two "pill-framed CTAs" in the entire system. Post-migration, the Button is ghost-xs with no surface at rest, so the floating text above non-scrolled hero reads as bare headline + arrow rather than a floating announcement object.
  - Fix: Either (a) accept the restraint trade and let Stage 6 screenshots confirm it feels right against the hero, or (b) reintroduce the pill as a surface layer applied to the Button via `className` override at that one call site (`bg-background/80 backdrop-blur-sm rounded-full border border-subtle px-5` — no shadow, since shadow-sm is off-brand per latent voice § 4). The spec chose (a); flagging so Stage 6 revisits if it reads too stripped.

## Overall count

- Major: 1 (feels foreign — `font-medium` on Matter Regular)
- Minor: 4 (reads as generic / temperature drift — primary-hover overlay, disabled foreground, hidden 0.08/0.14 magic numbers, md-link density mismatch in featured-work)
- Nit: 2 (iconOnly sizing path coverage, announcement pill-signal loss)

## Top 3 brand moves

1. **Drop `font-medium` → `font-normal`.** Single-character fix (`button.tsx:65`), kills the one actual anti-pattern violation, removes faux-bold synthesis against the warm-paper bg. Highest leverage, near-zero cost.
2. **Promote the primary-hover overlay to `--color-primary-hover` (and `--color-primary-active`).** Replaces the `::after` layer + magic numbers with an explicit token, lets the warm palette reach the primary-hover step (mix `--primary` with `--accent` rather than `--primary-foreground`), and makes per-theme darkening inspectable.
3. **Warm up `--color-disabled-foreground` by mixing against `--secondary` instead of `--primary`.** Tracks the existing "quiet text" color family (`#666` / `#999`) which was already tuned for the warm bg. One-line token edit; disabled states start reading like the rest of the system's quiet text rather than cool-greyed-out black.

## What FEELS right (preserve)

- **The 2px arrow nudge is load-bearing and correct.** `group-hover:not-disabled:[&:not([data-no-nudge])]:translate-x-[2px]` turns the repo's most-repeated micro-interaction into primitive-owned default behavior. Every marketing CTA that migrated onto this primitive inherits the gesture for free. This is the single most Rubric thing about the Button — do not remove, do not slow down (150ms is correct), do not make opt-in.
- **Secondary + hover border at `--tint` @ 30%.** Threading the codebase's `hover:border-tint/30` lift idiom through `--color-border-strong` (`globals.css:82`) means every future card-sibling control in the system gets the same warm-teal hover signal. This is the right kind of token to have invented.
- **`intent` defaults to `'secondary'`.** Primary-black-on-warm-paper is a rare-gesture button per latent voice § 7 inference 9; defaulting to secondary means ambient CTAs don't accidentally turn every page into a wall of black pills. Correct restraint at the API level.
- **`:focus-visible` not `:focus`, ring = `--primary`, 2px + 2px-offset.** Ring is deliberately authored at max-contrast without being a new invented color — reuses the strongest ink in the system. A11y + brand aligned.
- **No scale-on-press, no shadow-on-hover, no gradient.** The three generic-UI gestures that would have made this primitive feel like it came from a component library are all absent. Restraint held in the places it was most tempting to break.

ultrathink
