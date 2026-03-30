// ── Phase definitions ────────────────────────────────────────────────────

export const PHASES = {
	INTRO:          { start: 0.00, end: 0.05 },
	ANNOTATE:       { start: 0.05, end: 0.15 },
	CLEAR_STAGE:    { start: 0.15, end: 0.20 },
	CONTEXT:        { start: 0.20, end: 0.38 },
	COLLAPSE_CTX:   { start: 0.38, end: 0.43 },
	ARCHITECTURE:   { start: 0.43, end: 0.61 },
	COLLAPSE_ARCH:  { start: 0.61, end: 0.66 },
	EVALUATION:     { start: 0.66, end: 0.86 },
	REASSEMBLE:     { start: 0.86, end: 1.00 },
} as const

// ── Easing ───────────────────────────────────────────────────────────────

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOut = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
export const easeInOutQuart = (t: number) =>
	t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

// ── Phase progress ───────────────────────────────────────────────────────

export function phaseProgress(
	progress: number,
	phase: { start: number; end: number }
): number {
	if (progress <= phase.start) return 0
	if (progress >= phase.end) return 1
	return (progress - phase.start) / (phase.end - phase.start)
}

// ── Component state machine ──────────────────────────────────────────────

export type ComponentState = 'hidden' | 'active' | 'focused' | 'ghost'
export type ExpansionType = 'context' | 'architecture' | 'evaluation' | null

export interface HeroState {
	/** State for each of the 4 chat components: /01 question, /02 reasoning, /03 response, /04 citations */
	components: [ComponentState, ComponentState, ComponentState, ComponentState]
	/** Which expansion is currently active */
	activeExpansion: ExpansionType
	/** Draw progress per component (0 = erased, 1 = fully drawn) */
	scaffoldDraw: [number, number, number, number]
	/** Ghost guide line opacity per component (0 = invisible, 1 = fully visible at 6% base opacity) */
	ghostGuides: [number, number, number, number]
	/** Progress within the active expansion (0-1) */
	expansionProgress: number
}

export function deriveHeroState(progress: number): HeroState {
	const state: HeroState = {
		components: ['active', 'active', 'active', 'active'],
		activeExpansion: null,
		scaffoldDraw: [0, 0, 0, 0],
		ghostGuides: [0, 0, 0, 0],
		expansionProgress: 0,
	}

	// ── INTRO (0.00–0.05): no scaffold yet
	if (progress < PHASES.ANNOTATE.start) {
		return state
	}

	// ── ANNOTATE (0.05–0.15): scaffold draws on all components
	const annotateP = easeInOutQuart(phaseProgress(progress, PHASES.ANNOTATE))
	state.scaffoldDraw = [annotateP, annotateP, annotateP, annotateP]

	if (progress < PHASES.CLEAR_STAGE.start) {
		return state
	}

	// ── CLEAR_STAGE (0.15–0.20): /02,/03,/04 erase → ghost. /01 stays active → focused
	const clearP = easeOutCubic(phaseProgress(progress, PHASES.CLEAR_STAGE))
	state.scaffoldDraw[1] = 1 - clearP
	state.scaffoldDraw[2] = 1 - clearP
	state.scaffoldDraw[3] = 1 - clearP
	state.ghostGuides[1] = clearP
	state.ghostGuides[2] = clearP
	state.ghostGuides[3] = clearP
	state.components[1] = clearP > 0.5 ? 'ghost' : 'active'
	state.components[2] = clearP > 0.5 ? 'ghost' : 'active'
	state.components[3] = clearP > 0.5 ? 'ghost' : 'active'
	state.components[0] = clearP > 0.3 ? 'focused' : 'active'

	if (progress < PHASES.CONTEXT.start) {
		return state
	}

	// ── CONTEXT (0.20–0.38): /01 focused, expansion active
	state.components = ['focused', 'ghost', 'ghost', 'ghost']
	state.scaffoldDraw = [1, 0, 0, 0]
	state.ghostGuides = [0, 1, 1, 1]
	state.activeExpansion = 'context'
	state.expansionProgress = phaseProgress(progress, PHASES.CONTEXT)

	if (progress < PHASES.COLLAPSE_CTX.start) {
		return state
	}

	// ── COLLAPSE_CTX (0.38–0.43): context collapses, /01→ghost, /02 restores→focused
	const colCtxP = easeOutCubic(phaseProgress(progress, PHASES.COLLAPSE_CTX))
	state.activeExpansion = 'context'
	state.expansionProgress = 1 - colCtxP
	state.scaffoldDraw[0] = 1 - colCtxP
	state.ghostGuides[0] = colCtxP
	state.components[0] = colCtxP > 0.5 ? 'ghost' : 'focused'
	state.scaffoldDraw[1] = colCtxP
	state.ghostGuides[1] = 1 - colCtxP
	state.components[1] = colCtxP > 0.5 ? 'focused' : 'ghost'

	if (colCtxP > 0.7) {
		state.activeExpansion = null
		state.expansionProgress = 0
	}

	if (progress < PHASES.ARCHITECTURE.start) {
		return state
	}

	// ── ARCHITECTURE (0.43–0.61): /02 focused, DAG expansion
	state.components = ['ghost', 'focused', 'ghost', 'ghost']
	state.scaffoldDraw = [0, 1, 0, 0]
	state.ghostGuides = [1, 0, 1, 1]
	state.activeExpansion = 'architecture'
	state.expansionProgress = phaseProgress(progress, PHASES.ARCHITECTURE)

	if (progress < PHASES.COLLAPSE_ARCH.start) {
		return state
	}

	// ── COLLAPSE_ARCH (0.61–0.66): arch collapses, /02→ghost, /03 restores→focused
	const colArchP = easeOutCubic(phaseProgress(progress, PHASES.COLLAPSE_ARCH))
	state.activeExpansion = 'architecture'
	state.expansionProgress = 1 - colArchP
	state.scaffoldDraw[1] = 1 - colArchP
	state.ghostGuides[1] = colArchP
	state.components[1] = colArchP > 0.5 ? 'ghost' : 'focused'
	state.scaffoldDraw[2] = colArchP
	state.ghostGuides[2] = 1 - colArchP
	state.components[2] = colArchP > 0.5 ? 'focused' : 'ghost'

	if (colArchP > 0.7) {
		state.activeExpansion = null
		state.expansionProgress = 0
	}

	if (progress < PHASES.EVALUATION.start) {
		return state
	}

	// ── EVALUATION (0.66–0.86): /03 focused, flywheel expansion
	state.components = ['ghost', 'ghost', 'focused', 'ghost']
	state.scaffoldDraw = [0, 0, 1, 0]
	state.ghostGuides = [1, 1, 0, 1]
	state.activeExpansion = 'evaluation'
	state.expansionProgress = phaseProgress(progress, PHASES.EVALUATION)

	if (progress < PHASES.REASSEMBLE.start) {
		return state
	}

	// ── REASSEMBLE (0.86–1.00): all restore, scaffold redraws then erases
	const reassP = phaseProgress(progress, PHASES.REASSEMBLE)
	const redraw = easeOutCubic(clamp01(reassP * 3))       // 0–0.33: scaffold redraws
	const eraseAll = easeOutCubic(clamp01((reassP - 0.5) * 2)) // 0.5–1.0: scaffold erases
	const drawVal = redraw * (1 - eraseAll)

	state.components = ['active', 'active', 'active', 'active']
	state.scaffoldDraw = [drawVal, drawVal, drawVal, drawVal]
	state.ghostGuides = [0, 0, 0, 0]
	state.activeExpansion = null
	state.expansionProgress = 0

	return state
}
