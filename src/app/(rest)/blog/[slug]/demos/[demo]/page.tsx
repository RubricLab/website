import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { META } from '~/lib/constants/metadata'
import { createMetadata } from '~/lib/utils/create-metadata'
import {
	DashboardDemoSection,
	LandingDemoSection,
	OnboardingDemoSection
} from '~/ui/blog/iterative-improvement/demos'

// Only the iterative-self-improvement post has live demo pages.
const DEMO_SLUG = 'iterative-self-improvement'

const DEMOS = {
	dashboard: { Section: DashboardDemoSection, title: 'The filterable dashboard' },
	landing: { Section: LandingDemoSection, title: 'The landing page' },
	onboarding: { Section: OnboardingDemoSection, title: 'The onboarding flow' }
} as const

type DemoKey = keyof typeof DEMOS

export const dynamicParams = false

export function generateStaticParams() {
	return Object.keys(DEMOS).map(demo => ({ demo, slug: DEMO_SLUG }))
}

type Props = { params: Promise<{ slug: string; demo: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { demo } = await params
	const entry = DEMOS[demo as DemoKey]
	return createMetadata({
		description: 'Live, interactive proof for "Give your agent a mirror".',
		pathname: `/blog/${DEMO_SLUG}/demos/${demo}`,
		title: `${entry ? entry.title : 'Demo'} | ${META.title}`
	})
}

export default async function Page({ params }: Props) {
	const { slug, demo } = await params
	const entry = DEMOS[demo as DemoKey]
	if (slug !== DEMO_SLUG || !entry) notFound()

	const { Section } = entry

	return (
		<div className="min-h-screen w-full px-4 py-16">
			<div className="mx-auto w-full max-w-6xl">
				<Section bare />
			</div>
		</div>
	)
}
