import fs from 'node:fs'

export type Newsletter = {
	description: string
	publishedAt: string
	slug: string
	subscriberCount: number
	title: string
}

const FILEPATH = 'src/lib/newsletters/index.jsonl'

const getFile = () =>
	fs
		.readFileSync(FILEPATH, 'utf8')
		.split('\n')
		.filter(line => line.trim() !== '')

// Helper function to get all newsletter slugs
export async function getNewsletterSlugs(): Promise<string[]> {
	const newsletters = getFile().map(line => JSON.parse(line))

	return newsletters.map((newsletter: { slug: string }) => newsletter.slug)
}

export async function getNewsletterMetadata(): Promise<Newsletter[]> {
	const file = getFile()

	const metadata = file.map(line => JSON.parse(line))

	const newsletters = metadata.sort(
		(a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
	)

	return newsletters
}

export async function getNewsletter(slug: string): Promise<Newsletter> {
	const file = getFile()

	const newsletter = file.find(line => JSON.parse(line).slug === slug)

	if (!newsletter) {
		throw new Error(`Newsletter with slug ${slug} not found`)
	}

	return JSON.parse(newsletter)
}
