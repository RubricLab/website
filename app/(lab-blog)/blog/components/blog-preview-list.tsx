'use client'
import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {mod} from '@/lib/utils/math'
import {useEffect, useRef} from 'react'
import {BlogPostPreview} from './blogpost-preview'

interface BlogPreviewList {
	posts: BlogPostCard[]
}

export const BlogPreviewList = ({posts}: BlogPreviewList) => {
	const listRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!listRef.current) return

		const listElm = listRef.current
		const childElements = Array.from(listRef.current.children) as HTMLDivElement[]

		const radius = 300 // adjust the radius as needed
		const angleIncrement = (2 * Math.PI) / childElements.length

		let ticker = 0

		const animateElements = () => {
			childElements.forEach((child, index) => {
				const angle = mod(index * angleIncrement + ticker, Math.PI * 2)
				const y = radius * Math.cos(angle) + radius
				const z = radius * Math.sin(angle) // translate center of circle -radius on z
				const x = 0
				const opacity = Math.sin(angle - Math.PI / 2) * 0.5 + 0.5

				index === 0 && console.log({angle, opacity})

				// Calculate the rotation angle to match the tangent of the imaginary circle
				const rotationAngle = angle - Math.PI

				child.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotationAngle}rad)`
				child.style.zIndex = Math.round(z).toString() // set z-index based on z coordinate
				child.style.opacity = opacity.toString() // fade out elements as they move away from the center
			})

			// requestAnimationFrame(animateElements)
		}

		animateElements()

		const handleWheel = (event: WheelEvent) => {
			ticker -= event.deltaY * 0.001 // adjust the speed of animation based on wheel delta

			event.preventDefault()
			animateElements()
		}

		listRef.current.addEventListener('wheel', handleWheel)

		return () => {
			listElm?.removeEventListener('wheel', handleWheel)
		}
	}, [])

	return (
		<div
			className='fixed right-sides top-header flex h-fold w-col-6 items-center justify-center [perspective:3000px]'
			ref={listRef}>
			{posts.map((p, idx) => (
				<div
					style={{
						background: idx === 0 ? 'red' : 'transparent',
						backfaceVisibility: 'hidden',
						transformStyle: 'preserve-3d'
					}}
					className='absolute'
					key={p._id}>
					<BlogPostPreview {...p} />
				</div>
			))}
		</div>
	)
}
