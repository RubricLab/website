import Button from './Button'
import {ProjectCard} from './ProjectCard'

const projects = [
	{
		desc: 'An AI personal assistant that manages your calendar.',
		href: 'https://cal.ai/',
		title: 'Cal.ai'
	},
	{
		desc: 'A bot that labels your GitHub issues using AI.',
		href: 'https://maige.app/',
		title: 'Maige'
	},
	{
		desc: 'A unified inbox for your notifications. Used by 3000+ developers.',
		href: 'https://neat.run/',
		title: 'Neat'
	}
]

export default function Projects() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-20 bg-neutral-100 p-8 dark:bg-gradient-to-b dark:from-black dark:via-neutral-950 dark:to-black'>
			<h1 className='text-black dark:text-white'>_featured projects</h1>
			<div className='flex max-w-4xl flex-col gap-5'>
				{projects.map(project => (
					<ProjectCard
						body={project.desc}
						key={project.title}
						title={project.title}
						url={project.href}
					/>
				))}
			</div>
			<Button
				body='Learn more'
				className='w-fit'
				href='/projects'
				variant='dark'
			/>
		</div>
	)
}
