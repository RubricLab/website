'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { Button } from './button'
import { Arrow } from './icons/arrow'

export const CTA = () => {
	const hook = 'Production AI builds in 90 days.'
	const posthog = usePostHog()

	return (
		<div className="flex flex-col gap-8">
			<h2 className="max-w-2xl text-4xl sm:text-7xl">{hook}</h2>
			<div className="flex flex-col items-center gap-4 sm:flex-row">
				<Link
					href="/contact"
					className="w-full sm:w-fit"
					onClick={() =>
						posthog.capture('contact_us.clicked', {
							body: 'Get in touch',
							hook,
							href: '/contact'
						})
					}
				>
					<Button variant="brand" className="w-full sm:w-fit">
						Get in touch
					</Button>
				</Link>
				<Link
					href="/blog/introducing-rubric-labs"
					className="w-full sm:w-fit"
					onClick={() =>
						posthog.capture('read_more.clicked', {
							body: 'Read our founding story',
							hook,
							href: '/blog/introducing-rubric-labs'
						})
					}
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
