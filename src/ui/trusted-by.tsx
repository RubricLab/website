'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { Albertsons } from './logos/albertsons'
import { Graphite } from './logos/graphite'
import { Gumloop } from './logos/gumloop'

export const TrustedBy = () => {
	const posthog = usePostHog()
	return (
		<div className="flex w-full max-w-2xl flex-col items-center space-y-6">
			<p className="text-secondary text-sm">Trusted by</p>
			<div className="grid w-full grid-cols-3 gap-4">
				<div className="flex items-center justify-start">
					<Link className="w-36" href="/work#Gumloop">
						<Gumloop className="w-full" />
					</Link>
				</div>
				<div className="flex items-center justify-center">
					<Link className="w-40" href="/work#Graphite">
						<Graphite className="w-full" />
					</Link>
				</div>
				<div className="flex items-center justify-end">
					<Link className="w-48" href="/work#Albertsons">
						<Albertsons className="w-full" />
					</Link>
				</div>
			</div>
			<Link
				href="/work"
				className="text-sm"
				onClick={() => posthog.capture('projects.clicked', { body: 'View more', href: '/work' })}
			>
				View more
			</Link>
		</div>
	)
}
