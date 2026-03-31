export type OpenSourceProject = {
	name: string
	description: string
	metric: string
	href: string
}

export const openSourceProjects: OpenSourceProject[] = [
	{
		description: 'Codebase copilot',
		href: 'https://github.com/rubriclabs/maige',
		metric: '4,000+ projects',
		name: 'Maige'
	},
	{
		description: 'Linear↔GitHub sync',
		href: 'https://github.com/rubriclabs/synclinear',
		metric: '1,000+ projects',
		name: 'SyncLinear'
	},
	{
		description: 'GitHub feed filtering',
		href: 'https://github.com/rubriclabs/neat',
		metric: '2,000+ developers',
		name: 'Neat'
	}
]

export type Tool = {
	name: string
	description: string
	href: string
}

export const tools: Tool[] = [
	{
		description: 'Generative UI from Zod schemas',
		href: 'https://github.com/rubriclabs/genson',
		name: 'Genson'
	},
	{
		description: 'Fine-tuning pipeline',
		href: 'https://github.com/rubriclabs/autotune',
		name: 'Autotune'
	},
	{
		description: 'Component system',
		href: 'https://github.com/rubriclabs/ui',
		name: 'Rubric UI'
	}
]
