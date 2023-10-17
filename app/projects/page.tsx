import {PortableText} from '@portabletext/react'
import {ArrowUpRightIcon} from 'lucide-react'
import Link from 'next/link'
import {getMetadata} from '../../lib/utils'
import {getProjects} from '../../sanity/sanity-utils'
import {Project} from '../../types/sanity'
import Button from '../components/Button'

export const metadata = getMetadata({title: 'Projects'})

type ProjectCardProps = {
	project: Project
}

const ProjectCard = ({project: {url, name, content}}: ProjectCardProps) => (
	<Link
		className='group relative w-full rounded-xl border bg-white p-10 opacity-90 shadow-2xl transition-opacity hover:!opacity-100 dark:bg-black'
		href={url}
		target='_blank'>
		<ArrowUpRightIcon className='absolute right-0 top-0 h-16 w-16 text-black opacity-0 transition-opacity group-hover:opacity-50 dark:text-white' />
		<div className='w-full space-y-4 text-black/60 transition-colors group-hover:text-black  dark:text-white/60 group-hover:dark:text-white'>
			<h2 className='font-neue-bit text-4xl'>{name}</h2>
			<PortableText value={content} />
		</div>
	</Link>
)

export const revalidate = 60 // revalidate this page every 60 seconds

const Projects = async () => {
	const projects = await getProjects()
	return (
		<div className='mb-20 mt-28 flex w-full flex-col items-center px-5 sm:px-10 2xl:justify-center'>
			<div className='flex h-full max-w-3xl flex-col gap-10'>
				<h1>Projects</h1>
				<div className='z-20 mx-auto flex max-w-xl flex-col items-center gap-10 py-10'>
					{projects.map((project: Project) => (
						<ProjectCard
							key={project._id}
							project={project}
						/>
					))}
					<Button
						className='mt-20'
						body='Want to be on the list?'
						variant='light'
						href='/contact'
					/>
				</div>
			</div>
		</div>
	)
}

export default Projects
