'use client'

import { useEffect, useState } from 'react'

// Live FPS readout for the standalone demo pages: counts rAF callbacks over
// ~500ms windows so the reader can watch the frame rate tank (or not) while
// the dashboard filters. When the main thread is blocked, rAF stops firing,
// so a long task shows up as the next reported window dipping hard.
export const FpsCounter = () => {
	const [fps, setFps] = useState<number | null>(null)

	useEffect(() => {
		let raf = 0
		let frames = 0
		let windowStart = performance.now()

		const tick = (now: number) => {
			frames++
			const elapsed = now - windowStart
			if (elapsed >= 500) {
				setFps(Math.round((frames * 1000) / elapsed))
				frames = 0
				windowStart = now
			}
			raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [])

	return (
		<div className="fixed right-4 bottom-4 z-50 rounded-full border border-subtle bg-background/80 px-3 py-1.5 text-xs backdrop-blur">
			<span className="text-secondary">fps: </span>
			<span className="text-tint tabular-nums">{fps === null ? '—' : fps}</span>
		</div>
	)
}
