import {draftMode} from 'next/headers'

import {Heading} from '@/common/heading'
import {Section} from '@/common/layout'
import {SearchContent as Search} from '@/common/search'
import {SearchHitsProvider} from '@/context/search-hits-context'
import {avatarFragment, type AvatarFragment} from '@/lib/basehub/fragments'
import {Pump} from 'basehub/react-pump'

import BackgroundGrid from '@/common/lab-blog-layout/background-grid'
import {PageView} from '@/components/page-view'
import {BASEHUB_REVALIDATE_TIME} from '@/lib/basehub/constants'
import {basehub} from 'basehub'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {BlogpostCard, blogpostCardFragment} from './components/blogpost-card'

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

          if (posts.items.length === 0) notFound()

          return (
            <Section className='gap-16'>
              <PageView _analyticsKey={blog._analyticsKey} />
              <div className='grid grid-cols-1 gap-5 self-stretch md:grid-cols-2'>
                <Heading align='left'>
                  <h2>{blog.mainTitle}</h2>
                </Heading>
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
                {blog.featuredPosts?.slice(0, 3).map(post => (
                  <BlogpostCard
                    key={post._id}
                    type='card'
                    {...post}
                  />
                ))}
              </div>
              <div className='w-full space-y-3'>
                <Heading align='left'>
                  <h3 className='!text-xl lg:!text-2xl'>{blog.listTitle}</h3>
                </Heading>
                <div className='-mx-4 flex flex-col self-stretch'>
                  {posts.items.map(post => (
                    <BlogpostCard
                      key={post._id}
                      {...post}
                      className='-mx-4'
                    />
                  ))}
                </div>
              </div>
            </Section>
          )
        }}
      </Pump>
    </>
  )
}
