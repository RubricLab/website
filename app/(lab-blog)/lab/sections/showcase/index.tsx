'use client'

import gsap from 'gsap'
import Image, { type StaticImageData } from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

import cn from '@/lib/utils/cn'

import { Button, type ButtonProps } from '@/common/ui/button'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import useWindowSize from '@/hooks/use-window-size'
import type { LabProjectFragment } from '@/lib/basehub/fragments/lab'
import { useGSAP } from '@gsap/react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { GridPulseAnimation } from '../../components/grid-pulse-animation'

const LabWebGL = dynamic(() => import('../../gl'))

const ContentBox = ({
	title,
	paragraph,
	...rest
}: {
	title: string
	paragraph: string
} & React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			{...rest}
			className={cn(
				'relative max-w-[49ch] overflow-hidden border border-border bg-surface px-em-[24] py-em-[32] text-em-[14/16] content-box 2xl:text-em-[16/16]',
				rest.className
			)}
		>
			<div
				style={{
					maskImage:
						'radial-gradient(farthest-corner at 100% 100%, black 0%, black 10%, transparent 70%)'
				}}
				className="absolute right-0 bottom-0 translate-x-[1em] translate-y-[1em] opacity-70"
			>
				<GridPulseAnimation cellSize={'2em'} grid={[8, 6]} />
			</div>
			<h5 className="text-em-[22] 2xl:text-em-[24]">{title}</h5>
			<p className="mt-em-[16] opacity-70">{paragraph}</p>
		</div>
	)
}

const FooterSlot = ({
	slot,
	ctas,
	...rest
}: {
	slot:
		| ({
				type: 'image'
				alt: string
		  } & StaticImageData)
		| {
				type: 'video'
				width: number
				height: number
				url: string
		  }
	ctas: { label: string; href: string; variant: ButtonProps['variant'] }[]
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'slot'>) => (
	<div {...rest} className={cn('mt-em-[32]', rest.className)}>
		<div className="slot-image-container overflow-hidden border border-border">
			{slot.type === 'image' ? (
				<Image
					className="slot-image"
					src={slot.src}
					width={slot.width}
					height={slot.height}
					alt={slot.alt}
				/>
			) : (
				<video
					loop
					className="w-full"
					autoPlay
					muted
					style={{
						aspectRatio: slot.width / slot.height
					}}
					playsInline
					src={slot.url}
				/>
			)}
		</div>
		<div className="flex items-center justify-end gap-x-em-[16] pt-em-[16]">
			{ctas.map((cta, idx) => (
				<Button {...cta} size="lg" key={idx} variant={cta.variant} asChild>
					<Link href={cta.href}>{cta.label}</Link>
				</Button>
			))}
		</div>
	</div>
)

const ProjectContent = (props: LabProjectFragment) => {
	const contentRef = useRef<HTMLDivElement>()
	const sm = useBreakpoint('sm')

	useGSAP(
		() => {
			if (!contentRef.current || !sm) return
			const root = gsap.utils.selector(contentRef.current)

			const contentBoxes = root('.content-box')
			const contentImageSlot = root('.slot-image-container .slot-image')
			const contentImageSlotContainer = root('.slot-image-container')

			gsap.effects.parallax(contentBoxes, {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				speed: (idx: any) => {
					if (idx === 0) return 0

					return idx % 2 === 0 ? -0.1 : -0.5
				}
			})

			gsap.effects.imageParallax(contentImageSlot, {
				amount: 0.2,
				trigger: contentImageSlotContainer
			})
		},
		// @ts-ignore
		{
			dependencies: [sm],
			revertOnUpdate: true,
			scope: contentRef.current
		}
	)

	return (
		<div
			id={props._id}
			className="scroll-mt-[10vh] px-em-[24] lg:pr-em-[48] lg:pl-em-[24]"
			// @ts-ignore
			ref={contentRef}
		>
			<article className="">
				<h3 className="text-em-[56] md:text-em-[72/16] 2xl:text-em-[96/16]">{props._title}</h3>
				<p className="mt-em-[14] text-[#B3B3B3] text-em-[22/16] md:text-em-[28/16] 2xl:text-em-[40/16]">
					{props.description}
				</p>
			</article>

			<div className="mt-em-[56/16] flex flex-col space-y-em-[24] md:space-y-em-[-32]">
				{props.qa.items.map((qa, idx) => {
					return (
						<ContentBox
							key={qa._id}
							className={idx % 2 === 1 ? 'ml-auto' : undefined}
							title={qa.question}
							paragraph={qa.answer}
						/>
					)
				})}
			</div>

			{props.footerMedia ? (
				<FooterSlot
					className="footer-slot mx-auto mt-em-[56] w-full sm:w-[80%] md:w-[65%]"
					// @ts-ignore
					slot={
						'image' in props.footerMedia
							? {
									type: 'image',
									alt: props.footerMedia.image?.alt,
									src: props.footerMedia.image?.url,
									width: props.footerMedia.image?.width,
									height: props.footerMedia.image?.height,
									blurDataURL: props.footerMedia.image?.blurDataURL
								}
							: {
									type: 'video',
									url: props.footerMedia.video?.url,
									height: props.footerMedia.video?.height,
									width: props.footerMedia.video?.width
								}
					}
					ctas={props.ctas.items.map(cta => ({
						variant: cta.type,
						href: cta.href,
						label: cta.label
					}))}
				/>
			) : (
				<></>
			)}
		</div>
	)
}

const ProgressSlot = ({
	targetId,
	name,
	onActiveChange
}: {
	targetId: string
	name: string
	onActiveChange: (active: boolean) => void
}) => {
	const w = useWindowSize()
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let slotActive = false
		const targetSection = document.getElementById(targetId)

		if (!targetSection) return

		const update = () => {
			if (!ref.current) return

			const scrollPosition = window.scrollY
			const sectionBounds = targetSection.getBoundingClientRect()

			/* 
				0% - the bottom of the screen reaches the target section top
				100% - the bottom of the screen reaches the target section end
			*/
			const distanceFromSectionToPageTop = sectionBounds.top + scrollPosition
			const _slotActive =
				scrollPosition + (w?.height ?? 0) > distanceFromSectionToPageTop &&
				scrollPosition + (w?.height ?? 0) < distanceFromSectionToPageTop + sectionBounds.height

			const scrollPercentage =
				(scrollPosition + (w?.height ?? 0) - distanceFromSectionToPageTop) / sectionBounds.height

			const scale = Math.max(0, Math.min(1, scrollPercentage))

			if (_slotActive !== slotActive) {
				onActiveChange(_slotActive)
				slotActive = _slotActive
			}

			ref.current.style.transform = `translateX(${-(1 - scale) * 100}%)`
		}

		update()

		window.addEventListener('scroll', update)

		return () => {
			window.removeEventListener('scroll', update)
		}
	}, [targetId, w?.height, onActiveChange])

	return (
		<button
			type="button"
			onClick={() => {
				const projectsSection = document.getElementById(targetId)
				if (!projectsSection) return

				projectsSection.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			}}
			className="relative flex flex-1 items-center overflow-hidden border-border border-r px-em-[24/16] transition-[padding_font-size] last:border-r-0"
		>
			<div className="-translate-x-full absolute top-0 left-0 h-full w-full bg-white/5" ref={ref} />
			<span className="inline-block w-full max-w-max overflow-hidden text-ellipsis whitespace-nowrap">
				{name}
			</span>
		</button>
	)
}

const ProgressStatus = ({
	targets,
	onActiveChange
}: {
	targets: { id: string; label: string }[]
	onActiveChange: (idx: string) => void
}) => {
	const [isShrunk, setIsShrunk] = useState(true)
	const [timeoutId] = useState<NodeJS.Timeout>()
	const lg = useBreakpoint('lg')

	useEffect(() => {
		const handleScroll = () => {
			setIsShrunk(true)
			clearTimeout(timeoutId)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			clearTimeout(timeoutId)
		}
	}, [timeoutId])

	const handleMouseEnter = () => {
		if (!lg) return
		setIsShrunk(false)
	}

	const handleMouseLeave = () => {
		if (!lg) return
		setIsShrunk(true)
	}

	const handleFocus = () => {
		if (!lg) return
		setIsShrunk(false)
	}

	const handleBlur = () => {
		if (!lg) return
		setIsShrunk(true)
	}

	return (
		<div
			id="progress-bar"
			className={cn(
				'fixed bottom-0 left-0 flex w-full border-border border-t bg-surface px-sides opacity-0 transition-[height]',
				{
					'h-em-[32] text-em-[12/16]': isShrunk,
					'lg:h-em-[40]': !isShrunk
				}
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
		>
			{/* extra boundary for mouse enter */}
			<div className="-translate-y-full absolute top-0 left-0 hidden h-em-[20] w-full lg:block" />
			<div className="relative flex w-full overflow-hidden border-border border-x">
				{targets.map(t => (
					<ProgressSlot
						targetId={t.id}
						name={t.label}
						onActiveChange={v => {
							v && onActiveChange(t.id)
						}}
						key={t.id}
					/>
				))}
			</div>
		</div>
	)
}

type LabShowcaseProps = {
	showcase: LabProjectFragment[]
}

export default function LabShowcase({ showcase }: LabShowcaseProps) {
	const [activeProjectId, setActiveProjectId] = useState(showcase[0]?._id)
	const lg = useBreakpoint('lg')

	const activeProject = useMemo(() => {
		return showcase.find(p => p._id === activeProjectId)
	}, [activeProjectId, showcase])

	useGSAP(() => {
		gsap.fromTo(
			'#progress-bar',
			{
				y: '100%',
				opacity: 0
			},
			{
				y: '0%',
				opacity: 1,
				scrollTrigger: {
					trigger: '#projects',
					start: 'top center',
					end: 'top+=5% center',
					scrub: true
				}
			}
		)

		const stConfig: ScrollTrigger.Vars = {
			trigger: '#projects',
			start: 'top center',
			end: 'top+=5% center',
			scrub: true
		}

		gsap.fromTo(
			'#progress-bar',
			{
				y: '100%',
				opacity: 0
			},
			{
				y: '0%',
				opacity: 1,
				scrollTrigger: stConfig
			}
		)

		gsap.fromTo(
			'#aside-webgl',
			{
				opacity: 0
			},
			{
				opacity: 1,
				scrollTrigger: stConfig
			}
		)
	}, [])

	return (
		<>
			<section
				id="projects"
				className="relative grid grid-cols-12 items-start pt-em-[128] pb-em-[39] lg:pt-em-[196]"
			>
				<div className="col-[1/-1] flex flex-col space-y-em-[128] pb-em-[56] md:space-y-em-[196] lg:col-[1/8]">
					{showcase.map(project => (
						<ProjectContent {...project} key={project._id} />
					))}
				</div>
				<div
					id="aside-webgl"
					className={cn(
						'fixed top-header right-sides hidden h-fold w-[calc(var(--col-width)*5+1px)] border-border border-r border-l bg-black opacity-0 lg:block'
					)}
				>
					{lg && (
						<ErrorBoundary
							errorComponent={e => {
								return (
									<div className="flex h-full w-full flex-col items-center justify-center gap-y-em-[32] pb-em-[32]">
										<svg width="25%" viewBox="0 0 1356 1278" fill="none" xmlns="http://www.w3.org/2000/svg">
											<title>Error Icon</title>
											<path
												d="M316.1 305V179L845.1 34L1345.1 289V1078L659.1 1267L160.1 1014L161.1 385L316.1 305Z"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
											/>
											<path
												d="M659.1 1267V479L1345.1 289"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
											/>
											<path
												d="M659.1 486L303.1 298"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
												stroke-linejoin="round"
											/>
											<path
												d="M161.1 385L318.1 464L321.1 307L461.1 251L348.1 195L316.1 179M439.1 532L364.1 566"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
											/>
											<path
												d="M460.1 595L415.1 462L319.1 411M559.1 152L571.1 203L498.1 190L399.1 220M234.1 422V516M77.8 12L210.3 36.6L274.7 121.5L209.5 256.5L76.5 232.1L12 147.6L77.8 12Z"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
											/>
											<path
												d="M76.5 232.1L141.6 97.3L274.7 121.5"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
											/>
											<path
												d="M141.101 98.5L77.801 12"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
												stroke-linejoin="round"
											/>
											<path
												d="M1054 884.301L1002 897.301V578L1054 566V884.301Z"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
											/>
											<path
												d="M1054 986.5L1002 999.5V943L1054 931V986.5Z"
												stroke="currentColor"
												stroke-width="8"
												stroke-miterlimit="10"
											/>
										</svg>

										<p>{e.error.message}</p>
									</div>
								)
							}}
						>
							{/*@ts-ignore*/}
							<LabWebGL activeSlug={activeProject?._slug} />
						</ErrorBoundary>
					)}
				</div>
			</section>

			<ProgressStatus
				targets={showcase.map(p => ({ id: p._id, label: p._title }))}
				onActiveChange={idx => setActiveProjectId(idx)}
			/>
		</>
	)
}
