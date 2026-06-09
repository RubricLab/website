'use client'

import { useState } from 'react'
import { FilterInput, Row, StatBar, VIEWPORT_H } from './chrome'
import {
	computePercentilesNaive,
	computeSummary,
	filterTransactions,
	sortTransactions
} from './transactions'
import type { IterDashboardProps } from './types'
import { usePerfMeasure } from './use-perf'

// ITERATION 0 — naive baseline. Perf sins (deliberate, do not "fix"):
//  - All derived data (filter, sort, summary, percentiles) recomputed in the
//    render body on EVERY keystroke, with no useMemo.
//  - O(n^2) percentile computation over the FULL dataset every render.
//  - Renders ALL matching rows into the DOM (no virtualization).
export default function IterationZero({ data, mountStart, onMount, onFilter }: IterDashboardProps) {
	const [query, setQuery] = useState('')

	// ---- expensive work, in render, every time ----
	const filtered = filterTransactions(data, query)
	const sorted = sortTransactions(filtered, 'date', 'desc')
	const summary = computeSummary(sorted)
	// percentile rank over the whole history, recomputed from scratch every
	// keystroke. O(n^2).
	const percentiles = computePercentilesNaive(data)

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
