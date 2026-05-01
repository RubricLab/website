'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { BLOCK_COLORS, FIGURE_CONTAINER_CLASS } from '~/ui/blog/figure-palette'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

const STEP_INTERVAL_MS = 1800

type AgentStep = {
	id: string
	reasoning: string
	tool:
		| 'terminal'
		| 'write_code'
		| 'browser'
		| 'computer_use'
		| 'screenshot'
		| 'expose_port'
		| 'ping_user'
	call: string
	result: string
}

const STEPS = [
	{
		call: 'node --version',
		id: 'node',
		reasoning: "I'll check the runtime before touching the app.",
		result: 'v24.3.0',
		tool: 'terminal'
	},
	{
		call: 'create invoice-generator',
		id: 'scaffold',
		reasoning: 'Runtime looks good. I can scaffold the invoice generator.',
		result: 'wrote 96 lines',
		tool: 'write_code'
	},
	{
		call: 'bun dev --port 3000',
		id: 'server',
		reasoning: 'Start the server and watch for build errors.',
		result: 'ready on localhost:3000',
		tool: 'terminal'
	},
	{
		call: 'open localhost:3000/invoice-generator',
		id: 'open-local',
		reasoning: 'Open the app in a browser before testing behavior.',
		result: 'page loaded',
		tool: 'browser'
	},
	{
		call: 'fill sample invoice',
		id: 'fill',
		reasoning: 'Exercise the form with realistic invoice details.',
		result: 'client, items, tax entered',
		tool: 'computer_use'
	},
	{
		call: 'capture preview',
		id: 'local-shot',
		reasoning: 'Inspect the generated invoice before publishing it.',
		result: 'totals line up',
		tool: 'screenshot'
	},
	{
		call: 'publish port 3000',
		id: 'deploy',
		reasoning: "Expose the working app on Ted's subdomain.",
		result: 'ted.jar.rubric.me/invoice-generator',
		tool: 'expose_port'
	},
	{
		call: 'open live URL',
		id: 'open-live',
		reasoning: 'Check the deployment from a clean browser session.',
		result: 'live page loaded',
		tool: 'browser'
	},
	{
		call: 'capture live page',
		id: 'live-shot',
		reasoning: 'The live screenshot matches the local test.',
		result: 'looks good live',
		tool: 'screenshot'
	},
	{
		call: '"try this: ted.jar.rubric.me/invoice-generator"',
		id: 'ping',
		reasoning: 'Now send Ted the smallest useful update.',
		result: 'sent',
		tool: 'ping_user'
	}
] satisfies [AgentStep, ...AgentStep[]]

const TOOL_COLORS: Record<AgentStep['tool'], string> = {
	browser: 'border-sky-500/35 bg-sky-500/10 text-sky-600 dark:text-sky-400',
	computer_use: 'border-violet-500/35 bg-violet-500/10 text-violet-600 dark:text-violet-400',
	expose_port: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
	ping_user: 'border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400',
	screenshot: 'border-violet-500/35 bg-violet-500/10 text-violet-600 dark:text-violet-400',
	terminal: 'border-subtle/70 bg-subtle/25 text-primary/70',
	write_code: 'border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400'
}

const ToolBadge = ({ tool }: { tool: AgentStep['tool'] }) => (
	<span
		className={cn(
			'rounded border px-1.5 py-0.5 font-mono text-[9px] leading-none',
			TOOL_COLORS[tool]
		)}
	>
		{tool}
	</span>
)

const AgentStepCard = ({ active, step }: { active: boolean; step: AgentStep }) => (
	<div
		className={cn(
			'rounded-lg border px-2 py-1 transition-all duration-500',
			active ? 'border-primary/25 bg-background/80' : 'border-subtle/50 bg-background/45'
		)}
	>
		<div className="flex items-start justify-between gap-2">
			<p className={cn('text-[10px] leading-snug', active ? 'text-primary/85' : 'text-secondary/55')}>
				{step.reasoning}
			</p>
			<ToolBadge tool={step.tool} />
		</div>
		<div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 font-mono text-[8px]">
			<span className="truncate text-secondary/45">{step.call}</span>
			<span className={cn(active ? BLOCK_COLORS.amber.text : 'text-secondary/35')}>{step.result}</span>
		</div>
	</div>
)

const SmsBubble = ({ children, from }: { children: React.ReactNode; from: 'agent' | 'user' }) => (
	<div
		className={cn(
			'wrap-anywhere max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-snug shadow-sm',
			from === 'user'
				? 'ml-auto rounded-br-md border border-sky-500/40 bg-sky-500/15 text-sky-700 dark:text-sky-300'
				: 'mr-auto rounded-bl-md border border-subtle/70 bg-subtle/35 text-primary/80'
		)}
	>
		{children}
	</div>
)

const TypingBubble = () => (
	<div className="mr-auto flex items-center gap-1 rounded-full border border-subtle/60 bg-subtle/25 px-3 py-2">
		<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary/45" />
		<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary/35 [animation-delay:150ms]" />
		<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary/25 [animation-delay:300ms]" />
	</div>
)

export const OpenclawSmsAgentFigure = () => {
	const [currentStep, setCurrentStep] = useState(0)
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
			{ threshold: 0.35 }
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const isComplete = currentStep >= STEPS.length - 1
	const progress = (currentStep + 1) / STEPS.length
	const visibleSteps = STEPS.slice(0, currentStep + 1)
	const isTypingInitialReply = currentStep === 0
	const isTypingFinalReply = currentStep === STEPS.length - 2

	const reset = useCallback(() => {
		setCurrentStep(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		if (isComplete) {
			reset()
			return
		}
		setIsPlaying(prev => !prev)
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined

		const timer = setInterval(() => {
			setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
		}, STEP_INTERVAL_MS)

		return () => clearInterval(timer)
	}, [isPlaying, isComplete])

	useEffect(() => {
		if (isComplete) setIsPlaying(false)
	}, [isComplete])

	return (
		<div ref={containerRef} className={FIGURE_CONTAINER_CLASS}>
			<div className="grid min-h-[470px] gap-3 md:grid-cols-[1.35fr_0.8fr]">
				<div className="relative overflow-hidden rounded-lg border border-subtle/70 bg-background/70 p-3">
					<div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background/90 to-transparent" />
					<div className="scrollbar-none relative flex h-[446px] flex-col justify-start gap-1.5 overflow-hidden">
						{visibleSteps.map((step, index) => (
							<AgentStepCard active={index === visibleSteps.length - 1} key={step.id} step={step} />
						))}
					</div>
				</div>

				<div className="flex min-h-[470px] items-center justify-center">
					<div className="flex aspect-[1/2.17] h-[450px] max-h-full flex-col overflow-hidden rounded-4xl border border-subtle/70 bg-background/80 p-3 shadow-sm">
						<div className="mx-auto mb-5 h-1 w-12 rounded-full bg-subtle/70" />
						<div className="flex min-h-0 flex-1 flex-col gap-2">
							<div className="mr-2 ml-auto font-medium text-[11px] text-secondary/45">Ted</div>
							<SmsBubble from="user">can you build me an invoice generator?</SmsBubble>
							{isTypingInitialReply ? <TypingBubble /> : null}
							{currentStep >= 1 ? <SmsBubble from="agent">Sure, give me some time</SmsBubble> : null}
							{isTypingFinalReply ? <TypingBubble /> : null}
							{isComplete ? (
								<SmsBubble from="agent">
									try this:{' '}
									<span className="font-mono text-[11px]">ted.jar.rubric.me/invoice-generator</span>
								</SmsBubble>
							) : null}
						</div>
					</div>
				</div>
			</div>

			<button
				type="button"
				aria-label="Scrub SMS agent playback"
				className="relative mt-3 h-0.5 w-full cursor-pointer rounded-full bg-subtle/20"
				onClick={e => {
					const rect = e.currentTarget.getBoundingClientRect()
					const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
					setCurrentStep(Math.round(pct * (STEPS.length - 1)))
					setIsPlaying(false)
				}}
			>
				<div
					className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all duration-300"
					style={{ width: `${String(progress * 100)}%` }}
				/>
			</button>

			<div className="mt-3 flex items-center gap-2">
				<Button size="sm" variant="icon" onClick={togglePlay}>
					{isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
				</Button>
				<Button size="sm" variant="icon" onClick={reset}>
					<RestartIcon className="h-4 w-4" />
				</Button>
				<Figure.Share />
			</div>
		</div>
	)
}
