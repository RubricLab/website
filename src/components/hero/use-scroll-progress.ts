'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { clamp01 } from './scroll-phases'

/**
 * Maps scroll position within a section element to normalized 0–1 progress.
 * Uses passive scroll listener for performance.
 * Returns -1 when the section hasn't started scrolling yet.
 */
export function useScrollProgress(sectionRef: RefObject<HTMLDivElement | null>) {
	const [progress, setProgress] = useState(-1)
	const prevProgress = useRef(-1)

	// Debug override via URL param: ?progress=0.45
	const debugOverride = useRef<number | null>(null)
	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const dbg = params.get('progress')
		if (dbg !== null) debugOverride.current = parseFloat(dbg)
	}, [])

	useEffect(() => {
		if (debugOverride.current !== null) {
			setProgress(debugOverride.current)
			return
		}

		const section = sectionRef.current
		if (!section) return

		const handleScroll = () => {
			const rect = section.getBoundingClientRect()
			const vh = window.innerHeight
			const scrolled = -rect.top
			const runway = section.offsetHeight - vh

			if (runway <= 0) return

			let p: number
			if (scrolled < 0) {
				p = -1
			} else {
				p = clamp01(scrolled / runway)
			}

			if (Math.abs(p - prevProgress.current) > 0.001) {
				prevProgress.current = p
				setProgress(p)
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		handleScroll()
		return () => window.removeEventListener('scroll', handleScroll)
	}, [sectionRef])

	return progress
}
