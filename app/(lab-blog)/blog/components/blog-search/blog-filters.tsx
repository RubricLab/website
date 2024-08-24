'use client'
import {Tag} from '@/common/ui/tag'
import {BlogCategory} from '@/lib/basehub/fragments/blog'
import clsx from 'clsx'
import {useSearchParams} from 'next/navigation'

export type BlogFiltersProps = {
  handleCategoryChange: (category: BlogCategory) => void
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  clearQuery: () => void
  availableCategories: BlogCategory[]
}

export default function BlogFilters({
  handleCategoryChange,
  handleSearchChange,
  clearQuery,
  availableCategories
}: BlogFiltersProps) {
  const searchParams = useSearchParams()

  const query = searchParams.get('searchQuery')
  const tag = searchParams.get('tag')

  return (
    <div className='sticky top-header z-20 bg-surface'>
      <label
        className={clsx(
          'focus-within-ring transition-colors-shadow relative flex w-full cursor-text items-center border-b border-border pr-em-[72] pl-em-[24] py-em-[20] focus-within:ring'
        )}>
        <input
          defaultValue={query}
          onChange={handleSearchChange}
          className='grow bg-transparent uppercase !outline-none outline-0 placeholder:uppercase placeholder:text-text-tertiary focus-visible:outline-none'
          placeholder='Search'
          type='text'
        />
        <Tag
          size='sm'
          intent={query ? 'danger' : 'secondary'}
          onClick={clearQuery}
          className={`absolute right-em-[24]
            ${query ? 'cursor-pointer' : 'pointer-events-none'}`}>
          {query ? 'DELETE' : '⌘ + K'}
        </Tag>
      </label>
      <div className='flex items-start border-b border-border px-em-[24] py-em-[16] gap-em-[12]'>
        <div className='flex flex-wrap items-center gap-em-[12]'>
          <span className='uppercase text-text-tertiary'>Tags: </span>
          {availableCategories.map(category => (
            <Tag
              key={category}
              tabIndex={0}
              onClick={() => handleCategoryChange(category)}
              className='cursor-pointer'
              intent={
                !tag ? 'default' : category === tag ? 'active' : 'secondary'
              }>
              {category}
            </Tag>
          ))}
        </div>
        <Tag
          tabIndex={tag ? 0 : undefined}
          onClick={() => handleCategoryChange(null)}
          className={`cursor-pointer transition-[opacity,filter] ${
            tag
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-10 grayscale'
          }`}
          intent='danger'>
          Clear
        </Tag>
      </div>
    </div>
  )
}
