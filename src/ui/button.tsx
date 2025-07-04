import { cn } from '~/lib/utils/cn'

const variants = {
	default: 'bg-subtle dark:enabled:hover:bg-white/20 enabled:hover:bg-black/20 rounded-full',
	ghost: 'dark:enabled:hover:bg-white/20 enabled:hover:bg-black/20 rounded-full',
	icon:
		'focus:ring-0 !px-1.5 !py-1.5 rounded dark:enabled:hover:bg-white/20 enabled:hover:bg-black/20',
	link: 'text-secondary enabled:hover:text-primary focus:ring-0 !p-0',
	outline:
		'border-subtle border dark:enabled:hover:border-white/20 enabled:hover:border-black/20 rounded-full'
} as const

const sizes = {
	lg: 'p-4 px-8 text-base',
	md: 'p-3 px-6 text-sm',
	sm: 'p-2 px-4 text-xs'
} as const

export const Button = ({
	children,
	variant = 'default',
	type = 'button',
	size = 'md',
	className,
	onClick,
	disabled
}: {
	children: React.ReactNode
	type?: 'button' | 'submit' | 'reset'
	variant?: keyof typeof variants
	size?: keyof typeof sizes
	onClick?: () => void
	className?: string
	disabled?: boolean
}) => {
	return (
		<button
			type={type}
			className={cn(
				'flex w-fit cursor-pointer items-center justify-center gap-2 font-matter ring-secondary transition-all focus:outline-none focus:ring disabled:cursor-not-allowed',
				variants[variant],
				sizes[size],
				className
			)}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}
