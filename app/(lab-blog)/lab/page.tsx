'use client'

import Image, {StaticImageData} from 'next/image'
import {useEffect, useRef, useState} from 'react'

import BackgroundGrid from '@/common/lab-blog-layout/background-grid'

import cn from '@/lib/utils/cn'
import RubricLabSampleImage from '@/public/images/rubric-lab-sample.png'
import {GridPulseAnimation} from '../blog/components/grid-pulse-animation'

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
				'relative max-w-[49ch] overflow-hidden border border-border bg-black uppercase px-em-[24] py-em-[32] text-em-[14/16] 2xl:text-em-[16/16]',
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
	ctas: {children: string; variant: 'primary' | 'secondary'}[]
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'slot'>) => (
	<div
		{...rest}
		className={cn('mt-em-[32]', rest.className)}>
		{slot.type === 'image' ? (
			<Image
				className='border border-border'
				src={slot.src}
				width={slot.width}
				height={slot.height}
				alt={slot.alt}
			/>
		) : null}
		<div className='flex items-center justify-end pt-em-[16] gap-x-em-[16]'>
			{ctas.map((cta, idx) => (
				<button
					className={cn('uppercase px-em-[18] h-em-[49] text-em-[14/16]', {
						'bg-surface-contrast text-surface': cta.variant === 'primary',
						'border border-border bg-black': cta.variant === 'secondary'
					})}
					key={idx}>
					{cta.children}
				</button>
			))}
		</div>
	</div>
)

const ProjectContent = ({id}: {id: string}) => (
	<div
		id={id}
		className='pr-em-[48] pl-em-[24]'>
		<article className='uppercase'>
			<h3 className='text-em-[72/16] 2xl:text-em-[96/16]'>Maige</h3>
			<p className='text-[#B3B3B3] mt-em-[14] text-em-[28/16] 2xl:text-em-[40/16]'>
				Your Intelligent Codebase Copilot
			</p>
			<div className='mt-em-[24] text-em-[22/16] 2xl:text-em-[28/16]'>
				<span className='border border-border px-em-[14] py-em-[4]'>ai</span>
			</div>
		</article>

		<div className='flex flex-col mt-em-[56] space-y-em-[-32]'>
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
			className='mx-auto w-[65%] mt-em-[56]'
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
					variant: 'primary',
					children: 'See the video'
				}
			]}
		/>
	</div>
)

const ProgressSlot = ({targetId, name}: {targetId: string; name: string}) => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleScroll = () => {
			if (!ref.current) return

			const scrollPosition = window.scrollY
			const projectsSection = document.getElementById(targetId)

			if (!projectsSection) return

			const projectsSectionTop = projectsSection.offsetTop
			const projectsSectionBottom =
				projectsSectionTop + projectsSection.offsetHeight

			const scrollPercentage =
				(scrollPosition - projectsSectionTop) /
				(projectsSectionBottom - projectsSectionTop)
			const scale = Math.max(0, Math.min(1, scrollPercentage))

			ref.current.style.transform = `translateX(${-(1 - scale) * 100}%)`
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [targetId])

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

const ProgressStatus = () => {
	const [isShrunk, setIsShrunk] = useState(false)

	console.log({isShrunk})

	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		const handleScroll = () => {
			setIsShrunk(true)
			clearTimeout(timeoutId)
			// timeoutId = setTimeout(() => {
			// 	setIsShrunk(false)
			// }, 2000)
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
					'h-em-[20] text-em-[10/16]': isShrunk,
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
				/>
				<ProgressSlot
					targetId='project-2'
					name='project-2'
				/>
				<ProgressSlot
					targetId='project-3'
					name='project-3'
				/>
			</div>
		</div>
	)
}

export default function LabPage() {
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
			<BackgroundGrid highlightColumns={[7, 9, 11]} />
			<section className='relative -mt-header flex h-screen items-center justify-center'>
				<h1 className='uppercase text-em-[72/16]'>
					<span className='opacity-20'>Rubric</span>/Lab
				</h1>
			</section>

			<section
				id='projects'
				className='relative grid grid-cols-12 items-start pb-em-[39]'>
				<div className='col-[1/8] flex flex-col pb-em-[56] space-y-em-[220]'>
					<ProjectContent id='project-1' />
					<ProjectContent id='project-2' />
					<ProjectContent id='project-3' />
				</div>
				<div
					className={cn(
						'fixed right-sides top-header h-fold w-[calc(var(--col-width)*5+1px)] border-l border-r border-border bg-black transition-opacity duration-300 ease-out',
						{
							'opacity-0': !asideCanvasVisible
						}
					)}></div>
			</section>

			<ProgressStatus />
		</>
	)
}
