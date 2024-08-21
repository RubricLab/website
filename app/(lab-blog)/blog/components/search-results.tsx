'use client'

import {BlogPostCard} from '@/lib/basehub/fragments/blog'
import {BlogpostCard} from './blogpost-card'
import {usePreviewStore} from './preview-store'

export interface SearchResultsProps {
  posts: BlogPostCard[]
}

export default function SearchResults({posts}: SearchResultsProps) {
  const [firstPost, ...remainingPosts] = posts

  const {selectedPost, setSelectedPost, clearSelectedPost} = usePreviewStore()

  return (
    <>
      <span className='bg-lines block w-full border-b border-border h-em-[48]' />
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
