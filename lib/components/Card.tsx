import { PortableText } from '@portabletext/react'
import { ArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import type { PortableTextBlock } from 'sanity'

type CardProps = {
	url: string
	title: string
	body?: string | PortableTextBlock[]
	target?: '_blank' | '_parent' | '_self' | 'top'
	date?: string
	isLatest?: boolean
}

export const Card = ({ url, title, body, target = '_blank', date, isLatest }: CardProps) => {
	return (
		<Link
			className="group relative w-full rounded-md border border-secondary bg-white p-7 no-underline sm:p-10 dark:bg-black"
			href={url}
			target={target}
		>
			<div className="flex h-full flex-col items-start justify-start gap-1 py-2 sm:gap-5">
				<h1 className="leading-[3.25rem]">{title}</h1>
				{body && (
					<div className="flex h-full items-start">
						{typeof body === 'string' ? (
							<p className="text-lg text-tertiary">{body}</p>
						) : (
							<PortableText value={body} />
						)}
					</div>
				)}
				{date && <p className="text-tertiary">{date}</p>}
			</div>
			{isLatest && (
				<div className="absolute right-5 bottom-5 flex items-center gap-1 rounded-full border border-secondary px-1 py-0.5">
					<span className="flex h-3 w-3 animate-pulse rounded-full bg-green-500 duration-300 dark:bg-lime-500" />
					<span className="text-primary text-xs">Latest</span>
				</div>
			)}
			<ArrowUpRightIcon className="group-hover:-translate-y-1 absolute top-4 right-4 h-8 w-8 text-neutral-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-secondary group-hover:opacity-100" />
		</Link>
	)
}
