import {ArrowRight, ArrowUpRight} from 'lucide-react'
import Link from 'next/link'

const projects = [
	{
		desc: 'AI assistant for your calendar.',
		href: 'https://cal.ai/',
		title: 'Cal.ai'
	},
	{
		desc: 'AI-generated video of your code contributions.',
		href: 'https://year-in-code.com/',
		title: 'Year in Code'
	},
	{
		desc: 'AI-powered software maintenance.',
		href: 'https://maige.app/',
		title: 'Maige'
	}
]

export default function Projects() {
	return (
		<div
			className='flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-neutral-100 p-5 py-20 dark:bg-neutral-950 sm:p-10'
			id='projects'>
			<div className='flex flex-col items-start sm:items-center'>
				<div className='text-tertiary font-neue-bit text-3xl sm:text-4xl'>
					_featured projects
				</div>
				<h3 className='text-secondary'>We work with the best.</h3>
			</div>
			<div className='grid gap-5 sm:grid-cols-2'>
				{projects.map(({title, desc, href}) => (
					<div
						key={title}
						className='border-secondary group col-span-1 flex h-[50vh] w-full max-w-[50vh] flex-col gap-1 border p-5 transition-colors hover:border-white'>
						<div className='text-4xl font-semibold'>{title}</div>
						<p className='text-secondary text-lg leading-6'>{desc}</p>
						<div className='grow' />
						<Link
							className='group/link ml-auto flex gap-1 opacity-0 transition-opacity delay-200 duration-500 group-hover:opacity-100'
							href={href}>
							<span>Learn more</span>
							<ArrowUpRight className='w-4 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1' />
						</Link>
					</div>
				))}
				<div className='border-secondary flex w-full max-w-[50vh] items-end justify-end border border-dashed p-5 sm:h-[50vh]'>
					<Link
						href='/projects'
						className='group flex gap-2'>
						<span>See all projects</span>
						<ArrowRight className='w-4 transition-transform group-hover:translate-x-1' />
					</Link>
				</div>
			</div>
		</div>
	)
}
