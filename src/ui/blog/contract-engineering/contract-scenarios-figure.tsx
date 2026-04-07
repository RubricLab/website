'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { Arrow } from '~/ui/icons/arrow'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

const STEP_INTERVAL_MS = 1600

type Check = {
	id: string
	label: string
	method: string
	expected: string
	actual: string
	pass: boolean
}

type Scenario = {
	id: string
	title: string
	subtitle: string
	outcome: 'pass' | 'fail'
	description: string
	checks: Check[]
}

const SCENARIOS = [
	{
		checks: [
			{
				actual: '200',
				expected: '200',
				id: 'api-status',
				label: 'HTTP status',
				method: 'curl',
				pass: true
			},
			{
				actual: '{ messageId: "msg_7f3" }',
				expected: '{ messageId: * }',
				id: 'api-body',
				label: 'Response body',
				method: 'curl',
				pass: true
			},
			{
				actual: 'status = sent',
				expected: 'status = sent',
				id: 'api-db',
				label: 'Database row',
				method: 'psql',
				pass: true
			}
		],
		description: 'POST /api/email/send creates a row and returns the message ID.',
		id: 'api-send',
		outcome: 'pass',
		subtitle: 'Modular',
		title: 'api:send'
	},
	{
		checks: [
			{
				actual: 'all inputs disabled',
				expected: 'all inputs disabled',
				id: 'ui-disabled',
				label: 'Inputs disabled',
				method: 'DOM',
				pass: true
			},
			{
				actual: 'This did not happen because the button never entered a loading state.',
				expected: 'spinner visible',
				id: 'ui-spinner',
				label: 'Loading spinner',
				method: 'screenshot',
				pass: false
			},
			{
				actual: 'This did not happen because the subject field still contained the previous value.',
				expected: 'all fields empty',
				id: 'ui-clear',
				label: 'Fields cleared',
				method: 'DOM',
				pass: false
			}
		],
		description: 'Compose form disables inputs and shows spinner during submit.',
		id: 'ui-compose',
		outcome: 'fail',
		subtitle: 'Modular',
		title: 'ui:compose'
	},
	{
		checks: [
			{
				actual: '1240ms',
				expected: '< 5000ms',
				id: 'wh-timing',
				label: 'Delivery time',
				method: 'log',
				pass: true
			},
			{
				actual: 'valid',
				expected: 'GmailWebhookSchema',
				id: 'wh-schema',
				label: 'Payload schema',
				method: 'zod',
				pass: true
			},
			{
				actual: 'status = received',
				expected: 'status = received',
				id: 'wh-db',
				label: 'Database upsert',
				method: 'psql',
				pass: true
			}
		],
		description: 'Gmail webhook arrives within 5s, schema validates, row is upserted.',
		id: 'webhook-receive',
		outcome: 'pass',
		subtitle: 'Modular',
		title: 'webhook:receive'
	},
	{
		checks: [
			{
				actual: '7/7 passed',
				expected: '7 events in order',
				id: 'e2e-send',
				label: 'Events 1-7: send flow',
				method: 'trace',
				pass: true
			},
			{
				actual: '3/3 passed',
				expected: '3 events in order',
				id: 'e2e-receive',
				label: 'Events 8-10: receive flow',
				method: 'trace',
				pass: true
			},
			{
				actual: 'This did not happen because the inbox never re-rendered after the SSE event arrived.',
				expected: 'SSE -> inbox -> detail',
				id: 'e2e-realtime',
				label: 'Events 11-13: realtime UI',
				method: 'trace',
				pass: false
			}
		],
		description: 'Full lifecycle: compose, send, webhook, realtime update. 13 events.',
		id: 'send-receive-e2e',
		outcome: 'fail',
		subtitle: 'End-to-end',
		title: 'send-and-receive'
	}
] satisfies [Scenario, ...Scenario[]]

const METHOD_STYLES: Record<string, string> = {
	curl: 'text-sky-500 dark:text-sky-400',
	DOM: 'text-violet-500 dark:text-violet-400',
	log: 'text-amber-600 dark:text-amber-400',
	psql: 'text-secondary/70',
	screenshot: 'text-rose-500 dark:text-rose-400',
	trace: 'text-tint'
}

const CheckIcon = () => (
	<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
		<title>Pass</title>
		<path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
)

const CrossIcon = () => (
	<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
		<title>Fail</title>
		<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
)

export const ContractScenariosFigure = () => {
	const [activeIndex, setActiveIndex] = useState(0)
	const [visibleChecks, setVisibleChecks] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const hasStarted = useRef(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const scenario = SCENARIOS.at(activeIndex) ?? SCENARIOS[0]
	const allChecksVisible = visibleChecks >= scenario.checks.length
	const progress = scenario.checks.length === 0 ? 0 : visibleChecks / scenario.checks.length

	const startPlayback = useCallback(() => {
		if (hasStarted.current) return
		hasStarted.current = true
		setVisibleChecks(0)
		setIsPlaying(true)
	}, [])

	useEffect(() => {
		const el = containerRef.current
		if (!el) return undefined

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					startPlayback()
				}
			},
			{ threshold: 0.25 }
		)

		observer.observe(el)

		const rect = el.getBoundingClientRect()
		const alreadyVisible =
			rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15
		if (alreadyVisible) {
			startPlayback()
		}

		return () => observer.disconnect()
	}, [startPlayback])

	const resetChecks = useCallback(() => {
		setVisibleChecks(0)
		setIsPlaying(true)
	}, [])

	const jumpToScenario = useCallback((index: number) => {
		setActiveIndex(index)
		setVisibleChecks(0)
		setIsPlaying(true)
	}, [])

	const goToPrevious = useCallback(() => {
		jumpToScenario(activeIndex === 0 ? SCENARIOS.length - 1 : activeIndex - 1)
	}, [activeIndex, jumpToScenario])

	const goToNext = useCallback(() => {
		jumpToScenario((activeIndex + 1) % SCENARIOS.length)
	}, [activeIndex, jumpToScenario])

	const togglePlay = useCallback(() => {
		if (allChecksVisible) resetChecks()
		else setIsPlaying(prev => !prev)
	}, [allChecksVisible, resetChecks])

	useEffect(() => {
		if (!isPlaying || allChecksVisible) return undefined
		const timer = setTimeout(() => {
			setVisibleChecks(prev => Math.min(prev + 1, scenario.checks.length))
		}, STEP_INTERVAL_MS)
		return () => clearTimeout(timer)
	}, [allChecksVisible, isPlaying, scenario.checks.length])

	useEffect(() => {
		if (allChecksVisible) setIsPlaying(false)
	}, [allChecksVisible])

	return (
		<div
			ref={containerRef}
			className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3"
		>
			<div className="flex flex-col gap-3">
				<div className="rounded-lg border border-subtle bg-accent px-3 py-3">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<span className="font-mono text-[11px] text-primary">{scenario.title}</span>
								<span className="font-mono text-[9px] text-secondary/45">{scenario.subtitle}</span>
							</div>
							<p className="mt-1 text-[11px] text-secondary leading-relaxed">{scenario.description}</p>
						</div>
						<span
							className={cn(
								'font-mono text-[10px]',
								allChecksVisible
									? scenario.outcome === 'pass'
										? 'text-emerald-600 dark:text-emerald-400'
										: 'text-red-600 dark:text-red-400'
									: 'text-secondary/35'
							)}
						>
							{allChecksVisible
								? scenario.outcome.toUpperCase()
								: `${visibleChecks}/${scenario.checks.length}`}
						</span>
					</div>

					<div className="mt-3 flex flex-wrap gap-2">
						{SCENARIOS.map((item, index) => {
							const isActive = index === activeIndex
							return (
								<button
									key={item.id}
									type="button"
									onClick={() => jumpToScenario(index)}
									className={cn(
										'rounded-full border px-2.5 py-1 font-mono text-[9px] transition-all duration-300',
										isActive
											? 'border-subtle bg-subtle/15 text-primary'
											: 'border-subtle/60 text-secondary/50 hover:bg-subtle/10'
									)}
								>
									{item.title}
								</button>
							)
						})}
					</div>

					<div className="mt-3 flex flex-col gap-2 font-mono">
						{scenario.checks.map((check, index) => {
							const isVisible = index < visibleChecks
							return (
								<div
									key={check.id}
									className={cn(
										'rounded-lg border px-3 py-2 transition-all duration-500',
										!isVisible
											? 'border-subtle/40 opacity-25'
											: check.pass
												? 'border-emerald-500/40 bg-emerald-500/[0.04]'
												: 'border-red-500/40 bg-red-500/[0.05]'
									)}
								>
									<div className="grid gap-2 sm:grid-cols-[18px_minmax(0,1fr)_62px] sm:items-center">
										<div
											className={cn(
												'transition-colors',
												!isVisible ? 'text-secondary/20' : check.pass ? 'text-emerald-500' : 'text-red-500'
											)}
										>
											{isVisible ? (
												check.pass ? (
													<CheckIcon />
												) : (
													<CrossIcon />
												)
											) : (
												<div className="h-3 w-3 rounded-full border border-subtle/40" />
											)}
										</div>
										<div className="min-w-0">
											<div
												className={cn('truncate text-[11px]', isVisible ? 'text-primary' : 'text-secondary/35')}
											>
												{check.label}
											</div>
										</div>
										<div
											className={cn(
												'text-[9px] uppercase',
												METHOD_STYLES[check.method] ?? 'text-secondary/45'
											)}
										>
											{check.method}
										</div>
									</div>

									<div className="mt-2 grid gap-2 text-[10px] sm:grid-cols-2">
										<div>
											<div className="text-secondary/35">expected</div>
											<div className={cn('mt-1', isVisible ? 'text-secondary' : 'text-secondary/30')}>
												{check.expected}
											</div>
										</div>
										<div>
											<div className="text-secondary/35">{check.pass ? 'observed' : 'why it failed'}</div>
											<div
												className={cn(
													'mt-1',
													!isVisible
														? 'text-secondary/30'
														: check.pass
															? 'text-emerald-600 dark:text-emerald-400'
															: 'text-red-600 dark:text-red-400'
												)}
											>
												{check.actual}
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>

				<button
					type="button"
					aria-label="Scrub contract playback progress"
					className="relative h-0.5 cursor-pointer rounded-full bg-subtle/20"
					onClick={e => {
						const rect = e.currentTarget.getBoundingClientRect()
						const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
						setVisibleChecks(Math.round(pct * scenario.checks.length))
						setIsPlaying(false)
					}}
				>
					<div
						className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all duration-300"
						style={{ width: `${progress * 100}%` }}
					/>
				</button>

				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<Button size="sm" variant="icon" onClick={togglePlay}>
							{isPlaying ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
						</Button>
						<Button size="sm" variant="icon" onClick={resetChecks}>
							<RestartIcon className="h-3.5 w-3.5" />
						</Button>
						<Figure.Share />
					</div>
					<div className="flex items-center gap-2">
						<Button size="sm" variant="icon" onClick={goToPrevious}>
							<Arrow className="h-3.5 w-3.5 rotate-180" />
						</Button>
						<Button size="sm" variant="icon" onClick={goToNext}>
							<Arrow className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
