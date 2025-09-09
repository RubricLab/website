'use client'

import { useEffect, useMemo, useState } from 'react'

export type StatsData = { active: number; total: number }

export function Stats({ data }: { data: StatsData }) {
	const nf = useMemo(() => new Intl.NumberFormat(), [])

	// delta % vs a naive baseline (total - active), clamp to [-100, 100]
	const baseline = Math.max(1, data.total - data.active)
	const deltaPct = Math.max(
		-100,
		Math.min(100, Math.round(((data.total - baseline) / baseline) * 100))
	)
	const deltaSign = deltaPct >= 0 ? '+' : ''

	// Live counter simulation based on provided active (gentle jitter)
	const [live, setLive] = useState<number>(() => Math.max(0, Math.round(data.active)))
	useEffect(() => {
		setLive(Math.max(0, Math.round(data.active)))
	}, [data.active])
	useEffect(() => {
		const id = window.setInterval(() => {
			setLive(prev => {
				const jitter = Math.floor(Math.random() * 3) - 1 // -1..+1
				const next = Math.max(0, prev + jitter)
				return next
			})
		}, 2400)
		return () => window.clearInterval(id)
	}, [])

	return (
		<div className="grid w-full grid-cols-2 gap-2">
			{/* 24h total */}
			<div className="w-full rounded-lg border-1 border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-transparent">
				<div className="flex items-baseline justify-between">
					<div className="text-gray-500 text-xs dark:text-gray-400">Page views</div>
					<div className="flex items-center gap-1 rounded-full border-1 border-green-500 bg-white px-1.5 py-0.5 text-[10px] text-green-600 dark:border-green-900/50 dark:bg-transparent dark:text-green-400">
						<span>
							{deltaSign}
							{deltaPct}%
						</span>
					</div>
				</div>
				<div className="mt-1 flex items-end justify-between">
					<div className="font-semibold text-gray-900 text-xl dark:text-gray-100">
						{nf.format(data.total)}
					</div>
					<div className="text-gray-500 text-xs dark:text-gray-400">today</div>
				</div>
			</div>

			{/* Live now */}
			<div className="w-full rounded-lg border-1 border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-transparent">
				<div className="flex items-baseline justify-between">
					<div className="text-gray-500 text-xs dark:text-gray-400">Live page views</div>
					<div className="flex items-center gap-1 rounded-full border-1 border-red-500 bg-white px-1.5 py-0.5 text-[10px] text-red-600 dark:border-red-900/50 dark:bg-transparent dark:text-red-400">
						<span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
						LIVE
					</div>
				</div>
				<div className="mt-1 flex items-end justify-between">
					<div className="font-semibold text-gray-900 text-xl dark:text-gray-100">{nf.format(live)}</div>
					<div className="text-gray-500 text-xs dark:text-gray-400">right now</div>
				</div>
			</div>
		</div>
	)
}
