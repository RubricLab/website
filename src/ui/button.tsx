import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils/cn'

export const buttonVariants = cva(
	'inline-flex items-center cursor-pointer justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-subtle dark:enabled:hover:bg-white/20 enabled:hover:bg-black/20 rounded-full',
				outline:
					'border-subtle dark:enabled:hover:border-white/40 enabled:hover:border-black/40 rounded-full',
				link: 'enabled:hover:opacity-80 focus:ring-0 !p-0',
				icon: 'focus:ring-0 !p-1 rounded dark:enabled:hover:bg-white/20 enabled:hover:bg-black/20'
			},
			size: {
				sm: 'p-2 px-4 text-xs',
				md: 'p-3 px-6 text-sm',
				lg: 'p-4 px-8 text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
)

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
	variant?: 'default' | 'outline' | 'link' | 'icon'
	size?: 'sm' | 'md' | 'lg'
	onClick?: () => void
	className?: string
	disabled?: boolean
}) => {
	return (
		<button
			type={type}
			className={cn(buttonVariants({ variant, size }), className)}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}
