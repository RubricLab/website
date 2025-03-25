type Work = {
	name: string
	description: string
	date: string
	category: 'Client' | 'Internal'
	link?: string
}

const works = [
	{
		name: 'Archetype',
		description: 'We built a component system for Archetype.',
		date: '2023',
		category: 'Client',
		link: 'https://archetype.dev'
	},
	{
		name: 'Cal.com',
		description:
			'We built a self-hostable app to sync GitHub issues to Linear. It serves 1k+ repos at no cost.',
		date: '2023',
		category: 'Client',
		link: 'https://synclinear.com'
	},
	{
		name: 'Sweater Planet',
		description: 'We built a scalable eCommerce platform. Acquired.',
		date: '2022',
		category: 'Internal',
		link: 'https://sweaterplanet.com'
	},
	{
		name: 'Trigger.dev',
		description: "We built several open-source demos to showcase Trigger.dev's AI capabilities.",
		date: '2023',
		category: 'Client',
		link: 'https://autochangelog.dev'
	},
	{
		name: 'Create Rubric App',
		description: 'Our CLI to spin up an AI-native React app.',
		date: '2024',
		category: 'Internal',
		link: 'https://todo.rubric.sh/'
	},
	{
		name: 'Greptile',
		description: 'We built a landing page and demo for Greptile.',
		date: '2024',
		category: 'Client',
		link: 'https://greptile.com'
	},
	{
		name: 'Series B stealth',
		description: 'We built a flagship AI-native product for this team.',
		date: '2024',
		category: 'Client'
	},
	{
		name: 'Cal.com',
		description:
			'We built the first version of Cal.ai. Now defunct, it was one of the first agents to go to market.',
		date: '2024',
		category: 'Client',
		link: 'https://cal.com/blog/don-t-forget-about-cal-ai-your-24-7-scheduling-assistant'
	},
	{
		name: 'Albertsons',
		description: 'Work in progress.',
		date: '2025',
		category: 'Client'
	},
	{
		name: 'Maige',
		description:
			'A profitable, open-source software for running LLM commands on your repo. Used by 4k+ teams.',
		date: '2023',
		category: 'Client'
	},
	{
		name: 'Neat',
		description: 'Your GitHub feed, smartly filtered. Used by 2k+ developers.',
		date: '2022',
		category: 'Internal',
		link: 'https://neat.run'
	}
] satisfies Work[]

export const WorkTable = () => {
	return (
		<div className="w-full max-w-2xl">
			<div className="flex flex-col gap-16">
				{works
					.sort((a, b) => b.date.localeCompare(a.date))
					.map((work, index) => (
						<div key={index} className="group flex w-full items-start justify-between">
							<div className="w-full">
								<h3>{work.name}</h3>
								{work.description ? (
									<div className="max-w-2/3 text-secondary">{work.description}</div>
								) : null}
							</div>
							<div>{work.date}</div>
						</div>
					))}
			</div>
		</div>
	)
}
