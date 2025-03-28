'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { cn } from '~/lib/utils/cn'
import { Langchain } from './logos/langchain'
import { Neon } from './logos/neon'
import { Vercel } from './logos/vercel'

const partners = [
	{
		name: 'Neon',
		className: 'w-36',
		Icon: (props: { className: string }) => <Neon {...props} />,
		href: 'https://neon.tech/blog/rubric-labs-can-make-your-ai-dreams-come-true'
	},
	{
		name: 'Vercel',
		className: 'w-36',
		Icon: (props: { className: string }) => <Vercel {...props} />,
		href: 'https://vercel.com/partners/solution-partners/rubriclabs'
	},
	{
		name: 'Langchain',
		className: 'w-44',
		Icon: (props: { className: string }) => <Langchain {...props} />,
		href: 'https://langchain.com/experts'
	}
]

export const Partners = () => {
	const posthog = usePostHog()

	return (
		<div className="flex w-full max-w-2xl flex-col items-center space-y-6">
			<p className="text-secondary text-sm">Our partners</p>
			<div className="grid w-full grid-cols-3 items-center justify-between gap-4">
				{partners.map(({ name, href, Icon, className }, index) => (
					<div
						key={name}
						className={cn(
							'flex',
							{
								0: 'justify-start',
								1: 'justify-center',
								2: 'justify-end'
							}[index]
						)}
					>
						<Link
							href={href}
							onClick={() => posthog.capture('partner.clicked', { name, href })}
							target="_blank"
							className={cn(className)}
						>
							<Icon className="w-full" />
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}
