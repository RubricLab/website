type Slugger = {
	slug: (value: string) => string
}

// Slug headings like "Hello World!" -> "hello-world", and de-dupe: ["intro","intro"] -> ["intro","intro-1"]
// Example: createSlugger().slug("Intro") => "intro"; then again => "intro-1"
const createSlugger = (): Slugger => {
	const seen = new Map<string, number>()

	const slugify = (input: string) =>
		input
			.toLowerCase()
			.normalize('NFKD')
			.replaceAll(/[\u0300-\u036f]/g, '')
			.replaceAll(/[^a-z0-9\s-]/g, '')
			.trim()
			.replaceAll(/\s+/g, '-')
			.replaceAll(/-+/g, '-')

	return {
		slug: (value: string) => {
			const base = slugify(value)
			if (!base) return ''

			const count = seen.get(base) ?? 0
			seen.set(base, count + 1)
			return count === 0 ? base : `${base}-${count}`
		}
	}
}

export { createSlugger }
