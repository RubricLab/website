'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useFold } from '~/lib/hooks/use-fold'
import { useShortcut } from '~/lib/hooks/use-shortcut'
import { cn } from '~/lib/utils/cn'

const links = [
	{ href: '/blog', label: 'Blog' },
	{ href: '/contact', label: 'Contact' }
]

export function Nav() {
	const pathname = usePathname()
	const router = useRouter()
	const { isBelowFold } = useFold()

	useShortcut('h', () => router.push('/'))
	useShortcut('b', () => router.push('/blog'))
	useShortcut('c', () => router.push('/contact'))
	useShortcut('p', () => router.push('/privacy'))
	useShortcut('n', () => router.push('/newsletter'))

	return (
		<nav
			className={cn(
				'group fixed top-0 left-0 z-30 flex w-full items-center justify-between p-6 transition-colors hover:bg-background sm:px-8'
			)}
		>
			<Link
				href="/"
				className={cn('text-xl tracking-tight', {
					'opacity-0 transition-opacity group-hover:opacity-100': isBelowFold
				})}
			>
				Rubric Labs
			</Link>
			<div
				className={cn('flex items-center gap-6', {
					'opacity-0 transition-opacity group-hover:opacity-100': isBelowFold
				})}
			>
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
