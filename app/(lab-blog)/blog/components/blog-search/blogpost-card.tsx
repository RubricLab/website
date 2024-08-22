import Link, {LinkProps} from 'next/link'

import {Author} from '@/common/avatar'
import {AvatarsGroup} from '@/common/avatars-group'
import {DarkLightImage} from '@/common/dark-light-image'
import {Tag} from '@/common/ui/tag'
import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {getAuthorName} from '@/lib/utils/author'
import {formatDate} from '@/lib/utils/dates'
import {Fragment} from 'react'

interface BlogpostCardProps extends BlogPostCard, Omit<LinkProps, 'href'> {
  type?: 'card' | 'list' | 'inline-card'
  active?: boolean
}

export function BlogpostCard({
  type = 'list',
  className,
  ...props
}: BlogpostCardProps) {
  const {
    _id,
    _slug,
    _title,
    active,
    categories,
    publishedAt,
    authors,
    image,
    description,
    ...restProps
  } = props

  switch (type) {
    case 'list': {
      return (
        <Link
          key={_id}
          className={`focus-ring grid w-full grid-cols-[auto_auto] place-content-start items-center justify-items-start 
            border-b border-border text-base uppercase
            transition-shadow ease-out px-em-[12] py-em-[20] text-em-[16/16] gap-em-[16] max-md:justify-items-start md:grid-cols-[calc(var(--col-width)*2),repeat(2,1fr),6.5em] md:justify-items-end md:*:first:place-items-start 
            ${active ? 'bg-surface-contrast text-text-contrast' : 'bg-surface text-text'}
            ${className}`}
          href={`/blog/${_slug}`}
          {...restProps}>
          <h3 className='relative col-span-2 max-w-col-2 justify-self-start text-balance pr-4 font-medium max-lg:line-clamp-2 md:col-span-1'>
            {_title}
          </h3>
          <div className='col-span-2 md:col-span-1'>
            {categories.map(category => (
              <Tag
                size='sm'
                className='transition-none'
                intent={active ? 'contrast' : 'default'}
                key={category}>
                {category}
              </Tag>
            ))}
          </div>
          <p className='opacity-60'>
            {formatDate(publishedAt, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}
          </p>
          <div className='flex items-center justify-self-end'>
            <AvatarsGroup animate>
              {authors.map(author => (
                <Author
                  key={author._id}
                  {...author}
                />
              ))}
            </AvatarsGroup>
          </div>
        </Link>
      )
    }

    case 'inline-card': {
      return (
        <Link
          key={_id}
          className={`focus-ring flex border-b border-border text-base transition-shadow ease-out
            ${active ? 'bg-surface-contrast text-text-contrast' : 'bg-surface text-text'}
            ${className}`}
          href={`/blog/${_slug}`}
          {...restProps}>
          <picture className='relative aspect-video w-col-2 shrink-0'>
            <DarkLightImage
              {...image}
              priority
              withPlaceholder
              className='h-full w-full bg-surface object-cover'
              height={324}
              width={576}
            />
          </picture>
          <div className='flex flex-col justify-between uppercase px-em-[12]  py-em-[20] text-em-[16/16] gap-em-[16] '>
            <div className='flex gap-em-[12]'>
              {categories.map(category => (
                <Tag
                  size='sm'
                  className='transition-none'
                  intent={active ? 'contrast' : 'default'}
                  key={category}>
                  {category}
                </Tag>
              ))}
            </div>
            <h3 className='text-em-[24/16]'>{_title}</h3>

            <div className='flex items-center justify-between'>
              <p className=''>
                <span className='uppercase opacity-60'>by: </span>
                {authors.map((author, index) => (
                  <Fragment key={author._id}>
                    {index > 0 && ', '}
                    <span className='opacity-80'>{getAuthorName(author)}</span>
                  </Fragment>
                ))}
              </p>
              <p className='opacity-60'>{formatDate(publishedAt)}</p>
            </div>
          </div>
        </Link>
      )
    }
    case 'card': {
      return null
    }
  }
}
