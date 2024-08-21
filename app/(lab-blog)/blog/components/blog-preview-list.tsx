'use client'

import {useEffect, useRef} from 'react'
import {BlogPostPreview} from './blogpost-preview'

export const BlogPreviewList = ({posts}) => {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {}, [])

  return (
    <div
      className='fixed right-sides top-header flex h-fold w-col-6 items-center justify-center [perspective:2000px]'
      ref={listRef}>
      {posts.map(p => (
        <div className='absolute'>
          <BlogPostPreview {...p} />
        </div>
      ))}
    </div>
  )
}
