import Link from 'next/link'

const primitives = [
	{
		slug: 'button',
		name: 'Button',
		summary: 'Actions. 4 intents × 4 sizes × 6 states.',
	},
] as const

export default function ComponentsPage() {
	return (
		<main className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<h1 className="text-4xl">Components</h1>
			<p className="text-secondary mt-2">
				Rubric's in-house design system. Every primitive is live — what you see is what ships.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-12">
				{primitives.map(p => (
					<Link
						key={p.slug}
						href={`/components/${p.slug}`}
						className="group rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] p-6 transition-colors hover:bg-[var(--color-surface-raised-hover)]"
					>
						<h2 className="text-2xl">{p.name}</h2>
						<p className="mt-2 text-[13px] text-secondary">{p.summary}</p>
					</Link>
				))}
			</div>
		</main>
	)
}
