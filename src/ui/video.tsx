'use client'

import Hls from 'hls.js'
import Image from 'next/image'
import React, { useRef, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Button } from './button'

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

	// Core state
	const [status, setStatus] = useState<'loading' | 'playing' | 'playing-with-sound'>('loading')
	const [isFloating, setIsFloating] = useState(false)

	// Detect when video is scrolled out of view
	const [inViewRef, inView] = useInView({ threshold: 0.3 })

	// Setup video player
	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		// Setup
		inViewRef(containerRef.current)
		video.muted = true
		video.playsInline = true

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
					video.play().catch(err => console.log('Autoplay prevented:', err))
				})

				hls.on(Hls.Events.ERROR, (_, data) => {
					if (data.fatal) {
						console.error('HLS error:', data.type, data.details)
						hls.destroy()
						hlsRef.current = null
						return false
					}
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

				video.play().catch(err => console.log('Native playback prevented:', err))
			} catch (e) {
				console.error('Video playback error:', e)
				// Last resort fallback
				video.src = mp4Url
				video.play().catch(err => console.log('Fallback playback prevented:', err))
			}
		}

		// Start video setup
		const hlsSuccess = setupHls()
		if (!hlsSuccess) {
			setupNative()
		}

		// Update status when playback starts
		const handlePlaying = () => {
			setStatus(prev => (prev === 'loading' ? 'playing' : prev))
		}

		// Handle video ending when in playing-with-sound mode
		const handleEnded = () => {
			if (video.controls && !video.muted) {
				// Reset to muted grayscale state
				video.muted = true
				video.controls = false
				setStatus('playing')

				// Restart playback in muted mode
				video.play().catch(err => console.log('Restart playback prevented:', err))
			}
		}

		video.addEventListener('playing', handlePlaying)
		video.addEventListener('ended', handleEnded)

		// Cleanup
		return () => {
			if (hlsRef.current) {
				hlsRef.current.destroy()
				hlsRef.current = null
			}
			video.removeEventListener('playing', handlePlaying)
			video.removeEventListener('ended', handleEnded)
		}
	}, [hlsUrl, mp4Url, inViewRef])

	// Handle floating video when scrolled away
	useEffect(() => {
		if (!inView && status === 'playing-with-sound') {
			setIsFloating(true)
		} else {
			setIsFloating(false)
		}
	}, [inView, status])

	// Apply floating mode class to video container
	useEffect(() => {
		if (!videoContainerRef.current) return

		if (isFloating) {
			videoContainerRef.current.classList.add('is-floating')
		} else {
			videoContainerRef.current.classList.remove('is-floating')
		}
	}, [isFloating])

	// Add custom styles to fix border radius issues
	useEffect(() => {
		// Add style to head
		const style = document.createElement('style')
		style.innerHTML = `
			/* Override nested border radius in floating mode */
			.video-container.is-floating video {
				border-radius: 0 !important;
			}
		`
		document.head.appendChild(style)

		// Clean up
		return () => {
			document.head.removeChild(style)
		}
	}, [])

	// Play with sound handler
	const playWithSound = () => {
		const video = videoRef.current
		if (!video) return

		// Reset to beginning
		video.currentTime = 0

		// Turn on sound
		video.muted = false

		// Set controls
		video.controls = true

		// Play with sound (this will turn on color via CSS)
		const playPromise = video.play()

		// Only update state after play succeeds
		if (playPromise !== undefined) {
			playPromise
				.then(() => setStatus('playing-with-sound'))
				.catch(err => console.log('Play with sound failed:', err))
		}
	}

	// Close floating video
	const closeFloating = () => {
		setIsFloating(false)
		videoRef.current?.pause()
	}

	const hasSound = status === 'playing-with-sound'
	const showPlayButton = status !== 'playing-with-sound'

	return (
		<div ref={containerRef} className={`relative overflow-hidden ${className}`}>
			<div
				ref={videoContainerRef}
				className={`video-container ${hasSound ? '' : 'grayscale'} relative`}
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
							placeholder="blur"
							blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wgARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGZB//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//aAAwDAQACAAMAAAAQD//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Qf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Qf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Qf//Z"
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
					loop={status !== 'playing-with-sound'}
					className="h-full w-full object-cover"
					preload="auto"
					poster={posterUrl}
					style={{ borderRadius: 'var(--radius-custom)' }}
				>
					{transcriptionUrl ? (
						<track kind="captions" src={transcriptionUrl} srcLang="en" label="English" default />
					) : (
						<track kind="captions" src="/captions/default.vtt" srcLang="en" label="English" />
					)}
				</video>

				{/* Clickable overlay for the entire video */}
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
