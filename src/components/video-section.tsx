'use client'

import { Section } from './section'

export function VideoSection() {
	return (
		<Section>
			<div className="mx-auto max-w-[960px]">
				<div className="overflow-hidden rounded-xl border border-border">
					<div className="relative flex aspect-video items-center justify-center bg-surface/50">
						<button
							type="button"
							className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10"
							aria-label="Play video"
						>
							<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
								<path d="M6 4L16 10L6 16V4Z" fill="white" fillOpacity="0.8" />
							</svg>
						</button>
					</div>
				</div>
				<p className="mt-6 text-center font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
					How we work
				</p>
			</div>
		</Section>
	)
}
