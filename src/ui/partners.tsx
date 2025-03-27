'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { Langchain } from './logos/langchain'
import { Neon } from './logos/neon'
import { Vercel } from './logos/vercel'

const partners = [
	{
		name: 'Neon',
		Icon: (props: { className: string }) => <Neon {...props} />,
		href: 'https://neon.tech/blog/rubric-labs-can-make-your-ai-dreams-come-true'
	},
	{
		name: 'Vercel',
		Icon: (props: { className: string }) => <Vercel {...props} />,
		href: 'https://vercel.com/partners/solution-partners/rubriclabs'
	},
	{
		name: 'Langchain',
		Icon: (props: { className: string }) => <Langchain {...props} />,
		href: 'https://langchain.com/experts'
	}
]

export const Partners = () => {
	const posthog = usePostHog()

	return (
		<div className="flex w-full max-w-2xl flex-col items-center space-y-6">
			<p className="text-secondary text-sm">Our partners</p>
			<div className="flex w-full items-center justify-between gap-4">
				{partners.map(({ name, href, Icon }) => (
					<Link
						key={name}
						href={href}
						onClick={() => posthog.capture('partner.clicked', { name, href })}
						target="_blank"
						className="w-40"
					>
						<Icon className="w-full" />
					</Link>
				))}
			</div>
		</div>
	)
}
