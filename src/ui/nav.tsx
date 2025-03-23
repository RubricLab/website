'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useShortcut } from '~/lib/hooks/use-shortcut'
import { cn } from '~/lib/utils/cn'

const links = [
	{ href: '/blog', label: 'Blog' },
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
			<div className="flex items-center gap-6">
				{links.map(link => (
					<Link
						href={link.href}
						key={link.href}
						className={cn({ 'text-primary': pathname.includes(link.href) })}
					>
						{link.label}
					</Link>
				))}
			</div>
		</nav>
	)
}
