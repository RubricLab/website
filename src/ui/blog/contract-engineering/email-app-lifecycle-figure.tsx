'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

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
	{ from: 'Cal.com', subject: 'Booking confirmed for Thursday', time: '5h', unread: false }
]

const STATES = [
	{
		compose: {
			body: '',
			buttonLabel: 'Send',
			buttonState: 'disabled',
			inputsDisabled: false,
			subject: '',
			to: ''
		},
		event: 'ui:compose:render',
		eventNumber: 1,
		id: 'render',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'ui'
	},
	{
		compose: {
			body: 'Verifying send/receive lifecycle.',
			buttonLabel: 'Send',
			buttonState: 'enabled',
			inputsDisabled: false,
			subject: 'Contract test #47',
			to: 'dexter@rubriclabs.com'
		},
		event: 'ui:compose:fill',
		eventNumber: 2,
		id: 'fill',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'ui'
	},
	{
		compose: {
			body: 'Verifying send/receive lifecycle.',
			buttonLabel: 'Sending...',
			buttonState: 'loading',
			inputsDisabled: true,
			subject: 'Contract test #47',
			to: 'dexter@rubriclabs.com'
		},
		event: 'ui:compose:submit',
		eventNumber: 3,
		id: 'submit',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'ui'
	},
	{
		compose: {
			body: 'Verifying send/receive lifecycle.',
			buttonLabel: 'Sending...',
			buttonState: 'loading',
			inputsDisabled: true,
			subject: 'Contract test #47',
			to: 'dexter@rubriclabs.com'
		},
		event: 'api:send:request',
		eventNumber: 4,
		id: 'api-send',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'api'
	},
	{
		compose: {
			body: 'Verifying send/receive lifecycle.',
			buttonLabel: 'Sending...',
			buttonState: 'loading',
			inputsDisabled: true,
			subject: 'Contract test #47',
			to: 'dexter@rubriclabs.com'
		},
		event: 'provider:gmail:send',
		eventNumber: 5,
		id: 'gmail-send',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'provider'
	},
	{
		compose: {
			body: 'Verifying send/receive lifecycle.',
			buttonLabel: 'Sending...',
			buttonState: 'loading',
			inputsDisabled: true,
			subject: 'Contract test #47',
			to: 'dexter@rubriclabs.com'
		},
		event: 'db:emails:insert',
		eventNumber: 6,
		id: 'db-insert',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'db'
	},
	{
		compose: {
			body: '',
			buttonLabel: 'Send',
			buttonState: 'disabled',
			inputsDisabled: false,
			subject: '',
			to: '',
			toast: 'Sent'
		},
		event: 'ui:compose:success',
		eventNumber: 7,
		id: 'success',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'ui'
	},
	{
		compose: {
			body: '',
			buttonLabel: 'Send',
			buttonState: 'disabled',
			inputsDisabled: false,
			subject: '',
			to: ''
		},
		event: 'webhook:gmail:receive',
		eventNumber: 8,
		id: 'webhook',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'webhook'
	},
	{
		compose: {
			body: '',
			buttonLabel: 'Send',
			buttonState: 'disabled',
			inputsDisabled: false,
			subject: '',
			to: ''
		},
		event: 'db:emails:upsert',
		eventNumber: 9,
		id: 'db-upsert',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'db'
	},
	{
		compose: {
			body: '',
			buttonLabel: 'Send',
			buttonState: 'disabled',
			inputsDisabled: false,
			subject: '',
			to: ''
		},
		event: 'cache:redis:publish',
		eventNumber: 10,
		id: 'redis',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'cache'
	},
	{
		compose: {
			body: '',
			buttonLabel: 'Send',
			buttonState: 'disabled',
			inputsDisabled: false,
			subject: '',
			to: ''
		},
		event: 'realtime:sse:event',
		eventNumber: 11,
		id: 'sse',
		inbox: { emails: BASE_INBOX, selectedIndex: null },
		phase: 'realtime'
	},
	{
		compose: {
			body: '',
			buttonLabel: 'Send',
			buttonState: 'disabled',
			inputsDisabled: false,
			subject: '',
			to: ''
		},
		event: 'ui:inbox:update',
		eventNumber: 12,
		id: 'inbox-update',
		inbox: {
			emails: [
				{ from: 'dexter@rubriclabs.com', subject: 'Contract test #47', time: 'now', unread: true },
				...BASE_INBOX
			],
			selectedIndex: null
		},
		phase: 'ui'
	},
	{
		compose: {
			body: '',
			buttonLabel: 'Send',
			buttonState: 'disabled',
			inputsDisabled: false,
			subject: '',
			to: ''
		},
		event: 'ui:inbox:select',
		eventNumber: 13,
		id: 'inbox-select',
		inbox: {
			emails: [
				{ from: 'dexter@rubriclabs.com', subject: 'Contract test #47', time: 'now', unread: false },
				...BASE_INBOX
			],
			selectedIndex: 0
		},
		phase: 'ui'
	}
] satisfies [UIState, ...UIState[]]

const phaseColor: Record<string, string> = {
	api: 'text-primary/60',
	cache: 'text-primary/60',
	db: 'text-primary/60',
	provider: 'text-primary/60',
	realtime: 'text-primary/70',
	ui: 'text-primary/70',
	webhook: 'text-primary/60'
}

// Tiny wireframe field
const Field = ({
	value,
	placeholder,
	disabled
}: {
	value: string
	placeholder: string
	disabled: boolean
}) => (
	<div
		className={cn(
			'rounded border px-1.5 py-0.5 font-mono text-[7px] leading-tight transition-all duration-500',
			disabled ? 'border-subtle/30 text-secondary/30' : 'border-subtle text-primary/80',
			!value && 'text-secondary/20'
		)}
	>
		{value || placeholder}
	</div>
)

export const EmailAppLifecycleFigure = () => {
	const [currentStep, setCurrentStep] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const state = STATES[currentStep] ?? STATES[0]
	const isComplete = currentStep >= STATES.length - 1
	const progress = (currentStep + 1) / STATES.length
	const composeToast = state.event === 'ui:compose:success' ? 'Sent' : ''
	const selectedEmail =
		state.inbox.selectedIndex === null ? null : state.inbox.emails[state.inbox.selectedIndex]

	const reset = useCallback(() => {
		setCurrentStep(0)
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
			setCurrentStep(prev => Math.min(prev + 1, STATES.length - 1))
		}, STEP_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete])

	useEffect(() => {
		if (isComplete) setIsPlaying(false)
	}, [isComplete])

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="flex flex-col gap-3">
				{/* App mockup */}
				<div className="overflow-hidden rounded-lg border border-subtle/60">
					{/* Title bar */}
					<div className="flex items-center gap-1.5 border-subtle/40 border-b bg-subtle/10 px-2.5 py-1">
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
							<span className="font-mono text-[7px] text-secondary/30 uppercase tracking-wider">
								Compose
							</span>
							<Field value={state.compose.to} placeholder="to" disabled={state.compose.inputsDisabled} />
							<Field
								value={state.compose.subject}
								placeholder="subject"
								disabled={state.compose.inputsDisabled}
							/>
							<div
								className={cn(
									'h-12 rounded border px-1.5 py-0.5 font-mono text-[7px] leading-tight transition-all duration-500',
									state.compose.inputsDisabled
										? 'border-subtle/30 text-secondary/30'
										: 'border-subtle text-primary/80',
									!state.compose.body && 'text-secondary/20'
								)}
							>
								{state.compose.body || 'message'}
							</div>
							<div className="flex items-center justify-between">
								<span
									className={cn(
										'rounded-full px-2 py-0.5 font-mono text-[7px] transition-all duration-500',
										state.compose.buttonState === 'disabled' && 'bg-subtle/20 text-secondary/30',
										state.compose.buttonState === 'enabled' && 'bg-primary/10 text-primary/60',
										state.compose.buttonState === 'loading' &&
											'bg-amber-500/10 text-amber-600/60 dark:text-amber-400/60'
									)}
								>
									{state.compose.buttonLabel}
								</span>
								{composeToast && (
									<span className="animate-fadeIn font-mono text-[7px] text-emerald-600/60 dark:text-emerald-400/60">
										{composeToast}
									</span>
								)}
							</div>
						</div>

						{/* Inbox */}
						<div className="flex min-h-[108px] flex-col gap-1 p-2">
							<span className="mb-0.5 font-mono text-[7px] text-secondary/30 uppercase tracking-wider">
								Inbox
							</span>
							<div className="flex flex-col gap-1">
								{state.inbox.emails.map((email, i) => (
									<div
										key={`${email.subject}-${String(i)}`}
										className={cn(
											'flex h-7 items-center gap-1 rounded px-1.5 py-1 transition-all duration-500',
											state.inbox.selectedIndex === i
												? 'bg-sky-500/8 ring-1 ring-sky-500/20'
												: email.unread
													? 'bg-primary/3'
													: ''
										)}
									>
										{email.unread ? (
											<div className="h-1 w-1 flex-shrink-0 rounded-full bg-sky-500/60" />
										) : (
											<div className="h-1 w-1 flex-shrink-0 rounded-full bg-transparent" />
										)}
										<div className="min-w-0 flex-1">
											<div className="truncate font-mono text-[8px] text-primary/60">{email.from}</div>
											<div className="truncate font-mono text-[7px] text-secondary/35">{email.subject}</div>
										</div>
										<span className="ml-auto flex-shrink-0 font-mono text-[7px] text-secondary/20">
											{email.time}
										</span>
									</div>
								))}
							</div>
							<div className="mt-auto rounded border border-subtle/40 bg-subtle/10 px-1.5 py-1">
								{selectedEmail ? (
									<div className="flex flex-col gap-0.5">
										<span className="truncate font-medium font-mono text-[8px] text-primary/70">
											{selectedEmail.subject}
										</span>
										<span className="truncate font-mono text-[7px] text-secondary/40">
											{selectedEmail.from}
										</span>
										<div className="truncate rounded bg-subtle/10 px-1 py-0.5 font-mono text-[7px] text-secondary/40">
											Verifying the full send/receive lifecycle...
										</div>
									</div>
								) : (
									<div className="font-mono text-[7px] text-secondary/30">
										Detail view appears after the final inbox event.
									</div>
								)}
							</div>
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
				<button
					type="button"
					aria-label="Scrub event lifecycle playback"
					className="relative h-1 cursor-pointer rounded-full bg-subtle/30"
					onClick={e => {
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
				</button>

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
