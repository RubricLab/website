'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { CATEGORIES, type Category } from '~/lib/constants/blog'
import { Button } from './button'
import { Arrow } from './icons/arrow'

const DEFAULT_HOOK = "We don't have a sales team. Let's talk."

const HOOK_BY_CATEGORY: Record<Category, string> = {
	[CATEGORIES.ANNOUNCEMENT]: "If this sparked an idea for your roadmap, let's talk.",
	[CATEGORIES.BREAKDOWN]: "Want help implementing this in production? Let's talk",
	[CATEGORIES.CASE_STUDY]: "Want outcomes like this in your product? Let's talk.",
	[CATEGORIES.ESSAY]: "If this perspective matches what you're seeing, let's talk.",
	[CATEGORIES.EXPERIMENT]: "If this sparked an idea for your roadmap, let's talk."
}

export const CTA = ({ category }: { category?: Category }) => {
	const hook = category ? HOOK_BY_CATEGORY[category] : DEFAULT_HOOK
	const posthog = usePostHog()

	return (
		<div className="flex flex-col gap-8">
			<div className="flex max-w-2xl flex-col gap-4">
				<h2 className="text-4xl sm:text-5xl">{hook}</h2>
				{category ? (
					<p className="text-lg text-secondary">
						Rubric is an applied AI lab helping teams design and ship intelligent products.
					</p>
				) : null}
			</div>
			<div className="flex flex-col items-center gap-4 sm:flex-row">
				<Link
					href="/contact"
					className="w-full sm:w-fit"
					onClick={() => posthog.capture('contact_us.clicked', { hook })}
				>
					<Button className="w-full sm:w-fit">Get in touch</Button>
				</Link>
				<Link
					href="/blog/introducing-rubric-labs"
					className="w-full sm:w-fit"
					onClick={() => posthog.capture('read_more.clicked', { hook })}
				>
					<Button variant="ghost" className="w-full sm:w-fit">
						Read our founding story
						<Arrow />
					</Button>
				</Link>
			</div>
		</div>
	)
}
