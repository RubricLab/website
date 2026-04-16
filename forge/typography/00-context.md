# Typography — Stage 0 Context Lock

## Mission

Typography is the **type spine** every subsequent component inherits. Button was the lighthouse primitive for interaction polish; Typography is the lighthouse primitive for **reading hierarchy**. If type is right, every page — marketing, blog, case studies, lab index, contact — snaps to the same reading rhythm without a per-consumer className. Every heading, every paragraph, every eyebrow is driven by CSS rules on semantic HTML. Zero inline literal sizes. Zero size variants per level. Type is the contract the rest of the system writes against.

This is also the primitive that **removes code**, not adds it. Button added 29 tokens + one new file. Typography deletes 66+ inline literal-size/clamp declarations across 44 files by replacing them with `@layer base` CSS that targets raw semantic elements. The win is measured in deleted className noise, not added surface.

## Positioning

Rubric's type voice already lives in the codebase implicitly — Matter Regular 400 for every sans surface, JetBrains Mono 400/500 for eyebrows and data, `tracking-tight` on headings, `leading-[1.1]`/`leading-tight` on page titles, `tracking-[0.15em]` uppercase mono for section labels. The problem is not voice; the problem is that voice is re-keyed manually in 44 files with 66+ `text-[XXpx]` literals and 10 `clamp(...)` expressions. Typography's job is to promote that implicit voice to named roles + CSS rules on the raw HTML elements, then delete the per-call-site repetition.

Density matches the rest of the site: Linear-ish body copy (15px), warm-paper contrast (primary black on `#f5f0ec` cream), restraint first (no weight variation, no italic, no decorative type).

## Pre-agreed rules (verbatim)

These are locked by the orchestrator + user. Stage 1 validates against them; Stage 2 cannot re-litigate them.

1. **Matter Regular 400 for all text.** No Medium, no Bold, no Italic. Hierarchy comes from size + space, not weight or style.
2. **Mono reserved for exactly two uses**: code blocks (`<code>`) and technical numeric-data tables (tabular numerics). NEVER for UI labels, eyebrows, links, buttons, headings, or body text.
3. **No `text-[Xpx]` or `clamp(...)` literals inline anywhere.** Every size is a named role (token).
4. **One treatment per semantic HTML element.** `<h2>` always looks like h2 everywhere. No visual variants per level.
5. **No separate `<Heading>` component** — typography is CSS rules on raw semantic HTML elements, not a primitive. You write `<h2>` and get the h2 treatment automatically.

## The 6 type roles

This is the full set, no more, no less. Sizes are locked by the orchestrator; Stage 2 spec may adjust tracking and leading as the authoritative contract, but the HTML mapping and the count are fixed.

| Role       | HTML element             | Size (clamp / fixed) | Tracking   | Weight | Case      |
|------------|--------------------------|----------------------|------------|--------|-----------|
| `display`  | `<h1>` (marquee usage)   | clamp(48, 8vw, 72)   | -0.02em    | 400    | normal    |
| `h1`       | `<h1>` (page title)      | clamp(32, 5vw, 48)   | -0.01em    | 400    | normal    |
| `h2`       | `<h2>` (section)         | clamp(22, 3vw, 28)   | -0.005em   | 400    | normal    |
| `h3`       | `<h3>` (subsection)      | 18                   | 0          | 400    | normal    |
| `body`     | `<p>`                    | 15                   | 0          | 400    | normal    |
| `caption`  | `<small>` / `.caption`   | 11                   | 0.08em     | 400    | uppercase |

**Role differentiation note — `display` vs `h1`.** The HTML element is the same (`<h1>`). The role differentiation is a class override on the single marquee instance (the hero/session `<h1>` on `/`). All other `<h1>` nodes on index pages (`/work`, `/blog`, `/lab`, `/contact`, blog/case-study detail pages) take the `h1` role automatically. Stage 2 locks the exact class name (proposed: `.display` or `[data-type=display]`).

**Line-height proposals (Stage 2 to lock):**
- `display` / `h1`: 1.05–1.1 (tight, matches current `leading-[1.1]` on hero and `leading-tight` on page titles).
- `h2`: 1.15 (one notch looser than `h1` — allows section titles to sit above body without collision).
- `h3`: 1.25 (matches current `leading-snug`).
- `body`: 1.65–1.75 (current prose uses `leading-[1.75]`; current UI body uses `leading-relaxed`).
- `caption`: 1.4 (uppercase mono stamps — tight but not claustrophobic).

**Font-feature-settings proposal (Stage 2 to lock):**
- `body`, `caption`: no features (default rendering is correct).
- `display`, `h1`, `h2`, `h3`: `"kern" 1, "liga" 1, "calt" 1` (sensible defaults; Matter supports them).
- Tabular-numerics (`font-feature-settings: "tnum"`) belongs to the `<code>` / `.tabular` contexts, inherited from the `--font-feature-tnum` token Button already shipped. Not a type role; a data-rendering utility.

## Migration scope

Grepped against HEAD of `forge/typography` (off `dexter/site-rebuild`):

| Pattern | Instances | Unique files |
|---|---|---|
| `text-[Xpx]` literal (where X is 8–32) | 90+ | 34 |
| `clamp(...)` as `text-[...]` | 11 | 10 |
| `font-mono` usage (ALL contexts) | ~95 | 26 |
| `font-medium` | 15 | 11 |
| `font-semibold` | 4 | 3 (globals.css, unblocking-agents.mdx inline) |
| `font-bold` | 1 | 1 (`blog/claude-code/agent-loop-cards.tsx:49`) |
| `italic` | 1 | 1 (`app/work/[slug]/page.tsx:138` blockquote) |
| `<h1>` / `<h2>` / `<h3>` with inline className | 37 | 16 |
| `tracking-[0.15em]` (uppercase eyebrow stamp) | 15 | 11 |
| `font-normal` (defensive override) | 25 | 15 |

**Superset of files touched by typography rule enforcement: 44 unique files.** (grep: `(text-\[\d+px\]|clamp\(|font-mono|font-medium|font-semibold|font-bold|italic|<h[123]\s)` returns 44 distinct hits.) Stage 1-A documents every file with the specific lines and changes required.

**What changes, at a glance:**
- Every `text-[Xpx]` on a sans element becomes the role-class of its semantic parent (or, for spans inside paragraphs, inherits via the `<p>` rule). Most are deleted; the parent element's CSS rule wins.
- Every `clamp(...)` on an `<h1>`/`<h2>`/`<h3>` is replaced by the role token — the clamp lives in `@theme`, not inline.
- Every `font-mono` on a UI label (eyebrow, link, button, row label, meta stamp) flips to Matter — the role is `caption` (uppercase) or `body` (inline), not mono. Stage 1-A categorizes every mono call site into: KEEP (code/data) vs. FLIP (UI eyebrow/label). Pre-flight estimate: ~80–90% of current mono usage is UI-eyebrow and must flip.
- Every `font-medium` / `font-semibold` / `font-bold` / `italic` deletes. Matter loads at 400 only; Mono loads at 400+500. Bold synthesis = rendering bug. Italic = no italic in this system.
- Every inline-styled heading collapses to a bare `<h1>` / `<h2>` / `<h3>`. The only exception is the marquee `<h1>` which gets one class override (`.display` or equivalent).
- Stale `text-text-primary`/`text-text-secondary`/`text-text-tertiary` tokens in 4 files (`philosophy.tsx`, `pillars.tsx`, `contact-form.tsx`, `agent-architecture.tsx`) are orphans from a prior token scheme — they should migrate to `text-primary`/`text-secondary` as part of this pass (Stage 2 decides: in-scope or spawned task).

## Real-context success matrix (Stage 6 target)

Typography passes when, placed in these contexts, Dexter's eye says yes:

1. **Homepage marquee** — `session.tsx:193` `<h1>` renders as `display` (currently `text-[clamp(36px,5vw,64px)] leading-[1.1] tracking-tight`). Same visual impact, zero inline classes.
2. **Index page titles** — `/work`, `/lab`, `/contact`, `/blog` all render their `<h1>` as `h1` role (currently `text-[clamp(36px,6vw,56px)]` or `text-[clamp(28px,5vw,40px)]` — these collapse into one token, with one correct size).
3. **Section headings** — `philosophy.tsx:15`, `featured-work.tsx:53`, `work/page.tsx:107,154` `<h2>` / `<h3>` all inherit section-title treatment automatically.
4. **Process card eyebrow + body** — `process.tsx:30` currently uses `<h3 font-mono text-xs tracking-widest uppercase>` for what is semantically a `caption`. The card's `<p>` body is already `font-sans text-base`. Typography rule-enforcement lands the eyebrow as sans caption (uppercase, 0.08em tracking, 11px), Matter Regular.
5. **MDX article body + headings** — `src/lib/posts/*.mdx` content rendered via `mdx-components.tsx`. Article `<h2>` and `<h3>` today are styled via `article h2` / `article h3` rules in `globals.css:184-196`. These should consolidate to the Typography role tokens (same visual; single source of truth).
6. **Components index (`/components`)** — `app/components/page.tsx:14,26` uses `text-4xl` and `text-2xl` on `<h1>` and `<h2>`. Post-typography, these drop the className entirely.

## Out of scope for v1

- `<Heading>` primitive — decided against. Typography is CSS on raw semantic HTML; no wrapper component exists.
- Variable fonts / variable weight axes — Matter Regular is the one loaded face; no variable axis is being introduced.
- Loading Matter Medium / Matter Semibold / Matter Bold — the rule is Matter Regular only. Bold-display needs would require a separate orchestrator decision and a new font file; not now.
- Italic / oblique faces — not loaded, not used, not coming.
- Type scale beyond the 6 roles — `display`, `h1`, `h2`, `h3`, `body`, `caption`. No `lead`, no `micro`, no `jumbo`. If a need arises Stage 2 must escalate — don't silently add a 7th role.
- Per-variant headings (e.g. `<h2 variant="loud">`) — one treatment per element, period.
- External brand references — grounded in Rubric's existing `dexter/site-rebuild` voice only.
- Figma parity — deferred. Typography is primarily a code refactor consolidating existing visual behavior; Figma catches up in Stage 2 after the code contract is locked. (Button ran Figma in Stage 3-B parallel with code; Typography can defer Figma to a single Stage 3 sweep after tokens land.)
- Tabular-numeric data *component* (the "data table" referenced in Rule 2) — the `--font-feature-tnum` token exists; Typography's role here is to document which contexts get it (`<code>`, `.tabular`). A dedicated DataTable primitive is a separate future forge.
- Color contract for type — already owned by `text-primary` / `text-secondary` tokens. Typography does not re-specify text colors; it specifies size/tracking/leading/case only.

## Stage 1 dispatch plan

**I (this agent) am running all 3 Stage 1 research files inline, not dispatching sub-agents.** The orchestrator's plan is that this single agent produces:

- `forge/typography/01-codebase-usage.md` — codebase usage scan (Agent A role)
- `forge/typography/01-latent-voice.md` — latent voice extraction (Agent B role)
- `forge/typography/01-token-gaps.md` — token gap audit (Agent C role)

Rationale: the pre-agreed scope (6 locked roles, 5 locked rules, fixed HTML mapping, no Heading primitive) is far more constrained than Button's 192-cell variant matrix. Stage 1 here is **validation + inventory**, not exploration. A single-agent pass is correct for the scope and avoids cross-dispatch overhead.

Stage 2 (spec authoring) will be a separate session, running after orchestrator signs off on these four Stage 0+1 artifacts.

---

**Gate status: awaiting Dexter signoff on Stage 0 + Stage 1 artifacts.**

Stage 2 runs on this brief + Stage 1 findings combined. If any of the 5 rules or 6 roles is wrong in intent, correct it before Stage 2 fires.

ultrathink
