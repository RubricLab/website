'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/components/button'
import { Figure } from '~/components/figure'
import { PauseIcon } from '~/components/icons/pause'
import { PlayIcon } from '~/components/icons/play'
import { RestartIcon } from '~/components/icons/restart'

type LineType = 'prompt' | 'agent' | 'tool' | 'result' | 'error' | 'yield'

type TerminalLine = {
	id: string
	type: LineType
	content: React.ReactNode
	delayMs: number
}

const LINES: TerminalLine[] = [
	{
		content: 'Deploy the OAuth login flow and verify it works end to end.',
		delayMs: 0,
		id: 'prompt',
		type: 'prompt'
	},
	{
		content: "I'll scaffold the auth routes and configure Google OAuth.",
		delayMs: 1400,
		id: 'agent-1',
		type: 'agent'
	},
	{
		content: (
			<>
				<span className="text-secondary/50">Write</span>{' '}
				<span className="text-primary/70">src/auth/google.ts</span>
			</>
		),
		delayMs: 900,
		id: 'tool-1',
		type: 'tool'
	},
	{
		content: '✓ OAuth config with PKCE flow',
		delayMs: 1000,
		id: 'result-1',
		type: 'result'
	},
	{
		content: (
			<>
				<span className="text-secondary/50">Write</span>{' '}
				<span className="text-primary/70">src/auth/callback.ts</span>
			</>
		),
		delayMs: 900,
		id: 'tool-2',
		type: 'tool'
	},
	{
		content: '✓ Callback handler with session management',
		delayMs: 1000,
		id: 'result-2',
		type: 'result'
	},
	{
		content: (
			<>
				<span className="text-secondary/50">Bash</span>{' '}
				<span className="text-primary/70">gcloud projects create oauth-test-47</span>
			</>
		),
		delayMs: 900,
		id: 'tool-3',
		type: 'tool'
	},
	{
		content: 'PERMISSION_DENIED: caller does not have permission',
		delayMs: 300,
		id: 'error',
		type: 'error'
	},
	{
		content:
			"I built the OAuth login flow, but I can't create the GCP project needed for credentials. Could you create it in the console and share the client ID and secret so I can continue?",
		delayMs: 2200,
		id: 'yield',
		type: 'yield'
	}
]

const CUMULATIVE_TIMES = LINES.reduce<number[]>((acc, line, i) => {
	const prev = i === 0 ? 0 : acc[i - 1]!
	acc.push(prev + line.delayMs)
	return acc
}, [])
const TOTAL_DURATION = CUMULATIVE_TIMES[CUMULATIVE_TIMES.length - 1]! + 400

const LINE_STYLES: Record<LineType, string> = {
	agent: 'text-secondary/60',
	error: 'text-red-400',
	prompt: 'text-primary/80',
	result: 'text-tint',
	tool: 'text-primary/60',
	yield: 'text-secondary/70'
}

const LINE_PREFIXES: Record<LineType, React.ReactNode> = {
	agent: null,
	error: <span className="mr-1.5"> </span>,
	prompt: <span className="mr-1.5 text-tint">{'❯'}</span>,
	result: <span className="mr-1.5"> </span>,
	tool: <span className="mr-1.5 text-secondary/40">{'→'}</span>,
	yield: null
}

const TICK_MS = 50

export const PermissionsTrapFigure = () => {
	const [visibleLines, setVisibleLines] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const elapsedRef = useRef(0)
	const hasAutoPlayed = useRef(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const isComplete = visibleLines >= LINES.length

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
			{ threshold: 0.5 }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const reset = useCallback(() => {
		setVisibleLines(0)
		elapsedRef.current = 0
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		if (isComplete) reset()
		else setIsPlaying(prev => !prev)
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined
		const timer = setInterval(() => {
			elapsedRef.current += TICK_MS
			let next = visibleLines
			while (next < LINES.length && CUMULATIVE_TIMES[next]! <= elapsedRef.current) {
				next++
			}
			if (next > visibleLines) setVisibleLines(next)
		}, TICK_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete, visibleLines])

	useEffect(() => {
		if (isComplete) setIsPlaying(false)
	}, [isComplete])

	const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
		const targetTime = pct * TOTAL_DURATION
		let idx = 0
		while (idx < LINES.length && CUMULATIVE_TIMES[idx]! <= targetTime) idx++
		setVisibleLines(idx)
		elapsedRef.current = targetTime
		setIsPlaying(false)
	}, [])

	const progress = isComplete ? 1 : visibleLines / LINES.length

	return (
		<div
			ref={containerRef}
			className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3"
		>
			<div className="flex flex-col gap-3">
				{/* Terminal */}
				<div className="overflow-hidden rounded-lg border border-subtle bg-accent">
					{/* Title bar */}
					<div className="flex items-center gap-1.5 border-subtle/60 border-b px-3 py-2">
						<div className="flex gap-1">
							<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
							<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
							<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
						</div>
						<span className="flex-1 text-center font-mono text-[9px] text-secondary/30">
							claude — ~/project
						</span>
					</div>

					{/* Content */}
					<div className="flex flex-col gap-0 px-4 py-3 font-mono text-[11px] leading-[1.8]">
						{LINES.map((line, i) => {
							const isVisible = i < visibleLines
							const isError = line.type === 'error'
							const isYield = line.type === 'yield'
							const isResult = line.type === 'result'

							return (
								<div
									key={line.id}
									className={cn(
										'py-0.5',
										LINE_STYLES[line.type],
										isError
											? isVisible
												? 'opacity-100'
												: 'opacity-0'
											: isYield
												? cn('transition-opacity duration-700', isVisible ? 'opacity-100' : 'opacity-0')
												: isResult
													? cn(
															'transition-all duration-300',
															isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
														)
													: cn('transition-opacity duration-300', isVisible ? 'opacity-100' : 'opacity-0'),
										isError && isVisible && '-mx-3 rounded bg-red-500/[0.06] px-3',
										isYield && 'mt-1.5 border-secondary/20 border-l-2 pl-3'
									)}
								>
									{LINE_PREFIXES[line.type]}
									{line.content}
								</div>
							)
						})}
					</div>
				</div>

				{/* Scrubber */}
				<div className="relative h-0.5 cursor-pointer rounded-full bg-subtle/30" onClick={handleScrub}>
					<div
						className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all duration-200"
						style={{ width: `${progress * 100}%` }}
					/>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-2">
					<Button intent="ghost" iconOnly size="xs" aria-label="Play/pause demo" onClick={togglePlay}>
						{isPlaying ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
					</Button>
					<Button intent="ghost" iconOnly size="xs" aria-label="Restart demo" onClick={reset}>
						<RestartIcon className="h-3.5 w-3.5" />
					</Button>
					<Figure.Share />
				</div>
			</div>
		</div>
	)
}
