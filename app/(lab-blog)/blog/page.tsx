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
import {BlogPreviewList} from './components/blog-preview-list'
import SearchResults from './components/search-results'
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
  const selectedTag = searchParams.tag as BlogCategory

  return (
    <>
      <BackgroundGrid
        data={{
          sm: {columnCount: 4, highlightColumns: [1, 3, 5, 7]},
          md: {columnCount: 4, highlightColumns: [2, 4, 6, 8]},
          lg: {columnCount: 12, highlightColumns: [3, 5, 7, 9]},
          xl: {columnCount: 12, highlightColumns: [6, 8, 9, 11]},
          '2xl': {columnCount: 12, highlightColumns: [5, 7, 9, 11]}
        }}
      />
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

          if (posts.items.length === 0) notFound()

          return (
            <div className='relative'>
              <PageView _analyticsKey={blog._analyticsKey} />

              <div className='grid max-h-fold grid-cols-12'>
                <div className='sticky top-0 col-span-6 2xl:col-span-5'>
                  <div className='px-em-[12] py-em-[56]'>
                    <h2 className=' whitespace-nowrap uppercase text-text-secondary text-em-[72/16]'>
                      {blog.mainTitle}
                    </h2>
                    <p className='uppercase text-text-tertiary text-em-[16/16]'>
                      {blog.subtitle}
                    </p>
                  </div>
                  <div className='border border-border bg-surface'>
                    <div className='sticky top-header z-20 bg-surface'>
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
                    </div>

                    <SearchResults posts={filteredPosts} />
                  </div>
                </div>

                <span className='bg-lines col-span-1 hidden h-full 2xl:block' />

                <BlogPreviewList posts={filteredPosts} />
              </div>
            </div>
          )
        }}
      </Pump>
    </>
  )
}
