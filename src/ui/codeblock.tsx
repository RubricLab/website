'use client'

import { useRef } from 'react'
import { Button } from './button'
import { Checkmark } from './icons/checkmark'
import { Copy } from './icons/copy'
import { useClipboard } from '~/lib/hooks/use-clipboard'

export const CodeBlock = ({ children, ...props }: { children: React.ReactElement }) => {
	const { copied, handleCopy } = useClipboard()
	const preRef = useRef<HTMLPreElement>(null)

	return (
		<div className="group relative">
			<pre ref={preRef} {...props}>
				{children}
			</pre>
			<Button
				className="absolute top-2 right-2 w-fit text-center opacity-0 transition-opacity group-hover:opacity-100"
				variant="link"
				size="sm"
				onClick={() => handleCopy(preRef.current?.textContent || 'Code not found')}
			>
				{copied ? <Checkmark className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			</Button>
		</div>
	)
}
