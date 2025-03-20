type Work = {
	name: string
	description: string
	date: string
	category: 'Client' | 'Internal'
}

const works = [
	{
		name: 'Archetype',
		description: 'Component system',
		date: '2023',
		category: 'Client'
	},
	{
		name: 'Linear Sync',
		description: 'Sync your GitHub issues to Linear',
		date: '2023',
		category: 'Client'
	},
	{
		name: 'Sweater Planet',
		description: 'eCommerce platform',
		date: '2022',
		category: 'Internal'
	},
	{
		name: 'Trigger.dev',
		description: 'Generate changelogs from git commits',
		date: '2024',
		category: 'Client'
	},
	{
		name: 'Dashboard',
		description: 'All your personal apps, intelligent',
		date: '2024',
		category: 'Internal'
	},
	{
		name: 'Create Rubric App',
		description: 'Spin up an AI-native React app',
		date: '2024',
		category: 'Internal'
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
		name: 'Albertsons',
		description: 'WIP',
		date: '2025',
		category: 'Client'
	},
	{
		name: 'Neat',
		description: 'Your GitHub feed, smartly filtered',
		date: '2022',
		category: 'Internal'
	}
] satisfies Work[]

export const WorkTable = () => {
	return (
		<table className="w-full divide-y divide-subtle text-secondary">
			<thead className="font-semibold">
				<tr>
					<th className="py-3 text-left">Name</th>
					<th className="py-3 text-left">Description</th>
					<th className="py-3 text-left">Type</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-subtle">
				{works
					.sort((a, b) => b.date.localeCompare(a.date))
					.map((work, index) => (
						<tr key={index}>
							<td className="py-3">{work.name}</td>
							<td className="py-3">{work.description}</td>
							<td className="py-3">{work.category}</td>
						</tr>
					))}
			</tbody>
		</table>
	)
}
