import { useCallback, useEffect, useRef, useState } from 'react'

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
		const container = videoRef.current?.closest('.video-inner-container') as HTMLElement
		if (!container) return

		if (!document.fullscreenElement) {
			container
				.requestFullscreen()
				.then(() => {
					setIsFullscreen(true)
				})
				.catch(err => {
					console.log(`Error attempting to enable fullscreen: ${err.message}`)
				})
		} else {
			document
				.exitFullscreen()
				.then(() => {
					setIsFullscreen(false)
				})
				.catch(err => {
					console.log(`Error attempting to exit fullscreen: ${err.message}`)
				})
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

	// Return the state and handlers
	return {
		status,
		isPlaying,
		isFloating,
		isCaptionsOn,
		isFullscreen,
		showControls,
		currentTime,
		duration,
		buffered,
		formatTime,
		playWithSound,
		togglePlayPause,
		toggleCaptions,
		toggleFullscreen,
		closeFloating,
		showControlsTemporarily,
		handleTimeUpdate,
		setIsFloating
	}
}
