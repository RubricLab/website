import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { createSlugger } from '~/lib/utils/slugger'

const caseStudySchema = z.object({
	category: z.string(),
	client: z.string(),
	coPost: z
		.object({
			label: z.string(),
			url: z.string()
		})
		.optional(),
	context: z.string(),
	description: z.string(),
	industry: z.string(),
	quote: z
		.object({
			attribution: z.string(),
			text: z.string()
		})
		.optional(),
	scope: z.string(),
	slug: z.string(),
	subtitle: z.string(),
	tags: z.array(z.string()),
	tier: z.enum(['flagship', 'strong', 'solid', 'open-source']),
	title: z.string()
})

type CaseStudy = z.infer<typeof caseStudySchema>

export type TocItem = {
	id: string
	title: string
	level: number
}

export const caseStudies: CaseStudy[] = [
	{
		category: 'agentic systems',
		client: 'Albertsons / Safeway',
		context: 'Fortune 500 · Production',
		description:
			'Agentic search and bespoke memory architecture for Albertsons/Safeway\u2019s 250k+ SKU grocery inventory. The agent remembers what it\u2019s already found, refines its own queries, and builds context across sessions.',
		industry: 'Grocery retail',
		scope: 'End-to-end AI system — agentic search, memory architecture, inventory reasoning across 250k+ SKUs',
		slug: 'safeway-ai',
		subtitle: 'Agentic search and memory architecture for grocery at scale',
		tags: ['Memory', 'Agents', 'Context Engineering', 'Evaluation', 'Personalization'],
		tier: 'flagship',
		title: 'Safeway AI'
	},
	{
		category: 'production agents',
		client: 'Cal.com',
		coPost: {
			label: 'LangChain',
			url: 'https://blog.langchain.com/how-to-design-an-agent-for-production/'
		},
		context: 'Open Source Scheduling',
		description:
			'One of the first AI agents to ship in production. An email-first scheduling assistant with structured tool use via LangChain, real calendar state, and zero UI.',
		industry: 'Scheduling infrastructure',
		scope: 'Email-first AI scheduling assistant — structured tool use, agent loop, production deployment',
		slug: 'cal-ai',
		subtitle: 'One of the first AI agents to ship in production',
		tags: ['AI Agent', 'Structured Tools', 'Email-first', 'LangChain'],
		tier: 'strong',
		title: 'Cal.ai'
	},
	{
		category: 'generative video',
		client: 'Graphite',
		coPost: {
			label: 'LangChain',
			url: 'https://blog.langchain.com/rubric-labs-graphite-personalized-video-at-scale/'
		},
		context: 'Acquired by Cursor',
		description:
			'AI-directed personalized video for thousands of developers. LLM-generated scripts, function-calling for scene selection, Three.js rendering, and parallelized cloud encoding via AWS Lambda.',
		industry: 'Developer tools',
		scope: 'LLM-generated personalized video — AI scene direction, structured output, parallelized cloud rendering',
		slug: 'year-in-code',
		subtitle: 'AI-directed personalized video at scale',
		tags: ['Generative Video', 'Structured Output', '3D Rendering', 'AWS Lambda'],
		tier: 'flagship',
		title: 'Year in Code'
	},
	{
		category: 'forward deployed',
		client: 'Gumloop',
		context: 'YC-backed · $23M+ raised',
		description:
			'Flew to San Francisco to work embedded with Gumloop\u2019s team for a week, then sprinted for a month. Built a creator marketplace that turned their internal template catalog into a public growth engine.',
		industry: 'AI automation',
		quote: {
			attribution: 'Max Brodeur-Urbas, CEO of Gumloop',
			text: 'Rubric gave us the tactical engineering firepower we needed as we rapidly scaled. Professional executors who came in, crushed the task and handed it off gracefully.'
		},
		scope: 'Full-stack marketplace build — creator publishing, SEO architecture, scalable template infrastructure. One month, forward deployed.',
		slug: 'gumloop-marketplace',
		subtitle: 'Forward-deployed engineering for a creator marketplace',
		tags: ['Marketplace', 'SEO', 'Platform Architecture', 'Forward Deployed'],
		tier: 'strong',
		title: 'Gumloop'
	}
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
	return caseStudies.find(study => study.slug === slug)
}

export function getFeaturedCaseStudies(): CaseStudy[] {
	return caseStudies.filter(study => study.tier === 'flagship')
}

export async function getCaseStudyContent(
	slug: string
): Promise<{ Content: React.ComponentType; toc: TocItem[] } | undefined> {
	try {
		const { default: Content } = await import(`~/lib/case-studies/${slug}.mdx`)
		const toc = await getCaseStudyToc(slug)
		return { Content, toc }
	} catch {
		return undefined
	}
}

async function getCaseStudyToc(slug: string): Promise<TocItem[]> {
	const mdxPath = path.join(process.cwd(), 'src/lib/case-studies', `${slug}.mdx`)
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

export type { CaseStudy }
