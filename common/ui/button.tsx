import cn from '@/lib/utils/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
	'inline-flex items-center font-mono justify-center whitespace-nowrap font-medium focus-ring transition-colors-shadow disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-surface-contrast text-text-contrast hover:bg-surface-contrast/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-surface-contrast/5 text-text-secondary hover:text-text border border-border hover:bg-surface-contrast/10',
				ghost: 'text-text-secondary hover:text-text hover:bg-surface-contrast/5',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				sm: 'py-em-[4/14] px-em-[12/14] text-em-[14/16]',
				md: 'py-em-[12/12] px-em-[16/12] text-em-[12/16]',
				lg: 'py-em-[16/14] px-em-[18/14] text-em-[14/16]'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
	}
)

Button.displayName = 'Button'

export { Button, buttonVariants }
