'use client'

import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {useRef} from 'react'

export function CopyButton({text}: {text: string}) {
	const buttonRef = useRef<HTMLButtonElement>(null)
	const tl = useRef<gsap.core.Timeline>(
		gsap.timeline({
			paused: true,
			onComplete: () => {
				setTimeout(() => {
					tl.current.reverse()
				}, 1000)
			}
		})
	)

	const handleClick = async () => {
		await navigator.clipboard.writeText(text)
	}

	useGSAP(() => {
		const btn = buttonRef.current
		if (!btn) throw new Error('Element not found')

		const wordArray = ['copy', 'cop', 'copi', 'copie', 'copied']
		wordArray.forEach(word => {
			tl.current.to(btn, {
				duration: 0.068,
				opacity: 1,
				text: word
			})
		})
	})

	return (
		<button
			ref={buttonRef}
			onClick={() => {
				if (text) handleClick()
				tl.current.play()
			}}
			className='h-full text-text-secondary underline underline-offset-[0.3em] px-em-[8] hover:text-text'>
			Copy
		</button>
	)
}
