import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from '~/lib/utils/cn'

export const Card = ({
	post,
	imgSrc,
	className
}: {
	post: { slug: string; title: string; category: string; date: string }
	imgSrc: StaticImageData | string
	className?: string
}) => {
	return (
		<Link
			href={`/blog/${post.slug}`}
			key={post.slug}
			className={cn('col-span-4 space-y-2', className)}
		>
			<div className="relative aspect-square w-full">
				<Image src={imgSrc} alt="Abstract plant image" fill />
			</div>
			<p className="max-w-full pt-4 text-lg">{post.title}</p>
			<div className="flex gap-4 text-sm">
				<p className="font-mono">{post.category}</p>
				<p className="opacity-50">{post.date}</p>
			</div>
		</Link>
	)
}
