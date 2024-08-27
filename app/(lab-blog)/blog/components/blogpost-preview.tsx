'use client'
import {DarkLightImage} from '@/common/dark-light-image'
import {Button} from '@/common/ui/button'
import {Tag} from '@/common/ui/tag'
import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {getAuthorName} from '@/lib/utils/author'
import cn from '@/lib/utils/cn'
import {cx} from 'class-variance-authority'
import Link from 'next/link'
import {Fragment} from 'react'

export interface BlogPostPreviewProps extends BlogPostCard {
  flap: 'left' | 'right' | 'center'
  active?: boolean
}

const tabsidesClassNames =
  'block absolute h-[111%] bg-surface -translate-y-px w-em-[20/16] border-border'

export const BlogPostPreview = (props: BlogPostPreviewProps) => {
  const {
    publishedAt,
    authors,
    categories,
    _slug,
    image,
    _title,
    body,
    flap,
    active = false
  } = props

  const filenameFormat = _slug.split('-').slice(0, 3).join('_') + '.md'

  const getTitleClasses = () => {
    if (_title.length > 50) return 'text-em-[22/16] 2xl:text-em-[24/16]'
    else if (_title.length > 30) return 'text-em-[24/16] 2xl:text-em-[32/16]'
    else return 'text-em-[32/16] 2xl:text-em-[40/16]'
  }

  return (
    <div
      style={{
        filter: active ? 'grayscale(0)' : 'grayscale(1)'
      }}
      className='isolate transition-[filter] duration-1000 max-w-em-[808/16] text-em-[12/16] 2xl:text-em-[14/16]'>
      {/* file name */}
      <div
        className={cn('relative flex gap-x-em-[16/16]', {
          'justify-start pl-em-[16/16]': flap === 'left',
          'flex-row-reverse pr-em-[16/16]': flap === 'right',
          'flex-col items-center': flap === 'center'
        })}>
        <div className='relative z-10 border-t border-border bg-surface text-shades-800 pt-em-[12/16] px-em-[16/16] h-em-[44/16]'>
          <span
            className={cn(
              tabsidesClassNames,
              'left-0 top-0 origin-top-left rotate-[20.5deg] border-l'
            )}
          />
          <span
            className={cn(
              tabsidesClassNames,
              'right-0 top-0 origin-top-right rotate-[-20.5deg] border-r'
            )}
          />
          {filenameFormat}
        </div>
        <div className='absolute inset-0 flex-1 border-b border-border' />
      </div>
      <div className='just relative z-10 flex aspect-[808/555] w-full flex-col justify-between border border-t-0 border-border bg-surface text-shades-400'>
        <div className='grid grid-cols-2 border-b border-border'>
          <div className='flex flex-col justify-between border-r border-border uppercase p-em-[24/16] 2xl:p-em-[32/16]'>
            <div className='flex gap-em-[12/16]'>
              {categories.map(category => (
                <Tag
                  size='md'
                  key={category}>
                  {category}
                </Tag>
              ))}
            </div>
            <p
              className={cn(
                'line-clamp-3 text-pretty text-surface-contrast my-em-[10/40]',
                getTitleClasses()
              )}>
              {_title}
            </p>
            <div className='flex items-center gap-x-em-[16/16]'>
              <p>
                <span className='uppercase text-text-tertiary'>by: </span>
                {authors.map((author, index) => (
                  <Fragment key={author._id}>
                    {index > 0 && ', '}
                    <span className='text-text-secondary'>
                      {getAuthorName(author)}
                    </span>
                  </Fragment>
                ))}
              </p>
              <span className='h-px w-full flex-1 bg-current' />
            </div>
          </div>
          <picture className='relative'>
            <DarkLightImage
              {...image}
              priority
              withPlaceholder
              className='h-full w-full bg-surface object-cover'
              height={324}
              width={576}
            />
          </picture>
        </div>

        <p
          /* vertical mask */
          style={{
            maskImage:
              'linear-gradient(to bottom, black 0%, black 60%, transparent)'
          }}
          className={cx(
            'flex-1 overflow-hidden p-em-[48/20]',
            'min-h-0 font-sans text-em-[20/16]'
          )}>
          {body.plainText}
        </p>

        <Button
          tabIndex={-1}
          asChild
          variant='secondary'
          className='w-full border-0 border-t !py-em-[16/20] text-em-[20/16]'
          size='md'>
          <Link href={`/blog/${_slug}`}>Read the full post</Link>
        </Button>
      </div>
    </div>
  )
}

