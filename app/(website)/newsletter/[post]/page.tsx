import {Metadata} from 'next'
import NewsletterPost from '~/components/NewsletterPost'
import {getNewsletterPost} from '~/sanity/utils'
import getMetadata from '~/utils/getMetadata'

type Props = {
	params: {post: string}
}

// Dynamic metadata using route parameters
export async function generateMetadata({params}: Props): Promise<Metadata> {
	// Read route params
	const slug = params.post
	const post = await getNewsletterPost(slug)
	return getMetadata({
		title: `The Grid | ${slug}`,
		description:
			post?.description ||
			'3 actionable insights. Once a week. Straight to your inbox.',
		path: `newsletter/${slug}`,
		previewImageRoute: `newsletter/${slug}/opengraph-image`
	})
}

export const revalidate = 60 // revalidate this page every 60 seconds

// Newsletter post page
export default async function NewsletterPostPage({params}: Props) {
	const slug = params.post
	const post = await getNewsletterPost(slug)
	return <NewsletterPost post={post} />
}
