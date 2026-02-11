import type { MetadataRoute } from 'next'
import { getBaseUrl } from '~/lib/utils'

const robots = (): MetadataRoute.Robots => ({
	rules: {
		allow: '/',
		disallow: ['/_next/static/media/', '*/opengraph-image', '*/icon', '*/apple-icon'],
		userAgent: '*'
	},
	sitemap: `${getBaseUrl()}/sitemap.xml`
})

export default robots
