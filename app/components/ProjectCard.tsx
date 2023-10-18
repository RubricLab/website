import {PortableText} from '@portabletext/react'
import {ArrowUpRightIcon} from 'lucide-react'
import Link from 'next/link'

import {PortableTextBlock} from 'sanity'

type ProjectCardProps = {
	url: string
	title: string
	body: string | PortableTextBlock[]
}

export const ProjectCard = ({url, title, body}: ProjectCardProps) => {
	return (
		<Link
			className='group relative w-full rounded-xl border-2 border-neutral-400 bg-white p-10 dark:border-neutral-700 dark:bg-black'
			href={url}
			target='_blank'>
			<div className='flex flex-col items-start gap-3 sm:w-3/4 sm:flex-row sm:items-center sm:gap-5'>
				<h1 className='text-primary text-5xl sm:w-1/3'>{title}</h1>
				<div className='sm:w-2/3'>
					{typeof body === 'string' ? (
						<p className='text-secondary text-lg'>{body}</p>
					) : (
						<PortableText value={body} />
					)}
				</div>
			</div>
			<ArrowUpRightIcon className='text-tertiary group-hover:text-secondary absolute right-4 top-4 h-8 w-8 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1' />
		</Link>
	)
}
