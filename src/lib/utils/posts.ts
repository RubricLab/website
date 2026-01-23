import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Author } from '~/lib/constants/blog'
import { createSlugger } from '~/lib/utils/slugger'

export type Post = {
	title: string
	description: string
	subtitle?: string
	date: string
	author: Author
	category: string
	slug: string
	bannerImageUrl: string
}

export type TocItem = {
	id: string
	title: string
	level: number
}

// Helper function to get all post slugs
const getPostSlugs = async (): Promise<string[]> => {
	const files = await readdir(path.join(process.cwd(), 'src/lib/posts'))
	return files
		.filter(file => file.endsWith('.mdx'))
		.map((file: string) => path.basename(file, '.mdx'))
}

const getPostMetadata = async (): Promise<Post[]> => {
	const slugs = await getPostSlugs()

	const metadata = await Promise.all(
		slugs.map(async slug => {
			const { metadata } = await import(`~/lib/posts/${slug}.mdx`)
			return {
				slug,
				...metadata
			} as Post
		})
	)

	const posts = metadata.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	return posts
}

const getPost = async (
	slug: string
): Promise<{ Post: React.ComponentType; metadata: Post; toc: TocItem[] }> => {
	const { default: Post, metadata } = await import(`~/lib/posts/${slug}.mdx`)

	return {
		metadata,
		Post,
		toc: await getPostToc(slug)
	}
}

const getPostToc = async (slug: string): Promise<TocItem[]> => {
	const mdxPath = path.join(process.cwd(), 'src/lib/posts', `${slug}.mdx`)
	const content = await readFile(mdxPath, 'utf8')

	const slugger = createSlugger()
	const items: TocItem[] = []

	let inFence = false
	for (const line of content.split('\n')) {
		const trimmed = line.trim()

		if (trimmed.startsWith('```')) {
			inFence = !inFence
			continue
		}
		if (inFence) continue

		const match = /^(#{2,3})\s+(.+?)\s*$/.exec(trimmed)
		if (!match) continue

		const level = match[1]?.length
		const title = match[2]?.replaceAll(/\s+/g, ' ').trim()
		if (!level || !title) continue

		const id = slugger.slug(title)
		if (!id) continue

		items.push({ id, level, title })
	}

	return items
}

export { getPost, getPostMetadata, getPostSlugs, getPostToc }
