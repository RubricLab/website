# Button — Latent Voice Extraction

> Distilled from `dexter/site-rebuild` HEAD. Every claim below is grounded in a file path, line number, or token value. No external brand references.

---

## 1. Color temperature

**Rubric's palette today** (from `src/app/globals.css:3–13` light / `:15–27` + `:42–53` dark):

| Role | Light | Dark |
|---|---|---|
| `--primary` | `black` | `white` |
| `--secondary` | `#666` | `#999` |
| `--background` | `#f5f0ec` | `black` |
| `--negative` | `#222` | `#ddd` |
| `--subtle` | `#0000001a` (black/10) | `#ffffff1a` (white/10) |
| `--accent` | `#dedad7` (black/~9 on bg) | `#1d1d1d` |
| `--accent-foreground` | `black` | `white` |
| `--tint` | `#8a9a9a` | `#7a9090` |
| `--danger` | `red` | `red` |

**What this implies for mood.** The background is not neutral grey — `#f5f0ec` is a desaturated warm cream with a slight pink/beige undertone. Paired with a hard black primary, this is a warm-paper-and-ink aesthetic, not a cool-clinical screen aesthetic. The `--tint` at `#8a9a9a` (light) / `#7a9090` (dark) is a muted sea-foam grey — not blue, not green — that serves as the *only* chromatic accent in the entire system (used at `src/components/featured-work.tsx:54` for eyebrow labels, at `src/app/lab/page.tsx:86` for category pills, and at `hover:border-tint/30` on card lifts in `src/components/process.tsx:24`). The `--accent` at `#dedad7` is the background nudged one step darker — still warm, still paper. There are **zero saturated colors**, zero gradients, zero blues or oranges or purples. Rubric's temperature is: warm paper, hard ink, one whisper of teal-grey — nothing else. A Button must inherit this: no chromatic filled variants, no decorative color, no gradients. Warmth lives in the `background/accent/tint` trio; a Button earns belonging by staying inside that trio.

---

## 2. Motion language observed

Every duration and easing in the repo, cited:

**Durations in active use:**
- `duration-150` — `src/components/cta.tsx:16` (`hover:underline transition-all duration-150`), `src/components/session.tsx:351` (focus fade)
- `duration-200` — overwhelming default. `src/components/footer.tsx:27, 36`; `src/components/philosophy.tsx:29, 32`; `src/components/featured-work.tsx:25, 28, 64, 66`; `src/components/logo-bar.tsx:45`; `src/components/capabilities.tsx:34`; `src/components/contact-form.tsx:54, 98, 110`; `src/app/lab/page.tsx:78, 126, 134, 136`
- `duration-300` — slightly heavier hover lifts on surfaces. `src/components/card.tsx:10`; `src/components/process.tsx:24`; `src/components/featured-work.tsx:39`; `src/components/announcement-bar.tsx:18`; `src/components/nav.tsx:29, 43`; `src/components/hero/index.tsx:139, 154`
- `duration-500`, `duration-700`, `duration-1000` — reserved for animated diagrams (`src/components/blog/...`, `src/components/session.tsx:279`). Never on interactive chrome.

**Easings in active use:**
- Default CSS easing (implicit) — most `transition-colors` / `transition-all` lines use no explicit easing.
- `ease-out` — `src/components/session.tsx:279` (progress bar), globals keyframe animations at `globals.css:344, 408, 445`.
- `ease-in-out` — `src/components/collapsible.tsx:40`; `src/components/table-of-contents.tsx:42`; diagram pieces.
- `cubic-bezier(0.25, 0.1, 0.25, 1)` — `src/components/fade-in.tsx:16` (viewport fade-in: `duration: 0.5, ease: [0.25, 0.1, 0.25, 1]`). This is the signature scroll-reveal curve.
- `cubic-bezier(0.4, 0, 0.2, 1)` — `src/components/hero/index.tsx:168` (chat panel centering). Material-style standard-ease.

**Keyframes declared** (`src/app/globals.css:425–476`):
- `blink` — `1.06s step-end infinite` (cursor caret, `src/components/hero/chat/user-message.tsx:13`)
- `fadeIn` — `300ms ease-out forwards` — opacity+4px translate
- `bounce-gentle` — `1.5s ease-in-out infinite` — 4px travel
- `scroll-trace`, `scroll-logos` — marquee loops
- `shimmer` — `1.5s ease-in-out infinite` on skeleton states
- `pulse-dot` — 0.2/1/0.2 opacity with 0.8–1.2 scale, used on the thinking indicator (`src/components/hero/chat/reasoning-trace.tsx:15`)

**What emerges.** Rubric has a **two-pace motion system**: interactive chrome (hover, focus) moves at **200–300ms with CSS-default easing**; narrative / reveal content moves at **300–500ms with a shipped-aware out-curve**. Nothing on chrome exceeds 300ms. There is no spring, no bounce, no overshoot in interaction — `bounce-gentle` exists only as a decorative loop. Every chromed interaction uses *color transition*, not *transform transition* (one exception: `translate-x-0.5` on hover arrows at `philosophy.tsx:32`, `featured-work.tsx:28, 66`, a 2px nudge). A Button here cannot scale, cannot lift with shadow, cannot bounce. It can tint. It can nudge its arrow ~2px. That is the entire motion alphabet available to it.

---

## 3. Radius vocabulary

Every radius value observed:

- **`rounded-full`** (9999px) — buttons today (`src/components/button.tsx:4, 5, 10`), announcement bar (`src/components/announcement-bar.tsx:21`), scroll thumb (`globals.css:130`), input (`globals.css:109`), citation chips (`src/components/hero/index.tsx:244`), logo pulse (`exploded-view.tsx:128`), heartbeat dot (`hero/index.tsx:187`).
- **`rounded-3xl`** (24px) — textarea (`globals.css:113`).
- **`rounded-2xl`** (16px) — chat bubbles (`hero/chat/user-message.tsx:10` with `rounded-br-sm` asymmetric corner), chat input (`hero/chat/chat-input.tsx:14`).
- **`rounded-xl`** (12px) — the dominant card radius. Cards, work tiles, process cards, MDX asides, video frames, code blocks. `src/components/card.tsx:10`; `src/components/process.tsx:24`; `src/components/featured-work.tsx:39`; `globals.css:178, 222, 259`; `src/components/hero/index.tsx:119, 172`.
- **`rounded-lg`** (8px) — denser containers, inline badges. `src/components/capabilities.tsx:34`; `src/components/agent-architecture.tsx:78`; case-study diagrams; inline link boxes at `src/app/lab/[slug]/page.tsx:95`.
- **`rounded-md`** (6px) — code inline (`globals.css:218`), copy-block button (`src/components/blog/copy-block.tsx:28`), small dense pills in figures.
- **`rounded`** (4px, the Tailwind default) — `src/components/button.tsx:7` (icon variant), tiny tag `src/app/lab/page.tsx:86`.
- **`rounded-sm`** (2px) — `user-message.tsx:10` asymmetric corner on bubble.
- **Scaffold rx**: `rx={4}` hardcoded in SVG at `src/components/hero/scaffold.tsx:86, 104`.
- **`rounded-custom`** — `--radius-custom: 1.625rem` (26px), `globals.css:65`. Used on nav's curved inner corners (`rounded-br-custom`, `rounded-bl-custom` at `nav.tsx:29, 43`) and `collapsible.tsx:23`, `table-of-contents.tsx:26`. **This is the signature macro-radius** — the architectural corner.

**Nesting observed.** Card (rounded-xl = 12px) with internal badge (rounded = 4px). 12 − 8 padding = 4 — a 4px nested radius reads correctly. Chat input (rounded-2xl = 16px) with 14px horizontal padding at `hero/chat/chat-input.tsx:14` — nesting a 4–6px inner element would read true. Process card (rounded-xl 12px, p-8 = 32px) — a 6px inner control nests cleanly. **The scale already implies a control-sized radius step around 4–6px that does not yet exist as a named token.** Today, when a button sits inside a card, it is forced to pick `rounded-full` (visually wrong inside a squarer container) or `rounded` (too crisp — loses the warm-paper softness). Button's missing radius sits squarely in the 6px gap that everything else in the system has already framed around.

---

## 4. Border & surface treatment

**Borders.** Rubric is a hairline-border culture. Near-universal pattern: `border border-subtle` — that is, 1px at `--subtle` = `#0000001a` / `#ffffff1a` (10% opacity on theme-appropriate ink). Examples: `src/components/card.tsx:10`; `src/components/process.tsx:24`; `src/components/featured-work.tsx:39`; `src/components/announcement-bar.tsx:21`; `src/components/hero/index.tsx:119`; MDX aside at `globals.css:178`; codeblock at `globals.css:222`; scaffold guide lines at `0.75` stroke-width at `scaffold.tsx:89, 105`. Input uses the same at `globals.css:109`.

**Hover border treatment.** The consistent upgrade is `hover:border-tint/30` — e.g. `src/components/process.tsx:24`, `src/components/featured-work.tsx:39`, `src/app/lab/page.tsx:165`. Not a new color — the teal-grey accent at 30% opacity. This is the system's *lift* signal on a surface.

**Shadows.** Conspicuously minimal. Three shadow values exist in the entire repo:
1. `shadow-sm` — on the announcement bar (`announcement-bar.tsx:21`).
2. `shadow-[0_1px_12px_-4px_rgba(0,0,0,0.06)]` — on hover of cards (`process.tsx:24`, `featured-work.tsx:39`, `app/lab/page.tsx:165, 196`, `app/work/page.tsx:137`). 1px y-offset, 12px blur, 4px spread inward, 6% black. Tiny.
3. `shadow-[0_2px_24px_-4px_rgba(138,154,154,0.12)]` — one deeper variant on featured work page (`app/work/page.tsx:95`). Tinted with `--tint` (138,154,154 is `#8a9a9a`). 12% opacity. Still gentle.

**No inner highlights. No etched bevels. No neumorphism. No ring.** The heartbeat dot at `src/components/hero/index.tsx:186` uses `animate-ping` — the only glow-like effect in the system, and it is scoped to a 1px live indicator, not a chrome decoration.

**Surface stacking.** The canonical Rubric surface is `bg-accent/40` + `border border-subtle` — a warm tinted card on a warmer background, separated by a 10%-opacity hairline. `src/components/process.tsx:24`; `src/components/featured-work.tsx:39`; `src/app/lab/page.tsx:165, 196`; `src/app/work/page.tsx:95, 137`. `bg-accent/60` and `bg-subtle/10` appear as lower-ink variants for chat bubbles and diagrams. `bg-background/80 backdrop-blur-sm` is reserved for floating chrome (announcement bar only). The pattern: **a surface lifts by *tinting warmer and showing a slightly stronger border*, not by dropping a shadow.**

**What this implies for Button.** The existing `Button` uses `bg-subtle` — literally 10% ink — which is gentle but reads as a passive dimmer, not as the *primary* action of a system whose `--primary` is pure black. Rubric's dominant chrome-lift vocabulary is: tinted warm fill + hairline border + a teal-grey border hover. Primary Button should break from that pattern (a filled primary surface with no border, since the surface *is* the emphasis). Secondary/ghost/link must inherit the hairline-and-warm-fill vocabulary so they read as siblings of Card.

---

## 5. Type vocabulary

**Fonts loaded** (`src/app/layout.tsx:9–18`):
- **Matter** (local WOFF, weight 400 only) → `--font-matter` → `--font-sans`.
- **JetBrains Mono** (Google, weights 400 and 500) → `--font-mono`.

No extra weights loaded. Matter is regular-only; **there is no bold sans** in this system. Headings use `font-normal` explicitly to defend against user-agent bold (`globals.css:135, 140`; `src/components/hero/index.tsx:112, 123, 144`; `src/app/work/page.tsx:84, 107`). Emphasis inside articles uses `font-semibold` (`globals.css:158`) — but that requires Matter Semibold, which is not loaded, so browsers synthesize it. **In practice, nothing on a core UI path is bolder than 500.**

**Sans size observations** (from chromed UI, not prose):
- `text-xl` (20px) — wordmark (`nav.tsx:36`)
- `text-lg` (18px) — lead paragraphs
- `text-base` (16px) — body
- `text-[15px]` — article prose (`globals.css:154`), hero subhead (`hero/index.tsx:145`)
- `text-sm` (14px) — default button md (`button.tsx:15`), footer links
- `text-[13px]` — signature micro-UI size: contact-form submit button (`contact-form.tsx:106`), user message (`hero/chat/user-message.tsx:11`), chat input (`hero/chat/chat-input.tsx:19`), philosophy link (`philosophy.tsx:29`)
- `text-xs` (12px) — dense meta
- `text-[11px]` — the eyebrow size used system-wide: announcement bar (`announcement-bar.tsx:24`), all mono eyebrows (`featured-work.tsx:20, 54`; `philosophy.tsx:11`; `pillars.tsx:16`; `contact-form.tsx:35`), citation chips (`hero/index.tsx:244`)
- `text-[10px]` — smallest UI label still in use (`hero/expansions/margin-text.tsx:24`)
- `text-[9px]`, `text-[8px]` — diagrammatic code labels inside the hero scaffold

**Tracking.** Every uppercase eyebrow uses `tracking-[0.15em]` or `tracking-widest` (≈ 0.1em). Every heading uses `tracking-tight`. Body uses default. **Uppercase-mono-eyebrow at `tracking-[0.15em]` is the single most repeated typographic gesture in the codebase** — 20+ occurrences.

**Leading.** Headings `leading-tight` / `leading-[1.1]`. Body `leading-relaxed` / `leading-[1.75]`. Dense UI `leading-none` / `leading-snug`.

**Font feature settings.** None declared. No `tabular-nums`, no OpenType `cv01`/`ss01` feature toggles anywhere. `-webkit-font-smoothing: antialiased` / `-moz-osx-font-smoothing: grayscale` are on `html` (`globals.css:82–83`). **This is a gap** for a Button that needs to render a digit count without shifting (loading state, keyboard-hint badges in v2+).

**What this implies for Button.** The label range for Button labels is **13px → 15px** — that exact band. Weight is 400 (Matter Regular is all there is). Going 500 means switching to JetBrains Mono (not appropriate for a default label) or synthesizing bold. The existing prose "button-adjacent" elements all run 13px. A Button at 14px / 500 (as the context locks) is already one click more assertive than what the rest of the system does; that is fine for a canonical primary, but it means Button must not overreach in *size* or *tracking* or it will feel louder than every other CTA on every page today.

---

## 6. Existing button-adjacent patterns

Every clickable/CTA-like gesture, categorized:

**Inline link arrows** (the single most common CTA shape):
```
<Link ... className="group inline-flex items-center gap-2 ...
    transition-colors duration-200 hover:text-primary">
  <span>Copy</span>
  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
</Link>
```
Examples: `philosophy.tsx:27–35`; `featured-work.tsx:23–32, 64–69`; `pillars.tsx:48, 73`; `lab-preview.tsx:38`; `app/lab/page.tsx:54, 162`; `app/work/[slug]/page.tsx:64, 160`. Pattern: mono 12–13px secondary text → primary on hover, arrow translates 2px right. **No surface. No border. Pure text + motion.** This is Rubric's "link" variant shape today.

**Pill-framed CTAs** (only two instances, both warm-paper-nudged):
- Announcement bar (`announcement-bar.tsx:21`) — `rounded-full border border-subtle bg-background/80 backdrop-blur-sm px-5 py-2 shadow-sm`. 11px secondary text. No state change on the surface; text color shifts.
- Contact-form submit (`contact-form.tsx:106`) — `rounded-full border border-border bg-surface/50 px-5 py-2.5 font-mono text-[13px] text-text-primary transition-all duration-300 hover:border-border-hover hover:bg-surface`. Mono 13px primary text. Border and bg both lift on hover. 300ms. *(Note: `border-border` and `bg-surface` are references to a token scheme that does not exist in `globals.css` — likely dead code or a different branch's tokens. Treat as drift, not pattern.)*

**Current Button component** (`src/components/button.tsx`):
- 5 variants: `default | ghost | icon | outline | link`.
- Bg on default/ghost is `bg-subtle` (10% ink) with hover going to 20% ink.
- Outline is `border-subtle border` with hover border at 20% ink.
- Focus is `focus:ring` on `ring-secondary` — a native outline relying on the browser's default ring width, colored to a mid-grey. No offset declared.
- All variants collapse to `rounded-full` (except icon → `rounded`, link → none).
- Sizes: `sm p-2 px-4 text-xs`, `md p-3 px-6 text-sm`, `lg p-4 px-8 text-base` — heights approximately 28/40/52px. No xs. Much taller than the target density.
- Transition: `transition-all` — broad; no specific duration, no easing.

**Nav link** (`nav.tsx:49–58`): plain Link, inherits globals.css `a:not(:has(button)) { text-secondary, hover:text-primary, transition-colors }`. No surface. No padding hit-target.

**Footer link** (`footer.tsx:34–43`): same shape — `text-secondary hover:text-primary transition-colors duration-200`.

**Hero intro CTA** (`hero/index.tsx:148`): `inline-flex items-center gap-2 mt-6 text-[11px] text-secondary hover:text-primary transition-colors tracking-wide uppercase` + `→`. An uppercase-mono treatment of the arrow pattern.

**What's consistent vs. what varies.**
- **Consistent:** text-secondary → text-primary on hover; 200ms `transition-colors`; arrow-nudge 2px; no surfaces on inline CTAs; 11–13px sizing; mono for eyebrow-CTAs, sans for in-prose CTAs.
- **Varies:** radius (rounded-full on pills, none on inline); border presence (none, hairline, or hairline-tint on hover); font-family (mono dominant on CTAs, sans on in-prose); height/padding (no coherent scale — today's Button jumps 28→40→52).

The button-shaped surface patterns that *do* exist all use: warm tinted fill + hairline border + 300ms color/border transition + optional arrow translate 2px. That is the blueprint to inherit.

---

## 7. What this implies for Button — ten inferences

Each inference: a concrete claim, evidence from the repo, and what Stage 2 spec should do with it.

---

**Inference 1 — Radius nests at 4–6px, not at full or at 2px.**
- EVIDENCE: Card = `rounded-xl` (12px) at `card.tsx:10`; Process card = `rounded-xl` + `p-8` at `process.tsx:24`; the scaffold itself draws component boxes at `rx={4}` at `scaffold.tsx:86, 104`; inline tag at `app/lab/page.tsx:86` uses `rounded` = 4px. The 4–6px window is already the "nested inside a card" radius everywhere except Button, which uses `rounded-full`.
- APPLICATION: Lock `--radius-control` at **6px** as the Button radius, and validate nesting math (card 12px − internal padding 6px = 6px inner; card 16px − 10px = 6px). Drop all `rounded-full` usage on Button variants.

---

**Inference 2 — Button's label sits at 13–14px, not 16px.**
- EVIDENCE: The `text-[13px]` dominant micro-UI band (`contact-form.tsx:106`, `hero/chat/user-message.tsx:11`, `hero/chat/chat-input.tsx:19`, `philosophy.tsx:29`, `app/lab/page.tsx:162`) vs. current Button md at `text-sm` (14px) and lg at `text-base` (16px). Nothing on the site UI today reaches `text-base` for a CTA label.
- APPLICATION: Size md = 14px (matches the default CTA band), lg = 15px (one step up, still restrained), sm = 13px (matches 13px CTAs already deployed), xs = 12px (matches eyebrow size).

---

**Inference 3 — Weight 500 comes from mono, not sans.**
- EVIDENCE: `layout.tsx:9–18` — Matter loaded at regular only; JetBrains Mono loaded at 400 and 500. No bold sans variant exists.
- APPLICATION: Stage 2 must either (a) introduce Matter Medium to the font loader for the Button label 500-weight promised in context, or (b) use weight 400 for sans labels and reserve weight 500 for mono-flavored variants (loading text, kbd badges later). **Flag as token-layer prerequisite** — not decidable without a font-loading decision.

---

**Inference 4 — Motion on chrome stays under 300ms and uses color, not transform.**
- EVIDENCE: `transition-colors duration-200` occurs ≥15× across `footer.tsx`, `philosophy.tsx`, `featured-work.tsx`, `pillars.tsx`, `lab/page.tsx`, `work/[slug]/page.tsx`. `transition-all duration-300` is reserved for surface lifts on cards. No `transition-transform` on chrome except a 2px arrow nudge.
- APPLICATION: Button hover bg/border transition = **200ms, CSS-default ease** (matches existing chrome) OR 150ms out-cubic (matches context-lock "duration-fast"). Active scale 0.98 is borderline — it is NOT a pattern the codebase already uses; only the `scale-95` occurrence at `permissions-trap-figure.tsx:228` exists, and that is a diagram tile animating on reveal, not a chrome press-down. **Recommend Stage 2 validate whether active scale-0.98 introduces a gesture Rubric's voice does not currently use.** If retained, keep it ≤50ms and out-expo as context specifies.

---

**Inference 5 — Arrow translate 2px on hover is an inherited mannerism, not an option.**
- EVIDENCE: `philosophy.tsx:32`, `featured-work.tsx:28, 66`, `pillars.tsx:51, 76`, `app/lab/page.tsx:57`, `app/work/[slug]/page.tsx:66, 162`, `app/lab/[slug]/page.tsx:63, 121`, `contact-form.tsx:110`. Every CTA with a trailing arrow nudges it `translate-x-0.5` (2px) on `group-hover`.
- APPLICATION: When a Button has a `trailingIcon`, Stage 2 spec should make the 2px nudge the *default* behavior (not opt-in). It is the single most repeated micro-interaction in the codebase; a Button that omits it will read as foreign.

---

**Inference 6 — Hairline border + tint-hover is Rubric's "lift an element off the page" move.**
- EVIDENCE: `hover:border-tint/30` on `process.tsx:24`, `featured-work.tsx:39`, `app/lab/page.tsx:165, 196`, `app/work/page.tsx:95, 137`, `pillars.tsx:15`. Every card in the system lifts this way.
- APPLICATION: Secondary Button's hover state should use `border-tint/30` not a new bespoke color. This means one of the required border-hairline tokens must have a hover twin that resolves to `--tint` @ 30%. Ghost Button's hover bg should tint with the same warm-accent family — not a cool grey.

---

**Inference 7 — Warm-paper background forbids saturated fills.**
- EVIDENCE: Every non-black, non-grey color in `globals.css:3–13, 15–27` is either the paper `#f5f0ec`, the paper-one-step-darker `#dedad7`, or the single teal-grey `#8a9a9a`. `--danger` is `red` but appears only in `contact-form.tsx:92` error text — never as a surface. Zero other saturated colors exist.
- APPLICATION: Primary Button fill = `--color-primary` (pure black in light, pure white in dark). Destructive intent is explicitly out of scope in context. Stage 2 must not introduce any named blue/green/orange/purple intent; the entire brand spine is monochromatic-plus-tint.

---

**Inference 8 — Focus ring must coexist with the hairline-border vocabulary without reading as "browser default."**
- EVIDENCE: Today's Button uses `focus:ring` on `ring-secondary` (`button.tsx:40`) — this draws a 3px default Tailwind ring in mid-grey with no offset. Input focus uses `focus:border-secondary/50` (`globals.css:109`) — border-color-only, no ring. There is no 2px-ring + 2px-offset pattern anywhere in the codebase yet.
- APPLICATION: Stage 2 introduces `--color-focus-ring` + 2px ring + 2px offset as a **new** token — the codebase has no precedent, so it must be authored deliberately. Ring color should be primary (not secondary) since primary-text-on-warm-bg is already the attention hierarchy; ring contrast math: primary-black vs. `#f5f0ec` easily clears 3:1.

---

**Inference 9 — Primary Button's filled black surface is a rare gesture, not the norm.**
- EVIDENCE: Searched for primary-background chrome: only `bg-primary` appears on the tiny heartbeat dots (`hero/index.tsx:186–187`, `exploded-view.tsx:128–129`), on the scroll-progress bar (`hero/index.tsx:281`), on chat accent fill at 4% (`primitives-over-pipelines/pipeline-primitives-figure.tsx:247`), and on a dropdown menu surface in a blog figure (`blog/claude-code/system-architecture.tsx:233`). **No CTA or chrome element on the main site currently fills with `bg-primary`.**
- APPLICATION: Primary Button will be the highest-contrast element on most pages it ships into. This is correct for a "canonical confirming action" but it means the spec must be disciplined about when `primary` is used. The default in ambient contexts (in-card, nav) should be `secondary` or `ghost`; `primary` is reserved for the confirming moment (Hero CTA, CTA section, form submit). Stage 2 should clarify this usage rule and Stage 3 should wire defaults accordingly.

---

**Inference 10 — Inline-link CTA today has no explicit underline; underline is prose-only. Link variant must not invent one.**
- EVIDENCE: `globals.css:148–150` defines `article a:not(:has(button)) { underline underline-offset-3 decoration-1 }` — scoped to `article` prose. Outside articles, CTAs are colorshift-only (`globals.css:103–105`: `a:not(:has(button)) { text-secondary hover:text-primary transition-colors }`). `cta.tsx:16` uses `hover:underline` inline. The hero intro CTA at `hero/index.tsx:148` uses no underline.
- APPLICATION: Link variant Button in prose contexts gets the `underline-offset-3 decoration-1` treatment (inherit article style). Link variant Button outside prose is color-shift only with optional arrow nudge. Stage 2 should spec two presentation modes for `link` keyed off context, or accept that this is the one variant whose styling is context-dependent and document that clearly.

---

## 8. Anti-patterns (what does NOT belong in a Rubric button)

Five specific "would feel foreign" calls, each grounded in what the codebase does NOT contain.

---

**Anti-pattern 1 — Neon glow, halo, or box-shadow spread larger than 24px.**
Rubric's entire shadow vocabulary is three values, none exceeding `0_2px_24px_-4px` (`app/work/page.tsx:95`), and only one of those is tinted. There are **zero glow effects**, **zero `filter: drop-shadow` usages on interactive elements**, and the only `animate-ping` instance is scoped to a 1px-diameter heartbeat dot (`hero/index.tsx:186`). A Button with a glow ring, a hover halo, or a shadow greater than 4px blur would dominate every page it shipped into.

**Anti-pattern 2 — Gradient fills, on any variant.**
`linear-gradient` appears **only** inside `.visual-placeholder` skeleton loaders (`globals.css:479, 488`) and `.animate-shimmer` (`globals.css:468`) — both diagnostic/loading surfaces, never chrome. Zero production UI elements use a gradient. A gradient Button — even a subtle one — would be the only gradient in the product.

**Anti-pattern 3 — Sans-serif label at weight 600 or 700.**
`layout.tsx:9–12` loads Matter at `regular` only. Every sans heading explicitly uses `font-normal` (`globals.css:135, 140`; `hero/index.tsx:112, 123, 144`). A bold Button label would either trigger browser-synthesized faux-bold (visible rendering artifact against the antialiased paper) or require adding a new font weight that does not exist today. Hard no until Stage 2 reconciles the font-weight gap explicitly.

**Anti-pattern 4 — Saturated intent colors (blue confirm / green success / amber warn).**
The palette (`globals.css:3–13`) contains exactly one chromatic token: `--tint: #8a9a9a` — a desaturated teal-grey. No blue, no green, no amber, no purple exist as semantic colors. `--danger: red` exists but appears only in one error-text location, never as a surface. A Button variant styled "confirm blue" or "success green" would introduce a color the codebase has never contained.

**Anti-pattern 5 — Snappy-spring bounce or overshoot on press-down.**
Every easing used on chrome is either CSS-default, `ease-out`, or `ease-in-out`. The one declared cubic-bezier on chrome is `cubic-bezier(0.4, 0, 0.2, 1)` (`hero/index.tsx:168`) — no overshoot. The "snap" keyword in context implies an `out-expo` press — acceptable if contained — but anything with `cubic-bezier(x, y, 1.5, ...)` or spring physics (overshoot > 1) would be the only bouncy interaction in the product.

---

## 9. Distilled brand voice for Button

Warm paper, hard ink. The Button earns belonging by staying inside Rubric's existing palette: `#f5f0ec` cream, `black` type, `#dedad7` accent lift, `#8a9a9a` tint on hover, hairline border at 10% ink. Motion is brief and color-forward — 200ms transition-colors, a 2px arrow nudge, nothing louder. Radius nests at 6px so it sits correctly inside the 12–16px card vocabulary the rest of the system already uses. Labels sit at 13–14px, regular weight, tracking-normal. No glow, no gradient, no saturated intent, no bold. Restraint is not a constraint on the Button — it is the Button.

*(95 words.)*

---

ultrathink
