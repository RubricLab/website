import { getPostMetadata } from '~/lib/constants/posts'
import { Card } from './card'

export default async function Page() {
	const posts = await getPostMetadata()

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 py-32">
			<div className="flex flex-col items-center gap-2">
				<h1>Blog</h1>
				<p className="text-sm">The latest from our team</p>
			</div>
			<div className="grid grid-cols-8 gap-16">
				{posts.map((post, index) => (
					<Card
						imgSrc={post.bannerImageUrl}
						key={post.slug}
						post={post}
						className={index % 2 === 1 ? 'translate-y-16' : ''}
					/>
				))}
			</div>
		</div>
	)
}
