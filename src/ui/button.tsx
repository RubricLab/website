import { cn } from '~/lib/utils/cn'

const variants = {
	default: 'dark:bg-white/10 bg-black/10 hover:dark:bg-white/30 hover:bg-black/30 rounded-full',
	outline:
		'dark:border-white/10 border-black/10 hover:dark:border-white/40 hover:border-black/40 rounded-full',
	link: 'hover:opacity-80 focus:ring-0 !p-0'
} as const

const sizes = {
	sm: 'p-2 px-4 text-xs',
	md: 'p-3 px-6 text-sm',
	lg: 'p-4 px-8 text-base'
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
				'flex w-fit cursor-pointer items-center justify-center gap-2 font-sans ring-secondary transition-all focus:outline-none focus:ring',
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
