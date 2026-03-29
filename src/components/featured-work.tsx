import Link from 'next/link'
import { getFeaturedCaseStudies } from '~/lib/case-studies'
import { FadeIn } from './fade-in'

export function FeaturedWork() {
	const featured = getFeaturedCaseStudies()

	return (
		<section className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<FadeIn>
				<div className="flex items-center justify-between mb-8">
					<span className="font-mono text-xs text-[#555555] tracking-widest uppercase">
						Work
					</span>
					<Link
						href="/work"
						className="group inline-flex items-center gap-2 font-mono text-sm text-[#888888] transition-colors duration-200 hover:text-[#EDEDED]"
					>
						<span>See all</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							→
						</span>
					</Link>
				</div>
			</FadeIn>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{featured.map((study, i) => (
					<FadeIn key={study.slug} delay={i * 0.08}>
						<Link
							href={`/work/${study.slug}`}
							className="group block overflow-hidden rounded-lg border border-[#1A1A1A] bg-[#111111] hover:border-[#2A2A2A] transition-colors duration-200"
						>
							<div className="aspect-video bg-[#0A0A0A] rounded-t-lg flex items-center justify-center">
								<span className="font-mono text-sm text-[#555555]">[ Visual ]</span>
							</div>
							<div className="p-6">
								<p className="font-mono text-xs text-[#888888]">
									{study.client} · {study.context}
								</p>
								<h3 className="font-sans text-2xl text-[#EDEDED] font-normal mt-1">
									{study.title}
								</h3>
								<p className="font-sans text-base text-[#888888] mt-2 leading-relaxed">
									{study.description}
								</p>
								<div className="font-mono text-[11px] text-[#555555] mt-4">
									{study.tags.slice(0, 4).join(' · ')}
								</div>
							</div>
						</Link>
					</FadeIn>
				))}
			</div>
		</section>
	)
}
