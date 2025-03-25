'use client'

import Player from '@vimeo/player'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface VimeoPlayerProps {
	videoId: number
	thumbnailUrl?: string
}

export default function VimeoPlayer({ videoId, thumbnailUrl }: VimeoPlayerProps) {
	const playerRef = useRef<HTMLDivElement>(null)
	const playerInstance = useRef<Player | null>(null)
	const preloadedPlayerRef = useRef<HTMLDivElement>(null)
	const preloadedPlayerInstance = useRef<Player | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	// const [isLoaded, setIsLoaded] = useState(false)
	// const [isBuffered, setIsBuffered] = useState(false)
	const [isVideoVisible, setIsVideoVisible] = useState(false)

	useEffect(() => {
		if (playerRef.current && !playerInstance.current) {
			playerInstance.current = new Player(playerRef.current, {
				id: videoId,
				width: 1920,
				height: 1080,
				autoplay: true,
				controls: false,
				responsive: true,
				background: true,
				dnt: true,
				muted: true,
				loop: true,
				quality: 'auto',
				speed: true
			})

			Promise.all([
				playerInstance.current.ready(),
				new Promise(resolve => {
					playerInstance.current?.on('bufferend', resolve)
				}),
				new Promise(resolve => {
					playerInstance.current?.on('play', resolve)
				})
			]).then(() => {
				setIsVideoVisible(true)
			})

			// playerInstance.current.on('bufferstart', () => {
			// 	setIsBuffered(false)
			// })

			// playerInstance.current.on('bufferend', () => {
			// 	setIsBuffered(true)
			// })
		}

		if (preloadedPlayerRef.current && !preloadedPlayerInstance.current) {
			preloadedPlayerInstance.current = new Player(preloadedPlayerRef.current, {
				id: videoId,
				width: 1920,
				height: 1080,
				autoplay: false,
				controls: true,
				responsive: true,
				background: false,
				dnt: true,
				muted: false,
				loop: false,
				quality: 'auto',
				speed: true
			})

			preloadedPlayerInstance.current.ready().then(() => {
				preloadedPlayerInstance.current?.setCurrentTime(0)
			})
		}

		const hiddenPlayerRef = document.createElement('div')
		hiddenPlayerRef.style.display = 'none'
		document.body.appendChild(hiddenPlayerRef)

		const hiddenPlayer = new Player(hiddenPlayerRef, {
			id: videoId,
			width: 1920,
			height: 1080,
			autoplay: false,
			controls: false,
			responsive: true,
			background: false,
			dnt: true,
			muted: true,
			loop: false,
			quality: 'auto',
			speed: true
		})

		hiddenPlayer.ready().then(() => {
			hiddenPlayer.setCurrentTime(0)
			hiddenPlayer.loadVideo(videoId).then(() => {
				hiddenPlayer.destroy()
				document.body.removeChild(hiddenPlayerRef)
			})
		})

		return () => {
			if (playerInstance.current) {
				playerInstance.current.destroy()
				playerInstance.current = null
			}
			if (preloadedPlayerInstance.current) {
				preloadedPlayerInstance.current.destroy()
				preloadedPlayerInstance.current = null
			}
			if (document.body.contains(hiddenPlayerRef)) {
				document.body.removeChild(hiddenPlayerRef)
			}
		}
	}, [videoId])

	const handlePlayClick = async () => {
		if (!playerInstance.current || !preloadedPlayerRef.current) {
			return
		}

		try {
			if (preloadedPlayerInstance.current) {
				preloadedPlayerInstance.current.destroy()
				preloadedPlayerInstance.current = null
			}

			preloadedPlayerInstance.current = new Player(preloadedPlayerRef.current, {
				id: videoId,
				width: 1920,
				height: 1080,
				autoplay: true,
				controls: true,
				responsive: true,
				background: false,
				dnt: true,
				muted: false,
				loop: false,
				quality: 'auto',
				speed: true
			})

			await preloadedPlayerInstance.current.ready()

			playerInstance.current.destroy()
			playerInstance.current = null

			setIsPlaying(true)
			await preloadedPlayerInstance.current.play()
		} catch (error) {}
	}

	return (
		<div className="relative aspect-video w-full overflow-hidden">
			{thumbnailUrl && !isVideoVisible && (
				<div className="absolute inset-0">
					<Image
						src={thumbnailUrl}
						alt="Video preview thumbnail"
						fill
						className="object-cover"
						priority
					/>
				</div>
			)}
			<div
				ref={playerRef}
				className={`absolute inset-0 transition-opacity duration-300 ${
					isVideoVisible && !isPlaying ? 'opacity-100' : 'opacity-0'
				}`}
			/>
			<div
				ref={preloadedPlayerRef}
				className={`absolute inset-0 transition-opacity duration-300 ${
					isPlaying ? 'opacity-100' : 'opacity-0'
				}`}
			/>
			{!isPlaying && (
				<>
					<button
						onClick={() => {
							console.log('Button clicked')
							handlePlayClick()
						}}
						type="button"
						className="absolute inset-0 z-20 flex cursor-pointer items-end p-8"
						aria-label="Play video with sound"
					>
						<div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm transition-all hover:bg-white/20">
							<svg
								className="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<title>Play icon</title>
								<path
									fillRule="evenodd"
									d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="font-medium text-sm">Play with sound</span>
						</div>
					</button>
					<div className="absolute inset-0 z-10 bg-black/10 backdrop-grayscale transition-all duration-300 group-hover:opacity-0" />
				</>
			)}
		</div>
	)
}
