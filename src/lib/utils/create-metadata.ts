import type { Metadata } from 'next'
import { META } from '~/lib/constants/metadata'

const createMetadata = (overrides: Metadata = {}): Metadata => {
	const { openGraph, twitter, ...rest } = overrides
	return {
		...META,
		...rest,
		openGraph: {
			...(META.openGraph ?? {}),
			...(openGraph ?? {})
		},
		twitter: {
			...(META.twitter ?? {}),
			...(twitter ?? {})
		}
	}
}

export { createMetadata }
