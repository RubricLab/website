'use client'

import { useState } from 'react'
import { FadeIn } from './fade-in'

export function VideoSection() {
	const [playing, setPlaying] = useState(false)

	return (
		<section className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<FadeIn>
				<div className="relative rounded-lg overflow-hidden aspect-video bg-[#0A0A0A] border border-[#1A1A1A]">
					{!playing ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<button
								type="button"
								onClick={() => setPlaying(true)}
								className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200"
								aria-label="Play video"
							>
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path d="M6 4l10 6-10 6V4z" fill="white" fillOpacity="0.9" />
								</svg>
							</button>
						</div>
					) : (
						<div className="absolute inset-0 flex items-center justify-center text-[#555555] font-mono text-sm">
							Video player placeholder
						</div>
					)}
				</div>
				<p className="font-mono text-sm text-[#555555] text-center mt-4">
					How we work.
				</p>
			</FadeIn>
		</section>
	)
}
