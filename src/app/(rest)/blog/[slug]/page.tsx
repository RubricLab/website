import type { Metadata } from 'next'
import Link from 'next/link'
import { formatDate } from '~/lib/utils/date'
import { getPost, getPostSlugs } from '~/lib/utils/posts'
import { CTA } from '~/ui/cta'
import { CustomImage } from '~/ui/custom-image'
import { NextPost } from '~/ui/next-post'
import { TableOfContents } from '~/ui/table-of-contents'

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
		title: metadata.title
	}
}

export default async function Page({ params }: Props) {
	const { slug } = await params
	const { Post, metadata, toc } = await getPost(slug)

	if (!Post || !metadata) return <div>Post not found</div>

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 p-4 py-32">
			<div className="flex w-full max-w-5xl flex-col items-start space-y-6">
				<div className="relative h-96 w-full overflow-hidden">
					<CustomImage
						src={metadata.bannerImageUrl}
						alt={metadata.title}
						className="object-cover object-middle"
					/>
				</div>
				<div className="flex w-full flex-col justify-between text-secondary sm:flex-row sm:items-center">
					<p>{formatDate(metadata.date)}</p>
					<p>
						by{' '}
						<Link href={metadata.author.url} target="_blank" rel="noopener noreferrer">
							{metadata.author.name}
						</Link>
					</p>
					<p>{metadata.category}</p>
				</div>
				<article className="mx-auto max-w-full sm:max-w-2xl">
					<div className="flex flex-col gap-2">
						<h1>{metadata.title}</h1>
						{metadata.subtitle ? <h3 className="mt-0 text-secondary">{metadata.subtitle}</h3> : null}
					</div>
					<TableOfContents items={toc} />
					<Post />
					<CTA />
					<NextPost date={metadata.date} />
				</article>
			</div>
		</div>
	)
}
