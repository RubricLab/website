import Button from './Button'
import {Card} from './Card'

const projects = [
	{
		desc: 'An AI personal assistant that manages your calendar.',
		href: 'https://cal.ai/',
		title: 'Cal.ai'
	},
	{
		desc: 'A bot that labels your GitHub issues using AI. Used in 400+ projects.',
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
		<div
			className='flex min-h-screen flex-col items-center justify-center gap-16 bg-neutral-100 p-8 dark:bg-gradient-to-b dark:from-black dark:via-neutral-950 dark:to-black'
			id='projects'>
			<h1 className='text-black dark:text-white'>_featured projects</h1>
			<div className='flex max-w-xl flex-col gap-5'>
				{projects.map(project => (
					<Card
						body={project.desc}
						key={project.title}
						title={project.title}
						url={project.href}
					/>
				))}
				<Button
					body='Explore more'
					className='mt-7'
					href='/projects'
					variant='dark'
				/>
			</div>
		</div>
	)
}
