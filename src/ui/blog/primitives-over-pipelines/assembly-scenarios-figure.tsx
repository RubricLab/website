'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

type StepTone = 'sky' | 'amber' | 'violet' | 'emerald'

type PrimitiveStep = {
	id: string
	label: string
	tone: StepTone
}

type Scenario = {
	id: string
	query: string
	summary: string
	steps: PrimitiveStep[]
}

type PlaybackState = {
	scenarioIndex: number
	visibleSteps: number
	holdTicks: number
}

const SCENARIOS: Scenario[] = [
	{
		id: 'subset-then-render',
		query: 'Show me inventory cards for the top 3 items with details.',
		summary: 'It might list first, retrieve a subset with get, then render.',
		steps: [
			{ id: 'list', label: 'list', tone: 'sky' },
			{ id: 'get-subset', label: 'get (subset)', tone: 'amber' },
			{ id: 'render', label: 'render[]', tone: 'violet' }
		]
	},
	{
		id: 'nested-data',
		query: 'Show nested component data for this bundle and each child.',
		summary: 'If the user asks for nested data, it may recurse and fetch deeper levels.',
		steps: [
			{ id: 'list', label: 'list', tone: 'sky' },
			{ id: 'get-parent', label: 'get (level 1)', tone: 'amber' },
			{ id: 'get-child', label: 'get (level 2)', tone: 'amber' },
			{ id: 'render', label: 'render[]', tone: 'violet' }
		]
	},
	{
		id: 'parallel-retrieval',
		query: 'Compare details for multiple records in one answer.',
		summary: 'If multiple records are needed, it can parallelize retrieval before rendering.',
		steps: [
			{ id: 'list', label: 'list', tone: 'sky' },
			{ id: 'get-parallel', label: 'get x N (parallel)', tone: 'emerald' },
			{ id: 'render', label: 'render[]', tone: 'violet' }
		]
	},
	{
		id: 'context-hit',
		query: 'The answer is already in context, render it directly.',
		summary: 'If the answer is already known from context, it might skip listing entirely.',
		steps: [{ id: 'render', label: 'render[]', tone: 'violet' }]
	}
]

const PRIMITIVE_SET = ['render_skeleton', 'list', 'get', 'render[]']
const FIGURE_H = 300
const STEP_INTERVAL_MS = 1050
const HOLD_TICKS_MAX = 2
const CONTROLS_LEFT = 8
const CONTROLS_BOTTOM = 10

const STEP_TONE_STYLES: Record<StepTone, { active: string; inactive: string; badge: string }> = {
	amber: {
		active: 'border-amber-500/45 bg-amber-500/15 text-amber-600 dark:text-amber-300',
		inactive: 'border-amber-500/20 bg-amber-500/5 text-amber-500/45',
		badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-200'
	},
	emerald: {
		active: 'border-emerald-500/45 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
		inactive: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500/45',
		badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-200'
	},
	sky: {
		active: 'border-sky-500/45 bg-sky-500/15 text-sky-600 dark:text-sky-300',
		inactive: 'border-sky-500/20 bg-sky-500/5 text-sky-500/45',
		badge: 'bg-sky-500/20 text-sky-700 dark:text-sky-200'
	},
	violet: {
		active: 'border-violet-500/45 bg-violet-500/15 text-violet-600 dark:text-violet-300',
		inactive: 'border-violet-500/20 bg-violet-500/5 text-violet-500/45',
		badge: 'bg-violet-500/20 text-violet-700 dark:text-violet-200'
	}
}

const getInitialPlaybackState = (): PlaybackState => ({
	holdTicks: 0,
	scenarioIndex: 0,
	visibleSteps: 1
})

const getNextPlaybackState = (state: PlaybackState): PlaybackState => {
	const scenario = SCENARIOS[state.scenarioIndex]
	if (!scenario) return state

	if (state.visibleSteps < scenario.steps.length)
		return { ...state, holdTicks: 0, visibleSteps: state.visibleSteps + 1 }

	if (state.holdTicks < HOLD_TICKS_MAX) return { ...state, holdTicks: state.holdTicks + 1 }

	const nextScenarioIndex = (state.scenarioIndex + 1) % SCENARIOS.length
	return {
		holdTicks: 0,
		scenarioIndex: nextScenarioIndex,
		visibleSteps: 1
	}
}

const StepArrow = ({ visible }: { visible: boolean }) => (
	<svg
		className={cn(
			'h-4 w-4 shrink-0 text-secondary transition-all duration-500 ease-out',
			visible ? 'translate-x-0 opacity-50' : '-translate-x-1 opacity-10'
		)}
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
	>
		<title>Arrow right</title>
		<path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
)

const WorkflowStep = ({
	index,
	isVisible,
	step
}: {
	index: number
	isVisible: boolean
	step: PrimitiveStep
}) => {
	const tone = STEP_TONE_STYLES[step.tone]

	return (
		<div
			className={cn(
				'flex h-11 min-w-[112px] items-center gap-2 rounded-md border px-3 font-mono text-[11px] transition-all duration-500 ease-out',
				isVisible ? `${tone.active} translate-y-0 opacity-100` : `${tone.inactive} translate-y-2 opacity-25`
			)}
		>
			<span
				className={cn(
					'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]',
					isVisible ? tone.badge : 'bg-secondary/10 text-secondary/70'
				)}
			>
				{index + 1}
			</span>
			<span className="truncate">{step.label}</span>
		</div>
	)
}

export const AssemblyScenariosFigure = () => {
	const [playback, setPlayback] = useState<PlaybackState>(getInitialPlaybackState)
	const [isPlaying, setIsPlaying] = useState(true)

	const reset = useCallback(() => {
		setPlayback(getInitialPlaybackState())
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		setIsPlaying(prev => !prev)
	}, [])

	useEffect(() => {
		if (!isPlaying) return

		const timer = setInterval(() => {
			setPlayback(prev => getNextPlaybackState(prev))
		}, STEP_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [isPlaying])

	const scenario = SCENARIOS[playback.scenarioIndex] ?? SCENARIOS[0]
	if (!scenario) return null

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="relative w-full overflow-hidden" style={{ height: FIGURE_H }}>
				<p
					className="absolute font-mono text-secondary/50 text-xs"
					style={{ left: '50%', top: 12, transform: 'translateX(-50%)' }}
				>
					Assembled primitives
				</p>

				<p
					className="absolute left-1/2 max-w-[92%] -translate-x-1/2 text-center font-mono text-[11px] text-primary/95 leading-relaxed transition-all duration-500"
					style={{ top: 40 }}
				>
					Query: "{scenario.query}"
				</p>

				<p
					className="absolute left-1/2 max-w-[94%] -translate-x-1/2 text-center text-secondary text-xs leading-relaxed transition-all duration-500"
					style={{ top: 78 }}
				>
					{scenario.summary}
				</p>

				<div className="absolute inset-x-0 px-2" style={{ top: 124 }}>
					<div className="mx-auto flex w-fit max-w-full items-center justify-center gap-2 overflow-x-auto pb-2">
						{scenario.steps.map((step, index) => {
							const isVisible = index < playback.visibleSteps
							const showArrow = index < playback.visibleSteps - 1
							const isLast = index === scenario.steps.length - 1

							return (
								<Fragment key={`${scenario.id}-${step.id}`}>
									<WorkflowStep step={step} index={index} isVisible={isVisible} />
									{isLast ? null : <StepArrow visible={showArrow} />}
								</Fragment>
							)
						})}
					</div>
				</div>

				<div className="absolute inset-x-0 px-2" style={{ bottom: 46 }}>
					<div className="mx-auto flex w-fit max-w-full items-center gap-2 overflow-x-auto rounded-full border border-subtle/80 bg-background/60 px-3 py-1.5">
						<span className="font-mono text-[10px] text-secondary/70">Primitive set:</span>
						{PRIMITIVE_SET.map(primitive => (
							<span
								key={primitive}
								className="rounded-full border border-subtle px-2 py-0.5 font-mono text-[10px] text-secondary/90"
							>
								{primitive}
							</span>
						))}
					</div>
				</div>

				<div
					className="absolute flex items-center gap-2"
					style={{ bottom: CONTROLS_BOTTOM, left: CONTROLS_LEFT }}
				>
					<Button size="sm" variant="icon" onClick={togglePlay}>
						{isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
					</Button>
					<Button size="sm" variant="icon" onClick={reset}>
						<RestartIcon className="h-4 w-4" />
					</Button>
					<Figure.Share />
				</div>
			</div>
		</div>
	)
}
