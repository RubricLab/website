'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { Button } from './button'
import { Arrow } from './icons/arrow'

export const CTA = () => {
	const hook = "We don't have a sales team. Let's talk."
	const posthog = usePostHog()

	return (
		<div className="flex flex-col gap-8">
			<h2 className="max-w-2xl text-7xl">{hook}</h2>
			<div className="flex items-center gap-4">
				<Link
					href="/contact"
					onClick={() =>
						posthog.capture('contact_us.clicked', {
							body: 'Get in touch',
							hook,
							href: '/contact'
						})
					}
				>
					<Button>Get in touch</Button>
				</Link>
				<Link
					href="/blog/introducing-rubric-labs"
					onClick={() =>
						posthog.capture('read_more.clicked', {
							body: 'Read our founding story',
							hook,
							href: '/blog/introducing-rubric-labs'
						})
					}
				>
					<Button variant="ghost">
						Read our founding story
						<Arrow />
					</Button>
				</Link>
			</div>
		</div>
	)
}
