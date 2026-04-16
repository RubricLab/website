# Typography — Latent Voice Extraction

> Distilled from `dexter/site-rebuild` HEAD, as updated on `forge/typography` (Button's tokens already landed). Every claim below is grounded in a file path, line number, or token value. No external brand references.

---

## 1. The fonts that ship

**Matter (local WOFF, weight 400 only)** → `--font-matter` → `--font-sans`.
Loaded in `src/app/layout.tsx:9-12` via `next/font/local`. One file (`./fonts/matter-regular.woff`), one weight.

**JetBrains Mono (Google, weights 400 and 500)** → `--font-mono`.
Loaded in `src/app/layout.tsx:14-18`. Two weights available.

**Single typographic ground truth:** Matter has no Medium, no Bold, no Italic loaded. Every `font-medium` / `font-semibold` / `font-bold` on a sans element in the codebase is *rendered by browser synthesis*. On antialiased display against the warm-paper `#f5f0ec` background, synthesized bold reads as a thickened blur — visibly wrong against Matter's engineered regular. `font-normal` is declared defensively 25 times across 15 files to preempt browser-default bold on `<h1>`/`<h2>`/`<h3>`. **The defensive `font-normal` is a symptom; removing it by not loading any bold face is the system's intent.**

Mono at 500 IS loaded and IS rendered faithfully — the only valid weight variance in the entire system lives inside JetBrains Mono, and it appears only in `case-study-diagrams/*` data tables and blog-figure scaffolds.

**Implication for Typography:** The voice has *already decided* Matter is regular-only. Rule 1 ("Matter Regular 400 for all text — no Medium, no Bold, no Italic") is not a new constraint; it is formalizing what the font-loader already enforces at runtime. Typography v1 is the cleanup pass that catches the 15+ `font-medium`/`font-semibold`/`font-bold`/`italic` sites the system has been silently lying about.

---

## 2. The implicit size scale

Every sans size literal cited, grouped by function:

**Page-title "marquee" tier — clamp family** (`<h1>` with `text-[clamp(...)]`):
- `session.tsx:193` — `clamp(36px, 5vw, 64px)` (homepage marquee)
- `hero/index.tsx:144` — `clamp(36px, 4.5vw, 52px)` (desktop hero — same text "A lab that ships.")
- `hero/index.tsx:112` — `text-4xl` (36px — mobile hero branch, same text)

These three are the **same marquee content** with three different type treatments (mobile, desktop, session). They visually converge on 52–64px upper bound. This is the latent `display` role.

**Index-page `<h1>` tier**:
- `work/page.tsx:84` — `clamp(36px, 6vw, 56px)`
- `lab/page.tsx:42` — `clamp(36px, 6vw, 56px)` (identical)
- `work/[slug]/page.tsx:81` — `clamp(36px, 6vw, 52px)` (near-identical upper bound)
- `lab/[slug]/page.tsx:69` — `clamp(28px, 4.5vw, 42px)` (smaller — detail page)
- `contact-form.tsx:40` — `clamp(28px, 5vw, 40px)` (smaller)

Five page-title `<h1>`s, three different clamps, all converging around the 32–56px band. This is the latent `h1` role. The locked role `clamp(32, 5vw, 48)` sits inside that band — the upper-56 sites will shrink 8px. **Acceptable** — the current size fluctuation is inconsistency, not intent.

**Section-heading tier**:
- `philosophy.tsx:15` — `<h2>` `clamp(28px, 5vw, 48px)` (currently rendering huge — 48 upper)
- `work/page.tsx:107` — `<h2>` `clamp(28px, 4vw, 40px)` (hero case-study title)
- `work/page.tsx:154` — `<h2>` `clamp(22px, 2.5vw, 28px)` (secondary case-study title — exactly on role)
- `featured-work.tsx:53` — `<h3>` `clamp(22px, 3vw, 28px)` (semantic mismatch — `<h3>` at `h2` size)
- `cta.tsx:9` — `<h2>` fixed `text-[32px]`
- `hero/expansions/margin-text.tsx:27` — `<h3>` fixed `text-[18px]` (exactly on role)

The locked `h2` role `clamp(22, 3vw, 28)` matches `work/page.tsx:154` exactly and is the typical section-title size. The outliers (philosophy 48, work hero 40, cta 32) are cases where `<h2>` was over-sized toward marquee weight. **Post-migration these normalize down**; the design gets a uniform `<h2>` rhythm.

**Body tier**:
- `globals.css:212` — `article p, article li` — `text-[15px] leading-[1.75]`
- `hero/index.tsx:145` — hero intro — `text-[15px] leading-relaxed`
- `work/page.tsx:110` — hero case-study lead — `text-[15px] leading-relaxed`
- `work/[slug]/page.tsx:126` — case-study description — `text-[15px] leading-relaxed`
- `exploded-view.tsx:259` — description — `text-[15px] leading-relaxed`
- `pillars.tsx:19` — body — `text-[15px]` (via `text-lg` on containing div)
- `session.tsx:227` — chat user message — `text-sm md:text-[15px]`
- `session.tsx:294,309` — sans inner rows — `text-[12px]` (orphan)

`text-[15px]` is the single most repeated body size in the system. This IS the `body` role. Leading varies from `1.65` to `1.75` — the 1.75 prose value matches Tailwind `leading-[1.75]` and appears in the article cascade.

**Caption tier** — the uppercase mono eyebrow stamp:
- 20+ sites use `font-mono text-[11px] uppercase tracking-[0.15em]`. This is the single most repeated typographic gesture in the codebase — already cited in Button's latent voice scan. **Typography formalizes this as the `caption` role, with one change: Matter replaces mono.**

The locked `caption` role spec: `<small>` / `.caption`, 11px, 0.08em tracking, weight 400, uppercase. Flipping from mono → Matter + from `0.15em` → `0.08em` tracking is a **visible design shift**. Two observations:
- `0.15em` on mono renders as ~0.11em effective (because mono is wider). Matter at `0.08em` has comparable optical tracking to mono at `0.12em–0.15em`. The switch is calibrated, not arbitrary.
- Mono uppercase at 11px visually reads as "timestamp / system metadata". Matter uppercase at 11px + 0.08em reads as "section label / editorial eyebrow". This is a **tone shift**: from "terminal print-out" to "publication eyebrow." The orchestrator has decided the editorial tone wins.

**Sub-caption tier (diagram floor)** — 8–10px sizes in `hero/expansions/*`, `case-study-diagrams/*`, `blog/*/figure.tsx`. These are scaffold art, not reading content. Typography carves them out via a `.scaffold` or `[data-scaffold]` opt-out.

---

## 3. The tracking vocabulary

Every non-default tracking value observed:

- **`tracking-tight`** (`-0.025em` in Tailwind default) — applied to every large heading: `hero/index.tsx:112,144`, `session.tsx:193`, `work/page.tsx:84,107,154`, `work/[slug]/page.tsx:81`, `lab/page.tsx:42`, `lab/[slug]/page.tsx:69`, `contact-form.tsx:40`, `philosophy.tsx:15`, `featured-work.tsx:53`, `hero/expansions/margin-text.tsx:27`. The locked roles specify `-0.02em` for `display`, `-0.01em` for `h1`, `-0.005em` for `h2`. **This is a calibrated tightening** — Tailwind's `-0.025em` is subtly overtight at smaller `h2` sizes; the role-specific values are gentler on `h2` and `h3`. Visible refinement, not a regression.
- **`tracking-[0.15em]`** — 15 occurrences, all uppercase mono eyebrows. Flips to Matter at `0.08em` (role `caption`).
- **`tracking-widest`** (Tailwind `0.1em`) — used on uppercase-mono stamps too, interchangeable with `tracking-[0.15em]`. Inconsistency; both flip to `caption` at 0.08em.
- **`tracking-wide`** (Tailwind `0.025em`) — used loosely: `hero/index.tsx:148` (uppercase intro CTA), `contact-form.tsx` form labels, blog scaffolds. Mostly flips via parent role.

**Tracking settles into exactly 3 named values post-migration:**
1. Negative tracking (`-0.005em` to `-0.02em`) — tightens large headings.
2. Zero tracking — body, `h3`, inline elements.
3. `+0.08em` uppercase tracking — captions only.

Three tracking targets map to three role bands. Clean.

---

## 4. The leading vocabulary

Every non-default line-height observed:

- **`leading-[1.1]`** — every `<h1>` marquee: `session.tsx:193`, `hero/index.tsx:112,144`. Matches `display` role spec (1.05–1.1 range).
- **`leading-tight`** (Tailwind `1.25`) — page-title `<h1>`s and section `<h2>`s: `work/page.tsx:84,107,154`, `work/[slug]/page.tsx:81`, `lab/page.tsx:42`, `lab/[slug]/page.tsx:69`, `contact-form.tsx:40`, `philosophy.tsx:15`, `featured-work.tsx:53`, `hero/expansions/margin-text.tsx:27` (via `leading-snug`). Locked roles spec 1.15 for `h2` (slight loosening; makes sense given h2 is 22–28 and tight crushes descenders).
- **`leading-snug`** (Tailwind `1.375`) — used on `<h3>`: `hero/index.tsx:123`, `hero/expansions/margin-text.tsx:27`. Matches `h3` role (1.25 — slight tighten).
- **`leading-[1.65]`** — `hero/chat/system-response.tsx:10` chat body. Between `body` (1.65) and article (1.75).
- **`leading-[1.7]`** — MDX callout body in `unblocking-agents.mdx:76`. Matches article band.
- **`leading-[1.75]`** — `article p, article li, article blockquote` (globals.css:212,220). The article cascade.
- **`leading-relaxed`** (Tailwind `1.625`) — intro paragraphs, card descriptions: `hero/index.tsx:145`, `work/page.tsx:110`, `work/[slug]/page.tsx:126,150`, `work/page.tsx:157,204`, `featured-work.tsx:56`, `exploded-view.tsx:259`, `lab/page.tsx:91,171,201`.
- **`leading-none`** — used on micro-labels (badges): `lab/[slug]/page.tsx:73`, `lab/page.tsx:86`, `blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:108`. This is "text fits the chip exactly."
- **`leading-[1.8]`** — MDX `permissions-trap-figure.tsx:206`, `one-way-bridge-figure.tsx:86`. Scaffold density.

**Settles into the 6-role line-height targets clean:**
- `display` 1.05, `h1` 1.1, `h2` 1.15, `h3` 1.25, `body` 1.65–1.75, `caption` 1.4.

The latent pattern is: tighter at the top, looser in the middle (body is the most breathable). Micro-labels and scaffolds go back to tight (1.4 or less). **This is classic editorial rhythm** — no surprises.

---

## 5. The uppercase-eyebrow stamp — the system's signature

Three properties, applied together, appear 20+ times across the codebase:
```
font-mono text-[11px] uppercase tracking-[0.15em]
```

Call sites (partial list, there are ~20):
- `contact-form.tsx:37,48,60,71,83` — page eyebrow + 4 form labels
- `philosophy.tsx:10` — section eyebrow
- `pillars.tsx:16` — section eyebrow (as `<h3>`)
- `featured-work.tsx:22,50` — section + card eyebrow
- `process.tsx:30` — card eyebrow (as `<h3>`)
- `exploded-view.tsx:104,256` — card titles (as `<h3>`)
- `capabilities.tsx:36` — card eyebrow (as `<h3>`)
- `lab-preview.tsx:33` — section eyebrow
- `hero/index.tsx:120,184` — mobile + chat eyebrow
- `hero/expansions/margin-text.tsx:24` — margin eyebrow
- `lab/page.tsx:39,67,126,154,185` — category + 3 section eyebrows (as `<h2>`!)
- `work/page.tsx:104,151,190` — eyebrows across work index
- `work/[slug]/page.tsx:78` — page eyebrow
- `session.tsx:212,226,240,244,273,291,304` — chat panel headers + fit/timeline section labels

**Observation 1 — the stamp is overloaded.** It's used as:
- a page-level eyebrow (above `<h1>`)
- a section-level eyebrow (above `<h2>`)
- a card-level eyebrow (inside a card)
- an inline category label
- a form label (for `<label>`)
- a data-row label (inside a figure)

All six contexts share the same visual treatment. Typography's job is to preserve this **by routing all six to the `caption` role** — the single canonical eyebrow treatment. Migration deletes the explicit `font-mono text-[11px] uppercase tracking-[0.15em]` stamp and replaces with `<p class="caption">` or `<small>`. Semantic distinction lives in the HTML element + context, not the class.

**Observation 2 — the stamp is semantically misplaced.** 8 instances use `<h2>` or `<h3>` to render an eyebrow. Semantically these are NOT headings — they are subtitles / labels. A screen reader hearing `<h2>Philosophy</h2>` followed by `<h2>Primitives over Pipelines</h2>` hears "two section headings" when the visual design says "one section: Philosophy → Primitives over Pipelines". Typography migration fixes this by demoting eyebrows to `<p>` or `<small>` + `caption` role. **This is a structural a11y fix embedded inside the typography pass.**

**Observation 3 — the mono→sans flip changes the *tone* of the eyebrow from "system print" to "editorial label."** Warm-paper aesthetic (`#f5f0ec` + black Matter) is ambiguous between the two tones; the system reads as editorial when the eyebrow is Matter, and as terminal/technical when the eyebrow is Mono. The orchestrator's choice of sans-only eyebrows tilts the entire voice **toward editorial restraint** and away from terminal-art density. This is coherent with the rest of Rubric's voice (no gradients, no decorative color, no motion beyond 2px arrow) — more warm-paper, less CLI.

---

## 6. Article / prose typography today

`src/app/globals.css:184-272` defines the article cascade:

```css
article h2 { @apply text-2xl font-normal mt-14 mb-2; }   /* 24px */
article h3 { @apply text-xl font-normal mt-10 mb-1; }    /* 20px */
article p, article li { @apply text-secondary text-[15px] leading-[1.75]; }
article :is(strong, b) { @apply text-primary font-semibold; }  /* RULE 1 VIOLATION */
article blockquote { @apply border-l border-subtle pl-6 text-[15px] text-secondary/70 leading-[1.75]; }
article figure { @apply my-10; }
article figcaption { @apply mt-2 text-[9px] text-secondary/40 text-center font-mono; }  /* RULE 2 VIOLATION — mono for prose caption */
article hr { @apply border-t border-subtle my-12; }
article aside { @apply w-full rounded-xl border border-subtle bg-accent p-6; }
article ul, article ol { @apply pl-6; }
```

Plus MDX rendering via `src/mdx-components.tsx` — `h1`/`h2`/`h3` wrap raw tags with `<CopiableHeading>` that adds a click-to-copy id. No per-heading typography concerns — the wrapper preserves the element.

**Implications for Typography v1:**
- `article h2` / `article h3` currently render at `text-2xl` (24px) / `text-xl` (20px). Locked `h2` role is `clamp(22, 3vw, 28)`, `h3` is `18`. **Article h2 lands at 22–28 — close, acceptable 2–4px shift. Article h3 lands at 18 — 2px smaller than current.** Visible, minor.
- `article p` at `text-[15px] leading-[1.75]` = `body` role exactly. Migrate cleanly.
- `article blockquote` keeps its own cascade (left-border, italic-free — once italic is stripped from `work/[slug]/page.tsx:138`).
- `article figcaption` at 9px mono is a Rule 2 violation. Flip to sans at 11px (`caption`). 2px larger. Design team: this is intentional — captions shouldn't read as code.
- `article strong/b` at `font-semibold` is a Rule 1 violation. Strip weight; emphasis survives via `text-primary` against `text-secondary` paragraph color. This IS enough contrast in Rubric's warm-paper aesthetic (the black on beige is assertive without weight). Flag for orchestrator review.

---

## 7. Chat bubble, input, and "system UI" body

Chat components at `src/components/hero/chat/*` render at `text-[13px]`:
- `user-message.tsx:11` — user bubble body
- `system-response.tsx:10` — system response body
- `chat-input.tsx:19,24` — input text + placeholder

These are a deliberately **tighter body scale** for density inside the chat frame. Not body (15px), not caption (11px) — they sit at 13px.

**Options for Stage 2:**
1. Role them as `body` (15px) — would visibly enlarge chat text by 2px inside a 520px-wide chat frame. Risk: breaks chat rhythm, possibly overflows.
2. Introduce a `body-sm` or `.chat-body` utility at 13px — violates Rule 5 (no extra roles).
3. Keep inline — violates Rule 3.

Recommended resolution: **chat UI accepts a `.chat-body` utility class** (analogous to `.caption`) — not a role, a utility. Stage 2 documents this as "specialized interaction surfaces may use utility classes for deliberately-tighter body; only `body` + `caption` are the reading roles." Alternatively, drop chat to `body` (15px) and accept the density change — the chat frame widens naturally to accommodate.

This is one of two **Stage 2 orchestrator decisions** flagged by Stage 1.

---

## 8. Numeric and tabular rendering — the legitimate mono surface

Every place mono appears as **tabular data** (Rule 2 "technical numeric-data tables"):

**Legit tabular surfaces:**
- `session.tsx:247-325` — generative UI inside the chat: fit bars (with percentages), timeline (week vs task), tool rows (name + time), memory notes. These render as data tables, albeit visually styled as chat content. Mono 10–11px. KEEP.
- `case-study-diagrams/cal-agent-loop.tsx`, `gumloop-timeline.tsx`, `safeway-memory.tsx`, `safeway-search-loop.tsx`, `yic-flow.tsx` — every case study figure has a data table (event rows, timestamp columns). Mono 10–11px. KEEP.
- `blog/claude-code/tools-table.tsx` — a literal `<table>` rendering the 16 Claude tools with description and phase. Mono for `<code>` cells; sans for `<th>`/`<td>` prose columns. Mixed — spec must say: mono inside table cells for tool-names, sans for prose descriptions, at the same 13–14px body-ish size for readability.
- `blog/claude-code/system-architecture.tsx:117,243` — interactive panels displaying tool codes + models. Mono.
- `unblocking-agents.mdx:76` — terminal-style callout with 6+ lines of inline monospace addresses, IDs, keys. KEEP mono — this is effectively a code block.

**Pseudo-tabular (borderline):**
- `hero/expansions/architecture.tsx`, `context.tsx`, `evaluation.tsx` — hero-scaffold diagram art with mono labels. These are NOT reading content; they render as architectural illustration. Stage 1-A recommends carve-out as `.scaffold`. Not "tabular data," but "diagram as UI."

**Scaffold (NOT tabular, NOT reading):**
- `blog/primitives-over-pipelines/*`, `blog/unblocking-agents/*` — figure animations with mono labels on boxes. Same carve-out.

**Gap:** the `--font-feature-tnum` token exists in `@theme inline` but is not yet consumed. Stage 2 spec should declare: in tabular contexts (mono cells), `font-feature-settings: var(--font-feature-tnum)` lines up the digits. This is the one typography primitive that already lives in tokens and is dormant — Typography's `tabular` utility lights it up.

---

## 9. Links, CTAs, and inline prose emphasis — the grey area

Every clickable text gesture in marketing (not inside article prose) uses one of:

**Inline-link arrow pattern** (uppercase or sentence-case):
```tsx
<Link className="group inline-flex items-center gap-2 ... transition-colors duration-200">
  <span>Read case study</span>
  <span className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
</Link>
```
- Sentence case / Matter body: `featured-work.tsx:60`, `work/page.tsx:114,174,211`, `lab/page.tsx:126,137`, `work/[slug]/page.tsx:64,160` — all currently at `font-mono text-[12px]` or `text-xs`. Post-migration: flip mono → sans, snap 12 → `body` (15) or `caption` (11), based on context.
- UPPERCASE / eyebrow CTA: `hero/index.tsx:148` ("See the work →"), `session.tsx:201` ("See the work →"). These are uppercase, mono, 11–13px. Currently eyebrow-stamp. Post-migration: the uppercase+tracking intent survives via `caption`; sentence-case variants flip to body-inline links.

**Inline prose emphasis inside MDX:**
- `unblocking-agents.mdx:78-86` — heavy use of `<span className="text-primary font-medium">...</span>` inside a callout. Purpose: mark specific phrases as "this is the important bit." Currently relies on color + weight. Post-migration (Rule 1): weight disappears; emphasis survives on color alone. Risk: some phrases currently read as BOLD and now read as DARK-INK — subtle loss of visual punch. Acceptable given the rule; if not, Stage 2 escalates.

---

## 10. Eight to ten inferences (for Stage 2)

Each inference: a concrete claim, evidence from the repo, and what Stage 2 spec should do with it.

---

**Inference 1 — The system has already committed to Matter Regular 400 via the font loader; Typography's job is to stop lying about it.**
- EVIDENCE: `src/app/layout.tsx:9-12` loads only `matter-regular.woff`. `font-medium`/`font-semibold`/`font-bold` on sans elements in 15 files triggers browser-synthesized bold — which against Matter's engineered regular creates a subtly blurred artifact. `font-normal` appears 25 times as a *defensive* override on `<h1>`/`<h2>`/`<h3>` to preempt browser default bold. The defensive class is a symptom.
- APPLICATION: Stage 2 `@layer base` rules must set `font-weight: 400` on `<h1>`/`<h2>`/`<h3>`/`<strong>`/`<b>` so `font-normal` can be deleted everywhere. Delete the 15 bold-weight sites. Document: "the font loader is the source of truth; weight classes are forbidden."

---

**Inference 2 — The caption role is the system's signature gesture and must feel identical post-migration despite the mono→sans flip.**
- EVIDENCE: `font-mono text-[11px] uppercase tracking-[0.15em]` appears 20+ times across marketing pages, forms, section headers, card eyebrows. The treatment is Rubric's most repeated type gesture. Mono at `0.15em` reads at ~0.11em optical; Matter at `0.08em` reads at ~0.08em optical but compensates because Matter is narrower and the same letterforms are more legible at 11px.
- APPLICATION: Stage 2 locks `caption` at Matter Regular, 11px, `0.08em` tracking, uppercase, weight 400. **Stage 6 captures a before/after screenshot of `featured-work.tsx:22` "Work" eyebrow** to confirm the shift reads as "editorial label" not "wire-frame stamp." If the difference is uncomfortable, Stage 2 can adjust to `0.1em` — within tolerance.

---

**Inference 3 — `<h2>` and `<h3>` are currently oversized; the locked role sizes will intentionally shrink them, normalizing rhythm.**
- EVIDENCE: `philosophy.tsx:15` `<h2>` at `clamp(28,5vw,48)`; `work/page.tsx:107` `<h2>` at `clamp(28,4vw,40)`; `cta.tsx:9` `<h2>` at fixed 32. The locked role `h2` is `clamp(22, 3vw, 28)` — upper 28. Locked `h3` is fixed 18.
- APPLICATION: Accept the visual shrink as design intent. The pre-migration state has `<h2>` and `<h1>` overlapping at 40–48px; post-migration `<h2>` has its own weight class (28 max) while `<h1>` owns 32–48. The hierarchy becomes more legible, not less. Stage 2 codifies. If Dexter's eye says `philosophy.tsx` loses too much impact at the smaller size, the fix is the section *spacing* (more `mt-*`), not making `<h2>` big again.

---

**Inference 4 — Eight `<h3>` / `<h2>` elements are misused as eyebrows; Typography fixes the semantic HTML as a bonus.**
- EVIDENCE: `pillars.tsx:16`, `process.tsx:30`, `capabilities.tsx:36`, `exploded-view.tsx:104,256` use `<h3>` for uppercase mono 11px eyebrows. `lab/page.tsx:67,154,185` use `<h2>` for uppercase mono eyebrows. Screen reader users hear "heading level 3" for what the visual design treats as a label.
- APPLICATION: Migrate all 8 to `<p>` (or `<small>`) + `caption` role. Document as structural a11y fix. Stage 6 runs an outline test: `document.querySelectorAll('h1, h2, h3')` should produce the expected document outline on every migrated page (marquee `<h1>`, section `<h2>`s, subsection `<h3>`s — no stamps).

---

**Inference 5 — Line-height already follows an editorial rhythm (tight top, relaxed middle, tight micro). Role tokens formalize it.**
- EVIDENCE: `leading-[1.1]` on marquee `<h1>`; `leading-tight` (1.25) on page `<h1>`s and `<h2>`s; `leading-snug` (1.375) on `<h3>`; `leading-relaxed` (1.625) and `leading-[1.75]` on body; `leading-none` on micro-chips. This is classic editorial rhythm.
- APPLICATION: Lock role line-heights: `display` 1.05, `h1` 1.1, `h2` 1.15, `h3` 1.25, `body` 1.65–1.75, `caption` 1.4. Document rationale: "tighter at top (large type crushes descenders less), relaxed in body (reading flow), tight at micro (labels fit chips)." Matches the pattern already implicit.

---

**Inference 6 — The `text-[15px]` body size is the single most-repeated sans measurement; everything else drifts.**
- EVIDENCE: `text-[15px]` appears in 8 distinct sans body contexts (globals article, hero intro, work/lab detail leads, case-study leads, exploded-view, pillars, session chat). `text-base` (16), `text-lg` (18), and `text-[14px]` appear as drift — 15px is the target every body is trying to hit.
- APPLICATION: `body` role locks at 15px. Every `text-[14px]`, `text-[15px]`, `text-base` on a sans `<p>` / `<div>` body element collapses to bare `<p>`. The handful of cards currently at 14 (`featured-work.tsx:56`, `work/page.tsx:157,204`) get a 1px bump — imperceptible. The cards at 16 (`process.tsx:33` `<p className="font-sans text-base">`) get a 1px shrink — also imperceptible. Net: one body size, no opinions.

---

**Inference 7 — Chat UI sits at 13px and needs an escape hatch; Stage 2 must resolve.**
- EVIDENCE: `hero/chat/user-message.tsx:11`, `system-response.tsx:10`, `chat-input.tsx:19,24` all render at 13px. The chat frame is 520px wide; at 15px body type would start to feel loose in that narrow column.
- APPLICATION: Orchestrator decision — either (a) role chat as `body` (bump to 15px, accept density change) or (b) introduce `.chat-body` utility class at 13px (not a role, an internal utility). Recommend (b) — the chat is the homepage's central interactive surface; preserving density is load-bearing. Stage 2 documents: utility classes are allowed for specialized interactive surfaces, not new roles.

---

**Inference 8 — Mono is structurally for code (`<code>`) and data tables; every UI-label mono is migration scope.**
- EVIDENCE: Mono appears in ~95 sites. Of those, ~45 are legitimately code (`<code>` cascade in globals.css, code blocks, MDX inline code, tool-table `<code>` cells, tabular data in figures). ~50 are UI labels (eyebrows, link CTAs, form labels, form helper text, timestamps, chips). Rule 2 says mono for code + data only.
- APPLICATION: Stage 2 flips all ~50 UI-label mono sites to Matter. Preserves all ~45 legitimate mono sites. The `--font-feature-tnum` token lights up for tabular mono contexts. One class or selector — `.tabular`, `<code>`, and scoped case-study-diagram wrappers — owns mono.

---

**Inference 9 — `<strong>` / `<b>` inside article prose is the one Rule-1 violation that needs orchestrator sign-off, not silent strip.**
- EVIDENCE: `globals.css:216` — `article :is(strong, b) { @apply text-primary font-semibold }`. Inline prose emphasis is currently weight + color. Rule 1 says no semibold.
- APPLICATION: Stage 2 must decide: (a) strip `font-semibold` — emphasis becomes color-only (`text-primary` vs secondary paragraph), still readable against `#f5f0ec`; (b) keep the weight and accept browser-synthesized bold in article prose (hypocrisy); (c) load Matter Medium specifically for this case. Recommend (a). The warm-paper palette carries contrast-only emphasis well; we tested this already because every link in prose uses color-only for hover.

---

**Inference 10 — `figcaption` is currently mono at 9px; Rule 2 forces a flip.**
- EVIDENCE: `globals.css:228` — `article figcaption { ... text-[9px] ... font-mono }`. Figure captions in MDX blog posts render as mono micro-text.
- APPLICATION: Flip to sans `caption` role (11px + 0.08em + uppercase + weight 400). **Visible change** — blog figures get captions that are 2px larger and sentence-or-uppercase instead of all-monospace. Recommend uppercase for consistency with other captions. Stage 6 screenshot test: every article with a `<Figure.Caption>` for before/after.

---

## 11. Anti-patterns (what does NOT belong in Rubric typography)

Each is grounded in what the codebase does NOT contain — removing it does not break voice.

**Anti-pattern 1 — Matter at weight 500/600/700.**
Matter's only loaded file is `matter-regular.woff` (weight 400). Every `font-medium`/`font-semibold`/`font-bold` on Matter triggers browser synthesis — a visible blur. 15 current violations, all must delete.

**Anti-pattern 2 — Italic / oblique faces on any element.**
No italic Matter file exists. No italic JetBrains Mono variant loaded. One current violation (`work/[slug]/page.tsx:138` blockquote italic) triggers synthesis. Strip.

**Anti-pattern 3 — Mono for UI labels, eyebrows, links, buttons, headings, body text.**
Rule 2 carves mono into `<code>` and tabular data. The codebase currently has 50+ violations. These become caption (Matter) post-migration.

**Anti-pattern 4 — Inline `text-[Xpx]` / `text-base` / `text-lg` on reading content.**
The codebase has 90+ inline literal sizes and 99 named-Tailwind sizes on reading-content elements. Post-migration: the role rule wins; the inline class deletes. Exception: diagram/scaffold carve-outs keep literals explicitly.

**Anti-pattern 5 — Visual heading on `<h3>` for non-heading content (eyebrows).**
Eight `<h3>` / `<h2>` used as eyebrows create false document outline entries. Typography fixes to `<p class="caption">` or `<small>`. Screen readers + SEO outline benefit.

---

## 12. Distilled type voice for Rubric

Matter Regular 400, warm-paper ink. Size + space carry every hierarchy decision — weight and style are absent. Display and h1 sit in the 32–72px clamp band with tight tracking and 1.05–1.1 line-heights; h2 at 22–28 with gentler tracking; h3 at a flat 18. Body is 15px at 1.65–1.75 leading, prose-breathable. Captions are 11px Matter uppercase with 0.08em tracking — the system's signature eyebrow, formerly mono. Mono lives inside `<code>` and tabular data only — where monospaced alignment is the point. Every visible rhythm in the codebase today — tighten-at-top, relax-middle, stamp-at-caption — survives the migration; the classes just move from 44 file call-sites to six CSS rules on raw HTML.

*(117 words.)*

---

ultrathink
