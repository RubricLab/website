'use client'

import { useMemo, useState } from 'react'
import { cn } from '~/lib/utils/cn'
import type { TocItem } from '~/lib/utils/posts'
import { Chevron } from './icons/chevron'

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
		<div
			className={cn(
				'flex flex-col rounded-custom border border-subtle bg-subtle/20 px-5 py-4 transition-height dark:bg-subtle/70',
				open ? 'gap-3' : 'gap-0'
			)}
		>
			<button
				type="button"
				className="flex w-full items-center justify-between gap-4 text-left focus:outline-none"
				aria-expanded={open}
				onClick={() => setOpen(prev => !prev)}
			>
				<p className="text-base text-primary">Table of Contents</p>
				<Chevron
					className={cn('size-4 text-secondary transition-transform', open ? 'rotate-180' : '')}
				/>
			</button>
			<div
				className="grid min-h-0 transition-[grid-template-rows] duration-300 ease-in-out"
				style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
			>
				<div className="min-h-0 overflow-hidden">
					<ul className="mt-3 space-y-2 p-0">
						{visibleItems.map(item => (
							<li key={item.id} className={cn('list-none text-sm', item.level === 3 ? 'pl-6' : '')}>
								<a href={`#${item.id}`} className="flex items-start gap-3 no-underline hover:underline">
									<span className="leading-6">{item.title}</span>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}
