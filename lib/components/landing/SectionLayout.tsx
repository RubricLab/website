import {ReactNode} from 'react'
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
				`flex min-h-screen w-full flex-col items-center justify-center gap-16 ${isAlternate ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-white dark:bg-black'} p-5 py-28 sm:px-10`,
				className
			)}>
			{children}
		</section>
	)
}
