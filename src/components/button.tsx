import { Slot, Slottable } from '@radix-ui/react-slot'
import * as React from 'react'
import { cn } from '~/lib/utils/cn'

type ButtonIntent = 'primary' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	intent?: ButtonIntent
	size?: ButtonSize
	leadingIcon?: React.ReactElement
	trailingIcon?: React.ReactElement
	iconOnly?: boolean
	loading?: boolean
	fullWidth?: boolean
	asChild?: boolean
	children?: React.ReactNode
}

const INTENT: Record<ButtonIntent, string> = {
	primary:
		'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[var(--color-primary-foreground)] after:opacity-0 after:transition-opacity after:duration-[var(--duration-normal)] after:ease-[var(--easing-out)] [&:not([data-disabled])]:hover:after:opacity-[0.08] [&:not([data-disabled])]:active:after:opacity-[0.14] data-[disabled]:bg-[var(--color-disabled-surface)] data-[disabled]:text-[var(--color-disabled-foreground)]',
	secondary:
		'bg-[var(--color-surface-raised)] text-[var(--color-primary)] border border-[var(--color-border-hairline)] [&:not([data-disabled])]:hover:bg-[var(--color-surface-raised-hover)] [&:not([data-disabled])]:hover:border-[var(--color-border-strong)] data-[disabled]:text-[var(--color-disabled-foreground)] data-[disabled]:opacity-60',
	ghost:
		'bg-transparent text-[var(--color-primary)] [&:not([data-disabled])]:hover:bg-[var(--color-surface-ghost-hover)] [&:not([data-disabled])]:active:bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] data-[disabled]:text-[var(--color-disabled-foreground)] data-[disabled]:opacity-60',
	link: 'bg-transparent text-[var(--color-secondary)] [&:not([data-disabled])]:hover:text-[var(--color-primary)] data-[disabled]:text-[var(--color-disabled-foreground)] data-[disabled]:opacity-60'
}

const SIZE: Record<ButtonSize, { base: string; pad: string; sq: string; sqPad: string }> = {
	xs: { base: 'h-6 [font-size:var(--text-label-xs)] [&_[data-slot=icon]]:size-[14px] [&_[data-slot=trailing-icon]]:size-[14px]', pad: 'px-[var(--space-button-x-xs)] py-[var(--space-button-y-xs)]', sq: 'size-6', sqPad: 'p-[var(--space-button-y-xs)]' },
	sm: { base: 'h-7 [font-size:var(--text-label-sm)] [&_[data-slot=icon]]:size-[14px] [&_[data-slot=trailing-icon]]:size-[14px]', pad: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)]', sq: 'size-7', sqPad: 'p-[var(--space-button-y-sm)]' },
	md: { base: 'h-8 [font-size:var(--text-label-md)] [&_[data-slot=icon]]:size-4 [&_[data-slot=trailing-icon]]:size-4', pad: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)]', sq: 'size-8', sqPad: 'p-[var(--space-button-y-md)]' },
	lg: { base: 'h-10 [font-size:var(--text-label-lg)] [&_[data-slot=icon]]:size-4 [&_[data-slot=trailing-icon]]:size-4', pad: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)]', sq: 'size-10', sqPad: 'p-[var(--space-button-y-lg)]' }
}

const Spinner = () => (
	<svg data-slot="spinner" viewBox="0 0 16 16" fill="none" aria-hidden className="absolute z-10 animate-[button-spinner_1s_linear_infinite] motion-reduce:animate-[button-spinner-blink_1s_ease-in-out_infinite]">
		<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
		<path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
)

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ intent = 'secondary', size = 'md', leadingIcon, trailingIcon, iconOnly = false, loading = false, fullWidth = false, asChild = false, className, children, disabled, type = 'button', ...rest },
	ref
) {
	if (process.env.NODE_ENV !== 'production' && iconOnly && !rest['aria-label'])
		console.error('[Button] iconOnly=true requires an aria-label prop.')
	const Comp: React.ElementType = asChild ? Slot : 'button'
	const blocked = disabled || loading
	const s = SIZE[size]
	const clone = (el: React.ReactElement | undefined, slot: string, cls?: string) =>
		el ? React.cloneElement(el as React.ReactElement<{ 'data-slot'?: string; 'aria-hidden'?: boolean; className?: string }>, { 'data-slot': slot, 'aria-hidden': true, className: cn(cls, (el.props as { className?: string }).className) }) : null
	return (
		<Comp
			ref={ref}
			type={asChild ? undefined : type}
			disabled={asChild ? undefined : blocked}
			aria-disabled={asChild && blocked ? true : undefined}
			aria-busy={loading || undefined}
			data-intent={intent}
			data-disabled={blocked ? '' : undefined}
			data-loading={loading ? '' : undefined}
			className={cn(
				'group relative inline-flex cursor-pointer select-none items-center justify-center gap-[var(--space-button-gap)] rounded-[var(--radius-control)] font-sans font-normal leading-none whitespace-nowrap outline-none transition-[background-color,border-color,color,opacity] duration-[var(--duration-normal)] ease-[var(--easing-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 focus-visible:transition-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed aria-busy:cursor-wait',
				s.base,
				iconOnly ? cn(s.sq, s.sqPad) : s.pad,
				INTENT[intent],
				fullWidth && 'w-full',
				className
			)}
			{...rest}
		>
			{clone(leadingIcon, 'icon', 'relative z-10 group-data-[loading]:opacity-0')}
			{loading && <Spinner />}
			<Slottable>
				{asChild ? children : loading ? <span className="sr-only">{children}</span> : iconOnly ? children : <span className="relative z-10">{children}</span>}
			</Slottable>
			{clone(trailingIcon, 'trailing-icon', 'relative z-10 transition-transform duration-[var(--duration-fast)] ease-[var(--easing-out)] motion-reduce:!translate-x-0 motion-reduce:!transition-none group-hover:[&:not([data-no-nudge])]:translate-x-[2px] group-data-[loading]:opacity-0')}
		</Comp>
	)
})
Button.displayName = 'Button'
