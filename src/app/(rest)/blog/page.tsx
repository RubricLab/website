import { META } from '~/lib/constants/metadata'
import { createMetadata } from '~/lib/utils/create-metadata'
import { getPostMetadata } from '~/lib/utils/posts'
import { Card } from '~/ui/card'

const description = `The latest from our team. ${META.description}`
const title = `Blog | ${META.title}`

export const metadata = createMetadata({
	description,
	openGraph: {
		description,
		images: [{ alt: title, url: '/opengraph-image' }],
		title
	},
	title,
	twitter: {
		description,
		images: [{ alt: title, url: '/twitter-image' }],
		title
	}
})

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
