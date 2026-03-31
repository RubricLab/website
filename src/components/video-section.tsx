'use client'

import { useRef, useState } from 'react'
import { FadeIn } from './fade-in'

const MP4_URL = 'https://d2os0zhpsj02b0.cloudfront.net/hero/preview.mp4'
const POSTER_URL = '/images/video-thumbnail.jpg'

export function VideoSection() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [playing, setPlaying] = useState(false)

	const handlePlay = () => {
		const v = videoRef.current
		if (!v) return
		v.muted = false
		v.play()
		setPlaying(true)
	}

	return (
		<section className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<FadeIn>
				<div className="video-outer-container">
					<div className="video-inner-container">
						<video
							ref={videoRef}
							className={`video-player ${!playing ? 'grayscale' : ''}`}
							src={MP4_URL}
							poster={POSTER_URL}
							playsInline
							muted
							loop
							preload="metadata"
						/>
						{!playing && (
							<div className="absolute inset-0 flex items-center justify-center z-10">
								<button
									type="button"
									onClick={handlePlay}
									className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-subtle border border-subtle hover:bg-accent transition-all duration-200"
									aria-label="Play video"
								>
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
										<path d="M6 4l10 6-10 6V4z" className="fill-primary" fillOpacity="0.9" />
									</svg>
								</button>
							</div>
						)}
					</div>
				</div>
			</FadeIn>
		</section>
	)
}
