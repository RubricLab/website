// Newsletter entry
const newsletter = {
	fields: [
		{
			name: 'title',
			title: 'Title',
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
			to: {type: 'author'},
			type: 'reference'
		},
		{
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime'
		},
		{
			name: 'body',
			of: [{type: 'block'}, {type: 'image'}],
			title: 'Body',
			type: 'array'
		}
	],
	name: 'newsletter',
	preview: {
		prepare(selection) {
			const {author} = selection
			return {...selection, subtitle: author && `by ${author}`}
		},
		select: {
			author: 'author.name',
			publishedAt: 'publishedAt',
			title: 'title'
		}
	},
	title: 'Newsletter',
	type: 'document'
}

export default newsletter
