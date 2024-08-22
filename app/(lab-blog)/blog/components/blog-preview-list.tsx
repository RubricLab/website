'use client'
import {useLerpRef} from '@/hooks/use-lerp-ref'
import {useTrackDragInertia} from '@/hooks/use-track-drag'
import {useWheel} from '@/hooks/use-wheel'
import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import cn from '@/lib/utils/cn'
import {mod} from '@/lib/utils/math'
import gsap from 'gsap'
import {useControls} from 'leva'
import {useCallback, useRef, useState} from 'react'
import {BlogPostPreview} from './blogpost-preview'

interface BlogPreviewList {
	posts: BlogPostCard[]
}

const opacityEaseIn = gsap.parseEase('power2.in')
const opacityEaseOut = gsap.parseEase('power2.in')
const opacityAngleRemapIn = gsap.utils.mapRange(Math.PI, Math.PI * 1.5, 0, 1)
const opacityAngleRemapOut = gsap.utils.mapRange(
	Math.PI * 1.5,
	Math.PI * 2,
	1,
	0
)
const opacity = (angle: number) => {
	if (angle >= Math.PI && angle <= Math.PI * 1.5)
		return opacityEaseIn(opacityAngleRemapIn(angle))

	if (angle > Math.PI * 1.5 && angle <= Math.PI * 2)
		return opacityEaseOut(opacityAngleRemapOut(angle))

	return 0
}

export const BlogPreviewList = ({posts}: BlogPreviewList) => {
	const {radius, stepFactor, debug, backface, affectOpacity} = useControls({
		radius: {
			value: 350,
			min: 1,
			max: 1000
		},
		stepFactor: {
			value: 1,
			min: 0.1,
			max: 1
		},
		affectOpacity: true,
		backface: true,
		debug: true
	})

	const listRef = useRef<HTMLDivElement>(null)
	const [activeIndex, setActiveIndex] = useState(0)
	const hasInteracted = useRef(false)

	const DISPLAY_LENGTH = posts.length
	const ANGLE_STEP = (360 / DISPLAY_LENGTH) * stepFactor
	const ANGLE_STEP_RAD = ANGLE_STEP * (Math.PI / 180)
	const INITIAL_OFFSET = -Math.PI / 2

	const getItemProps = useCallback(
		(idx, _radOffset = INITIAL_OFFSET) => {
			const anglePos = ANGLE_STEP * idx
			const anglePosRad = anglePos * (Math.PI / 180)
			const angleRad = mod(anglePosRad + _radOffset, Math.PI * 2)
			const angleDeg = angleRad * (180 / Math.PI)

			const x = 0
			const y = radius * Math.sin(angleRad) + radius
			const z = radius * Math.cos(angleRad)
			const rotate = -angleRad - Math.PI / 2

			return {
				x,
				y,
				z,
				rotate,
				attrs: {
					'data-angle-deg': angleDeg
				},
				style: {
					transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotate}rad)`,
					zIndex: Math.round(z).toString(),
					opacity: affectOpacity ? opacity(angleRad) : 1
				}
			}
		},
		[ANGLE_STEP, INITIAL_OFFSET, radius, affectOpacity]
	)

	const getActiveAngularStep = useCallback(
		(radOffset: number) => {
			return (
				Math.round(mod(radOffset, 2 * Math.PI) / ANGLE_STEP_RAD) % DISPLAY_LENGTH
			)
		},
		[ANGLE_STEP_RAD, DISPLAY_LENGTH]
	)

	const radOffset = useLerpRef(INITIAL_OFFSET, {
		lerp: 0.24,
		onTick: () => {
			if (!listRef.current) return

			const _radOffset = radOffset.current.current
			const items = listRef.current.childNodes as NodeListOf<HTMLElement>

			items.forEach((item, idx) => {
				const {style, attrs} = getItemProps(idx, _radOffset)
				item.style.transform = style.transform
				item.style.zIndex = style.zIndex
				item.style.opacity = style.opacity.toString()

				Object.entries(attrs).forEach(([key, value]) => {
					item.setAttribute(key, value.toString())
				})
			})

			const offsetDebugger =
				document.querySelector<HTMLElement>('#offset-debugger')

			if (offsetDebugger)
				offsetDebugger.style.transform = `rotate(${
					radOffset.target.current * (180 / Math.PI)
				}deg)`

			setActiveIndex(getActiveAngularStep(_radOffset))
		}
	})

	const {listeners} = useTrackDragInertia({
		onMotion: ({deltaY}) => {
			radOffset.target.current = radOffset.target.current + deltaY / 200
			hasInteracted.current = true
		},
		weight: 0.98
	})

	useWheel(({deltaY}) => {
		if (!open) return
		radOffset.target.current = radOffset.target.current + deltaY / 200
		hasInteracted.current = true
	}, listRef)

	// useEffect(() => {
	// 	if (!listRef.current) return

	// 	const listElm = listRef.current
	// 	const childElements = Array.from(listRef.current.children) as HTMLDivElement[]

	// 	const radius = 300 // adjust the radius as needed
	// 	const angleIncrement = (2 * Math.PI) / childElements.length

	// 	let ticker = 0

	// 	const animateElements = () => {
	// 		childElements.forEach((child, index) => {
	// 			const angle = mod(index * angleIncrement + ticker, Math.PI * 2)
	// 			const y = radius * Math.cos(angle) + radius
	// 			const z = radius * Math.sin(angle) // translate center of circle -radius on z
	// 			const x = 0
	// 			const opacity = Math.sin(angle - Math.PI / 2) * 0.5 + 0.5

	// 			index === 0 && console.log({angle, opacity})

	// 			// Calculate the rotation angle to match the tangent of the imaginary circle
	// 			const rotationAngle = angle - Math.PI

	// 			child.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotationAngle}rad)`
	// 			child.style.zIndex = Math.round(z).toString() // set z-index based on z coordinate
	// 			child.style.opacity = opacity.toString() // fade out elements as they move away from the center
	// 		})

	// 		// requestAnimationFrame(animateElements)
	// 	}

	// 	animateElements()

	// 	const handleWheel = (event: WheelEvent) => {
	// 		ticker -= event.deltaY * 0.001 // adjust the speed of animation based on wheel delta

	// 		event.preventDefault()
	// 		animateElements()
	// 	}

	// 	listRef.current.addEventListener('wheel', handleWheel)

	// 	return () => {
	// 		listElm?.removeEventListener('wheel', handleWheel)
	// 	}
	// }, [])

	return (
		/* @ts-ignore */
		<div
			{...listeners}
			className={cn(
				'fixed right-sides top-header flex h-fold items-center justify-center [perspective:2500px]',
				debug ? 'w-col-12 bg-black' : 'w-col-6'
			)}
			ref={listRef}>
			{posts.map((p, idx) => (
				<div
					style={{
						background: idx === 0 && debug ? 'red' : 'transparent',
						backfaceVisibility: backface ? 'visible' : 'hidden',
						transformStyle: 'preserve-3d',
						...getItemProps(idx).style
					}}
					className='absolute'
					key={p._id}>
					<BlogPostPreview {...p} />
				</div>
			))}
		</div>
	)
}
