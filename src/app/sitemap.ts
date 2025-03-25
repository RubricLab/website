import type { MetadataRoute } from 'next'

/**
 * For automatic indexing of new pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = 'https://rubriclabs.com'

	const corePages = ['blog', 'contact']

	/**
	 * In order of priority
	 */
	const pages = [
		{
			url: `${base}`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const
		},
		// Core pages
		...corePages.map(page => ({
			url: `${base}/${page}`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const
		}))
	]

	const withPriority = pages.map((page, i) => ({
		...page,
		priority: Math.max(1 - i / 10, 0.1) // minimum 0.1
	}))

	return withPriority
}
