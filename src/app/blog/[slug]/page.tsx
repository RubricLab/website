import Image from 'next/image'
import blog from '~/app/images/blog.webp'
import { getPostSlugs } from '~/lib/constants/posts/index'
import { env } from '~/lib/env'
import { Copiable } from '~/ui/copiable'

export async function generateStaticParams() {
	const slugs = await getPostSlugs()
	return slugs.map(slug => ({ slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const { default: Post, metadata } = await import(`~/lib/constants/posts/${slug}.mdx`)

	if (!Post || !metadata) return <div>Post not found</div>

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 py-32">
			<div className="flex w-full max-w-5xl flex-col items-start space-y-8">
				<div className="relative h-96 w-full overflow-hidden">
					<Image src={blog} alt={metadata.title} fill className="object-cover object-middle" />
				</div>
				<div className="flex w-full justify-between text-sm">
					<div className="flex gap-2">
						<p className="font-mono">{metadata.category}</p>
						<p className="opacity-50">{metadata.date}</p>
					</div>
					<div className="flex gap-2">
						<p className="opacity-50">By {metadata.author}</p>
						<Copiable variant="link" content={`${env.VERCEL_URL}/blog/${metadata.slug}`}>
							Copy link
						</Copiable>
					</div>
				</div>
				<h1 className="mb-16">{metadata.title}</h1>
				<div className="mx-auto max-w-3xl space-y-6">
					<Post />
				</div>
			</div>
		</div>
	)
}

export const dynamicParams = false
