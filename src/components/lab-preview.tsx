import Link from 'next/link'
import { getPostMetadata } from '~/lib/posts'
import { FadeIn } from './fade-in'

const pullSentences: Record<string, string> = {
	'contract-engineering': 'The contracts are the application. The code is an implementation detail.',
	'unblocking-agents': "The bottleneck isn't the model. It's the environment.",
	'primitives-over-pipelines': "Don't anticipate every path. Define capabilities, not trajectories.",
	'create-rubric-app': 'Scaffold AI projects in one command.',
	'fine-tuning-for-spam-detection': 'Fine-tuning GPT to detect spam with high precision.',
	'gumloop-templates': 'Building a marketplace from an internal template directory.',
	'how-does-claude-code-actually-work': 'A deep dive into the architecture behind Claude Code.',
	'introducing-rubric-labs': "We're an applied AI lab. Here's what we do.",
	'multi-staging': 'How multi-staging improves AI pipeline reliability.',
	'my-summer-at-rubric': "What it's like to intern at a lab that ships.",
	'personalized-video-at-scale': 'Generating unique videos for every user, at scale.',
	'planning-for-free-ai': 'What happens when intelligence costs nothing.'
}

function formatDate(dateStr: string) {
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export async function LabPreview() {
	const posts = await getPostMetadata()
	const latest = posts.slice(0, 3)

	return (
		<section className="max-w-[1200px] mx-auto px-6 md:px-8 py-24">
			<FadeIn>
				<div className="flex items-center justify-between mb-8">
					<span className="font-mono text-xs text-[#555555] tracking-widest uppercase">
						Lab
					</span>
					<Link
						href="/lab"
						className="group inline-flex items-center gap-2 font-mono text-sm text-[#888888] transition-colors duration-200 hover:text-[#EDEDED]"
					>
						<span>See all</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							→
						</span>
					</Link>
				</div>
			</FadeIn>
			<div>
				{latest.map((post, i) => (
					<FadeIn key={post.slug} delay={i * 0.06}>
						<Link
							href={`/lab/${post.slug}`}
							className="block py-5 border-b border-[#1A1A1A] hover:bg-[#111111] transition-colors duration-200 px-2 -mx-2 rounded-sm"
						>
							<div className="flex items-baseline justify-between gap-4">
								<h3 className="font-sans text-lg text-[#EDEDED]">
									{post.title}
								</h3>
								<span className="font-mono text-[13px] text-[#555555] shrink-0">
									{formatDate(post.date)}
								</span>
							</div>
							<p className="font-sans text-base text-[#888888] mt-1">
								{post.pullSentence || pullSentences[post.slug] || post.description}
							</p>
						</Link>
					</FadeIn>
				))}
			</div>
		</section>
	)
}
