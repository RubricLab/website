import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn } from '~/components/fade-in'
import { TableOfContents } from '~/components/table-of-contents'
import { getPost, getPostSlugs } from '~/lib/posts'

export const dynamicParams = false

type Props = {
	params: Promise<{ slug: string }>
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

	return (
		<div className="mx-auto max-w-[720px] px-6 pt-40 pb-32 md:px-10">
			<FadeIn>
				<article>
					<header className="mb-16">
						<Link
							href="/lab"
							className="group inline-flex items-center gap-2 font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
						>
							<span className="transition-transform duration-200 group-hover:-translate-x-0.5">
								&larr;
							</span>
							<span>Lab</span>
						</Link>
						<h1 className="mt-10 font-normal font-sans text-[clamp(32px,5vw,48px)] text-text-primary leading-tight tracking-tight">
							{metadata.title}
						</h1>
						{metadata.subtitle && (
							<p className="mt-3 font-sans text-text-secondary text-xl leading-relaxed">
								{metadata.subtitle}
							</p>
						)}
						<div className="mt-6 flex items-center gap-3 font-mono text-[12px] text-text-tertiary">
							<span>{formatDate(metadata.date)}</span>
							<span className="text-border-hover">/</span>
							<span>{metadata.author.name}</span>
						</div>
					</header>

					<TableOfContents items={toc} />

					<Post />

					<div className="mt-20 border-border/50 border-t pt-8">
						<Link
							href="/lab"
							className="group inline-flex items-center gap-2 font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
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
