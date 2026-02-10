'use client'

import { useState } from 'react'
import { cn } from '~/lib/utils/cn'
import { Chevron } from '~/ui/icons/chevron'

export const Collapsible = ({
	title,
	defaultOpen = false,
	children,
	className
}: {
	title: React.ReactNode
	defaultOpen?: boolean
	children: React.ReactNode
	className?: string
}) => {
	const [open, setOpen] = useState(defaultOpen)

	return (
		<div
			className={cn(
				'flex w-full flex-col rounded-custom border border-subtle bg-subtle/20 px-6 py-4 transition-height dark:bg-subtle/70',
				open ? 'gap-3' : 'gap-0',
				className
			)}
		>
			<button
				type="button"
				className="flex w-full items-center justify-between gap-4 text-left focus:outline-none"
				aria-expanded={open}
				onClick={() => setOpen(prev => !prev)}
			>
				<span className="text-base text-primary">{title}</span>
				<Chevron
					className={cn('size-4 text-secondary transition-transform', open ? 'rotate-180' : '')}
				/>
			</button>
			<div
				className="grid min-h-0 transition-[grid-template-rows] duration-300 ease-in-out"
				style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
			>
				<div className="min-h-0 overflow-hidden">
					<div className="text-secondary">{children}</div>
				</div>
			</div>
		</div>
	)
}
