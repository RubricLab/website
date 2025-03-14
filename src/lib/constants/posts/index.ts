import path from 'node:path'
import { glob } from 'glob'

export type Post = {
	title: string
	date: string
	author: string
	category: string
	slug: string
}

// Helper function to get all post slugs
export async function getPostSlugs(): Promise<string[]> {
	const files = await glob('src/lib/constants/posts/*.mdx')
	return files.map((file: string) => path.basename(file, '.mdx'))
}
