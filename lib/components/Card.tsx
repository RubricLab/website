import {PortableText} from '@portabletext/react'
import {ArrowUpRightIcon} from 'lucide-react'
import Link from 'next/link'
import {PortableTextBlock} from 'sanity'

type CardProps = {
	url: string
	title: string
	body?: string | PortableTextBlock[]
	target?: '_blank' | '_parent' | '_self' | 'top'
}

export const Card = ({url, title, body, target = '_blank'}: CardProps) => {
	return (
		<Link
			className='border-secondary group relative w-full rounded-md border bg-white p-7 no-underline sm:p-10 dark:bg-black'
			href={url}
			target={target}>
			<div className='flex h-full flex-col items-start justify-start gap-1 py-2 sm:gap-5'>
				<h1 className='leading-[3.25rem]'>{title}</h1>
				{body && (
					<div className='flex h-full items-start'>
						{typeof body === 'string' ? (
							<p className='text-tertiary text-lg'>{body}</p>
						) : (
							<PortableText value={body} />
						)}
					</div>
				)}
			</div>
			<ArrowUpRightIcon className='group-hover:text-secondary absolute right-4 top-4 h-8 w-8 text-neutral-500 opacity-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100' />
		</Link>
	)
}
