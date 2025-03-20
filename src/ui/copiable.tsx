'use client'

import { useClipboard } from '~/lib/hooks/use-clipboard'
import { cn } from '~/lib/utils/cn'
import { Button } from './button'
import { Checkmark } from './icons/checkmark'

export const Copiable = ({
	children,
	variant,
	content,
	size = 'md',
	className = ''
}: {
	children: React.ReactNode
	variant: 'default' | 'outline' | 'link'
	content: string
	size?: 'sm' | 'md' | 'lg'
	className?: string
}) => {
	const { copied, handleCopy } = useClipboard()

	return (
		<Button
			onClick={() => handleCopy(content)}
			variant={variant}
			size={size}
			className={cn(className, 'relative inline-flex')}
		>
			{children}
			{copied ? <Checkmark className="-top-0 -right-5 absolute size-4" /> : null}
		</Button>
	)
}
