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
			changeFrequency: 'monthly' as const,
			lastModified: new Date(),
			url: `${base}`
		},
		// Core pages
		...corePages.map(page => ({
			changeFrequency: 'weekly' as const,
			lastModified: new Date(),
			url: `${base}/${page}`
		}))
	]

	const withPriority = pages.map((page, i) => ({
		...page,
		priority: Math.max(1 - i / 10, 0.1) // minimum 0.1
	}))

	return withPriority
}
