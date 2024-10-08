import type { Metadata } from 'next'
import { DEFAULT_META, META } from '~/constants/metadata'

/**
 * Get metadata for a page. Optionally override title, description, path, and preview image URL.
 */

const refresh = '01'

export default function getMetadata({
	title,
	description,
	previewImageRoute,
	path
}: {
	title?: string
	description?: string
	previewImageRoute?: string
	path?: string
}): Metadata {
	const combinedTitle = `${title ? `${title} | ` : ''}${META.title}`

	return {
		...DEFAULT_META,
		description: description || DEFAULT_META.description,
		openGraph: {
			...DEFAULT_META.openGraph,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			description: description || (DEFAULT_META.description as any),
			title: combinedTitle,

			images: [
				{
					url: `/${previewImageRoute ?? 'opengraph-image'}`
				}
			]
		},
		title: combinedTitle,
		twitter: {
			...DEFAULT_META.twitter,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			description: description || (DEFAULT_META.description as any),
			title: combinedTitle,
			images: [
				{
					url: `/${previewImageRoute ?? 'opengraph-image'}?refresh=${refresh || 0}`
				}
			]
		},
		alternates: {
			canonical: `/${path}`
		}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} as any
}
