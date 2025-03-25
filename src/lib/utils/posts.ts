import { readdir } from 'node:fs/promises'
import path from 'node:path'

export type Post = {
	title: string
	subtitle?: string
	date: string
	author: string
	category: string
	slug: string
	bannerImageUrl: string
}

// Helper function to get all post slugs
export async function getPostSlugs(): Promise<string[]> {
	const files = await readdir('src/lib/posts')
	return files
		.filter(file => file.endsWith('.mdx'))
		.map((file: string) => path.basename(file, '.mdx'))
}

export async function getPostMetadata(): Promise<Post[]> {
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

export async function getPost(
	slug: string
): Promise<{ Post: React.ComponentType; metadata: Post }> {
	const { default: Post, metadata } = await import(`~/lib/posts/${slug}.mdx`)

	return {
		Post,
		metadata
	}
}
