// Author of a blog post
const author = {
	fields: [
		{
			name: 'firstName',
			title: 'First Name',
			type: 'string'
		},
		{
			name: 'lastName',
			title: 'Last Name',
			type: 'string'
		},
		{
			name: 'slug',
			options: {
				source: 'name'
			},
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
			options: {
				hotspot: true
			},
			title: 'Image',
			type: 'image'
		},
		{
			name: 'title',
			title: 'Title',
			type: 'string'
		},
		{
			name: 'bio',
			of: [
				{
					lists: [],
					styles: [{title: 'Normal', value: 'normal'}],
					title: 'Block',
					type: 'block'
				}
			],
			title: 'Bio',
			type: 'array'
		}
	],
	name: 'author',
	preview: {
		select: {
			media: 'image',
			title: 'name'
		}
	},
	title: 'Author',
	type: 'document'
}

export default author
