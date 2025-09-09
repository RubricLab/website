'use client'

import Hls from 'hls.js'
import Image from 'next/image'
import { usePostHog } from 'posthog-js/react'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '~/lib/utils/cn'
import { Button } from '../button'
import { CrossIcon } from '../icons/cross'
import { PlayIcon } from '../icons/play'
import { useVideoPlayer } from './useVideoPlayer'
import { VideoControls } from './video-controls'

interface VideoProps {
	hlsUrl: string
	mp4Url: string
	className?: string
	posterUrl?: string
	transcriptionUrl?: string
}

export function Video({ hlsUrl, mp4Url, className = '', posterUrl, transcriptionUrl }: VideoProps) {
	// Refs
	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const videoContainerRef = useRef<HTMLDivElement>(null)
	const hlsRef = useRef<Hls | null>(null)

	// Detect when video is scrolled out of view
	const [inViewRef, inView] = useInView({ threshold: 0.3 })

	// Use the custom hook for player state and controls
	const {
		status,
		isPlaying,
		isFloating,
		isCaptionsOn,
		currentTime,
		duration,
		buffered,
		playWithSound,
		togglePlayPause,
		toggleCaptions,
		toggleFullscreen,
		closeFloating,
		handleTimeUpdate,
		setIsFloating
	} = useVideoPlayer(videoRef as React.RefObject<HTMLVideoElement>)

	const posthog = usePostHog()
	// Setup video player
	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		// Setup
		inViewRef(containerRef.current)
		video.muted = true
		video.playsInline = true

		let playbackStarted = false

		// Setup HLS if supported
		const setupHls = () => {
			if (!Hls.isSupported() || !video) return false

			const hls = new Hls({
				enableWorker: true,
				maxBufferLength: 30
			})

			hlsRef.current = hls

			try {
				hls.loadSource(hlsUrl)
				hls.attachMedia(video)

				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					if (!playbackStarted) {
						playbackStarted = true
						video.play().catch(err => console.log('Autoplay prevented:', err))
					}
				})

				hls.on(Hls.Events.ERROR, (_, data) => {
					if (data.fatal) {
						console.error('HLS error:', data.type, data.details)
						hls.destroy()
						hlsRef.current = null
						return false
					}
					return true
				})

				return true
			} catch (e) {
				console.error('HLS setup error:', e)
				hls.destroy()
				hlsRef.current = null
				return false
			}
		}

		// Setup native playback or fallback
		const setupNative = () => {
			if (!video) return

			try {
				// Try native HLS (Safari)
				if (video.canPlayType('application/vnd.apple.mpegurl')) {
					video.src = hlsUrl
				} else {
					// Fallback to MP4
					video.src = mp4Url
				}

				if (!playbackStarted) {
					playbackStarted = true
					video.play().catch(err => console.log('Native playback prevented:', err))
				}
			} catch (e) {
				console.error('Video playback error:', e)
				// Last resort fallback
				video.src = mp4Url
				if (!playbackStarted) {
					playbackStarted = true
					video.play().catch(err => console.log('Fallback playback prevented:', err))
				}
			}
		}

		// Start video setup
		const hlsSuccess = setupHls()
		if (!hlsSuccess) {
			setupNative()
		}

		// Add event listeners
		video.addEventListener('timeupdate', handleTimeUpdate)

		// Cleanup
		return () => {
			if (hlsRef.current) {
				hlsRef.current.destroy()
				hlsRef.current = null
			}

			video.removeEventListener('timeupdate', handleTimeUpdate)
		}
	}, [hlsUrl, mp4Url, inViewRef, handleTimeUpdate])

	// Handle floating video when scrolled away
	useEffect(() => {
		if (!inView && status === 'playing-with-sound') {
			if (videoContainerRef.current) {
				videoContainerRef.current.classList.add('is-floating')
				setIsFloating(true)
			}
		} else {
			if (videoContainerRef.current) {
				videoContainerRef.current.classList.remove('is-floating')
				setIsFloating(false)
			}
		}
	}, [inView, status, setIsFloating])

	const hasSound = status === 'playing-with-sound'
	const showPlayButton = status !== 'playing-with-sound'

	return (
		<div ref={containerRef} className={cn('video-outer-container', className)}>
			<div
				ref={videoContainerRef}
				className={cn(
					'video-inner-container',
					hasSound ? '' : 'grayscale',
					isFloating ? 'is-floating' : ''
				)}
			>
				{/* Poster image */}
				{posterUrl && status === 'loading' && (
					<div className="absolute inset-0 z-0">
						<Image
							src={posterUrl}
							alt="Video thumbnail"
							priority
							fill
							className="rounded-custom object-cover"
						/>
					</div>
				)}

				{/* Video */}
				<video
					ref={videoRef}
					muted={!hasSound}
					playsInline
					className="video-player"
					preload="auto"
					poster={posterUrl}
				>
					{transcriptionUrl ? (
						<track kind="captions" src={transcriptionUrl} srcLang="en" label="English" />
					) : (
						<track kind="captions" src="/captions/default.vtt" srcLang="en" label="English" />
					)}
				</video>

				{/* Clickable overlay for play/pause when in playing-with-sound mode */}
				{status === 'playing-with-sound' && (
					<div
						className="absolute inset-0 z-[5] cursor-pointer"
						onClick={togglePlayPause}
						onKeyDown={e => e.key === 'Enter' && togglePlayPause()}
						tabIndex={0}
						role="button"
						aria-label="Play or pause video"
					/>
				)}

				{/* Clickable overlay for the entire video when not in playing-with-sound mode */}
				{showPlayButton && (
					<div
						className="absolute inset-0 z-10 cursor-pointer"
						onClick={() => {
							playWithSound()
							posthog.capture('play_video.clicked')
						}}
						onKeyDown={e => e.key === 'Enter' && playWithSound()}
						tabIndex={0}
						role="button"
						aria-label="Play with sound"
					/>
				)}

				{/* Play with sound button */}
				{showPlayButton && (
					<div className="-translate-x-1/2 -translate-y-1/2 absolute top-[50%] left-[50%] z-20">
						<Button
							variant="default"
							size="sm"
							className="bg-black/30 text-md text-white backdrop-blur-sm transition-all hover:bg-black/40"
							onClick={playWithSound}
						>
							<PlayIcon className="size-4" />
							Play with sound
						</Button>
					</div>
				)}

				{/* Video Controls */}
				<div className="video-controls-container">
					{status === 'playing-with-sound' && (
						<VideoControls
							isPlaying={isPlaying}
							isCaptionsOn={isCaptionsOn}
							currentTime={currentTime}
							duration={duration}
							buffered={buffered}
							onPlayPause={togglePlayPause}
							onToggleCaptions={toggleCaptions}
							onToggleFullscreen={toggleFullscreen}
							videoContainerRef={videoContainerRef as React.RefObject<HTMLDivElement>}
						/>
					)}
				</div>

				{/* Close button for floating mode */}
				{isFloating && (
					<Button
						variant="icon"
						size="sm"
						className="absolute top-1 right-1 z-30"
						onClick={closeFloating}
						aria-label="Close video"
					>
						<CrossIcon className="size-5" />
					</Button>
				)}
			</div>
		</div>
	)
}
