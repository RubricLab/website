import { posts } from '~/lib/constants/posts'
import blog from '~/app/images/blog.webp'
import Image from 'next/image'
import { Copiable } from '~/ui/copiable'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const slug = (await params).slug
	const content = posts.find(post => post.slug === slug)

	if (!content) return <div>Post not found</div>

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 py-32">
			<div className="flex w-full max-w-5xl flex-col items-start gap-8">
				<div className="relative h-96 w-full overflow-hidden">
					<Image src={blog} alt={content.title} fill className="object-cover object-middle" />
				</div>
				<div className="flex w-full justify-between text-sm">
					<div className="flex gap-2">
						<p className="font-mono">{content.category}</p>
						<p className="opacity-50">{content.date}</p>
					</div>
					<div className="flex gap-2">
						<p className="opacity-50">By {content.author}</p>
						<Copiable variant="link" content={`${process.env.VERCEL_URL}/blog/${content.slug}`}>
							Copy link
						</Copiable>
					</div>
				</div>
				<h1 className="text-left">{content.title}</h1>
			</div>
		</div>
	)
}
