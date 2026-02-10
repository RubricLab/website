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
				'flex w-full flex-col gap-3 rounded-custom border border-subtle bg-subtle/20 px-6 py-4 dark:bg-subtle/70',
				className
			)}
		>
			<button
				type="button"
				className="flex w-full items-center justify-between gap-4 text-left focus:outline-none"
				onClick={() => setOpen(prev => !prev)}
			>
				<span className="text-base text-primary">{title}</span>
				<Chevron
					className={cn('size-4 text-secondary transition-transform', open ? 'rotate-180' : '')}
				/>
			</button>
			{open ? <div className="text-secondary">{children}</div> : null}
		</div>
	)
}
