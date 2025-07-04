'use client'

import { usePostHog } from 'posthog-js/react'
import { cn } from '~/lib/utils/cn'
import { Button } from './button'
import { Arrow } from './icons/arrow'

const body = 'See our work'

export const ScrollButton = ({ className }: { className?: string }) => {
	const posthog = usePostHog()

	return (
		<Button
			variant="ghost"
			className={cn(className || '', 'hide-on-small-height')}
			onClick={() => {
				const windowHeight = window.innerHeight
				window.scrollTo({ behavior: 'smooth', top: windowHeight })
				posthog.capture('projects.clicked', { body, type: 'scroll_button' })
			}}
		>
			<p className="text-base">{body}</p>
			<Arrow className="rotate-90" />
		</Button>
	)
}
