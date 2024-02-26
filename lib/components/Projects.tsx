import {ArrowRight, ArrowUpRight} from 'lucide-react'
import Link from 'next/link'
import {Cal} from './logos/Cal'
import {Graphite} from './logos/Graphite'
import {Maige} from './logos/Maige'

const projects = [
	{
		desc: 'AI assistant for your calendar.',
		href: 'https://cal.ai/',
		title: 'Cal.ai',
		logo: (
			<Cal
				key='cal'
				className='w-28'
			/>
		)
	},
	{
		desc: 'AI generated video of your code contributions.',
		href: 'https://year-in-code.com/',
		title: 'Year in Code',
		logo: <Graphite key='graphite' />
	},
	{
		desc:
			'Open-source infrastructure for running natural language workflows on your codebase.',
		href: 'https://maige.app/',
		title: 'Maige',
		logo: (
			<Link
				href='https://maige.app'
				target='_blank'
				rel='noreferrer noopener'
				className='flex items-center gap-2 no-underline'>
				<Maige
					key='maige'
					className='w-8'
				/>
				<span className='font-mono text-2xl'>maige</span>
			</Link>
		)
	}
]

export default function Projects() {
	return (
		<div
			className='flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-neutral-100 p-5 py-28 sm:px-10 dark:bg-neutral-900'
			id='projects'>
			<div className='flex flex-col items-start sm:items-center'>
				<h1>_featured projects</h1>
				<h3 className='text-secondary'>We work with the best.</h3>
			</div>
			<div className='grid gap-5 sm:grid-cols-2'>
				{projects.map(({title, desc, href, logo}) => (
					<div
						key={title}
						className='border-secondary group col-span-1 flex h-[50vh] w-full max-w-[50vh] flex-col gap-2 border p-5 transition-colors hover:border-white'>
						<div className='text-4xl font-semibold'>{title}</div>
						<p className='text-secondary text-lg leading-6'>{desc}</p>
						<div className='grow' />
						<div className='flex w-full items-center justify-between'>
							<div className='text-secondary w-40 text-opacity-60'>{logo}</div>
							<Link
								className='group/link ml-auto flex gap-1 opacity-0 transition-opacity delay-200 duration-500 group-hover:opacity-100'
								href={href}>
								<span>Learn more</span>
								<ArrowUpRight className='w-4 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1' />
							</Link>
						</div>
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
