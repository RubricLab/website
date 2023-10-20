import {getMetadata} from '../../lib/utils'
import {getProjects} from '../../sanity/sanity-utils'
import {Project} from '../../types/sanity'
import Button from '../components/Button'
import {ProjectCard} from '../components/ProjectCard'

export const metadata = getMetadata({title: 'Projects'})

export const revalidate = 60 // revalidate this page every 60 seconds

const Projects = async () => {
	const projects = await getProjects()

	return (
		<div className='mb-20 mt-28 flex w-full flex-col items-center 2xl:justify-center'>
			<div className='flex h-full flex-col gap-20 p-8'>
				<h1>Projects</h1>
				<div className='flex max-w-3xl flex-col gap-5'>
					{projects.map((project: Project) => (
						<ProjectCard
							body={project.content}
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
