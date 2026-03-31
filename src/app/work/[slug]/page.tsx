import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { FadeIn } from '~/components/fade-in'
import { Albertsons } from '~/components/logos/albertsons'
import { Cal } from '~/components/logos/cal'
import { Graphite } from '~/components/logos/graphite'
import { Gumloop } from '~/components/logos/gumloop'
import { Langchain } from '~/components/logos/langchain'
import { TableOfContents } from '~/components/table-of-contents'
import { caseStudies, getCaseStudy, getCaseStudyContent } from '~/lib/case-studies'

export const dynamicParams = false

export function generateStaticParams() {
	return caseStudies.map(study => ({ slug: study.slug }))
}

type Props = {
	params: Promise<{ slug: string }>
}

const studyLogos: Record<string, ComponentType<{ className?: string }>> = {
	'cal-ai': Cal,
	'gumloop-marketplace': Gumloop,
	'safeway-ai': Albertsons,
	'year-in-code': Graphite
}

const coPostLogos: Record<string, { Component: React.FC<{ className?: string }>; w: string }> = {
	LangChain: { Component: Langchain, w: 'w-[64px]' }
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

	const content = await getCaseStudyContent(slug)
	const Logo = studyLogos[study.slug]
	const coPostLogo = study.coPost ? coPostLogos[study.coPost.label] : null

	return (
		<div className="mx-auto max-w-[720px] px-6 pt-40 pb-32 md:px-10">
			<FadeIn>
				<Link
					href="/work"
					className="group inline-flex items-center gap-2 font-mono text-xs text-secondary transition-colors duration-200 hover:text-primary"
				>
					<span className="transition-transform duration-200 group-hover:-translate-x-0.5">
						&larr;
					</span>
					<span>Work</span>
				</Link>

				<header className="mt-10 relative">
					{Logo && (
						<div className="absolute top-0 right-0 hidden md:block">
							<Logo className="w-[100px] text-primary opacity-[0.06]" />
						</div>
					)}
					<p className="font-mono text-[11px] text-tint uppercase tracking-[0.15em]">
						{study.category}
					</p>
					<h1 className="mt-3 font-normal font-sans text-[clamp(36px,6vw,52px)] text-primary leading-tight tracking-tight">
						{study.title}
					</h1>
					<p className="mt-3 font-sans text-xl text-secondary leading-relaxed">
						{study.subtitle}
					</p>

					<div className="mt-6 flex items-center gap-3 font-mono text-xs text-secondary">
						<span>{study.client}</span>
						<span className="text-subtle">·</span>
						<span className="text-secondary/60">{study.context}</span>
					</div>

					{coPostLogo && study.coPost && (
						<a
							href={study.coPost.url}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-4 inline-flex items-center gap-2.5 rounded-lg border border-subtle px-3 py-2 transition-colors duration-200 hover:border-subtle/60 hover:bg-accent"
						>
							<span className="font-mono text-[11px] text-secondary">
								Also published on
							</span>
							<coPostLogo.Component
								className={`h-auto text-primary opacity-40 ${coPostLogo.w}`}
							/>
						</a>
					)}

					<div className="mt-6 flex flex-wrap gap-2">
						{study.tags.map(tag => (
							<span
								key={tag}
								className="rounded-full border border-subtle px-3 py-1 font-mono text-[11px] text-secondary"
							>
								{tag}
							</span>
						))}
					</div>
				</header>
			</FadeIn>

			{content ? (
				<FadeIn delay={0.1}>
					<div className="mt-12 border-t border-subtle pt-8">
						<p className="font-sans text-[15px] text-secondary leading-relaxed">
							{study.scope}
						</p>
					</div>

					<article className="mt-12">
						<TableOfContents items={content.toc} defaultOpen={false} />
						<content.Content />
					</article>

					{study.quote && (
						<div className="mt-20 border-t border-subtle pt-10">
							<blockquote className="font-sans text-lg text-secondary italic leading-relaxed">
								&ldquo;{study.quote.text}&rdquo;
							</blockquote>
							<p className="mt-4 font-mono text-xs text-secondary/60">
								— {study.quote.attribution}
							</p>
						</div>
					)}
				</FadeIn>
			) : (
				<FadeIn delay={0.1}>
					<div className="mt-20 border-t border-subtle pt-10">
						<p className="font-sans text-[17px] text-secondary leading-[1.7]">
							{study.description}
						</p>
					</div>
				</FadeIn>
			)}

			<div className="mt-20 border-t border-subtle pt-8">
				<Link
					href="/work"
					className="group inline-flex items-center gap-2 font-mono text-xs text-secondary transition-colors duration-200 hover:text-primary"
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
