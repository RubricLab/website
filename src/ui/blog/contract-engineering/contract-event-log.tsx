'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

const TICK_MS = 700
const EVAL_DELAY = 3 // evaluations trail 3 ticks behind arrivals

type EventEntry = {
	id: number
	event: string
	artifact: string
	proof: string
	category: 'ui' | 'api' | 'db' | 'provider' | 'webhook' | 'cache' | 'realtime'
}

const EVENTS: EventEntry[] = [
	{
		artifact: 'compose-empty.png',
		category: 'ui',
		event: 'ui:compose:render',
		id: 1,
		proof: 'Screenshot: empty form'
	},
	{
		artifact: 'compose-filled.png',
		category: 'ui',
		event: 'ui:compose:fill',
		id: 2,
		proof: 'Screenshot: fields populated'
	},
	{
		artifact: 'submit-loading.png',
		category: 'ui',
		event: 'ui:compose:submit',
		id: 3,
		proof: 'Screenshot: loading spinner'
	},
	{
		artifact: 'send-request.log',
		category: 'api',
		event: 'api:send:request',
		id: 4,
		proof: 'Log: POST /api/email/send'
	},
	{
		artifact: 'gmail-response.json',
		category: 'provider',
		event: 'provider:gmail:send',
		id: 5,
		proof: 'Gmail API returns 200'
	},
	{
		artifact: 'emails-row.txt',
		category: 'db',
		event: 'db:emails:insert',
		id: 6,
		proof: 'Row exists: status sent'
	},
	{
		artifact: 'success-toast.png',
		category: 'ui',
		event: 'ui:compose:success',
		id: 7,
		proof: 'Screenshot: success toast'
	},
	{
		artifact: 'webhook-payload.json',
		category: 'webhook',
		event: 'webhook:gmail:receive',
		id: 8,
		proof: 'POST within 5s, schema valid'
	},
	{
		artifact: 'upsert-row.txt',
		category: 'db',
		event: 'db:emails:upsert',
		id: 9,
		proof: 'Row: status received'
	},
	{
		artifact: 'redis-publish.log',
		category: 'cache',
		event: 'cache:redis:publish',
		id: 10,
		proof: 'PUBLISH inbox:{accountId}'
	},
	{
		artifact: 'sse-event.txt',
		category: 'realtime',
		event: 'realtime:sse:event',
		id: 11,
		proof: 'SSE delivers new_email'
	},
	{
		artifact: 'inbox-updated.png',
		category: 'ui',
		event: 'ui:inbox:update',
		id: 12,
		proof: 'Screenshot: new email in list'
	},
	{
		artifact: 'detail-view.png',
		category: 'ui',
		event: 'ui:inbox:select',
		id: 13,
		proof: 'Screenshot: detail view'
	}
]

const TOTAL_TICKS = EVENTS.length + EVAL_DELAY

const categoryColor: Record<string, string> = {
	api: 'text-primary/60',
	cache: 'text-primary/60',
	db: 'text-primary/60',
	provider: 'text-primary/60',
	realtime: 'text-primary/70',
	ui: 'text-primary/70',
	webhook: 'text-primary/60'
}

const borderColor: Record<string, string> = {
	api: 'border-l-primary/20',
	cache: 'border-l-primary/20',
	db: 'border-l-primary/20',
	provider: 'border-l-primary/20',
	realtime: 'border-l-primary/30',
	ui: 'border-l-primary/30',
	webhook: 'border-l-primary/20'
}

const CheckIcon = () => (
	<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
		<title>Passed</title>
		<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
)

const SpinnerIcon = () => (
	<svg
		className="h-3 w-3 animate-spin"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
	>
		<title>Running</title>
		<circle cx="12" cy="12" r="10" strokeDasharray="50" strokeDashoffset="20" strokeLinecap="round" />
	</svg>
)

export const ContractEventLog = () => {
	const [tick, setTick] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const hasAutoPlayed = useRef(false)
	const containerRef = useRef<HTMLDivElement>(null)

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
			{ threshold: 0.3 }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const arrivedCount = Math.min(tick, EVENTS.length)
	const evaluatedCount = Math.min(Math.max(tick - EVAL_DELAY, 0), EVENTS.length)
	const isComplete = tick >= TOTAL_TICKS

	const reset = useCallback(() => {
		setTick(0)
		setIsPlaying(true)
	}, [])
	const togglePlay = useCallback(() => {
		if (isComplete) {
			reset()
		} else {
			setIsPlaying(prev => !prev)
		}
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined
		const timer = setInterval(() => {
			setTick(prev => Math.min(prev + 1, TOTAL_TICKS))
		}, TICK_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete])

	useEffect(() => {
		if (isComplete) setIsPlaying(false)
	}, [isComplete])

	return (
		<div ref={containerRef} className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
				<span className="font-mono text-[9px] text-secondary/50 uppercase tracking-wide">
					End-to-end contract: event {'->'} artifact {'->'} test
				</span>
				<span
					className={cn(
						'font-mono text-[10px] transition-all duration-300',
						isComplete ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'text-secondary/40'
					)}
				>
					{evaluatedCount}/{EVENTS.length}
				</span>
			</div>

			{/* Event log */}
			<div className="flex flex-col gap-1.5">
				{EVENTS.map((entry, i) => {
					const arrived = i < arrivedCount
					const evaluated = i < evaluatedCount
					const evaluating = arrived && !evaluated
					const evalStatus = evaluated ? 'pass' : evaluating ? 'run' : 'wait'

					return (
						<div
							key={entry.id}
							className={cn(
								'grid items-center gap-x-2.5 rounded-r-md border-l-2 py-1 pr-2 pl-2.5 transition-all duration-300',
								'grid-cols-[12px_16px_1fr_44px] sm:grid-cols-[12px_16px_1fr_120px_170px_44px]',
								!arrived && 'border-l-transparent opacity-15',
								evaluating && (borderColor[entry.category] ?? 'border-l-primary/30'),
								evaluated && (borderColor[entry.category] ?? 'border-l-primary/20')
							)}
						>
							{/* Icon */}
							<div
								className={cn(
									'transition-all duration-300',
									evaluated && 'text-emerald-500/60',
									evaluating && 'text-amber-500',
									!arrived && 'text-secondary/20'
								)}
							>
								{evaluated ? (
									<CheckIcon />
								) : evaluating ? (
									<SpinnerIcon />
								) : (
									<div className="h-3 w-3 rounded-full border border-subtle/30" />
								)}
							</div>

							{/* Number */}
							<span className="font-mono text-[9px] text-secondary/30">{entry.id}</span>

							{/* Event name */}
							<span
								className={cn(
									'truncate font-mono text-[10px] transition-all duration-300',
									!arrived ? 'text-secondary/30' : (categoryColor[entry.category] ?? 'text-secondary')
								)}
							>
								{entry.event}
							</span>

							<span
								className={cn(
									'hidden truncate rounded border px-1.5 py-0.5 font-mono text-[8px] sm:block',
									!arrived ? 'border-subtle/30 text-secondary/25' : 'border-subtle/60 text-secondary/45'
								)}
							>
								{entry.artifact}
							</span>

							<span
								className={cn(
									'hidden truncate font-mono text-[9px] sm:block',
									!arrived ? 'text-secondary/25' : 'text-secondary/35'
								)}
							>
								test({entry.proof})
							</span>

							<span
								className={cn(
									'text-right font-mono text-[9px]',
									evaluated
										? 'text-emerald-600 dark:text-emerald-400'
										: evaluating
											? 'text-amber-600 dark:text-amber-400'
											: 'text-secondary/25'
								)}
							>
								{evalStatus.toUpperCase()}
							</span>
						</div>
					)
				})}
			</div>

			{/* Scrubber */}
			<button
				type="button"
				aria-label="Scrub contract event log playback"
				className="relative mt-3 h-0.5 cursor-pointer rounded-full bg-subtle/20"
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
			</button>

			{/* Controls */}
			<div className="mt-3 flex items-center gap-2">
				<Button size="sm" variant="icon" onClick={togglePlay}>
					{isPlaying ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
				</Button>
				<Button size="sm" variant="icon" onClick={reset}>
					<RestartIcon className="h-3.5 w-3.5" />
				</Button>
				<Figure.Share />
			</div>
		</div>
	)
}
