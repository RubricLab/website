'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/button'
import { Figure } from '~/components/figure'
import { PauseIcon } from '~/components/icons/pause'
import { PlayIcon } from '~/components/icons/play'
import { RestartIcon } from '~/components/icons/restart'
import { cn } from '~/lib/utils/cn'

type Resource = { label: string; detail: string }

type Column = {
	header: string
	resources: Resource[]
}

const COLUMNS: Column[] = [
	{
		header: 'ACCESS',
		resources: [
			{ label: 'GitHub', detail: 'full push + CI' },
			{ label: 'Shell', detail: 'root VM' },
			{ label: 'Network', detail: 'unrestricted' },
			{ label: 'Permissions', detail: 'skip prompts' },
		],
	},
	{
		header: 'INFRASTRUCTURE',
		resources: [
			{ label: 'AWS', detail: 'sandbox account' },
			{ label: 'GCP', detail: 'isolated project' },
			{ label: 'Vercel', detail: 'agent workspace' },
			{ label: 'Postgres', detail: 'own instance' },
			{ label: 'Redis', detail: 'own instance' },
			{ label: 'Domain', detail: 'DNS + TLS' },
		],
	},
	{
		header: 'IDENTITY',
		resources: [
			{ label: 'Email', detail: 'receives mail' },
			{ label: 'Phone', detail: 'passes carrier check' },
			{ label: 'Card', detail: '$100 limit' },
			{ label: 'Browser', detail: 'Playwright sessions' },
		],
	},
]

const STAGGER_MS = 700

export const IsolationArchitectureFigure = () => {
	const [visibleColumns, setVisibleColumns] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)
	const isComplete = visibleColumns >= COLUMNS.length

	const reset = useCallback(() => {
		setVisibleColumns(0)
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
			setVisibleColumns(prev => prev + 1)
		}, STAGGER_MS)
		return () => clearInterval(timer)
	}, [isPlaying, isComplete])

	useEffect(() => {
		if (isComplete) setIsPlaying(false)
	}, [isComplete])

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="flex flex-col gap-3">
				{/* Header */}
				<div className="flex items-center justify-between">
					<span className="font-mono text-xs uppercase tracking-wider text-primary">
						Agent Org
					</span>
					<span
						className={cn(
							'font-mono text-[9px] uppercase tracking-wider text-tint transition-all duration-500',
							isComplete ? 'opacity-100' : 'opacity-0'
						)}
					>
						full access
					</span>
				</div>

				{/* Three columns */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{COLUMNS.map((col, colIdx) => {
						const isVisible = colIdx < visibleColumns
						return (
							<div key={col.header} className="flex flex-col gap-2">
								{/* Column header */}
								<span
									className={cn(
										'font-mono text-[9px] uppercase tracking-wide transition-all duration-300',
										isVisible
											? 'text-primary opacity-100 translate-y-0'
											: 'text-primary opacity-0 translate-y-1'
									)}
								>
									{col.header}
								</span>

								{/* Resources */}
								<div className="flex flex-col gap-0.5">
									{col.resources.map((r, rIdx) => (
										<div
											key={r.label}
											className={cn(
												'flex items-center justify-between gap-2 py-0.5 transition-all duration-300',
												isVisible
													? 'opacity-100 translate-y-0'
													: 'opacity-0 translate-y-1'
											)}
											style={{
												transitionDelay: isVisible
													? `${(rIdx + 1) * 60}ms`
													: '0ms',
											}}
										>
											<span className="font-mono text-[10px] text-secondary">
												{r.label}
											</span>
											<span className="font-mono text-[7px] text-secondary/40">
												{r.detail}
											</span>
										</div>
									))}
								</div>
							</div>
						)
					})}
				</div>

				{/* Controls */}
				<div className="flex items-center gap-2 pt-1">
					<Button size="sm" variant="icon" onClick={togglePlay}>
						{isPlaying ? (
							<PauseIcon className="h-3.5 w-3.5" />
						) : (
							<PlayIcon className="h-3.5 w-3.5" />
						)}
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
