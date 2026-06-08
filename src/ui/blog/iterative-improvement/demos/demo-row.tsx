import type { ReactNode } from 'react'

// Shared chrome for a demo section: a titled block with a responsive
// 3-column grid (stacks on mobile). Each column gets a label + body.
export type DemoColumn = {
	label: string
	caption?: string
	body: ReactNode
}

export const DemoSection = ({
	id,
	title,
	blurb,
	columns,
	bare
}: {
	id: string
	title: string
	blurb: string
	columns: [DemoColumn, DemoColumn, DemoColumn]
	// When true, render only the 3-column grid of cards (no heading/blurb) for
	// the standalone per-demo pages.
	bare?: boolean
}) => {
	const grid = (
		// Break out of the prose column (max-w-2xl) so the three columns get room to
		// breathe — up to the 5xl shell / banner width. The parent <figure> is a
		// flex column with items-center, which keeps this wider grid centered.
		<div className="grid w-[92vw] max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
			{columns.map(col => (
				<div key={col.label} className="flex flex-col gap-2">
					<div className="flex items-baseline justify-between gap-2">
						<span className="font-medium text-primary text-sm">{col.label}</span>
						{col.caption ? <span className="text-[11px] text-secondary/70">{col.caption}</span> : null}
					</div>
					{col.body}
				</div>
			))}
		</div>
	)

	if (bare) return grid

	return (
		<section id={id} className="flex w-full max-w-6xl scroll-mt-24 flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h2 className="text-2xl">{title}</h2>
				<p className="max-w-2xl text-secondary text-sm">{blurb}</p>
			</div>
			{grid}
		</section>
	)
}
