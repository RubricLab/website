'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { cn } from '~/lib/utils/cn'
import { Langchain } from './logos/langchain'
import { Neon } from './logos/neon'
import { Vercel } from './logos/vercel'

const partners = [
	{
		className: 'w-36',
		href: 'https://neon.tech/blog/rubric-labs-can-make-your-ai-dreams-come-true',
		Icon: (props: { className: string }) => <Neon {...props} />,
		name: 'Neon'
	},
	{
		className: 'w-36',
		href: 'https://vercel.com/partners/solution-partners/rubriclabs',
		Icon: (props: { className: string }) => <Vercel {...props} />,
		name: 'Vercel'
	},
	{
		className: 'w-44',
		href: 'https://langchain.com/experts',
		Icon: (props: { className: string }) => <Langchain {...props} />,
		name: 'Langchain'
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
							onClick={() => posthog.capture('partner.clicked', { href, name })}
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
