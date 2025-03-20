import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from '~/lib/utils/cn'
import { formatDate } from '~/lib/utils/date'

export const Card = ({
	post,
	imgSrc,
	imgAlt,
	className
}: {
	post: { slug: string; title: string; category: string; date: string }
	imgSrc: StaticImageData | string
	imgAlt: string
	className?: string
}) => {
	return (
		<Link
			href={`/blog/${post.slug}`}
			key={post.slug}
			className={cn('col-span-4 space-y-2', className)}
		>
			<div className="relative h-96 w-96">
				<Image src={imgSrc} alt={imgAlt} fill className="object-cover" />
			</div>
			<p className="max-w-full pt-4 text-lg">{post.title}</p>
			<div className="flex items-center gap-4 text-sm">
				<p className="font-mono">{post.category}</p>
				<p className="opacity-50">{formatDate(post.date)}</p>
			</div>
		</Link>
	)
}
