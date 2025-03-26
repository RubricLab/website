'use client'

import { Button } from './button'
import { Arrow } from './icons/arrow'

export const ScrollButton = ({ className }: { className?: string }) => {
	return (
		<Button
			variant="link"
			className={className || ''}
			onClick={() => {
				const windowHeight = window.innerHeight
				window.scrollTo({ top: windowHeight, behavior: 'smooth' })
			}}
		>
			<p className="text-base">See our work</p>
			<Arrow className="size-5 rotate-90" />
		</Button>
	)
}
