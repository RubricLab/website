import {draftMode} from 'next/headers'

import {SearchContent as Search} from '@/common/search'
import {SearchHitsProvider} from '@/context/search-hits-context'
import {avatarFragment, type AvatarFragment} from '@/lib/basehub/fragments'
import {Pump} from 'basehub/react-pump'

import BackgroundGrid from '@/common/lab-blog-layout/background-grid'
import {PageView} from '@/components/page-view'
import {BASEHUB_REVALIDATE_TIME} from '@/lib/basehub/constants'
import {BlogCategory, blogpostCardFragment} from '@/lib/basehub/fragments/blog'
import {basehub} from 'basehub'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {BlogpostCard} from './components/blogpost-card'
import TagsFilter from './components/tags-filter'

// export const dynamic = 'force-static'

export const revalidate = BASEHUB_REVALIDATE_TIME

export const generateMetadata = async (): Promise<Metadata | undefined> => {
  const data = await basehub({
    cache: 'no-store',
    draft: draftMode().isEnabled
  }).query({
    site: {
      blog: {
        metadata: {
          title: true,
          description: true
        }
      }
    }
  })

  return {
    title: data.site.blog.metadata.title ?? undefined,
    description: data.site.blog.metadata.description ?? undefined
  }
}

export default async function BlogPage({
  searchParams
}: {
  searchParams: {tag?: string}
}) {
  console.log(searchParams)
  const selectedTag = searchParams.tag as BlogCategory
  return (
    <>
      <BackgroundGrid highlightColumns={[5, 7, 9, 11]} />
      <Pump
        draft={draftMode().isEnabled}
        next={{revalidate: BASEHUB_REVALIDATE_TIME}}
        queries={[
          {
            _componentInstances: {
              blogPost: {
                _searchKey: true
              }
            },
            collections: {
              authors: {
                items: {
                  _id: true,
                  image: avatarFragment
                }
              }
            },
            site: {
              blog: {
                _analyticsKey: true,
                mainTitle: true,
                subtitle: true,
                featuredPosts: blogpostCardFragment,
                listTitle: true,
                posts: {
                  items: blogpostCardFragment
                }
              }
            }
          }
        ]}>
        {async ([
          {
            _componentInstances: {blogPost},
            site: {blog},
            collections: {authors}
          }
        ]) => {
          'use server'
          const {posts} = blog

          const availableCategories = posts.items.reduce(
            (acc: BlogCategory[], post) => {
              return Array.from(new Set([...acc, ...post.categories]))
            },
            []
          )

          const filteredPosts = selectedTag
            ? posts.items.filter(post =>
                post.categories.includes(selectedTag as BlogCategory)
              )
            : posts.items

          const [latestPost, ...remainingPosts] = filteredPosts

          if (posts.items.length === 0) notFound()

          return (
            <div className='relative'>
              <PageView _analyticsKey={blog._analyticsKey} />

              <div className='grid grid-cols-12'>
                <div className='col-span-6'>
                  <div className='px-em-[12] py-em-[56]'>
                    <h2 className=' whitespace-nowrap uppercase text-text-secondary text-em-[72/16]'>
                      {blog.mainTitle}
                    </h2>
                    <p className='uppercase text-text-tertiary text-em-[16/16]'>
                      {blog.subtitle}
                    </p>
                  </div>
                  <div className='border border-border bg-surface'>
                    <SearchHitsProvider
                      authorsAvatars={authors.items.reduce(
                        (acc: Record<string, AvatarFragment>, author) => {
                          acc[author._id] = author.image

                          return acc
                        },
                        {}
                      )}>
                      <Search _searchKey={blogPost._searchKey} />
                    </SearchHitsProvider>

                    <TagsFilter
                      activeCategory={selectedTag}
                      availableCategories={availableCategories}
                    />

                    <span className='bg-lines block w-full border-b border-border h-em-[48]' />
                    <div className='relative flex items-center'>
                      <BlogpostCard
                        type='inline-card'
                        {...latestPost}
                      />
                      <span className='pointer-events-none absolute -left-sides origin-top-left -rotate-90 select-none text-em-[16/16]'>
                        <span className='relative block -translate-x-1/2'>
                          LATEST_POST
                        </span>
                      </span>
                    </div>
                    <span className='bg-lines block w-full border-b border-border h-em-[32]' />

                    <div className='flex flex-col self-stretch'>
                      {remainingPosts.map(post => (
                        <BlogpostCard
                          key={post._id}
                          {...post}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* {blog.featuredPosts?.slice(0, 3).map(post => (
                  <BlogpostCard
                    key={post._id}
                    type='card'
                    {...post}
                  />
                ))} */}
              </div>
            </div>
          )
        }}
      </Pump>
    </>
  )
}
