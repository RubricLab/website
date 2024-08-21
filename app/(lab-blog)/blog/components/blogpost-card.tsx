import clsx from 'clsx'
import Link from 'next/link'

import {Author} from '@/common/avatar'
import {AvatarsGroup} from '@/common/avatars-group'
import {DarkLightImage} from '@/common/dark-light-image'
import {Tag} from '@/common/ui/tag'
import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {getAuthorName} from '@/lib/utils/author'
import {formatDate} from '@/lib/utils/dates'
import {Fragment} from 'react'

export function BlogpostCard({
  type = 'list',
  className,
  ...post
}: BlogPostCard) {
  switch (type) {
    case 'list': {
      return (
        <article className={`border-b border-border text-base ${className}`}>
          <Link
            key={post._id}
            className='grid w-full grid-cols-[auto_auto] place-content-start items-center justify-items-start uppercase text-text-secondary outline-none transition-colors px-em-[12] py-em-[20] text-em-[16/16] gap-em-[16] hover:bg-surface-secondary max-md:justify-items-start md:grid-cols-[calc(var(--col-width)*2),repeat(2,1fr),6.5em] md:justify-items-end md:*:first:place-items-start'
            href={`/blog/${post._slug}`}>
            <h3 className='text-text-primary relative col-span-2 max-w-col-2 justify-self-start text-balance pr-4 font-medium text-text max-lg:line-clamp-2 md:col-span-1'>
              {post._title}
            </h3>
            <div className='col-span-2 md:col-span-1'>
              {post.categories.map(category => (
                <Tag
                  size='sm'
                  key={category}>
                  {category}
                </Tag>
              ))}
            </div>
            <p className='dark:text-dark-text-tertiary text-sm text-text-tertiary lg:text-base'>
              {formatDate(post.publishedAt, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}
            </p>
            <div className='flex items-center justify-self-end'>
              <AvatarsGroup animate>
                {post.authors.map(author => (
                  <Author
                    key={author._id}
                    {...author}
                  />
                ))}
              </AvatarsGroup>
            </div>
          </Link>
        </article>
      )
    }
    case 'inline-card': {
      return (
        <article className={`border-b border-border text-base ${className}`}>
          <Link
            key={post._id}
            className='flex outline-none transition-colors hover:bg-surface-secondary'
            href={`/blog/${post._slug}`}>
            <picture className='relative aspect-video w-col-2 shrink-0'>
              <DarkLightImage
                {...post.image}
                priority
                withPlaceholder
                className='h-full w-full bg-surface object-cover'
                height={324}
                width={576}
              />
            </picture>
            <div className='flex flex-col justify-between uppercase text-text-secondary px-em-[12]  py-em-[20] text-em-[16/16] gap-em-[12] gap-em-[16] '>
              <div className='flex gap-em-[12]'>
                {post.categories.map(category => (
                  <Tag
                    size='sm'
                    key={category}>
                    {category}
                  </Tag>
                ))}
              </div>
              <h3 className='text-text-primary text-em-[24/16]'>
                {post._title}
              </h3>

              <div className='flex items-center justify-between'>
                <p className=''>
                  <span className='uppercase text-text-tertiary'>by: </span>
                  {post.authors.map((author, index) => (
                    <Fragment key={author._id}>
                      {index > 0 && ', '}
                      <span className='text-text-secondary'>
                        {getAuthorName(author)}
                      </span>
                    </Fragment>
                  ))}
                </p>
                <p className='dark:text-dark-text-tertiary text-sm text-text-tertiary lg:text-base'>
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>
          </Link>
        </article>
      )
    }
    case 'card': {
      return (
        <Link
          key={post._id}
          className={clsx(
            'group flex flex-col self-stretch rounded-xl border transition-shadow [--heading-size:_1.1250rem]',
            'dark:border-dark-border dark:bg-dark-surface-secondary dark:text-dark-text-secondary dark:hover:shadow-grayscale-700 border-border bg-surface-secondary text-text-secondary hover:shadow-md dark:hover:shadow',
            'focus-visible:ring-accent-500 outline-0 focus-visible:ring',
            className
          )}
          href={`/blog/${post._slug}`}>
          <figure
            className='overflow-hidden p-2'
            style={{aspectRatio: post.image.light.aspectRatio}}>
            <DarkLightImage
              {...post.image}
              priority
              withPlaceholder
              className='bg-surface-tertiary/20 dark:bg-dark-surface-tertiary/20 h-full w-full rounded object-cover'
              height={324}
              width={576}
            />
          </figure>
          <div className={clsx('flex flex-col justify-between gap-3 p-4')}>
            <header className='flex items-center justify-between gap-2'>
              <p className='dark:text-dark-text-tertiary text-sm text-text-tertiary lg:text-base'>
                {formatDate(post.publishedAt, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
              </p>

              <AvatarsGroup animate>
                {post.authors.map(author => (
                  <Author
                    key={author._id}
                    priority
                    {...author}
                  />
                ))}
              </AvatarsGroup>
            </header>
            <main className='flex flex-col gap-2 lg:flex-1'>
              <h3 className='text-text-primary dark:text-dark-text-primary text-[length:var(--heading-size)] font-medium'>
                {post._title}
              </h3>
              <p className='dark:text-dark-text-secondary line-clamp-2 text-sm text-text-secondary lg:text-base'>
                {post.description}
              </p>
            </main>
          </div>
        </Link>
      )
    }
  }
}
