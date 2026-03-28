import Link from 'next/link'
import { SITE } from '~/lib/constants'

export function Footer() {
	return (
		<footer className="border-border/50 border-t">
			<div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
				<div className="flex flex-col gap-8">
					<div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
						<span className="font-mono text-[13px] text-text-tertiary tracking-[0.2em]">
							RUBRIC
						</span>
						<div className="flex items-center gap-8">
							{[
								{ href: '/work', label: 'Work' },
								{ href: '/lab', label: 'Lab' },
								{ href: '/contact', label: 'Contact' },
								{ href: SITE.github, label: 'GitHub' },
								{ href: SITE.x, label: 'X' }
							].map(link => (
								<Link
									key={link.href}
									href={link.href}
									className="font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
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
						<a
							href={`mailto:${SITE.email}`}
							className="font-mono text-[12px] text-text-tertiary transition-colors duration-200 hover:text-text-secondary"
						>
							{SITE.email}
						</a>
						<span className="font-mono text-[11px] text-text-tertiary/60">
							&copy; {new Date().getFullYear()} Rubric Labs
						</span>
					</div>
				</div>
			</div>
		</footer>
	)
}
