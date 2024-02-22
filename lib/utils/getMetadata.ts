import {Metadata} from 'next'
import {DEFAULT_META, META} from '~/constants/metadata'
import env from '~/env.mjs'

/**
 * Get metadata for a page. Optionally override title, description, path, and preview image URL.
 */

const project = 'website' // The name of the Vercel project.

const [generatedUrl] = env.VERCEL_URL.split('.vercel.app') // The deployment URL is in the format https://project-hash-scope.vercel.app.
const [hash] = generatedUrl.replace(`${project}-`, '').split('-')
const refresh = hash.slice(0, 2)

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
			description: description || DEFAULT_META.description,
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
			description: description || DEFAULT_META.description,
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
	}
}
