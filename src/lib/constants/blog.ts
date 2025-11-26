export type Author = {
	name: string
	url: string
}

export const AUTHORS = {
	ARIHAN_VARANASI: {
		name: 'Arihan Varanasi',
		url: 'https://x.com/arihanxv'
	},
	DEXTER_STOREY: {
		name: 'Dexter Storey',
		url: 'https://x.com/dexterstorey'
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

export const CATEGORIES = {
	AI: 'AI',
	CASE_STUDY: 'Case study',
	DEVOPS: 'DevOps',
	LAUNCH: 'Launch',
	TEAM: 'Team'
} as const
