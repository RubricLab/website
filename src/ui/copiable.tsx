'use client'

import { useState } from 'react'
import { Button } from './button'
import { TIMEOUT } from '~/lib/constants'

export const Copiable = ({
	children,
	variant,
	content
}: { children: React.ReactNode; variant: 'default' | 'outline' | 'link'; content: string }) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		if (!('clipboard' in navigator)) {
			alert('Clipboard is not supported on this browser')
			return
		}

		navigator.clipboard.writeText(content)

		setCopied(true)

		setTimeout(() => {
			setCopied(false)
		}, TIMEOUT)
	}

	return (
		<Button onClick={handleCopy} variant={variant}>
			{copied ? <span>Copied</span> : <span>{children}</span>}
		</Button>
	)
}
