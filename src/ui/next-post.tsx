import { getPostMetadata } from '~/lib/utils/posts'
import { Card } from '~/ui/card'

export const NextPost = async ({ date }: { date: string }) => {
	const posts = await getPostMetadata()

	const otherPosts = posts.filter(post => post.date < date)
	if (otherPosts.length < 2)
		otherPosts.push(
			...posts
				.filter(post => post.date > date)
				.reverse()
				.slice(0, 2)
		)

	return (
		<div className="flex flex-col gap-8 py-16">
			<h2>Keep reading</h2>
			<div className="grid max-w-4xl gap-8 sm:grid-cols-2">
				{otherPosts.slice(0, 2).map(post => (
					<Card key={post.slug} post={post} imgSrc={post.bannerImageUrl} imgAlt={post.title} />
				))}
			</div>
		</div>
	)
}
