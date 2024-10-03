import clsx from 'clsx'
import type React from 'react'
import { TooltipProvider } from './tooltip'

export function AvatarsGroup({
	className,
	children,
	animate = false,
	...props
}: React.HTMLAttributes<HTMLImageElement> & { animate?: boolean }) {
	if (animate)
		return (
			<TooltipProvider delayDuration={50}>
				<div
					className={clsx('-space-x-3 flex hover:space-x-0.5 rtl:space-x-reverse', className)}
					{...props}
				>
					{children}
				</div>
			</TooltipProvider>
		)

	return (
		<div className={clsx('-space-x-3 flex rtl:space-x-reverse', className)} {...props}>
			{children}
		</div>
	)
}
