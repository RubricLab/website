import {PortableTextBlock} from 'sanity'

// Project
export type Project = {
	_id: string
	_createdAt: Date
	name: string
	slug: string
	image: string
	url: string
	content: PortableTextBlock[]
}

// Home page
export type Home = {
	_id: string
	_createdAt: Date
	hero: {title: string; subtitle: string; _type: string}
	desc: PortableTextBlock[]
	team: Author[]
}

// Author
export type Author = {
	_key: string
	name: string
	title: string
	slug: string
	image: string
}

export type Post = {
	_id: string
	_createdAt: Date
	title: string
	description: string
	slug: string
	mainImage: string
	body: PortableTextBlock[]
	publishedAt: Date
	authorName: string
	authorTwitter: string
}

export type CaseStudy = {
	_id: string
	_createdAt: Date
	title: string
	slug: string
	imageUrl: string
	summary: string
	body: PortableTextBlock[]
	publishedAt: Date
}

export type Newsletter = {
	_id: string
	_createdAt: Date
	title: string
	slug: string
	body: PortableTextBlock[]
	publishedAt: Date
	authorName: string
	authorTwitter: string
}
