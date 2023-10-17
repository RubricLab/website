import {ArrowUpRight} from 'lucide-react'
import Link from 'next/link'
import Button from './Button'

function Card({
	title,
	desc,
	href
}: {
	title: string
	desc: string
	href: string
}) {
	return (
		<div className='flex gap-3 rounded-xl border-2 border-neutral-500 bg-neutral-200 p-10 text-black shadow-2xl dark:bg-neutral-950 dark:text-white sm:flex-row sm:items-center sm:gap-5'>
			<div className='flex flex-col items-start gap-3 sm:w-3/4 sm:flex-row sm:items-center sm:gap-5'>
				<h1 className='text-5xl sm:w-1/3'>{title}</h1>
				<p className='text-lg sm:w-2/3'>{desc}</p>
			</div>
			<div className='flex items-center justify-center sm:w-1/4'>
				<Link
					className='group h-fit rounded-md bg-neutral-200 p-5 text-inherit dark:bg-neutral-900'
					href={href}>
					<ArrowUpRight className='transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1' />
				</Link>
			</div>
		</div>
	)
}

const projects = [
	{
		title: 'Cal.ai',
		desc: 'An AI personal assistant that manages your calendar.',
		href: 'https://cal.ai/'
	},
	{
		title: 'Maige',
		desc: 'A bot that labels your GitHub issues using AI.',
		href: 'https://maige.app/'
	},
	{
		title: 'Neat',
		desc: 'A unified inbox for your notifications. Used by 3000+ developers.',
		href: 'https://neat.run/'
	}
]

export default function Projects() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-20 bg-neutral-100 p-8 dark:bg-gradient-to-b dark:from-black dark:via-neutral-950 dark:to-black'>
			<h1 className='text-black dark:text-white'>_featured projects</h1>
			<div className='flex max-w-4xl flex-col gap-5'>
				{projects.map(project => (
					<Card
						key={project.title}
						title={project.title}
						desc={project.desc}
						href={project.href}
					/>
				))}
			</div>
			<Button
				body='Learn more'
				variant='dark'
				href='/projects'
				className='w-fit'
			/>
		</div>
	)
}
