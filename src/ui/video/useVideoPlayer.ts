import { useCallback, useEffect, useRef, useState } from 'react'

interface DocumentWithFullscreen extends Document {
	webkitFullscreenElement?: Element | null
	mozFullScreenElement?: Element | null
	msFullscreenElement?: Element | null
	webkitExitFullscreen?: () => Promise<void>
	mozCancelFullScreen?: () => Promise<void>
	msExitFullscreen?: () => Promise<void>
}

interface HTMLElementWithFullscreen extends HTMLElement {
	webkitRequestFullscreen?: () => Promise<void>
	mozRequestFullScreen?: () => Promise<void>
	msRequestFullscreen?: () => Promise<void>
}

interface HTMLVideoElementWithFullscreen extends HTMLVideoElement {
	webkitEnterFullscreen?: () => void
	webkitExitFullscreen?: () => void
}

export function useVideoPlayer(videoRef: React.RefObject<HTMLVideoElement>) {
	// Core state
	const [status, setStatus] = useState<'loading' | 'playing' | 'playing-with-sound'>('loading')
	const [isFloating, setIsFloating] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [buffered, setBuffered] = useState(0)
	const [showControls, setShowControls] = useState(true)
	const [isCaptionsOn, setIsCaptionsOn] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Format time helper (seconds to mm:ss)
	const formatTime = useCallback((seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`
	}, [])

	// Handle time updates without the conditional that was causing resets
	const handleTimeUpdate = useCallback(() => {
		const video = videoRef.current
		if (!video) return

		// Update current time without conditions that might cause resets
		setCurrentTime(video.currentTime)

		// Update buffered
		if (video.buffered.length > 0) {
			setBuffered(video.buffered.end(video.buffered.length - 1))
		}
	}, [videoRef])

	// Toggle play/pause
	const togglePlayPause = useCallback(() => {
		const video = videoRef.current
		if (!video) return

		if (isPlaying) {
			video.pause()
		} else {
			video.play().catch(err => console.log('Play failed:', err))
		}
	}, [isPlaying, videoRef])

	// Toggle captions
	const toggleCaptions = useCallback(() => {
		const video = videoRef.current
		if (!video) return

		if (video.textTracks.length > 0) {
			const track = video.textTracks[0]
			if (track && track.mode === 'showing') {
				track.mode = 'hidden'
				setIsCaptionsOn(false)
			} else if (track) {
				track.mode = 'showing'
				setIsCaptionsOn(true)
			}
		}
	}, [videoRef])

	// Toggle fullscreen
	const toggleFullscreen = useCallback(() => {
		const container = videoRef.current?.closest('.video-inner-container') as HTMLElementWithFullscreen
		if (!container) return

		// Check if we're already in fullscreen mode
		const isFullscreen =
			document.fullscreenElement ||
			(document as DocumentWithFullscreen).webkitFullscreenElement ||
			(document as DocumentWithFullscreen).mozFullScreenElement ||
			(document as DocumentWithFullscreen).msFullscreenElement

		if (!isFullscreen) {
			// Try different fullscreen methods
			if (container.requestFullscreen) {
				container.requestFullscreen()
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen()
			} else if (container.mozRequestFullScreen) {
				container.mozRequestFullScreen()
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen()
			} else if ((videoRef.current as HTMLVideoElementWithFullscreen)?.webkitEnterFullscreen) {
				// iOS Safari specific method
				const video = videoRef.current as HTMLVideoElementWithFullscreen
				if (video.webkitEnterFullscreen) {
					video.webkitEnterFullscreen()
				}
			}
		} else {
			// Exit fullscreen
			if (document.exitFullscreen) {
				document.exitFullscreen()
			} else if ((document as DocumentWithFullscreen).webkitExitFullscreen) {
				const doc = document as DocumentWithFullscreen
				if (doc.webkitExitFullscreen) {
					doc.webkitExitFullscreen()
				}
			} else if ((document as DocumentWithFullscreen).mozCancelFullScreen) {
				const doc = document as DocumentWithFullscreen
				if (doc.mozCancelFullScreen) {
					doc.mozCancelFullScreen()
				}
			} else if ((document as DocumentWithFullscreen).msExitFullscreen) {
				const doc = document as DocumentWithFullscreen
				if (doc.msExitFullscreen) {
					doc.msExitFullscreen()
				}
			} else if ((videoRef.current as HTMLVideoElementWithFullscreen)?.webkitExitFullscreen) {
				// iOS Safari specific method
				const video = videoRef.current as HTMLVideoElementWithFullscreen
				if (video.webkitExitFullscreen) {
					video.webkitExitFullscreen()
				}
			}
		}
	}, [videoRef])

	// Play with sound handler
	const playWithSound = useCallback(() => {
		const video = videoRef.current
		if (!video) return

		// Reset video to beginning
		video.currentTime = 0

		// Turn on sound
		video.muted = false

		// Play with sound (this will turn on color via CSS)
		const playPromise = video.play()

		// Only update state after play succeeds
		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					setStatus('playing-with-sound')
					setIsPlaying(true)
				})
				.catch(err => console.log('Play with sound failed:', err))
		}
	}, [videoRef])

	// Close floating video
	const closeFloating = useCallback(() => {
		setIsFloating(false)
		if (videoRef.current) {
			videoRef.current.pause()
		}
		setIsPlaying(false)
	}, [videoRef])

	// Control visibility management
	const showControlsTemporarily = useCallback(() => {
		setShowControls(true)

		// Clear any existing timeout
		if (controlsTimeoutRef.current) {
			clearTimeout(controlsTimeoutRef.current)
			controlsTimeoutRef.current = null
		}

		// Only hide controls if playing and not in fullscreen
		if (isPlaying && !isFullscreen) {
			const timeout = setTimeout(() => {
				setShowControls(false)
				controlsTimeoutRef.current = null
			}, 3000)
			controlsTimeoutRef.current = timeout
		}
	}, [isPlaying, isFullscreen])

	// Add event listeners
	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		// Update status when playback starts
		const handlePlaying = () => {
			if (status === 'loading') {
				setStatus('playing')
			}
			setIsPlaying(true)
		}

		// Handle video ending when in playing-with-sound mode
		const handleEnded = () => {
			if (status === 'playing-with-sound') {
				// Reset to muted grayscale state
				video.muted = true
				setStatus('playing')
				setIsPlaying(false)
			}
		}

		const handlePause = () => {
			setIsPlaying(false)
		}

		const handleLoadedMetadata = () => {
			setDuration(video.duration)
		}

		video.addEventListener('playing', handlePlaying)
		video.addEventListener('ended', handleEnded)
		video.addEventListener('pause', handlePause)
		video.addEventListener('loadedmetadata', handleLoadedMetadata)

		// Clean up
		return () => {
			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current)
				controlsTimeoutRef.current = null
			}

			video.removeEventListener('playing', handlePlaying)
			video.removeEventListener('ended', handleEnded)
			video.removeEventListener('pause', handlePause)
			video.removeEventListener('loadedmetadata', handleLoadedMetadata)
		}
	}, [status, videoRef])

	// Add fullscreen change event listeners
	useEffect(() => {
		const handleFullscreenChange = () => {
			const isFullscreen =
				document.fullscreenElement ||
				(document as DocumentWithFullscreen).webkitFullscreenElement ||
				(document as DocumentWithFullscreen).mozFullScreenElement ||
				(document as DocumentWithFullscreen).msFullscreenElement
			setIsFullscreen(!!isFullscreen)
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange)
		document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
		document.addEventListener('mozfullscreenchange', handleFullscreenChange)
		document.addEventListener('MSFullscreenChange', handleFullscreenChange)

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange)
			document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
			document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
			document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
		}
	}, [])

	// Return the state and handlers
	return {
		buffered,
		closeFloating,
		currentTime,
		duration,
		formatTime,
		handleTimeUpdate,
		isCaptionsOn,
		isFloating,
		isFullscreen,
		isPlaying,
		playWithSound,
		setIsFloating,
		showControls,
		showControlsTemporarily,
		status,
		toggleCaptions,
		toggleFullscreen,
		togglePlayPause
	}
}
