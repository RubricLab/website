import {cva, type VariantProps} from 'class-variance-authority'
import {forwardRef} from 'react'

export const $tag = cva('flex border focus-ring transition-colors-shadow', {
	variants: {
		intent: {
			default: 'border-border text-text-secondary',
			secondary:
				'border-text-tertiary bg-surface-contrast/5 text-text-tertiary opacity-60',
			active: 'border-text text-text',
			danger: 'border-destructive bg-surface-contrast/5 text-destructive',

			contrast: 'border-text-contrast text-text-contrast'
		},
		disabled: {
			true: 'opacity-30'
		},
		size: {
			sm: 'text-em-[14/16] py-em-[2] px-em-[8]',
			md: 'text-em-[16/16] py-em-[3] px-em-[12]',
			lg: 'text-em-[18/16] py-em-[4] px-em-[16]'
		}
	}
})

export type TagProps<C extends keyof JSX.IntrinsicElements> = VariantProps<
	typeof $tag
> &
	JSX.IntrinsicElements[C]

export const Tag = forwardRef<HTMLButtonElement, TagProps<'button'>>(
	(
		{
			children,
			className,
			intent = 'default',
			disabled = false,
			size = 'md',
			...props
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				className={$tag({
					intent,
					disabled,
					size,
					className
				})}
				{...props}>
				{children}
			</button>
		)
	}
)

Tag.displayName = 'Tag'
