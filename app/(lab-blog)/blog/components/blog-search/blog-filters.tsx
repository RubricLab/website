'use client'
import {Tag} from '@/common/ui/tag'
import {BlogCategory} from '@/lib/basehub/fragments/blog'
import clsx from 'clsx'

export type BlogFiltersProps = {
  activeQuery: string
  handleCategoryChange: (category: BlogCategory) => void
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  clearQuery: () => void
  activeCategory: BlogCategory | undefined
  availableCategories: BlogCategory[]
}

export default function BlogFilters({
  activeQuery,
  handleCategoryChange,
  handleSearchChange,
  clearQuery,
  activeCategory,
  availableCategories
}: BlogFiltersProps) {
  return (
    <div className='sticky top-header z-20 bg-surface'>
      <label
        className={clsx(
          'focus-within-ring transition-colors-shadow relative flex w-full cursor-text items-center border-b border-border pr-em-[72] pl-em-[24] py-em-[20] focus-within:ring'
        )}>
        <input
          onChange={handleSearchChange}
          className='grow bg-transparent uppercase !outline-none outline-0 placeholder:uppercase placeholder:text-text-tertiary focus-visible:outline-none'
          placeholder='Search'
          type='text'
        />
        <Tag
          size='sm'
          intent={activeQuery ? 'danger' : 'secondary'}
          onClick={clearQuery}
          className={`absolute right-em-[24]
            ${activeQuery ? 'cursor-pointer' : 'pointer-events-none'}`}>
          {activeQuery ? 'DELETE' : '⌘ + F'}
        </Tag>
      </label>
      <div className='flex items-center border-b border-border px-em-[24] py-em-[16] gap-em-[12]'>
        <span className='uppercase text-text-tertiary'>Tags: </span>
        {availableCategories.map(category => (
          <Tag
            key={category}
            tabIndex={0}
            onClick={() => handleCategoryChange(category)}
            className='cursor-pointer'
            intent={
              !activeCategory
                ? 'default'
                : category === activeCategory
                  ? 'active'
                  : 'secondary'
            }>
            {category}
          </Tag>
        ))}
        <Tag
          tabIndex={activeCategory ? 0 : undefined}
          onClick={() => handleCategoryChange(null)}
          className={`ml-auto cursor-pointer transition-[opacity,filter] ${
            activeCategory
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
