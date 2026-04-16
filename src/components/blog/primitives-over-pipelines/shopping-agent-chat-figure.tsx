'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/button'
import { Figure } from '~/components/figure'
import { Arrow } from '~/components/icons/arrow'
import { PauseIcon } from '~/components/icons/pause'
import { PlayIcon } from '~/components/icons/play'
import { RestartIcon } from '~/components/icons/restart'
import { cn } from '~/lib/utils/cn'

const STEP_INTERVAL_MS = 1600

type Scenario = {
	id: string
	intent: string
	finalMessage: string
	userMessage: string
	steps: {
		id: string
		text: string
		tool: 'list' | 'get' | 'render'
		parallelGets?: number
		skeletonCount?: number
	}[]
}

const SCENARIOS: Scenario[] = [
	{
		finalMessage: 'Done. Here are the shirts I found for you.',
		id: 'browse',
		intent: 'Browse available products',
		steps: [
			{ id: 'browse-list', text: 'Listing shirts that match your query.', tool: 'list' },
			{
				id: 'browse-get',
				parallelGets: 3,
				text: 'Fetching details for the top relevant shirts in parallel.',
				tool: 'get'
			},
			{ id: 'browse-render', skeletonCount: 3, text: 'Rendering product details.', tool: 'render' }
		],
		userMessage: 'Show me available shirts'
	},
	{
		finalMessage: "Done. Here's the detailed view for that shirt.",
		id: 'details',
		intent: 'Inspect one specific product',
		steps: [
			{ id: 'details-get', text: 'Got it. Fetching that specific shirt by ID.', tool: 'get' },
			{
				id: 'details-render',
				skeletonCount: 1,
				text: 'Rendering the item details view.',
				tool: 'render'
			}
		],
		userMessage: 'Show me the details for that blue Oxford shirt that you mentioned'
	},
	{
		finalMessage: "Done. Here's your side-by-side comparison.",
		id: 'compare',
		intent: 'Compare multiple products',
		steps: [
			{
				id: 'compare-get',
				parallelGets: 2,
				text: 'Fetching shirt A and shirt B details in parallel.',
				tool: 'get'
			},
			{
				id: 'compare-render',
				skeletonCount: 2,
				text: 'Rendering side-by-side comparison.',
				tool: 'render'
			}
		],
		userMessage: 'Compare these two shirts'
	},
	{
		finalMessage: 'Done. Rendering that shirt directly from context.',
		id: 'context-known',
		intent: 'Item already known from context',
		steps: [
			{
				id: 'context-render',
				skeletonCount: 1,
				text: 'Using prior context. Rendering the exact shirt view directly.',
				tool: 'render'
			}
		],
		userMessage: 'Show me that shirt again'
	}
]

const FLOW_COLORS: Record<string, string> = {
	get: 'border-amber-500/45 bg-amber-500/15 text-amber-600 dark:text-amber-400',
	list: 'border-sky-500/45 bg-sky-500/15 text-sky-600 dark:text-sky-400',
	render: 'border-violet-500/45 bg-violet-500/15 text-violet-600 dark:text-violet-300'
}

const ToolBadge = ({ label }: { label: 'list' | 'get' | 'render' }) => {
	const colorClass = FLOW_COLORS[label] ?? 'border-subtle bg-subtle/30 text-secondary'

	return (
		<div
			className={cn(
				'rounded-md border px-2 py-1 font-mono text-[11px] leading-none transition-all duration-500',
				colorClass
			)}
		>
			{label}
		</div>
	)
}

const RenderSkeletonPreview = ({ count }: { count: number }) => (
	<div
		className="mt-1 grid gap-1.5"
		style={{ gridTemplateColumns: `repeat(${String(Math.min(count, 3))}, minmax(0, 1fr))` }}
	>
		{Array.from({ length: count }, (_, index) => (
			<div
				key={`skeleton-${String(index)}`}
				className="rounded-md border border-subtle bg-subtle/20 p-2"
			>
				<div className="h-2 w-full rounded bg-subtle/70" />
				<div className="mt-1 h-2 w-2/3 rounded bg-subtle/70" />
				<div className="mt-2 h-6 w-full rounded bg-subtle/70" />
			</div>
		))}
	</div>
)

export const ShoppingAgentChatFigure = () => {
	const [activeScenarioIndex, setActiveScenarioIndex] = useState(0)
	const [visibleSteps, setVisibleSteps] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const reset = useCallback(() => {
		setVisibleSteps(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		setIsPlaying(prev => {
			if (!prev) return true
			return false
		})
	}, [])

	const jumpToScenario = useCallback((index: number) => {
		setActiveScenarioIndex(index)
		setVisibleSteps(0)
		setIsPlaying(true)
	}, [])
	const goToPreviousScenario = useCallback(() => {
		const nextIndex = activeScenarioIndex === 0 ? SCENARIOS.length - 1 : activeScenarioIndex - 1
		jumpToScenario(nextIndex)
	}, [activeScenarioIndex, jumpToScenario])
	const goToNextScenario = useCallback(() => {
		const nextIndex = (activeScenarioIndex + 1) % SCENARIOS.length
		jumpToScenario(nextIndex)
	}, [activeScenarioIndex, jumpToScenario])

	const scenario = SCENARIOS[activeScenarioIndex] ??
		SCENARIOS[0] ?? {
			finalMessage: '',
			id: 'fallback',
			intent: '',
			steps: [],
			userMessage: ''
		}
	const totalTimelineSteps = scenario.steps.length + 1
	const isComplete = visibleSteps >= totalTimelineSteps

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined

		const timer = setInterval(() => {
			setVisibleSteps(prev => {
				if (prev >= totalTimelineSteps) return prev
				return prev + 1
			})
		}, STEP_INTERVAL_MS)

		return () => clearInterval(timer)
	}, [isPlaying, isComplete, totalTimelineSteps])

	useEffect(() => {
		if (!isPlaying || !isComplete) return

		const timer = setTimeout(() => {
			setVisibleSteps(0)
		}, STEP_INTERVAL_MS)

		return () => clearTimeout(timer)
	}, [isPlaying, isComplete])

	const handleTogglePlay = useCallback(() => {
		if (isComplete) {
			setVisibleSteps(0)
			setIsPlaying(true)
			return
		}
		togglePlay()
	}, [isComplete, togglePlay])

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="relative flex h-[360px] w-full flex-col gap-3 overflow-hidden">
				<div className="scrollbar-none min-h-0 flex-1 overflow-y-auto rounded-lg border border-subtle/80 bg-background/70 p-3">
					<div className="flex flex-col gap-2">
						<div className="ml-auto max-w-[78%] animate-slide-in rounded-xl border border-sky-500/40 bg-sky-500/14 px-3 py-2 text-sky-700 text-sm leading-snug dark:text-sky-300">
							{scenario.userMessage}
						</div>

						{scenario.steps.slice(0, Math.min(visibleSteps, scenario.steps.length)).map(step => (
							<div
								key={step.id}
								className="mr-auto flex max-w-[82%] animate-slide-in flex-col gap-1 text-sm transition-all duration-500"
							>
								<div className="flex items-center gap-1">
									{step.parallelGets && step.parallelGets > 1 ? (
										Array.from({ length: step.parallelGets }, (_, index) => (
											<ToolBadge key={`${step.id}-parallel-${String(index)}`} label="get" />
										))
									) : (
										<ToolBadge label={step.tool} />
									)}
								</div>
								<p className="text-primary/90 leading-snug">{step.text}</p>
								{step.tool === 'render' && step.skeletonCount ? (
									<RenderSkeletonPreview count={step.skeletonCount} />
								) : null}
							</div>
						))}
						{visibleSteps > scenario.steps.length ? (
							<div className="mr-auto max-w-[82%] animate-slide-in text-primary/90 text-sm leading-snug">
								{scenario.finalMessage}
							</div>
						) : null}
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button intent="ghost" iconOnly size="xs" aria-label="Play/pause demo" onClick={handleTogglePlay}>
							{isPlaying ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
						</Button>
						<Button intent="ghost" iconOnly size="xs" aria-label="Restart demo" onClick={reset}>
							<RestartIcon className="h-3.5 w-3.5" />
						</Button>
						<Figure.Share />
					</div>
					<div className="flex items-center gap-2">
						<p className="text-secondary text-xs">{scenario.intent}</p>
						<Button intent="ghost" iconOnly size="xs" aria-label="Previous scenario" onClick={goToPreviousScenario}>
							<Arrow className="h-3.5 w-3.5 rotate-180" />
						</Button>
						<Button intent="ghost" iconOnly size="xs" aria-label="Next scenario" onClick={goToNextScenario}>
							<Arrow className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
