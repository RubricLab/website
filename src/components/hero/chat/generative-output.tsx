'use client'

export interface CaseRef {
	client: string
	work: string
	tag: string
}

export function GenerativeOutput({
	cases,
	progress,
}: {
	cases: CaseRef[]
	progress: number
}) {
	if (progress <= 0) return null

	const headerP = Math.min(1, progress * 3)
	const casesP = Math.max(0, (progress - 0.15) / 0.6)

	return (
		<div style={{ opacity: Math.min(1, progress * 2) }}>
			<span
				className="font-sans text-[10px] text-text-tertiary tracking-[0.08em] uppercase block mb-2"
				style={{ opacity: headerP }}
			>
				Related Work
			</span>
			<div className="space-y-0">
				{cases.map((c, i) => {
					const itemP = Math.max(0, (casesP - i * 0.2) / (1 - i * 0.2))
					if (itemP <= 0) return null

					return (
						<div
							key={c.client}
							className="flex items-center gap-3 py-1.5"
							style={{
								opacity: Math.min(1, itemP * 2),
								borderBottom: i < cases.length - 1 ? '1px solid var(--border)' : 'none',
							}}
						>
							<span className="font-sans text-[12px] text-text-primary font-medium w-[72px] shrink-0">
								{c.client}
							</span>
							<span className="font-sans text-[11px] text-text-tertiary flex-1 truncate">
								{c.work}
							</span>
							<span className="font-sans text-[10px] text-accent tracking-wider uppercase shrink-0">
								{c.tag}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
