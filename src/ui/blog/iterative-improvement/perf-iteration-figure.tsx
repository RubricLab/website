'use client'

import { FIGURE_CONTAINER_CLASS } from '~/ui/blog/figure-palette'

// Real measurements from the demo-2 benchmark run. Updated from bench/results.json.
type Row = { label: string; mountMs: number; filterMs: number; note: string }

const DATA: Row[] = [
	{
		filterMs: 299,
		label: 'Iteration 1 (one-shot)',
		mountMs: 328,
		note: 'data recomputed on each keystroke'
	},
	{
		filterMs: 42,
		label: 'Iteration 2',
		mountMs: 70,
		note: 'memoized data + debounced filter'
	},
	{
		filterMs: 3,
		label: 'Iteration 3',
		mountMs: 25,
		note: 'virtualized list (only visible rows rendered)'
	}
]

const Bar = ({ value, max, color }: { value: number; max: number; color: string }) => (
	<div className="flex items-center gap-2">
		<div className="h-3 flex-1 overflow-hidden rounded-full bg-subtle/25">
			<div
				className={`h-full rounded-full ${color} transition-all duration-700`}
				style={{ width: `${String(max > 0 ? Math.max(4, (value / max) * 100) : 0)}%` }}
			/>
		</div>
		<span className="w-16 text-right font-mono text-[11px] text-secondary">{value} ms</span>
	</div>
)

export const PerfIterationFigure = () => {
	const maxMount = Math.max(1, ...DATA.map(d => d.mountMs))
	const maxFilter = Math.max(1, ...DATA.map(d => d.filterMs))

	return (
		<div className={FIGURE_CONTAINER_CLASS}>
			<div className="flex flex-col gap-5">
				{DATA.map(row => (
					<div className="flex flex-col gap-2" key={row.label}>
						<div className="flex items-baseline justify-between">
							<span className="font-medium text-primary text-sm">{row.label}</span>
							<span className="text-[11px] text-secondary/70">{row.note}</span>
						</div>
						<div className="grid gap-1.5">
							<div className="grid grid-cols-[64px_1fr] items-center gap-2">
								<span className="text-[10px] text-secondary/60 uppercase tracking-wide">mount</span>
								<Bar color="bg-sky-500/70" max={maxMount} value={row.mountMs} />
							</div>
							<div className="grid grid-cols-[64px_1fr] items-center gap-2">
								<span className="text-[10px] text-secondary/60 uppercase tracking-wide">filter</span>
								<Bar color="bg-violet-500/70" max={maxFilter} value={row.filterMs} />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
