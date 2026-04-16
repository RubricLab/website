# Component Forge — The Rubric Pipeline

**Version: 1.1** (bumped 2026-04-16 after Button forge first run — see Postmortem below.)

A named, gated, parallelized recipe for building polished components. Runs identically for every primitive. Evolved at Stage 8 of each run.

## Principle

Low LOC. All components. Pixel parity Figma ↔ code. Tokens not magic numbers. Polish vocabulary — radius nesting, surfaces, borders, type rhythm, motion easings, states, brand — is first-class in every decision. No external brand references.

## The 8 stages

| # | Name                      | Width         | Output                                                   | Gate                   |
|---|---------------------------|---------------|----------------------------------------------------------|------------------------|
| 0 | Context Lock              | 1 (me + you)  | `00-context.md`                                          | YOU sign off           |
| 1 | Reference Scan            | ×3 Opus ∥     | `01-codebase-usage.md` / `01-latent-voice.md` / `01-token-gaps.md` | YOU pick anchors |
| 2 | Spec Authoring            | 1 Opus deep   | `02-spec.md` (anatomy · variants · prop API · states · tokens · a11y · **consumer reality check**) | YOU sign off — this is the contract |
| 3 | Parallel Build            | ×2 Opus ∥ (worktrees) — **confirmed genuinely parallel post-Button** | Code diff + Figma node refs                      | I verify parity        |
| 4 | Critic Panel              | ×3 Opus ∥     | `03-critique-polish.md` / `03-critique-impl.md` / `03-critique-brand.md` → synthesized `03-revision-plan.md` | YOU review plan |
| 5 | Polish Pass               | 1 Opus + loop | Revised code + Figma (loop S5↔S4, max 3)                | All critics ≤ minor    |
| 6 | Real-Context Validation   | 1 Opus + preview | `06-context-shots.md` — **screenshots + computed-style DOM inspection + consumer existence audit** | YOU sign off |
| 7 | Code Connect + Merge      | 1 Opus        | `<component>.figma.tsx` + squash-merge to `dexter/site-rebuild` | YOU merge      |
| 8 | Postmortem                | 1 Opus        | Append learnings to this `RECIPE.md` + templates        | —                      |

## Dispatch standards

Every Opus agent call in this pipeline MUST:
- Pass `model: "opus"`
- Append the literal keyword `ultrathink` in the prompt
- Use `isolation: "worktree"` for any role that touches files
- Inherit `max` effort from the session (via `CLAUDE_CODE_EFFORT_LEVEL=max` env var set in `~/.claude/settings.json`)
- Receive a brief constructed from `forge/templates/role-brief.template.md`

When a stage width is ≥ 2, all agents are dispatched in a **single message with multiple Agent tool uses** — genuine parallel execution, never serial. Button run confirmed Stage 3-A (code) and Stage 3-B (Figma) dispatch cleanly in parallel with no cross-dependency stalling.

## Critique rubric

Every critique artifact scores the component against a fixed rubric. Each finding is `{dimension, severity, location, fix}`.

**Polish dimensions (7):** radius nesting · surfaces · borders · type rhythm · motion · states · brand.
**Implementation dimensions (4):** LOC · accessibility · semantics · performance.
**Token plumbing dimension (added v1.1):** for every declared token, verify it flows through `cn() → twMerge → Tailwind v4` correctly. Silent class-merger conflicts (e.g. `text-[var(--text-label-*)]` colliding with `text-[var(--color-*)]`) are a shipping-broken failure mode — see Failure modes below.

Severity: `major | minor | nit`. Stage 5 loops until no `major` remains.

## Stage 2 — Consumer reality check (added v1.1)

Spec authoring MUST include a "consumer reality check" section listing each real-context usage (§10 in the Button spec). For each, verify:
1. Does the consumer EXIST in the codebase today?
2. If yes, will migration touch it? (Reference § migration-map.)
3. If no, is spec declaring a NEW consumer or flagging a GAP?

Any "no + no" cell is a red flag — the spec is specifying a proof that won't exist when Stage 6 runs. Button run hit this with `G4` (no card-nested consumer existed; spec expected the proof to live in an already-migrated `process.tsx`, which had no Button inside). Stage 2 now flags this at spec-authoring time, not at Stage 6 surprise.

## Stage 6 — Computed-style + consumer audit (added v1.1)

Stage 6 MUST capture runtime computed styles for every `[data-*]` attribute the spec locks, not just visual screenshots. Button run demonstrated two silent defects that screenshots alone could not detect:
- `font-size` rendering at default 16px because `twMerge` dropped `text-[var(--text-label-*)]` behind `text-[var(--color-*)]` (G2).
- Icon components silently dropping `data-slot` due to prop-filter destructure, causing arrows to render at 0×0 (G1).

Mandatory Stage 6 DOM checks:
1. Query every `[data-intent]` (or equivalent dimension attribute) and log `fontSize`, `height`, `width`.
2. For every declared slot (`[data-slot="trailing-icon"]`, etc.), assert the attribute is present on the DOM node AND the size-selector CSS matches.
3. Audit the `globals.css` scanner config — Tailwind v4 candidate-class scans of `forge/*.md` wildcards can silently corrupt the generated stylesheet (Button hit this; fix: `@source not "../../forge"`).

## Checkpoint summaries

At every gate I deliver a 1-screen summary to you: what was produced (links), key decisions made, where creative direction is needed. You never need to read every agent output — only the synthesis.

## Artifact tree

```
forge/
  RECIPE.md                    ← this file, evolved per run
  templates/
    role-brief.template.md     ← brief all agents receive
  button/
    00-context.md
    01-codebase-usage.md
    01-latent-voice.md
    01-token-gaps.md
    02-spec.md
    03-critique-polish.md
    03-critique-impl.md
    03-critique-brand.md
    03-revision-plan.md
    06-context-shots.md
  heading/
    ...
```

## Branch discipline

- Component branch: `forge/<component>` off `dexter/site-rebuild`.
- One commit per stage (Stage 8 may be squashed into Stage 7 merge).
- Stage 7 squash-merges back into `dexter/site-rebuild`.

## Failure modes

- Critic returns `major` 3 iterations in a row → escalate to you.
- Stage 6 placement fails → back to Stage 5, one iteration allowed, then escalate.
- Figma plugin disconnects → halt, request reconnect (I cannot recover this silently).
- Code doesn't compile → back to Stage 3 implementer, with critic report appended.
- **Silent token death via class-merger conflict (added v1.1)** — when two token-driven classes share a Tailwind prefix (e.g. `text-*`), `twMerge` silently keeps only the latter. Example from Button run: `text-[var(--text-label-xs)]` (font-size) dropped behind `text-[var(--color-primary)]` (color); all buttons rendered at inherited 16px. Screenshots did not reveal it; only computed-style DOM inspection caught it. **Guard**: Stage 6 must run computed-style DOM checks (see Stage 6 section above). **Remediation pattern**: use bracket-property syntax (`[font-size:var(--text-label-xs)]`) to escape the `text-*` merge namespace.
- **Icon prop-drop (added v1.1)** — `React.cloneElement({ 'data-slot': … })` silently fails when the target icon component destructures only `className` in its props signature. Guard: Stage 6 asserts `data-slot` on DOM via computed check. Remediation: all icon components in `src/components/icons/` must spread `{...rest}` onto the root SVG.
- **Tailwind v4 candidate-scan leakage (added v1.1)** — `forge/*.md` files can be scanned by Tailwind v4 as candidate classes, generating invalid rules from documentation examples. One-time infra fix: `@source not "../../forge"` in `globals.css`. Generalize: any doc directory containing `[value:token]`-style examples must be scanner-excluded.

## What this pipeline is NOT

- Not a green-field redesign engine — every component is grounded in existing `dexter/site-rebuild` state.
- Not a reference-copying machine — no external brand refs. Latent Rubric voice extracted via Stage 1-B.
- Not silent — every gate surfaces a summary for creative direction.

---

## Postmortem — Button forge (first run)

### Outcome

**Yes — Button shipped at the polish bar we set.** All 6 polish dimensions land (radius nests at 6px proven via process.tsx, hairline + tint/30 hover signal threaded, Matter-regular preserved, 2px arrow nudge primitive-owned, focus-visible ring authored deliberately, warm palette intact), 29 tokens consumed cleanly, 29 files migrated, production build green, computed-style runtime verification of every `[data-intent]` on homepage confirms spec parity.

### Time + commit stats

- Total commits on `forge/button`: **24** (off `dexter/site-rebuild`).
- Stages: 0 through 8 (Stage 7 pending Code Connect + merge; Stage 8 is this postmortem).
- Rough effort breakdown (by commit count + scope):
  - Stage 0 (Context Lock): 1 commit (`807e941`) — 128-line context brief authoring the 192-cell variant matrix and 7-dimension polish frame.
  - Stage 1 (Reference Scan): 1 commit (`8e86397`) — 3 parallel agents producing `01-codebase-usage.md` (188 lines, 25 call sites audited), `01-latent-voice.md` (263 lines, 10 inferences), `01-token-gaps.md` (290 lines, 23 tokens added).
  - Stage 2 (Spec): 1 commit (`4707248`) — 954-line binding contract with 4 intents × 4 sizes × 6 states × 2 themes locked.
  - Stage 3 (Parallel Build): 3 commits (`f696f04` tokens, `041f05a` primitive rewrite, `abfa232` 29 call-site migrations).
  - Stage 4 (Critic Panel): 1 commit (`0ae4d70`) — 3 parallel critics + revision plan synthesized.
  - Stage 5 (Polish Pass): **8 commits for Loop 1** (`ee9f65b` through `e612f1d`, covering P0 Slottable, P1 R2–R7, P2 cleanups) + **4 commits for Loop 2** triggered by Stage 6 surprises (`17da59b` G1, `99f6e90` G2, `c6aa169` bottom CTA restore, `a83b589` Copiable xs default).
  - Stage 6 (Real-Context Validation): Loop 1 findings captured in `06-context-shots.md` lines 1–165, triggered Loop 2. Loop 2 verification appended at lines 167–222, confirming all blockers closed. Plus 3 orchestrator-decision commits during Loop 2 (`12765c0` pill chrome, `60eb435` process.tsx, `80af705` hero out-of-scope, `596e0d0` 85→90%). Closing commit: `8ffad1b`.
  - Stage 7 (Code Connect + merge): not yet run.
  - Stage 8 (this): 1 commit (this postmortem + recipe updates).
- **Loops required: 1 Stage 6 → Stage 5 loop**, driven entirely by Stage 6 surprise findings (G1 arrow prop-drop, G2 twMerge token death, G4 missing card-nested consumer, Context 5 prose orphan).

### What worked

- **Stage 1 three-way parallel scan produced genuinely complementary outputs.** Agent A (codebase usage) counted 25 direct call sites + 4 bypass sites; Agent B (latent voice) distilled the 10 inferences that shaped every spec decision; Agent C (token gaps) produced the exact 23-token additive patch that Stage 3 applied verbatim. Zero overlap, zero gaps. The 3-width stage is correctly sized.
- **Stage 2's binding-contract framing paid off.** The 954-line spec was long but every later stage could cite §number. When critics disagreed (cta.tsx intent=link vs primary+secondary), the spec's §10.2 was the tiebreaker. When Stage 5 needed to know the exact failure mode for primary hover darkening, §5.2's "implementer choice" clause was explicit. Spec-as-contract eliminated every "what did we decide?" moment in Stages 3–7.
- **Critic panel severity rubric forced decisions.** `major | minor | nit` + the "Stage 5 loops until no major remains" gate converted critique into actionable diff. Loop 1 resolved 6 polish majors, 2 impl majors, 1 brand major in 8 surgical commits. No rewrite.
- **Stage 6 caught what critics missed.** Critics (polish + impl + brand) all read the code and produced thorough findings but missed the two runtime bugs (G1 icon prop-drop, G2 twMerge token death) because both only manifest at `computedStyle` time, not at source-read time. Stage 6's preview-server DOM inspection is the pipeline's last line of defense — and it fired correctly.
- **Worktree isolation made the 8-commit Loop 1 + 4-commit Loop 2 bisectable.** Each P0/P1/P2 commit is independently revertable. `git log --oneline` reads as a changelog.
- **Parallel dispatch discipline (single-message multi-Agent)** held across Stage 1 (3 agents), Stage 3 (2 agents), Stage 4 (3 agents). No serial drift.

### What surprised us (and would have shipped broken without the pipeline)

Each finding is graded by which stage caught it. "Would have shipped" = what a single implementer without the critique loop would have pushed.

- **G1 — Icon component prop-drop** (caught Stage 6, not Stage 4 critics). `src/components/icons/arrow.tsx` destructured only `className`, silently dropping the `data-slot` attribute `React.cloneElement` passed from Button. Arrows rendered at 0×0 on every trailingIcon-bearing Button. Critics read button.tsx source and saw the clone helper was correct; the bug was in a file they didn't read. Stage 6 DOM inspection surfaced it via `document.querySelector('[data-intent="link"] svg')` returning `width: 0px`. Fix: `17da59b` (spread `...rest` in Arrow icon).

- **G2 — Silent twMerge token collision** (caught Stage 6, not Stage 4 critics). `text-[var(--text-label-xs)]` (size) and `text-[var(--color-primary)]` (color) both matched `text-*` prefix; `tailwind-merge` kept only the later entry. Every Button rendered at inherited 16px, defeating the entire size-token pillar. Critics read the `cn()` call and saw 29 tokens consumed, but the merge was a runtime-computed-style effect. Stage 6 caught via `element.className` string inspection — the size class was absent. Fix: `99f6e90` (switch to `[font-size:var(--text-label-xs)]` bracket-property syntax, escaping the `text-*` namespace).

- **G3 — Hero CTA consumer never existed** (caught Stage 6). Spec §10.1 prescribed a `primary md + trailing arrow + asChild Link` for the homepage hero. Reality: `hero/index.tsx:148-150` renders a scroll-engine-native raw `<a>` with uppercase mono styling that's aesthetically load-bearing. Stage 2 wrote the spec expecting the hero to migrate; no migration actually targeted the hero (none of the 29 migration map files included it). Resolved by orchestrator decision at `80af705` — hero marked out-of-scope with the spec amended to explain why.

- **G4 — No card-nested Button consumer** (caught Stage 6). Spec §10.3 was written to prove the 16px card − 10px padding = 6px control radius-nesting math. Reality: no consumer in the migrated codebase put a Button inside a card. `process.tsx` cards had no Button inside; `featured-work.tsx` cards used inline `<span>` arrows. The radius-nesting proof had no live consumer. Resolved at `60eb435` by migrating `process.tsx` cards to `radius-card + secondary sm "Learn more"` — but this was a Stage 5 Loop 2 fix driven entirely by Stage 6 surprise. Stage 2 should have flagged "this consumer does not yet exist" at spec authoring time.

- **Disabled state silently un-styled in asChild mode** (caught Stage 4 impl + polish, both). `disabled:*` Tailwind variants fire only on native `<button disabled>`; `<a aria-disabled>` never matches. All 4 marketing-bypass migrations (cta, announcement-bar, featured-work + contact-form edge cases) would have rendered disabled indistinguishably from rest. Fix at `e1f527a` unified on `data-disabled` attribute — single modifier covers both native and ARIA paths. **Critics caught this.** The pipeline works.

- **Slottable composition** (caught Stage 4 impl). Radix `Slot` requires exactly one child; Button passes up to 4 siblings (leadingIcon clone + label span + trailingIcon clone + sr-only span). `React.Children.only(null)` threw on every `asChild` + icon consumer. `bun run build` crashed at `/` prerender. Fix at `ee9f65b`. **Critics caught this.** Build-verification in critic rubric is load-bearing.

- **`font-medium` against Matter Regular** (caught Stage 4 polish + brand, both). Matter loads at weight 400 only; `font-medium` = 500 triggers faux-bold synthesis. Would have shipped with a visible rendering artifact on every label on every page. Fix at `56ed729`. **Critics caught this.**

- **Disabled contrast 2.9:1** (caught Stage 6). Stage 5 Loop 1 raised disabled-foreground to 85% per critic recommendation; Stage 6 computed-measured 2.9:1 actual contrast, below the 3:1 WCAG non-text floor by a hair. Fix at `596e0d0` (85% → 90%). Critics' spec-level recommendation was close but the live measurement revealed the gap. Reinforces: **computed-style audit is not optional**.

### What the pipeline missed (gaps in the recipe)

Specific gaps the next forge run must not repeat:

- **Stage 6 was spec'd for screenshots only, not computed-style DOM inspection.** G1 + G2 both required `document.querySelector(…).computedStyle` or `className` string inspection to detect. Neither is a visual artifact a screenshot would show — a 0×0 SVG is invisible, an inherited 16px font looks plausibly close to 14px. **Fix applied to recipe: Stage 6 now mandates computed-style DOM checks for every `[data-*]` attribute the spec locks.** See "Stage 6 — Computed-style + consumer audit" section above.

- **Stage 2 §10 'real-context' specs were not validated against existing consumers.** G3 (no hero migration) and G4 (no card-nested Button) were both specified by a Stage 2 spec that assumed consumer migration would happen, without checking which migrations were actually in scope. The migration map (§9) and the real-context specs (§10) were authored independently and silently disagreed. **Fix applied to recipe: Stage 2 now requires a "consumer reality check" — every §10 real-context entry must cross-reference §9 migration scope; mismatches flag required migration additions OR real-context amendments.** See "Stage 2 — Consumer reality check" section above.

- **Critic panel rubric had no "token plumbing" dimension.** Polish, impl, and brand all read source code; none ran the code. G1 (cloneElement → prop-filter icon) and G2 (twMerge collision) are both runtime effects invisible to source-reads. **Fix applied to recipe: critique rubric now includes a "token plumbing" dimension — every declared token must be verified to flow through `cn() → twMerge → Tailwind v4` correctly. See "Critique rubric" section above.**

- **Tailwind v4's silent scanner leakage was an unanticipated infrastructure bug.** `forge/*.md` files contained `text-label-*` wildcard examples that Tailwind v4 scanned as candidate classes, generating invalid CSS rules with a literal `*` in property values. The build blew up only after Loop 2 G2 fix shipped the `[font-size:var(…)]` syntax — previously the collision had masked it. One-time infra fix: `@source not "../../forge"`. **Fix applied to recipe: flagged as a named failure mode + generalized — any documentation directory with bracket-property examples must be scanner-excluded.** See "Failure modes" section above.

- **Loop 2 surprise commits (process.tsx migration, pill chrome on container, hero out-of-scope, 85→90%) took orchestrator decisions mid-loop.** These decisions weren't part of the original revision plan and weren't time-boxed. Loop 2 should have an explicit gate: "is this a fix to the existing plan, or a scope expansion?" Scope expansion should re-enter Stage 2. Not formalized in the recipe yet — flagging for second component forge to observe before codifying.

### Recipe updates applied (Stage 8 authority)

See structural changes above, integrated into the recipe body:
1. **Stage 2 gains a "consumer reality check" gate** (new section in recipe).
2. **Stage 6 mandates computed-style DOM inspection + scanner-config audit** (new section in recipe).
3. **Critique rubric adds a "token plumbing" dimension** (added to rubric section).
4. **Stage 3-A / 3-B parallelism is now documented as confirmed-genuine, not aspirational** (table note + dispatch standards note).
5. **Failure modes section expanded with three Button-discovered failure patterns**: silent token death via class-merger, icon prop-drop, Tailwind v4 candidate-scan leakage.
6. **Role-brief template updated** with a Runtime Verification field + hard Output Schema field — see `forge/templates/role-brief.template.md`.

### Next components — recommended order

**Heading.** Button was the variant-heavy primitive (4 intents × 4 sizes × 6 states × 2 themes = 192 cells). Heading is the type-rhythm-heavy primitive (levels 1–6 × sizes × line-heights × tracking). Running Heading next exercises the pipeline's type-rhythm + typography-token machinery that Button only lightly touched, and the `--text-label-*` token family we just proved unblocks a `--text-heading-*` parallel. Card is tempting next (pairs naturally with Button via radius nesting) but Heading hits a separate axis of the 7-dimension polish frame that deserves independent validation before compounding two untested primitives.

### Template/recipe version bumped to: 1.1
