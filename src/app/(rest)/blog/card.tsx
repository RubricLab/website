import Link from 'next/link'
import React from 'react'
import { cn } from '~/lib/utils/cn'
import { formatDate } from '~/lib/utils/date'
import { CustomImage } from '~/ui/custom-image'

export const Card = ({
	post,
	imgSrc,
	imgAlt,
	className
}: {
	post: { slug: string; title: string; category: string; date: string }
	imgSrc: string
	imgAlt: string
	className?: string
}) => {
	return (
		<Link
			href={`/blog/${post.slug}`}
			key={post.slug}
			className={cn('group col-span-1 space-y-2', className)}
		>
			<div className="relative aspect-square w-full">
				<CustomImage
					src={imgSrc}
					alt={imgAlt}
					className="object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
				/>
			</div>
			<p className="max-w-full pt-4 text-lg">{post.title}</p>
			<div className="flex items-center gap-4 text-sm">
				<p>{post.category}</p>
				<p className="text-secondary">{formatDate(post.date)}</p>
			</div>
		</Link>
	)
}
