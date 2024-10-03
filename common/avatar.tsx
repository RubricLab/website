'use client'
import { BaseHubImage } from 'basehub/next-image'
import clsx from 'clsx'

import type { AuthorFragment, AvatarFragment } from '@/lib/basehub/fragments'

import type { ImageProps } from 'next/image'
import { CustomTooltip } from './tooltip'

export function Author({
	image,
	_title,
	...props
}: AuthorFragment & Omit<ImageProps, 'src' | 'alt'>) {
	return (
		<CustomTooltip content={_title}>
			<BaseHubImage
				alt={image.alt ?? `Avatar for ${_title}`}
				className="size-em-[32] border border-border bg-surface object-cover transition-all"
				height={image.height}
				src={image.url}
				width={image.width}
				{...props}
			/>
		</CustomTooltip>
	)
}

export function Avatar({
	className,
	alt,
	url,
	...props
}: AvatarFragment & Omit<ImageProps, 'src' | 'alt'>) {
	return (
		<BaseHubImage
			priority
			alt={alt ?? 'Avatar'}
			className={clsx(
				'size-7 shrink-0 rounded-full border-2 border-surface-primary object-cover dark:border-dark-surface-primary',
				className
			)}
			height={28}
			src={url}
			width={28}
			{...props}
		/>
	)
}
