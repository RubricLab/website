import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn } from '~/components/fade-in'
import { Section } from '~/components/section'
import { openSourceProjects, tools } from '~/lib/open-source'
import { getPostMetadata } from '~/lib/posts'

export const metadata: Metadata = {
	description: 'Research, writing, and open source from Rubric.',
	title: 'Lab'
}

const pullSentences: Record<string, string> = {
	'create-rubric-app': 'Scaffold AI projects in one command.',
	'fine-tuning-for-spam-detection': 'Fine-tuning GPT to detect spam with high precision.',
	'gumloop-templates': 'Building a marketplace from an internal template directory.',
	'how-does-claude-code-actually-work': 'A deep dive into the architecture behind Claude Code.',
	'introducing-rubric-labs': "We're an applied AI lab. Here's what we do.",
	'multi-staging': 'How multi-staging improves AI pipeline reliability.',
	'my-summer-at-rubric': "What it's like to intern at a lab that ships.",
	'personalized-video-at-scale': 'Generating unique videos for every user, at scale.',
	'planning-for-free-ai': 'What happens when intelligence costs nothing.',
	'primitives-over-pipelines': "Don't anticipate every path. Define capabilities, not trajectories."
}

function formatDate(dateStr: string) {
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function LabPage() {
	const posts = await getPostMetadata()

	return (
		<Section className="pt-40">
			<FadeIn>
				<p className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
					Research & Writing
				</p>
				<h1 className="mt-4 font-normal font-sans text-[clamp(36px,6vw,56px)] text-text-primary leading-tight tracking-tight">
					Lab
				</h1>
				<p className="mt-4 max-w-[480px] font-sans text-lg text-text-secondary">
					Research, writing, and open source from Rubric.
				</p>
			</FadeIn>

			{/* Writing */}
			<div className="mt-20">
				<FadeIn>
					<h2 className="mb-10 font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						Writing
					</h2>
				</FadeIn>
				<div className="divide-y divide-border">
					{posts.map((post, i) => (
						<FadeIn key={post.slug} delay={i * 0.03}>
							<Link
								href={`/lab/${post.slug}`}
								className="group block py-5 transition-colors duration-200 first:pt-0"
							>
								<div className="flex items-start justify-between gap-6">
									<div>
										<h3 className="font-sans text-[17px] text-text-primary transition-colors duration-200 group-hover:text-white">
											{post.title}
										</h3>
										<p className="mt-1.5 font-sans text-[14px] text-text-tertiary transition-colors duration-200 group-hover:text-text-secondary">
											{post.pullSentence || pullSentences[post.slug] || post.description}
										</p>
									</div>
									<span className="shrink-0 pt-1 font-mono text-[11px] text-text-tertiary">
										{formatDate(post.date)}
									</span>
								</div>
							</Link>
						</FadeIn>
					))}
				</div>
			</div>

			{/* Open Source */}
			<div className="mt-24">
				<FadeIn>
					<h2 className="mb-10 font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						Open Source
					</h2>
				</FadeIn>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{openSourceProjects.map((project, i) => (
						<FadeIn key={project.name} delay={i * 0.05}>
							<a
								href={project.href}
								target="_blank"
								rel="noopener noreferrer"
								className="group block rounded-xl border border-border bg-surface/30 p-6 transition-all duration-300 hover:border-border-hover hover:bg-surface/60"
							>
								<h3 className="font-sans text-base text-text-primary transition-colors duration-200 group-hover:text-white">
									{project.name}
								</h3>
								<p className="mt-1 font-sans text-[14px] text-text-secondary">
									{project.description}
								</p>
								<p className="mt-4 font-mono text-[11px] text-text-tertiary">
									{project.metric}
								</p>
							</a>
						</FadeIn>
					))}
				</div>
			</div>

			{/* Tools */}
			<div className="mt-24">
				<FadeIn>
					<h2 className="mb-10 font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						Tools
					</h2>
				</FadeIn>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{tools.map((tool, i) => (
						<FadeIn key={tool.name} delay={i * 0.05}>
							<a
								href={tool.href}
								target="_blank"
								rel="noopener noreferrer"
								className="group block rounded-xl border border-border bg-surface/30 p-6 transition-all duration-300 hover:border-border-hover hover:bg-surface/60"
							>
								<h3 className="font-sans text-base text-text-primary transition-colors duration-200 group-hover:text-white">
									{tool.name}
								</h3>
								<p className="mt-1 font-sans text-[14px] text-text-secondary">
									{tool.description}
								</p>
							</a>
						</FadeIn>
					))}
				</div>
			</div>
		</Section>
	)
}
