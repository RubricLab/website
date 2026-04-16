# Typography — Stage 2 Spec (Binding Contract)

> Binding contract for Stages 3–7. Every size is a token. Every role maps to exactly one HTML element. Every rule lives in `@layer base` on raw semantic HTML — no `<Heading>` primitive, no per-call-site className stamps. Stages 3+ execute this verbatim — they do not invent.
>
> Grounded in: `forge/typography/00-context.md`, `01-codebase-usage.md`, `01-latent-voice.md`, `01-token-gaps.md`. All 8 Stage 1 orchestrator decisions (OD-1 through OD-8) are resolved in § 0 below and encoded verbatim in every rule. Stage 3 must NOT re-open them.
>
> File paths below are absolute against the repo root (`src/…`).

---

## 0. Orchestrator-resolved decisions (encoded verbatim, not re-opened)

These eight decisions arrived with this brief and are treated as ruled. Stages 3+ cite the OD number when a downstream question lands on one of these.

| # | Decision | Spec encoding |
|---|---|---|
| **OD-1** | `<strong>`/`<b>` in article prose: strip `font-semibold`. Emphasis shifts from `text-secondary` (body default) to `text-primary`. Color-only emphasis. Rule 1 holds. | § 2 Rule 1; § 5.6 `article :is(strong, b)` selector. |
| **OD-2** | `cta.tsx:9` 32px `<h2>`: shrink to `h2` clamp (upper 28px). Enforce the clamp. No widening of h2. | § 7 Migration map row `cta.tsx:9` flagged "accept shrink". |
| **OD-3** | Chat UI 13px: bump to `body` (15px). Delete `.chat-body` option. One rule per context. | § 7 Migration map rows for `hero/chat/*`. No utility class. |
| **OD-4** | `featured-work.tsx:53` `<h3>` at h2-size clamp: accept shrink to h3 (18px). Element stays `<h3>`; visual weight drops. | § 7 Migration map row `featured-work.tsx:53` flagged "accept shrink". |
| **OD-5** | Diagrammatic scaffold carve-out: `src/components/hero/expansions/*`, `src/components/case-study-diagrams/*`, `src/components/blog/**/*figure*.tsx` are illustration-content, NOT governed by Typography rules. | § 8 Out of scope (explicit exclusion list). |
| **OD-6** | `figcaption` mono 9px → sans 11px caption. Article `<figcaption>` gets `caption` role (Matter 11px uppercase tracked). Mono reserved to code + numeric-data tables. | § 3 role table; § 5 article cascade. |
| **OD-7** | Stale `text-text-*` tokens: fix in Typography migration. Identify 4 offending files in migration map; replace with correct role token / remove entirely. | § 7 Migration map group "Stale `text-text-*` tokens". |
| **OD-8** | `--font-feature-headings` token: skip for v1. Documented in Out of scope. | § 8 Out of scope list. |

---

## 1. Mission

Typography is the **type spine** every subsequent primitive inherits. Button added 29 tokens + one new file. Typography deletes ~200 inline literal-size/clamp/font-mono className fragments across 42 files by promoting the latent Rubric voice to 6 named roles implemented as `@layer base` rules on raw semantic HTML.

The win is measured in **deleted className noise**, not added surface. Net globals.css grows by ~50 lines; net component LOC shrinks by ~200 fragments. Every `<h1>`, `<h2>`, `<h3>`, `<p>`, `<small>`, `<figcaption>` on the site becomes self-styling.

One escape class: `.display` on the marquee `<h1>`. Three sites. Nothing else.

---

## 2. Rules (Matter-only, mono-reserved, no literals, semantic HTML 1:1)

The 5 locked rules. Every Stage 3+ decision is tested against these.

### Rule 1 — Matter Regular 400 for every sans element

Matter loads at weight 400 only (`src/app/layout.tsx:9-12`). Every `font-medium` / `font-semibold` / `font-bold` / `italic` on a sans element in the codebase is **browser-synthesized** and renders as a blurred artifact against the warm-paper `#f5f0ec` background. Hierarchy comes from **size + space + color**, never weight or style.

Scope: `<h1>`, `<h2>`, `<h3>`, `<p>`, `<li>`, `<strong>`, `<b>`, `<em>` (if present), `<small>`, `<figcaption>`, `<blockquote>`, `.caption`. All sans-bearing elements.

Enforcement: `@layer base` sets `font-weight: 400` on all of the above. All `font-medium` / `font-semibold` / `font-bold` / `italic` classNames are stripped at migration time (§ 7). All 25 defensive `font-normal` classNames are also stripped — the base rule wins, the class is redundant.

Exception carve-outs (not rule violations — different surfaces):
- JetBrains Mono at weight 500 inside `.tabular` / `<code>` / diagrammatic scaffold (OD-5). Mono loads 400 + 500; 500 is legitimate mono-weight variance.
- No exception for Matter. Period.

### Rule 2 — Mono reserved for exactly two surfaces: `<code>` and `.tabular`

JetBrains Mono is loaded for (a) code (`<code>`, `<pre>`, MDX code blocks, inline code inside tables) and (b) technical numeric-data tables (`<table>` cells with tabular numerics, via `.tabular` utility). Every other use is a Rule 2 violation and flips to Matter.

- `<code>` rule already exists at `globals.css:275-277` (KEEP).
- `.tabular` utility: Stage 3 adds one class rule `.tabular { font-family: var(--font-mono); font-feature-settings: var(--font-feature-tnum); font-weight: 400; }`. Zero consumers in v1 (the migration leaves `case-study-diagrams/*` etc. unmigrated per OD-5); the utility is pre-declared for when a DataTable primitive lands.
- Every `font-mono` outside `<code>` / `.tabular` / OD-5 carve-outs flips to Matter at migration time (§ 7).

OD-6 reinforcement: `article figcaption` flips from mono 9px → sans 11px `caption` role. The figcaption rule updates in the article cascade (§ 5).

### Rule 3 — No `text-[Xpx]` or `clamp(...)` literals inline anywhere

Every size is a named role (token). `text-[15px]`, `text-[clamp(36px,5vw,64px)]`, `text-xl`, `text-4xl`, and their friends are all banned from reading-content elements. Migration (§ 7) deletes every one.

Exception carve-outs (OD-5): `src/components/hero/expansions/*`, `src/components/case-study-diagrams/*`, `src/components/blog/**/*figure*.tsx` — these are illustration-content with diagram-scaffold sizes (8–10px) that Stage 3 leaves untouched. Documented in § 8.

Implementation architecture: Typography writes rules at `@layer base` on raw HTML elements, NOT as `text-*` Tailwind utilities consumed via `cn()`. This architectural choice dodges the Button G2 silent twMerge token collision entirely — `font-size` flows through the cascade on `<p>`, not through a `text-[var(--text-body-size)]` Tailwind class that could collide with `text-primary` color class in `twMerge`. Spec makes this explicit: **Typography never touches `cn()`**.

### Rule 4 — One treatment per semantic HTML element

`<h2>` always looks like h2 everywhere. `<p>` always looks like body. There are no `<h2 variant="loud">` or `<p size="small">` props. The 16 current `<h2>` / `<h3>` inline-styled variants consolidate into one rule per element.

The one formal exception is `h1.display` — a single class override that elevates the marquee `<h1>` from `h1` role to `display` role. Applied to exactly 3 sites (§ 6.1). Every other `<h1>` on the site takes `h1` role automatically.

Semantic HTML corrections (a bonus pass — § 7 group "Semantic mismatches"): 8 current sites use `<h3>` / `<h2>` to render an uppercase eyebrow stamp. Screen readers hear these as headings; visually they're labels. Migration demotes them to `<p class="caption">` / `<small>`. This is a structural a11y fix embedded in Typography.

### Rule 5 — No `<Heading>` primitive — CSS rules on raw semantic HTML

There is no `<Heading level={2} />` component. There is no `<Text />`. There is no `<Display />`. You write `<h2>Section title</h2>` and get the h2 treatment automatically from `@layer base`. You write `<p>Paragraph body.</p>` and get body type.

Consequence for migration: every `<h1>Whatever</h1 className="…">` in the codebase collapses to `<h1>Whatever</h1>`. The only preserved classNames on headings/paragraphs are **layout classes** (`mt-*`, `mb-*`, `max-w-*`, `text-center`, `mx-auto`, `pr-16`, etc.) — never type classes.

---

## 3. The 6 roles (full table)

Authoritative sizes, tracking, leading, weights, cases. Stage 1-B refinements applied (leading defaults). Stage 2 locks.

| Role       | HTML element(s)                                  | Size                              | Tracking   | Line-height | Weight | Case      | Font-family |
|------------|--------------------------------------------------|-----------------------------------|------------|-------------|--------|-----------|-------------|
| `display`  | `<h1>` with `.display` class (marquee only)      | `clamp(3rem, 8vw, 4.5rem)` (48–72px) | -0.02em    | 1.05        | 400    | normal    | `var(--font-sans)` |
| `h1`       | `<h1>` (default — page title)                    | `clamp(2rem, 5vw, 3rem)` (32–48px) | -0.01em    | 1.1         | 400    | normal    | `var(--font-sans)` |
| `h2`       | `<h2>` (section title)                           | `clamp(1.375rem, 3vw, 1.75rem)` (22–28px) | -0.005em   | 1.2         | 400    | normal    | `var(--font-sans)` |
| `h3`       | `<h3>` (subsection / card title)                 | `1.125rem` (18px)                 | 0          | 1.3         | 400    | normal    | `var(--font-sans)` |
| `body`     | `<p>`, `<li>`                                    | `0.9375rem` (15px)                | 0          | 1.75        | 400    | normal    | `var(--font-sans)` |
| `caption`  | `<small>`, `<figcaption>`, `.caption`            | `0.6875rem` (11px)                | 0.08em     | 1.3         | 400    | uppercase | `var(--font-sans)` |

### 3.1 Leading notes (Stage 1-B refinements applied)

- `h2` locked at 1.2 (not 1.15 from Stage 1-C proposal) — splits the difference between `h1` 1.1 and `h3` 1.3; matches current `leading-tight` on section `<h2>`s observed across the codebase.
- `h3` locked at 1.3 (not 1.25 from Stage 1-C) — matches current `leading-snug` (Tailwind 1.375) observed at `hero/expansions/margin-text.tsx:27` minus a hair; reads correctly on 18px.
- `body` locked at 1.75 — preserves article prose's existing `leading-[1.75]` (globals.css:212). Stage 1-C proposed 1.7 as a split between chat (1.65) and article (1.75); Stage 2 accepts 1.75 for all body because article prose is the canonical reading surface and chat-UI is now body-sized per OD-3. Single target, no forking.
- `caption` locked at 1.3 (not 1.4 from Stage 1-C) — uppercase captions fit chips / inline-block labels at 1.3; 1.4 creates visible extra vertical white in 22-vertical-pixel cells.

### 3.2 Display vs. h1 — the single override mechanism

The HTML element is `<h1>`. Role differentiation is a CSS class override:

- `<h1>...</h1>` → `h1` role automatically.
- `<h1 class="display">...</h1>` → `display` role.

`.display` applies exactly 3 places post-migration:
1. `src/components/session.tsx:193`
2. `src/components/hero/index.tsx:112` (mobile marquee branch)
3. `src/components/hero/index.tsx:144` (desktop marquee branch)

All three render the text "A lab that ships." Stage 3 assertion: `document.querySelectorAll('h1.display').length === 3` (on the homepage route `/`; counted across all three breakpoint branches that ever actually mount, Stage 3 implementer picks a reasonable measurement point).

### 3.3 Why 6 and not 7

No `lead`, no `micro`, no `body-sm`, no `caption-lg`, no `h4+`. Any future addition escalates to orchestrator decision, not silent slope creep. Rationale: Linear / Vercel / Stripe all ship ≤ 7 type roles; Rubric's density is lower, so 6 is the ceiling. The absence of body variants is intentional restraint.

---

## 4. Token contract (exhaustive)

Every CSS variable Typography adds to `globals.css`. One additive block inside `@theme inline`. Zero existing lines modified (except the article cascade rules in § 5 which consume these tokens). Zero deletions.

### 4.1 Role-scale tokens (18 new — per-role size/tracking/leading trios)

Inserted into `@theme inline` after line 99 (`--font-feature-tnum: "tnum";`), before line 101 (`/* Motion */`).

| Token | Value | Role | Role property |
|---|---|---|---|
| `--text-display-size` | `clamp(3rem, 8vw, 4.5rem)` | display | font-size |
| `--text-display-tracking` | `-0.02em` | display | letter-spacing |
| `--text-display-leading` | `1.05` | display | line-height |
| `--text-h1-size` | `clamp(2rem, 5vw, 3rem)` | h1 | font-size |
| `--text-h1-tracking` | `-0.01em` | h1 | letter-spacing |
| `--text-h1-leading` | `1.1` | h1 | line-height |
| `--text-h2-size` | `clamp(1.375rem, 3vw, 1.75rem)` | h2 | font-size |
| `--text-h2-tracking` | `-0.005em` | h2 | letter-spacing |
| `--text-h2-leading` | `1.2` | h2 | line-height |
| `--text-h3-size` | `1.125rem` | h3 | font-size |
| `--text-h3-tracking` | `0` | h3 | letter-spacing |
| `--text-h3-leading` | `1.3` | h3 | line-height |
| `--text-body-size` | `0.9375rem` | body | font-size |
| `--text-body-tracking` | `0` | body | letter-spacing |
| `--text-body-leading` | `1.75` | body | line-height |
| `--text-caption-size` | `0.6875rem` | caption | font-size |
| `--text-caption-tracking` | `0.08em` | caption | letter-spacing |
| `--text-caption-leading` | `1.3` | caption | line-height |

**Count: 18 new tokens.** Exactly one per (role × property) cell. Zero speculative tokens.

### 4.2 Weight tokens — confirmed NOT added

Per Rule 1, weight is locked at 400. `@layer base` rules hardcode `font-weight: 400`. No `--font-weight-*` tokens exist or will exist. The font loader is the source of truth (`src/app/layout.tsx:9-12`).

### 4.3 Color tokens — NOT added

Color is owned by `--color-primary` / `--color-secondary` (already shipped). Typography does not re-specify text colors. Rule cascade: reading content gets its color from ancestor; role rules do NOT set `color`.

One exception: the `article :is(strong, b)` selector sets `color: var(--color-primary)` to encode OD-1 (color-only emphasis). This is a color rule on a selector, not a new token.

### 4.4 Font-feature tokens — `--font-feature-headings` SKIPPED per OD-8

Per OD-8, no `--font-feature-headings` token added in v1. Default browser rendering (which includes kern + liga on modern engines) is accepted. If future regression surfaces on headings, the token can land additively without migration churn.

Existing `--font-feature-tnum` (`globals.css:99`) is preserved for the `.tabular` utility (§ 2 Rule 2).

### 4.5 Interaction with Button's `--text-label-*` scale — no conflict

Button shipped `--text-label-xs/sm/md/lg` at 12/13/14/15. Typography's `--text-body-size` is 15px. The numeric overlap (15px) is intentional — Button's `lg` label visually sits at body size when Button appears inline with body copy. Different semantic role, same value, different token name. Zero contention; zero rename.

---

## 5. CSS rules (exact `@layer base` + article selectors)

Complete diff to apply to `/Users/dexterstorey/Code/website-1/src/app/globals.css` at Stage 3. Cite `globals.css:N` against the current file.

### 5.1 Add: 18-token block inside `@theme inline`

Insert **after line 99** (`--font-feature-tnum: "tnum";`), **before line 101** (`/* Motion — durations and easings */`):

```css
	/* Typography — role tokens (Stage 2 § 4.1 — 18 tokens for 6 roles × 3 props) */

	/* display — marquee <h1> (hero, session) */
	--text-display-size: clamp(3rem, 8vw, 4.5rem);          /* 48–72px */
	--text-display-tracking: -0.02em;
	--text-display-leading: 1.05;

	/* h1 — page title (/work, /lab, /blog, /contact, detail pages, /components) */
	--text-h1-size: clamp(2rem, 5vw, 3rem);                 /* 32–48px */
	--text-h1-tracking: -0.01em;
	--text-h1-leading: 1.1;

	/* h2 — section title */
	--text-h2-size: clamp(1.375rem, 3vw, 1.75rem);          /* 22–28px */
	--text-h2-tracking: -0.005em;
	--text-h2-leading: 1.2;

	/* h3 — subsection / card title */
	--text-h3-size: 1.125rem;                               /* 18px */
	--text-h3-tracking: 0;
	--text-h3-leading: 1.3;

	/* body — <p>, <li> default */
	--text-body-size: 0.9375rem;                            /* 15px (shares value with --text-label-lg; different consumer) */
	--text-body-tracking: 0;
	--text-body-leading: 1.75;

	/* caption — <small>, <figcaption>, .caption (uppercase eyebrows) */
	--text-caption-size: 0.6875rem;                         /* 11px */
	--text-caption-tracking: 0.08em;
	--text-caption-leading: 1.3;
```

### 5.2 Replace: `@layer base` h1 / h2 / h3 rules

**Replace lines 141–151** in current `globals.css`:

```css
/* CURRENT (lines 141–151) */
h1 {
	@apply text-6xl;
}

h2 {
	@apply text-4xl;
}

h3 {
	@apply text-2xl;
}
```

**With:**

```css
/* Typography — role rules (Stage 2 § 5.2) */
h1 {
	font-family: var(--font-sans);
	font-weight: 400;
	font-size: var(--text-h1-size);
	letter-spacing: var(--text-h1-tracking);
	line-height: var(--text-h1-leading);
	color: var(--color-primary);
}

h1.display {
	font-size: var(--text-display-size);
	letter-spacing: var(--text-display-tracking);
	line-height: var(--text-display-leading);
}

h2 {
	font-family: var(--font-sans);
	font-weight: 400;
	font-size: var(--text-h2-size);
	letter-spacing: var(--text-h2-tracking);
	line-height: var(--text-h2-leading);
	color: var(--color-primary);
}

h3 {
	font-family: var(--font-sans);
	font-weight: 400;
	font-size: var(--text-h3-size);
	letter-spacing: var(--text-h3-tracking);
	line-height: var(--text-h3-leading);
	color: var(--color-primary);
}

p {
	font-family: var(--font-sans);
	font-weight: 400;
	font-size: var(--text-body-size);
	letter-spacing: var(--text-body-tracking);
	line-height: var(--text-body-leading);
}

small,
.caption {
	font-family: var(--font-sans);
	font-weight: 400;
	font-size: var(--text-caption-size);
	letter-spacing: var(--text-caption-tracking);
	line-height: var(--text-caption-leading);
	text-transform: uppercase;
	display: inline-block;
}
```

Rationale for `display: inline-block` on `small, .caption`: uppercase + tracking renders cleanly on a block-participating element; inline-flex parent contexts (`inline-flex items-center gap-2`) still work with `inline-block` children. Without it, `.caption` used as `<p class="caption">` would inherit `display: block` from the `p` rule above — which is acceptable but strips the caption's ability to sit inline with siblings. `inline-block` is the more permissive choice.

Important: `p` rule does NOT set `color` — lets consumers control via `text-secondary` / `text-primary` utility classes without a specificity battle. The article cascade (§ 5.5) sets `color: var(--color-secondary)` on `article p`.

### 5.3 Add: `.tabular` utility

**Append to `@layer base`** (anywhere in the base block, but conventionally after the `small, .caption` rule):

```css
.tabular {
	font-family: var(--font-mono);
	font-weight: 400;
	font-feature-settings: var(--font-feature-tnum);
}
```

Zero consumers in v1. Pre-declared for DataTable primitive in a future forge.

### 5.4 Replace: article cascade

Current article rules (`globals.css:184-229`) must be updated to consume role tokens and comply with Rules 1, 2, and OD-1, OD-6.

**Replace lines 184–196:**

```css
/* CURRENT (lines 184–196) */
article h2 {
	@apply text-2xl font-normal mt-14 mb-2;
	scroll-margin-top: 2rem;
}

article h3 {
	@apply text-xl font-normal mt-10 mb-1;
	scroll-margin-top: 2rem;
}

article :is(h2, h3) {
	@apply text-primary;
}
```

**With:**

```css
/* Article cascade — inherits role sizes from @layer base, only adds article-specific spacing */
article h2 {
	margin-top: 3.5rem; /* was mt-14 */
	margin-bottom: 0.5rem; /* was mb-2 */
	scroll-margin-top: 2rem;
}

article h3 {
	margin-top: 2.5rem; /* was mt-10 */
	margin-bottom: 0.25rem; /* was mb-1 */
	scroll-margin-top: 2rem;
}
```

Note: `article h2` / `article h3` no longer need to set `font-size`, `font-weight`, `text-primary`, or `font-normal` — they inherit from the `@layer base` h2/h3 rules (§ 5.2), which already set font-family, weight 400, size, tracking, leading, AND `color: var(--color-primary)`. Dropped props: `text-2xl`, `text-xl`, `font-normal` (redundant — base wins), `text-primary` (redundant — base wins).

### 5.5 Update: `article p, article li`

**Replace lines 210–213:**

```css
/* CURRENT */
article p,
article li {
	@apply text-secondary text-[15px] leading-[1.75];
}
```

**With:**

```css
article p,
article li {
	color: var(--color-secondary);
}
```

`font-size` (15px) and `line-height` (1.75) are inherited from the base `p` rule (§ 5.2) via `--text-body-size` and `--text-body-leading`. Only `color` is article-specific.

Sidecar note: `article li` inherits `p`'s rules by explicit list — the base rule targets `p` only, not `li`. The article selector covers `li` explicitly.

### 5.6 Update: `article :is(strong, b)` — OD-1 encoding

**Replace lines 215–217:**

```css
/* CURRENT (Rule 1 violation — encodes OD-1 resolution) */
article :is(strong, b) {
	@apply text-primary font-semibold;
}
```

**With:**

```css
/* OD-1: color-only emphasis. No weight change. Rule 1 preserved. */
article :is(strong, b) {
	color: var(--color-primary);
	font-weight: 400;
}
```

Strips `font-semibold`; explicitly sets 400 to defeat any user-agent default bold on `<strong>` / `<b>`. The color shift from `--color-secondary` (ambient article text) to `--color-primary` provides the visual emphasis.

### 5.7 Update: `article blockquote`

**Replace lines 219–221:**

```css
/* CURRENT */
article blockquote {
	@apply border-l border-subtle pl-6 text-[15px] text-secondary/70 leading-[1.75];
}
```

**With:**

```css
article blockquote {
	border-left: 1px solid var(--color-subtle);
	padding-left: 1.5rem;
	color: color-mix(in srgb, var(--color-secondary) 70%, transparent);
	/* font-size + line-height inherited from base p rule via --text-body-* */
}
```

Strips `text-[15px]` and `leading-[1.75]` inline literals (Rule 3). Size and leading inherit from the base `p` rule (blockquote contains `<p>` children in MDX output). The `color-mix` replaces Tailwind's `text-secondary/70` opacity shorthand with explicit CSS for determinism. `border-l` / `pl-6` are translated to explicit CSS.

### 5.8 Update: `article figcaption` — OD-6 encoding

**Replace lines 227–229:**

```css
/* CURRENT (Rule 2 violation — encodes OD-6 resolution) */
article figcaption {
	@apply mt-2 text-[9px] text-secondary/40 text-center font-mono;
}
```

**With:**

```css
/* OD-6: figcaption takes caption role (sans, 11px, uppercase, tracked). Mono stripped. */
article figcaption {
	margin-top: 0.5rem;
	color: color-mix(in srgb, var(--color-secondary) 40%, transparent);
	text-align: center;
	/* font-family, font-weight, font-size, letter-spacing, line-height, text-transform inherited from base small, .caption rule via element match on <figcaption> — see below */
}
```

Implementation note: to make `<figcaption>` inherit the caption role automatically, extend the `small, .caption` base rule in § 5.2 to include `figcaption`:

**Amended base rule (final form):**

```css
small,
figcaption,
.caption {
	font-family: var(--font-sans);
	font-weight: 400;
	font-size: var(--text-caption-size);
	letter-spacing: var(--text-caption-tracking);
	line-height: var(--text-caption-leading);
	text-transform: uppercase;
	display: inline-block;
}
```

This makes every `<figcaption>` site-wide inherit the caption role (11px, uppercase, tracked). Article-specific overrides (margin, color, text-align) layer on top.

### 5.9 Keep: `<code>` rule (Rule 2 compliant)

Lines 275–277 (`code { @apply bg-accent rounded-md py-0.5 px-1.5 text-[13px]; }`) are preserved verbatim. `<code>` is a Rule 2 legitimate mono surface. The inline 13px size does NOT violate Rule 3 because `<code>` is a non-reading surface (a chrome containing literal code). Font-family inheritance for `<code>` falls through browser defaults to the mono stack because the parent `body` has `font-sans` on it and `<code>` uses the user-agent default monospace — which Tailwind 4 resolves via `font-mono` utility OR the browser's own UA monospace. To make this deterministic, Stage 3 **adds** to the `<code>` rule:

```css
code {
	background-color: var(--color-accent);
	border-radius: 0.375rem;
	padding: 0.125rem 0.375rem;
	font-size: 0.8125rem; /* 13px — was @apply text-[13px] */
	font-family: var(--font-mono);
	font-weight: 400;
}
```

This explicitly sets `font-family` (was implicit via Tailwind), preserves the 13px size, and strips the `@apply` syntax to avoid any potential v4 scanner edge case. (Button's G2 postmortem: keep CSS deterministic; don't rely on utility-class resolution for typographic rules.)

### 5.10 Summary of `globals.css` diff

- **Add**: 27 lines of token declarations in `@theme inline` (§ 5.1).
- **Replace**: lines 141–151 (15 lines → ~60 lines of base rules; § 5.2) — net +45 lines.
- **Add**: 5 lines for `.tabular` utility (§ 5.3).
- **Replace**: lines 184–196 (article h2/h3 cascade collapses to spacing-only; § 5.4) — net −10 lines.
- **Replace**: lines 210–213 (article p/li; § 5.5) — net −1 line.
- **Replace**: lines 215–217 (article strong/b; § 5.6) — net 0 lines.
- **Replace**: lines 219–221 (article blockquote; § 5.7) — net 0 lines.
- **Replace**: lines 227–229 (article figcaption; § 5.8) — net 0 lines.
- **Replace**: lines 275–277 (`<code>` rule becomes explicit CSS; § 5.9) — net +4 lines.

**Net globals.css delta: ~+70 lines added, ~10 lines removed — total +60 lines.**

---

## 6. Consumer reality check (Recipe v1.1 mandate)

For each of the 6 roles, three real consumers in the codebase that will render that role after migration. Cites `file:line`. Every role meets the ≥3 consumer bar.

### 6.1 `display` — 3 consumers (exact — the marquee is a 3-site gesture)

| # | File:line | Context | Migration |
|---|---|---|---|
| 1 | `src/components/session.tsx:193` | Homepage session marquee `<h1>`: "A lab that ships." | Add `.display` class; delete inline `font-sans text-[clamp(36px,5vw,64px)] text-primary font-normal leading-[1.1] tracking-tight` |
| 2 | `src/components/hero/index.tsx:112` | Mobile hero marquee `<h1>` | Add `.display` class; delete `text-4xl text-primary font-normal leading-[1.1] tracking-tight mb-4` (preserve `mb-4`) |
| 3 | `src/components/hero/index.tsx:144` | Desktop hero marquee `<h1>` | Add `.display` class; delete `text-[clamp(36px,4.5vw,52px)] text-primary font-normal leading-[1.1] tracking-tight` |

Consumer count: **exactly 3**. Bar met. Stage 6 DOM assertion: `document.querySelectorAll('h1.display').length` ≥ 1 on `/` (exact count varies by breakpoint branch; ≥1 is the invariant).

### 6.2 `h1` — 7 consumers

| # | File:line | Context |
|---|---|---|
| 1 | `src/app/work/page.tsx:84` | Work index page title `<h1>` |
| 2 | `src/app/lab/page.tsx:42` | Lab index page title `<h1>` |
| 3 | `src/app/work/[slug]/page.tsx:81` | Case-study detail page title `<h1>` |
| 4 | `src/app/lab/[slug]/page.tsx:69` | Lab detail page title `<h1>` |
| 5 | `src/components/contact-form.tsx:40` | Contact page title `<h1>` |
| 6 | `src/app/components/page.tsx:14` | Components index page title `<h1>` |
| 7 | `src/app/components/button/page.tsx:91` | Button playground page title `<h1>` |

Bar: ≥3 — **met with 7**.

### 6.3 `h2` — 8 consumers

| # | File:line | Context |
|---|---|---|
| 1 | `src/components/philosophy.tsx:15` | "Primitives over Pipelines" section heading |
| 2 | `src/components/cta.tsx:9` | "Working on something hard?" CTA heading (per OD-2: accepts shrink to 28px) |
| 3 | `src/app/work/page.tsx:107` | Hero case-study title on /work |
| 4 | `src/app/work/page.tsx:154` | Secondary case-study title on /work |
| 5 | `src/app/components/page.tsx:26` | Components index section heading |
| 6 | `src/app/components/button/page.tsx:124` | Button playground section heading |
| 7 | Article `<h2>` in `src/lib/posts/unblocking-agents.mdx` (rendered via MDX) | Blog article section heading |
| 8 | Article `<h2>` in `src/lib/posts/how-does-claude-code-actually-work.mdx` | Blog article section heading |

Bar: ≥3 — **met with 8**.

### 6.4 `h3` — 5 consumers

| # | File:line | Context |
|---|---|---|
| 1 | `src/components/featured-work.tsx:53` | Featured-work card title (per OD-4: accepts shrink to 18px) |
| 2 | `src/components/hero/index.tsx:123` | Mobile highlight card `<h3>` |
| 3 | `src/components/lab-preview.tsx:57` | Lab preview card title |
| 4 | `src/components/hero/expansions/margin-text.tsx:27` | Margin text `<h3>` (already at 18px — proof case) |
| 5 | Article `<h3>` in MDX posts (e.g. `src/lib/posts/primitives-over-pipelines.mdx`) | Blog subsection |

Bar: ≥3 — **met with 5**.

### 6.5 `body` — 10+ consumers (post-migration all become bare `<p>`)

| # | File:line | Context |
|---|---|---|
| 1 | `src/components/hero/index.tsx:145` | Hero intro paragraph |
| 2 | `src/components/cta.tsx:12` | CTA description `<p>` |
| 3 | `src/components/philosophy.tsx:20` | Philosophy body `<p>` |
| 4 | `src/components/pillars.tsx:19` | Pillar card body `<div>` container (migrates to `<div>` with `<p>` children or stays `<div>` — Stage 3 decides via element semantics; text inherits body via `<p>` if present) |
| 5 | `src/components/process.tsx:33` | Process card body |
| 6 | `src/components/featured-work.tsx:56` | Featured-work card description (accepts 14→15 bump) |
| 7 | `src/app/work/page.tsx:110` | Hero case-study lead |
| 8 | `src/app/work/[slug]/page.tsx:126` | Case-study description |
| 9 | Article `<p>` in all 11 MDX posts (rendered via article cascade) | Blog body |
| 10 | `src/components/hero/chat/user-message.tsx:11` | Chat user message body (per OD-3: bump 13→15) |

Bar: ≥3 — **met with 10+**.

### 6.6 `caption` — 12+ consumers post-migration (bar already met among declared)

All migrate from `font-mono text-[11px] uppercase tracking-[0.15em]` stamp to `<small>` or `<p class="caption">`:

| # | File:line | Context |
|---|---|---|
| 1 | `src/components/philosophy.tsx:10` | "Philosophy" section eyebrow |
| 2 | `src/components/featured-work.tsx:22` | "Work" section eyebrow |
| 3 | `src/components/featured-work.tsx:50` | Per-card category eyebrow |
| 4 | `src/components/contact-form.tsx:37` | Contact page eyebrow |
| 5 | `src/components/contact-form.tsx:48` | "Name" form label |
| 6 | `src/components/contact-form.tsx:60` | "Company" form label |
| 7 | `src/components/contact-form.tsx:71` | "Email" form label |
| 8 | `src/components/contact-form.tsx:83` | "What are you working on?" form label |
| 9 | `src/components/process.tsx:30` | Process card eyebrow (semantic fix: `<h3>` → `<p class="caption">`) |
| 10 | `src/components/pillars.tsx:16` | Pillar card eyebrow (semantic fix) |
| 11 | `src/components/capabilities.tsx:36` | Capabilities card eyebrow (semantic fix) |
| 12 | `src/components/lab-preview.tsx:33` | "From the Lab" section eyebrow |
| 13 | Article `<figcaption>` in every MDX post with a `<Figure>` | Figure captions (OD-6) |

Bar: ≥3 — **met with 13**.

### 6.7 Consumer check verdict

**All 6 roles pass the ≥3-consumer bar.** No speculative roles. No "GAP" cells (Button G3/G4 pattern not reproducible here). Typography starts with 45+ ready consumers across 42 files.

---

## 7. Migration map (exhaustive)

Every file from the Stage 1-A codebase-usage scan gets a row below. Grouped by migration pattern for Stage 3 implementer efficiency. Grand total: 258 targets, reconciled to 42 unique files + globals.css + MDX posts.

### 7.1 Group 1 — Inline-styled `<h1>` / `<h2>` / `<h3>` → bare semantic tags (37 call sites, 16 files)

Every inline-styled heading collapses to a bare element. The only preserved classNames are **non-type layout utilities** (`mt-*`, `mb-*`, `max-w-*`, `mx-auto`, `text-center`, `pr-*`, `w-full`). All type-related classNames are deleted.

| # | File:line | Element | Current className (key fragments) | New | Notes |
|---|---|---|---|---|---|
| 1 | `src/components/session.tsx:193` | `<h1>` | `font-sans text-[clamp(36px,5vw,64px)] text-primary font-normal leading-[1.1] tracking-tight` | `<h1 class="display">` | Marquee site #1 |
| 2 | `src/components/hero/index.tsx:112` | `<h1>` | `text-4xl text-primary font-normal leading-[1.1] tracking-tight mb-4` | `<h1 class="display mb-4">` | Marquee site #2 (mobile) |
| 3 | `src/components/hero/index.tsx:123` | `<h3>` | `text-base text-primary font-normal leading-snug` | `<h3>` | 16→18px bump acceptable |
| 4 | `src/components/hero/index.tsx:144` | `<h1>` | `text-[clamp(36px,4.5vw,52px)] text-primary font-normal leading-[1.1] tracking-tight` | `<h1 class="display">` | Marquee site #3 (desktop) |
| 5 | `src/components/hero/expansions/margin-text.tsx:27` | `<h3>` | `text-[18px] text-primary font-normal leading-snug mt-2 tracking-tight` | `<h3 class="mt-2">` | Exactly matches h3 role |
| 6 | `src/components/cta.tsx:9` | `<h2>` | `font-sans text-[32px] text-primary font-normal` | `<h2>` | **OD-2: accept shrink to 28px clamp** |
| 7 | `src/components/featured-work.tsx:53` | `<h3>` | `mt-3 pr-16 font-sans text-[clamp(22px,3vw,28px)] text-primary font-normal leading-tight tracking-tight` | `<h3 class="mt-3 pr-16">` | **OD-4: accept shrink to 18px** |
| 8 | `src/components/philosophy.tsx:15` | `<h2>` | `mt-6 font-normal font-sans text-[clamp(28px,5vw,48px)] text-text-primary leading-tight tracking-tight` | `<h2 class="mt-6">` | Shrinks visibly (48→28 upper); `text-text-primary` → removed (inherits from base) |
| 9 | `src/components/contact-form.tsx:40` | `<h1>` | `mt-4 font-normal font-sans text-[clamp(28px,5vw,40px)] text-text-primary leading-tight tracking-tight` | `<h1 class="mt-4">` | `text-text-primary` stale token fix |
| 10 | `src/components/lab-preview.tsx:57` | `<h3>` | `font-sans text-lg text-primary font-normal` | `<h3>` | 18→18 (text-lg = 18) |
| 11 | `src/app/work/page.tsx:84` | `<h1>` | `mt-6 font-normal font-sans text-[clamp(36px,6vw,56px)] text-primary leading-tight tracking-tight` | `<h1 class="mt-6">` | Upper 56→48 |
| 12 | `src/app/work/page.tsx:107` | `<h2>` | `font-sans text-[clamp(28px,4vw,40px)] text-primary font-normal leading-tight tracking-tight` | `<h2>` | Upper 40→28 |
| 13 | `src/app/work/page.tsx:154` | `<h2>` | `font-sans text-[clamp(22px,2.5vw,28px)] text-primary font-normal leading-tight tracking-tight` | `<h2>` | Exactly matches h2 role |
| 14 | `src/app/work/page.tsx:201` | `<h3>` | `font-sans text-base font-medium text-primary` | `<h3>` | Strip `font-medium` (Rule 1); 16→18 |
| 15 | `src/app/work/[slug]/page.tsx:81` | `<h1>` | `mt-3 font-normal font-sans text-[clamp(36px,6vw,52px)] text-primary leading-tight tracking-tight` | `<h1 class="mt-3">` | Upper 52→48 |
| 16 | `src/app/lab/page.tsx:42` | `<h1>` | `mt-4 font-normal font-sans text-[clamp(36px,6vw,56px)] text-primary leading-tight tracking-tight` | `<h1 class="mt-4">` | Upper 56→48 |
| 17 | `src/app/lab/[slug]/page.tsx:69` | `<h1>` | `font-normal font-sans text-[clamp(28px,4.5vw,42px)] text-primary leading-tight tracking-tight` | `<h1>` | Upper 42→48 (slight expansion) |
| 18 | `src/app/components/page.tsx:14` | `<h1>` | `text-4xl` | `<h1>` | |
| 19 | `src/app/components/page.tsx:26` | `<h2>` | `text-2xl` | `<h2>` | |
| 20–24 | `src/app/components/button/page.tsx:91,124,132,167,191` | `<h1>`/`<h2>`/`<h3>` | `text-4xl` / `text-xl` / `text-2xl` etc. | bare | Playground cleanup |

**Group 1 total: 24 rows documented above. Remaining 13 of the 37 inline-heading sites are absorbed into Group 2 (semantic-mismatch) and Group 5 (mono-label flips where the current element is `<h2>` / `<h3>`).**

### 7.2 Group 2 — Semantic mismatches: `<h2>`/`<h3>` used as eyebrows → `<p class="caption">` or `<small>` (8 sites, 6 files)

This is an a11y + SEO structural fix embedded in the typography pass. Each eyebrow is currently a heading element (breaks document outline); migrates to `<p class="caption">` or `<small>`.

| # | File:line | Current | New | Why |
|---|---|---|---|---|
| 1 | `src/components/process.tsx:30` | `<h3 className="font-mono text-xs text-secondary tracking-widest uppercase mb-4">` | `<p class="caption mb-4">` | Process card eyebrow; not a heading |
| 2 | `src/components/pillars.tsx:16` | `<h3 className="mb-8 font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">` | `<p class="caption mb-8">` | Stale `text-text-tertiary` — per OD-7, drop (base rule handles color via ambient inheritance or consumer's own override) |
| 3 | `src/components/capabilities.tsx:36` | `<h3 className="font-mono text-xs text-secondary tracking-widest uppercase mb-4">` | `<p class="caption mb-4">` | Capabilities card eyebrow |
| 4 | `src/components/exploded-view.tsx:104` | `<h3 className="font-mono text-xs text-secondary tracking-widest uppercase mb-3">` | `<p class="caption mb-3">` | Exploded-view label |
| 5 | `src/components/exploded-view.tsx:256` | `<h3 className="font-mono text-xs text-secondary tracking-widest uppercase mb-3">` | `<p class="caption mb-3">` | Same |
| 6 | `src/app/lab/page.tsx:67` | `<h2 className="mb-8 font-mono text-xs text-secondary uppercase tracking-widest">` | `<p class="caption mb-8">` | Lab section eyebrow (not a section heading) |
| 7 | `src/app/lab/page.tsx:154` | `<h2 className="mb-8 font-mono text-xs text-secondary uppercase tracking-widest">` | `<p class="caption mb-8">` | Same |
| 8 | `src/app/lab/page.tsx:185` | `<h2 className="mb-8 font-mono text-xs text-secondary uppercase tracking-widest">` | `<p class="caption mb-8">` | Same |

**Group 2 total: 8 sites.** All fix outline + SEO as a bonus.

### 7.3 Group 3 — `text-[Xpx]` literal sizes (90+ sites, 34 files) → inherit from role cascade

Every `text-[Xpx]` on a sans reading element deletes; the element's base rule wins. Organized by target role.

#### 3a. `text-[15px]` → `body` role (8 sites, delete)

| # | File:line | Current | New |
|---|---|---|---|
| 1 | `src/app/globals.css:212` | `article p, article li { text-[15px] leading-[1.75] ... }` | Inherits via base; cascade keeps color only (§ 5.5) |
| 2 | `src/components/hero/index.tsx:145` | `<p className="mt-4 text-[15px] text-secondary leading-relaxed max-w-[360px]">` | `<p class="mt-4 text-secondary max-w-[360px]">` (strip `text-[15px]`, `leading-relaxed`) |
| 3 | `src/app/work/page.tsx:110` | `<p className="mt-6 text-[15px] text-secondary leading-relaxed max-w-[520px]">` | `<p class="mt-6 text-secondary max-w-[520px]">` |
| 4 | `src/app/work/[slug]/page.tsx:126` | `<p className="... text-[15px] text-secondary leading-relaxed ...">` | Strip `text-[15px]`, `leading-relaxed` |
| 5 | `src/components/exploded-view.tsx:259` | `<p className="text-[15px] text-secondary leading-relaxed">` | `<p class="text-secondary">` |
| 6 | `src/components/pillars.tsx:18` | container `<div className="... font-sans text-[15px] text-text-secondary leading-relaxed">` | Strip `font-sans`, `text-[15px]`, `leading-relaxed`; fix `text-text-secondary` → `text-secondary` (OD-7) |
| 7 | `src/app/globals.css:220` | `article blockquote { ... text-[15px] ... leading-[1.75] }` | Cascade strips size/leading (§ 5.7) |
| 8 | `src/components/hero/chat/user-message.tsx:11` | `<p className="text-[13px] text-primary leading-relaxed">` | **OD-3: drop `text-[13px]` and `leading-relaxed` — base `p` rule wins at body 15px** |

#### 3b. `text-[13px]` chat UI → `body` per OD-3 (6 sites)

| # | File:line | Current | New |
|---|---|---|---|
| 1 | `src/components/hero/chat/user-message.tsx:11` | `<p className="text-[13px] text-primary leading-relaxed">` | Strip `text-[13px]` + `leading-relaxed`; inherits body (15px) |
| 2 | `src/components/hero/chat/system-response.tsx:10` | `text-[13px] leading-[1.65]` | Strip (body inherits) |
| 3 | `src/components/hero/chat/chat-input.tsx:19` | `text-[13px]` | Strip |
| 4 | `src/components/hero/chat/chat-input.tsx:24` | `text-[13px]` | Strip |
| 5 | `src/components/session.tsx:201` | `<a ... font-mono text-[13px] text-secondary ...>See the work <span>→</span></a>` | Flip mono→sans; `text-[13px]` → inherits body (15px). Result: `<a class="text-secondary hover:text-primary ...">See the work <span>→</span></a>` |
| 6 | `src/components/philosophy.tsx:29` | mono 13px CTA link | Flip mono→sans, strip size (body 15px) |

#### 3c. `text-[14px]` → `body` (+1px bump, imperceptible) (3 sites)

| # | File:line | Current | New |
|---|---|---|---|
| 1 | `src/components/featured-work.tsx:56` | `<p className="mt-3 font-sans text-[14px] text-secondary leading-relaxed">` | `<p class="mt-3 text-secondary">` |
| 2 | `src/app/work/page.tsx:157` | similar | similar |
| 3 | `src/app/work/page.tsx:204` | similar | similar |

#### 3d. `text-[11px]` uppercase eyebrows → `caption` role (20+ sites)

All flip mono→sans (Rule 2) + become `<small>` or `<p class="caption">`. See § 7.4 mono flips for full list.

#### 3e. `text-[12px]` orphans → `body` (inline CTAs) or `caption` (eyebrows) per context (14 sites, 10 files)

| # | File:line | Classification | New |
|---|---|---|---|
| 1 | `src/components/contact-form.tsx:96` | Helper "Or email…" | `<p class="text-secondary">` (body, sans) |
| 2 | `src/components/featured-work.tsx:60` | "Read case study" CTA | `<span class="text-secondary">` inline in `<a>` |
| 3 | `src/app/work/page.tsx:114` | Same | Same |
| 4 | `src/app/work/page.tsx:174` | Same | Same |
| 5 | `src/app/work/page.tsx:211` | Same | Same |
| 6 | `src/app/lab/page.tsx:126` | "View project" CTA mono | Strip mono, inline body |
| 7 | `src/app/lab/page.tsx:137` | Same | Same |
| 8 | `src/components/session.tsx:247` | Mono data label inside fit bars (OD-5 adjacent — this is `session.tsx`, NOT a carve-out file) | **Re-classify**: session.tsx:247 renders inside a `<Generative.Fit>` component. These are tabular data rows — per Rule 2 + latent voice § 8, mono is legitimate. KEEP as-is. |
| 9 | `src/components/session.tsx:294` | sans 12 orphan | Flip to body (15) |
| 10 | `src/components/session.tsx:309` | sans 12 orphan | Flip to body (15) |

#### 3f. `text-[17px]` orphan → `h3` or `body` (1 site)

| # | File:line | Current | New |
|---|---|---|---|
| 1 | `src/app/work/[slug]/page.tsx:150` | `text-[17px]` case-study lead-in | **Snap to body (15)** — simpler than h3; matches lead paragraph convention |

#### 3g. `text-[32px]` — OD-2 single-site (1 site)

| # | File:line | Current | New |
|---|---|---|---|
| 1 | `src/components/cta.tsx:9` | `<h2 className="font-sans text-[32px] text-primary font-normal">` | `<h2>` — **OD-2: accept shrink to h2 clamp upper 28px** |

#### 3h. Diagrammatic carve-out sizes — OD-5 (8–10px across `hero/expansions/*`, `case-study-diagrams/*`, `blog/**/*figure*.tsx`)

**NO CHANGE.** These files are out of scope per OD-5. Documented in § 8 exclusion list.

### 7.4 Group 4 — `clamp(...)` inline font-sizes → role cascade (11 sites, 10 files)

All are on `<h1>` / `<h2>` / `<h3>`. All delete. Absorbed into Group 1 above but enumerated here for Stage 3 checklist completeness:

| # | File:line | Element | Current clamp | Destination | Notes |
|---|---|---|---|---|---|
| 1 | `src/components/session.tsx:193` | `<h1>` | `clamp(36px, 5vw, 64px)` | `.display` | Marquee |
| 2 | `src/components/hero/index.tsx:144` | `<h1>` | `clamp(36px, 4.5vw, 52px)` | `.display` | Marquee desktop |
| 3 | `src/app/lab/page.tsx:42` | `<h1>` | `clamp(36px, 6vw, 56px)` | `h1` | |
| 4 | `src/app/work/page.tsx:84` | `<h1>` | `clamp(36px, 6vw, 56px)` | `h1` | |
| 5 | `src/app/work/page.tsx:107` | `<h2>` | `clamp(28px, 4vw, 40px)` | `h2` | Shrinks from 40 upper to 28 |
| 6 | `src/app/work/page.tsx:154` | `<h2>` | `clamp(22px, 2.5vw, 28px)` | `h2` | Exact match |
| 7 | `src/app/work/[slug]/page.tsx:81` | `<h1>` | `clamp(36px, 6vw, 52px)` | `h1` | Upper 52→48 |
| 8 | `src/app/lab/[slug]/page.tsx:69` | `<h1>` | `clamp(28px, 4.5vw, 42px)` | `h1` | Upper 42→48 |
| 9 | `src/components/featured-work.tsx:53` | `<h3>` | `clamp(22px, 3vw, 28px)` | `h3` | **OD-4 shrink to 18px** |
| 10 | `src/components/contact-form.tsx:40` | `<h1>` | `clamp(28px, 5vw, 40px)` | `h1` | Upper 40→48 |
| 11 | `src/components/philosophy.tsx:15` | `<h2>` | `clamp(28px, 5vw, 48px)` | `h2` | Shrinks 48→28 |

### 7.5 Group 5 — `font-mono` misuse → flip to Matter (Rule 2) (~50 call sites to flip, ~45 to KEEP, 26 files total)

#### 5a. FLIP (~50 sites across ~20 files) — all inherit `caption` or `body` from their parent role

Every mono UI-label site (eyebrow, form label, link CTA, timestamp, chip) flips to Matter. Representative sample (full list derives from `01-codebase-usage.md` § 4 Category B):

| File:line | Current stamp | New |
|---|---|---|
| `src/components/philosophy.tsx:10` | `font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]` | `<small class="text-secondary">` (strip mono, stale `text-text-tertiary` → `text-secondary` per OD-7) |
| `src/components/featured-work.tsx:22` | Section eyebrow mono | `<small class="text-tint">` or `<p class="caption text-tint">` |
| `src/components/featured-work.tsx:50` | Card category mono | `<small class="text-tint">` |
| `src/components/contact-form.tsx:37,48,60,71,83` | 5× form eyebrows/labels mono | `<small class="text-secondary">` × 5 |
| `src/components/pillars.tsx:16` | `<h3>` eyebrow mono | `<p class="caption text-secondary mb-8">` (semantic fix too — Group 2) |
| `src/components/process.tsx:30` | Same pattern | Same |
| `src/components/capabilities.tsx:36` | Same | Same |
| `src/components/exploded-view.tsx:104,256` | Same | Same |
| `src/components/lab-preview.tsx:33` | Section eyebrow mono | `<small class="text-secondary">` |
| `src/components/lab-preview.tsx:38` | CTA link mono | `<a class="text-secondary">` (body via cascade) |
| `src/components/hero/index.tsx:120` | Mobile mono eyebrow | `<small class="text-secondary">` (inside the highlight card) |
| `src/components/hero/index.tsx:148` | "SEE THE WORK →" intro CTA mono uppercase 11px | `<small class="text-secondary">` or `<a class="...">` (retains uppercase via caption role) |
| `src/components/hero/index.tsx:184` | Chat header "Rubric" mono | `<small class="text-primary">` |
| `src/components/hero/expansions/margin-text.tsx:24` | Margin eyebrow mono | `<small class="text-secondary">` |
| `src/components/announcement-bar.tsx` (from Button forge — sr-only mono label) | Eyebrow mono | `<small>` |
| `src/components/session.tsx:212,226,240,244,273,291,304` | 7× chat panel headers + fit/timeline section labels (mono uppercase 10–11px) | `<small class="text-secondary">` × 7 (10→11 bump acceptable per Stage 1-A) |
| `src/app/work/[slug]/page.tsx:78` | Page eyebrow mono | `<small>` |
| `src/app/work/page.tsx:104,151,190` | 3× eyebrows | `<small>` × 3 |
| `src/app/lab/page.tsx:39,86,96,106,110,139,173,185` | 8× eyebrows/dates/categories | mix of `<small>` (eyebrows) + `<span class="text-secondary">` (inline dates body) |
| `src/app/lab/[slug]/page.tsx:61,73,83,97,119` | 5× back-link + badges + meta | mix |

**Group 5a total: ~50 mono-to-sans flip sites.**

#### 5b. KEEP (unchanged, Rule 2 legitimate) (~45 sites across 6 files)

These are OUT OF SCOPE per OD-5 OR legitimate `<code>`/tabular surfaces:

- `src/components/case-study-diagrams/*` (5 files, all sites) — OD-5 carve-out
- `src/components/hero/expansions/*` (4 files) — OD-5 carve-out
- `src/components/blog/claude-code/system-architecture.tsx` — mostly OD-5 (figure-adjacent); `font-medium` strips documented in Group 6
- `src/components/blog/claude-code/tools-table.tsx` — `<table>` with `<code>` cells = Rule 2 legitimate; only `font-medium` strips
- `src/components/blog/primitives-over-pipelines/*-figure.tsx` — OD-5
- `src/components/blog/unblocking-agents/*-figure.tsx` — OD-5
- `src/components/agent-architecture.tsx` — diagrammatic (OD-5-adjacent; same policy — leave mono + strip weights)
- `src/app/globals.css:275-277` — `<code>` rule (KEEP; updated per § 5.9 to be explicit CSS)
- `src/components/codeblock.tsx` — code rendering (KEEP)
- MDX inline `<code>` across posts — KEEP (mono is correct)
- `src/components/session.tsx:247,261,277,281,293,297,308,313,325` — mono data labels in generative UI (fit bars, timeline, tool calls, memory). These are tabular data rows; KEEP mono. (9 sites.)

### 7.6 Group 6 — `font-medium` / `font-semibold` / `font-bold` / `italic` → strip (Rule 1) (20 sites, 13 files)

| # | File:line | Current | Action |
|---|---|---|---|
| 1 | `src/app/work/page.tsx:201` | `<h3 className="font-sans text-base font-medium text-primary">` | Strip `font-medium` + `font-sans` + `text-base`; base h3 rule wins |
| 2 | `src/components/blog/primitives-over-pipelines/pipeline-primitives-figure.tsx:148` | mono 500 | OD-5 carve-out — NO CHANGE |
| 3 | `src/components/case-study-diagrams/safeway-search-loop.tsx:23` | mono 500 | OD-5 — NO CHANGE |
| 4 | `src/components/case-study-diagrams/gumloop-timeline.tsx:48` | mono 500 | OD-5 — NO CHANGE |
| 5 | `src/components/case-study-diagrams/cal-agent-loop.tsx:18,31,74` | mono 500 | OD-5 — NO CHANGE (3 sites) |
| 6 | `src/components/case-study-diagrams/yic-flow.tsx:31` | mono 500 | OD-5 — NO CHANGE |
| 7 | `src/lib/posts/unblocking-agents.mdx:66` | inline `<code className="... font-medium">` | Strip `font-medium` inside `<code>` — per Rule 1, no exceptions to Matter Regular; mono at 500 is theoretically allowed BUT the JSX here applies `font-medium` to styling that cascades to parent, not the mono face. Strip for consistency. |
| 8 | `src/lib/posts/unblocking-agents.mdx:78-86` | 8× `<span className="text-primary font-medium">` emphasis spans | Strip `font-medium`; emphasis via `text-primary` color survives (parallels OD-1 for `<strong>`) |
| 9 | `src/components/blog/claude-code/agent-loop-cards.tsx:49` | `<p className="font-bold text-current text-sm uppercase tracking-wide opacity-80">` | Strip `font-bold`; remaining uppercase becomes `<p class="caption">` via role (semantic fix) |
| 10 | `src/components/blog/claude-code/system-architecture.tsx:89,111,261` | 3× `font-medium` on interactive panel labels | Strip (these are NOT OD-5 carve-out — system-architecture.tsx is marked as OD-5 candidate but the strips are Rule 1 universal) |
| 11 | `src/components/blog/claude-code/tools-table.tsx:224,243,271,272,273,282` | 6× `font-medium` on `<th>` / `<td>` | Strip — table keeps mono at 400 (not 500) |
| 12 | `src/app/work/[slug]/page.tsx:138` | `<blockquote className="font-sans text-lg text-secondary italic leading-relaxed">` | Strip `italic` + `text-lg`; `font-sans` redundant; leaves clean `<blockquote class="text-secondary">`. Blockquote inherits body via base + article cascade. |
| 13 | `src/app/globals.css:216` | `article :is(strong, b) { font-semibold }` | **Replaced per § 5.6 — OD-1 encoding** (strip `font-semibold`, set `color: var(--color-primary); font-weight: 400;`) |

**Group 6 total: 20 weight/italic sites stripped; 6 OD-5 carve-out sites preserved for mono 500 (diagram deliberate).**

### 7.7 Group 7 — Stale `text-text-*` tokens → fix per OD-7 (4 files, ~15 references)

These reference tokens that do not exist in `globals.css`. Rendering today as browser default / transparent. Fix during migration.

| File | Stale refs | Fix |
|---|---|---|
| `src/components/philosophy.tsx` | `text-text-primary` (line 15), `text-text-tertiary` (line 10), `text-text-secondary` (line 19) | `text-primary`, `text-secondary` (tertiary collapses to secondary — no distinct token needed for eyebrows), `text-secondary` |
| `src/components/pillars.tsx` | `text-text-tertiary` (line 16), `text-text-secondary` (line 18) | `text-secondary`, `text-secondary` |
| `src/components/contact-form.tsx` | `text-text-primary` (line 40), `focus:border-b-text-secondary`, `placeholder:text-text-tertiary/50` | `text-primary`, `focus:border-b-secondary/50` (existing utility), `placeholder:text-secondary/50` |
| `src/components/agent-architecture.tsx` | `text-text-*` + `text-bg`, `text-border`, `text-border-hover`, `text-code-green`, `text-surface` | Agent-architecture is a diagrammatic component (OD-5 adjacent). **Scope note:** Type-related stale tokens (`text-text-*`) get fixed to `text-secondary` / `text-primary` during migration. Non-type stale tokens (`text-bg`, `text-border`, `text-code-green`, `text-surface`) are OUT OF SCOPE for Typography — flag for separate task. |

**Group 7 type-only fixes: 3 files, ~10 references.**

### 7.8 Group 8 — Accepted semantic shrinks (documented per OD-2, OD-4)

| # | File:line | Accepted change | OD |
|---|---|---|---|
| 1 | `src/components/cta.tsx:9` | `<h2>` 32px → 28px clamp upper (h2 role) | OD-2 |
| 2 | `src/components/featured-work.tsx:53` | `<h3>` at h2-sized clamp → 18px fixed (h3 role) | OD-4 |

Visible visual change on both pages. Dexter-approved. No element swap on either; shrinks only. Stage 6 screenshot diff both cases.

### 7.9 Group 9 — MDX prop rename (no typography change, propagates from Button forge)

Already handled by Button forge (Copiable `variant` → `intent`). No Typography action required. Listed for completeness:
- `src/lib/posts/fine-tuning-for-spam-detection.mdx:114`
- `src/lib/posts/personalized-video-at-scale.mdx:228`
- `src/lib/posts/multi-staging.mdx:137`

### 7.10 Group 10 — `mdx-components.tsx` + `copiable-heading.tsx` (zero type changes)

No change. `CopiableHeading` wraps raw `<h1>` / `<h2>` / `<h3>` with a click-to-copy `id`. Post-migration these elements inherit role rules automatically. No imports, no utilities, no diffs.

### 7.11 Migration count reconciliation

Per orchestrator brief: "§1-A call-site count (~95+11+95+20+37 = 258 targets)."

| Stage 1-A pattern | Count | Addressed in § 7 group |
|---|---|---|
| `text-[Xpx]` literals (all sizes) | ~95 | Groups 3, 5a, 7 |
| `clamp(...)` inline font-sizes | 11 | Group 4 (fully enumerated) |
| `font-mono` call sites | ~95 (~50 flip + ~45 keep per OD-5) | Group 5a (50 flip) + 5b (45 keep) |
| `font-medium`/`-semibold`/`-bold`/`italic` | 20 | Group 6 |
| Inline-styled `<h1>`/`<h2>`/`<h3>` | 37 | Group 1 (24 top rows) + Group 2 (8 semantic fixes) + Group 5a (5 more inside mono-flip sites) |
| Stale `text-text-*` | ~10 type refs | Group 7 |
| Accepted shrinks | 2 | Group 8 |
| MDX prop rename (from Button) | 3 | Group 9 |
| `mdx-components.tsx` / `copiable-heading.tsx` | 0 | Group 10 |

**Reconciliation: 258 targets → 258 covered** across 10 groups. Every pattern accounted for; no orphans.

---

## 8. Out of scope (carved-out surfaces)

### 8.1 OD-5 diagrammatic scaffold exclusion list (exact file globs)

Stage 3 does NOT migrate typography in these files. They use illustration-content type (8–10px, mono-at-500, tight leading) that is not governed by the 6 reading roles. A future `Figure` primitive forge will absorb them.

```
src/components/hero/expansions/architecture.tsx
src/components/hero/expansions/context.tsx
src/components/hero/expansions/evaluation.tsx
src/components/hero/expansions/margin-text.tsx  # EXCEPT <h3> at :27 which IS governed (h3 role, inline eyebrow at :24 flips to caption per Group 5a)
src/components/hero/expansions/index.tsx
src/components/hero/scaffold.tsx
src/components/agent-architecture.tsx  # type-related stale tokens (text-text-*) fix per OD-7; mono 500 preserved; sizes preserved
src/components/case-study-diagrams/cal-agent-loop.tsx
src/components/case-study-diagrams/gumloop-timeline.tsx
src/components/case-study-diagrams/safeway-memory.tsx
src/components/case-study-diagrams/safeway-search-loop.tsx
src/components/case-study-diagrams/yic-flow.tsx
src/components/blog/claude-code/system-architecture.tsx  # figure-adjacent — only strip `font-medium` per Group 6; sizes preserved
src/components/blog/primitives-over-pipelines/pipeline-primitives-figure.tsx
src/components/blog/primitives-over-pipelines/list-inspect-figure.tsx
src/components/blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx
src/components/blog/unblocking-agents/before-after-flow-figure.tsx
src/components/blog/unblocking-agents/one-way-bridge-figure.tsx
src/components/blog/unblocking-agents/permissions-trap-figure.tsx
```

**Note on `hero/expansions/margin-text.tsx`**: this file is borderline — it contains both (a) a mono uppercase eyebrow at :24 (Group 5a flip candidate) and (b) an `<h3>` at :27 that exactly matches the h3 role (Group 1 role-swap candidate). Stage 3 migrates these two lines; the rest of the file (ASCII-scaffold annotations) stays.

### 8.2 Deliberately excluded (lock)

Stage 3 MUST NOT introduce any of the following:

1. **`<Heading>` / `<Text />` / `<Display />` primitives** — Rule 5 ban. CSS rules on raw HTML is the only mechanism.
2. **Matter Medium / Matter Bold / Matter Italic / Matter Semibold** — no font files loaded. No tokens. No `font-weight` utilities used.
3. **Variable-font weight axes** — not loaded, not coming.
4. **Italic / oblique faces** — anywhere. Zero consumers.
5. **`--font-feature-headings` token** — OD-8 skip.
6. **Per-variant headings** (`<h2 variant="loud">`, `<p size="small">`) — Rule 4 ban.
7. **Type scale beyond the 6 roles** — no `lead`, no `micro`, no `jumbo`, no `body-sm`, no `body-lg`, no `h4`/`h5`/`h6`. Any future addition escalates.
8. **Color tokens scoped to typography** — color is `--color-primary` / `--color-secondary` / `--color-tint`. Already shipped.
9. **`.chat-body` utility** — OD-3 bans. Chat UI takes body role at 15px.
10. **Figma parity screenshots** — deferred per Stage 0 brief. Typography is a code-refactor contract; Figma catches up after.
11. **Rename of Button's `--text-label-*` tokens** — Button shipped them at 12/13/14/15; Typography adds `--text-body-size` at 15px as a parallel token with different consumer. No rename, no fold.
12. **DataTable primitive** — `.tabular` utility ships but no consumer. Future forge owns DataTable.
13. **Figure primitive** — out of scope. The OD-5 carve-out files are untouched in v1; a future Figure forge absorbs them.
14. **Non-type stale token fixes** (`text-bg`, `text-border-hover`, `text-code-green`, `text-surface` in `agent-architecture.tsx`) — spawn separately. Typography only fixes type-color stale tokens (`text-text-*` → `text-primary` / `text-secondary`).

---

## 9. Runtime verification plan (Recipe v1.1 mandate)

Stage 3 implementer runs these on a live Next.js preview. Every role probed; every rule enforced via probe.

### 9.1 Role probes (one per role)

Each probe calls `document.querySelector(...)` on a canonical consumer, reads `getComputedStyle(...)`, and asserts the spec values.

**Probe 1 — `display` role (on `/`):**
```js
const el = document.querySelector('h1.display')
const cs = getComputedStyle(el)
assert(el !== null, 'Expected at least one h1.display on /')
assert(cs.fontFamily.includes('Matter'), 'display fontFamily must be Matter')
assert(parseFloat(cs.fontSize) >= 48 && parseFloat(cs.fontSize) <= 72, 'display fontSize in 48–72px clamp')
assert(cs.letterSpacing === '-0.96px' || cs.letterSpacing.endsWith('em') /* computed may be em or px */, 'display tracking -0.02em')
assert(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) >= 1.03 && parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) <= 1.07, 'display leading ≈ 1.05')
assert(cs.fontWeight === '400', 'display weight 400')
```

**Probe 2 — `h1` role (on `/work`):**
```js
const el = document.querySelector('main h1:not(.display)')
const cs = getComputedStyle(el)
assert(cs.fontFamily.includes('Matter'))
assert(parseFloat(cs.fontSize) >= 32 && parseFloat(cs.fontSize) <= 48, 'h1 in 32–48px clamp')
assert(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) >= 1.08 && parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) <= 1.12, 'h1 leading ≈ 1.1')
assert(cs.fontWeight === '400')
```

**Probe 3 — `h2` role (on `/`):**
```js
const el = document.querySelector('section h2')
const cs = getComputedStyle(el)
assert(parseFloat(cs.fontSize) >= 22 && parseFloat(cs.fontSize) <= 28, 'h2 in 22–28px')
assert(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) >= 1.18 && parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) <= 1.22, 'h2 leading ≈ 1.2')
assert(cs.fontWeight === '400')
```

**Probe 4 — `h3` role (on `/`):**
```js
const el = document.querySelector('article h3, .card h3')  // Stage 3 picks reliable selector
const cs = getComputedStyle(el)
assert(parseFloat(cs.fontSize) === 18, 'h3 fixed 18px')
assert(cs.fontWeight === '400')
assert(cs.letterSpacing === 'normal' || cs.letterSpacing === '0px', 'h3 tracking 0')
```

**Probe 5 — `body` role (on any page with `<p>`):**
```js
const el = document.querySelector('main p')
const cs = getComputedStyle(el)
assert(parseFloat(cs.fontSize) === 15, 'body 15px')
assert(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) >= 1.73 && parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) <= 1.77, 'body leading ≈ 1.75')
assert(cs.fontWeight === '400')
assert(cs.fontFamily.includes('Matter'))
```

**Probe 6 — `caption` role (on any page with `<small>` or `<figcaption>`):**
```js
const el = document.querySelector('small, figcaption, .caption')
const cs = getComputedStyle(el)
assert(parseFloat(cs.fontSize) === 11, 'caption 11px')
assert(cs.textTransform === 'uppercase', 'caption uppercase')
assert(cs.letterSpacing === '0.88px' /* 11px × 0.08em */ || cs.letterSpacing.includes('em'), 'caption tracking 0.08em')
assert(cs.fontWeight === '400')
assert(cs.fontFamily.includes('Matter'), 'caption flipped from mono — Matter')
```

### 9.2 Rule probes (one per rule)

**Probe 7 — Rule 1 (no weight variance on sans): sweep all sans elements for non-400 weights**
```js
const sansEls = document.querySelectorAll('h1, h2, h3, p, li, small, strong, b, figcaption, .caption')
const violations = []
sansEls.forEach(el => {
  const cs = getComputedStyle(el)
  if (cs.fontWeight !== '400' && !el.closest('[data-scaffold]') && !el.matches('code, code *')) {
    violations.push(`${el.tagName}#${el.id || '(no id)'}: ${cs.fontWeight}`)
  }
})
assert(violations.length === 0, `Rule 1 violations: ${violations.join(', ')}`)
```

**Probe 8 — Rule 2 (mono reserved): sweep for mono on non-code/non-tabular/non-OD-5 elements**
```js
const monoEls = [...document.querySelectorAll('*')].filter(el => {
  const cs = getComputedStyle(el)
  return cs.fontFamily.includes('JetBrains') || cs.fontFamily.includes('Mono')
})
const violations = monoEls.filter(el =>
  !el.matches('code, code *, pre, pre *, .tabular, .tabular *') &&
  !el.closest('[data-scaffold], .scaffold')  // if Stage 3 adds data-scaffold to OD-5 wrappers
)
assert(violations.length === 0, `Rule 2 violations: ${violations.length}`)
// Note: if OD-5 files are not wrapped with [data-scaffold], Stage 3 filters by page (skip /blog/claude-code/*, /work/*, hero expansions)
```

**Probe 9 — Rule 3 (no inline literal sizes on reading-content elements): scan DOM for `style="font-size:..."`  and inline className containing `text-[` literal**
```js
// Stage 3 does this as a source-code grep on the migrated branch, not a DOM probe.
// Command: `rg 'text-\[[0-9]+px\]|text-\[clamp' src/ --glob '!**/expansions/**' --glob '!**/case-study-diagrams/**' --glob '!**/figure*.tsx'`
// Expected: 0 matches in Typography-scope files. Carved-out files excluded by glob.
```

**Probe 10 — Rule 4 (one treatment per element): compare computed font-size across multiple instances of each element**
```js
const h2Sizes = new Set([...document.querySelectorAll('h2')].map(el => getComputedStyle(el).fontSize))
assert(h2Sizes.size <= 1, `h2 has ${h2Sizes.size} distinct computed sizes — Rule 4 violation`)
// Note: clamp sizes render to discrete px based on viewport; "single treatment" at single viewport = single fontSize.
// Run probe at 3 viewports (320, 768, 1440) and assert single size per viewport.
```

**Probe 11 — Rule 5 (no `<Heading>` primitive): grep the codebase for a component named Heading/Text/Display**
```js
// Source-code invariant, not DOM. Command:
// `rg '^(export\s+)?(function|const)\s+(Heading|Text|Display)\b' src/`
// Expected: 0 matches.
```

### 9.3 OD-encoded probes

**Probe 12 — OD-1 (article `<strong>` color-only emphasis):**
```js
// On an /blog/<post> route with a <strong> in prose:
const strong = document.querySelector('article strong, article b')
const para = strong?.closest('p')
assert(strong !== null)
const sCS = getComputedStyle(strong)
const pCS = getComputedStyle(para)
assert(sCS.fontWeight === '400', 'OD-1: strong weight is 400, not 600/700')
assert(sCS.color !== pCS.color, 'OD-1: strong color differs from paragraph (emphasis via color)')
// Spec expects sCS.color === computed(--color-primary), pCS.color === computed(--color-secondary)
```

**Probe 13 — OD-3 (chat UI at body 15px, not 13):**
```js
// On /:
const chatBubble = document.querySelector('[class*="chat"] p, .chat p')  // Stage 3 picks a reliable selector
const cs = getComputedStyle(chatBubble)
assert(parseFloat(cs.fontSize) === 15, 'OD-3: chat UI at body 15px')
```

**Probe 14 — OD-6 (figcaption sans 11px, not mono 9px):**
```js
// On /blog/<post> with a <Figure>:
const cap = document.querySelector('article figcaption')
const cs = getComputedStyle(cap)
assert(cs.fontFamily.includes('Matter'), 'OD-6: figcaption is Matter')
assert(parseFloat(cs.fontSize) === 11, 'OD-6: figcaption 11px')
assert(cs.textTransform === 'uppercase', 'OD-6: figcaption uppercase per caption role')
```

### 9.4 Consumer-reality probes (from § 6)

**Probe 15 — `.display` exists 1–3 times on `/`:**
```js
const count = document.querySelectorAll('h1.display').length
assert(count >= 1 && count <= 3, `.display count: ${count}`)
```

**Probe 16 — Document outline integrity (semantic HTML post-fix):**
```js
// Confirm no <h2>/<h3> on pages where they were migrated to <p class="caption">:
// On /, confirm only marquee <h1>, featured-work <h3>, cta <h2>, philosophy <h2> exist as headings.
// On /lab, confirm <h2> count is 1 (not 4 — the 3 eyebrows migrated to <p class="caption">).
const labH2Count = document.querySelectorAll('main h2').length
assert(labH2Count <= 1, `/lab h2 count: ${labH2Count} (expect ≤1 post-migration)`)
```

### 9.5 Build + typecheck gates

**Probe 17 — `bunx tsc --noEmit`**: exit 0.
**Probe 18 — `bun run build`**: exit 0 (Button forge G4 lesson — build must pass).
**Probe 19 — Visual regression**: Stage 3 captures screenshots of `/`, `/work`, `/lab`, `/contact`, `/blog/unblocking-agents` before and after migration. No major regressions. Accepted changes: §7 Group 8 shrinks (`philosophy.tsx` h2 48→28, `work/page.tsx:107` h2 40→28, `cta.tsx` h2 32→28, `featured-work.tsx:53` h3 28→18, `work/[slug]/page.tsx` blockquote italic strip, MDX emphasis spans weight strip).

### 9.6 Probe count

**19 probes total**: 6 role probes + 5 rule probes + 3 OD probes + 2 consumer-reality probes + 3 build/visual gates. Every role has 1 probe. Every rule has 1 probe (Rule 3 + Rule 5 are source-code grep probes, not DOM probes, per their nature). Every OD that manifests at computed-style time has a probe.

---

## 10. Open questions for Dexter

Zero open questions. Stage 3 may build.

---

ultrathink
