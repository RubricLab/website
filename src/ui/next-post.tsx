import { getPostMetadata, type Post } from '~/lib/utils/posts'
import { Card } from '~/ui/card'

export const NextPost = async ({ slug }: { slug: string }) => {
	const posts = await getPostMetadata()
	const currentIndex = posts.findIndex(post => post.slug === slug)
	if (currentIndex === -1) return null

	const postBefore = posts[currentIndex + 1]
	const postAfter = posts[currentIndex - 1]
	let suggestedPosts = [postAfter, postBefore].filter((post): post is Post => post !== undefined)

	if (!postBefore)
		suggestedPosts = [posts[currentIndex - 1], posts[currentIndex - 2]].filter(
			(post): post is Post => post !== undefined
		)
	if (!postAfter)
		suggestedPosts = [posts[currentIndex + 1], posts[currentIndex + 2]].filter(
			(post): post is Post => post !== undefined
		)

	if (suggestedPosts.length < 2) {
		const fallbackPosts = posts.filter(post => post.slug !== slug)
		suggestedPosts = fallbackPosts.slice(0, 2)
	}

	return (
		<div className="flex flex-col gap-8">
			<h2>Keep reading</h2>
			<div className="grid max-w-4xl gap-8 sm:grid-cols-2">
				{suggestedPosts.slice(0, 2).map(post => (
					<Card key={post.slug} post={post} imgSrc={post.bannerImageUrl} imgAlt={post.title} />
				))}
			</div>
		</div>
	)
}
