'use client'

import { useClipboard } from '~/lib/hooks/use-clipboard'
import { Button } from './button'
import { cn } from '~/lib/utils/cn'
import { Checkmark } from './icons/checkmark'

export const Copiable = ({
	children,
	variant,
	content,
	className = ''
}: {
	children: React.ReactNode
	variant: 'default' | 'outline' | 'link'
	content: string
	className?: string
}) => {
	const { copied, handleCopy } = useClipboard()

	return (
		<Button
			onClick={() => handleCopy(content)}
			variant={variant}
			className={cn(className, 'relative')}
		>
			{children}
			{copied ? <Checkmark className="-top-0 -right-5 absolute size-4" /> : null}
		</Button>
	)
}
