'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'
import { cn } from '~/lib/utils/cn'

const STEP_INTERVAL_MS = 2400

type UIState = {
	id: string
	event: string
	eventNumber: number
	phase: 'ui' | 'api' | 'provider' | 'db' | 'webhook' | 'cache' | 'realtime'
	compose: {
		to: string
		subject: string
		body: string
		buttonLabel: string
		buttonState: 'disabled' | 'enabled' | 'loading' | 'hidden'
		inputsDisabled: boolean
		toast?: string
	}
	inbox: {
		emails: { from: string; subject: string; time: string; unread: boolean }[]
		selectedIndex: number | null
	}
}

const BASE_INBOX = [
	{ from: 'GitHub', subject: 'New issue on rubriclabs/maige', time: '2h', unread: false },
	{ from: 'Cal.com', subject: 'Booking confirmed for Thursday', time: '5h', unread: false },
]

const STATES: UIState[] = [
	{
		id: 'render', event: 'ui:compose:render', eventNumber: 1, phase: 'ui',
		compose: { to: '', subject: '', body: '', buttonLabel: 'Send', buttonState: 'disabled', inputsDisabled: false },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'fill', event: 'ui:compose:fill', eventNumber: 2, phase: 'ui',
		compose: { to: 'dexter@rubriclabs.com', subject: 'Contract test #47', body: 'Verifying send/receive lifecycle.', buttonLabel: 'Send', buttonState: 'enabled', inputsDisabled: false },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'submit', event: 'ui:compose:submit', eventNumber: 3, phase: 'ui',
		compose: { to: 'dexter@rubriclabs.com', subject: 'Contract test #47', body: 'Verifying send/receive lifecycle.', buttonLabel: 'Sending...', buttonState: 'loading', inputsDisabled: true },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'api-send', event: 'api:send:request', eventNumber: 4, phase: 'api',
		compose: { to: 'dexter@rubriclabs.com', subject: 'Contract test #47', body: 'Verifying send/receive lifecycle.', buttonLabel: 'Sending...', buttonState: 'loading', inputsDisabled: true },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'gmail-send', event: 'provider:gmail:send', eventNumber: 5, phase: 'provider',
		compose: { to: 'dexter@rubriclabs.com', subject: 'Contract test #47', body: 'Verifying send/receive lifecycle.', buttonLabel: 'Sending...', buttonState: 'loading', inputsDisabled: true },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'db-insert', event: 'db:emails:insert', eventNumber: 6, phase: 'db',
		compose: { to: 'dexter@rubriclabs.com', subject: 'Contract test #47', body: 'Verifying send/receive lifecycle.', buttonLabel: 'Sending...', buttonState: 'loading', inputsDisabled: true },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'success', event: 'ui:compose:success', eventNumber: 7, phase: 'ui',
		compose: { to: '', subject: '', body: '', buttonLabel: 'Send', buttonState: 'disabled', inputsDisabled: false, toast: 'Sent' },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'webhook', event: 'webhook:gmail:receive', eventNumber: 8, phase: 'webhook',
		compose: { to: '', subject: '', body: '', buttonLabel: 'Send', buttonState: 'disabled', inputsDisabled: false },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'db-upsert', event: 'db:emails:upsert', eventNumber: 9, phase: 'db',
		compose: { to: '', subject: '', body: '', buttonLabel: 'Send', buttonState: 'disabled', inputsDisabled: false },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'redis', event: 'cache:redis:publish', eventNumber: 10, phase: 'cache',
		compose: { to: '', subject: '', body: '', buttonLabel: 'Send', buttonState: 'disabled', inputsDisabled: false },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'sse', event: 'realtime:sse:event', eventNumber: 11, phase: 'realtime',
		compose: { to: '', subject: '', body: '', buttonLabel: 'Send', buttonState: 'disabled', inputsDisabled: false },
		inbox: { emails: BASE_INBOX, selectedIndex: null },
	},
	{
		id: 'inbox-update', event: 'ui:inbox:update', eventNumber: 12, phase: 'ui',
		compose: { to: '', subject: '', body: '', buttonLabel: 'Send', buttonState: 'disabled', inputsDisabled: false },
		inbox: {
			emails: [{ from: 'dexter@rubriclabs.com', subject: 'Contract test #47', time: 'now', unread: true }, ...BASE_INBOX],
			selectedIndex: null,
		},
	},
	{
		id: 'inbox-select', event: 'ui:inbox:select', eventNumber: 13, phase: 'ui',
		compose: { to: '', subject: '', body: '', buttonLabel: 'Send', buttonState: 'disabled', inputsDisabled: false },
		inbox: {
			emails: [{ from: 'dexter@rubriclabs.com', subject: 'Contract test #47', time: 'now', unread: false }, ...BASE_INBOX],
			selectedIndex: 0,
		},
	},
]

const phaseColor: Record<string, string> = {
	ui: 'text-primary/70',
	api: 'text-primary/60',
	provider: 'text-primary/60',
	db: 'text-primary/60',
	webhook: 'text-primary/60',
	cache: 'text-primary/60',
	realtime: 'text-primary/70',
}

// Tiny wireframe field
const Field = ({ value, placeholder, disabled }: { value: string; placeholder: string; disabled: boolean }) => (
	<div className={cn(
		'rounded border px-1.5 py-0.5 font-mono text-[7px] leading-tight transition-all duration-500',
		disabled ? 'border-subtle/30 text-secondary/30' : 'border-subtle text-primary/80',
		!value && 'text-secondary/20'
	)}>
		{value || placeholder}
	</div>
)

export const EmailAppLifecycleFigure = () => {
	const [currentStep, setCurrentStep] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const state = STATES[currentStep]!
	const isComplete = currentStep >= STATES.length - 1
	const progress = (currentStep + 1) / STATES.length

	const reset = useCallback(() => { setCurrentStep(0); setIsPlaying(true) }, [])
	const togglePlay = useCallback(() => {
		if (isComplete) { reset() } else { setIsPlaying(prev => !prev) }
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined
		const timer = setInterval(() => { setCurrentStep(prev => Math.min(prev + 1, STATES.length - 1)) }, STEP_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete])

	useEffect(() => { if (isComplete) setIsPlaying(false) }, [isComplete])

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="flex flex-col gap-3">
				{/* App mockup */}
				<div className="overflow-hidden rounded-lg border border-subtle/60">
					{/* Title bar */}
					<div className="flex items-center gap-1.5 border-b border-subtle/40 bg-subtle/10 px-2.5 py-1">
						<div className="flex gap-1">
							<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
							<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
							<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
						</div>
						<span className="flex-1 text-center font-mono text-[8px] text-secondary/30">Mailroom</span>
					</div>

					{/* App split view */}
					<div className="grid grid-cols-2 divide-x divide-subtle/40">
						{/* Compose */}
						<div className="flex flex-col gap-1 p-2">
							<span className="font-mono text-[7px] uppercase tracking-wider text-secondary/30">Compose</span>
							<Field value={state.compose.to} placeholder="to" disabled={state.compose.inputsDisabled} />
							<Field value={state.compose.subject} placeholder="subject" disabled={state.compose.inputsDisabled} />
							<div className={cn(
								'h-5 rounded border px-1.5 py-0.5 font-mono text-[7px] leading-tight transition-all duration-500',
								state.compose.inputsDisabled ? 'border-subtle/30 text-secondary/30' : 'border-subtle text-primary/80',
								!state.compose.body && 'text-secondary/20'
							)}>
								{state.compose.body || 'message'}
							</div>
							<div className="flex items-center justify-between">
								<span className={cn(
									'rounded-full px-2 py-0.5 font-mono text-[7px] transition-all duration-500',
									state.compose.buttonState === 'disabled' && 'bg-subtle/20 text-secondary/30',
									state.compose.buttonState === 'enabled' && 'bg-primary/10 text-primary/60',
									state.compose.buttonState === 'loading' && 'bg-amber-500/10 text-amber-600/60 dark:text-amber-400/60',
								)}>
									{state.compose.buttonLabel}
								</span>
								{state.compose.toast && (
									<span className="animate-fadeIn font-mono text-[7px] text-emerald-600/60 dark:text-emerald-400/60">{state.compose.toast}</span>
								)}
							</div>
						</div>

						{/* Inbox */}
						<div className="flex flex-col gap-0.5 p-2">
							<span className="mb-0.5 font-mono text-[7px] uppercase tracking-wider text-secondary/30">Inbox</span>
							{state.inbox.emails.map((email, i) => (
								<div
									key={`${email.subject}-${String(i)}`}
									className={cn(
										'rounded px-1.5 py-1 transition-all duration-500',
										state.inbox.selectedIndex === i ? 'bg-sky-500/8 ring-1 ring-sky-500/20' :
										email.unread ? 'bg-primary/3' : ''
									)}
								>
									{state.inbox.selectedIndex === i ? (
										<div className="flex flex-col gap-0.5">
											<span className="font-mono text-[8px] font-medium text-primary/70">{email.subject}</span>
											<span className="font-mono text-[7px] text-secondary/40">{email.from}</span>
											<div className="mt-0.5 rounded bg-subtle/10 px-1 py-0.5 font-mono text-[7px] leading-snug text-secondary/40">
												Verifying the full send/receive lifecycle...
											</div>
										</div>
									) : (
										<div className="flex items-center gap-1">
											{email.unread && <div className="h-1 w-1 flex-shrink-0 rounded-full bg-sky-500/60" />}
											<span className={cn('truncate font-mono text-[8px]', email.unread ? 'text-primary/60' : 'text-secondary/40')}>
												{email.from}
											</span>
											<span className="ml-auto flex-shrink-0 font-mono text-[7px] text-secondary/20">{email.time}</span>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Event annotation */}
				<div className="flex items-center gap-2">
					<span className="font-mono text-[9px] text-secondary/40">{state.eventNumber}/13</span>
					<span className={cn('font-mono text-[11px]', phaseColor[state.phase] ?? 'text-secondary')}>
						{state.event}
					</span>
				</div>

				{/* Progress scrubber */}
				<div
					className="relative h-1 cursor-pointer rounded-full bg-subtle/30"
					onClick={(e) => {
						const rect = e.currentTarget.getBoundingClientRect()
						const pct = (e.clientX - rect.left) / rect.width
						setCurrentStep(Math.round(pct * (STATES.length - 1)))
						setIsPlaying(false)
					}}
				>
					<div
						className="absolute inset-y-0 left-0 rounded-full bg-primary/25 transition-all duration-300"
						style={{ width: `${String(progress * 100)}%` }}
					/>
				</div>

				{/* Controls */}
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
