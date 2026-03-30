'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/button'
import { Figure } from '~/components/figure'
import { PauseIcon } from '~/components/icons/pause'
import { PlayIcon } from '~/components/icons/play'
import { RestartIcon } from '~/components/icons/restart'
import { cn } from '~/lib/utils/cn'

/**
 * Shows the autonomous verification loop:
 * 1. Agent deploys a sign-in page
 * 2. Takes a screenshot
 * 3. LLM judge scores it → finds a spacing issue → FAIL
 * 4. Agent patches and re-deploys
 * 5. Takes another screenshot
 * 6. LLM judge scores it → PASS
 */

const STEP_INTERVAL_MS = 2800

type Step = {
	id: string
	phase: 'deploy' | 'screenshot' | 'judge' | 'patch'
	label: string
	// What the lo-fi page mockup looks like
	pageState: 'broken' | 'fixed'
	// Judge evaluation (only shown in judge phase)
	judge?: {
		criteria: { label: string; score: number; pass: boolean }[]
		verdict: 'fail' | 'pass'
		note: string
	}
}

const STEPS: Step[] = [
	{
		id: 'deploy-1',
		phase: 'deploy',
		label: 'Agent deploys sign-in page',
		pageState: 'broken',
	},
	{
		id: 'screenshot-1',
		phase: 'screenshot',
		label: 'Captures screenshot at /login',
		pageState: 'broken',
	},
	{
		id: 'judge-1',
		phase: 'judge',
		label: 'LLM judge evaluates against design system',
		pageState: 'broken',
		judge: {
			criteria: [
				{ label: 'Logo placement', score: 9, pass: true },
				{ label: 'Form layout', score: 8, pass: true },
				{ label: 'Header spacing', score: 3, pass: false },
				{ label: 'Button styling', score: 8, pass: true },
			],
			verdict: 'fail',
			note: '80px gap between header and form — design spec is 16px',
		},
	},
	{
		id: 'patch',
		phase: 'patch',
		label: 'Agent patches spacing: mt-20 → mt-4',
		pageState: 'broken',
	},
	{
		id: 'deploy-2',
		phase: 'deploy',
		label: 'Agent re-deploys',
		pageState: 'fixed',
	},
	{
		id: 'screenshot-2',
		phase: 'screenshot',
		label: 'Captures screenshot at /login',
		pageState: 'fixed',
	},
	{
		id: 'judge-2',
		phase: 'judge',
		label: 'LLM judge re-evaluates',
		pageState: 'fixed',
		judge: {
			criteria: [
				{ label: 'Logo placement', score: 9, pass: true },
				{ label: 'Form layout', score: 8, pass: true },
				{ label: 'Header spacing', score: 9, pass: true },
				{ label: 'Button styling', score: 8, pass: true },
			],
			verdict: 'pass',
			note: 'All criteria above threshold',
		},
	},
]

// Tiny lo-fi sign-in page mockup
const PageMockup = ({ state, highlighted }: { state: 'broken' | 'fixed'; highlighted: boolean }) => (
	<div className={cn(
		'overflow-hidden rounded-md border transition-all duration-500',
		highlighted ? 'border-amber-500/30' : 'border-subtle/40'
	)}>
		{/* Browser bar */}
		<div className="flex items-center gap-1 border-b border-subtle/30 bg-subtle/10 px-2 py-1">
			<div className="flex gap-0.5">
				<div className="h-1 w-1 rounded-full bg-secondary/15" />
				<div className="h-1 w-1 rounded-full bg-secondary/15" />
				<div className="h-1 w-1 rounded-full bg-secondary/15" />
			</div>
			<div className="mx-2 flex-1 rounded bg-subtle/15 px-1.5 py-0.5">
				<span className="font-mono text-[7px] text-secondary/30">localhost:3000/login</span>
			</div>
		</div>

		{/* Page content */}
		<div className="bg-background/50 px-4 py-3">
			{/* Logo */}
			<div className="mx-auto h-2 w-10 rounded-sm bg-secondary/15" />

			{/* The spacing bug */}
			<div className={cn(
				'transition-all duration-500',
				state === 'broken' ? 'mt-8' : 'mt-2'
			)}>
				{state === 'broken' && (
					<div className="mb-1 flex justify-center">
						<span className="font-mono text-[6px] text-red-500/40">↕ 80px</span>
					</div>
				)}

				{/* Form */}
				<div className="mx-auto flex w-24 flex-col gap-1">
					<div className="h-2 rounded-sm border border-subtle/30 bg-background" />
					<div className="h-2 rounded-sm border border-subtle/30 bg-background" />
					<div className="h-2.5 rounded-sm bg-primary/10" />
				</div>

				{/* Sign in with Google */}
				<div className="mx-auto mt-1.5 flex w-20 items-center justify-center gap-1 rounded-sm border border-subtle/20 py-0.5">
					<span className="font-mono text-[6px] text-secondary/30">Sign in with Google</span>
				</div>
			</div>
		</div>
	</div>
)

export const VerificationLayersFigure = () => {
	const [currentStep, setCurrentStep] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const step = STEPS[currentStep]!
	const isComplete = currentStep >= STEPS.length - 1

	const reset = useCallback(() => { setCurrentStep(0); setIsPlaying(true) }, [])
	const togglePlay = useCallback(() => {
		if (isComplete) { reset() } else { setIsPlaying(prev => !prev) }
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined
		const timer = setInterval(() => { setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1)) }, STEP_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete])

	useEffect(() => { if (isComplete) setIsPlaying(false) }, [isComplete])

	const phaseIcon: Record<string, string> = {
		deploy: '↑',
		screenshot: '📷',
		judge: '⚖',
		patch: '→',
	}

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="flex flex-col gap-3">
				{/* Layout: page mockup + judge panel side by side */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.2fr]">
					{/* Left: page mockup */}
					<div>
						<span className="mb-1.5 block font-mono text-[8px] uppercase tracking-wider text-secondary/30">
							Screenshot
						</span>
						<PageMockup
							state={step.pageState}
							highlighted={step.phase === 'screenshot'}
						/>
					</div>

					{/* Right: judge evaluation */}
					<div>
						<span className="mb-1.5 block font-mono text-[8px] uppercase tracking-wider text-secondary/30">
							LLM Judge
						</span>
						<div className="rounded-md border border-subtle/40 p-2.5">
							{step.judge ? (
								<div className="flex flex-col gap-2">
									{/* Criteria scores */}
									<div className="flex flex-col gap-1">
										{step.judge.criteria.map(c => (
											<div key={c.label} className="flex items-center gap-2">
												<span className={cn(
													'h-3 w-3 flex-shrink-0 text-center font-mono text-[9px] leading-3',
													c.pass ? 'text-emerald-500/60' : 'text-red-500'
												)}>
													{c.pass ? '✓' : '✗'}
												</span>
												<span className="flex-1 font-mono text-[10px] text-primary/70">{c.label}</span>
												<span className={cn(
													'font-mono text-[9px]',
													c.pass ? 'text-secondary/40' : 'text-red-500/70'
												)}>
													{c.score}/10
												</span>
											</div>
										))}
									</div>

									{/* Verdict */}
									<div className="border-t border-subtle/20 pt-2">
										<div className="flex items-center justify-between">
											<span className={cn(
												'font-mono text-[10px] font-medium',
												step.judge.verdict === 'pass'
													? 'text-emerald-600 dark:text-emerald-400'
													: 'text-red-600 dark:text-red-400'
											)}>
												{step.judge.verdict === 'pass' ? 'PASS' : 'FAIL'}
											</span>
										</div>
										<p className="mt-0.5 font-mono text-[8px] text-secondary/40 leading-relaxed">
											{step.judge.note}
										</p>
									</div>
								</div>
							) : (
								<div className="flex h-20 items-center justify-center">
									<span className="font-mono text-[9px] text-secondary/20">
										{step.phase === 'deploy' ? 'Waiting for screenshot...' :
										 step.phase === 'screenshot' ? 'Capturing...' :
										 'Patching...'}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Current action */}
				<div className="flex items-center gap-2">
					<span className="font-mono text-[11px] text-secondary/30">{phaseIcon[step.phase]}</span>
					<span className={cn(
						'font-mono text-[11px]',
						step.phase === 'judge' && step.judge?.verdict === 'fail' ? 'text-red-600 dark:text-red-400' :
						step.phase === 'judge' && step.judge?.verdict === 'pass' ? 'text-emerald-600 dark:text-emerald-400' :
						step.phase === 'patch' ? 'text-amber-600 dark:text-amber-400' :
						'text-secondary/60'
					)}>
						{step.label}
					</span>
				</div>

				{/* Progress scrubber */}
				<div
					className="relative h-1 cursor-pointer rounded-full bg-subtle/30"
					onClick={(e) => {
						const rect = e.currentTarget.getBoundingClientRect()
						const pct = (e.clientX - rect.left) / rect.width
						setCurrentStep(Math.round(pct * (STEPS.length - 1)))
						setIsPlaying(false)
					}}
				>
					<div
						className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all duration-300"
						style={{ width: `${String(((currentStep + 1) / STEPS.length) * 100)}%` }}
					/>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-2">
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
