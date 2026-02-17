'use client'

import { useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

/**
 * Client-side component that redirects from ?section= URL to #section hash URL.
 * This provides a clean UX where users end up at the anchor position
 * while still allowing social platforms to see section-specific metadata.
 */
export const SectionRedirect = () => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()
	const section = searchParams.get('section')

	useEffect(() => {
		if (section) {
			// Replace URL with hash format for clean UX
			router.replace(`${pathname}#${section}`, { scroll: false })
			// Scroll to the section after a short delay to ensure DOM is ready
			setTimeout(() => {
				const element = document.getElementById(section)
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' })
				}
			}, 100)
		}
	}, [section, pathname, router])

	return null
}
