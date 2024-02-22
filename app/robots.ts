import {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			allow: '/',
			disallow: [
				'/_next/static/media/',
				'*/opengraph-image',
				'*/icon',
				'*/apple-icon'
			],
			userAgent: '*'
		},
		sitemap: 'https://rubriclabs.com/sitemap.xml'
	}
}
