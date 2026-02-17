'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { cn } from '~/lib/utils/cn'

type HeadingLevel = 'h1' | 'h2' | 'h3'

/**
 * Creates a shareable URL for a section.
 * Uses /s/[section] format which works with social platform crawlers.
 * The middleware rewrites this to ?section= and the page redirects users to #section.
 */
const getShareableUrl = (id: string): string => {
	const href = window.location.href
	const withoutHash = href.split('#')[0] ?? href
	const baseUrl = withoutHash.split('?')[0] ?? withoutHash
	// Check if we're on a blog page
	if (baseUrl.includes('/blog/')) {
		// Use /s/section format for social sharing compatibility
		return `${baseUrl}/s/${id}`
	}
	// For non-blog pages, use hash format
	return `${baseUrl}#${id}`
}

export const CopiableHeading = ({
	children,
	as: Component = 'h2',
	id: idProp,
	...props
}: { children: React.ReactNode; as?: HeadingLevel } & React.HTMLAttributes<HTMLHeadingElement>) => {
	const fallbackId = children?.toString().toLowerCase().replaceAll(' ', '-')
	const id = idProp ?? fallbackId

	const { copied, handleCopy } = useClipboard()

	useEffect(() => {
		if (copied) toast.success('Link copied')
	}, [copied])

	return (
		<Component
			id={id}
			className={cn('group relative cursor-pointer', props.className)}
			onClick={() => (id ? handleCopy(getShareableUrl(id)) : null)}
			{...props}
		>
			{children}
		</Component>
	)
}
