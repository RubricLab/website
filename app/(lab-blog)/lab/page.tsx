'use client'

import BackgroundGrid from '@/common/lab-blog-layout/background-grid'
import {useEffect, useRef} from 'react'

const ContentBox = ({title, paragraph}: {title: string; paragraph: string}) => (
	<div className='max-w-[49ch] border border-border bg-black uppercase px-em-[24] py-em-[32] text-em-[14/16] 2xl:text-em-[16/16]'>
		<h5 className='text-em-[22] 2xl:text-em-[24]'>{title}</h5>
		<p className='opacity-70 mt-em-[16]'>{paragraph}</p>
	</div>
)

const ProjectContent = () => (
	<div>
		<article className='uppercase'>
			<h3 className='text-em-[72/16] 2xl:text-em-[96/16]'>Maige</h3>
			<p className='text-[#B3B3B3] mt-em-[14] text-em-[28/16] 2xl:text-em-[40/16]'>
				Your Intelligent Codebase Copilot
			</p>
			<div className='mt-em-[24] text-em-[22/16] 2xl:text-em-[28/16]'>
				<span className='border border-border px-em-[14] py-em-[4]'>ai</span>
			</div>
		</article>
		<div className='h-screen mt-em-[56]'>
			<ContentBox
				title='WHY A CLI?'
				paragraph='Analyze, refactor, and optimize your codebase effortlessly through intuitive language-driven operations.'
			/>
			<div className='max-w-max translate-x-[90%] mt-em-[-24]'>
				<ContentBox
					title='WHAT DID WE LEARN?'
					paragraph='Harness the power of AI to streamline your development process. Interact with your code using plain English commands, making complex tasks accessible to developers of all levels.'
				/>
			</div>
		</div>
	</div>
)

const Progress = () => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleScroll = () => {
			if (!ref.current) return;

			const scrollPosition = window.scrollY;
			const windowHeight = window.innerHeight;
			const projectsSection = document.getElementById('projects');

			if (!projectsSection) return;

			const projectsSectionTop = projectsSection.offsetTop;
			const projectsSectionBottom = projectsSectionTop + projectsSection.offsetHeight;

			const scrollPercentage = (scrollPosition + windowHeight - projectsSectionTop) / (projectsSectionBottom - projectsSectionTop);
			const scale = Math.max(0, Math.min(1, scrollPercentage));

			ref.current.style.transform = `translateX(${-(1 - scale)*100}%)`;
		};

		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<div
			className='w-full -translate-x-full bg-white/5 h-full'
			ref={ref}>
		</div>
	)
}

export default function LabPage() {
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
				className='relative grid grid-cols-12 items-start'>
				<div className='col-[1/8]'>
					<ProjectContent />
					<ProjectContent />
					<ProjectContent />
				</div>
				<aside className='sticky top-header col-[8/13] h-fold items-center'>
					<div className='h-full border border-border bg-black -translate-x-px w-[calc(100%+1px)]'></div>
				</aside>
			</section>
			<div className='fixed bottom-0 left-0 flex h-10 w-full border-t border-border bg-black px-sides'>
				<div className='relative w-full border-x border-border overflow-hidden'>
					<div className='absolute inset-0'>
						<Progress />
					</div>
				</div>
			</div>
		</>
	)
}
