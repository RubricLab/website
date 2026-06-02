import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { META } from '~/lib/constants/metadata'
import { createMetadata } from '~/lib/utils/create-metadata'
import {
	DashboardDemoSection,
	LandingDemoSection,
	OnboardingDemoSection
} from '~/ui/blog/iterative-improvement/demos'

// Only the iterative-self-improvement post has a live demos page.
const DEMO_SLUG = 'iterative-self-improvement'

export const dynamicParams = false

export function generateStaticParams() {
	return [{ slug: DEMO_SLUG }]
}

export function generateMetadata(): Metadata {
	return createMetadata({
		description:
			'Live, interactive proof for "Give your agent a mirror": compare the three iterations of each demo side by side.',
		pathname: `/blog/${DEMO_SLUG}/demos`,
		title: `Live demos — Give your agent a mirror | ${META.title}`
	})
}

type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
	const { slug } = await params
	if (slug !== DEMO_SLUG) notFound()

	return (
		<div className="flex min-h-screen flex-col items-center gap-16 px-4 py-32">
			<div className="flex w-full max-w-6xl flex-col gap-4">
				<Link href={`/blog/${DEMO_SLUG}`} className="text-secondary text-sm hover:text-primary">
					← Back to the post
				</Link>
				<h1>Verify it yourself</h1>
				<p className="max-w-2xl text-secondary">
					Every artifact below came from a real agent run. Each row shows the three iterations side by
					side so you can compare them directly — read the landing pages, type into the dashboards to
					feel the speed difference, and click through the onboarding flows.
				</p>
			</div>

			<LandingDemoSection />
			<DashboardDemoSection />
			<OnboardingDemoSection />
		</div>
	)
}
