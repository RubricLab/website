'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollDirection } from '~/lib/hooks/use-scroll-direction'
import { useShortcut } from '~/lib/hooks/use-shortcut'
import { cn } from '~/lib/utils/cn'

const links = [
	{ href: '/blog', label: 'Blog' },
	{ href: '/work', label: 'Work' },
	{ href: '/contact', label: 'Contact' }
]

export function Nav() {
	const pathname = usePathname()
	const router = useRouter()
	const { scrollDirection, scrollY } = useScrollDirection()

	useShortcut('h', () => router.push('/'))
	useShortcut('b', () => router.push('/blog'))
	useShortcut('c', () => router.push('/contact'))
	useShortcut('p', () => router.push('/privacy'))
	useShortcut('n', () => router.push('/newsletter'))
	useShortcut('w', () => router.push('/work'))

	return (
		<nav
			className={cn(
				'group fixed top-0 left-0 z-30 flex w-full items-center p-1 sm:justify-between sm:p-2'
			)}
		>
			<div
				className={cn(
					'flex h-10 items-center justify-center rounded-full border px-3 transition-all duration-300 sm:px-6',
					scrollDirection === 'down' ? 'opacity-0' : 'opacity-100',
					scrollY > 0 ? 'border-subtle bg-background' : 'border-transparent'
				)}
			>
				<Link href="/" className="whitespace-nowrap text-xl">
					Rubric Labs
				</Link>
			</div>

			<div
				className={cn(
					'flex h-10 items-center gap-6 rounded-full border px-2 transition-all duration-300 sm:px-6',
					scrollDirection === 'down' ? 'opacity-0' : 'opacity-100',
					scrollY > 0 ? 'border-subtle bg-background' : 'border-transparent',
					'invisible sm:visible'
				)}
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
