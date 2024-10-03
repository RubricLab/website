import type { ReactNode } from 'react'
import cn from '~/utils/cn'

export default function SectionLayout({
	children,
	id,
	isAlternate = false,
	className
}: {
	children: ReactNode
	id?: string
	isAlternate?: boolean
	className?: string
}) {
	return (
		<section
			id={id}
			className={cn(
				`flex min-h-screen w-full flex-col items-center justify-center gap-16 ${isAlternate ? 'bg-gradient-to-b from-neutral-100 to-white dark:from-neutral-900 dark:to-black' : 'bg-gradient-to-b from-white to-neutral-100 dark:from-black dark:to-neutral-900'} p-5 py-28 sm:px-10`,
				className
			)}
		>
			{children}
		</section>
	)
}
