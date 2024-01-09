import Button from './Button'
import {Card} from './Card'

const projects = [
	{
		desc: 'AI assistant for your calendar.',
		href: 'https://cal.ai/',
		title: 'Cal.ai'
	},
	{
		desc: 'AI-generated video of your code contributions.',
		href: 'https://year-in-code.com/',
		title: 'Graphite'
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
			className='flex min-h-screen flex-col items-center justify-center gap-16 bg-neutral-100 p-8 dark:bg-neutral-950'
			id='projects'>
			<div className='flex flex-col items-center'>
				<h1>_featured projects</h1>
				<h3>Trusted by the best.</h3>
			</div>
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
