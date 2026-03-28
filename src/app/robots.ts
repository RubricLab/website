import type { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => ({
	rules: {
		allow: '/',
		disallow: ['/_next/static/media/', '*/opengraph-image', '*/icon'],
		userAgent: '*'
	},
	sitemap: 'https://rubriclabs.com/sitemap.xml'
})

export default robots
