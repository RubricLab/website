'use client'

import { useEffect } from 'react'

export function ExternalLinks({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		const links = document.querySelectorAll('article a')
		for (const link of Array.from(links)) {
			link.setAttribute('target', '_blank')
			link.setAttribute('rel', 'noopener noreferrer')
		}
	}, [])

	return <>{children}</>
}
