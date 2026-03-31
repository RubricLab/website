import Link from 'next/link'
import { SITE } from '~/lib/constants'
import { Wordmark } from '~/components/logos/wordmark'

const links = [
	{ href: '/lab', label: 'Blog' },
	{ href: '/work', label: 'Work' },
	{ href: '/contact', label: 'Contact' },
	{ href: SITE.github, label: 'GitHub' },
	{ href: SITE.x, label: 'X' },
]

export function Footer() {
	return (
		<footer className="flex flex-col items-center px-6 md:px-8">
			{/* Large wordmark */}
			<div className="w-full max-w-[800px] py-24">
				<Wordmark className="w-full text-secondary" />
			</div>

			{/* Links + info */}
			<div className="w-full max-w-[1200px] border-t border-subtle py-12">
				<div className="flex flex-col gap-8">
					<div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
						<a
							href={`mailto:${SITE.email}`}
							className="text-sm text-secondary transition-colors duration-200 hover:text-primary"
						>
							{SITE.email}
						</a>
						<div className="flex items-center gap-8">
							{links.map(link => (
								<Link
									key={link.href}
									href={link.href}
									className="text-sm text-secondary hover:text-primary transition-colors duration-200"
									{...(link.href.startsWith('http')
										? { rel: 'noopener noreferrer', target: '_blank' }
										: {})}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
					<div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
						<span className="text-xs text-secondary">
							© {new Date().getFullYear()} Rubric Labs Inc.
						</span>
					</div>
				</div>
			</div>
		</footer>
	)
}
