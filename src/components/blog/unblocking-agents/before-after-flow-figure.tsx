'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/components/button'
import { Figure } from '~/components/figure'
import { PauseIcon } from '~/components/icons/pause'
import { PlayIcon } from '~/components/icons/play'
import { RestartIcon } from '~/components/icons/restart'

/**
 * Side-by-side: unblocked vs blocked agent building the same feature.
 * Both advance at the same pace until the blocked side stalls.
 * Uses a single tick counter so both columns stay in sync.
 */

type StepStatus = 'done' | 'blocked' | 'waiting'

type Step = { label: string; status: StepStatus; tick: number }

// Both are building a webhook integration. Unblocked flows; blocked stalls on infra.
const UNBLOCKED: Step[] = [
	{ label: 'Write webhook handler', status: 'done', tick: 1 },
	{ label: 'Provision database', status: 'done', tick: 2 },
	{ label: 'Expose endpoint via ngrok', status: 'done', tick: 3 },
	{ label: 'Deploy to staging', status: 'done', tick: 4 },
	{ label: 'Send test event', status: 'done', tick: 5 },
	{ label: 'Verify receipt end-to-end', status: 'done', tick: 6 },
	{ label: 'Open PR', status: 'done', tick: 7 }
]

const BLOCKED: Step[] = [
	{ label: 'Write webhook handler', status: 'done', tick: 1 },
	{ label: 'Need database access', status: 'blocked', tick: 2 },
	{ label: 'Waiting for human', status: 'waiting', tick: 3 },
	// ticks 4-6: nothing new appears, just stalls
	{ label: 'Human shares credentials', status: 'done', tick: 7 },
	{ label: 'Need deploy token', status: 'blocked', tick: 8 },
	{ label: 'Waiting for human', status: 'waiting', tick: 9 }
	// ticks 10-11: stalls again
]

const TICK_MS = 900
const TOTAL_TICKS = 11

const DOT: Record<StepStatus, string> = {
	blocked: 'bg-red-500/80',
	done: 'bg-tint',
	waiting: 'bg-secondary/30'
}

const LABEL: Record<StepStatus, string> = {
	blocked: 'text-red-400',
	done: 'text-primary',
	waiting: 'text-secondary/50'
}

export const BeforeAfterFlowFigure = () => {
	const [tick, setTick] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const hasAutoPlayed = useRef(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const isComplete = tick >= TOTAL_TICKS

	useEffect(() => {
		const el = containerRef.current
		if (!el) return undefined
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting && !hasAutoPlayed.current) {
					hasAutoPlayed.current = true
					setIsPlaying(true)
				}
			},
			{ threshold: 0.5 }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const reset = useCallback(() => {
		setTick(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		if (isComplete) reset()
		else setIsPlaying(prev => !prev)
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined
		const timer = setTimeout(() => setTick(t => t + 1), TICK_MS)
		return () => clearTimeout(timer)
	}, [isPlaying, isComplete, tick])

	useEffect(() => {
		if (isComplete) setIsPlaying(false)
	}, [isComplete])

	const renderColumn = (title: string, steps: Step[]) => (
		<div className="min-w-0 flex-1">
			<span className="mb-3 block font-mono text-[9px] text-primary/70 uppercase tracking-wide">
				{title}
			</span>
			<div className="flex flex-col gap-0">
				{steps.map((step, i) => {
					const visible = step.tick <= tick
					const isLast = i === steps.length - 1
					return (
						<div
							key={`${title}-${String(i)}`}
							className={cn(
								'flex gap-2.5 transition-all duration-500',
								visible ? 'opacity-100' : 'opacity-0'
							)}
						>
							<div className="flex w-2 shrink-0 flex-col items-center">
								<div
									className={cn(
										'mt-0.5 h-2 w-2 rounded-full',
										visible ? DOT[step.status] : 'bg-transparent'
									)}
								/>
								{!isLast && (
									<div
										className={cn('min-h-[12px] w-px flex-1', visible ? 'bg-subtle' : 'bg-transparent')}
									/>
								)}
							</div>
							<div className="pb-2">
								<span className={cn('block font-mono text-[11px]', LABEL[step.status])}>{step.label}</span>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)

	return (
		<div
			ref={containerRef}
			className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3"
		>
			<div className="flex flex-col gap-3">
				<div className="grid grid-cols-2 gap-4">
					{renderColumn('Unblocked', UNBLOCKED)}
					{renderColumn('Blocked', BLOCKED)}
				</div>

				{/* Scrubber */}
				<div
					className="relative h-0.5 cursor-pointer rounded-full bg-subtle/20"
					onClick={e => {
						const rect = e.currentTarget.getBoundingClientRect()
						const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
						setTick(Math.round(pct * TOTAL_TICKS))
						setIsPlaying(false)
					}}
				>
					<div
						className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all duration-300"
						style={{ width: `${(tick / TOTAL_TICKS) * 100}%` }}
					/>
				</div>

				<div className="flex items-center gap-2">
					<Button intent="ghost" iconOnly size="xs" aria-label="Play/pause demo" onClick={togglePlay}>
						{isPlaying ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
					</Button>
					<Button intent="ghost" iconOnly size="xs" aria-label="Restart demo" onClick={reset}>
						<RestartIcon className="h-3.5 w-3.5" />
					</Button>
					<Figure.Share />
				</div>
			</div>
		</div>
	)
}
