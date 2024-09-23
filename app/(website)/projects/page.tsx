import Button from '~/components/Button'
import {Card} from '~/components/Card'
import {getProjects} from '~/sanity/utils'
import {Project} from '~/types/sanity'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({
	title: 'Projects',
	description:
		"Rubric is an applied AI lab behind Year in Code, Cal.ai, Maige, and more. We're a team of engineers, designers, and product managers who build AI-powered magical software.",
	path: 'projects'
})

export const revalidate = 60 // revalidate this page every 60 seconds

const Projects = async () => {
	const projects = await getProjects()

	return (
		<div className='my-32 flex w-full flex-col items-center 2xl:justify-center'>
			<div className='flex h-full max-w-4xl flex-col gap-16 p-5'>
				<h1>Projects</h1>
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
					{projects.map((project: Project) => (
						<Card
							body={project.content[0].children[0].text}
							key={project._id}
							title={project.name}
							url={project.url}
						/>
					))}
				</div>
				<Button
					body='Want to be on the list?'
					className='mt-20'
					href='/contact'
					variant='light'
				/>
			</div>
		</div>
	)
}

export default Projects
