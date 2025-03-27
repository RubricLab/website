'use client'

import { usePostHog } from 'posthog-js/react'
import { Button } from './button'
import { Arrow } from './icons/arrow'

const body = 'See our work'

export const ScrollButton = ({ className }: { className?: string }) => {
	const posthog = usePostHog()

	return (
		<Button
			variant="link"
			className={className || ''}
			onClick={() => {
				const windowHeight = window.innerHeight
				window.scrollTo({ top: windowHeight, behavior: 'smooth' })
				posthog.capture('projects.clicked', { body, type: 'scroll_button' })
			}}
		>
			<p className="text-base">{body}</p>
			<Arrow className="size-5 rotate-90" />
		</Button>
	)
}
