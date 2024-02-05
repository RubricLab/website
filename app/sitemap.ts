import {MetadataRoute} from 'next'
import {getNewsletterPosts, getPosts} from '~/sanity/utils'

/**
 * For automatic indexing of new pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = 'https://rubriclabs.com'

	const newsletterPosts = await getNewsletterPosts()
	const blogPosts = await getPosts()

	/**
	 * In order of priority
	 */
	const pages = [
		{
			url: `${base}`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as 'monthly'
		},
		{
			url: `${base}/blog`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as 'weekly'
		},
		{
			url: `${base}/newsletter`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as 'weekly'
		},
		{
			url: `${base}/projects`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as 'weekly'
		},
		{
			url: `${base}/partners`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as 'monthly'
		},
		{
			url: `${base}/contact`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as 'monthly'
		},
		// Blog posts
		...blogPosts.map(post => ({
			url: `${base}/blog/${post.slug}`,
			lastModified: new Date(post.publishedAt),
			changeFrequency: 'weekly' as 'weekly'
		})),
		// Newsletter posts
		...newsletterPosts.map(post => ({
			url: `${base}/newsletter/${post.slug}`,
			lastModified: new Date(post.publishedAt),
			changeFrequency: 'weekly' as 'weekly'
		}))
	]

	const withPriority = pages.map((page, i) => ({
		...page,
		priority: Math.max(1 - i / 10, 0.1) // minimum 0.1
	}))

	return withPriority
}
