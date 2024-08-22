'use client'

import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {usePreviewStore} from '../preview-store'
import {BlogpostCard} from './blogpost-card'
import {Search} from './search-container'

export interface SearchResultsProps {
  search?: Search
  posts: BlogPostCard[]
}

export default function SearchResults({posts, search}: SearchResultsProps) {
  const {selectedPost, setSelectedPost, clearSelectedPost} = usePreviewStore()

  let filteredPosts = posts

  if (search.result) {
    const resultsIds = search.result.hits.map(hit => hit.document._id)
    filteredPosts = posts.filter(post => resultsIds.includes(post._id))
  }

  if (filteredPosts.length === 0 && search.result)
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-lg text-gray-500'>
          No results found for {search.query}
        </p>
      </div>
    )

  const [firstPost, ...remainingPosts] = filteredPosts
  return (
    <>
      <span className='bg-lines block w-full border-b border-border h-em-[48]' />
      {firstPost && (
        <div className='relative flex items-center'>
          <BlogpostCard
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
      <span className='bg-lines block w-full border-b border-border h-em-[32]' />

      <div className='flex flex-col'>
        {remainingPosts.map(post => (
          <BlogpostCard
            active={selectedPost?._id === post._id}
            onMouseEnter={() => setSelectedPost(post)}
            className='focus:z-10'
            key={post._id}
            {...post}
          />
        ))}
      </div>
    </>
  )
}
