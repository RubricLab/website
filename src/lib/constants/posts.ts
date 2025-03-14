export type Post = {
	title: string
	date: string
	author: string
	category: string
	slug: string
}

export const posts = [
	{
		title: 'Planning for near-free AI',
		category: 'Product',
		author: 'Ted Spare',
		date: 'January 7, 2024',
		slug: 'planning-for-free-ai'
	},
	{
		title: 'Fine-tuning GPT-4o-mini for Spam Detection',
		date: 'November 29, 2024',
		author: 'Ted Spare',
		category: 'AI',
		slug: 'fine-tuning-for-spam-detection'
	},
	{
		title: 'Building an MVP: How to reconcile Breadth vs Depth',
		date: 'January 23, 2024',
		author: 'Sarim Malik',
		category: 'Product',
		slug: 'breadth-vs-depth'
	},
	{
		title: 'Multi-Staging → Local to Prod in Record Time',
		date: 'February 16, 2024',
		author: 'Dexter Storey',
		category: 'DevOps',
		slug: 'multi-staging'
	},
	{
		title: 'My Summer at Rubric',
		date: 'September 8, 2024',
		author: 'Arihan Varanasi',
		category: 'Company',
		slug: 'summer-at-rubric'
	},
	{
		title: 'Launch: Create Rubric App',
		date: 'November 1, 2023',
		author: 'Sarim Malik',
		category: 'DevOps',
		slug: 'create-rubric-app'
	}
] as const satisfies Post[]
