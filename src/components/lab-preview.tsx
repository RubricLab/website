import Link from 'next/link'
import { getPostMetadata } from '~/lib/posts'
import { FadeIn } from './fade-in'
import { Section } from './section'

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

export async function LabPreview() {
	const posts = await getPostMetadata()
	const latest = posts.slice(0, 3)

	return (
		<Section>
			<FadeIn>
				<div className="mb-12 flex items-center justify-between">
					<span className="font-mono text-[11px] text-text-tertiary uppercase tracking-[0.15em]">
						Lab
					</span>
					<Link
						href="/lab"
						className="group inline-flex items-center gap-2 font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
					>
						<span>See all</span>
						<span className="transition-transform duration-200 group-hover:translate-x-0.5">
							&rarr;
						</span>
					</Link>
				</div>
			</FadeIn>
			<div className="divide-y divide-border">
				{latest.map((post, i) => (
					<FadeIn key={post.slug} delay={i * 0.05}>
						<Link
							href={`/lab/${post.slug}`}
							className="group block py-6 transition-colors duration-200 first:pt-0"
						>
							<div className="flex items-start justify-between gap-6">
								<div>
									<h3 className="font-sans text-lg text-text-primary transition-colors duration-200 group-hover:text-white">
										{post.title}
									</h3>
									<p className="mt-1.5 font-sans text-[15px] text-text-tertiary transition-colors duration-200 group-hover:text-text-secondary">
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
		</Section>
	)
}
