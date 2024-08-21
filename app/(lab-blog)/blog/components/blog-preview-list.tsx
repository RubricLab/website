'use client'

import {BlogPostCard} from '@/lib/basehub/fragments/blog'
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

		const radius = 600 // adjust the radius as needed
		const angleIncrement = (2 * Math.PI) / childElements.length

		let ticker = 0

		const animateElements = () => {
			childElements.forEach((child, index) => {
				const angle = index * angleIncrement
				const y = radius * Math.cos(angle + ticker) + radius
				const z = radius * Math.sin(angle + ticker) // translate center of circle -radius on z
				const x = 0

				// Calculate the rotation angle to match the tangent of the imaginary circle
				const rotationAngle = angle + ticker - Math.PI

				child.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotationAngle}rad)`
				child.style.zIndex = Math.round(z).toString() // set z-index based on z coordinate
			})

			requestAnimationFrame(animateElements)
		}

		animateElements()

		const handleWheel = (event: WheelEvent) => {
			ticker -= event.deltaY * 0.001 // adjust the speed of animation based on wheel delta

			event.preventDefault()
		}

		listRef.current.addEventListener('wheel', handleWheel)

		return () => {
			listElm?.removeEventListener('wheel', handleWheel)
		}
	}, [])

	return (
		<div
			className='fixed right-sides top-header flex h-fold w-col-6 items-center justify-center [perspective:2000px]'
			ref={listRef}>
			{posts.map(p => (
				<div
					style={{
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
