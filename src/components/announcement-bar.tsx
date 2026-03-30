'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ANNOUNCEMENT } from '~/lib/constants'

export function AnnouncementBar() {
	const [dismissed, setDismissed] = useState(true)
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const key = `announcement-dismissed-${ANNOUNCEMENT.text}`
		setDismissed(localStorage.getItem(key) === 'true')

		const onScroll = () => setScrolled(window.scrollY > 50)
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const handleDismiss = () => {
		const key = `announcement-dismissed-${ANNOUNCEMENT.text}`
		localStorage.setItem(key, 'true')
		setDismissed(true)
	}

	if (dismissed) return null

	return (
		<div
			className="fixed top-0 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 flex items-center h-16 pt-1"
			style={{ opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? 'none' : 'auto' }}
		>
			<div className="flex items-center gap-3 rounded-full border border-subtle bg-background/80 backdrop-blur-sm px-5 py-2 shadow-sm">
				<Link
					href={ANNOUNCEMENT.href}
					className="text-secondary text-[11px] tracking-wide transition-colors hover:text-primary whitespace-nowrap leading-none"
				>
					{ANNOUNCEMENT.text} →
				</Link>
				<button
					type="button"
					onClick={handleDismiss}
					className="text-secondary text-[10px] transition-colors hover:text-primary leading-none"
					aria-label="Dismiss"
				>
					✕
				</button>
			</div>
		</div>
	)
}
