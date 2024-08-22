'use client'
import {Tag} from '@/common/ui/tag'
import {BlogCategory} from '@/lib/basehub/fragments/blog'
import clsx from 'clsx'

export type BlogFiltersProps = {
  handleCategoryChange: (category: BlogCategory) => void
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  activeCategory: BlogCategory | undefined
  availableCategories: BlogCategory[]
}

export default function BlogFilters({
  handleCategoryChange,
  handleSearchChange,
  activeCategory,
  availableCategories
}: BlogFiltersProps) {
  return (
    <div className='sticky top-header z-20 bg-surface'>
      <label
        className={clsx(
          'focus-within-ring transition-colors-shadow relative flex w-full cursor-text items-center border-b border-border pr-em-[72] pl-em-[24] py-em-[16] focus-within:ring'
        )}>
        <input
          onChange={handleSearchChange}
          className='grow bg-transparent uppercase !outline-none outline-0 placeholder:uppercase placeholder:text-text-tertiary focus-visible:outline-none'
          placeholder='Search'
          type='text'
        />
        <Tag
          size='sm'
          intent='secondary'
          className='absolute right-em-[16]'>
          {'⌘ + F'}
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
      </div>
    </div>
  )
}
