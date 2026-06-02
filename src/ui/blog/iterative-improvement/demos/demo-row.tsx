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
	columns
}: {
	id: string
	title: string
	blurb: string
	columns: [DemoColumn, DemoColumn, DemoColumn]
}) => {
	return (
		<section id={id} className="flex w-full max-w-6xl scroll-mt-24 flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h2 className="text-2xl">{title}</h2>
				<p className="max-w-2xl text-secondary text-sm">{blurb}</p>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{columns.map(col => (
					<div
						key={col.label}
						className="flex flex-col gap-2 rounded-xl border border-subtle bg-subtle/10 p-3"
					>
						<div className="flex items-baseline justify-between gap-2">
							<span className="font-medium text-primary text-sm">{col.label}</span>
							{col.caption ? <span className="text-[11px] text-secondary/70">{col.caption}</span> : null}
						</div>
						{col.body}
					</div>
				))}
			</div>
		</section>
	)
}
