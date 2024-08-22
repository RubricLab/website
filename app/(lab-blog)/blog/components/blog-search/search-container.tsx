'use client'
import useDebouncedCallback from '@/hooks/use-debounced-callback'
import {BlogCategory, BlogPostCard} from '@/lib/basehub/fragments/blog'
import {UseSearchResult, useSearch} from 'basehub/react-search'
import {useRouter, useSearchParams} from 'next/navigation'
import {useCallback, useEffect} from 'react'
import BlogFilters from './blog-filters'
import SearchResults from './search-results'

export interface SearchContainerProps {
  _searchKey: string
  posts: BlogPostCard[]
  activeCategory?: BlogCategory
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
  activeCategory,
  availableCategories
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = useSearch({
    _searchKey,
    queryBy: ['_title', 'body', 'description', 'categories', 'authors'],
    filterBy: activeCategory ? `categories:${activeCategory}` : undefined,
    limit: 20
  })

  const debouncedOnQueryChange = useDebouncedCallback((query: string) => {
    search.onQueryChange(query)
  }, 150)

  useEffect(() => {
    const query = searchParams.get('searchQuery') || ''
    debouncedOnQueryChange(query)
  }, [searchParams, debouncedOnQueryChange])

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
    <div className='border border-border bg-surface'>
      <BlogFilters
        activeQuery={searchParams.get('searchQuery')}
        activeCategory={activeCategory}
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
