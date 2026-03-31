'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '~/components/button'
import { Figure } from '~/components/figure'
import { PauseIcon } from '~/components/icons/pause'
import { PlayIcon } from '~/components/icons/play'
import { RestartIcon } from '~/components/icons/restart'
import { cn } from '~/lib/utils/cn'

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
	{ label: 'Open PR', status: 'done', tick: 7 },
]

const BLOCKED: Step[] = [
	{ label: 'Write webhook handler', status: 'done', tick: 1 },
	{ label: 'Need database access', status: 'blocked', tick: 2 },
	{ label: 'Ask human for credentials', status: 'waiting', tick: 3 },
	{ label: 'Waiting', status: 'waiting', tick: 4 },
	{ label: 'Waiting', status: 'waiting', tick: 5 },
	{ label: 'Waiting', status: 'waiting', tick: 6 },
	{ label: 'Human shares credentials', status: 'done', tick: 7 },
	{ label: 'Need deploy token', status: 'blocked', tick: 8 },
	{ label: 'Ask human for token', status: 'waiting', tick: 9 },
	{ label: 'Waiting', status: 'waiting', tick: 10 },
	{ label: 'Waiting', status: 'waiting', tick: 11 },
]

const TICK_MS = 900
const TOTAL_TICKS = 11

const DOT: Record<StepStatus, string> = {
	done: 'bg-tint',
	blocked: 'bg-red-500/80',
	waiting: 'bg-secondary/30',
}

const LABEL: Record<StepStatus, string> = {
	done: 'text-primary',
	blocked: 'text-red-400',
	waiting: 'text-secondary/50',
}

export const BeforeAfterFlowFigure = () => {
	const [tick, setTick] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)
	const isComplete = tick >= TOTAL_TICKS

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
		<div className="flex-1 min-w-0">
			<span className="block font-mono text-[9px] uppercase tracking-wide text-primary/70 mb-3">
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
							<div className="flex flex-col items-center w-2 shrink-0">
								<div className={cn(
									'h-2 w-2 rounded-full mt-0.5',
									visible ? DOT[step.status] : 'bg-transparent'
								)} />
								{!isLast && (
									<div className={cn(
										'w-px flex-1 min-h-[12px]',
										visible ? 'bg-subtle' : 'bg-transparent'
									)} />
								)}
							</div>
							<div className="pb-2">
								<span className={cn('font-mono text-[11px] block', LABEL[step.status])}>
									{step.label}
								</span>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="flex flex-col gap-3">
				<div className="grid grid-cols-2 gap-4">
					{renderColumn('Unblocked', UNBLOCKED)}
					{renderColumn('Blocked', BLOCKED)}
				</div>

				<div className="flex items-center gap-2">
					<Button size="sm" variant="icon" onClick={togglePlay}>
						{isPlaying ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
					</Button>
					<Button size="sm" variant="icon" onClick={reset}>
						<RestartIcon className="h-3.5 w-3.5" />
					</Button>
					<Figure.Share />
				</div>
			</div>
		</div>
	)
}
