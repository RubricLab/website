import type { Metadata } from 'next'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { FadeIn } from '~/components/fade-in'
import { Albertsons } from '~/components/logos/albertsons'
import { Cal } from '~/components/logos/cal'
import { DRisk } from '~/components/logos/drisk'
import { Graphite } from '~/components/logos/graphite'
import { Greptile } from '~/components/logos/greptile'
import { Gumloop } from '~/components/logos/gumloop'
import { Langchain } from '~/components/logos/langchain'
import { Maige } from '~/components/logos/maige'
import { Trigger } from '~/components/logos/trigger'
import { Section } from '~/components/section'
import { caseStudies } from '~/lib/case-studies'

export const metadata: Metadata = {
	description:
		'Systems we\u2019ve built. Problems we\u2019ve solved. Each one taught us something about how AI should work in production.',
	title: 'Work'
}

const studyLogos: Record<string, ComponentType<{ className?: string }>> = {
	'cal-ai': Cal,
	'gumloop-marketplace': Gumloop,
	'safeway-ai': Albertsons,
	'year-in-code': Graphite
}

const coPostLogos: Record<string, React.ReactNode> = {
	LangChain: <Langchain className="h-3 w-auto" />
}

const secondaryProjects = [
	{
		Logo: DRisk,
		description:
			'End-to-end fintech platform for identifying new risk factors in SEC filings. Idea to production.',
		href: 'https://drisk.ai',
		linkText: 'Visit platform',
		title: 'dRisk'
	},
	{
		Logo: Maige,
		description:
			'Open-source AI codebase copilot for triaging GitHub issues. Used in 4,000+ projects.',
		href: 'https://github.com/rubriclabs/maige',
		linkText: 'View source',
		title: 'Maige'
	},
	{
		Logo: Cal,
		description:
			'End-to-end sync between Linear and GitHub Issues. Built with Cal.com. Used by 1,000+ projects including PostHog and Vercel.',
		href: 'https://github.com/rubriclabs/synclinear',
		linkText: 'View source',
		title: 'SyncLinear'
	},
	{
		Logo: Trigger,
		description:
			'Open-source demos showcasing AI capabilities on Trigger\u2019s infrastructure. AutoChangelog: AI-generated changelogs for GitHub repos.',
		href: 'https://trigger.dev',
		linkText: 'Try it out',
		title: 'Trigger.dev'
	},
	{
		Logo: Greptile,
		description: 'Landing page and demo for an AI code-review bot.',
		href: 'https://greptile.com',
		linkText: 'Visit website',
		title: 'Greptile'
	}
]

export default function WorkPage() {
	const hero = caseStudies[0]!
	const rest = caseStudies.slice(1)
	const HeroLogo = studyLogos[hero.slug]

	return (
		<Section className="pt-40">
			<FadeIn>
				<h1 className="font-normal font-sans text-[clamp(36px,6vw,56px)] text-primary leading-tight tracking-tight">
					Work
				</h1>
				<p className="mt-4 max-w-[540px] font-sans text-lg text-secondary">
					Systems we've built. Problems we've solved. Each one taught us something
					about how AI should work in production.
				</p>
			</FadeIn>

			{/* Hero Case Study */}
			<FadeIn className="mt-16">
				<div className="group relative overflow-hidden rounded-xl border border-subtle bg-accent/50 transition-all duration-300 hover:border-tint/30 hover:shadow-[0_2px_24px_-4px_rgba(138,154,154,0.12)]">
					<Link
						href={`/work/${hero.slug}`}
						className="absolute inset-0 z-0"
					>
						<span className="sr-only">Read {hero.title} case study</span>
					</Link>
					<div className="flex flex-col md:flex-row md:items-center">
						<div className="flex-1 p-8 md:p-10">
							<p className="font-mono text-[11px] text-tint uppercase tracking-[0.15em]">
								{hero.category}
							</p>
							<h2 className="mt-3 font-normal font-sans text-[clamp(28px,4vw,40px)] text-primary leading-tight tracking-tight">
								{hero.title}
							</h2>
							<p className="mt-4 max-w-[520px] font-sans text-[15px] text-secondary leading-relaxed">
								{hero.description}
							</p>
							<div className="mt-8">
								<span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-secondary transition-colors duration-200 group-hover:text-primary">
									Read case study
									<span className="transition-transform duration-200 group-hover:translate-x-0.5">
										&rarr;
									</span>
								</span>
							</div>
						</div>
						{HeroLogo && (
							<div className="hidden items-center justify-center px-10 py-8 md:flex md:px-16">
								<HeroLogo className="w-[140px] text-primary opacity-[0.08]" />
							</div>
						)}
					</div>
				</div>
			</FadeIn>

			{/* Remaining Featured Case Studies */}
			<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
				{rest.map((study, i) => {
					const Logo = studyLogos[study.slug]
					return (
						<FadeIn key={study.slug} delay={i * 0.06}>
							<div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-subtle bg-accent/40 p-6 transition-all duration-300 hover:border-tint/30 hover:shadow-[0_1px_12px_-4px_rgba(0,0,0,0.06)] md:p-8">
								<Link
									href={`/work/${study.slug}`}
									className="absolute inset-0 z-0"
								>
									<span className="sr-only">
										Read {study.title} case study
									</span>
								</Link>
								{Logo && (
									<div className="absolute top-6 right-6 md:top-8 md:right-8">
										<Logo className="w-[72px] text-primary opacity-[0.12]" />
									</div>
								)}
								<p className="font-mono text-[11px] text-secondary uppercase tracking-[0.15em]">
									{study.category}
								</p>
								<h2 className="mt-3 pr-16 font-normal font-sans text-[clamp(22px,2.5vw,28px)] text-primary leading-tight tracking-tight">
									{study.title}
								</h2>
								<p className="mt-3 font-sans text-[14px] text-secondary leading-relaxed">
									{study.description}
								</p>
								{study.coPost && (
									<a
										href={study.coPost.url}
										target="_blank"
										rel="noopener noreferrer"
										className="relative z-10 mt-4 inline-flex w-fit items-center gap-2 font-mono text-[11px] text-secondary transition-colors hover:text-primary"
									>
										<span className="tracking-wide">Also published on</span>
										{coPostLogos[study.coPost.label] ?? (
											<span>{study.coPost.label}</span>
										)}
									</a>
								)}
								<div className="mt-auto pt-6">
									<span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-secondary transition-colors duration-200 group-hover:text-primary">
										Read case study
										<span className="transition-transform duration-200 group-hover:translate-x-0.5">
											&rarr;
										</span>
									</span>
								</div>
							</div>
						</FadeIn>
					)
				})}
			</div>

			{/* Secondary Projects */}
			<div className="mt-24">
				<FadeIn>
					<p className="font-mono text-[11px] text-secondary uppercase tracking-[0.15em]">
						Other Projects
					</p>
				</FadeIn>
				<div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
					{secondaryProjects.map((project, i) => (
						<FadeIn key={project.title} delay={i * 0.04}>
							<div>
								{project.Logo && (
									<project.Logo className="mb-3 h-4 w-auto text-primary opacity-25" />
								)}
								<h3 className="font-sans text-base font-medium text-primary">
									{project.title}
								</h3>
								<p className="mt-1.5 font-sans text-[14px] text-secondary leading-relaxed">
									{project.description}
								</p>
								<a
									href={project.href}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-2 inline-flex items-center gap-1 font-mono text-[12px] text-secondary transition-colors hover:text-primary"
								>
									{project.linkText}
									<span>&rarr;</span>
								</a>
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</Section>
	)
}
