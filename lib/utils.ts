import clsx, {type ClassValue} from 'clsx'
import LoopsClient from 'loops'
import {Metadata} from 'next'
import toast from 'react-hot-toast'
import {twMerge} from 'tailwind-merge'
import {DEFAULT_META, META} from './constants'

// Parse string to Date object and return "Month DD, YYYY" format
export function parseDate(input: Date | string) {
	const date = new Date(input)
	const formattedDate = date.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})
	return formattedDate
}

/**
 * Get metadata for a page. Optionally override title, description, and preview image URL.
 */
export const getMetadata = ({
	title,
	description,
	previewImageUrl
}: {
	title?: string
	description?: string
	previewImageUrl?: string
}): Metadata => {
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

// Allows merging of Tailwind class
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Copy to clipboard
export function copyToClipboard(input: string) {
	navigator.clipboard.writeText(input)
	toast.success('Email copied')
}

// Loops emailing client
export const loopsClient = new LoopsClient(process.env.LOOPS_API_KEY)
