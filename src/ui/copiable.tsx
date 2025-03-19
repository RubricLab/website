'use client'

import { useState } from 'react'
import { TIMEOUT } from '~/lib/constants'
import { copy } from '~/lib/utils/copy'
import { Button } from './button'

export const Copiable = ({
	children,
	variant,
	content
}: { children: React.ReactNode; variant: 'default' | 'outline' | 'link'; content: string }) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		copy(content)
		setCopied(true)
		setTimeout(() => setCopied(false), TIMEOUT)
	}

	return (
		<Button onClick={handleCopy} variant={variant}>
			{copied ? <span>Copied</span> : <span>{children}</span>}
		</Button>
	)
}
