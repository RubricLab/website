'use client'
import {Tag} from '@/common/ui/tag'
import {BlogCategory} from '@/lib/basehub/fragments/blog'
import {useRouter, useSearchParams} from 'next/navigation'

export default function TagsFilter({
  activeCategory,
  availableCategories
}: {
  activeCategory?: BlogCategory
  availableCategories: BlogCategory[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleRouteChange = (category: BlogCategory) => {
    const newSearchParams = new URLSearchParams(searchParams)

    category === activeCategory
      ? newSearchParams.delete('tag')
      : newSearchParams.set('tag', category)

    router.replace(`/blog?${newSearchParams.toString()}`, {
      scroll: false
    })
  }

  return (
    <div className='flex items-center border-b border-border px-em-[24] py-em-[16] gap-em-[12]'>
      <span className='uppercase text-text-tertiary'>Tags: </span>
      {availableCategories.map(category => (
        <Tag
          key={category}
          tabIndex={0}
          onClick={() => handleRouteChange(category)}
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
  )
}
