'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

const STEP_INTERVAL_MS = 1600
const STEPS_PER_EVENT = 2

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
	const [stage, setStage] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const totalStages = EVENTS.length * STEPS_PER_EVENT
	const passedCount = Math.floor(stage / STEPS_PER_EVENT)
	const isComplete = stage >= totalStages

	const reset = useCallback(() => {
		setStage(0)
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
			setStage(prev => Math.min(prev + 1, totalStages))
		}, STEP_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete, totalStages])

	useEffect(() => {
		if (isComplete) setIsPlaying(false)
	}, [isComplete])

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
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
					{passedCount}/{EVENTS.length}
				</span>
			</div>

			{/* Event log */}
			<div className="flex flex-col gap-1.5">
				{EVENTS.map((entry, i) => {
					const artifactReady = stage > i * STEPS_PER_EVENT
					const checkPassed = stage > i * STEPS_PER_EVENT + 1
					const checkRunning = artifactReady && !checkPassed
					const receiptStatus = artifactReady ? 'received' : 'waiting'
					const evalStatus = checkPassed ? 'pass' : checkRunning ? 'run' : 'wait'

					return (
						<div
							key={entry.id}
							className={cn(
								'flex items-center gap-2.5 rounded-r-md border-l-2 py-1 pr-2 pl-2.5 transition-all duration-300',
								!artifactReady && 'border-l-transparent opacity-15',
								checkRunning && (borderColor[entry.category] ?? 'border-l-primary/30'),
								checkPassed && (borderColor[entry.category] ?? 'border-l-primary/20'),
								artifactReady && !checkRunning && !checkPassed && (borderColor[entry.category] ?? 'border-l-primary/20')
							)}
						>
							{/* Icon */}
							<div
								className={cn(
									'flex-shrink-0 transition-all duration-300',
									checkPassed && 'text-emerald-500/60',
									checkRunning && 'text-amber-500',
									!artifactReady && 'text-secondary/20',
									artifactReady && !checkRunning && !checkPassed && 'text-primary/45'
								)}
							>
								{checkPassed ? (
									<CheckIcon />
								) : checkRunning ? (
									<SpinnerIcon />
								) : artifactReady ? (
									<div className="h-3 w-3 rounded-full bg-primary/35" />
								) : (
									<div className="h-3 w-3 rounded-full border border-subtle/30" />
								)}
							</div>

							{/* Number */}
							<span className="w-4 flex-shrink-0 font-mono text-[9px] text-secondary/30">{entry.id}</span>

							{/* Event name */}
							<span
								className={cn(
									'min-w-0 flex-1 truncate font-mono text-[10px] transition-all duration-300',
									!artifactReady
										? 'text-secondary/30'
										: (categoryColor[entry.category] ?? 'text-secondary')
								)}
							>
								{entry.event}
							</span>

							<span
								className={cn(
									'hidden min-w-[118px] flex-shrink-0 rounded border px-1.5 py-0.5 font-mono text-[8px] sm:block',
									!artifactReady
										? 'border-subtle/30 text-secondary/25'
										: 'border-subtle/60 text-secondary/45'
								)}
							>
								{entry.artifact}
							</span>

							<span
								className={cn(
									'hidden min-w-[170px] flex-shrink-0 font-mono text-[9px] sm:block',
									!artifactReady ? 'text-secondary/25' : 'text-secondary/35'
								)}
							>
								test({entry.proof})
							</span>

							<span
								className={cn(
									'min-w-[52px] text-right font-mono text-[9px]',
									checkPassed
										? 'text-emerald-600 dark:text-emerald-400'
										: checkRunning
											? 'text-amber-600 dark:text-amber-400'
											: artifactReady
												? 'text-primary/45'
												: 'text-secondary/25'
								)}
							>
								{receiptStatus.toUpperCase()}
							</span>

							<span
								className={cn(
									'min-w-[44px] text-right font-mono text-[9px]',
									checkPassed
										? 'text-emerald-600 dark:text-emerald-400'
										: checkRunning
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
					setStage(Math.round(pct * totalStages))
					setIsPlaying(false)
				}}
			>
				<div
					className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all duration-300"
					style={{ width: `${(stage / totalStages) * 100}%` }}
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
