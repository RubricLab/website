import type { MetadataRoute } from 'next'
import { getBaseUrl } from '~/lib/utils'
import { getPostMetadata } from '~/lib/utils/posts'

const createEntry = (
	url: string,
	changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
	priority: number,
	lastModified = new Date()
): MetadataRoute.Sitemap[number] => ({
	changeFrequency,
	lastModified,
	priority,
	url
})

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
	const base = getBaseUrl()
	const now = new Date()

	const staticEntries: MetadataRoute.Sitemap = [
		createEntry(`${base}`, 'weekly', 1, now),
		createEntry(`${base}/blog`, 'daily', 0.9, now),
		createEntry(`${base}/work`, 'monthly', 0.8, now),
		createEntry(`${base}/contact`, 'monthly', 0.7, now),
		createEntry(`${base}/privacy`, 'yearly', 0.3, now)
	]

	const posts = await getPostMetadata()

	const postEntries: MetadataRoute.Sitemap = posts.map(post =>
		createEntry(`${base}/blog/${post.slug}`, 'monthly', 0.75, new Date(post.date))
	)

	return [...staticEntries, ...postEntries]
}

export default sitemap
