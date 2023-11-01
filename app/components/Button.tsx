'use client'
import {ArrowRight} from 'lucide-react'
import Link from 'next/link'
import {cn} from '../../lib/utils'

const variants = {
	dark: 'border-2 border-black border-opacity-20 bg-[#151617] text-white',
	light: 'bg-neutral-100 text-black',
	teal: 'bg-teal text-black'
}

export default function Button({
	body,
	variant,
	href,
	onClick,
	className,
	disabled
}: {
	body: string
	variant: 'dark' | 'light' | 'teal'
	href?: string
	onClick?: () => void
	className?: string
	disabled?: boolean
}) {
	// Link
	if (href)
		return (
			<Link
				className={cn(
					`group flex w-full items-center justify-between gap-20 rounded-md no-underline ${variants[variant]} px-4 py-2`,
					className
				)}
				href={href}>
				<span className='mt-[3px] font-neue-bit text-2xl'>{body}</span>
				<ArrowRight className='transition-all duration-300 group-hover:translate-x-1.5' />
			</Link>
		)
	if (onClick)
		return (
			<button
				disabled={disabled}
				onClick={onClick}
				className={cn(
					`group flex w-full items-center justify-between gap-20 rounded-md ${variants[variant]} px-4 py-2`,
					className
				)}>
				<span className='font-neue-bit text-2xl'>{body}</span>
				<ArrowRight className='transition-all duration-300 group-hover:translate-x-1.5' />
			</button>
		)
}
