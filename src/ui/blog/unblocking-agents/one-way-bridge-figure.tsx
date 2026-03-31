'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

/**
 * Isolation boundary — two workspaces side by side.
 * Code blocks have window chrome (dots). Workspaces are just labels.
 *
 * 0 - Code in rubric, rubrot empty
 * 1 - Code crosses to rubrot
 * 2 - Diff appears
 * 3-5 - Deploy steps in prompt
 * 6 - ✓ ready
 * 7 - PR arrives in rubric
 */

const PHASE_COUNT = 8
const PHASE_MS = 1800

const ORIGINAL = [
	{ text: 'async function send(draft) {', type: 'ctx' as const },
	{ text: '  const msg = await gmail.send(draft)', type: 'ctx' as const },
	{ text: '  return msg.id', type: 'ctx' as const },
	{ text: '}', type: 'ctx' as const }
]

const DIFF = [
	{ text: 'async function send(draft) {', type: 'ctx' as const },
	{ text: '  const msg = await gmail.send(draft)', type: 'ctx' as const },
	{ text: '  return msg.id', type: 'del' as const },
	{ text: '  await db.emails.insert(msg)', type: 'add' as const },
	{ text: '  await redis.publish("inbox", msg)', type: 'add' as const },
	{ text: '  return msg', type: 'add' as const },
	{ text: '}', type: 'ctx' as const }
]

const PROMPTS: Record<number, { cmd: string; ok: string }> = {
	3: { cmd: 'neon db create --name agent-47', ok: '✓ ready' },
	4: { cmd: 'vercel deploy --prod', ok: '✓ deployed' },
	5: { cmd: 'playwright test e2e/', ok: '✓ 12 passed' }
}

const LINE_COLOR = { add: 'text-emerald-400', ctx: 'text-primary/60', del: 'text-red-400' }
const LINE_BG = { add: 'bg-emerald-500/[0.06]', ctx: '', del: 'bg-red-500/[0.06]' }
const PREFIX_CHAR = { add: '+', ctx: ' ', del: '−' }
const PREFIX_COLOR = { add: 'text-emerald-400', ctx: 'text-primary/20', del: 'text-red-400' }

const CONTENT_H = 'h-[170px]'

const WindowDots = ({ label }: { label?: string | undefined }) => (
	<div className="flex items-center gap-1.5 border-subtle/60 border-b px-2.5 py-1.5">
		<div className="flex gap-1">
			<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
			<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
			<div className="h-1.5 w-1.5 rounded-full bg-secondary/20" />
		</div>
		{label && (
			<span className="flex-1 text-center font-mono text-[9px] text-secondary/30">{label}</span>
		)}
	</div>
)

type CodeLine = { text: string; type: 'ctx' | 'add' | 'del' }

const CodeBlock = ({
	lines,
	className,
	children,
	label
}: {
	lines: CodeLine[]
	className?: string | undefined
	children?: React.ReactNode | undefined
	label?: string | undefined
}) => (
	<div
		className={cn(CONTENT_H, 'overflow-hidden rounded-lg border border-subtle bg-accent', className)}
	>
		<WindowDots label={label} />
		<div className="p-2.5 font-mono text-[10px] leading-[1.8]">
			{children}
			{lines.map((l, i) => (
				<div
					key={`l${String(i)}`}
					className={cn('-mx-1 rounded-sm px-1', LINE_BG[l.type], LINE_COLOR[l.type])}
				>
					<span className={cn('mr-1.5 inline-block w-3 text-right', PREFIX_COLOR[l.type])}>
						{PREFIX_CHAR[l.type]}
					</span>
					{l.text}
				</div>
			))}
		</div>
	</div>
)

const SkeletonSlot = ({ text }: { text: string }) => (
	<div
		className={cn(
			CONTENT_H,
			'flex items-center justify-center rounded-lg border border-subtle/40 border-dashed'
		)}
	>
		<span className="font-mono text-[9px] text-secondary/20">{text}</span>
	</div>
)

const StatusText = ({ text }: { text: string }) => (
	<span className="animate-fadeIn font-mono text-[9px] text-tint">{text}</span>
)

export const OneWayBridgeFigure = () => {
	const [phase, setPhase] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const hasAutoPlayed = useRef(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const isComplete = phase >= PHASE_COUNT - 1

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
		setPhase(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		if (isComplete) reset()
		else setIsPlaying(prev => !prev)
	}, [isComplete, reset])

	useEffect(() => {
		if (!isPlaying || isComplete) return undefined
		const timer = setInterval(() => setPhase(p => Math.min(p + 1, PHASE_COUNT - 1)), PHASE_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete])

	useEffect(() => {
		if (isComplete) setIsPlaying(false)
	}, [isComplete])

	const statusText = PROMPTS[phase] ? `$ ${PROMPTS[phase].cmd} → ${PROMPTS[phase].ok}` : null

	return (
		<div
			ref={containerRef}
			className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3"
		>
			<div className="flex flex-col gap-3">
				{/* Two workspaces with isolation boundary */}
				<div className="flex items-stretch gap-0">
					{/* Rubric */}
					<div className="flex min-w-0 flex-1 flex-col gap-2 pr-3">
						<span className="font-mono text-[9px] text-primary/70 uppercase tracking-wide">rubric</span>
						{phase === 0 && <CodeBlock lines={ORIGINAL} label="handler.ts" />}
						{phase >= 1 && phase <= 6 && <SkeletonSlot text="waiting for PR" />}
						{phase >= 7 && <CodeBlock lines={DIFF} label="handler.ts" className="animate-fadeIn" />}
					</div>

					{/* Isolation boundary — strong vertical wall */}
					<div className="w-px self-stretch bg-primary/20" />

					{/* Rubrot */}
					<div className="flex min-w-0 flex-1 flex-col gap-2 pl-3">
						<span className="font-mono text-[9px] text-primary/70 uppercase tracking-wide">rubrot</span>
						<div className="flex flex-col gap-2">
							{phase === 0 && <SkeletonSlot text="" />}
							{phase === 1 && <CodeBlock lines={ORIGINAL} label="handler.ts" className="animate-fadeIn" />}
							{phase === 2 && <CodeBlock lines={DIFF} label="handler.ts" className="animate-fadeIn" />}
							{phase >= 3 && phase <= 5 && <CodeBlock lines={DIFF} label="handler.ts" />}
							{phase === 6 && (
								<CodeBlock lines={DIFF} label="handler.ts">
									<div className="mb-1 flex animate-fadeIn items-center gap-2 font-mono text-[9px]">
										<span className="text-tint">✓ ready</span>
									</div>
								</CodeBlock>
							)}
							{phase >= 7 && <SkeletonSlot text="done" />}
							<div className="h-4">
								{phase >= 1 && phase <= 6 && statusText && <StatusText text={statusText} />}
							</div>
						</div>
					</div>
				</div>

				{/* Scrubber */}
				<button
					type="button"
					className="relative h-0.5 cursor-pointer rounded-full bg-subtle/20"
					onClick={e => {
						const rect = e.currentTarget.getBoundingClientRect()
						const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
						setPhase(Math.round(pct * (PHASE_COUNT - 1)))
						setIsPlaying(false)
					}}
				>
					<div
						className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all duration-300"
						style={{ width: `${(phase / (PHASE_COUNT - 1)) * 100}%` }}
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
