'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useShortcut } from '~/lib/hooks/use-shortcut'
import { cn } from '~/lib/utils/cn'

const links = [
	{ href: '/blog', label: 'Blog' },
	{ href: '/newsletter', label: 'Newsletter' },
	{ href: '/contact', label: 'Contact' }
]

export function Nav() {
	const pathname = usePathname()
	const router = useRouter()

	useShortcut('h', () => router.push('/'))
	useShortcut('b', () => router.push('/blog'))
	useShortcut('c', () => router.push('/contact'))
	useShortcut('p', () => router.push('/privacy'))
	useShortcut('n', () => router.push('/newsletter'))

	return (
		<nav className="fixed top-0 left-0 z-10 flex w-full items-center justify-between p-6 sm:px-8">
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
