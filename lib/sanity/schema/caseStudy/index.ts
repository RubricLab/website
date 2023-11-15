const caseStudy = {
	fields: [
		{
			name: 'title',
			title: 'Title',
			type: 'string'
		},
		{
			name: 'slug',
			options: {source: 'name'},
			title: 'Slug',
			type: 'slug'
		},
		{
			name: 'summary',
			title: 'Summary',
			type: 'string'
		},
		{
			fields: [
				{
					name: 'alt',
					title: 'Alt',
					type: 'string'
				}
			],
			name: 'image',
			options: {hotspot: true},
			title: 'Image',
			type: 'image'
		},
		{
			name: 'url',
			title: 'URL',
			type: 'url'
		},
		{
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime'
		},
		{
			name: 'body',
			of: [{type: 'block'}],
			title: 'Body',
			type: 'array'
		}
	],
	name: 'caseStudy',
	title: 'Case Study',
	type: 'document'
}

export default caseStudy
