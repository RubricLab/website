'use client'

import { useRef } from 'react'
import { useClipboard } from '~/lib/hooks/use-clipboard'
import { Button } from './button'
import { Checkmark } from './icons/checkmark'
import { Copy } from './icons/copy'

export const CodeBlock = ({ children, ...props }: { children: React.ReactElement }) => {
	const { copied, handleCopy } = useClipboard()
	const preRef = useRef<HTMLPreElement>(null)

	return (
		<div className="group relative">
			<pre ref={preRef} {...props}>
				{children}
			</pre>
			<Button
				className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
				variant="icon"
				size="sm"
				onClick={() => handleCopy(preRef.current?.textContent || 'Code not found')}
			>
				{copied ? <Checkmark className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			</Button>
		</div>
	)
}
