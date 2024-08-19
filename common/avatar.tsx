'use client'
import {BaseHubImage} from 'basehub/next-image'
import clsx from 'clsx'

import {type AuthorFragment, type AvatarFragment} from '@/lib/basehub/fragments'

import type {ImageProps} from 'next/image'
import {CustomTooltip} from './tooltip'

export function Author({
  image,
  _title,
  ...props
}: AuthorFragment & Omit<ImageProps, 'src' | 'alt'>) {
  return (
    <CustomTooltip content={_title}>
      <BaseHubImage
        alt={image.alt ?? `Avatar for ${_title}`}
        className='border border-border object-cover transition-all size-em-[32]'
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
        'border-surface-primary dark:border-dark-surface-primary size-7 shrink-0 rounded-full border-2 object-cover',
        className
      )}
      height={28}
      src={url}
      width={28}
      {...props}
    />
  )
}
