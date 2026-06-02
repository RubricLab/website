'use client'

import { useLayoutEffect, useRef } from 'react'

// Schedules cb after the next paint (two rAFs) and returns a canceller.
function afterPaint(cb: () => void): () => void {
	let inner = 0
	const outer = requestAnimationFrame(() => {
		inner = requestAnimationFrame(cb)
	})
	return () => {
		cancelAnimationFrame(outer)
		cancelAnimationFrame(inner)
	}
}

// Real latency measurement shared by every dashboard column.
//
// mountStart is the timestamp the parent captured at click time; the first
// layout effect plus a double rAF measures the cost of mounting + first paint.
// `signature` is the committed filter state — each time it changes we measure
// the time from the keystroke (markFilterStart, called in the input handler
// before setState) to the filtered list committing and painting.
export function usePerfMeasure({
	mountStart,
	signature,
	onMount,
	onFilter
}: {
	mountStart: number
	signature: unknown
	onMount: (ms: number) => void
	onFilter: (ms: number) => void
}): () => void {
	const filterStart = useRef<number | null>(null)
	const firstRun = useRef(true)

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount cost is measured exactly once
	useLayoutEffect(() => afterPaint(() => onMount(performance.now() - mountStart)), [])

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-measure only when the committed filter changes
	useLayoutEffect(() => {
		if (firstRun.current) {
			firstRun.current = false
			return
		}
		const start = filterStart.current
		if (start === null) return
		filterStart.current = null
		return afterPaint(() => onFilter(performance.now() - start))
	}, [signature])

	return () => {
		filterStart.current = performance.now()
	}
}
