import type { MetadataRoute } from 'next'
import { caseStudies } from '~/lib/case-studies'
import { getPostMetadata } from '~/lib/posts'

const BASE = 'https://rubriclabs.com'

const entry = (
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
	const now = new Date()

	const staticEntries: MetadataRoute.Sitemap = [
		entry(BASE, 'weekly', 1, now),
		entry(`${BASE}/work`, 'monthly', 0.9, now),
		entry(`${BASE}/lab`, 'daily', 0.9, now),
		entry(`${BASE}/contact`, 'monthly', 0.7, now)
	]

	const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.map(study =>
		entry(`${BASE}/work/${study.slug}`, 'monthly', 0.8, now)
	)

	const posts = await getPostMetadata()
	const postEntries: MetadataRoute.Sitemap = posts.map(post =>
		entry(`${BASE}/lab/${post.slug}`, 'monthly', 0.75, new Date(post.date))
	)

	return [...staticEntries, ...caseStudyEntries, ...postEntries]
}

export default sitemap
