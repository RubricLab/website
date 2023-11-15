import {Metadata} from 'next'
import {DEFAULT_META, META} from '../constants/metadata'

/**
 * Get metadata for a page. Optionally override title, description, and preview image URL.
 */
export default function getMetadata({
	title,
	description,
	previewImageUrl
}: {
	title?: string
	description?: string
	previewImageUrl?: string
}): Metadata {
	const combinedTitle = `${title ? `${title} | ` : ''}${META.title}`
	return {
		description: description || DEFAULT_META.description,
		openGraph: {
			...DEFAULT_META.openGraph,
			description: description || DEFAULT_META.description,
			title: combinedTitle,
			...(previewImageUrl
				? {
						images: [
							{
								url: previewImageUrl
							}
						]
				  }
				: {})
		},
		title: combinedTitle,
		twitter: {
			...DEFAULT_META.twitter,
			title: combinedTitle
		},
		...DEFAULT_META
	}
}
