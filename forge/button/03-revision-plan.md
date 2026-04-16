# Button — Stage 4 → Stage 5 Revision Plan

> Synthesized from 3 critic panels (Polish 6M/5m/1n · Impl 2M/? · Brand 1M/4m/2n). Stage 5 executes this plan verbatim.
>
> Verdict across critics: **needs-rework for implementation** (build crashes) → **needs-polish for polish + brand** (tight convergence, mostly mechanical fixes).

---

## P0 — Ships broken today (BUILD BLOCKER)

### R1. Fix asChild + Slot composition crash
- **Evidence**: `bun run build` fails to prerender `/` with React error #143. Critic B, Impl § Semantics.
- **Root cause**: Radix `Slot` requires exactly one React child, but Button passes 3–4 siblings (leadingIcon clone, label span, trailingIcon clone, sr-only span). `React.Children.only(null)` throws. Affects every `asChild` + icon call site: `cta.tsx:17`, `announcement-bar.tsx:23`, `featured-work.tsx:25`.
- **Fix**: Import `Slottable` from `@radix-ui/react-slot`. Wrap the "real" forwarded child (the `children` or label span) with `<Slottable>`. Slot re-parents siblings into the Slottable target.
- **Verify**: `bun run build` exits 0; homepage prerenders.

---

## P1 — Spec violations called out by multiple critics

### R2. font-medium → font-normal
- **Evidence**: Critic A highest-leverage; Critic C highest-leverage + single MAJOR finding. `button.tsx:65` sets `font-medium`, but Matter loads at weight 400 only (`src/app/layout.tsx:9-18`). Browser synthesizes faux-bold.
- **Spec**: § 3.1 explicitly says weight 400. Voice § 8 anti-pattern 3: "heavier-than-regular sans."
- **Fix**: one-char edit `font-medium` → `font-normal`.

### R3. Unify disabled state on `data-disabled` attribute
- **Evidence**: Critic A MAJOR 2 + Critic B MAJOR 2. `disabled:*` Tailwind variants don't fire when Button renders via Slot onto an `<a>` (asChild + Link). Entire disabled visual is inert.
- **Fix**: Set `data-disabled={disabled || loading || undefined}` on the Button root. Replace all `disabled:*` selectors in the className map with `data-[disabled]:*`. Works on both native `<button disabled>` and `<a aria-disabled>`.

### R4. Preserve icon slots during loading
- **Evidence**: Critic A MAJOR 3. Spec § 5.6 requires leading + trailing icons to remain in DOM with `opacity: 0` during loading to lock width. Current implementation removes them, causing visible width shift on loading toggle.
- **Fix**: Render icons unconditionally; apply `data-[loading]:opacity-0` instead of conditional render.

### R5. Primary hover ::after overlay z-index
- **Evidence**: Critic A MAJOR 1. The `::after` overlay on primary-intent buttons sits above leading/trailing icons on hover — arrow gets washed at 8% alpha.
- **Fix**: Wrap cloned icons (and label span) in a `relative z-10` positioned layer so they stay above the overlay. OR set overlay `pointer-events-none -z-0` and put content `relative z-10`.

---

## P1 — Creative-direction items (I'm defaulting; Stage 6 will validate)

### R6. Raise `--color-disabled-foreground` contrast to WCAG 3.0:1
- **Evidence**: Critic A creative-direction item + spec § 7.4 pre-flag. Disabled-primary at 40% alpha = 2.1:1 contrast, below WCAG non-text 3:1 target.
- **Default chosen**: Change `color-mix` alpha from 40% → 55%. Clears 3.0:1. Visually still muted.
- **New values**:
  ```css
  --color-disabled-foreground: color-mix(in srgb, var(--secondary) 55%, transparent);
  ```

### R7. `--color-disabled-foreground` mix base → `--secondary`
- **Evidence**: Critic C creative-direction item. Mixing disabled against pure `--primary` (black/white) reads "cool-grey" on warm paper; `--secondary` (the "quiet text" family at #666/#999) preserves warmth.
- **Default chosen**: Change mix base from `--primary` to `--secondary`. Combined with R6 this is a single token redefinition.

---

## P2 — Minor polish (batch in Stage 5)

### R8. Extract magic numbers to tokens
- **Evidence**: Critic B — 2 magic numbers in button.tsx (`[14px]` icon size, `[2px]` arrow translate).
- **Fix**: Add `--space-icon-sm: 14px`, `--space-icon-md: 16px`, `--space-arrow-nudge: 2px` tokens. Reference via Tailwind arbitrary values that read from CSS vars.

### R9. Ghost active state alpha
- **Evidence**: Spec § 5.4 says ghost active uses `color-mix(in srgb, var(--primary) 20%, transparent)` (2× the ghost-hover alpha). Verify implementation reflects this.
- **Fix**: If the code uses `surface-ghost-hover` for active instead of a separate stronger tint, introduce a computed value. Alternative: accept active == hover for ghost (low-leverage, consider accepting).

### R10. aria-label runtime invariant
- **Evidence**: Spec § 2.4 item 1. If iconOnly && no aria-label, dev-mode console error.
- **Verify**: Implementation has this invariant. If not, add 3-line dev-only `useEffect` warning.

---

## P3 — Deferred to Stage 6 (real-context screenshot review will decide)

- **cta.tsx intent** — Critic A noted cta.tsx uses `intent="link"` while spec § 10.2 real-context example had primary+secondary. Consumer-level decision; Stage 6 screenshots against Figma parity will reveal whether the primary+secondary side-by-side feels right in real context.
- **Announcement-bar pill shape** — Critic C noted migration stripped the pill shadow. Correct per spec (shadow anti-pattern), but may lose "floating object" signal. Stage 6 over-hero placement will decide.

---

## Execution constraints for Stage 5

1. **No new dependencies.** Radix Slottable is part of `@radix-ui/react-slot` already installed.
2. **LOC ceiling**: button.tsx stays ≤ 90 LOC after fixes (currently 83; expect +5 for Slottable wrap + data-disabled refactor).
3. **No new tokens** beyond those in R6/R7 (renaming mix base) + R8 (icon + nudge tokens if extracted).
4. **Re-run the full verification chain**: `bunx tsc --noEmit` + `bun run build` must both pass before commit.
5. **Commit granularity**: one commit per P0/P1 group + one polish commit for P2. Keeps bisectable.

## Expected impact

After Stage 5:
- 🟢 Production builds pass.
- 🟢 Every asChild + icon call site renders correctly (cta, announcement-bar, featured-work).
- 🟢 Disabled state visible on both native button and asChild.
- 🟢 Loading state no longer shifts width.
- 🟢 Primary hover doesn't wash icons.
- 🟢 Label renders at Matter Regular (no faux-bold synthesis).
- 🟢 Disabled contrast clears WCAG 3.0:1.
- 🟢 Warm-palette "quiet text" preserved in disabled state.
- 🔵 Ready for Stage 6 real-context screenshot validation.

## What Stage 5 must NOT touch

Critic C's "what feels right" + Critic A's "what IS working":
- The token contract (29 tokens consuming correctly — do not re-architect).
- The 4-intent × 4-size × 6-state matrix coverage.
- `forwardRef` + `displayName` present.
- `focus-visible` vs `focus` (correct implementation).
- Migration map scope (29 files, no additions without spec update).

Stage 5 is a SURGICAL fix pass, not a rewrite.
