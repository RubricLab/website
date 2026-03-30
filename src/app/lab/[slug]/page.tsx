import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn } from '~/components/fade-in'
import { Langchain } from '~/components/logos/langchain'
import { Neon } from '~/components/logos/neon'
import { TableOfContents } from '~/components/table-of-contents'
import { getPost, getPostSlugs } from '~/lib/posts'

export const dynamicParams = false

type Props = {
	params: Promise<{ slug: string }>
}

const coPostLogos: Record<string, { Component: React.FC<{ className?: string }>; w: string }> = {
	Neon: { Component: Neon, w: 'w-[48px]' },
	LangChain: { Component: Langchain, w: 'w-[64px]' }
}

export async function generateStaticParams() {
	const slugs = await getPostSlugs()
	return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const { metadata } = await getPost(slug)

	return {
		description: metadata.description,
		openGraph: {
			description: metadata.description,
			title: `${metadata.title} — Rubric`
		},
		title: metadata.title
	}
}

function formatDate(dateStr: string) {
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
}

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params
	const { Post, metadata, toc } = await getPost(slug)

	if (!Post || !metadata) return <div>Post not found</div>

	const logo = metadata.coPost ? coPostLogos[metadata.coPost.partner] : null

	return (
		<div className="mx-auto max-w-[720px] px-6 pt-40 pb-32 md:px-10">
			<FadeIn>
				<article>
					<header className="mb-16">
						<Link
							href="/lab"
							className="group inline-flex items-center gap-2 font-mono text-xs text-secondary transition-colors duration-200 hover:text-primary"
						>
							<span className="transition-transform duration-200 group-hover:-translate-x-0.5">
								&larr;
							</span>
							<span>Lab</span>
						</Link>
						<h1 className="mt-10 font-normal font-sans text-[clamp(32px,5vw,48px)] text-primary leading-tight tracking-tight">
							{metadata.title}
						</h1>
						{metadata.subtitle && (
							<p className="mt-3 font-sans text-secondary text-xl leading-relaxed">
								{metadata.subtitle}
							</p>
						)}
						<div className="mt-6 flex items-center gap-3 font-mono text-xs text-secondary">
							<span>{formatDate(metadata.date)}</span>
							<span className="text-subtle">·</span>
							<span>{metadata.author.name}</span>
						</div>
						{logo && metadata.coPost && (
							<a
								href={metadata.coPost.url}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-4 inline-flex items-center gap-2.5 rounded-lg border border-subtle px-3 py-2 transition-colors duration-200 hover:border-subtle/60 hover:bg-accent"
							>
								<span className="font-mono text-[11px] text-secondary">
									Also published on
								</span>
								<logo.Component
									className={`h-auto text-primary opacity-40 ${logo.w}`}
								/>
							</a>
						)}
					</header>

					<TableOfContents items={toc} />

					<Post />

					<div className="mt-20 border-t border-subtle pt-8">
						<Link
							href="/lab"
							className="group inline-flex items-center gap-2 font-mono text-xs text-secondary transition-colors duration-200 hover:text-primary"
						>
							<span className="transition-transform duration-200 group-hover:-translate-x-0.5">
								&larr;
							</span>
							<span>Back to Lab</span>
						</Link>
					</div>
				</article>
			</FadeIn>
		</div>
	)
}
