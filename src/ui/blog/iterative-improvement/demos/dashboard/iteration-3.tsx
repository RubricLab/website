'use client'

import { useMemo, useState } from 'react'
import { FilterInput, ROW_H, Row, StatBar, VIEWPORT_H } from './chrome'
import {
	computePercentilesFast,
	computeSummary,
	filterTransactions,
	sortTransactions
} from './transactions'
import type { IterDashboardProps } from './types'
import { usePerfMeasure } from './use-perf'

const OVERSCAN = 8 // rows rendered above/below the viewport

// ITERATION 3 — stop rendering rows nobody can see.
//  - Virtualized (windowed) list: only the rows inside the scroll viewport
//    (plus a small overscan) are committed to the DOM; top/bottom spacers
//    preserve scroll height. A 10k-row result renders ~25 rows, not thousands.
//  - Carries forward iteration 2's memoized derived data + O(n log n) percentile.
export default function IterationThree({ data, mountStart, onMount, onFilter }: IterDashboardProps) {
	const [query, setQuery] = useState('')
	const [scrollTop, setScrollTop] = useState(0)

	const filtered = useMemo(() => filterTransactions(data, query), [data, query])
	const sorted = useMemo(() => sortTransactions(filtered, 'date', 'desc'), [filtered])
	const summary = useMemo(() => computeSummary(sorted), [sorted])
	const percentiles = useMemo(() => computePercentilesFast(data), [data])

	const markFilterStart = usePerfMeasure({ mountStart, onFilter, onMount, signature: query })

	// ---- windowing math ----
	const total = sorted.length
	const start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN)
	const windowSize = Math.ceil(VIEWPORT_H / ROW_H) + OVERSCAN * 2
	const end = Math.min(total, start + windowSize)
	const visibleRows = sorted.slice(start, end)
	const topPad = start * ROW_H
	const bottomPad = (total - end) * ROW_H

	return (
		<div className="flex flex-col gap-2">
			<StatBar summary={summary} />
			<FilterInput
				onChange={next => {
					markFilterStart()
					setQuery(next)
				}}
				value={query}
			/>
			<div className="text-[10px] text-secondary tabular-nums">{total} rows</div>
			<div
				className="overflow-y-auto rounded-md border border-subtle"
				onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
				style={{ height: VIEWPORT_H }}
			>
				<div style={{ height: topPad }} />
				{visibleRows.map(t => (
					<Row key={t.id} pctl={percentiles.get(t.id) ?? 0} t={t} />
				))}
				<div style={{ height: bottomPad }} />
			</div>
		</div>
	)
}
