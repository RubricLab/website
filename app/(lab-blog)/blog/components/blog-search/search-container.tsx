'use client'
import {BlogCategory, BlogPostCard} from '@/lib/basehub/fragments/blog'
import {UseSearchResult, useSearch} from 'basehub/react-search'
import {useRouter, useSearchParams} from 'next/navigation'
import {useCallback, useEffect} from 'react'
import BlogFilters from './blog-filters'
import SearchResults from './search-results'

export interface SearchContainerProps {
  _searchKey: string
  posts: BlogPostCard[]
  availableCategories: BlogCategory[]
}

export type Search =
  | ({
      valid: true
    } & UseSearchResult<Record<string, unknown>>)
  | ({
      valid: false
    } & Partial<UseSearchResult<Record<string, unknown>>>)

export default function SearchContainer({
  _searchKey,
  posts,
  availableCategories
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get('tag')

  const search = useSearch({
    _searchKey,
    queryBy: ['_title', 'body', 'description', 'categories', 'authors'],
    filterBy: activeCategory ? `categories:${activeCategory}` : undefined,
    limit: 20
  })

  useEffect(() => {
    const query = searchParams.get('searchQuery') || ''
    search.onQueryChange(query)
  }, [searchParams])

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchParams = new URLSearchParams(searchParams)
      const query = event.target.value

      !query || query === ''
        ? newSearchParams.delete('searchQuery')
        : newSearchParams.set('searchQuery', query)

      router.replace(`/blog?${newSearchParams.toString()}`, {
        scroll: false
      })
    },
    [searchParams, router]
  )

  const clearQuery = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('searchQuery')
    router.replace(`/blog?${newSearchParams.toString()}`, {
      scroll: false
    })
  }, [searchParams, router])

  const handleCategoryChange = useCallback(
    (category: BlogCategory | null) => {
      const newSearchParams = new URLSearchParams(searchParams)

      !category || category === activeCategory
        ? newSearchParams.delete('tag')
        : newSearchParams.set('tag', category)

      router.replace(`/blog?${newSearchParams.toString()}`, {
        scroll: false
      })
    },
    [searchParams, router, activeCategory]
  )

  return (
    <div
      id='search-container'
      style={{
        opacity: 0
      }}
      className='border border-border bg-surface'>
      <BlogFilters
        availableCategories={availableCategories}
        clearQuery={clearQuery}
        handleCategoryChange={handleCategoryChange}
        handleSearchChange={handleSearchChange}
      />

      <SearchResults
        posts={posts}
        search={search}
      />
    </div>
  )
}
