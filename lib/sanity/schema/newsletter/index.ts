// Newsletter entry
const newsletter = {
	fields: [
		{
			name: 'title',
			title: 'Title',
			type: 'string'
		},
		{
			name: 'description',
			title: 'Description',
			type: 'string'
		},
		{
			name: 'slug',
			options: {
				maxLength: 96,
				source: 'title'
			},
			title: 'Slug',
			type: 'slug'
		},
		{
			name: 'author',
			title: 'Author',
			to: { type: 'author' },
			type: 'reference'
		},
		{
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime'
		},
		{ name: 'subscriberCount', title: 'Subscriber count', type: 'number' },
		{
			name: 'body',
			of: [{ type: 'block' }, { type: 'image' }],
			title: 'Body',
			type: 'array'
		}
	],
	name: 'newsletter',
	preview: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		prepare(selection: any) {
			const { author } = selection
			return { ...selection, subtitle: author && `by ${author}` }
		},
		select: {
			author: 'author.firstName',
			publishedAt: 'publishedAt',
			title: 'title'
		}
	},
	title: 'Newsletter',
	type: 'document'
}

export default newsletter
