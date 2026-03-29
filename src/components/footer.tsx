import Link from 'next/link'
import { SITE } from '~/lib/constants'

export function Footer() {
	return (
		<footer className="border-t border-[#1A1A1A]">
			<div className="mx-auto max-w-[1200px] px-6 md:px-8 py-16">
				<div className="flex flex-col gap-8">
					<div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
						<span className="font-mono text-sm tracking-[0.15em] text-[#888888]">
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
									className="font-mono text-sm text-[#555555] hover:text-[#888888] transition-colors duration-200"
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
							className="font-mono text-xs text-[#555555] transition-colors duration-200 hover:text-[#888888]"
						>
							{SITE.email}
						</a>
						<span className="font-mono text-xs text-[#555555]">
							© {new Date().getFullYear()} Rubric Labs
						</span>
					</div>
				</div>
			</div>
		</footer>
	)
}
