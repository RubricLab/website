import {Metadata} from 'next'
import {DEFAULT_META, META} from '~/constants/metadata'

/**
 * Get metadata for a page. Optionally override title, description, path, and preview image URL.
 */
export default function getMetadata({
	title,
	description,
	previewImageUrl,
	path
}: {
	title?: string
	description?: string
	previewImageUrl?: string
	path?: string
}): Metadata {
	const combinedTitle = `${title ? `${title} | ` : ''}${META.title}`

	return {
		...DEFAULT_META,
		description: description || DEFAULT_META.description,
		openGraph: {
			...DEFAULT_META.openGraph,
			description: description || DEFAULT_META.description,
			title: combinedTitle,

			images: [
				{
					url: previewImageUrl ?? `/opengraph-image`
				}
			]
		},
		title: combinedTitle,
		twitter: {
			...DEFAULT_META.twitter,
			description: description || DEFAULT_META.description,
			title: combinedTitle,
			images: previewImageUrl ?? `/opengraph-image`
		},
		alternates: {
			canonical: `${DEFAULT_META.openGraph.url}/${path}`
		}
	}
}
