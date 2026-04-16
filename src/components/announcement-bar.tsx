'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '~/components/button'
import { Arrow } from '~/components/icons/arrow'
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
			<div className="inline-flex rounded-full border border-subtle bg-background/80 backdrop-blur-sm">
				<Button asChild intent="ghost" size="xs" trailingIcon={<Arrow />}>
					<Link href={ANNOUNCEMENT.href}>{ANNOUNCEMENT.text}</Link>
				</Button>
			</div>
		</div>
	)
}
