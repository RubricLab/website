import type { Metadata } from 'next'

export const META = {
	desc: 'Rubric is an applied AI lab helping companies get intelligence to production.',
	title: 'Rubric Labs',
	twitter: '@rubriclabs'
}

export const DEFAULT_META: Metadata = {
	description: META.desc,
	openGraph: {
		description: META.desc,
		title: META.title
	},
	title: META.title,
	twitter: {
		card: 'summary_large_image',
		creator: META.twitter,
		description: META.desc,
		title: META.title
	}
}
