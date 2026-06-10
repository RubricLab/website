'use client'

import { memo } from 'react'
import type { Transaction } from './data'
import type { Summary } from './transactions'

// Shared, presentational pieces of the dashboard. The perf differences between
// iterations live in the container components, not here.

export const ROW_H = 28 // px per row — fixed so the virtualized column can window
export const VIEWPORT_H = 360 // px scroll window inside each column

export const StatBar = ({ summary }: { summary: Summary }) => (
	<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
		<Stat label="Rows" value={summary.count.toLocaleString()} />
		<Stat label="Net" value={summary.total.toFixed(0)} />
		<Stat label="Avg" value={summary.avgAbs.toFixed(0)} />
	</div>
)

const Stat = ({ label, value }: { label: string; value: string }) => (
	<span className="flex items-baseline gap-1">
		<span className="text-[10px] text-secondary uppercase tracking-wide">{label}</span>
		<span className="font-medium text-primary tabular-nums">{value}</span>
	</span>
)

export const FilterInput = ({
	value,
	onChange
}: {
	value: string
	onChange: (next: string) => void
}) => (
	<input
		className="w-full rounded-md border border-subtle bg-background/40 px-2 py-1 text-xs placeholder:text-secondary/70 focus:border-secondary/50 focus:outline-none"
		onChange={e => onChange(e.target.value)}
		placeholder="Filter by category, merchant…"
		value={value}
	/>
)

export const Row = memo(({ t, pctl }: { t: Transaction; pctl: number }) => (
	<div
		className="flex items-center gap-2 border-subtle/40 border-b px-2 text-[11px]"
		style={{ height: ROW_H }}
	>
		<span className="w-12 shrink-0 text-secondary tabular-nums">{t.date.slice(5)}</span>
		<span className="flex-1 truncate text-primary">{t.description}</span>
		<span
			className={`w-14 shrink-0 text-right tabular-nums ${t.amount < 0 ? 'text-secondary' : 'text-tint'}`}
		>
			{t.amount.toFixed(2)}
		</span>
		<span className="w-7 shrink-0 text-right text-secondary tabular-nums">{pctl}</span>
	</div>
))
