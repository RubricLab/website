'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useShortcut } from '~/lib/hooks/use-shortcut'
import { cn } from '~/lib/utils/cn'

const links = [
	{ href: '/blog', label: 'Blog' },
	{ href: '/contact', label: 'Contact' }
]

export function Nav() {
	const pathname = usePathname()
	const router = useRouter()
	const [isWordmarkVisible, setIsWordmarkVisible] = useState(true)
	const observerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				const entry = entries[0]
				if (entry) {
					setIsWordmarkVisible(entry.isIntersecting)
				}
			},
			{ threshold: 1.0 }
		)

		if (observerRef.current) {
			observer.observe(observerRef.current)
		}

		return () => observer.disconnect()
	}, [])

	useShortcut('h', () => router.push('/'))
	useShortcut('b', () => router.push('/blog'))
	useShortcut('c', () => router.push('/contact'))
	useShortcut('p', () => router.push('/privacy'))
	useShortcut('n', () => router.push('/newsletter'))

	return (
		<>
			<div ref={observerRef} className="absolute top-0 h-screen w-full" />
			<nav
				className={cn(
					'group fixed top-0 left-0 z-30 flex w-full items-center justify-between p-6 transition-colors hover:bg-background sm:px-8'
				)}
			>
				<Link
					href="/"
					className={cn('text-xl tracking-tight', {
						'opacity-0 transition-opacity group-hover:opacity-100': !isWordmarkVisible
					})}
				>
					Rubric Labs
				</Link>
				<div
					className={cn('flex items-center gap-6', {
						'opacity-0 transition-opacity group-hover:opacity-100': !isWordmarkVisible
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
		</>
	)
}
