// Blog post
const post = {
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
			name: 'mainImage',
			options: {
				hotspot: true
			},
			title: 'Main image',
			type: 'image'
		},
		{
			name: 'categories',
			of: [{ to: { type: 'category' }, type: 'reference' }],
			title: 'Categories',
			type: 'array'
		},
		{
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime'
		},
		{
			name: 'body',
			of: [
				{ type: 'block' },
				{
					type: 'image',
					name: 'image',
					fields: [
						{
							name: 'alt',
							title: 'Alternative text',
							type: 'string',
							validation: (
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								r: any
							) => r.required()
						}
					]
				}
			],
			title: 'Body',
			type: 'array'
		}
	],
	name: 'post',
	preview: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		prepare(selection: any) {
			const { author } = selection
			return { ...selection, subtitle: author && `by ${author}` }
		},
		select: {
			author: 'author.firstName',
			media: 'mainImage',
			publishedAt: 'publishedAt',
			title: 'title'
		}
	},
	title: 'Post',
	type: 'document'
}

export default post
