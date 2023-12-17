'use client'
import {ArrowRight} from 'lucide-react'
import Link from 'next/link'
import cn from '~/utils/cn'

const variants = {
	dark: 'bg-black dark:bg-white text-negative',
	light: 'bg-neutral-100 dark:bg-neutral-900 text-primary',
	teal: 'bg-teal text-black'
}

export default function Button({
	body,
	variant,
	href,
	onClick,
	className,
	disabled,
	type
}: {
	body: string
	variant: 'dark' | 'light' | 'teal'
	href?: string
	onClick?: () => void
	className?: string
	disabled?: boolean
	type?: 'button' | 'submit' | 'reset'
}) {
	// Link
	if (href)
		return (
			<Link
				className={cn(
					`group flex w-full items-center justify-between gap-20 rounded-md px-4 py-2 no-underline`,
					variants[variant],
					className
				)}
				href={href}>
				<span className='mt-[3px] font-neue-bit text-2xl'>{body}</span>
				<ArrowRight className='transition-all duration-300 group-hover:translate-x-1.5' />
			</Link>
		)
	// Button
	if (onClick || type === 'submit')
		return (
			<button
				className={cn(
					`group flex w-full items-center justify-between gap-20 rounded-md px-4 py-2 disabled:cursor-not-allowed`,
					variants[variant],
					className
				)}
				disabled={disabled}
				onClick={onClick}
				type={type}>
				<span className='mt-[3px] font-neue-bit text-2xl'>{body}</span>
				<ArrowRight className='transition-all duration-300 group-hover:translate-x-1.5 group-disabled:translate-x-0' />
			</button>
		)
}
