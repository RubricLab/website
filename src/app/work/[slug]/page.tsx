import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FadeIn } from '~/components/fade-in'
import { caseStudies, getCaseStudy } from '~/lib/case-studies'

export const dynamicParams = false

export function generateStaticParams() {
	return caseStudies.map(study => ({ slug: study.slug }))
}

type Props = {
	params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const study = getCaseStudy(slug)
	if (!study) return {}

	return {
		description: study.description,
		openGraph: {
			description: study.description,
			title: `${study.title} — Rubric`
		},
		title: study.title
	}
}

export default async function CaseStudyPage({ params }: Props) {
	const { slug } = await params
	const study = getCaseStudy(slug)
	if (!study) notFound()

	return (
		<div className="mx-auto max-w-[720px] px-6 pt-40 pb-32 md:px-10">
			<FadeIn>
				<Link
					href="/work"
					className="group inline-flex items-center gap-2 font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
				>
					<span className="transition-transform duration-200 group-hover:-translate-x-0.5">
						&larr;
					</span>
					<span>Work</span>
				</Link>

				<h1 className="mt-10 font-normal font-sans text-[clamp(36px,6vw,52px)] text-text-primary leading-tight tracking-tight">
					{study.title}
				</h1>
				<div className="mt-4 flex items-center gap-3">
					<p className="font-mono text-[12px] text-text-secondary">
						{study.client}
					</p>
					<span className="text-text-tertiary">/</span>
					<p className="font-mono text-[12px] text-text-tertiary">
						{study.context}
					</p>
				</div>
				<div className="mt-6 flex flex-wrap gap-2">
					{study.tags.map(tag => (
						<span
							key={tag}
							className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-text-tertiary"
						>
							{tag}
						</span>
					))}
				</div>
			</FadeIn>

			<FadeIn delay={0.05}>
				<div className="visual-placeholder mt-12 aspect-video rounded-xl" />
			</FadeIn>

			<FadeIn delay={0.1}>
				<div className="mt-20 border-border/50 border-t pt-10">
					<h2 className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						The Problem
					</h2>
					<div className="mt-6 space-y-5">
						{study.problem.split('\n\n').map((p, i) => (
							<p key={i} className="font-sans text-[17px] text-text-secondary leading-[1.7]">
								{p}
							</p>
						))}
					</div>
				</div>
			</FadeIn>

			<FadeIn>
				<div className="mt-20 border-border/50 border-t pt-10">
					<h2 className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						The System
					</h2>
					<div className="mt-6 space-y-5">
						{study.system.split('\n\n').map((p, i) => (
							<p key={i} className="font-sans text-[17px] text-text-secondary leading-[1.7]">
								{p}
							</p>
						))}
					</div>
				</div>
			</FadeIn>

			<FadeIn>
				<div className="mt-20 border-border/50 border-t pt-10">
					<h2 className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						The Outcome
					</h2>
					<div className="mt-6 space-y-5">
						{study.outcome.split('\n\n').map((p, i) => (
							<p key={i} className="font-sans text-[17px] text-text-primary leading-[1.7]">
								{p}
							</p>
						))}
					</div>
				</div>
			</FadeIn>

			{study.quote && (
				<FadeIn>
					<div className="mt-20 rounded-xl border border-border bg-surface/30 p-8">
						<p className="font-sans text-lg text-text-secondary italic leading-relaxed">
							"{study.quote.text}"
						</p>
						<p className="mt-4 font-mono text-[12px] text-text-tertiary">
							— {study.quote.attribution}
						</p>
					</div>
				</FadeIn>
			)}

			<div className="mt-20 border-border/50 border-t pt-8">
				<Link
					href="/work"
					className="group inline-flex items-center gap-2 font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
				>
					<span className="transition-transform duration-200 group-hover:-translate-x-0.5">
						&larr;
					</span>
					<span>All work</span>
				</Link>
			</div>
		</div>
	)
}
