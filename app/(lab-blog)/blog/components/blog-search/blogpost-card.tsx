import Link, {LinkProps} from 'next/link'

import {Author} from '@/common/avatar'
import {AvatarsGroup} from '@/common/avatars-group'
import {DarkLightImage} from '@/common/dark-light-image'
import {CustomTooltip} from '@/common/tooltip'
import {Tag} from '@/common/ui/tag'
import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {getAuthorName} from '@/lib/utils/author'
import {formatDate} from '@/lib/utils/dates'
import {Fragment} from 'react'
import {CSSProperties} from 'styled-components'

type WithMouseEvents<T> = T & {
  onMouseEnter: React.MouseEventHandler
  onMouseLeave: React.MouseEventHandler
}

interface BlogpostCardProps
  extends BlogPostCard,
    Omit<WithMouseEvents<LinkProps>, 'href'> {
  style?: CSSProperties
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
          className={`focus-ring first:jsutify-items-start grid w-full
            grid-cols-[calc(var(--col-width)*2),repeat(2,1fr),6.5em] items-center justify-items-end border-t
            border-border text-base uppercase transition-shadow ease-out px-em-[12] py-em-[20] text-em-[16/16] gap-em-[16] 
            ${active ? 'bg-surface-contrast text-text-contrast' : 'bg-surface text-text'}
            ${className}`}
          href={`/blog/${_slug}`}
          {...restProps}>
          <h3 className='relative col-span-4 justify-self-start text-balance pr-4 font-medium md:col-span-1 md:line-clamp-2 md:max-w-col-2'>
            {_title}
          </h3>
          <div className='col-span-2 justify-self-start md:col-span-1 md:justify-self-auto'>
            <BlogpostCardTags categories={categories} />
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
          className={`focus-ring flex w-full flex-col border-b border-border text-base transition-shadow ease-out md:flex-row
            ${active ? 'bg-surface-contrast text-text-contrast' : 'bg-surface text-text'}
            ${className}`}
          href={`/blog/${_slug}`}
          {...restProps}>
          <picture className='relative aspect-[20/9] w-full shrink-0 overflow-hidden border-b border-r border-border md:aspect-video md:w-col-4 md:border-b-0 lg:w-col-2'>
            <DarkLightImage
              {...image}
              priority
              withPlaceholder
              className='h-full w-full bg-surface object-cover'
              height={324}
              width={576}
            />
          </picture>
          <div className='flex grow flex-col justify-between uppercase px-em-[12]  py-em-[20] text-em-[16/16] gap-em-[16] '>
            <div className='flex gap-em-[12]'>
              <BlogpostCardTags categories={categories} />
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

const BlogpostCardTags = ({categories}: {categories: string[]}) => {
  const firstTag = categories[0]
  const needsTagTooltip = categories.length > 1

  return (
    <>
      <Tag
        size='sm'
        className='transition-none'
        intent='default'>
        {firstTag}
      </Tag>
      {needsTagTooltip && (
        <CustomTooltip content={`${categories.join(', ')}`}>
          <Tag
            size='sm'
            className='transition-none'
            intent='default'>
            +{categories.length - 1}
          </Tag>
        </CustomTooltip>
      )}
    </>
  )
}
