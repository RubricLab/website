import { getPostMetadata } from '~/lib/utils/posts'
import { Card } from './card'

export default async function Page() {
	const posts = await getPostMetadata()

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 p-4 py-32">
			<div className="flex flex-col items-center gap-2">
				<h1>Blog</h1>
				<p className="text-secondary">The latest from our team</p>
			</div>
			<div className="grid max-w-4xl gap-16 sm:grid-cols-2">
				{posts.map((post, index) => (
					<Card
						imgSrc={post.bannerImageUrl}
						imgAlt={post.title}
						key={post.slug}
						post={post}
						className={index % 2 === 1 ? 'sm:translate-y-16' : ''}
					/>
				))}
			</div>
		</div>
	)
}
