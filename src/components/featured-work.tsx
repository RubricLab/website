import Link from 'next/link'
import { getFeaturedCaseStudies } from '~/lib/case-studies'
import { FadeIn } from './fade-in'
import { Section } from './section'

export function FeaturedWork() {
	const featured = getFeaturedCaseStudies()

	return (
		<Section>
			<FadeIn>
				<div className="mb-12 flex items-center justify-between">
					<span className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						Work
					</span>
					<Link
						href="/work"
						className="group inline-flex items-center gap-2 font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
					>
						<span>See all</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							&rarr;
						</span>
					</Link>
				</div>
			</FadeIn>
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				{featured.map((study, i) => (
					<FadeIn key={study.slug} delay={i * 0.08}>
						<Link
							href={`/work/${study.slug}`}
							className="group block overflow-hidden rounded-xl border border-border bg-surface/30 transition-all duration-300 hover:border-border-hover hover:bg-surface/60"
						>
							<div className="visual-placeholder aspect-[16/10]" />
							<div className="p-6">
								<p className="font-mono text-[11px] text-text-tertiary tracking-wide">
									{study.client} · {study.context}
								</p>
								<h3 className="mt-2 font-normal font-sans text-xl text-text-primary transition-colors duration-200 group-hover:text-text-accent">
									{study.title}
								</h3>
								<p className="mt-2 font-sans text-[15px] text-text-secondary leading-relaxed">
									{study.description}
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									{study.tags.slice(0, 3).map(tag => (
										<span
											key={tag}
											className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-text-tertiary"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						</Link>
					</FadeIn>
				))}
			</div>
		</Section>
	)
}
