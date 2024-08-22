'use client'
import {BlogCategory, BlogPostCard} from '@/lib/basehub/fragments/blog'
import {UseSearchResult, useSearch} from 'basehub/react-search'
import {useRouter, useSearchParams} from 'next/navigation'
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    search.onQueryChange(event.target.value)
  }

  const handleCategoryChange = (category: BlogCategory) => {
    const newSearchParams = new URLSearchParams(searchParams)

    category === activeCategory
      ? newSearchParams.delete('tag')
      : newSearchParams.set('tag', category)

    router.replace(`/blog?${newSearchParams.toString()}`, {
      scroll: false
    })
  }

  console.log(search)

  return (
    <div className='border border-border bg-surface'>
      <BlogFilters
        activeCategory={activeCategory}
        availableCategories={availableCategories}
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
