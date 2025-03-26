'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { Langchain } from './logos/langchain'
import { Neon } from './logos/neon'
import { Vercel } from './logos/vercel'

const partners = [
	{
		name: 'Neon',
		icon: <Neon className="w-36" />,
		href: 'https://neon.tech/blog/rubric-labs-can-make-your-ai-dreams-come-true'
	},
	{
		name: 'Vercel',
		icon: <Vercel className="w-40" />,
		href: 'https://vercel.com/partners/solution-partners/rubriclabs'
	},
	{
		name: 'Langchain',
		icon: <Langchain className="w-44" />,
		href: 'https://langchain.com/experts'
	}
]

export const Partners = () => {
	const posthog = usePostHog()

	return (
		<div className="flex w-full max-w-2xl flex-col items-center space-y-6">
			<p className="text-secondary text-sm">Our partners</p>
			<div className="flex w-full items-center justify-between">
				{partners.map(({ name, href, icon }) => (
					<Link
						key={name}
						href={href}
						onClick={() => posthog.capture('partner.clicked', { name, href })}
						target="_blank"
					>
						{icon}
					</Link>
				))}
			</div>
		</div>
	)
}
