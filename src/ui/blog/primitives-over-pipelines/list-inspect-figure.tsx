'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Button } from '~/ui/button'
import { Figure } from '~/ui/figure'
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

const INSPECTION_INTERVAL_MS = 1400
const FIGURE_H = 300
const CONTENT_TOP = 48
const LIST_TOP = CONTENT_TOP
const LIST_ROW_H = 30
const LIST_GAP = 8
const DETAIL_TOP = CONTENT_TOP
const LIST_TOTAL_H = ITEMS.length * LIST_ROW_H + (ITEMS.length - 1) * LIST_GAP
const CONTROLS_LEFT = 8
const CONTROLS_BOTTOM = 10
const ITEM_COUNT = [...ITEMS].length

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const getNextIndex = (current: number | null) => {
	if (ITEM_COUNT === 0) return null
	if (ITEM_COUNT === 1) return 0

	let next = randomInt(0, ITEM_COUNT - 1)
	while (next === current) next = randomInt(0, ITEM_COUNT - 1)
	return next
}

export const ListInspectFigure = () => {
	const [activeIndex, setActiveIndex] = useState<number | null>(0)
	const [isPlaying, setIsPlaying] = useState(true)

	const reset = useCallback(() => {
		setActiveIndex(0)
		setIsPlaying(true)
	}, [])

	const togglePlay = useCallback(() => {
		setIsPlaying(prev => !prev)
	}, [])

	useEffect(() => {
		if (!isPlaying) return

		const timer = setInterval(() => {
			setActiveIndex(prev => getNextIndex(prev))
		}, INSPECTION_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [isPlaying])

	const detailItem = activeIndex === null ? null : ITEMS[activeIndex]

	return (
		<div className="w-full rounded-xl border border-subtle bg-subtle/10 px-4 pt-4 pb-3">
			<div className="relative w-full overflow-hidden" style={{ height: FIGURE_H }}>
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
						'absolute right-[6%] left-[56%] transition-all duration-700 ease-in-out',
						detailItem ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
					)}
					style={{ height: LIST_TOTAL_H, top: DETAIL_TOP }}
				>
					{detailItem && (
						<div className="h-full w-full overflow-hidden rounded-md border border-subtle/80 bg-background/70">
							<div className="border-subtle border-b px-2 py-1 font-mono text-[10px] text-primary/90">
								{detailItem.filename}
							</div>
							<div className="px-1 py-1">
								{detailItem.preview.split('\n').map((line, index) => (
									<div
										key={`${detailItem.id}-${String(index)}`}
										className="grid grid-cols-[20px_1fr] items-start px-1.5 py-0.5 font-mono text-[10px]"
									>
										<span className="pt-px pr-2 text-right text-secondary/45 leading-4">{index + 1}</span>
										<span className="block whitespace-pre-wrap text-secondary/90 leading-4">
											{line || ' '}
										</span>
									</div>
								))}
							</div>
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
					<Figure.Share />
				</div>
			</div>
		</div>
	)
}
