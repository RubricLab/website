'use client'

import { useClipboard } from '~/lib/hooks/use-clipboard'
import { Button } from './button'

export const Copiable = ({
	children,
	variant,
	content
}: { children: React.ReactNode; variant: 'default' | 'outline' | 'link'; content: string }) => {
	const { copied, handleCopy } = useClipboard()

	return (
		<Button onClick={() => handleCopy(content)} variant={variant}>
			{copied ? <span>Copied</span> : <span>{children}</span>}
		</Button>
	)
}
