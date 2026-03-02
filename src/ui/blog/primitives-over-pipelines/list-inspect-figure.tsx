'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { PauseIcon } from '~/ui/icons/pause'
import { PlayIcon } from '~/ui/icons/play'
import { RestartIcon } from '~/ui/icons/restart'

const ITEMS = [
	{
		filename: 'README.md',
		id: 'file-one',
		preview: '## Project\nRun bun dev to start locally.'
	},
	{
		filename: 'src/lib/search.ts',
		id: 'file-two',
		preview: 'export const listFiles = async () => {\n  return rg("*.ts")\n}'
	},
	{
		filename: 'src/agent/tools.ts',
		id: 'file-three',
		preview: 'export const inspectFile = async (path: string) => {\n  return read(path)\n}'
	},
	{
		filename: 'src/ui/chat-panel.tsx',
		id: 'file-four',
		preview: 'if (message.role === "assistant") return <Answer />\nreturn <Prompt />'
	},
	{
		filename: 'package.json',
		id: 'file-five',
		preview: '"scripts": {\n  "dev": "next dev",\n  "build": "next build"\n}'
	}
] as const

const INSPECT_ORDER = [1, 3] as const
const PHASE_DURATIONS = [2200, 1800, 2200, 1800, 2200] as const
const FIGURE_H = 300
const CONTENT_TOP = 48
const LIST_TOP = CONTENT_TOP
const LIST_ROW_H = 30
const LIST_GAP = 8
const DETAIL_TOP = CONTENT_TOP
const LIST_TOTAL_H = ITEMS.length * LIST_ROW_H + (ITEMS.length - 1) * LIST_GAP
const CONTROLS_LEFT = 8
const CONTROLS_BOTTOM = 10

const getActiveIndex = (phase: number) => {
	if (phase === 1 || phase === 2) return INSPECT_ORDER[0]
	if (phase === 3 || phase === 4) return INSPECT_ORDER[1]
	return null
}

const getDetailIndex = (phase: number) => {
	if (phase === 2) return INSPECT_ORDER[0]
	if (phase === 4) return INSPECT_ORDER[1]
	return null
}

export const ListInspectFigure = () => {
	const [phase, setPhase] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const reset = useCallback(() => {
		setPhase(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		setIsPlaying(prev => !prev)
	}, [])

	useEffect(() => {
		if (!isPlaying) return

		const timer = setTimeout(() => {
			setPhase(prev => (prev + 1) % PHASE_DURATIONS.length)
		}, PHASE_DURATIONS[phase] ?? 2000)
		return () => clearTimeout(timer)
	}, [isPlaying, phase])

	const activeIndex = getActiveIndex(phase)
	const detailIndex = getDetailIndex(phase)
	const detailItem = detailIndex === null ? null : ITEMS[detailIndex]

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="relative w-full overflow-hidden" style={{ height: FIGURE_H }}>
				<div className="absolute top-0 bottom-0 w-px bg-subtle" style={{ left: '50%' }} />

				<p
					className="absolute font-mono text-secondary/50 text-xs"
					style={{ left: '25%', top: 12, transform: 'translateX(-50%)' }}
				>
					List
				</p>
				<p
					className="absolute font-mono text-secondary/50 text-xs"
					style={{ left: '75%', top: 12, transform: 'translateX(-50%)' }}
				>
					Inspect
				</p>

				{ITEMS.map((item, index) => {
					const top = LIST_TOP + index * (LIST_ROW_H + LIST_GAP)
					const isActive = activeIndex === index

					return (
						<div
							key={item.id}
							className={cn(
								'absolute right-[56%] left-[6%] flex items-center rounded-md border px-3 font-mono text-[11px] transition-all duration-700 ease-in-out',
								isActive
									? 'border-violet-500/45 bg-violet-500/15 text-violet-600 dark:text-violet-300'
									: 'border-subtle bg-background/50 text-secondary/80'
							)}
							style={{ height: LIST_ROW_H, top }}
						>
							<span className="w-full truncate">{item.filename}</span>
						</div>
					)
				})}

				<div
					className={cn(
						'absolute right-[6%] left-[56%] rounded-lg border transition-all duration-700 ease-in-out',
						detailItem
							? 'translate-y-0 border-subtle bg-background/50 opacity-100'
							: 'translate-y-2 border-subtle bg-background/50 opacity-0'
					)}
					style={{ height: LIST_TOTAL_H, top: DETAIL_TOP }}
				>
					{detailItem && (
						<div className="p-3">
							<p className="font-mono text-[11px] text-primary">{detailItem.filename}</p>
							<pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] text-secondary/90">
								{detailItem.preview}
							</pre>
						</div>
					)}
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
				</div>
			</div>
		</div>
	)
}
