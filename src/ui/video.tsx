'use client'

import Hls from 'hls.js'
import React, { useRef, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface HeroVideoProps {
	hlsUrl: string
	mp4Url: string
	className?: string
}

export function Video({ hlsUrl, mp4Url, className = '' }: HeroVideoProps) {
	// Refs
	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const videoContainerRef = useRef<HTMLDivElement>(null)
	const hlsRef = useRef<Hls | null>(null)

	// State
	const [isPlaying, setIsPlaying] = useState(false)
	const [hasSound, setHasSound] = useState(false)
	const [isFloating, setIsFloating] = useState(false)
	const [useFallback, setUseFallback] = useState(false)

	// Intersection observer to detect when video is scrolled out of view
	const [inViewRef, inView] = useInView({
		threshold: 0.3
	})

	// Initialize video with HLS or fallback
	useEffect(() => {
		if (!videoRef.current) return

		// Set up the observer reference
		inViewRef(containerRef.current)

		// Initialize video properties
		videoRef.current.muted = true
		videoRef.current.playsInline = true

		// If we've already determined to use the fallback, just use MP4
		if (useFallback) {
			videoRef.current.src = mp4Url
			videoRef.current.play().catch(() => console.log('Fallback autoplay prevented'))
			return
		}

		// Try HLS if supported
		if (Hls.isSupported()) {
			// Cleanup old HLS instance if it exists
			if (hlsRef.current) {
				hlsRef.current.destroy()
			}

			// Create new HLS instance
			const hls = new Hls({
				maxBufferLength: 30,
				enableWorker: true,
				startLevel: 6, // Auto level selection
				xhrSetup: xhr => {
					// Some browsers need this for CORS
					xhr.withCredentials = false
				}
			})
			hlsRef.current = hls

			// Add error handling
			hls.on(Hls.Events.ERROR, (_, data) => {
				if (data.fatal) {
					console.log('HLS error:', data.type, data.details)

					// If we have network or media errors, switch to fallback
					if (data.type === Hls.ErrorTypes.NETWORK_ERROR || data.type === Hls.ErrorTypes.MEDIA_ERROR) {
						console.log('Switching to MP4 fallback due to error')
						setUseFallback(true)
						hls.destroy()
						hlsRef.current = null
					}
				}
			})

			try {
				hls.loadSource(hlsUrl)
				hls.attachMedia(videoRef.current)

				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					videoRef.current?.play().catch(() => console.log('HLS autoplay prevented'))
				})
			} catch (e) {
				console.error('Error setting up HLS:', e)
				setUseFallback(true)
			}

			return () => {
				hls.destroy()
				hlsRef.current = null
			}
		}

		// Native HLS support (Safari) or fallback
		try {
			if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
				videoRef.current.src = hlsUrl
			} else {
				// No HLS support, use MP4 fallback
				videoRef.current.src = mp4Url
			}
			videoRef.current.play().catch(e => {
				console.log('Native playback failed:', e)
				setUseFallback(true)
			})
		} catch (e) {
			console.error('Error with playback:', e)
			setUseFallback(true)
		}

		// Explicitly return undefined for the non-HLS code path
		return undefined
	}, [hlsUrl, mp4Url, useFallback, inViewRef])

	// Handle MP4 fallback when needed
	useEffect(() => {
		if (useFallback && videoRef.current) {
			videoRef.current.src = mp4Url
			videoRef.current.play().catch(e => console.log('MP4 fallback play failed:', e))
		}
	}, [useFallback, mp4Url])

	// Handle play state changes
	useEffect(() => {
		if (!videoRef.current) return

		const onPlay = () => setIsPlaying(true)
		const onPause = () => setIsPlaying(false)
		const onError = (e: Event) => {
			console.error('Video error event:', e)
			setUseFallback(true)
		}

		videoRef.current.addEventListener('play', onPlay)
		videoRef.current.addEventListener('pause', onPause)
		videoRef.current.addEventListener('error', onError)

		return () => {
			videoRef.current?.removeEventListener('play', onPlay)
			videoRef.current?.removeEventListener('pause', onPause)
			videoRef.current?.removeEventListener('error', onError)
		}
	}, [])

	// Handle controls visibility when floating or has sound
	useEffect(() => {
		if (!videoRef.current) return
		// Show controls when floating or when user has enabled sound
		videoRef.current.controls = isFloating || hasSound
	}, [isFloating, hasSound])

	// Handle floating video when scrolling away
	useEffect(() => {
		if (!inView && isPlaying && hasSound) {
			setIsFloating(true)
		} else {
			setIsFloating(false)
		}
	}, [inView, isPlaying, hasSound])

	// Apply floating mode class to video container
	useEffect(() => {
		if (!videoContainerRef.current) return

		if (isFloating) {
			videoContainerRef.current.classList.add('is-floating')
		} else {
			videoContainerRef.current.classList.remove('is-floating')
		}
	}, [isFloating])

	// Play with sound
	const playWithSound = () => {
		if (!videoRef.current) return

		videoRef.current.muted = false
		videoRef.current.currentTime = 0
		videoRef.current.play().catch(e => console.log('Play with sound failed:', e))

		setHasSound(true)
	}

	// Close floating video
	const closeFloating = () => {
		setIsFloating(false)

		if (videoRef.current) {
			videoRef.current.pause()
		}
	}

	return (
		<div ref={containerRef} className={`relative overflow-hidden ${className}`}>
			{/* Video Container */}
			<div
				ref={videoContainerRef}
				className={`video-container ${isFloating ? 'is-floating' : ''} ${hasSound ? '' : 'grayscale'}`}
			>
				{/* The video element stays in place */}
				<video
					ref={videoRef}
					muted={!hasSound}
					playsInline
					loop
					className="h-full w-full object-cover"
					preload="auto"
				>
					<track kind="captions" src="/captions/default.vtt" srcLang="en" label="English" />
				</video>

				{/* Close button - only visible when floating */}
				{isFloating && (
					<button
						type="button"
						className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50 text-white"
						onClick={closeFloating}
						aria-label="Close floating video"
					>
						✕
					</button>
				)}
			</div>

			{/* Play with sound button */}
			{!hasSound && !isFloating && (
				<button
					type="button"
					className="absolute bottom-4 left-4 z-10 flex items-center rounded-full bg-white bg-opacity-80 px-3 py-2 font-medium text-black text-sm shadow-lg"
					onClick={playWithSound}
					onKeyPress={e => {
						if (e.key === 'Enter' || e.key === ' ') {
							playWithSound()
						}
					}}
					tabIndex={0}
					aria-label="Play with sound"
				>
					<svg viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5" aria-hidden="true">
						<title>Play</title>
						<path d="M8 5v14l11-7z" />
					</svg>
					Play with sound
				</button>
			)}

			{/* Debug indicator for fallback mode (remove in production) */}
			{useFallback && (
				<div className="absolute top-2 right-2 rounded bg-black bg-opacity-50 px-2 py-1 text-white text-xs">
					MP4 Fallback
				</div>
			)}
		</div>
	)
}
