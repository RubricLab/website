'use client'

import { easeOutCubic, clamp01 } from '../scroll-phases'

export function MarginText({ label, heading, body, progress }: {
	label: string
	heading: string
	body: string
	progress: number
}) {
	const fadeIn = easeOutCubic(clamp01(progress * 5))
	const fadeOut = progress > 0.85 ? 1 - easeOutCubic((progress - 0.85) / 0.15) : 1
	const op = fadeIn * fadeOut

	if (op < 0.01) return null

	return (
		<div
			style={{
				opacity: op,
				transform: `translateY(${(1 - fadeIn) * 12}px)`,
			}}
		>
			<span className="text-[10px] text-secondary tracking-[0.15em] font-mono uppercase block">
				{label}
			</span>
			<h3 className="text-[18px] text-primary font-normal leading-snug mt-2 tracking-tight">
				{heading}
			</h3>
			<p className="text-[13px] text-secondary leading-relaxed mt-3">
				{body}
			</p>
		</div>
	)
}
