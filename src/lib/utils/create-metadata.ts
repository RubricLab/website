import type { Metadata } from 'next'
import { META } from '~/lib/constants/metadata'

const createMetadata = (overrides: Metadata = {}, pathname = '/'): Metadata => {
	const { alternates, openGraph, twitter, ...rest } = overrides
	const canonical = alternates?.canonical ?? pathname
	const canonicalUrl =
		typeof canonical === 'string' || canonical instanceof URL
			? canonical
			: 'url' in canonical
				? canonical.url
				: pathname

	return {
		...META,
		...rest,
		alternates: {
			...(META.alternates ?? {}),
			...(alternates ?? {}),
			canonical
		},
		openGraph: {
			...(META.openGraph ?? {}),
			...(openGraph ?? {}),
			siteName: openGraph?.siteName ?? META.openGraph.siteName,
			url: openGraph?.url ?? canonicalUrl
		},
		twitter: {
			...(META.twitter ?? {}),
			...(twitter ?? {})
		}
	}
}

export { createMetadata }
