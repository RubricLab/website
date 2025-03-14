import path from 'node:path'
import { readdir } from 'node:fs/promises'

export type Post = {
	title: string
	date: string
	author: string
	category: string
	slug: string
}

// Helper function to get all post slugs
export async function getPostSlugs(): Promise<string[]> {
	const files = await readdir('src/lib/constants/posts')
	return files
		.filter(file => file.endsWith('.mdx'))
		.map((file: string) => path.basename(file, '.mdx'))
}
