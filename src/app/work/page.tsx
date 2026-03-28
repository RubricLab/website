import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn } from '~/components/fade-in'
import { Section } from '~/components/section'
import { caseStudies } from '~/lib/case-studies'

export const metadata: Metadata = {
	description: 'Case studies from Rubric — AI systems research and production engineering.',
	title: 'Work'
}

export default function WorkPage() {
	return (
		<Section className="pt-40">
			<FadeIn>
				<p className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
					Case Studies
				</p>
				<h1 className="mt-4 font-normal font-sans text-[clamp(36px,6vw,56px)] text-text-primary leading-tight tracking-tight">
					Work
				</h1>
				<p className="mt-4 max-w-[480px] font-sans text-lg text-text-secondary">
					Production AI systems for companies building at the frontier.
				</p>
			</FadeIn>
			<div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
				{caseStudies.map((study, i) => (
					<FadeIn key={study.slug} delay={i * 0.06}>
						<Link
							href={`/work/${study.slug}`}
							className="group block overflow-hidden rounded-xl border border-border bg-surface/30 transition-all duration-300 hover:border-border-hover hover:bg-surface/60"
						>
							<div
								className={`visual-placeholder ${study.tier === 'flagship' ? 'aspect-[16/10]' : 'aspect-[2/1]'}`}
							/>
							<div className="p-6">
								<p className="font-mono text-[11px] text-text-tertiary tracking-wide">
									{study.client} · {study.context}
								</p>
								<h3 className="mt-2 font-normal font-sans text-xl text-text-primary transition-colors duration-200 group-hover:text-white">
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
