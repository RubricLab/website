'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { cn } from '~/lib/utils/cn'
import { Button } from './button'

export const Copiable = ({
	children,
	intent,
	content,
	size,
	className = '',
	message = 'Copied'
}: {
	children: React.ReactNode
	intent: 'primary' | 'secondary' | 'ghost' | 'link'
	content: string
	size?: 'xs' | 'sm' | 'md' | 'lg'
	className?: string
	message?: string
}) => {
	// Inline link defaults to xs to avoid prose whitespace orphans; other intents default to md.
	const resolvedSize = size ?? (intent === 'link' ? 'xs' : 'md')
	const { copied, handleCopy } = useClipboard()

	useEffect(() => {
		if (copied) toast.success(message)
	}, [copied, message])

	return (
		<Button
			onClick={() => handleCopy(content)}
			intent={intent}
			size={resolvedSize}
			className={cn(className, 'relative inline-flex')}
		>
			{children}
		</Button>
	)
}
