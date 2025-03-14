'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils/cn'

const links = [
	{ href: '/blog', label: 'Blog' },
	{ href: '/contact', label: 'Contact' }
]

export default function Nav() {
	const pathname = usePathname()

	return (
		<nav className="fixed top-0 left-0 z-10 flex w-full items-center justify-between px-8 py-6">
			<Link href="/">Rubric Labs™</Link>
			<div className="flex items-center gap-4 text-sm">
				{links.map(link => (
					<Link
						href={link.href}
						key={link.href}
						className={cn('opacity-60', { 'opacity-100': pathname.includes(link.href) })}
					>
						{link.label}
					</Link>
				))}
			</div>
		</nav>
	)
}
