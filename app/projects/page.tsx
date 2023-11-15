import Button from '~/components/Button'
import {Card} from '~/components/Card'
import {getProjects} from '~/sanity/utils'
import {Project} from '~/types/sanity'
import getMetadata from '~/utils/getMetadata'

export const metadata = getMetadata({title: 'Projects'})

export const revalidate = 60 // revalidate this page every 60 seconds

const Projects = async () => {
	const projects = await getProjects()

	return (
		<div className='my-28 flex w-full flex-col items-center 2xl:justify-center'>
			<div className='flex h-full flex-col gap-20 p-8'>
				<h1>Projects</h1>
				<div className='flex max-w-3xl flex-col gap-5'>
					{projects.map((project: Project) => (
						<Card
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
