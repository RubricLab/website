# Forge Agent Brief — Template

**Template version: 1.1** (bumped after Button forge first run.)

Every forge agent receives a brief structured exactly like this. Substitute bracketed placeholders.

---

## Role
[One sentence: what this agent is.]

## Stage context
- **Pipeline**: Component Forge (see `forge/RECIPE.md`)
- **Component**: [button / heading / section / ...]
- **Stage**: [0–8, role within stage]
- **Branch**: `forge/[component]` off `dexter/site-rebuild`

## Objective
[One paragraph: what a correct output looks like and why it matters for the component.]

## Inputs to read
[Exact file paths the agent must read before producing output. No exploration — the paths are prescribed.]

## Output schema (hard contract)
[Exact path(s) the agent must write, AND the structure of each file spelled out as numbered headings/sections/required fields. Stages 3+ cite §N against this schema; vague section lists are a failure mode. If the output has multiple files, give each a distinct schema. Added v1.1: "hard contract" framing is non-negotiable — the downstream stage is a consumer of this schema.]

## Success criteria
[Numbered list: objective checks the output must pass. Every check must be mechanically verifiable — "build passes," "typecheck clean," "all §N sections present," "every declared token appears in at least one consumer," "every real-context cell in §10 cross-references a §9 migration row," etc. Avoid subjective criteria like "looks good."]

## Runtime verification (added v1.1)
[For stages that produce code (Stage 3) or evaluate rendered output (Stage 6): the agent MUST run the code live and capture computed-style DOM attributes, not only source-read. For stages that do not produce or evaluate code: write `N/A — review-only stage.`

Minimum runtime checks:
- `bunx tsc --noEmit` exit code.
- `bun run build` exit code (Stage 3 mandatory; other stages as applicable).
- For Stage 6: `document.querySelector(...)` probes of every `[data-*]` attribute the spec locks, with `getComputedStyle(...)` verification of the named properties (font-size, color, border-color, border-radius, outline, transition-*, transform at hover, etc.).
- For any `cn()` + Tailwind class merge in the component: string-inspect `element.className` to verify both token-driven classes survived twMerge. (Button G2 failure mode — silent class-merger conflict.)
- For any `React.cloneElement` that attaches a `data-slot` / similar prop: verify the attribute reaches the DOM. (Button G1 failure mode — icon prop-filter destructure drops props.)]

## Quality bar — non-negotiable
- Low LOC: reach for the smallest correct implementation
- Components-only, no inline one-offs
- Tokens, never magic numbers
- Pixel parity Figma ↔ code
- Polish vocabulary (7 dims: radius · surfaces · borders · type · motion · states · brand) considered in every decision
- Token plumbing verified at runtime, not just at source (added v1.1 — see Runtime verification above)
- No external brand references — ground in Rubric's existing voice only

## Model + reasoning
- `model: "opus"` (dispatched with this parameter by the orchestrator)
- `ultrathink` keyword present — engage maximum per-turn reasoning
- Inherits `max` effort level from session

## Out of scope
[Explicit list of things the agent should NOT do in this role. Protects against scope creep.]
