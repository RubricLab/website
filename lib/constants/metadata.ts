import {Metadata} from 'next'

export const META = {
	desc:
		'A lean team of developers & designers building AI-enabled software end-to-end.',
	githubURL: 'https://github.com/rubriclab',
	siteURL: 'https://rubriclabs.com',
	title: 'Rubric',
	twitter: '@RubricLabs'
}

export const DEFAULT_META: Metadata = {
	description: META.desc,
	openGraph: {
		description: META.desc,
		siteName: META.title,
		title: META.title,
		type: 'website',
		url: META.siteURL
	},
	title: META.title,
	twitter: {
		card: 'summary_large_image',
		creator: META.twitter,
		description: META.desc,
		title: META.title
	}
}
