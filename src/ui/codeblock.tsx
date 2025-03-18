'use client'

import { useState } from 'react'
import { TIMEOUT } from '~/lib/constants'
import { Button } from './button'
import { Checkmark } from './icons/checkmark'
import { Copy } from './icons/copy'

export const CodeBlock = ({ children }: { children: React.ReactElement }) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		if (!('clipboard' in navigator)) {
			alert('Clipboard is not supported on this browser')
			return
		}

		navigator.clipboard.writeText((children.props as { children: string }).children)
		setCopied(true)

		setTimeout(() => setCopied(false), TIMEOUT)
	}

	return (
		<pre className="relative">
			{children}
			<Button
				className="absolute top-2 right-2 w-fit text-center"
				variant="link"
				size="sm"
				onClick={handleCopy}
			>
				{copied ? <Checkmark className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			</Button>
		</pre>
	)
}
