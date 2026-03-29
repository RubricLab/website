'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ANNOUNCEMENT } from '~/lib/constants'

export function AnnouncementBar() {
	const [dismissed, setDismissed] = useState(true)

	useEffect(() => {
		const key = `announcement-dismissed-${ANNOUNCEMENT.text}`
		setDismissed(localStorage.getItem(key) === 'true')
	}, [])

	const handleDismiss = () => {
		const key = `announcement-dismissed-${ANNOUNCEMENT.text}`
		localStorage.setItem(key, 'true')
		setDismissed(true)
	}

	if (dismissed) return null

	return (
		<div className="relative flex h-10 w-full items-center justify-center border-white/[0.06] border-b bg-white/[0.03]">
			<Link
				href={ANNOUNCEMENT.href}
				className="font-mono text-text-secondary text-xs tracking-wide transition-colors hover:text-text-primary"
			>
				{ANNOUNCEMENT.text} →
			</Link>
			<button
				type="button"
				onClick={handleDismiss}
				className="absolute right-4 font-mono text-text-secondary text-xs transition-colors hover:text-text-primary"
				aria-label="Dismiss announcement"
			>
				✕
			</button>
		</div>
	)
}
