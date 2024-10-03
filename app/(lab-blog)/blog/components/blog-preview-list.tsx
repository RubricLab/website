'use client'
import { useLerpRef } from '@/hooks/use-lerp-ref'
import { useMeasure } from '@/hooks/use-measure'
import { useTrackDragInertia } from '@/hooks/use-track-drag'
import { useWheel } from '@/hooks/use-wheel'
import type { BlogPostCard } from '@/lib/basehub/fragments/blog'
import cn from '@/lib/utils/cn'
import { clamp, mod } from '@/lib/utils/math'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useControls } from 'leva'
import {
	type CSSProperties,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import { BlogPostPreview, type BlogPostPreviewProps } from './blogpost-preview'
import { usePreviewStore } from './preview-store'

interface BlogPreviewList {
	posts: BlogPostCard[]
}

export const BlogPreviewList = ({ posts }: BlogPreviewList) => {
	const { selectedPost } = usePreviewStore()
	const [firstPreviewBoundsRef, firstPreviewBounds] = useMeasure({
		/* ignore transformations */
		offsetSize: true
	})
	const {
		angleStep: ANGLE_STEP,
		debug,
		backface,
		affectOpacity
	} = useControls({
		angleStep: {
			value: 39.4,
			min: 5,
			max: 90
		},
		affectOpacity: true,
		backface: false,
		debug: false
	})

	const DISPLAY_LENGTH = posts.length
	const ANGLE_STEP_RAD = ANGLE_STEP * (Math.PI / 180)
	const INITIAL_OFFSET = Math.PI / 2

	const [ready, setReady] = useState(false)
	const [radius, setRadius] = useState(0)
	const wheel = useRef(0)
	const listRef = useRef<HTMLDivElement>(null)
	const [activeStep, setActiveStep] = useState(0)
	const hasInteracted = useRef(false)

	const opacity = useMemo(() => {
		const opacityEaseIn = gsap.parseEase('none')
		const opacityEaseOut = gsap.parseEase('power1.in')
		const opacityAngleRemapIn = gsap.utils.mapRange(Math.PI, Math.PI * 1.5, 0, 1)
		const opacityAngleRemapOut = gsap.utils.mapRange(
			Math.PI * 1.5,
			Math.PI * 1.5 + ANGLE_STEP_RAD,
			0,
			1
		)

		const opacity = (angle: number) => {
			if (angle >= Math.PI && angle <= Math.PI * 1.5) return opacityEaseIn(opacityAngleRemapIn(angle))

			if (angle > Math.PI * 1.5 && angle <= Math.PI * 2)
				return 1 - opacityEaseOut(opacityAngleRemapOut(angle))

			return 0
		}

		return opacity
	}, [ANGLE_STEP_RAD])

	const getItemProps = useCallback(
		(idx: number, _radOffset = 0) => {
			const anglePos = ANGLE_STEP * idx
			const anglePosRad = anglePos * (Math.PI / 180)
			const angleRad = mod(-clamp(anglePosRad + _radOffset + INITIAL_OFFSET, 0, Math.PI), Math.PI * 2)
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
				} satisfies CSSProperties
			}
		},
		[ANGLE_STEP, INITIAL_OFFSET, radius, affectOpacity, opacity]
	)

	const getAngularStepFromIndex = useCallback(
		(idx: number) => idx * -ANGLE_STEP_RAD,
		[ANGLE_STEP_RAD]
	)

	const getActiveAngularStep = useCallback(
		(radOffset: number) => {
			const activeStep = Math.round(radOffset / ANGLE_STEP_RAD)

			return {
				activeStep,
				activeRad: activeStep * ANGLE_STEP_RAD
			}
		},
		[ANGLE_STEP_RAD]
	)

	const radOffset = useLerpRef(0, {
		lerp: 0.24,
		onTick: () => {
			if (!listRef.current) return

			const _radOffset = radOffset.current.current
			const items = listRef.current.childNodes as NodeListOf<HTMLElement>

			items.forEach((item, idx) => {
				const { style, attrs } = getItemProps(idx, _radOffset)

				item.style.transform = style.transform
				item.style.zIndex = style.zIndex
				item.style.opacity = style.opacity.toString()

				for (const [key, value] of Object.entries(attrs)) {
					item.setAttribute(key, value.toString())
				}
			})

			setActiveStep(Math.abs(getActiveAngularStep(_radOffset).activeStep))
		}
	})

	const updateRadOffset = useCallback(
		({ deltaY }: { deltaY: number }) => {
			wheel.current = clamp(wheel.current + deltaY / 200, 0, ANGLE_STEP_RAD * (DISPLAY_LENGTH - 1))

			const { activeRad } = getActiveAngularStep(-wheel.current)

			radOffset.target.current = activeRad

			hasInteracted.current = true
		},
		[ANGLE_STEP_RAD, DISPLAY_LENGTH, getActiveAngularStep, radOffset.target]
	)

	const { listeners } = useTrackDragInertia({
		onMotion: updateRadOffset,
		weight: 0.98
	})

	useWheel(updateRadOffset, listRef)

	useEffect(() => {
		if (!selectedPost) return
		const selectedPostIdx = posts.findIndex(p => p._id === selectedPost._id)

		const activeIndexRad = getAngularStepFromIndex(selectedPostIdx)

		radOffset.target.current = activeIndexRad

		// Update the wheel value
		wheel.current = clamp(ANGLE_STEP_RAD * selectedPostIdx, 0, ANGLE_STEP_RAD * (DISPLAY_LENGTH - 1))
	}, [
		ANGLE_STEP_RAD,
		DISPLAY_LENGTH,
		getAngularStepFromIndex,
		posts,
		radOffset.target,
		selectedPost
	])

	useLayoutEffect(() => {
		setRadius(firstPreviewBounds.height * 0.8)
		setReady(true)
	}, [firstPreviewBounds.height])

	useGSAP(
		() => {
			if (!ready) return
			gsap.fromTo(
				radOffset.target,
				{
					current: Math.PI / 4
				},
				{
					current: 0,
					ease: 'power3.inOut',
					duration: 1
				}
			)
		},
		{
			scope: listRef,
			dependencies: [ready]
		}
	)

	return (
		/* @ts-ignore */
		<div
			{...listeners}
			style={
				{
					'--radius': radius,
					perspective: radius * 5.6
				} as CSSProperties
			}
			className={cn(
				'fixed top-header right-sides hidden h-fold items-center justify-center transition-opacity duration-700 ease-in lg:flex',
				debug ? 'w-col-12 bg-black' : 'w-col-6',
				{ 'opacity-0': !ready }
			)}
			ref={listRef}
		>
			{posts.map((p, idx) => (
				<div
					style={{
						background: idx === 0 && debug ? 'red' : 'transparent',
						backfaceVisibility: backface ? 'visible' : 'hidden',
						transformStyle: 'preserve-3d',
						pointerEvents: activeStep === idx ? 'auto' : 'none',
						...getItemProps(idx).style
					}}
					className="absolute"
					ref={idx === 0 ? firstPreviewBoundsRef : undefined}
					key={p._id}
				>
					<BlogPostPreview
						active={activeStep === idx}
						flap={['left', 'center', 'right'][idx % 3] as BlogPostPreviewProps['flap']}
						{...p}
					/>
				</div>
			))}
		</div>
	)
}
