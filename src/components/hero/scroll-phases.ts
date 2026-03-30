export const PHASES = {
	CHAT_BUILD: { start: 0.0, end: 0.30 },
	TILT: { start: 0.30, end: 0.40 },
	SEPARATE: { start: 0.40, end: 0.50 },
	HIGHLIGHT: { start: 0.50, end: 0.80 },
	REASSEMBLE: { start: 0.80, end: 0.88 },
	FADE_OUT: { start: 0.88, end: 1.0 },
} as const

export function phaseProgress(
	progress: number,
	phase: { start: number; end: number }
): number {
	if (progress <= phase.start) return 0
	if (progress >= phase.end) return 1
	return (progress - phase.start) / (phase.end - phase.start)
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOut = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
