'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'
import { cn } from '~/lib/utils/cn'

const STEP_INTERVAL_MS = 1600

type EventEntry = {
	id: number
	event: string
	proof: string
	category: 'ui' | 'api' | 'db' | 'provider' | 'webhook' | 'cache' | 'realtime'
}

const EVENTS: EventEntry[] = [
	{ id: 1, event: 'ui:compose:render', proof: 'Screenshot: empty form', category: 'ui' },
	{ id: 2, event: 'ui:compose:fill', proof: 'Screenshot: fields populated', category: 'ui' },
	{ id: 3, event: 'ui:compose:submit', proof: 'Screenshot: loading spinner', category: 'ui' },
	{ id: 4, event: 'api:send:request', proof: 'Log: POST /api/email/send', category: 'api' },
	{ id: 5, event: 'provider:gmail:send', proof: 'Gmail API returns 200', category: 'provider' },
	{ id: 6, event: 'db:emails:insert', proof: 'Row exists: status sent', category: 'db' },
	{ id: 7, event: 'ui:compose:success', proof: 'Screenshot: success toast', category: 'ui' },
	{ id: 8, event: 'webhook:gmail:receive', proof: 'POST within 5s, schema valid', category: 'webhook' },
	{ id: 9, event: 'db:emails:upsert', proof: 'Row: status received', category: 'db' },
	{ id: 10, event: 'cache:redis:publish', proof: 'PUBLISH inbox:{accountId}', category: 'cache' },
	{ id: 11, event: 'realtime:sse:event', proof: 'SSE delivers new_email', category: 'realtime' },
	{ id: 12, event: 'ui:inbox:update', proof: 'Screenshot: new email in list', category: 'ui' },
	{ id: 13, event: 'ui:inbox:select', proof: 'Screenshot: detail view', category: 'ui' },
]

const categoryColor: Record<string, string> = {
	ui: 'text-primary/70',
	api: 'text-primary/60',
	db: 'text-primary/60',
	provider: 'text-primary/60',
	webhook: 'text-primary/60',
	cache: 'text-primary/60',
	realtime: 'text-primary/70',
}

const borderColor: Record<string, string> = {
	ui: 'border-l-primary/30',
	api: 'border-l-primary/20',
	db: 'border-l-primary/20',
	provider: 'border-l-primary/20',
	webhook: 'border-l-primary/20',
	cache: 'border-l-primary/20',
	realtime: 'border-l-primary/30',
}

const CheckIcon = () => (
	<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
		<title>Passed</title>
		<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
)

const SpinnerIcon = () => (
	<svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
		<title>Running</title>
		<circle cx="12" cy="12" r="10" strokeDasharray="50" strokeDashoffset="20" strokeLinecap="round" />
	</svg>
)

export const ContractEventLog = () => {
	const [verifiedCount, setVerifiedCount] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const isComplete = verifiedCount >= EVENTS.length

	const reset = useCallback(() => { setVerifiedCount(0); setIsPlaying(true) }, [])
	const togglePlay = useCallback(() => {
		if (isComplete) { reset() } else { setIsPlaying(prev => !prev) }
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined
		const timer = setInterval(() => { setVerifiedCount(prev => Math.min(prev + 1, EVENTS.length)) }, STEP_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete])

	useEffect(() => { if (isComplete) setIsPlaying(false) }, [isComplete])

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
				<span className="font-mono text-[9px] uppercase tracking-wide text-secondary/50">
					End-to-end contract: send &amp; receive
				</span>
				<span className={cn(
					'font-mono text-[10px] transition-all duration-300',
					isComplete ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'text-secondary/40'
				)}>
					{verifiedCount}/{EVENTS.length}
				</span>
			</div>

			{/* Event log */}
			<div className="flex flex-col gap-1.5">
				{EVENTS.map((entry, i) => {
					const status = i < verifiedCount ? 'passed' : i === verifiedCount ? 'running' : 'pending'

					return (
						<div
							key={entry.id}
							className={cn(
								'flex items-center gap-2.5 rounded-r-md border-l-2 py-1 pr-2 pl-2.5 transition-all duration-300',
								status === 'pending' && 'border-l-transparent opacity-15',
								status === 'running' && (borderColor[entry.category] ?? 'border-l-primary/30'),
								status === 'passed' && (borderColor[entry.category] ?? 'border-l-primary/20'),
							)}
						>
							{/* Icon */}
							<div className={cn(
								'flex-shrink-0 transition-all duration-300',
								status === 'passed' && 'text-emerald-500/60',
								status === 'running' && 'text-amber-500',
								status === 'pending' && 'text-secondary/20',
							)}>
								{status === 'passed' ? <CheckIcon /> : status === 'running' ? <SpinnerIcon /> : (
									<div className="h-3 w-3 rounded-full border border-subtle/30" />
								)}
							</div>

							{/* Number */}
							<span className="w-4 flex-shrink-0 font-mono text-[9px] text-secondary/30">
								{entry.id}
							</span>

							{/* Event name */}
							<span className={cn(
								'min-w-0 flex-1 truncate font-mono text-[11px] transition-all duration-300',
								status === 'pending' ? 'text-secondary/30' : (categoryColor[entry.category] ?? 'text-secondary')
							)}>
								{entry.event}
							</span>

							{/* Proof — only when passed */}
							{status === 'passed' && (
								<span className="hidden flex-shrink-0 font-mono text-[9px] text-secondary/30 sm:block">
									{entry.proof}
								</span>
							)}
						</div>
					)
				})}
			</div>

			{/* Scrubber */}
			<div
				className="relative mt-3 h-0.5 cursor-pointer rounded-full bg-subtle/20"
				onClick={(e) => {
					const rect = e.currentTarget.getBoundingClientRect()
					const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
					setVerifiedCount(Math.round(pct * EVENTS.length))
					setIsPlaying(false)
				}}
			>
				<div
					className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all duration-300"
					style={{ width: `${(verifiedCount / EVENTS.length) * 100}%` }}
				/>
			</div>

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
