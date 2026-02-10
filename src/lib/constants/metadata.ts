import type { Metadata } from 'next'

type AppMetadata = Metadata & {
	title: string
	description: string
	openGraph: NonNullable<Metadata['openGraph']> & { title: string; description: string }
	twitter: NonNullable<Metadata['twitter']> & {
		title: string
		description: string
		creator: string
		card: 'summary_large_image'
	}
}

const META: AppMetadata = {
	description: 'Rubric is an applied AI lab helping companies build intelligent applications.',
	openGraph: {
		description: 'Rubric is an applied AI lab helping companies build intelligent applications.',
		images: [{ alt: 'Rubric Labs', url: '/opengraph-image' }],
		title: 'Rubric Labs'
	},
	title: 'Rubric Labs',
	twitter: {
		card: 'summary_large_image',
		creator: '@rubriclabs',
		description: 'Rubric is an applied AI lab helping companies build intelligent applications.',
		images: [{ alt: 'Rubric Labs', url: '/twitter-image' }],
		title: 'Rubric Labs'
	}
}

export { META }
