import type { Metadata } from 'next'
import Link from 'next/link'
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
		<div className="mx-auto max-w-[680px] px-6 pt-36 pb-32 md:px-10">
			{/* Post header — intentionally outside <article> to avoid article p/h overrides */}
			<header className="mb-14">
				<Link
					href="/lab"
					className="group inline-flex items-center gap-2 font-mono text-xs text-secondary transition-colors duration-200 hover:text-primary"
				>
					<span className="transition-transform duration-200 group-hover:-translate-x-0.5">
						&larr;
					</span>
					<span>Lab</span>
				</Link>
				<div className="mt-10 flex items-start gap-3">
					<h1 className="font-normal font-sans text-[clamp(28px,4.5vw,42px)] text-primary leading-tight tracking-tight">
						{metadata.title}
					</h1>
					{metadata.isNew && (
						<span className="mt-2 shrink-0 font-mono text-[9px] uppercase tracking-widest text-tint border border-tint/30 rounded px-1.5 py-0.5 leading-none">
							New
						</span>
					)}
				</div>
				{metadata.subtitle && (
					<p className="mt-3 font-sans text-secondary text-lg leading-relaxed">
						{metadata.subtitle}
					</p>
				)}
				<div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-secondary">
					<span>{formatDate(metadata.date)}</span>
					<span className="text-subtle">·</span>
					<span>{metadata.author.name}</span>
					<span className="text-subtle">·</span>
					<span>{metadata.category}</span>
				</div>
				{logo && metadata.coPost && (
					<a
						href={metadata.coPost.url}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-5 inline-flex items-center gap-2.5 rounded-lg border border-subtle px-3 py-2 transition-colors duration-200 hover:border-subtle/60 hover:bg-accent"
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

			{toc.length > 0 && (
				<div className="mb-12">
					<TableOfContents items={toc} />
				</div>
			)}

			<article>
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
		</div>
	)
}
