'use client'
import {DarkLightImage} from '@/common/dark-light-image'
import {Button} from '@/common/ui/button'
import {Tag} from '@/common/ui/tag'
import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {getAuthorName} from '@/lib/utils/author'
import cn from '@/lib/utils/cn'
import {formatDate} from '@/lib/utils/dates'
import Link from 'next/link'
import {Fragment} from 'react'
import {usePreviewStore} from './preview-store'

interface BlogPostPreviewProps extends BlogPostCard {}

const tabsidesClassNames =
  'block absolute h-[111%] bg-surface -translate-y-px w-em-[20/16] border-border'

export const BlogPostPreview = (props: BlogPostPreviewProps) => {
  const {publishedAt, authors, categories, _slug, image, _title} = props

  const filenameFormat = _slug.split('-').slice(0, 3).join('_') + '.md'

  const {selectedPost} = usePreviewStore()

  return (
    <div className='isolate max-w-em-[808/16] text-em-[12/16] 2xl:text-em-[16/16]'>
      {/* file name */}
      <div className='flex pl-em-[16/16] gap-x-em-[16/16]'>
        <div className='relative z-10 border-t border-border bg-surface text-shades-800 pt-em-[12/16] px-em-[16/16] h-em-[36/16]'>
          <span
            className={cn(
              tabsidesClassNames,
              'left-0 top-0 origin-top-left rotate-[24deg] border-l'
            )}
          />
          <span
            className={cn(
              tabsidesClassNames,
              'right-0 top-0 origin-top-right rotate-[-24deg] border-r'
            )}
          />
          {filenameFormat}
        </div>
        <div className='flex-1 border-b border-border' />
      </div>
      <div className='just flex aspect-[808/555] w-full flex-col justify-between border border-t-0 border-border bg-surface text-shades-400'>
        {/* Header */}
        <div className='grid grid-cols-2'>
          <div className='uppercase p-em-[32/16]'>
            <div className='flex gap-em-[12/16]'>
              {categories.map(category => (
                <Tag
                  size='md'
                  key={category}>
                  {category}
                </Tag>
              ))}
            </div>
            <p className='text-balance text-surface-contrast py-em-[10/40] text-em-[40/16]'>
              Planning for Near-Free AI
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
              <span>{formatDate(publishedAt)}</span>
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
        <div className='border-t border-border p-em-[48/16]'>
          <p className='font-sans text-em-[20/16]'>
            Hello out there! You are now entering the lively world of Rubric
            Labs, a place where programming knowledge compliments the subtle
            charm of shared conversations over cups of coffee. Join us in this
            journey, shall we? Here, we have a nifty little creation called Blog
            It, our handy slack bot, that makes blogging as easy as sipping on a
            latte...
          </p>
        </div>
        <Button
          asChild
          variant='secondary'
          className='w-full border-0 border-t'
          size='lg'>
          <Link href={`/blog/${_slug}`}>Read the full post</Link>
        </Button>
      </div>
    </div>
  )
}
