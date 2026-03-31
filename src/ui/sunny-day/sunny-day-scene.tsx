'use client'

import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { SunnyDayCanvas } from './sunny-day-canvas'

export function SunnyDayScene() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		const t = setTimeout(() => setMounted(true), 100)
		return () => clearTimeout(t)
	}, [])

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
			<SunnyDayCanvas />

			<div
				className={cn(
					'relative z-10 flex max-w-xl flex-col items-center gap-8 px-6 text-center transition-all duration-1000',
					mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				<h1 className="font-light text-4xl text-white tracking-tight drop-shadow-lg sm:text-6xl dark:text-white/90">
					Sunny Day
				</h1>
				<p className="max-w-md text-base text-white/80 leading-relaxed drop-shadow-md sm:text-lg dark:text-white/60">
					An ambient moment of warmth and birdsong. Move your mouse to shift the light. Click the button
					below to hear the birds.
				</p>
				<div className="mt-2 flex items-center gap-2 text-sm text-white/50 dark:text-white/30">
					<span className="inline-block h-px w-8 bg-white/30" />
					<span>Inspired by dany.works</span>
					<span className="inline-block h-px w-8 bg-white/30" />
				</div>
			</div>
		</div>
	)
}
