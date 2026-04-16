# Typography — Codebase Usage Scan

Grounded in `forge/typography` worktree off `dexter/site-rebuild`. Scans `src/`. No external references.

## 1. Scope of scan

Greps run against HEAD of `forge/typography`:

| Pattern | Instances | Unique files |
|---|---|---|
| `text-\[\d+px\]` (literal pixel sizes) | 90+ | 34 |
| `clamp\(` (font-size clamps, inline) | 11 | 10 |
| `font-mono` | ~95 | 26 |
| `font-medium` | 15 | 11 |
| `font-semibold` | 4 | 3 |
| `font-bold` | 1 | 1 |
| `italic` (Tailwind class, not CSS property) | 1 | 1 |
| `<h[123]\s` (inline-styled headings) | 37 | 16 |
| `tracking-\[0.15em\]` (eyebrow stamp tracking literal) | 15 | 11 |
| `font-normal` (defensive weight override) | 25 | 15 |
| `text-(xs\|sm\|base\|lg\|xl\|2xl\|3xl\|4xl)` (named scale) | 99 | 33 |
| Stale `text-text-(primary\|secondary\|tertiary)` (orphan token) | many | 4 |

**Union of files affected (grep: `(text-\[\d+px\]|clamp\(|font-mono|font-medium|font-semibold|font-bold|italic|<h[123]\s)`): 44 unique files.** One is `src/app/layout.tsx` (the font-loader; no change needed); one is `src/app/globals.css` (the destination for role rules). Net component/page/MDX files to migrate: **42**.

## 2. `text-[Xpx]` literal inventory — 90+ instances across 34 files

Grouped by size. Each entry is file:line. "Destination role" is what Stage 2 spec must route it to. "Notes" flags any reason it's NOT a pure role-swap.

### `text-[8px]` (3 instances, 2 files)

| File:line | Element/context | Destination | Notes |
|---|---|---|---|
| `hero/expansions/architecture.tsx:57` | mono scaffold annotation | KEEP as-is (diagrammatic code label) | Hero-scaffold art. Out-of-scope for Typography rule (diagrammatic element, not reading content). |
| `hero/expansions/context.tsx:54` | mono scaffold annotation | KEEP | Same justification. |
| `hero/expansions/context.tsx:58` | mono scaffold annotation | KEEP | Same. |
| `hero/expansions/evaluation.tsx:97` | mono scaffold annotation | KEEP | Same. |

**Decision for Stage 2:** `hero/expansions/*` is visual scaffold art that explicitly uses sub-typography sizes (8–10px) to render as architecture diagrams. These are not "text" in the reading sense. Spec should explicitly carve them out of the typography role system and document them as a diagrammatic exception — potentially a single `.scaffold-label` helper class or a `<data>` element if we want semantic purity.

### `text-[9px]` (11 instances, 8 files)

All in diagrammatic contexts:
- `globals.css:228` — `article figcaption` cascade. Will become `caption` role (11px), possibly with a prose-specific size override.
- `hero/expansions/architecture.tsx:34`, `context.tsx:48`, `evaluation.tsx:69,100`, `agent-architecture.tsx:83,93,117,121,138,151` — all diagram scaffold.
- `app/lab/[slug]/page.tsx:73`, `app/lab/page.tsx:86` — teeny lab-status badges (`border-tint/30 rounded px-1.5 py-0.5`). These are data-chip stamps, not text.
- `blog/unblocking-agents/one-way-bridge-figure.tsx:64,110,115,173,184,192`, `permissions-trap-figure.tsx:200`, `before-after-flow-figure.tsx:103` — all blog-figure scaffold.
- `lib/posts/unblocking-agents.mdx:69,94` — inline mono `<span>` scaffolds inside a figure.

**Decision:** 9px is the scaffold-diagram stamp floor. NOT part of the 6 type roles. Spec should carve out diagrammatic scaffold in `hero/expansions/*`, `blog/*/figure.tsx`, `case-study-diagrams/*`, `agent-architecture.tsx` as "diagram" — these keep their literal sizes. The figcaption case (`globals.css:228`) is the only one that's genuine text; it becomes `caption` size (11px), which is 2px larger — acceptable or flag for Stage 2.

### `text-[10px]` (31+ instances, 10 files)

Grouped by semantic intent:

**Uppercase mono eyebrows** (caption role candidates):
- `hero/index.tsx:120` — mono eyebrow inside mobile card
- `hero/index.tsx:184` — "Rubric" status label in chat header
- `session.tsx:212,226,240,244,273,281,291,304` — repeated "Thinking", "You", "Rubric", "Project Fit", "Estimated Timeline" eyebrows (uppercase mono)
- `case-study-diagrams/safeway-memory.tsx:8,42` — uppercase mono `tracking-[0.15em]` labels
- `case-study-diagrams/yic-flow.tsx:14` — uppercase mono `tracking-[0.15em]`
- `hero/expansions/margin-text.tsx:24` — mono uppercase `tracking-[0.15em]` margin eyebrow

**Mono data labels (non-uppercase, diagrammatic)**:
- `session.tsx:247,261,277,281,293,297,308,313,325` — mono data labels in fit bars, timeline, tool calls (numeric-ish data)
- `case-study-diagrams/cal-agent-loop.tsx:19,24,34,40,57,63,68,77,85,89` — mono data labels in diagram rows
- `case-study-diagrams/safeway-memory.tsx:11,18,25,33,34,45,56,62,70` — same pattern
- `case-study-diagrams/safeway-search-loop.tsx:26,31,41,50,51` — same
- `case-study-diagrams/yic-flow.tsx:37,42,55,63` — same
- `case-study-diagrams/gumloop-timeline.tsx:44,55,63,73,77` — same
- `blog/claude-code/system-architecture.tsx:89,95,111,117,223,243,261,264,327` — same
- `blog/primitives-over-pipelines/list-inspect-figure.tsx:131,138` — same
- `blog/unblocking-agents/one-way-bridge-figure.tsx:86` — mono figure scaffold

**Decision:** 10px is the diagrammatic data-label floor. **Two paths:**
- Uppercase-mono-eyebrow 10px: these WANT to be `caption` role (11px), but they're currently packed inside tight diagram panes. Stage 2 must decide — bump to 11px (consistent role) or carve a smaller `caption-xs` for diagrams. Recommend: bump to 11px and tighten the container if needed; consistency wins over density.
- Mono data labels 10px (non-uppercase, in `case-study-diagrams/*` and `session.tsx` inner): these are **tabular data** in the Rule 2 sense — mono is correct. Stage 2 formalizes these as "data / tabular" contexts. Token for size: proposed `--text-data-xs` or keep literal (diagrams are deliberately dense). Out of scope for the 6 roles; document as tabular-data utility.

### `text-[11px]` (~30 instances, 15+ files)

**Almost all are UI eyebrows / labels / link CTAs / chips.** Examples:
- `announcement-bar.tsx:24` (via typeof sr-only mono label)
- `contact-form.tsx:37,48,60,71,83` — form labels (mono uppercase `tracking-[0.15em]`)
- `philosophy.tsx:10` — section eyebrow
- `pillars.tsx:16` — section eyebrow (`<h3>`)
- `featured-work.tsx:22,50` — section + card eyebrows
- `hero/index.tsx:148` — hero intro CTA ("See the work →")
- `hero/index.tsx:244` — citation chip
- `lab-preview.tsx:71` — lab date label
- `work/[slug]/page.tsx:78,101,114` — page-title eyebrow, date, meta chips
- `work/page.tsx:104,151,190` — page-title eyebrow, card eyebrow, secondary label
- `lab/[slug]/page.tsx:83,97` — meta + badge
- `lab/page.tsx:96,106,110,139,173` — date, category, meta
- `blog/unblocking-agents/before-after-flow-figure.tsx:132` — figure step label
- `blog/unblocking-agents/permissions-trap-figure.tsx:206` — scaffold
- `blog/primitives-over-pipelines/shopping-agent-chat-figure.tsx:108` — scaffold
- `blog/primitives-over-pipelines/list-inspect-figure.tsx:110` — scaffold
- `blog/claude-code/system-architecture.tsx:117` — scaffold
- `app/components/page.tsx` (button playground eyebrow labels) — `text-[11px] uppercase tracking-[0.08em]`

**Decision:** `text-[11px]` + uppercase + mono + tracking is the **single most repeated typographic gesture in the codebase.** This IS the `caption` role. Every UI eyebrow currently using mono flips to Matter (Rule 2). Stage 2 migration fans out from this one insight: 20+ sites converge on the `caption` role.

### `text-[12px]` (14 instances, 10 files)

Mixed:
- `contact-form.tsx:96` — "Or email ..." helper mono text (flips to `body` or `caption`)
- `session.tsx:247,294,309` — mono data labels + sans chat row (sans 12 is an awkward orphan — not 11, not 13)
- `featured-work.tsx:60` — "Read case study" CTA (mono)
- `work/page.tsx:114,174,211` — CTA trailing arrows (mono)
- `lab/page.tsx:???` — (via mono)
- `philosophy.tsx:???` — (via mono)

**Decision:** Sans 12px is not a role — it's a tween between `caption` (11) and `body` (15). Stage 2 must snap these to either `caption` (11, uppercase) or `body` (15, sentence-case) based on the **function** of the text. CTA "Read case study →" arrows at 12px mono are inline link CTAs — these become `body` size inline spans, not caption. Reduces one magic size.

### `text-[13px]` (7 instances, 6 files)

- `hero/chat/user-message.tsx:11` — chat bubble body
- `hero/chat/system-response.tsx:10` — chat response body
- `hero/chat/chat-input.tsx:19,24` — chat input label
- `session.tsx:201` — "See the work →" desktop-only CTA (mono)
- `philosophy.tsx:29` — "Read the essay" CTA (mono 13)
- `app/components/page.tsx:27` — component-index summary
- `app/components/button/page.tsx:66,113,127,133,157,169,180,182,192,193` — button-showcase body
- `globals.css:276` — `<code>` inline

**Decision:** 13px is body-adjacent. Chat bubbles are specialized UI and could be carved out (smaller-body variant), but the rule says one treatment per element. Recommend: chat bubbles become `body` (15px) with explicit tight spacing OR Stage 2 formalizes a `.chat-body` utility — one class, not a role. Inline `<code>` (globals.css:276) at 13px is correct and KEEPS — this is the Rule 2 "code block" case.

### `text-[14px]` (4 instances, 2 files)

- `featured-work.tsx:56` — card description
- `work/page.tsx:157,204` — card description, secondary project description

**Decision:** 14px is the consolation size between `body` (15) and cascade. Per Rule 3 these inline literals go. Cards get `body` (15) via a `<p>` inside the card, which renders correctly under the global `<p>` rule.

### `text-[15px]` (7 instances, 5 files)

- `globals.css:212` (article `<p>`), `:220` (article blockquote) — body + blockquote (these become `body` role; blockquote is a pseudo-variant but per Rule 4, one treatment per element — blockquote keeps its own cascade).
- `hero/index.tsx:145` — hero intro paragraph
- `work/[slug]/page.tsx:126` — work detail lead
- `work/page.tsx:110` — hero case-study lead
- `exploded-view.tsx:259` — exploded view description
- `pillars.tsx:19` — pillars body
- `session.tsx:227` — chat user message (md breakpoint)

**Decision:** 15px IS the `body` role. Every one of these becomes bare `<p>` text and inherits. Migration deletes the className entirely in most cases.

### `text-[16px]` and `text-[17px]` (3 instances)

- `hero/expansions/evaluation.tsx:74` — 16px mono primary (diagram)
- `work/[slug]/page.tsx:150` — 17px secondary (case-study lead-in)

**Decision:** 17px is an orphan — one size between `body` (15) and `h3` (18). Stage 2 snaps to 18px (`h3`) or 15px (`body`) based on semantic intent. 16 mono is diagrammatic, keep.

### `text-[18px]` (1 instance)

- `hero/expansions/margin-text.tsx:27` — margin-text h3

**Decision:** Exactly hits `h3` role. This is the proof case — a margin-text `<h3>` bare-tagged would render correctly post-migration.

### `text-[32px]` (1 instance)

- `cta.tsx:9` — `<h2>` "Working on something hard?"

**Decision:** This is a fixed-size `<h2>` that doesn't use clamp. Role table `h2` is `clamp(22, 3vw, 28)` — `cta.tsx` wants something larger. Stage 2 must decide: (a) cta becomes `h1` (which fits the 32px upper bound), (b) spec adjusts `h2` upper bound to 32 (breaks 3-tier spacing), or (c) cta is semantically a marquee and takes `display` override. Recommended: this is a CTA section heading (not a marquee, not a page title). Stage 2 evaluates whether to treat as `h1` role at a smaller `<h2>` element (semantic mismatch) or widen `h2` clamp to 32. **Flagged for orchestrator decision.**

## 3. `clamp(...)` inline usages — 11 instances across 10 files

All are on `<h1>` / `<h2>` / `<h3>`. Every one gets deleted post-migration.

| File:line | Element | Clamp | Destination role |
|---|---|---|---|
| `session.tsx:193` | `<h1>` homepage marquee | `clamp(36px, 5vw, 64px)` | `display` (the marquee case — needs an override class) |
| `hero/index.tsx:144` | `<h1>` desktop hero | `clamp(36px, 4.5vw, 52px)` | `display` (the SAME marquee, different layout branch) |
| `hero/index.tsx:112` (note: `text-4xl` not clamp — included for completeness) | `<h1>` mobile hero | `text-4xl` | `display` (mobile branch) |
| `lab/page.tsx:42` | `<h1>` lab index | `clamp(36px, 6vw, 56px)` | `h1` |
| `work/page.tsx:84` | `<h1>` work index | `clamp(36px, 6vw, 56px)` | `h1` |
| `work/page.tsx:107` | `<h2>` hero case study title | `clamp(28px, 4vw, 40px)` | `h2` (currently bigger than spec's `clamp(22,3vw,28)` — flag) |
| `work/page.tsx:154` | `<h2>` secondary case study title | `clamp(22px, 2.5vw, 28px)` | `h2` (exactly in spec range) |
| `work/[slug]/page.tsx:81` | `<h1>` case study detail | `clamp(36px, 6vw, 52px)` | `h1` |
| `lab/[slug]/page.tsx:69` | `<h1>` lab detail | `clamp(28px, 4.5vw, 42px)` | `h1` (smaller upper — acceptable, the clamp gives variance) |
| `featured-work.tsx:53` | `<h3>` featured card title | `clamp(22px, 3vw, 28px)` | `h3`? OR `h2`? — currently sized like `h2`, semantically `<h3>` inside a card. **Flag for Stage 2.** |
| `contact-form.tsx:40` | `<h1>` contact page title | `clamp(28px, 5vw, 40px)` | `h1` (smaller upper — acceptable) |
| `philosophy.tsx:15` | `<h2>` section title | `clamp(28px, 5vw, 48px)` | `h2` (currently bigger than spec `clamp(22,3vw,28)` — flag) |

**Findings:**
- The locked `h2` clamp `clamp(22, 3vw, 28)` is **smaller** than what `work/page.tsx:107` (`clamp(28,4vw,40)`) and `philosophy.tsx:15` (`clamp(28,5vw,48)`) currently render at. Post-migration these would shrink visibly. **Orchestrator decision required:** either (a) shrink these intentionally (accept the design change — `h2` becomes subtler), or (b) widen the `h2` role clamp to `clamp(22, 4vw, 40)` to preserve parity on the two largest current `<h2>` instances. I lean toward (a) — the simplification wins; `<h2>` was visually borrowing `<h1>` weight by over-sizing.
- `featured-work.tsx:53` uses `<h3>` but renders at `<h2>`-size clamp. This is a **semantic bug** — should be either `<h3>` + `h3` role (18px fixed — significantly smaller), or `<h2>` + `h2` role. Stage 2 fixes the semantic; pick one.
- `hero/index.tsx:112` mobile hero uses `text-4xl` not `clamp`. Post-migration both desktop and mobile marquees use the `.display` role class; Tailwind's `text-4xl` disappears.

## 4. `font-mono` usage — ~95 instances across 26 files

Per Rule 2, mono is reserved for (a) code blocks (`<code>`) and (b) technical numeric-data tables (tabular numerics). Every other use must flip to Matter. Categorized:

### Category A — KEEP mono (legitimate under Rule 2)

| File:line | Context | Justification |
|---|---|---|
| `globals.css:276` | `<code>` inline | Code. |
| `globals.css:279-293` | `<code data-theme>` blocks (Shiki output) | Code blocks. |
| `globals.css:295-303` | Code line-counter | Code rendering. |
| `globals.css:228` | `article figcaption` | Figure caption — **CURRENTLY MONO, but is this actually tabular? No. This is a prose figcaption.** Flag as UI-label category — should flip to sans caption. Stage 2 decision. |
| `blog/claude-code/tools-table.tsx:255,292` | `<code>` inside table cells | Code. |
| `hero/chat/*` mono rendering (if any) | — | — |
| `session.tsx:247-325` — mono data labels in fit-bars, timeline, tool rows, memory row | Data tables / tabular | KEEP — this IS the tabular-data case Rule 2 permits. |
| `case-study-diagrams/*` — all mono data labels | Data rows in case-study figures | KEEP — tabular data. |
| `blog/claude-code/system-architecture.tsx` + `tools-table.tsx` data cells | Tables / tabular | KEEP. |
| `agent-architecture.tsx` data labels | Diagram scaffold (borderline) | KEEP (diagrammatic tabular); Stage 2 may re-examine. |
| `blog/primitives-over-pipelines/*`, `blog/unblocking-agents/*` figure mono | Diagrammatic scaffold | KEEP with `.diagram` carve-out, OR document as out-of-role. |
| `hero/expansions/*` mono scaffold | Scaffold art | KEEP (diagrammatic exception). |
| `hero/scaffold.tsx` — SVG text mono | SVG rendering | KEEP. |

### Category B — FLIP to sans (violates Rule 2 — UI label, not tabular data)

These are the target of Typography migration — every one flips from mono to Matter Regular.

| File:line | Context | New role |
|---|---|---|
| `contact-form.tsx:37` | Page eyebrow "Contact" (mono uppercase 11px `tracking-[0.15em]`) | `caption` |
| `contact-form.tsx:48,60,71,83` | Form labels "Name", "Company", "Email", "What are you working on?" | `caption` |
| `contact-form.tsx:94` | Error text (mono) | `body` (inline `<p>` text, not tabular) — OR a dedicated error style |
| `contact-form.tsx:96` | "Or email..." helper text | `body` (inline) |
| `philosophy.tsx:10` | Section eyebrow "Philosophy" | `caption` |
| `philosophy.tsx:29` | "Read the essay" CTA label | `body` (link treatment) |
| `pillars.tsx:16` | Section eyebrow `<h3>` (mono uppercase) | `caption` (note: currently `<h3>` — semantic mismatch; should be `<p class="caption">` or `<small>`) |
| `pillars.tsx:48,73` | Pillar CTA labels | `body` inline link |
| `featured-work.tsx:22,50` | Section eyebrow "Work", card eyebrow | `caption` |
| `featured-work.tsx:60` | "Read case study" CTA | `body` inline link |
| `process.tsx:30` | Process card `<h3>` eyebrow (mono uppercase) | `caption` (semantic mismatch like `pillars.tsx:16` — should be `<p>` or `<small>`) |
| `exploded-view.tsx:104,124,201,256` | Exploded-view labels (mono uppercase) | `caption` |
| `lab-preview.tsx:33` | Section eyebrow "From the Lab" | `caption` |
| `lab-preview.tsx:38` | CTA link | `body` link |
| `lab-preview.tsx:71` | Date label | `caption` (or body, context-dependent) |
| `capabilities.tsx:36` | `<h3>` section eyebrow (mono uppercase) | `caption` (semantic mismatch) |
| `hero/index.tsx:148` | "See the work →" intro CTA | `caption` (currently 11px uppercase; kept stampy) OR `body` link (sentence case, less eyebrow-y) — **Stage 2 decision** |
| `session.tsx:201` | "See the work →" session CTA (mono 13) | `body` link (13px is body-adjacent — flips to 15 on migration) |
| `work/[slug]/page.tsx:64,78,88,101,114,141,160` | Back link, date stamps, chips, category | `caption` (eyebrows) + `body` (back link, prose meta) |
| `work/page.tsx:104,114,151,165,174,190,211` | Eyebrows, CTAs | `caption` + `body` link mix |
| `lab/[slug]/page.tsx:61,73,83,97,119` | Back link, badges, meta | `caption` + `body` link |
| `lab/page.tsx:39,54,67,86,96,106,110,126,139,154,173,185` | Eyebrows, CTAs, badges, nav chevron labels | `caption` (many) + `body` (one or two) |
| `announcement-bar.tsx` (inferred — from Button forge) | Eyebrow mono | `caption` |
| `hero/index.tsx:120,184` | Mobile eyebrow + chat header "Rubric" | `caption` |
| `hero/expansions/margin-text.tsx:24` | Margin eyebrow | `caption` |

**Count of mono call sites that must flip: ~50** (roughly half of all mono usage). The other half (~45) stays as code or tabular data.

**Implication for migration:** Every `font-mono` + uppercase + tracking combo is a caption candidate. The spec can author a `.caption` / `<small>` rule that handles these uniformly, eliminating the per-call `font-mono text-[11px] uppercase tracking-[0.15em]` stamp in favor of a single semantic class.

### Category C — MDX inline mono (article body usage)

| File:line | Context | Decision |
|---|---|---|
| `lib/posts/unblocking-agents.mdx:66` | Inline `<code className="!bg-transparent !p-0 !rounded-none !text-[11px] text-red-400 font-medium">--dangerously-skip-permissions</code>` | This is a `<code>` — mono is correct; but `font-medium` violates Rule 1. Strip `font-medium`. |
| `lib/posts/unblocking-agents.mdx:69` | `<span className="block font-mono text-[9px] text-secondary/40 mt-1.5">Bypasses tool approval prompts</span>` | Sub-caption scaffold; borderline. Could stay mono as figure-scaffold or flip to sans caption. Flag. |
| `lib/posts/unblocking-agents.mdx:76` | `<div className="... font-mono text-[11px] text-primary/60 leading-[1.7]">` | Code-block scaffold rendering a terminal-style content. KEEP mono (terminal = code surface). |
| `lib/posts/unblocking-agents.mdx:94` | Same pattern as `:69` | Same decision. |

## 5. `font-medium` usage — 15 instances across 11 files (all must DELETE)

| File:line | Context | Action |
|---|---|---|
| `app/work/page.tsx:201` | Secondary project `<h3 font-sans text-base font-medium>` | DELETE `font-medium`. `<h3>` inherits `h3` role at weight 400. |
| `blog/primitives-over-pipelines/pipeline-primitives-figure.tsx:148` | Diagrammatic figure pill label | DELETE (figure is mono 400/500; `font-medium` triggers 500 — this IS an allowed mono weight but rule says sans-only 400. Mono here at 500 is a diagram deliberate-weight. Stage 2 decides: carve `.diagram` exception or strip). |
| `case-study-diagrams/safeway-search-loop.tsx:23` | Mono data label in figure | Same decision as above. |
| `case-study-diagrams/gumloop-timeline.tsx:48` | Same | Same. |
| `case-study-diagrams/cal-agent-loop.tsx:18,31,74` | Same | Same. |
| `case-study-diagrams/yic-flow.tsx:31` | Same (template literal with `font-medium` inline) | Same. |
| `lib/posts/unblocking-agents.mdx:66` | Inline `<code>` | DELETE `font-medium`. |
| `lib/posts/unblocking-agents.mdx:78,79,80,81,83,84,85,86` | Inline `<span className="text-primary font-medium">...` emphases inside callout | DELETE — these are inline-emphasis spans in a callout; the visual intent ("this is the important phrase") survives via `text-primary` color alone. If emphasis is load-bearing, Stage 2 can introduce an `<strong>` treatment, but `globals.css:216` already has `article :is(strong, b) { font-semibold }` which would violate Rule 1. **Conflict: Rule 1 says no semibold, but the existing `<strong>` rule uses `font-semibold`. Stage 2 must reconcile.** |
| `blog/claude-code/agent-loop-cards.tsx:49` | `font-bold` on `<p>` | DELETE. |
| `blog/claude-code/system-architecture.tsx:89,111,261` | Inline `<p>` / `<span>` `font-medium` | DELETE. |
| `blog/claude-code/tools-table.tsx:224,243,271,272,273,282` | Table cells and headers (`<th>` / `<td>`) | DELETE — tables keep mono (data) at 400 (not 500). |

**Big finding:** `globals.css:216` has `article :is(strong, b) { @apply text-primary font-semibold }` — this is a pre-existing violation of Rule 1. Stage 2 must decide how `<strong>` renders in article prose. Options: (a) strip `font-semibold` entirely (strong loses weight-based emphasis; only color-emphasis survives — color `text-primary` against `text-secondary` paragraph already gives contrast); (b) keep weight-based emphasis and treat it as a scoped exception for prose; (c) load Matter Medium for this single use (most expensive). Recommended: (a). The warm-paper aesthetic already survives on color contrast — `<strong>` becomes a color-only emphasis, consistent with the rest of the system.

## 6. `font-semibold` / `font-bold` / `italic` — 5 total, all DELETE

| File:line | Context | Action |
|---|---|---|
| `globals.css:216` | `article :is(strong, b) { font-semibold }` | DELETE `font-semibold` (see §5 decision). |
| `blog/claude-code/agent-loop-cards.tsx:49` | `font-bold text-current text-sm uppercase tracking-wide opacity-80` | DELETE `font-bold`. If uppercase-tracking-stamp is the intent, this is `caption` (sans). |
| `app/work/[slug]/page.tsx:138` | `<blockquote className="font-sans text-lg text-secondary italic leading-relaxed">` | DELETE `italic`. Blockquote already has its own left-border + size treatment via `globals.css:219` — italic is decorative and Matter has no italic file. **Would render as faux-italic synthesis; must strip.** |

## 7. Inline-styled `<h1>` / `<h2>` / `<h3>` — 37 instances across 16 files (all COLLAPSE)

This is the headline migration. Every one of these becomes a bare `<h1>` / `<h2>` / `<h3>` (or, for the marquee, `<h1 class="display">`). All className deletes.

| File:line | Element | Current className | New | Notes |
|---|---|---|---|---|
| `contact-form.tsx:40` | `<h1>` | `mt-4 font-normal font-sans text-[clamp(28px,5vw,40px)] text-text-primary leading-tight tracking-tight` | `<h1 class="mt-4">` | Keep margin; everything else is role. |
| `app/components/page.tsx:14` | `<h1>` | `text-4xl` | `<h1>` | Delete class. |
| `app/components/page.tsx:26` | `<h2>` | `text-2xl` | `<h2>` | Delete. |
| `pillars.tsx:16` | `<h3>` | `mb-8 font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]` | `<p class="caption mb-8">` | **Semantic bug fix** — currently `<h3>` used as eyebrow. Change element. |
| `app/components/button/page.tsx:91,124,132,167,191` | `<h1>`/`<h2>` | `text-xl` / `text-4xl` | bare | Delete class. |
| `app/work/[slug]/page.tsx:81` | `<h1>` | `mt-3 font-normal font-sans text-[clamp(36px,6vw,52px)] text-primary leading-tight tracking-tight` | `<h1 class="mt-3">` | Keep margin. |
| `app/lab/[slug]/page.tsx:69` | `<h1>` | `font-normal font-sans text-[clamp(28px,4.5vw,42px)] text-primary leading-tight tracking-tight` | `<h1>` | Delete. |
| `featured-work.tsx:53` | `<h3>` | `mt-3 pr-16 font-sans text-[clamp(22px,3vw,28px)] text-primary font-normal leading-tight tracking-tight` | `<h3 class="mt-3 pr-16">` — **OR** `<h2>` (semantic mismatch — 28px is `h2` scale) | Flag for Stage 2. |
| `exploded-view.tsx:104,256` | `<h3>` | `font-mono text-xs text-secondary tracking-widest uppercase mb-3` | `<p class="caption mb-3">` | Semantic bug fix — currently `<h3>` used as eyebrow. |
| `app/lab/page.tsx:42` | `<h1>` | `mt-4 font-normal font-sans text-[clamp(36px,6vw,56px)] text-primary leading-tight tracking-tight` | `<h1 class="mt-4">` | |
| `app/lab/page.tsx:67,154,185` | `<h2>` | `mb-8 font-mono text-xs text-secondary uppercase tracking-widest` | `<p class="caption mb-8">` | Semantic bug fix. |
| `app/lab/page.tsx:82,136,167,198` | `<h3>` | `font-sans text-lg text-primary font-normal` / `font-sans text-base text-secondary ...` | `<h3>` | Delete class (18px role vs current 18/16 — check if 16 `text-base` should be `h3`). |
| `process.tsx:30` | `<h3>` | `font-mono text-xs text-secondary tracking-widest uppercase mb-4` | `<p class="caption mb-4">` | Semantic bug fix. |
| `app/work/page.tsx:84,107,154,201` | `<h1>`/`<h2>`/`<h3>` | various clamps | bare | Delete (preserve any non-type margin/width classes). |
| `lab-preview.tsx:57` | `<h3>` | `font-sans text-lg text-primary font-normal` | `<h3>` | Delete. |
| `capabilities.tsx:36` | `<h3>` | `font-mono text-xs text-secondary tracking-widest uppercase mb-4` | `<p class="caption mb-4">` | Semantic bug fix. |
| `philosophy.tsx:15` | `<h2>` | `mt-6 font-normal font-sans text-[clamp(28px,5vw,48px)] text-text-primary leading-tight tracking-tight` | `<h2 class="mt-6">` | Keep margin; shrinks from 48→28 upper. |
| `session.tsx:193` | `<h1>` | `font-sans text-[clamp(36px,5vw,64px)] text-primary font-normal leading-[1.1] tracking-tight` | `<h1 class="display">` | Marquee. |
| `hero/expansions/margin-text.tsx:27` | `<h3>` | `text-[18px] text-primary font-normal leading-snug mt-2 tracking-tight` | `<h3 class="mt-2">` | 18px matches role exactly. |
| `cta.tsx:9` | `<h2>` | `font-sans text-[32px] text-primary font-normal` | `<h2>` at `h2` role (22/3vw/28) OR override | **Flag — 32px is bigger than `h2` role.** |
| `hero/index.tsx:112` | `<h1>` | `text-4xl text-primary font-normal leading-[1.1] tracking-tight mb-4` | `<h1 class="display mb-4">` | Mobile marquee. |
| `hero/index.tsx:123` | `<h3>` | `text-base text-primary font-normal leading-snug` | `<h3>` | Delete — 16px `text-base` will become 18px `h3`. Acceptable size bump, or override to retain 16 (Stage 2 decides). |
| `hero/index.tsx:144` | `<h1>` | `text-[clamp(36px,4.5vw,52px)] text-primary font-normal leading-[1.1] tracking-tight` | `<h1 class="display">` | Desktop marquee. |

**Five headings where the element is semantically wrong** — currently `<h3>` used for uppercase mono eyebrow stamps (`pillars.tsx:16`, `exploded-view.tsx:104,256`, `capabilities.tsx:36`, `process.tsx:30`) + three `<h2>` on lab page used as eyebrows (`lab/page.tsx:67,154,185`). These fix to `<p>` or `<small>` during migration. **This is a bonus a11y + SEO fix** embedded in Typography — the outline becomes correct after migration (no more stamps masquerading as headings).

## 8. Stale token references — `text-text-*` orphans (4 files)

- `philosophy.tsx` — uses `text-text-primary`, `text-text-secondary`, `text-text-tertiary`
- `pillars.tsx` — same
- `contact-form.tsx` — same + `focus:border-b-text-secondary`, `placeholder:text-text-tertiary/50`
- `agent-architecture.tsx` — same + `text-bg`, `text-border`, `text-border-hover`, `text-code-green`, `text-surface` (larger stale-token surface)

These references point to tokens that **do not exist** in `globals.css` today. They're rendering as inherited/transparent or browser-default. This is pre-existing drift orthogonal to Typography but surfaces during migration because the className strings have to be rewritten anyway.

**Stage 2 decision:** (a) in-scope — fix during Typography migration (the className is already being rewritten); (b) out-of-scope — spawn a separate task. Recommended: (a). Fixing `text-text-primary` → `text-primary` in the 4 files is a string replace, zero risk.

## 9. Counts summary

| Metric | Count |
|---|---|
| `text-[Xpx]` inline literal sites (all sizes) | ~95 |
| `clamp(...)` inline font-size usages | 11 |
| `font-mono` call sites | ~95 total; ~50 flip, ~45 keep |
| `font-medium` instances (must DELETE) | 15 |
| `font-semibold` instances (must DELETE) | 2 + `globals.css:216` = 3 |
| `font-bold` instances (must DELETE) | 1 |
| `italic` instances (must DELETE) | 1 |
| Inline-styled `<h1>`/`<h2>`/`<h3>` sites | 37 |
| **Semantic mismatches** (`<h3>`/`<h2>` used as eyebrows) | 8 |
| Files where element type changes (h→p/small) | 5–8 (Stage 2 locks) |
| Stale `text-text-*` tokens | 4 files |
| **Unique files touched by migration (core)** | 42 (44 minus layout.tsx + globals.css destination) |

## 10. Migration readiness table (per-file)

Selected high-traffic files. Full per-file list is `44` entries; abbreviated here to 25 largest-impact.

| File | Lines touched (approx) | Change type | Notes |
|---|---|---|---|
| `session.tsx` | 10+ | mixed: `<h1>` → display; `<p>` body; mono data labels KEEP (tabular) | Highest single-file mono-data density (tabular KEEPs). |
| `hero/index.tsx` | 5 | `<h1>` → display (3 branches); `<p>` body; eyebrows → caption | Mobile + desktop branches need same display class. |
| `work/page.tsx` | 10 | `<h1>` → h1; `<h2>`×3 → h2; `<p>` → body; mono → caption+body | Big index-page sweep. |
| `work/[slug]/page.tsx` | 12 | `<h1>` → h1; mono eyebrows → caption; italic blockquote → strip italic | Blockquote italic strip is one-liner. |
| `lab/page.tsx` | 15 | `<h1>` → h1; `<h2>`×3 as eyebrows → `<p class=caption>`; various mono → caption | Biggest semantic-fix file (3 `<h2>` → `<p>`). |
| `lab/[slug]/page.tsx` | 5 | `<h1>` → h1; mono chips → caption | |
| `contact-form.tsx` | 8 | `<h1>` → h1; 5× mono form labels → caption; error text; helper text | Form-label flip = visible design change (mono → sans). |
| `philosophy.tsx` | 3 | `<h2>` → h2 (shrinks 48→28); eyebrow → caption; CTA link | Visible shrink on h2. |
| `pillars.tsx` | 3 | `<h3>` as eyebrow → `<p class=caption>`; 2 CTA links | |
| `featured-work.tsx` | 4 | `<h3>` → h3 OR `<h2>`; eyebrows → caption; CTA link | Semantic ambiguity needs resolution. |
| `process.tsx` | 2 | `<h3>` as eyebrow → `<p class=caption>`; body `<p>` stays | |
| `capabilities.tsx` | 1 | `<h3>` as eyebrow → `<p class=caption>` | |
| `lab-preview.tsx` | 2 | Eyebrow → caption; `<h3>` → h3; CTA link | |
| `cta.tsx` | 1 | `<h2>` at 32px — orchestrator decision | Sizing conflict with h2 role. |
| `exploded-view.tsx` | 4 | `<h3>`×2 as eyebrows → `<p class=caption>`; 2 mono labels | |
| `app/components/page.tsx` | 2 | `<h1>`/`<h2>` → bare | |
| `app/components/button/page.tsx` | 5 | `<h1>`/`<h2>`×multiple → bare | Playground page. |
| `globals.css` | 10+ | ADD: role rules + clamp tokens; STRIP: `font-semibold` from `strong`; CONSOLIDATE: `article h2/h3/p/blockquote/figcaption` | Destination file for all rule authoring. |
| `hero/expansions/margin-text.tsx` | 1 | `<h3>` bare; mono uppercase eyebrow → caption | |
| `hero/expansions/architecture.tsx`, `context.tsx`, `evaluation.tsx` | 10+ | Diagrammatic scaffold — **OUT of scope** per carve-out | Keep literal sizes with `.scaffold` class or document exception. |
| `blog/claude-code/system-architecture.tsx` | 10+ | Mono data (KEEP); `font-medium`×3 → strip | |
| `blog/claude-code/tools-table.tsx` | 6 | `font-medium`×6 → strip on table headers/cells | |
| `blog/claude-code/agent-loop-cards.tsx` | 1 | `font-bold` → strip | |
| `case-study-diagrams/*` (5 files) | 5 | `font-medium` × 5 → strip (or carve `.diagram` weight exception — Stage 2) | |
| `lib/posts/unblocking-agents.mdx` | 10+ | `font-medium`/emphasis spans → strip; scaffold mono mostly KEEP | MDX inline — carefully. |
| `mdx-components.tsx` + `copiable-heading.tsx` | 0 | No change — they render bare `<h1>`/`<h2>`/`<h3>` with `id`. Migration-friendly. | Heading tap-to-copy survives. |

## 11. Recommendations for Stage 2 spec

Concrete, grounded in observed usage. Many of these are pre-agreed by the orchestrator; listed here for Stage 2 to encode.

1. **Encode the 6 roles as `@layer base` rules on raw HTML elements** — `<h1>`, `<h2>`, `<h3>`, `<p>`, `<small>`, `.caption`. Everything inherits.
2. **One escape class for the marquee**: `.display` on `<h1>` overrides `h1` → `display` role. Stage 6 success test: homepage marquee visually identical to today.
3. **Carve out diagrammatic contexts**: add an opt-out class (`.scaffold` or `[data-scaffold]`) for `hero/expansions/*`, `case-study-diagrams/*`, `blog/*/figure.tsx`. These keep mono + sub-typography sizes (8–10px) deliberately. Document: diagrams are not reading surfaces.
4. **Fix 8 semantic heading misuses** (`<h3>` / `<h2>` used as eyebrows): migrate to `<p class="caption">` or `<small>` in process.tsx, pillars.tsx, capabilities.tsx, exploded-view.tsx (2×), lab/page.tsx (3×). This is a free a11y + SEO fix.
5. **Resolve the `featured-work.tsx:53` element mismatch** (`<h3>` at `h2` size) — either make it `<h3>` + `h3` role (18px — significant shrink) or `<h2>` + `h2` role (stays ~28px). Recommend `<h2>` to preserve current visual weight; the card outline reads as a sub-section, not a sub-sub-section.
6. **Resolve `cta.tsx:9` 32px sizing conflict** — `h2` role max is 28px. Three options: (a) upgrade to `<h1>` role with a `.cta-heading` override at 32px fixed, (b) keep `<h2>` at the new 28px (shrinks 4px — probably fine), (c) widen `h2` clamp to 32 (changes all h2 — risky). Recommend (b).
7. **Resolve `<strong>` in article prose** — currently `font-semibold` (Rule 1 violation). Strip weight; emphasis survives via `text-primary` color. Stage 2 decides whether to document this as intentional restraint or flag as regression.
8. **Resolve `figcaption` mono** (globals.css:228) — currently `font-mono text-[9px] text-secondary/40`. Rule 2 says mono for code/data only; figcaption is neither. Flip to sans `caption` (11px — 2px larger — minor visible change) OR document as prose-figure-specific carve-out.
9. **Fix 4 files using stale `text-text-*` tokens** as part of migration. Zero-risk string replace.
10. **Preserve non-type utility classes on migrated elements**: `mt-*`, `mb-*`, `pr-*`, `max-w-*`, `mx-auto`, `text-center` — these are layout, not type. Keep them.
11. **Single typography token export in `@theme inline`** — roles as `--text-{role}-size` / `--text-{role}-tracking` / `--text-{role}-leading` trios, driving the `@layer base` rules. Stage 1-C (token gap audit) proposes exact structure.
12. **Stage 6 computed-style reality check** — for every migrated `<h1>`/`<h2>`/`<h3>`/`<p>`/`<small>`, assert `getComputedStyle(el).fontSize` matches the role's spec value. Button's G2 (silent token death via twMerge collision) is still a live risk on `@theme inline` tokens that reach elements via Tailwind's `text-*` prefix. Typography's solution: rules written at `@layer base` (not Tailwind `text-*` utilities) dodge the twMerge collision entirely. Spec should make this architectural choice explicit.
13. **Migration strategy** — one PR per "tier": (a) author role rules in `globals.css` (no visible change, dormant), (b) migrate heading inline styles → bare elements, (c) flip mono UI labels → sans caption, (d) strip weight/italic violations, (e) delete stale `text-text-*`. Each tier is independently revertable.

## 12. Raw statistics

- **Total direct typography className sites that change:** ~200 (literal sizes + clamps + inline headings + mono flips + weight strips)
- **Unique files that change:** 42
- **Files with only heading inline-style change:** 5
- **Files with only mono → sans flip:** ~12
- **Files with both heading + mono changes:** ~18
- **Files with scaffold carve-out (NO change):** ~8 (hero expansions, case-study diagrams, figure scaffolds)
- **Semantic HTML corrections (h→p/small):** 8 sites across 6 files

ultrathink
