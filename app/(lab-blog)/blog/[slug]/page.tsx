import {RichText} from 'basehub/react-rich-text'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'

import {Author} from '@/common/avatar'
import {DarkLightImage} from '@/common/dark-light-image'
import BackgroundGrid from '@/common/lab-blog-layout/background-grid'
import {Button} from '@/common/ui/button'
import {CodeSnippet, codeSnippetFragment} from '@/components/code-snippet'
import {PageView} from '@/components/page-view'
import {
  FaqItemComponentFragment,
  RichTextCalloutComponent,
  richTextBaseComponents,
  richTextCalloutComponentFragment,
  richTextClasses
} from '@/components/rich-text'
import {BASEHUB_REVALIDATE_TIME} from '@/lib/basehub/constants'
import {authorFragment, darkLightImageFragment} from '@/lib/basehub/fragments'
import {formatDate} from '@/lib/utils/dates'
import {basehub} from 'basehub'
import {Pump} from 'basehub/react-pump'
import {cx} from 'class-variance-authority'

export const dynamic = 'force-static'

export const revalidate = BASEHUB_REVALIDATE_TIME

export const generateStaticParams = async () => {
  const data = await basehub({cache: 'no-store'}).query({
    site: {
      blog: {
        posts: {
          items: {
            _slug: true
          }
        }
      }
    }
  })

  return data.site.blog.posts.items.map(post => {
    return {
      slug: post._slug
    }
  })
}

export const generateMetadata = async ({
  params: {slug}
}: {
  params: {slug: string}
}): Promise<Metadata | undefined> => {
  const data = await basehub({
    next: {revalidate: BASEHUB_REVALIDATE_TIME}
  }).query({
    site: {
      settings: {
        metadata: {
          titleTemplate: true,
          sitename: true
        }
      },
      blog: {
        posts: {
          __args: {
            filter: {
              _sys_slug: {eq: slug}
            },
            first: 1
          },
          items: {
            ogImage: {url: true},
            _id: true,
            _title: true,
            description: true
          }
        }
      }
    }
  })

  const post = data.site.blog.posts.items[0]

  if (!post) return undefined
  const images = [{url: post.ogImage.url}]

  return {
    title: post._title,
    description: post.description,
    openGraph: {
      images,
      type: 'article'
    },
    twitter: {
      images,
      card: 'summary_large_image',
      site: data.site.settings.metadata.sitename
    }
  }
}

export default async function BlogPostPage({
  params: {slug}
}: {
  params: {slug: string}
}) {
  return (
    <>
      <BackgroundGrid
        data={{
          sm: {columnCount: 4},
          md: {columnCount: 4},
          lg: {columnCount: 12, highlightColumns: [1, 10]},
          xl: {columnCount: 12, highlightColumns: [1, 10]},
          '2xl': {columnCount: 12, highlightColumns: [1, 10]}
        }}
      />
      <Pump
        draft={draftMode().isEnabled}
        next={{revalidate: BASEHUB_REVALIDATE_TIME}}
        queries={[
          {
            site: {
              blog: {
                posts: {
                  __args: {
                    filter: {
                      _sys_slug: {
                        eq: slug
                      }
                    },
                    first: 1
                  },
                  items: {
                    _analyticsKey: true,
                    _title: true,
                    description: true,
                    authors: authorFragment,
                    publishedAt: true,
                    image: darkLightImageFragment,
                    categories: true,
                    body: {
                      json: {
                        __typename: true,
                        blocks: {
                          __typename: true,
                          on_FaqItemComponent: FaqItemComponentFragment,
                          on_RichTextCalloutComponent:
                            richTextCalloutComponentFragment,
                          on_CodeSnippetComponent: codeSnippetFragment
                        },
                        content: 1,
                        toc: 1
                      }
                    }
                  }
                }
              }
            }
          }
        ]}>
        {async ([
          {
            site: {
              blog: {posts}
            }
          }
        ]) => {
          'use server'
          const blogpost = posts.items.at(0)

          if (!blogpost) return notFound()

          return (
            <div className='mx-auto w-[calc(var(--col-width)*8+2px)] -translate-x-px border border-border bg-surface mb-em-[64]'>
              <PageView _analyticsKey={blogpost._analyticsKey} />

              <div className='bg-lines flex w-full items-center px-em-[16] h-em-[64]'>
                <Button variant='ghost'>Back to Blog</Button>
              </div>

              <div className='grid grid-cols-2 border-b border-t border-border mb-em-[64]'>
                <div className='flex flex-col justify-between border-r border-border p-em-[32] gap-em-[16]'>
                  <div className='flex'>
                    {blogpost.categories.map(category => (
                      <span
                        key={category}
                        className='mr-1 border border-border uppercase text-text-tertiary px-em-[8] py-em-[2] text-em-[14/16]'>
                        {category}
                      </span>
                    ))}
                  </div>
                  <h1 className='text-balance font-medium uppercase text-em-[32/16] lg:text-em-[36/16] 2xl:text-em-[40/16]'>
                    {blogpost._title}
                  </h1>
                  <div className='flex items-center gap-em-[16]'>
                    <div className='flex items-center justify-center space-x-[-1px] text-base'>
                      {blogpost.authors.map(author => (
                        <Author
                          key={author._id}
                          {...author}
                        />
                      ))}
                    </div>
                    <span className='h-px bg-border w-em-[64]' />

                    <div className='flex divide-x divide-border text-text-tertiary'>
                      <p className='uppercase pr-em-[8] text-em-[22/16]'>
                        {formatDate(blogpost.publishedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <DarkLightImage
                  {...blogpost.image}
                  priority
                  withPlaceholder
                  className='h-full max-h-[720px] w-full object-cover '
                  style={{aspectRatio: blogpost.image.light.aspectRatio}}
                />
              </div>

              <div className='flex justify-center'>
                <div className={cx(richTextClasses)}>
                  <RichText
                    blocks={blogpost.body.json.blocks}
                    components={{
                      ...richTextBaseComponents,
                      RichTextCalloutComponent: RichTextCalloutComponent,
                      CodeSnippetComponent: CodeSnippet
                    }}>
                    {blogpost.body.json.content}
                  </RichText>
                </div>
              </div>
              <span className='bg-lines flex w-full border-t border-border mt-em-[64] h-em-[64]' />
            </div>
          )
        }}
      </Pump>
    </>
  )
}
