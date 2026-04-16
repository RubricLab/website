# Button — Polish Critique (Stage 4-A)

## Verdict
**Needs polish.** The primitive is structurally close to the lighthouse the spec promised — tokens consumed correctly, motion tokens wired, focus-visible done right, arrow nudge present — but three spec-mandated details have slipped: (1) label weight is `font-medium` (500) where spec § 3.1 explicitly mandates 400 in a Matter-regular-only font system, (2) `disabled`/`not-disabled` Tailwind modifiers do not fire under `asChild` (where we rely on `aria-disabled`), silently un-styling every disabled anchor-button, and (3) loading drops leading/trailing icons from the DOM, producing a width shift the spec § 5.6 explicitly told us to avoid. Each is a real, ship-visible defect in state × intent cells that migration targets will hit. Polish-pass-resolvable; no creative direction needed.

---

## Findings by dimension

### 1. Radius nesting

- **[NIT]** radius-nesting · `src/components/button.tsx:31-34` (iconOnly at `xs`) · *6px radius on a 24px square is the top edge of proportional comfort*
  - Evidence: `iconOnly` at `size="xs"` = 24×24; `--radius-control` = 6px = 25% of side length. Spec § 3.2 confirms this is intentional. Against the latent voice § 3 "4–6px inner" window (`scaffold.tsx` uses `rx={4}` on tiny diagrammatic tiles), the 6px on a 24px square reads slightly soft — readable in context, but worth watching at 200% zoom in Stage 6.
  - Fix: No change for v1 — the spec owns this. If Stage 6 Figma parity flags it, introduce a `--radius-control-dense: 0.25rem` (4px) applied only to `iconOnly` at `xs`/`sm`. Do not change unilaterally.

- **[PASSED]** radius-nesting · `src/components/button.tsx:22` (primary overlay inherits) · *after:rounded-[inherit] is the right gesture*
  - Evidence: Primary intent's `::after` hover overlay uses `after:rounded-[inherit]`. The overlay corners track the button corners as `--radius-control` evolves. Rubric-appropriate nesting from container → inner skin.
  - Fix: —

- **[PASSED]** radius-nesting · `src/components/button.tsx:65` (control radius applied) · *rounded-[var(--radius-control)] at root*
  - Evidence: Spec § 3.3 table mandates `--radius-control` (6px) for all four intents. Code applies it at the root. Nesting math at 16px card − 10px padding = 6px inner holds.
  - Fix: —

---

### 2. Surfaces

- **[MAJOR]** surfaces · `src/components/button.tsx:22,75-78` (primary hover overlay stacks above icons) · *leading/trailing icons and Spinner get washed on primary hover*
  - Evidence: The primary intent's `::after` pseudo-element is `absolute inset-0` with no explicit `z-index`. Pseudo-elements paint AFTER the element's non-positioned descendants. The label span (line 76) uses `className="relative"` so it creates a stacking context and paints above the overlay. **But `leadingIcon`, `trailingIcon`, and `Spinner` have no positioning** — they paint UNDER the `::after`. On primary hover, the arrow and any other icons get an 8% white overlay (light mode) or 8% black overlay (dark mode), reducing their effective contrast with the primary fill. This is the canonical Send-button case (`contact-form.tsx:105-113` — primary + trailing Arrow). The hover moment is exactly where the arrow should feel crisp.
  - Fix: Either (a) wrap the icon slots in `<span class="relative">` so they join the label's stacking plane, or (b) keep them as-is and set `after:z-0` + `relative z-10` on the icons/label, or (c) put the overlay inside a wrapping element below the content layer. Simplest: change `clone` to wrap icons in a `relative` span, matching the label. ~2 LOC.

- **[MINOR]** surfaces · `src/components/button.tsx:27` (link intent has no visible surface) · *link has no bg layer but `rounded-[var(--radius-control)]` is still applied at root — confirm focus-ring shape*
  - Evidence: Link intent is `bg-transparent` with no border. Root still sets `rounded-[var(--radius-control)]`. Spec § 3.3 footnote for link says "radius applies to focus-ring, not to a visible surface". Code is consistent with spec (focus-ring outline follows the root's border-radius).
  - Fix: None. Passed. Listed here because one might naively think link shouldn't carry radius at all — it should, for focus-ring curvature. Confirmed correct.

- **[PASSED]** surfaces · `src/components/button.tsx:24` (secondary uses `--color-surface-raised`) · *warm-paper vocab inherited*
  - Evidence: `bg-[var(--color-surface-raised)]` → `var(--accent)` → `#dedad7` light / `#1d1d1d` dark. Matches latent voice § 4 "tinted warm fill + hairline border" — the canonical Rubric card-surface vocabulary, now extended to secondary Button. Siblings reading.
  - Fix: —

- **[PASSED]** surfaces · `src/components/button.tsx:26` (ghost hover uses `--color-surface-ghost-hover` = `--subtle`) · *10% ink tint is the correct ambient-chrome hover*
  - Evidence: `--color-surface-ghost-hover: var(--subtle)` = black/white @ 10%. Latent voice § 4 confirms "10% ink" is Rubric's dominant chrome lift vocabulary (cards, inputs, code inline all land here).
  - Fix: —

---

### 3. Borders

- **[PASSED]** borders · `src/components/button.tsx:24` (secondary rest uses hairline) · *1px var(--color-border-hairline) matches the hairline-border culture*
  - Evidence: Secondary intent uses `border border-[var(--color-border-hairline)]` which resolves to `var(--subtle)` (black/white @ 10%). This is the exact pattern `card.tsx:10`, `process.tsx:24`, `featured-work.tsx:39` use. Button reads as a sibling.
  - Fix: —

- **[PASSED]** borders · `src/components/button.tsx:24` (secondary hover lifts border to `--color-border-strong`) · *--tint at 30% matches the system lift-signal*
  - Evidence: `not-disabled:hover:border-[var(--color-border-strong)]` → `color-mix(in srgb, var(--tint) 30%, transparent)`. Mirrors the `hover:border-tint/30` idiom in `process.tsx:24`, `featured-work.tsx:39`, `app/lab/page.tsx:165`. Spec § 4 and latent voice § 6 aligned.
  - Fix: —

- **[MINOR]** borders · `src/components/button.tsx:22` (primary has no border at rest OR hover) · *valid but visually asymmetric next to a secondary sibling in CTA sections*
  - Evidence: Primary intent has no border. Spec § 3.3 confirms. When a primary and secondary sit side-by-side in § 10.2 CTA section (`cta.tsx` pattern), the secondary has a 1px border and the primary doesn't. At their shared `h-10` (lg) height, the secondary is effectively 1px taller visually due to the added border thickness. Not a spec violation — filed as a polish note for Stage 6 real-context parity.
  - Fix: No change. Acceptable: the fill IS the border for primary. If Stage 6 flags a vertical alignment issue, add `border border-transparent` to primary to force the same box model, not to paint.

---

### 4. Type rhythm

- **[MAJOR]** type-rhythm · `src/components/button.tsx:65` (`font-medium` overrides spec-mandated weight 400) · *Matter is loaded at regular only — font-medium triggers faux-bold or fallback*
  - Evidence: Root class list contains `font-medium` (= CSS `font-weight: 500`). Spec § 3.1 Label slot table is explicit: "Inherits `--text-label-{size}`; **weight 400**". Latent voice § 5 documented: "Matter is regular-only; there is no bold sans" and § 8 Anti-pattern 3: "Sans-serif label at weight 600 or 700" — weight 500 is on the same axis of deviation. At `layout.tsx:9-18`, Matter loads `weight: '400'` only. Requesting 500 will either (a) produce browser-synthesized faux-bold (thicker strokes, uneven rasterization, visible against the antialiased warm paper background), or (b) fall back silently to 400 (making the class a dead declaration). Neither is what the spec contracted.
  - Fix: Change `font-medium` to `font-normal` at `src/components/button.tsx:65`. Single word edit. Removes faux-bold risk and matches the spec's explicit weight contract.

- **[PASSED]** type-rhythm · `src/components/button.tsx:31-34` (label sizes consume the token scale) · *12/13/14/15px matches spec § 3.1 and latent voice § 5 13–14px micro-UI band*
  - Evidence: xs: `text-[var(--text-label-xs)]` (12px), sm: 13px, md: 14px, lg: 15px. Latent voice § 5 lists `text-[13px]` as Rubric's "signature micro-UI size" (contact-form submit, chat input, user message, philosophy link). Spec § 3.1 grounds md=14, lg=15 as the Rubric band. Size tokens wired.
  - Fix: —

- **[PASSED]** type-rhythm · `src/components/button.tsx:65` (`leading-none` enforces line-height:1) · *deterministic vertical centering inside flex*
  - Evidence: Spec § 3.1: "line-height: 1 on the label span for deterministic vertical centering". Code applies `leading-none` at the root — inherited by the label span. Height math (line-height-1 × label-size + 2×padding-y) produces the targeted 24/28/32/40px.
  - Fix: —

- **[PASSED]** type-rhythm · `src/components/button.tsx:65` (`whitespace-nowrap`) · *matches spec § 1.3 Label slot rule*
  - Evidence: Spec § 1.3 Label slot: "single line, `white-space: nowrap`". Applied at root → cascades to label span.
  - Fix: —

---

### 5. Motion

- **[MAJOR]** motion · `src/components/button.tsx:22` (primary active overlay animates — spec says instantaneous) · *active state uses the same 220ms transition as hover, not the spec-mandated instant shift*
  - Evidence: The `::after` overlay has `after:transition-opacity after:duration-[var(--duration-normal)] after:ease-[var(--easing-out)]` applied unconditionally. Spec § 5.4: "primary active: bg overlay opacity 8% → 14% (one step darker than hover); **instantaneous (no transition, feels mechanical)**." The current code animates 8% → 14% over 220ms, which makes the active press feel cushioned rather than mechanical. Latent voice § 2 also argues for mechanical chrome — "no spring, no bounce, no overshoot". The active-press moment is exactly where the component should feel snappy.
  - Fix: Add `not-disabled:active:after:transition-none` (or equivalent scope to the active state only) so the 8%→14% step is instant while the 0%→8% hover transition remains 220ms. ~1 class addition.

- **[MAJOR]** motion · `src/components/button.tsx:22,24,26,27` (`not-disabled:` does not match `aria-disabled` — hover fires on disabled anchor-buttons) · *gate on :not(:disabled) only, allowing a disabled asChild anchor to animate on hover*
  - Evidence: Tailwind 4's `not-disabled:` variant maps to CSS `:not(:disabled)`. Native `<button disabled>` matches `:disabled`. **`<a aria-disabled="true">` does NOT match `:disabled`** — no native disabled attribute on `<a>`. Code forwards `aria-disabled` when `asChild && blocked` (line 61), BUT the hover/active classes use `not-disabled:` — not `not-aria-disabled:`. Net: a disabled asChild anchor still receives hover bg/border shifts AND still animates the primary overlay 0→8%. Visually indistinguishable from rest-disabled.
  - Fix: Every `not-disabled:hover:`, `not-disabled:active:` on lines 22-27 should also gate on `not-aria-disabled:`. Tailwind 4 supports arbitrary-variant stacking: `not-disabled:not-aria-disabled:hover:...`. Alternatively, flip to an attribute-based gate (`data-disabled` on the root set by `blocked`) and use `not-data-disabled:hover:...` for one modifier instead of two. Latter is the cleaner Rubric idiom.

- **[MINOR]** motion · `src/components/button.tsx:38` (Spinner rotation uses `linear`, spec § 5.6 says "1s linear infinite rotation") · *strictly compliant, but `linear` on the rotation can feel clinical against Rubric's out-curve motion*
  - Evidence: `animate-[button-spinner_1s_linear_infinite]`. Spec § 5.6 demands `linear` explicitly. However, the rest of Rubric's motion system (latent voice § 2) uses `cubic-bezier(0.16, 1, 0.3, 1)` (`--easing-out`) or CSS default ease. A `linear` rotation in a spinner is industry-standard and spec-correct, but at `1s` it reads slightly mechanical next to the out-cubic on hover transitions. Not a deviation — noted for Stage 5 consideration if the synthesized revision plan wants to align.
  - Fix: No change. Spec-compliant. Optional tweak: if Stage 5 elevates to tokenize the spinner speed, use `--duration-normal` × 4.5 (≈ 1000ms) as a derivation for consistency.

- **[PASSED]** motion · `src/components/button.tsx:65` (`transition-[background-color,border-color,color,opacity]` — no `transition-all`) · *explicit property list matches spec § 6*
  - Evidence: Spec § 6 rule: "No property transitions `all`. Every value is a token." Code enumerates exactly the properties the spec table lists: background-color, border-color, color, opacity. Duration `var(--duration-normal)`, easing `var(--easing-out)`. Tokens consumed.
  - Fix: —

- **[PASSED]** motion · `src/components/button.tsx:78` (arrow nudge: `duration-fast`, `ease-out`, `translate-x-[2px]`) · *matches spec § 5.2 and latent voice inference 5 exactly*
  - Evidence: Trailing icon gets `transition-transform duration-[var(--duration-fast)] ease-[var(--easing-out)] group-hover:not-disabled:[&:not([data-no-nudge])]:translate-x-[2px]`. The 2px nudge is the single most-repeated micro-interaction in the codebase (latent voice § 2, 10 observed instances). `data-no-nudge` opt-out is threaded. Reduced-motion forces `translate-x-0` + `transition-none`.
  - Fix: —

- **[PASSED]** motion · `src/components/button.tsx:65` (focus-visible uses `transition-none`) · *a11y requires instant focus ring*
  - Evidence: `focus-visible:transition-none`. Spec § 5.3 and § 7.3 are emphatic: ring must be instant so keyboard users see a non-delayed affordance. Matches.
  - Fix: —

- **[PASSED]** motion · `src/components/button.tsx:38,78` (reduced-motion overrides) · *spinner blink + arrow still, per spec § 6.1*
  - Evidence: Spinner: `motion-reduce:animate-[button-spinner-blink_1s_ease-in-out_infinite]` (opacity blink replaces rotation). Arrow: `motion-reduce:!translate-x-0 motion-reduce:!transition-none`. Keyframes `button-spinner` and `button-spinner-blink` both declared at `globals.css:533-540`. Full coverage of spec § 6.1.
  - Fix: —

- **[PASSED]** motion · `src/app/globals.css:98-102` (all four motion tokens present) · *duration-snap, -fast, -normal and easing-out all exist*
  - Evidence: `--duration-snap: 50ms`, `--duration-fast: 150ms`, `--duration-normal: 220ms`, `--easing-out: cubic-bezier(0.16, 1, 0.3, 1)` all declared. `--duration-snap` is unused in v1 per spec § 4 / decision #2 — expected, not a defect.
  - Fix: —

---

### 6. States (rest, hover, focus-visible, active, disabled, loading)

#### 6.1 rest
- **[PASSED]** states · `src/components/button.tsx:22-27` · *all four intent rest cells match spec § 5.1 token-for-token*

#### 6.2 hover
- See § 5 motion MAJOR on `not-disabled:` + aria-disabled gap.
- **[PASSED]** states · `src/components/button.tsx:22` (primary hover via overlay, not a token) · *spec § 5.2 resolved-choice honored*
  - Evidence: Spec § 5.2 note: "Stage 3 implementer chooses overlay OR adds a `--color-primary-hover` token — both acceptable; pick overlay unless critics flag it." Code picks overlay. The primary hover darkening mechanism is explicit-and-inspectable (not opaque math: it's `after:bg-[var(--color-primary-foreground)]` with opacity 0→8%→14%). This is the right call: less token churn, clearer provenance in DevTools. Promoting to a token would add two values for one visual moment.
  - Fix: No change. Explicitly affirming the overlay choice per success-criteria #3 of this critique brief.

#### 6.3 focus-visible
- **[PASSED]** states · `src/components/button.tsx:65` · *spec § 5.3 honored precisely*
  - Evidence: `focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 focus-visible:transition-none`. Maps 1:1 to spec: 2px outline, 2px offset, instant. `--color-focus-ring` resolves to `var(--primary)` (black/white) per spec § 4.1 override in `globals.css:79`. WCAG contrast trivially cleared. `:focus-visible` (not `:focus`) — no pointer focus ring per spec § 7.3. This is the one place the implementation exceeds the current codebase pattern (input uses only `focus:border-secondary/50`); the Button is now the authored focus affordance the latent voice § 8 inference 8 asked for.
  - Fix: —

#### 6.4 active
- See § 5 motion MAJOR on active transition duration (should be instant).
- **[PASSED]** states · `src/components/button.tsx:26` (ghost active intensifies to 20% `--primary`) · *matches spec § 5.4 exactly*

#### 6.5 disabled
- **[MAJOR]** states · `src/components/button.tsx:22,24,26,27` (disabled color styles don't fire on `asChild` anchor disabled) · *asChild + disabled leaves anchor-buttons un-styled — worst in class for accessibility*
  - Evidence: Lines 22-27 use `disabled:bg-[...]`, `disabled:text-[...]`, `disabled:opacity-60` — these are Tailwind's built-in `disabled:` variant which maps to CSS `:disabled`. Only native `<button disabled>` matches. At line 60, code sets `disabled={asChild ? undefined : blocked}` — so in `asChild` mode, there's NO native `disabled` attribute. At line 61, code sets `aria-disabled={asChild && blocked ? true : undefined}`. The root `aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed` (line 65) blocks interaction — good. But the **color / opacity states** (fade to 60%, disabled-surface, disabled-foreground) are controlled by `disabled:` only, which doesn't match aria-disabled. Net: a disabled `<Button asChild><Link ... /></Button>` has the correct interaction block but is visually indistinguishable from a rest state. Spec § 7.5 explicitly calls out asChild + aria-disabled as a supported state (and contact-form isPending/disabled-form is a Group E migration that will hit this).
  - Fix: Each `disabled:...` class on lines 22-27 needs a paired `aria-disabled:...` variant, OR — cleaner — introduce a single `data-disabled` attribute on the root (set when `blocked`) and use `data-disabled:...` for all color/opacity classes. One mechanism covers both native disabled and aria-disabled cases. Moves the gate from CSS-specific to state-specific. Same for `not-disabled:` → `not-data-disabled:`. Net: ~1 attribute addition + find/replace of modifier names. Cleaner than doubling every class.

- **[MINOR]** states · `src/components/button.tsx:22` (primary disabled has dedicated surface but also blocks overlay) · *disabled primary still shows `::after` overlay at opacity-0 — fine, but hover doesn't fire so it stays 0 — confirmed correct*
  - Evidence: Primary disabled has `disabled:bg-[var(--color-disabled-surface)]` + `disabled:text-[var(--color-disabled-foreground)]`. The `::after` overlay is always in the DOM but `not-disabled:hover:after:opacity-[0.08]` requires `:not(:disabled):hover` — so disabled won't fire it. Confirmed visually correct (bg becomes translucent primary @ 10%, text becomes primary @ 40%). Contrast falls to ~2.1:1 in light mode per spec § 7.4 — spec already flagged this as "monitor with Stage 4 critics; if flagged major, raise to 55%/3.0:1".
  - Fix: Spec-domain escalation, not polish. Flag to Dexter: disabled-primary contrast is 2.1:1. Should the disabled-foreground alpha be raised to 55%? Polish pass can't resolve this without creative direction.

#### 6.6 loading
- **[MAJOR]** states · `src/components/button.tsx:74-78` (leading/trailing icons are NOT rendered during loading — width shifts) · *spec § 5.6 explicitly requires opacity:0 (stay in DOM) to prevent layout shift*
  - Evidence: Lines 74-78:
    ```
    {loading && <Spinner />}
    {!loading && clone(leadingIcon, 'icon')}
    {!loading && !iconOnly && <span className="relative">{children}</span>}
    {!loading && iconOnly && children}
    {!loading && clone(trailingIcon, 'trailing-icon', ...)}
    ```
    When loading=true, leading/trailing icons disappear from DOM. Spec § 5.6 is explicit: "Leading + trailing icons render with `opacity: 0` (preserve layout width, no visual)" and "Width lock: the box retains its rest width because label is still in DOM". The contact-form primary submit (spec § 9.5 E.1) has `trailingIcon={<Arrow />}` + `loading={isPending}`. On form submit, when loading toggles on, the arrow vanishes → width shrinks by (icon size + gap) ≈ 22px (16px arrow + 6px gap). The label span stays in DOM as sr-only (line 79) — so label width is preserved — but icon slots are not. Partial width lock only.
  - Fix: During loading, render leading/trailing icons with `opacity-0 pointer-events-none` (slot-dependent class on the cloned element, not inline) rather than gating them out. Equivalent: pass a `data-loading` attribute to the icon slots and use `[data-loading=true]:opacity-0` via the clone helper. ~3 LOC delta.

- **[MINOR]** states · `src/components/button.tsx:37-43` (Spinner uses `aria-hidden` but spec § 5.6 says Spinner size matches label — implementation locks to 16px viewBox) · *at xs (12px) or sm (13px), a 16-viewBox spinner with stroke-width 1.5 renders proportionally slightly heavier*
  - Evidence: Spinner SVG has `viewBox="0 0 16 16"` + `strokeWidth="1.5"`. The `size-[14px]`/`size-4` rule from the SIZE table applies (Spinner has `data-slot="icon"`). At xs, it scales to 14×14, effective stroke becomes `1.5 × (14/16) = 1.3125`. At sm → 14×14 same. At md/lg → 16×16, stroke stays 1.5. Spec § 5.6: "Geometry: 1.5px stroke circle, 75% arc path" — assumed at base viewBox. At scaled sizes, the *rendered* stroke is slightly thinner than 1.5, which is OK; but the size is also capped at `14px` at xs (spec § 5.6: "Size matches --text-label-{size}: 12/13/14/15px"). So at xs, spinner renders at 14px not 12px, and at sm renders at 14px not 13px — spec said match label size exactly.
  - Fix: Optional: add size-exact spinner sizing via a prop or a `[data-slot=spinner]:size-[var(--text-label-xs)]` family of rules. Not a ship-blocker; the visual deviation is 1–2px. If Dexter wants pixel parity with spec, one more selector in the SIZE table.

- **[PASSED]** states · `src/components/button.tsx:62,65` (`aria-busy`, `cursor: wait`, blocked disabled) · *spec § 5.6 aria contract met*
  - Evidence: `aria-busy={loading || undefined}`, `disabled={blocked}` where `blocked = disabled || loading`, root class `aria-busy:cursor-wait`. Spec § 5.6: aria-busy="true", aria-disabled="true", cursor:wait. Plumbing correct.
  - Fix: —

---

### 7. Brand (voice adherence)

- **[MAJOR]** brand · `src/components/button.tsx:65` (font-medium breaks latent voice § 8 anti-pattern 3 — Matter is regular-only) · *promoting weight silently introduces synthesized bold*
  - Evidence: Already covered as type-rhythm MAJOR. Filed also under brand because this is the exact pattern latent voice § 8 called "would feel foreign": a sans-serif Button label at a weight heavier than the loaded Matter Regular. "In practice, nothing on a core UI path is bolder than 500" is true in the existing codebase — but those uses are for `font-mono` (which IS loaded at 500). Matter is not. A Matter label at font-medium is the one weight combination explicitly flagged as producing synthesized bold.
  - Fix: Same fix as § 4: change `font-medium` → `font-normal` at line 65. Single word.

- **[PASSED]** brand · `src/components/button.tsx:22-27` (no saturated intents, no gradients) · *monochrome + tint spine preserved*
  - Evidence: Primary = `--color-primary` (black/white), secondary = `--color-surface-raised` (warm accent), ghost = transparent + `--color-surface-ghost-hover` (10% ink), link = `--color-secondary` → `--color-primary`. Secondary hover border uses `--color-border-strong` = `--tint` @ 30% — the only chromatic gesture, matching the `hover:border-tint/30` idiom in every card. Zero blue/green/amber/red-as-surface. Latent voice § 1 and § 7 anti-pattern 4 honored.
  - Fix: —

- **[PASSED]** brand · `src/components/button.tsx:78` (arrow 2px translate) · *inherits the dominant Rubric CTA mannerism*
  - Evidence: Latent voice § 7 inference 5 documents 10+ instances of `group-hover:translate-x-0.5` across the codebase. Button makes this the default for trailingIcon, not opt-in. Matches the single most-repeated micro-interaction.
  - Fix: —

- **[PASSED]** brand · `src/components/button.tsx:65` (no scale transform, no shadow) · *latent voice § 8 anti-patterns 1, 5 honored*
  - Evidence: No `scale-`, no `shadow-`, no `transform` on the root. Active state uses color shift only (§ 5.4 resolved). No "snappy-spring bounce". Matches `latent-voice.md` § 2 and § 8 anti-patterns.
  - Fix: —

- **[PASSED]** brand · `src/app/globals.css:199-204` (article underline cascade) · *link-inside-prose inherits the prose underline treatment, link-outside-prose is colorshift-only*
  - Evidence: Spec § 8.4 mandates a CSS scoped selector `article button[data-intent="link"]` — present at globals.css:199-204 with `text-decoration-line: underline; text-decoration-thickness: 1px; text-underline-offset: 3px`. Link Button inside MDX inherits prose underline; outside prose it's color-shift only. Matches latent voice § 10.
  - Fix: —

- **[MINOR]** brand · `src/components/cta.tsx:17-19` (main-page CTA uses `intent="link"` where spec § 10.2 suggests primary) · *creative-direction call, not a primitive defect*
  - Evidence: Current `cta.tsx` renders `<Button asChild intent="link" size="lg" trailingIcon={<Arrow />}>Start a conversation</Button>`. Spec § 10.2 "CTA section bottom" shows primary + secondary side-by-side. The deployed version uses a single link-variant instead. This honors latent voice § 7 inference 9 ("primary is rare — reserve for canonical confirming moments") over the spec's real-context example. Probably right — the primary inside cta.tsx would be the ONLY `bg-primary` chrome on the homepage — but it's a design choice the primitive itself doesn't force.
  - Fix: Escalate to Dexter. Primitive-agnostic question: is the homepage CTA bottom primary or link? Polish critic cannot resolve without creative direction. If primary is chosen, also decide whether cta.tsx grows a secondary sibling (spec § 10.2 pattern) or stays alone.

---

## Finding format (summary)

All findings above follow the format `[SEVERITY] dimension · location · title` with Evidence + Fix. Repeating here for audit:

## Overall count
- **Major: 6**
  - surfaces · primary overlay stacks above icons on hover
  - type-rhythm · font-medium breaks Matter-regular-only voice (same issue as brand MAJOR)
  - motion · primary active overlay animates where spec says instant
  - motion · `not-disabled:` doesn't gate `aria-disabled` (hover fires on disabled anchors)
  - states · asChild + aria-disabled leaves anchor-buttons visually un-styled
  - states · loading drops leading/trailing icons (width shift on toggle)
  - *(brand MAJOR is the same font-medium finding dual-filed; count it once → 6 unique majors)*
- **Minor: 5**
  - borders · primary vs. secondary 1px visual-height asymmetry in side-by-side CTA
  - surfaces · link focus-ring radius passed (flagged for confirmation only — not a defect)
  - motion · Spinner linear rotation vs. Rubric out-curve system (spec-compliant; optional tweak)
  - states · disabled-primary contrast 2.1:1 (spec pre-flagged; needs creative direction)
  - states · Spinner size 14/16px not label-exact (xs should be 12, sm should be 13)
  - brand · `cta.tsx` uses link not primary (creative direction, not primitive)
- **Nit: 1**
  - radius-nesting · iconOnly at xs looks soft at 24×24 with 6px radius

---

## Top 3 polish moves (highest leverage)

Ranked by leverage = (blast radius × user-visible-on-ship-day × fix cost inverted). Not by severity order.

### 1. Fix `font-medium` → `font-normal` at `src/components/button.tsx:65`
**Leverage:** Touches every Button on every page. Ships today → ships with synthesized-bold artifact on every label (or silent 400 fallback that makes `font-medium` a dead declaration). Cost: one word edit. Risk: zero. This is the single highest-leverage move in the critique — the primitive's core visual character hinges on label weight, and spec § 3.1 is explicit. Do this first.

### 2. Fix disabled state `asChild` gap — unify on `data-disabled` attribute
**Leverage:** Contact form submit (Group E.1) + asChild-on-Link patterns (E.2, E.3, E.4) all exercise disabled-via-asChild. Today, `<Button asChild disabled><Link /></Button>` blocks pointer but has no color/opacity treatment — the disabled state is invisible. This is also the cleanest structural refactor: one attribute set in the component body, then find/replace `disabled:` → `data-disabled:` and `not-disabled:` → `not-data-disabled:` across the INTENT table. Covers both native and aria-disabled in one modifier. Unlocks all three asChild-disabled paths consistently and makes the overlay hover-gate fix (motion MAJOR #2) vanish as a byproduct.

### 3. Fix primary hover overlay stacking — wrap icons in `relative` span
**Leverage:** The contact-form Send button (primary + trailing Arrow) is the canonical hero-of-the-form interaction. The arrow is the one element you want crisp on hover (latent voice § 7 inference 5 — the 2px nudge IS the moment). Currently the `::after` washes it at 8% opacity in light mode, desaturating the nudge. Cost: ~2 LOC to the `clone` helper (wrap the cloned element in a `<span class="relative">` or add `relative` to its own className). Makes primary-hover feel as crisp as secondary-hover.

---

## What IS working (don't touch)

- **Token consumption.** All 29 tokens the spec contract lists are declared in `globals.css:60-113` and consumed by `button.tsx`. `--duration-snap` is correctly declared-but-unused (spec § 4 allows this). No magic numbers leaked.
- **Radius nesting math.** `--radius-control` (6px) + `after:rounded-[inherit]` on the overlay is the right architecture. Card (16px) − 10px padding = 6px inner — inner curve parallel to outer. Stage 6 should pass zoom test.
- **Focus-visible implementation.** `focus-visible:outline-2 outline-[var(--color-focus-ring)] outline-offset-2 transition-none` maps to spec § 5.3 exactly. Uses `:focus-visible` (not `:focus`). This is the new affordance the codebase has been missing (input still has only border-focus) — Button is now the reference.
- **Reduced-motion coverage.** Spinner rotation → blink; arrow translate → off; color transitions preserved. Full spec § 6.1 matrix honored.
- **Arrow nudge default.** Trailing icon gets `translate-x-[2px]` on hover by default, `data-no-nudge` opt-out present. This IS Rubric's most-repeated micro-interaction; owning it in the primitive is a net LOC win across 10+ migration sites.
- **Intent surface vocab.** Secondary = warm-paper + hairline, hover = hairline → tint/30. Ghost = 10% ink on hover. Primary = filled black + overlay. Link = text-only + article-scoped underline via `[data-intent="link"]` cascade. All four read as native members of the latent-voice family. No foreign surface.
- **Motion token plumbing.** Every transition enumerates explicit properties (no `transition-all`), every duration and easing is a token (no hardcoded ms / cubic-bezier values in the component). Spec § 6 contract met.
- **`article button[data-intent="link"]` cascade.** Spec § 8.4 implemented exactly; link Button in prose gets underline, outside prose is colorshift-only. `data-intent` attribute forwarded from the root (line 63).

ultrathink
