'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { Arrow } from './icons/arrow'

const body = 'Read about our approach'

const href = '/blog/introducing-rubric-labs'

export const Announcement = () => {
	const posthog = usePostHog()
	return (
		<Link
			href={href}
			className="text-primary"
			onClick={() => posthog.capture('announcement.clicked', { body, href })}
		>
			<div className="group flex max-w-screen cursor-pointer items-center gap-2 rounded-full border border-secondary/50 bg-subtle px-3.5 py-1">
				<p className="text-nowrap">{body}</p>
				<Arrow className="size-5 transition-transform group-hover:translate-x-0.5" />
			</div>
		</Link>
	)
}
