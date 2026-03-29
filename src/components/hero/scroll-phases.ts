/**
 * Scroll phase boundaries and utility functions.
 * Progress is 0.0–1.0 mapped from scroll position within the hero section.
 */

export const PHASES = {
	/** Chat builds up as user scrolls — typing, thinking, tools, output */
	CHAT_BUILD: { start: 0.0, end: 0.35 },
	/** Chat panel tilts in 3D to reveal depth */
	TILT: { start: 0.35, end: 0.42 },
	/** Components separate backward in Z-space */
	SEPARATE: { start: 0.42, end: 0.50 },
	/** Sequential highlight of each component with explanation */
	HIGHLIGHT: { start: 0.50, end: 0.78 },
	/** Components slide back together, tilt unwinds */
	REASSEMBLE: { start: 0.78, end: 0.86 },
	/** Brief moment of complete chat visible */
	REST: { start: 0.86, end: 0.92 },
	/** Fade out, release sticky */
	FADE_OUT: { start: 0.92, end: 1.0 },
} as const

/** Get normalized 0–1 progress within a specific phase */
export function phaseProgress(
	progress: number,
	phase: { start: number; end: number }
): number {
	if (progress <= phase.start) return 0
	if (progress >= phase.end) return 1
	return (progress - phase.start) / (phase.end - phase.start)
}

/** Clamp value to 0–1 */
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

/** Linear interpolation */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Easing functions */
export const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOut = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
