'use client'

import { useMemo, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import type { TocItem } from '~/lib/utils/posts'
import { Arrow } from '~/ui/icons/arrow'

export const TableOfContents = ({
	items,
	defaultOpen = true
}: {
	items: TocItem[]
	defaultOpen?: boolean
}) => {
	const [open, setOpen] = useState(defaultOpen)

	const visibleItems = useMemo(
		() => items.filter(item => item.level >= 2 && item.level <= 3),
		[items]
	)
	if (visibleItems.length === 0) return null

	return (
		<div className="flex flex-col gap-4 rounded-custom border border-subtle bg-subtle/20 px-5 py-4 dark:bg-subtle/80">
			<button
				type="button"
				className="flex w-full items-center justify-between gap-4 text-left focus:outline-none"
				onClick={() => setOpen(prev => !prev)}
			>
				<p className="text-base text-primary">Table of Contents</p>
				<Arrow
					className={cn('size-4 text-secondary transition-transform', open ? 'rotate-90' : '-rotate-90')}
				/>
			</button>
			{open ? (
				<ul className="space-y-2 p-0">
					{visibleItems.map(item => (
						<li key={item.id} className={cn('list-none text-sm', item.level === 3 ? 'pl-6' : 'pl-2')}>
							<a href={`#${item.id}`} className="flex items-start gap-3 no-underline hover:underline">
								<span className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-secondary/60" />
								<span className="leading-6">{item.title}</span>
							</a>
						</li>
					))}
				</ul>
			) : null}
		</div>
	)
}
