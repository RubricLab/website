'use client'

import Hls from 'hls.js'
import Image from 'next/image'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button } from '../button'

import { useVideoPlayer } from './useVideoPlayer'
// Sub-components and hooks for better organization
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
		handleTimeUpdate
	} = useVideoPlayer(videoRef as React.RefObject<HTMLVideoElement>)

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
				maxBufferLength: 30,
				enableWorker: true
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
			}
		} else {
			if (videoContainerRef.current) {
				videoContainerRef.current.classList.remove('is-floating')
			}
		}
	}, [inView, status])

	const hasSound = status === 'playing-with-sound'
	const showPlayButton = status !== 'playing-with-sound'

	return (
		<div ref={containerRef} className={`relative overflow-hidden ${className}`}>
			<div
				ref={videoContainerRef}
				className={`video-container ${hasSound ? '' : 'grayscale'}`}
				style={{
					aspectRatio: '16/9',
					maxHeight: '100%'
				}}
			>
				{/* Poster image */}
				{posterUrl && status === 'loading' && (
					<div className="absolute inset-0 z-0">
						<Image
							src={posterUrl}
							alt="Video thumbnail"
							fill
							priority
							style={{ objectFit: 'cover' }}
							className="rounded-custom"
						/>
					</div>
				)}

				{/* Video */}
				<video
					ref={videoRef}
					muted={!hasSound}
					playsInline
					className="h-full w-full object-cover"
					preload="auto"
					poster={posterUrl}
				>
					{transcriptionUrl ? (
						<track kind="captions" src={transcriptionUrl} srcLang="en" label="English" default />
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
						onClick={playWithSound}
						onKeyDown={e => e.key === 'Enter' && playWithSound()}
						tabIndex={0}
						role="button"
						aria-label="Play with sound"
					/>
				)}

				{/* Play with sound button */}
				{showPlayButton && (
					<div className="absolute bottom-4 left-4 z-20">
						<Button
							variant="default"
							size="sm"
							className="bg-black/30 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/40"
							onClick={playWithSound}
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5" aria-hidden="true">
								<title>Play</title>
								<path d="M8 5v14l11-7z" />
							</svg>
							Play with sound
						</Button>
					</div>
				)}

				{/* Video Controls - extracted to a separate component */}
				<div className="video-controls-container z-20">
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
					<button
						type="button"
						className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50 text-white"
						onClick={closeFloating}
						aria-label="Close video"
					>
						✕
					</button>
				)}
			</div>
		</div>
	)
}
