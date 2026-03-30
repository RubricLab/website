type Author = {
	name: string
	url: string
}

type CoPost = {
	partner: string
	url: string
}

const AUTHORS = {
	ARIHAN_VARANASI: {
		name: 'Arihan Varanasi',
		url: 'https://x.com/arihanxv'
	},
	DEXTER_STOREY: {
		name: 'Dexter Storey',
		url: 'https://x.com/dexterstorey'
	},
	RUBRIC: {
		name: 'Rubric',
		url: 'https://rubriclabs.com'
	},
	SARIM_MALIK: {
		name: 'Sarim Malik',
		url: 'https://x.com/sarimrmalik'
	},
	TED_SPARE: {
		name: 'Ted Spare',
		url: 'https://x.com/tedspare'
	}
} as const

const CATEGORIES = {
	ANNOUNCEMENT: 'Announcement',
	BREAKDOWN: 'Breakdown',
	CASE_STUDY: 'Case study',
	ESSAY: 'Essay',
	EXPERIMENT: 'Experiment'
} as const

type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES]

export { AUTHORS, CATEGORIES }
export type { Author, Category, CoPost }
