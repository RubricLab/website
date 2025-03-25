'use client'

import Player from '@vimeo/player'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from './button'
import { PlayIcon } from './icons/play'

interface VimeoPlayerProps {
	videoId: number
	thumbnailUrl?: string
}

const PlayButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button
			onClick={onClick}
			type="button"
			className="absolute bottom-4 left-4 z-20 bg-white/10 backdrop-blur-sm transition-colors focus:ring-0 enabled:group-hover:bg-white/20"
			aria-label="Play video with sound"
		>
			<PlayIcon className="size-4" />
			Play with sound
		</Button>
	)
}

export default function VimeoPlayer({ videoId, thumbnailUrl }: VimeoPlayerProps) {
	const playerRef = useRef<HTMLDivElement>(null)
	const playerInstance = useRef<Player | null>(null)
	const preloadedPlayerRef = useRef<HTMLDivElement>(null)
	const preloadedPlayerInstance = useRef<Player | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
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
		<div className="relative flex aspect-video h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-custom">
			{thumbnailUrl && !isVideoVisible && (
				<div className="absolute inset-0 flex items-center justify-center">
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
				className={cn(
					'absolute w-full shrink-0 object-cover transition-opacity',
					isVideoVisible && !isPlaying ? 'opacity-100' : 'opacity-0'
				)}
			/>
			<div
				ref={preloadedPlayerRef}
				className={cn(
					'absolute w-full shrink-0 object-cover transition-opacity',
					isPlaying ? 'opacity-100' : 'opacity-0'
				)}
			/>
			{!isPlaying && (
				<>
					<PlayButton onClick={handlePlayClick} />
					<div className="absolute inset-0 z-10 bg-black/10 backdrop-grayscale transition-all group-hover:opacity-0" />
				</>
			)}
		</div>
	)
}
