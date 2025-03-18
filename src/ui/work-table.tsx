type Work = {
	name: string
	tag: string
	date: string
}

const works = [
	{
		name: 'Archetype',
		tag: 'Client work',
		date: '2023'
	},
	{
		name: 'Linear Sync',
		tag: 'Client work',
		date: '2023'
	},
	{
		name: 'Sweater Planet',
		tag: 'Client work',
		date: '2022'
	},
	{
		name: 'AutoChangelog',
		tag: 'Client work',
		date: '2024'
	},
	{
		name: 'Dashboard',
		tag: 'Client work',
		date: '2024'
	},
	{
		name: 'Maige',
		tag: 'Client work',
		date: '2024'
	},
	{
		name: 'Create Rubric App',
		tag: 'Client work',
		date: '2024'
	},
	{
		name: 'Rainmaker',
		tag: 'Client work',
		date: '2024'
	},
	{
		name: 'Year in Code',
		tag: 'Client work',
		date: '2023'
	},
	{
		name: 'Stealth',
		tag: 'Client work',
		date: '2024'
	},
	{
		name: 'Albertsons',
		tag: 'Client work',
		date: '2025'
	}
] satisfies Work[]

export const WorkTable = () => {
	return (
		<table className="w-full divide-y divide-black/10 dark:divide-white/10">
			<thead className="font-semibold">
				<tr>
					<th className="py-3 text-left">Name</th>
					<th className="py-3 text-left">Tag</th>
					<th className="py-3 text-left">Date</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-black/10 dark:divide-white/10">
				{works
					.sort((a, b) => b.date.localeCompare(a.date))
					.map((work, index) => (
						<tr key={index}>
							<td className="py-3">{work.name}</td>
							<td className="py-3">{work.tag}</td>
							<td className="py-3">{work.date}</td>
						</tr>
					))}
			</tbody>
		</table>
	)
}
