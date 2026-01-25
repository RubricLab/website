'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'
import { ShareIcon } from '~/ui/icons/share'

const COMPONENT_ID = 'query-comparison'

type Phase = 'gather' | 'action' | 'verify' | 'done'

type Step = {
	phase: Phase
	label: string
}

const SIMPLE_STEPS: Step[] = [
	{ label: 'Search codebase', phase: 'gather' },
	{ label: 'Found it', phase: 'done' }
]

const COMPLEX_STEPS: Step[] = [
	{ label: 'Read existing code', phase: 'gather' },
	{ label: 'Check for duplicates', phase: 'gather' },
	{ label: 'Write new code', phase: 'action' },
	{ label: 'Error found', phase: 'verify' },
	{ label: 'Fix the error', phase: 'action' },
	{ label: 'Run tests', phase: 'verify' },
	{ label: 'All tests pass', phase: 'done' }
]

const BASE_STEP_DURATION_MS = 1200

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const
type Speed = (typeof SPEED_OPTIONS)[number]

const phaseColors: Record<Phase, string> = {
	action: 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400',
	done: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
	gather: 'bg-sky-500/20 border-sky-500/40 text-sky-600 dark:text-sky-400',
	verify: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400'
}

const phaseLabels: Record<Phase, string> = {
	action: 'Action',
	done: 'Done',
	gather: 'Gather',
	verify: 'Verify'
}

const StepRow = ({ step, isNew }: { step: Step; isNew: boolean }) => {
	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-300',
				phaseColors[step.phase],
				isNew ? 'animate-slide-in' : ''
			)}
		>
			<span className="w-10 shrink-0 font-medium text-[10px] uppercase tracking-wide opacity-70 sm:w-12">
				{phaseLabels[step.phase]}
			</span>
			<span className="text-xs">{step.label}</span>
		</div>
	)
}

const QueryLane = ({
	number,
	title,
	steps,
	currentStep
}: {
	number: number
	title: string
	steps: Step[]
	currentStep: number
}) => {
	const visibleSteps = steps.slice(0, currentStep + 1)
	const isComplete = currentStep >= steps.length - 1

	return (
		<div className="flex flex-1 flex-col gap-4">
			<div className="flex flex-col gap-1 sm:h-14">
				<span className="flex h-5 w-5 items-center justify-center rounded-full bg-subtle text-primary text-xs">
					{number}
				</span>
				<p className="text-secondary text-sm">
					<span className="opacity-60">Query:</span> {title}
				</p>
			</div>

			<div className="flex h-[240px] flex-col gap-1.5">
				{visibleSteps.map((step, idx) => (
					<StepRow key={idx} step={step} isNew={idx === currentStep} />
				))}
			</div>

			<p className="h-5 font-mono text-secondary text-xs">
				{isComplete ? `Done in ${steps.length} steps` : ''}
			</p>
		</div>
	)
}

export const QueryComparison = () => {
	const [isPlaying, setIsPlaying] = useState(true)
	const [speed, setSpeed] = useState<Speed>(1)
	const [simpleStep, setSimpleStep] = useState(0)
	const [complexStep, setComplexStep] = useState(0)

	const { copied, handleCopy } = useClipboard()
	const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	const copyLink = useCallback(() => {
		const url = `${window.location.origin}${window.location.pathname}#${COMPONENT_ID}`
		handleCopy(url)
	}, [handleCopy])

	useEffect(() => {
		if (copied) toast.success('Link copied')
	}, [copied])

	const simpleComplete = simpleStep >= SIMPLE_STEPS.length - 1
	const complexComplete = complexStep >= COMPLEX_STEPS.length - 1
	const allComplete = simpleComplete && complexComplete

	const stepDuration = BASE_STEP_DURATION_MS / speed

	const reset = useCallback(() => {
		setSimpleStep(0)
		setComplexStep(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		if (allComplete) {
			reset()
		} else {
			setIsPlaying(prev => !prev)
		}
	}, [allComplete, reset])

	// Step progression
	useEffect(() => {
		if (!isPlaying) {
			if (stepIntervalRef.current) {
				clearInterval(stepIntervalRef.current)
				stepIntervalRef.current = null
			}
			return
		}

		stepIntervalRef.current = setInterval(() => {
			setSimpleStep(prev => (prev < SIMPLE_STEPS.length - 1 ? prev + 1 : prev))
			setComplexStep(prev => (prev < COMPLEX_STEPS.length - 1 ? prev + 1 : prev))
		}, stepDuration)

		return () => {
			if (stepIntervalRef.current) {
				clearInterval(stepIntervalRef.current)
			}
		}
	}, [isPlaying, stepDuration])

	useEffect(() => {
		if (allComplete) {
			if (stepIntervalRef.current) {
				clearInterval(stepIntervalRef.current)
				stepIntervalRef.current = null
			}
			setIsPlaying(false)
		}
	}, [allComplete])

	return (
		<section
			id={COMPONENT_ID}
			className="scroll-mt-8 rounded-custom border border-subtle bg-subtle/10 p-4"
		>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
				<QueryLane
					number={1}
					title="Where is the login function?"
					steps={SIMPLE_STEPS}
					currentStep={simpleStep}
				/>
				<QueryLane
					number={2}
					title="Add a function to parse dates into a readable format"
					steps={COMPLEX_STEPS}
					currentStep={complexStep}
				/>
			</div>

			<div className="mt-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button size="sm" variant="icon" onClick={togglePlay}>
						{isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
					</Button>
					{SPEED_OPTIONS.map(s => (
						<Button
							key={s}
							size="sm"
							variant={speed === s ? 'default' : 'ghost'}
							onClick={() => setSpeed(s)}
						>
							{s}x
						</Button>
					))}
					<Button size="sm" variant="icon" onClick={reset}>
						<RestartIcon className="h-4 w-4" />
					</Button>
				</div>
				<Button size="sm" variant="icon" onClick={copyLink}>
					<ShareIcon className="h-4 w-4" />
				</Button>
			</div>
		</section>
	)
}
