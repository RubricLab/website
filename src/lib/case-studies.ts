import { z } from 'zod'

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
	outcome: z.string(),
	problem: z.string(),
	quote: z
		.object({
			attribution: z.string(),
			text: z.string()
		})
		.optional(),
	slug: z.string(),
	system: z.string(),
	tags: z.array(z.string()),
	tier: z.enum(['flagship', 'strong', 'solid', 'open-source']),
	title: z.string()
})

type CaseStudy = z.infer<typeof caseStudySchema>

export const caseStudies: CaseStudy[] = [
	{
		category: 'agentic systems',
		client: 'Albertsons',
		context: 'Fortune 500 · Production',
		description:
			'Agentic search and bespoke memory architecture for Albertsons/Safeway\u2019s 250k+ SKU grocery inventory. The agent remembers what it\u2019s already found, refines its own queries, and builds context across sessions. A full system \u2014 retrieval, memory, evaluation \u2014 designed for a Fortune 500 operation.',
		outcome:
			'Shipped to production. Serving real users through the Safeway ecosystem. A grocery shopping agent that remembers who you are and gets better every time you use it.',
		problem: `Grocery shopping is personal. Every household has different dietary restrictions, budget constraints, brand preferences, and weekly rhythms. Static recommendation systems can surface popular products, but they can't plan a Tuesday dinner for a family where one kid is gluten-free and the other won't eat vegetables.

Albertsons needed an AI shopping agent that could hold a real model of each household — not a flat preference list, but a living map of who eats what, when, why, and how that changes. The agent needed to search a massive inventory catalog, manage carts, surface deals, and render everything through UI touchpoints that met Fortune 500 polish standards.

The hard part wasn't building an agent. It was building an agent that remembers.`,
		quote: {
			attribution: 'Albertsons',
			text:
				"Rubric understood immediately what we needed. They didn't ask for months of onboarding — they got context fast and shipped."
		},
		slug: 'safeway-ai',
		system: `At the core of Safeway AI is a bespoke memory system. Most conversational agents lose context between sessions. This one builds and maintains a structured representation of each household — dietary preferences, recurring purchases, flavor profiles, budget patterns, meal planning history. Every interaction refines the model. The agent doesn't start from zero.

The memory isn't a chat log. It's a semantic map. When a family adds a gluten-free label, the system doesn't just filter results — it restructures meal suggestions, adjusts recipe recommendations, and re-ranks the entire product catalog for that household. When behavior shifts (a new baby, a diet change, a seasonal pattern), the map adapts.

On top of this, the agent uses tool-based retrieval to search Albertsons' inventory catalog, manages shopping carts programmatically, surfaces relevant coupons and promotions, and renders products, recipes, and meal plans through generative UI components. Every interface is agent-driven — not a static template populated with data, but a dynamically composed view shaped by the household's context.

Edge cases are where this gets interesting. Multi-generational households with conflicting preferences. Budget adjustments mid-session. Allergies discovered while browsing. A shopper who always buys the same twelve items and wants the agent to just reorder. Each of these is a different interaction pattern, and the memory system handles them because it models the household, not the session.`,
		tags: ['Memory', 'Agents', 'Generative UI', 'Personalization', 'Context Engineering'],
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
			'One of the first AI agents to ship in production. An email-first scheduling assistant for Cal.com \u2014 six CRUD operations handled by an OpenAI functions agent, with structured tool use via LangChain, real calendar state, and zero UI. A proof that agents can run a critical user workflow unsupervised.',
		outcome:
			'Shipped as Cal.ai. An early proof point in what email-first AI agents could look like for productivity tools.',
		problem: `Cal.com is the open-source scheduling platform. They wanted to explore what scheduling looks like when the interface is a conversation, not a calendar. The concept: an AI agent you can email naturally — "find time for a 30-minute call with Sarah next week" — and it handles the rest. No links. No back-and-forth. Just an email, and it's done.`,
		slug: 'cal-ai',
		system: `Cal.ai is an email-first AI scheduling agent. It parses natural language scheduling requests from inbound email, resolves them against your Cal.com availability, handles timezone conversions and constraint satisfaction, and books the meeting — all without the user touching a calendar.

The agent manages ambiguity (when the user says "next week" but means "the week after"), multi-party scheduling (coordinating across multiple calendars), and preference inference (learning that "morning" means 9-11am for this user, not 6-8am).

Built as an early exploration in conversational agent design for Cal.com's platform.`,
		tags: ['AI Agent', 'Email-first', 'Natural Language', 'Scheduling'],
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
			'AI-directed personalized video for thousands of developers. LLM-generated scripts, function-calling for scene selection, Three.js rendering, and parallelized cloud encoding via AWS Lambda. Started as a marketing gift for Graphite \u2014 scaled from zero to crash to stable in weeks.',
		outcome: `Shipped as Graphite's flagship year-end campaign. Users shared their videos across social media, driving organic reach. Graphite was subsequently acquired by Cursor.`,
		problem: `Graphite wanted a year-end campaign that felt genuinely personal. Not a Spotify Wrapped clone with bar charts — something that captured what made each developer's year unique. The concept: an AI-generated video for every user, personalized to their GitHub contribution data. Every video different. Every video yours.

The constraints made it hard. The videos needed to be visually complex (3D rendered, not slideshows). They needed to be generated on demand (not pre-rendered for a known user set). And they needed to work at peak traffic on launch day — thousands of concurrent generation requests when the campaign went viral.`,
		slug: 'year-in-code',
		system: `The pipeline works in three stages: ingest, compose, render.

Ingest: Pull GitHub contribution data — commits, PRs, repos, languages, activity cadence, contribution patterns — and structure it into a developer profile. Not just stats. A narrative shape: what languages defined your year, when your biggest streaks were, which repos consumed you.

Compose: An AI pipeline takes the structured profile and generates a creative direction — writing a narrative arc, selecting visual motifs, timing transitions to match the developer's activity patterns. The AI doesn't fill templates. It writes, directs, and edits. Two developers who contributed the same amount to the same language still get different videos because the composition layer reads the shape of their year, not just the numbers.

Render: Each creative direction becomes a 3D graphic sequence, rendered per-user. The rendering engine runs on AWS with elastic auto-scaling — parallelized workloads across a fleet that grows and shrinks with demand. When traffic spiked on launch day, the system scaled horizontally without degradation. Every video renders at quality, regardless of load.

Mobile delivery required a separate pipeline for down-resolution, optimized for bandwidth without destroying the visual fidelity of the 3D sequences.`,
		tags: ['Generative Video', '3D Graphics', 'AWS', 'Elastic Scaling', 'AI Pipeline'],
		tier: 'flagship',
		title: 'Year in Code'
	},
	{
		category: 'forward deployed',
		client: 'Gumloop',
		context: 'YC-backed \u00b7 $23M+ raised',
		description:
			'Flew to San Francisco to work embedded with Gumloop\u2019s team for a week, then sprinted for a month. Built a creator marketplace that turned their internal template catalog into a public growth engine \u2014 publishing workflows, SEO-optimized pages, and scalable architecture for workflows, flows, and agents.',
		outcome: `Launched within one month. Transformed Gumloop's template directory into a public growth engine.`,
		problem: `Gumloop is an AI automation platform. Users build workflows — chains of AI-powered steps that automate business tasks. Internally, Gumloop had a directory of template workflows, but it was a flat list. No discovery. No community contribution. No growth engine.

They needed to turn the internal directory into a public marketplace where creators could publish workflows, users could discover them by use case, and every published workflow became an SEO surface for organic acquisition. And they needed it fast — within a month.`,
		quote: {
			attribution: 'Max Brodeur-Urbas, CEO',
			text:
				'Rubric brought tactical engineering firepower that let us move faster than we could have internally.'
		},
		slug: 'gumloop-marketplace',
		system: `The marketplace sits on top of Gumloop's existing platform. Each published workflow gets an auto-generated detail page with an AI-written description, usage instructions, and metadata. The generation isn't generic — it reads the workflow's actual step configuration and writes a description that explains what the workflow does, not what category it belongs to.

Every page is statically generated and SEO-optimized. Each workflow becomes a landing page for a specific use case. The marketplace doesn't just serve existing users — it acquires new ones through search.

The architecture needed to handle backward compatibility with existing workflows, a scalable publishing pipeline, and a creator experience that made publishing frictionless — one-click publish from the workflow editor.`,
		tags: ['Marketplace', 'AI Automation', 'SEO', 'Platform Architecture'],
		tier: 'strong',
		title: 'Gumloop Marketplace'
	}
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
	return caseStudies.find(study => study.slug === slug)
}

export function getFeaturedCaseStudies(): CaseStudy[] {
	return caseStudies.filter(study => study.tier === 'flagship')
}

export type { CaseStudy }
