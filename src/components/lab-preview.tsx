import Link from 'next/link'
import { Langchain } from '~/components/logos/langchain'
import { Neon } from '~/components/logos/neon'
import { getMainFeedPosts } from '~/lib/posts'
import { FadeIn } from './fade-in'

const pullSentences: Record<string, string> = {
	'contract-engineering': 'The contracts are the application. The code is an implementation detail.',
	'unblocking-agents': "The bottleneck isn't the model. It's the environment.",
	'primitives-over-pipelines': "Don't anticipate every path. Define capabilities, not trajectories.",
	'how-does-claude-code-actually-work': 'A deep dive into the architecture behind Claude Code.',
	'multi-staging': 'Branch-per-developer database workflows for parallel full-stack development.'
}

const coPostLogos: Record<string, { Component: React.FC<{ className?: string }>; w: string }> = {
	Neon: { Component: Neon, w: 'w-[40px]' },
	LangChain: { Component: Langchain, w: 'w-[56px]' }
}

function formatDate(dateStr: string) {
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export async function LabPreview() {
	const posts = await getMainFeedPosts()
	const latest = posts.slice(0, 3)

	return (
		<section className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<FadeIn>
				<div className="flex items-center justify-between mb-8">
					<span className="font-mono text-xs text-secondary tracking-widest uppercase">
						Lab
					</span>
					<Link
						href="/lab"
						className="group inline-flex items-center gap-2 font-mono text-sm text-secondary transition-colors duration-200 hover:text-primary"
					>
						<span>See all</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							→
						</span>
					</Link>
				</div>
			</FadeIn>
			<div className="border-t border-subtle">
				{latest.map((post, i) => {
					const logo = post.coPost ? coPostLogos[post.coPost.partner] : null
					return (
						<FadeIn key={post.slug} delay={i * 0.06}>
							<Link
								href={`/lab/${post.slug}`}
								className="group flex items-start justify-between gap-4 border-b border-subtle py-5 transition-colors duration-200"
							>
								<div className="min-w-0">
									<h3 className="font-sans text-lg text-primary font-normal">
										{post.title}
									</h3>
									<p className="font-sans text-base text-secondary mt-1 leading-relaxed">
										{pullSentences[post.slug] || post.pullSentence || post.description}
									</p>
									{logo && (
										<div className="mt-2 flex items-center gap-2">
											<logo.Component
												className={`h-auto text-secondary/50 ${logo.w}`}
											/>
										</div>
									)}
								</div>
								<span className="font-mono text-[11px] text-secondary shrink-0 pt-1.5">
									{formatDate(post.date)}
								</span>
							</Link>
						</FadeIn>
					)
				})}
			</div>
		</section>
	)
}
