'use client'

import { Button } from './button'
import { Checkmark } from './icons/checkmark'
import { Copy } from './icons/copy'
import { useClipboard } from '~/lib/hooks/use-clipboard'

export const CodeBlock = ({ children }: { children: React.ReactElement }) => {
	const { copied, handleCopy } = useClipboard()

	return (
		<pre className="relative">
			{children}
			<Button
				className="absolute top-2 right-2 w-fit text-center"
				variant="link"
				size="sm"
				onClick={() => handleCopy((children.props as { children: string }).children)}
			>
				{copied ? <Checkmark className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			</Button>
		</pre>
	)
}
