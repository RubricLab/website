import blog from '~/app/images/blog.webp'
import blog2 from '~/app/images/blog2.webp'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '~/lib/utils/cn'
import { posts } from '~/lib/constants/posts'

export default async function Page() {
	return (
		<div className="flex min-h-screen flex-col items-center gap-16 py-32">
			<div className="flex flex-col items-center gap-2">
				<h1>Blog</h1>
				<p className="text-sm">The latest from our team</p>
			</div>
			<div className="grid grid-cols-8 gap-16">
				{posts.map((post, index) => (
					<Link
						href={`/blog/${post.slug}`}
						key={post.slug}
						className={cn('col-span-4 space-y-2', index % 2 === 1 ? 'translate-y-16' : '')}
					>
						<div className="relative aspect-square w-full">
							<Image src={Math.random() > 0.5 ? blog : blog2} alt="Abstract plant image" fill />
						</div>
						<p className="max-w-full pt-4 text-lg">{post.title}</p>
						<div className="flex gap-4 text-sm">
							<p className="font-mono">{post.category}</p>
							<p className="opacity-50">{post.date}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
