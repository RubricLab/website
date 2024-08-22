'use client'

import {Button} from '@/common/ui/button'
import {useLoaded} from '@/hooks/use-loaded'
import {BlogCategory, BlogPostCard} from '@/lib/basehub/fragments/blog'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useRef} from 'react'
import {usePreviewStore} from '../preview-store'
import {BlogpostCard} from './blogpost-card'
import SearchEmptyStateIllustration from './empty-state'
import {Search} from './search-container'

export interface SearchResultsProps {
  search?: Search
  posts: BlogPostCard[]
}

export default function SearchResults({posts, search}: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tag = searchParams.get('tag')

  const {selectedPost, setSelectedPost, clearSelectedPost} = usePreviewStore()

  let filteredPosts = posts

  if (search.result) {
    const resultsIds = search.result.hits.map(hit => hit.document._id)
    filteredPosts = posts.filter(post => resultsIds.includes(post._id))
  }

  if (tag)
    filteredPosts = filteredPosts.filter(post =>
      post.categories.includes(tag as BlogCategory)
    )

  const loaded = useLoaded()
  const tl = useRef(
    gsap.timeline({
      paused: true,
      defaults: {
        duration: 1,
        ease: 'power3.out'
      }
    })
  )

  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current

      if (!container) return
      const mainContainer = document.querySelector('#search-container')
      const posts = container.querySelectorAll('[data-post-id]')
      const dividers = container.querySelectorAll('[data-divider]')

      tl.current.kill()

      gsap.set([posts, dividers], {
        '--clip-progress': 1,
        clipPath: 'inset(0 0 calc(var(--clip-progress) * 100%) 0)'
      })

      gsap.set(mainContainer, {
        filter: 'blur(12px)',
        opacity: 0
      })

      tl.current
        .to(mainContainer, {
          delay: 0.5,
          filter: 'blur(0px)',
          opacity: 1
        })
        .to(
          container,
          {
            onStart: () => {
              gsap.set(container, {
                opacity: 1
              })
            },
            '--clip-progress': 0
          },
          '>-0.5'
        )
        .to([dividers, posts], {
          '--clip-progress': 0,
          stagger: 0.2
        })

      gsap.set(container, {
        opacity: 1
      })
    },
    {
      revertOnUpdate: true,
      scope: containerRef
    }
  )

  useEffect(() => {
    if (!loaded) return

    tl.current.play()
  }, [loaded])

  if (filteredPosts.length === 0 && search.result)
    return (
      <>
        <span className='bg-lines block w-full border-b border-border h-em-[48]' />

        <div className='flex flex-col items-center justify-center py-em-[32] gap-em-[12]'>
          <p className='uppercase text-text-tertiary text-em-[14/16]'>
            No results found{' '}
            {search.query.length > 0 && <> for «{search.query}»</>}
          </p>
          <SearchEmptyStateIllustration className='text-border w-em-[200]' />
          <Button
            onClick={() => router.push('/blog')}
            variant='ghost'
            className='text-text-secondary underline underline-offset-[0.3em]'>
            Reset filters
          </Button>
        </div>
        <span className='bg-lines block w-full border-t border-border h-em-[48]' />
      </>
    )

  const [firstPost, ...remainingPosts] = filteredPosts

  return (
    <div
      ref={containerRef}
      style={{
        opacity: 0
      }}>
      <span
        data-divider
        className='bg-lines block w-full border-b border-border h-em-[48]'
      />
      {firstPost && (
        <div className='relative flex items-center'>
          <BlogpostCard
            data-post-id={firstPost._id}
            active={selectedPost?._id === firstPost._id}
            onMouseEnter={() => setSelectedPost(firstPost)}
            type='inline-card'
            {...firstPost}
          />
          <span className='pointer-events-none absolute -left-sides origin-top-left -rotate-90 select-none text-em-[16/16]'>
            <span className='relative block -translate-x-1/2'>LATEST_POST</span>
          </span>
        </div>
      )}
      <span
        data-divider
        className='bg-lines block w-full border-b border-border h-em-[32]'
      />

      <div className='flex flex-col'>
        {remainingPosts.map(post => (
          <BlogpostCard
            data-post-id={post._id}
            active={selectedPost?._id === post._id}
            onMouseEnter={() => setSelectedPost(post)}
            className='focus:z-10'
            key={post._id}
            {...post}
          />
        ))}
      </div>
    </div>
  )
}
