'use client'

import { useMemo, useState } from 'react'
import { FilterInput, Row, StatBar, VIEWPORT_H } from './chrome'
import {
	computePercentilesFast,
	computeSummary,
	filterTransactions,
	sortTransactions
} from './transactions'
import type { IterDashboardProps } from './types'
import { usePerfMeasure } from './use-perf'

// ITERATION 2 — stop recomputing in render.
//  - All derived data wrapped in useMemo with precise deps, so a re-render that
//    doesn't change inputs reuses the previous result.
//  - The whole-history percentile depends only on `data`, so it is computed
//    ONCE instead of on every keystroke, and uses the O(n log n) algorithm.
// (Still renders every matching row — addressed in iteration 3.)
export default function IterationTwo({ data, mountStart, onMount, onFilter }: IterDashboardProps) {
	const [query, setQuery] = useState('')

	const filtered = useMemo(() => filterTransactions(data, query), [data, query])
	const sorted = useMemo(() => sortTransactions(filtered, 'date', 'desc'), [filtered])
	const summary = useMemo(() => computeSummary(sorted), [sorted])
	// depends only on the dataset → computed once
	const percentiles = useMemo(() => computePercentilesFast(data), [data])

	const markFilterStart = usePerfMeasure({ mountStart, onFilter, onMount, signature: query })

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
			<div className="text-[10px] text-secondary tabular-nums">{sorted.length} rows</div>
			<div className="overflow-y-auto rounded-md border border-subtle" style={{ height: VIEWPORT_H }}>
				{sorted.map(t => (
					<Row key={t.id} pctl={percentiles.get(t.id) ?? 0} t={t} />
				))}
			</div>
		</div>
	)
}
