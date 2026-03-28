export const TIMEOUT = 1000

export const SITE = {
	description: 'AI systems research and production engineering.',
	email: 'hello@rubriclabs.com',
	github: 'https://github.com/rubriclabs',
	name: 'Rubric',
	title: 'Rubric — A lab that ships.',
	url: 'https://rubriclabs.com',
	x: 'https://x.com/rubriclabs'
} as const

export const NAV_LINKS = [
	{ href: '/work', label: 'Work' },
	{ href: '/lab', label: 'Lab' },
	{ href: '/contact', label: 'Contact' }
] as const

export const ANNOUNCEMENT = {
	href: '/lab/contract-engineering',
	text: 'New: Contract Engineering — how we spec agent systems'
} as const
