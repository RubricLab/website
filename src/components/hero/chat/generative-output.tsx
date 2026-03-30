'use client'

export interface CaseRef {
	client: string
	href: string
}

export function GenerativeOutput({ cases, progress }: { cases: CaseRef[]; progress: number }) {
	if (progress <= 0) return null

	return (
		<div className="flex items-center gap-2 pt-1" style={{ opacity: Math.min(1, progress * 3) }}>
			{cases.map((c, i) => {
				const p = Math.max(0, (progress - i * 0.25) / 0.5)
				if (p <= 0) return null
				return (
					<span
						key={c.client}
						className="inline-flex items-center gap-1.5 rounded-full border border-subtle px-3 py-1 text-[11px] text-secondary"
						style={{ opacity: Math.min(1, p * 2) }}
					>
						{c.client}
						<span className="text-secondary/50">→</span>
					</span>
				)
			})}
		</div>
	)
}
