import {Metadata} from 'next'

export const META = {
	description:
		'A lean team of developers & designers building AI-enabled software end-to-end.',
	githubURL: 'https://github.com/RubricLab',
	twitterURL: 'https://x.com/RubricLabs',
	linkedinURL: 'https://linkedin.com/company/RubricLabs',
	siteURL: 'https://rubriclabs.com',
	title: 'Rubric Labs',
	twitter: '@RubricLabs'
}

export const DEFAULT_META: Metadata = {
	title: META.title,
	description: META.description,
	openGraph: {
		title: META.title,
		description: META.description,
		siteName: META.title,
		url: META.siteURL,
		type: 'website'
	},
	twitter: {
		card: 'summary_large_image',
		creator: META.twitter,
		description: META.description,
		title: META.title,
		site: META.twitter
	}
}
