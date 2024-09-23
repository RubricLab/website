import {draftMode} from 'next/headers'

import {avatarFragment} from '@/lib/basehub/fragments'
import {Pump} from 'basehub/react-pump'

import BackgroundGrid from '@/common/lab-blog-layout/background-grid'
import {PageView} from '@/components/page-view'
import {BASEHUB_REVALIDATE_TIME} from '@/lib/basehub/constants'
import {BlogCategory, blogpostCardFragment} from '@/lib/basehub/fragments/blog'
import {basehub} from 'basehub'
import type {Metadata} from 'next'
import {BlogPreviewList} from './components/blog-preview-list'
import SearchContainer from './components/blog-search/search-container'
import BlogHeading from './components/heading'

export const dynamic = 'force-static'

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

export default async function BlogPage() {
  return (
    <>
      <BackgroundGrid
        data={{
          sm: {columnCount: 4, highlightColumns: [1, 3, 5, 7]},
          md: {columnCount: 4, highlightColumns: [2, 4, 6, 8]},
          lg: {columnCount: 12, highlightColumns: [6, 8, 9, 11]},
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
            site: {blog}
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

          return (
            <>
              <PageView _analyticsKey={blog._analyticsKey} />

              <div className='relative grid max-h-fold grid-cols-12'>
                <div className='sticky top-0 col-span-12 pb-em-[24] lg:col-span-6 2xl:col-span-5'>
                  <BlogHeading
                    blog={{
                      title: blog.mainTitle,
                      subtitle: blog.subtitle
                    }}
                  />

                  <SearchContainer
                    _searchKey={blogPost._searchKey}
                    posts={posts.items}
                    availableCategories={availableCategories}
                  />
                </div>

                <span className='bg-lines col-span-1 hidden h-full 2xl:block' />

                <BlogPreviewList posts={posts.items} />
              </div>
            </>
          )
        }}
      </Pump>
    </>
  )
}
