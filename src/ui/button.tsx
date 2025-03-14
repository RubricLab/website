import { cn } from '~/lib/utils/cn'

const variants = {
	default:
		'dark:bg-white/10 bg-black/10 hover:dark:bg-white/40 hover:bg-black/40 rounded-full p-3 px-6',
	outline:
		'dark:border-white/10 border-black/10 hover:dark:border-white/40 hover:border-black/40 rounded-full p-3 px-6',
	link: 'hover:opacity-80'
}

export const Button = ({
	children,
	variant = 'default',
	type = 'button',
	className,
	onClick
}: {
	children: React.ReactNode
	type?: 'button' | 'submit' | 'reset'
	variant?: 'default' | 'outline' | 'link'
	onClick?: () => void
	className?: string
}) => {
	return (
		<button
			type={type}
			className={cn(
				'flex w-fit cursor-pointer items-center justify-center gap-2 text-sm transition-all',
				variants[variant],
				className
			)}
			onClick={onClick}
		>
			{children}
		</button>
	)
}
