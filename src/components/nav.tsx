'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '~/lib/constants'
import { useShortcut } from '~/lib/hooks/use-shortcut'

export function Nav() {
	const pathname = usePathname()
	const router = useRouter()
	const [scrolled, setScrolled] = useState(false)

	useShortcut('h', () => router.push('/'))
	useShortcut('w', () => router.push('/work'))
	useShortcut('b', () => router.push('/lab'))
	useShortcut('c', () => router.push('/contact'))

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 100)
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<nav
			className={`fixed top-0 left-0 z-50 flex h-[60px] w-full items-center justify-between px-6 transition-all duration-200 md:px-10 ${
				scrolled ? 'bg-[#0A0A0A]' : 'bg-transparent'
			}`}
		>
			<Link
				href="/"
				className="font-medium font-mono text-sm text-[#EDEDED] uppercase tracking-[0.15em] transition-opacity duration-200 hover:opacity-70"
			>
				RUBRIC
			</Link>
			<div className="flex items-center gap-4 md:gap-6">
				{NAV_LINKS.map(link => (
					<Link
						key={link.href}
						href={link.href}
						className={`font-mono text-sm transition-colors duration-150 ${
							pathname.startsWith(link.href)
								? 'text-[#EDEDED]'
								: 'text-[#888888] hover:text-[#EDEDED]'
						}`}
					>
						{link.label}
					</Link>
				))}
			</div>
		</nav>
	)
}
