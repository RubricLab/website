import type { Metadata } from 'next'
import { META } from '~/lib/constants/metadata'

type CreateMetadataParams = {
	title: string
	description: string
	pathname?: string
}

const createMetadata = ({ title, description, pathname = '/' }: CreateMetadataParams): Metadata => {
	const canonical = pathname
	const useDefaultSocialImages = !pathname.startsWith('/blog/')

	return {
		...META,
		alternates: {
			...(META.alternates ?? {}),
			canonical
		},
		description,
		openGraph: {
			...(META.openGraph ?? {}),
			description,
			...(useDefaultSocialImages ? { images: [{ alt: title, url: '/opengraph-image' }] } : {}),
			siteName: META.openGraph.siteName,
			title,
			url: canonical
		},
		title,
		twitter: {
			...(META.twitter ?? {}),
			description,
			...(useDefaultSocialImages ? { images: [{ alt: title, url: '/twitter-image' }] } : {}),
			title
		}
	}
}

export { createMetadata }
