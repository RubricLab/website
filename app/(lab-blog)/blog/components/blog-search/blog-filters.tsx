'use client'
import {Tag} from '@/common/ui/tag'
import {useMousetrap} from '@/hooks/use-mousetrap'
import {BlogCategory} from '@/lib/basehub/fragments/blog'
import clsx from 'clsx'
import {useSearchParams} from 'next/navigation'
import {useRef} from 'react'

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
  const searchInputRef = useRef<HTMLInputElement>()
  const searchParams = useSearchParams()

  const query = searchParams.get('searchQuery')
  const tag = searchParams.get('tag')

  useMousetrap([
    {
      keys: ['command+k', 'ctrl+k'],
      callback: () => {
        searchInputRef.current.focus()
      }
    }
  ])

  return (
    <div className='sticky top-header z-20 bg-surface'>
      <label
        className={clsx(
          'focus-within-ring transition-colors-shadow relative flex w-full cursor-text items-center border-b border-border pr-em-[72] pl-em-[24] py-em-[20]'
        )}>
        <input
          defaultValue={query}
          onChange={handleSearchChange}
          className='grow bg-transparent outline-0 placeholder:text-text-tertiary focus-visible:outline-none max-md:text-[max(1em,16px)]'
          placeholder='Search'
          type='text'
          ref={searchInputRef}
        />
        <Tag
          style={
            {
              // color: 'white',
              // borderColor: 'white',
              // boxShadow: '0 0 12px 1px rgb(255 255 255 / 0.6)',
              // transition: 'box-shadow 0.3s ease-in-out'
            }
          }
          size='sm'
          intent={query ? 'danger' : 'secondary'}
          onClick={clearQuery}
          className={`absolute hidden right-em-[24] md:block
            ${query ? 'cursor-pointer' : 'pointer-events-none'}`}>
          {query ? 'DELETE' : '⌘ + K'}
        </Tag>
      </label>
      <div className='flex items-start justify-between border-b border-border px-em-[24] py-em-[16] gap-em-[12]'>
        <div className='flex flex-wrap items-center gap-em-[12]'>
          <span className='text-text-tertiary'>Tags: </span>
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
              ? 'pointer-events-auto flex opacity-100'
              : 'pointer-events-none hidden opacity-10 grayscale'
          }`}
          intent='danger'>
          Clear
        </Tag>
      </div>
    </div>
  )
}
