// Schema for Home page
const homePage = {
	fields: [
		{
			fields: [
				{
					name: 'title',
					title: 'Title',
					type: 'string'
				},
				{
					name: 'subtitle',
					title: 'Sub title',
					type: 'string'
				}
			],
			name: 'hero',
			title: 'Hero',
			type: 'document'
		},
		{
			name: 'team',
			of: [{ type: 'author' }],
			title: 'Team',
			type: 'array'
		},
		{
			name: 'desc',
			of: [{ type: 'block' }],
			title: 'Description',
			type: 'array'
		}
	],
	name: 'home',
	title: 'Home Page',
	type: 'document'
}

export default homePage
