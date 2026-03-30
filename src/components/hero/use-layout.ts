'use client'

import { useEffect, useRef, type RefObject } from 'react'

export interface ComponentBounds {
	top: number
	left: number
	width: number
	height: number
}

export type LayoutRef = RefObject<ComponentBounds[] | null>

/**
 * Measures the position of chat component wrappers relative to the container.
 * Stores in a ref (not state) so scroll handlers can read without re-renders.
 */
export function useLayout(
	containerRef: RefObject<HTMLDivElement | null>,
	componentRefs: RefObject<(HTMLDivElement | null)[]>
): LayoutRef {
	const layoutRef = useRef<ComponentBounds[] | null>(null)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const measure = () => {
			const containerRect = container.getBoundingClientRect()
			const refs = componentRefs.current
			if (!refs) return

			layoutRef.current = refs.map(el => {
				if (!el) return { top: 0, left: 0, width: 0, height: 0 }
				const rect = el.getBoundingClientRect()
				return {
					top: rect.top - containerRect.top,
					left: rect.left - containerRect.left,
					width: rect.width,
					height: rect.height,
				}
			})
		}

		measure()

		const ro = new ResizeObserver(measure)
		ro.observe(container)

		return () => ro.disconnect()
	}, [containerRef, componentRefs])

	return layoutRef
}
