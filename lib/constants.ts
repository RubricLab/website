import {Metadata} from 'next'

export const META = {
	desc:
		'We are a lean team of developers & designers that build software end-to-end.',
	githubURL: 'https://github.com/rubriclab',
	siteURL: 'https://rubriclab.com',
	title: 'Rubric',
	twitter: '@rubriclabs'
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
	themeColor: '#E1DCDB',
	title: META.title,
	twitter: {
		card: 'summary_large_image',
		creator: META.twitter,
		description: META.desc,
		title: META.title
	}
}

export const FONTS = {
	neueBit: 'https://rubriclab.com/fonts/PPNeueBit-Bold.otf'
}
