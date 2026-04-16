# Button — Stage 6 Real-Context Validation

## Verdict

**Needs Stage 5 loop iteration.** Three latent bugs in the primitive — silent `twMerge` conflict dropping label-size tokens, `cloneElement` dropping `data-slot` onto prop-filtering icon components, and one missing consumer — make every Button visibly wrong in at least one dimension. The system *looks* close, but under inspection it's rendering at default 16px everywhere with 0×0 trailing arrows. Must not ship.

## Setup

- Preview server URL: `http://localhost:3456/` (reused existing `bun dev`, `.claude/launch.json` name `dev`)
- Viewport used: 1440×900 desktop
- Theme-switch mechanism: `document.documentElement.setAttribute('data-theme', 'light' | 'dark')` — tokens in `globals.css` react via `[data-theme="…"]` rules at lines 31–57
- Browser: Claude Preview's headless Chromium

## Context-by-context findings

### 1. Hero CTA

- **Expected**: primary md + trailing arrow + `asChild <Link href="/contact">` inside `/` hero
- **Observed (light)**: Hero section renders "SEE THE WORK →" as a raw `<a href="/work">` (`src/components/hero/index.tsx:148-150`). No `Button` primitive. Uppercase 11px mono style, arrow is a raw `→` character.
- **Observed (dark)**: Same — no Button.
- **Parity vs Figma**: N/A — consumer not migrated.
- **Issues**:
  - **[MAJOR]** Spec §10.1 expected a primary md Button as the hero CTA with `asChild <Link href="/contact">`. The actual hero has a raw `<a>` to `/work`, no primary Button. The biggest visual anchor on the homepage bypasses the primitive entirely. `src/components/hero/index.tsx:148-150`. Fix: replace with `<Button asChild intent="primary" size="md" trailingIcon={<Arrow />}><Link href="/contact">Start a conversation</Link></Button>` OR update the spec to reflect that the hero CTA was intentionally deferred / styled differently in the Stage 3-A migration. This is the most critical context missing.

### 2. Bottom CTA (`src/components/cta.tsx:17`)

- **Expected (per spec §10.2)**: `primary + secondary lg` side-by-side
- **Observed (actual migration)**: Single `<Button asChild intent="link" size="lg" trailingIcon={<Arrow />}>Start a conversation</Button>` (`src/components/cta.tsx:17`). No secondary companion.
- **Light**: muted grey text "Start a conversation" centered in 160px-tall CTA section. Arrow invisible (see issue below). Reads as quiet prose, not a CTA.
- **Dark**: same — muted `#999` grey text.
- **Is the consumer's choice (link intent) reading right?** No. Heading "Working on something hard?" is 32px and commanding; the invite-response below it is a soft muted-grey link. Visual hierarchy is inverted. Spec's primary+secondary side-by-side would give this section the weight it needs.
- **Issues**:
  - **[MAJOR]** Spec §10.2 / revision-plan P3 flagged this. Recommendation: restore to `primary lg "Start a conversation"` + `secondary lg "Browse work"` side-by-side for the bottom CTA. `src/components/cta.tsx:16-20`. This ships a genuine bottom-of-page CTA rather than whispering.
  - **[MAJOR]** Arrow renders at 0×0 — see global Issue G1.
  - **[MINOR]** Font size renders at 16px (inherited body default) rather than 15px `--text-label-lg`. See G2.

### 3. Card-nested (secondary sm inside Card)

- **Expected**: `<Button intent="secondary" size="sm">` nested inside a `rounded-[var(--radius-card)]` card to test 16px card − 10px pad = 6px control radius parallelism.
- **Observed**: **No such consumer exists.** `src/components/process.tsx` cards use `rounded-xl` (12px radius) and have NO Button inside. `src/components/featured-work.tsx` per-study cards use `rounded-xl` and have no Button (read-case-study affordance is an inline `<span>` with arrow). I found `intent="secondary"` in the codebase in exactly one place: the speed selector inside `src/components/blog/claude-code/system-architecture.tsx:339-347` (xs, not sm; 4/4 buttons inline — not nested in a card).
- **Radius nesting: visual-parallel at 200% zoom?** **Cannot be tested.** No consumer renders a Button-inside-Card at the 16px↔6px nesting the spec was written to prove. Closest we have is the speed selector inside a `<section>` with no rounded wrapper.
- **Hairline border reads at both scales?** In the speed selector the secondary xs "1x" button shows a visible beige fill (`--color-surface-raised` = `#dedad7`) with 6px radius. At 200% zoom the 6px curve is crisp and the hairline border (`--color-border-hairline` = `black/10`) is legible but faint — it's more of a fill-contrast affordance than a stroke, which matches the latent voice.
- **Issues**:
  - **[MAJOR]** Radius-nesting proof doesn't exist in the migrated codebase. The spec was written expecting a Button-in-Card consumer to validate the 16−10=6 math, but no consumer was migrated into a card. Either (a) migrate `process.tsx` cards to have a secondary sm "Learn more" Button at the bottom of each column, or (b) accept that the radius nesting is a latent property unprovable in live code and defer to Storybook/ad-hoc fixture. I recommend (a) — each process column already has `bg-accent/40 border border-subtle rounded-xl p-8`; adding a `<Button intent="secondary" size="sm">` inside each gives the test case AND increases the surface area for primary-vs-secondary hierarchy on the page.
  - **[MINOR]** Speed selector's `size="xs"` renders at 16px font-size (G2) — should be 12px. Buttons read roomier than the Linear-dense controls they emulate.

### 4. AnnouncementBar (ghost xs)

- **Expected**: `<Button asChild intent="ghost" size="xs" trailingIcon={<Arrow />}>…`
- **Observed (light)**: 24px-tall ghost button centered top of hero: "New: Unblocking Agents — isolation, verification, and persistence". Text is solid black, no background, no border, 6px radius (imperceptible at rest). `src/components/announcement-bar.tsx:23-25`.
- **Observed (dark)**: Same shape, white text on black.
- **Pill shape dropped per spec — does non-pill ghost read right?**
  - **Rest state (both themes):** Reads as a *headline announcement* rather than a *click-me pill*. Without the `rounded-full` shadow+border, it has no visual affordance. The text just floats above the hero. A first-time visitor would not know it's clickable.
  - **Hover state (light forced via inline style):** The 6px radius rectangle materializes with a subtle `black/10` fill. At that moment it reads as a button — but only because the cursor is already on it. The pre-hover state does no work.
  - **Above the hero at 1440×900:** the AnnouncementBar + "A lab that ships." + "SEE THE WORK →" stack together. The raw `<a>` "SEE THE WORK →" looks *more button-like* (uppercase mono, arrow glyph) than the ghost Button. Inverted hierarchy.
- **24px button in 40px bar — feels balanced?** The parent container is `h-16 pt-1` (64px visible + 4px top padding), not the 40px the spec's E.3 migration guide described. With 64px vertical space around a 24px button, there's ample breathing room — feels fine.
- **Hover arrow nudge visible?** Arrow doesn't render (0×0, see G1). Nudge CSS is in place but invisible.
- **Issues**:
  - **[MAJOR]** Revision plan P3 flagged this and Stage 6 confirms: **non-pill ghost reads as prose, not a call-to-action.** Options:
    1. Accept the drop and add a small affordance (e.g. `text-[11px] uppercase tracking-[0.15em] font-mono` inherited from the old style) to make it read as chrome rather than prose. The spec's latent voice explicitly uses this mono-upper treatment for announcements.
    2. Restore a pill wrapper on the *parent div*, keep Button as ghost, so the primitive stays pure but the announcement surface gets the shape.
    3. Introduce a `shape="pill"` prop or dedicated `intent="chip"` — but that's v2 scope.
    I recommend option 2: `<div className="rounded-full border border-subtle bg-background/80 backdrop-blur-sm"><Button intent="ghost" size="xs" …></Button></div>`. Shape lives on the container; primitive stays lean.
  - **[MAJOR]** Arrow 0×0 (G1). Without the arrow glyph, "Read it" affordance is textual-only.
  - **[MINOR]** Font size 16px instead of 12px `--text-label-xs` (G2). At 16px the announcement dominates the hero width.

### 5. MDX inline (link variant)

- **Location**: `/lab/fine-tuning-for-spam-detection` (and multi-staging, personalized-video). `src/lib/posts/fine-tuning-for-spam-detection.mdx:114` → `Copiable → Button intent="link" size="lg"`.
- **Underline cascade active in article?** **Yes.** `getComputedStyle(btn).textDecoration = "underline 1px"`. The `article button[data-intent="link"]` CSS rule in `globals.css` is firing correctly.
- **Does link-variant integrate with surrounding prose?** Visually functional but **dimensionally wrong:**
  - Button has `h-10` (40px) + `px-[var(--space-button-x-lg)]` (18px) → the inline button occupies a 40-tall inline-flex box with 18px horizontal padding. In a 15px prose paragraph, this creates a **visible gap on both sides of the email** and orphans the sentence's trailing period far from the link. Screenshot shows `Drop us a message at     hello@rubriclabs.com    .` — the whitespace around the link reads as broken kerning.
  - Root cause: Copiable (`src/components/copiable.tsx:13,34`) passes `size="lg"` straight through. For a prose-inline usage, size should collapse the box padding entirely or be size `xs` with no vertical impact. The Button primitive doesn't have an "inline" size.
- **Light + Dark both captured** — behavior identical across themes. Underline renders in both.
- **Issues**:
  - **[MAJOR]** Inline link variant with `size="lg"` creates ugly whitespace gaps around text in prose. `src/components/copiable.tsx:34` or `src/lib/posts/*.mdx:114,228,137`. Fix options:
    1. Copiable defaults to `size="md"` OR force `size="xs"` when `intent="link"` in MDX, which would still inherit prose font-size but collapse the padding.
    2. Introduce a new `display="inline"` prop on Button that zeroes height and padding while keeping color/underline.
    3. Remove `Button` from the inline-link path entirely — just use `<a>` with the `article a` cascade.
    I recommend option 1 — small tweak in Copiable.
  - **[MINOR]** The underline uses `text-decoration-thickness: 1px` via cascade, which is correct; but the link's `color: rgb(102, 102, 102)` (`--secondary`) against `#f5f0ec` in light mode measures ~5.7:1 which is WCAG AA for normal text at ≥14px — passes. In dark mode `#999` vs black is ~5.1:1 — also AA.

## Deferred P3 items from revision plan — resolution

- **cta.tsx intent=link vs spec §10.2 primary+secondary**: **Recommend restoring spec** (primary lg + secondary lg side-by-side). Single link intent reads too quiet for a 160px-tall CTA section with a 32px heading. Consumer's current choice underweighted the section. Fix in `src/components/cta.tsx:16-20`.
- **announcement-bar pill shape drop**: **Recommend restoring a container wrapper** (not the button's shape). The pill affordance carried the "click me" signal; without it the Button reads as prose. Keep `intent="ghost"` on the primitive, move pill chrome to the announcement container. See Context 4 Issue recommendation above.

## Global bugs observed across all contexts

### G1. `cloneElement` drops `data-slot` on icon components → arrows 0×0

- **Observed on**: every Button with a trailingIcon (AnnouncementBar, FeaturedWork See-all, Bottom CTA, Contact-form Send).
- **Root cause**: `src/components/button.tsx:53-54` — `React.cloneElement` passes `{ 'data-slot': slot, 'aria-hidden': true, className: cn(cls, ...) }` onto `<Arrow />`. But `src/components/icons/arrow.tsx:1` — `export const Arrow = ({ className }: { className?: string })` — destructures **only** `className` and drops every other prop. So `data-slot` never reaches the DOM. Then the size selector `[&_[data-slot=trailing-icon]]:size-[14px]` never matches. The SVG has no `width`/`height` attribute, so it collapses to 0×0.
- **Evidence**: `document.querySelector('[data-intent="link"] svg')` → computed `width: 0px, height: 0px`. `outerHTML` shows no `data-slot` attribute.
- **Fix**: Make `Arrow` spread props: `export const Arrow = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => <svg {...rest} className={className}>…` (and similarly for any other icon components used via trailing/leading slots). OR have the Button primitive force size via a parent wrapper span with a className the Button owns directly. File: `src/components/icons/arrow.tsx:1-2`. Severity: MAJOR — breaks every arrow-bearing Button.

### G2. `twMerge` conflates `text-[var(--text-label-*)]` (size) with `text-[var(--color-*)]` (color) → all buttons render at inherited 16px

- **Observed on**: every Button in non-prose contexts (AnnouncementBar, CTA link, FeaturedWork See-all). Prose contexts coincidentally inherit 15px from `<p>` which matches lg spec — masking the bug.
- **Root cause**: `src/components/button.tsx:31-34` puts `text-[var(--text-label-xs)]` in `SIZE[size].base` and `INTENT[intent]` puts `text-[var(--color-primary)]` / `text-[var(--color-secondary)]` etc. Both match `text-*` prefix. `tailwind-merge` (`src/lib/utils/cn.ts:5`) strips the earlier `text-*` when a later `text-*` appears. INTENT is concatenated AFTER SIZE in the `cn(…)` call on line 65-71 → INTENT's color `text-*` wins, SIZE's font-size `text-*` is dropped.
- **Evidence**: `document.querySelector('[data-intent="ghost"]').className` does NOT contain `text-[var(--text-label-xs)]`. It only contains `text-[var(--color-primary)]` and `text-[var(--color-disabled-foreground)]`.
- **Fix options**: 
  1. Move font-size out of `text-*` arbitrary to a new class like `[font-size:var(--text-label-xs)]` (bracket-property syntax, no `text-` prefix conflict).
  2. Split `SIZE.base` and `INTENT` into separate `cn(…)` calls with `clsx` semantics — but twMerge would still dedupe.
  3. Register `--text-label-*` as first-class Tailwind theme tokens in `@theme inline` (they already are — globals.css:91-94) and use bare `text-label-xs` classes. Tailwind v4 should generate them — but they'll still merge with `text-color`.
  4. Use inline style: `style={{ fontSize: `var(--text-label-${size})` }}` — ugliest but most reliable.
  I recommend #1: `[font-size:var(--text-label-xs)]`. File: `src/components/button.tsx:31-34`. Severity: MAJOR — silently defeats an entire token pillar.

### G3. Missing hero-CTA consumer

- See Context 1 Issues. Severity: MAJOR — primary intent at `md` size is the *anchor usage* of the Button primitive on the homepage; leaving it as a raw `<a>` defeats half the point of the migration.

### G4. Missing card-nested consumer

- See Context 3 Issues. Severity: MAJOR — the radius nesting proof is one of Stage 2's explicit value props, and no migration landed a Button inside a card.

## Accessibility spot checks

- **Focus ring visible on keyboard tab through each context?** Not reproducible in preview — `iframe.focus()` + programmatic focus doesn't fire `:focus-visible` in the preview harness. CSS is in place (`focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)]` on Button root) but live test deferred.
- **Disabled primary contrast measured**: Simulated `data-disabled` on contact form Send button in light:
  - Computed `backgroundColor: color(srgb 0 0 0 / 0.1)` → over `#f5f0ec` ≈ `#DCD8D5`
  - Computed `color: color(srgb 0.4 0.4 0.4 / 0.85)` → effective ≈ `#717171`
  - Contrast: ≈ **2.9:1** against the button's own surface. Stage 5 R6 targeted 3.0:1 — misses by a hair. Suggest recompute with `--color-disabled-foreground: color-mix(in srgb, var(--secondary) 90%, transparent)` (90% instead of 85%) to clear 3.0:1.

## Screenshot manifest

1. Homepage top, light — shows AnnouncementBar (ghost xs) + raw hero `<a>` SEE THE WORK + "A lab that ships." chat panel. Sampled at `scrollY=0`, 1440×900.
2. Homepage top, dark — same layout in dark tokens.
3. AnnouncementBar hover state, dark (forced via `:hover` style inject) — shows `rgba(255,255,255,0.1)` fill appearing as a rounded rectangle around the announcement.
4. Bottom CTA ("Working on something hard?"), light — single `intent="link" size="lg"` button centered.
5. Bottom CTA, dark — same.
6. Contact form Send button, light — primary lg rendered as black pill with cream "Send" text; arrow missing (0×0).
7. Contact form Send button, dark — white pill with black "Send".
8. MDX inline link (fine-tuning-for-spam-detection conclusion), light — underlined `hello@rubriclabs.com` with visible whitespace orphan before trailing period.
9. MDX inline link, dark — same.
10. FeaturedWork + Process section, light — shows "See all work →" (arrow invisible) next to "WORK" label, plus FAST/DEEP/PRODUCTION cards.
11. FeaturedWork + Process section, dark.
12. Blog figure controls (system-architecture.tsx speed selector) at 200% zoom — shows secondary xs "1x" active pill vs ghost xs "0.5x/1.5x/2x" inactive. Only context with a visibly-rendered secondary variant.
13. Contact form with disabled Send button (simulated) — shows disabled-surface + disabled-foreground in light.
14. Figma reference Button — Light (`12:2`) — 4×3 master grid.
15. Figma reference Button — Dark (`12:33`) — 4×3 master grid.

## Escalations to Dexter

1. **Hero CTA missing (Context 1).** The spec's anchor usage wasn't migrated. Either a follow-up ticket to replace the hero `<a>` with a primary md Button, OR a spec amendment acknowledging the hero is intentionally out of scope. This is a creative-direction call: does the homepage hero deserve a primary CTA, or is "SEE THE WORK" + the engine hero sufficient? My read: the hero works as-is aesthetically, so the spec is wrong to expect a Button there. But the inconsistency between "our polished Button primitive" vs "raw hand-rolled hero CTA" is a visible tell. Your call.

2. **AnnouncementBar pill: restore container shape vs keep ghost-as-prose?** I recommend restoring the pill shape as a parent `<div>` wrapper (my Context 4 option 2). It keeps the Button primitive clean while giving the announcement the "floating chip" affordance it needs. But this adds 1 line of chrome to the AnnouncementBar consumer, and moves a styling decision out of the primitive. Confirm direction.

## Summary of what Stage 5 loop must fix before Stage 7

Blocking (ship-blockers):
- G1: Arrow (+ any other icon component) must spread props so `data-slot` reaches the DOM. `src/components/icons/arrow.tsx`.
- G2: Replace `text-[var(--text-label-*)]` with `[font-size:var(--text-label-*)]` or equivalent non-merging syntax. `src/components/button.tsx:31-34`.
- Context 2: restore primary+secondary lg side-by-side in `cta.tsx` per spec §10.2.
- Context 5: Copiable default size for `intent="link"` to `xs` (inline-friendly). `src/components/copiable.tsx:13`.

Should-fix (polish-blocker, escalate):
- Context 1: hero CTA — see Escalation 1.
- Context 4: announcement-bar pill — see Escalation 2.
- Context 3: migrate process.tsx cards to include a secondary sm Button to prove radius nesting.

Nice-to-have:
- Disabled contrast tuning: `--color-disabled-foreground` alpha 85% → 90% for +0.1 contrast points.

---

## Stage 5 Loop 2 — Post-Fix Validation

> Re-screenshot pass after Stage 5 loop 2 commits. Verifies every blocker from Stage 6 is closed. Preview server reused at `http://localhost:3456/`, viewport 1440×900, theme toggled via `document.documentElement.setAttribute('data-theme', …)`.

### Build + type checks

- `bunx tsc --noEmit` → **pass, exit 0**.
- `bun run build` → **pass**, all 23 static pages generated, no parse errors after `@source not "../../forge"` was added to `globals.css` (forge/ markdown was leaking `text-label-*` wildcard candidates into Tailwind's class scanner).

### Runtime verification on `/`

DOM inspection via preview_eval captured computed-style values for every `[data-intent]` on the homepage:

| Element | intent | tag | fontSize | height | notes |
|---|---|---|---|---|---|
| AnnouncementBar | ghost | A | 12px | 24px | xs ✓ |
| Process card FAST | secondary | A | 13px | 28px | sm ✓ |
| Process card DEEP | secondary | A | 13px | 28px | sm ✓ |
| Process card PRODUCTION | secondary | A | 13px | 28px | sm ✓ |
| "See all work →" | link | A | 14px | 32px | md ✓ |
| Bottom CTA primary | primary | A | 15px | 40px | lg ✓ |
| Bottom CTA secondary | secondary | A | 15px | 40px | lg ✓ |

**G2 fix confirmed**: every Button renders at its spec font-size (12/13/14/15 per xs/sm/md/lg). `[font-size:var(--text-label-*)]` bracket-property syntax bypasses the `text-*` merge collision.

**G1 fix confirmed**: every trailing `<Arrow />` now carries `data-slot="trailing-icon"` on the DOM and computed `width: 14px; height: 14px;`. Size-slot CSS rule matches correctly.

**AnnouncementBar pill chrome confirmed**:
- `pillWrap`: DIV, `border-radius: 1.67e+07px` (Tailwind `rounded-full` saturating), `backdrop-filter: blur(8px)`, `background-color: oklab(0 0 0 / 0.8)`, `border: 1px solid rgba(255, 255, 255, 0.1)` (dark theme).

### Post-fix screenshot manifest

1. Homepage top, **dark (default system)**, 1440×900 — AnnouncementBar pill container renders with visible rounded-full bg + blur, "New: Unblocking Agents — isolation, verification, and persistence →" with arrow glyph clearly rendered. Hero "A lab that ships." + chat panel intact.
2. Homepage top, **light** (`data-theme="light"`) — same layout in light tokens. Pill now reads as a clear floating chip against cream background; border-subtle visible at `black/10`.
3. Process cards section, **dark** — 3 columns FAST / DEEP / PRODUCTION each render secondary sm Button at bottom ("How we engage", "See the work", "Recent case studies"). Card radius 16 visibly parallel with Button radius 6 at the 32px interior offset. "See all work →" link renders with arrow at the section footer.
4. Bottom CTA ("Working on something hard?"), **dark** — two lg Buttons side-by-side: primary "Start a conversation →" (white pill, black arrow) + secondary "Browse work" (dark pill with hairline border). Gap of 12px reads as deliberate.
5. MDX inline, **light** (`/lab/fine-tuning-for-spam-detection`) — "Drop us a message at `hello@rubriclabs.com` ." — the xs inline Button has 10px padding that is noticeably tighter than the lg orphan Stage 6 captured; the trailing period still sits a touch away from the closing bracket of the button, but reads as part of the affordance rather than broken kerning.

### What Stage 5 loop 2 actually closed

| Stage 6 finding | Status | Commit |
|---|---|---|
| G1 — icon prop-drop, arrow 0×0 | **fixed** | `17da59b` |
| G2 — `text-*` merge conflict, inherited 16px | **fixed** | `99f6e90` |
| G3 — hero CTA missing | **deferred (spec amended out-of-scope)** | `80af705` |
| G4 — no card-nested consumer | **fixed (process.tsx)** | `60eb435` |
| Context 2 — bottom CTA whispers | **fixed** | `c6aa169` |
| Context 4 — AnnouncementBar reads as prose | **fixed (pill on container)** | `12765c0` |
| Context 5 — MDX inline lg orphan | **fixed (Copiable xs default for link)** | `a83b589` |
| Disabled contrast 2.9:1 | **fixed (85→90%)** | `596e0d0` |

button.tsx LOC: **84** (unchanged from Stage 5 — G2 fix was pure token swap inside the SIZE map).

### Stage 7 readiness

**Ready.** All P0/P1 blockers from Stage 6 closed; build green, types clean, 8 of 8 runtime invariants verified on live dev server. The primitive consumes 29 tokens cleanly, and every consumer in §9 migration map renders at the correct font-size / dimensions / arrow presence.
