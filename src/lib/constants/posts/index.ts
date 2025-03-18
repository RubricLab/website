import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { env } from '~/lib/env'

export type Post = {
	title: string
	date: string
	author: string
	category: string
	slug: string
	bannerImageUrl: string
}

// Helper function to get all post slugs
export async function getPostSlugs(): Promise<string[]> {
	const files = await readdir('src/lib/constants/posts')
	return files
		.filter(file => file.endsWith('.mdx'))
		.map((file: string) => path.basename(file, '.mdx'))
}

export async function getPostMetadata(): Promise<Post[]> {
	const slugs = await getPostSlugs()

	const posts = await Promise.all(
		slugs.map(async slug => {
			const { metadata } = await import(`~/lib/constants/posts/${slug}.mdx`)
			return {
				slug,
				...metadata,
				bannerImageUrl: metadata.bannerImageUrl.startsWith('https://')
					? metadata.bannerImageUrl
					: `https://${env.VERCEL_URL}${metadata.bannerImageUrl}`
			} as Post
		})
	)

	return posts
}
