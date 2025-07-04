'use client'

import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import { NewsletterForm } from '~/app/(rest)/newsletter/newsletter-form'
import { cn } from '~/lib/utils/cn'
import { GithubIcon } from '~/ui/icons/github'
import { LinkedInIcon } from '~/ui/icons/linkedin'
import { XIcon } from '~/ui/icons/x'
import { Wordmark } from '~/ui/logos/wordmark'
import { Copiable } from './copiable'

const socials = [
	{
		href: 'https://github.com/RubricLab',
		icon: <GithubIcon className="size-5" />,
		label: 'GitHub'
	},
	{
		href: 'https://x.com/RubricLabs',
		icon: <XIcon className="size-5" />,
		label: 'X'
	},
	{
		href: 'https://www.linkedin.com/company/RubricLabs',
		icon: <LinkedInIcon className="size-5" />,
		label: 'LinkedIn'
	}
]

const links = [
	{
		href: '/blog',
		label: 'Blog'
	},
	{
		href: '/contact',
		label: 'Contact'
	},
	{
		href: '/newsletter',
		label: 'Newsletter'
	},
	{
		href: '/work',
		label: 'Work'
	},
	{
		href: 'https://brand.rubriclabs.com',
		label: 'Brand'
	},
	{
		href: '/privacy',
		label: 'Privacy'
	}
]

export const Footer = ({ className }: { className?: string }) => {
	const posthog = usePostHog()

	return (
		<footer
			className={cn('flex h-screen w-full flex-col items-center justify-center space-y-24', className)}
		>
			<Wordmark className="text-secondary" />
			<div className="w-full max-w-2xl space-y-8 px-4 sm:space-y-16">
				<div className="flex w-full flex-col justify-between gap-8 sm:flex-row sm:gap-0">
					<div className="flex w-full flex-col gap-4 sm:max-w-1/2">
						<p>Newsletter</p>
						<NewsletterForm />
					</div>
					<div className="flex flex-col gap-4">
						<p>Socials</p>
						<div className="flex gap-5 text-secondary">
							{socials.map(({ icon, href, label }) => (
								<Link
									key={label}
									href={href}
									onClick={() => posthog.capture('social.clicked', { href, label })}
									target="_blank"
								>
									{icon}
								</Link>
							))}
						</div>
					</div>
				</div>
				<div className="w-full">
					<div className="flex w-fit flex-col gap-4">
						<p>Links</p>
						<div className="grid grid-cols-3 gap-6 text-secondary sm:flex sm:flex-wrap">
							{links.map(({ label, href }) => (
								<Link key={label} href={href}>
									{label}
								</Link>
							))}
						</div>
					</div>
				</div>
				<div className="font-mono text-secondary">
					<Copiable
						message="Website link copied"
						variant="link"
						content="https://rubriclabs.com"
						className="group relative"
					>
						© Rubric Labs Inc.{' '}
						<span className="opacity-0 transition-opacity delay-500 duration-1000 group-hover:opacity-100">
							2049
						</span>
						<span className="absolute top-0 right-0 transition-opacity delay-500 duration-1000 group-hover:opacity-0">
							{new Date().getFullYear()}
						</span>
					</Copiable>
				</div>
			</div>
		</footer>
	)
}
