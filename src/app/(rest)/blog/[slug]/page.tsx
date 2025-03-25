import Image from 'next/image'
import Link from 'next/link'
import { cn } from '~/lib/utils/cn'
import { formatDate } from '~/lib/utils/date'
import { getPost, getPostSlugs } from '~/lib/utils/posts'
import { buttonVariants } from '~/ui/button'

export const dynamicParams = false

export async function generateStaticParams() {
	const slugs = await getPostSlugs()
	return slugs.map(slug => ({ slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const { Post, metadata } = await getPost(slug)

	if (!Post || !metadata) return <div>Post not found</div>

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 p-4 py-32">
			<div className="flex w-full max-w-5xl flex-col items-start space-y-8">
				<div className="relative h-96 w-full overflow-hidden">
					<Image
						src={metadata.bannerImageUrl}
						alt={metadata.title}
						fill
						className="object-cover object-middle"
					/>
				</div>
				<div className="flex w-full justify-between text-secondary text-sm">
					<p className="font-mono">{metadata.category}</p>
					<p>by {metadata.author}</p>
					<p>{formatDate(metadata.date)}</p>
				</div>
				<article className="mx-auto max-w-full sm:max-w-2xl">
					<h1>{metadata.title}</h1>
					<Post />
					<div className="flex items-center justify-center">
						<Link
							href="/contact"
							className={cn(buttonVariants({ variant: 'default', size: 'md' }), 'no-underline')}
						>
							Get in touch
						</Link>
					</div>
				</article>
			</div>
		</div>
	)
}
