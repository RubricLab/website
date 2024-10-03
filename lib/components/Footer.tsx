'use client'
import { GithubIcon, LinkedinIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { META } from '~/constants/metadata'
import BackgroundGrid from './BackgroundGrid'
import Button from './Button'
import Title from './Title'

const pages = [
	{ title: 'About', href: '/about' },
	{ title: 'Lab', href: '/lab' },
	{ title: 'Blog', href: '/blog' },
	{ title: 'Contact', href: '/contact' },
	{ title: 'Partners', href: '/partners' },
	{ title: 'Projects', href: '/projects' },
	{ title: 'Newsletter', href: '/newsletter' },
	{ title: 'Brand', href: 'https://brand.rubriclabs.com' },
	{ title: 'Sitemap', href: '/sitemap.xml' }
]

const socials = [
	{
		title: 'GitHub',
		href: META.githubURL,
		icon: <GithubIcon className="hover:-translate-x-0.5 h-5 w-5 transition-transform duration-300" />
	},
	{
		title: 'Twitter',
		href: META.twitterURL,
		icon: (
			<div className="flex h-5 w-5 items-center justify-center pb-1 text-2xl transition-transform duration-300">
				<span className="no-underline hover:no-underline">𝕏</span>
			</div>
		)
	},
	{
		title: 'LinkedIn',
		href: META.linkedinURL,
		icon: (
			<LinkedinIcon className="hover:-translate-y-0.5 h-5 w-5 transition-transform duration-300" />
		)
	}
]

const Footer = () => {
	const pathname = usePathname()

	if (pathname.startsWith('/studio')) return <></>

	return (
		<div className="fixed bottom-0 z-10 flex h-[80vh] w-full flex-col-reverse items-center justify-between gap-10 overflow-hidden bg-black px-5 py-16 text-white sm:h-96 sm:flex-row sm:items-center sm:gap-0 sm:px-10 sm:py-20 dark:bg-white dark:text-black">
			<BackgroundGrid className="pointer-events-none absolute bottom-0 left-0 z-20 h-screen w-full" />
			<div className="flex flex-col items-center gap-5 sm:items-start">
				<Link href="/" className="no-underline">
					<Title invert size="full" />
				</Link>
				<p className="font-2xl text-negative">Let&apos;s make something amazing, together.</p>
				<Button
					body="Get in touch"
					variant="light"
					href="/contact"
					className="z-20 mt-2 w-full max-w-sm"
				/>
				<div className="flex w-full items-center justify-center gap-4 sm:justify-start">
					{socials.map(item => (
						<Link
							key={item.title}
							target="_blank"
							className="no-underline underline-offset-4 transition-all duration-300 hover:underline"
							href={item.href}
						>
							{item.icon}
						</Link>
					))}
				</div>
			</div>

			<div className="flex w-full flex-col items-end justify-center gap-4 sm:w-auto sm:flex-col sm:gap-3">
				<div className="flex flex-wrap justify-center gap-4 sm:grid sm:grid-cols-2">
					{pages
						// Removed alphabetical sort in favour of sorting for funnel
						.map(item => (
							<Link
								key={item.title}
								className="no-underline underline-offset-4 transition-all duration-300 hover:underline"
								href={item.href}
							>
								{item.title}
							</Link>
						))}
				</div>
			</div>
		</div>
	)
}

export default Footer
