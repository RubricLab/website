'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/button'
import { Figure } from '~/components/figure'
import { Arrow } from '~/components/icons/arrow'
import { PauseIcon } from '~/components/icons/pause'
import { PlayIcon } from '~/components/icons/play'
import { RestartIcon } from '~/components/icons/restart'
import { cn } from '~/lib/utils/cn'

const STEP_INTERVAL_MS = 2000

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

const SCENARIOS: Scenario[] = [
	{
		id: 'api-send',
		title: 'api:send',
		subtitle: 'Modular',
		outcome: 'pass',
		description: 'POST /api/email/send creates a row and returns the message ID.',
		checks: [
			{ id: 'api-status', label: 'HTTP status', method: 'curl', expected: '200', actual: '200', pass: true },
			{ id: 'api-body', label: 'Response body', method: 'curl', expected: '{ messageId: * }', actual: '{ messageId: "msg_7f3" }', pass: true },
			{ id: 'api-db', label: 'Database row', method: 'psql', expected: 'status = sent', actual: 'status = sent', pass: true },
		],
	},
	{
		id: 'ui-compose',
		title: 'ui:compose',
		subtitle: 'Modular',
		outcome: 'fail',
		description: 'Compose form disables inputs and shows spinner during submit.',
		checks: [
			{ id: 'ui-disabled', label: 'Inputs disabled', method: 'DOM', expected: 'all inputs disabled', actual: 'all inputs disabled', pass: true },
			{ id: 'ui-spinner', label: 'Loading spinner', method: 'screenshot', expected: 'spinner visible', actual: 'button text: "Send"', pass: false },
			{ id: 'ui-clear', label: 'Fields cleared', method: 'DOM', expected: 'all fields empty', actual: 'subject field retained', pass: false },
		],
	},
	{
		id: 'webhook-receive',
		title: 'webhook:receive',
		subtitle: 'Modular',
		outcome: 'pass',
		description: 'Gmail webhook arrives within 5s, schema validates, row is upserted.',
		checks: [
			{ id: 'wh-timing', label: 'Delivery time', method: 'log', expected: '< 5000ms', actual: '1240ms', pass: true },
			{ id: 'wh-schema', label: 'Payload schema', method: 'zod', expected: 'GmailWebhookSchema', actual: 'valid', pass: true },
			{ id: 'wh-db', label: 'Database upsert', method: 'psql', expected: 'status = received', actual: 'status = received', pass: true },
		],
	},
	{
		id: 'send-receive-e2e',
		title: 'send-and-receive',
		subtitle: 'End-to-end',
		outcome: 'fail',
		description: 'Full lifecycle: compose, send, webhook, realtime update. 13 events.',
		checks: [
			{ id: 'e2e-send', label: 'Events 1–7: send flow', method: 'trace', expected: '7 events in order', actual: '7/7 passed', pass: true },
			{ id: 'e2e-receive', label: 'Events 8–10: receive flow', method: 'trace', expected: '3 events in order', actual: '3/3 passed', pass: true },
			{ id: 'e2e-realtime', label: 'Events 11–13: realtime UI', method: 'trace', expected: 'SSE → inbox → detail', actual: 'SSE delivered, inbox stale', pass: false },
		],
	},
]

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

	const scenario = SCENARIOS[activeIndex]!
	const allChecksVisible = visibleChecks >= scenario.checks.length

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
		if (allChecksVisible) { resetChecks() } else { setIsPlaying(prev => !prev) }
	}, [allChecksVisible, resetChecks])

	useEffect(() => {
		if (!isPlaying || allChecksVisible) return undefined
		const timer = setInterval(() => { setVisibleChecks(prev => prev + 1) }, STEP_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [isPlaying, allChecksVisible])

	useEffect(() => { if (allChecksVisible) setIsPlaying(false) }, [allChecksVisible])

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="flex flex-col gap-3">
				{/* Header: title + outcome */}
				<div className="flex items-center justify-between">
					<div className="flex items-baseline gap-2">
						<span className="font-mono text-[11px] text-primary">{scenario.title}</span>
						<span className="font-mono text-[9px] text-secondary/50">{scenario.subtitle}</span>
					</div>
					<span className={cn(
						'font-mono text-[10px] font-medium transition-all duration-500',
						!allChecksVisible ? 'text-secondary/30' :
						scenario.outcome === 'pass' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
					)}>
						{allChecksVisible ? (scenario.outcome === 'pass' ? 'PASS' : 'FAIL') : `${visibleChecks}/${scenario.checks.length}`}
					</span>
				</div>

				{/* Description */}
				<p className="text-secondary text-[11px] leading-relaxed">{scenario.description}</p>

				{/* Checks */}
				<div className="flex flex-col gap-2">
					{scenario.checks.map((check, i) => {
						const isVisible = i < visibleChecks
						const isLatest = i === visibleChecks - 1

						return (
							<div
								key={check.id}
								className={cn(
									'rounded-lg border-l-2 py-2 pr-3 pl-3 transition-all duration-500',
									!isVisible
										? 'border-l-subtle/30 opacity-15'
										: check.pass
											? 'border-l-emerald-500'
											: 'border-l-red-500',
								)}
							>
								<div className="flex items-center gap-2.5">
									{/* Icon */}
									<div className={cn(
										'flex-shrink-0 transition-all duration-300',
										!isVisible ? 'text-secondary/20' : check.pass ? 'text-emerald-500' : 'text-red-500'
									)}>
										{isVisible ? (check.pass ? <CheckIcon /> : <CrossIcon />) : (
											<div className="h-3 w-3 rounded-full border border-subtle/30" />
										)}
									</div>

									{/* Label */}
									<span className={cn(
										'flex-1 font-mono text-[11px] transition-all duration-300',
										isVisible ? 'text-primary' : 'text-secondary/30'
									)}>
										{check.label}
									</span>

									{/* Compact result for completed (non-latest) checks */}
									{isVisible && !isLatest && (
										<span className={cn(
											'font-mono text-[9px]',
											check.pass ? 'text-secondary/40' : 'text-red-500/60'
										)}>
											{check.actual}
										</span>
									)}
								</div>

								{/* Expanded detail only on latest check */}
								{isVisible && isLatest && (
									<div className="mt-2 ml-5.5 flex gap-6 animate-fadeIn">
										<div>
											<span className="font-mono text-[9px] text-secondary/40">expected</span>
											<span className="ml-2 font-mono text-[11px] text-secondary">{check.expected}</span>
										</div>
										<div>
											<span className="font-mono text-[9px] text-secondary/40">actual</span>
											<span className={cn(
												'ml-2 font-mono text-[11px]',
												check.pass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
											)}>
												{check.actual}
											</span>
										</div>
									</div>
								)}
							</div>
						)
					})}
				</div>

				{/* Controls */}
				<div className="flex items-center justify-between">
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
