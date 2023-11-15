// Schema for Projects object
const project = {
	fields: [
		{
			name: 'name',
			title: 'Name',
			type: 'string'
		},
		{
			name: 'slug',
			options: {source: 'name'},
			title: 'Slug',
			type: 'slug'
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
			name: 'content',
			of: [{type: 'block'}],
			title: 'Content',
			type: 'array'
		}
	],
	name: 'project',
	title: 'Project',
	type: 'document'
}

export default project
