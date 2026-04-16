import Link from 'next/link'
import { Button } from './button'
import { FadeIn } from './fade-in'

const columns = [
	{
		title: 'FAST',
		body: 'We onboard in days, not months. Small team, high context, no overhead. 2–3 engagements per quarter.',
		cta: { label: 'How we engage', href: '/contact' }
	},
	{
		title: 'DEEP',
		body: 'We do the research. Contract engineering, agent infrastructure, model evaluation. The work behind the work.',
		cta: { label: 'See the work', href: '/work' }
	},
	{
		title: 'PRODUCTION',
		body: 'Everything ships. Real users, real traffic, real edge cases. Fortune 500 polish at startup speed.',
		cta: { label: 'Recent case studies', href: '/work' }
	}
]

export function Process() {
	return (
		<section className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{columns.map((col, i) => (
					<FadeIn key={col.title} delay={i * 0.08}>
						<div className="bg-accent/40 border border-subtle rounded-[var(--radius-card)] p-8 transition-all duration-300 hover:border-tint/30 hover:shadow-[0_1px_12px_-4px_rgba(0,0,0,0.06)] h-full flex flex-col">
							<h3 className="font-mono text-xs text-secondary tracking-widest uppercase mb-4">
								{col.title}
							</h3>
							<p className="font-sans text-base text-secondary leading-relaxed">
								{col.body}
							</p>
							<div className="mt-6">
								<Button asChild intent="secondary" size="sm">
									<Link href={col.cta.href}>{col.cta.label}</Link>
								</Button>
							</div>
						</div>
					</FadeIn>
				))}
			</div>
		</section>
	)
}
