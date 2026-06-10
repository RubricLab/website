'use client'

import { type ComponentType, memo, useMemo, useState } from 'react'
import { getTransactions, type Transaction } from './dashboard/data'
import IterationOne from './dashboard/iteration-1'
import IterationTwo from './dashboard/iteration-2'
import IterationThree from './dashboard/iteration-3'
import type { IterDashboardProps } from './dashboard/types'
import { DemoSection } from './demo-row'

// Section 2 — the filterable dashboard. Each column runs the SAME deterministic
// 10k-row dataset through a different implementation. Nothing heavy mounts until
// the reader clicks "Run", and every column reports its own real, measured
// mount + filter latency so the speedup is verifiable, not asserted.
export const DashboardDemoSection = ({ bare = false }: { bare?: boolean }) => (
	<DemoSection
		bare={bare}
		blurb="Same 10k-row dataset in each column. Hit Run, then type in the filter and watch the measured latency — the naive version lags, the virtualized one stays instant."
		columns={[
			{ body: <DashboardColumn component={IterationOne} />, caption: 'naive', label: 'Iteration 1' },
			{
				body: <DashboardColumn component={IterationTwo} />,
				caption: 'memoized',
				label: 'Iteration 2'
			},
			{
				body: <DashboardColumn component={IterationThree} />,
				caption: 'virtualized',
				label: 'Iteration 3'
			}
		]}
		id="dashboard"
		title="2 · The filterable dashboard"
	/>
)

type Loaded = { mountStart: number; data: Transaction[] }

const DashboardColumn = ({ component }: { component: ComponentType<IterDashboardProps> }) => {
	const [loaded, setLoaded] = useState<Loaded | null>(null)
	const [mountMs, setMountMs] = useState<number | null>(null)
	const [filterMs, setFilterMs] = useState<number | null>(null)

	// Memoize the heavy dashboard so badge-state updates (mount/filter latency)
	// don't force it to re-render — only real keystrokes drive its work.
	const Dashboard = useMemo(() => memo(component), [component])

	const run = () => {
		setMountMs(null)
		setFilterMs(null)
		setLoaded({ data: getTransactions(), mountStart: performance.now() })
	}

	if (loaded === null) {
		return (
			<div className="flex h-[480px] flex-col items-center justify-center gap-3 rounded-lg border border-subtle border-dashed p-4">
				<p className="max-w-[16rem] text-center text-secondary text-xs">
					Mounts a live 10k-row dashboard and measures real mount + filter latency.
				</p>
				<button
					className="rounded-full border border-subtle px-3 py-1.5 text-primary text-xs transition-colors hover:bg-subtle"
					onClick={run}
					type="button"
				>
					Run this version ▶
				</button>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap items-center gap-1.5 text-[10px]">
				<Badge label="mount" ms={mountMs} />
				<Badge label="filter" ms={filterMs} tint />
				<button
					className="ml-auto rounded-full border border-subtle px-2 py-0.5 text-[10px] text-secondary transition-colors hover:bg-subtle"
					onClick={run}
					type="button"
				>
					↻ rerun
				</button>
			</div>
			<Dashboard
				data={loaded.data}
				key={loaded.mountStart}
				mountStart={loaded.mountStart}
				onFilter={setFilterMs}
				onMount={setMountMs}
			/>
		</div>
	)
}

const Badge = ({ label, ms, tint }: { label: string; ms: number | null; tint?: boolean }) => (
	<span
		className={`rounded-full border border-subtle px-2 py-0.5 tabular-nums ${tint ? 'text-tint' : 'text-secondary'}`}
	>
		{label}: {ms === null ? '—' : `${ms.toFixed(ms < 10 ? 1 : 0)} ms`}
	</span>
)
