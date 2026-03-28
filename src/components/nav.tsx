'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '~/lib/constants'
import { useShortcut } from '~/lib/hooks/use-shortcut'
import { useTheme } from '~/lib/theme'

function ThemeToggle() {
	const { resolved, setTheme } = useTheme()
	const toggle = () => setTheme(resolved === 'dark' ? 'light' : 'dark')

	return (
		<button
			type="button"
			onClick={toggle}
			className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-colors duration-200 hover:text-text-primary"
			aria-label="Toggle theme"
		>
			{resolved === 'dark' ? (
				<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
					<path
						d="M7.5 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5Zm0 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5ZM0 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm12 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5Zm-1.4-4.1a.5.5 0 0 1 0-.71l1.42-1.41a.5.5 0 0 1 .7.7L11.31 3.4a.5.5 0 0 1-.7 0ZM2.28 12.72a.5.5 0 0 1 0-.71l1.42-1.41a.5.5 0 0 1 .7.7l-1.41 1.42a.5.5 0 0 1-.71 0ZM3.4 3.4a.5.5 0 0 1-.71 0L1.28 1.98a.5.5 0 0 1 .7-.7L3.4 2.69a.5.5 0 0 1 0 .7Zm8.2 8.2a.5.5 0 0 1-.71 0l-1.41-1.42a.5.5 0 0 1 .7-.7l1.42 1.41a.5.5 0 0 1 0 .71Z"
						fill="currentColor"
					/>
				</svg>
			) : (
				<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
					<path
						d="M2.9 0.6a.5.5 0 0 0-.8.5A6 6 0 0 0 8.9 8.5a6 6 0 0 0 5-2.6.5.5 0 0 0-.5-.8A5 5 0 0 1 6.9 2.1 5 5 0 0 1 2.9.6Z"
						fill="currentColor"
					/>
				</svg>
			)}
		</button>
	)
}

export function Nav() {
	const pathname = usePathname()
	const router = useRouter()
	const [scrolled, setScrolled] = useState(false)

	useShortcut('h', () => router.push('/'))
	useShortcut('w', () => router.push('/work'))
	useShortcut('b', () => router.push('/lab'))
	useShortcut('c', () => router.push('/contact'))

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20)
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<nav
			className={`fixed top-0 left-0 z-50 flex h-[64px] w-full items-center justify-between px-6 transition-all duration-300 md:px-10 ${
				scrolled
					? 'border-b border-border bg-bg/80 backdrop-blur-xl'
					: 'bg-transparent'
			}`}
		>
			<Link
				href="/"
				className="font-medium font-mono text-[13px] text-text-primary uppercase tracking-[0.2em] transition-opacity duration-200 hover:opacity-70"
			>
				RUBRIC
			</Link>
			<div className="flex items-center gap-6">
				{NAV_LINKS.map(link => (
					<Link
						key={link.href}
						href={link.href}
						className={`hidden font-mono text-[13px] transition-colors duration-200 sm:block ${
							pathname.startsWith(link.href)
								? 'text-text-primary'
								: 'text-text-tertiary hover:text-text-secondary'
						}`}
					>
						{link.label}
					</Link>
				))}
				<ThemeToggle />
			</div>
		</nav>
	)
}
