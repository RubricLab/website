'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ANNOUNCEMENT } from '~/lib/constants'

export function AnnouncementBar() {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 50)
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<div
			className="fixed top-0 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 flex items-center h-16 pt-1"
			style={{ opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? 'none' : 'auto' }}
		>
			<div className="flex items-center rounded-full border border-subtle bg-background/80 backdrop-blur-sm px-5 py-2 shadow-sm">
				<Link
					href={ANNOUNCEMENT.href}
					className="text-secondary text-[11px] tracking-wide transition-colors hover:text-primary whitespace-nowrap leading-none"
				>
					{ANNOUNCEMENT.text} →
				</Link>
			</div>
		</div>
	)
}
