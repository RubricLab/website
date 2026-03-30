import Link from 'next/link'
import type { ComponentType } from 'react'
import { getFeaturedCaseStudies } from '~/lib/case-studies'
import { FadeIn } from './fade-in'
import { Albertsons } from './logos/albertsons'
import { Graphite } from './logos/graphite'

const studyLogos: Record<string, ComponentType<{ className?: string }>> = {
	'safeway-ai': Albertsons,
	'year-in-code': Graphite
}

export function FeaturedWork() {
	const featured = getFeaturedCaseStudies()

	return (
		<section className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<FadeIn>
				<div className="flex items-center justify-between mb-8">
					<span className="font-mono text-[11px] text-secondary tracking-[0.15em] uppercase">
						Work
					</span>
					<Link
						href="/work"
						className="group inline-flex items-center gap-2 font-mono text-xs text-secondary transition-colors duration-200 hover:text-primary"
					>
						<span>See all</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							&rarr;
						</span>
					</Link>
				</div>
			</FadeIn>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{featured.map((study, i) => {
					const Logo = studyLogos[study.slug]
					return (
						<FadeIn key={study.slug} delay={i * 0.08}>
							<div className="group relative overflow-hidden rounded-xl border border-subtle bg-accent/40 transition-all duration-300 hover:border-tint/30 hover:shadow-[0_1px_12px_-4px_rgba(0,0,0,0.06)]">
								<Link
									href={`/work/${study.slug}`}
									className="absolute inset-0 z-0"
								>
									<span className="sr-only">
										Read {study.title} case study
									</span>
								</Link>
								<div className="p-6 md:p-8">
									{Logo && (
										<div className="absolute top-6 right-6 md:top-8 md:right-8">
											<Logo className="w-[80px] text-primary opacity-[0.08]" />
										</div>
									)}
									<p className="font-mono text-[11px] text-tint uppercase tracking-[0.15em]">
										{study.category}
									</p>
									<h3 className="mt-3 pr-16 font-sans text-[clamp(22px,3vw,28px)] text-primary font-normal leading-tight tracking-tight">
										{study.title}
									</h3>
									<p className="mt-3 font-sans text-[14px] text-secondary leading-relaxed">
										{study.description}
									</p>
									<div className="mt-6">
										<span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-secondary transition-colors duration-200 group-hover:text-primary">
											Read case study
											<span className="transition-transform duration-200 group-hover:translate-x-0.5">
												&rarr;
											</span>
										</span>
									</div>
								</div>
							</div>
						</FadeIn>
					)
				})}
			</div>
		</section>
	)
}
