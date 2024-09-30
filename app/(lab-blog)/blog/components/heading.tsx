'use client'

import {useLoaded} from '@/hooks/use-loaded'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/SplitText'
import {useEffect, useRef} from 'react'

export interface BlogIndexHeadingProps {
	blog: {
		title: string
		subtitle: string
	}
}

export default function BlogHeading({
	blog: {title, subtitle}
}: BlogIndexHeadingProps) {
	const loaded = useLoaded()
	const tl = useRef(gsap.timeline({paused: true}))

	const containerRef = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			if (!containerRef.current) return
			const title = containerRef.current.querySelector('h2')
			const subtitle = containerRef.current.querySelector('p')

			const spllitedTitle = new SplitText(title, {
				type: 'chars',
				charsClass: 'opacity-0'
			})

			const spllitedSubtitle = new SplitText(subtitle, {
				type: 'chars',
				charsClass: 'opacity-0'
			})

			tl.current
				.fromTo(
					spllitedTitle.chars,
					{
						filter: 'blur(12px)',
						opacity: 0
					},
					{
						opacity: 1,
						filter: 'blur(0px)',
						duration: 1,
						stagger: 0.05,
						ease: 'power2.inOut'
					}
				)
				.fromTo(
					spllitedSubtitle.chars,
					{
						opacity: 0
					},
					{
						opacity: 1,
						duration: 0.4,
						stagger: 0.02,
						ease: 'power2.inOut'
					},
					0.5
				)

			gsap.set(containerRef.current, {
				opacity: 1
			})
		},
		{
			scope: containerRef
		}
	)

	useEffect(() => {
		if (!loaded) return

		tl.current.play()
	}, [loaded])

	return (
		<div
			ref={containerRef}
			style={{
				opacity: 0
			}}
			className='px-em-[12] py-em-[56]'>
			<h2 className=' whitespace-nowrap text-text-secondary text-em-[48/16] md:text-em-[72/16]'>
				{title}
			</h2>
			<p className='text-text-tertiary text-em-[16/16]'>{subtitle}</p>
		</div>
	)
}
