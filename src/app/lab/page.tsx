import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn } from '~/components/fade-in'
import { Langchain } from '~/components/logos/langchain'
import { Neon } from '~/components/logos/neon'
import { openSourceProjects, tools } from '~/lib/open-source'
import { getArchivedPosts, getMainFeedPosts } from '~/lib/posts'

export const metadata: Metadata = {
	description: 'Research, writing, and open source from Rubric.',
	title: 'Lab'
}

const pullSentences: Record<string, string> = {
	'contract-engineering': 'The contracts are the application. The code is an implementation detail.',
	'unblocking-agents': "The bottleneck isn't the model. It's the environment.",
	'primitives-over-pipelines': "Don't anticipate every path. Define capabilities, not trajectories.",
	'how-does-claude-code-actually-work': 'A deep dive into the architecture behind Claude Code.',
	'multi-staging': 'Branch-per-developer database workflows for parallel full-stack development.'
}

const coPostLogos: Record<string, { Component: React.FC<{ className?: string }>; w: string }> = {
	Neon: { Component: Neon, w: 'w-[48px]' },
	LangChain: { Component: Langchain, w: 'w-[64px]' }
}

function formatDate(dateStr: string) {
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function LabPage() {
	const posts = await getMainFeedPosts()
	const archivedPosts = await getArchivedPosts()

	return (
		<div className="mx-auto max-w-[1200px] px-6 pt-40 pb-24 md:px-8">
			<FadeIn>
				<p className="font-mono text-xs text-secondary uppercase tracking-widest">
					Research & Writing
				</p>
				<h1 className="mt-4 font-normal font-sans text-[clamp(36px,6vw,56px)] text-primary leading-tight tracking-tight">
					Lab
				</h1>
				<p className="mt-4 max-w-[480px] font-sans text-lg text-secondary leading-relaxed">
					Research, writing, and open source from Rubric.
				</p>
			</FadeIn>

			<FadeIn>
				<div className="mt-6">
					<Link
						href="/work"
						className="group inline-flex items-center gap-2 font-mono text-xs text-secondary transition-colors duration-200 hover:text-primary"
					>
						<span>Looking for case studies? See our work</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							→
						</span>
					</Link>
				</div>
			</FadeIn>

			{/* Writing */}
			<div className="mt-20">
				<FadeIn>
					<h2 className="mb-8 font-mono text-xs text-secondary uppercase tracking-widest">
						Writing
					</h2>
				</FadeIn>
				<div className="border-t border-subtle">
					{posts.map((post, i) => {
						const logo = post.coPost ? coPostLogos[post.coPost.partner] : null
						return (
							<FadeIn key={post.slug} delay={i * 0.04}>
								<Link
									href={`/lab/${post.slug}`}
									className="group flex items-start justify-between gap-6 border-b border-subtle py-5 transition-colors duration-200"
								>
									<div className="min-w-0">
										<div className="flex items-center gap-3">
											<h3 className="font-sans text-lg text-primary font-normal">
												{post.title}
											</h3>
										</div>
										<p className="mt-1 font-sans text-base text-secondary leading-relaxed">
											{pullSentences[post.slug] || post.pullSentence || post.description}
										</p>
										{logo && post.coPost && (
											<div className="mt-2.5 flex items-center gap-2">
												<span className="font-mono text-[11px] text-secondary/60">
													Also published on
												</span>
												<logo.Component
													className={`h-auto text-secondary/60 ${logo.w}`}
												/>
											</div>
										)}
									</div>
									<div className="flex shrink-0 items-center gap-3 pt-1.5">
										<span className="font-mono text-[11px] text-secondary">
											{post.category}
										</span>
										<span className="text-subtle">·</span>
										<span className="font-mono text-[11px] text-secondary">
											{formatDate(post.date)}
										</span>
									</div>
								</Link>
							</FadeIn>
						)
					})}
				</div>
			</div>

			{/* Archive */}
			{archivedPosts.length > 0 && (
				<div className="mt-20">
					<FadeIn>
						<details>
							<summary className="cursor-pointer font-mono text-xs text-secondary uppercase tracking-widest select-none hover:text-primary transition-colors duration-200">
								Archive
							</summary>
							<div className="mt-6 border-t border-subtle">
								{archivedPosts.map((post, i) => (
									<FadeIn key={post.slug} delay={i * 0.03}>
										<Link
											href={`/lab/${post.slug}`}
											className="group flex items-start justify-between gap-6 border-b border-subtle py-4 transition-colors duration-200"
										>
											<h3 className="font-sans text-base text-secondary transition-colors duration-200 group-hover:text-primary">
												{post.title}
											</h3>
											<span className="shrink-0 font-mono text-[11px] text-secondary">
												{formatDate(post.date)}
											</span>
										</Link>
									</FadeIn>
								))}
							</div>
						</details>
					</FadeIn>
				</div>
			)}

			{/* Open Source */}
			<div className="mt-24">
				<FadeIn>
					<h2 className="mb-8 font-mono text-xs text-secondary uppercase tracking-widest">
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
								className="group block rounded-xl border border-subtle bg-accent/40 p-6 transition-all duration-300 hover:border-tint/30 hover:shadow-[0_1px_12px_-4px_rgba(0,0,0,0.06)]"
							>
								<h3 className="font-sans text-base text-primary font-normal">
									{project.name}
								</h3>
								<p className="mt-1 font-sans text-sm text-secondary">
									{project.description}
								</p>
								<p className="mt-4 font-mono text-[11px] text-secondary">
									{project.metric}
								</p>
							</a>
						</FadeIn>
					))}
				</div>
			</div>

			{/* Tools */}
			<div className="mt-20">
				<FadeIn>
					<h2 className="mb-8 font-mono text-xs text-secondary uppercase tracking-widest">
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
								className="group block rounded-xl border border-subtle bg-accent/40 p-6 transition-all duration-300 hover:border-tint/30 hover:shadow-[0_1px_12px_-4px_rgba(0,0,0,0.06)]"
							>
								<h3 className="font-sans text-base text-primary font-normal">
									{tool.name}
								</h3>
								<p className="mt-1 font-sans text-sm text-secondary">
									{tool.description}
								</p>
							</a>
						</FadeIn>
					))}
				</div>
			</div>
		</div>
	)
}
