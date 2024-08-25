'use client'

import gsap from 'gsap'
import Image, {StaticImageData} from 'next/image'
import {useEffect, useRef, useState} from 'react'

import cn from '@/lib/utils/cn'
import RubricLabSampleImage from '@/public/images/rubric-lab-sample.png'

import {Button, ButtonProps} from '@/common/ui/button'
import {useBreakpoint} from '@/hooks/use-breakpoint'
import {useGSAP} from '@gsap/react'
import {GridPulseAnimation} from '../../components/grid-pulse-animation'
import LabWebGL from '../../gl'

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
				'content-box relative max-w-[49ch] overflow-hidden border border-border bg-black uppercase px-em-[24] py-em-[32] text-em-[14/16] 2xl:text-em-[16/16]',
				rest.className
			)}>
			<div
				style={{
					maskImage:
						'radial-gradient(farthest-corner at 100% 100%, black 0%, black 10%, transparent 70%)'
				}}
				className='absolute bottom-0 right-0 translate-x-[1em] translate-y-[1em] opacity-70'>
				<GridPulseAnimation
					cellSize={`2em`}
					grid={[8, 6]}
				/>
			</div>
			<h5 className='text-em-[22] 2xl:text-em-[24]'>{title}</h5>
			<p className='opacity-70 mt-em-[16]'>{paragraph}</p>
		</div>
	)
}

const FooterSlot = ({
	slot,
	ctas,
	...rest
}: {
	slot: {
		type: 'image'
		alt: string
	} & StaticImageData
	ctas: ButtonProps[]
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'slot'>) => (
	<div
		{...rest}
		className={cn('mt-em-[32]', rest.className)}>
		{slot.type === 'image' ? (
			<div className='slot-image-container overflow-hidden border border-border'>
				<Image
					className='slot-image'
					src={slot.src}
					width={slot.width}
					height={slot.height}
					alt={slot.alt}
				/>
			</div>
		) : null}
		<div className='flex items-center justify-end pt-em-[16] gap-x-em-[16]'>
			{ctas.map((cta, idx) => (
				<Button
					{...cta}
					size='lg'
					key={idx}
				/>
			))}
		</div>
	</div>
)

const ProjectContent = ({id}: {id: string}) => {
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
				speed: idx => {
					if (idx === 0) return 0

					return idx % 2 === 0 ? -0.1 : -0.5
				}
			})

			gsap.effects.imageParallax(contentImageSlot, {
				amount: 0.2,
				trigger: contentImageSlotContainer
			})
		},
		{
			dependencies: [sm],
			revertOnUpdate: true,
			scope: contentRef.current
		}
	)

	return (
		<div
			id={id}
			className='px-em-[24] lg:pr-em-[48] lg:pl-em-[24]'
			ref={contentRef}>
			<article className='uppercase'>
				<h3 className='text-em-[72/16] 2xl:text-em-[96/16]'>Maige</h3>
				<p className='text-[#B3B3B3] mt-em-[14] text-em-[28/16] 2xl:text-em-[40/16]'>
					Your Intelligent Codebase Copilot
				</p>
				<div className='mt-em-[24] text-em-[22/16] 2xl:text-em-[28/16]'>
					<span className='border border-border px-em-[14] py-em-[4]'>ai</span>
				</div>
			</article>

			<div className='flex flex-col mt-em-[56] space-y-em-[24] md:space-y-em-[-32]'>
				<ContentBox
					title='WHY A CLI?'
					paragraph='Analyze, refactor, and optimize your codebase effortlessly through intuitive language-driven operations.'
				/>
				<ContentBox
					className='ml-auto'
					title='WHAT DID WE LEARN?'
					paragraph='Harness the power of AI to streamline your development process. Interact with your code using plain English commands, making complex tasks accessible to developers of all levels.'
				/>
				<ContentBox
					title='WHAT DID WE LEARN?'
					paragraph='Harness the power of AI to streamline your development process. Interact with your code using plain English commands, making complex tasks accessible to developers of all levels.'
				/>
				<ContentBox
					className='ml-auto'
					title='WHY A CLI?'
					paragraph='Analyze, refactor, and optimize your codebase effortlessly through intuitive language-driven operations.'
				/>
			</div>

			<FooterSlot
				className='footer-slot mx-auto w-full mt-em-[56] sm:w-[80%] md:w-[65%]'
				slot={{
					type: 'image',
					...RubricLabSampleImage,
					alt: 'Rubric Lab Sample'
				}}
				ctas={[
					{
						variant: 'secondary',
						children: 'Clone the repo'
					},
					{
						variant: 'default',
						children: 'See the video'
					}
				]}
			/>
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
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let slotActive = false

		const handleScroll = () => {
			if (!ref.current) return

			const scrollPosition = window.scrollY
			const projectsSection = document.getElementById(targetId)

			if (!projectsSection) return

			const projectsSectionTop = projectsSection.offsetTop
			const projectsSectionBottom =
				projectsSectionTop + projectsSection.offsetHeight

			// Create a variable to track if the slot is active
			const _slotActive =
				scrollPosition >= projectsSectionTop &&
				scrollPosition <= projectsSectionBottom
			const scrollPercentage =
				(scrollPosition - projectsSectionTop) /
				(projectsSectionBottom - projectsSectionTop)
			const scale = Math.max(0, Math.min(1, scrollPercentage))

			if (_slotActive != slotActive) {
				onActiveChange(_slotActive)
				slotActive = _slotActive
			}

			ref.current.style.transform = `translateX(${-(1 - scale) * 100}%)`
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [targetId, name, onActiveChange])

	return (
		<button
			onClick={() => {
				const projectsSection = document.getElementById(targetId)
				if (!projectsSection) return

				window.scrollTo({
					top: projectsSection.offsetTop + window.innerHeight * 0.85,
					behavior: 'smooth'
				})
			}}
			className='relative flex flex-1 items-center overflow-hidden border-r border-border uppercase transition-[padding_font-size] px-em-[24/16] last:border-r-0'>
			<div
				className='absolute left-0 top-0 h-full w-full -translate-x-full bg-white/5'
				ref={ref}
			/>
			{name}
		</button>
	)
}

const ProgressStatus = ({
	onActiveChange
}: {
	onActiveChange: (idx: number) => void
}) => {
	const [isShrunk, setIsShrunk] = useState(true)

	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		const handleScroll = () => {
			setIsShrunk(true)
			clearTimeout(timeoutId)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			clearTimeout(timeoutId)
		}
	}, [])

	const handleMouseEnter = () => {
		setIsShrunk(false)
	}

	const handleMouseLeave = () => {
		setIsShrunk(true)
	}

	const handleFocus = () => {
		setIsShrunk(false)
	}

	const handleBlur = () => {
		setIsShrunk(true)
	}

	return (
		<div
			className={cn(
				'fixed bottom-0 left-0 flex w-full border-t border-border bg-black px-sides transition-[height]',
				{
					'h-em-[32] text-em-[12/16]': isShrunk,
					'h-em-[40]': !isShrunk
				}
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}>
			{/* extra boundary for mouse enter */}
			<div className='absolute left-0 top-0 w-full -translate-y-full h-em-[20]' />
			<div className='relative flex w-full overflow-hidden border-x border-border'>
				<ProgressSlot
					targetId='project-1'
					name='project-1'
					onActiveChange={v => {
						v && onActiveChange(0)
					}}
				/>
				<ProgressSlot
					targetId='project-2'
					name='project-2'
					onActiveChange={v => {
						v && onActiveChange(1)
					}}
				/>
				<ProgressSlot
					targetId='project-3'
					name='project-3'
					onActiveChange={v => {
						v && onActiveChange(2)
					}}
				/>
			</div>
		</div>
	)
}

export default function LabShowcase() {
	const [activeProject, setActiveProject] = useState(0)
	const [asideCanvasVisible, setAsideCanvasVisible] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY
			const threshold = (window.innerHeight * 1) / 2
			setAsideCanvasVisible(scrollPosition > threshold)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<>
			<section className='relative -mt-header flex h-screen items-center justify-center'>
				<h1 className='uppercase text-em-[72/16]'>
					<span className='opacity-20'>Rubric</span>/Lab
				</h1>
			</section>

			<section
				id='projects'
				className='relative grid grid-cols-12 items-start pb-em-[39]'>
				<div className='col-[1/-1] flex flex-col pb-em-[56] space-y-em-[220] lg:col-[1/8]'>
					<ProjectContent id='project-1' />
					<ProjectContent id='project-2' />
					<ProjectContent id='project-3' />
				</div>
				<div
					className={cn(
						'fixed right-sides top-header hidden h-fold w-[calc(var(--col-width)*5+1px)] border-l border-r border-border bg-black transition-[opacity,transform] duration-500 ease-out lg:block',
						{
							'translate-x-[0.5vw] opacity-0': !asideCanvasVisible
						}
					)}>
					<LabWebGL activeProject={activeProject} />
				</div>
			</section>

			<ProgressStatus onActiveChange={idx => setActiveProject(idx)} />
		</>
	)
}
