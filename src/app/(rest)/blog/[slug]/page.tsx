import type { Metadata } from 'next'
import Link from 'next/link'
import { formatDate } from '~/lib/utils/date'
import { getPost, getPostSlugs } from '~/lib/utils/posts'
import { Button } from '~/ui/button'
import { CustomImage } from '~/ui/custom-image'

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
		title: metadata.title,
		description: metadata.description
	}
}

export default async function Page({ params }: Props) {
	const { slug } = await params
	const { Post, metadata } = await getPost(slug)

	if (!Post || !metadata) return <div>Post not found</div>

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 p-4 py-32">
			<div className="flex w-full max-w-5xl flex-col items-start space-y-8">
				<div className="relative h-96 w-full overflow-hidden">
					<CustomImage
						src={metadata.bannerImageUrl}
						alt={metadata.title}
						className="object-cover object-middle"
					/>
				</div>
				<div className="flex w-full justify-between text-secondary text-sm">
					<p>{metadata.category}</p>
					<p>by {metadata.author}</p>
					<p>{formatDate(metadata.date)}</p>
				</div>
				<article className="mx-auto max-w-full sm:max-w-2xl">
					<div className="flex flex-col gap-2">
						<h1>{metadata.title}</h1>
						{metadata.subtitle ? <h3 className="text-secondary">{metadata.subtitle}</h3> : null}
					</div>
					<Post />
					<div className="flex items-center justify-center">
						<Link href="/contact" className="no-underline">
							<Button>Get in touch</Button>
						</Link>
					</div>
				</article>
			</div>
		</div>
	)
}
