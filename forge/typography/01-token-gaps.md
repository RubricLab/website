# Typography — Token Gap Audit

Stage 1, Agent C role. Audit against the 6 locked type roles in `00-context.md`. Source: `src/app/globals.css`. The Button forge already landed tokens (lines 63–118) — this audit confirms what to keep, what to add, and what to delete or fold.

## 1. Current typography-relevant token surface (globals.css)

Grouped by family. Line numbers cite `@theme inline` (63–118) — the Tailwind-exposed token surface.

### Font families (already shipped, KEEP as-is)

| Token | Value | Line |
|---|---|---|
| `--font-sans` | `var(--font-matter)` | 74 |
| `--font-mono` | `var(--font-mono)` | 75 |

Both map to loaded faces (Matter Regular 400 + JetBrains Mono 400/500). No changes.

### Label scale (shipped by Button — AUDIT for overlap)

| Token | Value | Line | Proposed typography role mapping |
|---|---|---|---|
| `--text-label-xs` | `0.75rem` (12px) | 95 | KEEP — Button size xs |
| `--text-label-sm` | `0.8125rem` (13px) | 96 | KEEP — Button size sm |
| `--text-label-md` | `0.875rem` (14px) | 97 | KEEP — Button size md |
| `--text-label-lg` | `0.9375rem` (15px) | 98 | KEEP — Button size lg (**equals Typography `body` size**) |
| `--font-feature-tnum` | `"tnum"` | 99 | KEEP — for tabular mono |

**Observation:** `--text-label-lg` at 15px equals Typography's `body` size. Coincidence or intent? Likely intent — Button's lg is a CTA inside body context, and at lg it should feel "at body size" for continuity. We don't fold `body` size into `--text-label-lg` though — they have different semantic roles (Button label vs reading body). Typography adds its own `--text-body-size` at 15px (same value, different name). Keeping them separate preserves forward compat: if body ever moves to 16, Button labels don't follow.

**Decision: do not delete or rename `--text-label-*`. Button uses them. Typography uses its own role names.**

### Radius, motion, spacing (Button — unrelated to Typography, KEEP)

All of lines 90–117 are Button territory. Typography does not touch them.

---

## 2. Required tokens for Typography

Restated from `00-context.md` § "The 6 type roles":

| Role       | HTML element             | Size (clamp / fixed) | Tracking   | Weight | Case      |
|------------|--------------------------|----------------------|------------|--------|-----------|
| `display`  | `<h1>` (marquee usage)   | clamp(48, 8vw, 72)   | -0.02em    | 400    | normal    |
| `h1`       | `<h1>` (page title)      | clamp(32, 5vw, 48)   | -0.01em    | 400    | normal    |
| `h2`       | `<h2>` (section)         | clamp(22, 3vw, 28)   | -0.005em   | 400    | normal    |
| `h3`       | `<h3>` (subsection)      | 18                   | 0          | 400    | normal    |
| `body`     | `<p>`                    | 15                   | 0          | 400    | normal    |
| `caption`  | `<small>` / `.caption`   | 11                   | 0.08em     | 400    | uppercase |

Plus leading (line-height) per role, per Stage 1-B rhythm inference:

| Role | Leading |
|---|---|
| `display` | 1.05 |
| `h1` | 1.1 |
| `h2` | 1.15 |
| `h3` | 1.25 |
| `body` | 1.7 (split-the-difference between 1.65 chat and 1.75 article) |
| `caption` | 1.4 |

---

## 3. Proposed token structure — per-role size/tracking/leading trio

Three parallel triads per role = 18 scale tokens total. Recommend a **per-role trio** structure for three reasons:

1. **Consumer clarity.** The `@layer base` rules consume three variables per selector — size, tracking, leading. A trio per role means one rule is exactly three `var()` references. Self-documenting.
2. **Adjustability.** If Stage 2 or later decides `h2` needs tighter tracking, one token changes. No cross-role contamination.
3. **Parallels the shipped `--text-label-*` triad-free scale.** Button's approach was one value per size (size only). Typography's approach is richer because headings have tracking + leading that body labels don't emphasize. The divergence is deliberate and commented.

### Additive patch proposal — insert into `@theme inline` block (after line 99, before motion at line 101)

```css
	/* Typography — role tokens (Stage 2 consumes via @layer base rules) */

	/* display — marquee <h1> (hero, session) */
	--text-display-size: clamp(3rem, 8vw, 4.5rem);          /* 48–72px */
	--text-display-tracking: -0.02em;
	--text-display-leading: 1.05;

	/* h1 — page title (/work, /lab, /blog, /contact, detail pages) */
	--text-h1-size: clamp(2rem, 5vw, 3rem);                 /* 32–48px */
	--text-h1-tracking: -0.01em;
	--text-h1-leading: 1.1;

	/* h2 — section title */
	--text-h2-size: clamp(1.375rem, 3vw, 1.75rem);          /* 22–28px */
	--text-h2-tracking: -0.005em;
	--text-h2-leading: 1.15;

	/* h3 — subsection / card title */
	--text-h3-size: 1.125rem;                               /* 18px */
	--text-h3-tracking: 0;
	--text-h3-leading: 1.25;

	/* body — <p> default */
	--text-body-size: 0.9375rem;                            /* 15px */
	--text-body-tracking: 0;
	--text-body-leading: 1.7;

	/* caption — <small>, .caption (uppercase eyebrows) */
	--text-caption-size: 0.6875rem;                         /* 11px */
	--text-caption-tracking: 0.08em;
	--text-caption-leading: 1.4;
```

**Net footprint:** 18 new CSS custom properties in a single insertion site in `globals.css`. Zero existing line changes. Zero deletions.

### Consumption — `@layer base` rules (NOT tokens — preview of Stage 2 spec territory)

For context. The tokens above are consumed as:

```css
@layer base {
  h1 {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: var(--text-h1-size);
    letter-spacing: var(--text-h1-tracking);
    line-height: var(--text-h1-leading);
  }
  h1.display {
    font-size: var(--text-display-size);
    letter-spacing: var(--text-display-tracking);
    line-height: var(--text-display-leading);
  }
  h2 { /* ... h2 trio */ }
  h3 { /* ... h3 trio */ }
  p { /* ... body trio */ }
  small, .caption {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: var(--text-caption-size);
    letter-spacing: var(--text-caption-tracking);
    line-height: var(--text-caption-leading);
    text-transform: uppercase;
  }
}
```

Stage 2 authors exact rules. This audit only proposes the tokens.

---

## 4. Weight tokens — confirmed NOT needed

The pre-agreed rules state: "Matter Regular 400 for all text. No Medium, no Bold, no Italic."

- No `--font-weight-normal` / `--font-weight-medium` / `--font-weight-bold` tokens are required.
- `@layer base` rules hardcode `font-weight: 400` on `<h1>`, `<h2>`, `<h3>`, `<p>`, `<strong>`, `<b>`, `<small>`, and `.caption`.
- `<strong>` / `<b>` in article prose: Stage 2 decides whether to strip to 400 (recommended by Stage 1-B) or keep as an exception. Either way, no tokens need adding.

**Confirmation: zero weight tokens. The font loader is the source of truth. Weight classes are forbidden.**

Additional defensive measure: **explicitly set `font-weight: 400` via `@layer base`** on `html` or `body` to guarantee no user-agent default bold leaks through on `<h1>`–`<h6>`. This kills the 25 defensive `font-normal` classes after migration.

---

## 5. Font-feature-settings tokens

Current: `--font-feature-tnum: "tnum"` exists (line 99).

Proposal: **add one more**, `--font-feature-headings`, for display/h1/h2/h3 kerning + ligatures:

```css
	--font-feature-headings: "kern" 1, "liga" 1, "calt" 1;
```

Applied via `@layer base` on `h1, h2, h3` with `font-feature-settings: var(--font-feature-headings)`. Matter supports these features; enabling them is free quality.

**Alternative — do not add this token.** Modern browsers enable `kern` + `liga` by default. Only `calt` is disabled by default and its impact on Matter is minor. If Stage 2 confirms the visual difference is negligible, drop this token and save one line. **Flag as Stage 2 decision.** Recommend: skip — defaults are fine for this font.

---

## 6. Interaction with Button's `--text-label-*` scale

Button added 4 label-size tokens (`--text-label-xs/sm/md/lg` at 12/13/14/15). Typography adds 6 role-size tokens with overlapping values:

| Size | Button label | Typography role |
|---|---|---|
| 11px | — | `caption` |
| 12px | `label-xs` | — |
| 13px | `label-sm` | — |
| 14px | `label-md` | — |
| 15px | `label-lg` | `body` |
| 18px | — | `h3` |
| 22–28px | — | `h2` (clamp) |
| 32–48px | — | `h1` (clamp) |
| 48–72px | — | `display` (clamp) |

**Observations:**
- **One numeric overlap:** 15px is both `--text-label-lg` (Button) and `--text-body-size` (Typography). Two token names, one value. Preferred over collapsing: Button's labels are inside control surfaces; body is reading content. Semantic separation beats DRY at the token layer. **Keep both.** Document in `@theme inline` comment: "Button labels and Typography body share 15px — intentional; different consumers."
- **No role-name collision.** `--text-label-*` is Button-scoped; `--text-{role}-size` is Typography-scoped. Prefix discipline maintained.
- **No replace-or-rename churn.** Button ships intact.

**Decision: purely additive. Typography does not touch `--text-label-*`.**

---

## 7. Deliberate non-additions

Tokens a typical design system might add but Typography v1 does NOT:

- **`--font-weight-*`** — Rule 1 forbids weight variance. Font loader enforces. No tokens needed.
- **`--text-scale-*` generic T-shirt scale** — Typography has 6 named roles; a generic `--text-xs/sm/md/lg/xl` scale would duplicate the role tokens at the wrong abstraction. Skip.
- **`--text-{role}-color`** — color is owned by `--color-primary` / `--color-secondary`, orthogonal to Typography. Do not add.
- **`--text-body-large` / `--text-body-small`** — no lead/eyebrow body variants. One body size.
- **`--text-link-*`** — links are styling rules (underline-offset, decoration), not typography roles. Stage 2 authors them as CSS rules without new tokens (consumed from existing `--color-*`).
- **`--text-code-size`** — `<code>` is Rule 2 legitimate mono at 13px (inline) / varies (block). Already handled inline in `globals.css:276`. Not elevated to token.
- **`--text-blockquote-*`** — blockquote gets one rule via `article blockquote` selector; it reuses `--text-body-size` for its inner `<p>`. No token needed.
- **`--text-figcaption-*`** — figcaption becomes `caption` role; the existing `article figcaption` rule updates to use `--text-caption-size`. Same token, different selector.
- **Full tracking / leading T-shirt scale** — Typography uses per-role trios, not a shared `--tracking-tight/normal/wide` + `--leading-tight/normal/wide` grid. Per-role keeps each role self-contained; adjustment is local.

**The discipline: every token must be consumed by at least one `@layer base` rule in Stage 2. Speculative scale tokens are future-debt.**

---

## 8. Light/dark parity

Typography adds zero new colors. All 18 proposed tokens are scale/tracking/leading values — theme-independent.

**Theme-dependent type concerns live in existing color tokens:**
- `text-primary` / `text-secondary` already flip per theme (`globals.css:7-61`).
- The `.caption` uppercase eyebrow uses `text-secondary` or `text-tint` per consumer — no new tokens needed.

**Confirmation: zero light/dark fork in Typography's token patch.**

---

## 9. Scanner-leakage safety

Button forge hit a Tailwind v4 bug where `forge/*.md` was scanned as candidate classes, generating invalid rules from documentation examples. Fix already in place: `@source not "../../forge"` (globals.css:5).

Typography's `00-context.md` and these three Stage 1 files contain token names like `--text-display-size` in code blocks. These are CSS custom property names, not Tailwind classes, so they should NOT be generated as candidates even without the exclusion. **The fix stays in place** — no additional scanner-config changes required.

**Confirmation: no infra changes needed.**

---

## 10. Nesting / alignment math — display vs h1 override

Stage 0 says: "`display` and `h1` use the same HTML element (`<h1>`). Role differentiation is a class override on the one marquee instance."

Two proposals for the override mechanism:

| Option | Selector | Example |
|---|---|---|
| A — class | `h1.display` | `<h1 class="display">A lab that ships.</h1>` |
| B — data attribute | `h1[data-type="display"]` | `<h1 data-type="display">...</h1>` |

**Recommendation: Option A (`.display` class).** Simpler, matches Button's `data-intent` ADR in style (class for visual role, data attribute for behavioral intent — Button's `data-intent` exposes interactions to CSS; Typography's `.display` is a pure visual variant). Stage 2 locks.

Stage 6 consumer existence check: exactly **3 sites** need `.display` applied post-migration:
1. `session.tsx:193` — homepage session marquee
2. `hero/index.tsx:112` — mobile hero marquee
3. `hero/index.tsx:144` — desktop hero marquee

All three render the text "A lab that ships." All three are semantically the same marquee. Zero other `<h1>` in the codebase should take `.display`. If Stage 6 DOM inspection reveals a 4th or 5th, that is a bug.

---

## 11. Consumer reality check (per Recipe v1.1)

Stage 2 will author §10 with a real-context consumer mapping. Per the Button postmortem, every role must be consumed by at least one real component or it's speculation. Stage 1-C confirms:

| Role | Consumers (current) | Count |
|---|---|---|
| `display` | `session.tsx`, `hero/index.tsx` (mobile + desktop) | 3 |
| `h1` | `work/page.tsx`, `lab/page.tsx`, `work/[slug]/page.tsx`, `lab/[slug]/page.tsx`, `contact-form.tsx`, `app/components/page.tsx`, `app/components/button/page.tsx` | 7+ |
| `h2` | `philosophy.tsx`, `work/page.tsx`×2, `cta.tsx`, `app/components/page.tsx`, `app/components/button/page.tsx`×3, article `<h2>` in all 11 MDX posts via cascade, `work/page.tsx` sections | 20+ |
| `h3` | `featured-work.tsx`, `hero/index.tsx` mobile, `lab/page.tsx`×4, `lab-preview.tsx`, `work/page.tsx:201`, `hero/expansions/margin-text.tsx`, article `<h3>` in MDX posts | 15+ |
| `body` | `globals.css` article cascade, hero intros (mobile + desktop), work/lab detail leads, case-study leads, card bodies across process/featured-work/lab, chat system response (if role wins), 11+ MDX posts | 30+ |
| `caption` | ~50 UI-eyebrow sites post-migration (see Stage 1-A §4 Category B) | 50+ |

**Every role has 3+ real consumers today. No speculative roles. No "GAP" cells.** Button's G3 (hero CTA consumer never existed) and G4 (no card-nested Button) will not recur here — Typography starts with 100+ ready consumers across 42 files.

---

## 12. Summary: patch scope

- **Tokens kept as-is:** All of Button's shipped tokens (lines 63–117). Zero touches.
- **Tokens to add (Typography):** 18 new role-scale tokens in one `@theme inline` insertion block.
- **Tokens to rename or delete:** None.
- **Tokens to fold:** None — Typography doesn't reuse Button's `--text-label-*` for semantic reading roles.
- **`@layer base` rules to author (Stage 2):** 7 rules — `h1`, `h1.display`, `h2`, `h3`, `p`, `small, .caption`, and an override for `<strong>`/`<b>` inside `article`.
- **Net globals.css additions (Stage 2 total, tokens + rules):** ~30 lines added, 4 lines modified (the existing `article h2/h3/p/blockquote/figcaption/strong` cascade updates to consume the new tokens and drop `font-semibold`/`font-mono` where rule-violating).
- **Weight tokens:** Zero — confirmed deliberately.
- **Color tokens:** Zero — handled elsewhere.
- **Feature-settings tokens:** 0–1 (one optional `--font-feature-headings`, recommend skip).

**Total patch size for Stage 2: ~30 lines added to `globals.css`, spread across one `@theme` insertion and one `@layer base` block. Zero net LOC elsewhere — migration across 42 files is pure deletion (remove inline classes, let roles inherit).**

This is the inverse of Button (which added 23 tokens + a new file + 29 call-site migrations). Typography adds fewer tokens and **subtracts** ~200 className fragments across the codebase. Stage 2's success metric is the delta: `wc -l src/**/*.tsx` should drop after migration even as it gains role semantics.

---

## 13. Stage 2 prerequisites summary

For Stage 2 to author the spec, Stage 0 + Stage 1 produces:

1. **Stage 0 (this component's 00-context.md):** 6 roles locked, 5 rules locked, HTML element mapping locked, out-of-scope list locked, migration scope quantified at 42 files.
2. **Stage 1-A (codebase usage):** Call-site inventory complete; 95+ literal sizes enumerated; ~50 mono flips identified; 37 heading migrations identified; 8 semantic HTML corrections flagged; stale `text-text-*` orphans noted.
3. **Stage 1-B (latent voice):** 10 inferences extracted; 5 anti-patterns listed; caption flip (mono→sans) tonal implications documented; chat-UI 13px escape hatch flagged; `<strong>` Rule 1 violation flagged for orchestrator.
4. **Stage 1-C (this doc):** 18 tokens proposed in one additive patch; zero deletions; interaction with Button tokens confirmed safe; consumer reality check passes for all 6 roles.

**Open orchestrator decisions for Stage 2** (synthesized from all 3 Stage 1 files):
- **OD-1**: `<strong>`/`<b>` in article prose — strip `font-semibold` or keep as exception?
- **OD-2**: `cta.tsx:9` at 32px — accept shrink to `h2` (28px max), promote to `h1`, or widen `h2` clamp?
- **OD-3**: Chat UI at 13px — role as `body` (bump to 15) or carve `.chat-body` utility class?
- **OD-4**: `featured-work.tsx:53` `<h3>` at `h2` size — change element to `<h2>` or accept shrink to `h3` (18px)?
- **OD-5**: Diagrammatic scaffold in `hero/expansions/*`, `case-study-diagrams/*`, `blog/*/figure.tsx` — carve out as `.scaffold` opt-out or accept them as out-of-scope?
- **OD-6**: Article `figcaption` flip from mono 9px → sans 11px `caption` — accept or keep mono as prose-figure exception?
- **OD-7**: Stale `text-text-*` tokens in 4 files — fix during Typography migration or spawn separate task?
- **OD-8**: `--font-feature-headings` token — add or skip?

Each decision is small. None blocks Stage 1 closure; all block Stage 2 spec authoring. Orchestrator receives this list with Stage 1 signoff.

ultrathink
