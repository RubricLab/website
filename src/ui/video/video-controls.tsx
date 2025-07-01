import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '../button'
import { Demaximize } from '../icons/demaximize'
import { Maximize } from '../icons/maximize'
import { PauseIcon } from '../icons/pause'
import { PlayIcon } from '../icons/play'

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
		// biome-ignore lint/a11y/noStaticElementInteractions: custom video interactions
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
					<Button
						variant="icon"
						size="sm"
						onClick={onPlayPause}
						aria-label={isPlaying ? 'Pause' : 'Play'}
					>
						{isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
					</Button>
				</div>

				<div className="flex items-center gap-4">
					{/* CC Button */}
					<Button
						variant="icon"
						size="sm"
						className={cn('!py-1', isCaptionsOn ? 'bg-white/30' : 'opacity-70')}
						onClick={onToggleCaptions}
						aria-label="Toggle Captions"
					>
						CC
					</Button>

					{/* Fullscreen Button */}
					<Button
						variant="icon"
						size="sm"
						className="text-white focus:outline-none"
						onClick={onToggleFullscreen}
						aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
					>
						{isFullscreen ? <Demaximize className="size-5" /> : <Maximize className="size-5" />}
					</Button>
				</div>
			</div>
		</div>
	)
}
