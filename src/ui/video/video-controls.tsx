import { useCallback, useEffect, useRef, useState } from 'react'

interface VideoControlsProps {
	isPlaying: boolean
	isCaptionsOn: boolean
	currentTime: number
	duration: number
	buffered: number
	onPlayPause: () => void
	onToggleCaptions: () => void
	onToggleFullscreen: () => void
	videoContainerRef: React.RefObject<HTMLDivElement>
}

export function VideoControls({
	isPlaying,
	isCaptionsOn,
	currentTime,
	duration,
	buffered,
	onPlayPause,
	onToggleCaptions,
	onToggleFullscreen,
	videoContainerRef
}: VideoControlsProps) {
	const [showControls, setShowControls] = useState(true)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const progressRef = useRef<HTMLDivElement>(null)
	const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Format time (seconds to mm:ss)
	const formatTime = useCallback((seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`
	}, [])

	// Handle scrubber click
	const handleProgressClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const video = videoContainerRef.current?.querySelector('video')
			const progressBar = progressRef.current
			if (!video || !progressBar) return

			const rect = progressBar.getBoundingClientRect()
			const pos = (e.clientX - rect.left) / rect.width
			video.currentTime = pos * video.duration
		},
		[videoContainerRef]
	)

	// Handle mouse enter/leave for controls visibility
	const handleMouseEnter = useCallback(() => {
		setShowControls(true)
		if (controlsTimeoutRef.current) {
			clearTimeout(controlsTimeoutRef.current)
			controlsTimeoutRef.current = null
		}
	}, [])

	const handleMouseLeave = useCallback(() => {
		if (isPlaying) {
			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current)
			}
			const timeout = setTimeout(() => {
				setShowControls(false)
				controlsTimeoutRef.current = null
			}, 1000)
			controlsTimeoutRef.current = timeout
		}
	}, [isPlaying])

	// Show/hide controls with timeout
	useEffect(() => {
		// Clear existing timeout
		if (controlsTimeoutRef.current) {
			clearTimeout(controlsTimeoutRef.current)
		}

		// Hide controls after 3 seconds if playing
		if (isPlaying && !isFullscreen) {
			const timeout = setTimeout(() => {
				setShowControls(false)
			}, 3000)
			controlsTimeoutRef.current = timeout
		}

		return () => {
			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current)
			}
		}
	}, [isPlaying, isFullscreen])

	// Monitor fullscreen changes
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement)
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange)

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange)
		}
	}, [])

	return (
		<div
			className={`video-controls z-20 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-3 ${
				showControls ? 'always-show' : ''
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Progress Bar */}
			<div
				ref={progressRef}
				className="progress-bar w-[calc(100%-32px)]"
				onClick={handleProgressClick}
				onKeyDown={e =>
					e.key === 'Enter' && handleProgressClick(e as unknown as React.MouseEvent<HTMLDivElement>)
				}
				role="slider"
				aria-label="Video progress"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={duration ? Math.round((currentTime / duration) * 100) : 0}
				tabIndex={0}
			>
				<div
					className="progress-buffer"
					style={{ width: duration ? `${(buffered / duration) * 100}%` : '0%' }}
				/>
				<div
					className="progress-current"
					style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
				/>
			</div>

			{/* Controls Row */}
			<div className="flex items-center justify-between px-4 pt-3">
				<div className="flex items-center gap-3">
					{/* Play/Pause Button */}
					<button
						className="text-white focus:outline-none"
						onClick={onPlayPause}
						aria-label={isPlaying ? 'Pause' : 'Play'}
						type="button"
					>
						{isPlaying ? (
							<svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
								<rect x="6" y="4" width="4" height="16" />
								<rect x="14" y="4" width="4" height="16" />
							</svg>
						) : (
							<svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
								<path d="M8 5v14l11-7z" />
							</svg>
						)}
					</button>

					{/* Time Display */}
					<div className="text-sm text-white">
						{formatTime(currentTime)} / {formatTime(duration)}
					</div>
				</div>

				<div className="flex items-center gap-4">
					{/* CC Button */}
					<button
						className={`cc-button text-white focus:outline-none ${isCaptionsOn ? 'bg-white/30' : 'opacity-70'}`}
						onClick={onToggleCaptions}
						aria-label="Toggle Captions"
						type="button"
					>
						CC
					</button>

					{/* Fullscreen Button */}
					<button
						className="text-white focus:outline-none"
						onClick={onToggleFullscreen}
						aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
						type="button"
					>
						{isFullscreen ? (
							<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
								<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
							</svg>
						) : (
							<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
								<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
							</svg>
						)}
					</button>
				</div>
			</div>
		</div>
	)
}
