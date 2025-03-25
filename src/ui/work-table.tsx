import Link from 'next/link'
import { Arrow } from './icons/arrow'

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
		description: 'Component system',
		date: '2023',
		category: 'Client',
		link: 'https://archetype.dev'
	},
	{
		name: 'Linear Sync',
		description: 'Sync your GitHub issues to Linear',
		date: '2023',
		category: 'Client',
		link: 'https://synclinear.com'
	},
	{
		name: 'Sweater Planet',
		description: 'eCommerce platform',
		date: '2022',
		category: 'Internal',
		link: 'https://sweaterplanet.com'
	},
	{
		name: 'Trigger.dev',
		description: 'Generate changelogs from git commits',
		date: '2023',
		category: 'Client',
		link: 'https://autochangelog.dev'
	},
	{
		name: 'Dashboard',
		description: 'All your personal apps, intelligent',
		date: '2024',
		category: 'Internal',
		link: 'https://dashboard.rubric.sh'
	},
	{
		name: 'Create Rubric App',
		description: 'Spin up an AI-native React app',
		date: '2024',
		category: 'Internal',
		link: 'https://todo.rubric.sh/'
	},
	{
		name: 'Rainmaker',
		description: 'Landing page',
		date: '2024',
		category: 'Client'
	},
	{
		name: 'Stealth',
		description: 'AI-native experience',
		date: '2024',
		category: 'Client'
	},
	{
		name: 'Cal.com',
		description: 'Cal.ai v0',
		date: '2024',
		category: 'Client',
		link: 'https://cal.com/blog/don-t-forget-about-cal-ai-your-24-7-scheduling-assistant'
	},
	{
		name: 'Albertsons',
		description: 'WIP',
		date: '2025',
		category: 'Client'
	},
	{
		name: 'Neat',
		description: 'Your GitHub feed, smartly filtered',
		date: '2022',
		category: 'Internal',
		link: 'https://neat.run'
	}
] satisfies Work[]

export const WorkTable = () => {
	return (
		<table className="w-full divide-y divide-subtle text-secondary">
			<thead className="hidden font-semibold">
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Type</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-subtle">
				{works
					.sort((a, b) => b.date.localeCompare(a.date))
					.map((work, index) => (
						<tr key={index} className="group hover:bg-subtle hover:text-primary">
							<td className="p-3">{work.name}</td>
							<td className="p-3">{work.description}</td>
							<td className="p-3">{work.category}</td>
							<td>
								{work.link ? (
									<Link href={work.link} target="_blank" className="opacity-0 group-hover:opacity-100">
										<Arrow className="-rotate-45 size-5" />
									</Link>
								) : null}
							</td>
						</tr>
					))}
			</tbody>
		</table>
	)
}
